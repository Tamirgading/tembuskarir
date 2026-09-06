/**
 * ANTAM IMPACT 2026 — Corporate Relation (CRL) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Komunikasi Korporasi & Hubungan Media): 4 soal
 *   T2 (Manajemen Pemangku Kepentingan): 4 soal
 *   T3 (Manajemen Krisis & Reputasi): 4 soal
 *   T4 (Keterbukaan Informasi & Hukum Komunikasi): 4 soal
 *   T5 (Pemahaman Bisnis & Tata Kelola Perusahaan): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-corprel-batch1.ts
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
// A: 2,8,14,17 | B: 4,9,11,19 | C: 1,7,16,20 | D: 3,10,13,18 | E: 5,6,12,15

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Komunikasi Korporasi & Hubungan Media (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *media relations* dalam komunikasi korporasi?',
    options: [
      { key: 'A', text: 'Kegiatan membeli media massa agar selalu memberitakan hal positif tentang perusahaan' },
      { key: 'B', text: 'Departemen yang bertanggung jawab membuat iklan produk perusahaan di televisi' },
      { key: 'C', text: 'Upaya membangun dan memelihara hubungan baik dengan media untuk pemberitaan positif' },
      { key: 'D', text: 'Kegiatan memonitor media sosial pribadi karyawan perusahaan' },
      { key: 'E', text: 'Program pelatihan menulis artikel ilmiah untuk karyawan perusahaan' },
    ],
    correct_answer: 'C',
    explanation: '**Media relations** = upaya membangun **hubungan baik** dengan media massa untuk pemberitaan yang **akurat, seimbang, dan positif**.\n\nKomponen media relations:\n\n| Komponen | Kegiatan |\n|---|---|\n| **Media list** | Daftar jurnalis dan media yang relevan |\n| **Press release** | Siaran pers untuk informasi penting |\n| **Press conference** | Konferensi pers untuk isu besar |\n| **Media visit** | Mengundang media ke lokasi operasi |\n| **Media monitoring** | Memantau pemberitaan tentang perusahaan |\n| **Spokesperson** | Juru bicara resmi perusahaan |\n\nPrinsip media relations:\n- **Proaktif**: menyampaikan informasi sebelum diminta\n- **Transparan**: memberikan data yang akurat\n- **Responsif**: merespons permintaan media dengan cepat\n- **Konsisten**: pesan yang selaras dengan corporate narrative\n\nDi perusahaan tambang:\n- Media relations sangat penting karena isu **lingkungan**, **masyarakat**, dan **keselamatan** sering menjadi sorotan media\n- Hubungan baik dengan media membantu **mengelola narasi** saat terjadi insiden',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa komponen utama yang harus ada dalam sebuah *press release* (siaran pers) yang efektif?',
    options: [
      { key: 'A', text: 'Judul, lead (5W+1H), body, boilerplate, dan kontak media' },
      { key: 'B', text: 'Daftar produk perusahaan, harga jual, dan lokasi pembelian' },
      { key: 'C', text: 'Laporan keuangan lengkap, neraca, dan arus kas' },
      { key: 'D', text: 'Daftar nama seluruh karyawan dan jabatannya' },
      { key: 'E', text: 'Foto-foto pribadi direksi beserta biodata lengkap keluarga' },
    ],
    correct_answer: 'A',
    explanation: 'Komponen **press release** yang efektif:\n\n| Komponen | Fungsi | Contoh |\n|---|---|---|\n| **Judul** (headline) | Menarik perhatian, ringkas | "ANTAM Raih Laba Bersih Rp3,6 Triliun di 2025" |\n| **Lead paragraph** | Menjawab 5W+1H | Siapa, apa, kapan, di mana, mengapa, bagaimana |\n| **Body** | Detail dan kutipan | Data pendukung, kutipan direktur utama |\n| **Boilerplate** | Profil singkat perusahaan | Deskripsi standar tentang ANTAM |\n| **Kontak media** | Narahubung | Nama, telepon, email PR/Corp Comm |\n\nFormat penulisan:\n- **Inverted pyramid**: informasi terpenting di awal\n- **Bahasa**: lugas, formal, tidak promosional\n- **Panjang**: idealnya 1-2 halaman\n- **Kutipan**: minimal 1 kutipan dari pejabat berwenang\n\nDistribusi:\n- **Wire service**: melalui layanan distribusi berita\n- **Email**: langsung ke media list\n- **Website**: upload di halaman media/newsroom perusahaan\n- **Media sosial**: share di kanal resmi perusahaan',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *corporate branding* dan mengapa penting bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Proses membuat logo dan kartu nama untuk seluruh karyawan' },
      { key: 'B', text: 'Kegiatan membagikan merchandise gratis di pameran' },
      { key: 'C', text: 'Program diskon khusus untuk produk perusahaan' },
      { key: 'D', text: 'Strategi membangun citra perusahaan secara konsisten agar berbeda dari kompetitor' },
      { key: 'E', text: 'Pendaftaran merek dagang di kantor kekayaan intelektual' },
    ],
    correct_answer: 'D',
    explanation: '**Corporate branding** = strategi membangun **identitas dan citra perusahaan** yang **konsisten** dan **membedakan** dari kompetitor.\n\nElemen corporate branding:\n\n| Elemen | Contoh di ANTAM |\n|---|---|\n| **Nama & logo** | Logo ANTAM, tagline |\n| **Visi & misi** | Misi perusahaan tambang terintegrasi |\n| **Nilai perusahaan** | Integritas, profesionalisme, keberlanjutan |\n| **Identitas visual** | Warna korporat, tipografi, desain |\n| **Tone of voice** | Gaya komunikasi (formal, profesional) |\n| **Pengalaman** | Customer experience, employee experience |\n\nMengapa penting di tambang:\n- **License to operate**: citra positif memudahkan perizinan dan penerimaan masyarakat\n- **Investor confidence**: brand kuat menarik investasi\n- **Talent attraction**: employer branding menarik talenta terbaik\n- **Premium pricing**: produk bermerek bisa dijual lebih mahal (contoh: emas Logam Mulia)\n- **Crisis resilience**: brand kuat lebih tahan terhadap krisis reputasi',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *media monitoring* dan apa tujuannya?',
    options: [
      { key: 'A', text: 'Memata-matai jurnalis yang menulis berita negatif tentang perusahaan' },
      { key: 'B', text: 'Proses memantau dan menganalisis pemberitaan media tentang perusahaan untuk mengukur sentimen publik' },
      { key: 'C', text: 'Menghitung jumlah iklan yang ditayangkan perusahaan setiap bulan' },
      { key: 'D', text: 'Memonitor jadwal tayang program televisi untuk merencanakan waktu iklan' },
      { key: 'E', text: 'Mengawasi konten yang diposting karyawan di media sosial pribadi' },
    ],
    correct_answer: 'B',
    explanation: '**Media monitoring** = proses **memantau, mengumpulkan, dan menganalisis** pemberitaan media tentang perusahaan.\n\nTujuan:\n\n| Tujuan | Detail |\n|---|---|\n| **Mengukur sentimen** | Positif, negatif, atau netral terhadap perusahaan |\n| **Deteksi isu** | Identifikasi isu potensial sebelum menjadi krisis |\n| **Evaluasi PR** | Mengukur efektivitas program komunikasi |\n| **Competitive intelligence** | Memantau pemberitaan kompetitor |\n| **Compliance** | Memastikan informasi yang beredar akurat |\n\nMetrik yang diukur:\n\n| Metrik | Penjelasan |\n|---|---|\n| **Share of Voice** | Proporsi pemberitaan dibanding kompetitor |\n| **Tone/Sentimen** | Rasio berita positif vs negatif |\n| **Reach** | Jangkauan media yang memberitakan |\n| **Key message pickup** | Seberapa sering pesan kunci perusahaan muncul |\n| **Issues tracking** | Isu apa yang paling sering muncul |\n\nTools:\n- **Media monitoring services**: Isentia, Meltwater, Cision\n- **Social listening**: Brandwatch, Sprout Social\n- **Manual clipping**: pengumpulan manual (untuk media cetak lokal)',
  },

  // ═══════════════════════════════════════════
  // T2: Manajemen Pemangku Kepentingan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *stakeholder mapping* dan bagaimana tekniknya?',
    options: [
      { key: 'A', text: 'Pemetaan lokasi kantor seluruh mitra bisnis perusahaan di peta geografis' },
      { key: 'B', text: 'Daftar nama dan alamat seluruh pemegang saham perusahaan' },
      { key: 'C', text: 'Inventarisasi peralatan dan aset perusahaan di setiap lokasi operasi' },
      { key: 'D', text: 'Pemetaan struktur organisasi internal perusahaan dari direktur hingga staf' },
      { key: 'E', text: 'Proses memprioritaskan pemangku kepentingan berdasarkan kepentingan dan pengaruhnya' },
    ],
    correct_answer: 'E',
    explanation: '**Stakeholder mapping** = proses **mengidentifikasi dan memprioritaskan** pemangku kepentingan berdasarkan **kepentingan dan pengaruh**.\n\nMatriks Power-Interest (Mendelow):\n\n| | Kepentingan Rendah | Kepentingan Tinggi |\n|---|---|---|\n| **Pengaruh Tinggi** | **Keep Satisfied** (pemerintah daerah yang tidak terdampak langsung) | **Manage Closely** (pemegang saham mayoritas, regulator) |\n| **Pengaruh Rendah** | **Monitor** (media niche, akademisi) | **Keep Informed** (masyarakat sekitar, LSM) |\n\nStakeholder perusahaan tambang:\n\n| Stakeholder | Kepentingan | Strategi |\n|---|---|---|\n| **Pemerintah** | Regulasi, pajak, royalti | Manage closely |\n| **Masyarakat sekitar** | Dampak lingkungan, CSR | Keep informed |\n| **Investor/pemegang saham** | Return, transparansi | Manage closely |\n| **Karyawan** | Kesejahteraan, keselamatan | Manage closely |\n| **Media** | Informasi, berita | Keep informed |\n| **LSM/NGO** | Lingkungan, HAM | Keep informed |\n| **Vendor/kontraktor** | Bisnis, pembayaran | Keep satisfied |',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *government relations* (hubungan pemerintah) dalam konteks perusahaan tambang?',
    options: [
      { key: 'A', text: 'Kegiatan menyuap pejabat pemerintah untuk mendapatkan izin' },
      { key: 'B', text: 'Program penempatan karyawan perusahaan sebagai PNS di kementerian' },
      { key: 'C', text: 'Upaya mendirikan partai politik yang mendukung kepentingan perusahaan' },
      { key: 'D', text: 'Kegiatan menuntut pemerintah melalui pengadilan untuk membatalkan regulasi' },
      { key: 'E', text: 'Upaya membangun hubungan konstruktif dengan lembaga pemerintah demi kelancaran operasi dan kepatuhan regulasi' },
    ],
    correct_answer: 'E',
    explanation: '**Government relations** = membangun **hubungan konstruktif** dengan lembaga pemerintah.\n\nTujuan:\n\n| Tujuan | Detail |\n|---|---|\n| **Kelancaran operasi** | Perizinan, regulasi yang mendukung |\n| **Kepatuhan** | Memahami dan mematuhi regulasi baru |\n| **Advokasi** | Menyampaikan aspirasi industri secara etis |\n| **Partnership** | Kolaborasi dalam program pemerintah |\n\nLembaga pemerintah yang relevan:\n\n| Lembaga | Relevansi |\n|---|---|\n| **Kementerian ESDM** | Perizinan tambang (IUP/IUPK), royalti |\n| **Kementerian LHK** | Izin lingkungan, AMDAL, PROPER |\n| **Kementerian BUMN** | Kebijakan BUMN, GCG, target kinerja |\n| **Pemerintah daerah** | Izin daerah, CSR, hubungan masyarakat |\n| **OJK** | Regulasi pasar modal (untuk emiten) |\n| **BPK** | Audit keuangan negara (untuk BUMN) |\n\nBatasan etis:\n- **Tidak boleh**: suap, gratifikasi, facilitation payment\n- **Boleh**: presentasi data, public hearing, konsultasi publik, asosiasi industri\n- Komunikasi harus **transparan, legal, dan dapat dipertanggungjawabkan**',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *community engagement* (keterlibatan masyarakat) dalam konteks perusahaan tambang?',
    options: [
      { key: 'A', text: 'Kegiatan merekrut masyarakat sekitar sebagai karyawan tetap perusahaan' },
      { key: 'B', text: 'Program memindahkan masyarakat sekitar tambang ke lokasi yang jauh' },
      { key: 'C', text: 'Proses membangun dialog dua arah dan partisipasi masyarakat dalam menanggapi dampak operasi perusahaan' },
      { key: 'D', text: 'Pembagian sembako gratis kepada masyarakat setiap bulan' },
      { key: 'E', text: 'Pemasangan iklan perusahaan di papan reklame di sekitar area tambang' },
    ],
    correct_answer: 'C',
    explanation: '**Community engagement** = **dialog dua arah** dan **partisipasi aktif** masyarakat dalam dampak operasi perusahaan.\n\nTingkatan engagement (IAP2 Spectrum):\n\n| Level | Deskripsi | Contoh |\n|---|---|---|\n| **Inform** | Memberikan informasi | Newsletter, papan pengumuman |\n| **Consult** | Meminta masukan | Public hearing, survei |\n| **Involve** | Melibatkan dalam proses | Forum warga, kelompok kerja |\n| **Collaborate** | Bermitra dalam keputusan | Joint committee, co-management |\n| **Empower** | Menyerahkan keputusan | Community-based monitoring |\n\nProgram community engagement di tambang:\n\n| Program | Contoh |\n|---|---|\n| **Sosialisasi** | Presentasi rencana operasi ke masyarakat |\n| **FPIC** | Free, Prior, Informed Consent untuk lahan adat |\n| **CSR** | Program pendidikan, kesehatan, ekonomi lokal |\n| **Grievance mechanism** | Saluran pengaduan masyarakat |\n| **Monitoring partisipatif** | Masyarakat ikut memantau dampak lingkungan |\n\nMengapa penting:\n- **Social License to Operate** (SLO): izin sosial dari masyarakat\n- Mencegah **konflik sosial** dan penolakan operasi\n- Memenuhi standar **IFC Performance Standards** dan **OECD Guidelines**',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Social License to Operate* (SLO)?',
    options: [
      { key: 'A', text: 'Penerimaan informal dari masyarakat atas keberadaan dan operasi perusahaan di suatu wilayah' },
      { key: 'B', text: 'Izin usaha resmi yang diterbitkan oleh pemerintah daerah' },
      { key: 'C', text: 'Sertifikat ISO yang harus dimiliki perusahaan untuk beroperasi' },
      { key: 'D', text: 'Lisensi perangkat lunak yang digunakan untuk mengelola media sosial perusahaan' },
      { key: 'E', text: 'Izin yang diberikan serikat pekerja agar perusahaan boleh beroperasi pada hari libur' },
    ],
    correct_answer: 'A',
    explanation: '**Social License to Operate** (SLO) = **penerimaan informal** dari masyarakat terhadap operasi perusahaan.\n\nTingkatan SLO:\n\n| Level | Deskripsi | Indikator |\n|---|---|---|\n| **Withdrawal** | Masyarakat menolak | Demonstrasi, blokade, gugatan |\n| **Acceptance** | Masyarakat menerima | Tidak ada protes, koeksistensi |\n| **Approval** | Masyarakat mendukung | Partisipasi aktif, dukungan publik |\n| **Identification** | Masyarakat merasa memiliki | Kebanggaan, advokasi untuk perusahaan |\n\nFaktor yang mempengaruhi SLO:\n\n| Faktor | Detail |\n|---|---|\n| **Legitimacy** | Apakah operasi dianggap sah dan adil? |\n| **Credibility** | Apakah perusahaan bisa dipercaya? |\n| **Trust** | Apakah ada kepercayaan timbal balik? |\n\nContoh kehilangan SLO di tambang:\n- Pencemaran sungai → demonstrasi massal → operasi terhenti\n- Tidak ada manfaat ekonomi bagi warga → penolakan perpanjangan izin\n- Relokasi paksa tanpa kompensasi layak → gugatan hukum\n\nSLO bersifat **dinamis**: bisa naik atau turun seiring waktu, dan harus terus **dijaga dan diperkuat**.',
  },

  // ═══════════════════════════════════════════
  // T3: Manajemen Krisis & Reputasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa komponen utama dalam *Crisis Communication Plan* (Rencana Komunikasi Krisis)?',
    options: [
      { key: 'A', text: 'Daftar nomor telepon seluruh karyawan untuk koordinasi darurat' },
      { key: 'B', text: 'Tim krisis, klasifikasi krisis, protokol komunikasi, key messages, dan rencana pemulihan reputasi' },
      { key: 'C', text: 'Skenario evakuasi dan titik kumpul untuk seluruh karyawan' },
      { key: 'D', text: 'Anggaran khusus untuk membayar media agar tidak memberitakan krisis' },
      { key: 'E', text: 'Polis asuransi yang menanggung seluruh kerugian akibat krisis' },
    ],
    correct_answer: 'B',
    explanation: 'Komponen **Crisis Communication Plan**:\n\n| Komponen | Detail |\n|---|---|\n| **Tim krisis** | CEO, Corp Comm, Legal, HR, Operasional — peran dan tanggung jawab jelas |\n| **Klasifikasi krisis** | Level 1 (minor), Level 2 (moderat), Level 3 (major) |\n| **Protokol komunikasi** | Siapa yang boleh bicara, alur persetujuan pesan |\n| **Key messages** | Pesan utama yang konsisten (template per skenario) |\n| **Stakeholder list** | Daftar stakeholder yang harus dihubungi + urutan prioritas |\n| **Prosedur media** | Handling media inquiry, press conference, social media |\n| **Rencana pemulihan** | Langkah-langkah pasca-krisis untuk memulihkan reputasi |\n\nSkenario krisis di pertambangan:\n- Kecelakaan kerja fatal\n- Pencemaran lingkungan\n- Demonstrasi masyarakat\n- Pemberitaan negatif viral\n- Tuduhan korupsi/suap\n\nPrinsip komunikasi krisis:\n1. **Golden hour**: respons dalam 1-2 jam pertama\n2. **Single spokesperson**: satu juru bicara resmi\n3. **Empathy first**: tunjukkan empati sebelum menjelaskan\n4. **Facts only**: hanya sampaikan fakta yang terverifikasi\n5. **Continuous update**: update berkala',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *issue management* dalam konteks corporate relation?',
    options: [
      { key: 'A', text: 'Proses mencetak dan mendistribusikan majalah internal perusahaan' },
      { key: 'B', text: 'Kegiatan menyelesaikan keluhan pelanggan tentang kualitas produk' },
      { key: 'C', text: 'Pencatatan dan pengelolaan tiket IT helpdesk dari karyawan' },
      { key: 'D', text: 'Proses mengelola isu yang berpotensi memengaruhi reputasi sebelum menjadi krisis' },
      { key: 'E', text: 'Program pengurangan biaya operasional melalui efisiensi proses' },
    ],
    correct_answer: 'D',
    explanation: '**Issue management** = proses **proaktif** mengelola isu **sebelum menjadi krisis**.\n\nTahapan:\n\n| Tahap | Kegiatan |\n|---|---|\n| 1. **Identifikasi** | Scanning lingkungan, media monitoring, stakeholder feedback |\n| 2. **Analisis** | Menilai potensi dampak dan urgensi isu |\n| 3. **Strategi** | Menentukan respons: abaikan, monitor, respons aktif |\n| 4. **Aksi** | Implementasi respons komunikasi dan tindakan |\n| 5. **Evaluasi** | Review efektivitas penanganan |\n\nKategori isu di pertambangan:\n\n| Kategori | Contoh Isu |\n|---|---|\n| **Lingkungan** | Pencemaran air, deforestasi, limbah B3 |\n| **Sosial** | Konflik lahan, relokasi, ketenagakerjaan |\n| **Governance** | Korupsi, transparansi, GCG |\n| **Operasional** | Kecelakaan, produksi turun |\n| **Regulasi** | Perubahan kebijakan, larangan ekspor |\n\nPerbedaan isu vs krisis:\n- **Isu**: masih dalam tahap awal, bisa dikelola secara proaktif\n- **Krisis**: isu yang sudah membesar, memerlukan respons darurat\n- Issue management bertujuan **mencegah** isu menjadi krisis',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa langkah yang tepat dilakukan perusahaan dalam 24 jam pertama setelah terjadi insiden kecelakaan fatal di lokasi tambang?',
    options: [
      { key: 'A', text: 'Menutup seluruh informasi dan melarang siapapun berbicara kepada media' },
      { key: 'B', text: 'Mengaktifkan tim krisis, menghubungi keluarga korban, dan menyampaikan empati kepada publik' },
      { key: 'C', text: 'Segera mempublikasikan hasil investigasi lengkap meskipun belum selesai' },
      { key: 'D', text: 'Menyalahkan pihak ketiga atau kontraktor sebagai penyebab insiden' },
      { key: 'E', text: 'Menghapus seluruh informasi tentang insiden dari media sosial perusahaan' },
    ],
    correct_answer: 'B',
    explanation: 'Langkah dalam **24 jam pertama** setelah insiden fatal:\n\n| Jam ke- | Tindakan |\n|---|---|\n| **0-1** | Aktifkan **tim krisis**, pastikan area aman, evakuasi korban |\n| **1-2** | Hubungi **keluarga korban** (sebelum media memberitakan) |\n| **2-4** | Siapkan **holding statement** (pernyataan awal) |\n| **4-6** | **Press release** pertama: fakta dasar + empati |\n| **6-12** | Koordinasi dengan **pihak berwenang** (Disnaker, Polisi) |\n| **12-24** | **Update** kedua dengan informasi tambahan |\n\nYang HARUS dilakukan:\n- **Empati**: "Kami turut berduka..." (bukan defensif)\n- **Fakta**: hanya sampaikan yang sudah terverifikasi\n- **Tindakan**: jelaskan langkah yang sudah/akan diambil\n- **Kontak**: sediakan hotline untuk keluarga dan informasi\n\nYang TIDAK BOLEH:\n- **Spekulasi**: menyatakan penyebab sebelum investigasi selesai\n- **Blame**: menyalahkan korban atau pihak lain\n- **Silence**: tidak memberikan respons sama sekali\n- **Cover-up**: menyembunyikan informasi\n- **Minimizing**: meremehkan insiden',
  },
  {
    order_index: 12,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *reputation recovery* (pemulihan reputasi) pasca-krisis?',
    options: [
      { key: 'A', text: 'Mengganti seluruh tim manajemen perusahaan dengan orang baru' },
      { key: 'B', text: 'Menghapus seluruh berita negatif dari internet melalui jasa penghapusan' },
      { key: 'C', text: 'Memindahkan lokasi kantor pusat ke kota lain agar dilupakan publik' },
      { key: 'D', text: 'Mengganti nama dan logo perusahaan untuk menghindari asosiasi negatif' },
      { key: 'E', text: 'Strategi komunikasi dan tindakan untuk membangun kembali kepercayaan stakeholder setelah krisis' },
    ],
    correct_answer: 'E',
    explanation: '**Reputation recovery** = strategi **membangun kembali kepercayaan** setelah krisis.\n\nTahapan pemulihan:\n\n| Tahap | Kegiatan | Timeline |\n|---|---|---|\n| **1. Assess** | Evaluasi dampak krisis terhadap reputasi | Minggu 1-2 |\n| **2. Commit** | Komitmen publik untuk perbaikan | Minggu 2-4 |\n| **3. Act** | Tindakan nyata perbaikan | Bulan 1-6 |\n| **4. Communicate** | Sampaikan progres secara konsisten | Ongoing |\n| **5. Evaluate** | Ukur pemulihan reputasi | Bulan 6-12 |\n\nStrategi spesifik:\n\n| Strategi | Contoh |\n|---|---|\n| **Tindakan korektif** | Perbaiki root cause, kompensasi korban |\n| **Transparansi** | Publikasi hasil investigasi, laporan progres |\n| **Third-party endorsement** | Verifikasi independen, sertifikasi |\n| **Positive storytelling** | Cerita sukses CSR, inovasi |\n| **Stakeholder engagement** | Dialog langsung dengan yang terdampak |\n\nMetrik pemulihan:\n- **Media sentiment**: tren dari negatif ke netral/positif\n- **Stakeholder survey**: persepsi dan kepercayaan\n- **Harga saham**: pemulihan nilai\n- **SLO**: penerimaan masyarakat kembali',
  },

  // ═══════════════════════════════════════════
  // T4: Keterbukaan Informasi & Hukum Komunikasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang diatur dalam *UU Keterbukaan Informasi Publik* (UU KIP) No. 14/2008 dan bagaimana relevansinya bagi BUMN?',
    options: [
      { key: 'A', text: 'Mengatur hak masyarakat untuk mengakses informasi pribadi karyawan BUMN' },
      { key: 'B', text: 'Mengatur kewajiban perusahaan untuk membagikan saham gratis kepada masyarakat' },
      { key: 'C', text: 'Mengatur penerbitan iklan oleh badan publik di media massa' },
      { key: 'D', text: 'Mengatur hak masyarakat memperoleh informasi publik dari badan publik (termasuk BUMN)' },
      { key: 'E', text: 'Mengatur kewajiban BUMN untuk menggunakan bahasa Inggris dalam komunikasi resmi' },
    ],
    correct_answer: 'D',
    explanation: '**UU KIP No. 14/2008** mengatur **hak masyarakat** memperoleh **informasi publik** dari **badan publik** (termasuk BUMN).\n\nKategori informasi:\n\n| Kategori | Kewajiban | Contoh |\n|---|---|---|\n| **Wajib diumumkan berkala** | Proaktif, tanpa diminta | Laporan keuangan, program kerja |\n| **Wajib tersedia setiap saat** | Tersedia jika diminta | Struktur organisasi, SOP |\n| **Wajib diumumkan serta-merta** | Segera jika menyangkut hajat hidup orang banyak | Insiden lingkungan |\n| **Dikecualikan** | Tidak boleh dibuka | Rahasia dagang, strategi bisnis |\n\nKewajiban BUMN sebagai badan publik:\n\n| Kewajiban | Detail |\n|---|---|\n| **PPID** | Menunjuk Pejabat Pengelola Informasi dan Dokumentasi |\n| **Daftar Informasi** | Menyusun daftar informasi yang tersedia |\n| **SOP** | Menetapkan prosedur permohonan informasi |\n| **Laporan** | Menyampaikan laporan layanan informasi tahunan |\n\nSanksi:\n- Badan publik yang menolak tanpa alasan sah: pidana kurungan paling lama **1 tahun** dan denda paling banyak **Rp5 juta**',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *sustainability report* (laporan keberlanjutan) dan mengapa perusahaan tambang perlu menerbitkannya?',
    options: [
      { key: 'A', text: 'Laporan kinerja perusahaan dalam aspek ekonomi, lingkungan, dan sosial (ESG) untuk seluruh pemangku kepentingan' },
      { key: 'B', text: 'Laporan tentang kondisi fisik bangunan kantor yang perlu direnovasi' },
      { key: 'C', text: 'Laporan keuangan khusus yang dikirim ke bank untuk pengajuan pinjaman' },
      { key: 'D', text: 'Laporan harian tentang jumlah produksi tambang yang dikirim ke Kementerian ESDM' },
      { key: 'E', text: 'Laporan absensi karyawan yang diserahkan ke HRD setiap bulan' },
    ],
    correct_answer: 'A',
    explanation: '**Sustainability report** = laporan kinerja **Ekonomi, Lingkungan, dan Sosial** (ESG/triple bottom line).\n\nStandar pelaporan:\n\n| Standar | Organisasi | Fokus |\n|---|---|---|\n| **GRI Standards** | Global Reporting Initiative | Paling luas digunakan, komprehensif |\n| **SASB** | Sustainability Accounting Standards Board | Industri-spesifik, material |\n| **TCFD** | Task Force on Climate-related Financial Disclosures | Risiko perubahan iklim |\n| **ISSB** | International Sustainability Standards Board | Standar global baru |\n\nKonten sustainability report:\n\n| Aspek | Contoh indikator |\n|---|---|\n| **Ekonomi** | Kontribusi pajak, pemberdayaan ekonomi lokal |\n| **Lingkungan** | Emisi GRK, pengelolaan air, reklamasi lahan |\n| **Sosial** | K3, pengembangan masyarakat, HAM |\n| **Governance** | Anti-korupsi, GCG, etika bisnis |\n\nMengapa penting:\n- **Regulasi OJK** (POJK 51/2017): emiten wajib menerbitkan sustainability report\n- **Investor**: ESG menjadi pertimbangan investasi utama\n- **Stakeholder**: transparansi meningkatkan kepercayaan\n- **Reputasi**: menunjukkan komitmen terhadap pembangunan berkelanjutan',
  },
  {
    order_index: 15,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang diatur dalam UU ITE (Informasi dan Transaksi Elektronik) yang relevan bagi komunikasi perusahaan?',
    options: [
      { key: 'A', text: 'Hanya mengatur pajak atas transaksi e-commerce' },
      { key: 'B', text: 'Hanya mengatur penggunaan email dalam korespondensi bisnis' },
      { key: 'C', text: 'Hanya mengatur pembuatan website perusahaan' },
      { key: 'D', text: 'Hanya mengatur pemasangan wifi di kantor perusahaan' },
      { key: 'E', text: 'Mengatur keabsahan dokumen elektronik, konten negatif, dan data pribadi' },
    ],
    correct_answer: 'E',
    explanation: '**UU ITE** (UU No. 11/2008 jo. UU No. 19/2016) mengatur aspek hukum **informasi dan transaksi elektronik**.\n\nKetentuan yang relevan bagi perusahaan:\n\n| Aspek | Ketentuan |\n|---|---|\n| **Dokumen elektronik** | Diakui sebagai alat bukti hukum yang sah |\n| **Tanda tangan elektronik** | Memiliki kekuatan hukum |\n| **Pencemaran nama baik** | Pasal 27 ayat 3: larangan mendistribusikan konten yang mencemarkan |\n| **Ujaran kebencian** | Pasal 28 ayat 2: larangan menyebarkan kebencian SARA |\n| **Hoax** | Pasal 28 ayat 1: larangan menyebarkan berita bohong yang merugikan konsumen |\n| **Perlindungan data** | Kewajiban melindungi data pribadi dalam sistem elektronik |\n\nRelevansi bagi corporate relation:\n- **Media sosial perusahaan**: konten harus hati-hati, tidak mencemarkan pihak lain\n- **Respons terhadap hoax**: perusahaan bisa menggunakan UU ITE untuk melawan berita bohong\n- **Employee social media**: kebijakan penggunaan media sosial karyawan\n- **Digital communication**: email, chat, video conference memiliki kekuatan hukum\n\nSanksi:\n- Pencemaran nama baik online: penjara max **4 tahun** dan/atau denda max **Rp750 juta** (setelah revisi)',
  },
  {
    order_index: 16,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *etika public relations* dan mengapa penting bagi praktisi PR perusahaan?',
    options: [
      { key: 'A', text: 'Aturan berpakaian untuk staf PR saat menghadiri acara resmi' },
      { key: 'B', text: 'Teknik negosiasi harga dengan vendor media' },
      { key: 'C', text: 'Standar perilaku profesional yang mengatur kejujuran, transparansi, dan akuntabilitas' },
      { key: 'D', text: 'Cara membuat konten viral di media sosial' },
      { key: 'E', text: 'Prosedur pengarsipan dokumen PR perusahaan' },
    ],
    correct_answer: 'C',
    explanation: '**Etika PR** = **standar perilaku profesional** dalam praktik komunikasi.\n\nPrinsip etika PR (berdasarkan kode etik IPRA & PRSA):\n\n| Prinsip | Penjelasan |\n|---|---|\n| **Kejujuran** | Tidak menyebarkan informasi palsu atau menyesatkan |\n| **Transparansi** | Mengidentifikasi diri dan kepentingan yang diwakili |\n| **Akuntabilitas** | Bertanggung jawab atas dampak komunikasi |\n| **Fairness** | Tidak merugikan pihak lain secara tidak adil |\n| **Respect** | Menghormati hak publik atas informasi yang benar |\n| **Profesionalisme** | Meningkatkan kompetensi dan standar profesi |\n\nPelanggaran etika PR:\n\n| Pelanggaran | Contoh |\n|---|---|\n| **Astroturfing** | Membuat opini publik palsu yang tampak grassroots |\n| **Spin** | Memanipulasi fakta untuk keuntungan sepihak |\n| **Hidden agenda** | Tidak mengungkapkan siapa yang diwakili |\n| **Black PR** | Menyebarkan informasi negatif tentang kompetitor |\n\nKode etik di Indonesia:\n- **Kode Etik Perhumas** (Perhimpunan Hubungan Masyarakat Indonesia)\n- **Kode Etik Jurnalistik** (untuk interaksi dengan media)\n- **Kode Etik Profesi** masing-masing perusahaan',
  },

  // ═══════════════════════════════════════════
  // T5: Pemahaman Bisnis & Tata Kelola Perusahaan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *komunikasi internal* perusahaan dan mengapa penting?',
    options: [
      { key: 'A', text: 'Aliran informasi terencana antara manajemen dan karyawan untuk membangun engagement dan budaya organisasi' },
      { key: 'B', text: 'Komunikasi rahasia antar direksi yang tidak boleh diketahui karyawan' },
      { key: 'C', text: 'Penggunaan telepon internal (interkom) di dalam gedung kantor' },
      { key: 'D', text: 'Sistem CCTV yang memantau aktivitas karyawan di kantor' },
      { key: 'E', text: 'Daftar hadir rapat yang dicatat oleh sekretaris perusahaan' },
    ],
    correct_answer: 'A',
    explanation: '**Komunikasi internal** = aliran informasi **terencana** antara manajemen dan karyawan.\n\nSaluran komunikasi internal:\n\n| Saluran | Contoh |\n|---|---|\n| **Top-down** | Memo direksi, town hall, newsletter |\n| **Bottom-up** | Survei karyawan, saran/masukan, grievance |\n| **Horizontal** | Koordinasi antar departemen, cross-functional team |\n| **Digital** | Intranet, email blast, WhatsApp group, Teams/Slack |\n\nMengapa penting:\n- **Employee engagement**: karyawan yang informed lebih engaged\n- **Alignment**: menyelaraskan pemahaman tentang visi, misi, dan strategi\n- **Change management**: mempersiapkan karyawan menghadapi perubahan\n- **Crisis**: karyawan sebagai duta perusahaan saat krisis\n- **Productivitas**: komunikasi lancar = kerja lebih efisien\n\nMetrik:\n- **Employee satisfaction survey**: kepuasan terhadap komunikasi\n- **Message recall**: seberapa banyak pesan yang diingat\n- **Channel effectiveness**: saluran mana yang paling efektif\n- **Engagement rate**: partisipasi di platform internal',
  },
  {
    order_index: 18,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *ESG* (Environmental, Social, Governance) dalam konteks komunikasi korporasi?',
    options: [
      { key: 'A', text: 'Nama unit kerja yang menangani kelistrikan, sanitasi, dan generator di area tambang' },
      { key: 'B', text: 'Singkatan dari Email, SMS, dan Group chat sebagai alat komunikasi digital' },
      { key: 'C', text: 'Metode pengukuran efisiensi mesin produksi di pabrik pengolahan' },
      { key: 'D', text: 'Kerangka kerja yang menilai kinerja perusahaan berdasarkan pilar lingkungan, sosial, dan tata kelola' },
      { key: 'E', text: 'Sertifikasi wajib dari Kementerian ESDM untuk semua perusahaan tambang' },
    ],
    correct_answer: 'D',
    explanation: '**ESG** = kerangka kerja kinerja perusahaan berdasarkan **Environmental, Social, Governance**.\n\n| Pilar | Isu | Contoh di pertambangan |\n|---|---|---|\n| **E** (Environmental) | Emisi, air, limbah, biodiversitas | Carbon footprint, pengelolaan air, reklamasi |\n| **S** (Social) | Karyawan, masyarakat, HAM | K3, community development, hak adat |\n| **G** (Governance) | Etika, anti-korupsi, board | GCG, whistleblowing, diversitas board |\n\nMengapa ESG penting untuk komunikasi:\n- **Investor**: ESG rating mempengaruhi keputusan investasi\n- **Regulasi**: OJK mewajibkan pelaporan sustainability\n- **Consumer**: kesadaran konsumen terhadap produk berkelanjutan\n- **Talent**: generasi muda memilih perusahaan yang ESG-conscious\n\nESG Rating Agencies:\n- **MSCI ESG**: A-AAA (leader), BBB-A (average), B-CCC (laggard)\n- **Sustainalytics**: risk rating (lower = better)\n- **S&P CSA**: corporate sustainability assessment\n\nPeran corporate relation:\n- Mengkomunikasikan **ESG strategy** ke stakeholder\n- Menyusun **sustainability report** sesuai standar\n- Merespons **ESG questionnaires** dari rating agencies\n- Mengelola **ESG narrative** di media dan investor relations',
  },
  {
    order_index: 19,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa peran *corporate secretary* (sekretaris perusahaan) dalam tata kelola perusahaan?',
    options: [
      { key: 'A', text: 'Menjawab telepon dan mengatur jadwal rapat untuk direktur utama' },
      { key: 'B', text: 'Menjembatani komunikasi perusahaan dengan pemegang saham, regulator, dan publik' },
      { key: 'C', text: 'Menulis surat menyurat untuk seluruh departemen perusahaan' },
      { key: 'D', text: 'Mengelola arsip dokumen fisik di gudang penyimpanan perusahaan' },
      { key: 'E', text: 'Mengatur perjalanan dinas dan akomodasi untuk seluruh karyawan' },
    ],
    correct_answer: 'B',
    explanation: '**Corporate Secretary** (Sekretaris Perusahaan) = pejabat yang menjembatani **komunikasi** antara perusahaan dengan pemangku kepentingan.\n\nTugas dan tanggung jawab:\n\n| Area | Tugas |\n|---|---|\n| **Keterbukaan informasi** | Memastikan penyampaian informasi material kepada publik, OJK, dan BEI |\n| **RUPS** | Menyiapkan, mengkoordinasikan, dan mendokumentasikan RUPS |\n| **Rapat Direksi/Komisaris** | Menyiapkan agenda, notulen, dan tindak lanjut |\n| **GCG** | Memastikan kepatuhan terhadap prinsip GCG |\n| **Investor Relations** | Komunikasi dengan investor, analis, dan pemegang saham |\n| **Regulatory compliance** | Memastikan kepatuhan terhadap regulasi pasar modal |\n| **Corporate action** | Mengkoordinasikan aksi korporasi (dividen, right issue, dll.) |\n\nPersyaratan (Peraturan OJK):\n- Memiliki pengetahuan tentang **hukum, GCG, dan pasar modal**\n- Berdomisili di Indonesia\n- Bertanggung jawab langsung kepada **Direksi**\n\nDi BUMN:\n- Corporate Secretary juga berperan sebagai **PPID** (UU KIP)\n- Menjadi **penghubung** dengan Kementerian BUMN',
  },
  {
    order_index: 20,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *annual report* (laporan tahunan) dan apa saja isinya?',
    options: [
      { key: 'A', text: 'Laporan harian produksi yang dikompilasi menjadi satu dokumen tahunan' },
      { key: 'B', text: 'Daftar nama karyawan yang berulang tahun setiap bulan dalam satu tahun' },
      { key: 'C', text: 'Dokumen komprehensif berisi laporan manajemen, tata kelola, dan laporan keuangan audited' },
      { key: 'D', text: 'Resume singkat tentang visi dan misi perusahaan yang dicetak setiap tahun' },
      { key: 'E', text: 'Brosur promosi produk perusahaan yang diterbitkan setahun sekali' },
    ],
    correct_answer: 'C',
    explanation: '**Annual report** (laporan tahunan) = dokumen komprehensif yang wajib dipublikasikan oleh **emiten/perusahaan publik**.\n\nKonten wajib (Peraturan OJK):\n\n| Bagian | Isi |\n|---|---|\n| **Ikhtisar keuangan** | Ringkasan kinerja 5 tahun terakhir |\n| **Laporan Dewan Komisaris** | Review dan penilaian |\n| **Laporan Direksi** | Strategi dan pencapaian |\n| **Profil perusahaan** | Sejarah, struktur, produk, anak perusahaan |\n| **MD&A** | Analisis dan Pembahasan Manajemen |\n| **Tata kelola** | GCG, komite, remunerasi |\n| **Tanggung jawab sosial** | CSR, lingkungan, masyarakat |\n| **Laporan keuangan** | Audited oleh KAP independen |\n| **Pernyataan direksi** | Tanggung jawab atas laporan keuangan |\n\nTimeline:\n- Laporan keuangan: max **4 bulan** setelah tutup buku\n- Annual report: max **4 bulan** setelah tutup buku\n- Tersedia di **website** perusahaan\n\nFungsi sebagai alat komunikasi:\n- **Investor**: basis pengambilan keputusan investasi\n- **Regulator**: kepatuhan terhadap keterbukaan\n- **Publik**: akuntabilitas perusahaan\n- **Award**: annual report terbaik (ARA) meningkatkan reputasi',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-corprel')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-corprel tidak ditemukan:', pkgErr)
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
