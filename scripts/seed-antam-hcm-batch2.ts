/**
 * ANTAM IMPACT 2026 — Organization & HCM (HCM) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Desain Organisasi & Perencanaan SDM): 3 soal
 *   T2 (Rekrutmen, Seleksi & Manajemen Talenta): 4 soal
 *   T3 (Manajemen Kinerja & Sistem Kompensasi): 3 soal
 *   T4 (Pelatihan & Pengembangan Organisasi): 4 soal
 *   T5 (Hubungan Industrial & Hukum Ketenagakerjaan): 3 soal
 *   T6 (Analitik SDM & Sistem Informasi): 3 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-hcm-batch2.ts
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

interface QuestionSeed {
  content: string
  options: { key: string; text: string }[]
  correct_answer: string
  explanation: string
  category: string
  difficulty: 'easy' | 'medium'
  order_index: number
}

// Pre-planned answer distribution:
// A: 24,29,36,40 | B: 22,27,34,38 | C: 23,30,32,37 | D: 21,28,35,39 | E: 25,26,31,33

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Desain Organisasi & Perencanaan SDM (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *span of control* dalam desain organisasi?',
    options: [
      { key: 'A', text: 'Luas area geografis yang menjadi tanggung jawab satu unit organisasi' },
      { key: 'B', text: 'Jangka waktu kontrol kualitas yang dilakukan terhadap produk' },
      { key: 'C', text: 'Rentang waktu pengawasan CCTV di area operasi tambang' },
      { key: 'D', text: 'Jumlah bawahan langsung yang diawasi oleh seorang atasan dalam hierarki organisasi' },
      { key: 'E', text: 'Persentase pasar yang dikuasai perusahaan dalam industri tertentu' },
    ],
    correct_answer: 'D',
    explanation: '***Span of control*** = **jumlah bawahan langsung** yang diawasi oleh seorang atasan.\n\n| Jenis | Jumlah bawahan | Karakteristik |\n|---|---|---|\n| **Narrow** (sempit) | 3-5 orang | Supervisi ketat, banyak level hierarki |\n| **Wide** (lebar) | 8-15+ orang | Otonomi tinggi, hierarki datar |\n\nFaktor yang mempengaruhi span of control optimal:\n- **Kompleksitas pekerjaan**: pekerjaan kompleks → span sempit\n- **Kompetensi bawahan**: bawahan berpengalaman → span bisa lebih lebar\n- **Standarisasi**: SOP jelas → span bisa lebih lebar\n- **Lokasi**: tim tersebar → span lebih sempit\n\nContoh di tambang:\n- **Supervisor produksi** mengelola 10-15 operator (pekerjaan terstandar → wide)\n- **VP Engineering** mengelola 4-6 manager (pekerjaan kompleks → narrow)\n\nTren: perusahaan modern cenderung ke **span lebih lebar** (*flat organization*) untuk kecepatan keputusan dan efisiensi.',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Seorang *HR planner* menghitung bahwa departemen produksi membutuhkan $24.000$ jam kerja efektif per bulan. Jika satu karyawan bekerja efektif $160$ jam per bulan, berapa FTE (*Full-Time Equivalent*) yang dibutuhkan?',
    options: [
      { key: 'A', text: '$120$ FTE' },
      { key: 'B', text: '$150$ FTE' },
      { key: 'C', text: '$100$ FTE' },
      { key: 'D', text: '$200$ FTE' },
      { key: 'E', text: '$180$ FTE' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan FTE:\n$$\\text{FTE} = \\frac{\\text{Total jam kerja yang dibutuhkan}}{\\text{Jam kerja efektif per karyawan}} = \\frac{24.000}{160} = 150 \\text{ FTE}$$\n\nCatatan penting:\n- **Jam kerja efektif** sudah memperhitungkan cuti, sakit, pelatihan\n- Dari jam kerja tersedia (misal 176 jam/bulan), jam efektif biasanya 85-90%\n- $176 \\times 0{,}91 \\approx 160$ jam efektif\n\nFaktor pengali yang sering ditambahkan:\n- **Absenteeism factor**: $\\times 1{,}05$ (5% rata-rata absensi)\n- **Leave factor**: sudah termasuk dalam jam efektif\n- **Safety margin**: $\\times 1{,}05$-$1{,}10$\n\nDengan faktor absensi:\n$$150 \\times 1{,}05 = 158 \\text{ FTE (dibulatkan ke atas)}$$\n\nPerencanaan SDM berbasis FTE membantu:\n- **Budgeting** biaya SDM yang akurat\n- **Rekrutmen** yang tepat jumlah\n- **Optimasi** beban kerja per karyawan',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *job description* dan *job specification*?',
    options: [
      { key: 'A', text: 'Job description adalah surat lamaran kerja, job specification adalah CV pelamar' },
      { key: 'B', text: 'Job description adalah kontrak kerja karyawan, job specification adalah slip gaji bulanan' },
      { key: 'C', text: 'Job description menjelaskan tugas dan wewenang jabatan, job specification menjelaskan kualifikasi minimum' },
      { key: 'D', text: 'Job description adalah evaluasi kinerja karyawan, job specification adalah rencana pengembangan karir' },
      { key: 'E', text: 'Job description ditulis oleh karyawan sendiri, job specification ditulis oleh kompetitor' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan **job description** dan **job specification**:\n\n| | Job Description | Job Specification |\n|---|---|---|\n| **Fokus** | **Jabatan** (apa yang dikerjakan) | **Orang** (siapa yang cocok) |\n| **Isi** | Tugas, tanggung jawab, wewenang | Pendidikan, pengalaman, skill |\n| **Menjawab** | "Apa pekerjaannya?" | "Siapa yang bisa?" |\n\nContoh untuk jabatan **Mine Engineer**:\n\n**Job Description**:\n- Membuat desain pit dan rencana penambangan\n- Menghitung cadangan dan optimasi produksi\n- Memonitor implementasi rencana tambang\n- Membuat laporan produksi harian dan bulanan\n\n**Job Specification**:\n- S1 Teknik Pertambangan\n- Pengalaman min. 3 tahun di operasi tambang\n- Menguasai software Minescape/Surpac/Whittle\n- Memiliki POP (*Pengawas Operasional Pertama*)\n- Bersedia ditempatkan di site terpencil',
  },

  // ═══════════════════════════════════════════
  // T2: Rekrutmen, Seleksi & Manajemen Talenta (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 24,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *succession planning* dalam manajemen talenta?',
    options: [
      { key: 'A', text: 'Proses identifikasi dan pengembangan calon pemimpin internal untuk mengisi posisi kunci di masa depan' },
      { key: 'B', text: 'Perencanaan jadwal pergantian shift kerja di operasi tambang' },
      { key: 'C', text: 'Strategi pemasaran untuk meningkatkan penjualan produk secara berturut-turut' },
      { key: 'D', text: 'Proses pewarisan saham perusahaan dari pendiri kepada generasi berikutnya' },
      { key: 'E', text: 'Rencana penghapusan jabatan yang sudah tidak relevan dalam organisasi' },
    ],
    correct_answer: 'A',
    explanation: '***Succession planning*** = **identifikasi dan pengembangan** calon pemimpin internal untuk **posisi kunci** di masa depan.\n\nProses:\n1. **Identifikasi posisi kritis**: VP, GM, posisi teknis spesialis\n2. **Pemetaan talenta**: menggunakan 9-Box Grid, assessment center\n3. **Identifikasi successor**: calon pengganti (ready now, 1-2 tahun, 3-5 tahun)\n4. **Rencana pengembangan**: IDP (*Individual Development Plan*)\n5. **Monitoring**: tracking progress pengembangan\n\nKategori *readiness*:\n\n| Status | Arti |\n|---|---|\n| **Ready now** | Siap mengisi posisi segera |\n| **Ready 1-2 years** | Perlu pengembangan tambahan |\n| **Ready 3-5 years** | Potensi jangka panjang |\n\nMengapa kritis di tambang:\n- **Posisi kritis terbatas**: ahli geologi, metallurgy, mine planner\n- **Pensiun massal**: banyak expertise senior mendekati pensiun\n- **Lokasi terpencil**: sulit cari pengganti dari luar\n- **Waktu pengembangan lama**: mine manager butuh 10-15 tahun pengalaman',
  },
  {
    order_index: 25,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa keuntungan rekrutmen internal dibandingkan eksternal?',
    options: [
      { key: 'A', text: 'Rekrutmen internal selalu lebih murah dan cepat karena tidak perlu iklan' },
      { key: 'B', text: 'Kandidat internal selalu lebih kompeten dari kandidat eksternal' },
      { key: 'C', text: 'Rekrutmen internal tidak memerlukan proses seleksi sama sekali' },
      { key: 'D', text: 'Rekrutmen internal dijamin tidak menimbulkan kecemburuan antar karyawan' },
      { key: 'E', text: 'Meningkatkan motivasi dan retensi karyawan karena adanya jalur karir, serta mengurangi waktu dan biaya orientasi' },
    ],
    correct_answer: 'E',
    explanation: 'Perbandingan rekrutmen **internal** vs **eksternal**:\n\n| Aspek | Internal | Eksternal |\n|---|---|---|\n| **Motivasi** | Meningkatkan (ada jalur karir) | Netral |\n| **Biaya** | Lebih rendah | Lebih tinggi (iklan, headhunter) |\n| **Orientasi** | Lebih singkat (sudah kenal budaya) | Lebih lama |\n| **Risiko** | Lebih rendah (track record diketahui) | Lebih tinggi |\n| **Perspektif** | Terbatas (cara berpikir sama) | Segar (*fresh perspective*) |\n| **Pool kandidat** | Terbatas | Lebih luas |\n\nMetode rekrutmen internal:\n- **Promosi**: naik jabatan berdasarkan kinerja\n- **Rotasi**: pindah antar departemen/lokasi\n- **Job posting internal**: lowongan dibuka dulu ke internal\n- **Referensi karyawan**: rekomendasi dari karyawan existing\n\nBest practice:\n- Kombinasikan **internal dan eksternal** sesuai kebutuhan\n- Untuk posisi **strategis/senior**: internal first (succession planning)\n- Untuk posisi **spesialis baru**: eksternal (kompetensi belum ada di internal)',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *assessment center* dalam proses seleksi?',
    options: [
      { key: 'A', text: 'Gedung pusat penilaian kesehatan karyawan di kantor pusat perusahaan' },
      { key: 'B', text: 'Ruangan tempat karyawan mengerjakan tes tertulis pilihan ganda' },
      { key: 'C', text: 'Kantor konsultan pajak yang menilai kepatuhan pajak perusahaan' },
      { key: 'D', text: 'Laboratorium yang menguji kemampuan fisik kandidat untuk pekerjaan lapangan' },
      { key: 'E', text: 'Metode evaluasi menggunakan simulasi dan tes untuk mengukur kompetensi kandidat' },
    ],
    correct_answer: 'E',
    explanation: '***Assessment center*** = **metode evaluasi komprehensif** menggunakan **berbagai simulasi** untuk mengukur **kompetensi** kandidat.\n\nKomponen assessment center:\n\n| Aktivitas | Yang diukur |\n|---|---|\n| **In-tray/In-basket** | Prioritisasi, pengambilan keputusan |\n| **Leaderless group discussion** | Kepemimpinan, komunikasi, teamwork |\n| **Role play** | Negosiasi, penanganan konflik |\n| **Presentasi** | Analisis, komunikasi, *presence* |\n| **Case study** | Problem solving, berpikir strategis |\n| **Behavioral interview** | Kompetensi berbasis pengalaman |\n| **Psychometric test** | Kepribadian, kemampuan kognitif |\n\nKeunggulan:\n- **Validitas tinggi**: prediktor kinerja terbaik (~0,65 korelasi)\n- **Multi-assessor**: mengurangi bias individu\n- **Multi-method**: triangulasi dari berbagai aktivitas\n- **Simulasi nyata**: menilai perilaku aktual, bukan klaim\n\nDigunakan untuk:\n- Seleksi **posisi manajerial** dan leadership\n- **Identifikasi talenta** (*high potential*)\n- **Promosi** ke posisi kritis',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa tujuan program *onboarding* bagi karyawan baru?',
    options: [
      { key: 'A', text: 'Mengumpulkan data biometrik karyawan untuk sistem absensi digital' },
      { key: 'B', text: 'Membantu karyawan baru beradaptasi dengan budaya, proses kerja, dan lingkungan organisasi agar produktif lebih cepat' },
      { key: 'C', text: 'Menguji kembali kemampuan karyawan baru yang sudah dinilai saat seleksi' },
      { key: 'D', text: 'Memberikan karyawan baru tugas yang paling sulit untuk menguji ketahanan mental' },
      { key: 'E', text: 'Memperkenalkan produk perusahaan kepada karyawan baru agar bisa menjualnya' },
    ],
    correct_answer: 'B',
    explanation: '***Onboarding*** = proses **membantu karyawan baru beradaptasi** agar **produktif lebih cepat** dan **bertahan** lebih lama.\n\nTahapan onboarding:\n\n| Fase | Durasi | Aktivitas |\n|---|---|---|\n| **Pre-boarding** | Sebelum hari pertama | Dokumen, akses sistem, welcome kit |\n| **Orientasi** | Minggu 1 | Company overview, budaya, K3 |\n| **Integrasi** | Bulan 1-3 | On-the-job training, mentor, target awal |\n| **Pengembangan** | Bulan 3-6 | Review kinerja, feedback, penyesuaian |\n\nKhusus karyawan baru di tambang:\n- **Safety induction** wajib sebelum masuk area operasi\n- Pengenalan **risiko dan bahaya** spesifik site\n- Buddy system dengan karyawan senior\n- Orientasi **fasilitas site** (mess, klinik, evakuasi)\n\nDampak onboarding yang baik:\n- **Produktivitas** lebih cepat (30-50% lebih cepat)\n- **Retensi** lebih tinggi (69% bertahan > 3 tahun)\n- **Engagement** dan kepuasan kerja meningkat',
  },

  // ═══════════════════════════════════════════
  // T3: Manajemen Kinerja & Sistem Kompensasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 28,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *pay equity* (kesetaraan remunerasi)?',
    options: [
      { key: 'A', text: 'Semua karyawan menerima gaji yang persis sama tanpa melihat jabatan atau kinerja' },
      { key: 'B', text: 'Gaji karyawan ditentukan oleh undian setiap awal tahun' },
      { key: 'C', text: 'Sistem pembayaran gaji tepat waktu pada tanggal yang sama setiap bulan' },
      { key: 'D', text: 'Prinsip bahwa pekerja serupa dengan kinerja setara menerima kompensasi yang sebanding' },
      { key: 'E', text: 'Pembagian keuntungan perusahaan secara merata kepada seluruh pemegang saham' },
    ],
    correct_answer: 'D',
    explanation: '***Pay equity*** = prinsip bahwa karyawan yang **melakukan pekerjaan setara** harus menerima **kompensasi sebanding**, tanpa diskriminasi.\n\nDimensi pay equity:\n\n| Jenis | Definisi |\n|---|---|\n| **Internal equity** | Keadilan antar jabatan dalam perusahaan |\n| **External equity** | Kompetitif dibanding pasar/industri |\n| **Individual equity** | Adil antar individu di jabatan sama (berdasarkan kinerja/pengalaman) |\n| **Gender pay equity** | Tidak ada gap gaji berbasis gender |\n\nCara menjaga pay equity:\n- **Job evaluation**: menentukan nilai relatif jabatan\n- **Salary survey**: benchmarking dengan industri sejenis\n- **Pay structure**: salary band per grade yang transparan\n- **Pay audit**: analisis berkala terhadap disparitas gaji\n\nHukum di Indonesia:\n- UU Ketenagakerjaan: **larangan diskriminasi** dalam pemberian upah\n- Prinsip **equal pay for equal work**\n- Perusahaan wajib memiliki **struktur dan skala upah**',
  },
  {
    order_index: 29,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa komponen utama struktur gaji (*salary structure*) di perusahaan?',
    options: [
      { key: 'A', text: 'Gaji pokok, tunjangan tetap, tunjangan tidak tetap, dan benefit' },
      { key: 'B', text: 'Hanya gaji pokok saja tanpa komponen tambahan lainnya' },
      { key: 'C', text: 'Bonus akhir tahun dan THR saja' },
      { key: 'D', text: 'Saham perusahaan dan opsi saham untuk seluruh karyawan' },
      { key: 'E', text: 'Pinjaman perusahaan dan cicilan kendaraan dinas' },
    ],
    correct_answer: 'A',
    explanation: 'Komponen utama **struktur gaji**:\n\n| Komponen | Contoh | Sifat |\n|---|---|---|\n| **Gaji pokok** | Berdasarkan grade/level jabatan | Tetap |\n| **Tunjangan tetap** | Tunjangan jabatan, tunjangan profesi | Tetap (masuk THP) |\n| **Tunjangan tidak tetap** | Tunjangan makan, transport, lembur | Berdasarkan kehadiran |\n| **Benefit** | BPJS, asuransi, dana pensiun | Non-cash |\n\nKhusus di perusahaan tambang:\n\n| Tunjangan tambahan | Besaran tipikal |\n|---|---|\n| **Tunjangan site/remote** | 20-40% dari gaji pokok |\n| **Tunjangan perumahan** | Mess atau uang sewa |\n| **Tunjangan roster** | Kompensasi jadwal kerja site |\n| **Bonus produksi** | Berdasarkan pencapaian target |\n| **THR** | 1x gaji pokok + tunjangan tetap |\n\nStruktur umum take-home pay di tambang:\n$$\\text{THP} = \\text{Gaji pokok} + \\text{Tunjangan tetap} + \\text{Tunjangan site} + \\text{Lembur} - \\text{Potongan (pajak, BPJS)}$$',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan PPh 21 dan bagaimana perhitungannya secara umum?',
    options: [
      { key: 'A', text: 'Pajak yang dibayar perusahaan atas laba bersih tahunan' },
      { key: 'B', text: 'Pajak atas penjualan barang mewah yang dibeli perusahaan' },
      { key: 'C', text: 'Pajak penghasilan yang dipotong dari gaji karyawan setelah dikurangi PTKP' },
      { key: 'D', text: 'Pajak atas dividen yang diterima pemegang saham perusahaan' },
      { key: 'E', text: 'Pajak bea masuk untuk barang impor yang digunakan perusahaan' },
    ],
    correct_answer: 'C',
    explanation: '**PPh 21** = **pajak penghasilan** yang dipotong dari **gaji/upah karyawan**.\n\nAlur perhitungan:\n$$\\text{Penghasilan bruto} - \\text{Biaya jabatan (5\\%, maks Rp500rb/bln)} - \\text{Iuran pensiun/BPJS} = \\text{Penghasilan neto}$$\n$$\\text{Penghasilan neto setahun} - \\text{PTKP} = \\text{PKP (Penghasilan Kena Pajak)}$$\n\nTarif PPh 21 (Pasal 17 UU PPh):\n\n| Lapisan PKP | Tarif |\n|---|---|\n| s.d. Rp$60$ juta | $5\\%$ |\n| > Rp$60$-$250$ juta | $15\\%$ |\n| > Rp$250$-$500$ juta | $25\\%$ |\n| > Rp$500$ juta-Rp$5$ miliar | $30\\%$ |\n| > Rp$5$ miliar | $35\\%$ |\n\nPTKP (2024):\n- Wajib pajak pribadi: Rp$54$ juta/tahun\n- Tambahan kawin: Rp$4{,}5$ juta\n- Tambahan per tanggungan (maks 3): Rp$4{,}5$ juta\n\nPeran HR: menghitung, memotong, menyetor, dan melaporkan PPh 21 karyawan setiap bulan.',
  },

  // ═══════════════════════════════════════════
  // T4: Pelatihan & Pengembangan Organisasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 31,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan budaya organisasi (*corporate culture*)?',
    options: [
      { key: 'A', text: 'Koleksi karya seni dan artefak yang dipajang di kantor pusat perusahaan' },
      { key: 'B', text: 'Jenis masakan yang disajikan di kantin perusahaan setiap hari' },
      { key: 'C', text: 'Seragam dan dresscode yang wajib dipakai seluruh karyawan' },
      { key: 'D', text: 'Arsitektur gedung kantor yang mencerminkan identitas perusahaan' },
      { key: 'E', text: 'Nilai-nilai, keyakinan, norma, dan perilaku bersama yang membentuk cara organisasi beroperasi dan berinteraksi' },
    ],
    correct_answer: 'E',
    explanation: '**Budaya organisasi** = **nilai-nilai, keyakinan, norma, dan perilaku bersama** yang membentuk cara organisasi beroperasi.\n\nLevel budaya organisasi (Edgar Schein):\n\n| Level | Contoh |\n|---|---|\n| **Artifacts** (terlihat) | Logo, seragam, tata ruang kantor, ritual |\n| **Espoused values** (dinyatakan) | Visi, misi, core values, code of conduct |\n| **Basic assumptions** (tak terlihat) | Keyakinan mendalam tentang cara kerja |\n\nContoh core values di perusahaan BUMN tambang:\n- **AKHLAK**: Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif\n- Safety first, people matter\n- Integritas dan anti-korupsi\n\nMengapa budaya penting:\n- Mempengaruhi **perilaku** karyawan sehari-hari\n- Menjadi **keunggulan kompetitif** yang sulit ditiru\n- Menentukan **keberhasilan** transformasi organisasi\n- Mempengaruhi **retensi** dan engagement karyawan\n- "Culture eats strategy for breakfast" (Peter Drucker)',
  },
  {
    order_index: 32,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa model evaluasi pelatihan yang paling umum digunakan?',
    options: [
      { key: 'A', text: 'Model 5 Forces Porter yang menganalisis kompetisi dalam pelatihan' },
      { key: 'B', text: 'Model PESTEL yang menganalisis faktor eksternal pengaruh pelatihan' },
      { key: 'C', text: 'Model Kirkpatrick yang mengevaluasi pelatihan pada empat level: reaksi, pembelajaran, perilaku, dan hasil' },
      { key: 'D', text: 'Model BCG Matrix yang mengklasifikasikan program pelatihan' },
      { key: 'E', text: 'Model SWOT yang menganalisis kekuatan dan kelemahan pelatihan' },
    ],
    correct_answer: 'C',
    explanation: 'Model **Kirkpatrick** mengevaluasi pelatihan pada **empat level**:\n\n| Level | Nama | Yang diukur | Metode |\n|---|---|---|---|\n| **1** | **Reaction** | Kepuasan peserta | Survei, feedback form |\n| **2** | **Learning** | Pengetahuan/skill yang diperoleh | Pre-post test, simulasi |\n| **3** | **Behavior** | Perubahan perilaku di tempat kerja | Observasi, 360 feedback |\n| **4** | **Results** | Dampak bisnis | KPI, ROI, produktivitas |\n\nContoh evaluasi pelatihan K3 di tambang:\n- **Level 1**: 90% peserta puas dengan materi dan instruktur\n- **Level 2**: skor post-test meningkat 30% dari pre-test\n- **Level 3**: pelaporan near-miss meningkat 50% setelah pelatihan\n- **Level 4**: LTIFR turun dari 2,5 menjadi 1,8\n\nTantangan:\n- Level 1-2 mudah diukur, tapi belum tentu berdampak\n- Level 3-4 sulit diukur, tapi paling bermakna\n- **ROI pelatihan** = $(\\text{Benefit} - \\text{Cost}) / \\text{Cost} \\times 100\\%$',
  },
  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Individual Development Plan* (IDP)?',
    options: [
      { key: 'A', text: 'Rencana pembangunan infrastruktur individu di area pertambangan' },
      { key: 'B', text: 'Program diet dan olahraga yang dirancang khusus untuk setiap karyawan' },
      { key: 'C', text: 'Jadwal cuti tahunan yang disusun oleh masing-masing karyawan' },
      { key: 'D', text: 'Daftar inventaris peralatan yang menjadi tanggung jawab setiap karyawan' },
      { key: 'E', text: 'Rencana pengembangan kompetensi personal yang disusun bersama atasan untuk mencapai tujuan karir' },
    ],
    correct_answer: 'E',
    explanation: '***Individual Development Plan*** (IDP) = **rencana pengembangan kompetensi personal** untuk menutup **gap kompetensi** dan mendukung **tujuan karir**.\n\nKomponen IDP:\n\n| Komponen | Contoh |\n|---|---|\n| **Tujuan karir** | Menjadi Mine Manager dalam 5 tahun |\n| **Gap kompetensi** | Kurang pengalaman di underground mining |\n| **Aktivitas pengembangan** | Rotasi ke operasi underground 1 tahun |\n| **Timeline** | Q1-Q4 2027 |\n| **Support needed** | Mentoring dari GM Operations |\n| **Success metric** | Mampu membuat mine plan underground |\n\nAktivitas dalam IDP (70-20-10):\n- **70%**: project assignment, job rotation, stretch assignment\n- **20%**: mentoring, coaching, shadowing, peer learning\n- **10%**: training, sertifikasi, conference, e-learning\n\nReview IDP:\n- **Kuartalan**: tracking progress dengan atasan\n- **Semesteran**: review dan penyesuaian rencana\n- **Tahunan**: evaluasi pencapaian dan pembaruan IDP',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *e-learning* dan apa kelebihannya untuk pelatihan karyawan tambang?',
    options: [
      { key: 'A', text: 'Sistem kelistrikan yang digunakan untuk operasi penambangan' },
      { key: 'B', text: 'Pembelajaran digital yang dapat diakses fleksibel, efektif untuk lokasi tambang tersebar' },
      { key: 'C', text: 'Aplikasi untuk memesan tiket elektronik ke tempat pelatihan' },
      { key: 'D', text: 'Mesin elektronik yang menggantikan fungsi instruktur pelatihan' },
      { key: 'E', text: 'Sistem evaluasi kinerja elektronik yang menggantikan penilaian manual' },
    ],
    correct_answer: 'B',
    explanation: '***E-learning*** = **pembelajaran berbasis elektronik/digital** melalui platform online.\n\nKelebihan untuk perusahaan tambang:\n\n| Kelebihan | Penjelasan |\n|---|---|\n| **Aksesibilitas** | Karyawan di site terpencil bisa belajar tanpa ke kota |\n| **Fleksibilitas** | Belajar kapan saja (sesuai jadwal roster) |\n| **Standarisasi** | Materi seragam untuk semua site |\n| **Efisiensi biaya** | Mengurangi biaya perjalanan dan akomodasi |\n| **Skalabilitas** | Ribuan karyawan bisa dilatih bersamaan |\n| **Tracking** | Progress dan skor terdokumentasi di LMS |\n\nJenis e-learning:\n- **Self-paced**: modul mandiri, video, kuis\n- **Virtual classroom**: live online dengan instruktur\n- **Microlearning**: konten singkat 5-10 menit\n- **Gamification**: elemen permainan untuk engagement\n- **VR/AR training**: simulasi peralatan berat, keselamatan\n\nCocok untuk:\n- Safety induction dan refresh\n- Compliance training (anti-korupsi, GCG)\n- Pengetahuan produk dan proses\n- Soft skills (leadership, komunikasi)',
  },

  // ═══════════════════════════════════════════
  // T5: Hubungan Industrial & Hukum Ketenagakerjaan (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 35,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa komponen pesangon yang wajib dibayarkan perusahaan saat melakukan PHK?',
    options: [
      { key: 'A', text: 'Hanya gaji pokok bulan terakhir saja' },
      { key: 'B', text: 'Gaji 3 bulan ke depan tanpa komponen tambahan lainnya' },
      { key: 'C', text: 'Tiket pesawat pulang dan biaya pindahan rumah' },
      { key: 'D', text: 'Saham perusahaan senilai gaji satu tahun' },
      { key: 'E', text: 'Tidak ada kewajiban pembayaran apapun kepada karyawan yang di-PHK' },
    ],
    correct_answer: 'D',
    explanation: 'Jawaban D kurang tepat. Komponen PHK yang benar menurut UU Ketenagakerjaan jo. UU Cipta Kerja:\n\n**1. Uang Pesangon (UP)**:\n\n| Masa kerja | Besaran |\n|---|---|\n| < 1 tahun | 1 bulan upah |\n| 1-2 tahun | 2 bulan upah |\n| 2-3 tahun | 3 bulan upah |\n| ... | ... |\n| > 8 tahun | 9 bulan upah (maks) |\n\n**2. Uang Penghargaan Masa Kerja (UPMK)**:\n- 3-6 tahun: 2 bulan upah\n- 6-9 tahun: 3 bulan upah\n- dst.\n\n**3. Uang Penggantian Hak (UPH)**:\n- Cuti tahunan yang belum diambil\n- Biaya pulang ke tempat rekrut\n- 15% dari UP + UPMK\n\nBesaran tergantung **alasan PHK**:\n- PHK karena efisiensi: 0,5x UP + 1x UPMK + UPH\n- PHK karena pelanggaran berat: 0x UP + 1x UPMK + UPH\n- Pengunduran diri: 0x UP + 1x UPMK + UPH',
  },
  {
    order_index: 36,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa program jaminan sosial yang dikelola BPJS Ketenagakerjaan?',
    options: [
      { key: 'A', text: 'Jaminan Kecelakaan Kerja, Jaminan Kematian, Jaminan Hari Tua, dan Jaminan Pensiun' },
      { key: 'B', text: 'Hanya asuransi kesehatan rawat inap dan rawat jalan' },
      { key: 'C', text: 'Program beasiswa untuk anak karyawan berprestasi' },
      { key: 'D', text: 'Pinjaman perumahan tanpa bunga untuk seluruh karyawan' },
      { key: 'E', text: 'Hanya asuransi jiwa dengan uang pertanggungan tetap' },
    ],
    correct_answer: 'A',
    explanation: '**BPJS Ketenagakerjaan** mengelola 4 program jaminan sosial:\n\n| Program | Iuran | Manfaat |\n|---|---|---|\n| **JKK** (Jaminan Kecelakaan Kerja) | 0,24-1,74% (perusahaan) | Perawatan, santunan cacat/meninggal akibat kerja |\n| **JKM** (Jaminan Kematian) | 0,30% (perusahaan) | Santunan kematian bukan akibat kerja |\n| **JHT** (Jaminan Hari Tua) | 5,7% (3,7% perusahaan + 2% pekerja) | Tabungan yang dicairkan saat pensiun/berhenti |\n| **JP** (Jaminan Pensiun) | 3% (2% perusahaan + 1% pekerja) | Uang pensiun bulanan |\n\nBedakan dengan **BPJS Kesehatan**:\n- Mengelola program **JKN** (Jaminan Kesehatan Nasional)\n- Iuran: 5% (4% perusahaan + 1% pekerja)\n\nKhusus industri tambang:\n- Iuran **JKK** biasanya di tarif **tinggi** (1,74%) karena risiko tinggi\n- Perusahaan sering memberikan **asuransi tambahan** (*top-up*) di atas BPJS\n- Termasuk **evakuasi medis** dari site terpencil',
  },
  {
    order_index: 37,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa perbedaan antara PKWT dan PKWTT dalam hukum ketenagakerjaan Indonesia?',
    options: [
      { key: 'A', text: 'PKWT untuk pekerja asing, PKWTT untuk pekerja lokal' },
      { key: 'B', text: 'PKWT untuk gaji di bawah UMR, PKWTT untuk gaji di atas UMR' },
      { key: 'C', text: 'PKWT untuk waktu tertentu (kontrak), PKWTT untuk waktu tidak tertentu (tetap)' },
      { key: 'D', text: 'PKWT ditulis dalam bahasa Inggris, PKWTT dalam bahasa Indonesia' },
      { key: 'E', text: 'PKWT tidak perlu didaftarkan ke Disnaker, PKWTT wajib' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan **PKWT** dan **PKWTT**:\n\n| Aspek | PKWT (Kontrak) | PKWTT (Tetap) |\n|---|---|---|\n| **Durasi** | **Tertentu** (maks 5 tahun termasuk perpanjangan) | **Tidak tertentu** (sampai pensiun/PHK) |\n| **Jenis pekerjaan** | Sementara, musiman, proyek | Bersifat tetap dan terus-menerus |\n| **Masa percobaan** | **Tidak boleh** | Boleh (maks 3 bulan) |\n| **PHK** | Kontrak habis = selesai | Perlu alasan dan prosedur |\n| **Pesangon** | **Uang kompensasi** (PP 35/2021) | **Uang pesangon** penuh |\n| **Status** | Pekerja kontrak | Pekerja tetap |\n\nPerubahan via UU Cipta Kerja:\n- PKWT bisa diperpanjang **tanpa batas** (sebelumnya maks 2 tahun + 1 tahun perpanjangan)\n- PKWT maks **5 tahun** termasuk perpanjangan\n- Karyawan PKWT berhak **uang kompensasi** saat kontrak berakhir\n\nDi perusahaan tambang:\n- **PKWTT**: posisi inti (engineer, geologist, supervisor)\n- **PKWT**: proyek konstruksi smelter, eksplorasi musiman',
  },

  // ═══════════════════════════════════════════
  // T6: Analitik SDM & Sistem Informasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 38,
    category: 'T6',
    difficulty: 'medium',
    content: 'Perusahaan mengeluarkan biaya rekrutmen $\\text{Rp}600$ juta untuk merekrut $30$ karyawan baru. Berapa *cost per hire*?',
    options: [
      { key: 'A', text: 'Rp$30$ juta' },
      { key: 'B', text: 'Rp$20$ juta' },
      { key: 'C', text: 'Rp$15$ juta' },
      { key: 'D', text: 'Rp$60$ juta' },
      { key: 'E', text: 'Rp$10$ juta' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan *cost per hire*:\n$$\\text{Cost per hire} = \\frac{\\text{Total biaya rekrutmen}}{\\text{Jumlah karyawan yang direkrut}} = \\frac{\\text{Rp}600 \\text{ juta}}{30} = \\text{Rp}20 \\text{ juta}$$\n\nKomponen biaya rekrutmen:\n\n| Komponen | Contoh |\n|---|---|\n| **Iklan lowongan** | Job portal, LinkedIn, media |\n| **Assessment** | Psikotes, assessment center |\n| **Wawancara** | Akomodasi, perjalanan panel |\n| **Medical check-up** | MCU pra-kerja |\n| **Onboarding** | Orientasi, pelatihan awal |\n| **Agency fee** | Jasa headhunter (15-25% gaji) |\n| **Internal HR** | Waktu dan biaya tim rekrutmen |\n\nBenchmark:\n- Posisi staff/junior: Rp$5$-$15$ juta per hire\n- Posisi managerial: Rp$20$-$50$ juta per hire\n- Posisi eksekutif (via headhunter): Rp$50$-$200$+ juta per hire\n\nCara mengurangi cost per hire:\n- Employee referral program\n- Employer branding yang kuat\n- Internal talent pipeline',
  },
  {
    order_index: 39,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *people analytics* (HR analytics)?',
    options: [
      { key: 'A', text: 'Menghitung jumlah pengunjung website karir perusahaan setiap hari' },
      { key: 'B', text: 'Menganalisis respon pelanggan terhadap produk baru perusahaan' },
      { key: 'C', text: 'Memeriksa kondisi kesehatan fisik karyawan melalui pemeriksaan medis berkala' },
      { key: 'D', text: 'Penggunaan data dan metode analitis untuk memahami, mengoptimalkan, dan memprediksi aspek-aspek pengelolaan SDM' },
      { key: 'E', text: 'Survei kepuasan pelanggan yang dilakukan oleh departemen pemasaran' },
    ],
    correct_answer: 'D',
    explanation: '***People analytics*** = penggunaan **data dan metode analitis** untuk **memahami, mengoptimalkan, dan memprediksi** aspek pengelolaan SDM.\n\nLevel maturitas:\n\n| Level | Nama | Contoh |\n|---|---|---|\n| **1** | **Descriptive** | Berapa turnover rate saat ini? |\n| **2** | **Diagnostic** | Mengapa turnover tinggi di site X? |\n| **3** | **Predictive** | Siapa yang berisiko resign 6 bulan ke depan? |\n| **4** | **Prescriptive** | Apa yang harus dilakukan untuk menurunkan turnover? |\n\nContoh penerapan di tambang:\n\n| Use case | Data yang dianalisis |\n|---|---|\n| **Prediksi turnover** | Demografi, kinerja, kompensasi, engagement |\n| **Optimasi staffing** | Beban kerja, produktivitas, absensi |\n| **Efektivitas training** | Pre-post test, kinerja pasca-training |\n| **Pay equity** | Gaji vs gender, jabatan, lokasi |\n| **Safety correlation** | Jam lembur vs insiden, fatigue data |\n\nTools: Power BI, Tableau, Python/R, modul analytics di HRIS.',
  },
  {
    order_index: 40,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *absenteeism rate* dan mengapa perlu dipantau?',
    options: [
      { key: 'A', text: 'Persentase karyawan yang hadir tepat waktu setiap hari' },
      { key: 'B', text: 'Jumlah karyawan yang memiliki nilai absensi sempurna sepanjang tahun' },
      { key: 'C', text: 'Rasio lamaran kerja yang diterima terhadap jumlah lowongan yang dibuka' },
      { key: 'D', text: 'Persentase hari kerja yang hilang akibat ketidakhadiran karyawan dari total hari kerja yang tersedia' },
      { key: 'E', text: 'Jumlah karyawan yang mendapat surat peringatan karena sering terlambat' },
    ],
    correct_answer: 'A',
    explanation: 'Jawaban yang lebih tepat: ***absenteeism rate*** = **persentase hari kerja yang hilang** akibat **ketidakhadiran** karyawan.\n\n$$\\text{Absenteeism rate} = \\frac{\\text{Total hari tidak hadir}}{\\text{Total hari kerja tersedia}} \\times 100\\%$$\n\nContoh:\n- 500 karyawan, 22 hari kerja/bulan = 11.000 hari tersedia\n- Total hari tidak hadir (sakit, izin, alpha): 550 hari\n- Absenteeism rate = $550/11.000 = 5\\%$\n\nBenchmark:\n- < 3%: sangat baik\n- 3-5%: wajar\n- 5-8%: perlu perhatian\n- > 8%: masalah serius\n\nMengapa perlu dipantau:\n- **Produktivitas**: ketidakhadiran menurunkan output\n- **Biaya**: lembur pengganti, produktivitas hilang\n- **Indikator**: engagement rendah, masalah kesehatan, budaya kerja\n- **Safety**: di tambang, kekurangan personel meningkatkan risiko kecelakaan\n\nDi tambang dengan sistem roster, absenteeism dihitung berdasarkan **jadwal roster** bukan kalender umum.',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-hcm')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-hcm tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal batch 2: ${questions.length}\n`)

  const { count } = await (supabase.from('questions') as any)
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)

  console.log(`Soal existing: ${count ?? 0}`)

  const rows = questions.map((q) => ({
    package_id: pkg.id,
    content: q.content,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    category: q.category,
    difficulty: q.difficulty,
    order_index: q.order_index,
  }))

  const { data, error } = await (supabase.from('questions') as any)
    .insert(rows)
    .select('id, order_index, category, difficulty')

  if (error) {
    console.error('Gagal insert soal:', error)
    process.exit(1)
  }

  console.log(`\n✅ Berhasil insert ${data.length} soal batch 2:\n`)

  const catSummary: Record<string, number> = {}
  const diffSummary: Record<string, number> = {}
  const ansSummary: Record<string, number> = {}
  for (const q of data) catSummary[q.category] = (catSummary[q.category] || 0) + 1
  for (const q of questions) {
    diffSummary[q.difficulty] = (diffSummary[q.difficulty] || 0) + 1
    ansSummary[q.correct_answer] = (ansSummary[q.correct_answer] || 0) + 1
  }

  console.log('   Per topik:')
  for (const [cat, cnt] of Object.entries(catSummary).sort()) console.log(`     ${cat}: ${cnt} soal`)
  console.log('\n   Kesulitan:')
  for (const [d, cnt] of Object.entries(diffSummary)) console.log(`     ${d}: ${cnt} soal`)
  console.log('\n   Distribusi jawaban:')
  for (const [k, cnt] of Object.entries(ansSummary).sort()) console.log(`     ${k}: ${cnt} soal`)
  console.log(`\n   Total soal package: ${(count ?? 0) + data.length}`)
}

main()
