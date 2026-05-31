-- ============================================================
-- Hapus CPNS / SKD dari TembusKarir
-- ============================================================
-- TembusKarir kini fokus pada simulasi tes kerja (PLN, ASTRA, dll.).
-- Simulasi SKD CPNS dipindahkan ke platform terpisah (TembusASN).
--
-- Migrasi ini membersihkan seluruh jejak CPNS dari database:
--   1. Rename plan langganan lama cpns_* → premium_* (akses tetap aktif)
--   2. Hapus data paket/soal/attempt/info-seleksi CPNS
--   3. Drop tabel questions_tkp (khusus TKP)
--   4. Persempit constraint kategori paket (buang 'CPNS')
--
-- Aman dijalankan berulang (idempoten) dan tahan terhadap tabel
-- opsional yang mungkin belum ada di lingkungan tertentu.
-- ============================================================

-- 1. Migrasi plan_type langganan: cpns_* → premium_*
--    Supaya user yang sudah membayar tetap punya akses premium.
do $$
begin
  if to_regclass('public.subscriptions') is not null then
    alter table public.subscriptions drop constraint if exists subscriptions_plan_type_check;

    update public.subscriptions set plan_type = 'premium_monthly'   where plan_type = 'cpns_monthly';
    update public.subscriptions set plan_type = 'premium_quarterly' where plan_type = 'cpns_quarterly';

    alter table public.subscriptions add constraint subscriptions_plan_type_check
      check (plan_type in ('premium_monthly', 'premium_quarterly', 'package', 'monthly', 'yearly'));
  end if;
end $$;

-- 2. Hapus unlock paket satuan CPNS (jika tabel ada)
do $$
begin
  if to_regclass('public.unlocked_packages') is not null then
    delete from public.unlocked_packages
      where package_id in (select id from public.packages where category = 'CPNS');
  end if;
end $$;

-- 3. Hapus attempts untuk paket CPNS
delete from public.attempts
  where package_id in (select id from public.packages where category = 'CPNS');

-- 4. Hapus soal CPNS (tabel utama) + drop tabel TKP terpisah
delete from public.questions
  where package_id in (select id from public.packages where category = 'CPNS');

drop table if exists public.questions_tkp;

-- 5. Hapus paket CPNS
delete from public.packages where category = 'CPNS';

-- 6. Hapus info seleksi & sumber crawl CPNS/BKN (jika tabel ada)
do $$
begin
  if to_regclass('public.info_seleksi') is not null then
    delete from public.info_seleksi where institusi = 'CPNS';
  end if;
  if to_regclass('public.crawl_sources') is not null then
    delete from public.crawl_sources where institusi = 'CPNS';
  end if;
end $$;

-- 7. Persempit constraint kategori paket (buang 'CPNS')
alter table public.packages drop constraint if exists packages_category_check;
alter table public.packages add constraint packages_category_check
  check (category in ('UTBK', 'KEDINASAN', 'LAINNYA', 'ASTRA', 'PLN', 'BI', 'OJK'));
