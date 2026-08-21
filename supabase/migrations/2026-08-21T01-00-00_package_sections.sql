-- 2026-08-21T01-00-00_package_sections.sql
-- Konfigurasi "tahap ujian gabungan" (Fase 0).
-- Satu paket (tahap) = beberapa seksi (sub-tes) yang dikerjakan berurutan
-- dengan timer terpisah, masing-masing bisa punya passing grade.
-- Soal disimpan inline di paket itu sendiri; kolom `category` soal = kode seksi.

create table if not exists public.package_sections (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.packages(id) on delete cascade not null,
  order_index int not null default 0,
  kode text not null,
  nama text not null,
  -- 'section' = timer untuk seluruh seksi; 'per_question' = timer per soal + auto-advance
  timer_mode text not null default 'section' check (timer_mode in ('section', 'per_question')),
  timer_seconds int not null default 600,
  -- null = semua soal pada kode seksi; angka = ambil N acak dari seksi tsb
  question_count int,
  random_select boolean not null default false,
  -- Seksi dengan group_kode sama dinilai passing grade secara gabungan (mis. TKD)
  group_kode text,
  passing_grade int,
  created_at timestamptz default now()
);

create index if not exists idx_package_sections_pkg on public.package_sections(package_id, order_index);

alter table public.package_sections enable row level security;

create policy "package_sections_select_published" on public.package_sections
  for select using (
    exists (
      select 1 from public.packages p
      where p.id = package_sections.package_id and p.is_published = true
    )
  );
