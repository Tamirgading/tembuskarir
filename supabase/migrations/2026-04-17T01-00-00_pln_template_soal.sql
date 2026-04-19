-- ============================================================
-- TEMPLATE SOAL — GAT PLN Paket 1
-- ============================================================
-- Cara pakai:
--   1. PASTIKAN migration schema sudah dijalankan
--      (file 2026-04-17T00-00-00_pln_tables.sql)
--   2. Ambil package_id paket "GAT PLN Paket 1" dari tabel packages,
--      atau langsung pakai subquery seperti contoh di bawah.
--   3. Duplicate baris template sesuai jumlah soal per subtes.
--   4. Isi content, options, correct_answer (atau point_*) dari docx.
--   5. Execute.
--
-- Format per subtes (ringkas):
--   NUM, VER, SIL, DER, FIG, PU  → tabel `questions`   (MCQ standar)
--   AKHLAK                       → tabel `questions_pln_akhlak` (point-based)
--   LA                           → tabel `questions_pln_la`     (point-based, ada reverse-scored)
-- ============================================================

-- ── TEMPLATE VARIABLE ──────────────────────────────────────────────────────
-- Ganti slug di subquery jika nama paket berbeda
-- Semua INSERT di bawah memakai subquery ini untuk ambil package_id otomatis


-- ============================================================
-- 1. SUBTES NUMERIK (NUM) — 30 soal, tabel questions
-- ============================================================
-- options format: [{"key":"A","text":"..."},{"key":"B","text":"..."},...]
-- correct_answer: salah satu 'A'|'B'|'C'|'D'|'E'
insert into public.questions (package_id, content, options, correct_answer, explanation, category, order_index) values
-- soal 1 (TEMPLATE — GANTI dari docx)
(
  (select id from public.packages where slug = 'gat-pln-paket-1'),
  'Jika x + 3 = 10, maka nilai x adalah ...',
  '[{"key":"A","text":"5"},{"key":"B","text":"6"},{"key":"C","text":"7"},{"key":"D","text":"8"},{"key":"E","text":"9"}]'::jsonb,
  'C',
  'x = 10 - 3 = 7',
  'NUM',
  1
)
-- tambahkan baris soal 2, 3, ..., 30 di sini dengan koma pemisah
-- contoh tambahan:
-- ,(
--   (select id from public.packages where slug = 'gat-pln-paket-1'),
--   'Soal numerik berikutnya...',
--   '[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."},{"key":"E","text":"..."}]'::jsonb,
--   'B', 'Penjelasan singkat', 'NUM', 2
-- )
;


-- ============================================================
-- 2. SUBTES VERBAL (VER) — 30 soal, tabel questions
-- ============================================================
insert into public.questions (package_id, content, options, correct_answer, explanation, category, order_index) values
(
  (select id from public.packages where slug = 'gat-pln-paket-1'),
  'Sinonim kata KULMINASI adalah ...',
  '[{"key":"A","text":"Permulaan"},{"key":"B","text":"Puncak"},{"key":"C","text":"Akhir"},{"key":"D","text":"Tengah"},{"key":"E","text":"Awal"}]'::jsonb,
  'B',
  'Kulminasi = titik puncak / klimaks',
  'VER',
  1
)
-- tambahkan soal verbal lainnya di sini
;


-- ============================================================
-- 3. SUBTES SILOGISME (SIL) — 15 soal, tabel questions
-- ============================================================
insert into public.questions (package_id, content, options, correct_answer, explanation, category, order_index) values
(
  (select id from public.packages where slug = 'gat-pln-paket-1'),
  E'Premis 1: Semua pegawai PLN adalah pekerja profesional.\nPremis 2: Andi adalah pegawai PLN.\nKesimpulan yang BENAR adalah ...',
  '[{"key":"A","text":"Andi bukan pekerja profesional"},{"key":"B","text":"Andi adalah pekerja profesional"},{"key":"C","text":"Semua pekerja profesional adalah pegawai PLN"},{"key":"D","text":"Andi tidak bekerja di PLN"},{"key":"E","text":"Tidak ada kesimpulan valid"}]'::jsonb,
  'B',
  'Modus ponens: semua A adalah B, x adalah A, maka x adalah B',
  'SIL',
  1
)
-- catatan: gunakan E'...\n...' untuk baris baru (SQL escape)
;


-- ============================================================
-- 4. SUBTES DERET ANGKA (DER) — 15 soal, tabel questions
-- ============================================================
insert into public.questions (package_id, content, options, correct_answer, explanation, category, order_index) values
(
  (select id from public.packages where slug = 'gat-pln-paket-1'),
  '2, 4, 8, 16, 32, ...',
  '[{"key":"A","text":"48"},{"key":"B","text":"56"},{"key":"C","text":"64"},{"key":"D","text":"72"},{"key":"E","text":"96"}]'::jsonb,
  'C',
  'Deret geometri rasio 2: 32 × 2 = 64',
  'DER',
  1
)
;


-- ============================================================
-- 5. SUBTES FIGURAL (FIG) — 20 soal, tabel questions
-- ============================================================
-- Untuk soal figural yang butuh gambar: set image_url ke URL gambar
-- (misal disimpan di Supabase Storage)
insert into public.questions (package_id, content, options, correct_answer, explanation, category, image_url, order_index) values
(
  (select id from public.packages where slug = 'gat-pln-paket-1'),
  'Perhatikan pola pada gambar. Gambar yang sesuai melanjutkan pola adalah ...',
  '[{"key":"A","text":"Opsi A"},{"key":"B","text":"Opsi B"},{"key":"C","text":"Opsi C"},{"key":"D","text":"Opsi D"},{"key":"E","text":"Opsi E"}]'::jsonb,
  'C',
  'Pola rotasi 90° searah jarum jam',
  'FIG',
  null, -- ganti dengan URL gambar jika ada
  1
)
;


-- ============================================================
-- 6. SUBTES PENGETAHUAN UMUM PLN (PU) — 20 soal, tabel questions
-- ============================================================
insert into public.questions (package_id, content, options, correct_answer, explanation, category, order_index) values
(
  (select id from public.packages where slug = 'gat-pln-paket-1'),
  'PT PLN (Persero) resmi berdiri sebagai Perseroan pada tanggal ...',
  '[{"key":"A","text":"27 Oktober 1945"},{"key":"B","text":"1 Januari 1961"},{"key":"C","text":"27 Oktober 1994"},{"key":"D","text":"1 Juni 1994"},{"key":"E","text":"17 Agustus 1945"}]'::jsonb,
  'C',
  'PT PLN (Persero) berdiri 27 Oktober 1994 berdasarkan PP No. 23/1994',
  'PU',
  1
)
;


-- ============================================================
-- 7. SUBTES LEARNING AGILITY (LA) — 40 soal, tabel questions_pln_la
-- ============================================================
-- Format: 5 opsi dengan poin 1–5 per opsi
-- Pilih point tertinggi = respon paling tepat untuk LA
-- is_reverse_scored = true jika pernyataan negatif (contoh: "Saya menolak perubahan")
-- dimension: 'mental' | 'people' | 'change' | 'results' | 'self'
insert into public.questions_pln_la (package_id, content, opt_a, opt_b, opt_c, opt_d, opt_e, point_a, point_b, point_c, point_d, point_e, dimension, is_reverse_scored, order_index) values
(
  (select id from public.packages where slug = 'gat-pln-paket-1'),
  'Ketika perusahaan menerapkan sistem kerja baru yang belum saya kuasai, yang saya lakukan adalah ...',
  'Menunggu arahan lengkap dari atasan',
  'Mencoba-coba sendiri sambil belajar dari rekan',
  'Mengikuti pelatihan formal yang disediakan perusahaan',
  'Berinisiatif mempelajari dokumentasi & bereksperimen',
  'Mengajukan keberatan karena merasa tidak siap',
  2,  -- A: pasif
  3,  -- B: reaktif
  4,  -- C: formal learning
  5,  -- D: proaktif + eksploratif (ideal LA)
  1,  -- E: resisten
  'change',
  false,
  1
)
-- contoh soal dengan reverse_scored = true:
-- ,(
--   (select id from public.packages where slug = 'gat-pln-paket-1'),
--   'Saya merasa tidak nyaman bekerja di lingkungan yang sering berubah.',
--   'Sangat setuju', 'Setuju', 'Netral', 'Tidak setuju', 'Sangat tidak setuju',
--   1, 2, 3, 4, 5,  -- akan di-reverse jadi: 5, 4, 3, 2, 1
--   'change', true, 2
-- )
;


-- ============================================================
-- 8. SUBTES AKHLAK — 40 soal, tabel questions_pln_akhlak
-- ============================================================
-- 6 core values BUMN: Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif
-- value_tag = value yang paling relevan dengan soal
-- point_* = nilai opsi 1-5 (opsi dengan point tertinggi = paling merefleksikan AKHLAK)
insert into public.questions_pln_akhlak (package_id, content, opt_a, opt_b, opt_c, opt_d, opt_e, point_a, point_b, point_c, point_d, point_e, value_tag, explanation, order_index) values
(
  (select id from public.packages where slug = 'gat-pln-paket-1'),
  'Rekan kerja Anda melakukan kesalahan fatal yang merugikan perusahaan, tetapi ia memohon agar Anda menutupinya dari atasan. Sikap Anda sebagai insan PLN adalah ...',
  'Menutupi kesalahan demi persahabatan',
  'Ikut menutupi, tapi memberi nasihat agar tidak diulangi',
  'Diam saja — bukan urusan saya',
  'Mendorong rekan melapor sendiri, jika tidak saya laporkan',
  'Langsung melapor ke atasan tanpa bicara dengan rekan',
  1,  -- A: tidak amanah
  2,  -- B: kompromi tidak tepat
  2,  -- C: pasif
  5,  -- D: paling amanah + harmonis (beri kesempatan, tapi tetap jujur)
  3,  -- E: amanah tapi kurang harmonis
  'amanah',
  'Amanah = memegang kepercayaan & jujur. Tapi harmonis juga penting → beri rekan kesempatan lapor dulu.',
  1
)
;


-- ============================================================
-- PENTING: Update total_questions di packages setelah semua soal diinsert
-- ============================================================
-- Contoh (jalankan SETELAH semua soal masuk):
-- update public.packages set total_questions = (
--   (select count(*) from public.questions where package_id = packages.id) +
--   (select count(*) from public.questions_pln_akhlak where package_id = packages.id) +
--   (select count(*) from public.questions_pln_la where package_id = packages.id)
-- ) where slug = 'gat-pln-paket-1';
