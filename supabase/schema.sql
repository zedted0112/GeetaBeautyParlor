create table if not exists public.reaction_votes (
  photo_id text not null,
  visitor_id text not null,
  kind text not null check (kind in ('fire', 'heart', 'wow', 'eyes')),
  updated_at timestamptz not null default now(),
  primary key (photo_id, visitor_id)
);

create index if not exists reaction_votes_photo_idx on public.reaction_votes (photo_id);

alter table public.reaction_votes enable row level security;

drop policy if exists "public read votes" on public.reaction_votes;
drop policy if exists "public insert votes" on public.reaction_votes;
drop policy if exists "public update votes" on public.reaction_votes;
drop policy if exists "public delete votes" on public.reaction_votes;

create policy "public read votes"
  on public.reaction_votes for select
  to anon, authenticated
  using (true);

create policy "public insert votes"
  on public.reaction_votes for insert
  to anon, authenticated
  with check (kind in ('fire', 'heart', 'wow', 'eyes'));

create policy "public update votes"
  on public.reaction_votes for update
  to anon, authenticated
  using (true)
  with check (kind in ('fire', 'heart', 'wow', 'eyes'));

create policy "public delete votes"
  on public.reaction_votes for delete
  to anon, authenticated
  using (true);

grant select, insert, update, delete on public.reaction_votes to anon, authenticated;

alter table public.reaction_votes replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.reaction_votes;
exception
  when duplicate_object then null;
end $$;

create table if not exists public.parlor_profiles (
  visitor_id text primary key,
  name text not null check (char_length(trim(name)) between 2 and 24),
  avatar text not null,
  role text not null check (role in ('client', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.parlor_profiles enable row level security;

drop policy if exists "public read parlor profiles" on public.parlor_profiles;
drop policy if exists "public upsert parlor profiles" on public.parlor_profiles;
drop policy if exists "public update parlor profiles" on public.parlor_profiles;

create policy "public read parlor profiles"
  on public.parlor_profiles for select
  to anon, authenticated
  using (true);

create policy "public upsert parlor profiles"
  on public.parlor_profiles for insert
  to anon, authenticated
  with check (role in ('client', 'customer') and char_length(trim(name)) between 2 and 24);

create policy "public update parlor profiles"
  on public.parlor_profiles for update
  to anon, authenticated
  using (true)
  with check (role in ('client', 'customer') and char_length(trim(name)) between 2 and 24);

grant select, insert, update on public.parlor_profiles to anon, authenticated;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.parlor_logins (
  visitor_id text primary key references public.parlor_profiles (visitor_id) on delete cascade,
  pin_hash text not null,
  updated_at timestamptz not null default now()
);

alter table public.parlor_logins enable row level security;
revoke all on public.parlor_logins from anon, authenticated, public;

create or replace function public.parlor_set_pin(p_visitor_id text, p_pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_pin is null or p_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be 4 digits';
  end if;
  if not exists (select 1 from public.parlor_profiles where visitor_id = p_visitor_id) then
    raise exception 'Join the parlor first';
  end if;
  insert into public.parlor_logins (visitor_id, pin_hash, updated_at)
  values (p_visitor_id, crypt(p_pin, gen_salt('bf')), now())
  on conflict (visitor_id) do update
    set pin_hash = excluded.pin_hash,
        updated_at = now();
end;
$$;

create or replace function public.parlor_login(p_name text, p_pin text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  row_profile public.parlor_profiles%rowtype;
begin
  if p_pin is null or p_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be 4 digits';
  end if;

  select p.*
  into row_profile
  from public.parlor_profiles p
  join public.parlor_logins l on l.visitor_id = p.visitor_id
  where lower(trim(p.name)) = lower(trim(p_name))
    and l.pin_hash = crypt(p_pin, l.pin_hash)
  order by p.updated_at desc
  limit 1;

  if not found then
    raise exception 'Name or PIN does not match';
  end if;

  return jsonb_build_object(
    'visitor_id', row_profile.visitor_id,
    'name', row_profile.name,
    'avatar', row_profile.avatar,
    'role', row_profile.role
  );
end;
$$;

grant execute on function public.parlor_set_pin(text, text) to anon, authenticated;
grant execute on function public.parlor_login(text, text) to anon, authenticated;
