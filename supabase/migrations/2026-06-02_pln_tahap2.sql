-- ============================================================
-- PLN Tahap 2: Akademik (AKDING) & Bahasa Inggris
-- ============================================================
-- 1. Tambah kolom `bidang` ke subscriptions
-- 2. Tambah plan_type baru PLN ke constraint
-- 3. Seed paket BI (demo+full) + 12×AKDING (demo+full)
-- ============================================================

-- ── 1. Kolom bidang ──────────────────────────────────────────
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS bidang text;

COMMENT ON COLUMN public.subscriptions.bidang IS
  'Bidang AKDING yang dipilih saat berlangganan PLN Tahap 2 / Complete.
   Nullable untuk plan lain (GAT, premium_*, package).
   Contoh: teknik-elektro, psikologi, akuntansi-keuangan';

-- ── 2. Update plan_type constraint ───────────────────────────
ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_plan_type_check
  CHECK (plan_type IN (
    'premium_monthly', 'premium_quarterly',
    'package',
    'monthly', 'yearly',  -- legacy
    'pln_gat_monthly',
    'pln_tahap2_monthly',
    'pln_complete_monthly'
  ));

-- ── 3. Seed Bahasa Inggris PLN ───────────────────────────────
-- Demo: 20 soal / 20 menit (gratis)
INSERT INTO public.packages (name, slug, category, description, duration_minutes, total_questions, is_free, is_published)
VALUES (
  'Bahasa Inggris PLN — Demo',
  'bi-pln-demo',
  'PLN',
  'Coba 20 soal Bahasa Inggris PLN Tahap 2 secara gratis. Tipe soal: sentence completion, reading, vocabulary.',
  20, 20, true, true
) ON CONFLICT (slug) DO NOTHING;

-- Full: 50 soal / 50 menit (berbayar)
INSERT INTO public.packages (name, slug, category, description, duration_minutes, total_questions, is_free, is_published)
VALUES (
  'Bahasa Inggris PLN — Full',
  'bi-pln-full',
  'PLN',
  '50 soal Bahasa Inggris PLN Tahap 2. Meliputi sentence completion, grammar, vocabulary, dan reading comprehension.',
  50, 50, false, true
) ON CONFLICT (slug) DO NOTHING;

-- ── 4. Seed AKDING per bidang ────────────────────────────────
-- Pola: slug = 'akding-{bidang-slug}-{demo|full}'
-- 12 bidang × 2 tier = 24 paket

DO $$
DECLARE
  bidang_list text[][] := ARRAY[
    ARRAY['akuntansi-keuangan',    'Akuntansi & Keuangan'],
    ARRAY['hukum-regulasi',        'Hukum & Regulasi Energi'],
    ARRAY['komunikasi-humas',      'Komunikasi & Hubungan Masyarakat'],
    ARRAY['manajemen-bisnis',      'Manajemen & Bisnis'],
    ARRAY['matematika-sains-data', 'Matematika & Sains Data'],
    ARRAY['psikologi',             'Psikologi'],
    ARRAY['teknik-elektro',        'Teknik Elektro & Energi'],
    ARRAY['teknik-industri',       'Teknik Industri & Logistik'],
    ARRAY['teknik-informatika',    'Teknik Informatika'],
    ARRAY['teknik-kimia',          'Teknik Kimia & Lingkungan'],
    ARRAY['teknik-mesin',          'Teknik Mesin & Material'],
    ARRAY['teknik-sipil',          'Teknik Sipil & Geoteknik']
  ];
  b text[];
  slug_demo text;
  slug_full text;
  name_demo text;
  name_full text;
  desc_text text;
BEGIN
  FOREACH b SLICE 1 IN ARRAY bidang_list LOOP
    slug_demo := 'akding-' || b[1] || '-demo';
    slug_full := 'akding-' || b[1] || '-full';
    name_demo := 'AKDING ' || b[2] || ' — Demo';
    name_full := 'AKDING ' || b[2] || ' — Full';
    desc_text := 'Soal Akademik PLN Tahap 2 bidang ' || b[2] || '. Materi sesuai keilmuan bidang tersebut.';

    INSERT INTO public.packages (name, slug, category, description, duration_minutes, total_questions, is_free, is_published)
    VALUES (name_demo, slug_demo, 'PLN', 'Coba 20 soal akademik bidang ' || b[2] || ' secara gratis.', 20, 20, true,  true)
    ON CONFLICT (slug) DO NOTHING;

    INSERT INTO public.packages (name, slug, category, description, duration_minutes, total_questions, is_free, is_published)
    VALUES (name_full, slug_full, 'PLN', desc_text, 50, 50, false, true)
    ON CONFLICT (slug) DO NOTHING;
  END LOOP;
END $$;

-- ── Verifikasi ───────────────────────────────────────────────
SELECT slug, name, is_free, total_questions
FROM public.packages
WHERE category = 'PLN'
  AND slug LIKE 'bi-%' OR slug LIKE 'akding-%'
ORDER BY slug;
