create table if not exists public.reaction_votes (
  photo_id text not null,
  visitor_id text not null,
  kind text not null check (kind in ('fire', 'heart', 'wow', 'eyes')),
  hits integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key (photo_id, visitor_id, kind)
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

do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid = 'public.parlor_messages'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%kind%'
  loop
    execute format('alter table public.parlor_messages drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.parlor_messages
  add column if not exists parent_id uuid;

alter table public.parlor_messages
  add constraint parlor_messages_kind_check
  check (kind in ('book', 'look', 'reel', 'chat', 'reply'));

create index if not exists parlor_messages_parent_idx on public.parlor_messages (parent_id);

drop policy if exists "public insert parlor messages" on public.parlor_messages;

create policy "public insert parlor messages"
  on public.parlor_messages for insert
  to anon, authenticated
  with check (kind in ('book', 'look', 'reel', 'chat', 'reply') and char_length(trim(from_name)) between 2 and 24);


create table if not exists public.parlor_visits (
  id uuid primary key,
  visitor_id text not null,
  service text not null,
  visit_on date not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists parlor_visits_visitor_idx on public.parlor_visits (visitor_id);

alter table public.parlor_visits enable row level security;

drop policy if exists "public read parlor visits" on public.parlor_visits;
drop policy if exists "public insert parlor visits" on public.parlor_visits;

create policy "public read parlor visits"
  on public.parlor_visits for select
  to anon, authenticated
  using (true);

create policy "public insert parlor visits"
  on public.parlor_visits for insert
  to anon, authenticated
  with check (char_length(trim(service)) between 1 and 80);

grant select, insert on public.parlor_visits to anon, authenticated;

do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid = 'public.parlor_profiles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.parlor_profiles drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.parlor_profiles
  add constraint parlor_profiles_role_check
  check (role in ('client', 'customer', 'admin'));

create table if not exists public.parlor_messages (
  id uuid primary key,
  from_visitor_id text not null,
  from_name text not null,
  from_avatar text not null default 'lotus',
  kind text not null check (kind in ('book', 'look', 'reel', 'chat')),
  ref_id text not null default '',
  visit_on date,
  service text not null default '',
  body text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists parlor_messages_created_idx on public.parlor_messages (created_at desc);

alter table public.parlor_messages enable row level security;

drop policy if exists "public read parlor messages" on public.parlor_messages;
drop policy if exists "public insert parlor messages" on public.parlor_messages;

create policy "public read parlor messages"
  on public.parlor_messages for select
  to anon, authenticated
  using (true);

create policy "public insert parlor messages"
  on public.parlor_messages for insert
  to anon, authenticated
  with check (kind in ('book', 'look', 'reel', 'chat') and char_length(trim(from_name)) between 2 and 24);

grant select, insert on public.parlor_messages to anon, authenticated;

create or replace function public.parlor_seed_geeta()
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  insert into public.parlor_profiles (visitor_id, name, avatar, role, updated_at)
  values ('geeta-admin', 'Geeta', 'bloom', 'admin', now())
  on conflict (visitor_id) do update
    set name = 'Geeta',
        avatar = excluded.avatar,
        role = 'admin',
        updated_at = now();

  insert into public.parlor_logins (visitor_id, pin_hash, updated_at)
  values ('geeta-admin', crypt('1472', gen_salt('bf')), now())
  on conflict (visitor_id) do nothing;
end;
$$;

grant execute on function public.parlor_seed_geeta() to anon, authenticated;

select public.parlor_seed_geeta();

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
  order by (p.role = 'admin') desc, p.updated_at desc
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

do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid = 'public.parlor_messages'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%kind%'
  loop
    execute format('alter table public.parlor_messages drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.parlor_messages
  add column if not exists parent_id uuid;

alter table public.parlor_messages
  add constraint parlor_messages_kind_check
  check (kind in ('book', 'look', 'reel', 'chat', 'reply'));

create index if not exists parlor_messages_parent_idx on public.parlor_messages (parent_id);

drop policy if exists "public insert parlor messages" on public.parlor_messages;

create policy "public insert parlor messages"
  on public.parlor_messages for insert
  to anon, authenticated
  with check (kind in ('book', 'look', 'reel', 'chat', 'reply') and char_length(trim(from_name)) between 2 and 24);

alter table public.parlor_messages
  add column if not exists status text not null default 'pending';

alter table public.parlor_messages
  add column if not exists visit_time text not null default '';

do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid = 'public.parlor_messages'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.parlor_messages drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.parlor_messages
  add constraint parlor_messages_status_check
  check (status in ('pending', 'accepted', 'rejected', 'rescheduled', ''));

drop policy if exists "public update parlor messages" on public.parlor_messages;

create policy "public update parlor messages"
  on public.parlor_messages for update
  to anon, authenticated
  using (true)
  with check (kind in ('book', 'look', 'reel', 'chat', 'reply'));

grant update on public.parlor_messages to anon, authenticated;

alter table public.parlor_messages replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.parlor_messages;
exception
  when duplicate_object then null;
end $$;

create or replace function public.parlor_now()
returns timestamptz
language sql
stable
as $$
  select now();
$$;

grant execute on function public.parlor_now() to anon, authenticated;

create or replace function public.parlor_stamp_message()
returns trigger
language plpgsql
as $$
begin
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists parlor_stamp_message on public.parlor_messages;
create trigger parlor_stamp_message
before insert on public.parlor_messages
for each row execute procedure public.parlor_stamp_message();

drop policy if exists "public delete parlor messages" on public.parlor_messages;
create policy "public delete parlor messages"
  on public.parlor_messages for delete
  to anon, authenticated
  using (true);

grant delete on public.parlor_messages to anon, authenticated;

create or replace function public.parlor_auto_welcome()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  already boolean;
begin
  if tg_op = 'UPDATE' and coalesce(old.body, '') <> '' then
    return new;
  end if;
  if new.from_visitor_id in ('geeta-admin', 'anon') then
    return new;
  end if;
  if new.kind = 'reply' or new.parent_id is not null then
    return new;
  end if;
  if trim(coalesce(new.body, '')) = '' then
    return new;
  end if;

  select exists (
    select 1
    from public.parlor_messages m
    where m.from_visitor_id = 'geeta-admin'
      and m.body like 'Thank you for reaching out%'
      and m.parent_id in (
        select p.id from public.parlor_messages p where p.from_visitor_id = new.from_visitor_id
      )
  ) into already;

  if already then
    return new;
  end if;

  insert into public.parlor_messages (
    id, from_visitor_id, from_name, from_avatar, kind, ref_id, body, parent_id, status
  ) values (
    gen_random_uuid(),
    'geeta-admin',
    'Geeta',
    'bloom',
    'reply',
    coalesce(new.ref_id, ''),
    'Thank you for reaching out, ' || split_part(trim(new.from_name), ' ', 1) || '. Share your queries or just wanna chit chat?',
    new.id,
    ''
  );

  return new;
end;
$$;

drop trigger if exists parlor_auto_welcome on public.parlor_messages;
create trigger parlor_auto_welcome
after insert or update of body on public.parlor_messages
for each row execute procedure public.parlor_auto_welcome();

create table if not exists public.parlor_hidden_chats (
  thread_id uuid not null,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (thread_id, visitor_id)
);

alter table public.parlor_hidden_chats enable row level security;

drop policy if exists "public read hidden chats" on public.parlor_hidden_chats;
drop policy if exists "public insert hidden chats" on public.parlor_hidden_chats;
drop policy if exists "public delete hidden chats" on public.parlor_hidden_chats;

create policy "public read hidden chats"
  on public.parlor_hidden_chats for select
  to anon, authenticated
  using (true);

create policy "public insert hidden chats"
  on public.parlor_hidden_chats for insert
  to anon, authenticated
  with check (char_length(trim(visitor_id)) > 0);

create policy "public delete hidden chats"
  on public.parlor_hidden_chats for delete
  to anon, authenticated
  using (true);

grant select, insert, delete on public.parlor_hidden_chats to anon, authenticated;

alter table public.reaction_votes add column if not exists hits integer not null default 1;

do $$
begin
  alter table public.reaction_votes drop constraint reaction_votes_pkey;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter table public.reaction_votes add primary key (photo_id, visitor_id, kind);
exception
  when invalid_table_definition then null;
end $$;

create or replace function public.parlor_tap_reaction(p_photo_id text, p_visitor_id text, p_kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind not in ('fire', 'heart', 'wow', 'eyes') then
    raise exception 'bad kind';
  end if;
  if char_length(trim(coalesce(p_photo_id, ''))) = 0 or char_length(trim(coalesce(p_visitor_id, ''))) = 0 then
    raise exception 'bad vote';
  end if;
  insert into public.reaction_votes (photo_id, visitor_id, kind, hits, updated_at)
  values (p_photo_id, p_visitor_id, p_kind, 1, now())
  on conflict (photo_id, visitor_id, kind)
  do update set hits = public.reaction_votes.hits + 1, updated_at = now();
end;
$$;

grant execute on function public.parlor_tap_reaction(text, text, text) to anon, authenticated;
