-- ============================================================
-- Voucher system
-- ============================================================

-- Tabel vouchers: kode voucher yang dibuat admin
create table if not exists public.vouchers (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,           -- kode yang diketik user, uppercase
  discount_type   text not null check (discount_type in ('free_days', 'plan_upgrade')),
  -- free_days: tambah X hari premium
  -- plan_upgrade: aktifkan premium langsung (duration_days = berapa hari)
  duration_days   int not null default 30,        -- berapa hari akses premium diberikan
  max_uses        int not null default 1,          -- berapa kali bisa digunakan (0 = unlimited)
  used_count      int not null default 0,
  expires_at      timestamptz,                    -- null = tidak pernah expire
  is_active       boolean not null default true,
  note            text,                            -- catatan internal admin
  created_at      timestamptz default now()
);

-- Tabel voucher_uses: riwayat pemakaian voucher per user
create table if not exists public.voucher_uses (
  id          uuid primary key default gen_random_uuid(),
  voucher_id  uuid references public.vouchers(id) on delete cascade not null,
  user_id     uuid references public.users(id) on delete cascade not null,
  used_at     timestamptz default now(),
  unique (voucher_id, user_id)   -- satu user hanya bisa pakai kode yang sama sekali
);

-- RLS
alter table public.vouchers      enable row level security;
alter table public.voucher_uses  enable row level security;

-- User hanya bisa baca voucher yang aktif (untuk validasi client-side tidak diperlukan,
-- API route pakai service client — policy ini sebagai defence in depth)
create policy "vouchers_select_active" on public.vouchers
  for select using (is_active = true);

-- User lihat riwayat penggunaan sendiri
create policy "voucher_uses_select_own" on public.voucher_uses
  for select using (auth.uid() = user_id);

-- Index performa
create index if not exists vouchers_code_idx on public.vouchers (code);
create index if not exists voucher_uses_user_idx on public.voucher_uses (user_id);
