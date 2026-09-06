/**
 * ANTAM IMPACT 2026 — HSE (Health, Safety, Environment) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Sistem Manajemen HSE & Regulasi): 4 soal
 *   T2 (Identifikasi Bahaya & Penilaian Risiko): 3 soal
 *   T3 (Pengelolaan Lingkungan & Limbah): 4 soal
 *   T4 (Investigasi Insiden & Tanggap Darurat): 3 soal
 *   T5 (Higiene Industri & Kesehatan Kerja): 3 soal
 *   T6 (Prinsip ESG & Sustainability): 3 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-hse-batch1.ts
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
// A: 1,8,13,17 | B: 5,9,14,18 | C: 2,10,15,19 | D: 3,6,11,16 | E: 4,7,12,20

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Sistem Manajemen HSE & Regulasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa tujuan utama penerapan ISO 45001 di perusahaan tambang?',
    options: [
      { key: 'A', text: 'Menyediakan kerangka kerja sistematis untuk mencegah cedera dan penyakit akibat kerja' },
      { key: 'B', text: 'Meningkatkan kapasitas produksi tambang melebihi target tahunan' },
      { key: 'C', text: 'Menggantikan seluruh peraturan keselamatan nasional yang berlaku' },
      { key: 'D', text: 'Menjamin perusahaan tidak akan pernah mengalami kecelakaan kerja' },
      { key: 'E', text: 'Mengurangi jumlah karyawan yang dibutuhkan di lapangan' },
    ],
    correct_answer: 'A',
    explanation: '**ISO 45001:2018** adalah standar internasional untuk **Sistem Manajemen Keselamatan dan Kesehatan Kerja** (SMK3). Tujuan utamanya:\n\n- Menyediakan **kerangka kerja sistematis** untuk mencegah cedera dan penyakit akibat kerja\n- Meningkatkan kinerja K3 secara **proaktif**, bukan reaktif\n- Memenuhi kewajiban hukum dan persyaratan lainnya\n\nISO 45001 menggunakan pendekatan **Plan-Do-Check-Act** (PDCA):\n1. **Plan**: identifikasi bahaya, penilaian risiko, penetapan sasaran\n2. **Do**: implementasi pengendalian dan program K3\n3. **Check**: pemantauan, pengukuran, audit internal\n4. **Act**: tindakan perbaikan berkelanjutan',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Menurut PP No. 50 Tahun 2012 tentang SMK3, perusahaan wajib menerapkan SMK3 jika memiliki berapa pekerja?',
    options: [
      { key: 'A', text: 'Lebih dari 50 pekerja' },
      { key: 'B', text: 'Lebih dari 25 pekerja' },
      { key: 'C', text: 'Lebih dari 100 pekerja atau memiliki potensi bahaya tinggi' },
      { key: 'D', text: 'Lebih dari 200 pekerja di lokasi tambang' },
      { key: 'E', text: 'Semua perusahaan tanpa batasan jumlah pekerja' },
    ],
    correct_answer: 'C',
    explanation: 'Berdasarkan **PP No. 50 Tahun 2012** tentang Penerapan Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3):\n\nPerusahaan wajib menerapkan SMK3 jika:\n- Mempekerjakan **100 pekerja atau lebih**, **ATAU**\n- Memiliki **tingkat potensi bahaya tinggi** sesuai ketentuan perundangan\n\nPerusahaan tambang otomatis masuk kategori **potensi bahaya tinggi**, sehingga wajib menerapkan SMK3 **terlepas dari jumlah pekerja**.\n\nTingkat pencapaian SMK3:\n- **0-59%**: kurang (belum memenuhi)\n- **60-84%**: baik (bendera perak)\n- **85-100%**: memuaskan (bendera emas)',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa perbedaan utama antara ISO 14001 dan ISO 45001?',
    options: [
      { key: 'A', text: 'ISO 14001 hanya berlaku untuk perusahaan besar, ISO 45001 untuk semua ukuran' },
      { key: 'B', text: 'ISO 14001 bersifat wajib secara hukum, ISO 45001 bersifat sukarela' },
      { key: 'C', text: 'ISO 14001 menggunakan PDCA, ISO 45001 tidak menggunakan PDCA' },
      { key: 'D', text: 'ISO 14001 berfokus pada pengelolaan lingkungan, ISO 45001 pada keselamatan kerja' },
      { key: 'E', text: 'ISO 14001 hanya untuk manufaktur, ISO 45001 hanya untuk pertambangan' },
    ],
    correct_answer: 'D',
    explanation: 'Perbedaan fokus kedua standar ISO:\n\n| Aspek | ISO 14001 | ISO 45001 |\n|---|---|---|\n| **Fokus** | Sistem Manajemen **Lingkungan** | Sistem Manajemen **K3** |\n| Tujuan | Mengurangi dampak **lingkungan** | Mencegah **cedera dan penyakit** kerja |\n| Pihak terdampak | **Lingkungan** dan masyarakat sekitar | **Pekerja** dan pihak terkait |\n| Contoh isu | Limbah, emisi, penggunaan sumber daya | Bahaya fisik, kimia, ergonomi |\n\nKeduanya:\n- Menggunakan pendekatan **PDCA**\n- Berlaku untuk **semua ukuran** organisasi\n- Bersifat **sukarela** (bukan wajib hukum)\n- Dapat **diintegrasikan** dalam satu sistem manajemen terpadu',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'easy',
    content: 'Siapa yang bertanggung jawab utama atas keselamatan kerja di lokasi tambang menurut UU No. 1 Tahun 1970?',
    options: [
      { key: 'A', text: 'Dinas Tenaga Kerja setempat yang mengawasi lokasi tambang' },
      { key: 'B', text: 'Serikat pekerja yang mewakili seluruh karyawan di lokasi' },
      { key: 'C', text: 'Konsultan K3 eksternal yang disewa oleh perusahaan' },
      { key: 'D', text: 'Pemerintah pusat melalui Kementerian ESDM secara langsung' },
      { key: 'E', text: 'Pengurus (manajemen/pimpinan) perusahaan di lokasi kerja' },
    ],
    correct_answer: 'E',
    explanation: 'Menurut **UU No. 1 Tahun 1970** tentang Keselamatan Kerja:\n\n**Pengurus** (manajemen/pimpinan perusahaan) bertanggung jawab utama, meliputi:\n- Menyediakan **alat pelindung diri** (APD) yang memadai\n- Memasang **tanda-tanda keselamatan** di tempat kerja\n- Melaporkan **kecelakaan kerja** kepada pihak berwenang\n- Menyelenggarakan **pembinaan** bagi pekerja tentang K3\n\nKewajiban pekerja:\n- Mematuhi syarat K3 yang ditetapkan\n- Memakai APD yang diwajibkan\n- Melaporkan bahaya yang ditemukan\n\nPrinsip: **keselamatan adalah tanggung jawab bersama**, tetapi **beban utama ada pada pengurus**.',
  },

  // ═══════════════════════════════════════════
  // T2: Identifikasi Bahaya & Penilaian Risiko (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa kepanjangan dan tujuan dari HIRADC dalam manajemen K3?',
    options: [
      { key: 'A', text: 'High Impact Risk Assessment and Danger Classification - mengklasifikasi bahaya berdasarkan biaya' },
      { key: 'B', text: 'Hazard Identification, Risk Assessment, and Determining Control - mengidentifikasi bahaya dan menentukan pengendalian' },
      { key: 'C', text: 'Health Inspection, Risk Analysis, and Disease Control - menginspeksi kesehatan pekerja' },
      { key: 'D', text: 'Hazardous Industrial Regulation and Compliance - memastikan kepatuhan regulasi industri' },
      { key: 'E', text: 'Hierarchy of Industrial Risk and Damage Control - menentukan hierarki perbaikan kerusakan' },
    ],
    correct_answer: 'B',
    explanation: '**HIRADC** = ***Hazard Identification, Risk Assessment, and Determining Control***.\n\nTahapan HIRADC:\n1. **Hazard Identification**: identifikasi semua bahaya di tempat kerja (fisik, kimia, biologi, ergonomi, psikososial)\n2. **Risk Assessment**: menilai tingkat risiko dengan rumus:\n   - $\\text{Risiko} = \\text{Kemungkinan} \\times \\text{Keparahan}$\n3. **Determining Control**: menentukan pengendalian berdasarkan hierarki:\n   - Eliminasi > Substitusi > *Engineering Control* > Administratif > APD\n\nHIRADC wajib dilakukan:\n- Sebelum aktivitas baru dimulai\n- Saat ada perubahan proses atau peralatan\n- Setelah terjadi insiden atau *near miss*',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Dalam *Job Safety Analysis* (JSA), langkah pertama yang harus dilakukan adalah ...',
    options: [
      { key: 'A', text: 'Menyediakan APD untuk seluruh pekerja yang terlibat' },
      { key: 'B', text: 'Memasang rambu peringatan di sekitar area kerja' },
      { key: 'C', text: 'Menghitung biaya pengendalian risiko yang diperlukan' },
      { key: 'D', text: 'Menguraikan pekerjaan menjadi langkah-langkah berurutan' },
      { key: 'E', text: 'Melaporkan hasil analisis kepada manajemen puncak' },
    ],
    correct_answer: 'D',
    explanation: '**JSA** (*Job Safety Analysis*) adalah metode sistematis untuk menganalisis bahaya pada setiap langkah pekerjaan.\n\nUrutan langkah JSA:\n1. **Uraikan pekerjaan** menjadi langkah-langkah berurutan\n2. **Identifikasi bahaya** pada setiap langkah\n3. **Tentukan pengendalian** untuk setiap bahaya\n4. **Dokumentasikan** dan komunikasikan kepada pekerja\n\nContoh JSA untuk pekerjaan pengelasan:\n| Langkah | Bahaya | Pengendalian |\n|---|---|---|\n| Siapkan area | Bahan mudah terbakar | Bersihkan area, sediakan APAR |\n| Nyalakan mesin las | Sengatan listrik | Periksa kabel, gunakan sarung tangan |\n| Lakukan pengelasan | Percikan api, UV | Welding screen, kacamata las |',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'medium',
    content: 'Suatu pekerjaan memiliki skor kemungkinan (*likelihood*) = 3 dan skor keparahan (*severity*) = 4 dalam matriks risiko 5x5. Berapa skor risikonya dan termasuk kategori apa?',
    options: [
      { key: 'A', text: 'Skor 7 - risiko rendah' },
      { key: 'B', text: 'Skor 1 - risiko sangat rendah' },
      { key: 'C', text: 'Skor 20 - risiko sangat tinggi' },
      { key: 'D', text: 'Skor 3 - risiko sedang' },
      { key: 'E', text: 'Skor 12 - risiko tinggi' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan skor risiko:\n$$\\text{Risiko} = \\text{Likelihood} \\times \\text{Severity} = 3 \\times 4 = 12$$\n\nKategori risiko dalam matriks 5x5 (skor 1-25):\n\n| Skor | Kategori | Tindakan |\n|---|---|---|\n| 1-4 | **Rendah** | Monitor, APD standar |\n| 5-9 | **Sedang** | Pengendalian tambahan diperlukan |\n| 10-16 | **Tinggi** | Pengendalian segera, izin kerja khusus |\n| 17-25 | **Sangat tinggi** | Hentikan pekerjaan, redesain proses |\n\nSkor **12** termasuk risiko **tinggi**, memerlukan pengendalian segera sebelum pekerjaan dilanjutkan.',
  },

  // ═══════════════════════════════════════════
  // T3: Pengelolaan Lingkungan & Limbah (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 8,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan limbah B3 dalam konteks pertambangan?',
    options: [
      { key: 'A', text: 'Limbah yang mengandung bahan berbahaya dan beracun yang dapat membahayakan kesehatan atau lingkungan' },
      { key: 'B', text: 'Limbah berukuran besar yang sulit diangkut ke tempat pembuangan' },
      { key: 'C', text: 'Semua jenis batuan sisa yang dihasilkan dari proses penambangan' },
      { key: 'D', text: 'Air hujan yang mengalir di area tambang selama musim penghujan' },
      { key: 'E', text: 'Debu yang berterbangan akibat aktivitas peledakan di lokasi tambang' },
    ],
    correct_answer: 'A',
    explanation: '**Limbah B3** = **Bahan Berbahaya dan Beracun** (PP No. 22 Tahun 2021). Limbah yang karena **sifat, konsentrasi, dan jumlahnya** dapat membahayakan kesehatan dan lingkungan.\n\nKarakteristik limbah B3:\n- **Mudah meledak** (*explosive*)\n- **Mudah menyala** (*flammable*)\n- **Reaktif** terhadap air atau udara\n- **Beracun** (*toxic*)\n- **Korosif** (pH < 2 atau > 12,5)\n- **Infeksius** (mengandung patogen)\n\nContoh limbah B3 di tambang:\n- Oli bekas dan pelumas\n- Air asam tambang (pH rendah, logam berat)\n- Baterai bekas alat berat\n- Sisa bahan peledak\n- Limbah laboratorium kimia',
  },
  {
    order_index: 9,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa perbedaan utama antara AMDAL dan UKL-UPL?',
    options: [
      { key: 'A', text: 'AMDAL dilakukan sebelum proyek, UKL-UPL dilakukan setelah proyek beroperasi' },
      { key: 'B', text: 'AMDAL untuk kegiatan berdampak besar, UKL-UPL untuk kegiatan berdampak kecil-menengah' },
      { key: 'C', text: 'AMDAL bersifat sukarela, UKL-UPL bersifat wajib untuk semua perusahaan' },
      { key: 'D', text: 'AMDAL mengatur lingkungan saja, UKL-UPL mengatur keselamatan kerja' },
      { key: 'E', text: 'AMDAL berlaku nasional, UKL-UPL hanya berlaku di tingkat kabupaten' },
    ],
    correct_answer: 'B',
    explanation: 'Perbedaan **AMDAL** dan **UKL-UPL** berdasarkan UU No. 32/2009 (PPLH):\n\n| Aspek | AMDAL | UKL-UPL |\n|---|---|---|\n| **Untuk** | Kegiatan **berdampak penting** | Kegiatan **berdampak kecil-menengah** |\n| Dokumen | KA-ANDAL, ANDAL, RKL-RPL | Formulir UKL-UPL |\n| Penilaian | Komisi Penilai AMDAL | Instansi lingkungan |\n| Waktu | 6-12 bulan | 1-3 bulan |\n\nKriteria dampak penting (memerlukan AMDAL):\n- Luas area kegiatan melebihi ambang batas\n- Melibatkan bahan berbahaya dan beracun\n- Lokasi di kawasan lindung\n- Berpotensi menimbulkan dampak sosial signifikan',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Tambang nikel menghasilkan air limbah dengan kandungan TSS (*Total Suspended Solids*) $250$ mg/L. Baku mutu yang berlaku mensyaratkan TSS maksimum $100$ mg/L. Berapa persen minimum efisiensi pengolahan yang dibutuhkan?',
    options: [
      { key: 'A', text: '$40\\%$' },
      { key: 'B', text: '$50\\%$' },
      { key: 'C', text: '$60\\%$' },
      { key: 'D', text: '$70\\%$' },
      { key: 'E', text: '$80\\%$' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan efisiensi pengolahan minimum:\n$$\\begin{aligned} \\text{Efisiensi} &= \\frac{\\text{TSS}_{\\text{masuk}} - \\text{TSS}_{\\text{keluar}}}{\\text{TSS}_{\\text{masuk}}} \\times 100\\% \\\\ &= \\frac{250 - 100}{250} \\times 100\\% = \\frac{150}{250} \\times 100\\% = 60\\% \\end{aligned}$$\nInstalasi pengolahan air limbah (IPAL) harus mampu menurunkan TSS **minimal 60%** agar memenuhi baku mutu.\n\nMetode pengolahan TSS:\n- **Sedimentasi**: pengendapan gravitasi di *settling pond*\n- **Koagulasi-flokulasi**: penambahan koagulan untuk menggumpalkan partikel\n- **Filtrasi**: penyaringan dengan media pasir atau membran',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa tujuan utama pemantauan kualitas air di sekitar area tambang?',
    options: [
      { key: 'A', text: 'Menentukan jumlah air yang tersedia untuk proses produksi' },
      { key: 'B', text: 'Mengukur kedalaman muka air tanah untuk desain pit tambang' },
      { key: 'C', text: 'Menghitung biaya pengolahan air untuk keperluan domestik karyawan' },
      { key: 'D', text: 'Mendeteksi pencemaran dan memastikan air buangan memenuhi baku mutu lingkungan' },
      { key: 'E', text: 'Memperkirakan cadangan air bawah tanah di sekitar lokasi tambang' },
    ],
    correct_answer: 'D',
    explanation: 'Pemantauan kualitas air di sekitar tambang bertujuan:\n\n1. **Mendeteksi pencemaran** sedini mungkin (air asam tambang, logam berat, TSS)\n2. **Memastikan kepatuhan** terhadap baku mutu lingkungan yang berlaku\n3. **Melindungi ekosistem** perairan dan sumber air masyarakat\n4. **Menyediakan data** untuk pelaporan PROPER dan izin lingkungan\n\nParameter yang dipantau:\n- **pH**: indikator keasaman (air asam tambang biasanya pH < 4)\n- **TSS**: padatan tersuspensi total\n- **Logam berat**: Fe, Mn, Cu, Ni, Cr sesuai komoditas\n- **BOD/COD**: beban organik\n- **Debit**: volume air yang dibuang per satuan waktu',
  },

  // ═══════════════════════════════════════════
  // T4: Investigasi Insiden & Tanggap Darurat (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 12,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *near miss* dalam konteks keselamatan kerja?',
    options: [
      { key: 'A', text: 'Kecelakaan yang menyebabkan cedera ringan pada pekerja' },
      { key: 'B', text: 'Pelanggaran prosedur kerja yang disengaja oleh pekerja' },
      { key: 'C', text: 'Kondisi bahaya yang sudah diidentifikasi dan dikendalikan sebelumnya' },
      { key: 'D', text: 'Peralatan yang rusak dan memerlukan penggantian segera' },
      { key: 'E', text: 'Kejadian yang berpotensi menyebabkan cedera atau kerusakan tetapi tidak terjadi' },
    ],
    correct_answer: 'E',
    explanation: '***Near miss*** (hampir celaka) adalah **kejadian yang berpotensi menyebabkan cedera, penyakit, atau kerusakan**, tetapi **tidak terjadi** karena keberuntungan atau tindakan pencegahan.\n\nContoh *near miss* di tambang:\n- Batu jatuh dari tebing dekat pekerja, tetapi tidak mengenai siapapun\n- Kendaraan hampir bertabrakan di persimpangan hauling road\n- Pekerja terpeleset di area licin tetapi tidak jatuh\n\nMenurut **Teori Heinrich** (piramida kecelakaan):\n- 1 kecelakaan fatal\n- 29 kecelakaan ringan\n- **300 *near miss***\n\nMelaporkan *near miss* sangat penting untuk **mencegah kecelakaan** sebelum terjadi.',
  },
  {
    order_index: 13,
    category: 'T4',
    difficulty: 'medium',
    content: 'Dalam investigasi insiden menggunakan metode *5 Whys*, apa prinsip dasar yang digunakan?',
    options: [
      { key: 'A', text: 'Bertanya "mengapa" secara berulang hingga menemukan akar penyebab masalah' },
      { key: 'B', text: 'Menganalisis 5 kategori penyebab: Man, Machine, Method, Material, Environment' },
      { key: 'C', text: 'Mewawancarai minimal 5 saksi mata dari kejadian insiden' },
      { key: 'D', text: 'Menyelesaikan investigasi dalam waktu maksimal 5 hari kerja' },
      { key: 'E', text: 'Mengevaluasi 5 tingkat keparahan cedera yang mungkin terjadi' },
    ],
    correct_answer: 'A',
    explanation: 'Metode **5 Whys** menggunakan prinsip **bertanya "mengapa" secara berulang** hingga menemukan **akar penyebab** (*root cause*).\n\nContoh penerapan:\n1. **Mengapa** conveyor berhenti? - Motor terbakar\n2. **Mengapa** motor terbakar? - Bearing macet\n3. **Mengapa** bearing macet? - Tidak dilumasi\n4. **Mengapa** tidak dilumasi? - Jadwal pelumasan tidak diikuti\n5. **Mengapa** jadwal tidak diikuti? - Tidak ada sistem pengingat otomatis\n\n**Akar penyebab**: tidak ada sistem pengingat untuk jadwal pelumasan.\n**Tindakan korektif**: implementasi sistem *Computerized Maintenance Management System* (CMMS) dengan pengingat otomatis.',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang harus dilakukan pertama kali saat terjadi kebakaran di area pabrik pengolahan?',
    options: [
      { key: 'A', text: 'Langsung memadamkan api menggunakan APAR terdekat tanpa memberitahu siapapun' },
      { key: 'B', text: 'Mengaktifkan alarm kebakaran dan mengevakuasi pekerja dari area bahaya' },
      { key: 'C', text: 'Menghubungi pemadam kebakaran kota terdekat dan menunggu kedatangan mereka' },
      { key: 'D', text: 'Mengambil foto dan video kebakaran untuk dokumentasi investigasi' },
      { key: 'E', text: 'Mematikan seluruh mesin dan peralatan di area yang terbakar' },
    ],
    correct_answer: 'B',
    explanation: 'Prosedur tanggap darurat kebakaran (prinsip **RACE**):\n\n1. **R**escue (Selamatkan): evakuasi orang dari bahaya langsung\n2. **A**larm: **aktifkan alarm kebakaran**, beritahu *emergency response team*\n3. **C**onfine (Batasi): tutup pintu dan jendela untuk membatasi penyebaran api\n4. **E**xtinguish/Evacuate: padamkan jika aman, atau evakuasi ke titik kumpul\n\nPrioritas utama: **keselamatan jiwa** (evakuasi dan alarm) lebih penting dari pemadaman. Pekerja yang tidak terlatih **tidak boleh** mencoba memadamkan kebakaran besar.\n\nSetiap pekerja harus mengetahui:\n- Lokasi **alarm dan APAR** terdekat\n- **Jalur evakuasi** dan pintu darurat\n- **Titik kumpul** (*assembly point*)',
  },

  // ═══════════════════════════════════════════
  // T5: Higiene Industri & Kesehatan Kerja (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 15,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa jenis penyakit akibat kerja (PAK) yang paling umum terjadi pada pekerja tambang bawah tanah?',
    options: [
      { key: 'A', text: 'Diabetes akibat pola makan tidak teratur di lokasi tambang' },
      { key: 'B', text: 'Hipertensi akibat tekanan kerja dan beban mental yang tinggi' },
      { key: 'C', text: 'Pneumokoniosis akibat paparan debu mineral dalam jangka panjang' },
      { key: 'D', text: 'Obesitas akibat kurangnya aktivitas fisik selama jam kerja' },
      { key: 'E', text: 'Insomnia akibat kebisingan mesin yang terus menerus beroperasi' },
    ],
    correct_answer: 'C',
    explanation: '**Pneumokoniosis** adalah penyakit paru akibat **paparan debu mineral** dalam jangka panjang. Jenis yang umum di tambang:\n\n- **Silikosis**: akibat paparan debu silika ($\\text{SiO}_2$), paling umum di tambang batuan keras\n- **Asbestosis**: akibat paparan serat asbes\n- **Coal Workers\' Pneumoconiosis** (CWP): akibat paparan debu batubara\n\nPencegahan:\n- **Pengendalian debu**: penyiraman, ventilasi, *dust suppression*\n- **APD**: masker respirator dengan filter P100/N95\n- **Pemantauan**: pengukuran kadar debu berkala (NAB debu silika = $0{,}05$ mg/m$^3$)\n- **Kesehatan kerja**: pemeriksaan fungsi paru (*spirometry*) berkala',
  },
  {
    order_index: 16,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa tujuan utama pemeriksaan kesehatan berkala (*medical check-up*) bagi pekerja tambang?',
    options: [
      { key: 'A', text: 'Menentukan kenaikan gaji berdasarkan kondisi kesehatan pekerja' },
      { key: 'B', text: 'Memenuhi persyaratan administrasi asuransi kesehatan perusahaan' },
      { key: 'C', text: 'Mengukur produktivitas pekerja berdasarkan kondisi fisik mereka' },
      { key: 'D', text: 'Mendeteksi dini gangguan kesehatan akibat paparan bahaya di tempat kerja' },
      { key: 'E', text: 'Menyeleksi pekerja yang tidak lagi mampu bekerja untuk di-PHK' },
    ],
    correct_answer: 'D',
    explanation: 'Pemeriksaan kesehatan berkala bertujuan untuk **deteksi dini gangguan kesehatan** akibat paparan bahaya di tempat kerja.\n\nJenis pemeriksaan kesehatan kerja:\n1. **Pra-kerja** (*pre-employment*): sebelum mulai bekerja\n2. **Berkala** (*periodic*): rutin setiap 1-2 tahun\n3. **Khusus** (*special*): setelah paparan tertentu atau kecelakaan\n4. **Pasca-kerja** (*exit*): saat mengakhiri hubungan kerja\n\nPemeriksaan khas untuk pekerja tambang:\n- **Spirometry**: fungsi paru (deteksi pneumokoniosis)\n- **Audiometry**: pendengaran (deteksi *noise-induced hearing loss*)\n- **Rontgen dada**: kelainan paru\n- **Tes darah**: paparan logam berat (Pb, Hg, Ni)',
  },
  {
    order_index: 17,
    category: 'T5',
    difficulty: 'medium',
    content: 'Nilai Ambang Batas (NAB) kebisingan di tempat kerja untuk paparan 8 jam kerja menurut Permenaker No. 5/2018 adalah ...',
    options: [
      { key: 'A', text: '85 dB(A)' },
      { key: 'B', text: '90 dB(A)' },
      { key: 'C', text: '70 dB(A)' },
      { key: 'D', text: '95 dB(A)' },
      { key: 'E', text: '80 dB(A)' },
    ],
    correct_answer: 'A',
    explanation: 'Menurut **Permenaker No. 5 Tahun 2018**, NAB kebisingan untuk paparan **8 jam kerja** adalah **85 dB(A)**.\n\nPrinsip *halving rate* (penambahan 3 dB = waktu paparan setengahnya):\n\n| Tingkat kebisingan | Waktu paparan maks |\n|---|---|\n| 85 dB(A) | 8 jam |\n| 88 dB(A) | 4 jam |\n| 91 dB(A) | 2 jam |\n| 94 dB(A) | 1 jam |\n| 97 dB(A) | 30 menit |\n\nSumber kebisingan di tambang: crusher (90-100 dB), blasting (> 140 dB), haul truck (85-95 dB). APD yang digunakan: *earplug* (NRR 20-30 dB) atau *earmuff* (NRR 25-35 dB).',
  },

  // ═══════════════════════════════════════════
  // T6: Prinsip ESG & Sustainability (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 18,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa kepanjangan ESG dan apa relevansinya bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Economic, Strategic, Growth - kerangka pertumbuhan ekonomi perusahaan' },
      { key: 'B', text: 'Environmental, Social, Governance - kerangka untuk mengukur keberlanjutan dan tanggung jawab perusahaan' },
      { key: 'C', text: 'Energy, Safety, Geology - standar teknis operasional pertambangan' },
      { key: 'D', text: 'Exploration, Smelting, Geochemistry - tahapan proses produksi tambang' },
      { key: 'E', text: 'Efficiency, Sustainability, Green - program ramah lingkungan perusahaan' },
    ],
    correct_answer: 'B',
    explanation: '**ESG** = ***Environmental, Social, Governance*** - kerangka untuk mengukur **keberlanjutan dan tanggung jawab** perusahaan.\n\n| Pilar | Aspek di Tambang |\n|---|---|\n| **Environmental** | Emisi karbon, pengelolaan limbah, reklamasi lahan, keanekaragaman hayati |\n| **Social** | K3, hubungan masyarakat, hak asasi manusia, ketenagakerjaan |\n| **Governance** | Tata kelola perusahaan, anti-korupsi, transparansi, kepatuhan regulasi |\n\nRelevansi ESG bagi perusahaan tambang:\n- **Investor** semakin mempertimbangkan skor ESG dalam keputusan investasi\n- **Regulasi** semakin ketat terkait lingkungan dan sosial\n- **Reputasi** perusahaan dipengaruhi oleh kinerja ESG\n- **Akses pasar**: pembeli global mensyaratkan sertifikasi keberlanjutan',
  },
  {
    order_index: 19,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa tujuan utama reklamasi lahan bekas tambang?',
    options: [
      { key: 'A', text: 'Menjual tanah bekas tambang dengan harga lebih tinggi kepada investor properti' },
      { key: 'B', text: 'Menyembunyikan bekas aktivitas tambang agar tidak terlihat dari udara' },
      { key: 'C', text: 'Memulihkan fungsi lahan agar dapat dimanfaatkan kembali secara produktif dan aman' },
      { key: 'D', text: 'Memindahkan material tambang ke lokasi lain untuk membuka lahan baru' },
      { key: 'E', text: 'Menghilangkan seluruh bukti aktivitas penambangan yang pernah dilakukan' },
    ],
    correct_answer: 'C',
    explanation: '**Reklamasi** lahan bekas tambang bertujuan **memulihkan fungsi lahan** agar dapat dimanfaatkan kembali secara **produktif dan aman** (UU No. 3/2020 tentang Minerba).\n\nTahapan reklamasi:\n1. **Penataan lahan**: pengisian kembali (*backfilling*), stabilisasi lereng, drainase\n2. **Pengelolaan tanah pucuk**: penebaran *topsoil* yang telah disimpan\n3. **Revegetasi**: penanaman tanaman penutup dan tanaman inti\n4. **Pemeliharaan**: penyiraman, pemupukan, penyulaman tanaman mati\n5. **Monitoring**: pemantauan keberhasilan 3-5 tahun\n\nPeruntukan lahan pasca-tambang:\n- Pertanian, perkebunan, kehutanan\n- Perikanan (kolam bekas void)\n- Pariwisata, area konservasi\n- Kawasan industri atau permukiman',
  },
  {
    order_index: 20,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *carbon footprint* perusahaan tambang?',
    options: [
      { key: 'A', text: 'Jumlah karbon yang terkandung dalam bijih mineral yang ditambang' },
      { key: 'B', text: 'Luas area hutan yang ditebang untuk keperluan pembukaan lahan tambang' },
      { key: 'C', text: 'Biaya yang dikeluarkan untuk membeli kredit karbon dari pasar internasional' },
      { key: 'D', text: 'Jumlah kendaraan berbahan bakar fosil yang digunakan di lokasi tambang' },
      { key: 'E', text: 'Total emisi gas rumah kaca yang dihasilkan dari seluruh aktivitas operasional' },
    ],
    correct_answer: 'E',
    explanation: '***Carbon footprint*** adalah **total emisi gas rumah kaca** (GRK) yang dihasilkan dari seluruh aktivitas operasional, dinyatakan dalam ton $\\text{CO}_2$ ekuivalen.\n\nSumber emisi di tambang:\n- **Scope 1** (langsung): pembakaran BBM alat berat, peledakan, proses metalurgi\n- **Scope 2** (tidak langsung): konsumsi listrik dari PLN\n- **Scope 3** (rantai nilai): transportasi produk, perjalanan dinas, pengadaan barang\n\nStrategi pengurangan:\n- Elektrifikasi armada (*battery-electric vehicles*)\n- Penggunaan energi terbarukan (solar panel, PLTA)\n- Efisiensi energi di pabrik pengolahan\n- Program penghijauan dan restorasi hutan',
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
