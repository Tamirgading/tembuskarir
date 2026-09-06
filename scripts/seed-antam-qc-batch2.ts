/**
 * ANTAM IMPACT 2026 — Quality Control (QC) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Prinsip Dasar QA/QC): 4 soal
 *   T2 (Teknik Sampling & Preparasi): 4 soal
 *   T3 (Kimia Analitik & Instrumen): 4 soal
 *   T4 (Analisis Statistik untuk Mutu): 4 soal
 *   T5 (Sistem Manajemen Mutu Lab): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-qc-batch2.ts
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
// A: 22,26,33,38 | B: 25,29,34,39 | C: 23,30,35,40 | D: 21,27,31,36 | E: 24,28,32,37

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Prinsip Dasar QA/QC (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *traceability* (ketelusuran) dalam sistem mutu laboratorium?',
    options: [
      { key: 'A', text: 'Kemampuan melacak lokasi fisik setiap sampel di dalam laboratorium' },
      { key: 'B', text: 'Sistem pelacakan kehadiran personel laboratorium setiap hari' },
      { key: 'C', text: 'Kemampuan menelusuri riwayat pengiriman sampel dari tambang ke laboratorium' },
      { key: 'D', text: 'Rantai pengukuran yang tidak terputus dari hasil analisis hingga ke standar primer internasional' },
      { key: 'E', text: 'Catatan pembelian reagent dari pemasok yang tersertifikasi' },
    ],
    correct_answer: 'D',
    explanation: '***Traceability*** (ketelusuran) adalah **rantai pengukuran yang tidak terputus** dari hasil analisis di laboratorium hingga ke **standar primer internasional**.\n\nRantai ketelusuran:\n1. **Standar primer** (SI unit, BIPM)\n2. **Standar nasional** (BSN/KAN di Indonesia, NIST di AS)\n3. **Standar referensi** laboratorium (CRM tersertifikasi)\n4. **Standar kerja** laboratorium (larutan kalibrasi harian)\n5. **Hasil pengukuran** sampel\n\nContoh ketelusuran:\n- Neraca dikalibrasi menggunakan **anak timbangan bersertifikat** yang tertelusur ke kilogram standar\n- Larutan kalibrasi AAS dibuat dari **CRM bersertifikat** yang tertelusur ke standar NIST\n\nTanpa ketelusuran, hasil analisis tidak dapat dipertanggungjawabkan secara ilmiah.',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa fungsi *chain of custody* (rantai pengawasan) dalam pengelolaan sampel?',
    options: [
      { key: 'A', text: 'Mendokumentasikan setiap perpindahan tangan sampel dari pengambilan hingga analisis' },
      { key: 'B', text: 'Menentukan urutan prioritas analisis sampel di laboratorium' },
      { key: 'C', text: 'Mengatur jadwal pengiriman sampel ke laboratorium eksternal' },
      { key: 'D', text: 'Menghitung biaya transportasi sampel dari lapangan ke laboratorium' },
      { key: 'E', text: 'Menentukan metode analisis yang sesuai untuk setiap jenis sampel' },
    ],
    correct_answer: 'A',
    explanation: '***Chain of custody*** mendokumentasikan **setiap perpindahan tangan** sampel untuk memastikan **integritas** dan mencegah **manipulasi**.\n\nInformasi yang dicatat:\n- **Siapa** yang mengambil, menerima, dan menganalisis sampel\n- **Kapan** setiap perpindahan terjadi (tanggal dan waktu)\n- **Di mana** sampel disimpan pada setiap tahap\n- **Kondisi** sampel saat diterima (segel utuh, label jelas)\n\nPentingnya *chain of custody*:\n- **Bukti hukum**: hasil analisis bisa digunakan dalam sengketa (kontrak, regulasi)\n- **Pencegahan fraud**: mengurangi peluang pengubahan sampel\n- **Akuntabilitas**: setiap pihak bertanggung jawab atas sampel yang ditangani\n- **Audit trail**: dapat ditelusuri jika ada masalah pada hasil',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *umpire analysis* dalam penyelesaian sengketa kualitas?',
    options: [
      { key: 'A', text: 'Analisis ulang oleh analis yang sama menggunakan metode yang berbeda' },
      { key: 'B', text: 'Pengujian sampel oleh manajer laboratorium untuk memverifikasi hasil analis' },
      { key: 'C', text: 'Analisis oleh laboratorium independen ketiga untuk menyelesaikan perbedaan hasil antara dua pihak' },
      { key: 'D', text: 'Perbandingan hasil analisis manual dengan hasil analisis instrumen' },
      { key: 'E', text: 'Pengujian sampel menggunakan dua metode berbeda di laboratorium yang sama' },
    ],
    correct_answer: 'C',
    explanation: '***Umpire analysis*** adalah **analisis oleh laboratorium independen ketiga** untuk menyelesaikan sengketa ketika hasil analisis dari **dua pihak** (misal penjual dan pembeli) berbeda di luar batas toleransi.\n\nProses *umpire*:\n1. Penjual dan pembeli masing-masing menganalisis sampel\n2. Jika selisih hasil > **splitting limit** (batas toleransi yang disepakati), dilakukan *umpire*\n3. Sampel dikirim ke **laboratorium wasit** yang disepakati kedua pihak\n4. Hasil laboratorium wasit menjadi **final dan mengikat**\n\nKetentuan umum:\n- Laboratorium wasit harus **terakreditasi** dan disetujui kedua pihak\n- Biaya *umpire* ditanggung pihak yang hasilnya paling jauh dari hasil wasit\n- Ketentuan detail biasanya tercantum dalam **kontrak jual-beli** (*offtake agreement*)',
  },
  {
    order_index: 24,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa tujuan melakukan *inter-laboratory comparison* (uji banding antar laboratorium)?',
    options: [
      { key: 'A', text: 'Menentukan laboratorium mana yang memiliki peralatan paling mahal' },
      { key: 'B', text: 'Membandingkan tarif analisis antar laboratorium untuk negosiasi harga' },
      { key: 'C', text: 'Mengurangi jumlah laboratorium yang beroperasi di suatu daerah' },
      { key: 'D', text: 'Mengevaluasi kecepatan pelayanan antar laboratorium sejenis' },
      { key: 'E', text: 'Menilai kompetensi dan konsistensi hasil analisis antar laboratorium' },
    ],
    correct_answer: 'E',
    explanation: '***Inter-laboratory comparison*** (uji banding) bertujuan **menilai kompetensi dan konsistensi** hasil analisis antar laboratorium.\n\nJenis program:\n- **Proficiency testing** (PT): penyelenggara mengirim sampel uji, laboratorium menganalisis secara independen, hasil dievaluasi secara statistik\n- **Round robin**: sampel yang sama dianalisis oleh beberapa laboratorium secara bergilir\n\nManfaat:\n- Mengidentifikasi **bias sistematis** di laboratorium peserta\n- Memvalidasi **metode dan prosedur** yang digunakan\n- Persyaratan **akreditasi** ISO/IEC 17025\n- Meningkatkan **kepercayaan pelanggan** terhadap hasil\n\nEvaluasi menggunakan **z-score**:\n- $|z| < 2$: **memuaskan** (hasil baik)\n- $2 \\leq |z| < 3$: **peringatan** (perlu investigasi)\n- $|z| \\geq 3$: **tidak memuaskan** (tindakan korektif wajib)',
  },

  // ═══════════════════════════════════════════
  // T2: Teknik Sampling & Preparasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa perbedaan antara sampel *channel* dan sampel *grab* dalam pengambilan sampel bijih?',
    options: [
      { key: 'A', text: 'Channel mengambil dari permukaan laut, grab mengambil dari daratan' },
      { key: 'B', text: 'Channel mengambil secara kontinu sepanjang garis tertentu, grab mengambil secara acak dari satu titik' },
      { key: 'C', text: 'Channel menggunakan mesin otomatis, grab menggunakan tangan pekerja' },
      { key: 'D', text: 'Channel untuk sampel cair, grab untuk sampel padat' },
      { key: 'E', text: 'Channel mengambil di kedalaman > 10 m, grab di permukaan saja' },
    ],
    correct_answer: 'B',
    explanation: 'Perbedaan metode sampling:\n\n| Aspek | Channel sample | Grab sample |\n|---|---|---|\n| **Cara** | Memotong **kontinu** sepanjang garis/alur | Mengambil **segenggam** dari satu titik |\n| Representatif | **Baik** - mewakili seluruh area | **Kurang** - hanya mewakili titik itu |\n| Kegunaan | Eksplorasi, *grade control* | Identifikasi awal, pengecekan cepat |\n| Bias | Rendah jika dilakukan benar | **Tinggi** - cenderung selektif |\n\nJenis sampling lain:\n- **Chip sample**: pecahan-pecahan kecil dari permukaan batuan\n- **Trench sample**: dari parit yang digali menembus zona mineralisasi\n- **Core sample**: dari pemboran inti (*diamond drilling*)\n- **Composite sample**: gabungan beberapa sampel menjadi satu',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *duplicate sample* dan apa fungsinya dalam QC?',
    options: [
      { key: 'A', text: 'Sampel yang dianalisis dua kali oleh laboratorium berbeda untuk menguji akurasi' },
      { key: 'B', text: 'Sampel berukuran ganda yang diambil untuk cadangan di gudang penyimpanan' },
      { key: 'C', text: 'Dua aliquot dari sampel yang sama untuk menguji presisi preparasi dan analisis' },
      { key: 'D', text: 'Salinan label sampel yang dibuat untuk administrasi pengiriman' },
      { key: 'E', text: 'Sampel yang diambil dua hari berturut-turut dari lokasi yang sama' },
    ],
    correct_answer: 'A',
    explanation: 'Dalam konteks QC, terdapat beberapa jenis duplikat:\n\n**Field duplicate**: sampel kedua dari lokasi yang sama\n- Menguji **presisi sampling** (variabilitas pengambilan sampel)\n\n**Coarse duplicate**: split dari sampel kasar sebelum dihaluskan\n- Menguji **presisi preparasi** (sub-sampling)\n\n**Pulp duplicate**: split dari sampel yang sudah dihaluskan\n- Menguji **presisi analisis** (metode dan alat)\n\n**Lab duplicate** (opsi A): sampel yang dianalisis di **laboratorium berbeda**\n- Menguji **akurasi dan bias** antar laboratorium\n\nFrekuensi sisipan duplikat:\n- Umumnya **1 dari setiap 10-20 sampel** (5-10%)\n- Hasil dievaluasi menggunakan *relative percent difference* (RPD)\n- RPD > 10-15% memerlukan investigasi',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'medium',
    content: 'Ukuran target pulverizing sampel bijih untuk analisis kimia umumnya adalah ...',
    options: [
      { key: 'A', text: '< 10 mm (melewati ayakan 10 mm)' },
      { key: 'B', text: '< 2 mm (melewati ayakan 2 mm)' },
      { key: 'C', text: '< 1 mm (melewati ayakan 1 mm)' },
      { key: 'D', text: '< 75 mikron (melewati ayakan 200 mesh)' },
      { key: 'E', text: '< 10 mikron (melewati ayakan 1250 mesh)' },
    ],
    correct_answer: 'D',
    explanation: 'Target ukuran **pulverizing** untuk analisis kimia: **< 75 $\\mu$m** (melewati ayakan **200 mesh** atau **-200#**).\n\nAlasan:\n- Partikel **homogen** pada ukuran ini, sehingga sub-sampel kecil (0,5-1 g) representatif\n- Memudahkan **pelarutan** dalam asam untuk analisis AAS/ICP\n- Mempercepat **reaksi fusi** untuk analisis XRF\n- Sesuai standar **ISO dan ASTM** untuk preparasi sampel mineral\n\nTahapan pengecilan ukuran:\n\n| Tahap | Alat | Ukuran output |\n|---|---|---|\n| Primary crushing | Jaw crusher | < 10 mm |\n| Secondary crushing | Roll crusher/cone | < 2 mm |\n| **Pulverizing** | Ring mill/disc mill | **< 75 $\\mu$m** |\n\nVerifikasi: ayak sub-sampel, minimal **85-95%** harus lolos 75 $\\mu$m.',
  },
  {
    order_index: 28,
    category: 'T2',
    difficulty: 'easy',
    content: 'Mengapa sampel bijih harus dikeringkan sebelum proses crushing dan pulverizing?',
    options: [
      { key: 'A', text: 'Sampel basah akan merusak motor listrik alat preparasi' },
      { key: 'B', text: 'Sampel basah mengubah warna mineral sehingga tidak bisa diidentifikasi' },
      { key: 'C', text: 'Pengeringan meningkatkan kadar mineral berharga dalam sampel' },
      { key: 'D', text: 'Sampel kering lebih mudah dikirim ke laboratorium luar' },
      { key: 'E', text: 'Sampel basah menempel di alat, menyumbat, dan meningkatkan kontaminasi silang' },
    ],
    correct_answer: 'E',
    explanation: 'Sampel harus dikeringkan sebelum preparasi mekanis karena:\n\n1. **Menempel di alat**: material basah menempel di jaw crusher, ring mill, dan riffle splitter\n2. **Menyumbat**: material lembab menyumbat saluran alat preparasi\n3. **Kontaminasi silang**: sisa material basah lebih sulit dibersihkan dari alat\n4. **Splitting tidak akurat**: material basah cenderung menggumpal, splitting tidak merata\n\nMetode pengeringan:\n- **Oven** $105°$C: standar untuk kadar air\n- **Oven** $60$-$70°$C: untuk sampel yang sensitif terhadap panas tinggi\n- **Udara terbuka**: lambat tetapi minim risiko perubahan mineral\n\nCatatan: beberapa mineral (sulfida, clay) bisa berubah komposisi pada suhu tinggi, sehingga suhu pengeringan harus disesuaikan.',
  },

  // ═══════════════════════════════════════════
  // T3: Kimia Analitik & Instrumen (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa prinsip dasar analisis titrasi dalam penentuan kadar suatu zat?',
    options: [
      { key: 'A', text: 'Mengukur massa endapan yang terbentuk dari reaksi kimia sampel' },
      { key: 'B', text: 'Menambahkan larutan standar secara bertahap hingga reaksi sempurna, lalu menghitung kadar dari volume yang digunakan' },
      { key: 'C', text: 'Menyinari sampel dengan cahaya dan mengukur absorbansi pada panjang gelombang tertentu' },
      { key: 'D', text: 'Memanaskan sampel dan mengukur perubahan berat pada berbagai suhu' },
      { key: 'E', text: 'Melarutkan sampel dalam pelarut organik dan mengukur konduktivitas larutan' },
    ],
    correct_answer: 'B',
    explanation: '**Titrasi** adalah metode analisis kuantitatif dengan **menambahkan larutan standar** (*titrant*) yang konsentrasinya diketahui ke larutan sampel (*analit*) hingga reaksi mencapai titik ekuivalen.\n\nJenis titrasi:\n- **Titrasi asam-basa**: penetapan keasaman/kebasaan (indikator pH)\n- **Titrasi redoks**: berdasarkan reaksi oksidasi-reduksi (misal KMnO$_4$)\n- **Titrasi kompleksometri**: menggunakan EDTA untuk logam (Ca, Mg, Ni)\n- **Titrasi pengendapan**: membentuk endapan (misal AgNO$_3$ untuk klorida)\n\nPerhitungan:\n$$C_1 \\times V_1 = C_2 \\times V_2$$\n\nDi mana $C_1, V_1$ = konsentrasi dan volume titrant, $C_2, V_2$ = konsentrasi dan volume analit.\n\nTitik akhir titrasi ditandai oleh **perubahan warna indikator** atau perubahan potensial (potensiometri).',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'medium',
    content: 'Sampel bijih nikel dilarutkan dan dianalisis dengan AAS. Absorbansi sampel = $0{,}45$, absorbansi standar $10$ ppm = $0{,}30$. Berapa konsentrasi Ni dalam larutan sampel?',
    options: [
      { key: 'A', text: '$12$ ppm' },
      { key: 'B', text: '$6{,}7$ ppm' },
      { key: 'C', text: '$15$ ppm' },
      { key: 'D', text: '$20$ ppm' },
      { key: 'E', text: '$3$ ppm' },
    ],
    correct_answer: 'C',
    explanation: 'Menggunakan hukum **Beer-Lambert** (hubungan linier absorbansi vs konsentrasi):\n$$\\begin{aligned} \\frac{A_{\\text{sampel}}}{A_{\\text{standar}}} &= \\frac{C_{\\text{sampel}}}{C_{\\text{standar}}} \\\\ C_{\\text{sampel}} &= \\frac{A_{\\text{sampel}}}{A_{\\text{standar}}} \\times C_{\\text{standar}} \\\\ &= \\frac{0{,}45}{0{,}30} \\times 10 = 15 \\text{ ppm} \\end{aligned}$$\n\nKonsentrasi Ni dalam larutan = **15 ppm**.\n\nCatatan: metode satu standar ini hanya akurat jika hubungan absorbansi-konsentrasi **linier** pada rentang tersebut. Dalam praktik, digunakan **kurva kalibrasi** dengan minimal 3-5 standar konsentrasi berbeda.',
  },
  {
    order_index: 31,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa fungsi *blank sample* dalam analisis kimia?',
    options: [
      { key: 'A', text: 'Mengkalibrasi instrumen sebelum digunakan untuk analisis rutin' },
      { key: 'B', text: 'Menguji kemampuan analis dalam mengidentifikasi mineral secara visual' },
      { key: 'C', text: 'Menentukan harga reagent yang paling ekonomis untuk pengadaan' },
      { key: 'D', text: 'Mendeteksi kontaminasi dari reagent, peralatan, atau lingkungan laboratorium' },
      { key: 'E', text: 'Mengukur kecepatan reaksi kimia pada berbagai suhu' },
    ],
    correct_answer: 'D',
    explanation: '***Blank sample*** (sampel kosong) berfungsi untuk **mendeteksi kontaminasi** dari berbagai sumber di laboratorium.\n\nJenis blank:\n- **Method blank**: reagent diproses melalui seluruh tahapan analisis tanpa sampel\n  - Mendeteksi kontaminasi dari **reagent dan peralatan gelas**\n- **Field blank**: kontainer kosong yang dibawa ke lapangan dan dikembalikan\n  - Mendeteksi kontaminasi dari **transportasi dan penyimpanan**\n- **Rinse blank**: air bilasan terakhir dari peralatan preparasi\n  - Mendeteksi **kontaminasi silang** antar sampel\n\nKriteria penerimaan:\n- Hasil blank harus di bawah **batas deteksi** metode\n- Jika blank positif, investigasi sumber kontaminasi dan ulangi batch analisis\n- Frekuensi: minimal **1 blank per batch** (20-50 sampel)',
  },
  {
    order_index: 32,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa keunggulan analisis menggunakan ICP-MS dibandingkan ICP-OES?',
    options: [
      { key: 'A', text: 'ICP-MS lebih murah dalam biaya operasional dan perawatan alat' },
      { key: 'B', text: 'ICP-MS tidak memerlukan sampel dalam bentuk larutan' },
      { key: 'C', text: 'ICP-MS lebih mudah dioperasikan oleh analis yang belum berpengalaman' },
      { key: 'D', text: 'ICP-MS lebih cocok untuk analisis unsur dengan konsentrasi tinggi' },
      { key: 'E', text: 'ICP-MS memiliki batas deteksi jauh lebih rendah hingga level parts per trillion' },
    ],
    correct_answer: 'E',
    explanation: 'Perbandingan **ICP-OES** vs **ICP-MS**:\n\n| Aspek | ICP-OES | ICP-MS |\n|---|---|---|\n| Deteksi | **Emisi cahaya** | **Massa ion** |\n| Batas deteksi | ppb (bagian per miliar) | **ppt (bagian per triliun)** |\n| Rentang dinamis | Sangat luas | Luas |\n| Biaya alat | Lebih murah | Lebih mahal |\n| Biaya operasi | Lebih rendah | Lebih tinggi |\n| Interferensi | Spektral (garis emisi) | Isobarik (massa sama) |\n\nKapan menggunakan ICP-MS:\n- Analisis **trace element** dan **ultra-trace** (Au, Pt, As, Hg)\n- Analisis **isotop** (rasio isotop untuk studi geokimia)\n- Sampel dengan konsentrasi analit sangat rendah (air lingkungan, *plant tissue*)\n\nICP-OES lebih cocok untuk analisis rutin kadar **mayor** dan **minor** (Ni, Fe, SiO$_2$, MgO).',
  },

  // ═══════════════════════════════════════════
  // T4: Analisis Statistik untuk Mutu (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Suatu peta kendali menunjukkan 7 titik berturut-turut di atas garis tengah (*center line*). Apa yang harus dilakukan?',
    options: [
      { key: 'A', text: 'Menginvestigasi karena pola ini menunjukkan adanya pergeseran sistematis (bias)' },
      { key: 'B', text: 'Tidak perlu tindakan karena semua titik masih di dalam batas kontrol' },
      { key: 'C', text: 'Menambah jumlah standar kalibrasi untuk meningkatkan presisi' },
      { key: 'D', text: 'Mengganti seluruh reagent dan larutan standar yang digunakan' },
      { key: 'E', text: 'Mengurangi frekuensi analisis CRM karena proses sudah stabil' },
    ],
    correct_answer: 'A',
    explanation: '**7 titik berturut-turut di satu sisi** garis tengah adalah salah satu aturan ***Western Electric*** yang menandakan proses **tidak terkendali** (*out of control*).\n\nAturan *out of control* pada peta kendali:\n1. **1 titik** di luar batas kontrol ($\\pm 3\\sigma$)\n2. **2 dari 3** titik berturut-turut di luar batas peringatan ($\\pm 2\\sigma$)\n3. **4 dari 5** titik berturut-turut di luar $\\pm 1\\sigma$\n4. **7 titik berturut-turut** di satu sisi garis tengah (**trend/shift**)\n\nPola 7 titik di atas menunjukkan **bias positif sistematis**:\n- Kemungkinan penyebab: drift alat, standar terdegradasi, kontaminasi\n- Tindakan: investigasi sumber bias, kalibrasi ulang, verifikasi dengan CRM independen\n- Semua hasil analisis sejak awal *trend* harus **dievaluasi ulang**',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'medium',
    content: 'Data analisis duplikat memberikan pasangan nilai: ($1{,}50$; $1{,}56$). Berapa *Relative Percent Difference* (RPD)?',
    options: [
      { key: 'A', text: '$2{,}0\\%$' },
      { key: 'B', text: '$3{,}9\\%$' },
      { key: 'C', text: '$6{,}0\\%$' },
      { key: 'D', text: '$4{,}0\\%$' },
      { key: 'E', text: '$1{,}5\\%$' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan *Relative Percent Difference* (RPD):\n$$\\begin{aligned} \\text{RPD} &= \\frac{|x_1 - x_2|}{\\frac{x_1 + x_2}{2}} \\times 100\\% \\\\ &= \\frac{|1{,}50 - 1{,}56|}{\\frac{1{,}50 + 1{,}56}{2}} \\times 100\\% \\\\ &= \\frac{0{,}06}{1{,}53} \\times 100\\% = 3{,}9\\% \\end{aligned}$$\n\nInterpretasi RPD:\n- RPD < 5%: presisi **baik** untuk kadar > 1%\n- RPD 5-10%: presisi **cukup**, perlu perhatian\n- RPD > 10%: presisi **buruk**, investigasi diperlukan\n\nBatas RPD yang diterima tergantung pada:\n- **Kadar analit**: kadar rendah wajar RPD lebih tinggi\n- **Metode analisis**: metode klasik biasanya lebih presisi\n- **Standar perusahaan**: ditetapkan dalam *QAQC protocol*',
  },
  {
    order_index: 35,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *outlier* dalam data analisis laboratorium?',
    options: [
      { key: 'A', text: 'Hasil analisis yang berada tepat pada nilai rata-rata dari seluruh data' },
      { key: 'B', text: 'Sampel yang hilang selama proses pengiriman dari tambang ke laboratorium' },
      { key: 'C', text: 'Nilai data yang menyimpang jauh dari kumpulan data lainnya' },
      { key: 'D', text: 'Hasil analisis yang diperoleh dari laboratorium luar negeri' },
      { key: 'E', text: 'Sampel yang dianalisis di luar jam kerja normal laboratorium' },
    ],
    correct_answer: 'C',
    explanation: '***Outlier*** adalah **nilai data yang menyimpang jauh** dari kumpulan data lainnya dan mungkin disebabkan oleh kesalahan.\n\nMetode deteksi outlier:\n- **Grubbs\' test**: menguji apakah nilai paling ekstrem adalah outlier\n- **Dixon\'s Q-test**: cocok untuk dataset kecil (< 25 data)\n- **Box plot**: nilai di luar $Q_1 - 1{,}5 \\times \\text{IQR}$ atau $Q_3 + 1{,}5 \\times \\text{IQR}$\n- **Z-score**: $|z| > 3$ dianggap potensial outlier\n\nPenanganan outlier:\n1. **Investigasi** penyebabnya (kesalahan preparasi, kontaminasi, instrumen)\n2. Jika penyebab ditemukan, **hapus** data dan ulangi analisis\n3. Jika tidak ada penyebab jelas, **jangan hapus** tanpa justifikasi statistik\n4. **Dokumentasikan** keputusan dan alasannya',
  },
  {
    order_index: 36,
    category: 'T4',
    difficulty: 'medium',
    content: 'Standar deviasi dari 10 hasil analisis CRM adalah $0{,}05\\%$ Ni dengan rata-rata $2{,}50\\%$ Ni. Berapa *Relative Standard Deviation* (RSD)?',
    options: [
      { key: 'A', text: '$0{,}5\\%$' },
      { key: 'B', text: '$5{,}0\\%$' },
      { key: 'C', text: '$0{,}05\\%$' },
      { key: 'D', text: '$2{,}0\\%$' },
      { key: 'E', text: '$10\\%$' },
    ],
    correct_answer: 'D',
    explanation: 'Perhitungan *Relative Standard Deviation* (RSD), juga disebut *Coefficient of Variation* (CV):\n$$\\text{RSD} = \\frac{\\sigma}{\\bar{x}} \\times 100\\% = \\frac{0{,}05}{2{,}50} \\times 100\\% = 2{,}0\\%$$\n\nInterpretasi RSD:\n- RSD < 2%: presisi **sangat baik**\n- RSD 2-5%: presisi **baik** untuk analisis rutin\n- RSD 5-10%: presisi **cukup**\n- RSD > 10%: presisi **buruk**\n\nRSD = 2,0% berada di batas **sangat baik/baik** untuk analisis Ni pada kadar 2,50%.\n\nKeunggulan RSD dibanding standar deviasi: RSD memungkinkan **perbandingan presisi** antar metode atau antar kadar yang berbeda karena dinormalisasi terhadap rata-rata.',
  },

  // ═══════════════════════════════════════════
  // T5: Sistem Manajemen Mutu Lab (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 37,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *method validation* dalam laboratorium analisis?',
    options: [
      { key: 'A', text: 'Proses pemilihan metode analisis yang paling murah dari beberapa alternatif' },
      { key: 'B', text: 'Persetujuan manajemen atas penggunaan metode baru di laboratorium' },
      { key: 'C', text: 'Pencatatan setiap langkah analisis dalam buku log laboratorium' },
      { key: 'D', text: 'Publikasi metode analisis di jurnal ilmiah internasional' },
      { key: 'E', text: 'Proses pembuktian bahwa metode analisis memenuhi persyaratan yang ditetapkan' },
    ],
    correct_answer: 'E',
    explanation: '***Method validation*** adalah proses **pembuktian sistematis** bahwa suatu metode analisis memenuhi **persyaratan yang ditetapkan** untuk tujuan penggunaannya.\n\nParameter validasi metode:\n- **Akurasi** (*trueness*): kedekatan dengan nilai sebenarnya\n- **Presisi**: keterulangan (*repeatability*) dan reprodusibilitas (*reproducibility*)\n- **Batas deteksi** (LOD): konsentrasi terendah yang terdeteksi\n- **Batas kuantitasi** (LOQ): konsentrasi terendah yang terukur akurat\n- **Linearitas**: rentang konsentrasi dengan respons linier\n- **Selektivitas**: kemampuan mengukur analit tanpa interferensi\n- **Ketahanan** (*robustness*): stabilitas terhadap variasi kecil kondisi\n\nValidasi wajib dilakukan saat:\n- Menggunakan **metode baru** yang belum standar\n- **Modifikasi** metode yang sudah ada\n- Menerapkan metode standar pada **matriks baru**',
  },
  {
    order_index: 38,
    category: 'T5',
    difficulty: 'medium',
    content: 'Dalam ISO/IEC 17025, apa yang dimaksud dengan *measurement uncertainty*?',
    options: [
      { key: 'A', text: 'Parameter yang menggambarkan sebaran nilai yang dapat diatribusikan ke besaran yang diukur' },
      { key: 'B', text: 'Ketidakpastian analis dalam membaca skala alat ukur secara visual' },
      { key: 'C', text: 'Keraguan manajemen terhadap kemampuan laboratorium menghasilkan hasil akurat' },
      { key: 'D', text: 'Fluktuasi harga reagent yang mempengaruhi biaya analisis per sampel' },
      { key: 'E', text: 'Perbedaan pendapat antar analis tentang metode yang paling tepat' },
    ],
    correct_answer: 'A',
    explanation: '***Measurement uncertainty*** (ketidakpastian pengukuran) adalah **parameter yang menggambarkan sebaran nilai** yang secara wajar dapat diatribusikan ke besaran yang diukur.\n\nKomponen ketidakpastian:\n- **Tipe A**: dievaluasi secara **statistik** dari data pengukuran berulang\n- **Tipe B**: dievaluasi dari **informasi lain** (sertifikat kalibrasi, spesifikasi alat, data literatur)\n\nSumber ketidakpastian di lab tambang:\n- Sampling dan preparasi sampel\n- Penimbangan (ketidakpastian neraca)\n- Volume larutan (labu ukur, pipet)\n- Kalibrasi instrumen\n- Efek matriks\n\nContoh pelaporan:\n- Kadar Ni = $1{,}85 \\pm 0{,}04\\%$ (interval kepercayaan 95%)\n- ISO/IEC 17025 **mewajibkan** laboratorium melaporkan ketidakpastian jika diminta pelanggan',
  },
  {
    order_index: 39,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa peran KAN (Komite Akreditasi Nasional) terhadap laboratorium di Indonesia?',
    options: [
      { key: 'A', text: 'Memproduksi dan mendistribusikan reagent kimia ke seluruh laboratorium' },
      { key: 'B', text: 'Memberikan akreditasi yang menjamin kompetensi teknis laboratorium sesuai standar internasional' },
      { key: 'C', text: 'Menentukan tarif analisis yang boleh dikenakan oleh laboratorium' },
      { key: 'D', text: 'Merekrut dan melatih seluruh analis yang bekerja di laboratorium nasional' },
      { key: 'E', text: 'Menyediakan peralatan laboratorium gratis untuk laboratorium pemerintah' },
    ],
    correct_answer: 'B',
    explanation: '**KAN** (*Komite Akreditasi Nasional*) adalah lembaga yang memberikan **akreditasi** kepada laboratorium di Indonesia, menjamin **kompetensi teknis** sesuai standar internasional.\n\nFungsi KAN:\n- **Menilai** kompetensi laboratorium berdasarkan ISO/IEC 17025\n- **Memberikan akreditasi** bagi laboratorium yang memenuhi persyaratan\n- **Surveilans berkala** untuk memastikan kepatuhan berkelanjutan\n- **Mutual recognition**: hasil akreditasi KAN diakui oleh badan akreditasi negara lain (melalui APLAC/ILAC)\n\nManfaat akreditasi bagi laboratorium:\n- **Pengakuan internasional** atas kompetensi\n- **Kepercayaan pelanggan** terhadap hasil analisis\n- **Persyaratan tender**: banyak kontrak mengharuskan lab terakreditasi\n- **Perbaikan berkelanjutan**: sistem mutu terjaga melalui audit reguler',
  },
  {
    order_index: 40,
    category: 'T5',
    difficulty: 'easy',
    content: 'Mengapa pengendalian kondisi lingkungan (suhu, kelembaban) penting di laboratorium analisis?',
    options: [
      { key: 'A', text: 'Untuk menjaga kenyamanan personel laboratorium selama jam kerja' },
      { key: 'B', text: 'Untuk mengurangi tagihan listrik laboratorium secara signifikan' },
      { key: 'C', text: 'Untuk memenuhi persyaratan desain interior laboratorium modern' },
      { key: 'D', text: 'Untuk mencegah pertumbuhan jamur pada dinding dan lantai laboratorium' },
      { key: 'E', text: 'Karena variasi suhu dan kelembaban mempengaruhi akurasi pengukuran dan stabilitas reagent' },
    ],
    correct_answer: 'C',
    explanation: 'Pengendalian lingkungan laboratorium penting karena:\n\n**Pengaruh suhu:**\n- **Neraca analitik**: perubahan suhu menyebabkan **konveksi udara** di dalam chamber, mempengaruhi pembacaan\n- **Volume larutan**: koefisien ekspansi termal mengubah volume (labu ukur dikalibrasi pada 20°C)\n- **Laju reaksi**: suhu mempengaruhi kinetika reaksi analisis\n\n**Pengaruh kelembaban:**\n- **Higroskopis**: beberapa reagent dan standar menyerap air dari udara\n- **Korosi**: kelembaban tinggi mempercepat korosi instrumen\n- **Elektrostatik**: kelembaban rendah menyebabkan listrik statis pada penimbangan\n\nPersyaratan umum (ISO/IEC 17025):\n- Suhu: $20 \\pm 2°$C (ruang timbang: $20 \\pm 1°$C)\n- Kelembaban: $45$-$65\\%$ RH\n- Pencatatan suhu dan kelembaban secara kontinu',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-qc')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-qc tidak ditemukan:', pkgErr)
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
