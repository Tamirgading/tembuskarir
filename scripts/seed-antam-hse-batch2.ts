/**
 * ANTAM IMPACT 2026 — HSE Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Sistem Manajemen HSE & Regulasi): 3 soal
 *   T2 (Identifikasi Bahaya & Penilaian Risiko): 4 soal
 *   T3 (Pengelolaan Lingkungan & Limbah): 3 soal
 *   T4 (Investigasi Insiden & Tanggap Darurat): 4 soal
 *   T5 (Higiene Industri & Kesehatan Kerja): 3 soal
 *   T6 (Prinsip ESG & Sustainability): 3 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-hse-batch2.ts
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
// A: 23,27,35,39 | B: 24,28,32,36 | C: 21,29,33,37 | D: 25,30,34,40 | E: 22,26,31,38

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Sistem Manajemen HSE & Regulasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa tujuan utama pelaksanaan audit internal K3 di perusahaan tambang?',
    options: [
      { key: 'A', text: 'Menghitung total biaya kecelakaan kerja selama satu tahun terakhir' },
      { key: 'B', text: 'Menentukan karyawan mana yang paling banyak melanggar prosedur kerja' },
      { key: 'C', text: 'Menilai kesesuaian sistem manajemen K3 dengan standar dan mengidentifikasi peluang perbaikan' },
      { key: 'D', text: 'Mempersiapkan dokumen untuk mendapatkan sertifikasi ISO dari lembaga eksternal' },
      { key: 'E', text: 'Memenuhi persyaratan laporan tahunan kepada pemegang saham perusahaan' },
    ],
    correct_answer: 'C',
    explanation: '**Audit internal K3** bertujuan untuk **menilai kesesuaian** implementasi SMK3 dengan standar yang ditetapkan dan **mengidentifikasi peluang perbaikan**.\n\nTujuan spesifik audit internal:\n1. Memverifikasi **kepatuhan** terhadap prosedur dan regulasi\n2. Mengidentifikasi **ketidaksesuaian** (*non-conformity*) dan area berisiko\n3. Mengevaluasi **efektivitas** pengendalian yang sudah diterapkan\n4. Memberikan **rekomendasi** perbaikan kepada manajemen\n\nFrekuensi audit:\n- Minimal **1 kali per tahun** (ISO 45001)\n- Area berisiko tinggi bisa lebih sering\n- Audit mendadak (*surprise audit*) untuk aspek kritis',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan inspeksi K3 rutin di lokasi tambang?',
    options: [
      { key: 'A', text: 'Pengujian laboratorium terhadap sampel material tambang secara berkala' },
      { key: 'B', text: 'Pelatihan ulang seluruh karyawan tentang penggunaan APD yang benar' },
      { key: 'C', text: 'Penggantian seluruh peralatan kerja yang sudah berusia lebih dari 5 tahun' },
      { key: 'D', text: 'Penilaian kinerja karyawan berdasarkan target produksi bulanan' },
      { key: 'E', text: 'Pemeriksaan berkala terhadap kondisi kerja, peralatan, dan kepatuhan prosedur K3' },
    ],
    correct_answer: 'E',
    explanation: '**Inspeksi K3 rutin** adalah **pemeriksaan berkala** terhadap kondisi kerja, peralatan, dan kepatuhan prosedur untuk mengidentifikasi potensi bahaya.\n\nJenis inspeksi:\n- **Inspeksi harian**: pemeriksaan *pre-use* alat berat, APD, area kerja\n- **Inspeksi mingguan**: area kerja oleh supervisor K3\n- **Inspeksi bulanan**: manajemen (*management walkthrough*)\n- **Inspeksi khusus**: setelah insiden atau perubahan proses\n\nHal yang diinspeksi:\n- Kondisi fisik tempat kerja (kebersihan, pencahayaan, ventilasi)\n- Kelengkapan dan kondisi APD pekerja\n- Ketersediaan APAR dan kotak P3K\n- Rambu keselamatan dan jalur evakuasi\n- Prosedur kerja aman (*SOP compliance*)',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'medium',
    content: 'Sebuah tambang mencatat 5 kecelakaan yang menyebabkan *lost time* selama 1 juta jam kerja. Berapa *Lost Time Injury Frequency Rate* (LTIFR)?',
    options: [
      { key: 'A', text: '$5{,}0$' },
      { key: 'B', text: '$0{,}5$' },
      { key: 'C', text: '$50$' },
      { key: 'D', text: '$0{,}05$' },
      { key: 'E', text: '$500$' },
    ],
    correct_answer: 'A',
    explanation: 'Perhitungan *Lost Time Injury Frequency Rate* (LTIFR):\n$$\\text{LTIFR} = \\frac{\\text{Jumlah LTI}}{\\text{Total jam kerja}} \\times 1.000.000 = \\frac{5}{1.000.000} \\times 1.000.000 = 5{,}0$$\n\nBenchmark LTIFR di industri tambang:\n- **< 1,0**: sangat baik (*world class*)\n- **1,0-5,0**: baik\n- **5,0-10,0**: rata-rata\n- **> 10,0**: perlu perbaikan signifikan\n\nLTIFR = 5,0 berada di batas **baik/rata-rata**. Indikator K3 lainnya:\n- **TRIFR**: Total Recordable Injury Frequency Rate\n- **Severity Rate**: jumlah hari hilang per juta jam kerja',
  },

  // ═══════════════════════════════════════════
  // T2: Identifikasi Bahaya & Penilaian Risiko (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 24,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Permit to Work* (PTW) dalam sistem keselamatan kerja tambang?',
    options: [
      { key: 'A', text: 'Surat izin kerja yang diberikan pemerintah untuk mengoperasikan tambang' },
      { key: 'B', text: 'Izin tertulis untuk melakukan pekerjaan berisiko tinggi setelah bahaya diidentifikasi dan dikendalikan' },
      { key: 'C', text: 'Sertifikat kompetensi yang harus dimiliki setiap pekerja tambang' },
      { key: 'D', text: 'Kontrak kerja antara perusahaan dan kontraktor untuk proyek tertentu' },
      { key: 'E', text: 'Jadwal shift kerja yang disetujui oleh manajemen dan serikat pekerja' },
    ],
    correct_answer: 'B',
    explanation: '***Permit to Work*** (PTW) adalah **izin tertulis** yang memastikan pekerjaan berisiko tinggi **hanya dilakukan setelah bahaya diidentifikasi dan dikendalikan**.\n\nJenis pekerjaan yang memerlukan PTW:\n- **Hot work**: pengelasan, pemotongan, grinding di area mudah terbakar\n- **Confined space entry**: masuk ruang terbatas (tangki, silo)\n- **Working at height**: bekerja di ketinggian > 1,8 m\n- **Electrical work**: pekerjaan pada instalasi listrik bertegangan\n- **Excavation**: penggalian di dekat utilitas bawah tanah\n\nKomponen PTW:\n1. Identifikasi bahaya dan pengendalian\n2. Persetujuan dari *authorized person*\n3. Batas waktu berlaku izin\n4. Prosedur pembatalan (*cancellation*) setelah pekerjaan selesai',
  },
  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Dalam hierarki pengendalian risiko, manakah contoh penerapan *substitusi*?',
    options: [
      { key: 'A', text: 'Memasang pagar pengaman di sekitar area conveyor yang bergerak' },
      { key: 'B', text: 'Mewajibkan semua pekerja menggunakan sarung tangan anti-getaran' },
      { key: 'C', text: 'Membuat prosedur kerja aman dan menempelkannya di area kerja' },
      { key: 'D', text: 'Mengganti bahan kimia beracun dengan alternatif yang lebih aman' },
      { key: 'E', text: 'Menghentikan seluruh aktivitas penambangan di area berbahaya' },
    ],
    correct_answer: 'D',
    explanation: '**Substitusi** = **mengganti** bahan, proses, atau peralatan dengan alternatif **yang lebih aman**.\n\nContoh substitusi di tambang:\n- Mengganti **pelarut organik beracun** dengan pelarut berbasis air\n- Mengganti **asbes** dengan material insulasi sintetis\n- Mengganti **detonator listrik** dengan *electronic detonator* (lebih aman dari arus liar)\n- Mengganti **cat berbasis timbal** dengan cat bebas timbal\n\nPerbedaan dengan level lain:\n- **Eliminasi** (E): menghilangkan bahaya sepenuhnya → menghentikan aktivitas\n- **Substitusi** (A jawaban D): mengganti dengan yang lebih aman\n- **Engineering** (A): pagar, ventilasi, interlock\n- **Administratif** (C): prosedur, pelatihan, rotasi\n- **APD** (B): sarung tangan, helm, masker',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Lock Out Tag Out* (LOTO)?',
    options: [
      { key: 'A', text: 'Sistem penguncian gudang untuk mencegah pencurian material tambang' },
      { key: 'B', text: 'Prosedur pendaftaran tamu dan kontraktor di pintu masuk area tambang' },
      { key: 'C', text: 'Metode pencatatan produksi harian menggunakan tag pada setiap unit alat berat' },
      { key: 'D', text: 'Sistem keamanan digital untuk mengontrol akses ke jaringan komputer perusahaan' },
      { key: 'E', text: 'Prosedur penguncian dan pemberian tanda pada sumber energi saat pemeliharaan peralatan' },
    ],
    correct_answer: 'E',
    explanation: '***Lock Out Tag Out*** (LOTO) adalah **prosedur penguncian dan pemberian tanda** pada **sumber energi** (listrik, pneumatik, hidrolik, mekanik) untuk memastikan peralatan tidak **dinyalakan secara tidak sengaja** selama pemeliharaan.\n\nLangkah LOTO:\n1. **Identifikasi** semua sumber energi peralatan\n2. **Beritahu** pekerja terkait tentang LOTO\n3. **Matikan** peralatan sesuai prosedur normal\n4. **Isolasi** sumber energi (cabut, tutup katup)\n5. **Pasang kunci** (*lock*) dan tanda (*tag*) pada titik isolasi\n6. **Verifikasi**: coba nyalakan untuk memastikan peralatan benar-benar mati\n7. **Lepaskan energi tersimpan** (*stored energy release*)\n\nSetiap pekerja yang terlibat memasang kunci **masing-masing** (satu peralatan bisa memiliki banyak kunci).',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'easy',
    content: 'Bahaya apa yang paling kritis saat bekerja di ruang terbatas (*confined space*)?',
    options: [
      { key: 'A', text: 'Kekurangan oksigen dan paparan gas beracun yang mengancam jiwa' },
      { key: 'B', text: 'Kerusakan peralatan kerja akibat kelembaban tinggi di dalam ruangan' },
      { key: 'C', text: 'Kesulitan komunikasi dengan rekan kerja di luar ruang terbatas' },
      { key: 'D', text: 'Suhu dingin yang menyebabkan hipotermia pada pekerja' },
      { key: 'E', text: 'Pencahayaan kurang yang menyulitkan pengerjaan tugas' },
    ],
    correct_answer: 'A',
    explanation: 'Bahaya paling kritis di *confined space*:\n\n1. **Kekurangan oksigen** ($\\text{O}_2$ < 19,5%): menyebabkan pingsan dan kematian dalam hitungan menit\n2. **Gas beracun**: $\\text{H}_2\\text{S}$ (gas belerang), $\\text{CO}$ (karbon monoksida)\n3. **Gas mudah terbakar/meledak**: metana ($\\text{CH}_4$), uap bahan bakar\n4. **Engulfment**: tertimbun material (pasir, biji-bijian)\n5. **Sulit dievakuasi**: akses masuk/keluar terbatas\n\nPersyaratan masuk *confined space*:\n- **Gas test** sebelum masuk: $\\text{O}_2$ (19,5-23,5%), LEL (< 10%), $\\text{H}_2\\text{S}$ (< 10 ppm)\n- **Ventilasi paksa** selama bekerja\n- **Standby person** di luar ruang\n- **PTW** (*Permit to Work*) khusus *confined space*\n- **Rescue plan** dan peralatan penyelamatan siap',
  },

  // ═══════════════════════════════════════════
  // T3: Pengelolaan Lingkungan & Limbah (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 28,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa penyebab utama terbentuknya air asam tambang (*Acid Mine Drainage*/AMD)?',
    options: [
      { key: 'A', text: 'Penggunaan bahan kimia asam dalam proses pengolahan mineral di pabrik' },
      { key: 'B', text: 'Oksidasi mineral sulfida saat terpapar air dan udara di area terbuka' },
      { key: 'C', text: 'Pembuangan limbah domestik dari mess karyawan ke saluran air tambang' },
      { key: 'D', text: 'Penggunaan air tanah yang secara alami bersifat asam untuk operasi tambang' },
      { key: 'E', text: 'Penambahan asam sulfat untuk melarutkan mineral berharga dari batuan' },
    ],
    correct_answer: 'B',
    explanation: '**Air Asam Tambang** (*Acid Mine Drainage*/AMD) terbentuk karena **oksidasi mineral sulfida** (terutama pirit, $\\text{FeS}_2$) saat terpapar air dan oksigen.\n\nReaksi pembentukan AMD:\n$$2\\text{FeS}_2 + 7\\text{O}_2 + 2\\text{H}_2\\text{O} \\rightarrow 2\\text{Fe}^{2+} + 4\\text{SO}_4^{2-} + 4\\text{H}^+$$\n\nDampak AMD:\n- **pH sangat rendah** (bisa < 2)\n- **Melarutkan logam berat** (Fe, Mn, Cu, Zn, As)\n- Mencemari **sungai dan air tanah** di hilir\n\nPengendalian AMD:\n- **Pencegahan**: penutupan waste dump dengan tanah liat, pengendalian air\n- **Pengolahan aktif**: netralisasi dengan kapur ($\\text{CaO}$, $\\text{Ca(OH)}_2$)\n- **Pengolahan pasif**: *constructed wetland*, *anoxic limestone drain*',
  },
  {
    order_index: 29,
    category: 'T3',
    difficulty: 'medium',
    content: 'Berapa pH minimum yang harus dicapai saat menetralkan air asam tambang sebelum dibuang ke badan air?',
    options: [
      { key: 'A', text: 'pH 4-5 (sedikit asam)' },
      { key: 'B', text: 'pH 5-6 (mendekati netral)' },
      { key: 'C', text: 'pH 6-9 (sesuai baku mutu lingkungan)' },
      { key: 'D', text: 'pH 9-11 (sedikit basa)' },
      { key: 'E', text: 'pH 3-4 (cukup untuk mengendapkan logam berat)' },
    ],
    correct_answer: 'C',
    explanation: 'Baku mutu air limbah pertambangan (Permen LHK) mensyaratkan **pH 6-9** sebelum dibuang ke badan air.\n\nProses netralisasi AMD:\n1. **Pengumpulan**: air asam ditampung di *settling pond*\n2. **Netralisasi**: penambahan kapur tohor ($\\text{CaO}$) atau kapur padam ($\\text{Ca(OH)}_2$)\n3. **Pengendapan**: logam berat mengendap sebagai hidroksida pada pH tertentu:\n   - Fe: mengendap pada pH > 3,5\n   - Al: mengendap pada pH > 4,5\n   - Mn: mengendap pada pH > 9 (paling sulit)\n4. **Pemisahan lumpur**: lumpur logam dibuang ke *tailing storage facility*\n5. **Monitoring**: pengukuran pH, TSS, logam berat sebelum discharge',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa fungsi *settling pond* (kolam pengendapan) di area tambang?',
    options: [
      { key: 'A', text: 'Menyimpan air bersih untuk kebutuhan domestik karyawan tambang' },
      { key: 'B', text: 'Menampung bahan bakar cair untuk kendaraan dan alat berat' },
      { key: 'C', text: 'Memelihara ikan sebagai program pemberdayaan masyarakat sekitar' },
      { key: 'D', text: 'Mengendapkan partikel padatan dari air limbah sebelum dibuang ke lingkungan' },
      { key: 'E', text: 'Mendinginkan air panas dari pabrik pengolahan sebelum diresirkulasi' },
    ],
    correct_answer: 'D',
    explanation: '***Settling pond*** (kolam pengendapan) berfungsi untuk **mengendapkan partikel padatan** (*suspended solids*) dari air limbah tambang secara gravitasi sebelum dibuang ke badan air.\n\nPrinsip kerja:\n- Kecepatan aliran **diperlambat** di kolam yang luas\n- Partikel **mengendap** ke dasar kolam karena gravitasi\n- Air jernih mengalir keluar dari **outlet** di sisi berlawanan\n\nDesain settling pond:\n- **Waktu tinggal** (*retention time*) yang cukup (12-48 jam)\n- **Baffle** untuk mengarahkan aliran dan mencegah *short-circuiting*\n- **Multi-stage**: beberapa kolam berurutan untuk efisiensi lebih tinggi\n- Pengerukan lumpur secara berkala\n\nParameter outlet: TSS < 100 mg/L, pH 6-9 (sesuai baku mutu).',
  },

  // ═══════════════════════════════════════════
  // T4: Investigasi Insiden & Tanggap Darurat (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 31,
    category: 'T4',
    difficulty: 'medium',
    content: 'Dalam penerapan *Fishbone Diagram* (diagram Ishikawa), apa saja kategori penyebab yang umum dianalisis?',
    options: [
      { key: 'A', text: 'Plan, Do, Check, Act (PDCA) sesuai siklus manajemen mutu' },
      { key: 'B', text: 'Input, Process, Output, Outcome sesuai kerangka logis proyek' },
      { key: 'C', text: 'Strength, Weakness, Opportunity, Threat (SWOT) sesuai analisis bisnis' },
      { key: 'D', text: 'Define, Measure, Analyze, Improve, Control (DMAIC) sesuai Six Sigma' },
      { key: 'E', text: 'Man, Machine, Method, Material, Environment (5M+E) sebagai faktor penyebab' },
    ],
    correct_answer: 'E',
    explanation: '**Fishbone Diagram** (diagram Ishikawa / sebab-akibat) menggunakan kategori **5M + E** untuk menganalisis penyebab masalah:\n\n| Kategori | Contoh di Tambang |\n|---|---|\n| **Man** (Manusia) | Kurang pelatihan, kelelahan, kelalaian |\n| **Machine** (Mesin) | Kerusakan peralatan, kurang perawatan |\n| **Method** (Metode) | SOP tidak jelas, prosedur usang |\n| **Material** | Bahan baku tidak sesuai spesifikasi |\n| **Measurement** | Alat ukur tidak terkalibrasi |\n| **Environment** | Cuaca buruk, pencahayaan kurang, kebisingan |\n\nCara penggunaan:\n1. Tentukan masalah utama (kepala ikan)\n2. Gambar tulang-tulang utama (6 kategori)\n3. Brainstorming penyebab spesifik di setiap kategori\n4. Identifikasi akar penyebab paling dominan',
  },
  {
    order_index: 32,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang harus disediakan di setiap *assembly point* (titik kumpul) darurat?',
    options: [
      { key: 'A', text: 'Mesin fotokopi untuk mencetak formulir pelaporan insiden' },
      { key: 'B', text: 'Daftar hadir pekerja, alat komunikasi, dan kotak P3K' },
      { key: 'C', text: 'Kendaraan evakuasi yang selalu siap dengan bahan bakar penuh' },
      { key: 'D', text: 'Ruang rapat tertutup untuk diskusi strategi penanggulangan' },
      { key: 'E', text: 'Gudang penyimpanan material untuk perbaikan darurat' },
    ],
    correct_answer: 'B',
    explanation: '***Assembly point*** (titik kumpul darurat) harus dilengkapi:\n\n**Perlengkapan wajib:**\n- **Daftar hadir** pekerja (*muster list*) untuk *head count*\n- **Alat komunikasi** (radio, telepon darurat)\n- **Kotak P3K** untuk pertolongan pertama\n- **Tanda yang jelas** dan terlihat dari jarak jauh\n\n**Persyaratan lokasi:**\n- Berada di area **terbuka** (aman dari runtuhan, kebakaran)\n- **Jauh dari bahaya** tetapi masih dapat dijangkau\n- Cukup **luas** untuk menampung seluruh pekerja di area tersebut\n- **Akses mudah** untuk kendaraan darurat\n\nProsedur di titik kumpul:\n1. Pekerja berkumpul dan melapor ke *fire warden*\n2. *Head count* dilakukan untuk memastikan semua orang terhitung\n3. Pekerja yang hilang dilaporkan ke tim SAR',
  },
  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa langkah pertama dalam memberikan pertolongan pertama kepada korban sengatan listrik?',
    options: [
      { key: 'A', text: 'Langsung memberikan napas buatan kepada korban yang tidak sadar' },
      { key: 'B', text: 'Menyiram korban dengan air untuk mendinginkan area luka bakar' },
      { key: 'C', text: 'Memastikan sumber listrik sudah diputus sebelum menyentuh korban' },
      { key: 'D', text: 'Memindahkan korban ke tempat yang lebih nyaman dan teduh' },
      { key: 'E', text: 'Memberikan minuman hangat kepada korban untuk mencegah syok' },
    ],
    correct_answer: 'C',
    explanation: 'Langkah pertolongan pertama korban sengatan listrik:\n\n1. **Putuskan sumber listrik** sebelum menyentuh korban\n   - Matikan sakelar atau cabut kontak\n   - Jika tidak bisa, gunakan bahan isolator (kayu kering, karet) untuk memisahkan korban dari sumber listrik\n   - **Jangan sentuh korban** yang masih terhubung dengan listrik\n\n2. **Periksa respons** korban (sadar/tidak sadar)\n3. **Periksa napas dan nadi**: jika tidak ada, mulai **CPR**\n4. **Periksa luka bakar** di titik masuk dan keluar arus\n5. **Hubungi bantuan medis** segera\n\nBahaya tersembunyi sengatan listrik:\n- Gangguan irama jantung (*cardiac arrhythmia*) bisa muncul belakangan\n- Kerusakan organ dalam meski luka luar terlihat ringan\n- Korban harus selalu dibawa ke rumah sakit untuk pemantauan',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'medium',
    content: 'Berapa lama waktu ideal untuk melakukan evakuasi seluruh pekerja saat simulasi tanggap darurat (*emergency drill*)?',
    options: [
      { key: 'A', text: 'Tidak ada batasan waktu selama semua pekerja akhirnya berkumpul' },
      { key: 'B', text: 'Maksimal 60 menit sejak alarm dibunyikan' },
      { key: 'C', text: 'Maksimal 30 menit untuk area seluas apapun' },
      { key: 'D', text: 'Sesuai target yang ditetapkan dalam rencana tanggap darurat perusahaan' },
      { key: 'E', text: 'Tepat 5 menit untuk semua jenis keadaan darurat' },
    ],
    correct_answer: 'D',
    explanation: 'Waktu evakuasi ideal ditentukan oleh **rencana tanggap darurat** (*Emergency Response Plan*) masing-masing perusahaan, karena bergantung pada:\n\n- **Luas area** dan kompleksitas layout\n- **Jumlah pekerja** yang harus dievakuasi\n- **Jenis bahaya** (kebakaran, tumpahan kimia, runtuhan)\n- **Jarak ke titik kumpul** dari berbagai area kerja\n\nContoh target waktu:\n- Gedung kantor: **3-5 menit**\n- Pabrik pengolahan: **5-10 menit**\n- Area tambang terbuka: **10-15 menit**\n- Tambang bawah tanah: **15-30 menit** (tergantung kedalaman)\n\nSimulasi (*drill*) dilakukan minimal **2 kali per tahun** dan hasilnya dievaluasi untuk perbaikan rencana.',
  },

  // ═══════════════════════════════════════════
  // T5: Higiene Industri & Kesehatan Kerja (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 35,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan ergonomi dalam konteks keselamatan kerja?',
    options: [
      { key: 'A', text: 'Ilmu yang mempelajari penyesuaian pekerjaan dan lingkungan kerja terhadap kemampuan pekerja' },
      { key: 'B', text: 'Standar ukuran APD yang harus dipenuhi oleh semua produsen peralatan K3' },
      { key: 'C', text: 'Metode pengukuran produktivitas kerja berdasarkan output per jam' },
      { key: 'D', text: 'Teknik relaksasi yang dilakukan pekerja selama jam istirahat' },
      { key: 'E', text: 'Sistem rotasi shift kerja yang diterapkan di perusahaan tambang' },
    ],
    correct_answer: 'A',
    explanation: '**Ergonomi** adalah ilmu yang mempelajari **penyesuaian pekerjaan dan lingkungan kerja** terhadap **kemampuan dan keterbatasan** pekerja.\n\nFaktor risiko ergonomi di tambang:\n- **Postur janggal** (*awkward posture*): membungkuk, memutar badan\n- **Pengangkatan berat** (*manual handling*): beban > 23 kg tanpa alat bantu\n- **Gerakan berulang** (*repetitive motion*): operasi alat pneumatik\n- **Getaran** (*vibration*): whole-body vibration pada operator alat berat\n- **Tekanan statis** (*static load*): berdiri lama tanpa istirahat\n\nPengendalian:\n- Desain workstation sesuai antropometri pekerja\n- Alat bantu angkat (*hoist*, *crane*, *trolley*)\n- Rotasi pekerjaan dan istirahat berkala\n- Kursi operator dengan peredam getaran',
  },
  {
    order_index: 36,
    category: 'T5',
    difficulty: 'medium',
    content: 'Area pabrik pengolahan memiliki tingkat kebisingan $94$ dB(A). Berapa lama waktu paparan maksimum yang diizinkan per hari?',
    options: [
      { key: 'A', text: '8 jam' },
      { key: 'B', text: '1 jam' },
      { key: 'C', text: '4 jam' },
      { key: 'D', text: '30 menit' },
      { key: 'E', text: '2 jam' },
    ],
    correct_answer: 'B',
    explanation: 'Menggunakan prinsip *halving rate* 3 dB dari NAB 85 dB(A) = 8 jam:\n$$\\begin{aligned} 85 \\text{ dB(A)} &= 8 \\text{ jam} \\\\ 88 \\text{ dB(A)} &= 4 \\text{ jam} \\\\ 91 \\text{ dB(A)} &= 2 \\text{ jam} \\\\ 94 \\text{ dB(A)} &= 1 \\text{ jam} \\end{aligned}$$\nRumus umum:\n$$T = \\frac{8}{2^{(L-85)/3}}$$\nDi mana $T$ = waktu paparan maks (jam), $L$ = tingkat kebisingan dB(A).\n\nUntuk $L = 94$:\n$$T = \\frac{8}{2^{(94-85)/3}} = \\frac{8}{2^3} = \\frac{8}{8} = 1 \\text{ jam}$$\nJika pekerja harus berada > 1 jam di area tersebut, wajib menggunakan pelindung telinga (*earplug/earmuff*) yang menurunkan paparan di bawah 85 dB(A).',
  },
  {
    order_index: 37,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *fit to work* assessment sebelum pekerja memulai shift?',
    options: [
      { key: 'A', text: 'Pengujian kekuatan fisik untuk menentukan jenis pekerjaan yang sesuai' },
      { key: 'B', text: 'Pelatihan singkat tentang prosedur kerja sebelum memulai tugas harian' },
      { key: 'C', text: 'Penilaian kondisi fisik dan mental pekerja untuk memastikan layak bekerja dengan aman' },
      { key: 'D', text: 'Pemeriksaan kelengkapan APD sebelum pekerja memasuki area kerja' },
      { key: 'E', text: 'Evaluasi keterampilan teknis pekerja melalui ujian tertulis berkala' },
    ],
    correct_answer: 'C',
    explanation: '***Fit to work*** assessment adalah **penilaian kondisi fisik dan mental** pekerja untuk memastikan mereka **layak bekerja dengan aman** sebelum memulai shift.\n\nAspek yang diperiksa:\n- **Kondisi fisik**: tidak sakit, tidak cedera, istirahat cukup\n- **Pengaruh alkohol/obat**: tes alkohol (*breathalyzer*), tes narkoba\n- **Kelelahan** (*fatigue*): tidur cukup, tidak mengemudi jarak jauh sebelum shift\n- **Kondisi mental**: tidak dalam tekanan emosional berat\n\nMetode *fit to work*:\n- **Self-assessment**: pekerja mengisi checklist kondisi diri\n- **Pengamatan supervisor**: perilaku abnormal, mata merah, reaksi lambat\n- **Tes objektif**: *breathalyzer* untuk alkohol, *fatigue monitoring device*\n- **Tes narkoba**: urin atau *saliva test* acak',
  },

  // ═══════════════════════════════════════════
  // T6: Prinsip ESG & Sustainability (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 38,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan PROPER dalam konteks pengelolaan lingkungan perusahaan tambang?',
    options: [
      { key: 'A', text: 'Prosedur operasi standar untuk mengelola limbah hasil produksi' },
      { key: 'B', text: 'Sertifikasi internasional untuk produk tambang ramah lingkungan' },
      { key: 'C', text: 'Standar kompetensi yang harus dimiliki petugas lingkungan perusahaan' },
      { key: 'D', text: 'Izin usaha pertambangan yang dikeluarkan oleh pemerintah daerah' },
      { key: 'E', text: 'Program penilaian peringkat kinerja perusahaan dalam pengelolaan lingkungan' },
    ],
    correct_answer: 'E',
    explanation: '**PROPER** = ***Program Penilaian Peringkat Kinerja Perusahaan dalam Pengelolaan Lingkungan*** oleh Kementerian Lingkungan Hidup dan Kehutanan (KLHK).\n\nPeringkat PROPER (berdasarkan warna):\n\n| Warna | Peringkat | Keterangan |\n|---|---|---|\n| **Emas** | Sangat baik | Melebihi ketaatan, inovasi lingkungan |\n| **Hijau** | Baik | Melebihi baku mutu, sistem manajemen baik |\n| **Biru** | Taat | Memenuhi baku mutu minimum |\n| **Merah** | Tidak taat | Belum memenuhi baku mutu |\n| **Hitam** | Sangat buruk | Sengaja melanggar, pencemaran berat |\n\nManfaat PROPER bagi perusahaan:\n- **Transparansi**: hasil dipublikasikan ke masyarakat\n- **Insentif reputasi**: peringkat hijau/emas meningkatkan *brand image*\n- **Benchmark**: pembanding kinerja antar perusahaan sejenis',
  },
  {
    order_index: 39,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa tujuan program *Community Development* (CSR) perusahaan tambang?',
    options: [
      { key: 'A', text: 'Meningkatkan kesejahteraan dan kemandirian masyarakat sekitar area operasi tambang' },
      { key: 'B', text: 'Mempekerjakan seluruh penduduk desa sekitar tambang sebagai karyawan tetap' },
      { key: 'C', text: 'Memberikan kompensasi tunai kepada penduduk yang tanahnya digunakan untuk tambang' },
      { key: 'D', text: 'Membangun pagar pembatas antara area tambang dan pemukiman penduduk' },
      { key: 'E', text: 'Merelokasi seluruh penduduk ke area yang jauh dari lokasi tambang' },
    ],
    correct_answer: 'A',
    explanation: '***Community Development*** (pengembangan masyarakat/CSR) bertujuan **meningkatkan kesejahteraan dan kemandirian** masyarakat sekitar area operasi.\n\nProgram CSR perusahaan tambang:\n- **Ekonomi**: pelatihan keterampilan, bantuan modal UMKM, pertanian\n- **Pendidikan**: beasiswa, renovasi sekolah, pelatihan guru\n- **Kesehatan**: posyandu, air bersih, sanitasi, puskesmas\n- **Infrastruktur**: jalan, jembatan, irigasi\n- **Lingkungan**: penghijauan, konservasi, ekowisata\n\nDasar hukum:\n- **UU No. 40/2007** (Perseroan Terbatas): perusahaan yang berkaitan dengan SDA wajib melaksanakan tanggung jawab sosial\n- **PP No. 96/2021**: aturan pelaksanaan CSR\n- **UU No. 3/2020** (Minerba): kewajiban pengembangan masyarakat',
  },
  {
    order_index: 40,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *biodiversity offset* dalam konteks operasi tambang?',
    options: [
      { key: 'A', text: 'Menghitung jumlah spesies yang punah akibat aktivitas tambang untuk laporan tahunan' },
      { key: 'B', text: 'Melarang seluruh aktivitas tambang di area yang memiliki keanekaragaman hayati tinggi' },
      { key: 'C', text: 'Mengganti rugi kerugian keanekaragaman hayati dengan konservasi di area lain' },
      { key: 'D', text: 'Tindakan konservasi di lokasi lain untuk mengompensasi dampak terhadap keanekaragaman hayati' },
      { key: 'E', text: 'Memelihara hewan langka di kebun binatang perusahaan sebagai kompensasi' },
    ],
    correct_answer: 'D',
    explanation: '***Biodiversity offset*** adalah **tindakan konservasi di lokasi lain** untuk **mengompensasi dampak** terhadap keanekaragaman hayati yang tidak dapat dihindari atau dimitigasi di area operasi.\n\nHierarki mitigasi dampak biodiversitas:\n1. **Avoid** (Hindari): jangan membuka area bernilai tinggi\n2. **Minimize** (Minimalkan): kurangi jejak gangguan\n3. **Restore** (Pulihkan): rehabilitasi area terganggu\n4. **Offset** (Kompensasi): konservasi area lain untuk *net positive impact*\n\nContoh *biodiversity offset*:\n- Melindungi hutan primer seluas 2x area yang terganggu\n- Restorasi ekosistem degradasi di lokasi lain\n- Pendanaan program konservasi spesies terancam\n- Pembentukan kawasan lindung baru\n\nStandar: IFC Performance Standard 6, *No Net Loss* principle.',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-hse')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-hse tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal batch 2: ${questions.length}\n`)

  const { count } = await (supabase.from('questions') as any)
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)

  console.log(`Soal existing: ${count ?? 0}`)

  if (count && count > 20) {
    console.log('Menghapus soal batch 2 lama...')
    await (supabase.from('questions') as any).delete().eq('package_id', pkg.id).gte('order_index', 21)
    console.log('Soal batch 2 lama berhasil dihapus.\n')
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

  const { count: total } = await (supabase.from('questions') as any)
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)
  console.log(`\n   Total soal package: ${total} / 40`)
}

main()
