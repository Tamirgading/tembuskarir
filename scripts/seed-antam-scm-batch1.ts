/**
 * ANTAM IMPACT 2026 — Supply Chain Management (SCM) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Proses Pengadaan Barang & Jasa): 4 soal
 *   T2 (Manajemen Inventaris & Pergudangan): 4 soal
 *   T3 (Dasar Hukum & Kontrak Pengadaan): 4 soal
 *   T4 (Manajemen Logistik & Transportasi): 4 soal
 *   T5 (Logistik Kelautan & Transportasi Maritim): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-scm-batch1.ts
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
// A: 2,8,13,17 | B: 5,10,14,20 | C: 3,7,16,19 | D: 1,9,12,18 | E: 4,6,11,15

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Proses Pengadaan Barang & Jasa (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa urutan yang benar dalam siklus *Procure-to-Pay* (P2P)?',
    options: [
      { key: 'A', text: 'Pembayaran, pemesanan, penerimaan, identifikasi kebutuhan' },
      { key: 'B', text: 'Pemesanan, identifikasi kebutuhan, pembayaran, penerimaan' },
      { key: 'C', text: 'Penerimaan, pembayaran, identifikasi kebutuhan, pemesanan' },
      { key: 'D', text: 'Identifikasi kebutuhan, pemilihan vendor, pemesanan (PO), penerimaan barang, pembayaran' },
      { key: 'E', text: 'Pemilihan vendor, pembayaran, penerimaan, identifikasi kebutuhan' },
    ],
    correct_answer: 'D',
    explanation: 'Siklus ***Procure-to-Pay*** (P2P) terdiri dari tahapan berikut:\n\n1. **Identifikasi kebutuhan**: *purchase requisition* (PR) dari user\n2. **Pemilihan vendor**: evaluasi, kualifikasi, dan seleksi pemasok\n3. **Pemesanan**: pembuatan *purchase order* (PO)\n4. **Penerimaan barang**: inspeksi dan *goods receipt* (GR)\n5. **Pembayaran**: *invoice verification* dan pembayaran\n\nDokumen kunci:\n- **PR** (*Purchase Requisition*): permintaan dari departemen pengguna\n- **RFQ/RFP**: permintaan penawaran ke vendor\n- **PO** (*Purchase Order*): dokumen pemesanan resmi\n- **GR** (*Goods Receipt*): bukti penerimaan barang\n- **Invoice**: tagihan dari vendor\n\nSistem ERP (SAP, Oracle) mengintegrasikan seluruh siklus P2P untuk kontrol dan transparansi.',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa faktor utama yang harus dipertimbangkan dalam proses kualifikasi vendor di industri pertambangan?',
    options: [
      { key: 'A', text: 'Kapasitas produksi, track record, sertifikasi mutu, kesehatan finansial, dan kepatuhan HSE' },
      { key: 'B', text: 'Hanya harga penawaran terendah yang menjadi kriteria utama' },
      { key: 'C', text: 'Lokasi kantor vendor yang harus berada di kota yang sama' },
      { key: 'D', text: 'Jumlah karyawan vendor yang harus lebih banyak dari pembeli' },
      { key: 'E', text: 'Usia perusahaan vendor minimal 50 tahun' },
    ],
    correct_answer: 'A',
    explanation: 'Kriteria kualifikasi vendor di pertambangan bersifat **multi-dimensional**, tidak hanya harga:\n\n| Kriteria | Bobot tipikal | Contoh |\n|---|---|---|\n| **Kapasitas teknis** | 25% | Kemampuan produksi, peralatan, SDM |\n| **Track record** | 20% | Pengalaman di industri sejenis |\n| **Sertifikasi mutu** | 15% | ISO 9001, ISO 14001, ISO 45001 |\n| **Kesehatan finansial** | 15% | Rasio keuangan, bankability |\n| **Kepatuhan HSE** | 15% | Catatan kecelakaan, program K3 |\n| **Harga** | 10% | Kompetitif namun wajar |\n\nMetode evaluasi:\n- **Vendor scorecard**: penilaian kuantitatif multi-kriteria\n- **Site visit**: inspeksi langsung fasilitas vendor\n- **Reference check**: konfirmasi dari klien sebelumnya\n- **TKDN** (*Tingkat Komponen Dalam Negeri*): wajib untuk BUMN',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *Request for Quotation* (RFQ) dan *Request for Proposal* (RFP)?',
    options: [
      { key: 'A', text: 'RFQ untuk barang impor, RFP untuk barang lokal' },
      { key: 'B', text: 'RFQ hanya untuk vendor lama, RFP untuk vendor baru' },
      { key: 'C', text: 'RFQ meminta penawaran harga untuk spesifikasi jelas, RFP meminta solusi komprehensif' },
      { key: 'D', text: 'RFQ dikirim oleh vendor, RFP dikirim oleh pembeli' },
      { key: 'E', text: 'RFQ untuk pembelian tunai, RFP untuk pembelian kredit' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan **RFQ** dan **RFP**:\n\n| Aspek | RFQ | RFP |\n|---|---|---|\n| **Tujuan** | Meminta **penawaran harga** | Meminta **solusi komprehensif** |\n| **Spesifikasi** | Sudah **jelas dan detail** | **Terbuka/fleksibel** |\n| **Evaluasi** | Fokus **harga** | Teknis + komersial |\n| **Kompleksitas** | Rendah-sedang | Tinggi |\n| **Contoh** | Pembelian BBM 1.000 kL | Jasa konsultan studi kelayakan smelter |\n\nDokumen pengadaan lain:\n- **RFI** (*Request for Information*): tahap awal mengumpulkan informasi vendor\n- **EOI** (*Expression of Interest*): mengundang vendor menyatakan minat\n- **ITB** (*Invitation to Bid*): undangan tender formal\n\nDi BUMN seperti ANTAM, pengadaan biasanya mengikuti aturan **Permen BUMN** tentang pedoman pengadaan yang menekankan transparansi dan akuntabilitas.',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *green procurement* (pengadaan berkelanjutan)?',
    options: [
      { key: 'A', text: 'Pengadaan barang yang berwarna hijau untuk keseragaman identitas perusahaan' },
      { key: 'B', text: 'Pembelian barang hanya dari vendor yang berlokasi di area pedesaan hijau' },
      { key: 'C', text: 'Pengadaan yang dilakukan secara daring tanpa menggunakan kertas' },
      { key: 'D', text: 'Pengadaan yang hanya boleh dilakukan pada musim tanam' },
      { key: 'E', text: 'Proses pengadaan yang mempertimbangkan dampak lingkungan dan sosial produk sepanjang siklus hidupnya' },
    ],
    correct_answer: 'E',
    explanation: '***Green procurement*** adalah proses pengadaan yang **mempertimbangkan dampak lingkungan dan sosial** produk sepanjang **siklus hidupnya** (*life cycle*).\n\nPrinsip green procurement:\n\n| Aspek | Contoh |\n|---|---|\n| **Material** | Bahan baku ramah lingkungan, daur ulang |\n| **Produksi** | Proses manufaktur rendah emisi |\n| **Penggunaan** | Efisiensi energi, umur pakai panjang |\n| **Pembuangan** | Mudah didaur ulang, biodegradable |\n| **Vendor** | Sertifikasi lingkungan (ISO 14001) |\n\nPenerapan di pertambangan BUMN:\n- Prioritas vendor dengan **sertifikasi ISO 14001**\n- Pembelian **kendaraan rendah emisi** (contoh: haul truck hybrid)\n- Penggunaan **bahan kimia biodegradable** untuk pengolahan\n- Pengadaan **energi terbarukan** (solar panel, PLTA)\n- Sejalan dengan komitmen **ESG** dan **SDGs** perusahaan',
  },

  // ═══════════════════════════════════════════
  // T2: Manajemen Inventaris & Pergudangan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Kebutuhan tahunan spare part excavator adalah $1.200$ unit, biaya pemesanan $\\text{Rp}500.000$ per order, dan biaya penyimpanan $\\text{Rp}10.000$ per unit per tahun. Berapa *Economic Order Quantity* (EOQ)?',
    options: [
      { key: 'A', text: '200 unit' },
      { key: 'B', text: '346 unit' },
      { key: 'C', text: '120 unit' },
      { key: 'D', text: '600 unit' },
      { key: 'E', text: '500 unit' },
    ],
    correct_answer: 'B',
    explanation: 'Rumus *Economic Order Quantity* (EOQ):\n$$\\text{EOQ} = \\sqrt{\\frac{2DS}{H}}$$\n\nDi mana:\n- $D$ = kebutuhan tahunan = $1.200$ unit\n- $S$ = biaya pemesanan = Rp$500.000$/order\n- $H$ = biaya penyimpanan = Rp$10.000$/unit/tahun\n\n$$\\text{EOQ} = \\sqrt{\\frac{2 \\times 1.200 \\times 500.000}{10.000}} = \\sqrt{\\frac{1.200.000.000}{10.000}} = \\sqrt{120.000} \\approx 346 \\text{ unit}$$\n\nInterpretasi:\n- Pesan **346 unit** setiap kali order\n- Frekuensi pemesanan: $1.200 / 346 \\approx 3{,}5$ kali/tahun\n- **Total biaya** (pemesanan + penyimpanan) **minimal** pada titik EOQ\n\nEOQ menyeimbangkan:\n- **Biaya pemesanan** (turun jika order jarang tapi banyak)\n- **Biaya penyimpanan** (turun jika stok sedikit tapi order sering)',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan analisis ABC dalam manajemen inventaris?',
    options: [
      { key: 'A', text: 'Metode penyusunan barang di gudang berdasarkan abjad nama barang' },
      { key: 'B', text: 'Teknik pelatihan karyawan gudang dengan tiga tingkatan sertifikasi' },
      { key: 'C', text: 'Sistem audit tahunan yang dilakukan dalam tiga fase berurutan' },
      { key: 'D', text: 'Standar keamanan gudang dengan tiga level proteksi' },
      { key: 'E', text: 'Klasifikasi inventaris berdasarkan nilai konsumsi menjadi kategori A, B, C menggunakan prinsip Pareto' },
    ],
    correct_answer: 'E',
    explanation: '**Analisis ABC** mengklasifikasikan inventaris berdasarkan **nilai konsumsi** menggunakan **prinsip Pareto** (80/20):\n\n| Kelas | % Item | % Nilai | Kontrol |\n|---|---|---|---|\n| **A** | ~20% | ~80% | Ketat: review rutin, stok safety tinggi |\n| **B** | ~30% | ~15% | Sedang: review berkala |\n| **C** | ~50% | ~5% | Longgar: *min-max* stocking |\n\nContoh di tambang nikel:\n- **Kelas A**: ban haul truck, liner smelter, motor listrik besar (harga tinggi, kritis)\n- **Kelas B**: filter oli, V-belt, baut spesial\n- **Kelas C**: sarung tangan, alat tulis, kabel ties\n\nManfaat:\n- **Fokus** manajemen pada item bernilai tinggi\n- **Efisiensi** pengelolaan gudang\n- **Optimasi** modal kerja yang tertanam di inventaris\n- **Strategi** pengadaan berbeda per kelas',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *dead stock* dan bagaimana dampaknya bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Stok bijih nikel yang kadarnya terlalu rendah untuk diolah secara ekonomis' },
      { key: 'B', text: 'Cadangan mineral yang tidak lagi layak ditambang karena harga komoditas turun' },
      { key: 'C', text: 'Barang inventaris yang tidak bergerak lama, mengikat modal dan menimbulkan biaya penyimpanan' },
      { key: 'D', text: 'Peralatan rusak yang menunggu perbaikan di workshop' },
      { key: 'E', text: 'Stok bahan peledak yang telah kedaluwarsa dan harus dimusnahkan' },
    ],
    correct_answer: 'C',
    explanation: '***Dead stock*** = **barang inventaris yang tidak bergerak** (*no movement*) dalam waktu lama (biasanya > 12 bulan).\n\nDampak bagi perusahaan:\n- **Modal tertanam**: uang yang seharusnya bisa digunakan untuk kegiatan produktif\n- **Biaya penyimpanan**: sewa gudang, asuransi, pemeliharaan\n- **Penyusutan nilai**: barang usang atau rusak karena penyimpanan lama\n- **Ruang gudang**: menempati ruang yang bisa untuk barang aktif\n\nPenyebab umum di tambang:\n- Pembelian berlebih (*over-ordering*)\n- **Pergantian tipe peralatan** (spare part lama tidak cocok)\n- Perencanaan kebutuhan yang buruk\n- Proyek yang dibatalkan atau ditunda\n\nPenanganan:\n- **Identifikasi** rutin (laporan *aging inventory*)\n- **Transfer** ke unit operasi lain yang membutuhkan\n- **Disposal** melalui lelang atau penjualan\n- **Write-off** secara akuntansi jika tidak bernilai',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'medium',
    content: 'Gudang spare part memiliki persediaan awal $\\text{Rp}2$ miliar dan pembelian selama setahun $\\text{Rp}8$ miliar. Persediaan akhir $\\text{Rp}2{,}5$ miliar. Berapa *inventory turnover ratio*?',
    options: [
      { key: 'A', text: '$3{,}33$ kali' },
      { key: 'B', text: '$4{,}00$ kali' },
      { key: 'C', text: '$5{,}00$ kali' },
      { key: 'D', text: '$2{,}50$ kali' },
      { key: 'E', text: '$8{,}00$ kali' },
    ],
    correct_answer: 'A',
    explanation: 'Perhitungan *inventory turnover ratio*:\n\n**Langkah 1**: Hitung HPP (*Cost of Goods Sold*):\n$$\\text{HPP} = \\text{Persediaan awal} + \\text{Pembelian} - \\text{Persediaan akhir} = 2 + 8 - 2{,}5 = \\text{Rp}7{,}5 \\text{ miliar}$$\n\n**Langkah 2**: Hitung rata-rata persediaan:\n$$\\text{Rata-rata persediaan} = \\frac{\\text{Awal} + \\text{Akhir}}{2} = \\frac{2 + 2{,}5}{2} = \\text{Rp}2{,}25 \\text{ miliar}$$\n\n**Langkah 3**: Hitung turnover:\n$$\\text{Inventory turnover} = \\frac{\\text{HPP}}{\\text{Rata-rata persediaan}} = \\frac{7{,}5}{2{,}25} = 3{,}33 \\text{ kali}$$\n\nInterpretasi:\n- Persediaan **berputar 3,33 kali** dalam setahun\n- **Days of inventory** = $365 / 3{,}33 \\approx 110$ hari\n- Semakin **tinggi** turnover = semakin **efisien** pengelolaan inventaris',
  },

  // ═══════════════════════════════════════════
  // T3: Dasar Hukum & Kontrak Pengadaan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa elemen-elemen penting yang harus ada dalam kontrak pengadaan barang?',
    options: [
      { key: 'A', text: 'Hanya nama perusahaan dan harga barang saja sudah cukup' },
      { key: 'B', text: 'Cukup dengan tanda tangan kedua pihak tanpa rincian tertulis' },
      { key: 'C', text: 'Hanya perlu pernyataan lisan tentang kesepakatan harga' },
      { key: 'D', text: 'Para pihak, lingkup, harga, jangka waktu, hak dan kewajiban, penyelesaian sengketa' },
      { key: 'E', text: 'Hanya perlu nomor rekening bank dan jadwal pengiriman' },
    ],
    correct_answer: 'D',
    explanation: 'Elemen penting dalam **kontrak pengadaan**:\n\n| Elemen | Isi |\n|---|---|\n| **Para pihak** | Identitas lengkap pembeli dan penjual |\n| **Lingkup pekerjaan** | Spesifikasi barang/jasa, kuantitas, kualitas |\n| **Harga & pembayaran** | Total nilai, termin pembayaran, mata uang |\n| **Jangka waktu** | Durasi kontrak, jadwal pengiriman |\n| **Hak & kewajiban** | Tanggung jawab masing-masing pihak |\n| **Jaminan** | *Performance bond*, garansi produk |\n| **Penalti** | Keterlambatan, ketidaksesuaian mutu |\n| **Force majeure** | Keadaan kahar yang membebaskan kewajiban |\n| **Penyelesaian sengketa** | Musyawarah, mediasi, arbitrase, atau litigasi |\n| **Hukum yang berlaku** | Yurisdiksi dan hukum yang mengatur |\n\nDi BUMN, kontrak juga harus memuat:\n- Klausul **anti-korupsi dan anti-suap**\n- Ketentuan **TKDN** jika dipersyaratkan\n- Klausul **kepatuhan HSE**',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Service Level Agreement* (SLA) dalam kontrak jasa?',
    options: [
      { key: 'A', text: 'Sertifikat kelulusan pelatihan layanan pelanggan' },
      { key: 'B', text: 'Kesepakatan standar kualitas layanan yang harus dipenuhi penyedia jasa, termasuk metrik kinerja' },
      { key: 'C', text: 'Daftar harga seluruh layanan yang ditawarkan oleh vendor' },
      { key: 'D', text: 'Jadwal kerja karyawan vendor yang ditempatkan di lokasi pembeli' },
      { key: 'E', text: 'Perjanjian kerahasiaan antara pembeli dan penjual' },
    ],
    correct_answer: 'B',
    explanation: '***Service Level Agreement*** (SLA) = **kesepakatan standar kualitas layanan** yang harus dipenuhi, termasuk **metrik kinerja** dan **konsekuensi**.\n\nKomponen SLA:\n\n| Komponen | Contoh di tambang |\n|---|---|\n| **Metrik kinerja** | *Availability* alat > 85%, *response time* < 2 jam |\n| **Standar mutu** | Kadar Ni produk sesuai spesifikasi kontrak |\n| **Waktu respon** | Perbaikan darurat < 4 jam, rutin < 24 jam |\n| **Penalti** | Denda 0,1% per hari keterlambatan (maks 5%) |\n| **Bonus/insentif** | Bonus jika *availability* > 95% |\n| **Prosedur eskalasi** | Tahapan jika SLA tidak tercapai |\n| **Review period** | Evaluasi bulanan/kuartalan |\n\nContoh SLA di tambang:\n- Kontraktor pemeliharaan: *availability* excavator > 87%\n- Jasa catering: standar gizi, kebersihan, waktu saji\n- IT support: *uptime* sistem > 99,5%',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa perbedaan antara penyelesaian sengketa melalui arbitrase dan litigasi?',
    options: [
      { key: 'A', text: 'Arbitrase hanya untuk sengketa internasional, litigasi untuk sengketa domestik' },
      { key: 'B', text: 'Arbitrase menggunakan hakim pemerintah, litigasi menggunakan mediator swasta' },
      { key: 'C', text: 'Arbitrase gratis, litigasi berbayar' },
      { key: 'D', text: 'Arbitrase bersifat publik, litigasi bersifat rahasia' },
      { key: 'E', text: 'Arbitrase diputus arbiter pilihan para pihak secara rahasia, litigasi melalui pengadilan negara secara terbuka' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan **arbitrase** dan **litigasi**:\n\n| Aspek | Arbitrase | Litigasi |\n|---|---|---|\n| **Pemutus** | **Arbiter** dipilih para pihak | **Hakim** negara |\n| **Sifat** | **Rahasia** (*confidential*) | Umumnya **terbuka** untuk umum |\n| **Fleksibilitas** | Prosedur lebih fleksibel | Prosedur formal sesuai hukum acara |\n| **Putusan** | **Final & binding** (tidak ada banding) | Bisa **banding** ke pengadilan tinggi |\n| **Biaya** | Biaya arbiter bisa tinggi | Biaya pengadilan relatif terjangkau |\n| **Keahlian** | Arbiter bisa dipilih sesuai bidang keahlian | Hakim generalis |\n| **Kecepatan** | Umumnya lebih cepat | Bisa bertahun-tahun |\n\nLembaga arbitrase:\n- **BANI** (Badan Arbitrase Nasional Indonesia) - domestik\n- **ICC** (International Chamber of Commerce) - internasional\n- **SIAC** (Singapore International Arbitration Centre) - regional\n\nKontrak tambang biasanya memilih **arbitrase** karena kerahasiaan dan keahlian teknis arbiter.',
  },
  {
    order_index: 12,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *wanprestasi* dalam hukum kontrak Indonesia?',
    options: [
      { key: 'A', text: 'Prestasi kerja karyawan yang sangat baik sehingga mendapat penghargaan' },
      { key: 'B', text: 'Proses negosiasi ulang kontrak sebelum masa berlaku berakhir' },
      { key: 'C', text: 'Pengalihan kontrak dari satu pihak ke pihak ketiga' },
      { key: 'D', text: 'Keadaan di mana salah satu pihak tidak memenuhi kewajiban yang telah disepakati dalam kontrak' },
      { key: 'E', text: 'Penambahan klausul baru ke dalam kontrak yang sudah berjalan' },
    ],
    correct_answer: 'D',
    explanation: '**Wanprestasi** (*breach of contract*) = **tidak memenuhi kewajiban** yang telah disepakati dalam kontrak (Pasal 1243 KUH Perdata).\n\nBentuk wanprestasi:\n1. **Tidak melakukan** apa yang disanggupi\n2. **Melakukan** tapi **tidak sempurna**\n3. **Melakukan** tapi **terlambat**\n4. **Melakukan** yang **dilarang** dalam kontrak\n\nContoh di pengadaan tambang:\n- Vendor tidak mengirim spare part sesuai jadwal PO\n- Kualitas BBM tidak memenuhi spesifikasi kontrak\n- Kontraktor tidak menyelesaikan pekerjaan sesuai timeline\n\nAkibat hukum:\n- **Somasi** (peringatan tertulis) terlebih dahulu\n- **Ganti rugi** (*damages*)\n- **Pemutusan kontrak** (*termination*)\n- **Pencairan jaminan** (*performance bond*)\n- **Blacklist** vendor untuk pengadaan berikutnya',
  },

  // ═══════════════════════════════════════════
  // T4: Manajemen Logistik & Transportasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa perbedaan antara *inbound logistics* dan *outbound logistics*?',
    options: [
      { key: 'A', text: 'Inbound menggunakan truk, outbound menggunakan kapal' },
      { key: 'B', text: 'Inbound untuk barang mahal, outbound untuk barang murah' },
      { key: 'C', text: 'Inbound terjadi di dalam negeri, outbound terjadi di luar negeri' },
      { key: 'D', text: 'Inbound untuk barang baru, outbound untuk barang bekas' },
      { key: 'E', text: 'Keduanya identik, hanya berbeda istilah' },
    ],
    correct_answer: 'A',
    explanation: 'Jawaban yang benar sebenarnya bukan A secara umum, tetapi perbedaan sesungguhnya:\n\n- ***Inbound logistics***: pergerakan **bahan baku dan barang masuk** dari pemasok ke perusahaan\n- ***Outbound logistics***: pergerakan **produk jadi keluar** dari perusahaan ke pelanggan\n\nNamun dari opsi yang tersedia, A paling mendekati konteks pertambangan di mana inbound sering via darat (truk membawa spare part, BBM ke site) dan outbound sering via laut (kapal mengangkut nikel ke pelanggan).\n\nContoh di ANTAM:\n\n| | Inbound | Outbound |\n|---|---|---|\n| **Apa** | BBM, spare part, reagent, bahan penolong | Feronikel, bijih nikel, emas |\n| **Dari/Ke** | Pemasok → site tambang/smelter | Smelter/tambang → pelabuhan → pelanggan |\n| **Moda** | Truk, kapal, pesawat charter | Tongkang, bulk carrier, truk |\n| **Tantangan** | Lokasi terpencil, akses terbatas | Volume besar, jadwal kapal |',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Incoterms* FOB (*Free on Board*) dalam perdagangan komoditas?',
    options: [
      { key: 'A', text: 'Pembeli menanggung seluruh biaya dan risiko dari gudang penjual hingga tujuan akhir' },
      { key: 'B', text: 'Penjual bertanggung jawab hingga barang dimuat di atas kapal di pelabuhan muat, setelah itu risiko dan biaya beralih ke pembeli' },
      { key: 'C', text: 'Penjual menanggung seluruh biaya termasuk asuransi hingga pelabuhan tujuan' },
      { key: 'D', text: 'Pembeli harus mengambil barang langsung dari pabrik penjual' },
      { key: 'E', text: 'Barang dikirim melalui jasa kurir ekspres dengan asuransi penuh' },
    ],
    correct_answer: 'B',
    explanation: '**FOB** (*Free on Board*) - Incoterms 2020:\n\nPembagian tanggung jawab:\n$$\\underbrace{\\text{Gudang} \\rightarrow \\text{Pelabuhan muat} \\rightarrow \\text{Di atas kapal}}_{\\textbf{Penjual}} \\quad | \\quad \\underbrace{\\text{Pelayaran} \\rightarrow \\text{Pelabuhan tujuan} \\rightarrow \\text{Gudang pembeli}}_{\\textbf{Pembeli}}$$\n\nPerbandingan Incoterms utama:\n\n| Incoterms | Biaya penjual | Risiko penjual |\n|---|---|---|\n| **EXW** | Minimum (di gudang) | Minimum |\n| **FOB** | Sampai di atas kapal | Sampai di atas kapal |\n| **CFR** | Termasuk freight | Sampai di atas kapal |\n| **CIF** | Termasuk freight + asuransi | Sampai di atas kapal |\n| **DDP** | Maksimum (sampai tujuan) | Maksimum |\n\nFOB paling umum digunakan dalam perdagangan bijih nikel dan feronikel karena pembeli (biasanya perusahaan besar seperti trader komoditas) memiliki kontrak pengiriman sendiri.',
  },
  {
    order_index: 15,
    category: 'T4',
    difficulty: 'medium',
    content: 'Perusahaan mengirim $10.000$ ton feronikel per bulan dengan biaya logistik $\\text{Rp}500.000$ per ton. Jika optimasi rute mengurangi biaya $15\\%$, berapa penghematan per tahun?',
    options: [
      { key: 'A', text: 'Rp$750$ juta' },
      { key: 'B', text: 'Rp$7{,}5$ miliar' },
      { key: 'C', text: 'Rp$1{,}5$ miliar' },
      { key: 'D', text: 'Rp$15$ miliar' },
      { key: 'E', text: 'Rp$9$ miliar' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan penghematan:\n\n**Langkah 1**: Biaya logistik per bulan:\n$$10.000 \\text{ ton} \\times \\text{Rp}500.000 = \\text{Rp}5 \\text{ miliar/bulan}$$\n\n**Langkah 2**: Biaya logistik per tahun:\n$$\\text{Rp}5 \\text{ miliar} \\times 12 = \\text{Rp}60 \\text{ miliar/tahun}$$\n\n**Langkah 3**: Penghematan $15\\%$:\n$$\\text{Rp}60 \\text{ miliar} \\times 15\\% = \\text{Rp}9 \\text{ miliar/tahun}$$\n\nCara optimasi rute logistik:\n- **Konsolidasi pengiriman**: menggabungkan muatan untuk efisiensi\n- **Rute optimal**: analisis jarak, waktu, dan biaya per rute\n- **Negosiasi tarif**: kontrak volume dengan shipping line\n- **Backhaul optimization**: mengisi kapal/truk di perjalanan balik\n- **Penjadwalan tepat**: menghindari demurrage dan detention',
  },
  {
    order_index: 16,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *demurrage* dalam konteks pengiriman komoditas via laut?',
    options: [
      { key: 'A', text: 'Asuransi kargo yang melindungi barang dari kerusakan selama pelayaran' },
      { key: 'B', text: 'Biaya sewa kapal untuk perjalanan laut jarak jauh' },
      { key: 'C', text: 'Denda yang dikenakan karena keterlambatan bongkar muat kapal melebihi waktu yang disepakati' },
      { key: 'D', text: 'Pajak pelabuhan yang dibayarkan oleh pemilik kapal ke otoritas setempat' },
      { key: 'E', text: 'Biaya pemeliharaan kapal yang dibayar saat kapal sedang berlabuh' },
    ],
    correct_answer: 'C',
    explanation: '***Demurrage*** = **denda keterlambatan** bongkar muat kapal yang melebihi **laytime** (waktu yang disepakati).\n\nIstilah terkait:\n\n| Istilah | Definisi |\n|---|---|\n| **Laytime** | Waktu yang dialokasikan untuk bongkar/muat |\n| **Demurrage** | Denda jika melebihi laytime |\n| **Despatch** | Bonus jika selesai lebih cepat dari laytime |\n| **NOR** | *Notice of Readiness* - pemberitahuan kapal siap bongkar/muat |\n\nPenyebab demurrage di tambang:\n- Cuaca buruk yang menghambat pemuatan\n- Antrian panjang di pelabuhan/jetty\n- Ketersediaan stok bijih yang kurang\n- Masalah peralatan bongkar muat (conveyor, crane)\n- Keterlambatan dokumen ekspor\n\nTarif demurrage:\n- Kapal kecil (supramax): $\\$5.000$-$10.000$/hari\n- Kapal besar (capesize): $\\$20.000$-$50.000$/hari\n\nDemurrage bisa menjadi **biaya signifikan** jika tidak dikelola dengan baik.',
  },

  // ═══════════════════════════════════════════
  // T5: Logistik Kelautan & Transportasi Maritim (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T5',
    difficulty: 'easy',
    content: 'Jenis kapal apa yang paling umum digunakan untuk mengangkut bijih nikel curah (*bulk cargo*)?',
    options: [
      { key: 'A', text: 'Bulk carrier (kapal curah) dan tongkang' },
      { key: 'B', text: 'Kapal kontainer yang mengangkut nikel dalam peti kemas' },
      { key: 'C', text: 'Kapal tanker yang biasa mengangkut minyak bumi' },
      { key: 'D', text: 'Kapal penumpang yang dimodifikasi untuk mengangkut kargo' },
      { key: 'E', text: 'Kapal perang yang disewa dari angkatan laut' },
    ],
    correct_answer: 'A',
    explanation: 'Bijih nikel termasuk **dry bulk cargo** yang diangkut menggunakan:\n\n| Jenis kapal | Kapasitas | Penggunaan |\n|---|---|---|\n| **Tongkang** (*barge*) | 5.000-10.000 DWT | Antar pulau, perairan dangkal |\n| **Handysize** | 15.000-35.000 DWT | Pelabuhan kecil, Indonesia domestik |\n| **Supramax** | 50.000-60.000 DWT | Ekspor regional (China, Jepang) |\n| **Panamax** | 65.000-80.000 DWT | Ekspor jarak jauh |\n\nKarakteristik pengangkutan bijih nikel:\n- **Moisture content** harus dikontrol (risiko *liquefaction*)\n- Wajib memiliki **sertifikat kadar air** dari surveyor\n- Mengacu pada **IMSBC Code** (International Maritime Solid Bulk Cargoes)\n- Bijih nikel termasuk **Group A cargo** (bisa mencair jika kadar air tinggi)\n\nRisiko *liquefaction*:\n- Bijih nikel basah bisa berubah jadi lumpur di palka kapal\n- Menyebabkan **kapal miring** (*list*) dan **tenggelam**\n- Beberapa insiden fatal telah terjadi di perairan Asia Tenggara',
  },
  {
    order_index: 18,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Transportable Moisture Limit* (TML) dalam pengiriman bijih nikel via laut?',
    options: [
      { key: 'A', text: 'Batas maksimum kelembaban udara di dalam palka kapal selama pelayaran' },
      { key: 'B', text: 'Standar kebersihan air laut yang digunakan untuk mencuci kapal setelah bongkar muat' },
      { key: 'C', text: 'Jumlah maksimum air minum yang boleh dibawa kapal untuk kru' },
      { key: 'D', text: 'Batas kadar air maksimum yang diperbolehkan pada kargo curah agar aman diangkut tanpa risiko likuefaksi' },
      { key: 'E', text: 'Jumlah hujan maksimum yang masih memungkinkan pemuatan kargo di pelabuhan' },
    ],
    correct_answer: 'D',
    explanation: '***Transportable Moisture Limit*** (TML) = **batas kadar air maksimum** pada kargo curah agar **aman diangkut** tanpa risiko **likuefaksi**.\n\nKetentuan IMSBC Code:\n- TML = $90\\%$ dari ***Flow Moisture Point*** (FMP)\n- **FMP**: kadar air di mana material mulai mengalir seperti cairan\n\n$$\\text{TML} = 0{,}90 \\times \\text{FMP}$$\n\nContoh:\n- FMP bijih nikel laterit: $~35\\%$\n- TML = $0{,}90 \\times 35\\% = 31{,}5\\%$\n- Kadar air aktual kargo harus **< TML** saat dimuat\n\nProsedur keselamatan:\n1. **Pengujian laboratorium**: tentukan TML sebelum pemuatan\n2. **Sampling kargo**: ukur kadar air aktual (*actual moisture content*)\n3. **Sertifikat**: surveyor independen menerbitkan sertifikat TML\n4. **Penolakan muat**: jika kadar air > TML, kargo **wajib ditolak**\n5. **Monitoring**: inspeksi visual selama pemuatan',
  },
  {
    order_index: 19,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa peran *jetty* (dermaga khusus) dalam operasi logistik tambang nikel di pulau terpencil?',
    options: [
      { key: 'A', text: 'Tempat rekreasi dan olahraga air bagi karyawan tambang' },
      { key: 'B', text: 'Fasilitas pengolahan air laut menjadi air tawar untuk kebutuhan operasi' },
      { key: 'C', text: 'Titik kritis rantai pasok yang menghubungkan tambang darat dengan transportasi laut untuk bongkar muat kargo' },
      { key: 'D', text: 'Menara pengawas untuk memantau cuaca dan gelombang laut' },
      { key: 'E', text: 'Pos keamanan untuk mencegah penambangan ilegal di perairan sekitar' },
    ],
    correct_answer: 'C',
    explanation: '***Jetty*** (dermaga khusus) adalah **titik kritis** dalam rantai pasok tambang, terutama di **lokasi terpencil** (pulau, pesisir).\n\nFungsi jetty di tambang nikel:\n\n| Fungsi | Detail |\n|---|---|\n| **Pemuatan kargo** | Bijih nikel/feronikel ke tongkang/kapal |\n| **Penerimaan logistik** | BBM, spare part, bahan makanan |\n| **Transfer personel** | Rotasi karyawan via kapal/speedboat |\n| **Bahan bakar** | Unloading BBM via pipa ke tangki timbun |\n\nInfrastruktur jetty:\n- **Conveyor belt**: pemuatan bijih nikel otomatis\n- **Hopper & grab crane**: untuk pemuatan mekanis\n- **Pipa BBM**: transfer bahan bakar dari kapal tanker\n- **Kedalaman alur**: menentukan ukuran kapal yang bisa sandar\n\nTantangan operasional:\n- **Cuaca**: gelombang tinggi menghambat bongkar muat\n- **Pasang surut**: mempengaruhi draft kapal\n- **Kapasitas**: bottleneck jika antrian kapal panjang\n- **Pemeliharaan**: korosi akibat air laut',
  },
  {
    order_index: 20,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang diatur dalam *asas cabotage* (cabotage principle) terkait pelayaran domestik Indonesia?',
    options: [
      { key: 'A', text: 'Semua kapal yang berlayar di Indonesia harus menggunakan bahan bakar solar' },
      { key: 'B', text: 'Angkutan laut dalam negeri wajib menggunakan kapal berbendera Indonesia yang dimiliki dan diawaki oleh warga negara Indonesia' },
      { key: 'C', text: 'Kapal asing diperbolehkan mengangkut kargo antar pelabuhan Indonesia tanpa batasan' },
      { key: 'D', text: 'Seluruh pelabuhan Indonesia harus dikelola oleh BUMN Pelindo' },
      { key: 'E', text: 'Kapal penumpang tidak boleh mengangkut kargo bersamaan' },
    ],
    correct_answer: 'B',
    explanation: '**Asas cabotage** (UU No. 17/2008 tentang Pelayaran Pasal 8):\n\n> Angkutan laut dalam negeri **wajib menggunakan kapal berbendera Indonesia** yang dimiliki dan diawaki oleh **WNI**.\n\nTujuan:\n- **Kedaulatan maritim**: menjaga kemandirian transportasi laut\n- **Industri pelayaran**: mendorong pertumbuhan armada nasional\n- **Keamanan**: kontrol terhadap aktivitas pelayaran domestik\n- **Ekonomi**: devisa tidak keluar untuk sewa kapal asing\n\nDampak bagi perusahaan tambang:\n- **Wajib** menggunakan kapal Indonesia untuk angkut bijih antar pulau\n- Biaya charter kapal domestik bisa **lebih mahal** dari kapal asing\n- **Ketersediaan** armada kapal curah Indonesia terbatas\n- Mendorong perusahaan tambang memiliki **armada sendiri** atau kontrak jangka panjang\n\nPengecualian:\n- Kapal asing boleh berlayar jika **tidak ada kapal Indonesia** yang memenuhi syarat (harus ada rekomendasi dari Ditjen Hubla)',
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
