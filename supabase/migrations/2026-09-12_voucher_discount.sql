-- ============================================================
-- Voucher diskon (potongan harga) + scope + audit pembayaran
-- ============================================================
-- Menambah dukungan voucher bertipe 'percent' (diskon %),
-- scope berlaku (semua / plan tertentu / paket tertentu),
-- serta kolom audit di subscriptions (harga asli & potongan).

alter table public.vouchers
  add column if not exists name          text,
  add column if not exists discount_value int not null default 0,
  add column if not exists applies_to     text not null default 'all',
  add column if not exists plan_types     text[] not null default '{}',
  add column if not exists package_ids    uuid[] not null default '{}';

-- Perbolehkan tipe voucher 'percent'
alter table public.vouchers drop constraint if exists vouchers_discount_type_check;
alter table public.vouchers add constraint vouchers_discount_type_check
  check (discount_type in ('free_days', 'plan_upgrade', 'percent'));

-- Scope voucher
alter table public.vouchers drop constraint if exists vouchers_applies_to_check;
alter table public.vouchers add constraint vouchers_applies_to_check
  check (applies_to in ('all', 'plan', 'package'));

-- Audit pembayaran: harga sebelum & sesudah diskon + kode voucher terpakai
alter table public.subscriptions
  add column if not exists voucher_code    text,
  add column if not exists original_amount int,
  add column if not exists discount_amount int not null default 0;

create index if not exists subscriptions_voucher_code_idx
  on public.subscriptions (voucher_code);
