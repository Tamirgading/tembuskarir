-- ================================================================
-- BUMN: Tambah category + packages TKD
-- ================================================================

-- 1. Update constraint category (tambah 'BUMN')
ALTER TABLE public.packages DROP CONSTRAINT IF EXISTS packages_category_check;
ALTER TABLE public.packages ADD CONSTRAINT packages_category_check
  CHECK (category IN ('PLN', 'ASTRA', 'BI', 'OJK', 'KEDINASAN', 'BUMN', 'LAINNYA'));

-- 2. Seed packages BUMN TKD
INSERT INTO public.packages (name, slug, category, description, duration_minutes, total_questions, is_free, is_published)
VALUES
  (
    'BUMN TKD — Demo',
    'bumn-tkd-demo',
    'BUMN',
    'Coba 20 soal TKD BUMN (TWK + TIU) secara gratis. Cocok untuk mengenal pola soal.',
    25, 20, true, true
  ),
  (
    'BUMN TKD — Paket 1',
    'bumn-tkd-paket-1',
    'BUMN',
    'Simulasi penuh TKD BUMN Paket 1: TWK (35 soal) + TIU (35 soal) + TKP (35 soal). Dilengkapi pembahasan lengkap.',
    105, 105, false, true
  ),
  (
    'BUMN TKD — Paket 2',
    'bumn-tkd-paket-2',
    'BUMN',
    'Simulasi penuh TKD BUMN Paket 2: TWK (35 soal) + TIU (35 soal) + TKP (35 soal). Dilengkapi pembahasan lengkap.',
    105, 105, false, true
  )
ON CONFLICT (slug) DO UPDATE SET
  name            = EXCLUDED.name,
  description     = EXCLUDED.description,
  duration_minutes= EXCLUDED.duration_minutes,
  total_questions = EXCLUDED.total_questions,
  is_published    = EXCLUDED.is_published;

-- 3. Verifikasi
SELECT slug, name, total_questions, is_free FROM public.packages WHERE category = 'BUMN' ORDER BY slug;
