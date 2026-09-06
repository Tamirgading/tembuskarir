/**
 * ANTAM IMPACT 2026 — Marketing (MKT) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Prinsip Pemasaran B2B): 4 soal
 *   T2 (Ekonomi Makro & Perdagangan Internasional): 4 soal
 *   T3 (Riset Pasar & Intelijen Bisnis): 4 soal
 *   T4 (Manajemen Hubungan Pelanggan/CRM): 4 soal
 *   T5 (Dasar Manajemen Logistik & Pengiriman): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-mkt-batch1.ts
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
// A: 2,9,14,19 | B: 4,7,11,17 | C: 1,8,15,20 | D: 5,10,13,16 | E: 3,6,12,18

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Prinsip Pemasaran B2B (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa perbedaan utama antara pemasaran B2B (*Business-to-Business*) dan B2C (*Business-to-Consumer*)?',
    options: [
      { key: 'A', text: 'B2B menggunakan iklan TV, B2C menggunakan iklan media sosial' },
      { key: 'B', text: 'B2B hanya berlaku untuk perusahaan besar, B2C untuk perusahaan kecil' },
      { key: 'C', text: 'B2B melibatkan pembelian rasional antar perusahaan, B2C lebih bersifat emosional oleh individu' },
      { key: 'D', text: 'B2B tidak memerlukan strategi pemasaran, B2C memerlukan strategi pemasaran' },
      { key: 'E', text: 'B2B menjual produk digital saja, B2C menjual produk fisik saja' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan pemasaran **B2B** dan **B2C**:\n\n| Aspek | B2B | B2C |\n|---|---|---|\n| **Pembeli** | Perusahaan/organisasi | Individu/konsumen akhir |\n| **Keputusan** | **Rasional**, berbasis data & ROI | **Emosional**, berbasis keinginan |\n| Proses pembelian | Panjang, melibatkan banyak pihak | Pendek, individual |\n| Hubungan | Jangka panjang, kontraktual | Transaksional |\n| Volume | Besar (*bulk*) | Satuan/kecil |\n| Harga | Negosiasi, kontrak tahunan | Harga tetap (*fixed price*) |\n\nContoh B2B di ANTAM:\n- Penjualan feronikel ke pabrik baja (Posco, Tsingshan)\n- Penjualan bijih nikel ke smelter\n- Penjualan emas ke Bank Indonesia',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Dalam pemasaran komoditas tambang, apa yang dimaksud dengan *Key Account Management* (KAM)?',
    options: [
      { key: 'A', text: 'Pengelolaan hubungan strategis dengan pelanggan utama yang memberikan kontribusi pendapatan terbesar' },
      { key: 'B', text: 'Sistem pengelolaan kunci akses digital untuk seluruh sistem informasi perusahaan' },
      { key: 'C', text: 'Metode pencatatan transaksi akuntansi untuk pelanggan tertentu' },
      { key: 'D', text: 'Strategi perekrutan karyawan kunci di departemen pemasaran' },
      { key: 'E', text: 'Sistem penilaian kinerja manajer berdasarkan jumlah akun yang ditangani' },
    ],
    correct_answer: 'A',
    explanation: '***Key Account Management*** (KAM) adalah **pengelolaan hubungan strategis** dengan pelanggan utama (*key accounts*) yang memberikan **kontribusi pendapatan terbesar**.\n\nKarakteristik *key account*:\n- Menyumbang persentase signifikan dari total pendapatan (prinsip Pareto: 20% pelanggan = 80% pendapatan)\n- Memiliki potensi pertumbuhan jangka panjang\n- Strategis bagi posisi pasar perusahaan\n\nTugas Key Account Manager:\n- Memahami **kebutuhan spesifik** pelanggan secara mendalam\n- Menyusun **rencana akun** (*account plan*) tahunan\n- Menjadi **single point of contact** bagi pelanggan\n- Mengoordinasikan **lintas departemen** (produksi, logistik, keuangan)\n- Mengelola **kontrak jangka panjang** dan negosiasi harga',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa strategi *pricing* yang paling umum digunakan untuk komoditas nikel di pasar internasional?',
    options: [
      { key: 'A', text: 'Harga ditetapkan sepihak oleh produsen berdasarkan biaya produksi plus margin tetap' },
      { key: 'B', text: 'Harga ditentukan oleh pemerintah melalui regulasi harga minimum dan maksimum' },
      { key: 'C', text: 'Harga dinegosiasikan langsung antara penjual dan pembeli tanpa acuan pasar' },
      { key: 'D', text: 'Harga diskon tetap 50% dari harga retail yang tercantum di website' },
      { key: 'E', text: 'Harga mengacu pada benchmark pasar internasional seperti LME dengan penyesuaian premium/diskon' },
    ],
    correct_answer: 'E',
    explanation: 'Pricing komoditas nikel umumnya mengacu pada **benchmark pasar internasional**:\n\n**London Metal Exchange (LME)**:\n- Acuan harga utama untuk **nikel** dan logam dasar lainnya\n- Harga ditentukan oleh *supply-demand* di pasar terbuka\n- Kontrak: *spot*, 3 bulan, 15 bulan\n\nMekanisme harga jual:\n$$\\text{Harga jual} = \\text{Harga LME} \\pm \\text{Premium/Diskon}$$\n\nFaktor premium/diskon:\n- **Kualitas produk**: kadar Ni, bentuk (feronikel, NPI, MHP)\n- **Lokasi pengiriman**: biaya freight ke pelabuhan tujuan\n- **Volume kontrak**: volume besar bisa mendapat diskon\n- **Hubungan bisnis**: pelanggan lama bisa mendapat harga lebih baik\n- **Kondisi pasar**: *tight market* = premium naik, *oversupply* = diskon',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan segmentasi pasar dalam konteks pemasaran komoditas tambang?',
    options: [
      { key: 'A', text: 'Membagi area tambang menjadi blok-blok penambangan berdasarkan kadar' },
      { key: 'B', text: 'Mengelompokkan pelanggan berdasarkan karakteristik dan kebutuhan yang serupa' },
      { key: 'C', text: 'Memisahkan produk berdasarkan ukuran kemasan untuk pengiriman' },
      { key: 'D', text: 'Membagi wilayah penjualan berdasarkan jarak dari lokasi tambang' },
      { key: 'E', text: 'Mengelompokkan karyawan pemasaran berdasarkan wilayah tanggung jawab' },
    ],
    correct_answer: 'B',
    explanation: '**Segmentasi pasar** adalah **pengelompokan pelanggan** berdasarkan karakteristik dan kebutuhan yang serupa untuk menyusun strategi pemasaran yang tepat.\n\nKriteria segmentasi di industri komoditas:\n\n| Kriteria | Contoh |\n|---|---|\n| **Industri** | Baja, baterai EV, stainless steel, elektronik |\n| **Geografi** | Asia Timur, Eropa, Amerika Utara |\n| **Volume** | Pembeli besar (> 10.000 ton/tahun) vs kecil |\n| **Produk** | Feronikel, NPI, MHP, bijih mentah |\n| **Aplikasi akhir** | Otomotif, konstruksi, energi |\n\nManfaat segmentasi:\n- Mengalokasikan **produksi** sesuai segmen yang paling menguntungkan\n- Menyesuaikan **spesifikasi produk** per segmen\n- Menentukan **strategi harga** berbeda per segmen\n- Mengoptimalkan **alokasi sumber daya** pemasaran',
  },

  // ═══════════════════════════════════════════
  // T2: Ekonomi Makro & Perdagangan Internasional (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Bagaimana penguatan nilai tukar Rupiah terhadap Dolar AS mempengaruhi pendapatan eksportir nikel Indonesia?',
    options: [
      { key: 'A', text: 'Pendapatan meningkat karena harga nikel internasional otomatis naik' },
      { key: 'B', text: 'Tidak berpengaruh karena transaksi nikel dilakukan dalam mata uang Rupiah' },
      { key: 'C', text: 'Pendapatan meningkat karena biaya impor bahan baku menjadi lebih murah' },
      { key: 'D', text: 'Pendapatan dalam Rupiah menurun karena konversi USD ke IDR menghasilkan nilai lebih kecil' },
      { key: 'E', text: 'Pendapatan meningkat karena permintaan ekspor dari luar negeri bertambah' },
    ],
    correct_answer: 'D',
    explanation: 'Penguatan Rupiah (misal dari Rp 16.000/USD menjadi Rp 14.000/USD) **menurunkan pendapatan dalam Rupiah** bagi eksportir:\n\nContoh perhitungan:\n- Harga jual nikel: $\\$15.000$ per ton\n- Kurs Rp 16.000/USD: pendapatan = Rp 240 juta/ton\n- Kurs Rp 14.000/USD: pendapatan = Rp 210 juta/ton\n- **Selisih**: Rp 30 juta/ton lebih rendah\n\nDampak pada eksportir:\n- **Pendapatan** (dalam IDR) turun, sementara biaya operasi tetap dalam IDR\n- **Margin keuntungan** tertekan\n- **Daya saing** relatif terhadap produsen negara lain bisa terpengaruh\n\nSebaliknya, pelemahan Rupiah **menguntungkan** eksportir karena konversi USD menghasilkan IDR lebih besar.',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan siklus ekonomi (*business cycle*) dan bagaimana pengaruhnya terhadap harga komoditas?',
    options: [
      { key: 'A', text: 'Siklus produksi tambang dari eksplorasi hingga penutupan tambang' },
      { key: 'B', text: 'Jadwal pengiriman komoditas yang berulang setiap tahun sesuai kontrak' },
      { key: 'C', text: 'Rotasi karyawan antar departemen dalam perusahaan tambang' },
      { key: 'D', text: 'Pergantian teknologi pengolahan mineral setiap dekade' },
      { key: 'E', text: 'Fluktuasi aktivitas ekonomi antara ekspansi dan resesi yang mempengaruhi permintaan komoditas' },
    ],
    correct_answer: 'E',
    explanation: '**Siklus ekonomi** (*business cycle*) adalah **fluktuasi aktivitas ekonomi** yang berulang antara fase:\n\n| Fase | Dampak pada komoditas |\n|---|---|\n| **Ekspansi** | Permintaan naik, harga cenderung **naik** |\n| **Puncak** (*peak*) | Harga mencapai titik tertinggi, risiko *overheating* |\n| **Resesi** | Permintaan turun, harga cenderung **turun** |\n| **Lembah** (*trough*) | Harga di titik terendah, potensi *recovery* |\n\nContoh pada nikel:\n- Boom infrastruktur China (2000-an) mendorong harga nikel dari $\\$5.000$ ke $\\$50.000$/ton\n- Resesi 2008 menurunkan harga nikel hingga 70% dalam 6 bulan\n- Boom EV (2020-an) menciptakan siklus baru permintaan nikel kelas baterai\n\nPenting bagi pemasar: **menyesuaikan strategi** (kontrak jangka panjang saat harga tinggi, akumulasi pelanggan saat harga rendah).',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa dampak kebijakan tarif impor yang diberlakukan negara tujuan ekspor terhadap eksportir Indonesia?',
    options: [
      { key: 'A', text: 'Eksportir mendapat keuntungan lebih besar karena tarif dibayar oleh importir' },
      { key: 'B', text: 'Produk Indonesia menjadi lebih mahal di negara tujuan sehingga daya saing menurun' },
      { key: 'C', text: 'Tarif impor hanya berlaku untuk produk jadi, tidak untuk komoditas mentah' },
      { key: 'D', text: 'Indonesia otomatis dibebaskan dari tarif karena status negara berkembang' },
      { key: 'E', text: 'Tarif impor tidak mempengaruhi volume perdagangan internasional' },
    ],
    correct_answer: 'B',
    explanation: 'Tarif impor di negara tujuan membuat **produk Indonesia lebih mahal** di pasar tersebut:\n\nMekanisme:\n$$\\text{Harga di negara tujuan} = \\text{Harga CIF} + \\text{Tarif impor}$$\n\nDampak:\n- **Daya saing menurun**: harga lebih tinggi dibanding produsen dari negara yang memiliki perjanjian FTA (*Free Trade Agreement*)\n- **Volume ekspor** bisa berkurang karena pembeli beralih ke sumber lain\n- **Margin** tertekan jika eksportir harus menurunkan harga untuk mengompensasi\n\nStrategi menghadapi tarif:\n- Memanfaatkan **FTA** yang sudah ada (ASEAN-China, RCEP, dll.)\n- **Hilirisasi** produk (tarif untuk produk olahan bisa berbeda dari bijih mentah)\n- **Diversifikasi pasar** ke negara tanpa/rendah tarif\n- **Lobbying** melalui asosiasi industri untuk negosiasi tarif',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'medium',
    content: 'Harga nikel di LME adalah $\\$18.000$/ton. Jika biaya produksi ANTAM $\\$12.000$/ton dan kurs Rp $16.000$/USD, berapa margin keuntungan per ton dalam Rupiah?',
    options: [
      { key: 'A', text: 'Rp 48 juta' },
      { key: 'B', text: 'Rp 288 juta' },
      { key: 'C', text: 'Rp 96 juta' },
      { key: 'D', text: 'Rp 192 juta' },
      { key: 'E', text: 'Rp 72 juta' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan margin keuntungan:\n$$\\begin{aligned} \\text{Margin (USD)} &= \\text{Harga jual} - \\text{Biaya produksi} \\\\ &= \\$18.000 - \\$12.000 = \\$6.000 \\text{ per ton} \\\\ \\text{Margin (IDR)} &= \\$6.000 \\times \\text{Rp } 16.000 \\\\ &= \\text{Rp } 96.000.000 \\text{ per ton} \\end{aligned}$$\n\nMargin Rp 96 juta per ton atau sekitar **33,3%** dari harga jual.\n\nFaktor yang mempengaruhi margin aktual:\n- Biaya *freight* dan asuransi pengiriman\n- Premium/diskon kualitas produk\n- Fluktuasi kurs harian\n- Biaya overhead dan administrasi\n- Pajak ekspor dan royalti pemerintah',
  },

  // ═══════════════════════════════════════════
  // T3: Riset Pasar & Intelijen Bisnis (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan analisis *supply and demand* dalam konteks komoditas nikel?',
    options: [
      { key: 'A', text: 'Analisis keseimbangan antara pasokan nikel global dan permintaan dari berbagai industri pengguna' },
      { key: 'B', text: 'Perhitungan jumlah karyawan yang dibutuhkan di departemen pemasaran' },
      { key: 'C', text: 'Perbandingan antara anggaran pemasaran dan pendapatan penjualan' },
      { key: 'D', text: 'Evaluasi kapasitas gudang penyimpanan terhadap volume produksi' },
      { key: 'E', text: 'Analisis kebutuhan listrik dan air untuk operasional pabrik' },
    ],
    correct_answer: 'A',
    explanation: 'Analisis ***supply and demand*** nikel mengkaji **keseimbangan antara pasokan dan permintaan** global:\n\n**Sisi Supply (Pasokan):**\n- Produksi tambang nikel global (Indonesia, Filipina, Rusia, Kaledonia Baru)\n- Kapasitas smelter dan refinery\n- Stok di gudang LME dan produsen\n- Nikel daur ulang (*secondary supply*)\n\n**Sisi Demand (Permintaan):**\n- **Stainless steel**: ~65-70% konsumsi nikel global\n- **Baterai EV**: segmen dengan pertumbuhan tercepat (~15%)\n- **Alloy & superalloy**: aerospace, industri kimia\n- **Plating**: pelapisan logam\n\nJika **supply > demand**: harga cenderung turun (*surplus*)\nJika **demand > supply**: harga cenderung naik (*deficit*)',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa tujuan pemetaan kompetitor (*competitive mapping*) bagi perusahaan tambang nikel?',
    options: [
      { key: 'A', text: 'Menentukan lokasi geografis tambang kompetitor untuk perencanaan logistik' },
      { key: 'B', text: 'Menyalin strategi pemasaran kompetitor yang paling sukses' },
      { key: 'C', text: 'Menghitung total cadangan nikel yang dimiliki oleh semua kompetitor' },
      { key: 'D', text: 'Memahami posisi relatif perusahaan dan mengidentifikasi keunggulan serta celah pasar' },
      { key: 'E', text: 'Membuat daftar harga produk kompetitor untuk menjual lebih murah' },
    ],
    correct_answer: 'D',
    explanation: '**Pemetaan kompetitor** bertujuan untuk **memahami posisi relatif** perusahaan di pasar dan **mengidentifikasi keunggulan kompetitif** serta celah pasar.\n\nDimensi pemetaan:\n\n| Dimensi | Komponen |\n|---|---|\n| **Kapasitas** | Volume produksi tahunan, cadangan |\n| **Biaya** | *Cash cost*, *all-in sustaining cost* |\n| **Produk** | Jenis (bijih, NPI, feronikel, MHP), kualitas |\n| **Pasar** | Segmen pelanggan, geografi, kontrak |\n| **Teknologi** | Proses (RKEF, HPAL, BF-BOF) |\n\nKompetitor utama nikel Indonesia:\n- **Vale Indonesia**: tambang nikel sulfida Sorowako\n- **Harita Group**: HPAL di Halmahera\n- **Tsingshan/IMIP**: NPI di Morowali\n- **Produsen global**: BHP, Glencore, Norilsk Nickel',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa kegunaan *forecasting* (peramalan) permintaan dalam perencanaan pemasaran komoditas?',
    options: [
      { key: 'A', text: 'Meramalkan cuaca di lokasi tambang untuk perencanaan produksi' },
      { key: 'B', text: 'Memproyeksikan volume permintaan masa depan untuk perencanaan produksi dan penjualan' },
      { key: 'C', text: 'Menentukan jumlah karyawan yang akan pensiun dalam 5 tahun ke depan' },
      { key: 'D', text: 'Meramalkan tanggal pasti kenaikan harga nikel di pasar LME' },
      { key: 'E', text: 'Memperkirakan jumlah kecelakaan kerja yang akan terjadi tahun depan' },
    ],
    correct_answer: 'B',
    explanation: '***Forecasting*** permintaan bertujuan **memproyeksikan volume permintaan masa depan** untuk dasar perencanaan.\n\nMetode forecasting:\n\n**Kuantitatif:**\n- **Time series**: analisis tren historis (moving average, exponential smoothing)\n- **Regresi**: hubungan permintaan nikel dengan variabel ekonomi (GDP, produksi baja)\n- **Ekonometri**: model multi-variabel kompleks\n\n**Kualitatif:**\n- **Expert opinion**: pendapat pakar industri\n- **Delphi method**: konsensus panel ahli\n- **Market survey**: survei ke pelanggan tentang rencana pembelian\n\nManfaat bagi perusahaan tambang:\n- **Perencanaan produksi**: menyesuaikan kapasitas smelter\n- **Manajemen stok**: menentukan tingkat inventori optimal\n- **Strategi harga**: mengantisipasi pergerakan harga\n- **Keputusan investasi**: ekspansi kapasitas atau penundaan proyek',
  },
  {
    order_index: 12,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *market intelligence* dalam pemasaran komoditas?',
    options: [
      { key: 'A', text: 'Sistem kecerdasan buatan yang menggantikan fungsi tim pemasaran' },
      { key: 'B', text: 'Program pelatihan untuk meningkatkan kecerdasan emosional tim penjualan' },
      { key: 'C', text: 'Sistem keamanan informasi untuk melindungi data penjualan perusahaan' },
      { key: 'D', text: 'Database pelanggan yang berisi alamat dan nomor telepon seluruh pembeli' },
      { key: 'E', text: 'Pengumpulan dan analisis informasi pasar secara sistematis untuk mendukung keputusan bisnis' },
    ],
    correct_answer: 'E',
    explanation: '***Market intelligence*** adalah **pengumpulan dan analisis informasi pasar** secara sistematis untuk mendukung **keputusan bisnis**.\n\nSumber informasi:\n- **Laporan industri**: Wood Mackenzie, CRU, Roskill\n- **Data bursa**: LME, SHFE (Shanghai Futures Exchange)\n- **Berita industri**: Metal Bulletin, Reuters, Bloomberg\n- **Regulasi pemerintah**: kebijakan ekspor, pajak, royalti\n- **Konferensi industri**: LME Week, Asia Nickel Conference\n\nInformasi yang dikumpulkan:\n- Pergerakan harga dan tren pasar\n- Aktivitas kompetitor (produksi, ekspansi, *shutdown*)\n- Kebijakan pemerintah yang mempengaruhi industri\n- Perkembangan teknologi (*EV battery chemistry*, *HPAL vs RKEF*)\n- Perubahan preferensi pelanggan',
  },

  // ═══════════════════════════════════════════
  // T4: Manajemen Hubungan Pelanggan/CRM (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T4',
    difficulty: 'medium',
    content: 'Dalam negosiasi kontrak jangka panjang (*offtake agreement*) komoditas nikel, apa aspek terpenting yang harus disepakati?',
    options: [
      { key: 'A', text: 'Warna seragam yang digunakan oleh tim pengirim saat pengiriman' },
      { key: 'B', text: 'Nama kapal dan rute pelayaran yang harus digunakan setiap pengiriman' },
      { key: 'C', text: 'Merek kemasan dan desain label produk untuk pemasaran ulang oleh pembeli' },
      { key: 'D', text: 'Mekanisme penentuan harga, volume, spesifikasi kualitas, dan syarat pengiriman' },
      { key: 'E', text: 'Jumlah karyawan pembeli yang boleh mengunjungi lokasi tambang penjual' },
    ],
    correct_answer: 'D',
    explanation: 'Aspek terpenting dalam ***offtake agreement*** (kontrak ambil alih jangka panjang):\n\n| Aspek | Detail |\n|---|---|\n| **Harga** | Formula harga (LME +/- premium), periode *quotation* |\n| **Volume** | Tonnase minimum/maksimum per tahun, toleransi +/- % |\n| **Spesifikasi** | Kadar Ni min/max, Fe, moisture, unsur penalti |\n| **Pengiriman** | Incoterms (FOB/CIF), jadwal *shipment*, pelabuhan |\n| **Pembayaran** | *Letter of Credit* (L/C), *payment terms* |\n| **Penyelesaian sengketa** | *Umpire analysis*, arbitrase |\n| **Force majeure** | Kejadian di luar kendali (bencana alam, regulasi) |\n\nDurasi kontrak: biasanya **1-5 tahun** dengan klausul perpanjangan otomatis.',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa tujuan utama strategi retensi pelanggan (*customer retention*) dalam pemasaran B2B?',
    options: [
      { key: 'A', text: 'Mempertahankan pelanggan yang sudah ada karena biaya akuisisi pelanggan baru jauh lebih tinggi' },
      { key: 'B', text: 'Mencegah pelanggan memberikan ulasan negatif di media sosial' },
      { key: 'C', text: 'Memaksa pelanggan tetap membeli meskipun kualitas produk menurun' },
      { key: 'D', text: 'Mengurangi jumlah tenaga penjualan yang dibutuhkan perusahaan' },
      { key: 'E', text: 'Mengumpulkan data pribadi pelanggan untuk dijual ke pihak ketiga' },
    ],
    correct_answer: 'A',
    explanation: '**Retensi pelanggan** bertujuan **mempertahankan pelanggan yang sudah ada** karena:\n\n- Biaya akuisisi pelanggan baru **5-7x lebih mahal** dari mempertahankan yang ada\n- Pelanggan lama cenderung **membeli lebih banyak** seiring waktu\n- Pelanggan loyal memberikan **referensi** ke pelanggan potensial\n- Hubungan jangka panjang menghasilkan **pendapatan yang lebih stabil**\n\nStrategi retensi di B2B komoditas:\n- **Konsistensi kualitas**: memenuhi spesifikasi secara konsisten\n- **Ketepatan pengiriman**: on-time delivery, komunikasi proaktif jika ada kendala\n- **Layanan teknis**: membantu pelanggan mengoptimalkan penggunaan produk\n- **Harga kompetitif**: *pricing* yang adil dan transparan\n- **Komunikasi reguler**: kunjungan berkala, laporan kualitas, *business review*',
  },
  {
    order_index: 15,
    category: 'T4',
    difficulty: 'medium',
    content: 'Bagaimana cara menangani keluhan pelanggan korporat yang menerima pengiriman bijih nikel di bawah spesifikasi kontrak?',
    options: [
      { key: 'A', text: 'Mengabaikan keluhan karena harga komoditas sudah ditetapkan oleh pasar' },
      { key: 'B', text: 'Memutus kontrak dengan pelanggan tersebut dan mencari pembeli baru' },
      { key: 'C', text: 'Merespons segera, melakukan investigasi bersama, dan menawarkan solusi kompensasi' },
      { key: 'D', text: 'Menyalahkan perusahaan logistik atas kerusakan produk selama pengiriman' },
      { key: 'E', text: 'Menaikkan harga pengiriman berikutnya untuk menutupi kerugian perusahaan' },
    ],
    correct_answer: 'C',
    explanation: 'Penanganan keluhan pelanggan korporat yang profesional:\n\n1. **Respons cepat**: akui keluhan dalam 24 jam, tunjukkan keseriusan\n2. **Investigasi bersama**: analisis sampel *retained*, *umpire analysis* jika perlu\n3. **Identifikasi penyebab**: masalah di produksi, sampling, atau pengiriman?\n4. **Solusi kompensasi**:\n   - **Price adjustment**: potongan harga untuk pengiriman yang tidak memenuhi spec\n   - **Volume replacement**: tambahan pengiriman untuk mengompensasi kekurangan\n   - **Credit note**: kredit untuk pengiriman berikutnya\n5. **Tindakan korektif**: perbaiki proses agar tidak terulang\n6. **Komunikasi**: update pelanggan tentang tindakan yang diambil\n\nPrinsip: **mempertahankan hubungan jangka panjang** lebih penting dari menang dalam satu sengketa.',
  },
  {
    order_index: 16,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *customer lifetime value* (CLV) dalam konteks pemasaran B2B?',
    options: [
      { key: 'A', text: 'Usia rata-rata pelanggan korporat sejak berdiri hingga saat ini' },
      { key: 'B', text: 'Jumlah karyawan pelanggan yang berinteraksi dengan tim penjualan perusahaan' },
      { key: 'C', text: 'Biaya total yang dikeluarkan untuk melayani satu pelanggan selama setahun' },
      { key: 'D', text: 'Total nilai pendapatan yang diharapkan dari satu pelanggan selama hubungan bisnis berlangsung' },
      { key: 'E', text: 'Umur produk yang dibeli pelanggan sebelum memerlukan penggantian' },
    ],
    correct_answer: 'D',
    explanation: '***Customer Lifetime Value*** (CLV) = **total nilai pendapatan** yang diharapkan dari satu pelanggan **selama seluruh hubungan bisnis** berlangsung.\n\nFormula sederhana:\n$$\\text{CLV} = \\text{Pendapatan rata-rata per tahun} \\times \\text{Durasi hubungan (tahun)}$$\n\nContoh:\n- Pelanggan membeli 50.000 ton nikel/tahun selama kontrak 5 tahun\n- Margin $\\$500$/ton\n- CLV = 50.000 $\\times$ $\\$500$ $\\times$ 5 = $\\$125$ juta\n\nManfaat menghitung CLV:\n- Menentukan **investasi yang layak** untuk akuisisi dan retensi pelanggan\n- **Memprioritaskan** pelanggan berdasarkan nilai jangka panjang\n- Membenarkan **biaya layanan ekstra** untuk pelanggan bernilai tinggi\n- Mengalokasikan **sumber daya pemasaran** secara efisien',
  },

  // ═══════════════════════════════════════════
  // T5: Dasar Manajemen Logistik & Pengiriman (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa arti *Incoterm* FOB (*Free on Board*) dalam perdagangan komoditas?',
    options: [
      { key: 'A', text: 'Pembeli bertanggung jawab atas semua biaya dari gudang penjual hingga gudang pembeli' },
      { key: 'B', text: 'Penjual bertanggung jawab hingga barang dimuat di atas kapal di pelabuhan asal' },
      { key: 'C', text: 'Penjual mengirim barang langsung ke gudang pembeli termasuk biaya asuransi' },
      { key: 'D', text: 'Pembeli mengambil barang langsung dari lokasi tambang penjual' },
      { key: 'E', text: 'Biaya pengiriman dibagi rata antara penjual dan pembeli' },
    ],
    correct_answer: 'B',
    explanation: '**FOB** (*Free on Board*) = **penjual bertanggung jawab** atas biaya dan risiko **hingga barang dimuat di atas kapal** di pelabuhan asal.\n\nIncoterms yang umum di komoditas tambang:\n\n| Incoterm | Tanggung jawab penjual |\n|---|---|\n| **EXW** (*Ex Works*) | Sampai gudang penjual saja |\n| **FOB** | Sampai dimuat di kapal pelabuhan asal |\n| **CFR** (*Cost and Freight*) | Sampai pelabuhan tujuan (tanpa asuransi) |\n| **CIF** (*Cost, Insurance, Freight*) | Sampai pelabuhan tujuan + asuransi |\n\nContoh FOB untuk ekspor nikel:\n- ANTAM bertanggung jawab atas biaya angkut dari tambang ke pelabuhan, biaya muat (*loading*), dan bea ekspor\n- Pembeli menanggung biaya *freight* kapal, asuransi, dan bea impor\n- Risiko berpindah ke pembeli saat barang **melewati pagar kapal** (*ship\'s rail*)',
  },
  {
    order_index: 18,
    category: 'T5',
    difficulty: 'medium',
    content: 'Dokumen apa yang wajib ada dalam proses ekspor komoditas mineral dari Indonesia?',
    options: [
      { key: 'A', text: 'Kartu kredit perusahaan dan bukti pembayaran pajak penghasilan karyawan' },
      { key: 'B', text: 'Paspor direktur perusahaan dan visa negara tujuan ekspor' },
      { key: 'C', text: 'Surat keterangan domisili perusahaan dan akta kelahiran direktur' },
      { key: 'D', text: 'Surat rekomendasi dari kedutaan besar negara tujuan ekspor' },
      { key: 'E', text: 'Pemberitahuan Ekspor Barang, Bill of Lading, Certificate of Analysis, dan Surat Keterangan Asal' },
    ],
    correct_answer: 'E',
    explanation: 'Dokumen wajib ekspor komoditas mineral Indonesia:\n\n| Dokumen | Fungsi |\n|---|---|\n| **PEB** (Pemberitahuan Ekspor Barang) | Dokumen kepabeanan, dasar bea ekspor |\n| **B/L** (*Bill of Lading*) | Bukti pengiriman dan kepemilikan barang |\n| **CoA** (*Certificate of Analysis*) | Hasil analisis kadar dan kualitas |\n| **SKA** (Surat Keterangan Asal) | Bukti asal barang untuk fasilitas tarif |\n| **Invoice** komersial | Nilai transaksi untuk kepabeanan |\n| **Packing list** | Detail kemasan dan tonase |\n| **Surveyor report** | Verifikasi kuantitas oleh surveyor independen |\n| **Izin ekspor ESDM** | Khusus mineral, sesuai regulasi hilirisasi |',
  },
  {
    order_index: 19,
    category: 'T5',
    difficulty: 'medium',
    content: 'Mengapa *Letter of Credit* (L/C) menjadi instrumen pembayaran yang umum dalam perdagangan komoditas internasional?',
    options: [
      { key: 'A', text: 'L/C menjamin pembayaran dari bank pembeli kepada penjual setelah dokumen pengiriman sesuai' },
      { key: 'B', text: 'L/C memungkinkan pembeli membayar dengan cicilan selama 10 tahun' },
      { key: 'C', text: 'L/C otomatis mengkonversi mata uang tanpa biaya tambahan' },
      { key: 'D', text: 'L/C menghilangkan seluruh risiko penurunan harga komoditas' },
      { key: 'E', text: 'L/C hanya digunakan untuk transaksi dengan nilai di bawah $1 juta' },
    ],
    correct_answer: 'A',
    explanation: '***Letter of Credit*** (L/C) adalah **jaminan pembayaran dari bank** pembeli kepada penjual, dengan syarat penjual menyerahkan **dokumen yang sesuai** dengan ketentuan L/C.\n\nMekanisme:\n1. Pembeli meminta bank penerbit (*issuing bank*) membuka L/C\n2. L/C dikirim ke bank penjual (*advising/confirming bank*)\n3. Penjual mengirim barang dan menyerahkan dokumen ke banknya\n4. Bank memeriksa kesesuaian dokumen\n5. Jika sesuai, bank **membayar** penjual\n6. Pembeli membayar bank penerbit\n\nKeuntungan:\n- **Penjual**: jaminan pembayaran dari bank (bukan hanya janji pembeli)\n- **Pembeli**: pembayaran hanya dilakukan jika dokumen sesuai (barang sudah dikirim)\n- **Mengurangi risiko** dalam perdagangan lintas negara dimana pihak mungkin belum saling kenal',
  },
  {
    order_index: 20,
    category: 'T5',
    difficulty: 'easy',
    content: 'Moda transportasi apa yang paling efisien untuk mengangkut komoditas tambang dalam jumlah besar antar negara?',
    options: [
      { key: 'A', text: 'Transportasi udara menggunakan pesawat kargo untuk kecepatan maksimal' },
      { key: 'B', text: 'Transportasi darat menggunakan truk kontainer antar negara' },
      { key: 'C', text: 'Transportasi laut menggunakan kapal kargo curah (*bulk carrier*)' },
      { key: 'D', text: 'Transportasi kereta api lintas negara menggunakan gerbong khusus mineral' },
      { key: 'E', text: 'Transportasi pipa bawah laut untuk mineral yang dicairkan' },
    ],
    correct_answer: 'C',
    explanation: '**Transportasi laut** menggunakan ***bulk carrier*** adalah moda paling efisien untuk komoditas tambang dalam jumlah besar.\n\nJenis kapal *bulk carrier*:\n\n| Jenis | Kapasitas | Rute |\n|---|---|---|\n| **Handysize** | 15.000-35.000 DWT | Pelabuhan kecil, rute pendek |\n| **Supramax** | 50.000-60.000 DWT | Rute menengah |\n| **Panamax** | 65.000-80.000 DWT | Antar benua |\n| **Capesize** | > 100.000 DWT | Rute utama (Australia-China) |\n\nKeunggulan transportasi laut:\n- **Biaya per ton-km** paling rendah dibanding moda lain\n- Mampu mengangkut **volume sangat besar** dalam satu pengiriman\n- **Jaringan global** pelabuhan terhubung\n- Cocok untuk komoditas **bernilai rendah per unit volume** (bijih, batubara)\n\nKeterbatasan: waktu tempuh lebih lama, bergantung cuaca, perlu infrastruktur pelabuhan.',
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
