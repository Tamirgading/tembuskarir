-- ================================================================
-- leaderboard_entries: entri dummy leaderboard (nama, nilai, waktu)
-- Admin bisa menambah/edit/menghapus agar leaderboard tampak ramai.
-- ================================================================

create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  display_name text not null,
  score int not null default 0,
  duration_seconds int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leaderboard_entries enable row level security;

-- Siapa pun (user login) bisa baca untuk ditampilkan di leaderboard
drop policy if exists "leaderboard_entries_select_public" on public.leaderboard_entries;
create policy "leaderboard_entries_select_public"
  on public.leaderboard_entries for select
  using (true);

-- Admin menulis lewat service role (bypass RLS), tidak perlu policy insert/update/delete.

create index if not exists leaderboard_entries_package_idx
  on public.leaderboard_entries(package_id);
