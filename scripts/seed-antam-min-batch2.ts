/**
 * ANTAM IMPACT 2026 — Mining (MIN) Batch 2: Soal 21–40
 *
 * Distribusi batch 2 (sisa):
 *   T1 (Mine Planning): 2 soal (1 konsep + 1 hitungan)
 *   T2 (Drill & Blast): 2 soal (1 konsep + 1 hitungan)
 *   T3 (Load & Haul): 2 soal (2 konsep)
 *   T4 (Geotechnical): 2 soal (2 konsep)
 *   T5 (Ventilation): 3 soal (2 konsep + 1 hitungan)
 *   T6 (Water Management): 3 soal (2 konsep + 1 hitungan)
 *   T7 (Fleet Management): 3 soal (2 konsep + 1 hitungan)
 *   T8 (Mine Closure): 3 soal (3 konsep)
 *
 * Jalankan: npx tsx scripts/seed-antam-min-batch2.ts
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
  // T1: Mine Planning & Design (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *cut-off grade* dalam perencanaan tambang dan mengapa nilainya bisa berubah?',
    options: [
      { key: 'A', text: 'Kadar rata-rata seluruh deposit yang bersifat tetap sepanjang umur tambang' },
      { key: 'B', text: 'Kadar maksimum bijih sebelum material diklasifikasikan sebagai bonanza' },
      { key: 'C', text: 'Batas atas kadar yang diizinkan oleh regulasi pemerintah daerah' },
      { key: 'D', text: 'Kadar logam dalam konsentrat akhir setelah proses di pabrik pengolahan' },
      { key: 'E', text: 'Kadar minimum yang layak ditambang, berubah sesuai harga komoditas dan biaya' },
    ],
    correct_answer: 'E',
    explanation: '***Cut-off grade*** adalah kadar minimum suatu material agar masih **layak ditambang secara ekonomis**. Material di bawah *cut-off grade* diklasifikasikan sebagai waste.\n\nNilai *cut-off grade* bersifat **dinamis** karena dipengaruhi:\n- Fluktuasi harga komoditas di pasar global\n- Perubahan biaya penambangan dan pengolahan\n- *Recovery* metalurgi aktual\n- Biaya overhead dan royalti\n\nSaat harga komoditas naik, *cut-off grade* bisa turun sehingga lebih banyak material menjadi layak tambang.',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Tambang nikel laterit memiliki produksi bijih 100.000 ton/bulan. Jika harga jual Rp 800.000/ton dan biaya operasi total Rp 600.000/ton, berapa margin operasi per bulan?',
    options: [
      { key: 'A', text: 'Rp 10 miliar' },
      { key: 'B', text: 'Rp 15 miliar' },
      { key: 'C', text: 'Rp 20 miliar' },
      { key: 'D', text: 'Rp 25 miliar' },
      { key: 'E', text: 'Rp 30 miliar' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan margin operasi:\n$$\\begin{aligned} \\text{Margin per ton} &= \\text{Harga jual} - \\text{Biaya operasi} \\\\ &= 800.000 - 600.000 = 200.000 \\text{ Rp/ton} \\\\ \\text{Margin/bulan} &= 100.000 \\times 200.000 \\\\ &= 20.000.000.000 = \\text{Rp 20 miliar} \\end{aligned}$$\nMargin operasi ini belum memperhitungkan pajak, royalti, depresiasi, dan biaya non-operasional lainnya.',
  },

  // ═══════════════════════════════════════════
  // T2: Drill & Blast Operations (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 23,
    category: 'T2',
    difficulty: 'easy',
    content: 'Dalam peledakan tambang, apa fungsi *delay* (waktu tunda) pada detonator antar lubang ledak?',
    options: [
      { key: 'A', text: 'Mengontrol urutan peledakan untuk fragmentasi dan getaran yang optimal' },
      { key: 'B', text: 'Mengurangi biaya bahan peledak dengan mengurangi jumlah lubang yang diledakkan' },
      { key: 'C', text: 'Memberikan waktu bagi pekerja untuk meninggalkan area peledakan' },
      { key: 'D', text: 'Menunggu hujan berhenti sebelum peledakan dilaksanakan di lapangan' },
      { key: 'E', text: 'Menambah kedalaman lubang ledak secara bertahap selama proses peledakan' },
    ],
    correct_answer: 'A',
    explanation: '**Delay** (waktu tunda) pada detonator berfungsi untuk:\n- **Mengontrol urutan peledakan** sehingga setiap lubang meledak secara berurutan, bukan bersamaan\n- Memberikan waktu bagi batuan untuk bergerak sebelum lubang berikutnya meledak, menghasilkan **fragmentasi lebih baik**\n- **Mengurangi getaran** (*ground vibration*) karena energi ledakan tersebar dalam waktu, bukan terkonsentrasi\n- Mengarahkan lontaran material ke arah yang diinginkan (*throw direction*)\n\nDelay umumnya berkisar 17-100 milidetik antar lubang dan antar baris.',
  },
  {
    order_index: 24,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah peledakan menggunakan 20 lubang ledak, masing-masing berisi 80 kg ANFO. Volume batuan yang terledakkan 8.000 m³. Berapa *powder factor*-nya?',
    options: [
      { key: 'A', text: '$0{,}10$ kg/m³' },
      { key: 'B', text: '$0{,}20$ kg/m³' },
      { key: 'C', text: '$0{,}15$ kg/m³' },
      { key: 'D', text: '$0{,}25$ kg/m³' },
      { key: 'E', text: '$0{,}30$ kg/m³' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan *powder factor*:\n$$\\begin{aligned} \\text{Total BB} &= 20 \\times 80 = 1.600 \\text{ kg} \\\\ \\text{PF} &= \\frac{\\text{Total BB}}{\\text{Volume batuan}} \\\\ &= \\frac{1.600}{8.000} = 0{,}20 \\text{ kg/m}^3 \\end{aligned}$$\n*Powder factor* $0{,}20$ kg/m³ tergolong rendah, umum untuk batuan lunak atau *overburden*. Untuk batuan keras, PF bisa mencapai $0{,}4$-$0{,}8$ kg/m³.',
  },

  // ═══════════════════════════════════════════
  // T3: Load & Haul Systems (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T3',
    difficulty: 'easy',
    content: 'Mengapa *payload monitoring system* penting dipasang pada dump truck di tambang?',
    options: [
      { key: 'A', text: 'Untuk mengukur kadar bijih yang diangkut oleh setiap truk secara otomatis' },
      { key: 'B', text: 'Untuk menentukan rute tercepat menuju *dump point* yang tersedia' },
      { key: 'C', text: 'Untuk menghitung konsumsi bahan bakar per kilometer jarak tempuh' },
      { key: 'D', text: 'Untuk mencegah *overloading* yang memperpendek umur komponen truk' },
      { key: 'E', text: 'Untuk memantau kecepatan angin di area jalan angkut tambang' },
    ],
    correct_answer: 'D',
    explanation: '***Payload monitoring system*** memantau berat muatan dump truck secara *real-time* untuk:\n- **Mencegah *overloading*** yang memperpendek umur ban, suspensi, rangka, dan drivetrain\n- Memastikan muatan tidak kurang (*underloading*) yang menurunkan produktivitas\n- Menyediakan data produksi aktual untuk rekonsiliasi dengan survei\n- Memberikan feedback kepada operator excavator untuk menyesuaikan pemuatan\n\nTarget *payload* umumnya $\\pm 10\\%$ dari kapasitas desain truk.',
  },
  {
    order_index: 26,
    category: 'T3',
    difficulty: 'medium',
    content: 'Dalam operasi tambang bawah tanah, apa keunggulan alat LHD (*Load-Haul-Dump*) dibandingkan kombinasi loader dan dump truck?',
    options: [
      { key: 'A', text: 'LHD dapat bermanuver di ruang sempit terowongan karena desainnya yang kompak' },
      { key: 'B', text: 'LHD tidak memerlukan operator karena selalu beroperasi secara otonom' },
      { key: 'C', text: 'LHD memiliki kapasitas angkut yang jauh lebih besar dari dump truck' },
      { key: 'D', text: 'LHD tidak memerlukan ventilasi karena tidak menggunakan mesin sama sekali' },
      { key: 'E', text: 'LHD hanya digunakan di tambang terbuka dengan jarak angkut pendek' },
    ],
    correct_answer: 'A',
    explanation: '**LHD** (*Load-Haul-Dump*) dirancang khusus untuk tambang bawah tanah dengan keunggulan:\n- **Desain kompak dan artikulasi** yang memungkinkan manuver di terowongan sempit dan tikungan tajam\n- Satu alat melakukan tiga fungsi (muat, angkut, curah) tanpa perlu alat tambahan\n- Tersedia dalam versi diesel dan **elektrik** (battery-electric) untuk mengurangi kebutuhan ventilasi\n\nKeterbatasannya adalah jarak angkut ekonomis yang relatif pendek (umumnya < 300 m). Untuk jarak lebih jauh, material biasanya dipindahkan ke *ore pass* atau truk bawah tanah.',
  },

  // ═══════════════════════════════════════════
  // T4: Geotechnical Engineering (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 27,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa fungsi utama *ground support* (penyanggaan) di tambang bawah tanah?',
    options: [
      { key: 'A', text: 'Meningkatkan kadar bijih di area kerja melalui seleksi material' },
      { key: 'B', text: 'Menjaga kestabilan bukaan tambang agar aman bagi pekerja dan alat' },
      { key: 'C', text: 'Mengarahkan aliran air tanah ke luar terowongan secara gravitasi' },
      { key: 'D', text: 'Meningkatkan sirkulasi udara di dalam terowongan tambang' },
      { key: 'E', text: 'Mempercepat proses peledakan batuan di muka kerja terowongan' },
    ],
    correct_answer: 'B',
    explanation: '***Ground support*** (penyanggaan) berfungsi untuk **menjaga kestabilan bukaan tambang** (terowongan, *stope*, *shaft*) agar aman bagi pekerja dan peralatan. Jenis penyanggaan yang umum:\n- **Rock bolt** (baut batuan): mengikat lapisan batuan agar tidak runtuh\n- **Shotcrete** (beton semprot): melapisi permukaan untuk mencegah pelapukan dan runtuhan kecil\n- **Wire mesh** (jaring baja): menahan batuan kecil yang lepas\n- **Steel set** (rangka baja): untuk kondisi batuan sangat buruk\n\nPemilihan jenis penyanggaan didasarkan pada klasifikasi massa batuan (RMR, Q-system).',
  },
  {
    order_index: 28,
    category: 'T4',
    difficulty: 'medium',
    content: 'Dalam analisis stabilitas lereng, apa yang dimaksud dengan *Factor of Safety* (FoS) dan berapa nilai minimum yang umumnya diterima untuk lereng tambang permanen?',
    options: [
      { key: 'A', text: 'Rasio gaya penahan terhadap gaya penggerak, minimum FoS = 1,0' },
      { key: 'B', text: 'Rasio gaya penggerak terhadap gaya penahan, minimum FoS = 2,0' },
      { key: 'C', text: 'Sudut lereng maksimum yang diizinkan, minimum FoS = 0,5' },
      { key: 'D', text: 'Rasio gaya penahan terhadap gaya penggerak, minimum FoS = 1,3' },
      { key: 'E', text: 'Rasio volume waste terhadap volume bijih, minimum FoS = 1,5' },
    ],
    correct_answer: 'D',
    explanation: '***Factor of Safety*** (FoS) adalah rasio antara **gaya penahan** (kekuatan massa batuan) terhadap **gaya penggerak** (gravitasi, tekanan air):\n$$\\text{FoS} = \\frac{\\text{Gaya penahan}}{\\text{Gaya penggerak}}$$\n- $\\text{FoS} < 1{,}0$: lereng tidak stabil (akan longsor)\n- $\\text{FoS} = 1{,}0$: keseimbangan kritis\n- $\\text{FoS} \\geq 1{,}3$: umumnya diterima untuk **lereng permanen** tambang terbuka\n- $\\text{FoS} \\geq 1{,}1$: bisa diterima untuk **lereng sementara** dengan monitoring aktif',
  },

  // ═══════════════════════════════════════════
  // T5: Mine Ventilation (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T5',
    difficulty: 'easy',
    content: 'Gas metana ($\\text{CH}_4$) di tambang bawah tanah menjadi berbahaya pada konsentrasi berapa persen?',
    options: [
      { key: 'A', text: '$0{,}1\\%$, karena sudah bersifat racun bagi saluran pernapasan pekerja' },
      { key: 'B', text: '$1\\%$, karena menyebabkan iritasi mata dan kulit secara langsung' },
      { key: 'C', text: '$3\\%$, karena menghambat kerja alat berat diesel di dalam terowongan' },
      { key: 'D', text: '$20\\%$, karena baru pada konsentrasi itu metana dapat terbakar' },
      { key: 'E', text: '$5\\%$, karena mencapai batas bawah ledak (*Lower Explosive Limit*)' },
    ],
    correct_answer: 'E',
    explanation: 'Gas metana ($\\text{CH}_4$) bersifat **mudah meledak** pada rentang konsentrasi tertentu di udara:\n- ***Lower Explosive Limit* (LEL)**: $5\\%$ - batas bawah ledak\n- ***Upper Explosive Limit* (UEL)**: $15\\%$ - batas atas ledak\n\nDi tambang bawah tanah, regulasi K3 menetapkan tindakan pada konsentrasi jauh di bawah LEL:\n- $\\geq 0{,}5\\%$: peringatan dini\n- $\\geq 1{,}0\\%$: stop peralatan listrik non-flameproof\n- $\\geq 1{,}5\\%$: evakuasi area',
  },
  {
    order_index: 30,
    category: 'T5',
    difficulty: 'medium',
    content: 'Dalam ventilasi tambang, apa yang dimaksud dengan *re-entry time* setelah peledakan?',
    options: [
      { key: 'A', text: 'Waktu yang dibutuhkan untuk membor lubang ledak baru setelah peledakan' },
      { key: 'B', text: 'Jarak minimum evakuasi pekerja dari titik peledakan terdekat' },
      { key: 'C', text: 'Waktu yang dibutuhkan excavator untuk masuk ke area peledakan' },
      { key: 'D', text: 'Waktu minimum menunggu hingga gas dan debu hilang sebelum pekerja boleh masuk' },
      { key: 'E', text: 'Durasi pengisian bahan peledak ke dalam lubang ledak yang sudah dibor' },
    ],
    correct_answer: 'D',
    explanation: '***Re-entry time*** adalah waktu minimum yang harus ditunggu setelah peledakan sebelum pekerja boleh memasuki area, agar:\n- **Gas beracun** ($\\text{CO}$, $\\text{NO}_2$, $\\text{SO}_2$) dari hasil ledakan sudah terventilasi\n- **Debu** sudah mengendap ke level yang aman\n- Tidak ada bahaya *misfire* (bahan peledak yang gagal meledak)\n\n*Re-entry time* bergantung pada volume ventilasi dan ukuran area, umumnya **30-60 menit** dengan ventilasi mekanis yang memadai. Pemeriksaan gas wajib dilakukan sebelum izin masuk diberikan.',
  },
  {
    order_index: 31,
    category: 'T5',
    difficulty: 'medium',
    content: 'Sebuah terowongan tambang memiliki penampang $4 \\times 4$ m. Regulasi mensyaratkan kecepatan aliran udara minimum $0{,}5$ m/s. Berapa debit udara minimum yang diperlukan?',
    options: [
      { key: 'A', text: '$4$ m³/s' },
      { key: 'B', text: '$6$ m³/s' },
      { key: 'C', text: '$8$ m³/s' },
      { key: 'D', text: '$10$ m³/s' },
      { key: 'E', text: '$12$ m³/s' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan debit udara minimum:\n$$\\begin{aligned} A &= 4 \\times 4 = 16 \\text{ m}^2 \\\\ Q &= A \\times v = 16 \\times 0{,}5 = 8 \\text{ m}^3\\text{/s} \\end{aligned}$$\ndi mana $A$ = luas penampang terowongan dan $v$ = kecepatan udara minimum.\n\nDebit $8$ m³/s setara dengan $480$ m³/menit. Kecepatan udara $0{,}5$ m/s merupakan batas minimum untuk mengencerkan gas hasil peledakan dan menjaga kualitas udara di area kerja.',
  },

  // ═══════════════════════════════════════════
  // T6: Water Management (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 32,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa fungsi kolam pengendapan (*settling pond*) dalam sistem pengelolaan air tambang?',
    options: [
      { key: 'A', text: 'Mengendapkan padatan tersuspensi dari air tambang sebelum dibuang' },
      { key: 'B', text: 'Menyimpan bahan peledak cair sebelum digunakan di area peledakan' },
      { key: 'C', text: 'Menampung air minum untuk kebutuhan pekerja di area operasi' },
      { key: 'D', text: 'Menyimpan bahan bakar diesel untuk armada alat berat di tambang' },
      { key: 'E', text: 'Menampung material bijih sebelum diangkut ke pabrik pengolahan' },
    ],
    correct_answer: 'A',
    explanation: '**Kolam pengendapan** (*settling pond*) berfungsi untuk **mengendapkan padatan tersuspensi** (sedimen, partikel halus) dari air limpasan tambang sebelum air dibuang ke badan air penerima. Prinsip kerjanya:\n- Air yang keruh dialirkan masuk dengan kecepatan rendah\n- Partikel padat mengendap secara gravitasi di dasar kolam\n- Air jernih keluar melalui *overflow* untuk dibuang atau digunakan kembali\n\nKolam harus didesain dengan waktu tinggal (*retention time*) cukup agar memenuhi standar baku mutu air limbah.',
  },
  {
    order_index: 33,
    category: 'T6',
    difficulty: 'medium',
    content: 'Dalam perencanaan *dewatering* tambang terbuka, data hidrogeologi apa yang paling penting untuk menentukan kapasitas pompa?',
    options: [
      { key: 'A', text: 'Kadar mineral ekonomis dalam batuan akuifer di sekitar pit' },
      { key: 'B', text: 'Warna dan bau air tanah yang ditemukan di sumur pantau' },
      { key: 'C', text: 'Jumlah curah hujan tahunan rata-rata di ibukota provinsi terdekat' },
      { key: 'D', text: 'Temperatur udara harian di area sekitar tambang selama satu tahun' },
      { key: 'E', text: 'Konduktivitas hidraulik, level air tanah, dan laju imbuhan (*recharge*)' },
    ],
    correct_answer: 'E',
    explanation: 'Data hidrogeologi kunci untuk perencanaan *dewatering*:\n- **Konduktivitas hidraulik** ($K$): menentukan seberapa cepat air mengalir melalui batuan/tanah\n- **Level muka air tanah**: menentukan volume air yang harus dipompa saat penggalian mencapai zona jenuh\n- **Laju imbuhan (*recharge*)**: menentukan volume air yang terus masuk dari curah hujan dan aliran regional\n\nData ini diperoleh melalui *pumping test*, *piezometer monitoring*, dan pemodelan aliran air tanah. Kapasitas pompa harus melebihi laju *inflow* maksimum untuk menjaga pit tetap kering.',
  },
  {
    order_index: 34,
    category: 'T6',
    difficulty: 'medium',
    content: 'Pompa *dewatering* mengalirkan air 200 liter/detik selama 16 jam/hari. Berapa volume air yang dipompa per hari?',
    options: [
      { key: 'A', text: '5.760 m³' },
      { key: 'B', text: '8.640 m³' },
      { key: 'C', text: '11.520 m³' },
      { key: 'D', text: '14.400 m³' },
      { key: 'E', text: '17.280 m³' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan volume air per hari:\n$$\\begin{aligned} Q &= 200 \\text{ L/s} = 0{,}2 \\text{ m}^3\\text{/s} \\\\ t &= 16 \\text{ jam} = 16 \\times 3.600 = 57.600 \\text{ s} \\\\ V &= Q \\times t = 0{,}2 \\times 57.600 = 11.520 \\text{ m}^3 \\end{aligned}$$\nVolume 11.520 m³/hari setara dengan sekitar 4,8 kolam renang olimpiade. Kolam pengendapan harus didesain mampu menampung volume ini ditambah air hujan langsung.',
  },

  // ═══════════════════════════════════════════
  // T7: Fleet Management & Dispatch (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 35,
    category: 'T7',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *cycle time* sebuah dump truck di operasi tambang?',
    options: [
      { key: 'A', text: 'Masa pakai dump truck dari pembelian hingga penggantian unit baru' },
      { key: 'B', text: 'Total waktu satu putaran lengkap: muat, angkut, buang, dan kembali kosong' },
      { key: 'C', text: 'Waktu yang dibutuhkan untuk mengganti ban dump truck di bengkel' },
      { key: 'D', text: 'Jarak total yang ditempuh dump truck selama satu shift kerja' },
      { key: 'E', text: 'Interval perawatan berkala dump truck berdasarkan jam operasi' },
    ],
    correct_answer: 'B',
    explanation: '***Cycle time*** adalah total waktu yang dibutuhkan dump truck untuk menyelesaikan **satu putaran lengkap** operasi:\n1. **Loading**: waktu pemuatan oleh excavator\n2. **Hauling** (loaded): waktu angkut menuju *dump point*\n3. **Dumping**: waktu penumpahan material\n4. **Return** (empty): waktu kembali kosong ke excavator\n5. **Queuing**: waktu tunggu di loader (jika ada antrian)\n\n*Cycle time* menentukan jumlah trip per shift dan produktivitas truk. Optimasi rute dan minimalisasi waktu tunggu adalah kunci efisiensi.',
  },
  {
    order_index: 36,
    category: 'T7',
    difficulty: 'medium',
    content: 'Apa manfaat utama penerapan teknologi GPS dan telemetri pada armada alat berat tambang?',
    options: [
      { key: 'A', text: 'Menggantikan seluruh operator dengan sistem kemudi otomatis penuh' },
      { key: 'B', text: 'Menghilangkan kebutuhan perawatan mesin karena sistem memperbaiki diri' },
      { key: 'C', text: 'Mengurangi konsumsi bahan bakar hingga nol persen secara permanen' },
      { key: 'D', text: 'Memantau posisi, kondisi mesin, dan produktivitas secara *real-time*' },
      { key: 'E', text: 'Meningkatkan kapasitas angkut truk melebihi spesifikasi pabrik' },
    ],
    correct_answer: 'D',
    explanation: 'Teknologi **GPS dan telemetri** pada alat berat memberikan data *real-time* berupa:\n- **Posisi** setiap unit di peta tambang digital\n- **Kondisi mesin**: suhu, tekanan oli, RPM, fuel level\n- **Produktivitas**: jumlah trip, payload, cycle time\n- **Perilaku operator**: kecepatan, pengereman mendadak, idling time\n\nData ini memungkinkan manajemen tambang mengambil keputusan operasional lebih cepat, merencanakan perawatan prediktif, dan mengoptimalkan penugasan armada.',
  },
  {
    order_index: 37,
    category: 'T7',
    difficulty: 'medium',
    content: 'Sebuah excavator memiliki *cycle time* pemuatan 30 detik per bucket dengan kapasitas bucket 10 ton. Dump truck berkapasitas 40 ton. Berapa waktu pemuatan satu truk penuh?',
    options: [
      { key: 'A', text: '1 menit' },
      { key: 'B', text: '2 menit' },
      { key: 'C', text: '3 menit' },
      { key: 'D', text: '4 menit' },
      { key: 'E', text: '5 menit' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan waktu pemuatan satu truk:\n$$\\begin{aligned} \\text{Jumlah bucket} &= \\frac{\\text{Kapasitas truk}}{\\text{Kapasitas bucket}} = \\frac{40}{10} = 4 \\text{ bucket} \\\\ \\text{Waktu muat} &= 4 \\times 30 = 120 \\text{ detik} = 2 \\text{ menit} \\end{aligned}$$\nDalam praktik, waktu pemuatan aktual bisa lebih lama karena faktor *swing angle*, posisi truk, dan *fill factor* bucket yang tidak selalu $100\\%$.',
  },

  // ═══════════════════════════════════════════
  // T8: Mine Closure & Reclamation (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 38,
    category: 'T8',
    difficulty: 'easy',
    content: 'Apa tujuan utama kegiatan revegetasi pada lahan bekas tambang?',
    options: [
      { key: 'A', text: 'Memulihkan tutupan vegetasi untuk mencegah erosi dan mengembalikan ekosistem' },
      { key: 'B', text: 'Menanam tanaman yang dapat menghasilkan bijih mineral tambahan' },
      { key: 'C', text: 'Menyembunyikan bekas area tambang dari pandangan udara satelit' },
      { key: 'D', text: 'Mempercepat proses pelapukan batuan untuk eksplorasi lebih lanjut' },
      { key: 'E', text: 'Mengurangi pajak perusahaan dengan mengklaim kredit karbon' },
    ],
    correct_answer: 'A',
    explanation: '**Revegetasi** bertujuan untuk:\n- **Mencegah erosi** tanah dan sedimentasi ke badan air\n- **Mengembalikan ekosistem** dengan membangun kembali habitat flora dan fauna\n- **Menstabilkan permukaan** lahan melalui sistem perakaran tanaman\n- Meningkatkan infiltrasi air dan mengurangi limpasan permukaan\n- Memperbaiki estetika lanskap\n\nProses revegetasi dimulai dari penyebaran tanah pucuk (*topsoil*), penanaman tanaman penutup, diikuti tanaman pionir, lalu tanaman lokal untuk suksesi ekosistem jangka panjang.',
  },
  {
    order_index: 39,
    category: 'T8',
    difficulty: 'medium',
    content: 'Dalam rencana penutupan tambang, mengapa *post-closure monitoring* perlu dilakukan selama bertahun-tahun?',
    options: [
      { key: 'A', text: 'Hanya untuk memenuhi formalitas administrasi perizinan pemerintah' },
      { key: 'B', text: 'Untuk melanjutkan kegiatan penambangan secara ilegal tanpa izin baru' },
      { key: 'C', text: 'Untuk memastikan stabilitas fisik, kimia, dan biologis lahan pascatambang' },
      { key: 'D', text: 'Untuk mencari deposit mineral baru di area bekas tambang yang sudah ditutup' },
      { key: 'E', text: 'Untuk menjual lahan bekas tambang dengan harga tertinggi kepada investor' },
    ],
    correct_answer: 'C',
    explanation: '***Post-closure monitoring*** diperlukan untuk memastikan:\n- **Stabilitas fisik**: lereng tetap aman, drainase berfungsi, tidak ada erosi berlebih\n- **Stabilitas kimia**: kualitas air (pH, logam terlarut) memenuhi baku mutu, AMD terkontrol\n- **Stabilitas biologis**: revegetasi berhasil, suksesi ekosistem berjalan, tidak ada spesies invasif\n\nMonitoring umumnya berlangsung **5-15 tahun** (bahkan lebih untuk tambang dengan risiko AMD tinggi) hingga semua parameter menunjukkan tren stabil dan memenuhi kriteria pelepasan (*relinquishment criteria*).',
  },
  {
    order_index: 40,
    category: 'T8',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *mine closure cost provisioning* dan mengapa harus dilakukan sejak awal operasi?',
    options: [
      { key: 'A', text: 'Pengadaan alat berat khusus untuk penutupan yang dibeli setelah tambang habis' },
      { key: 'B', text: 'Asuransi kecelakaan kerja yang dibayarkan kepada pekerja saat tambang tutup' },
      { key: 'C', text: 'Penjualan aset tambang untuk membiayai kegiatan penutupan dan rehabilitasi' },
      { key: 'D', text: 'Pembelian lahan baru untuk memindahkan operasi setelah deposit habis' },
      { key: 'E', text: 'Penyisihan dana penutupan tambang secara bertahap selama masa operasi' },
    ],
    correct_answer: 'E',
    explanation: '***Mine closure cost provisioning*** adalah **penyisihan dana penutupan** secara bertahap sepanjang umur operasi tambang. Hal ini penting karena:\n- Biaya penutupan sangat besar (bisa mencapai puluhan hingga ratusan miliar rupiah)\n- Penyisihan bertahap menghindari beban keuangan sekaligus di akhir\n- Merupakan kewajiban hukum di Indonesia (jaminan reklamasi dan pascatambang)\n- Dana dijaminkan kepada pemerintah sebagai garansi pelaksanaan\n\nBesaran dana dihitung berdasarkan estimasi biaya penutupan yang diperbarui setiap 5 tahun.',
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
  console.log(`Jumlah soal batch 2: ${questions.length}\n`)

  const { count } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)

  console.log(`Soal existing: ${count ?? 0}`)

  if (count && count > 20) {
    console.log('Menghapus soal batch 2 lama...')
    await supabase.from('questions').delete().eq('package_id', pkg.id).gte('order_index', 21)
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

  const { data, error } = await supabase
    .from('questions')
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

  // Verifikasi total
  const { count: total } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)
  console.log(`\n   Total soal package: ${total} / 40`)
}

main()
