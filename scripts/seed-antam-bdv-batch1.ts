/**
 * ANTAM IMPACT 2026 — Business Development (BDV) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Rantai Nilai Industri Tambang): 4 soal
 *   T2 (Evaluasi Kelayakan & Pemodelan Finansial): 4 soal
 *   T3 (Strategi Bisnis & Analisis Kinerja): 3 soal
 *   T4 (Kemitraan Strategis & Joint Venture): 3 soal
 *   T5 (Analisis Data untuk Keputusan Bisnis): 3 soal
 *   T6 (Manajemen Risiko Bisnis & Investasi): 3 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-bdv-batch1.ts
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
// A: 3,7,14,18 | B: 1,10,15,19 | C: 4,8,11,16 | D: 2,9,13,20 | E: 5,6,12,17

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Rantai Nilai Industri Tambang (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa urutan yang benar dalam siklus proyek tambang (*mining project lifecycle*)?',
    options: [
      { key: 'A', text: 'Konstruksi, eksplorasi, studi kelayakan, produksi, penutupan' },
      { key: 'B', text: 'Eksplorasi, studi kelayakan, konstruksi, produksi, penutupan dan reklamasi' },
      { key: 'C', text: 'Studi kelayakan, eksplorasi, produksi, konstruksi, penutupan' },
      { key: 'D', text: 'Produksi, eksplorasi, konstruksi, studi kelayakan, penutupan' },
      { key: 'E', text: 'Eksplorasi, konstruksi, produksi, studi kelayakan, penutupan' },
    ],
    correct_answer: 'B',
    explanation: 'Urutan siklus proyek tambang:\n\n1. **Eksplorasi**: pencarian dan delineasi deposit mineral\n   - *Greenfield exploration* → *brownfield* → *resource estimation*\n2. **Studi kelayakan**: evaluasi teknis dan ekonomis\n   - *Scoping study* → *PFS* → *DFS/BFS*\n3. **Konstruksi**: pembangunan infrastruktur dan fasilitas\n   - Perizinan, EPC, *commissioning*\n4. **Produksi**: operasi penambangan dan pengolahan\n   - *Ramp-up* → *steady state* → *decline*\n5. **Penutupan dan reklamasi**: rehabilitasi lahan dan penutupan tambang\n   - Reklamasi, *monitoring* pasca-tambang\n\nDurasi tiap fase sangat bervariasi:\n- Eksplorasi: 2-10 tahun\n- Studi + konstruksi: 3-7 tahun\n- Produksi: 10-50+ tahun\n- Penutupan: 5-15+ tahun',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa perbedaan antara CAPEX dan OPEX dalam konteks proyek tambang?',
    options: [
      { key: 'A', text: 'CAPEX untuk tambang bawah tanah, OPEX untuk tambang terbuka' },
      { key: 'B', text: 'CAPEX untuk biaya tenaga kerja, OPEX untuk biaya peralatan' },
      { key: 'C', text: 'CAPEX hanya dikeluarkan sekali, OPEX dikeluarkan setiap bulan' },
      { key: 'D', text: 'CAPEX adalah belanja modal untuk investasi aset, OPEX adalah biaya operasional rutin' },
      { key: 'E', text: 'CAPEX dibiayai pemerintah, OPEX dibiayai perusahaan' },
    ],
    correct_answer: 'D',
    explanation: 'Perbedaan **CAPEX** dan **OPEX**:\n\n| Aspek | CAPEX | OPEX |\n|---|---|---|\n| **Definisi** | *Capital Expenditure* (belanja modal) | *Operating Expenditure* (biaya operasional) |\n| **Sifat** | Investasi **aset** jangka panjang | Biaya **rutin** operasional |\n| **Periode** | Saat konstruksi/ekspansi | Selama operasi |\n| **Akuntansi** | Dikapitalisasi, didepresiasi | Dibebankan langsung |\n\nContoh di tambang:\n- **CAPEX**: pembelian excavator, pembangunan pabrik smelter, infrastruktur jalan, pembangkit listrik\n- **OPEX**: bahan bakar, gaji karyawan, reagent, pemeliharaan, royalti\n\nUntuk proyek nikel smelter RKEF:\n- CAPEX: $\\$500$-$800$ juta (tergantung kapasitas)\n- OPEX: $\\$8.000$-$12.000$ per ton nikel',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan hilirisasi (*downstream processing*) dalam konteks kebijakan mineral Indonesia?',
    options: [
      { key: 'A', text: 'Pengolahan dan pemurnian mineral di dalam negeri sebelum diekspor untuk meningkatkan nilai tambah' },
      { key: 'B', text: 'Proses pengiriman bijih mentah langsung ke pelabuhan untuk ekspor cepat' },
      { key: 'C', text: 'Pengurangan kapasitas produksi tambang untuk melestarikan cadangan mineral' },
      { key: 'D', text: 'Pembelian teknologi pengolahan dari luar negeri untuk dioperasikan di Indonesia' },
      { key: 'E', text: 'Penambangan di daerah hilir sungai yang memiliki endapan alluvial' },
    ],
    correct_answer: 'A',
    explanation: '**Hilirisasi** adalah **pengolahan dan pemurnian mineral di dalam negeri** sebelum diekspor untuk **meningkatkan nilai tambah**.\n\nDasar hukum: **UU No. 3/2020** tentang Minerba mewajibkan pengolahan dan pemurnian dalam negeri.\n\nContoh hilirisasi nikel:\n\n| Produk | Kadar Ni | Nilai tambah |\n|---|---|---|\n| Bijih mentah | 1,5-2% | Rendah (dilarang ekspor) |\n| **NPI** | 8-15% | Sedang |\n| **Feronikel** | 20-40% | Tinggi |\n| **MHP/NiSO$_4$** | Ni murni | Sangat tinggi (baterai EV) |\n| **Stainless steel** | Produk jadi | Tertinggi |\n\nDampak hilirisasi:\n- **Positif**: nilai ekspor naik, lapangan kerja, transfer teknologi\n- **Tantangan**: investasi besar, kebutuhan energi, dampak lingkungan',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa komoditas utama yang dihasilkan ANTAM?',
    options: [
      { key: 'A', text: 'Minyak bumi, gas alam, dan batubara' },
      { key: 'B', text: 'Timah, tembaga, dan seng' },
      { key: 'C', text: 'Nikel, emas, dan bauksit' },
      { key: 'D', text: 'Besi, mangan, dan kromit' },
      { key: 'E', text: 'Berlian, batu permata, dan mutiara' },
    ],
    correct_answer: 'C',
    explanation: '**ANTAM** (PT Aneka Tambang Tbk) menghasilkan tiga komoditas utama:\n\n| Komoditas | Produk | Lokasi |\n|---|---|---|\n| **Nikel** | Feronikel, bijih nikel | Sulawesi Tenggara, Maluku Utara |\n| **Emas** | Logam mulia, emas batangan | Pongkor (Jawa Barat), UBPP Jakarta |\n| **Bauksit** | Bijih bauksit, *chemical grade alumina* | Kalimantan Barat, Bintan |\n\nNikel merupakan kontributor pendapatan terbesar ANTAM. Perusahaan juga terlibat dalam industri hilir melalui:\n- **PT Indonesia Chemical Alumina** (ICA): pengolahan bauksit menjadi *chemical grade alumina*\n- **PT ANTAM Tbk UBPN**: pengolahan nikel menjadi feronikel\n- **UBPP Logam Mulia**: pemurnian emas dan perak',
  },

  // ═══════════════════════════════════════════
  // T2: Evaluasi Kelayakan & Pemodelan Finansial (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Net Present Value* (NPV) dalam evaluasi proyek tambang?',
    options: [
      { key: 'A', text: 'Total pendapatan yang dihasilkan proyek selama masa operasi' },
      { key: 'B', text: 'Selisih antara total biaya dan total pendapatan tanpa mempertimbangkan waktu' },
      { key: 'C', text: 'Nilai pasar aset tambang pada saat ini berdasarkan harga saham' },
      { key: 'D', text: 'Jumlah dividen yang dibagikan kepada pemegang saham selama proyek berlangsung' },
      { key: 'E', text: 'Selisih antara nilai sekarang arus kas masuk dan keluar selama umur proyek' },
    ],
    correct_answer: 'E',
    explanation: '***Net Present Value*** (NPV) = **selisih antara nilai sekarang** (*present value*) **arus kas masuk dan keluar** selama umur proyek.\n\n$$\\text{NPV} = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}$$\n\nDi mana:\n- $CF_t$ = arus kas pada tahun ke-$t$ (negatif untuk investasi, positif untuk pendapatan)\n- $r$ = *discount rate* (tingkat diskonto)\n- $n$ = umur proyek\n\nKeputusan investasi:\n- **NPV > 0**: proyek layak (menghasilkan nilai lebih dari biaya modal)\n- **NPV = 0**: proyek impas\n- **NPV < 0**: proyek tidak layak\n\nDiscount rate biasanya menggunakan **WACC** (*Weighted Average Cost of Capital*), umumnya 8-12% untuk proyek tambang.',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Proyek smelter memiliki investasi awal $\\$100$ juta dan menghasilkan arus kas bersih $\\$25$ juta per tahun. Berapa *payback period* sederhana?',
    options: [
      { key: 'A', text: '2 tahun' },
      { key: 'B', text: '2,5 tahun' },
      { key: 'C', text: '5 tahun' },
      { key: 'D', text: '25 tahun' },
      { key: 'E', text: '4 tahun' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan *simple payback period*:\n$$\\text{Payback period} = \\frac{\\text{Investasi awal}}{\\text{Arus kas bersih per tahun}} = \\frac{\\$100 \\text{ juta}}{\\$25 \\text{ juta/tahun}} = 4 \\text{ tahun}$$\n\nInterpretasi:\n- Investasi akan **kembali** dalam **4 tahun**\n- Untuk proyek tambang/smelter, payback period 4 tahun tergolong **baik**\n- Target umum: < 5-7 tahun\n\nKeterbatasan *simple payback period*:\n- Tidak memperhitungkan **nilai waktu uang** (*time value of money*)\n- Tidak memperhitungkan arus kas **setelah** payback period\n- Tidak mengukur **profitabilitas** total proyek\n\nUntuk evaluasi lebih komprehensif, gunakan **NPV**, **IRR**, dan **discounted payback period**.',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Internal Rate of Return* (IRR) dalam evaluasi investasi?',
    options: [
      { key: 'A', text: 'Tingkat diskonto yang membuat NPV proyek sama dengan nol' },
      { key: 'B', text: 'Persentase keuntungan tahunan yang dijanjikan bank untuk deposito' },
      { key: 'C', text: 'Tingkat inflasi yang digunakan dalam perhitungan biaya proyek' },
      { key: 'D', text: 'Persentase saham perusahaan yang dimiliki oleh investor internal' },
      { key: 'E', text: 'Jumlah pengembalian investasi dalam mata uang asing' },
    ],
    correct_answer: 'A',
    explanation: '***Internal Rate of Return*** (IRR) adalah **tingkat diskonto yang membuat NPV = 0**.\n\n$$\\text{NPV} = \\sum_{t=0}^{n} \\frac{CF_t}{(1+\\text{IRR})^t} = 0$$\n\nKeputusan investasi:\n- **IRR > WACC**: proyek layak (return lebih tinggi dari biaya modal)\n- **IRR < WACC**: proyek tidak layak\n- Semakin tinggi IRR, semakin menarik proyek\n\nBenchmark IRR untuk proyek tambang:\n- Proyek brownfield (ekspansi): IRR > 15%\n- Proyek greenfield (baru): IRR > 20%\n- Proyek berisiko tinggi: IRR > 25%\n\nKeterbatasan IRR:\n- Bisa memberikan **multiple IRR** untuk arus kas non-konvensional\n- Tidak cocok membandingkan proyek dengan **skala investasi berbeda**\n- Perlu digunakan bersama NPV untuk keputusan optimal',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa fungsi analisis sensitivitas dalam studi kelayakan proyek tambang?',
    options: [
      { key: 'A', text: 'Mengukur ketahanan bangunan terhadap gempa bumi dan bencana alam' },
      { key: 'B', text: 'Menguji kepekaan hewan dan tumbuhan di sekitar lokasi tambang terhadap polusi' },
      { key: 'C', text: 'Mengukur dampak perubahan variabel kunci terhadap kelayakan finansial proyek' },
      { key: 'D', text: 'Mengevaluasi sensitivitas alat ukur laboratorium terhadap perubahan suhu' },
      { key: 'E', text: 'Menentukan kadar minimum mineral yang dapat ditambang secara ekonomis' },
    ],
    correct_answer: 'C',
    explanation: '**Analisis sensitivitas** mengukur **dampak perubahan variabel kunci** terhadap kelayakan finansial (NPV, IRR) proyek.\n\nVariabel kunci yang diuji:\n\n| Variabel | Contoh variasi |\n|---|---|\n| **Harga komoditas** | $\\pm 20\\%$ dari asumsi dasar |\n| **Biaya operasi** | $\\pm 15\\%$ |\n| **CAPEX** | $\\pm 20\\%$ (sering *overrun*) |\n| **Kadar bijih** | $\\pm 10\\%$ |\n| **Kurs mata uang** | $\\pm 10\\%$ |\n| **Discount rate** | $\\pm 2\\%$ |\n\nHasil: grafik **spider/tornado** yang menunjukkan variabel mana yang paling berpengaruh.\n\nBiasanya **harga komoditas** dan **kadar bijih** adalah variabel paling sensitif untuk proyek tambang. Investor fokus pada *downside scenario* untuk menilai risiko.',
  },

  // ═══════════════════════════════════════════
  // T3: Strategi Bisnis & Analisis Kinerja (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa komponen analisis SWOT dan bagaimana penerapannya untuk perusahaan tambang?',
    options: [
      { key: 'A', text: 'Safety, Water, Operations, Technology - analisis teknis operasional' },
      { key: 'B', text: 'Sales, Wages, Output, Tax - analisis keuangan perusahaan' },
      { key: 'C', text: 'Supply, Workforce, Ore, Transport - analisis rantai pasok tambang' },
      { key: 'D', text: 'Strengths, Weaknesses, Opportunities, Threats - analisis posisi strategis perusahaan' },
      { key: 'E', text: 'Standards, Workforce, Objectives, Targets - analisis manajemen SDM' },
    ],
    correct_answer: 'D',
    explanation: '**SWOT** = ***Strengths, Weaknesses, Opportunities, Threats*** - kerangka analisis **posisi strategis** perusahaan.\n\n| Internal | Eksternal |\n|---|---|\n| **Strengths** (Kekuatan) | **Opportunities** (Peluang) |\n| **Weaknesses** (Kelemahan) | **Threats** (Ancaman) |\n\nContoh SWOT untuk ANTAM:\n- **S**: cadangan nikel besar, reputasi BUMN, jaringan pelanggan mapan\n- **W**: biaya produksi tinggi, ketergantungan pada satu komoditas utama\n- **O**: permintaan nikel untuk baterai EV melonjak, hilirisasi meningkatkan margin\n- **T**: kompetisi dari smelter China di Indonesia, regulasi lingkungan semakin ketat, fluktuasi harga LME\n\nSWOT membantu merumuskan strategi:\n- **SO**: memanfaatkan kekuatan untuk menangkap peluang\n- **WO**: mengatasi kelemahan untuk menangkap peluang\n- **ST**: menggunakan kekuatan menghadapi ancaman\n- **WT**: meminimalkan kelemahan dan ancaman',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Key Performance Indicator* (KPI) dalam manajemen kinerja bisnis?',
    options: [
      { key: 'A', text: 'Daftar inventaris peralatan kunci yang digunakan dalam operasi tambang' },
      { key: 'B', text: 'Metrik terukur yang menunjukkan seberapa efektif perusahaan mencapai tujuan bisnisnya' },
      { key: 'C', text: 'Kunci akses digital yang digunakan oleh karyawan untuk masuk ke sistem informasi' },
      { key: 'D', text: 'Program pelatihan karyawan kunci di bidang-bidang strategis' },
      { key: 'E', text: 'Standar kualitas produk yang ditetapkan oleh asosiasi industri' },
    ],
    correct_answer: 'B',
    explanation: '***Key Performance Indicator*** (KPI) adalah **metrik terukur** yang menunjukkan **efektivitas pencapaian tujuan bisnis**.\n\nContoh KPI di perusahaan tambang:\n\n| Area | KPI | Target |\n|---|---|---|\n| **Produksi** | Volume produksi (ton/tahun) | Sesuai rencana tambang |\n| **Biaya** | *Cash cost* per ton | < benchmark industri |\n| **Keuangan** | EBITDA margin | > 30% |\n| **K3** | LTIFR | < 1,0 |\n| **Lingkungan** | Peringkat PROPER | Hijau/Emas |\n| **Pemasaran** | *On-time delivery* | > 95% |\n\nPrinsip KPI yang baik (**SMART**):\n- **S**pecific: jelas dan spesifik\n- **M**easurable: dapat diukur\n- **A**chievable: dapat dicapai\n- **R**elevant: relevan dengan tujuan\n- **T**ime-bound: ada batas waktu',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan keunggulan kompetitif (*competitive advantage*) berbasis biaya rendah (*cost leadership*)?',
    options: [
      { key: 'A', text: 'Menjual produk dengan kualitas tertinggi tanpa memperhatikan harga' },
      { key: 'B', text: 'Memfokuskan penjualan hanya pada segmen pasar yang paling kecil' },
      { key: 'C', text: 'Memproduksi dengan biaya lebih rendah dari kompetitor sehingga mampu bersaing pada harga pasar' },
      { key: 'D', text: 'Menghentikan produksi saat harga pasar turun di bawah rata-rata' },
      { key: 'E', text: 'Meniru strategi pemasaran kompetitor yang paling sukses' },
    ],
    correct_answer: 'C',
    explanation: '***Cost leadership*** = **memproduksi dengan biaya lebih rendah** dari kompetitor, sehingga:\n- Pada harga pasar yang sama, margin keuntungan **lebih besar**\n- Mampu **bertahan** saat harga komoditas turun\n- Bisa menawarkan harga **lebih kompetitif** jika perlu\n\nSumber *cost leadership* di tambang nikel:\n- **Kadar bijih tinggi**: lebih sedikit material yang diproses per ton nikel\n- **Skala ekonomi**: smelter berkapasitas besar lebih efisien\n- **Lokasi strategis**: dekat pelabuhan, sumber energi murah\n- **Teknologi efisien**: HPAL untuk laterit berkadar rendah, RKEF untuk saprolit\n- **Integrasi vertikal**: tambang + smelter + pembangkit listrik sendiri\n\nMetrik: ***cash cost*** per ton nikel - produsen dengan cash cost di **kuartil bawah** kurva biaya global memiliki posisi terkuat.',
  },

  // ═══════════════════════════════════════════
  // T4: Kemitraan Strategis & Joint Venture (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 12,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Joint Venture* (JV) dalam konteks proyek tambang?',
    options: [
      { key: 'A', text: 'Merger penuh antara dua perusahaan tambang menjadi satu entitas baru' },
      { key: 'B', text: 'Pinjaman modal dari bank asing untuk membiayai proyek tambang' },
      { key: 'C', text: 'Pembelian seluruh saham perusahaan tambang oleh investor asing' },
      { key: 'D', text: 'Penawaran saham perdana perusahaan tambang di bursa efek' },
      { key: 'E', text: 'Kerja sama dua atau lebih pihak untuk proyek tertentu dengan pembagian risiko dan keuntungan' },
    ],
    correct_answer: 'E',
    explanation: '***Joint Venture*** (JV) adalah **kerja sama** antara dua atau lebih pihak untuk mengerjakan proyek tertentu dengan **pembagian risiko dan keuntungan**.\n\nStruktur JV di tambang:\n- **Incorporated JV**: membentuk perusahaan baru (PT) bersama\n- **Unincorporated JV**: perjanjian kontraktual tanpa entitas baru\n\nContoh JV di Indonesia:\n- ANTAM + Inalum: kerja sama smelter feronikel\n- Vale Indonesia: JV dengan pemerintah Indonesia\n- IMIP (Morowali): JV Tsingshan + Sulawesi Mining Investment\n\nKeuntungan JV:\n- **Pembagian risiko** investasi yang besar\n- **Akses teknologi** dari mitra asing\n- **Akses pasar** melalui jaringan mitra\n- **Memenuhi regulasi** kepemilikan dalam negeri\n\nTantangan:\n- Perbedaan **budaya dan manajemen**\n- **Pembagian keuntungan** dan pengambilan keputusan\n- Potensi **konflik kepentingan** antar mitra',
  },
  {
    order_index: 13,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa tujuan utama *due diligence* sebelum memasuki kemitraan bisnis atau akuisisi?',
    options: [
      { key: 'A', text: 'Menentukan desain logo baru untuk perusahaan hasil merger' },
      { key: 'B', text: 'Merancang struktur organisasi gabungan dari kedua perusahaan' },
      { key: 'C', text: 'Menghitung jumlah karyawan yang akan di-PHK setelah merger' },
      { key: 'D', text: 'Melakukan investigasi menyeluruh terhadap aspek finansial, legal, teknis, dan operasional target' },
      { key: 'E', text: 'Menyiapkan pengumuman pers tentang rencana kemitraan kepada publik' },
    ],
    correct_answer: 'D',
    explanation: '***Due diligence*** adalah **investigasi menyeluruh** sebelum membuat keputusan bisnis besar (akuisisi, JV, investasi).\n\nAspek due diligence:\n\n| Aspek | Yang diperiksa |\n|---|---|\n| **Finansial** | Laporan keuangan, utang, arus kas, pajak |\n| **Legal** | Perizinan (IUP/IUPK), kontrak, sengketa hukum |\n| **Teknis** | Cadangan mineral, metode penambangan, kondisi peralatan |\n| **Lingkungan** | Izin AMDAL, kewajiban reklamasi, kontaminasi |\n| **Operasional** | Kapasitas produksi, efisiensi, SDM |\n| **Komersial** | Kontrak penjualan, pelanggan, posisi pasar |\n\nTujuan:\n- Mengidentifikasi **risiko tersembunyi** (*hidden liabilities*)\n- Memvalidasi **asumsi valuasi**\n- Menentukan **syarat dan ketentuan** transaksi\n- Menjadi dasar **negosiasi harga** yang adil',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa perbedaan antara merger dan akuisisi (*M&A*) dalam konteks industri tambang?',
    options: [
      { key: 'A', text: 'Merger menggabungkan dua perusahaan menjadi satu entitas baru, akuisisi adalah pembelian satu perusahaan oleh perusahaan lain' },
      { key: 'B', text: 'Merger hanya untuk perusahaan sejenis, akuisisi untuk perusahaan berbeda industri' },
      { key: 'C', text: 'Merger diatur oleh hukum internasional, akuisisi oleh hukum nasional' },
      { key: 'D', text: 'Merger memerlukan persetujuan pemegang saham, akuisisi tidak memerlukan' },
      { key: 'E', text: 'Merger selalu bersifat sukarela, akuisisi selalu bersifat paksa' },
    ],
    correct_answer: 'A',
    explanation: 'Perbedaan **merger** dan **akuisisi**:\n\n| Aspek | Merger | Akuisisi |\n|---|---|---|\n| **Definisi** | **Penggabungan** dua perusahaan menjadi satu entitas baru | **Pembelian** satu perusahaan oleh perusahaan lain |\n| Entitas | Keduanya melebur (atau salah satu tetap) | Target tetap atau dilebur ke acquirer |\n| Kesetaraan | Cenderung **setara** | Ada **pembeli** dan **target** |\n| Contoh | Glencore + Xstrata (2013) | BHP akuisisi OZ Minerals (2023) |\n\nMotivasi M&A di tambang:\n- **Pertumbuhan cadangan**: lebih cepat dari eksplorasi sendiri\n- **Sinergi biaya**: mengurangi overhead, *economies of scale*\n- **Diversifikasi**: menambah komoditas atau geografi\n- **Akses teknologi**: memperoleh proses pengolahan baru\n- **Mengurangi kompetisi**: konsolidasi industri',
  },

  // ═══════════════════════════════════════════
  // T5: Analisis Data untuk Keputusan Bisnis (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 15,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa kegunaan analisis tren data historis harga nikel bagi pengambil keputusan bisnis?',
    options: [
      { key: 'A', text: 'Menjamin harga nikel akan bergerak sesuai pola historis di masa depan' },
      { key: 'B', text: 'Mengidentifikasi pola dan siklus yang membantu merencanakan strategi produksi dan penjualan' },
      { key: 'C', text: 'Menghitung pajak yang harus dibayar perusahaan untuk tahun berjalan' },
      { key: 'D', text: 'Menentukan jumlah karyawan yang harus direkrut setiap bulan' },
      { key: 'E', text: 'Membuktikan kepada regulator bahwa perusahaan telah beroperasi dengan benar' },
    ],
    correct_answer: 'B',
    explanation: 'Analisis tren harga historis bermanfaat untuk:\n\n1. **Identifikasi pola siklus**: memahami durasi dan amplitude siklus harga\n2. **Perencanaan produksi**: menyesuaikan volume dengan kondisi harga\n3. **Strategi penjualan**: mengoptimalkan timing kontrak jangka panjang vs spot\n4. **Perencanaan CAPEX**: investasi ekspansi saat harga tinggi, efisiensi saat harga rendah\n5. **Manajemen risiko**: hedging berdasarkan volatilitas historis\n\nTools analisis:\n- **Moving average**: menghaluskan fluktuasi jangka pendek\n- **Analisis korelasi**: hubungan harga Ni dengan USD, GDP China, produksi baja\n- **Seasonal decomposition**: mengidentifikasi pola musiman\n\nCaveat: **performa historis bukan jaminan masa depan** - tetapi membantu membuat keputusan yang lebih *informed*.',
  },
  {
    order_index: 16,
    category: 'T5',
    difficulty: 'medium',
    content: 'Suatu proyek memiliki probabilitas sukses $70\\%$ dengan keuntungan $\\$50$ juta dan probabilitas gagal $30\\%$ dengan kerugian $\\$20$ juta. Berapa *expected value* proyek?',
    options: [
      { key: 'A', text: '$\\$15$ juta' },
      { key: 'B', text: '$\\$50$ juta' },
      { key: 'C', text: '$\\$29$ juta' },
      { key: 'D', text: '$\\$35$ juta' },
      { key: 'E', text: '$\\$30$ juta' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan *expected value* (nilai harapan):\n$$\\begin{aligned} EV &= (P_{\\text{sukses}} \\times \\text{Keuntungan}) + (P_{\\text{gagal}} \\times \\text{Kerugian}) \\\\ &= (0{,}70 \\times \\$50) + (0{,}30 \\times (-\\$20)) \\\\ &= \\$35 - \\$6 = \\$29 \\text{ juta} \\end{aligned}$$\n\n*Expected value* $\\$29$ juta menunjukkan proyek ini secara probabilistik **menguntungkan** dan layak dipertimbangkan.\n\nAplikasi *expected value* di bisnis tambang:\n- Evaluasi **prospek eksplorasi** (probabilitas menemukan deposit x nilai deposit)\n- Penilaian **risiko proyek** dengan berbagai skenario\n- Perbandingan **alternatif investasi** dengan profil risiko berbeda\n- Menentukan **anggaran eksplorasi** optimal',
  },
  {
    order_index: 17,
    category: 'T5',
    difficulty: 'easy',
    content: 'Mengapa visualisasi data penting dalam presentasi bisnis kepada manajemen atau investor?',
    options: [
      { key: 'A', text: 'Visualisasi data selalu lebih akurat dibandingkan tabel angka' },
      { key: 'B', text: 'Investor hanya mau membaca presentasi yang berisi gambar dan grafik' },
      { key: 'C', text: 'Visualisasi menggantikan kebutuhan akan analisis kuantitatif' },
      { key: 'D', text: 'Grafik dan diagram lebih mahal dibuat sehingga menunjukkan keseriusan' },
      { key: 'E', text: 'Menyajikan data kompleks secara ringkas dan mudah dipahami untuk pengambilan keputusan cepat' },
    ],
    correct_answer: 'E',
    explanation: 'Visualisasi data penting karena **menyajikan informasi kompleks** secara **ringkas dan mudah dipahami**.\n\nJenis visualisasi dan kegunaannya:\n\n| Jenis | Kegunaan |\n|---|---|\n| **Line chart** | Tren harga nikel, produksi bulanan |\n| **Bar chart** | Perbandingan produksi antar unit/tahun |\n| **Pie chart** | Komposisi pendapatan per komoditas |\n| **Waterfall** | Perubahan EBITDA dari tahun ke tahun |\n| **Scatter plot** | Korelasi harga vs volume |\n| **Heat map** | Distribusi kadar bijih |\n| **Tornado** | Analisis sensitivitas variabel |\n\nPrinsip visualisasi yang baik:\n- **Sederhana**: satu pesan utama per grafik\n- **Jelas**: label, satuan, dan judul yang informatif\n- **Akurat**: skala yang tidak menyesatkan\n- **Relevan**: hanya menampilkan data yang mendukung keputusan',
  },

  // ═══════════════════════════════════════════
  // T6: Manajemen Risiko Bisnis & Investasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 18,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan risiko pasar (*market risk*) dalam bisnis komoditas?',
    options: [
      { key: 'A', text: 'Risiko kerugian akibat perubahan harga komoditas, kurs, dan suku bunga di pasar' },
      { key: 'B', text: 'Risiko kebakaran dan bencana alam di lokasi tambang' },
      { key: 'C', text: 'Risiko pekerja mogok kerja menuntut kenaikan upah' },
      { key: 'D', text: 'Risiko kegagalan mesin dan peralatan produksi' },
      { key: 'E', text: 'Risiko penipuan oleh karyawan di departemen keuangan' },
    ],
    correct_answer: 'A',
    explanation: '**Risiko pasar** adalah **risiko kerugian** akibat perubahan **kondisi pasar** yang tidak dapat dikendalikan perusahaan:\n\n| Jenis risiko pasar | Dampak |\n|---|---|\n| **Harga komoditas** | Penurunan harga Ni menurunkan pendapatan |\n| **Kurs mata uang** | Penguatan IDR menurunkan pendapatan ekspor |\n| **Suku bunga** | Kenaikan suku bunga meningkatkan biaya pinjaman |\n| **Harga energi** | Kenaikan harga BBM/listrik meningkatkan OPEX |\n\nStrategi mitigasi:\n- ***Hedging***: kontrak berjangka (*futures*) di LME untuk mengunci harga\n- ***Natural hedging***: menyelaraskan mata uang pendapatan dan biaya\n- **Diversifikasi**: produk, pelanggan, dan pasar\n- **Kontrak jangka panjang**: mengunci volume dan harga untuk stabilitas\n- **Cost reduction**: menurunkan *breakeven price*',
  },
  {
    order_index: 19,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Business Continuity Plan* (BCP)?',
    options: [
      { key: 'A', text: 'Rencana ekspansi bisnis ke wilayah geografis baru dalam 5 tahun ke depan' },
      { key: 'B', text: 'Rencana untuk memastikan operasi bisnis tetap berlanjut saat terjadi gangguan besar' },
      { key: 'C', text: 'Jadwal perawatan berkala seluruh peralatan produksi selama satu tahun' },
      { key: 'D', text: 'Program pelatihan karyawan baru selama masa percobaan 3 bulan' },
      { key: 'E', text: 'Kontrak kerja sama jangka panjang dengan pemasok bahan baku utama' },
    ],
    correct_answer: 'B',
    explanation: '***Business Continuity Plan*** (BCP) adalah **rencana untuk memastikan operasi bisnis kritis tetap berlanjut** saat terjadi **gangguan besar** (*disruption*).\n\nKomponen BCP:\n1. **Business Impact Analysis** (BIA): identifikasi proses kritis dan dampak gangguan\n2. **Strategi pemulihan**: alternatif untuk menjaga operasi berjalan\n3. **Rencana komunikasi**: siapa yang dihubungi, bagaimana berkomunikasi\n4. **Rencana evakuasi**: keselamatan personel\n5. **Pengujian berkala**: simulasi dan latihan BCP\n\nSkenario gangguan di tambang:\n- Bencana alam (gempa, banjir, longsor)\n- Pandemi (COVID-19 menunjukkan pentingnya BCP)\n- Gangguan rantai pasok (kekurangan BBM, spare part)\n- Konflik sosial dengan masyarakat sekitar\n- Kegagalan infrastruktur kritis (pembangkit listrik, pelabuhan)',
  },
  {
    order_index: 20,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan risiko geopolitik dalam konteks investasi pertambangan?',
    options: [
      { key: 'A', text: 'Risiko gempa bumi dan aktivitas vulkanik di lokasi tambang' },
      { key: 'B', text: 'Risiko penurunan harga saham di bursa efek nasional' },
      { key: 'C', text: 'Risiko kerusakan mesin karena kualitas suku cadang yang buruk' },
      { key: 'D', text: 'Risiko perubahan politik, regulasi, atau kebijakan pemerintah yang mempengaruhi operasi' },
      { key: 'E', text: 'Risiko kegagalan teknologi pengolahan yang digunakan di pabrik' },
    ],
    correct_answer: 'D',
    explanation: '**Risiko geopolitik** adalah **risiko perubahan politik, regulasi, atau kebijakan pemerintah** yang mempengaruhi operasi dan investasi.\n\nContoh risiko geopolitik di pertambangan:\n\n| Risiko | Contoh |\n|---|---|\n| **Perubahan regulasi** | Larangan ekspor bijih nikel Indonesia (2014, 2020) |\n| **Nasionalisasi** | Pengambilalihan aset tambang oleh pemerintah |\n| **Perubahan pajak** | Kenaikan royalti atau pajak ekspor |\n| **Konflik regional** | Perang, sanksi ekonomi yang mempengaruhi supply chain |\n| **Ketidakstabilan politik** | Pergantian pemerintah yang mengubah kebijakan tambang |\n| **Sanksi perdagangan** | Embargo yang membatasi ekspor-impor |\n\nMitigasi:\n- **Diversifikasi geografis**: operasi di beberapa negara\n- **Lobi dan relasi pemerintah** (*government relations*)\n- **Asuransi risiko politik**: MIGA (World Bank), ECA\n- **Kontrak perlindungan investasi**: *bilateral investment treaties*',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-bizdev')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-bizdev tidak ditemukan:', pkgErr)
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
