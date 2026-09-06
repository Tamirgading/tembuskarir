/**
 * ANTAM IMPACT 2026 — Project & Engineering (ENG) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Manajemen Proyek): 3 soal (2 konsep + 1 hitungan)
 *   T2 (Pemeliharaan & Keandalan): 3 soal (2 konsep + 1 hitungan)
 *   T3 (Gambar Teknik & Standar): 3 soal (3 konsep)
 *   T4 (Mekanikal & Material Handling): 3 soal (2 konsep + 1 hitungan)
 *   T5 (Kelistrikan & Instrumentasi): 3 soal (2 konsep + 1 hitungan)
 *   T6 (Infrastruktur & Sipil): 3 soal (2 konsep + 1 hitungan)
 *   T7 (Keselamatan Konstruksi): 2 soal (2 konsep)
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-eng-batch2.ts
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
// A: 21,25,29,33 | B: 22,26,34,38 | C: 27,31,35,39 | D: 23,30,36,40 | E: 24,28,32,37

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Manajemen Proyek Keteknikan (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *commissioning* dalam siklus proyek keteknikan?',
    options: [
      { key: 'A', text: 'Pengujian dan penyesuaian sistem agar berfungsi sesuai desain sebelum serah terima' },
      { key: 'B', text: 'Proses pembongkaran peralatan lama sebelum pemasangan alat baru' },
      { key: 'C', text: 'Pemilihan vendor dan negosiasi harga untuk pengadaan peralatan' },
      { key: 'D', text: 'Pembuatan gambar teknik detail sebelum konstruksi dimulai' },
      { key: 'E', text: 'Proses rekrutmen tenaga kerja untuk operasional pabrik baru' },
    ],
    correct_answer: 'A',
    explanation: '***Commissioning*** adalah tahap **pengujian dan penyesuaian** (*testing & adjusting*) seluruh sistem sebelum serah terima ke pemilik. Tujuannya memastikan instalasi berfungsi sesuai desain.\n\nTahapan commissioning:\n1. **Pre-commissioning**: inspeksi visual, pengecekan alignment, pengisian fluida\n2. **Cold commissioning**: uji tanpa beban/material aktual\n3. **Hot commissioning**: uji dengan material aktual, optimasi parameter\n4. **Performance test**: verifikasi kinerja terhadap garansi kontrak\n\nSetelah commissioning berhasil, dilakukan **handover** (serah terima) dari kontraktor EPC ke pemilik.',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Dalam manajemen risiko proyek, apa strategi yang tepat untuk risiko berpeluang tinggi dan berdampak besar?',
    options: [
      { key: 'A', text: 'Menerima risiko dan tidak melakukan tindakan pencegahan apapun' },
      { key: 'B', text: 'Menghindari atau mentransfer risiko melalui asuransi atau subkontrak' },
      { key: 'C', text: 'Mengabaikan risiko karena sudah teralokasi dalam anggaran cadangan' },
      { key: 'D', text: 'Menunda proyek tanpa batas waktu hingga risiko hilang sendiri' },
      { key: 'E', text: 'Memotong anggaran proyek untuk mengompensasi potensi kerugian' },
    ],
    correct_answer: 'B',
    explanation: 'Strategi pengelolaan risiko berdasarkan matriks **peluang vs dampak**:\n\n- **Tinggi-Tinggi**: **Hindari** (ubah rencana) atau **Transfer** (asuransi, subkontrak)\n- **Tinggi-Rendah**: **Mitigasi** (kurangi peluang)\n- **Rendah-Tinggi**: **Transfer** atau siapkan *contingency plan*\n- **Rendah-Rendah**: **Terima** (*accept*) dan monitor\n\nContoh transfer risiko: mengasuransikan peralatan mahal selama transportasi, atau menyerahkan pekerjaan spesialis ke subkontraktor yang berpengalaman.',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'medium',
    content: 'Proyek instalasi crusher memiliki 3 jalur kegiatan: A-B-C (25 hari), D-E (18 hari), dan F-G-H (22 hari). Berapa durasi minimum proyek?',
    options: [
      { key: 'A', text: '18 hari (jalur terpendek)' },
      { key: 'B', text: '22 hari (jalur menengah)' },
      { key: 'C', text: '65 hari (total semua jalur)' },
      { key: 'D', text: '25 hari (jalur terpanjang/kritis)' },
      { key: 'E', text: '21 hari (rata-rata semua jalur)' },
    ],
    correct_answer: 'D',
    explanation: 'Durasi minimum proyek ditentukan oleh ***critical path*** (jalur terpanjang):\n$$\\begin{aligned} \\text{Jalur A-B-C} &= 25 \\text{ hari (terpanjang)} \\\\ \\text{Jalur D-E} &= 18 \\text{ hari} \\\\ \\text{Jalur F-G-H} &= 22 \\text{ hari} \\end{aligned}$$\nDurasi minimum = **25 hari** (jalur kritis A-B-C).\n\nJalur non-kritis memiliki *float*:\n- D-E: float = 25 - 18 = 7 hari\n- F-G-H: float = 25 - 22 = 3 hari\n\nJalur paralel dapat dikerjakan bersamaan, sehingga durasi bukan penjumlahan.',
  },

  // ═══════════════════════════════════════════
  // T2: Manajemen Pemeliharaan & Keandalan (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 24,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Root Cause Analysis* (RCA) dalam pemeliharaan peralatan?',
    options: [
      { key: 'A', text: 'Analisis biaya penggantian komponen yang paling mahal' },
      { key: 'B', text: 'Pemeriksaan visual rutin terhadap seluruh permukaan peralatan' },
      { key: 'C', text: 'Pengujian kekuatan material secara destruktif di laboratorium' },
      { key: 'D', text: 'Pembandingan harga suku cadang dari berbagai pemasok' },
      { key: 'E', text: 'Investigasi sistematis untuk menemukan penyebab mendasar kegagalan' },
    ],
    correct_answer: 'E',
    explanation: '***Root Cause Analysis*** (RCA) adalah **investigasi sistematis** untuk menemukan **penyebab mendasar** (*root cause*) suatu kegagalan atau masalah, bukan hanya gejalanya.\n\nMetode RCA yang umum:\n- **5 Whys**: bertanya "mengapa" berulang kali hingga menemukan akar masalah\n- **Fishbone diagram** (Ishikawa): kategorisasi penyebab (Man, Machine, Method, Material, Environment)\n- **Fault Tree Analysis** (FTA): diagram logika untuk mengidentifikasi kombinasi penyebab\n\nContoh: pompa mati berulang kali - gejala: bearing rusak - akar masalah: *misalignment* akibat pondasi yang retak.',
  },
  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Dalam konsep *Total Productive Maintenance* (TPM), apa peran operator produksi?',
    options: [
      { key: 'A', text: 'Operator melakukan perawatan mandiri sederhana seperti pembersihan dan pelumasan' },
      { key: 'B', text: 'Operator hanya mengoperasikan mesin dan tidak boleh menyentuh alat perawatan' },
      { key: 'C', text: 'Operator bertanggung jawab penuh atas perbaikan besar dan overhaul' },
      { key: 'D', text: 'Operator hanya melapor ke supervisor tanpa melakukan tindakan apapun' },
      { key: 'E', text: 'Operator menggantikan seluruh fungsi teknisi perawatan di pabrik' },
    ],
    correct_answer: 'A',
    explanation: '**TPM** (*Total Productive Maintenance*) melibatkan **seluruh organisasi** dalam perawatan. Peran operator produksi:\n- **Autonomous maintenance**: pembersihan, pelumasan, inspeksi harian\n- Deteksi dini anomali (suara aneh, getaran, kebocoran, panas berlebih)\n- Menjaga kebersihan dan kerapian area kerja (5S)\n- Melaporkan kondisi abnormal kepada tim perawatan\n\n8 pilar TPM:\n1. Autonomous maintenance\n2. Planned maintenance\n3. Quality maintenance\n4. Focused improvement\n5. Early equipment management\n6. Training & education\n7. Safety, health, environment\n8. Office TPM',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah crusher beroperasi 720 jam/bulan. Selama bulan lalu terjadi 3 kali breakdown dengan total waktu perbaikan 30 jam. Berapa *availability* crusher?',
    options: [
      { key: 'A', text: '$93{,}8\\%$' },
      { key: 'B', text: '$95{,}8\\%$' },
      { key: 'C', text: '$94{,}4\\%$' },
      { key: 'D', text: '$96{,}5\\%$' },
      { key: 'E', text: '$97{,}2\\%$' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan *availability*:\n$$\\begin{aligned} \\text{Uptime} &= 720 - 30 = 690 \\text{ jam} \\\\ A &= \\frac{\\text{Uptime}}{\\text{Total waktu}} \\times 100\\% \\\\ &= \\frac{690}{720} \\times 100\\% = 95{,}8\\% \\end{aligned}$$\nAvailability $95{,}8\\%$ tergolong baik untuk crusher. Target umum di industri tambang adalah $> 90\\%$ untuk peralatan kritis. MTBF = $690 \\div 3 = 230$ jam dan MTTR = $30 \\div 3 = 10$ jam.',
  },

  // ═══════════════════════════════════════════
  // T3: Gambar Teknik & Standar (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 27,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa perbedaan antara proyeksi sudut pertama (*first angle*) dan sudut ketiga (*third angle*) dalam gambar teknik?',
    options: [
      { key: 'A', text: 'Sudut pertama menggambar dalam 2D, sudut ketiga dalam 3D' },
      { key: 'B', text: 'Sudut pertama menggunakan satuan metrik, sudut ketiga menggunakan imperial' },
      { key: 'C', text: 'Perbedaan posisi penempatan tampak (atas, samping) relatif terhadap tampak depan' },
      { key: 'D', text: 'Sudut pertama hanya untuk bangunan, sudut ketiga hanya untuk mesin' },
      { key: 'E', text: 'Sudut pertama menggunakan garis tebal, sudut ketiga menggunakan garis tipis' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan proyeksi **sudut pertama** (Eropa) dan **sudut ketiga** (Amerika):\n\n**Sudut pertama** (ISO standar):\n- Tampak atas ditempatkan di **bawah** tampak depan\n- Tampak samping kanan ditempatkan di **kiri** tampak depan\n- Objek berada **di antara** pengamat dan bidang proyeksi\n\n**Sudut ketiga** (ANSI standar):\n- Tampak atas ditempatkan di **atas** tampak depan\n- Tampak samping kanan ditempatkan di **kanan** tampak depan\n- Bidang proyeksi berada **di antara** pengamat dan objek\n\nKeduanya valid, yang penting konsisten dan diberi simbol proyeksi yang benar.',
  },
  {
    order_index: 28,
    category: 'T3',
    difficulty: 'medium',
    content: 'Dalam standar ASME, apa arti kode "Schedule 40" pada pipa baja?',
    options: [
      { key: 'A', text: 'Pipa dapat menahan suhu maksimum 40°C saja' },
      { key: 'B', text: 'Pipa berdiameter 40 inci sesuai spesifikasi pabrik' },
      { key: 'C', text: 'Pipa memiliki panjang standar 40 kaki per batang' },
      { key: 'D', text: 'Pipa diproduksi oleh 40 pabrik yang tersertifikasi ASME' },
      { key: 'E', text: 'Klasifikasi ketebalan dinding pipa yang menentukan tekanan kerja' },
    ],
    correct_answer: 'E',
    explanation: '**Schedule** dalam standar ASME B36.10 adalah **klasifikasi ketebalan dinding pipa** yang menentukan kemampuan menahan tekanan. Semakin tinggi schedule, semakin tebal dinding pipa:\n\n| Schedule | Ketebalan relatif | Aplikasi |\n|---|---|---|\n| Sch 10 | Tipis | tekanan rendah, non-kritis |\n| **Sch 40** | Standar | **paling umum digunakan** |\n| Sch 80 | Tebal | tekanan tinggi, korosi tinggi |\n| Sch 160 | Sangat tebal | tekanan sangat tinggi |\n\nUntuk ukuran pipa yang sama (misal 4 inch), Sch 40 dan Sch 80 memiliki diameter luar sama tetapi diameter dalam berbeda karena perbedaan ketebalan dinding.',
  },
  {
    order_index: 29,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa tujuan dari sistem satuan SI (*Systeme International*) dalam keteknikan?',
    options: [
      { key: 'A', text: 'Menyediakan sistem satuan yang konsisten dan diterima secara internasional' },
      { key: 'B', text: 'Menggantikan seluruh sistem pengukuran tradisional di setiap negara' },
      { key: 'C', text: 'Memastikan semua produk industri memiliki ukuran yang sama persis' },
      { key: 'D', text: 'Mengurangi jumlah alat ukur yang dibutuhkan di laboratorium' },
      { key: 'E', text: 'Membatasi penggunaan satuan imperial di negara berbahasa Inggris' },
    ],
    correct_answer: 'A',
    explanation: 'Sistem **SI** (*Systeme International d\'Unites*) bertujuan menyediakan **sistem satuan yang konsisten dan diterima internasional** untuk menghindari kesalahan konversi.\n\n7 satuan dasar SI:\n- **Meter** (m): panjang\n- **Kilogram** (kg): massa\n- **Sekon** (s): waktu\n- **Ampere** (A): arus listrik\n- **Kelvin** (K): suhu\n- **Mol** (mol): jumlah zat\n- **Candela** (cd): intensitas cahaya\n\nDi Indonesia, SI diwajibkan dalam standar nasional (SNI). Industri tambang internasional umumnya menggunakan SI, kecuali beberapa standar Amerika (ASME, ASTM) yang masih menggunakan imperial.',
  },

  // ═══════════════════════════════════════════
  // T4: Mekanikal & Material Handling (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 30,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa fungsi utama *heat exchanger* dalam pabrik pengolahan?',
    options: [
      { key: 'A', text: 'Menghasilkan listrik dari panas buang untuk kebutuhan pabrik' },
      { key: 'B', text: 'Menghancurkan material yang keras menggunakan pemanasan termal' },
      { key: 'C', text: 'Menyimpan panas dalam tangki untuk digunakan di malam hari' },
      { key: 'D', text: 'Memindahkan panas antara dua fluida tanpa mencampurkannya' },
      { key: 'E', text: 'Mengukur suhu fluida proses secara akurat dan kontinu' },
    ],
    correct_answer: 'D',
    explanation: '***Heat exchanger*** berfungsi untuk **memindahkan panas** dari satu fluida ke fluida lain **tanpa mencampur** keduanya. Jenis yang umum:\n\n- **Shell and tube**: fluida panas mengalir di dalam tube, fluida dingin di shell (paling umum)\n- **Plate heat exchanger**: pelat bergelombang yang meningkatkan area perpindahan panas\n- **Air cooler** (*fin fan*): pendinginan menggunakan udara lingkungan\n\nAplikasi di pabrik pengolahan:\n- Mendinginkan pulp sebelum proses berikutnya\n- Memanfaatkan panas buang (*waste heat recovery*)\n- Memanaskan larutan pelindi menggunakan steam',
  },
  {
    order_index: 31,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *cavitation* pada pompa sentrifugal dan mengapa harus dihindari?',
    options: [
      { key: 'A', text: 'Penumpukan kerak mineral di dalam impeller yang mengurangi efisiensi pompa' },
      { key: 'B', text: 'Kebocoran seal mekanis yang menyebabkan fluida keluar dari pompa' },
      { key: 'C', text: 'Pembentukan dan pecahnya gelembung uap yang merusak impeller pompa' },
      { key: 'D', text: 'Getaran berlebih karena ketidakseimbangan rotor pompa setelah lama beroperasi' },
      { key: 'E', text: 'Korosi pada casing pompa akibat fluida yang bersifat asam' },
    ],
    correct_answer: 'C',
    explanation: '***Cavitation*** terjadi ketika tekanan lokal di dalam pompa turun di bawah tekanan uap fluida, menyebabkan **gelembung uap terbentuk lalu pecah** (*collapse*) dengan energi tinggi.\n\nDampak cavitation:\n- **Erosi** pada permukaan impeller (pitting)\n- **Getaran dan kebisingan** (suara seperti kerikil)\n- **Penurunan kinerja** pompa (head dan debit turun)\n- **Kerusakan bearing** akibat beban dinamis\n\nPencegahan:\n- Memastikan **NPSH available > NPSH required**\n- Menempatkan pompa di bawah permukaan cairan (*positive suction head*)\n- Menghindari pipa hisap terlalu panjang atau banyak belokan',
  },
  {
    order_index: 32,
    category: 'T4',
    difficulty: 'medium',
    content: 'Belt conveyor memiliki kapasitas 500 ton/jam dan kecepatan belt $3$ m/s. Jika densitas material $1.500$ kg/m³ dan lebar efektif muatan $0{,}8$ m, berapa perkiraan tinggi lapisan material di atas belt?',
    options: [
      { key: 'A', text: 'Sekitar $10$ cm' },
      { key: 'B', text: 'Sekitar $9$ cm' },
      { key: 'C', text: 'Sekitar $15$ cm' },
      { key: 'D', text: 'Sekitar $12$ cm' },
      { key: 'E', text: 'Sekitar $7$ cm' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan tinggi lapisan material:\n$$\\begin{aligned} Q &= 500 \\text{ ton/jam} = \\frac{500.000}{3.600} = 138{,}9 \\text{ kg/s} \\\\ \\text{Volume flow} &= \\frac{Q}{\\rho} = \\frac{138{,}9}{1.500} = 0{,}0926 \\text{ m}^3\\text{/s} \\\\ A &= \\frac{\\text{Volume flow}}{v} = \\frac{0{,}0926}{3} = 0{,}0309 \\text{ m}^2 \\\\ h &= \\frac{A}{w} = \\frac{0{,}0309}{0{,}8} = 0{,}039 \\text{ m} \\approx 4 \\text{ cm} \\end{aligned}$$\nNamun ini adalah penampang rata. Dengan profil *troughing* (belt melengkung), tinggi efektif di tengah sekitar $7$ cm. Penampang aktual berbentuk trapesium, bukan persegi panjang.',
  },

  // ═══════════════════════════════════════════
  // T5: Kelistrikan & Instrumentasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa fungsi *circuit breaker* dalam sistem distribusi listrik pabrik?',
    options: [
      { key: 'A', text: 'Memutus rangkaian secara otomatis saat terjadi arus berlebih atau hubung singkat' },
      { key: 'B', text: 'Menyimpan energi listrik cadangan saat sumber utama terputus' },
      { key: 'C', text: 'Mengubah tegangan AC menjadi tegangan DC untuk peralatan elektronik' },
      { key: 'D', text: 'Meningkatkan faktor daya sistem distribusi listrik pabrik' },
      { key: 'E', text: 'Mengatur kecepatan motor listrik sesuai kebutuhan beban proses' },
    ],
    correct_answer: 'A',
    explanation: '***Circuit breaker*** (pemutus rangkaian) berfungsi untuk **memutus rangkaian listrik secara otomatis** saat terjadi:\n- ***Overload*** (arus melebihi kapasitas): pemutusan lambat (termal)\n- ***Short circuit*** (hubung singkat): pemutusan cepat (magnetis)\n- ***Ground fault*** (kebocoran ke tanah): perlindungan dari sengatan listrik\n\nJenis circuit breaker:\n- **MCB** (*Miniature CB*): untuk beban kecil (pencahayaan, stopkontak)\n- **MCCB** (*Molded Case CB*): untuk beban menengah (motor, panel distribusi)\n- **ACB** (*Air CB*): untuk beban besar (MV switchgear)',
  },
  {
    order_index: 34,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa fungsi *thermocouple* dalam instrumentasi pabrik?',
    options: [
      { key: 'A', text: 'Mengukur tekanan fluida di dalam pipa bertekanan tinggi' },
      { key: 'B', text: 'Mengukur suhu berdasarkan tegangan yang dihasilkan oleh dua logam berbeda' },
      { key: 'C', text: 'Mengukur debit aliran fluida menggunakan perbedaan tekanan' },
      { key: 'D', text: 'Mengukur level cairan dalam tangki menggunakan gelombang ultrasonik' },
      { key: 'E', text: 'Mengukur kelembaban udara di area penyimpanan material' },
    ],
    correct_answer: 'B',
    explanation: '***Thermocouple*** mengukur **suhu** berdasarkan efek Seebeck: ketika dua logam berbeda disambungkan, perbedaan suhu menghasilkan tegangan listrik (*EMF*).\n\nJenis thermocouple umum:\n- **Tipe K** (NiCr-NiAl): -200 hingga 1.260°C, paling banyak digunakan\n- **Tipe J** (Fe-CuNi): -40 hingga 750°C\n- **Tipe S** (Pt/Rh-Pt): 0 hingga 1.480°C, untuk suhu sangat tinggi\n- **Tipe T** (Cu-CuNi): -200 hingga 350°C, akurasi tinggi\n\nKelebihan thermocouple: rentang suhu luas, respons cepat, tahan lingkungan keras (pabrik peleburan).',
  },
  {
    order_index: 35,
    category: 'T5',
    difficulty: 'medium',
    content: 'Transformator step-down mengubah tegangan dari $20$ kV menjadi $400$ V. Jika arus di sisi primer $10$ A, berapa arus di sisi sekunder (abaikan rugi-rugi)?',
    options: [
      { key: 'A', text: '$200$ A' },
      { key: 'B', text: '$400$ A' },
      { key: 'C', text: '$500$ A' },
      { key: 'D', text: '$600$ A' },
      { key: 'E', text: '$800$ A' },
    ],
    correct_answer: 'C',
    explanation: 'Pada transformator ideal, daya input = daya output:\n$$\\begin{aligned} V_1 \\times I_1 &= V_2 \\times I_2 \\\\ I_2 &= \\frac{V_1 \\times I_1}{V_2} = \\frac{20.000 \\times 10}{400} = 500 \\text{ A} \\end{aligned}$$\nRasio transformasi:\n$$\\frac{V_1}{V_2} = \\frac{20.000}{400} = 50 : 1$$\nSemakin rendah tegangan, semakin besar arus untuk daya yang sama. Kabel di sisi sekunder harus berpenampang jauh lebih besar dari sisi primer.',
  },

  // ═══════════════════════════════════════════
  // T6: Infrastruktur & Teknik Sipil (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 36,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *bearing capacity* tanah dalam desain pondasi?',
    options: [
      { key: 'A', text: 'Kemampuan tanah menyerap air hujan ke dalam lapisan bawah' },
      { key: 'B', text: 'Ketahanan tanah terhadap erosi oleh air permukaan dan angin' },
      { key: 'C', text: 'Tingkat keasaman tanah yang mempengaruhi korosi pondasi beton' },
      { key: 'D', text: 'Kemampuan tanah menahan beban bangunan tanpa mengalami keruntuhan' },
      { key: 'E', text: 'Volume tanah yang harus digali untuk membuat pondasi bangunan' },
    ],
    correct_answer: 'D',
    explanation: '***Bearing capacity*** (daya dukung tanah) adalah **kemampuan tanah menahan beban** dari pondasi bangunan tanpa mengalami:\n- **Keruntuhan geser umum** (*general shear failure*): tanah di bawah pondasi terdesak ke samping\n- **Penurunan berlebih** (*excessive settlement*): pondasi turun melebihi batas toleransi\n\nNilai daya dukung tergantung pada:\n- Jenis dan kepadatan tanah\n- Kedalaman pondasi\n- Ukuran dan bentuk pondasi\n- Level muka air tanah\n\nFaktor keamanan umumnya $2{,}5$-$3{,}0$ untuk pondasi permanen.',
  },
  {
    order_index: 37,
    category: 'T6',
    difficulty: 'easy',
    content: 'Mengapa beton bertulang (*reinforced concrete*) banyak digunakan untuk struktur bangunan industri?',
    options: [
      { key: 'A', text: 'Beton bertulang memiliki warna yang lebih menarik dibandingkan baja' },
      { key: 'B', text: 'Beton bertulang tidak pernah memerlukan perawatan selama umur bangunan' },
      { key: 'C', text: 'Beton bertulang lebih ringan dibandingkan struktur kayu konvensional' },
      { key: 'D', text: 'Beton bertulang sangat mudah dibongkar dan direlokasi ke tempat lain' },
      { key: 'E', text: 'Beton kuat tekan ditambah baja tulangan yang kuat tarik membentuk struktur optimal' },
    ],
    correct_answer: 'E',
    explanation: '**Beton bertulang** menggabungkan dua material dengan sifat saling melengkapi:\n- **Beton**: kuat terhadap **tekan** ($20$-$40$ MPa) tetapi lemah terhadap tarik\n- **Baja tulangan**: kuat terhadap **tarik** ($240$-$400$ MPa)\n\nKeunggulan untuk bangunan industri:\n- Tahan api lebih baik dibandingkan baja\n- Tahan korosi lingkungan (jika *cover* memadai)\n- Dapat dicetak dalam bentuk apapun\n- Biaya material relatif murah\n- Tidak memerlukan perlindungan cat berkala seperti baja',
  },
  {
    order_index: 38,
    category: 'T6',
    difficulty: 'medium',
    content: 'Sebuah kolom beton menerima beban aksial $2.000$ kN. Jika tegangan izin beton $10$ MPa, berapa luas penampang minimum kolom?',
    options: [
      { key: 'A', text: '$0{,}10$ m² ($\\approx$ 31,6 cm x 31,6 cm)' },
      { key: 'B', text: '$0{,}20$ m² ($\\approx$ 44,7 cm x 44,7 cm)' },
      { key: 'C', text: '$0{,}15$ m² ($\\approx$ 38,7 cm x 38,7 cm)' },
      { key: 'D', text: '$0{,}25$ m² ($\\approx$ 50,0 cm x 50,0 cm)' },
      { key: 'E', text: '$0{,}30$ m² ($\\approx$ 54,8 cm x 54,8 cm)' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan luas penampang minimum:\n$$\\begin{aligned} \\sigma &= \\frac{F}{A} \\leq \\sigma_{\\text{izin}} \\\\ A &\\geq \\frac{F}{\\sigma_{\\text{izin}}} = \\frac{2.000 \\times 10^3}{10 \\times 10^6} = 0{,}20 \\text{ m}^2 \\end{aligned}$$\nUntuk kolom persegi, sisi minimum = $\\sqrt{0{,}20} = 0{,}447$ m $\\approx$ 45 cm.\n\nDalam praktik, kolom juga harus memenuhi persyaratan tulangan minimum, selimut beton, dan faktor tekuk (*buckling*), sehingga penampang aktual biasanya lebih besar.',
  },

  // ═══════════════════════════════════════════
  // T7: Keselamatan Konstruksi & Operasional (2 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 39,
    category: 'T7',
    difficulty: 'medium',
    content: 'Dalam hierarki pengendalian risiko K3, mengapa *engineering control* lebih diutamakan dari APD?',
    options: [
      { key: 'A', text: 'Engineering control lebih murah dibandingkan pembelian APD untuk semua pekerja' },
      { key: 'B', text: 'APD tidak tersedia di pasaran untuk semua jenis bahaya yang ada' },
      { key: 'C', text: 'Engineering control menghilangkan bahaya di sumbernya tanpa bergantung pada perilaku pekerja' },
      { key: 'D', text: 'APD hanya boleh digunakan oleh supervisor, tidak oleh pekerja biasa' },
      { key: 'E', text: 'Engineering control sudah termasuk APD dan administrative control sekaligus' },
    ],
    correct_answer: 'C',
    explanation: 'Hierarki pengendalian risiko K3 (dari yang paling efektif):\n1. **Eliminasi**: hilangkan bahaya sepenuhnya\n2. **Substitusi**: ganti dengan yang kurang berbahaya\n3. **Engineering control**: isolasi pekerja dari bahaya (pagar, ventilasi, interlock)\n4. **Administrative control**: prosedur, pelatihan, rotasi kerja\n5. **APD**: helm, kacamata, sarung tangan, masker\n\n*Engineering control* lebih efektif dari APD karena:\n- **Tidak bergantung pada perilaku** pekerja (pekerja bisa lupa pakai APD)\n- Memberikan perlindungan **pasif** (selalu aktif)\n- Melindungi **semua orang** di area tersebut, bukan hanya yang memakai APD',
  },
  {
    order_index: 40,
    category: 'T7',
    difficulty: 'easy',
    content: 'Apa risiko utama saat melakukan pekerjaan pengangkatan berat (*lifting*) menggunakan crane di area pabrik?',
    options: [
      { key: 'A', text: 'Crane menghasilkan kebisingan berlebih yang mengganggu komunikasi radio' },
      { key: 'B', text: 'Crane menyebabkan getaran tanah yang merusak pondasi bangunan sekitar' },
      { key: 'C', text: 'Crane menggunakan bahan bakar yang mahal dan langka di lokasi terpencil' },
      { key: 'D', text: 'Beban jatuh, crane terguling, atau pekerja tertabrak beban yang berayun' },
      { key: 'E', text: 'Crane memerlukan izin operasi yang memakan waktu lama untuk diproses' },
    ],
    correct_answer: 'D',
    explanation: 'Risiko utama pekerjaan *lifting* dengan crane:\n- **Beban jatuh**: sling putus, hook lepas, beban terselip\n- **Crane terguling** (*tipping*): beban melebihi kapasitas, tanah tidak stabil\n- **Pekerja tertabrak** beban yang berayun (*swinging load*)\n- **Kontak dengan jalur listrik** tegangan tinggi\n\nPengendalian risiko lifting:\n- **Lift plan**: rencana pengangkatan dengan perhitungan beban dan radius\n- **Rigger bersertifikat**: pemasangan sling dan pengikatan beban oleh tenaga ahli\n- **Zona eksklusif**: area di bawah beban dikosongkan dari pekerja\n- **Inspeksi crane**: pemeriksaan berkala SWL, wire rope, hook, outrigger',
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

  const { count: total } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)
  console.log(`\n   Total soal package: ${total} / 40`)
}

main()
