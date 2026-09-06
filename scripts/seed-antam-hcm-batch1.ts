/**
 * ANTAM IMPACT 2026 — Organization & HCM (HCM) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Desain Organisasi & Perencanaan SDM): 4 soal
 *   T2 (Rekrutmen, Seleksi & Manajemen Talenta): 3 soal
 *   T3 (Manajemen Kinerja & Sistem Kompensasi): 4 soal
 *   T4 (Pelatihan & Pengembangan Organisasi): 3 soal
 *   T5 (Hubungan Industrial & Hukum Ketenagakerjaan): 3 soal
 *   T6 (Analitik SDM & Sistem Informasi): 3 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-hcm-batch1.ts
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
// A: 3,8,15,18 | B: 1,9,13,19 | C: 5,10,14,20 | D: 2,7,12,16 | E: 4,6,11,17

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Desain Organisasi & Perencanaan SDM (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa tujuan utama analisis beban kerja (*workload analysis*) dalam perencanaan SDM?',
    options: [
      { key: 'A', text: 'Menentukan berat maksimum barang yang boleh diangkat karyawan secara manual' },
      { key: 'B', text: 'Menghitung volume dan jenis pekerjaan untuk menentukan jumlah dan kompetensi SDM yang dibutuhkan' },
      { key: 'C', text: 'Mengukur tingkat stres karyawan melalui survei psikologis' },
      { key: 'D', text: 'Menilai prestasi kerja karyawan untuk kenaikan pangkat' },
      { key: 'E', text: 'Menentukan jadwal lembur karyawan selama satu tahun ke depan' },
    ],
    correct_answer: 'B',
    explanation: '***Workload analysis*** (analisis beban kerja) bertujuan **menghitung volume dan jenis pekerjaan** untuk menentukan **jumlah dan kompetensi SDM** yang dibutuhkan.\n\nLangkah-langkah:\n1. **Identifikasi tugas**: daftar seluruh aktivitas per jabatan\n2. **Ukur waktu**: berapa lama tiap tugas membutuhkan waktu\n3. **Hitung volume**: frekuensi tugas per periode\n4. **Tentukan kebutuhan**: jumlah FTE (*Full-Time Equivalent*) yang diperlukan\n\nRumus sederhana:\n$$\\text{Kebutuhan SDM} = \\frac{\\text{Total jam kerja yang dibutuhkan}}{\\text{Jam kerja efektif per orang per periode}}$$\n\nManfaat di perusahaan tambang:\n- Menghindari **overstaffing** (biaya SDM tinggi) atau **understaffing** (beban kerja berlebih)\n- Dasar **perencanaan rekrutmen** yang objektif\n- Input untuk **desain organisasi** yang efisien\n- Dasar **penetapan standar kerja** dan produktivitas',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *workforce planning* dan mengapa penting bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Perencanaan jadwal shift kerja harian untuk seluruh karyawan' },
      { key: 'B', text: 'Program olahraga dan kebugaran untuk menjaga stamina pekerja tambang' },
      { key: 'C', text: 'Penyusunan menu makanan bergizi untuk karyawan di site tambang' },
      { key: 'D', text: 'Proses strategis memastikan organisasi memiliki jumlah dan kompetensi SDM yang tepat' },
      { key: 'E', text: 'Penghitungan upah minimum yang harus dibayarkan sesuai peraturan daerah' },
    ],
    correct_answer: 'D',
    explanation: '***Workforce planning*** = **proses strategis** memastikan organisasi memiliki **jumlah dan kompetensi SDM yang tepat** pada **waktu yang tepat**.\n\nKomponen workforce planning:\n\n| Komponen | Aktivitas |\n|---|---|\n| **Supply analysis** | Profil SDM saat ini (jumlah, kompetensi, usia) |\n| **Demand forecast** | Kebutuhan SDM masa depan berdasarkan rencana bisnis |\n| **Gap analysis** | Selisih antara supply dan demand |\n| **Action plan** | Strategi menutup gap (rekrut, training, rotasi) |\n\nMengapa kritis di tambang:\n- **Lokasi terpencil**: sulit menarik dan mempertahankan talenta\n- **Siklus komoditas**: ekspansi saat boom, efisiensi saat downturn\n- **Spesialisasi**: kompetensi teknis memerlukan waktu pengembangan lama\n- **Regenerasi**: banyak pekerja senior mendekati pensiun\n- **Proyek baru**: smelter baru butuh ratusan tenaga terampil',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan evaluasi jabatan (*job evaluation*)?',
    options: [
      { key: 'A', text: 'Metode sistematis menentukan nilai relatif setiap jabatan untuk penetapan kompensasi yang adil' },
      { key: 'B', text: 'Penilaian kinerja individu karyawan oleh atasan langsung setiap semester' },
      { key: 'C', text: 'Proses wawancara keluar bagi karyawan yang mengundurkan diri' },
      { key: 'D', text: 'Audit kepatuhan perusahaan terhadap standar ISO oleh lembaga sertifikasi' },
      { key: 'E', text: 'Survei kepuasan karyawan terhadap fasilitas dan lingkungan kerja' },
    ],
    correct_answer: 'A',
    explanation: '***Job evaluation*** = **metode sistematis** untuk menentukan **nilai relatif** setiap jabatan sebagai dasar **struktur kompensasi** yang adil.\n\nMetode evaluasi jabatan:\n\n| Metode | Cara kerja |\n|---|---|\n| **Ranking** | Mengurutkan jabatan dari tertinggi ke terendah |\n| **Classification** | Mengelompokkan jabatan ke dalam grade/kelas |\n| **Point factor** | Memberi skor berdasarkan faktor (skill, effort, responsibility, conditions) |\n| **Factor comparison** | Membandingkan jabatan berdasarkan faktor kunci |\n\nFaktor evaluasi (metode point factor):\n- **Skill**: pendidikan, pengalaman, keahlian teknis\n- **Effort**: fisik dan mental yang dibutuhkan\n- **Responsibility**: pengambilan keputusan, supervisi, aset\n- **Working conditions**: risiko, lingkungan kerja\n\nHasil evaluasi jabatan:\n- **Job grade/level**: hierarki jabatan dalam organisasi\n- **Salary band**: rentang gaji per grade\n- **Internal equity**: keadilan antar jabatan dalam perusahaan',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa perbedaan antara struktur organisasi fungsional dan struktur organisasi matriks?',
    options: [
      { key: 'A', text: 'Fungsional untuk perusahaan besar, matriks untuk perusahaan kecil' },
      { key: 'B', text: 'Fungsional hanya digunakan di sektor publik, matriks di sektor swasta' },
      { key: 'C', text: 'Fungsional untuk perusahaan manufaktur, matriks untuk perusahaan jasa' },
      { key: 'D', text: 'Fungsional berdasarkan kesamaan fungsi kerja, matriks tidak memiliki hierarki' },
      { key: 'E', text: 'Fungsional mengelompokkan berdasarkan fungsi, matriks menggabungkan dua jalur pelaporan' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan **fungsional** dan **matriks**:\n\n| Aspek | Fungsional | Matriks |\n|---|---|---|\n| **Pengelompokan** | Berdasarkan **fungsi** (HR, Finance, Produksi) | **Dua dimensi**: fungsi + proyek/produk |\n| **Pelaporan** | **Satu** atasan langsung | **Dua** atasan (fungsional + proyek) |\n| **Keunggulan** | Spesialisasi, jalur karir jelas | Fleksibilitas, kolaborasi lintas fungsi |\n| **Kelemahan** | Silo antar departemen | Konflik pelaporan ganda, kompleks |\n\nContoh di perusahaan tambang:\n\n**Fungsional**:\n- Direktorat Operasi, Direktorat Keuangan, Direktorat SDM\n- Karyawan melapor ke satu direktur\n\n**Matriks**:\n- Engineer melapor ke **VP Engineering** (fungsional) DAN **Project Manager smelter** (proyek)\n- Cocok untuk perusahaan dengan banyak proyek paralel (eksplorasi, konstruksi smelter, ekspansi)',
  },

  // ═══════════════════════════════════════════
  // T2: Rekrutmen, Seleksi & Manajemen Talenta (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan wawancara berbasis kompetensi (*competency-based interview/BEI*)?',
    options: [
      { key: 'A', text: 'Wawancara yang hanya menguji pengetahuan teknis kandidat melalui tes tertulis' },
      { key: 'B', text: 'Wawancara santai untuk menilai kepribadian kandidat tanpa pertanyaan terstruktur' },
      { key: 'C', text: 'Teknik wawancara yang menggali pengalaman nyata kandidat untuk memprediksi perilaku di masa depan' },
      { key: 'D', text: 'Wawancara kelompok di mana semua kandidat berdiskusi bersama tanpa pewawancara' },
      { key: 'E', text: 'Proses seleksi otomatis menggunakan kecerdasan buatan tanpa interaksi manusia' },
    ],
    correct_answer: 'C',
    explanation: '***Competency-based interview*** (BEI) = teknik wawancara yang **menggali pengalaman nyata** di masa lalu untuk **memprediksi** perilaku masa depan.\n\nMetode **STAR**:\n\n| Komponen | Pertanyaan |\n|---|---|\n| **S**ituation | Ceritakan situasi yang Anda hadapi |\n| **T**ask | Apa tugas/tanggung jawab Anda? |\n| **A**ction | Apa tindakan spesifik yang Anda ambil? |\n| **R**esult | Apa hasilnya? Apa yang Anda pelajari? |\n\nContoh pertanyaan BEI:\n- "Ceritakan saat Anda harus menyelesaikan konflik dalam tim"\n- "Berikan contoh saat Anda mengambil keputusan sulit di bawah tekanan"\n- "Kapan terakhir kali Anda memimpin proyek yang berhasil?"\n\nPrinsip BEI:\n- **Past behavior predicts future behavior**: perilaku masa lalu adalah prediktor terbaik\n- Lebih objektif dari wawancara tradisional\n- Mengurangi **bias** pewawancara\n- Dapat distandarisasi untuk perbandingan antar kandidat',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *9-Box Grid* dalam manajemen talenta?',
    options: [
      { key: 'A', text: 'Denah sembilan ruangan kantor untuk penempatan karyawan baru' },
      { key: 'B', text: 'Jadwal kerja sembilan shift yang digunakan di operasi tambang 24/7' },
      { key: 'C', text: 'Formulir penilaian dengan sembilan pertanyaan wajib dijawab karyawan' },
      { key: 'D', text: 'Sistem penomoran jabatan dalam struktur organisasi perusahaan' },
      { key: 'E', text: 'Matriks pemetaan talenta berdasarkan dua dimensi: kinerja saat ini dan potensi pengembangan' },
    ],
    correct_answer: 'E',
    explanation: '***9-Box Grid*** = **matriks pemetaan talenta** berdasarkan **kinerja** (sumbu X) dan **potensi** (sumbu Y).\n\n```\n                    KINERJA →\n              Rendah    Sedang    Tinggi\n  P  Tinggi | Enigma  | Growth  | Star    |\n  O  Sedang | Risk    | Core    | High    |\n  T  Rendah | Misfit  | Average | Solid   |\n  E                                        \n  N                                        \n  S                                        \n  I                                        \n```\n\nKategori kunci:\n- **Star** (kinerja tinggi + potensi tinggi): promosi, proyek strategis\n- **Core Player** (kinerja sedang + potensi sedang): backbone organisasi\n- **Enigma** (kinerja rendah + potensi tinggi): coaching intensif\n- **Misfit** (kinerja rendah + potensi rendah): improvement plan atau exit\n\nKegunaan:\n- **Succession planning**: identifikasi calon pemimpin masa depan\n- **Talent development**: program pengembangan yang tepat sasaran\n- **Retention strategy**: fokus retensi pada Star dan High Performer\n- **Resource allocation**: investasi SDM yang optimal',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *employer branding*?',
    options: [
      { key: 'A', text: 'Pemasangan logo perusahaan pada seragam dan helm keselamatan karyawan' },
      { key: 'B', text: 'Periklanan produk perusahaan kepada konsumen akhir melalui media massa' },
      { key: 'C', text: 'Sertifikasi merek dagang perusahaan di kantor hak kekayaan intelektual' },
      { key: 'D', text: 'Strategi membangun citra perusahaan sebagai tempat kerja yang menarik bagi calon karyawan potensial' },
      { key: 'E', text: 'Proses pendaftaran domain website perusahaan di internet' },
    ],
    correct_answer: 'D',
    explanation: '***Employer branding*** = **strategi membangun citra perusahaan** sebagai **tempat kerja yang menarik** bagi calon karyawan.\n\nKomponen employer branding:\n\n| Komponen | Contoh |\n|---|---|\n| **Employee Value Proposition** (EVP) | Apa yang ditawarkan perusahaan kepada karyawan |\n| **Budaya kerja** | Nilai-nilai, lingkungan, work-life balance |\n| **Kompensasi & benefit** | Gaji kompetitif, tunjangan, fasilitas |\n| **Pengembangan karir** | Pelatihan, rotasi, jalur karir |\n| **Reputasi** | Nama baik perusahaan di industri |\n\nMengapa penting untuk perusahaan tambang:\n- **Lokasi terpencil**: sulit bersaing dengan perusahaan di kota besar\n- **Persepsi industri**: stigma tambang sebagai pekerjaan berat dan kotor\n- **War for talent**: kompetisi memperebutkan engineer dan geologist\n- **Generasi baru**: milenial dan Gen Z mencari *purpose* dan *sustainability*\n\nKanal employer branding:\n- LinkedIn, Instagram, media sosial\n- Program magang dan kunjungan kampus\n- Testimoni karyawan (*employee advocacy*)',
  },

  // ═══════════════════════════════════════════
  // T3: Manajemen Kinerja & Sistem Kompensasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 8,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa prinsip SMART dalam perumusan KPI (*Key Performance Indicator*)?',
    options: [
      { key: 'A', text: 'Specific, Measurable, Achievable, Relevant, Time-bound' },
      { key: 'B', text: 'Simple, Modern, Adaptive, Responsive, Transparent' },
      { key: 'C', text: 'Strategic, Manageable, Actionable, Reliable, Testable' },
      { key: 'D', text: 'Systematic, Methodical, Accurate, Robust, Thorough' },
      { key: 'E', text: 'Scalable, Modular, Automated, Replicable, Trackable' },
    ],
    correct_answer: 'A',
    explanation: '**SMART** = kerangka perumusan KPI yang efektif:\n\n| Prinsip | Arti | Contoh KPI |\n|---|---|---|\n| **S**pecific | Jelas dan spesifik | "Kurangi turnover" → "Kurangi turnover karyawan site" |\n| **M**easurable | Dapat diukur | "Turnover < 10%/tahun" |\n| **A**chievable | Dapat dicapai | Realistis berdasarkan data historis |\n| **R**elevant | Relevan dengan tujuan | Turnover relevan dengan produktivitas |\n| **T**ime-bound | Ada batas waktu | "Per 31 Desember 2026" |\n\nContoh KPI SMART untuk HR di tambang:\n\n| KPI | Target |\n|---|---|\n| Turnover rate karyawan tetap | < 8% per tahun |\n| Time to fill posisi kritis | < 45 hari |\n| Training hours per karyawan | > 40 jam per tahun |\n| Employee engagement score | > 75% |\n| Rasio produktivitas SDM | > Rp500 juta revenue per karyawan |',
  },
  {
    order_index: 9,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Total Rewards* dalam sistem kompensasi?',
    options: [
      { key: 'A', text: 'Jumlah total hadiah yang diberikan saat acara penghargaan tahunan perusahaan' },
      { key: 'B', text: 'Keseluruhan imbalan karyawan meliputi kompensasi langsung, tunjangan, dan pengembangan karir' },
      { key: 'C', text: 'Total bonus yang dibagikan kepada seluruh karyawan di akhir tahun' },
      { key: 'D', text: 'Uang pensiun yang diterima karyawan setelah masa kerja 25 tahun' },
      { key: 'E', text: 'Potongan pajak penghasilan yang dikembalikan pemerintah kepada karyawan' },
    ],
    correct_answer: 'B',
    explanation: '***Total Rewards*** = **keseluruhan imbalan** yang diterima karyawan, tidak hanya uang:\n\n| Komponen | Contoh |\n|---|---|\n| **Kompensasi langsung** | Gaji pokok, bonus, insentif kinerja |\n| **Tunjangan** | BPJS, asuransi, tunjangan makan/transport |\n| **Work-life balance** | Cuti, jadwal fleksibel, fasilitas rekreasi |\n| **Pengembangan** | Pelatihan, beasiswa, rotasi jabatan |\n| **Pengakuan** | Penghargaan, promosi, kesempatan leadership |\n\nContoh total rewards di perusahaan tambang:\n- **Cash**: gaji + tunjangan site + bonus produksi\n- **Allowance**: tunjangan perumahan, transportasi, makan di site\n- **Benefit**: asuransi keluarga, BPJS TK+Kes, dana pensiun\n- **Non-monetary**: rotasi ke Jakarta, pelatihan luar negeri, cuti roster\n\nMengapa penting:\n- Menarik talenta berkualitas ke **lokasi terpencil**\n- **Retensi** karyawan kunci di tengah kompetisi industri\n- **Motivasi** dan engagement karyawan',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Sebuah perusahaan tambang memiliki $500$ karyawan dengan total biaya SDM $\\text{Rp}150$ miliar per tahun dan revenue $\\text{Rp}3$ triliun. Berapa *revenue per employee*?',
    options: [
      { key: 'A', text: 'Rp$300$ juta' },
      { key: 'B', text: 'Rp$500$ juta' },
      { key: 'C', text: 'Rp$6$ miliar' },
      { key: 'D', text: 'Rp$1{,}5$ miliar' },
      { key: 'E', text: 'Rp$3$ miliar' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan *revenue per employee*:\n$$\\text{Revenue per employee} = \\frac{\\text{Total revenue}}{\\text{Jumlah karyawan}} = \\frac{\\text{Rp}3 \\text{ triliun}}{500} = \\text{Rp}6 \\text{ miliar}$$\n\nMetrik SDM terkait:\n\n| Metrik | Rumus | Hasil |\n|---|---|---|\n| **Revenue per employee** | Revenue / Jumlah karyawan | Rp$6$ miliar |\n| **HC cost ratio** | Biaya SDM / Revenue | $150/3.000 = 5\\%$ |\n| **Cost per employee** | Biaya SDM / Jumlah karyawan | Rp$300$ juta |\n| **HC ROI** | (Revenue - Biaya SDM) / Biaya SDM | $(3.000-150)/150 = 19\\times$ |\n\nBenchmark industri tambang:\n- Revenue per employee: Rp$3$-$10$ miliar (tergantung harga komoditas)\n- HC cost ratio: 3-8% dari revenue\n- Industri tambang umumnya **padat modal**, sehingga revenue per employee cenderung **tinggi** dibanding industri jasa',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa tahapan dalam siklus manajemen kinerja (*performance management cycle*)?',
    options: [
      { key: 'A', text: 'Rekrutmen, orientasi, penempatan, promosi, pensiun' },
      { key: 'B', text: 'Pelatihan, sertifikasi, rotasi, mutasi, promosi' },
      { key: 'C', text: 'Survei kepuasan, analisis data, presentasi hasil, tindak lanjut' },
      { key: 'D', text: 'Audit keuangan, koreksi, pelaporan, evaluasi, pengulangan' },
      { key: 'E', text: 'Penetapan sasaran, monitoring & coaching, penilaian kinerja, dan feedback' },
    ],
    correct_answer: 'E',
    explanation: 'Siklus **manajemen kinerja** (*performance management cycle*):\n\n| Tahap | Aktivitas | Timing |\n|---|---|---|\n| **1. Goal setting** | Menetapkan KPI dan target bersama atasan | Awal tahun |\n| **2. Monitoring & coaching** | Review berkala, feedback, coaching | Sepanjang tahun |\n| **3. Performance appraisal** | Penilaian formal pencapaian KPI | Tengah/akhir tahun |\n| **4. Feedback & development** | Umpan balik, rencana pengembangan, reward | Akhir tahun |\n\nMetode penilaian:\n- **KPI-based**: kuantitatif, terukur (produksi, biaya, timeline)\n- **Competency-based**: perilaku dan kompetensi (leadership, teamwork)\n- **360-degree feedback**: penilaian dari atasan, rekan, bawahan, pelanggan\n- **OKR** (*Objectives & Key Results*): sasaran ambisius dengan hasil kunci terukur\n\nKesalahan umum (*rating bias*):\n- **Halo effect**: satu aspek positif mempengaruhi semua penilaian\n- **Recency bias**: hanya mengingat kinerja terbaru\n- **Central tendency**: menilai semua karyawan di tengah-tengah',
  },

  // ═══════════════════════════════════════════
  // T4: Pelatihan & Pengembangan Organisasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 12,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Training Need Analysis* (TNA)?',
    options: [
      { key: 'A', text: 'Analisis biaya yang diperlukan untuk membangun pusat pelatihan baru' },
      { key: 'B', text: 'Evaluasi kinerja vendor penyedia jasa pelatihan selama satu tahun' },
      { key: 'C', text: 'Survei kepuasan peserta setelah mengikuti program pelatihan' },
      { key: 'D', text: 'Proses mengidentifikasi kesenjangan kompetensi dan menentukan kebutuhan pelatihan' },
      { key: 'E', text: 'Daftar sertifikasi wajib yang harus dimiliki seluruh karyawan perusahaan' },
    ],
    correct_answer: 'D',
    explanation: '***Training Need Analysis*** (TNA) = **proses sistematis** mengidentifikasi **kesenjangan kompetensi** dan menentukan **kebutuhan pelatihan** yang tepat.\n\nLevel analisis TNA:\n\n| Level | Fokus | Pertanyaan |\n|---|---|---|\n| **Organisasi** | Strategi bisnis | Kompetensi apa yang dibutuhkan? |\n| **Jabatan/tugas** | Standar kinerja | Skill apa yang kurang? |\n| **Individu** | Gap kompetensi | Siapa yang perlu dilatih? |\n\nMetode TNA:\n- **Performance gap analysis**: selisih antara kinerja aktual dan target\n- **Competency assessment**: pemetaan kompetensi vs standar jabatan\n- **Survei kebutuhan**: kuesioner dari karyawan dan atasan\n- **Observasi**: pengamatan langsung di lapangan\n\nHasil TNA:\n- **Training plan**: program pelatihan prioritas\n- **Budget**: alokasi anggaran pelatihan\n- **Timeline**: jadwal pelaksanaan\n- **Success metric**: cara mengukur efektivitas pelatihan',
  },
  {
    order_index: 13,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan model pembelajaran *70-20-10*?',
    options: [
      { key: 'A', text: '70% materi teori, 20% praktik, 10% ujian dalam setiap pelatihan' },
      { key: 'B', text: '70% dari pengalaman kerja, 20% dari interaksi sosial, 10% dari pelatihan formal' },
      { key: 'C', text: '70% karyawan harus dilatih, 20% dipromosi, 10% dirotasi setiap tahun' },
      { key: 'D', text: '70% anggaran untuk gaji, 20% untuk tunjangan, 10% untuk pelatihan' },
      { key: 'E', text: '70% waktu kerja, 20% waktu belajar, 10% waktu istirahat setiap hari' },
    ],
    correct_answer: 'B',
    explanation: 'Model ***70-20-10*** (Lombardo & Eichinger, Center for Creative Leadership):\n\n| Proporsi | Sumber | Contoh |\n|---|---|---|\n| **70%** | **Pengalaman kerja** (*on-the-job*) | Proyek menantang, rotasi jabatan, *stretch assignment* |\n| **20%** | **Interaksi sosial** | Mentoring, coaching, feedback atasan, peer learning |\n| **10%** | **Pelatihan formal** | Kursus, workshop, sertifikasi, e-learning |\n\nImplikasi untuk pengembangan SDM:\n- Jangan hanya mengandalkan **kelas pelatihan** (hanya 10% kontribusi)\n- Berikan **penugasan menantang** sebagai sarana belajar utama\n- Kembangkan **budaya mentoring** dan coaching\n- **On-the-job training** sangat penting di industri tambang\n\nContoh penerapan di tambang:\n- **70%**: engineer junior ditugaskan ke proyek smelter baru\n- **20%**: dipasangkan dengan senior engineer sebagai mentor\n- **10%**: mengikuti pelatihan project management sertifikasi PMP',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *change management* (manajemen perubahan) dan mengapa penting di perusahaan tambang?',
    options: [
      { key: 'A', text: 'Proses mengganti seluruh peralatan tambang dengan teknologi terbaru' },
      { key: 'B', text: 'Rotasi karyawan antar departemen setiap enam bulan' },
      { key: 'C', text: 'Pendekatan terstruktur untuk mempersiapkan organisasi dalam mengadopsi perubahan' },
      { key: 'D', text: 'Pergantian manajemen puncak perusahaan melalui RUPS' },
      { key: 'E', text: 'Proses pengubahan jam kerja dari 8 jam menjadi 12 jam per shift' },
    ],
    correct_answer: 'C',
    explanation: '***Change management*** = **pendekatan terstruktur** untuk mempersiapkan dan mendukung organisasi **mengadopsi perubahan**.\n\nModel perubahan populer:\n\n**Kotter\'s 8 Steps**:\n1. Ciptakan urgensi\n2. Bentuk koalisi pemandu\n3. Kembangkan visi & strategi\n4. Komunikasikan visi perubahan\n5. Berdayakan tindakan luas\n6. Hasilkan kemenangan jangka pendek\n7. Konsolidasikan keuntungan\n8. Tanamkan dalam budaya\n\nContoh perubahan di perusahaan tambang:\n- **Digital transformation**: implementasi ERP, IoT, autonomous truck\n- **Restrukturisasi**: merger unit bisnis, perampingan organisasi\n- **Transisi energi**: dari diesel ke listrik/renewable\n- **Budaya**: dari *compliance-driven* ke *performance-driven*\n\nMengapa sering gagal:\n- Resistensi karyawan (\"sudah biasa dengan cara lama\")\n- Komunikasi yang buruk\n- Kurangnya dukungan manajemen puncak',
  },

  // ═══════════════════════════════════════════
  // T5: Hubungan Industrial & Hukum Ketenagakerjaan (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 15,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang diatur dalam Undang-Undang Ketenagakerjaan Indonesia (UU No. 13/2003 jo. UU Cipta Kerja)?',
    options: [
      { key: 'A', text: 'Hak dan kewajiban pekerja serta pengusaha, termasuk upah, jam kerja, PHK, jaminan sosial, dan hubungan industrial' },
      { key: 'B', text: 'Hanya mengatur tentang besaran upah minimum di setiap provinsi' },
      { key: 'C', text: 'Khusus mengatur tentang keselamatan dan kesehatan kerja di sektor pertambangan' },
      { key: 'D', text: 'Hanya berlaku untuk perusahaan asing yang beroperasi di Indonesia' },
      { key: 'E', text: 'Mengatur tentang pendidikan dan pelatihan vokasi di Indonesia' },
    ],
    correct_answer: 'A',
    explanation: '**UU Ketenagakerjaan** mengatur komprehensif tentang **hubungan kerja** di Indonesia:\n\n| Aspek | Ketentuan utama |\n|---|---|\n| **Perjanjian kerja** | PKWT vs PKWTT, masa percobaan |\n| **Waktu kerja** | 40 jam/minggu (7 jam/hari atau 8 jam/hari) |\n| **Upah** | UMP/UMK, struktur & skala upah |\n| **Cuti** | Tahunan (12 hari), melahirkan (3 bulan), dll |\n| **PHK** | Prosedur, uang pesangon, uang penghargaan |\n| **Outsourcing** | Jenis pekerjaan yang boleh di-outsource |\n| **Jaminan sosial** | BPJS Ketenagakerjaan, BPJS Kesehatan |\n| **Hubungan industrial** | Serikat pekerja, PKB, mogok kerja |\n\nPerubahan via **UU Cipta Kerja** (2020):\n- Fleksibilitas PKWT (kontrak)\n- Perubahan formula pesangon\n- Pengaturan upah per jam\n- *Outsourcing* lebih fleksibel',
  },
  {
    order_index: 16,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Perjanjian Kerja Bersama* (PKB)?',
    options: [
      { key: 'A', text: 'Kontrak kerja individu antara karyawan baru dan perusahaan' },
      { key: 'B', text: 'Perjanjian antar perusahaan untuk saling bertukar karyawan' },
      { key: 'C', text: 'Dokumen perencanaan strategis perusahaan untuk lima tahun ke depan' },
      { key: 'D', text: 'Perjanjian hasil perundingan antara serikat pekerja dan pengusaha tentang syarat-syarat kerja' },
      { key: 'E', text: 'Surat keputusan direksi tentang peraturan perusahaan yang berlaku sepihak' },
    ],
    correct_answer: 'D',
    explanation: '**PKB** (*Perjanjian Kerja Bersama*) = **perjanjian hasil perundingan** antara **serikat pekerja** dan **pengusaha** tentang syarat-syarat kerja.\n\nKarakteristik PKB:\n\n| Aspek | Ketentuan |\n|---|---|\n| **Para pihak** | Serikat pekerja + pengusaha |\n| **Isi** | Hak & kewajiban, upah, tunjangan, jam kerja, PHK |\n| **Masa berlaku** | Maksimal 2 tahun, dapat diperpanjang 1 tahun |\n| **Sifat** | Mengikat kedua pihak |\n| **Syarat** | Serikat pekerja mewakili > 50% karyawan |\n\nPerbedaan PKB vs Peraturan Perusahaan (PP):\n\n| | PKB | PP |\n|---|---|---|\n| **Pembuatan** | Bersama (bipartit) | Sepihak (perusahaan) |\n| **Persetujuan** | Kedua pihak | Pengesahan Disnaker |\n| **Kekuatan** | Lebih kuat | Lebih lemah |\n\nDi perusahaan tambang:\n- Serikat pekerja umumnya **aktif** dan memiliki bargaining power\n- PKB mengatur **tunjangan site**, jadwal roster, fasilitas mess\n- Negosiasi PKB bisa menjadi **proses intensif** yang memerlukan keahlian hubungan industrial',
  },
  {
    order_index: 17,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa mekanisme penyelesaian perselisihan hubungan industrial menurut UU No. 2/2004?',
    options: [
      { key: 'A', text: 'Seluruh perselisihan wajib diselesaikan melalui pengadilan pidana' },
      { key: 'B', text: 'Perusahaan berhak memutuskan sepihak tanpa mediasi apapun' },
      { key: 'C', text: 'Hanya serikat pekerja yang berhak mengajukan penyelesaian sengketa' },
      { key: 'D', text: 'Semua perselisihan harus diselesaikan oleh Kementerian BUMN' },
      { key: 'E', text: 'Bipartit, lalu mediasi/konsiliasi/arbitrase, terakhir Pengadilan Hubungan Industrial' },
    ],
    correct_answer: 'E',
    explanation: 'Mekanisme penyelesaian perselisihan hubungan industrial (UU No. 2/2004):\n\n$$\\text{Bipartit} \\xrightarrow{\\text{gagal}} \\text{Tripartit (Mediasi/Konsiliasi/Arbitrase)} \\xrightarrow{\\text{gagal}} \\text{PHI}$$\n\n| Tahap | Mekanisme | Durasi |\n|---|---|---|\n| **1. Bipartit** | Perundingan langsung pekerja-pengusaha | Maks 30 hari |\n| **2a. Mediasi** | Mediator dari Disnaker memfasilitasi | Maks 30 hari |\n| **2b. Konsiliasi** | Konsiliator independen (perselisihan kepentingan) | Maks 30 hari |\n| **2c. Arbitrase** | Arbiter (putusan final, tidak bisa banding) | Maks 30 hari |\n| **3. PHI** | Pengadilan Hubungan Industrial | Maks 50 hari |\n| **4. Kasasi** | Mahkamah Agung (untuk putusan PHI) | - |\n\nJenis perselisihan:\n- **Hak**: pelanggaran hak yang sudah diatur (upah, cuti)\n- **Kepentingan**: perundingan syarat kerja baru (PKB)\n- **PHK**: perselisihan tentang pemutusan hubungan kerja\n- **Antar serikat**: konflik antar serikat pekerja dalam satu perusahaan',
  },

  // ═══════════════════════════════════════════
  // T6: Analitik SDM & Sistem Informasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 18,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *turnover rate* karyawan?',
    options: [
      { key: 'A', text: 'Persentase karyawan keluar dibanding rata-rata jumlah karyawan pada periode tertentu' },
      { key: 'B', text: 'Jumlah produksi per karyawan dalam satu tahun' },
      { key: 'C', text: 'Kecepatan rotasi shift kerja karyawan di site tambang' },
      { key: 'D', text: 'Persentase karyawan yang dipromosikan setiap tahun' },
      { key: 'E', text: 'Rasio pendapatan perusahaan terhadap jumlah karyawan' },
    ],
    correct_answer: 'A',
    explanation: '***Turnover rate*** = **persentase karyawan yang keluar** dalam periode tertentu.\n\n$$\\text{Turnover rate} = \\frac{\\text{Jumlah karyawan keluar}}{\\text{Rata-rata jumlah karyawan}} \\times 100\\%$$\n\nContoh:\n- Karyawan keluar dalam 1 tahun: 40 orang\n- Rata-rata karyawan: 500 orang\n- Turnover rate = $40/500 \\times 100\\% = 8\\%$\n\nJenis turnover:\n- **Voluntary**: karyawan mengundurkan diri\n- **Involuntary**: PHK, kontrak habis\n- **Functional**: karyawan berkinerja rendah keluar (positif)\n- **Dysfunctional**: karyawan berkinerja tinggi keluar (negatif)\n\nBenchmark industri tambang:\n- Turnover < 5%: sangat rendah (mungkin terlalu rendah)\n- Turnover 5-10%: sehat\n- Turnover 10-15%: perlu perhatian\n- Turnover > 15%: masalah serius\n\nBiaya turnover: 50-200% dari gaji tahunan karyawan (rekrutmen, training, produktivitas hilang)',
  },
  {
    order_index: 19,
    category: 'T6',
    difficulty: 'medium',
    content: 'Sebuah departemen memiliki rata-rata $80$ karyawan selama setahun. Selama periode tersebut, $12$ karyawan mengundurkan diri dan $4$ karyawan di-PHK. Berapa total turnover rate?',
    options: [
      { key: 'A', text: '$15\\%$' },
      { key: 'B', text: '$20\\%$' },
      { key: 'C', text: '$10\\%$' },
      { key: 'D', text: '$5\\%$' },
      { key: 'E', text: '$12\\%$' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan total turnover rate:\n\n$$\\text{Total karyawan keluar} = 12 \\text{ (resign)} + 4 \\text{ (PHK)} = 16 \\text{ orang}$$\n\n$$\\text{Turnover rate} = \\frac{16}{80} \\times 100\\% = 20\\%$$\n\nAnalisis lebih detail:\n- **Voluntary turnover** = $12/80 = 15\\%$ (mengkhawatirkan)\n- **Involuntary turnover** = $4/80 = 5\\%$ (wajar)\n\nTurnover $20\\%$ tergolong **tinggi** untuk industri tambang.\n\nTindakan yang diperlukan:\n1. **Exit interview** untuk memahami alasan resign\n2. **Analisis** apakah ada pola (jabatan, lokasi, masa kerja tertentu)\n3. **Review kompensasi** dibandingkan pasar\n4. **Perbaikan** lingkungan kerja dan jalur karir\n5. **Retention program** untuk karyawan kunci',
  },
  {
    order_index: 20,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa fungsi utama *Human Resource Information System* (HRIS)?',
    options: [
      { key: 'A', text: 'Sistem keamanan untuk mengontrol akses karyawan ke area terbatas' },
      { key: 'B', text: 'Platform media sosial internal untuk komunikasi antar karyawan' },
      { key: 'C', text: 'Sistem informasi terintegrasi untuk mengelola data dan proses SDM secara digital' },
      { key: 'D', text: 'Aplikasi untuk memesan tiket pesawat dan hotel bagi karyawan yang bepergian' },
      { key: 'E', text: 'Software desain grafis untuk membuat materi pelatihan karyawan' },
    ],
    correct_answer: 'C',
    explanation: '**HRIS** (*Human Resource Information System*) = **sistem informasi terintegrasi** untuk mengelola **data karyawan** dan **proses SDM**.\n\nModul HRIS:\n\n| Modul | Fungsi |\n|---|---|\n| **Core HR** | Data karyawan, struktur organisasi |\n| **Payroll** | Penggajian, PPh 21, BPJS |\n| **Time & Attendance** | Absensi, cuti, lembur |\n| **Recruitment** | *Applicant Tracking System* (ATS) |\n| **Performance** | Penilaian kinerja, KPI tracking |\n| **Learning** | LMS (*Learning Management System*) |\n| **Analytics** | Dashboard, laporan, prediktif |\n\nContoh platform HRIS:\n- **SAP SuccessFactors**: enterprise, digunakan banyak BUMN\n- **Oracle HCM Cloud**: enterprise\n- **Workday**: cloud-native\n- **Talenta/Gadjian**: platform lokal Indonesia\n\nManfaat:\n- **Efisiensi** administrasi HR (otomasi payroll, cuti)\n- **Akurasi** data karyawan\n- **Compliance** regulasi ketenagakerjaan\n- **Data-driven decision**: analitik SDM untuk keputusan strategis',
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
  console.log(`Jumlah soal batch 1: ${questions.length}\n`)

  const { count } = await (supabase.from('questions') as any)
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)

  console.log(`Soal existing: ${count ?? 0}`)

  if (count && count > 0) {
    console.log('Menghapus soal lama...')
    await (supabase.from('questions') as any).delete().eq('package_id', pkg.id)
    console.log('Soal lama berhasil dihapus.\n')
  }

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

  console.log(`\n✅ Berhasil insert ${data.length} soal:\n`)

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
}

main()
