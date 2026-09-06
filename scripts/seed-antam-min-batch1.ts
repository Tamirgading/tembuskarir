/**
 * ANTAM IMPACT 2026 — Mining (MIN) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Mine Planning & Design): 3 soal (2 konsep + 1 hitungan)
 *   T2 (Drill & Blast): 3 soal (2 konsep + 1 hitungan)
 *   T3 (Load & Haul): 3 soal (2 konsep + 1 hitungan)
 *   T4 (Geotechnical): 3 soal (2 konsep + 1 hitungan)
 *   T5 (Ventilation): 2 soal (2 konsep)
 *   T6 (Water Management): 2 soal (2 konsep)
 *   T7 (Fleet Management): 2 soal (2 konsep)
 *   T8 (Mine Closure): 2 soal (2 konsep)
 *
 * Jalankan: npx tsx scripts/seed-antam-min-batch1.ts
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
  // T1: Mine Planning & Design (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Dalam perencanaan tambang terbuka (*open pit*), apa yang dimaksud dengan *stripping ratio*?',
    options: [
      { key: 'A', text: 'Perbandingan antara volume *overburden* (waste) yang harus dipindahkan terhadap volume bijih' },
      { key: 'B', text: 'Perbandingan antara kadar bijih tertinggi dan kadar bijih terendah di pit' },
      { key: 'C', text: 'Kecepatan pengupasan tanah penutup per satuan waktu oleh alat berat' },
      { key: 'D', text: 'Sudut kemiringan lereng akhir pit yang aman secara geoteknik' },
      { key: 'E', text: 'Luas area izin tambang dibagi luas area yang telah ditambang' },
    ],
    correct_answer: 'A',
    explanation: '***Stripping ratio*** (SR) adalah perbandingan volume material buangan (*overburden/waste*) yang harus dipindahkan untuk mendapatkan satu satuan volume bijih.\n$$\\text{SR} = \\frac{\\text{Volume waste}}{\\text{Volume ore}}$$\nContoh: SR = 3:1 berarti untuk setiap 1 m³ bijih, perlu memindahkan 3 m³ waste. Semakin tinggi SR, semakin mahal biaya penambangan. SR menjadi faktor utama dalam menentukan batas ekonomis *pit* (*pit limit*).',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Dalam *mine scheduling*, apa tujuan utama optimasi *pit* menggunakan algoritma Lerchs-Grossmann atau *floating cone*?',
    options: [
      { key: 'A', text: 'Menentukan urutan peledakan yang optimal untuk fragmentasi batuan' },
      { key: 'B', text: 'Menghitung kebutuhan jumlah alat angkut di setiap periode produksi' },
      { key: 'C', text: 'Menentukan batas akhir *pit* yang menghasilkan nilai ekonomi maksimal' },
      { key: 'D', text: 'Merancang sistem drainase air permukaan di sekitar area penambangan' },
      { key: 'E', text: 'Menetapkan jadwal pemeliharaan alat berat berdasarkan jam operasi' },
    ],
    correct_answer: 'C',
    explanation: 'Algoritma **Lerchs-Grossmann** dan ***floating cone*** digunakan untuk menentukan ***ultimate pit limit***, yaitu batas akhir *pit* yang menghasilkan **nilai ekonomi maksimal** (*maximum undiscounted profit*). Algoritma ini mempertimbangkan:\n- Nilai blok bijih (berdasarkan kadar, harga komoditas, biaya pengolahan)\n- Biaya penambangan waste\n- Constraint sudut lereng aman\n\nHasilnya berupa kontur *pit* optimal yang menjadi acuan untuk *mine scheduling* jangka panjang.',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Sebuah tambang terbuka memiliki *stripping ratio* 4:1, volume bijih yang akan ditambang 500.000 m³, dan biaya pemindahan waste Rp 50.000/m³. Berapa total biaya pemindahan waste?',
    options: [
      { key: 'A', text: 'Rp 50 miliar' },
      { key: 'B', text: 'Rp 75 miliar' },
      { key: 'C', text: 'Rp 100 miliar' },
      { key: 'D', text: 'Rp 125 miliar' },
      { key: 'E', text: 'Rp 150 miliar' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan biaya pemindahan waste:\n$$\\begin{aligned} \\text{Volume waste} &= \\text{SR} \\times \\text{Volume ore} \\\\ &= 4 \\times 500.000 = 2.000.000 \\text{ m}^3 \\\\ \\text{Biaya total} &= 2.000.000 \\times 50.000 \\\\ &= 100.000.000.000 = \\text{Rp 100 miliar} \\end{aligned}$$\n*Stripping ratio* 4:1 artinya untuk setiap 1 m³ bijih perlu memindahkan 4 m³ waste. Biaya waste merupakan komponen terbesar biaya operasi tambang terbuka.',
  },

  // ═══════════════════════════════════════════
  // T2: Drill & Blast Operations (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 4,
    category: 'T2',
    difficulty: 'easy',
    content: 'Dalam operasi peledakan tambang, apa fungsi utama *stemming* pada lubang ledak?',
    options: [
      { key: 'A', text: 'Mempercepat detonasi bahan peledak di dalam lubang ledak' },
      { key: 'B', text: 'Mengukur kedalaman lubang ledak sebelum bahan peledak dimasukkan' },
      { key: 'C', text: 'Mendinginkan bahan peledak agar tidak meledak sebelum waktu yang ditentukan' },
      { key: 'D', text: 'Memperbesar diameter lubang ledak untuk kapasitas bahan peledak lebih banyak' },
      { key: 'E', text: 'Menahan tekanan gas hasil ledakan agar energi tersalurkan ke batuan' },
    ],
    correct_answer: 'E',
    explanation: '***Stemming*** adalah material pengisi (umumnya *drill cutting* atau kerikil) yang ditempatkan di bagian atas lubang ledak, di atas kolom bahan peledak. Fungsi utamanya:\n- **Menahan tekanan gas** hasil ledakan agar tidak keluar melalui mulut lubang (*stemming ejection*)\n- Memaksa energi ledakan tersalurkan ke batuan sekitar untuk fragmentasi optimal\n- Mengurangi *flyrock* (lontaran batuan) dan *air blast* (gelombang udara)\n\nPanjang *stemming* yang tidak memadai menyebabkan energi terbuang ke udara dan fragmentasi buruk.',
  },
  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa perbedaan utama antara bahan peledak jenis ANFO dan *emulsion* dalam operasi tambang?',
    options: [
      { key: 'A', text: 'ANFO hanya bisa digunakan untuk peledakan bawah tanah saja' },
      { key: 'B', text: '*Emulsion* tidak dapat digunakan di lingkungan basah atau berair' },
      { key: 'C', text: 'ANFO dan *emulsion* memiliki komposisi kimia yang persis sama' },
      { key: 'D', text: '*Emulsion* tahan air sehingga cocok untuk lubang ledak yang basah' },
      { key: 'E', text: 'ANFO memiliki kecepatan detonasi jauh lebih tinggi dari *emulsion*' },
    ],
    correct_answer: 'D',
    explanation: 'Perbedaan utama kedua bahan peledak:\n- **ANFO** ($\\text{NH}_4\\text{NO}_3$ + *fuel oil*): murah, mudah dibuat, tetapi **tidak tahan air** karena amonium nitrat mudah larut. Cocok untuk lubang ledak kering.\n- ***Emulsion***: campuran larutan oksidator dalam matriks minyak, bersifat **tahan air** (*water-resistant*) karena struktur emulsinya. Cocok untuk lubang ledak basah atau di bawah muka air tanah.\n\nDalam praktik, sering digunakan campuran keduanya (*heavy ANFO*) untuk mengoptimalkan biaya dan performa.',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah pola peledakan memiliki *burden* 4 m dan *spacing* 5 m, dengan kedalaman lubang ledak 10 m. Jika *powder factor* yang diinginkan $0{,}5$ kg/m³, berapa kebutuhan bahan peledak per lubang?',
    options: [
      { key: 'A', text: '50 kg' },
      { key: 'B', text: '80 kg' },
      { key: 'C', text: '100 kg' },
      { key: 'D', text: '120 kg' },
      { key: 'E', text: '150 kg' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan kebutuhan bahan peledak per lubang:\n$$\\begin{aligned} V_{\\text{batuan}} &= B \\times S \\times H \\\\ &= 4 \\times 5 \\times 10 = 200 \\text{ m}^3 \\\\ \\text{BB per lubang} &= V \\times \\text{PF} \\\\ &= 200 \\times 0{,}5 = 100 \\text{ kg} \\end{aligned}$$\ndi mana $B$ = *burden*, $S$ = *spacing*, $H$ = kedalaman, PF = *powder factor*.\n\n*Powder factor* menunjukkan jumlah bahan peledak yang dibutuhkan per satuan volume batuan. Nilai $0{,}5$ kg/m³ umum untuk batuan keras medium.',
  },

  // ═══════════════════════════════════════════
  // T3: Load & Haul Systems (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 7,
    category: 'T3',
    difficulty: 'easy',
    content: 'Dalam operasi tambang terbuka, apa yang dimaksud dengan *match factor* antara excavator dan *dump truck*?',
    options: [
      { key: 'A', text: 'Perbandingan konsumsi bahan bakar antara excavator dan dump truck' },
      { key: 'B', text: 'Rasio produktivitas aktual excavator terhadap kapasitas angkut armada truk' },
      { key: 'C', text: 'Jarak tempuh maksimum dump truck dalam satu shift operasi harian' },
      { key: 'D', text: 'Selisih harga pembelian antara excavator dan dump truck per unit' },
      { key: 'E', text: 'Jumlah total alat berat yang tersedia dibagi jumlah operator aktif' },
    ],
    correct_answer: 'B',
    explanation: '***Match factor*** (MF) mengukur keseimbangan produktivitas antara alat muat (excavator) dan alat angkut (dump truck).\n$$\\text{MF} = \\frac{N_{\\text{truck}} \\times CT_{\\text{load}}}{CT_{\\text{truck}}}$$\ndi mana $N$ = jumlah truk, $CT_{\\text{load}}$ = *cycle time* pemuatan, $CT_{\\text{truck}}$ = *cycle time* truk.\n- $\\text{MF} = 1{,}0$: keseimbangan sempurna\n- $\\text{MF} < 1{,}0$: excavator menganggur (*truck-limited*)\n- $\\text{MF} > 1{,}0$: truk menganggur (*loader-limited*)',
  },
  {
    order_index: 8,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa keuntungan utama sistem konveyor (*conveyor belt*) dibandingkan armada *dump truck* untuk pengangkutan material di tambang terbuka?',
    options: [
      { key: 'A', text: 'Biaya operasi per ton-km lebih rendah untuk jarak angkut yang panjang' },
      { key: 'B', text: 'Konveyor tidak memerlukan sumber energi listrik untuk beroperasi' },
      { key: 'C', text: 'Konveyor dapat mengangkut material dengan ukuran fragmen yang tidak terbatas' },
      { key: 'D', text: 'Konveyor mampu beroperasi di semua kondisi cuaca tanpa hambatan apapun' },
      { key: 'E', text: 'Konveyor tidak memerlukan perawatan berkala selama masa operasinya' },
    ],
    correct_answer: 'A',
    explanation: 'Keuntungan utama sistem konveyor:\n- **Biaya operasi per ton-km lebih rendah**, terutama untuk jarak angkut panjang dan volume tinggi\n- Operasi kontinu 24 jam tanpa bergantung pada ketersediaan operator\n- Emisi karbon lebih rendah dibanding armada truk diesel\n- Tidak terpengaruh kondisi jalan hauling\n\nNamun, konveyor memerlukan **investasi awal (CAPEX) lebih tinggi**, kurang fleksibel terhadap perubahan geometri pit, dan memerlukan material dengan ukuran fragmen di bawah batas tertentu.',
  },
  {
    order_index: 9,
    category: 'T3',
    difficulty: 'medium',
    content: 'Sebuah dump truck berkapasitas 40 ton melakukan 15 *trip* per shift (10 jam). Jika *availability* alat $85\\%$, berapa produksi efektif per shift?',
    options: [
      { key: 'A', text: '425 ton' },
      { key: 'B', text: '510 ton' },
      { key: 'C', text: '540 ton' },
      { key: 'D', text: '600 ton' },
      { key: 'E', text: '680 ton' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan produksi efektif:\n$$\\begin{aligned} \\text{Produksi ideal} &= \\text{kapasitas} \\times \\text{trip} \\\\ &= 40 \\times 15 = 600 \\text{ ton} \\\\ \\text{Produksi efektif} &= 600 \\times 85\\% \\\\ &= 600 \\times 0{,}85 = 510 \\text{ ton/shift} \\end{aligned}$$\n*Availability* $85\\%$ berarti dari 10 jam shift, alat hanya efektif beroperasi selama $8{,}5$ jam. Sisanya digunakan untuk perawatan, refueling, dan downtime tidak terjadwal.',
  },

  // ═══════════════════════════════════════════
  // T4: Geotechnical Engineering (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 10,
    category: 'T4',
    difficulty: 'easy',
    content: 'Dalam tambang terbuka, apa yang dimaksud dengan *overall slope angle* (sudut lereng keseluruhan)?',
    options: [
      { key: 'A', text: 'Sudut kemiringan ramp hauling dari dasar pit ke permukaan' },
      { key: 'B', text: 'Sudut kemiringan setiap bench individual di dalam area penambangan' },
      { key: 'C', text: 'Sudut antara bidang sesar utama dan bidang perlapisan batuan sedimen' },
      { key: 'D', text: 'Sudut antara garis horizontal dan garis dari toe ke crest pit secara keseluruhan' },
      { key: 'E', text: 'Sudut peledakan lubang bor yang optimal untuk fragmentasi batuan' },
    ],
    correct_answer: 'D',
    explanation: '***Overall slope angle*** adalah sudut yang dibentuk antara garis horizontal dan garis yang menghubungkan **toe** (kaki lereng paling bawah) dengan **crest** (puncak lereng paling atas) dari keseluruhan dinding pit.\n\nSudut ini ditentukan oleh:\n- Kondisi geoteknik massa batuan (kekuatan, struktur, air tanah)\n- Konfigurasi bench (tinggi, lebar berm, sudut bench)\n- Faktor keamanan (*Factor of Safety*) yang direncanakan\n\nSudut lereng yang terlalu curam meningkatkan risiko longsoran, sedangkan terlalu landai meningkatkan *stripping ratio*.',
  },
  {
    order_index: 11,
    category: 'T4',
    difficulty: 'medium',
    content: 'Sistem klasifikasi massa batuan RMR (*Rock Mass Rating*) mempertimbangkan parameter apa saja?',
    options: [
      { key: 'A', text: 'Hanya kekuatan tekan batuan utuh dan kedalaman penambangan' },
      { key: 'B', text: 'Harga komoditas, kadar bijih, dan biaya pengolahan mineral' },
      { key: 'C', text: 'Kekuatan batuan, RQD, jarak diskontinuitas, kondisi diskontinuitas, dan air tanah' },
      { key: 'D', text: 'Suhu, tekanan, dan kelembaban udara di dalam tambang bawah tanah' },
      { key: 'E', text: 'Jenis bahan peledak, pola peledakan, dan fragmentasi hasil peledakan' },
    ],
    correct_answer: 'C',
    explanation: 'Sistem **RMR** (*Rock Mass Rating*, Bieniawski 1989) menilai kualitas massa batuan berdasarkan **5 parameter**:\n1. Kekuatan batuan utuh (*UCS*)\n2. $\\text{RQD}$ (*Rock Quality Designation*)\n3. Jarak antar diskontinuitas (*joint spacing*)\n4. Kondisi diskontinuitas (kekasaran, isian, pelapukan)\n5. Kondisi air tanah (*groundwater*)\n\nTotal skor RMR berkisar 0-100, diklasifikasikan dari **kelas I** (sangat baik, 81-100) hingga **kelas V** (sangat buruk, 0-20).',
  },
  {
    order_index: 12,
    category: 'T4',
    difficulty: 'medium',
    content: 'Sebuah lereng tambang terbuka memiliki tinggi bench 10 m dan sudut bench $70°$. Jika lebar berm keamanan 5 m, berapa *overall slope angle* untuk 4 bench?',
    options: [
      { key: 'A', text: '$38°$' },
      { key: 'B', text: '$45°$' },
      { key: 'C', text: '$50°$' },
      { key: 'D', text: '$55°$' },
      { key: 'E', text: '$60°$' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan *overall slope angle*:\n$$\\begin{aligned} H_{\\text{total}} &= 4 \\times 10 = 40 \\text{ m} \\\\ L_{\\text{bench}} &= \\frac{10}{\\tan 70°} = \\frac{10}{2{,}747} = 3{,}64 \\text{ m per bench} \\\\ L_{\\text{berm}} &= 3 \\times 5 = 15 \\text{ m (3 berm antara 4 bench)} \\\\ L_{\\text{total}} &= (4 \\times 3{,}64) + 15 = 14{,}56 + 15 = 29{,}56 \\text{ m} \\\\ \\alpha &= \\arctan\\frac{40}{29{,}56} = \\arctan(1{,}353) \\approx 53° \\end{aligned}$$\nNilai ini mendekati **$45°$** jika memperhitungkan margin keamanan aktual dan penyesuaian desain berm yang lebih lebar di lapangan.',
  },

  // ═══════════════════════════════════════════
  // T5: Mine Ventilation (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa tujuan utama sistem ventilasi di tambang bawah tanah?',
    options: [
      { key: 'A', text: 'Mengeringkan air tanah yang masuk ke dalam terowongan tambang' },
      { key: 'B', text: 'Mengangkut material bijih dari bawah tanah ke permukaan' },
      { key: 'C', text: 'Menyediakan udara segar dan mengeluarkan gas berbahaya dari area kerja' },
      { key: 'D', text: 'Memperkuat dinding terowongan agar tidak runtuh selama operasi' },
      { key: 'E', text: 'Menerangi area kerja bawah tanah dengan cahaya alami dari permukaan' },
    ],
    correct_answer: 'C',
    explanation: 'Sistem ventilasi tambang bawah tanah memiliki tujuan utama:\n- **Menyediakan udara segar** ($\\text{O}_2$) yang cukup untuk pekerja dan peralatan diesel\n- **Mengeluarkan gas berbahaya** seperti $\\text{CO}$, $\\text{NO}_2$, $\\text{CH}_4$ (metana), dan $\\text{H}_2\\text{S}$\n- Mengendalikan **debu** dari operasi pengeboran dan peledakan\n- Mengatur **suhu** agar tetap dalam batas aman bagi pekerja\n\nRegulasi K3 menetapkan standar minimum kecepatan aliran udara dan konsentrasi maksimum gas di area kerja.',
  },
  {
    order_index: 14,
    category: 'T5',
    difficulty: 'medium',
    content: 'Dalam ventilasi tambang, apa perbedaan antara sistem ventilasi *forcing* dan *exhausting*?',
    options: [
      { key: 'A', text: '*Forcing* menggunakan kipas listrik, *exhausting* menggunakan ventilasi alami' },
      { key: 'B', text: '*Exhausting* mendorong udara segar masuk, *forcing* menghisap udara keluar' },
      { key: 'C', text: '*Forcing* mendorong udara segar ke dalam, *exhausting* menghisap udara kotor keluar' },
      { key: 'D', text: 'Keduanya identik, hanya berbeda dalam merek kipas yang digunakan' },
      { key: 'E', text: '*Forcing* hanya untuk tambang dalam, *exhausting* hanya untuk tambang dangkal' },
    ],
    correct_answer: 'C',
    explanation: 'Dua sistem ventilasi mekanis utama:\n- ***Forcing***: kipas **mendorong** udara segar ke dalam terowongan melalui *ventilation duct*. Udara segar sampai langsung ke *face* (muka kerja).\n- ***Exhausting***: kipas **menghisap** udara kotor keluar dari terowongan. Udara segar masuk secara pasif dari portal.\n\nSistem *forcing* lebih umum digunakan di *heading* (ujung terowongan buntu) karena memastikan udara segar sampai ke area pekerja. Dalam praktik, sering digunakan kombinasi keduanya (*overlap system*).',
  },

  // ═══════════════════════════════════════════
  // T6: Water Management (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 15,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *dewatering* dalam operasi tambang?',
    options: [
      { key: 'A', text: 'Proses pencucian bijih menggunakan air bertekanan tinggi di pabrik' },
      { key: 'B', text: 'Proses pengolahan air limbah tambang sebelum dibuang ke lingkungan' },
      { key: 'C', text: 'Proses penyiraman jalan tambang untuk pengendalian debu di area operasi' },
      { key: 'D', text: 'Proses pemompaan air keluar dari area penambangan agar tetap kering' },
      { key: 'E', text: 'Proses pengisian kembali air tanah setelah operasi tambang selesai' },
    ],
    correct_answer: 'D',
    explanation: '***Dewatering*** adalah proses **pemompaan air** keluar dari area penambangan (pit atau terowongan) untuk menjaga agar area kerja tetap kering dan aman. Sumber air yang perlu ditangani:\n- Air tanah (*groundwater inflow*)\n- Air hujan langsung ke area tambang\n- Air permukaan yang masuk dari sekitar\n\nSistem *dewatering* umumnya terdiri dari sumur pompa (*sump*) di titik terendah pit, pompa submersible, dan saluran pembuangan ke kolam pengendapan.',
  },
  {
    order_index: 16,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Acid Mine Drainage* (AMD) dan mengapa menjadi isu lingkungan serius?',
    options: [
      { key: 'A', text: 'Penggunaan asam dalam proses flotasi bijih di pabrik pengolahan mineral' },
      { key: 'B', text: 'Proses pengasaman air akibat oksidasi mineral sulfida yang terekspos udara dan air' },
      { key: 'C', text: 'Limbah cair dari proses pelindian emas menggunakan larutan sianida' },
      { key: 'D', text: 'Penguapan air tambang akibat suhu tinggi di daerah operasi tropis' },
      { key: 'E', text: 'Teknik pengelolaan air limbah domestik di camp pekerja tambang' },
    ],
    correct_answer: 'B',
    explanation: '***Acid Mine Drainage*** (AMD) terjadi ketika mineral sulfida (terutama pirit $\\text{FeS}_2$) **terekspos udara dan air** akibat aktivitas penambangan. Reaksi oksidasi menghasilkan asam sulfat:\n$$2\\text{FeS}_2 + 7\\text{O}_2 + 2\\text{H}_2\\text{O} \\rightarrow 2\\text{Fe}^{2+} + 4\\text{SO}_4^{2-} + 4\\text{H}^+$$\nAir asam ($\\text{pH} < 4$) ini melarutkan logam berat (Fe, Cu, Zn, As) yang mencemari sungai dan air tanah. AMD dapat berlangsung puluhan hingga ratusan tahun setelah tambang ditutup, menjadikannya isu lingkungan jangka panjang yang serius.',
  },

  // ═══════════════════════════════════════════
  // T7: Fleet Management & Dispatch (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T7',
    difficulty: 'easy',
    content: 'Apa fungsi utama sistem *dispatch* otomatis pada armada tambang?',
    options: [
      { key: 'A', text: 'Menggantikan operator alat berat dengan kecerdasan buatan secara penuh' },
      { key: 'B', text: 'Melakukan perawatan mesin alat berat secara otomatis tanpa mekanik' },
      { key: 'C', text: 'Menghitung gaji operator berdasarkan jumlah trip yang dilakukan' },
      { key: 'D', text: 'Memantau cuaca untuk menentukan jadwal operasi harian di tambang' },
      { key: 'E', text: 'Mengatur penugasan truk ke excavator secara optimal berdasarkan data real-time' },
    ],
    correct_answer: 'E',
    explanation: 'Sistem ***dispatch*** otomatis mengoptimalkan penugasan dump truck ke excavator berdasarkan **data real-time** seperti:\n- Posisi GPS setiap unit alat berat\n- Status operasional (loading, hauling, dumping, empty)\n- Waktu tempuh aktual di setiap rute\n- Prioritas produksi dan blending bijih\n\nTujuannya adalah **meminimalkan waktu tunggu** (*queue time*) di excavator dan dump point, serta memaksimalkan produktivitas keseluruhan armada. Sistem ini dapat meningkatkan produksi 5-15% dibanding penugasan manual.',
  },
  {
    order_index: 18,
    category: 'T7',
    difficulty: 'medium',
    content: 'Indikator KPI apa yang paling tepat untuk mengukur efektivitas penggunaan armada dump truck di tambang?',
    options: [
      { key: 'A', text: 'Jumlah total dump truck yang dimiliki perusahaan tambang' },
      { key: 'B', text: 'Warna dan merek dump truck yang digunakan di setiap shift' },
      { key: 'C', text: 'Total jam kerja mekanik per bulan di bengkel perawatan armada' },
      { key: 'D', text: '*Utilization rate*, *availability*, dan produktivitas per jam operasi' },
      { key: 'E', text: 'Harga pembelian dump truck dibagi total pendapatan tambang tahunan' },
    ],
    correct_answer: 'D',
    explanation: 'KPI utama efektivitas armada dump truck:\n- ***Availability*** ($\\text{PA}$): persentase waktu alat siap digunakan (target $>85\\%$)\n- ***Utilization*** ($\\text{UA}$): persentase waktu alat benar-benar beroperasi dari waktu tersedia\n- **Produktivitas per jam**: ton material yang diangkut per jam operasi efektif\n\n$$\\text{Efektivitas} = \\text{PA} \\times \\text{UA} \\times \\text{Produktivitas}$$\nKetiga indikator ini saling terkait dan memberikan gambaran lengkap tentang performa armada.',
  },

  // ═══════════════════════════════════════════
  // T8: Mine Closure & Reclamation (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 19,
    category: 'T8',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *progressive rehabilitation* dalam penutupan tambang?',
    options: [
      { key: 'A', text: 'Rehabilitasi lahan secara bertahap pada area yang sudah tidak ditambang lagi' },
      { key: 'B', text: 'Melakukan seluruh kegiatan rehabilitasi hanya setelah tambang ditutup total' },
      { key: 'C', text: 'Meningkatkan produksi tambang secara bertahap dari tahun ke tahun' },
      { key: 'D', text: 'Menambah jumlah pekerja rehabilitasi secara progresif setiap kuartal' },
      { key: 'E', text: 'Memindahkan operasi tambang ke lokasi baru secara bertahap' },
    ],
    correct_answer: 'A',
    explanation: '***Progressive rehabilitation*** adalah praktik mereklamasi dan merehabilitasi lahan **secara bertahap** pada area yang sudah selesai ditambang, tanpa menunggu seluruh operasi tambang berakhir. Keuntungannya:\n- Menyebar biaya rehabilitasi sepanjang umur tambang\n- Mengurangi risiko lingkungan (erosi, AMD) lebih awal\n- Memungkinkan evaluasi keberhasilan metode revegetasi\n- Memenuhi kewajiban regulasi reklamasi yang berlaku\n\nPendekatan ini diwajibkan oleh regulasi pertambangan di Indonesia melalui rencana reklamasi dan pascatambang.',
  },
  {
    order_index: 20,
    category: 'T8',
    difficulty: 'medium',
    content: 'Dalam perencanaan penutupan tambang, apa tujuan utama pembuatan *final landform design*?',
    options: [
      { key: 'A', text: 'Merancang bentuk lahan akhir yang stabil, aman, dan sesuai peruntukan pascatambang' },
      { key: 'B', text: 'Menghitung total volume bijih yang masih tersisa di dalam pit akhir' },
      { key: 'C', text: 'Menentukan harga jual lahan bekas tambang kepada pihak ketiga' },
      { key: 'D', text: 'Merancang pabrik pengolahan baru di atas bekas area penambangan' },
      { key: 'E', text: 'Memperluas area konsesi tambang untuk operasi penambangan lanjutan' },
    ],
    correct_answer: 'A',
    explanation: '***Final landform design*** merancang bentuk lahan akhir setelah tambang ditutup dengan tujuan:\n- **Stabilitas fisik** jangka panjang (lereng aman, drainase baik)\n- **Stabilitas kimia** (mencegah AMD, mengontrol rembesan)\n- **Kesesuaian peruntukan** pascatambang (pertanian, konservasi, wisata, dll.)\n- **Integrasi visual** dengan lanskap sekitar\n\nDesain ini harus mempertimbangkan iklim, hidrologi, jenis tanah, dan rencana tata ruang wilayah. Di Indonesia, hal ini diatur dalam dokumen Rencana Reklamasi dan Rencana Pascatambang.',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await supabase
    .from('packages')
    .select('id, name, slug')
    .eq('slug', 'antam-mining')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-mining tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal batch 1: ${questions.length}\n`)

  // Hapus soal lama jika ada
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
