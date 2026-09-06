/**
 * ANTAM IMPACT 2026 — Supply Chain Management (SCM) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Proses Pengadaan Barang & Jasa): 4 soal
 *   T2 (Manajemen Inventaris & Pergudangan): 4 soal
 *   T3 (Dasar Hukum & Kontrak Pengadaan): 4 soal
 *   T4 (Manajemen Logistik & Transportasi): 4 soal
 *   T5 (Logistik Kelautan & Transportasi Maritim): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-scm-batch2.ts
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
// A: 23,29,35,40 | B: 22,27,33,38 | C: 25,30,36,39 | D: 21,26,32,37 | E: 24,28,31,34

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Proses Pengadaan Barang & Jasa (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa keuntungan utama metode *e-procurement* dibandingkan pengadaan konvensional?',
    options: [
      { key: 'A', text: 'Menghilangkan kebutuhan akan kontrak tertulis antara pembeli dan penjual' },
      { key: 'B', text: 'Menjamin harga selalu lebih murah dari pengadaan manual' },
      { key: 'C', text: 'Memastikan barang yang dibeli selalu berkualitas tinggi tanpa perlu inspeksi' },
      { key: 'D', text: 'Meningkatkan transparansi, efisiensi proses, dan jejak audit yang lengkap' },
      { key: 'E', text: 'Menghapus kebutuhan akan persetujuan manajemen untuk pembelian apapun' },
    ],
    correct_answer: 'D',
    explanation: '***E-procurement*** memberikan keuntungan utama berupa **transparansi, efisiensi, dan audit trail**:\n\n| Keuntungan | Penjelasan |\n|---|---|\n| **Transparansi** | Proses terlihat oleh semua pihak berwenang, mengurangi risiko KKN |\n| **Efisiensi** | Waktu siklus pengadaan lebih singkat (otomasi approval, PO elektronik) |\n| **Audit trail** | Seluruh aktivitas terekam digital, mudah ditelusuri |\n| **Akses vendor** | Vendor pool lebih luas, kompetisi lebih sehat |\n| **Pengurangan biaya** | Mengurangi biaya administrasi, kertas, dan proses manual |\n| **Standarisasi** | Proses seragam sesuai kebijakan perusahaan |\n\nPlatform e-procurement di BUMN:\n- **LPSE** (*Layanan Pengadaan Secara Elektronik*) untuk pengadaan pemerintah\n- **SAP Ariba**, **Oracle Procurement Cloud** untuk korporat\n- **Internal e-proc system** yang dikustomisasi\n\nDi ANTAM, e-procurement wajib untuk pengadaan di atas nilai tertentu, sejalan dengan prinsip **GCG** (*Good Corporate Governance*).',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *TKDN* (Tingkat Komponen Dalam Negeri) dalam pengadaan BUMN?',
    options: [
      { key: 'A', text: 'Persentase keuntungan yang harus dibagikan kepada karyawan lokal' },
      { key: 'B', text: 'Persentase komponen produk/jasa dari dalam negeri yang wajib dipenuhi dalam pengadaan BUMN' },
      { key: 'C', text: 'Tingkat kepuasan pelanggan domestik terhadap produk perusahaan' },
      { key: 'D', text: 'Jumlah pajak yang harus dibayar vendor lokal kepada pemerintah' },
      { key: 'E', text: 'Standar kualitas minimum yang harus dipenuhi produk impor' },
    ],
    correct_answer: 'B',
    explanation: '**TKDN** (*Tingkat Komponen Dalam Negeri*) = **persentase komponen produk/jasa** yang berasal dari **dalam negeri**.\n\nDasar hukum:\n- **Permen Perindustrian** No. 16/2011 tentang Ketentuan dan Tata Cara Penghitungan TKDN\n- **Perpres** No. 12/2021 tentang Pengadaan Barang/Jasa Pemerintah\n\nPenghitungan TKDN:\n$$\\text{TKDN} = \\frac{\\text{Nilai komponen dalam negeri}}{\\text{Nilai total produk/jasa}} \\times 100\\%$$\n\nPenerapan di BUMN tambang:\n\n| Kategori | Target TKDN |\n|---|---|\n| Jasa konsultansi | > 50% |\n| Alat berat | > 25% (tergantung jenis) |\n| Material konstruksi | > 40% |\n| Jasa pemeliharaan | > 60% |\n\nManfaat:\n- Mendukung **industri dalam negeri**\n- Menciptakan **lapangan kerja** lokal\n- Mengurangi **ketergantungan impor**\n- **Preferensi harga** hingga 7,5% untuk produk ber-TKDN tinggi',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *sole source* atau penunjukan langsung dalam pengadaan?',
    options: [
      { key: 'A', text: 'Metode pengadaan yang menunjuk langsung satu vendor tanpa proses tender kompetitif' },
      { key: 'B', text: 'Metode pengadaan yang mengundang minimal tiga vendor untuk berkompetisi' },
      { key: 'C', text: 'Pembelian barang secara online dari marketplace umum' },
      { key: 'D', text: 'Pengadaan yang dilakukan oleh pihak ketiga atas nama perusahaan' },
      { key: 'E', text: 'Pembelian barang bekas dari vendor yang dilikuidasi' },
    ],
    correct_answer: 'A',
    explanation: '***Sole source*** / **penunjukan langsung** = metode pengadaan di mana **hanya satu vendor** yang ditunjuk **tanpa tender kompetitif**.\n\nKondisi yang membolehkan sole source:\n\n| Kondisi | Contoh |\n|---|---|\n| **Hak paten/eksklusif** | Spare part OEM yang hanya dijual oleh agen resmi |\n| **Keadaan darurat** | Kerusakan kritis yang menghentikan produksi |\n| **Nilai kecil** | Pembelian di bawah threshold tender |\n| **Keahlian khusus** | Konsultan teknis dengan keahlian unik |\n| **Standardisasi** | Kompatibilitas dengan peralatan existing |\n\nRisiko sole source:\n- **Harga tidak kompetitif** (tidak ada pembanding)\n- **Potensi KKN** (favoritism terhadap vendor tertentu)\n- **Audit finding** jika justifikasi tidak memadai\n\nMitigasi:\n- **Justifikasi tertulis** yang jelas dan terdokumentasi\n- **Persetujuan** dari pejabat berwenang (level lebih tinggi)\n- **Benchmarking harga** dengan referensi pasar\n- **Review berkala** apakah masih memenuhi syarat sole source',
  },
  {
    order_index: 24,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa strategi negosiasi *win-win* yang tepat dalam pengadaan jangka panjang dengan vendor kritis?',
    options: [
      { key: 'A', text: 'Selalu menekan harga serendah mungkin tanpa memperhatikan keberlangsungan vendor' },
      { key: 'B', text: 'Menerima semua syarat vendor tanpa negosiasi untuk menjaga hubungan baik' },
      { key: 'C', text: 'Mengganti vendor setiap tahun untuk mendapatkan harga terbaik' },
      { key: 'D', text: 'Merahasiakan semua informasi dari vendor termasuk volume kebutuhan' },
      { key: 'E', text: 'Membangun hubungan saling menguntungkan melalui kontrak jangka panjang dengan insentif kinerja dan berbagi risiko' },
    ],
    correct_answer: 'E',
    explanation: 'Strategi negosiasi ***win-win*** untuk vendor kritis:\n\n| Elemen | Implementasi |\n|---|---|\n| **Kontrak jangka panjang** | 3-5 tahun dengan opsi perpanjangan, memberikan kepastian volume |\n| **Insentif kinerja** | Bonus jika KPI tercapai (delivery, kualitas) |\n| **Berbagi risiko** | Mekanisme eskalasi harga berbasis indeks (LME, kurs) |\n| **Volume commitment** | Jaminan volume minimum sebagai timbal balik harga kompetitif |\n| **Pengembangan vendor** | Bantuan peningkatan kapabilitas vendor lokal |\n\nPrinsip negosiasi efektif:\n- **BATNA** (*Best Alternative to a Negotiated Agreement*): ketahui alternatif Anda\n- **Fokus kepentingan**, bukan posisi\n- **Persiapan data**: cost breakdown, benchmarking, market intelligence\n- **Jangka panjang**: hubungan vendor kritis bukan transaksional\n\nDi industri tambang, vendor kritis meliputi: pemasok BBM, spare part alat berat OEM, bahan kimia proses, jasa pemeliharaan khusus.',
  },

  // ═══════════════════════════════════════════
  // T2: Manajemen Inventaris & Pergudangan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *safety stock* dan mengapa penting di lokasi tambang terpencil?',
    options: [
      { key: 'A', text: 'Stok barang yang disimpan di brankas untuk mencegah pencurian' },
      { key: 'B', text: 'Peralatan keselamatan kerja (helm, sepatu, rompi) yang disimpan di gudang' },
      { key: 'C', text: 'Persediaan penyangga untuk mengantisipasi fluktuasi permintaan dan keterlambatan pengiriman' },
      { key: 'D', text: 'Stok bahan kimia berbahaya yang disimpan terpisah dari barang lain' },
      { key: 'E', text: 'Cadangan makanan darurat untuk karyawan tambang saat terjadi bencana' },
    ],
    correct_answer: 'C',
    explanation: '***Safety stock*** = **persediaan penyangga** untuk mengantisipasi **fluktuasi permintaan** dan **keterlambatan pengiriman**.\n\nRumus sederhana:\n$$\\text{Safety stock} = Z \\times \\sigma_d \\times \\sqrt{L}$$\n\nDi mana:\n- $Z$ = *service level factor* (misal 1,65 untuk 95%)\n- $\\sigma_d$ = standar deviasi permintaan harian\n- $L$ = *lead time* dalam hari\n\nMengapa kritis di tambang terpencil:\n\n| Faktor | Dampak |\n|---|---|\n| **Lead time panjang** | Pengiriman via laut 7-14 hari |\n| **Cuaca tidak menentu** | Gelombang tinggi menghambat kapal |\n| **Akses terbatas** | Tidak ada alternatif supplier lokal |\n| **Downtime mahal** | Operasi berhenti = kerugian miliaran/hari |\n| **Spare part kritis** | Beberapa part lead time 3-6 bulan (impor) |\n\nTrade-off:\n- Safety stock **tinggi** = risiko *stockout* rendah tapi modal tertanam besar\n- Safety stock **rendah** = modal efisien tapi risiko operasi terhenti',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa prinsip *FIFO* (*First In, First Out*) dan mengapa relevan untuk gudang tambang?',
    options: [
      { key: 'A', text: 'Karyawan yang masuk pertama ke gudang harus keluar pertama saat jam pulang' },
      { key: 'B', text: 'Vendor yang mendaftar pertama mendapat prioritas kontrak' },
      { key: 'C', text: 'Truk yang datang pertama harus dibongkar terakhir' },
      { key: 'D', text: 'Barang yang masuk gudang lebih dulu harus dikeluarkan lebih dulu untuk mencegah kedaluwarsa dan kerusakan' },
      { key: 'E', text: 'Proyek yang dimulai lebih dulu harus selesai lebih dulu' },
    ],
    correct_answer: 'D',
    explanation: '**FIFO** (*First In, First Out*) = **barang yang masuk lebih dulu** harus **dikeluarkan lebih dulu**.\n\nRelevansi di gudang tambang:\n\n| Barang | Alasan FIFO |\n|---|---|\n| **Bahan kimia** | Masa kadaluwarsa (reagent, larutan) |\n| **Bahan peledak** | Degradasi kualitas seiring waktu |\n| **BBM** | Kontaminasi dan degradasi kualitas |\n| **Oli & grease** | Perubahan viskositas jika terlalu lama |\n| **Cat & coating** | Mengental dan menggumpal |\n| **Makanan** | Kadaluwarsa (catering site) |\n\nImplementasi FIFO di gudang:\n- **Tata letak rak**: barang baru di belakang, lama di depan\n- **Labeling**: tanggal masuk terlihat jelas\n- **Sistem WMS**: *Warehouse Management System* otomatis tracking FIFO\n- **Rotasi stok**: audit berkala untuk memastikan kepatuhan\n\nAlternatif:\n- **LIFO** (*Last In, First Out*): untuk barang yang tidak kadaluwarsa\n- **FEFO** (*First Expired, First Out*): untuk barang dengan tanggal kadaluwarsa berbeda',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa fungsi utama *Warehouse Management System* (WMS)?',
    options: [
      { key: 'A', text: 'Menggantikan seluruh pekerja gudang dengan robot otomatis' },
      { key: 'B', text: 'Sistem informasi digital yang mengelola operasi gudang dari penerimaan hingga pengiriman' },
      { key: 'C', text: 'Sistem keamanan CCTV untuk mengawasi gudang dari pencurian' },
      { key: 'D', text: 'Perangkat lunak untuk mendesain tata letak gedung gudang baru' },
      { key: 'E', text: 'Aplikasi untuk memesan barang secara online dari vendor' },
    ],
    correct_answer: 'B',
    explanation: '***Warehouse Management System*** (WMS) = **sistem informasi** yang mengelola **seluruh operasi gudang** secara digital.\n\nFungsi utama WMS:\n\n| Fungsi | Detail |\n|---|---|\n| **Receiving** | Penerimaan barang, inspeksi, *putaway* |\n| **Storage** | Penetapan lokasi penyimpanan optimal |\n| **Inventory tracking** | Real-time stock level per lokasi |\n| **Picking** | Pengambilan barang sesuai permintaan |\n| **Shipping** | Persiapan dan pengiriman barang |\n| **Reporting** | Laporan stok, *aging*, turnover |\n\nTeknologi pendukung:\n- **Barcode/QR code**: identifikasi barang cepat\n- **RFID**: pelacakan otomatis tanpa scan manual\n- **Handheld scanner**: mobilitas operator gudang\n- **Integrasi ERP**: koneksi dengan SAP/Oracle untuk P2P seamless\n\nManfaat di tambang:\n- **Akurasi stok** > 99% (vs manual ~85-90%)\n- **Waktu pencarian** barang berkurang drastis\n- **Eliminasi dead stock** melalui alert otomatis\n- **Audit compliance** yang lebih mudah',
  },
  {
    order_index: 28,
    category: 'T2',
    difficulty: 'medium',
    content: 'Rata-rata persediaan gudang adalah $\\text{Rp}3$ miliar dengan biaya penyimpanan $18\\%$ per tahun. Berapa biaya penyimpanan (*carrying cost*) per bulan?',
    options: [
      { key: 'A', text: 'Rp$54$ juta' },
      { key: 'B', text: 'Rp$540$ juta' },
      { key: 'C', text: 'Rp$270$ juta' },
      { key: 'D', text: 'Rp$30$ juta' },
      { key: 'E', text: 'Rp$45$ juta' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan biaya penyimpanan per bulan:\n\n$$\\text{Carrying cost/tahun} = \\text{Rata-rata persediaan} \\times \\text{Persentase biaya penyimpanan}$$\n$$= \\text{Rp}3 \\text{ miliar} \\times 18\\% = \\text{Rp}540 \\text{ juta/tahun}$$\n\n$$\\text{Carrying cost/bulan} = \\frac{\\text{Rp}540 \\text{ juta}}{12} = \\text{Rp}45 \\text{ juta/bulan}$$\n\nKomponen biaya penyimpanan (18%):\n\n| Komponen | Estimasi |\n|---|---|\n| **Biaya modal** (cost of capital) | 8-10% |\n| **Asuransi** | 1-2% |\n| **Sewa gudang** | 2-3% |\n| **Handling & tenaga kerja** | 2-3% |\n| **Penyusutan & kerusakan** | 2-3% |\n| **Total** | **~18%** |\n\nCara mengurangi carrying cost:\n- Optimasi level stok dengan **EOQ** dan **safety stock** yang tepat\n- **Konsinyasi** untuk item mahal: vendor menanggung stok sampai terpakai\n- **VMI** (*Vendor Managed Inventory*): vendor mengelola stok di gudang pembeli',
  },

  // ═══════════════════════════════════════════
  // T3: Dasar Hukum & Kontrak Pengadaan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *performance bond* (jaminan pelaksanaan) dalam kontrak pengadaan?',
    options: [
      { key: 'A', text: 'Jaminan dari bank/asuransi yang menjamin vendor melaksanakan kontrak, dicairkan jika vendor wanprestasi' },
      { key: 'B', text: 'Bonus kinerja yang diberikan kepada vendor berprestasi di akhir proyek' },
      { key: 'C', text: 'Sertifikat yang membuktikan vendor telah mengikuti pelatihan kinerja' },
      { key: 'D', text: 'Obligasi yang diterbitkan perusahaan untuk membiayai proyek baru' },
      { key: 'E', text: 'Perjanjian kerja sama antara dua vendor untuk menyelesaikan proyek bersama' },
    ],
    correct_answer: 'A',
    explanation: '***Performance bond*** (jaminan pelaksanaan) = **jaminan dari bank/asuransi** yang menjamin vendor akan **melaksanakan kontrak** sesuai kesepakatan.\n\nJenis jaminan dalam pengadaan:\n\n| Jenis | Tahap | Nilai tipikal |\n|---|---|---|\n| **Bid bond** | Penawaran | 1-3% nilai penawaran |\n| **Performance bond** | Pelaksanaan | 5-10% nilai kontrak |\n| **Advance payment bond** | Uang muka | 100% dari uang muka |\n| **Retention bond** | Masa pemeliharaan | 5% nilai kontrak |\n\nMekanisme:\n1. Vendor menyerahkan performance bond dari **bank/asuransi** sebelum kontrak dimulai\n2. Jika vendor **wanprestasi**: pembeli dapat **mencairkan** jaminan\n3. Jika kontrak **selesai dengan baik**: jaminan **dikembalikan** ke vendor\n\nDi BUMN:\n- Performance bond **wajib** untuk kontrak di atas nilai tertentu\n- Penerbit harus **bank/asuransi** yang diakui\n- Berlaku selama masa kontrak + masa pemeliharaan',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa perbedaan antara kontrak *lump sum* dan kontrak *unit price* dalam pengadaan jasa konstruksi tambang?',
    options: [
      { key: 'A', text: 'Lump sum dibayar tunai, unit price dibayar kredit' },
      { key: 'B', text: 'Lump sum untuk proyek kecil, unit price untuk proyek besar' },
      { key: 'C', text: 'Lump sum menetapkan harga tetap, unit price membayar berdasarkan volume aktual per satuan' },
      { key: 'D', text: 'Lump sum menggunakan mata uang rupiah, unit price menggunakan dolar' },
      { key: 'E', text: 'Lump sum untuk vendor lokal, unit price untuk vendor asing' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan kontrak **lump sum** dan **unit price**:\n\n| Aspek | Lump Sum | Unit Price |\n|---|---|---|\n| **Harga** | **Tetap** untuk keseluruhan | Per **satuan volume** aktual |\n| **Risiko volume** | **Kontraktor** menanggung | **Pembeli** menanggung |\n| **Cocok untuk** | Lingkup jelas & terukur | Lingkup variabel |\n| **Pembayaran** | Berdasarkan milestone | Berdasarkan pengukuran aktual |\n\nContoh di tambang:\n\n**Lump sum**:\n- Pembangunan gedung kantor site: Rp$5$ miliar (fixed)\n- Studi kelayakan smelter: Rp$2$ miliar (fixed)\n\n**Unit price**:\n- Pengangkutan overburden: Rp$50.000$/m$^3$ (volume aktual)\n- Pengeboran: Rp$1{,}5$ juta/meter (kedalaman aktual)\n\nVariasi lain:\n- **Cost-plus**: biaya aktual + fee/margin\n- **Time & material**: jam kerja + material aktual\n- **GMP** (*Guaranteed Maximum Price*): unit price dengan batas atas',
  },
  {
    order_index: 31,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan klausul *liquidated damages* (LD) dalam kontrak pengadaan?',
    options: [
      { key: 'A', text: 'Pembayaran ganti rugi karena kerusakan barang cair selama pengiriman' },
      { key: 'B', text: 'Proses pencairan aset perusahaan vendor yang bangkrut' },
      { key: 'C', text: 'Biaya likuidasi persediaan yang tidak terjual di akhir tahun' },
      { key: 'D', text: 'Prosedur pembubaran kontrak sebelum jangka waktu berakhir' },
      { key: 'E', text: 'Ganti rugi yang disepakati di awal kontrak untuk keterlambatan tanpa perlu membuktikan kerugian aktual' },
    ],
    correct_answer: 'E',
    explanation: '***Liquidated damages*** (LD) = **ganti rugi yang telah disepakati di awal kontrak** untuk keterlambatan/pelanggaran, **tanpa perlu membuktikan** kerugian aktual.\n\nStruktur LD tipikal:\n\n| Parameter | Contoh |\n|---|---|\n| **Rate** | 0,1% - 0,5% dari nilai kontrak per hari/minggu |\n| **Cap** | Maksimal 5-10% dari nilai kontrak |\n| **Trigger** | Keterlambatan melewati tanggal kontraktual |\n| **Pengecualian** | Force majeure, perubahan lingkup oleh pembeli |\n\nContoh:\n- Kontrak konstruksi jetty: Rp$100$ miliar\n- LD rate: 0,1%/hari = Rp$100$ juta/hari keterlambatan\n- LD cap: 5% = maks Rp$5$ miliar\n- Jika terlambat 30 hari: $30 \\times$ Rp$100$ juta = Rp$3$ miliar\n\nManfaat LD:\n- **Prediktabilitas**: kedua pihak tahu risiko finansial\n- **Pencegahan**: insentif kontraktor untuk tepat waktu\n- **Sederhana**: tidak perlu pembuktian kerugian yang rumit',
  },
  {
    order_index: 32,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan klausul *indemnity* (ganti rugi) dalam kontrak pengadaan?',
    options: [
      { key: 'A', text: 'Kewajiban vendor untuk memberikan diskon tambahan setiap tahun' },
      { key: 'B', text: 'Hak pembeli untuk mengembalikan barang tanpa alasan dalam 30 hari' },
      { key: 'C', text: 'Perjanjian kedua pihak untuk tidak saling menuntut dalam kondisi apapun' },
      { key: 'D', text: 'Kewajiban satu pihak menanggung kerugian atau klaim yang timbul akibat kelalaiannya' },
      { key: 'E', text: 'Pernyataan bahwa kontrak tidak dapat diubah setelah ditandatangani' },
    ],
    correct_answer: 'D',
    explanation: '***Indemnity*** = **kewajiban satu pihak menanggung kerugian** yang timbul akibat pelanggaran atau kelalaian pihak tersebut.\n\nContoh klausul indemnity di kontrak tambang:\n\n| Skenario | Siapa menanggung |\n|---|---|\n| Kecelakaan pekerja kontraktor di site | **Kontraktor** (indemnify pembeli) |\n| Kerusakan lingkungan akibat tumpahan kimia vendor | **Vendor** |\n| Pelanggaran HKI (paten, lisensi) oleh produk vendor | **Vendor** |\n| Klaim pihak ketiga akibat produk cacat | **Vendor** |\n\nElemen indemnity clause:\n- **Scope**: peristiwa apa yang di-cover\n- **Cap**: batas maksimal ganti rugi (sering tanpa cap untuk cedera/kematian)\n- **Procedure**: cara klaim dan notifikasi\n- **Insurance**: kewajiban asuransi pendukung\n\nBerbeda dengan *warranty* (jaminan kualitas produk), indemnity lebih luas mencakup **kerugian pihak ketiga** yang timbul.',
  },

  // ═══════════════════════════════════════════
  // T4: Manajemen Logistik & Transportasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *fleet management* dalam konteks logistik pertambangan?',
    options: [
      { key: 'A', text: 'Pengelolaan armada kapal perang yang mengawal pengiriman komoditas' },
      { key: 'B', text: 'Pengelolaan dan optimasi armada kendaraan operasional secara terintegrasi' },
      { key: 'C', text: 'Sistem parkir kendaraan karyawan di area perkantoran tambang' },
      { key: 'D', text: 'Program pelatihan mengemudi defensif bagi seluruh pengemudi truk' },
      { key: 'E', text: 'Catatan perpanjangan STNK seluruh kendaraan milik perusahaan' },
    ],
    correct_answer: 'B',
    explanation: '***Fleet management*** = **pengelolaan dan optimasi armada kendaraan operasional** secara terintegrasi.\n\nKomponen fleet management di tambang:\n\n| Komponen | Aktivitas |\n|---|---|\n| **Maintenance** | Preventive/predictive maintenance, breakdown management |\n| **Scheduling** | Penjadwalan pemakaian, rotasi kendaraan |\n| **Monitoring** | GPS tracking, fuel monitoring, telemetry |\n| **Performance** | KPI: availability, utilization, productivity |\n| **Cost** | Total cost of ownership, biaya per ton-km |\n| **Safety** | Fatigue management, speed monitoring |\n\nMetrik kunci:\n\n| KPI | Target |\n|---|---|\n| **Physical Availability** (PA) | > 85% |\n| **Utilization** (UA) | > 70% |\n| **MTBF** | > 100 jam |\n| **MTTR** | < 4 jam |\n| **Fuel consumption** | Sesuai benchmark |\n\nTeknologi:\n- **Dispatch system** (Modular, Wenco, Jigsaw)\n- **Telematik**: sensor RPM, suhu, tekanan\n- **AI/ML**: prediksi kerusakan, optimasi rute hauling',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *backhaul* optimization dalam logistik?',
    options: [
      { key: 'A', text: 'Teknik mengemudi mundur yang aman di area pertambangan' },
      { key: 'B', text: 'Proses pengembalian barang rusak ke vendor asal' },
      { key: 'C', text: 'Metode penyimpanan barang di bagian belakang gudang' },
      { key: 'D', text: 'Pengecekan kondisi ban belakang truk sebelum perjalanan' },
      { key: 'E', text: 'Pemanfaatan perjalanan pulang kendaraan yang kosong untuk mengangkut muatan lain' },
    ],
    correct_answer: 'E',
    explanation: '***Backhaul optimization*** = **pemanfaatan perjalanan pulang** kendaraan/kapal yang biasanya **kosong** untuk mengangkut muatan lain.\n\nContoh di tambang nikel:\n\n| Outbound (pergi) | Backhaul (pulang) |\n|---|---|\n| Tongkang bijih nikel → pelabuhan | Tongkang BBM ← depot |\n| Truk feronikel → pelabuhan | Truk spare part/material ← supplier |\n| Kapal nikel → China | Kapal peralatan/bahan kimia ← China |\n\nManfaat:\n- **Penghematan biaya** transportasi 20-40%\n- **Pengurangan emisi** karbon per ton-km\n- **Efisiensi** armada (utilisasi lebih tinggi)\n\nTantangan:\n- **Koordinasi** jadwal antara muatan outbound dan backhaul\n- **Kompatibilitas** kendaraan/kapal dengan jenis muatan berbeda\n- **Kebersihan**: kargo food-grade tidak bisa backhaul di kapal bijih\n- **Regulasi**: beberapa kargo berbahaya tidak bisa dicampur',
  },
  {
    order_index: 35,
    category: 'T4',
    difficulty: 'easy',
    content: 'Dokumen apa yang diperlukan untuk mengekspor feronikel dari Indonesia?',
    options: [
      { key: 'A', text: 'Hanya invoice komersial dari pembeli sudah cukup' },
      { key: 'B', text: 'Surat keterangan domisili perusahaan dan KTP direktur' },
      { key: 'C', text: 'Invoice, packing list, bill of lading, certificate of origin, dan izin ekspor' },
      { key: 'D', text: 'Hanya passport direktur dan kartu kredit perusahaan' },
      { key: 'E', text: 'Fotokopi NPWP dan laporan keuangan tiga tahun terakhir' },
    ],
    correct_answer: 'C',
    explanation: 'Dokumen ekspor feronikel dari Indonesia:\n\n| Dokumen | Fungsi |\n|---|---|\n| **Commercial Invoice** | Rincian transaksi (kuantitas, harga, terms) |\n| **Packing List** | Detail kemasan dan berat kargo |\n| **Bill of Lading** (B/L) | Bukti pengiriman dan tanda terima kargo |\n| **Certificate of Origin** (COO) | Bukti asal barang dari Indonesia |\n| **Surveyor Report** | Kadar dan kuantitas yang diverifikasi independen |\n| **Izin Ekspor** | Dari Kemendag/ESDM untuk produk mineral |\n| **PEB** | Pemberitahuan Ekspor Barang (bea cukai) |\n| **NPWP** | Nomor Pokok Wajib Pajak eksportir |\n\nKhusus produk mineral olahan:\n- **Laporan Surveyor** (LS) wajib dari surveyor terakreditasi\n- Harus memenuhi **standar minimum pengolahan** (kadar Ni minimum untuk feronikel)\n- **Bea keluar** jika kadar di bawah standar tertentu\n- Ijin dari **Ditjen Minerba ESDM**',
  },
  {
    order_index: 36,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Total Cost of Ownership* (TCO) dalam keputusan pengadaan kendaraan operasional?',
    options: [
      { key: 'A', text: 'Harga beli kendaraan dari dealer resmi' },
      { key: 'B', text: 'Total biaya asuransi kendaraan selama masa pakai' },
      { key: 'C', text: 'Seluruh biaya selama siklus hidup aset, termasuk pembelian, operasional, dan pemeliharaan' },
      { key: 'D', text: 'Biaya pajak tahunan kendaraan yang dibayar ke pemerintah daerah' },
      { key: 'E', text: 'Harga jual kembali kendaraan setelah masa pakai berakhir' },
    ],
    correct_answer: 'C',
    explanation: '***Total Cost of Ownership*** (TCO) = **seluruh biaya selama siklus hidup aset**.\n\nKomponen TCO kendaraan operasional tambang:\n\n| Komponen | Estimasi % |\n|---|---|\n| **Harga beli** (CAPEX) | 25-30% |\n| **Bahan bakar** | 25-35% |\n| **Pemeliharaan & perbaikan** | 15-25% |\n| **Ban** (untuk haul truck) | 5-10% |\n| **Operator** | 10-15% |\n| **Asuransi** | 2-3% |\n| **Nilai sisa** (*residual value*) | $(-5\\%$ sampai $-10\\%)$ |\n\nContoh TCO excavator 200 ton:\n- Harga beli: $\\$3$ juta\n- Biaya operasi 10 tahun: $\\$7$ juta (BBM, perawatan, operator)\n- **TCO** = $\\$10$ juta\n- Harga beli hanya **30%** dari TCO\n\nMengapa TCO penting:\n- Kendaraan termurah saat beli **belum tentu** TCO terendah\n- Merek dengan **spare part murah** dan **fuel efficiency** tinggi bisa lebih hemat\n- Keputusan **beli vs sewa** harus berbasis TCO',
  },

  // ═══════════════════════════════════════════
  // T5: Logistik Kelautan & Transportasi Maritim (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 37,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *time charter* dan *voyage charter* dalam penyewaan kapal?',
    options: [
      { key: 'A', text: 'Time charter untuk kapal baru, voyage charter untuk kapal bekas' },
      { key: 'B', text: 'Time charter untuk kargo cair, voyage charter untuk kargo padat' },
      { key: 'C', text: 'Time charter menggunakan kapal sendiri, voyage charter menggunakan kapal sewa' },
      { key: 'D', text: 'Time charter menyewa kapal untuk periode waktu tertentu, voyage charter menyewa untuk satu perjalanan tertentu' },
      { key: 'E', text: 'Time charter hanya untuk pelayaran domestik, voyage charter untuk internasional' },
    ],
    correct_answer: 'D',
    explanation: 'Perbedaan **time charter** dan **voyage charter**:\n\n| Aspek | Time Charter | Voyage Charter |\n|---|---|---|\n| **Durasi** | **Periode waktu** (bulan/tahun) | **Satu perjalanan** tertentu |\n| **Biaya BBM** | **Penyewa** menanggung | **Pemilik kapal** menanggung |\n| **Biaya pelabuhan** | **Penyewa** menanggung | **Pemilik kapal** menanggung |\n| **Tarif** | Harian ($/hari) | Per ton kargo ($/ton) |\n| **Fleksibilitas** | Penyewa tentukan rute | Rute tetap |\n| **Risiko delay** | **Penyewa** menanggung | **Pemilik kapal** menanggung |\n\nPilihan untuk perusahaan tambang:\n- **Time charter**: cocok untuk volume **rutin dan besar** (kontrak tahunan)\n  - Contoh: tongkang dedicated untuk angkut bijih nikel\n- **Voyage charter**: cocok untuk pengiriman **spot** atau **tidak rutin**\n  - Contoh: pengiriman feronikel ekspor per batch\n\nJenis lain:\n- **Bareboat charter**: sewa kapal tanpa awak (penyewa menyediakan kru sendiri)\n- **COA** (*Contract of Affreightment*): kontrak volume tanpa kapal spesifik',
  },
  {
    order_index: 38,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *draft survey* dalam operasi bongkar muat kapal curah?',
    options: [
      { key: 'A', text: 'Pemeriksaan kelayakan desain kapal sebelum dibangun di galangan' },
      { key: 'B', text: 'Metode penentuan berat kargo berdasarkan perbedaan sarat air kapal sebelum dan sesudah pemuatan' },
      { key: 'C', text: 'Survei kepuasan pelanggan terhadap layanan pengiriman laut' },
      { key: 'D', text: 'Pemeriksaan dokumen perjalanan kapal oleh otoritas pelabuhan' },
      { key: 'E', text: 'Rancangan awal rute pelayaran sebelum kapal berangkat' },
    ],
    correct_answer: 'B',
    explanation: '***Draft survey*** = **penentuan berat kargo** berdasarkan **perbedaan sarat air** (draft) kapal sebelum dan sesudah pemuatan.\n\nPrinsip:\n- Berdasarkan **hukum Archimedes**: berat kargo = perubahan displacement kapal\n- $\\text{Berat kargo} = \\text{Displacement setelah muat} - \\text{Displacement sebelum muat} - \\text{Koreksi}$\n\nProsedur:\n1. **Pembacaan draft** di 6 titik (fore, mid, aft, port & starboard)\n2. **Hitung displacement** menggunakan *hydrostatic table* kapal\n3. **Koreksi**: ballast water, bahan bakar, air tawar, trim\n4. **Hasil**: berat kargo dalam metric ton\n\nPentingnya di tambang:\n- **Basis pembayaran**: harga per ton dikalikan berat draft survey\n- **Penyelesaian klaim**: selisih antara timbangan darat dan draft survey\n- **Dilakukan oleh**: surveyor independen (SGS, Bureau Veritas, Sucofindo)\n\nAkurasi draft survey: $\\pm 0{,}5\\%$ - diterima secara internasional untuk kargo curah.',
  },
  {
    order_index: 39,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa risiko utama dalam pengangkutan bijih nikel laterit via laut?',
    options: [
      { key: 'A', text: 'Bijih nikel bisa meledak jika terkena sinar matahari langsung' },
      { key: 'B', text: 'Bijih nikel mengeluarkan gas beracun yang membahayakan awak kapal' },
      { key: 'C', text: 'Likuefaksi kargo akibat kadar air tinggi yang dapat menyebabkan kapal miring dan tenggelam' },
      { key: 'D', text: 'Bijih nikel menyerap air laut sehingga berat kapal bertambah tidak terkendali' },
      { key: 'E', text: 'Bijih nikel bereaksi dengan badan kapal baja sehingga menyebabkan korosi parah' },
    ],
    correct_answer: 'C',
    explanation: 'Risiko utama: **likuefaksi** (*cargo liquefaction*) akibat **kadar air tinggi**.\n\nMekanisme likuefaksi:\n1. Bijih nikel laterit memiliki **kadar air tinggi** (25-35%)\n2. Saat pelayaran, **getaran dan guncangan** kapal memampatkan partikel\n3. Air terperangkap meningkatkan **tekanan pori**\n4. Kargo berubah menjadi **massa seperti lumpur** (*slurry*)\n5. Lumpur **bergeser ke satu sisi** → kapal **miring** (*listing*)\n6. Kemiringan kritis → kapal **tenggelam**\n\nInsiden nyata:\n- Beberapa kapal curah telah tenggelam di perairan Asia Tenggara\n- Desember 2010: MV *Nasco Diamond* tenggelam saat mengangkut bijih nikel dari Indonesia\n\nPencegahan:\n- Kadar air kargo **wajib < TML** saat dimuat\n- **Sertifikat moisture content** dari surveyor\n- **Ventilasi palka** yang memadai\n- **Pemeriksaan visual** selama pelayaran\n- **Penolakan muat** jika curah hujan tinggi dan kadar air tidak terkendali',
  },
  {
    order_index: 40,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa fungsi *Bill of Lading* (B/L) dalam pengiriman kargo laut?',
    options: [
      { key: 'A', text: 'Dokumen multifungsi yang berfungsi sebagai bukti kontrak pengangkutan, tanda terima kargo, dan dokumen kepemilikan barang' },
      { key: 'B', text: 'Faktur pembayaran atas jasa pengiriman yang harus dilunasi sebelum kapal berangkat' },
      { key: 'C', text: 'Sertifikat kelayakan kapal yang diterbitkan oleh badan klasifikasi' },
      { key: 'D', text: 'Izin berlayar yang diterbitkan oleh otoritas pelabuhan setempat' },
      { key: 'E', text: 'Polis asuransi kargo yang melindungi barang selama pelayaran' },
    ],
    correct_answer: 'A',
    explanation: '***Bill of Lading*** (B/L) memiliki **tiga fungsi utama**:\n\n| Fungsi | Penjelasan |\n|---|---|\n| **Bukti kontrak** | Kontrak pengangkutan antara shipper dan carrier |\n| **Tanda terima** | Bukti carrier telah menerima kargo dalam kondisi tertentu |\n| **Dokumen kepemilikan** | Dapat dipindahtangankan (*negotiable*) - siapa yang memegang B/L berhak atas kargo |\n\nJenis B/L:\n\n| Jenis | Keterangan |\n|---|---|\n| **Clean B/L** | Kargo diterima tanpa catatan kerusakan |\n| **Claused B/L** | Ada catatan kerusakan/ketidaksesuaian |\n| **Shipped B/L** | Kargo sudah dimuat di kapal |\n| **Received B/L** | Kargo baru diterima di pelabuhan |\n| **Through B/L** | Untuk pengiriman multi-moda |\n\nInformasi dalam B/L:\n- Nama shipper, consignee, notify party\n- Nama kapal, pelabuhan muat dan bongkar\n- Deskripsi kargo, berat, jumlah\n- Tanggal pemuatan\n- Freight terms (prepaid/collect)',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-scm')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-scm tidak ditemukan:', pkgErr)
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
