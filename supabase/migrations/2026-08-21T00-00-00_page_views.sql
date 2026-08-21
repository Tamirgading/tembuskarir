-- 2026-08-21T00-00-00_page_views.sql
-- Tracking kunjungan untuk analytics admin (total visit, grafik pengunjung).
-- Insert diperbolehkan untuk publik (anon), select hanya via service client (admin).

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  visitor_id text not null,
  user_id uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_page_views_created on public.page_views(created_at);
create index if not exists idx_page_views_visitor on public.page_views(visitor_id);

alter table public.page_views enable row level security;

create policy "page_views_insert_public"
  on public.page_views for insert
  with check (true);
