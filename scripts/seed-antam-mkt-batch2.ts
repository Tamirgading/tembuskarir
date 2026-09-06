/**
 * ANTAM IMPACT 2026 — Marketing (MKT) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Prinsip Pemasaran B2B): 4 soal
 *   T2 (Ekonomi Makro & Perdagangan Internasional): 4 soal
 *   T3 (Riset Pasar & Intelijen Bisnis): 4 soal
 *   T4 (Manajemen Hubungan Pelanggan/CRM): 4 soal
 *   T5 (Dasar Manajemen Logistik & Pengiriman): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-mkt-batch2.ts
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
// A: 24,28,31,37 | B: 21,29,35,40 | C: 25,30,36,38 | D: 22,26,32,39 | E: 23,27,33,34

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Prinsip Pemasaran B2B (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *value proposition* dalam pemasaran produk komoditas tambang?',
    options: [
      { key: 'A', text: 'Pernyataan tentang visi dan misi perusahaan yang tercantum di laporan tahunan' },
      { key: 'B', text: 'Pernyataan tentang nilai unik yang ditawarkan produk kepada pelanggan dibandingkan kompetitor' },
      { key: 'C', text: 'Perhitungan nilai tambang berdasarkan cadangan dan sumber daya mineral' },
      { key: 'D', text: 'Laporan valuasi saham perusahaan yang disiapkan oleh analis pasar modal' },
      { key: 'E', text: 'Daftar harga seluruh produk yang ditawarkan kepada pelanggan' },
    ],
    correct_answer: 'B',
    explanation: '***Value proposition*** adalah **pernyataan tentang nilai unik** yang ditawarkan produk/perusahaan kepada pelanggan dibandingkan kompetitor.\n\nKomponen value proposition komoditas tambang:\n\n| Elemen | Contoh ANTAM |\n|---|---|\n| **Kualitas produk** | Feronikel dengan kadar Ni konsisten dan rendah pengotor |\n| **Keandalan pasokan** | Cadangan besar, kapasitas produksi stabil |\n| **Layanan** | Fleksibilitas spesifikasi, dukungan teknis |\n| **Reputasi** | BUMN terpercaya, track record panjang |\n| **Lokasi strategis** | Dekat pasar Asia (biaya freight rendah) |\n\nMeskipun komoditas bersifat homogen, perusahaan bisa berdiferensiasi melalui:\n- Konsistensi kualitas di atas rata-rata\n- Keandalan pengiriman (*on-time delivery*)\n- Fleksibilitas volume dan spesifikasi\n- Hubungan jangka panjang yang solid',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa peran *decision-making unit* (DMU) dalam proses pembelian B2B komoditas?',
    options: [
      { key: 'A', text: 'DMU adalah software yang menghitung harga optimal untuk setiap transaksi' },
      { key: 'B', text: 'DMU adalah auditor eksternal yang memverifikasi kualitas produk sebelum pembelian' },
      { key: 'C', text: 'DMU adalah agen logistik yang mengatur pengiriman barang dari penjual ke pembeli' },
      { key: 'D', text: 'DMU adalah kelompok orang di organisasi pembeli yang terlibat dalam keputusan pembelian' },
      { key: 'E', text: 'DMU adalah lembaga pemerintah yang menyetujui setiap transaksi impor komoditas' },
    ],
    correct_answer: 'D',
    explanation: '***Decision-Making Unit*** (DMU) adalah **kelompok orang** di organisasi pembeli yang terlibat dalam **keputusan pembelian** B2B.\n\nPeran dalam DMU:\n\n| Peran | Fungsi | Contoh |\n|---|---|---|\n| **Initiator** | Mengidentifikasi kebutuhan | Manajer produksi |\n| **Gatekeeper** | Mengontrol arus informasi | Bagian *procurement* |\n| **Influencer** | Memberikan rekomendasi teknis | Tim QC, tim teknis |\n| **Decider** | Membuat keputusan akhir | Direktur operasi |\n| **Buyer** | Melakukan transaksi formal | Bagian pembelian |\n| **User** | Menggunakan produk | Operator pabrik |\n\nImplikasi bagi pemasar:\n- Harus mengidentifikasi **semua pihak** dalam DMU\n- Menyesuaikan **pesan dan pendekatan** untuk setiap peran\n- Tim teknis butuh data spesifikasi, direksi butuh ROI dan reliabilitas',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *product differentiation* untuk komoditas yang umumnya bersifat homogen?',
    options: [
      { key: 'A', text: 'Mengubah komposisi kimia produk agar berbeda dari standar pasar internasional' },
      { key: 'B', text: 'Membuat kemasan produk dengan desain yang lebih menarik secara visual' },
      { key: 'C', text: 'Menambah fitur digital pada produk fisik seperti QR code pada setiap pengiriman' },
      { key: 'D', text: 'Menurunkan harga jauh di bawah kompetitor untuk merebut pangsa pasar' },
      { key: 'E', text: 'Menciptakan keunggulan melalui layanan, kualitas, atau keandalan yang membedakan dari kompetitor' },
    ],
    correct_answer: 'E',
    explanation: '***Product differentiation*** untuk komoditas homogen dicapai melalui **keunggulan non-produk** yang membedakan dari kompetitor.\n\nStrategi diferensiasi komoditas:\n\n- **Konsistensi kualitas**: variasi kadar minimal antar pengiriman\n- **Keandalan pasokan**: tidak pernah *default* kontrak, *on-time delivery*\n- **Fleksibilitas**: mampu menyesuaikan spesifikasi dan volume sesuai permintaan\n- **Layanan teknis**: tim teknis yang membantu pelanggan mengoptimalkan penggunaan\n- **Sustainability**: sertifikasi ESG, *responsible mining*\n- **Branding**: reputasi sebagai produsen terpercaya\n\nContoh: dua produsen feronikel mungkin memiliki produk identik secara kimia, tetapi pelanggan memilih yang memiliki **track record pengiriman lebih baik** dan **layanan purna jual** lebih responsif.',
  },
  {
    order_index: 24,
    category: 'T1',
    difficulty: 'medium',
    content: 'Perusahaan menjual 100.000 ton nikel per tahun ke 5 pelanggan. Pelanggan terbesar membeli 45.000 ton. Berapa *customer concentration ratio* pelanggan terbesar?',
    options: [
      { key: 'A', text: '$45\\%$' },
      { key: 'B', text: '$20\\%$' },
      { key: 'C', text: '$55\\%$' },
      { key: 'D', text: '$5\\%$' },
      { key: 'E', text: '$80\\%$' },
    ],
    correct_answer: 'A',
    explanation: 'Perhitungan *customer concentration ratio*:\n$$\\text{Concentration ratio} = \\frac{\\text{Volume pelanggan terbesar}}{\\text{Total volume}} \\times 100\\% = \\frac{45.000}{100.000} \\times 100\\% = 45\\%$$\n\nInterpretasi:\n- Konsentrasi **45%** pada satu pelanggan tergolong **tinggi** dan berisiko\n- Jika pelanggan tersebut beralih ke kompetitor, perusahaan kehilangan hampir separuh pendapatan\n\nRisiko konsentrasi tinggi:\n- **Bargaining power** pelanggan sangat kuat\n- **Revenue volatility** tinggi jika pelanggan mengurangi pembelian\n- **Risiko kredit** terkonsentrasi pada satu pihak\n\nStrategi mitigasi:\n- **Diversifikasi pelanggan**: target konsentrasi < 25% per pelanggan\n- **Kontrak jangka panjang**: mengunci volume untuk mengurangi risiko\n- **Pengembangan pasar baru**: masuk ke segmen atau geografi baru',
  },

  // ═══════════════════════════════════════════
  // T2: Ekonomi Makro & Perdagangan Internasional (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa dampak kebijakan suku bunga tinggi (*tight monetary policy*) terhadap harga komoditas?',
    options: [
      { key: 'A', text: 'Harga komoditas selalu naik karena biaya produksi meningkat' },
      { key: 'B', text: 'Tidak ada hubungan antara kebijakan moneter dan harga komoditas' },
      { key: 'C', text: 'Harga komoditas cenderung turun karena perlambatan ekonomi mengurangi permintaan' },
      { key: 'D', text: 'Harga komoditas naik karena investor beralih dari obligasi ke komoditas' },
      { key: 'E', text: 'Harga komoditas menjadi stabil tanpa fluktuasi sama sekali' },
    ],
    correct_answer: 'C',
    explanation: 'Suku bunga tinggi (*tight monetary policy*) cenderung **menurunkan harga komoditas** melalui beberapa mekanisme:\n\n1. **Perlambatan ekonomi**: suku bunga tinggi mengurangi investasi dan konsumsi, menurunkan permintaan komoditas\n2. **Penguatan mata uang**: suku bunga tinggi menarik modal asing, menguatkan USD, membuat komoditas (dalam USD) lebih mahal bagi pembeli non-USD\n3. **Biaya penyimpanan naik**: biaya menyimpan inventori (*carrying cost*) meningkat, mendorong penjualan stok\n4. **Investasi spekulatif berkurang**: investor beralih ke aset berbunga (obligasi) yang lebih menarik\n\nContoh historis:\n- Kenaikan suku bunga The Fed 2022-2023 menekan harga nikel dan tembaga\n- Sebaliknya, suku bunga rendah pasca-COVID mendorong *commodity supercycle*',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Free Trade Agreement* (FTA) dan bagaimana manfaatnya bagi eksportir?',
    options: [
      { key: 'A', text: 'Perjanjian antar perusahaan untuk membagi pasar secara eksklusif' },
      { key: 'B', text: 'Standar kualitas yang harus dipenuhi semua produk ekspor' },
      { key: 'C', text: 'Program subsidi pemerintah untuk perusahaan yang melakukan ekspor' },
      { key: 'D', text: 'Perjanjian antar negara untuk mengurangi atau menghapus hambatan perdagangan' },
      { key: 'E', text: 'Izin khusus yang diberikan pemerintah kepada eksportir berprestasi' },
    ],
    correct_answer: 'D',
    explanation: '***Free Trade Agreement*** (FTA) adalah **perjanjian antar negara** untuk **mengurangi atau menghapus hambatan perdagangan** (tarif, kuota, regulasi).\n\nFTA yang melibatkan Indonesia:\n\n| FTA | Negara/Kawasan |\n|---|---|\n| **ASEAN-China FTA** (ACFTA) | ASEAN + China |\n| **RCEP** | 15 negara Asia-Pasifik |\n| **IA-CEPA** | Indonesia - Australia |\n| **IK-CEPA** | Indonesia - Korea Selatan |\n| **IJ-EPA** | Indonesia - Jepang |\n\nManfaat bagi eksportir:\n- **Tarif impor lebih rendah** (bahkan 0%) di negara tujuan\n- **Akses pasar lebih luas** dan kompetitif\n- **Prosedur kepabeanan** yang lebih sederhana\n- **Perlindungan investasi** yang lebih baik\n\nSyarat: harus memenuhi ***Rules of Origin*** (kandungan lokal minimum) untuk mendapatkan preferensi tarif.',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *commodity supercycle* dan apa pemicunya?',
    options: [
      { key: 'A', text: 'Siklus tahunan perubahan harga komoditas yang terjadi setiap 12 bulan' },
      { key: 'B', text: 'Fluktuasi harga komoditas yang disebabkan oleh perubahan musim' },
      { key: 'C', text: 'Penurunan harga komoditas yang berlangsung selama lebih dari 5 tahun' },
      { key: 'D', text: 'Sistem perdagangan komoditas yang menggunakan mata uang kripto' },
      { key: 'E', text: 'Kenaikan harga komoditas secara luas dan berkelanjutan selama 10-35 tahun akibat transformasi struktural' },
    ],
    correct_answer: 'E',
    explanation: '***Commodity supercycle*** adalah **kenaikan harga komoditas secara luas** dan **berkelanjutan** selama **10-35 tahun**, didorong oleh **transformasi struktural** ekonomi global.\n\nSupercycle historis:\n1. **1890-1910**: industrialisasi AS\n2. **1930-1950**: rearmamen dan Perang Dunia II\n3. **1960-1980**: rekonstruksi pasca-perang, pertumbuhan Jepang/Eropa\n4. **2000-2011**: urbanisasi dan industrialisasi China\n5. **2020-an?**: transisi energi hijau (*EV*, *renewable energy*)\n\nPemicu supercycle:\n- **Urbanisasi massal**: pembangunan infrastruktur skala besar\n- **Transisi teknologi**: EV membutuhkan Ni, Li, Co, Cu dalam jumlah besar\n- **Keterbatasan pasokan**: investasi tambang baru butuh waktu 5-10 tahun\n- **Perubahan geopolitik**: *reshoring*, diversifikasi rantai pasok',
  },
  {
    order_index: 28,
    category: 'T2',
    difficulty: 'medium',
    content: 'Jika harga nikel LME naik 10% sementara kurs Rupiah melemah 5% terhadap USD, berapa perkiraan kenaikan pendapatan eksportir dalam Rupiah?',
    options: [
      { key: 'A', text: 'Sekitar $15{,}5\\%$ (efek kumulatif kenaikan harga dan pelemahan kurs)' },
      { key: 'B', text: 'Tepat $10\\%$ (hanya mengikuti kenaikan harga LME)' },
      { key: 'C', text: 'Tepat $5\\%$ (hanya mengikuti pelemahan kurs)' },
      { key: 'D', text: 'Tepat $15\\%$ (penjumlahan sederhana kedua faktor)' },
      { key: 'E', text: 'Tidak berubah karena kedua efek saling meniadakan' },
    ],
    correct_answer: 'A',
    explanation: 'Perhitungan efek kumulatif:\n$$\\begin{aligned} \\text{Faktor harga} &= 1 + 10\\% = 1{,}10 \\\\ \\text{Faktor kurs} &= 1 + 5\\% = 1{,}05 \\\\ \\text{Efek total} &= 1{,}10 \\times 1{,}05 = 1{,}155 \\\\ \\text{Kenaikan} &= 15{,}5\\% \\end{aligned}$$\n\nContoh numerik:\n- Harga awal: $\\$15.000$/ton, kurs Rp 15.000/USD\n- Pendapatan awal: Rp 225 juta/ton\n- Harga baru: $\\$16.500$/ton, kurs Rp 15.750/USD\n- Pendapatan baru: Rp 259,875 juta/ton\n- Kenaikan: $\\frac{259{,}875 - 225}{225} \\times 100\\% = 15{,}5\\%$\n\nEfeknya **multiplikatif** (bukan aditif), sehingga hasilnya sedikit lebih dari penjumlahan sederhana 10% + 5% = 15%.',
  },

  // ═══════════════════════════════════════════
  // T3: Riset Pasar & Intelijen Bisnis (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa perbedaan antara data primer dan data sekunder dalam riset pasar komoditas?',
    options: [
      { key: 'A', text: 'Data primer menggunakan angka, data sekunder menggunakan teks deskriptif' },
      { key: 'B', text: 'Data primer dikumpulkan langsung untuk tujuan riset tertentu, data sekunder berasal dari sumber yang sudah ada' },
      { key: 'C', text: 'Data primer lebih akurat, data sekunder selalu tidak akurat' },
      { key: 'D', text: 'Data primer dari pemerintah, data sekunder dari perusahaan swasta' },
      { key: 'E', text: 'Data primer hanya kuantitatif, data sekunder hanya kualitatif' },
    ],
    correct_answer: 'B',
    explanation: 'Perbedaan **data primer** dan **data sekunder**:\n\n| Aspek | Data Primer | Data Sekunder |\n|---|---|---|\n| **Sumber** | Dikumpulkan **langsung** untuk riset | Dari sumber **yang sudah ada** |\n| Contoh | Survei pelanggan, wawancara | Laporan industri, data LME, BPS |\n| Biaya | Lebih mahal | Lebih murah |\n| Waktu | Lebih lama | Lebih cepat |\n| Relevansi | Sangat relevan (dirancang khusus) | Mungkin kurang relevan |\n\nContoh riset pasar nikel:\n- **Primer**: wawancara dengan pembeli feronikel tentang rencana pembelian 2027, survei pabrik baja tentang preferensi produk\n- **Sekunder**: laporan Wood Mackenzie, data produksi USGS, statistik perdagangan UN Comtrade, harga historis LME',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa fungsi analisis PESTEL dalam riset pasar komoditas?',
    options: [
      { key: 'A', text: 'Menghitung harga jual optimal untuk setiap produk komoditas' },
      { key: 'B', text: 'Menentukan lokasi pabrik baru berdasarkan kedekatan dengan bahan baku' },
      { key: 'C', text: 'Menganalisis faktor eksternal makro yang mempengaruhi industri dan pasar' },
      { key: 'D', text: 'Mengevaluasi kinerja individu di departemen pemasaran' },
      { key: 'E', text: 'Merancang kemasan produk yang menarik bagi pelanggan korporat' },
    ],
    correct_answer: 'C',
    explanation: '**PESTEL** menganalisis **faktor eksternal makro** yang mempengaruhi industri:\n\n| Faktor | Contoh di Industri Nikel |\n|---|---|\n| **P**olitical | Kebijakan hilirisasi, larangan ekspor bijih |\n| **E**conomic | GDP China, suku bunga global, inflasi |\n| **S**ocial | Tuntutan masyarakat sekitar tambang, tenaga kerja |\n| **T**echnological | HPAL, baterai EV, daur ulang nikel |\n| **E**nvironmental | Regulasi emisi karbon, standar ESG |\n| **L**egal | UU Minerba, perjanjian IUP, pajak royalti |\n\nManfaat PESTEL:\n- Mengidentifikasi **peluang dan ancaman** dari lingkungan makro\n- **Mempersiapkan strategi** menghadapi perubahan eksternal\n- Melengkapi analisis internal (SWOT)\n- Dasar untuk **skenario planning** jangka panjang',
  },
  {
    order_index: 31,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Porter\'s Five Forces* dan bagaimana relevansinya untuk industri nikel?',
    options: [
      { key: 'A', text: 'Kerangka analisis kekuatan kompetitif yang mempengaruhi profitabilitas industri' },
      { key: 'B', text: 'Lima departemen utama yang harus dimiliki perusahaan tambang' },
      { key: 'C', text: 'Lima tahap proses produksi nikel dari bijih hingga produk jadi' },
      { key: 'D', text: 'Lima negara produsen nikel terbesar di dunia' },
      { key: 'E', text: 'Lima jenis produk nikel yang diperdagangkan di LME' },
    ],
    correct_answer: 'A',
    explanation: '***Porter\'s Five Forces*** menganalisis **kekuatan kompetitif** yang mempengaruhi **profitabilitas industri**:\n\n| Kekuatan | Analisis Industri Nikel |\n|---|---|\n| **Ancaman pendatang baru** | Tinggi: investasi tambang besar, tetapi banyak investor China masuk |\n| **Kekuatan pemasok** | Sedang: peralatan tambang dari beberapa produsen global |\n| **Kekuatan pembeli** | Tinggi: pembeli besar (pabrik baja) memiliki *bargaining power* |\n| **Ancaman substitusi** | Sedang: aluminium/mangan bisa menggantikan Ni di beberapa aplikasi |\n| **Rivalitas industri** | Tinggi: banyak produsen, produk homogen, harga ditentukan pasar |\n\nImplikasi strategis:\n- Industri dengan **5 kekuatan tinggi**: profitabilitas rendah, persaingan ketat\n- Diferensiasi dan efisiensi biaya menjadi kunci kelangsungan hidup',
  },
  {
    order_index: 32,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *elastisitas harga permintaan* dan bagaimana penerapannya pada komoditas nikel?',
    options: [
      { key: 'A', text: 'Kemampuan harga nikel untuk kembali ke level semula setelah guncangan pasar' },
      { key: 'B', text: 'Fleksibilitas perusahaan dalam menyesuaikan harga jual sesuai biaya produksi' },
      { key: 'C', text: 'Kecepatan pasar merespons perubahan harga nikel dengan perubahan volume' },
      { key: 'D', text: 'Ukuran sensitivitas perubahan jumlah permintaan terhadap perubahan harga' },
      { key: 'E', text: 'Kemampuan pembeli untuk menahan pembelian selama harga naik tinggi' },
    ],
    correct_answer: 'D',
    explanation: '***Elastisitas harga permintaan*** mengukur **sensitivitas perubahan jumlah permintaan** terhadap **perubahan harga**:\n$$E_d = \\frac{\\%\\Delta Q}{\\%\\Delta P}$$\n\nAplikasi pada nikel:\n- **Jangka pendek**: elastisitas **rendah** (inelastis, $|E_d| < 1$)\n  - Pabrik baja **tidak bisa** langsung mengganti nikel dengan substitusi\n  - Kontrak jangka panjang mengunci volume\n- **Jangka panjang**: elastisitas **lebih tinggi**\n  - Produsen baja bisa beralih ke *ferritic stainless steel* (tanpa Ni)\n  - Produsen baterai bisa beralih ke **LFP** (tanpa Ni) jika harga Ni terlalu tinggi\n\nImplikasi pemasaran:\n- Permintaan inelastis = kenaikan harga **tidak banyak** mengurangi volume\n- Tetapi elastisitas jangka panjang mengingatkan bahwa harga yang terlalu tinggi mendorong **substitusi permanen**',
  },

  // ═══════════════════════════════════════════
  // T4: Manajemen Hubungan Pelanggan/CRM (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa manfaat utama kunjungan rutin (*regular visit*) ke pelanggan korporat dalam bisnis komoditas?',
    options: [
      { key: 'A', text: 'Menghemat biaya telepon dan email karena komunikasi dilakukan langsung' },
      { key: 'B', text: 'Memenuhi target perjalanan dinas yang ditetapkan oleh manajemen' },
      { key: 'C', text: 'Mendapatkan fasilitas perjalanan gratis yang disediakan oleh pelanggan' },
      { key: 'D', text: 'Mengumpulkan foto dan dokumentasi untuk laporan tahunan perusahaan' },
      { key: 'E', text: 'Membangun hubungan personal, memahami kebutuhan, dan mengantisipasi masalah' },
    ],
    correct_answer: 'E',
    explanation: 'Kunjungan rutin ke pelanggan korporat bermanfaat untuk:\n\n1. **Membangun hubungan personal**: kepercayaan (*trust*) yang sulit dibangun via email/telepon saja\n2. **Memahami kebutuhan**: mengetahui rencana ekspansi, perubahan spesifikasi, atau masalah operasional pelanggan\n3. **Mengantisipasi masalah**: mendeteksi ketidakpuasan sebelum menjadi keluhan formal\n4. **Informasi kompetitor**: mengetahui aktivitas pesaing yang mendekati pelanggan\n5. **Negosiasi efektif**: diskusi langsung lebih produktif untuk isu-isu sensitif\n\nFrekuensi kunjungan:\n- **Key account**: setiap 1-2 bulan\n- **Regular account**: setiap 3-6 bulan\n- **Prospek**: sesuai kebutuhan pengembangan\n\nOutput kunjungan:\n- *Visit report* yang didistribusikan ke tim terkait\n- *Action items* dan jadwal tindak lanjut',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *annual business review* dalam hubungan B2B komoditas?',
    options: [
      { key: 'A', text: 'Pemeriksaan laporan keuangan tahunan oleh auditor eksternal' },
      { key: 'B', text: 'Evaluasi kinerja karyawan departemen pemasaran setiap akhir tahun' },
      { key: 'C', text: 'Rapat umum pemegang saham tahunan untuk membahas dividen' },
      { key: 'D', text: 'Rapat tahunan antara manajemen untuk mengevaluasi kinerja dan merancang target tahun depan' },
      { key: 'E', text: 'Pertemuan tahunan dengan pelanggan untuk mengevaluasi kinerja hubungan dan merencanakan kerja sama ke depan' },
    ],
    correct_answer: 'E',
    explanation: '***Annual business review*** (ABR) adalah **pertemuan tahunan** antara perusahaan dan pelanggan untuk **mengevaluasi kinerja** dan **merencanakan kerja sama** ke depan.\n\nAgenda ABR:\n\n**Review kinerja tahun lalu:**\n- Volume realisasi vs kontrak\n- Kualitas produk (laporan CoA, klaim)\n- Ketepatan pengiriman (*on-time delivery rate*)\n- Penyelesaian masalah dan keluhan\n\n**Perencanaan tahun depan:**\n- Proyeksi volume pembelian\n- Perubahan spesifikasi produk\n- Rencana ekspansi atau proyek baru pelanggan\n- Negosiasi harga dan syarat kontrak baru\n\nPeserta: manajemen senior dari kedua pihak (VP Marketing, VP Procurement, tim teknis). ABR memperkuat **komitmen jangka panjang** dan transparansi.',
  },
  {
    order_index: 35,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa strategi yang tepat ketika pelanggan utama mengancam beralih ke kompetitor karena harga?',
    options: [
      { key: 'A', text: 'Langsung menurunkan harga untuk menyamai penawaran kompetitor' },
      { key: 'B', text: 'Menganalisis total value yang diberikan dan menegosiasikan berdasarkan keunggulan non-harga' },
      { key: 'C', text: 'Mengabaikan ancaman karena pelanggan pasti kembali setelah mencoba kompetitor' },
      { key: 'D', text: 'Memutus hubungan lebih dulu sebelum pelanggan beralih' },
      { key: 'E', text: 'Melapor ke pemerintah agar kompetitor dilarang menjual ke pelanggan tersebut' },
    ],
    correct_answer: 'B',
    explanation: 'Strategi menghadapi ancaman beralih ke kompetitor:\n\n1. **Analisis *total cost of ownership*** (TCO):\n   - Harga per ton bukan satu-satunya biaya\n   - Bandingkan: konsistensi kualitas, keandalan pengiriman, risiko pasokan\n   - Biaya beralih (*switching cost*): kualifikasi produk baru, uji coba\n\n2. **Negosiasi berbasis nilai**:\n   - Jelaskan **keunggulan non-harga**: track record, layanan teknis, fleksibilitas\n   - Tawarkan **paket komprehensif**: harga + layanan + jaminan pasokan\n   - Berikan **insentif volume**: diskon untuk komitmen volume jangka panjang\n\n3. **Batas bawah**:\n   - Jangan menjual di bawah **harga pokok** hanya untuk mempertahankan pelanggan\n   - Evaluasi profitabilitas pelanggan secara keseluruhan',
  },
  {
    order_index: 36,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *after-sales service* dalam pemasaran komoditas tambang?',
    options: [
      { key: 'A', text: 'Penjualan produk tambahan setelah transaksi utama selesai' },
      { key: 'B', text: 'Penagihan pembayaran yang belum lunas dari transaksi sebelumnya' },
      { key: 'C', text: 'Layanan yang diberikan setelah pengiriman untuk memastikan kepuasan pelanggan' },
      { key: 'D', text: 'Diskon khusus yang diberikan untuk pembelian berikutnya' },
      { key: 'E', text: 'Promosi produk baru melalui email kepada pelanggan yang sudah membeli' },
    ],
    correct_answer: 'C',
    explanation: '***After-sales service*** adalah **layanan setelah pengiriman** untuk memastikan **kepuasan pelanggan**.\n\nBentuk after-sales service komoditas:\n\n- **Dokumentasi kualitas**: pengiriman CoA (*Certificate of Analysis*) tepat waktu\n- **Penanganan klaim**: respons cepat jika ada ketidaksesuaian kualitas\n- **Dukungan teknis**: membantu pelanggan mengoptimalkan penggunaan produk\n- **Informasi pasar**: berbagi *market intelligence* yang relevan\n- **Monitoring pengiriman**: update status *shipment* real-time\n\nManfaat:\n- Meningkatkan **kepuasan dan loyalitas** pelanggan\n- Mengurangi risiko **kehilangan pelanggan**\n- Mendapatkan **umpan balik** untuk perbaikan produk\n- Membuka peluang **cross-selling** atau peningkatan volume',
  },

  // ═══════════════════════════════════════════
  // T5: Dasar Manajemen Logistik & Pengiriman (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 37,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa risiko *liquefaction* dalam pengangkutan bijih nikel melalui laut?',
    options: [
      { key: 'A', text: 'Bijih nikel mencair karena suhu tinggi di dalam palka kapal' },
      { key: 'B', text: 'Muatan kargo menjadi seperti cairan kental akibat kadar air tinggi dan getaran kapal, menyebabkan kapal terguling' },
      { key: 'C', text: 'Air laut masuk ke palka dan melarutkan mineral nikel dalam kargo' },
      { key: 'D', text: 'Bijih nikel bereaksi kimia dengan air laut menghasilkan gas beracun' },
      { key: 'E', text: 'Kapal tenggelam karena berat jenis nikel yang sangat tinggi' },
    ],
    correct_answer: 'A',
    explanation: '***Liquefaction*** dalam konteks kargo curah adalah fenomena di mana **muatan padat berubah menjadi seperti cairan** akibat:\n- **Kadar air tinggi** (melebihi *Transportable Moisture Limit*/TML)\n- **Getaran dan guncangan** kapal selama pelayaran\n\nMekanisme:\n1. Getaran kapal menyebabkan partikel bijih memadat (*compaction*)\n2. Air terperangkap di antara partikel naik ke permukaan\n3. Muatan berubah menjadi *slurry* yang bergerak bebas\n4. Pergeseran muatan ke satu sisi menyebabkan **kapal miring** (*listing*)\n5. Jika tidak bisa dikembalikan, kapal **terguling** (*capsize*)\n\nPencegahan:\n- Kadar air harus di bawah **TML** (biasanya 25-35% untuk bijih nikel)\n- Pengujian **flow table test** atau **Proctor/Fagerberg test** sebelum muat\n- Regulasi **IMSBC Code** (International Maritime Solid Bulk Cargoes)\n\nKasus: beberapa kapal pengangkut bijih nikel dari Indonesia tenggelam akibat liquefaction.',
  },
  {
    order_index: 38,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa fungsi surveyor independen dalam pengiriman komoditas tambang?',
    options: [
      { key: 'A', text: 'Menentukan rute pelayaran yang paling efisien dari pelabuhan asal ke tujuan' },
      { key: 'B', text: 'Memperbaiki kerusakan mesin kapal yang terjadi selama pelayaran' },
      { key: 'C', text: 'Memverifikasi kuantitas dan kualitas kargo secara independen untuk kedua pihak' },
      { key: 'D', text: 'Merekrut dan melatih awak kapal untuk pengiriman komoditas curah' },
      { key: 'E', text: 'Menyediakan asuransi kargo untuk seluruh pengiriman komoditas' },
    ],
    correct_answer: 'C',
    explanation: '**Surveyor independen** berfungsi **memverifikasi kuantitas dan kualitas** kargo secara netral untuk kepentingan **kedua pihak** (penjual dan pembeli).\n\nLayanan surveyor:\n\n| Layanan | Detail |\n|---|---|\n| **Draft survey** | Mengukur tonase kargo berdasarkan *draft* (kedalaman) kapal |\n| **Sampling** | Mengambil sampel kargo secara representatif |\n| **Analisis** | Menentukan kadar, kadar air, ukuran |\n| **Inspeksi palka** | Memeriksa kebersihan dan kesiapan palka kapal |\n| **Monitoring pemuatan** | Mengawasi proses *loading* |\n\nPerusahaan surveyor terkemuka:\n- SGS, Bureau Veritas, Intertek, PT Sucofindo\n\nHasil survey menjadi dasar **penyelesaian pembayaran** (kadar dan tonase yang digunakan untuk menghitung nilai transaksi).',
  },
  {
    order_index: 39,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *demurrage* dalam pengiriman komoditas laut?',
    options: [
      { key: 'A', text: 'Biaya asuransi kargo yang ditanggung oleh pemilik kapal' },
      { key: 'B', text: 'Pajak pelabuhan yang dikenakan untuk setiap kapal yang berlabuh' },
      { key: 'C', text: 'Biaya perbaikan kapal yang ditanggung bersama oleh penjual dan pembeli' },
      { key: 'D', text: 'Denda yang dikenakan karena kapal menunggu melebihi waktu yang dialokasikan untuk bongkar muat' },
      { key: 'E', text: 'Biaya pengawal keamanan untuk kargo bernilai tinggi selama pelayaran' },
    ],
    correct_answer: 'D',
    explanation: '***Demurrage*** adalah **denda** yang dikenakan karena kapal menunggu melebihi **laytime** (waktu yang dialokasikan) untuk proses bongkar/muat.\n\nMekanisme:\n1. Kontrak menetapkan **laytime**: waktu yang diizinkan untuk loading/unloading (misal 5 hari)\n2. Jika proses melebihi laytime, pihak yang bertanggung jawab membayar **demurrage** (misal $\\$10.000$/hari)\n3. Jika proses selesai lebih cepat, pihak yang beruntung mendapat **dispatch** (bonus, biasanya 50% dari rate demurrage)\n\nPenyebab demurrage:\n- **Cuaca buruk**: hujan deras menghentikan pemuatan bijih\n- **Kongesti pelabuhan**: antrian kapal menunggu berth\n- **Kesiapan kargo**: bijih belum tersedia di stockpile pelabuhan\n- **Masalah peralatan**: crane atau conveyor rusak\n\nDemurrage bisa sangat mahal untuk kapal besar ($\\$15.000$-$\\$50.000$/hari untuk Supramax-Panamax).',
  },
  {
    order_index: 40,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa keuntungan integrasi *supply chain* dari tambang hingga pelanggan akhir bagi perusahaan komoditas?',
    options: [
      { key: 'A', text: 'Menghilangkan kebutuhan akan departemen logistik dan pergudangan' },
      { key: 'B', text: 'Meningkatkan efisiensi, mengurangi biaya, dan mempercepat respons terhadap permintaan pasar' },
      { key: 'C', text: 'Memungkinkan perusahaan menentukan harga jual tanpa memperhatikan pasar' },
      { key: 'D', text: 'Menghapus kebutuhan asuransi untuk seluruh rantai pengiriman' },
      { key: 'E', text: 'Mengurangi jumlah karyawan yang dibutuhkan di seluruh rantai nilai' },
    ],
    correct_answer: 'B',
    explanation: 'Integrasi *supply chain* memberikan keuntungan:\n\n1. **Efisiensi operasional**:\n   - Koordinasi produksi tambang dengan jadwal pengiriman dan permintaan pelanggan\n   - Mengurangi *idle time* dan penumpukan inventori\n\n2. **Pengurangan biaya**:\n   - Optimasi rute logistik dan pemilihan moda transportasi\n   - Mengurangi *demurrage* dengan perencanaan yang lebih baik\n   - *Economies of scale* dalam pengiriman\n\n3. **Respons cepat**:\n   - Visibilitas real-time terhadap stok dan pengiriman\n   - Fleksibilitas menyesuaikan volume produksi dengan permintaan\n   - *Lead time* pengiriman yang lebih pendek\n\nTeknologi pendukung:\n- **ERP** (Enterprise Resource Planning)\n- **GPS tracking** untuk fleet management\n- **IoT** untuk monitoring kualitas kargo\n- **Dashboard** real-time untuk KPI supply chain',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-marketing')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-marketing tidak ditemukan:', pkgErr)
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
