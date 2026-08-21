/**
 * seed-rbb-tahap1-pilot.ts
 * Pilot Fase 1 — paket "Simulasi RBB BUMN Tahap 1" dengan package_sections.
 *
 * Struktur sesuai tes asli:
 *   TKD (VLR 25/18m, NS 25/27m, WC 25/9m, DIAG 25/20m) — passing grade 58/100
 *   AKHLAK (90/30m, 2 opsi, timer 20 dtk/soal)          — passing grade 65/90
 *   TWK (10/10m)                                         — passing grade 50/10
 *
 * CATATAN:
 *  - Jumlah soal di sini adalah CONTOH (5/seksi). Konten asli diimpor di Fase 2.
 *  - PRASYARAT: tabel package_sections harus sudah dibuat (jalankan migration
 *    supabase/migrations/2026-08-21T01-00-00_package_sections.sql di SQL Editor).
 *
 * Jalankan: npx tsx scripts/seed-rbb-tahap1-pilot.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx)
  const val = trimmed.slice(eqIdx + 1)
  if (!process.env[key]) process.env[key] = val
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SLUG = 'rbb-bumn-tahap-1'
const NAME = 'Simulasi RBB BUMN Tahap 1'

interface SectionSeed {
  kode: string
  nama: string
  timer_mode: 'section' | 'per_question'
  timer_seconds: number
  group_kode: string | null
  passing_grade: number | null
}

interface QuestionSeed {
  content: string
  options: { key: string; text: string }[]
  correct_answer: string
  explanation: string
  category: string
  order_index: number
}

const SECTIONS: SectionSeed[] = [
  { kode: 'TKD-VLR', nama: 'Tes Kemampuan Dasar — Verbal Logical Reasoning', timer_mode: 'section', timer_seconds: 18 * 60, group_kode: 'TKD', passing_grade: 58 },
  { kode: 'TKD-NS',  nama: 'Tes Kemampuan Dasar — Number Sequence',           timer_mode: 'section', timer_seconds: 27 * 60, group_kode: 'TKD', passing_grade: null },
  { kode: 'TKD-WC',  nama: 'Tes Kemampuan Dasar — Word Classification',        timer_mode: 'section', timer_seconds: 9 * 60,  group_kode: 'TKD', passing_grade: null },
  { kode: 'TKD-DIAG',nama: 'Tes Kemampuan Dasar — Diagram Reasoning',          timer_mode: 'section', timer_seconds: 20 * 60, group_kode: 'TKD', passing_grade: null },
  { kode: 'AKHLAK',  nama: 'Tes AKHLAK',                                       timer_mode: 'per_question', timer_seconds: 20, group_kode: null, passing_grade: 65 },
  { kode: 'TWK',     nama: 'Tes Wawasan Kebangsaan',                           timer_mode: 'section', timer_seconds: 10 * 60, group_kode: null, passing_grade: 50 },
]

const QUESTIONS: QuestionSeed[] = [
  // ── TKD-VLR ──
  { category: 'TKD-VLR', order_index: 1, content: 'Semua pegawai BUMN wajib menjaga integritas. Budi adalah pegawai BUMN. Maka...', options: [
    { key: 'A', text: 'Budi wajib menjaga integritas' },
    { key: 'B', text: 'Budi tidak wajib menjaga integritas' },
    { key: 'C', text: 'Budi pasti seorang direktur' },
    { key: 'D', text: 'Tidak dapat disimpulkan' },
    { key: 'E', text: 'Semua pegawai pasti jujur' },
  ], correct_answer: 'A', explanation: 'Silogisme: semua pegawai BUMN → integritas. Budi pegawai BUMN, maka Budi wajib menjaga integritas (modus ponens).' },
  { category: 'TKD-VLR', order_index: 2, content: 'Sinonim dari kata "inisiatif" adalah...', options: [
    { key: 'A', text: 'Prakarsa' }, { key: 'B', text: 'Kelalaian' }, { key: 'C', text: 'Hambatan' }, { key: 'D', text: 'Penundaan' }, { key: 'E', text: 'Keengganan' },
  ], correct_answer: 'A', explanation: 'Inisiatif = prakarsa; melakukan sesuatu atas kemauan sendiri tanpa menunggu perintah.' },
  { category: 'TKD-VLR', order_index: 3, content: 'Sebagian besar pelamar lolos seleksi administrasi. Rina adalah seorang pelamar. Maka...', options: [
    { key: 'A', text: 'Rina pasti lolos seleksi administrasi' },
    { key: 'B', text: 'Rina mungkin lolos seleksi administrasi' },
    { key: 'C', text: 'Rina pasti tidak lolos' },
    { key: 'D', text: 'Semua pelamar lolos' },
    { key: 'E', text: 'Tidak ada informasi yang berguna' },
  ], correct_answer: 'B', explanation: 'Premis "sebagian besar" tidak menjamin satu individu tertentu; kesimpulan yang valid adalah kemungkinan.' },
  { category: 'TKD-VLR', order_index: 4, content: 'Antonim dari kata "komprehensif" adalah...', options: [
    { key: 'A', text: 'Menyeluruh' }, { key: 'B', text: 'Parsial' }, { key: 'C', text: 'Tuntas' }, { key: 'D', text: 'Luas' }, { key: 'E', text: 'Rinci' },
  ], correct_answer: 'B', explanation: 'Komprehensif = menyeluruh; lawannya parsial = sebagian/sepenggal.' },
  { category: 'TKD-VLR', order_index: 5, content: 'Dokter : Pasien = Guru : ...', options: [
    { key: 'A', text: 'Murid' }, { key: 'B', text: 'Hukuman' }, { key: 'C', text: 'Papan tulis' }, { key: 'D', text: 'Sekolah' }, { key: 'E', text: 'Ujian' },
  ], correct_answer: 'A', explanation: 'Dokter melayani pasien; guru melayani/mendidik murid. Hubungan profesi → orang yang dilayani.' },

  // ── TKD-NS ──
  { category: 'TKD-NS', order_index: 1, content: 'Lanjutkan deret: 2, 4, 8, 16, ...', options: [
    { key: 'A', text: '24' }, { key: 'B', text: '30' }, { key: 'C', text: '32' }, { key: 'D', text: '36' }, { key: 'E', text: '40' },
  ], correct_answer: 'C', explanation: 'Pola dikali 2: 16 × 2 = 32.' },
  { category: 'TKD-NS', order_index: 2, content: 'Lanjutkan deret: 3, 6, 12, 24, 48, ...', options: [
    { key: 'A', text: '72' }, { key: 'B', text: '84' }, { key: 'C', text: '90' }, { key: 'D', text: '96' }, { key: 'E', text: '108' },
  ], correct_answer: 'D', explanation: 'Pola dikali 2: 48 × 2 = 96.' },
  { category: 'TKD-NS', order_index: 3, content: 'Lanjutkan deret Fibonacci: 1, 1, 2, 3, 5, 8, ...', options: [
    { key: 'A', text: '11' }, { key: 'B', text: '12' }, { key: 'C', text: '13' }, { key: 'D', text: '15' }, { key: 'E', text: '16' },
  ], correct_answer: 'C', explanation: 'Suku berikutnya = jumlah dua suku sebelumnya: 5 + 8 = 13.' },
  { category: 'TKD-NS', order_index: 4, content: 'Lanjutkan deret: 100, 90, 81, 73, 66, ...', options: [
    { key: 'A', text: '58' }, { key: 'B', text: '59' }, { key: 'C', text: '60' }, { key: 'D', text: '61' }, { key: 'E', text: '62' },
  ], correct_answer: 'C', explanation: 'Selisih berurutan: -10, -9, -8, -7, -6 → 66 - 6 = 60.' },
  { category: 'TKD-NS', order_index: 5, content: 'Lanjutkan deret: 5, 10, 20, 40, 80, ...', options: [
    { key: 'A', text: '120' }, { key: 'B', text: '140' }, { key: 'C', text: '150' }, { key: 'D', text: '160' }, { key: 'E', text: '180' },
  ], correct_answer: 'D', explanation: 'Pola dikali 2: 80 × 2 = 160.' },

  // ── TKD-WC ──
  { category: 'TKD-WC', order_index: 1, content: 'Manakah kata yang TIDAK sekelompok?', options: [
    { key: 'A', text: 'Anggur' }, { key: 'B', text: 'Mangga' }, { key: 'C', text: 'Jeruk' }, { key: 'D', text: 'Kangkung' }, { key: 'E', text: 'Apel' },
  ], correct_answer: 'D', explanation: 'Kangkung adalah sayuran; lainnya adalah buah.' },
  { category: 'TKD-WC', order_index: 2, content: 'Manakah kata yang TIDAK sekelompok?', options: [
    { key: 'A', text: 'Motor' }, { key: 'B', text: 'Mobil' }, { key: 'C', text: 'Bus' }, { key: 'D', text: 'Kereta' }, { key: 'E', text: 'Perahu' },
  ], correct_answer: 'E', explanation: 'Perahu transportasi air; lainnya transportasi darat.' },
  { category: 'TKD-WC', order_index: 3, content: 'Manakah kata yang TIDAK sekelompok?', options: [
    { key: 'A', text: 'Merah' }, { key: 'B', text: 'Hijau' }, { key: 'C', text: 'Biru' }, { key: 'D', text: 'Bulat' }, { key: 'E', text: 'Kuning' },
  ], correct_answer: 'D', explanation: 'Bulat adalah bentuk; lainnya adalah warna.' },
  { category: 'TKD-WC', order_index: 4, content: 'Manakah kata yang TIDAK sekelompok?', options: [
    { key: 'A', text: 'Ayam' }, { key: 'B', text: 'Bebek' }, { key: 'C', text: 'Angsa' }, { key: 'D', text: 'Kambing' }, { key: 'E', text: 'Burung' },
  ], correct_answer: 'D', explanation: 'Kambing adalah mamalia; lainnya adalah unggas/burung.' },
  { category: 'TKD-WC', order_index: 5, content: 'Manakah kata yang TIDAK sekelompok?', options: [
    { key: 'A', text: 'Kopi' }, { key: 'B', text: 'Teh' }, { key: 'C', text: 'Susu' }, { key: 'D', text: 'Nasi' }, { key: 'E', text: 'Jus' },
  ], correct_answer: 'D', explanation: 'Nasi adalah makanan; lainnya adalah minuman.' },

  // ── TKD-DIAG ──
  { category: 'TKD-DIAG', order_index: 1, content: 'Lanjutkan pola berikut: ▲◆●, ◆●▲, ●▲◆, ...', options: [
    { key: 'A', text: '▲◆●' }, { key: 'B', text: '◆▲●' }, { key: 'C', text: '●◆▲' }, { key: 'D', text: '▲●◆' }, { key: 'E', text: '◆●▲' },
  ], correct_answer: 'A', explanation: 'Elemen bergeser satu posisi ke kiri (rotasi). Setelah ●▲◆ kembali ke ▲◆●.' },
  { category: 'TKD-DIAG', order_index: 2, content: 'Segitiga : 3 sisi = Persegi : ...', options: [
    { key: 'A', text: '4 sisi' }, { key: 'B', text: '5 sisi' }, { key: 'C', text: '3 sisi' }, { key: 'D', text: '6 sisi' }, { key: 'E', text: '2 sisi' },
  ], correct_answer: 'A', explanation: 'Segitiga punya 3 sisi; persegi punya 4 sisi.' },
  { category: 'TKD-DIAG', order_index: 3, content: 'Lanjutkan pola: □□□, □□■, □■■, ...', options: [
    { key: 'A', text: '■■■' }, { key: 'B', text: '□■■' }, { key: 'C', text: '■■□' }, { key: 'D', text: '□□■' }, { key: 'E', text: '■□□' },
  ], correct_answer: 'A', explanation: 'Satu kotak hitam bertambah setiap langkah dari kiri; setelah □■■ lengkap menjadi ■■■.' },
  { category: 'TKD-DIAG', order_index: 4, content: 'Jika sebuah gambar diputar 90° searah jarum jam, posisi "atas" akan berpindah ke...', options: [
    { key: 'A', text: 'Kanan' }, { key: 'B', text: 'Kiri' }, { key: 'C', text: 'Bawah' }, { key: 'D', text: 'Tetap atas' }, { key: 'E', text: 'Tengah' },
  ], correct_answer: 'A', explanation: 'Rotasi 90° searah jarum jam memindahkan posisi atas ke kanan.' },
  { category: 'TKD-DIAG', order_index: 5, content: 'Manakah bangun yang TIDAK memiliki sisi lengkung?', options: [
    { key: 'A', text: 'Lingkaran' }, { key: 'B', text: 'Elips' }, { key: 'C', text: 'Tabung' }, { key: 'D', text: 'Segitiga' }, { key: 'E', text: 'Bola' },
  ], correct_answer: 'D', explanation: 'Segitiga tersusun dari sisi lurus; lainnya memiliki unsur lengkung.' },

  // ── AKHLAK (2 opsi) ──
  { category: 'AKHLAK', order_index: 1, content: 'Rekan kerja Anda sedang kewalahan dengan tugasnya. Anda...', options: [
    { key: 'A', text: 'Menawarkan bantuan jika Anda sempat' },
    { key: 'B', text: 'Mengabaikannya karena itu bukan tugas Anda' },
  ], correct_answer: 'A', explanation: 'Membantu rekan mencerminkan nilai Kolaboratif dan Harmonis.' },
  { category: 'AKHLAK', order_index: 2, content: 'Anda menemukan kesalahan pada laporan yang sudah ditandatangani atasan. Anda...', options: [
    { key: 'A', text: 'Diam saja agar atasan tidak malu' },
    { key: 'B', text: 'Melaporkan kesalahan tersebut secara profesional' },
  ], correct_answer: 'B', explanation: 'Jujur dan bertanggung jawab (Amanah) diutamakan meski menyangkut atasan.' },
  { category: 'AKHLAK', order_index: 3, content: 'Atasan meminta Anda memanipulasi data untuk memenuhi target. Anda...', options: [
    { key: 'A', text: 'Menolak dan menjelaskan alasannya dengan sopan' },
    { key: 'B', text: 'Menerima karena takut dinilai tidak loyal' },
  ], correct_answer: 'A', explanation: 'Menolak manipulasi data mencerminkan integritas dan Amanah; loyalitas tidak membenarkan pelanggaran etika.' },
  { category: 'AKHLAK', order_index: 4, content: 'Anggota tim baru kesulitan memahami SOP. Anda...', options: [
    { key: 'A', text: 'Membimbingnya dengan sabar dan jelas' },
    { key: 'B', text: 'Membiarkannya belajar sendiri' },
  ], correct_answer: 'A', explanation: 'Membimbing anggota tim mencerminkan nilai Kolaboratif dan Kompeten (membantu orang lain belajar).' },
  { category: 'AKHLAK', order_index: 5, content: 'Anda diberi proyek di luar bidang keahlian Anda. Anda...', options: [
    { key: 'A', text: 'Menolak karena takut gagal' },
    { key: 'B', text: 'Menerima dan mempelajarinya dengan tekun' },
  ], correct_answer: 'B', explanation: 'Bersedia belajar hal baru mencerminkan nilai Adaptif dan Kompeten.' },

  // ── TWK ──
  { category: 'TWK', order_index: 1, content: 'Sila pertama Pancasila berbunyi...', options: [
    { key: 'A', text: 'Ketuhanan Yang Maha Esa' },
    { key: 'B', text: 'Kemanusiaan yang adil dan beradab' },
    { key: 'C', text: 'Persatuan Indonesia' },
    { key: 'D', text: 'Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan' },
    { key: 'E', text: 'Keadilan sosial bagi seluruh rakyat Indonesia' },
  ], correct_answer: 'A', explanation: 'Sila pertama Pancasila adalah Ketuhanan Yang Maha Esa.' },
  { category: 'TWK', order_index: 2, content: 'Sumpah Pemuda diikrarkan pada tahun...', options: [
    { key: 'A', text: '1908' }, { key: 'B', text: '1928' }, { key: 'C', text: '1945' }, { key: 'D', text: '1949' }, { key: 'E', text: '1965' },
  ], correct_answer: 'B', explanation: 'Sumpah Pemuda diikrarkan pada 28 Oktober 1928.' },
  { category: 'TWK', order_index: 3, content: 'Pembukaan UUD 1945 alinea keempat memuat rumusan...', options: [
    { key: 'A', text: 'Pancasila' },
    { key: 'B', text: 'Bentuk negara' },
    { key: 'C', text: 'Batas wilayah negara' },
    { key: 'D', text: 'Hak asasi manusia' },
    { key: 'E', text: 'Kewajiban pajak' },
  ], correct_answer: 'A', explanation: 'Alinea keempat Pembukaan UUD 1945 memuat rumusan Pancasila dan dasar negara.' },
  { category: 'TWK', order_index: 4, content: 'Makna Bhinneka Tunggal Ika adalah...', options: [
    { key: 'A', text: 'Berbeda-beda tetapi tetap satu jua' },
    { key: 'B', text: 'Bersatu kita teguh, bercerai kita runtuh' },
    { key: 'C', text: 'Satu nusa, satu bangsa, satu bahasa' },
    { key: 'D', text: 'Hidup rukun dalam keberagaman' },
    { key: 'E', text: 'Persatuan tanpa perbedaan' },
  ], correct_answer: 'A', explanation: 'Bhinneka Tunggal Ika = berbeda-beda tetapi tetap satu jua.' },
  { category: 'TWK', order_index: 5, content: 'Konferensi Asia Afrika (KAA) 1955 diselenggarakan di kota...', options: [
    { key: 'A', text: 'Jakarta' }, { key: 'B', text: 'Bandung' }, { key: 'C', text: 'Yogyakarta' }, { key: 'D', text: 'Surabaya' }, { key: 'E', text: 'Denpasar' },
  ], correct_answer: 'B', explanation: 'KAA 1955 diselenggarakan di Bandung pada 18-24 April 1955.' },
]

async function main() {
  // 1. Upsert paket
  const { data: existing } = await (supabase.from('packages') as any)
    .select('id')
    .eq('slug', SLUG)
    .maybeSingle()

  let pkgId: string
  if (existing) {
    pkgId = existing.id
    await (supabase.from('packages') as any)
      .update({ name: NAME, category: 'BUMN', is_published: true })
      .eq('id', pkgId)
    console.log(`Paket sudah ada: ${NAME} (${pkgId})`)
  } else {
    const { data, error } = await (supabase.from('packages') as any)
      .insert({
        name: NAME,
        slug: SLUG,
        category: 'BUMN',
        description: 'Simulasi Rekrutmen Bersama BUMN Tahap 1: TKD (VLR/NS/WC/DIAG), AKHLAK, dan TWK dengan passing grade seperti tes asli.',
        duration_minutes: 113,
        total_questions: QUESTIONS.length,
        is_free: true,
        is_published: true,
      })
      .select('id')
      .single()
    if (error || !data) {
      console.error('Gagal membuat paket:', error)
      process.exit(1)
    }
    pkgId = data.id
    console.log(`Paket baru dibuat: ${NAME} (${pkgId})`)
  }

  // 2. Bersihkan data lama
  console.log('Menghapus package_sections & questions lama...')
  await (supabase.from('package_sections') as any).delete().eq('package_id', pkgId)
  await (supabase.from('questions') as any).delete().eq('package_id', pkgId)

  // 3. Insert seksi
  const sectionRows = SECTIONS.map((s, i) => ({
    package_id: pkgId,
    order_index: i + 1,
    kode: s.kode,
    nama: s.nama,
    timer_mode: s.timer_mode,
    timer_seconds: s.timer_seconds,
    group_kode: s.group_kode,
    passing_grade: s.passing_grade,
  }))
  const { error: secErr } = await (supabase.from('package_sections') as any).insert(sectionRows)
  if (secErr) {
    console.error('Gagal insert package_sections:', secErr)
    console.error('=> Pastikan migration package_sections sudah dijalankan di SQL Editor.')
    process.exit(1)
  }
  console.log(`✅ Insert ${sectionRows.length} seksi`)

  // 4. Insert soal contoh
  const questionRows = QUESTIONS.map((q) => ({
    package_id: pkgId,
    content: q.content,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    category: q.category,
    difficulty: 'medium',
    order_index: q.order_index,
  }))
  const { error: qErr } = await (supabase.from('questions') as any).insert(questionRows)
  if (qErr) {
    console.error('Gagal insert soal:', qErr)
    process.exit(1)
  }
  console.log(`✅ Insert ${questionRows.length} soal contoh`)

  console.log('\nSelesai. Coba: /persiapan/' + pkgId)
}

main()
