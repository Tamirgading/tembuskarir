# Instruksi Claude Code — TryOut Platform
# Baca CLAUDE.md terlebih dahulu sebelum menggunakan instruksi ini

Cara pakai:
1. Buka terminal di folder proyek
2. Jalankan: claude
3. Copy-paste instruksi di bawah SATU PER SATU secara berurutan
4. Tunggu Claude Code selesai dan test hasilnya sebelum lanjut
5. Commit ke Git setelah tiap instruksi berhasil

===============================================================
SPRINT 1 — FONDASI & AUTH
===============================================================

-----------------------------------------------------------
[S1-01] SETUP PROYEK AWAL
-----------------------------------------------------------

Saya ingin membuat proyek Next.js baru untuk platform try out ujian.
Lakukan hal berikut satu per satu:

1. Buat proyek Next.js 14 dengan perintah:
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

2. Install dependency tambahan yang dibutuhkan:
   npm install @supabase/supabase-js @supabase/ssr
   npm install -D @types/node

3. Buat struktur folder berikut (buat folder kosong dengan .gitkeep):
   - app/(auth)/login/
   - app/(auth)/register/
   - app/(auth)/lupa-password/
   - app/(main)/dashboard/
   - app/(main)/paket/
   - app/(main)/ujian/[packageId]/
   - app/(main)/hasil/[attemptId]/
   - app/(main)/profil/
   - app/api/submit/
   - app/api/webhook/midtrans/
   - components/ui/
   - components/exam/
   - components/dashboard/
   - lib/supabase/
   - types/
   - supabase/migrations/

4. Buat file .env.local dengan placeholder:
   NEXT_PUBLIC_SUPABASE_URL=GANTI_INI
   NEXT_PUBLIC_SUPABASE_ANON_KEY=GANTI_INI
   SUPABASE_SERVICE_ROLE_KEY=GANTI_INI
   NEXT_PUBLIC_APP_URL=http://localhost:3000

5. Tambahkan .env.local ke .gitignore

6. Buat file CLAUDE.md di root (saya akan paste isinya manual)

Jangan mulai coding fitur apapun dulu. Hanya setup struktur.
Setelah selesai, tampilkan struktur folder yang sudah dibuat.

-----------------------------------------------------------
[S1-02] SETUP SUPABASE CLIENT
-----------------------------------------------------------

Konteks: Proyek Next.js 14 App Router dengan TypeScript sudah ada.
Saya menggunakan Supabase sebagai backend.

Buat 3 file Supabase client sesuai pattern resmi @supabase/ssr:

1. lib/supabase/client.ts
   - Untuk dipakai di Client Components ("use client")
   - Gunakan createBrowserClient dari @supabase/ssr

2. lib/supabase/server.ts
   - Untuk dipakai di Server Components dan API Routes
   - Gunakan createServerClient dari @supabase/ssr
   - Harus handle cookies dengan benar untuk App Router

3. lib/supabase/middleware.ts
   - Helper function updateSession untuk dipakai di middleware.ts utama
   - Refresh session user secara otomatis

4. middleware.ts (di root proyek)
   - Proteksi semua route di bawah /(main)/ — redirect ke /login jika belum auth
   - Route /(auth)/ boleh diakses tanpa login
   - Route /api/webhook/ boleh diakses tanpa auth (untuk Midtrans webhook)
   - Gunakan pattern matcher yang efisien

Gunakan dokumentasi resmi @supabase/ssr untuk Next.js App Router.
Jelaskan perbedaan antara client, server, dan middleware client setelah selesai.

-----------------------------------------------------------
[S1-03] MIGRATION DATABASE
-----------------------------------------------------------

Konteks: Saya menggunakan Supabase. Buat file SQL migration untuk schema lengkap.

Buat file supabase/migrations/001_initial_schema.sql dengan isi:

1. Tabel users (extend dari auth.users):
   - id (uuid, FK ke auth.users)
   - email, full_name, avatar_url
   - plan: 'free' | 'premium' (default 'free')
   - plan_expires_at (timestamptz, nullable)
   - created_at

2. Trigger otomatis: saat user baru register di Supabase Auth,
   otomatis insert ke tabel public.users

3. Tabel packages:
   - id, name, slug (unique), category (CPNS/UTBK/KEDINASAN/LAINNYA)
   - description, duration_minutes, total_questions
   - is_free (boolean), is_published (boolean)
   - created_at

4. Tabel questions:
   - id, package_id (FK)
   - content (text), options (jsonb) — format: [{"key":"A","text":"..."}]
   - correct_answer (text), explanation (text)
   - difficulty (easy/medium/hard), category (TWK/TIU/TKP)
   - image_url (nullable), order_index, created_at

5. Tabel attempts:
   - id, user_id (FK), package_id (FK)
   - answers (jsonb) — format: {"question_uuid": "A", ...}
   - score, correct_count, wrong_count, empty_count
   - duration_seconds, status (ongoing/finished)
   - started_at, finished_at

6. Tabel subscriptions:
   - id, user_id (FK)
   - midtrans_order_id (unique), midtrans_transaction_id
   - plan_type (monthly/yearly), amount (int, Rupiah)
   - status (pending/paid/failed/expired)
   - paid_at, expires_at, created_at

7. Aktifkan Row Level Security (RLS) di semua tabel

8. Buat semua RLS policies:
   - users: select + update hanya milik sendiri
   - packages: select hanya yang is_published = true
   - questions: select dari paket yang published
   - attempts: select + insert + update hanya milik sendiri
   - subscriptions: select hanya milik sendiri

9. Buat indexes untuk performa:
   - attempts(user_id), attempts(package_id), attempts(status)
   - questions(package_id), questions(order_index)
   - subscriptions(user_id), subscriptions(status)

PENTING: correct_answer di tabel questions tetap ada di DB,
tapi RLS tidak perlu menyembunyikannya karena kita akan handle
di layer aplikasi (tidak pernah query correct_answer dari client).

-----------------------------------------------------------
[S1-04] HALAMAN LOGIN
-----------------------------------------------------------

Konteks:
- Next.js 14 App Router, TypeScript, Tailwind
- Supabase client sudah ada di lib/supabase/client.ts dan server.ts
- Route group (auth) sudah ada, tidak ada navbar di halaman ini

Buat halaman login di app/(auth)/login/page.tsx:

Requirements:
1. Form dengan field: email, password
2. Tombol "Masuk" — submit form ke Supabase Auth (signInWithPassword)
3. Link ke /register untuk user baru
4. Link ke /lupa-password
5. Tampilkan pesan error yang user-friendly jika login gagal
   (contoh: "Email atau password salah" — jangan expose error teknis)
6. Setelah login berhasil, redirect ke /dashboard
7. Jika user sudah login dan akses /login, redirect ke /dashboard
8. Loading state pada tombol saat proses login berlangsung

UI: Desain yang bersih dan profesional dengan Tailwind.
Gunakan "use client" karena ada event handler form.
Jangan install library form tambahan — gunakan React state biasa.

-----------------------------------------------------------
[S1-05] HALAMAN REGISTER
-----------------------------------------------------------

Konteks: Sama seperti S1-04. Supabase Auth sudah dikonfigurasi.

Buat halaman register di app/(auth)/register/page.tsx:

Requirements:
1. Form dengan field: nama lengkap, email, password, konfirmasi password
2. Validasi di client sebelum submit:
   - Email harus valid format
   - Password minimal 8 karakter
   - Konfirmasi password harus sama
3. Submit ke Supabase Auth (signUp) dengan metadata: { full_name }
4. Setelah register berhasil, tampilkan pesan:
   "Cek email kamu untuk verifikasi akun"
   (bukan redirect langsung — Supabase kirim email konfirmasi)
5. Link ke /login untuk yang sudah punya akun
6. Loading state saat proses berlangsung
7. Pesan error yang jelas untuk berbagai kasus (email sudah terdaftar, dll)

-----------------------------------------------------------
[S1-06] HALAMAN LUPA PASSWORD
-----------------------------------------------------------

Konteks: Supabase Auth sudah ada.

Buat app/(auth)/lupa-password/page.tsx:

1. Form dengan field email saja
2. Submit ke supabase.auth.resetPasswordForEmail()
3. Setelah submit (apapun hasilnya), tampilkan pesan sukses:
   "Jika email terdaftar, link reset password sudah dikirim"
   (jangan bedakan pesan jika email tidak terdaftar — ini security best practice)
4. Link kembali ke /login

-----------------------------------------------------------
[S1-07] LAYOUT UTAMA DAN NAVBAR
-----------------------------------------------------------

Konteks: Route group (main) untuk semua halaman setelah login.

Buat app/(main)/layout.tsx dengan:
1. Navbar yang berisi:
   - Logo/nama platform (kiri)
   - Link navigasi: Beranda, Paket Soal, Dashboard (tengah/kiri)
   - Nama user + avatar (kanan)
   - Tombol "Keluar" yang memanggil supabase.auth.signOut() lalu redirect /login
2. Fetch data user dari Supabase di server (pakai lib/supabase/server.ts)
3. Pass data user ke komponen Navbar via props
4. Buat komponen Navbar sebagai Client Component terpisah
   di components/ui/Navbar.tsx (butuh event handler untuk logout)
5. Design yang bersih dan responsif

-----------------------------------------------------------
[S1-08] SEED DATA AWAL & HALAMAN PAKET
-----------------------------------------------------------

Konteks: Schema database sudah ada. Saya ingin ada data untuk testing.

Bagian A — Buat file supabase/seed.sql:
Insert 2 paket contoh:
- "Try Out CPNS SKD Seri 1" (gratis, 30 soal, 30 menit, CPNS)
- "Try Out CPNS SKD Seri 2" (premium, 100 soal, 90 menit, CPNS)

Insert 10 soal contoh untuk paket pertama:
- Mix 3 soal TWK, 4 soal TIU, 3 soal TKP
- Setiap soal: content, 5 pilihan (A-E), correct_answer, explanation
- Buat soal yang realistis tentang CPNS (bisa dibuat sendiri, tidak perlu soal asli)

Bagian B — Buat halaman app/(main)/paket/page.tsx:
- Server Component — fetch semua paket yang is_published = true
- Tampilkan sebagai card grid: nama, kategori, jumlah soal, durasi
- Badge "GRATIS" atau "PREMIUM" di tiap card
- Tombol "Mulai Try Out" yang link ke /ujian/[packageId]
- Jika paket premium dan user masih free, tombol berubah jadi "Upgrade Premium"

===============================================================
SPRINT 2 — MESIN UJIAN
===============================================================

-----------------------------------------------------------
[S2-01] HALAMAN UJIAN — ENGINE SOAL
-----------------------------------------------------------

Konteks:
- Schema database sudah ada sesuai CLAUDE.md
- Supabase client sudah dikonfigurasi
- ATURAN KRITIS: correct_answer TIDAK BOLEH dikirim ke client/browser

Buat halaman ujian di app/(main)/ujian/[packageId]/page.tsx:

Ini adalah Client Component ("use client") karena butuh state dan timer.

Alur yang harus diimplementasikan:
1. Saat halaman load (useEffect):
   a. Fetch data paket dari Supabase (nama, durasi, total soal)
   b. Fetch soal-soal: SELECT id, content, options, order_index FROM questions
      WHERE package_id = X ORDER BY order_index
      JANGAN select correct_answer di sini
   c. Cek apakah ada attempt ongoing untuk user ini + paket ini
      - Jika ada: lanjutkan attempt tersebut, restore sisa waktu
      - Jika tidak: buat attempt baru dengan INSERT ke tabel attempts

2. State yang dibutuhkan:
   - currentQuestionIndex (nomor soal aktif)
   - answers: Record<string, string> — { question_id: "A" }
   - timeLeft: number (detik)
   - attemptId: string
   - isSubmitting: boolean

3. Timer countdown:
   - Hitung sisa waktu dari started_at + duration_minutes
   - Tampilkan dalam format MM:SS
   - Jika waktu habis, auto-submit

4. UI halaman ujian:
   - Header: nama paket, timer, progress (soal X dari Y)
   - Navigasi soal: grid tombol nomor soal (warna beda jika sudah dijawab)
   - Card soal: nomor, konten soal, 5 pilihan jawaban (radio button style)
   - Tombol "Sebelumnya" dan "Berikutnya"
   - Tombol "Selesai & Submit" dengan konfirmasi dialog

5. Saat user klik pilihan jawaban:
   - Update state answers secara lokal
   - Simpan ke localStorage sebagai backup (key: attempt_${attemptId})

6. Saat submit (tombol atau waktu habis):
   - Set isSubmitting = true (disable semua tombol)
   - Kirim ke API route POST /api/submit dengan body: { attemptId, answers }
   - Setelah dapat response sukses, redirect ke /hasil/[attemptId]

-----------------------------------------------------------
[S2-02] API ROUTE SUBMIT JAWABAN
-----------------------------------------------------------

Konteks:
- Ini adalah inti keamanan platform — pengecekan jawaban di server
- Jangan pernah kirim correct_answer ke client

Buat app/api/submit/route.ts:

Handler POST:
1. Ambil session user dari Supabase — jika tidak ada session, return 401
2. Parse body request: { attemptId, answers }
3. Validasi: attemptId harus ada dan milik user yang sedang login
4. Cek status attempt: jika sudah 'finished', return 400 (jangan proses ulang)
5. Fetch semua soal untuk paket attempt ini:
   SELECT id, correct_answer FROM questions WHERE package_id = X
   (ini aman karena di server, tidak dikirim ke client)
6. Hitung skor:
   - Untuk setiap soal, bandingkan answers[question_id] dengan correct_answer
   - correct_count = jumlah yang benar
   - wrong_count = jumlah yang salah (ada jawaban tapi salah)
   - empty_count = jumlah yang tidak dijawab
   - score = Math.round((correct_count / total_questions) * 100)
7. Hitung duration_seconds dari attempt.started_at sampai sekarang
8. Update tabel attempts:
   SET answers = $answers,
       score = $score,
       correct_count = $correct_count,
       wrong_count = $wrong_count,
       empty_count = $empty_count,
       duration_seconds = $duration_seconds,
       status = 'finished',
       finished_at = now()
9. Return: { success: true, attemptId, score }

Gunakan Supabase service role client untuk operasi ini
(bukan anon client) agar bisa bypass RLS untuk write.
PENTING: Tetap validasi bahwa attempt milik user yang login.

-----------------------------------------------------------
[S2-03] HALAMAN HASIL UJIAN
-----------------------------------------------------------

Konteks:
- User baru saja submit ujian dan di-redirect ke sini
- Attempt sudah berstatus 'finished' di database

Buat app/(main)/hasil/[attemptId]/page.tsx sebagai Server Component:

1. Fetch data attempt berdasarkan attemptId
   - Validasi: attempt harus milik user yang login (RLS sudah handle ini)
   - Jika not found atau bukan milik user ini: redirect ke /dashboard
   - Jika status masih 'ongoing': redirect ke /ujian/[packageId]

2. Fetch soal-soal paket beserta correct_answer dan explanation
   (ini aman karena Server Component, tidak expose ke browser)

3. Tampilkan halaman hasil:

   Section A — Ringkasan:
   - Skor besar di tengah (misal: "78")
   - Badge: "LULUS" (≥75) atau "BELUM LULUS" (<75) — sesuaikan threshold
   - Statistik: Benar X | Salah Y | Kosong Z | Waktu: MM:SS

   Section B — Review per soal (accordion atau list):
   - Nomor soal + konten soal
   - Jawaban user (highlight hijau jika benar, merah jika salah)
   - Jawaban yang benar (selalu ditampilkan)
   - Penjelasan (collapsible)

   Section C — Aksi:
   - Tombol "Coba Lagi" → link ke /ujian/[packageId]
   - Tombol "Kembali ke Paket" → link ke /paket
   - Tombol "Lihat Dashboard" → link ke /dashboard

-----------------------------------------------------------
[S2-04] HALAMAN DASHBOARD USER
-----------------------------------------------------------

Konteks: User sudah bisa mengerjakan ujian dan ada data di tabel attempts.

Buat app/(main)/dashboard/page.tsx sebagai Server Component:

Fetch data untuk user yang sedang login:
1. Data user (nama, plan, plan_expires_at)
2. Semua attempts yang sudah finished, join dengan packages (nama paket)
3. Statistik agregat

Tampilkan:
Section A — Sambutan + status akun:
- "Halo, [nama]!"
- Badge plan: "Akun Gratis" atau "Premium aktif hingga [tanggal]"

Section B — Statistik ringkas (4 kartu):
- Total ujian dikerjakan
- Rata-rata skor semua ujian
- Skor tertinggi yang pernah dicapai
- Ujian dikerjakan bulan ini

Section C — Riwayat ujian (tabel):
- Kolom: Nama Paket, Tanggal, Skor, Benar/Salah/Kosong, Aksi
- Aksi: tombol "Lihat Hasil" → /hasil/[attemptId]
- Sort by tanggal terbaru
- Tampilkan maksimal 10 terbaru, dengan link "Lihat semua"

Section D — Analisis kelemahan (jika ada cukup data, minimal 3 attempt):
- Hitung akurasi per kategori (TWK, TIU, TKP) dari semua attempt
- Tampilkan sebagai progress bar sederhana
- Highlight kategori dengan akurasi terendah

===============================================================
SPRINT 3 — POLISH & ENGAGEMENT
===============================================================

-----------------------------------------------------------
[S3-01] LANDING PAGE
-----------------------------------------------------------

Konteks: Ini adalah halaman pertama yang dilihat pengunjung belum login.
Ubah app/page.tsx menjadi landing page profesional.

Buat landing page dengan sections:

1. Hero section:
   - Headline: "Persiapkan CPNS Kamu dengan Try Out Terbaik"
   - Sub-headline: manfaat singkat (3-5 kata)
   - Dua tombol CTA: "Mulai Gratis" (→ /register) dan "Lihat Paket" (→ /paket)
   - Jika user sudah login, tampilkan "Ke Dashboard" saja

2. Fitur unggulan (3 kartu):
   - Soal berkualitas: penjelasan pembahasan lengkap
   - Timer realistis: simulasi kondisi ujian sesungguhnya
   - Analisis progress: pantau perkembangan belajarmu

3. Statistik platform (bisa hardcode dulu):
   - X+ soal tersedia, Y+ pengguna aktif, dll

4. Section paket (fetch 3 paket pertama dari DB):
   - Preview card tiap paket dengan tombol CTA

5. FAQ sederhana (5 pertanyaan umum, accordion)

6. Footer: nama platform, link penting, copyright

Desain: bersih, profesional, warna yang konsisten.
Jangan install library animasi — Tailwind cukup.

-----------------------------------------------------------
[S3-02] HALAMAN PROFIL USER
-----------------------------------------------------------

Buat app/(main)/profil/page.tsx:

Section A — Informasi profil (Server Component untuk fetch, Client untuk form):
- Tampilkan foto avatar (jika ada), nama, email
- Form edit nama lengkap
- Tombol upload foto (simpan ke Supabase Storage bucket 'avatars')
- Setelah upload, update avatar_url di tabel users

Section B — Keamanan:
- Form ganti password (password lama, baru, konfirmasi)
- Gunakan supabase.auth.updateUser()

Section C — Status langganan:
- Tampilkan plan saat ini dan tanggal kadaluarsa
- Jika free: tombol "Upgrade ke Premium"
- Jika premium: info kapan expire dan tombol "Perpanjang"

-----------------------------------------------------------
[S3-03] LEADERBOARD
-----------------------------------------------------------

Buat app/(main)/paket/[packageId]/leaderboard/page.tsx:

1. Tampilkan 20 skor tertinggi untuk paket tertentu
2. Query: SELECT u.full_name, u.avatar_url, MAX(a.score) as best_score,
          COUNT(a.id) as attempt_count
   FROM attempts a JOIN users u ON a.user_id = u.id
   WHERE a.package_id = X AND a.status = 'finished'
   GROUP BY u.id, u.full_name, u.avatar_url
   ORDER BY best_score DESC LIMIT 20
3. Highlight baris jika itu user yang sedang login
4. Tampilkan rank, avatar, nama, skor terbaik, jumlah percobaan
5. Tambahkan link ke leaderboard dari halaman paket

===============================================================
SPRINT 4 — MONETISASI
===============================================================

-----------------------------------------------------------
[S4-01] INTEGRASI MIDTRANS
-----------------------------------------------------------

Konteks:
- Midtrans Snap API untuk payment
- MIDTRANS_SERVER_KEY dan NEXT_PUBLIC_MIDTRANS_CLIENT_KEY sudah ada di .env.local
- Tabel subscriptions sudah ada di schema

Install dependency:
npm install midtrans-client

Buat app/api/payment/create/route.ts (POST):
1. Verifikasi user login
2. Parse body: { planType } — 'monthly' atau 'yearly'
3. Tentukan harga:
   - monthly: Rp 49.000
   - yearly: Rp 399.000
4. Generate order_id unik: `TRYOUT-${userId}-${timestamp}`
5. Insert ke tabel subscriptions dengan status 'pending'
6. Panggil Midtrans Snap API untuk generate transaction_token
7. Return: { token, orderId }

Buat app/api/webhook/midtrans/route.ts (POST):
1. Verifikasi signature Midtrans:
   SHA512(orderId + statusCode + grossAmount + serverKey) === signature_key
2. Jika signature tidak valid: return 400
3. Cek transaction_status:
   - 'capture' atau 'settlement': pembayaran berhasil
   - 'deny', 'cancel', 'expire': pembayaran gagal
4. Jika berhasil:
   a. Update subscriptions: status='paid', paid_at=now(), expires_at=(+30 hari atau +365 hari)
   b. Update users: plan='premium', plan_expires_at=(sama dengan expires_at)
5. Return 200

Buat komponen PaymentButton di components/ui/PaymentButton.tsx:
- Client Component
- Load Midtrans Snap JS dari CDN
- Saat klik, call API create payment, dapat token, buka Snap popup
- Handle callback: onSuccess, onPending, onError

-----------------------------------------------------------
[S4-02] HALAMAN HARGA
-----------------------------------------------------------

Buat app/harga/page.tsx (bisa diakses tanpa login):

Tampilkan 2 kolom pricing:

Paket Gratis (highlight jika user belum login):
- Rp 0 / selamanya
- Fitur: akses paket gratis, maks 3 ujian per hari, lihat skor

Paket Premium (highlight jika user sudah login):
- Rp 49.000 / bulan atau Rp 399.000 / tahun (hemat 32%)
- Fitur: semua paket, unlimited ujian, analisis detail, pembahasan lengkap
- Tombol "Berlangganan Sekarang" yang buka modal payment
- Jika user belum login: redirect ke /register

Sertakan FAQ singkat tentang pembayaran (3-4 poin).

-----------------------------------------------------------
[S4-03] EMAIL TRANSAKSIONAL
-----------------------------------------------------------

Konteks: Gunakan Resend untuk kirim email.
npm install resend

Buat lib/resend.ts dengan fungsi-fungsi:

1. sendWelcomeEmail(to, name):
   Kirim saat user pertama kali verifikasi email
   Subject: "Selamat datang di [Platform]!"
   Isi: ucapan selamat, link mulai try out, tip pertama

2. sendPaymentSuccessEmail(to, name, planType, expiresAt):
   Kirim setelah webhook Midtrans konfirmasi pembayaran
   Subject: "Pembayaran berhasil — akun Premium aktif!"
   Isi: detail langganan, tanggal aktif, tanggal berakhir

3. sendExpiryReminderEmail(to, name, expiresAt):
   Kirim 7 hari sebelum premium berakhir (butuh cron job — bisa pakai Vercel Cron)
   Subject: "Langganan Premium kamu akan segera berakhir"
   Isi: info tanggal berakhir, tombol perpanjang

Panggil sendPaymentSuccessEmail dari webhook Midtrans setelah update DB.

-----------------------------------------------------------
[S4-04] RATE LIMITING & KEAMANAN PRODUKSI
-----------------------------------------------------------

Konteks: Sebelum launch, tambahkan proteksi dari abuse.

1. Install: npm install @upstash/ratelimit @upstash/redis
   (Upstash Redis punya free tier yang cukup)

2. Buat lib/ratelimit.ts:
   - limit untuk /api/submit: 10 request per user per menit
   - limit untuk /api/payment: 5 request per user per jam

3. Tambahkan rate limit check di kedua API route tersebut

4. Tambahkan security headers di next.config.js:
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin

5. Buat app/api/health/route.ts:
   - GET endpoint yang return { status: 'ok', timestamp }
   - Untuk monitoring uptime (bisa dihubungkan ke UptimeRobot gratis)

-----------------------------------------------------------
[S4-05] ERROR MONITORING & ANALYTICS
-----------------------------------------------------------

1. Setup Sentry:
   npx @sentry/wizard@latest -i nextjs
   Ikuti wizard — ini otomatis konfigurasi Sentry untuk Next.js
   Pastikan error di server (API routes) dan client (browser) keduanya ter-track

2. Tambahkan custom error boundary di app/error.tsx dan app/global-error.tsx

3. Vercel Analytics:
   npm install @vercel/analytics
   Import <Analytics /> di app/layout.tsx
   Ini gratis dan sudah built-in dengan Vercel

-----------------------------------------------------------
[S4-06] LOAD TEST SEBELUM LAUNCH
-----------------------------------------------------------

Sebelum launch, saya ingin pastikan sistem kuat.

Bantu saya membuat script load test sederhana menggunakan k6:

1. Buat folder loadtest/ dengan file test.js
2. Skenario yang ditest:
   - 100 user concurrent login bersamaan
   - 50 user concurrent mengerjakan ujian (fetch soal)
   - 20 user concurrent submit jawaban bersamaan
3. Target: p95 response time < 2 detik untuk semua endpoint
4. Berikan instruksi cara install k6 dan cara jalankan test ini

===============================================================
INSTRUKSI TAMBAHAN — KAPANPUN DIBUTUHKAN
===============================================================

-----------------------------------------------------------
[EXTRA-01] GENERATE TYPESCRIPT TYPES DARI SUPABASE
-----------------------------------------------------------

Generate TypeScript types dari schema Supabase lokal:
npx supabase gen types typescript --local > types/database.ts

Setelah itu, update semua file yang query Supabase untuk menggunakan
types yang sudah digenerate. Tunjukkan contoh cara pakai yang benar
untuk tabel users dan attempts.

-----------------------------------------------------------
[EXTRA-02] OPTIMASI QUERY DATABASE
-----------------------------------------------------------

Konteks: Saya sudah punya data cukup banyak dan ingin memastikan
query efisien untuk skala 50.000 user.

Analisis file-file yang berisi query Supabase di proyek ini.
Identifikasi:
1. Query yang berpotensi N+1 (fetch satu per satu dalam loop)
2. Query yang butuh index tambahan
3. Query yang bisa di-cache dengan Next.js unstable_cache

Berikan rekomendasi spesifik dengan contoh kode perbaikannya.

-----------------------------------------------------------
[EXTRA-03] ADMIN PANEL SEDERHANA
-----------------------------------------------------------

Konteks: Saya butuh halaman admin untuk manage soal tanpa harus
buka Supabase Studio setiap saat.

Buat halaman admin sederhana di app/(admin)/admin/:
1. Middleware khusus: hanya email tertentu yang bisa akses
   (hardcode email admin di env variable: ADMIN_EMAILS=email@kamu.com)
2. app/(admin)/admin/page.tsx — dashboard admin:
   - Total user, total attempts, revenue bulan ini (dari subscriptions)
3. app/(admin)/admin/soal/page.tsx — list semua soal dengan filter per paket
4. app/(admin)/admin/soal/tambah/page.tsx — form tambah soal baru:
   - Pilih paket, input soal, 5 pilihan jawaban, tandai yang benar, penjelasan
5. app/(admin)/admin/soal/[id]/page.tsx — edit soal yang sudah ada

-----------------------------------------------------------
[EXTRA-04] EXPORT HASIL UJIAN KE PDF
-----------------------------------------------------------

Konteks: User ingin bisa download hasil ujian mereka sebagai PDF.

Install: npm install @react-pdf/renderer

Buat app/api/export/[attemptId]/route.ts (GET):
1. Fetch data attempt + soal + jawaban (di server)
2. Generate PDF dengan layout:
   - Header: nama user, nama paket, tanggal
   - Ringkasan skor
   - Detail tiap soal: konten, jawaban user, jawaban benar, penjelasan
3. Return sebagai PDF download response

Tambahkan tombol "Download PDF" di halaman hasil ujian.
===============================================================
```
