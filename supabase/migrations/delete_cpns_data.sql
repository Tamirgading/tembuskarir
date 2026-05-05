-- ============================================================
-- HAPUS SEMUA DATA CPNS DARI TEMBUSKARIR
-- Jalankan di Supabase SQL Editor (project tembuskarir)
-- PERINGATAN: Tidak bisa di-undo. Backup dulu jika perlu.
-- ============================================================

-- 1. Hapus attempts yang berkaitan dengan paket CPNS
DELETE FROM public.attempts
WHERE package_id IN (
  SELECT id FROM public.packages WHERE category = 'CPNS'
);

-- 2. Hapus questions yang berkaitan dengan paket CPNS
DELETE FROM public.questions
WHERE package_id IN (
  SELECT id FROM public.packages WHERE category = 'CPNS'
);

-- 3. Hapus paket CPNS itu sendiri
DELETE FROM public.packages
WHERE category = 'CPNS';

-- 4. Hapus subscriptions/unlocks CPNS (opsional - user testing saja)
-- DELETE FROM public.subscriptions
-- WHERE plan_type IN ('cpns_monthly', 'cpns_quarterly');

-- 5. Hapus info_seleksi CPNS (jika tabel ada)
DELETE FROM public.info_seleksi
WHERE institusi = 'CPNS';

-- Verifikasi hasilnya
SELECT category, COUNT(*) as jumlah FROM public.packages GROUP BY category;
SELECT COUNT(*) as sisa_attempts FROM public.attempts;
