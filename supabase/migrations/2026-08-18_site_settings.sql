-- Tabel site_settings: key-value store untuk feature toggles admin
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default 'true'::jsonb,
  updated_at timestamptz default now()
);

-- Seed default feature flags (semua aktif)
insert into public.site_settings (key, value) values
  ('feature_info_seleksi', 'true'::jsonb),
  ('feature_semua_paket', 'true'::jsonb),
  ('feature_portal_pln', 'true'::jsonb),
  ('feature_portal_bumn', 'true'::jsonb),
  ('feature_portal_antam', 'true'::jsonb)
on conflict (key) do nothing;

-- RLS: hanya service role yang bisa update, semua bisa select
alter table public.site_settings enable row level security;

create policy "site_settings_select_all" on public.site_settings
  for select using (true);
