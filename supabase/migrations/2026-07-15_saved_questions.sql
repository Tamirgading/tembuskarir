-- ════════════════════════════════════════════════════════════════════
-- Tabel: saved_questions
-- User bisa menyimpan soal (bookmark) untuk dipelajari kembali.
-- Scope: hanya soal dari tabel public.questions (MCQ utama).
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.saved_questions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  saved_at    timestamptz not null default now(),
  constraint saved_questions_unique unique (user_id, question_id)
);

-- Index untuk query cepat per user
create index if not exists idx_saved_questions_user_id
  on public.saved_questions (user_id, saved_at desc);

-- ── RLS ──────────────────────────────────────────────────────────────
alter table public.saved_questions enable row level security;

create policy "saved_questions_select_own"
  on public.saved_questions for select
  using (auth.uid() = user_id);

create policy "saved_questions_insert_own"
  on public.saved_questions for insert
  with check (auth.uid() = user_id);

create policy "saved_questions_delete_own"
  on public.saved_questions for delete
  using (auth.uid() = user_id);
