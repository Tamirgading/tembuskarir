-- ============================================================
-- PLN Recruitment — Tabel Khusus AKHLAK & Learning Agility
-- ============================================================
-- Struktur mirror dari questions_tkp (point-based per opsi),
-- tapi dengan dimensi khusus per tes:
--   - AKHLAK: 6 core values BUMN (Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif)
--   - LA:     Likert scale 1-5 per opsi (Learning Agility)
-- ============================================================

-- ── 1. Perluas kategori packages untuk mendukung 'PLN' ──────────────────────
alter table public.packages drop constraint if exists packages_category_check;
alter table public.packages add constraint packages_category_check
  check (category in ('CPNS', 'UTBK', 'KEDINASAN', 'LAINNYA', 'ASTRA', 'PLN', 'BI', 'OJK'));

-- ── 2. Tabel questions_pln_akhlak ───────────────────────────────────────────
-- Setiap opsi A-E memberi poin ke salah satu (atau beberapa) core value BUMN.
-- Format: opsi dengan point_total tertinggi = jawaban "paling BUMN".
create table if not exists public.questions_pln_akhlak (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.packages(id) on delete cascade not null,
  content text not null,
  opt_a text not null,
  opt_b text not null,
  opt_c text not null,
  opt_d text not null,
  opt_e text not null,
  -- Poin total per opsi (1-5), untuk scoring sederhana
  point_a int not null default 0,
  point_b int not null default 0,
  point_c int not null default 0,
  point_d int not null default 0,
  point_e int not null default 0,
  -- Value tag: 'amanah' | 'kompeten' | 'harmonis' | 'loyal' | 'adaptif' | 'kolaboratif'
  -- Dimensi yang paling ditest dari soal ini.
  value_tag text,
  explanation text,
  image_url text,
  order_index int not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_questions_pln_akhlak_package
  on public.questions_pln_akhlak(package_id, order_index);

-- ── 3. Tabel questions_pln_la (Learning Agility) ────────────────────────────
-- Skala Likert: 5 opsi dengan poin 1-5. Ada opsi reverse-scored.
create table if not exists public.questions_pln_la (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.packages(id) on delete cascade not null,
  content text not null,
  opt_a text not null,
  opt_b text not null,
  opt_c text not null,
  opt_d text not null,
  opt_e text not null,
  point_a int not null default 0,
  point_b int not null default 0,
  point_c int not null default 0,
  point_d int not null default 0,
  point_e int not null default 0,
  -- Dimensi LA: 'mental' | 'people' | 'change' | 'results' | 'self'
  dimension text,
  is_reverse_scored boolean not null default false,
  explanation text,
  image_url text,
  order_index int not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_questions_pln_la_package
  on public.questions_pln_la(package_id, order_index);

-- ── 4. RLS policies (konsisten dengan tabel lainnya) ────────────────────────
alter table public.questions_pln_akhlak enable row level security;
alter table public.questions_pln_la     enable row level security;

create policy "questions_pln_akhlak_select" on public.questions_pln_akhlak
  for select using (exists (
    select 1 from public.packages p
    where p.id = questions_pln_akhlak.package_id and p.is_published = true
  ));

create policy "questions_pln_la_select" on public.questions_pln_la
  for select using (exists (
    select 1 from public.packages p
    where p.id = questions_pln_la.package_id and p.is_published = true
  ));

-- ── 5. Seed package: GAT PLN Paket 1 ────────────────────────────────────────
-- Total durasi: 30+30+15+10+20+15+30+30 = 180 menit
-- Total soal estimasi: 30+30+15+15+20+20+40+40 = 210 (akan disesuaikan saat insert soal)
insert into public.packages (name, slug, category, description, duration_minutes, total_questions, is_free, is_published)
values (
  'GAT PLN Paket 1',
  'gat-pln-paket-1',
  'PLN',
  'Tes Aptitude PLN (General Aptitude Test) - Paket 1. Terdiri dari 8 subtes: Numerik, Verbal, Silogisme, Deret Angka, Figural, Pengetahuan Umum PLN, Learning Agility, dan AKHLAK.',
  180,
  210,
  false,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  duration_minutes = excluded.duration_minutes,
  total_questions = excluded.total_questions,
  is_published = excluded.is_published;
