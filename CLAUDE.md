# CLAUDE.md — TembusKarir Platform

> File ini adalah "memori permanen" proyek ini. Baca seluruh isinya sebelum
> mengerjakan apapun. Update file ini setiap kali ada keputusan arsitektur baru.

---

## Identitas Proyek

- **Nama proyek**: TembusKarir (tembuskarir.id)
- **Tujuan**: Platform simulasi tes rekrutmen kerja (PLN, ASTRA, BUMN, OJK, BI, dll.) berbasis web dengan sistem langganan
- **Catatan pivot**: Simulasi SKD CPNS sudah dipindahkan ke platform terpisah (TembusASN). TembusKarir tidak lagi menangani CPNS/SKD.
- **Target user**: 5.000–50.000 user aktif dalam 6 bulan pertama
- **Model bisnis**: Freemium — paket gratis terbatas, premium dengan langganan bulanan/tahunan

---

## Tech Stack

| Layer | Tool | Versi |
|---|---|---|
| Framework | Next.js App Router | 14+ |
| Language | TypeScript | strict mode |
| Styling | Tailwind CSS | v3 |
| Icons | lucide-react | installed |
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
│   │   ├── login/            # (redirect ke / — login via LoginModal)
│   │   ├── register/
│   │   ├── lupa-password/    # redirectTo → /auth/callback
│   │   └── reset-password/   # Set password baru (session dari /auth/callback)
│   ├── auth/callback/        # GET — tukar code Supabase → session; deteksi recovery flow
│   ├── (main)/               # Route group — halaman utama (AppShell sidebar)
│   │   ├── page.tsx          # ★ Beranda/dashboard di root / (guest-aware; landing page dihapus)
│   │   ├── paket/
│   │   ├── paket/[packageId]/leaderboard/
│   │   ├── persiapan/[packageId]/   # Halaman persiapan sebelum ujian (fase B)
│   │   ├── ujian/[packageId]/
│   │   ├── hasil/[attemptId]/
│   │   ├── info-seleksi/            # Info rekrutmen dari crawl OJK/PLN/BUMN dll
│   │   ├── harga/
│   │   ├── kebijakan-privasi/       # Halaman legal (publik, link di footer AppShell)
│   │   ├── syarat-ketentuan/        # Halaman legal (publik, link di footer AppShell)
│   │   └── profil/
│   ├── (admin)/              # Route group — admin panel
│   │   └── admin/
│   ├── portal/               # Public pages (no login needed)
│   │   ├── pln/              # Portal PLN (GAT) publik
│   │   └── astra/            # Portal ASTRA (Psikotes) publik
│   ├── api/
│   │   ├── submit/           # POST — submit jawaban ujian
│   │   ├── payment/create/   # POST — buat order Midtrans
│   │   ├── webhook/
│   │   │   └── midtrans/     # POST — webhook pembayaran
│   │   ├── attempts/
│   │   │   ├── abandon/      # POST — batalkan sesi ujian
│   │   │   └── (tidak ada lagi auto-finish terpisah, sudah di persiapan page)
│   │   └── cron/
│   │       ├── crawl-seleksi/  # GET — crawl info seleksi harian
│   │       └── cleanup/        # GET — auto-finish expired attempts + expire pending subs
│   └── layout.tsx            # (tidak ada app/page.tsx — root / dilayani app/(main)/page.tsx)
├── components/
│   ├── ui/
│   │   └── LatexContent.tsx  # Render konten dengan LaTeX support
│   ├── admin/
│   │   ├── AddQuestionForm.tsx   # Form tambah soal (pilihan ganda)
│   │   ├── BulkImportModal.tsx   # Import CSV soal pilihan ganda
│   │   ├── QuestionList.tsx
│   │   ├── PackageActions.tsx
│   │   └── ImportButton.tsx
│   ├── portal/
│   │   ├── PlnPackageCard.tsx   # Row card untuk portal PLN
│   │   └── AstraPackageCard.tsx # Row card untuk portal ASTRA
│   ├── persiapan/
│   │   └── PersiapanActions.tsx # CTA buttons (mulai/lanjutkan/mulai baru)
│   └── hasil/
│       └── HasilReview.tsx      # Review soal per soal setelah ujian
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Supabase browser client
│   │   ├── server.ts         # createClient() async + createServiceClient() sync
│   │   └── middleware.ts     # Supabase middleware helper
│   ├── exam-scoring.ts       # ★ Shared scoring: computeScore(), isAttemptExpired()
│   ├── midtrans.ts
│   ├── resend.ts
│   ├── rateLimit.ts
│   └── utils.ts              # Row type shortcuts + formatDate, formatDuration
├── types/
│   └── database.ts           # Generated types dari Supabase
├── public/
│   ├── logotk.png            # Logo utama TembusKarir
│   ├── iconlogo.png          # Favicon
│   ├── gambar-beranda.png    # Hero illustration
│   ├── card-ojk.png          # Thumbnail coming soon card OJK
│   ├── card-pln.jpg          # Thumbnail coming soon card PLN
│   └── card-astra.jpg        # Thumbnail coming soon card Astra/BUMN
├── middleware.ts              # Route protection middleware
├── vercel.json               # Cron jobs config
├── CLAUDE.md                 # File ini
└── supabase/
    └── migrations/           # SQL migration files
```

---

## Database Schema

### Tabel: `users` (extend dari auth.users Supabase)
```sql
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
  category text not null check (category in ('PLN', 'ASTRA', 'BI', 'OJK', 'KEDINASAN', 'LAINNYA')),
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
  -- MCQ biasa:        [{"key":"A","text":"..."}]
  -- Berbasis poin:    [{"key":"A","text":"...","point":5}, ...] (PLN AKHLAK/LA)
  options jsonb not null,
  correct_answer text not null,  -- "A"–"E". Untuk soal berbasis poin = key dengan point tertinggi
  explanation text,
  difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  category text,                 -- kode sub-tes, mis. NUM, VER, QR
  image_url text,
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
  answers jsonb not null default '{}',   -- {"question_id": "A", ...}
  score int,
  correct_count int,
  wrong_count int,
  empty_count int,
  duration_seconds int,
  status text not null default 'ongoing' check (status in ('ongoing', 'finished')),
  started_at timestamptz default now(),
  finished_at timestamptz,
  score_details jsonb default '{}'       -- ★ WAJIB: detail per-sub-tes (PLN/ASTRA)
);
-- JALANKAN di Supabase jika belum ada:
-- ALTER TABLE public.attempts ADD COLUMN IF NOT EXISTS score_details jsonb DEFAULT '{}';
```

### Tabel: `subscriptions`
```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  midtrans_order_id text unique not null,
  midtrans_transaction_id text,
  plan_type text not null check (plan_type in ('premium_monthly', 'premium_quarterly', 'package', 'monthly', 'yearly')),
  amount int not null,
  -- 'expired' = batas waktu bayar habis (dari Midtrans expire event)
  -- 'failed'  = cancel/deny oleh user atau bank
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
  paid_at timestamptz,
  expires_at timestamptz,    -- kapan AKSES PREMIUM berakhir (bukan batas waktu bayar)
  created_at timestamptz default now()
);
```

### Tabel: `info_seleksi` (Sprint 6 — crawl otomatis)
```sql
create table public.info_seleksi (
  id uuid primary key default gen_random_uuid(),
  institusi text not null,       -- OJK, BI, PLN, RBB, ASTRA
  kategori text not null,        -- pengumuman, jadwal, soal, tips, kisi-kisi
  judul text not null,
  ringkasan text,
  url_sumber text,
  tanggal_publikasi date,
  url_hash text generated always as (md5(coalesce(url_sumber,''))) stored unique,
  crawled_at timestamptz default now(),
  is_active boolean default true
);
```

---

## Scoring per Kategori — WAJIB BENAR

Scoring berbeda per `packages.category`, semua terpusat di `computeScore()`:

| Kategori | Aturan |
|---|---|
| **PLN** (GAT) | Sub-tes MCQ (NUM/VER/SIL/DER/FIG/PU): +1 benar, 0 salah/kosong. AKHLAK & LA: berbasis poin per opsi (1–5); LA bisa `is_reverse_scored`. Soal AKHLAK/LA disimpan di tabel terpisah `questions_pln_akhlak` & `questions_pln_la`. |
| **ASTRA** (Psikotes) | Semua sub-tes (QR/DR/RC/IR/VIZ/PS/WM): +1 benar, 0 salah/kosong. Skor = jumlah benar. |
| lainnya (BI/OJK/dll.) | Simple percentage: `correctCount / total * 100`. |

**PENTING**: Semua scoring terpusat di `lib/exam-scoring.ts` → fungsi `computeScore()`.
Jangan duplikasi logika scoring di tempat lain.

---

## Row Level Security (RLS) — WAJIB AKTIF

```sql
alter table public.users enable row level security;
alter table public.packages enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.subscriptions enable row level security;

create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "packages_select_published" on public.packages for select using (is_published = true);
create policy "questions_select" on public.questions
  for select using (exists (
    select 1 from public.packages p where p.id = questions.package_id and p.is_published = true
  ));
create policy "attempts_select_own" on public.attempts for select using (auth.uid() = user_id);
create policy "attempts_insert_own" on public.attempts for insert with check (auth.uid() = user_id);
create policy "attempts_update_own" on public.attempts for update using (auth.uid() = user_id);
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
```

---

## Aturan Bisnis Kritis — JANGAN DILANGGAR

1. **Keamanan jawaban**: `correct_answer` TIDAK BOLEH dikirim ke browser. Query soal tanpa kolom ini saat ujian berlangsung.
2. **Akses premium**: cek `users.plan === 'premium'` di **server**, bukan client.
3. **Satu attempt aktif**: cek ongoing attempt sebelum buat baru.
4. **Webhook Midtrans**: verifikasi signature + double-check ke Midtrans API.
5. **Expired attempts**: gunakan `isAttemptExpired()` dari `lib/exam-scoring.ts` untuk cek.

---

## Alur Ujian (penting untuk dipahami)

```
/portal/pln (atau /portal/astra) → /persiapan/[packageId] → /ujian/[packageId] → /hasil/[attemptId]
```

Catatan: paket ASTRA & PLN memakai runner ujian khusus (`/ujian/astra/[packageId]`,
`/ujian/pln/[packageId]`); `/ujian/[packageId]` generik untuk kategori MCQ lain (BI/OJK/dll.).

- `/persiapan`: Server Component. Cek login, akses premium, ongoing attempt.
  - Jika ongoing attempt **expired** → auto-finish dengan `computeScore()` → tampil mulai baru
  - Jika ongoing attempt **aktif** → tampil "Lanjutkan" atau "Mulai Baru"
- `/ujian`: Client Component. Timer countdown, simpan jawaban ke localStorage + DB.
- Submit via `POST /api/submit` → gunakan `computeScore()` → redirect ke hasil.

---

## Konvensi Kode

### Naming
- Komponen React: PascalCase
- Fungsi/variabel: camelCase
- File non-komponen: kebab-case
- Konstanta global: SCREAMING_SNAKE_CASE

### TypeScript & Supabase
- Strict mode — tidak ada `any` kecuali workaround version mismatch
- Version mismatch `@supabase/ssr v0.5.2` vs `supabase-js v2.x` → query return `never` type → **workaround**: `(supabase.from('table') as any).select(...)`
- `createServiceClient()` dari `lib/supabase/server.ts` — **tidak butuh cookies**, aman dipakai di cron/server actions
- `createClient()` dari `lib/supabase/server.ts` — **async** (await cookies()), untuk Server Components

### Icons
- Gunakan **lucide-react** untuk semua icon UI. Tidak boleh pakai emoji keyboard sebagai icon.
- Emoji hanya boleh untuk konten teks biasa yang memang kontekstual.

### Server vs Client Components
- Default: **Server Component**
- Client Component HANYA jika perlu: state, event handler, browser API
- `/ujian/[packageId]` = Client Component (timer + state jawaban)

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # Server only!

MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx

RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@tembuskarir.id

NEXT_PUBLIC_APP_URL=https://tembuskarir.id
MIDTRANS_WEBHOOK_SECRET=xxx
CRON_SECRET=xxx                        # Untuk validasi Authorization header di cron
ADMIN_EMAILS=email@admin.com           # Comma-separated admin emails
```

---

## Keputusan Arsitektur

| Tanggal | Keputusan | Alasan |
|---|---|---|
| Sprint 1 | Supabase Auth bawaan | Production-ready, ada email verification |
| Sprint 1 | Route protection via middleware | Efisien, tidak perlu cek di tiap page |
| Sprint 1 | next.config.mjs bukan .ts | Next.js 14.2.18 tidak support .ts |
| Sprint 1 | `as` cast untuk Supabase queries | Version mismatch → never type |
| Sprint 2 | Jawaban di JSONB satu kolom | Lebih efisien untuk scale |
| Sprint 2 | Timer di client, validasi di server | Timer server tidak praktis |
| Sprint 4 | Harga re-validate server-side | Cegah price tampering dari client |
| Sprint 4 | Webhook Midtrans double-check | Signature + re-fetch untuk idempotency |
| Sprint 4 | Rate limiter in-memory (Map) | Cukup awal; ganti Redis saat multi-instance |
| Sprint 5 | Admin via ADMIN_EMAILS env var | Simpel tanpa kolom DB tambahan |
| Sprint 5 | /harga dan /portal bisa diakses publik | Calon user lihat sebelum daftar |
| Sprint 6 | Vercel Cron untuk crawl + cleanup | Otomatis, tidak perlu trigger manual |
| Sprint 6 | Dedup via url_hash (md5 generated) | Cegah duplikat saat cron ulang |
| Sprint 6 | Sistem poin per opsi (1–5) untuk PLN AKHLAK/LA | Penilaian berbasis kecenderungan, bukan benar/salah |
| Pasca-pivot | CPNS/SKD dihapus → fokus PLN/ASTRA/BUMN | CPNS dipindah ke platform terpisah (TembusASN) |
| Pasca-pivot | Langganan di-rebrand cpns_* → premium_* | Satu langganan Premium membuka semua kategori paket |
| Sprint 6 | Scoring di `lib/exam-scoring.ts` | Single source of truth, tidak duplikasi |
| Sprint 6 | Auto-finish di /persiapan guard + cron | Guard = instant UX, cron = safety net |
| Sprint 6 | Webhook expire → status 'expired' | Beda dari 'failed' (cancel/deny bank) |
| Sprint 6 | lucide-react untuk semua icon UI | Tidak pakai emoji keyboard, lebih branded |
| Sprint 6 | Card images (card-ojk.png dll) di coming soon | Asset unik, bukan emoji generik |
| Jul 2026 | Landing page dihapus — root `/` = beranda/dashboard (guest-aware) | Flow lama; mengikuti pola TembusASN. Route `/dashboard` di-redirect ke `/` via next.config.mjs. AppShell mendukung guest (CTA Masuk/Daftar via LoginModal) |

---

## Vercel Cron Jobs

```json
// vercel.json
"crons": [
  { "path": "/api/cron/crawl-seleksi", "schedule": "0 23 * * *" },  // 06:00 WIB
  { "path": "/api/cron/cleanup",        "schedule": "0 * * * *"  }   // setiap jam
]
```

- **crawl-seleksi**: crawl info rekrutmen dari OJK, PLN, RBB/BUMN, Astra
- **cleanup**: (1) auto-finish expired ongoing attempts dengan skor proper, (2) expire pending subscriptions > 48 jam

---

## Perintah yang Sering Dipakai

```bash
npm run dev                          # Dev server
npm run lint                         # ESLint
npx tsc --noEmit                     # Type check
git add -A && git commit -m "feat: [nama fitur]"
git push origin main                 # Auto-deploy Vercel

# Supabase
npx supabase gen types typescript --local > types/database.ts
```

---

## Status Progres Sprint

- [x] Sprint 1: Fondasi & Auth
- [x] Sprint 2: Mesin Ujian
- [x] Sprint 3: Dashboard & Progress (Landing Page, Profil, Leaderboard)
- [x] Sprint 4: Monetisasi (Midtrans, Resend, Rate Limiting)
- [x] Sprint 5: Admin Panel + SEO + Deploy Prep
- [x] Sprint 6: Portal Seleksi (PLN/ASTRA), Persiapan Page, Scoring per Kategori,
                Info Seleksi Crawl, Auto-finish Expired Attempts, Icon Overhaul (lucide-react)
- [x] Pasca-pivot: Hapus CPNS/SKD (pindah ke TembusASN), rebrand langganan ke Premium generik

## Hal yang Belum Dikerjakan / Backlog

- [x] SQL migration kolom `score_details` di tabel `attempts` — SUDAH ada di production (diverifikasi Jul 2026)
- [ ] Notifikasi email saat premium akan expired (H-3 sebelum expired)
- [ ] Halaman `/hasil` yang lebih detail dengan grafik radar per kategori
- [ ] Progressive Web App (PWA) untuk offline support
- [ ] Fitur catatan/bookmark soal yang persistent (saat ini hanya in-memory)
- [ ] A/B test harga paket premium
- [ ] Analytics dashboard untuk admin (jumlah ujian per hari, rata-rata skor)
