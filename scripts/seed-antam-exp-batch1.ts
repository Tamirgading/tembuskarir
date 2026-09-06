/**
 * ANTAM IMPACT 2026 — Exploration (EXP) Batch 1: Soal 1–20 (REV-2)
 *
 * Jalankan: npx tsx scripts/seed-antam-exp-batch1.ts
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
  difficulty: 'easy' | 'medium' | 'hard'
  order_index: number
}

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Geological Mapping & Surveying (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Dalam pemetaan geologi permukaan, apa tujuan utama pembuatan peta litologi?',
    options: [
      { key: 'A', text: 'Mengukur kadar mineral ekonomis secara langsung di lapangan' },
      { key: 'B', text: 'Menentukan posisi muka air tanah dan arah alirannya' },
      { key: 'C', text: 'Menghitung volume cadangan bijih berdasarkan singkapan batuan' },
      { key: 'D', text: 'Menunjukkan sebaran tipe batuan di suatu area' },
      { key: 'E', text: 'Mengidentifikasi jenis fosil indeks pada batuan sedimen' },
    ],
    correct_answer: 'D',
    explanation: 'Peta litologi bertujuan menunjukkan sebaran dan distribusi tipe-tipe batuan di suatu area. Peta ini menjadi dasar interpretasi geologi regional, membantu mengidentifikasi unit batuan yang berpotensi mengandung mineralisasi, serta menjadi acuan perencanaan eksplorasi selanjutnya seperti penentuan lokasi *sampling* dan pengeboran.',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Seorang geolog menemukan zona *shear* yang memotong batuan granit di lapangan. Apa signifikansi utama temuan ini dalam konteks eksplorasi mineral?',
    options: [
      { key: 'A', text: 'Zona tersebut dapat menjadi jalur migrasi fluida hidrotermal pembawa mineralisasi' },
      { key: 'B', text: 'Batuan granit di sekitar zona pasti sudah mengandung endapan emas ekonomis' },
      { key: 'C', text: 'Granit yang terpotong zona shear tidak layak dieksplorasi lebih lanjut' },
      { key: 'D', text: 'Zona shear hanya terbentuk pada tekanan tinggi di kedalaman lebih dari 5 km' },
      { key: 'E', text: 'Diperlukan analisis biostratigrafi dan fosil untuk mengkonfirmasi zona tersebut' },
    ],
    correct_answer: 'A',
    explanation: 'Zona *shear* (zona geser) merupakan struktur geologi yang sangat penting dalam eksplorasi mineral karena berfungsi sebagai jalur permeabel bagi fluida hidrotermal. Fluida ini membawa unsur-unsur logam terlarut yang kemudian mengendap sebagai mineralisasi (emas, tembaga, dll.) di sepanjang zona tersebut. Banyak deposit mineral ekonomis di dunia ditemukan berasosiasi dengan zona *shear*, seperti deposit emas orogenik.',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'easy',
    content: 'Pada kegiatan *core logging*, istilah $\\text{RQD}$ (*Rock Quality Designation*) mengukur parameter apa?',
    options: [
      { key: 'A', text: 'Kadar mineral bijih yang terkandung dalam inti bor hasil pengeboran' },
      { key: 'B', text: 'Kecepatan penetrasi mata bor terhadap batuan per satuan waktu' },
      { key: 'C', text: 'Kekerasan batuan yang diukur berdasarkan skala Mohs di laboratorium' },
      { key: 'D', text: 'Nilai densitas bulk batuan untuk estimasi tonase sumber daya mineral' },
      { key: 'E', text: 'Persentase inti bor utuh $\\geq 10$ cm terhadap total panjang *run*' },
    ],
    correct_answer: 'E',
    explanation: '$\\text{RQD}$ (*Rock Quality Designation*) dihitung dengan rumus:\n$$\\text{RQD} = \\frac{\\sum \\text{panjang inti} \\geq 10 \\text{ cm}}{\\text{total panjang run}} \\times 100\\%$$\nKlasifikasi kualitas massa batuan berdasarkan RQD:\n- $0\\text{-}25\\%$ = sangat buruk\n- $25\\text{-}50\\%$ = buruk\n- $50\\text{-}75\\%$ = sedang\n- $75\\text{-}90\\%$ = baik\n- $90\\text{-}100\\%$ = sangat baik',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'medium',
    content: 'Dari pengeboran sepanjang 2 meter (satu *run*), diperoleh potongan inti bor: 25 cm, 8 cm, 15 cm, 5 cm, 30 cm, 12 cm, 7 cm, 20 cm, 35 cm, dan 18 cm. Berapa nilai $\\text{RQD}$?',
    options: [
      { key: 'A', text: '$58\\%$' },
      { key: 'B', text: '$78\\%$' },
      { key: 'C', text: '$85\\%$' },
      { key: 'D', text: '$90\\%$' },
      { key: 'E', text: '$70\\%$' },
    ],
    correct_answer: 'B',
    explanation: 'Hanya potongan inti $\\geq 10$ cm yang dihitung.\n- **Memenuhi:** 25, 15, 30, 12, 20, 35, 18 cm\n- **Tidak memenuhi:** 8, 5, 7 cm\n$$\\begin{aligned} \\text{Jumlah} &= 25 + 15 + 30 + 12 + 20 + 35 + 18 = 155 \\text{ cm} \\\\ \\text{RQD} &= \\frac{155}{200} \\times 100\\% = 77{,}5\\% \\approx 78\\% \\end{aligned}$$\nNilai ini masuk kategori kualitas batuan **"baik"** ($75\\text{-}90\\%$).',
  },

  // ═══════════════════════════════════════════
  // T2: Geophysics (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'easy',
    content: 'Metode survei magnetik dalam eksplorasi mineral bekerja berdasarkan perbedaan sifat apa antar batuan?',
    options: [
      { key: 'A', text: 'Resistivitas listrik terhadap arus searah yang diinjeksikan' },
      { key: 'B', text: 'Densitas massa yang memengaruhi medan gravitasi lokal' },
      { key: 'C', text: 'Suseptibilitas magnetik terhadap medan magnet bumi' },
      { key: 'D', text: 'Kecepatan rambat gelombang seismik melalui lapisan batuan' },
      { key: 'E', text: 'Konduktivitas termal yang berkaitan dengan gradien geothermal' },
    ],
    correct_answer: 'C',
    explanation: 'Survei magnetik mengukur variasi medan magnet bumi yang disebabkan oleh perbedaan *suseptibilitas magnetik* antar batuan. Mineral seperti magnetit ($\\text{Fe}_3\\text{O}_4$) memiliki suseptibilitas tinggi sehingga menyebabkan anomali magnetik positif. Metode ini efektif untuk mendeteksi tubuh bijih yang mengandung mineral feromagnetik dan untuk memetakan struktur geologi bawah permukaan.',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Dalam survei gravitasi, anomali Bouguer negatif pada suatu area dapat mengindikasikan keberadaan apa di bawah permukaan?',
    options: [
      { key: 'A', text: 'Tubuh bijih sulfida masif dengan konsentrasi logam yang tinggi' },
      { key: 'B', text: 'Intrusi batuan beku basa seperti gabro atau peridotit' },
      { key: 'C', text: 'Deposit mineral magnetit dan hematit dalam jumlah besar' },
      { key: 'D', text: 'Zona mineralisasi sulfida yang tersebar secara intensif' },
      { key: 'E', text: 'Cekungan sedimen atau batuan berdensitas rendah seperti granit' },
    ],
    correct_answer: 'E',
    explanation: 'Anomali Bouguer negatif menunjukkan **defisit massa** di bawah permukaan, artinya terdapat material dengan densitas lebih rendah dari rata-rata sekitarnya.\n\nContoh material penyebab anomali negatif:\n- Cekungan sedimen (batupasir, batulempung)\n- Batuan granit ($\\rho \\approx 2{,}65$ g/cm³, lebih rendah dari batuan basa $\\rho \\approx 3{,}0$ g/cm³)\n- Rongga atau *void* bawah permukaan\n\nSebaliknya, anomali **positif** mengindikasikan material berdensitas tinggi seperti tubuh bijih masif.',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'easy',
    content: 'Metode elektromagnetik (EM) sangat efektif untuk mendeteksi tubuh bijih jenis apa?',
    options: [
      { key: 'A', text: 'Deposit laterit nikel yang berkembang di zona pelapukan permukaan' },
      { key: 'B', text: 'Deposit *placer* emas pada endapan aluvial di sepanjang sungai' },
      { key: 'C', text: 'Endapan *sandstone-hosted uranium* pada batuan sedimen klastik' },
      { key: 'D', text: 'Sulfida masif yang bersifat konduktif tinggi terhadap arus listrik' },
      { key: 'E', text: 'Deposit bauksit permukaan yang terbentuk dari pelapukan tropis' },
    ],
    correct_answer: 'D',
    explanation: 'Metode EM bekerja dengan menginduksi arus listrik di bawah permukaan dan mengukur medan elektromagnetik sekunder yang dihasilkan. Tubuh bijih sulfida masif (seperti pirit $\\text{FeS}_2$, kalkopirit $\\text{CuFeS}_2$, galena $\\text{PbS}$) memiliki **konduktivitas listrik** jauh lebih tinggi dari batuan samping, sehingga menghasilkan respons EM yang kuat. Metode ini menjadi salah satu teknik utama dalam eksplorasi deposit $\\text{VMS}$ (*Volcanogenic Massive Sulfide*).',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah stasiun survei gravitasi berada di ketinggian $h = 200$ m. Jika koreksi udara bebas (*free-air correction*) sebesar $+0{,}3086$ mGal/m, berapa nilai koreksi total untuk stasiun tersebut?',
    options: [
      { key: 'A', text: '$+30{,}86$ mGal' },
      { key: 'B', text: '$-30{,}86$ mGal' },
      { key: 'C', text: '$+61{,}72$ mGal' },
      { key: 'D', text: '$-61{,}72$ mGal' },
      { key: 'E', text: '$+92{,}58$ mGal' },
    ],
    correct_answer: 'C',
    explanation: 'Koreksi udara bebas mengoreksi efek ketinggian stasiun terhadap datum referensi.\n$$\\begin{aligned} \\text{FAC} &= +0{,}3086 \\times h \\\\ &= +0{,}3086 \\times 200 \\\\ &= +61{,}72 \\text{ mGal} \\end{aligned}$$\nNilai **positif** karena gravitasi berkurang seiring ketinggian ($g$ berbanding terbalik dengan $r^2$), sehingga koreksi harus **ditambahkan** untuk mengembalikan nilai ke datum.',
  },

  // ═══════════════════════════════════════════
  // T3: Geochemistry (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Dalam eksplorasi geokimia, metode *stream sediment sampling* paling efektif digunakan pada tahap apa?',
    options: [
      { key: 'A', text: 'Pengeboran detail untuk delineasi tubuh bijih di bawah permukaan' },
      { key: 'B', text: 'Studi kelayakan tekno-ekonomi menjelang konstruksi tambang' },
      { key: 'C', text: 'Eksplorasi regional (*reconnaissance*) pada area yang luas' },
      { key: 'D', text: 'Tahap produksi dan pengendalian mutu bijih harian di tambang' },
      { key: 'E', text: 'Estimasi cadangan akhir sebelum laporan sumber daya dipublikasikan' },
    ],
    correct_answer: 'C',
    explanation: '*Stream sediment sampling* (pengambilan sampel sedimen sungai) sangat efektif pada tahap eksplorasi regional karena satu sampel dapat mewakili **area tangkapan air** (*catchment area*) yang luas. Sedimen sungai merupakan komposit alami dari material batuan di sepanjang hulu, sehingga anomali geokimia dalam sedimen dapat mengindikasikan keberadaan mineralisasi di suatu DAS tanpa perlu menelusuri seluruh area secara detail.',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Analisis 200 sampel tanah menghasilkan rata-rata Au = 25 ppb dengan standar deviasi 15 ppb. Menggunakan *threshold* $\\bar{x} + 2\\sigma$, berapa batas bawah anomali emas?',
    options: [
      { key: 'A', text: '$40$ ppb' },
      { key: 'B', text: '$45$ ppb' },
      { key: 'C', text: '$50$ ppb' },
      { key: 'D', text: '$55$ ppb' },
      { key: 'E', text: '$70$ ppb' },
    ],
    correct_answer: 'D',
    explanation: '*Threshold* anomali dihitung:\n$$\\begin{aligned} \\text{Threshold} &= \\bar{x} + 2\\sigma \\\\ &= 25 + (2 \\times 15) \\\\ &= 25 + 30 = 55 \\text{ ppb} \\end{aligned}$$\nSampel dengan kadar $\\text{Au} \\geq 55$ ppb dianggap anomali dan layak ditindaklanjuti. Metode $\\bar{x} + 2\\sigma$ umum digunakan karena secara statistik hanya $\\sim 2{,}3\\%$ data yang melebihi nilai ini pada distribusi normal, sehingga efektif menyaring *noise* dari sinyal anomali yang signifikan.',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Teknik *fire assay* merupakan metode standar industri untuk analisis unsur apa dalam sampel batuan?',
    options: [
      { key: 'A', text: 'Emas dan perak melalui peleburan dengan *flux* timbal' },
      { key: 'B', text: 'Besi dan mangan menggunakan titrasi permanganometri di lab' },
      { key: 'C', text: 'Silika dan alumina melalui analisis gravimetri presipitasi' },
      { key: 'D', text: 'Tembaga dan seng menggunakan spektrofotometri serapan atom' },
      { key: 'E', text: 'Nikel dan kobalt melalui proses pelindian asam di autoklaf' },
    ],
    correct_answer: 'A',
    explanation: '*Fire assay* adalah metode analitik klasik yang menjadi standar industri untuk penentuan kadar **emas** ($\\text{Au}$) dan **perak** ($\\text{Ag}$). Prosesnya meliputi:\n1. Peleburan sampel (30-50 g) dengan *flux* (campuran $\\text{PbO}$, soda, boraks)\n2. Pengumpulan logam mulia dalam *lead button*\n3. Kupelasi untuk memisahkan $\\text{Au/Ag}$ dari $\\text{Pb}$\n4. Penimbangan akhir atau analisis ICP\n\nUkuran sampel yang besar (30-50 g) efektif mengurangi *nugget effect* yang umum pada deposit emas.',
  },

  // ═══════════════════════════════════════════
  // T4: Remote Sensing & GIS (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 12,
    category: 'T4',
    difficulty: 'easy',
    content: 'Dalam penginderaan jauh, band $\\text{SWIR}$ (*Short-Wave Infrared*) pada citra satelit sangat berguna untuk mengidentifikasi apa?',
    options: [
      { key: 'A', text: 'Kedalaman kolom air laut dan topografi dasar perairan dangkal' },
      { key: 'B', text: 'Mineral alterasi hidrotermal seperti lempung dan oksida besi' },
      { key: 'C', text: 'Suhu permukaan laut secara akurat untuk pemodelan iklim regional' },
      { key: 'D', text: 'Ketebalan dan distribusi lapisan ozon di atmosfer bagian atas' },
      { key: 'E', text: 'Konsentrasi klorofil dan tingkat produktivitas primer perairan' },
    ],
    correct_answer: 'B',
    explanation: 'Band $\\text{SWIR}$ ($1{,}0$-$2{,}5$ $\\mu$m) sensitif terhadap fitur absorpsi mineral yang mengandung gugus $\\text{OH}^-$ dan $\\text{CO}_3^{2-}$, khas pada mineral alterasi hidrotermal seperti kaolinit, ilit, serisit, dan klorit. Mineral oksida besi juga terdeteksi pada band $\\text{VNIR}$-$\\text{SWIR}$. Hal ini menjadikan $\\text{SWIR}$ sangat berharga untuk memetakan zona alterasi yang sering berasosiasi dengan sistem mineralisasi emas-tembaga porfiri dan epitermal.',
  },
  {
    order_index: 13,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa keunggulan utama teknologi $\\text{LiDAR}$ dibandingkan fotografi udara konvensional untuk pemetaan eksplorasi di area berhutan lebat?',
    options: [
      { key: 'A', text: 'Biaya survei per kilometer persegi jauh lebih murah dan efisien' },
      { key: 'B', text: 'Resolusi spektral dan warna yang lebih tinggi untuk klasifikasi vegetasi' },
      { key: 'C', text: 'Tidak memerlukan wahana terbang karena menggunakan sensor terestrial' },
      { key: 'D', text: 'Dapat mengukur kadar mineral di permukaan batuan secara langsung' },
      { key: 'E', text: 'Mampu menembus kanopi hutan dan menghasilkan model permukaan tanah' },
    ],
    correct_answer: 'E',
    explanation: '$\\text{LiDAR}$ (*Light Detection and Ranging*) menembakkan pulsa laser yang mampu menembus celah kanopi vegetasi dan memantul dari permukaan tanah. Dengan memfilter *first return* (kanopi) dan *last return* (tanah), $\\text{LiDAR}$ menghasilkan **DTM** (*Digital Terrain Model*) yang akurat meskipun area tertutup hutan lebat. Ini memungkinkan identifikasi fitur geomorfologi halus seperti sesar, *lineament*, dan bekas aktivitas penambangan kuno yang tersembunyi di balik vegetasi.',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Dalam GIS, analisis *overlay* spasial pada eksplorasi mineral bertujuan untuk apa?',
    options: [
      { key: 'A', text: 'Menghitung volume bijih secara presisi untuk laporan cadangan final' },
      { key: 'B', text: 'Menggantikan kebutuhan pengeboran eksplorasi di tahap awal proyek' },
      { key: 'C', text: 'Mengintegrasikan beberapa *layer* data untuk menentukan area prospektif' },
      { key: 'D', text: 'Mengukur kecepatan gelombang seismik dari data lapangan secara otomatis' },
      { key: 'E', text: 'Menganalisis komposisi kimia batuan dari data penginderaan jauh saja' },
    ],
    correct_answer: 'C',
    explanation: 'Analisis *overlay* spasial dalam GIS mengombinasikan beberapa *layer* data seperti peta geologi, anomali geokimia, anomali geofisika, dan data penginderaan jauh. Dengan menetapkan **bobot dan kriteria** pada setiap *layer*, area yang memiliki konvergensi anomali tinggi dari berbagai *dataset* diidentifikasi sebagai **zona target prospektif**. Pendekatan ini dikenal sebagai *mineral prospectivity mapping*.',
  },

  // ═══════════════════════════════════════════
  // T5: Resource Modeling & Estimation (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 15,
    category: 'T5',
    difficulty: 'medium',
    content: 'Dalam klasifikasi sumber daya mineral menurut standar JORC, apa yang membedakan kategori *Indicated* dari *Inferred*?',
    options: [
      { key: 'A', text: '*Indicated* hanya berdasarkan data penginderaan jauh dan pemetaan permukaan' },
      { key: 'B', text: '*Inferred* justru memiliki tingkat kepercayaan geologis yang lebih tinggi' },
      { key: 'C', text: 'Tidak ada perbedaan signifikan antara kedua kategori dalam praktiknya' },
      { key: 'D', text: '*Indicated* memiliki spasi data lebih rapat sehingga kontinuitas geologi dapat diasumsikan' },
      { key: 'E', text: '*Indicated* sama sekali tidak memerlukan data pengeboran untuk ditetapkan' },
    ],
    correct_answer: 'D',
    explanation: 'Menurut **JORC Code**, perbedaan utama kedua kategori:\n- ***Indicated:*** data geologi dan *sampling* dengan spasi cukup rapat, kontinuitas geologi dan kadar dapat **diasumsikan secara wajar** (*reasonable assumption*)\n- ***Inferred:*** data terbatas dengan spasi lebar, kontinuitas hanya dapat **diduga** (*implied*)\n\nPerbedaan ini kritis karena hanya *Indicated* dan *Measured* yang boleh dikonversi menjadi **cadangan** (*reserve*) untuk studi kelayakan.',
  },
  {
    order_index: 16,
    category: 'T5',
    difficulty: 'medium',
    content: 'Sebuah blok model berdimensi $50 \\times 50 \\times 10$ m dengan densitas bijih $\\rho = 2{,}8$ t/m³ dan kadar $\\text{Cu} = 1{,}2\\%$. Berapa tonase bijih dan logam terkandung?',
    options: [
      { key: 'A', text: '70.000 ton bijih, 840 ton Cu' },
      { key: 'B', text: '25.000 ton bijih, 300 ton Cu' },
      { key: 'C', text: '140.000 ton bijih, 1.680 ton Cu' },
      { key: 'D', text: '50.000 ton bijih, 600 ton Cu' },
      { key: 'E', text: '35.000 ton bijih, 420 ton Cu' },
    ],
    correct_answer: 'A',
    explanation: 'Perhitungan tonase dan logam terkandung:\n$$\\begin{aligned} V &= 50 \\times 50 \\times 10 = 25.000 \\text{ m}^3 \\\\ T &= V \\times \\rho = 25.000 \\times 2{,}8 = 70.000 \\text{ ton} \\\\ \\text{Cu} &= T \\times \\text{kadar} = 70.000 \\times 0{,}012 = 840 \\text{ ton} \\end{aligned}$$\nPerhitungan ini adalah dasar estimasi sumber daya menggunakan metode *block model*, di mana setiap blok diberi nilai tonase dan kadar berdasarkan interpolasi data pengeboran.',
  },
  {
    order_index: 17,
    category: 'T5',
    difficulty: 'medium',
    content: 'Dalam geostatistik, variogram digunakan untuk mengukur apa?',
    options: [
      { key: 'A', text: 'Rata-rata kadar mineral secara global di seluruh area deposit' },
      { key: 'B', text: 'Volume total cadangan bijih yang layak ditambang secara ekonomis' },
      { key: 'C', text: 'Variabilitas spasial kadar sebagai fungsi jarak antar sampel' },
      { key: 'D', text: 'Kedalaman optimal pengeboran berikutnya untuk *infill drilling*' },
      { key: 'E', text: 'Biaya eksplorasi per meter bor berdasarkan tipe batuan yang ditembus' },
    ],
    correct_answer: 'C',
    explanation: '**Variogram** (atau semivariogram) mengukur bagaimana variabilitas kadar berubah sebagai fungsi jarak $h$ antar sampel.\n$$\\gamma(h) = \\frac{1}{2N(h)} \\sum_{i=1}^{N(h)} [Z(x_i) - Z(x_i + h)]^2$$\nKomponen utama variogram:\n- **Nugget** ($C_0$): variabilitas pada jarak nol\n- **Sill** ($C_0 + C$): variabilitas maksimum (varians total)\n- **Range** ($a$): jarak di mana sampel tidak lagi berkorelasi spasial\n\nVariogram menjadi dasar interpolasi **kriging**, metode estimasi yang memberikan bobot optimal pada setiap sampel.',
  },

  // ═══════════════════════════════════════════
  // T6: Exploration Drilling (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 18,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa keunggulan utama pengeboran inti (*diamond core drilling*) dibandingkan metode $\\text{RC}$ (*Reverse Circulation*)?',
    options: [
      { key: 'A', text: 'Biaya operasional per meter pengeboran jauh lebih murah dan hemat waktu' },
      { key: 'B', text: 'Menghasilkan inti batuan utuh untuk observasi geologi secara detail' },
      { key: 'C', text: 'Kecepatan penetrasi batuan yang lebih tinggi di semua jenis formasi' },
      { key: 'D', text: 'Tidak memerlukan air atau fluida sirkulasi selama proses pengeboran' },
      { key: 'E', text: 'Hanya cocok digunakan untuk pengeboran pada batuan lunak saja' },
    ],
    correct_answer: 'B',
    explanation: '*Diamond core drilling* menghasilkan silinder batuan utuh (inti bor) yang memungkinkan observasi geologi detail termasuk tekstur, struktur, alterasi, mineralisasi, dan hubungan kontak antar litologi. Inti bor juga memungkinkan **pengukuran orientasi struktur** dan **pengujian geoteknik**. Meskipun lebih mahal dan lambat dari $\\text{RC}$ *drilling*, kualitas informasi geologi yang diperoleh jauh lebih tinggi.',
  },
  {
    order_index: 19,
    category: 'T6',
    difficulty: 'easy',
    content: 'Dalam perencanaan pengeboran eksplorasi, *azimuth* $270°$ dan inklinasi $-60°$ berarti lubang bor diarahkan ke mana?',
    options: [
      { key: 'A', text: 'Ke arah timur dengan kemiringan $60°$ dari bidang horizontal' },
      { key: 'B', text: 'Ke arah utara dengan kemiringan $30°$ dari bidang horizontal' },
      { key: 'C', text: 'Tegak lurus vertikal ke bawah tanpa arah kompas tertentu' },
      { key: 'D', text: 'Ke arah selatan dengan kemiringan $60°$ dari bidang horizontal' },
      { key: 'E', text: 'Ke arah barat dengan kemiringan $60°$ dari bidang horizontal' },
    ],
    correct_answer: 'E',
    explanation: 'Interpretasi parameter arah lubang bor:\n- **Azimuth $270°$** = arah **barat** (utara = $0°/360°$, timur = $90°$, selatan = $180°$, barat = $270°$)\n- **Inklinasi $-60°$** = lubang bor miring $60°$ dari bidang horizontal ke bawah (tanda negatif = ke bawah)\n\nJadi lubang bor mengarah ke **barat** dengan sudut $60°$ dari horizontal. Perencanaan arah dan sudut bor penting agar lubang bor memotong target mineralisasi secara **tegak lurus** untuk mendapatkan interseksi yang representatif.',
  },
  {
    order_index: 20,
    category: 'T6',
    difficulty: 'medium',
    content: 'Sebuah lubang bor vertikal menembus zona mineralisasi sepanjang 8 meter. Jika *true dip* zona tersebut $45°$ dan lubang bor tegak lurus terhadap *strike*, berapa *true thickness*-nya?',
    options: [
      { key: 'A', text: '$4{,}0$ m' },
      { key: 'B', text: '$5{,}7$ m' },
      { key: 'C', text: '$6{,}9$ m' },
      { key: 'D', text: '$8{,}0$ m' },
      { key: 'E', text: '$11{,}3$ m' },
    ],
    correct_answer: 'B',
    explanation: 'Untuk lubang bor vertikal yang memotong zona miring:\n$$\\begin{aligned} t_{\\text{true}} &= t_{\\text{apparent}} \\times \\sin(\\alpha) \\\\ &= 8 \\times \\sin(45°) \\\\ &= 8 \\times 0{,}7071 \\\\ &= 5{,}66 \\text{ m} \\approx 5{,}7 \\text{ m} \\end{aligned}$$\ndi mana $\\alpha$ = *true dip* zona mineralisasi.\n\n**Penting:** *Apparent thickness* selalu **lebih tebal** dari *true thickness* kecuali lubang bor memotong zona secara tegak lurus terhadap bidang mineralisasi.',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await supabase
    .from('packages')
    .select('id, name, slug')
    .eq('slug', 'antam-exploration')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-exploration tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal: ${questions.length}\n`)

  // Hapus soal lama
  const { count: existing } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)

  if (existing && existing > 0) {
    console.log(`Menghapus ${existing} soal lama...`)
    await supabase.from('questions').delete().eq('package_id', pkg.id)
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

  const { data, error } = await supabase
    .from('questions')
    .insert(rows)
    .select('id, order_index, category, difficulty')

  if (error) {
    console.error('Gagal insert soal:', error)
    process.exit(1)
  }

  console.log(`✅ Berhasil insert ${data.length} soal:\n`)

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

  console.log(`\n   Total: ${data.length} soal`)
}

main()
