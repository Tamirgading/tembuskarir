-- ============================================================
-- TryOut Platform — Initial Schema
-- ============================================================

-- ============================================================
-- 1. TABEL USERS (extend dari auth.users)
-- ============================================================
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  plan_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Trigger: otomatis insert ke public.users saat user register
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. TABEL PACKAGES
-- ============================================================
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null check (category in ('UTBK', 'KEDINASAN', 'LAINNYA')),
  description text,
  duration_minutes int not null default 90,
  total_questions int not null,
  is_free boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz default now()
);

-- ============================================================
-- 3. TABEL QUESTIONS
-- ============================================================
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.packages(id) on delete cascade not null,
  content text not null,
  -- options format: [{"key":"A","text":"..."},{"key":"B","text":"..."}]
  options jsonb not null,
  correct_answer text not null check (correct_answer in ('A','B','C','D','E')),
  explanation text,
  difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  category text, -- kode sub-tes, mis. NUM, VER, QR
  image_url text,
  order_index int not null default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- 4. TABEL ATTEMPTS
-- ============================================================
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  package_id uuid references public.packages(id) not null,
  -- answers format: {"question_uuid": "A", ...}
  answers jsonb not null default '{}',
  score int,
  correct_count int,
  wrong_count int,
  empty_count int,
  duration_seconds int,
  status text not null default 'ongoing' check (status in ('ongoing', 'finished')),
  started_at timestamptz default now(),
  finished_at timestamptz
);

-- ============================================================
-- 5. TABEL SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  midtrans_order_id text unique not null,
  midtrans_transaction_id text,
  plan_type text not null check (plan_type in ('premium_monthly', 'premium_quarterly', 'package', 'monthly', 'yearly')),
  amount int not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
  paid_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================
alter table public.users enable row level security;
alter table public.packages enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.subscriptions enable row level security;

-- USERS
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- PACKAGES: semua yang published bisa dilihat
create policy "packages_select_published" on public.packages
  for select using (is_published = true);

-- QUESTIONS: soal dari paket published
create policy "questions_select" on public.questions
  for select using (
    exists (
      select 1 from public.packages p
      where p.id = questions.package_id and p.is_published = true
    )
  );

-- ATTEMPTS
create policy "attempts_select_own" on public.attempts
  for select using (auth.uid() = user_id);
create policy "attempts_insert_own" on public.attempts
  for insert with check (auth.uid() = user_id);
create policy "attempts_update_own" on public.attempts
  for update using (auth.uid() = user_id);

-- SUBSCRIPTIONS
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ============================================================
-- 7. INDEXES
-- ============================================================
create index idx_attempts_user_id on public.attempts(user_id);
create index idx_attempts_package_id on public.attempts(package_id);
create index idx_attempts_status on public.attempts(status);
create index idx_questions_package_id on public.questions(package_id);
create index idx_questions_order_index on public.questions(order_index);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);
