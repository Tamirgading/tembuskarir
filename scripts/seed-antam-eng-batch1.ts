/**
 * ANTAM IMPACT 2026 — Project & Engineering (ENG) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Manajemen Proyek): 3 soal (2 konsep + 1 hitungan)
 *   T2 (Pemeliharaan & Keandalan): 3 soal (2 konsep + 1 hitungan)
 *   T3 (Gambar Teknik & Standar): 3 soal (3 konsep)
 *   T4 (Mekanikal & Material Handling): 3 soal (2 konsep + 1 hitungan)
 *   T5 (Kelistrikan & Instrumentasi): 3 soal (2 konsep + 1 hitungan)
 *   T6 (Infrastruktur & Sipil): 2 soal (2 konsep)
 *   T7 (Keselamatan Konstruksi): 3 soal (3 konsep)
 *
 * Jalankan: npx tsx scripts/seed-antam-eng-batch1.ts
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

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Manajemen Proyek Keteknikan (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa kepanjangan EPC dalam konteks proyek keteknikan dan apa artinya?',
    options: [
      { key: 'A', text: '*Engineering, Procurement, Construction* - tahapan utama pelaksanaan proyek' },
      { key: 'B', text: '*Electrical, Plumbing, Communication* - sistem utilitas bangunan industri' },
      { key: 'C', text: '*Equipment, Process, Control* - komponen utama pabrik pengolahan' },
      { key: 'D', text: '*Estimation, Planning, Commissioning* - fase awal perencanaan proyek' },
      { key: 'E', text: '*Energy, Power, Cooling* - sistem energi dalam fasilitas produksi' },
    ],
    correct_answer: 'A',
    explanation: '**EPC** (*Engineering, Procurement, Construction*) adalah model kontrak proyek di mana kontraktor bertanggung jawab atas tiga tahap utama:\n1. **Engineering**: desain teknis, gambar, spesifikasi\n2. **Procurement**: pengadaan material dan peralatan\n3. **Construction**: pembangunan fisik di lapangan\n\nDalam proyek tambang dan pabrik pengolahan, kontrak EPC sering digunakan karena:\n- Satu pihak bertanggung jawab penuh (*single point of responsibility*)\n- Harga dan jadwal lebih pasti (*lump sum turnkey*)\n- Risiko terintegrasi pada kontraktor EPC',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Dalam metode CPM (*Critical Path Method*), apa yang dimaksud dengan *critical path*?',
    options: [
      { key: 'A', text: 'Jalur terpendek dalam jaringan kerja yang menggunakan sumber daya paling sedikit' },
      { key: 'B', text: 'Jalur dengan aktivitas paling mudah yang dikerjakan lebih dulu' },
      { key: 'C', text: 'Urutan aktivitas terpanjang yang menentukan durasi minimum proyek' },
      { key: 'D', text: 'Jalur alternatif yang digunakan jika jalur utama mengalami hambatan' },
      { key: 'E', text: 'Daftar aktivitas yang bisa ditunda tanpa mempengaruhi jadwal proyek' },
    ],
    correct_answer: 'C',
    explanation: '***Critical path*** adalah **urutan aktivitas terpanjang** dari awal hingga akhir proyek. Karakteristik:\n- Menentukan **durasi minimum** penyelesaian proyek\n- Aktivitas di jalur kritis memiliki **float = 0** (tidak bisa ditunda)\n- Keterlambatan aktivitas kritis = keterlambatan proyek\n\nContoh: jika proyek pabrik memiliki jalur A-B-C (60 hari) dan D-E (45 hari), maka A-B-C adalah critical path dan durasi minimum proyek = 60 hari. Aktivitas D-E memiliki float 15 hari.',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Proyek pembangunan conveyor memiliki RAB Rp 5 miliar. Setelah 40% pekerjaan selesai, biaya aktual sudah Rp 2,5 miliar. Berapa *Cost Performance Index* (CPI)?',
    options: [
      { key: 'A', text: 'CPI = $0{,}60$ (over budget)' },
      { key: 'B', text: 'CPI = $1{,}00$ (on budget)' },
      { key: 'C', text: 'CPI = $1{,}25$ (under budget)' },
      { key: 'D', text: 'CPI = $0{,}40$ (over budget)' },
      { key: 'E', text: 'CPI = $0{,}80$ (over budget)' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan *Cost Performance Index*:\n$$\\begin{aligned} \\text{EV (Earned Value)} &= 40\\% \\times 5{.}000 = 2{.}000 \\text{ juta} \\\\ \\text{AC (Actual Cost)} &= 2{.}500 \\text{ juta} \\\\ \\text{CPI} &= \\frac{\\text{EV}}{\\text{AC}} = \\frac{2{.}000}{2{.}500} = 0{,}80 \\end{aligned}$$\nCPI < 1,0 berarti proyek **over budget** (setiap Rp 1 yang dikeluarkan hanya menghasilkan Rp 0,80 nilai pekerjaan). Estimasi biaya akhir:\n$$\\text{EAC} = \\frac{\\text{BAC}}{\\text{CPI}} = \\frac{5{.}000}{0{,}80} = 6{.}250 \\text{ juta}$$',
  },

  // ═══════════════════════════════════════════
  // T2: Manajemen Pemeliharaan & Keandalan (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 4,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa perbedaan utama antara *preventive maintenance* dan *predictive maintenance*?',
    options: [
      { key: 'A', text: 'Preventive dilakukan setelah kerusakan, predictive dilakukan sebelum kerusakan' },
      { key: 'B', text: 'Preventive hanya untuk alat kecil, predictive hanya untuk alat besar' },
      { key: 'C', text: 'Preventive tidak memerlukan teknisi, predictive memerlukan teknisi ahli' },
      { key: 'D', text: 'Preventive berdasarkan jadwal tetap, predictive berdasarkan kondisi aktual alat' },
      { key: 'E', text: 'Preventive lebih mahal dari predictive dalam semua situasi operasi' },
    ],
    correct_answer: 'D',
    explanation: 'Dua pendekatan pemeliharaan terencana:\n\n**Preventive Maintenance** (PM):\n- Dilakukan **berdasarkan jadwal tetap** (jam operasi, kalender)\n- Contoh: ganti oli setiap 500 jam, inspeksi belt setiap bulan\n- Sederhana tetapi bisa mengganti komponen yang masih baik\n\n**Predictive Maintenance** (PdM):\n- Dilakukan **berdasarkan kondisi aktual** alat (data monitoring)\n- Menggunakan teknologi: analisis vibrasi, thermography, oil analysis\n- Lebih efisien karena penggantian tepat waktu, tapi investasi sensor lebih tinggi',
  },
  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Dalam analisis keandalan, apa yang dimaksud dengan MTBF (*Mean Time Between Failures*)?',
    options: [
      { key: 'A', text: 'Waktu rata-rata yang dibutuhkan untuk memperbaiki alat setelah rusak' },
      { key: 'B', text: 'Waktu minimum sebelum alat baru boleh dioperasikan setelah pemasangan' },
      { key: 'C', text: 'Biaya rata-rata perbaikan yang dikeluarkan setiap kali alat mengalami kerusakan' },
      { key: 'D', text: 'Waktu rata-rata antara satu kegagalan ke kegagalan berikutnya saat operasi' },
      { key: 'E', text: 'Jumlah total kerusakan yang terjadi selama masa pakai alat tersebut' },
    ],
    correct_answer: 'D',
    explanation: '**MTBF** (*Mean Time Between Failures*) adalah **waktu rata-rata antara satu kegagalan ke kegagalan berikutnya** selama alat beroperasi:\n$$\\text{MTBF} = \\frac{\\text{Total waktu operasi}}{\\text{Jumlah kegagalan}}$$\nContoh: jika mesin beroperasi 2.000 jam dan mengalami 4 kali kerusakan, MTBF = 500 jam.\n\nIndikator keandalan terkait:\n- **MTTR** (*Mean Time To Repair*): waktu rata-rata perbaikan\n- **Availability** = $\\frac{\\text{MTBF}}{\\text{MTBF} + \\text{MTTR}} \\times 100\\%$\n\nMTBF tinggi = alat lebih andal.',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah pompa memiliki MTBF = 800 jam dan MTTR = 50 jam. Berapa *availability* pompa tersebut?',
    options: [
      { key: 'A', text: '$90{,}0\\%$' },
      { key: 'B', text: '$91{,}4\\%$' },
      { key: 'C', text: '$93{,}8\\%$' },
      { key: 'D', text: '$96{,}0\\%$' },
      { key: 'E', text: '$94{,}1\\%$' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan *availability*:\n$$\\begin{aligned} A &= \\frac{\\text{MTBF}}{\\text{MTBF} + \\text{MTTR}} \\times 100\\% \\\\ &= \\frac{800}{800 + 50} \\times 100\\% = \\frac{800}{850} \\times 100\\% \\\\ &= 94{,}1\\% \\end{aligned}$$\nAvailability $94{,}1\\%$ berarti pompa tersedia untuk beroperasi selama $94{,}1\\%$ dari total waktu. Untuk target industri, availability pompa kritis umumnya harus $> 95\\%$, sehingga perlu strategi peningkatan MTBF atau penurunan MTTR.',
  },

  // ═══════════════════════════════════════════
  // T3: Gambar Teknik & Standar (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 7,
    category: 'T3',
    difficulty: 'easy',
    content: 'Dalam gambar teknik, apa fungsi garis putus-putus (*dashed line*)?',
    options: [
      { key: 'A', text: 'Menunjukkan bagian yang tersembunyi atau tidak terlihat dari sisi pandang' },
      { key: 'B', text: 'Menunjukkan garis batas pemotongan pada tampak potongan' },
      { key: 'C', text: 'Menunjukkan garis sumbu simetri pada komponen yang simetris' },
      { key: 'D', text: 'Menunjukkan dimensi dan ukuran komponen dalam satuan milimeter' },
      { key: 'E', text: 'Menunjukkan arah aliran fluida dalam perpipaan pabrik' },
    ],
    correct_answer: 'A',
    explanation: 'Jenis garis dalam gambar teknik dan fungsinya:\n- **Garis tebal kontinu**: tepi dan kontur yang terlihat\n- **Garis putus-putus** (*dashed/hidden line*): **bagian tersembunyi** yang tidak terlihat dari sisi pandang\n- **Garis tipis strip-titik**: garis sumbu simetri (*center line*)\n- **Garis tipis kontinu**: garis dimensi, garis bantu, arsir\n- **Garis tebal strip-titik**: bidang pemotongan\n\nStandar gambar teknik mengacu pada **ISO 128** untuk jenis garis dan **ISO 129** untuk penunjukan dimensi.',
  },
  {
    order_index: 8,
    category: 'T3',
    difficulty: 'medium',
    content: 'Dalam P&ID (*Piping and Instrumentation Diagram*), simbol lingkaran dengan huruf di dalamnya menunjukkan apa?',
    options: [
      { key: 'A', text: 'Jenis material pipa yang digunakan pada segmen tertentu' },
      { key: 'B', text: 'Lokasi pengelasan pada sambungan pipa di lapangan' },
      { key: 'C', text: 'Titik pengambilan sampel untuk pengujian laboratorium' },
      { key: 'D', text: 'Kategori bahaya area sesuai klasifikasi zona berbahaya' },
      { key: 'E', text: 'Instrumen pengukuran atau kontrol dengan kode identifikasi sesuai ISA' },
    ],
    correct_answer: 'E',
    explanation: 'Dalam **P&ID**, simbol lingkaran (*bubble*) dengan huruf menunjukkan **instrumen** sesuai standar **ISA** (International Society of Automation):\n\nHuruf pertama = variabel yang diukur:\n- **F** = Flow (aliran)\n- **T** = Temperature (suhu)\n- **P** = Pressure (tekanan)\n- **L** = Level (ketinggian)\n\nHuruf berikutnya = fungsi:\n- **I** = Indicator (penunjuk)\n- **C** = Controller (pengendali)\n- **T** = Transmitter (pemancar sinyal)\n\nContoh: **FIC** = *Flow Indicating Controller* (pengendali aliran dengan indikator).',
  },
  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Standar ISO 9001 berkaitan dengan aspek apa dalam sebuah organisasi?',
    options: [
      { key: 'A', text: 'Sistem manajemen lingkungan dan pengelolaan limbah industri' },
      { key: 'B', text: 'Sistem manajemen keselamatan dan kesehatan kerja' },
      { key: 'C', text: 'Sistem manajemen mutu untuk memastikan kualitas produk dan layanan' },
      { key: 'D', text: 'Sistem manajemen energi dan efisiensi penggunaan listrik' },
      { key: 'E', text: 'Sistem manajemen keamanan informasi dan perlindungan data' },
    ],
    correct_answer: 'C',
    explanation: 'Standar ISO yang umum di industri:\n- **ISO 9001**: *Quality Management System* (QMS) - **manajemen mutu** produk dan layanan\n- **ISO 14001**: *Environmental Management System* (EMS) - manajemen lingkungan\n- **ISO 45001**: *Occupational Health & Safety* (OH&S) - K3\n- **ISO 50001**: *Energy Management System* (EnMS) - manajemen energi\n- **ISO 27001**: *Information Security* - keamanan informasi\n\nISO 9001 memastikan organisasi memiliki proses yang konsisten untuk menghasilkan produk/layanan berkualitas sesuai kebutuhan pelanggan.',
  },

  // ═══════════════════════════════════════════
  // T4: Mekanikal & Material Handling (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 10,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa fungsi utama *belt conveyor* dalam industri pertambangan?',
    options: [
      { key: 'A', text: 'Menghancurkan bijih menjadi ukuran yang lebih kecil sebelum pengolahan' },
      { key: 'B', text: 'Memindahkan material secara kontinu dari satu titik ke titik lain' },
      { key: 'C', text: 'Menyaring material berdasarkan ukuran partikel secara otomatis' },
      { key: 'D', text: 'Menyimpan material sementara sebelum diproses di pabrik' },
      { key: 'E', text: 'Mengukur berat material yang ditransportasikan per jam' },
    ],
    correct_answer: 'B',
    explanation: '***Belt conveyor*** berfungsi untuk **memindahkan material secara kontinu** dari satu lokasi ke lokasi lain. Komponen utama:\n- **Belt**: sabuk karet yang membawa material (bisa flat atau trough)\n- **Idler**: roller penopang belt di sepanjang jalur\n- **Drive pulley**: penggerak belt menggunakan motor listrik\n- **Take-up**: penegangan belt agar tidak slip\n\nKeunggulan belt conveyor:\n- Kapasitas tinggi (hingga ribuan ton/jam)\n- Operasi kontinu 24/7 dengan downtime minimal\n- Biaya operasi per ton lebih rendah dari truk untuk jarak tertentu',
  },
  {
    order_index: 11,
    category: 'T4',
    difficulty: 'medium',
    content: 'Sebuah motor listrik 75 kW menggerakkan pompa melalui belt drive. Jika efisiensi transmisi belt $95\\%$, berapa daya yang tersedia di pompa?',
    options: [
      { key: 'A', text: '$67{,}5$ kW' },
      { key: 'B', text: '$71{,}25$ kW' },
      { key: 'C', text: '$73{,}0$ kW' },
      { key: 'D', text: '$75{,}0$ kW' },
      { key: 'E', text: '$78{,}75$ kW' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan daya di pompa:\n$$\\begin{aligned} P_{\\text{pompa}} &= P_{\\text{motor}} \\times \\eta_{\\text{belt}} \\\\ &= 75 \\times 0{,}95 = 71{,}25 \\text{ kW} \\end{aligned}$$\nKehilangan daya $3{,}75$ kW ($5\\%$) pada belt drive disebabkan oleh:\n- Gesekan antara belt dan pulley\n- *Bending loss* saat belt melengkung di pulley\n- *Windage loss* (hambatan udara)\n\nEfisiensi $95\\%$ merupakan nilai tipikal untuk belt drive. Gear drive umumnya lebih efisien ($97$-$99\\%$) tetapi lebih mahal.',
  },
  {
    order_index: 12,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *fatigue failure* pada komponen mesin?',
    options: [
      { key: 'A', text: 'Kerusakan akibat beban statis yang melebihi kekuatan tarik material' },
      { key: 'B', text: 'Kerusakan akibat korosi kimia pada permukaan komponen logam' },
      { key: 'C', text: 'Kerusakan karena suhu operasi melebihi titik lebur material' },
      { key: 'D', text: 'Kerusakan akibat pembebanan berulang di bawah kekuatan statis material' },
      { key: 'E', text: 'Kerusakan karena getaran mesin yang mengakibatkan baut kendor' },
    ],
    correct_answer: 'D',
    explanation: '***Fatigue failure*** adalah kerusakan yang terjadi akibat **pembebanan berulang** (*cyclic loading*) meskipun tegangan di bawah kekuatan tarik statis material. Tahapan:\n1. **Inisiasi retak**: retak mikro terbentuk di titik konsentrasi tegangan\n2. **Perambatan retak**: retak tumbuh setiap siklus pembebanan\n3. **Patah akhir**: komponen patah tiba-tiba saat penampang tidak mampu menahan beban\n\nPencegahan:\n- Desain menghindari konsentrasi tegangan (fillet, radius)\n- *Shot peening* untuk tegangan sisa tekan di permukaan\n- Inspeksi NDT berkala (ultrasonic, magnetic particle)',
  },

  // ═══════════════════════════════════════════
  // T5: Kelistrikan & Instrumentasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa fungsi *Variable Frequency Drive* (VFD) pada motor listrik di pabrik?',
    options: [
      { key: 'A', text: 'Mengatur kecepatan putaran motor sesuai kebutuhan proses' },
      { key: 'B', text: 'Melindungi motor dari hubungan pendek dan beban lebih' },
      { key: 'C', text: 'Meningkatkan tegangan listrik dari 220V menjadi 380V untuk motor besar' },
      { key: 'D', text: 'Mengubah arus bolak-balik (AC) menjadi arus searah (DC) untuk motor' },
      { key: 'E', text: 'Menyimpan energi listrik cadangan saat terjadi pemadaman listrik' },
    ],
    correct_answer: 'A',
    explanation: '***VFD*** (*Variable Frequency Drive*) berfungsi untuk **mengatur kecepatan putaran motor** AC dengan mengubah frekuensi dan tegangan suplai. Kecepatan motor sinkron:\n$$n = \\frac{120 \\times f}{p}$$\ndi mana $f$ = frekuensi (Hz) dan $p$ = jumlah kutub.\n\nManfaat VFD:\n- **Penghematan energi** signifikan (30-50%) pada pompa dan kipas\n- *Soft start* (mengurangi arus starting)\n- Kontrol proses lebih presisi\n- Mengurangi *mechanical stress* pada komponen\n\nContoh: mengatur kecepatan pompa slurry sesuai debit yang dibutuhkan.',
  },
  {
    order_index: 14,
    category: 'T5',
    difficulty: 'medium',
    content: 'Dalam sistem SCADA, apa peran RTU (*Remote Terminal Unit*)?',
    options: [
      { key: 'A', text: 'Menyimpan data historis proses di server pusat selama bertahun-tahun' },
      { key: 'B', text: 'Menampilkan grafik dan alarm di layar monitor operator di ruang kontrol' },
      { key: 'C', text: 'Mencetak laporan produksi harian secara otomatis di printer kantor' },
      { key: 'D', text: 'Mengkalibrasi seluruh sensor secara otomatis setiap pergantian shift' },
      { key: 'E', text: 'Mengumpulkan data dari sensor di lapangan dan mengirimnya ke pusat kontrol' },
    ],
    correct_answer: 'E',
    explanation: '**SCADA** (*Supervisory Control and Data Acquisition*) adalah sistem pengawasan dan pengendalian proses industri dari jarak jauh.\n\n**RTU** (*Remote Terminal Unit*) berperan:\n- **Mengumpulkan data** dari sensor/transmitter di lapangan (suhu, tekanan, level, debit)\n- **Mengirim data** ke *master station* (server SCADA) melalui komunikasi\n- **Menerima perintah** dari operator untuk mengontrol aktuator (valve, pompa)\n- Beroperasi secara **mandiri** jika komunikasi terputus\n\nKomponen SCADA lainnya:\n- **HMI** (*Human Machine Interface*): layar operator\n- **PLC**: pengendali logika di lapangan\n- **Communication network**: jaringan penghubung',
  },
  {
    order_index: 15,
    category: 'T5',
    difficulty: 'medium',
    content: 'Sebuah motor listrik 3 fase, 380V, 50 Hz memiliki daya $30$ kW dan faktor daya $0{,}85$. Berapa arus yang mengalir ke motor?',
    options: [
      { key: 'A', text: 'Sekitar $36$ A' },
      { key: 'B', text: 'Sekitar $42$ A' },
      { key: 'C', text: 'Sekitar $54$ A' },
      { key: 'D', text: 'Sekitar $48$ A' },
      { key: 'E', text: 'Sekitar $60$ A' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan arus motor 3 fase:\n$$\\begin{aligned} P &= \\sqrt{3} \\times V \\times I \\times \\cos\\phi \\\\ I &= \\frac{P}{\\sqrt{3} \\times V \\times \\cos\\phi} \\\\ &= \\frac{30.000}{1{,}732 \\times 380 \\times 0{,}85} \\\\ &= \\frac{30.000}{559{,}2} = 53{,}6 \\approx 54 \\text{ A} \\end{aligned}$$\nArus ini digunakan untuk menentukan ukuran kabel, *circuit breaker*, dan pengaman motor yang tepat.',
  },

  // ═══════════════════════════════════════════
  // T6: Infrastruktur & Teknik Sipil (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 16,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa tujuan utama uji *Standard Penetration Test* (SPT) dalam penyelidikan geoteknik?',
    options: [
      { key: 'A', text: 'Menguji kekuatan dan kepadatan tanah untuk desain pondasi bangunan' },
      { key: 'B', text: 'Menentukan kedalaman muka air tanah di lokasi konstruksi' },
      { key: 'C', text: 'Mengukur kadar mineral dalam tanah untuk estimasi cadangan tambang' },
      { key: 'D', text: 'Mengidentifikasi jenis batuan induk di bawah lapisan tanah penutup' },
      { key: 'E', text: 'Mengukur tingkat getaran tanah akibat aktivitas peledakan tambang' },
    ],
    correct_answer: 'A',
    explanation: '***Standard Penetration Test*** (SPT) adalah uji lapangan untuk **menguji kekuatan dan kepadatan tanah** dengan cara memukul tabung split spoon ke dalam tanah menggunakan palu 63,5 kg yang dijatuhkan dari ketinggian 76 cm.\n\n**Nilai N-SPT** = jumlah pukulan untuk penetrasi 30 cm:\n- N < 4: tanah sangat lunak\n- N = 4-10: tanah lunak\n- N = 10-30: tanah sedang\n- N = 30-50: tanah padat\n- N > 50: tanah sangat padat\n\nData SPT digunakan untuk desain pondasi, daya dukung tanah, dan klasifikasi tanah.',
  },
  {
    order_index: 17,
    category: 'T6',
    difficulty: 'medium',
    content: 'Mengapa sistem drainase yang baik penting untuk jalan tambang?',
    options: [
      { key: 'A', text: 'Drainase meningkatkan kadar bijih yang diangkut melalui jalan tambang' },
      { key: 'B', text: 'Drainase mencegah genangan air yang merusak jalan dan membahayakan kendaraan' },
      { key: 'C', text: 'Drainase mengurangi debu yang diterbangkan angin di area pertambangan' },
      { key: 'D', text: 'Drainase mempercepat pertumbuhan vegetasi di sepanjang berm jalan' },
      { key: 'E', text: 'Drainase mengurangi kebisingan kendaraan yang melintas di jalan hauling' },
    ],
    correct_answer: 'B',
    explanation: 'Sistem **drainase jalan tambang** penting karena:\n- **Mencegah genangan air** yang merusak permukaan jalan (rutting, potholes)\n- **Mengurangi risiko kecelakaan** akibat jalan licin untuk dump truck berat\n- **Mencegah erosi** badan jalan dan longsoran tebing potongan\n- **Menjaga daya dukung** tanah dasar (*subgrade*) jalan\n\nKomponen drainase jalan tambang:\n- Parit tepi (*side ditch*) untuk mengalirkan air hujan\n- *Culvert* (gorong-gorong) untuk menyeberangkan air di bawah jalan\n- *Cross fall* (kemiringan melintang) 2-4% untuk mengalirkan air ke sisi jalan',
  },

  // ═══════════════════════════════════════════
  // T7: Keselamatan Konstruksi & Operasional (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 18,
    category: 'T7',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan LOTO (*Lockout/Tagout*) dalam keselamatan kerja?',
    options: [
      { key: 'A', text: 'Sistem penguncian pintu masuk area tambang bawah tanah setiap malam' },
      { key: 'B', text: 'Metode pelabelan bahan kimia berbahaya di gudang penyimpanan' },
      { key: 'C', text: 'Sistem pencatatan kehadiran pekerja di area konstruksi proyek' },
      { key: 'D', text: 'Prosedur mengunci dan menandai sumber energi sebelum perawatan alat' },
      { key: 'E', text: 'Prosedur penguncian lemari APD agar tidak hilang atau dicuri' },
    ],
    correct_answer: 'D',
    explanation: '**LOTO** (*Lockout/Tagout*) adalah prosedur keselamatan untuk **mengisolasi dan mengunci sumber energi** sebelum perawatan atau perbaikan peralatan. Tujuannya mencegah **energi tak terduga** (*unexpected energization*) yang bisa membahayakan teknisi.\n\nLangkah LOTO:\n1. **Identifikasi** semua sumber energi (listrik, pneumatik, hidrolik, mekanik, termal)\n2. **Notifikasi** semua pekerja terkait\n3. **Shutdown** dan isolasi peralatan\n4. **Lockout**: pasang gembok di isolator energi\n5. **Tagout**: pasang tag identifikasi\n6. **Verifikasi**: pastikan energi benar-benar terisolasi (*try start*)',
  },
  {
    order_index: 19,
    category: 'T7',
    difficulty: 'medium',
    content: 'Apa tujuan dari *Permit to Work* (PTW) untuk pekerjaan berisiko tinggi?',
    options: [
      { key: 'A', text: 'Menggantikan pelatihan K3 bagi pekerja yang belum berpengalaman' },
      { key: 'B', text: 'Memastikan semua bahaya telah diidentifikasi dan dikendalikan sebelum kerja dimulai' },
      { key: 'C', text: 'Memberikan bonus keselamatan bagi pekerja yang tidak pernah mengalami kecelakaan' },
      { key: 'D', text: 'Mengurangi jumlah pekerja yang diizinkan masuk ke area pabrik' },
      { key: 'E', text: 'Mendokumentasikan jam kerja lembur pekerja di area berbahaya' },
    ],
    correct_answer: 'B',
    explanation: '***Permit to Work*** (PTW) adalah sistem otorisasi formal untuk **memastikan semua bahaya telah diidentifikasi dan langkah pengendalian diterapkan** sebelum pekerjaan berisiko tinggi dimulai.\n\nJenis PTW yang umum:\n- **Hot work permit**: pekerjaan dengan api/panas (pengelasan, pemotongan)\n- **Confined space permit**: bekerja di ruang terbatas (tangki, silo)\n- **Working at height permit**: bekerja di ketinggian (> 1,8 m)\n- **Excavation permit**: penggalian di dekat utilitas bawah tanah\n\nPTW harus ditandatangani oleh pihak berwenang dan memiliki batas waktu berlaku.',
  },
  {
    order_index: 20,
    category: 'T7',
    difficulty: 'easy',
    content: 'Dalam identifikasi bahaya menggunakan metode HIRADC, apa langkah pertama yang harus dilakukan?',
    options: [
      { key: 'A', text: 'Menentukan pengendalian risiko yang paling efektif dan ekonomis' },
      { key: 'B', text: 'Menghitung biaya kecelakaan yang pernah terjadi sebelumnya' },
      { key: 'C', text: 'Mengidentifikasi semua bahaya yang ada di area kerja atau aktivitas' },
      { key: 'D', text: 'Membuat laporan kecelakaan untuk diserahkan ke pihak berwenang' },
      { key: 'E', text: 'Menentukan APD yang harus digunakan oleh seluruh pekerja' },
    ],
    correct_answer: 'C',
    explanation: '**HIRADC** (*Hazard Identification, Risk Assessment, and Determining Controls*) dilakukan dengan urutan:\n1. **Hazard Identification**: **mengidentifikasi semua bahaya** (fisik, kimia, biologis, ergonomis, psikososial)\n2. **Risk Assessment**: menilai tingkat risiko berdasarkan **kemungkinan** (*likelihood*) dan **keparahan** (*severity*)\n3. **Determining Controls**: menentukan pengendalian sesuai hierarki:\n   - Eliminasi (hilangkan bahaya)\n   - Substitusi (ganti dengan yang lebih aman)\n   - Engineering control (rekayasa teknik)\n   - Administrative control (prosedur, pelatihan)\n   - APD (*Personal Protective Equipment*)',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await supabase
    .from('packages')
    .select('id, name, slug')
    .eq('slug', 'antam-engineering')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-engineering tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal batch 1: ${questions.length}\n`)

  console.log('Menghapus soal lama...')
  await supabase.from('questions').delete().eq('package_id', pkg.id)
  console.log('Soal lama berhasil dihapus.\n')

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
}

main()
