-- ================================================================
-- ANTAM IMPACT 2026: Tambah category + kolom stream di attempts
-- ================================================================

-- 1. Update constraint category (tambah 'ANTAM')
ALTER TABLE public.packages DROP CONSTRAINT IF EXISTS packages_category_check;
ALTER TABLE public.packages ADD CONSTRAINT packages_category_check
  CHECK (category IN ('PLN', 'ASTRA', 'BI', 'OJK', 'KEDINASAN', 'BUMN', 'ANTAM', 'LAINNYA'));

-- 2. Kolom selected_stream di attempts — menyimpan pilihan Job Stream user (khusus ANTAM)
ALTER TABLE public.attempts ADD COLUMN IF NOT EXISTS selected_stream text;

-- 3. Seed paket ANTAM IMPACT (1 paket per stream, 40 soal, 50 menit)
INSERT INTO public.packages (name, slug, category, description, duration_minutes, total_questions, is_free, is_published)
VALUES
  ('ANTAM IMPACT — Exploration',                            'antam-exploration',   'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Exploration: Geological Mapping, Geophysics, Geochemistry, Remote Sensing, Resource Modeling, Exploration Drilling.', 50, 40, false, false),
  ('ANTAM IMPACT — Mining',                                 'antam-mining',        'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Mining: Mine Planning, Drill & Blast, Load & Haul, Geotechnical, Ventilation, Water Management, Fleet Management, Mine Closure.', 50, 40, false, false),
  ('ANTAM IMPACT — Processing',                             'antam-processing',    'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Processing: Termodinamika, Mineral Processing, Ekstraksi Metalurgi, Unit Operasi, Pengendalian Mutu & Lingkungan.', 50, 40, false, false),
  ('ANTAM IMPACT — Project & Engineering',                  'antam-engineering',   'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Project & Engineering: Manajemen Proyek, Maintenance, Gambar Teknik, Mekanikal, Kelistrikan, Infrastruktur, Keselamatan.', 50, 40, false, false),
  ('ANTAM IMPACT — HSE',                                    'antam-hse',           'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream HSE: Sistem Manajemen HSE, Identifikasi Bahaya, Pengelolaan Lingkungan, Investigasi Insiden, Higiene Industri, ESG.', 50, 40, false, false),
  ('ANTAM IMPACT — Quality Control',                        'antam-qc',            'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Quality Control: QA/QC, Sampling, Kimia Analitik, Statistical QC, Manajemen Mutu Laboratorium.', 50, 40, false, false),
  ('ANTAM IMPACT — Marketing',                              'antam-marketing',     'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Marketing: Pemasaran B2B, Ekonomi Makro, Riset Pasar, CRM, Logistik & Pengiriman.', 50, 40, false, false),
  ('ANTAM IMPACT — Business Development',                   'antam-bizdev',        'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Business Development: Mining Value Chain, Evaluasi Kelayakan, Strategi Bisnis, Joint Venture, Analisis Data, Manajemen Risiko.', 50, 40, false, false),
  ('ANTAM IMPACT — Supply Chain Management',                'antam-scm',           'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Supply Chain: Procurement, Inventaris, Hukum Kontrak, Logistik, Transportasi Maritim.', 50, 40, false, false),
  ('ANTAM IMPACT — Organization & Human Capital Management','antam-hcm',           'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Organization & HCM: Desain Organisasi, Rekrutmen, Manajemen Kinerja, Pelatihan, Hubungan Industrial, HR Analytics.', 50, 40, false, false),
  ('ANTAM IMPACT — Legal & Compliance',                     'antam-legal',         'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Legal: Hukum Perusahaan, Regulasi Pertambangan, GCG, Anti-Korupsi, Manajemen Risiko Hukum.', 50, 40, false, false),
  ('ANTAM IMPACT — Finance & Accounting',                   'antam-finance',       'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Finance: Akuntansi Keuangan, Akuntansi Biaya, Manajemen Keuangan, Perpajakan, Pengendalian Internal & Audit.', 50, 40, false, false),
  ('ANTAM IMPACT — Corporate Relation',                     'antam-corprel',       'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream Corporate Relation: Komunikasi Korporasi, Stakeholder Management, Manajemen Krisis, Hukum Komunikasi, Tata Kelola.', 50, 40, false, false),
  ('ANTAM IMPACT — Information Technology',                  'antam-it',            'ANTAM', 'Simulasi tes teknis ANTAM IMPACT stream IT: Software Engineering, Database, Infrastruktur & Jaringan, Cybersecurity, IT Service Management.', 50, 40, false, false)
ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  description      = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  total_questions  = EXCLUDED.total_questions;

-- 4. Verifikasi
SELECT slug, name, total_questions, duration_minutes, is_free FROM public.packages WHERE category = 'ANTAM' ORDER BY slug;
