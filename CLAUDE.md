# CLAUDE.md — TryOut Platform

> File ini adalah "memori permanen" proyek ini. Baca seluruh isinya sebelum
> mengerjakan apapun. Update file ini setiap kali ada keputusan arsitektur baru.

---

## Identitas Proyek

- **Nama proyek**: TryOut Platform (ganti sesuai brand kamu)
- **Tujuan**: Platform simulasi ujian CPNS/SKD berbasis web dengan sistem langganan
- **Target user**: 5.000–50.000 user aktif dalam 6 bulan pertama
- **Model bisnis**: Freemium — paket gratis terbatas, premium dengan langganan bulanan/tahunan

---

## Tech Stack

| Layer | Tool | Versi |
|---|---|---|
| Framework | Next.js App Router | 14+ |
| Language | TypeScript | strict mode |
| Styling | Tailwind CSS | v3 |
| Database | Supabase PostgreSQL | latest |
| Auth | Supabase Auth | built-in |
| Storage | Supabase Storage | untuk gambar soal |
| Payment | Midtrans | Snap API |
| Email | Resend | transaksional |
| Deploy | Vercel | production |
| Error tracking | Sentry | client + server |

---

## Struktur Folder

```
tryout-platform/
├── app/
│   ├── (auth)/               # Route group — halaman auth (tidak ada navbar)
│   │   ├── login/
│   │   ├── register/
│   │   └── lupa-password/
│   ├── (main)/               # Route group — halaman utama (ada navbar)
│   │   ├── dashboard/
│   │   ├── paket/
│   │   ├── ujian/[packageId]/
│   │   ├── hasil/[attemptId]/
│   │   └── profil/
│   ├── (admin)/              # Route group — admin panel
│   │   └── admin/
│   ├── api/
│   │   ├── submit/           # POST — submit jawaban ujian
│   │   ├── webhook/
│   │   │   └── midtrans/     # POST — webhook pembayaran
│   │   └── attempts/
│   ├── layout.tsx
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # Komponen generik (Button, Input, Card, dll)
│   ├── exam/                 # Komponen khusus ujian (QuestionCard, Timer, dll)
│   └── dashboard/            # Komponen dashboard
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Supabase browser client
│   │   ├── server.ts         # Supabase server client (untuk Server Components)
│   │   └── middleware.ts     # Supabase middleware helper
│   ├── midtrans.ts
│   ├── resend.ts
│   └── utils.ts
├── types/
│   └── database.ts           # Generated types dari Supabase
├── middleware.ts              # Route protection middleware
├── CLAUDE.md                 # File ini
└── supabase/
    └── migrations/           # SQL migration files
```

---

## Database Schema

### Tabel: `users` (extend dari auth.users Supabase)
```sql
-- Dibuat via trigger saat user register
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  plan_expires_at timestamptz,
  created_at timestamptz default now()
);
```

### Tabel: `packages`
```sql
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null check (category in ('CPNS', 'UTBK', 'KEDINASAN', 'LAINNYA')),
  description text,
  duration_minutes int not null default 90,
  total_questions int not null,
  is_free boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz default now()
);
```

### Tabel: `questions`
```sql
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.packages(id) on delete cascade not null,
  content text not null,
  -- options disimpan sebagai JSON array: [{"key":"A","text":"..."},{"key":"B","text":"..."}]
  options jsonb not null,
  correct_answer text not null,  -- "A", "B", "C", "D", atau "E"
  explanation text,
  difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  category text,                 -- sub-kategori: TWK, TIU, TKP
  image_url text,                -- opsional, jika soal ada gambar
  order_index int not null default 0,
  created_at timestamptz default now()
);
```

### Tabel: `attempts`
```sql
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  package_id uuid references public.packages(id) not null,
  -- answers: {"question_id": "A", "question_id2": "C", ...}
  answers jsonb not null default '{}',
  score int,                     -- 0–100, null jika belum selesai
  correct_count int,
  wrong_count int,
  empty_count int,
  duration_seconds int,          -- berapa detik user mengerjakan
  status text not null default 'ongoing' check (status in ('ongoing', 'finished')),
  started_at timestamptz default now(),
  finished_at timestamptz
);
```

### Tabel: `subscriptions`
```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  midtrans_order_id text unique not null,
  midtrans_transaction_id text,
  plan_type text not null check (plan_type in ('monthly', 'yearly')),
  amount int not null,           -- dalam Rupiah
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
  paid_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);
```

---

## Row Level Security (RLS) — WAJIB AKTIF

```sql
-- Aktifkan RLS di semua tabel
alter table public.users enable row level security;
alter table public.packages enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.subscriptions enable row level security;

-- USERS: hanya bisa lihat dan edit data sendiri
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- PACKAGES: semua orang bisa lihat yang published
create policy "packages_select_published" on public.packages
  for select using (is_published = true);

-- QUESTIONS: user bisa lihat soal dari paket published
-- PENTING: correct_answer tidak boleh di-select oleh client!
-- Gunakan server component atau API route untuk query ini
create policy "questions_select" on public.questions
  for select using (
    exists (
      select 1 from public.packages p
      where p.id = questions.package_id and p.is_published = true
    )
  );

-- ATTEMPTS: hanya bisa lihat attempt milik sendiri
create policy "attempts_select_own" on public.attempts
  for select using (auth.uid() = user_id);
create policy "attempts_insert_own" on public.attempts
  for insert with check (auth.uid() = user_id);
create policy "attempts_update_own" on public.attempts
  for update using (auth.uid() = user_id);

-- SUBSCRIPTIONS: hanya bisa lihat milik sendiri
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);
```

---

## Aturan Bisnis Kritis — JANGAN DILANGGAR

### 1. Keamanan jawaban
- `correct_answer` dari tabel `questions` **TIDAK BOLEH** dikirim ke browser/client
- Semua pengecekan jawaban harus terjadi di **server** (API Route atau Server Component)
- Saat menampilkan soal di halaman ujian, query questions **tanpa kolom `correct_answer`**

### 2. Akses konten premium
- Sebelum user bisa mulai ujian paket premium, cek `users.plan === 'premium'` **di server**
- Jangan percaya data dari client untuk hal ini
- Jika langganan expired (`plan_expires_at < now()`), set kembali ke 'free'

### 3. Satu attempt aktif per user per paket
- Sebelum buat attempt baru, cek apakah ada attempt `status = 'ongoing'` untuk paket yang sama
- Jika ada, lanjutkan attempt yang sudah ada (jangan buat duplikat)

### 4. Webhook Midtrans
- Verifikasi signature Midtrans di setiap webhook yang masuk
- Jangan aktifkan premium hanya berdasarkan notifikasi dari client — selalu dari webhook server

---

## Konvensi Kode

### Naming
- Komponen React: PascalCase (`QuestionCard.tsx`)
- Fungsi dan variabel: camelCase (`getUserAttempts`)
- File non-komponen: kebab-case (`supabase-client.ts`)
- Konstanta global: SCREAMING_SNAKE_CASE (`MAX_QUESTIONS_PER_ATTEMPT`)
- Tabel database: snake_case (`user_attempts`)

### TypeScript
- Selalu gunakan TypeScript strict mode — tidak ada `any`
- Generate types dari Supabase: `npx supabase gen types typescript --local > types/database.ts`
- Gunakan type dari database.ts untuk semua query Supabase

### Server vs Client Components
- Default: **Server Component** (tidak ada `"use client"`)
- Gunakan Client Component HANYA jika perlu: state, event handler, browser API, real-time
- Halaman ujian (`/ujian/[packageId]`) = Client Component (butuh timer + state jawaban)
- Halaman hasil, dashboard = Server Component (hanya fetch dan render data)

### Error Handling
- Semua API route harus return error yang konsisten:
```typescript
// Sukses
return NextResponse.json({ data: result }, { status: 200 })
// Error
return NextResponse.json({ error: 'Pesan error yang jelas' }, { status: 400 })
```
- Gunakan try-catch di semua fungsi async yang menyentuh database

---

## Environment Variables

```bash
# .env.local — JANGAN commit file ini ke Git

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Hanya untuk server, jangan expose ke client!

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx   # Sandbox untuk development
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@domainmu.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000   # Ganti ke domain produksi saat deploy
MIDTRANS_WEBHOOK_SECRET=xxx                 # Untuk verifikasi signature webhook
```

---

## Keputusan Arsitektur yang Sudah Diambil

| Tanggal | Keputusan | Alasan |
|---|---|---|
| Sprint 1 | Pakai Supabase Auth bawaan, bukan custom auth | Hemat waktu, sudah production-ready, ada email verification |
| Sprint 1 | Route protection via Next.js middleware | Lebih efisien dari cek auth di tiap page |
| Sprint 1 | Supabase Studio sebagai admin panel sementara | Tidak perlu build admin UI dulu di Sprint 1-2 |
| Sprint 2 | Jawaban disimpan sebagai JSONB di satu kolom | Lebih efisien dari satu row per jawaban untuk scale |
| Sprint 2 | Timer di client, validasi durasi di server | Timer di server tidak practical, tapi server tetap catat waktu submit |
| Sprint 1 | next.config.mjs bukan .ts | Next.js 14.2.18 tidak support next.config.ts |
| Sprint 1 | Explicit type casting untuk query Supabase | Version mismatch @supabase/ssr v0.5.2 vs supabase-js v2.103.0 menyebabkan `never` type — workaround dengan `as` cast menggunakan tipe dari lib/utils.ts |
| Sprint 1 | Middleware skip jika Supabase belum dikonfigurasi | Agar landing page bisa tampil saat .env.local masih placeholder |
| Sprint 4 | Harga server-side di-validate ulang di /api/payment/create | Tidak percaya harga dari client, cegah price tampering |
| Sprint 4 | Webhook Midtrans double-check ke Midtrans API | Verifikasi signature + re-fetch status untuk idempotency |
| Sprint 4 | Rate limiter in-memory (Map) | Cukup untuk skala awal; ganti Upstash Redis saat multi-instance |
| Sprint 5 | Admin diidentifikasi via ADMIN_EMAILS env var | Solusi simpel tanpa tambah kolom DB; ganti role-based jika perlu |
| Sprint 5 | /harga dan /paket bisa diakses publik (tanpa login) | Agar calon user bisa lihat harga & paket sebelum daftar |

> Tambahkan keputusan baru di sini setiap kali ada yang diputuskan

---

## Perintah yang Sering Dipakai

```bash
# Development
npm run dev                          # Jalankan dev server

# Supabase
npx supabase start                   # Jalankan Supabase lokal
npx supabase db reset                # Reset + jalankan ulang semua migration
npx supabase gen types typescript --local > types/database.ts  # Update types

# Git workflow
git add -A && git commit -m "feat: [nama fitur]"   # Commit setelah fitur jalan
git push origin main                               # Push ke GitHub (auto-deploy Vercel)

# Lint & type check sebelum commit
npm run lint
npx tsc --noEmit
```

---

## Status Progres Sprint

- [x] Sprint 1: Fondasi & Auth
- [x] Sprint 2: Mesin Ujian
- [x] Sprint 3: Dashboard & Progress (Landing Page, Profil, Leaderboard)
- [x] Sprint 4: Monetisasi (Midtrans, Resend, Rate Limiting)
- [x] Sprint 5: Admin Panel + SEO + Deploy Prep

> Update checklist ini setiap kali sprint selesai
