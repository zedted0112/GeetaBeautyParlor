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
