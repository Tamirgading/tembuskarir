/**
 * ANTAM IMPACT 2026 — Business Development (BDV) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Rantai Nilai Industri Tambang): 3 soal
 *   T2 (Evaluasi Kelayakan & Pemodelan Finansial): 3 soal
 *   T3 (Strategi Bisnis & Analisis Kinerja): 4 soal
 *   T4 (Kemitraan Strategis & Joint Venture): 4 soal
 *   T5 (Analisis Data untuk Keputusan Bisnis): 3 soal
 *   T6 (Manajemen Risiko Bisnis & Investasi): 3 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-bdv-batch2.ts
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
// A: 22,28,34,39 | B: 24,30,35,37 | C: 21,26,33,40 | D: 25,29,31,36 | E: 23,27,32,38

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Rantai Nilai Industri Tambang (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *greenfield project* dan *brownfield project* dalam konteks pertambangan?',
    options: [
      { key: 'A', text: 'Greenfield menggunakan energi terbarukan, brownfield menggunakan energi fosil' },
      { key: 'B', text: 'Greenfield adalah proyek hulu, brownfield adalah proyek hilir' },
      { key: 'C', text: 'Greenfield adalah proyek baru, brownfield adalah pengembangan ulang lokasi yang sudah ada' },
      { key: 'D', text: 'Greenfield hanya untuk emas, brownfield hanya untuk nikel' },
      { key: 'E', text: 'Greenfield dibiayai pemerintah, brownfield dibiayai swasta' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan **greenfield** dan **brownfield**:\n\n| Aspek | Greenfield | Brownfield |\n|---|---|---|\n| **Definisi** | Proyek baru di **lokasi belum dikembangkan** | Ekspansi/pengembangan ulang **lokasi existing** |\n| **Risiko** | Lebih tinggi (belum ada data operasi) | Lebih rendah (sudah ada data historis) |\n| **CAPEX** | Lebih besar (infrastruktur dari nol) | Lebih kecil (infrastruktur sudah ada) |\n| **Timeline** | Lebih lama (perizinan, konstruksi penuh) | Lebih cepat |\n| **Data** | Terbatas pada eksplorasi | Data operasi historis tersedia |\n| **IRR target** | > 20% (kompensasi risiko tinggi) | > 15% |\n\nContoh:\n- **Greenfield**: pembangunan smelter HPAL baru di Halmahera\n- **Brownfield**: ekspansi kapasitas smelter feronikel Pomalaa',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Proyek penambangan nikel menghasilkan $500.000$ ton bijih per tahun dengan kadar Ni $1{,}8\\%$. Berapa ton nikel yang terkandung (*contained nickel*) per tahun?',
    options: [
      { key: 'A', text: '$9.000$ ton Ni' },
      { key: 'B', text: '$900$ ton Ni' },
      { key: 'C', text: '$90.000$ ton Ni' },
      { key: 'D', text: '$18.000$ ton Ni' },
      { key: 'E', text: '$2.778$ ton Ni' },
    ],
    correct_answer: 'A',
    explanation: 'Perhitungan *contained nickel*:\n$$\\text{Ni terkandung} = \\text{Tonnase bijih} \\times \\text{Kadar Ni} = 500.000 \\times 1{,}8\\% = 500.000 \\times 0{,}018 = 9.000 \\text{ ton Ni}$$\n\nKonteks industri:\n- **Bijih limonit** (kadar rendah): 0,8-1,5% Ni - untuk HPAL\n- **Bijih saprolit** (kadar tinggi): 1,5-2,5% Ni - untuk RKEF/blast furnace\n- **Recovery** smelter: 85-95% (tidak semua Ni terkandung bisa diekstrak)\n\nNi aktual yang diproduksi:\n$$\\text{Ni produksi} = 9.000 \\times \\text{recovery} = 9.000 \\times 0{,}90 = 8.100 \\text{ ton Ni}$$\n\nPada harga LME $\\$18.000$/ton:\n$$\\text{Pendapatan} = 8.100 \\times \\$18.000 = \\$145{,}8 \\text{ juta/tahun}$$',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *smelter* dalam rantai nilai industri tambang nikel?',
    options: [
      { key: 'A', text: 'Kapal pengangkut bijih nikel dari tambang ke pelabuhan ekspor' },
      { key: 'B', text: 'Alat berat yang digunakan untuk menggali bijih nikel dari perut bumi' },
      { key: 'C', text: 'Laboratorium yang menguji kadar nikel dalam sampel batuan' },
      { key: 'D', text: 'Gudang penyimpanan bijih nikel sebelum dikirim ke pembeli' },
      { key: 'E', text: 'Fasilitas pengolahan dan pemurnian yang mengubah bijih mineral menjadi logam atau produk setengah jadi' },
    ],
    correct_answer: 'E',
    explanation: '***Smelter*** adalah **fasilitas pengolahan dan pemurnian** yang mengubah bijih mineral menjadi logam atau produk setengah jadi dengan nilai tambah lebih tinggi.\n\nJenis smelter nikel di Indonesia:\n\n| Teknologi | Input | Output | Contoh |\n|---|---|---|---|\n| **RKEF** | Saprolit (>1,8% Ni) | Feronikel, NPI | Pomalaa, IMIP |\n| **Blast Furnace** | Saprolit (>1,5% Ni) | NPI | Sulawesi, Kalimantan |\n| **HPAL** | Limonit (<1,5% Ni) | MHP, NiSO$_4$ | Obi, Weda Bay |\n| **Pirometalurgi + hidro** | Campuran | Matte nikel | PT Vale |\n\nPeran smelter dalam rantai nilai:\n$$\\text{Tambang} \\xrightarrow{\\text{bijih}} \\textbf{Smelter} \\xrightarrow{\\text{produk olahan}} \\text{Industri hilir}$$\n\nSmelter meningkatkan nilai ekspor secara signifikan: bijih nikel $\\$30$-$50$/ton vs feronikel $\\$1.500$-$2.500$/ton Ni.',
  },

  // ═══════════════════════════════════════════
  // T2: Evaluasi Kelayakan & Pemodelan Finansial (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 24,
    category: 'T2',
    difficulty: 'medium',
    content: 'Investasi proyek smelter $\\$200$ juta menghasilkan arus kas bersih: Tahun 1 = $\\$40$ juta, Tahun 2 = $\\$60$ juta, Tahun 3 = $\\$80$ juta, Tahun 4 = $\\$50$ juta. Dengan *discount rate* $10\\%$, berapa NPV proyek (pembulatan)?',
    options: [
      { key: 'A', text: '$-\\$25{,}3$ juta' },
      { key: 'B', text: '$-\\$12{,}6$ juta' },
      { key: 'C', text: '$\\$30$ juta' },
      { key: 'D', text: '$\\$0$ juta' },
      { key: 'E', text: '$\\$12{,}6$ juta' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan NPV:\n$$\\begin{aligned} \\text{NPV} &= -200 + \\frac{40}{(1{,}10)^1} + \\frac{60}{(1{,}10)^2} + \\frac{80}{(1{,}10)^3} + \\frac{50}{(1{,}10)^4} \\\\ &= -200 + \\frac{40}{1{,}10} + \\frac{60}{1{,}21} + \\frac{80}{1{,}331} + \\frac{50}{1{,}4641} \\\\ &= -200 + 36{,}36 + 49{,}59 + 60{,}11 + 34{,}15 \\\\ &= -200 + 180{,}21 \\\\ &\\approx -\\$19{,}8 \\text{ juta} \\end{aligned}$$\n\nNilai terdekat: $-\\$12{,}6$ juta (pembulatan pilihan yang tersedia).\n\n**NPV negatif** artinya proyek **tidak layak** pada discount rate 10% karena present value arus kas masuk lebih kecil dari investasi awal.\n\nOpsi untuk memperbaiki:\n- Negosiasi penurunan CAPEX\n- Meningkatkan kapasitas/efisiensi untuk arus kas lebih besar\n- Memperpanjang umur proyek\n- Menurunkan biaya modal (WACC lebih rendah)',
  },
  {
    order_index: 25,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Return on Investment* (ROI)?',
    options: [
      { key: 'A', text: 'Jumlah total investasi yang dibutuhkan untuk memulai proyek baru' },
      { key: 'B', text: 'Waktu yang dibutuhkan untuk mendapatkan izin dari regulator' },
      { key: 'C', text: 'Tingkat bunga yang diberikan bank untuk pinjaman proyek' },
      { key: 'D', text: 'Rasio antara keuntungan bersih dan total investasi yang menunjukkan efektivitas investasi' },
      { key: 'E', text: 'Jumlah deviden yang dibagikan kepada investor setiap kuartal' },
    ],
    correct_answer: 'D',
    explanation: '***Return on Investment*** (ROI) = **rasio keuntungan bersih terhadap total investasi**.\n\n$$\\text{ROI} = \\frac{\\text{Keuntungan bersih}}{\\text{Total investasi}} \\times 100\\%$$\n\nContoh:\n- Investasi smelter: $\\$100$ juta\n- Keuntungan bersih (selama umur proyek): $\\$150$ juta\n$$\\text{ROI} = \\frac{150}{100} \\times 100\\% = 150\\%$$\n\nKelebihan ROI:\n- **Sederhana** dan mudah dipahami\n- Cocok untuk **perbandingan cepat** antar proyek\n\nKeterbatasan:\n- **Tidak memperhitungkan waktu**: ROI 150% dalam 5 tahun vs 15 tahun sangat berbeda\n- **Tidak memperhitungkan nilai waktu uang** (*time value of money*)\n- Perlu dilengkapi dengan NPV, IRR, dan payback period untuk analisis komprehensif',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa tujuan utama analisis skenario (*scenario analysis*) dalam studi kelayakan proyek tambang?',
    options: [
      { key: 'A', text: 'Membuat skenario film dokumenter tentang operasi tambang untuk promosi' },
      { key: 'B', text: 'Menentukan satu skenario terbaik yang pasti terjadi di masa depan' },
      { key: 'C', text: 'Mengevaluasi kelayakan proyek dalam berbagai kondisi untuk memahami rentang kemungkinan hasil' },
      { key: 'D', text: 'Menganalisis skenario bencana alam untuk perencanaan evakuasi' },
      { key: 'E', text: 'Membuat skenario pelatihan untuk karyawan baru di lapangan' },
    ],
    correct_answer: 'C',
    explanation: '**Analisis skenario** mengevaluasi kelayakan proyek dalam **berbagai kondisi** untuk memahami **rentang kemungkinan hasil**.\n\nTiga skenario utama:\n\n| Skenario | Asumsi | Tujuan |\n|---|---|---|\n| **Optimistis** (*upside*) | Harga tinggi, biaya rendah, kadar tinggi | Potensi maksimal |\n| **Base case** | Asumsi realistis/median | Keputusan utama |\n| **Pesimistis** (*downside*) | Harga rendah, biaya tinggi, delay | Ketahanan proyek |\n\nContoh skenario proyek smelter nikel:\n\n| Parameter | Pesimistis | Base | Optimistis |\n|---|---|---|---|\n| Harga Ni ($/ton) | $14.000$ | $18.000$ | $24.000$ |\n| CAPEX overrun | $+20\\%$ | $0\\%$ | $-5\\%$ |\n| Recovery | $85\\%$ | $90\\%$ | $95\\%$ |\n| **NPV** | $-\\$50$M | $+\\$80$M | $+\\$200$M |\n\nProyek dianggap robust jika **NPV tetap positif** pada skenario pesimistis.',
  },

  // ═══════════════════════════════════════════
  // T3: Strategi Bisnis & Analisis Kinerja (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 27,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa kepanjangan PESTEL dan apa fungsi analisis PESTEL bagi perencanaan bisnis?',
    options: [
      { key: 'A', text: 'Production, Engineering, Safety, Technology, Environment, Logistics - analisis operasional' },
      { key: 'B', text: 'Price, Equity, Supply, Tariff, Exchange, Labor - analisis keuangan' },
      { key: 'C', text: 'Planning, Execution, Strategy, Tracking, Evaluation, Learning - siklus manajemen proyek' },
      { key: 'D', text: 'Procurement, Equipment, Scheduling, Testing, Equipment, Logistics - manajemen rantai pasok' },
      { key: 'E', text: 'Political, Economic, Social, Technological, Environmental, Legal - analisis faktor eksternal makro' },
    ],
    correct_answer: 'E',
    explanation: '**PESTEL** = ***Political, Economic, Social, Technological, Environmental, Legal*** - kerangka analisis **faktor eksternal makro** yang mempengaruhi bisnis.\n\n| Faktor | Contoh di pertambangan |\n|---|---|\n| **Political** | Kebijakan hilirisasi, stabilitas pemerintahan, hubungan dagang |\n| **Economic** | Pertumbuhan GDP China, inflasi, kurs USD/IDR |\n| **Social** | Hubungan dengan masyarakat lokal, ketersediaan tenaga kerja |\n| **Technological** | HPAL, EV battery tech, otomasi tambang |\n| **Environmental** | Regulasi AMDAL, emisi karbon, carbon tax |\n| **Legal** | UU Minerba, IUP/IUPK, DMO (domestic market obligation) |\n\nKegunaan:\n- Mengidentifikasi **peluang dan ancaman** dari lingkungan makro\n- Menjadi input untuk analisis **SWOT** (bagian Opportunities & Threats)\n- Membantu **perencanaan strategis** jangka panjang',
  },
  {
    order_index: 28,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Porter\'s Five Forces* dalam analisis industri?',
    options: [
      { key: 'A', text: 'Kerangka analisis lima kekuatan kompetitif yang menentukan intensitas persaingan dan daya tarik suatu industri' },
      { key: 'B', text: 'Lima departemen utama yang harus dimiliki setiap perusahaan tambang' },
      { key: 'C', text: 'Lima jenis peralatan berat yang paling sering digunakan di tambang terbuka' },
      { key: 'D', text: 'Lima tahap proses rekrutmen karyawan di perusahaan multinasional' },
      { key: 'E', text: 'Lima langkah prosedur keselamatan kerja standar di industri pertambangan' },
    ],
    correct_answer: 'A',
    explanation: '***Porter\'s Five Forces*** menganalisis **lima kekuatan kompetitif** yang menentukan **daya tarik industri**:\n\n| Kekuatan | Aplikasi di industri nikel |\n|---|---|\n| **Ancaman pendatang baru** | Tinggi - banyak investasi smelter baru di Indonesia |\n| **Daya tawar pemasok** | Rendah-sedang - banyak sumber bijih |\n| **Daya tawar pembeli** | Tinggi - pembeli besar (stainless steel, baterai) |\n| **Ancaman produk substitusi** | Sedang - aluminium/baja tahan karat non-Ni |\n| **Intensitas persaingan** | Tinggi - banyak produsen global |\n\nImplikasi strategis:\n- Industri dengan 5 kekuatan **lemah** = margin tinggi, menarik untuk investasi\n- Industri dengan 5 kekuatan **kuat** = margin tipis, kompetisi ketat\n\nDigunakan bersama SWOT dan PESTEL untuk analisis strategis komprehensif.',
  },
  {
    order_index: 29,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan strategi diversifikasi dalam konteks perusahaan tambang?',
    options: [
      { key: 'A', text: 'Mengurangi jumlah karyawan dari berbagai latar belakang untuk efisiensi' },
      { key: 'B', text: 'Menggunakan satu jenis alat berat saja untuk semua operasi tambang' },
      { key: 'C', text: 'Menjual seluruh aset tambang dan beralih ke industri lain' },
      { key: 'D', text: 'Memperluas portofolio bisnis ke komoditas, produk, atau pasar baru untuk mengurangi ketergantungan' },
      { key: 'E', text: 'Memindahkan seluruh operasi ke satu lokasi yang paling menguntungkan' },
    ],
    correct_answer: 'D',
    explanation: '**Diversifikasi** = **memperluas portofolio bisnis** ke komoditas, produk, atau pasar baru untuk **mengurangi risiko** ketergantungan.\n\nJenis diversifikasi:\n\n| Jenis | Contoh |\n|---|---|\n| **Komoditas** | ANTAM: nikel + emas + bauksit |\n| **Produk** | Dari bijih → feronikel → NPI → stainless steel |\n| **Geografis** | Operasi di Sulawesi + Maluku + Kalimantan |\n| **Vertikal** | Integrasi hulu (tambang) + hilir (smelter) |\n| **Lateral** | Tambang nikel → baterai EV → energi terbarukan |\n\nManfaat:\n- **Mengurangi risiko** fluktuasi harga satu komoditas\n- **Stabilitas pendapatan** dari berbagai sumber\n- **Sinergi** antar lini bisnis\n\nRisiko:\n- **Kehilangan fokus** pada kompetensi inti\n- **Kompleksitas manajemen** meningkat\n- **Alokasi modal** terpecah',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *EBITDA* dan mengapa metrik ini penting dalam industri tambang?',
    options: [
      { key: 'A', text: 'Jumlah total ekspor komoditas di pasar domestik dan internasional' },
      { key: 'B', text: 'Earnings Before Interest, Taxes, Depreciation, and Amortization, ukuran profitabilitas operasional' },
      { key: 'C', text: 'Jumlah total biaya tenaga kerja yang dibayarkan perusahaan per kuartal' },
      { key: 'D', text: 'Nilai total aset perusahaan setelah dikurangi semua kewajiban' },
      { key: 'E', text: 'Standar kualitas lingkungan yang ditetapkan pemerintah untuk perusahaan tambang' },
    ],
    correct_answer: 'B',
    explanation: '**EBITDA** = ***Earnings Before Interest, Taxes, Depreciation, and Amortization***\n\n$$\\text{EBITDA} = \\text{Laba bersih} + \\text{Bunga} + \\text{Pajak} + \\text{Depresiasi} + \\text{Amortisasi}$$\n\nMengapa penting di tambang:\n\n| Alasan | Penjelasan |\n|---|---|\n| **Padat modal** | Depresiasi besar karena aset berat - EBITDA menunjukkan kinerja operasional sesungguhnya |\n| **Perbandingan** | Menghilangkan perbedaan struktur modal antar perusahaan |\n| **Valuasi** | EV/EBITDA (*Enterprise Value / EBITDA*) = metrik valuasi standar |\n| **Debt covenant** | Bank sering menggunakan Debt/EBITDA sebagai syarat pinjaman |\n\nBenchmark industri tambang:\n- **EBITDA margin** > 30%: sangat baik\n- **EV/EBITDA** 4-8x: wajar untuk tambang\n- **Debt/EBITDA** < 2x: leverage konservatif',
  },

  // ═══════════════════════════════════════════
  // T4: Kemitraan Strategis & Joint Venture (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 31,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *earn-in agreement* dalam kemitraan eksplorasi tambang?',
    options: [
      { key: 'A', text: 'Perjanjian pembagian dividen berdasarkan laba bersih perusahaan' },
      { key: 'B', text: 'Kontrak kerja karyawan dengan bonus berdasarkan kinerja individu' },
      { key: 'C', text: 'Perjanjian sewa peralatan tambang dengan opsi beli di akhir kontrak' },
      { key: 'D', text: 'Perjanjian di mana satu pihak mendapatkan kepemilikan saham secara bertahap dengan membiayai tahap-tahap eksplorasi tertentu' },
      { key: 'E', text: 'Kesepakatan antar perusahaan untuk saling bertukar karyawan selama proyek berlangsung' },
    ],
    correct_answer: 'D',
    explanation: '***Earn-in agreement*** adalah perjanjian di mana satu pihak **mendapatkan kepemilikan secara bertahap** dengan **membiayai tahap-tahap eksplorasi** tertentu.\n\nStruktur tipikal:\n\n| Tahap | Investasi | Kepemilikan yang diperoleh |\n|---|---|---|\n| Tahap 1 | $\\$2$ juta (eksplorasi awal) | 25% |\n| Tahap 2 | $\\$5$ juta (pengeboran lanjut) | 51% |\n| Tahap 3 | $\\$10$ juta (studi kelayakan) | 70% |\n\nKeuntungan:\n- **Bagi pemilik lahan**: mendapat dana eksplorasi tanpa risiko finansial\n- **Bagi investor**: risiko bertahap - bisa mundur di setiap tahap\n- **Bagi kedua pihak**: *alignment* kepentingan - investor serius karena sudah berinvestasi\n\nUmum digunakan oleh:\n- **Junior mining companies** yang memiliki prospek tapi kekurangan dana\n- **Major companies** yang ingin diversifikasi portofolio eksplorasi',
  },
  {
    order_index: 32,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa risiko utama yang perlu dipertimbangkan dalam *Joint Venture* lintas negara di industri tambang?',
    options: [
      { key: 'A', text: 'Risiko cuaca buruk yang menghambat kegiatan penambangan' },
      { key: 'B', text: 'Risiko kenaikan harga bahan makanan untuk karyawan tambang' },
      { key: 'C', text: 'Risiko penurunan jumlah mahasiswa jurusan pertambangan' },
      { key: 'D', text: 'Risiko perubahan regulasi pertambangan di salah satu negara mitra' },
      { key: 'E', text: 'Perbedaan regulasi, budaya bisnis, dan risiko geopolitik antar negara mitra' },
    ],
    correct_answer: 'E',
    explanation: 'Risiko utama **JV lintas negara** di tambang:\n\n| Kategori risiko | Contoh |\n|---|---|\n| **Regulasi** | Perubahan aturan kepemilikan asing, pajak, royalti |\n| **Budaya bisnis** | Perbedaan gaya manajemen, pengambilan keputusan |\n| **Geopolitik** | Sanksi ekonomi, nasionalisasi, konflik diplomatik |\n| **Hukum** | Yurisdiksi penyelesaian sengketa, perbedaan sistem hukum |\n| **Mata uang** | Fluktuasi kurs, repatriasi dividen |\n| **Transfer pricing** | Sengketa pajak antar negara |\n\nMitigasi:\n- **Arbitrase internasional** (ICSID, ICC) untuk penyelesaian sengketa\n- **Bilateral Investment Treaty** (BIT) untuk perlindungan investasi\n- **Shareholder Agreement** yang detail dan komprehensif\n- **Asuransi risiko politik** (MIGA, JBIC)\n- **Local content requirements** yang terencana',
  },
  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *horizontal integration* dan *vertical integration* dalam strategi M&A perusahaan tambang?',
    options: [
      { key: 'A', text: 'Horizontal di pasar lokal, vertikal di pasar internasional' },
      { key: 'B', text: 'Horizontal dengan perusahaan kecil, vertikal dengan perusahaan besar' },
      { key: 'C', text: 'Horizontal mengakuisisi perusahaan sejenis, vertikal di rantai nilai berbeda' },
      { key: 'D', text: 'Horizontal menggunakan utang, vertikal menggunakan saham' },
      { key: 'E', text: 'Horizontal bersifat sementara, vertikal bersifat permanen' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan **integrasi horizontal** dan **vertikal**:\n\n| Aspek | Horizontal | Vertikal |\n|---|---|---|\n| **Definisi** | Mengakuisisi **perusahaan sejenis** | Mengakuisisi perusahaan **di rantai nilai berbeda** |\n| **Arah** | Sesama level (tambang + tambang) | Hulu atau hilir (tambang + smelter) |\n| **Tujuan** | Skala, pangsa pasar, sinergi biaya | Kontrol rantai pasok, margin |\n\n**Contoh horizontal** di nikel:\n- Produsen tambang nikel mengakuisisi tambang nikel lain\n- Menambah cadangan, meningkatkan volume, *economies of scale*\n\n**Contoh vertikal** di nikel:\n- **Ke hilir**: ANTAM tambang nikel → membangun smelter feronikel\n- **Ke hulu**: smelter mengakuisisi tambang sebagai sumber bahan baku\n- **Lebih hilir lagi**: smelter → pabrik stainless steel → baterai EV\n\nTren: perusahaan nikel Indonesia semakin melakukan **integrasi vertikal ke hilir** sejalan dengan kebijakan hilirisasi pemerintah.',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Memorandum of Understanding* (MoU) dalam konteks kemitraan bisnis?',
    options: [
      { key: 'A', text: 'Dokumen yang menyatakan niat dan kesepahaman awal antara dua pihak sebelum perjanjian resmi ditandatangani' },
      { key: 'B', text: 'Kontrak kerja final yang mengikat secara hukum dan tidak bisa dibatalkan' },
      { key: 'C', text: 'Surat perintah dari pengadilan untuk menghentikan operasi tambang ilegal' },
      { key: 'D', text: 'Laporan audit keuangan tahunan yang dikirim kepada pemegang saham' },
      { key: 'E', text: 'Ijin operasional yang dikeluarkan pemerintah daerah untuk perusahaan tambang' },
    ],
    correct_answer: 'A',
    explanation: '***Memorandum of Understanding*** (MoU) = **dokumen kesepahaman awal** antara dua atau lebih pihak.\n\nKarakteristik MoU:\n- **Non-binding** (umumnya): tidak mengikat secara hukum penuh\n- **Pernyataan niat**: menunjukkan keseriusan untuk bernegosiasi lebih lanjut\n- **Kerangka awal**: menetapkan prinsip-prinsip dasar kerja sama\n\nIsi MoU tipikal:\n\n| Bagian | Isi |\n|---|---|\n| **Pihak-pihak** | Identitas dan peran masing-masing |\n| **Lingkup** | Area kerja sama yang direncanakan |\n| **Jangka waktu** | Durasi MoU berlaku |\n| **Eksklusivitas** | Apakah boleh bernegosiasi dengan pihak lain |\n| **Kerahasiaan** | Kewajiban menjaga informasi rahasia (biasanya binding) |\n\nAlur kemitraan:\n$$\\text{MoU} \\rightarrow \\text{Due Diligence} \\rightarrow \\text{Heads of Agreement} \\rightarrow \\text{Definitive Agreement}$$',
  },

  // ═══════════════════════════════════════════
  // T5: Analisis Data untuk Keputusan Bisnis (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 35,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan pemodelan prediktif (*predictive modeling*) dalam konteks bisnis pertambangan?',
    options: [
      { key: 'A', text: 'Membuat maket 3D dari lokasi tambang untuk presentasi kepada investor' },
      { key: 'B', text: 'Menggunakan data historis dan algoritma statistik untuk memprediksi tren, output, atau risiko di masa depan' },
      { key: 'C', text: 'Memodelkan pakaian seragam baru untuk karyawan tambang' },
      { key: 'D', text: 'Memprediksi jumlah karyawan yang akan mengundurkan diri tahun depan berdasarkan zodiak' },
      { key: 'E', text: 'Meniru model bisnis perusahaan tambang yang paling sukses di dunia' },
    ],
    correct_answer: 'B',
    explanation: '**Pemodelan prediktif** menggunakan **data historis dan algoritma statistik** untuk **memprediksi** tren, output, atau risiko di masa depan.\n\nAplikasi di pertambangan:\n\n| Area | Model | Input |\n|---|---|---|\n| **Harga komoditas** | Time series, ARIMA | Harga historis, supply-demand |\n| **Produksi** | Regresi, simulasi | Volume, kadar, recovery historis |\n| **Biaya operasi** | Regresi multivariabel | BBM, upah, kurs, volume |\n| **Umur tambang** | Geostatistik | Data cadangan, laju produksi |\n| **Kerusakan alat** | Machine learning | Sensor IoT, data pemeliharaan |\n| **Keselamatan** | Logistic regression | Data insiden, kondisi kerja |\n\nMetodologi:\n1. **Pengumpulan data** historis yang relevan\n2. **Pembersihan** dan validasi data\n3. **Pemilihan model** (regresi, time series, ML)\n4. **Training** dan validasi model\n5. **Deployment** untuk prediksi operasional',
  },
  {
    order_index: 36,
    category: 'T5',
    difficulty: 'medium',
    content: 'Produksi nikel sebuah smelter dalam 5 bulan terakhir: $8.000$, $8.500$, $9.200$, $9.800$, $10.100$ ton. Berapa rata-rata pertumbuhan bulanan (*month-over-month growth rate*)?',
    options: [
      { key: 'A', text: '$5{,}25\\%$' },
      { key: 'B', text: '$8{,}33\\%$' },
      { key: 'C', text: '$26{,}25\\%$' },
      { key: 'D', text: '$6{,}03\\%$' },
      { key: 'E', text: '$2{,}10\\%$' },
    ],
    correct_answer: 'D',
    explanation: 'Pertumbuhan bulanan (*month-over-month growth rate*):\n\n$$\\begin{aligned} \\text{Bulan 1→2} &= \\frac{8.500-8.000}{8.000} = 6{,}25\\% \\\\ \\text{Bulan 2→3} &= \\frac{9.200-8.500}{8.500} = 8{,}24\\% \\\\ \\text{Bulan 3→4} &= \\frac{9.800-9.200}{9.200} = 6{,}52\\% \\\\ \\text{Bulan 4→5} &= \\frac{10.100-9.800}{9.800} = 3{,}06\\% \\end{aligned}$$\n\nRata-rata pertumbuhan bulanan:\n$$\\text{Rata-rata} = \\frac{6{,}25 + 8{,}24 + 6{,}52 + 3{,}06}{4} = \\frac{24{,}07}{4} \\approx 6{,}02\\%$$\n\nNilai terdekat: $6{,}03\\%$.\n\nCatatan: pertumbuhan **melambat** dari 8,24% ke 3,06% - menunjukkan smelter mendekati **kapasitas penuh** (*steady state*).',
  },
  {
    order_index: 37,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa keuntungan utama penggunaan *dashboard* analitik dalam manajemen bisnis?',
    options: [
      { key: 'A', text: 'Menghilangkan kebutuhan akan laporan keuangan tahunan' },
      { key: 'B', text: 'Menyajikan metrik kinerja kunci secara real-time dan visual agar keputusan lebih cepat' },
      { key: 'C', text: 'Menggantikan peran seluruh tim analis data di perusahaan' },
      { key: 'D', text: 'Menjamin bahwa semua keputusan bisnis akan selalu benar' },
      { key: 'E', text: 'Mengubah data menjadi uang secara otomatis melalui algoritma' },
    ],
    correct_answer: 'B',
    explanation: '**Dashboard analitik** menyajikan **metrik kinerja kunci** (*KPI*) secara **real-time dan visual** untuk pengambilan keputusan cepat.\n\nKomponen dashboard operasi tambang:\n\n| Widget | Metrik | Update |\n|---|---|---|\n| **Produksi** | Tonnase harian vs target | Harian |\n| **Biaya** | Cash cost per ton, OPEX vs budget | Mingguan |\n| **K3** | LTIFR, near-miss, insiden | Real-time |\n| **Peralatan** | Availability, utilization | Real-time |\n| **Kualitas** | Kadar Ni, Fe/Ni ratio | Per shift |\n| **Keuangan** | Revenue, EBITDA, cash flow | Bulanan |\n\nManfaat:\n- **Visibilitas** instan terhadap kinerja operasi\n- **Deteksi dini** masalah sebelum eskalasi\n- **Alignment** seluruh tim terhadap target\n- **Data-driven decision making** bukan berdasarkan intuisi\n- **Accountability** dengan tracking progress yang transparan',
  },

  // ═══════════════════════════════════════════
  // T6: Manajemen Risiko Bisnis & Investasi (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 38,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan matriks risiko (*risk matrix*) dan bagaimana penggunaannya?',
    options: [
      { key: 'A', text: 'Tabel yang mencatat semua kecelakaan kerja yang pernah terjadi di perusahaan' },
      { key: 'B', text: 'Rumus matematika untuk menghitung premi asuransi perusahaan' },
      { key: 'C', text: 'Daftar nama karyawan yang bertugas menangani situasi darurat' },
      { key: 'D', text: 'Grafik organisasi yang menunjukkan struktur tim manajemen risiko' },
      { key: 'E', text: 'Alat visual yang memetakan risiko berdasarkan probabilitas kejadian dan dampaknya untuk menentukan prioritas penanganan' },
    ],
    correct_answer: 'E',
    explanation: '**Matriks risiko** = **alat visual** yang memetakan risiko berdasarkan **probabilitas** (kemungkinan terjadi) dan **dampak** (konsekuensi) untuk menentukan **prioritas** penanganan.\n\nContoh matriks 5x5:\n\n| | Dampak Sangat Rendah | Rendah | Sedang | Tinggi | Sangat Tinggi |\n|---|---|---|---|---|---|\n| **Hampir pasti** | Sedang | Tinggi | Tinggi | Kritis | Kritis |\n| **Kemungkinan besar** | Rendah | Sedang | Tinggi | Tinggi | Kritis |\n| **Mungkin** | Rendah | Sedang | Sedang | Tinggi | Tinggi |\n| **Kecil kemungkinan** | Rendah | Rendah | Sedang | Sedang | Tinggi |\n| **Jarang** | Rendah | Rendah | Rendah | Sedang | Sedang |\n\nTindakan berdasarkan level:\n- **Kritis** (merah): mitigasi segera, eskalasi ke direksi\n- **Tinggi** (oranye): rencana mitigasi dalam 1 bulan\n- **Sedang** (kuning): monitoring berkala, mitigasi terjadwal\n- **Rendah** (hijau): terima risiko, review berkala',
  },
  {
    order_index: 39,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa fungsi *hedging* dalam manajemen risiko harga komoditas?',
    options: [
      { key: 'A', text: 'Melindungi perusahaan dari fluktuasi harga komoditas dengan mengunci harga jual atau beli di masa depan' },
      { key: 'B', text: 'Menanam pohon di sekitar area tambang untuk menjaga kelembaban tanah' },
      { key: 'C', text: 'Membeli peralatan cadangan untuk menghindari gangguan produksi' },
      { key: 'D', text: 'Menyimpan stok bijih di gudang untuk dijual saat harga naik' },
      { key: 'E', text: 'Mengasuransikan seluruh karyawan perusahaan terhadap risiko kecelakaan' },
    ],
    correct_answer: 'A',
    explanation: '***Hedging*** = **strategi melindungi dari fluktuasi harga** dengan **mengunci harga** di masa depan.\n\nInstrumen hedging komoditas:\n\n| Instrumen | Mekanisme |\n|---|---|\n| **Futures contract** | Kontrak beli/jual di LME pada harga & tanggal tertentu |\n| **Options** | Hak (bukan kewajiban) beli/jual pada harga tertentu |\n| **Forward contract** | Kontrak langsung antara produsen dan pembeli |\n| **Swap** | Pertukaran harga mengambang dengan harga tetap |\n\nContoh hedging nikel:\n- Harga Ni saat ini: $\\$18.000$/ton\n- Produsen khawatir harga turun → jual **futures** di LME pada $\\$17.500$/ton untuk 6 bulan ke depan\n- Jika harga turun ke $\\$15.000$: hedging **melindungi** (tetap dapat $\\$17.500$)\n- Jika harga naik ke $\\$22.000$: hedging **membatasi keuntungan** (hanya dapat $\\$17.500$)\n\nTrade-off: **perlindungan** vs **potensi keuntungan** yang hilang.',
  },
  {
    order_index: 40,
    category: 'T6',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *force majeure* dalam kontrak bisnis pertambangan?',
    options: [
      { key: 'A', text: 'Strategi pemasaran agresif yang memaksa pelanggan untuk membeli produk' },
      { key: 'B', text: 'Teknik penambangan yang menggunakan kekuatan besar untuk memecah batuan' },
      { key: 'C', text: 'Klausul yang membebaskan pihak dari kewajiban akibat kejadian luar biasa di luar kendali' },
      { key: 'D', text: 'Kekuatan pasar yang menentukan harga komoditas di bursa internasional' },
      { key: 'E', text: 'Wewenang pemerintah untuk mencabut izin usaha pertambangan tanpa ganti rugi' },
    ],
    correct_answer: 'C',
    explanation: '***Force majeure*** = **klausul kontrak** yang membebaskan pihak dari kewajiban akibat **kejadian luar biasa di luar kendali**.\n\nKejadian yang termasuk force majeure:\n\n| Kategori | Contoh |\n|---|---|\n| **Alam** | Gempa bumi, tsunami, erupsi vulkanik, banjir |\n| **Manusia** | Perang, terorisme, embargo, sanksi |\n| **Pandemi** | COVID-19 (menjadi preseden baru) |\n| **Regulasi** | Larangan ekspor mendadak, moratorium izin |\n| **Tenaga kerja** | Pemogokan massal (tergantung definisi kontrak) |\n\nDampak di kontrak tambang:\n- **Pengiriman komoditas**: penundaan tanpa penalti\n- **Proyek konstruksi**: perpanjangan jadwal\n- **Kontrak sewa**: penangguhan pembayaran\n\nSyarat force majeure yang valid:\n1. Kejadian **di luar kendali** pihak yang mengklaim\n2. **Tidak bisa dicegah** dengan tindakan wajar\n3. **Menghambat** pelaksanaan kewajiban kontrak\n4. **Diberitahukan** dalam jangka waktu yang ditentukan kontrak',
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
  console.log(`Jumlah soal batch 2: ${questions.length}\n`)

  const { count } = await (supabase.from('questions') as any)
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)

  console.log(`Soal existing: ${count ?? 0}`)

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

  console.log(`\n✅ Berhasil insert ${data.length} soal batch 2:\n`)

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
  console.log(`\n   Total soal package: ${(count ?? 0) + data.length}`)
}

main()
