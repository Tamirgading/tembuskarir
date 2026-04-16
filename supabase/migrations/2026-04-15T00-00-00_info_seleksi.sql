-- ============================================================
-- Tabel: info_seleksi
-- Menyimpan informasi penting setiap institusi seleksi
-- Di-crawl otomatis via Vercel Cron harian
-- ============================================================

create table public.info_seleksi (
  id uuid primary key default gen_random_uuid(),

  -- Identitas institusi
  institusi text not null,        -- 'CPNS', 'OJK', 'BI', 'PLN', 'RBB', 'ASTRA'
  kategori text not null          -- 'pengumuman' | 'soal' | 'jadwal' | 'tips' | 'kisi-kisi'
    check (kategori in ('pengumuman', 'soal', 'jadwal', 'tips', 'kisi-kisi')),

  -- Konten
  judul text not null,
  ringkasan text,
  konten_lengkap text,            -- markdown dari Firecrawl
  url_sumber text,

  -- Metadata crawl
  tanggal_publikasi date,         -- tanggal dari sumber asli
  crawled_at timestamptz not null default now(),
  is_active boolean not null default true,

  -- Dedup: cegah duplikat URL yang sama
  url_hash text generated always as (md5(url_sumber)) stored,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index untuk query cepat
create index idx_info_seleksi_institusi on public.info_seleksi(institusi);
create index idx_info_seleksi_kategori on public.info_seleksi(kategori);
create index idx_info_seleksi_crawled on public.info_seleksi(crawled_at desc);
create index idx_info_seleksi_url_hash on public.info_seleksi(url_hash);
create index idx_info_seleksi_active on public.info_seleksi(is_active, institusi, kategori);

-- Cegah duplikat URL
create unique index idx_info_seleksi_url_unique
  on public.info_seleksi(url_hash)
  where url_sumber is not null;

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_info_seleksi_updated_at
  before update on public.info_seleksi
  for each row execute function update_updated_at_column();

-- ============================================================
-- Tabel: crawl_log
-- Audit log setiap kali cron berjalan
-- ============================================================

create table public.crawl_log (
  id uuid primary key default gen_random_uuid(),
  institusi text not null,
  url_target text not null,
  status text not null check (status in ('success', 'failed', 'partial')),
  items_found int default 0,
  items_inserted int default 0,
  items_skipped int default 0,    -- duplikat yang di-skip
  error_message text,
  duration_ms int,
  ran_at timestamptz default now()
);

create index idx_crawl_log_ran_at on public.crawl_log(ran_at desc);
create index idx_crawl_log_institusi on public.crawl_log(institusi, ran_at desc);

-- ============================================================
-- RLS
-- ============================================================

alter table public.info_seleksi enable row level security;
alter table public.crawl_log enable row level security;

-- Info seleksi: semua user bisa baca (konten publik)
create policy "info_seleksi_select_all" on public.info_seleksi
  for select using (is_active = true);

-- Crawl log: hanya service role (tidak ada akses dari client)
-- (no policy = deny all untuk non-service role)

-- ============================================================
-- Seed data awal: sumber URL per institusi
-- ============================================================

create table public.crawl_sources (
  id uuid primary key default gen_random_uuid(),
  institusi text not null,
  kategori text not null,
  url text not null unique,
  label text,                     -- deskripsi singkat sumber ini
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.crawl_sources enable row level security;

-- Seed sumber crawl
insert into public.crawl_sources (institusi, kategori, url, label) values
  -- CPNS / BKN
  ('CPNS', 'pengumuman', 'https://www.bkn.go.id/category/publikasi/pengumuman/', 'BKN - Pengumuman Resmi'),
  ('CPNS', 'pengumuman', 'https://www.bkn.go.id/category/publikasi/berita/', 'BKN - Berita Terbaru'),
  ('CPNS', 'jadwal',     'https://sscasn.bkn.go.id', 'SSCASN - Portal Resmi CPNS'),

  -- OJK
  ('OJK',  'pengumuman', 'https://www.ojk.go.id/id/karir/Pages/default.aspx', 'OJK - Halaman Karir'),

  -- Bank Indonesia
  ('BI',   'pengumuman', 'https://www.bi.go.id/id/tentang-bi/karir/Default.aspx', 'BI - Halaman Karir'),

  -- PLN
  ('PLN',  'pengumuman', 'https://web.pln.co.id/karier/informasi-rekrutmen-pln', 'PLN - Info Rekrutmen'),
  ('PLN',  'jadwal',     'https://rekrutmen.pln.co.id', 'PLN - Portal Rekrutmen'),

  -- RBB / FHCI BUMN
  ('RBB',  'pengumuman', 'https://fhcibumn.com/gallery/news', 'FHCI BUMN - Berita & Pengumuman'),
  ('RBB',  'jadwal',     'https://magenta.fhcibumn.com', 'FHCI - Platform Karir BUMN'),

  -- Astra
  ('ASTRA','pengumuman', 'https://www.astra.co.id/Karir', 'Astra - Halaman Karir');
