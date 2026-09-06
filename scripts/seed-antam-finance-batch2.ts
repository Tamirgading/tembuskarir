/**
 * ANTAM IMPACT 2026 — Finance & Accounting (FIN) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Prinsip Akuntansi Keuangan Dasar): 4 soal (3 konsep + 1 hitungan)
 *   T2 (Akuntansi Biaya & Akuntansi Manajemen): 4 soal (2 konsep + 2 hitungan)
 *   T3 (Manajemen Keuangan Korporat): 4 soal (2 konsep + 2 hitungan)
 *   T4 (Dasar Perpajakan Indonesia): 4 soal (2 konsep + 2 hitungan)
 *   T5 (Pengendalian Internal & Dasar Audit): 4 soal (4 konsep)
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-finance-batch2.ts
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
// A: 23,28,34,39 | B: 21,26,32,37 | C: 24,30,35,40 | D: 25,29,33,38 | E: 22,27,31,36

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Prinsip Akuntansi Keuangan Dasar (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Debt to Equity Ratio* (DER) dan bagaimana interpretasinya?',
    options: [
      { key: 'A', text: 'Rasio yang mengukur kemampuan perusahaan membayar dividen tepat waktu' },
      { key: 'B', text: 'Rasio yang membandingkan total liabilitas dengan total ekuitas untuk mengukur proporsi utang' },
      { key: 'C', text: 'Rasio yang mengukur perputaran persediaan dalam satu periode' },
      { key: 'D', text: 'Rasio yang membandingkan laba bersih dengan total aset' },
      { key: 'E', text: 'Rasio yang mengukur efisiensi penggunaan tenaga kerja' },
    ],
    correct_answer: 'B',
    explanation: '**DER** (*Debt to Equity Ratio*) = rasio yang mengukur proporsi pendanaan dari **utang** versus **modal sendiri**.\n\n$$\\text{DER} = \\frac{\\text{Total Liabilitas}}{\\text{Total Ekuitas}}$$\n\nInterpretasi:\n\n| DER | Interpretasi |\n|---|---|\n| **< 1** | Pendanaan lebih banyak dari ekuitas (konservatif) |\n| **= 1** | Utang dan ekuitas seimbang |\n| **> 1** | Pendanaan lebih banyak dari utang (agresif) |\n| **> 2** | Sangat leveraged, risiko tinggi |\n\nContoh:\n- Total liabilitas ANTAM: Rp8 triliun\n- Total ekuitas: Rp16 triliun\n- DER = 8/16 = **0,5**\n- Artinya: setiap Rp1 ekuitas didukung Rp0,50 utang\n\nPertimbangan di pertambangan:\n- Industri tambang cenderung **capital intensive** → DER lebih tinggi wajar\n- DER ideal tergantung **industri** dan **siklus komoditas**\n- Saat harga komoditas turun, DER tinggi = **risiko besar**',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Jika *Return on Equity* (ROE) suatu perusahaan adalah 18% dan total ekuitas Rp20 triliun, berapa laba bersih perusahaan?',
    options: [
      { key: 'A', text: 'Rp2 triliun' },
      { key: 'B', text: 'Rp4,5 triliun' },
      { key: 'C', text: 'Rp1,8 triliun' },
      { key: 'D', text: 'Rp5 triliun' },
      { key: 'E', text: 'Rp3,6 triliun' },
    ],
    correct_answer: 'E',
    explanation: '**ROE** (*Return on Equity*) = ukuran profitabilitas terhadap modal pemegang saham.\n\n$$\\text{ROE} = \\frac{\\text{Laba Bersih}}{\\text{Total Ekuitas}} \\times 100\\%$$\n\nDiketahui:\n- ROE = 18%\n- Total Ekuitas = Rp20 triliun\n\n$$\\begin{aligned}\n18\\% &= \\frac{\\text{Laba Bersih}}{20.000.000.000.000} \\times 100\\% \\\\\n\\text{Laba Bersih} &= 18\\% \\times 20.000.000.000.000 \\\\\n&= 0{,}18 \\times 20.000.000.000.000 \\\\\n&= \\textbf{Rp3.600.000.000.000 (Rp3,6 triliun)}\n\\end{aligned}$$\n\nInterpretasi:\n- ROE 18% berarti setiap Rp100 yang diinvestasikan pemegang saham menghasilkan **laba Rp18**\n- ROE di atas **15%** umumnya dianggap **baik**\n- Perbandingan: ROE rata-rata industri pertambangan di Indonesia berkisar **10-20%**',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *going concern* dalam asumsi dasar akuntansi?',
    options: [
      { key: 'A', text: 'Asumsi bahwa perusahaan akan terus beroperasi dalam jangka panjang dan tidak berniat melikuidasi' },
      { key: 'B', text: 'Asumsi bahwa perusahaan akan menjual seluruh asetnya dalam waktu dekat' },
      { key: 'C', text: 'Asumsi bahwa harga saham perusahaan akan terus naik setiap tahun' },
      { key: 'D', text: 'Asumsi bahwa perusahaan akan selalu membagikan dividen kepada pemegang saham' },
      { key: 'E', text: 'Asumsi bahwa perusahaan tidak akan pernah mengalami kerugian' },
    ],
    correct_answer: 'A',
    explanation: '***Going concern*** = asumsi bahwa perusahaan akan **terus beroperasi** dalam jangka waktu yang dapat diprediksi (biasanya minimal 12 bulan ke depan).\n\nDampak terhadap akuntansi:\n\n| Aspek | Dengan Going Concern | Tanpa Going Concern |\n|---|---|---|\n| **Aset tetap** | Dicatat pada **biaya historis** - depresiasi | Dicatat pada **nilai likuidasi** |\n| **Aset tidak berwujud** | Diamortisasi sesuai masa manfaat | Dihapuskan seluruhnya |\n| **Liabilitas** | Diklasifikasi lancar/tidak lancar | Seluruhnya menjadi **lancar** |\n| **Depresiasi** | Berdasarkan **masa manfaat** | Tidak relevan |\n\nIndikator keraguan going concern:\n- **Keuangan**: rugi berturut-turut, modal kerja negatif, gagal bayar utang\n- **Operasional**: kehilangan pasar utama, kehilangan izin operasi\n- **Hukum**: gugatan yang berpotensi menghancurkan perusahaan\n\nDi pertambangan:\n- **Habisnya cadangan** mineral tanpa penemuan baru\n- **Pencabutan IUP** oleh pemerintah\n- **Harga komoditas** yang sangat rendah dalam jangka panjang',
  },
  {
    order_index: 24,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa perbedaan antara PSAK (Pernyataan Standar Akuntansi Keuangan) dan IFRS (International Financial Reporting Standards)?',
    options: [
      { key: 'A', text: 'PSAK hanya untuk perusahaan tambang, IFRS untuk perusahaan non-tambang' },
      { key: 'B', text: 'PSAK adalah standar yang dikeluarkan oleh pemerintah AS, IFRS oleh pemerintah Inggris' },
      { key: 'C', text: 'PSAK adalah standar akuntansi Indonesia yang diadopsi dari IFRS, diterbitkan DSAK-IAI; IFRS diterbitkan IASB' },
      { key: 'D', text: 'PSAK menggunakan cash basis, IFRS menggunakan accrual basis' },
      { key: 'E', text: 'PSAK untuk laporan keuangan bulanan, IFRS untuk laporan tahunan' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan **PSAK** dan **IFRS**:\n\n| Aspek | PSAK | IFRS |\n|---|---|---|\n| **Penerbit** | **DSAK-IAI** (Dewan Standar Akuntansi Keuangan - Ikatan Akuntan Indonesia) | **IASB** (International Accounting Standards Board) |\n| **Cakupan** | Indonesia | Global (150+ negara) |\n| **Hubungan** | **Mengadopsi** IFRS (dengan beberapa penyesuaian lokal) | Standar induk |\n| **Bahasa** | Indonesia | Inggris |\n\nContoh konvergensi:\n\n| PSAK | IFRS | Tentang |\n|---|---|---|\n| PSAK 1 | IAS 1 | Penyajian Laporan Keuangan |\n| PSAK 16 | IAS 16 | Aset Tetap |\n| PSAK 72 | IFRS 15 | Pendapatan dari Kontrak Pelanggan |\n| PSAK 73 | IFRS 16 | Sewa |\n\nPenyesuaian lokal:\n- **PSAK 45**: untuk entitas nirlaba (tidak ada padanan IFRS)\n- **SAK EMKM**: standar khusus untuk UMKM (lebih sederhana)\n- **SAK ETAP**: standar untuk entitas tanpa akuntabilitas publik',
  },

  // ═══════════════════════════════════════════
  // T2: Akuntansi Biaya & Akuntansi Manajemen (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah unit pengolahan memproduksi 10.000 ton ferronickel. Biaya bahan baku Rp30 miliar, tenaga kerja langsung Rp10 miliar, dan overhead pabrik Rp20 miliar. Berapa harga pokok produksi per ton?',
    options: [
      { key: 'A', text: 'Rp3 juta/ton' },
      { key: 'B', text: 'Rp4 juta/ton' },
      { key: 'C', text: 'Rp5 juta/ton' },
      { key: 'D', text: 'Rp6 juta/ton' },
      { key: 'E', text: 'Rp2 juta/ton' },
    ],
    correct_answer: 'D',
    explanation: '**Harga Pokok Produksi** (HPP) per ton:\n\n$$\\text{Total HPP} = \\text{BBB} + \\text{BTKL} + \\text{BOP}$$\n\n$$\\begin{aligned}\n\\text{Total HPP} &= 30 + 10 + 20 \\\\\n&= \\text{Rp60 miliar}\n\\end{aligned}$$\n\n$$\\begin{aligned}\n\\text{HPP per ton} &= \\frac{\\text{Rp60.000.000.000}}{10.000 \\text{ ton}} \\\\\n&= \\textbf{Rp6.000.000/ton}\n\\end{aligned}$$\n\nRincian biaya per ton:\n\n| Komponen | Total | Per ton | % |\n|---|---|---|---|\n| Bahan baku langsung | Rp30 miliar | Rp3 juta | 50% |\n| Tenaga kerja langsung | Rp10 miliar | Rp1 juta | 17% |\n| Overhead pabrik | Rp20 miliar | Rp2 juta | 33% |\n| **Total HPP** | **Rp60 miliar** | **Rp6 juta** | **100%** |\n\nAnalisis:\n- Bahan baku mendominasi (**50%** dari total HPP) yang umum di industri pertambangan/pengolahan\n- HPP per ton penting untuk menentukan **harga jual** dan **margin keuntungan**\n- Jika harga jual ferronickel $18.000/ton (sekitar Rp18 juta), gross margin = (18-6)/18 = **67%**',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *anggaran* (budget) dalam akuntansi manajemen?',
    options: [
      { key: 'A', text: 'Laporan keuangan yang sudah diaudit oleh akuntan publik' },
      { key: 'B', text: 'Rencana keuangan kuantitatif untuk periode tertentu sebagai alat perencanaan dan pengendalian' },
      { key: 'C', text: 'Daftar utang perusahaan yang harus dibayar dalam satu tahun' },
      { key: 'D', text: 'Catatan pengeluaran kas harian yang dibuat oleh kasir' },
      { key: 'E', text: 'Laporan pajak yang diserahkan ke kantor pajak setiap bulan' },
    ],
    correct_answer: 'B',
    explanation: '**Anggaran** (budget) = **rencana keuangan kuantitatif** untuk periode tertentu.\n\nFungsi anggaran:\n\n| Fungsi | Penjelasan |\n|---|---|\n| **Perencanaan** | Menetapkan target pendapatan, biaya, dan laba |\n| **Koordinasi** | Menyelaraskan aktivitas antar departemen |\n| **Pengendalian** | Membandingkan realisasi vs rencana (variance analysis) |\n| **Motivasi** | Target kinerja untuk manajer dan karyawan |\n| **Evaluasi** | Basis penilaian kinerja departemen |\n\nJenis anggaran:\n\n| Jenis | Contoh |\n|---|---|\n| **Anggaran operasional** | Anggaran produksi, penjualan, beban |\n| **Anggaran modal** (CAPEX) | Investasi smelter, pembelian alat berat |\n| **Anggaran kas** | Proyeksi arus kas masuk/keluar |\n| **Master budget** | Gabungan seluruh anggaran |\n\nProses penyusunan:\n1. **Top-down**: manajemen atas menetapkan target\n2. **Bottom-up**: unit kerja mengusulkan anggaran\n3. **Participative** (terbaik): gabungan keduanya',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *biaya langsung* (direct cost) dan *biaya tidak langsung* (indirect cost)?',
    options: [
      { key: 'A', text: 'Biaya langsung selalu lebih besar dari biaya tidak langsung' },
      { key: 'B', text: 'Biaya langsung untuk departemen produksi, biaya tidak langsung untuk departemen keuangan' },
      { key: 'C', text: 'Biaya langsung hanya ada di perusahaan manufaktur, biaya tidak langsung di perusahaan jasa' },
      { key: 'D', text: 'Biaya langsung dibayar tunai, biaya tidak langsung dibayar kredit' },
      { key: 'E', text: 'Biaya langsung dapat ditelusuri ke objek biaya tertentu, biaya tidak langsung harus dialokasikan' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan **biaya langsung** dan **biaya tidak langsung**:\n\n| Aspek | Biaya Langsung | Biaya Tidak Langsung |\n|---|---|---|\n| **Penelusuran** | Dapat **ditelusuri langsung** ke produk/objek biaya | **Tidak dapat** ditelusuri langsung, perlu **alokasi** |\n| **Contoh** | Bijih nikel untuk ferronickel, upah operator smelter | Gaji supervisor pabrik, listrik umum, depresiasi gedung |\n| **Hubungan** | **Jelas** terkait produk | Mendukung **banyak produk** |\n\nContoh di ANTAM:\n\n| Biaya | Jenis | Alasan |\n|---|---|---|\n| Bijih nikel | **Langsung** | Jelas digunakan untuk produk ferronickel |\n| Upah operator smelter | **Langsung** | Langsung terkait proses produksi |\n| Gaji plant manager | **Tidak langsung** | Mengawasi seluruh pabrik, bukan satu produk |\n| Listrik pabrik | **Tidak langsung** | Digunakan bersama oleh berbagai proses |\n| Depresiasi smelter | **Tidak langsung** | Dipakai untuk memproduksi berbagai grade |\n\nMetode alokasi biaya tidak langsung:\n- **Volume-based**: berdasarkan jam kerja, unit produksi\n- **Activity-Based Costing** (ABC): berdasarkan aktivitas yang lebih akurat',
  },
  {
    order_index: 28,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah smelter memproduksi 8.000 ton dengan biaya tetap Rp40 miliar dan biaya variabel Rp5 juta/ton. Jika produksi naik menjadi 10.000 ton, berapa biaya rata-rata per ton?',
    options: [
      { key: 'A', text: 'Rp9 juta/ton' },
      { key: 'B', text: 'Rp8 juta/ton' },
      { key: 'C', text: 'Rp10 juta/ton' },
      { key: 'D', text: 'Rp7 juta/ton' },
      { key: 'E', text: 'Rp6 juta/ton' },
    ],
    correct_answer: 'A',
    explanation: '**Biaya rata-rata per ton** pada produksi 10.000 ton:\n\n$$\\text{Total Biaya} = \\text{Biaya Tetap} + (\\text{Biaya Variabel per ton} \\times \\text{Volume})$$\n\n$$\\begin{aligned}\n\\text{Total Biaya} &= 40.000.000.000 + (5.000.000 \\times 10.000) \\\\\n&= 40.000.000.000 + 50.000.000.000 \\\\\n&= \\text{Rp90.000.000.000}\n\\end{aligned}$$\n\n$$\\begin{aligned}\n\\text{Biaya rata-rata per ton} &= \\frac{90.000.000.000}{10.000} \\\\\n&= \\textbf{Rp9.000.000/ton}\n\\end{aligned}$$\n\nPerbandingan dengan produksi 8.000 ton:\n\n| | 8.000 ton | 10.000 ton |\n|---|---|---|\n| Biaya tetap | Rp40 miliar | Rp40 miliar |\n| Biaya variabel | Rp40 miliar | Rp50 miliar |\n| **Total** | **Rp80 miliar** | **Rp90 miliar** |\n| **Per ton** | **Rp10 juta** | **Rp9 juta** |\n\nBiaya per ton **turun** dari Rp10 juta ke Rp9 juta karena biaya tetap **tersebar** ke lebih banyak unit (*economies of scale*).',
  },

  // ═══════════════════════════════════════════
  // T3: Manajemen Keuangan Korporat (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *manajemen modal kerja* (working capital management)?',
    options: [
      { key: 'A', text: 'Pengelolaan investasi jangka panjang dalam aset tetap seperti smelter dan pabrik' },
      { key: 'B', text: 'Strategi untuk meningkatkan harga saham perusahaan di bursa efek' },
      { key: 'C', text: 'Program pelatihan untuk meningkatkan keterampilan tenaga kerja' },
      { key: 'D', text: 'Pengelolaan aset lancar dan liabilitas jangka pendek untuk menjamin likuiditas operasional' },
      { key: 'E', text: 'Pengelolaan hubungan dengan bank untuk mendapatkan pinjaman jangka panjang' },
    ],
    correct_answer: 'D',
    explanation: '**Manajemen modal kerja** = pengelolaan **aset lancar** dan **liabilitas jangka pendek**.\n\n$$\\text{Modal Kerja Bersih} = \\text{Aset Lancar} - \\text{Liabilitas Jangka Pendek}$$\n\nKomponen yang dikelola:\n\n| Komponen | Tujuan | Contoh di pertambangan |\n|---|---|---|\n| **Kas** | Likuiditas cukup tapi tidak berlebihan | Saldo kas operasional |\n| **Piutang** | Penagihan cepat | Tagihan ke pembeli ferronickel |\n| **Persediaan** | Stok optimal | Bijih nikel, spare part, BBM |\n| **Utang usaha** | Manfaatkan credit terms | Pembayaran ke vendor/kontraktor |\n\nStrategi:\n- **Agresif**: modal kerja minimal (risiko likuiditas tinggi, efisiensi tinggi)\n- **Konservatif**: modal kerja besar (aman, tapi kurang efisien)\n- **Moderat**: keseimbangan antara risiko dan efisiensi\n\nRasio terkait:\n- **Current ratio** = Aset Lancar / Liabilitas Jangka Pendek\n- **Quick ratio** = (Aset Lancar - Persediaan) / Liabilitas Jangka Pendek\n- **Cash conversion cycle** = DIO + DSO - DPO',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'medium',
    content: 'Proyek A memiliki IRR 15% dan proyek B memiliki IRR 12%. Jika WACC perusahaan adalah 10%, proyek mana yang layak dan mana yang lebih menguntungkan?',
    options: [
      { key: 'A', text: 'Hanya proyek A yang layak karena memiliki IRR tertinggi' },
      { key: 'B', text: 'Hanya proyek B yang layak karena lebih konservatif' },
      { key: 'C', text: 'Kedua proyek layak karena IRR > WACC, proyek A lebih unggul karena selisih IRR lebih besar' },
      { key: 'D', text: 'Tidak ada proyek yang layak karena IRR keduanya di bawah 20%' },
      { key: 'E', text: 'Kedua proyek harus digabung menjadi satu agar layak' },
    ],
    correct_answer: 'C',
    explanation: '**IRR** (*Internal Rate of Return*) = tingkat pengembalian di mana **NPV = 0**.\n\nAturan keputusan:\n\n| Kondisi | Keputusan |\n|---|---|\n| **IRR > WACC** | Proyek **layak** (menciptakan nilai) |\n| **IRR = WACC** | Proyek **impas** |\n| **IRR < WACC** | Proyek **tidak layak** |\n\nAnalisis:\n\n| Proyek | IRR | WACC | Selisih | Keputusan |\n|---|---|---|---|---|\n| **A** | 15% | 10% | **+5%** | **Layak** |\n| **B** | 12% | 10% | **+2%** | **Layak** |\n\nKedua proyek layak karena IRR > WACC. Proyek A lebih menguntungkan karena selisih IRR terhadap WACC lebih besar.\n\nKeterbatasan IRR:\n- **Asumsi reinvestment** pada tingkat IRR (tidak realistis)\n- **Multiple IRR** jika arus kas berubah tanda lebih dari sekali\n- Tidak cocok untuk **proyek eksklusif** dengan skala berbeda (gunakan NPV)\n- Solusi: gunakan **Modified IRR** (MIRR) yang lebih realistis',
  },
  {
    order_index: 31,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *dividen* dan kebijakan dividen perusahaan?',
    options: [
      { key: 'A', text: 'Bunga pinjaman yang dibayarkan perusahaan kepada bank setiap bulan' },
      { key: 'B', text: 'Bonus tahunan yang diberikan kepada seluruh karyawan berdasarkan kinerja' },
      { key: 'C', text: 'Pajak yang dibayarkan perusahaan kepada pemerintah atas keuntungan' },
      { key: 'D', text: 'Biaya asuransi yang dibayarkan perusahaan untuk melindungi asetnya' },
      { key: 'E', text: 'Bagian dari laba bersih perusahaan yang dibagikan kepada pemegang saham, yang besarnya ditentukan dalam RUPS' },
    ],
    correct_answer: 'E',
    explanation: '**Dividen** = bagian **laba bersih** yang dibagikan kepada **pemegang saham**.\n\nJenis dividen:\n\n| Jenis | Penjelasan |\n|---|---|\n| **Dividen kas** | Pembayaran dalam bentuk uang tunai (paling umum) |\n| **Dividen saham** | Pembagian saham tambahan |\n| **Dividen interim** | Dibagikan sebelum tutup buku tahunan |\n| **Dividen final** | Diputuskan setelah RUPS tahunan |\n\nKebijakan dividen:\n\n| Kebijakan | Penjelasan |\n|---|---|\n| **Constant payout ratio** | Persentase tetap dari laba (mis. 30%) |\n| **Stable dividend** | Jumlah tetap per saham |\n| **Residual** | Sisa setelah kebutuhan investasi terpenuhi |\n\nRasio terkait:\n- **Dividend Payout Ratio** = Dividen / Laba Bersih x 100%\n- **Dividend Yield** = Dividen per Saham / Harga Saham x 100%\n\nBUMN (termasuk ANTAM):\n- Pemerintah sebagai pemegang saham mayoritas menentukan **payout ratio** BUMN\n- Biasanya **30-50%** dari laba bersih sebagai **setoran dividen ke APBN**',
  },
  {
    order_index: 32,
    category: 'T3',
    difficulty: 'medium',
    content: 'Jika perusahaan meminjam Rp1 triliun dengan bunga 9% per tahun dan tarif pajak 22%, berapa *after-tax cost of debt*?',
    options: [
      { key: 'A', text: 'Rp90 miliar (9%)' },
      { key: 'B', text: 'Rp70,2 miliar (7,02%)' },
      { key: 'C', text: 'Rp110 miliar (11%)' },
      { key: 'D', text: 'Rp50 miliar (5%)' },
      { key: 'E', text: 'Rp80 miliar (8%)' },
    ],
    correct_answer: 'B',
    explanation: '**After-tax cost of debt** memperhitungkan **penghematan pajak** dari beban bunga (tax shield).\n\n$$\\text{After-tax cost of debt} = r_d \\times (1 - t)$$\n\nDiketahui:\n- Pinjaman = Rp1 triliun\n- Bunga ($r_d$) = 9%\n- Tarif pajak ($t$) = 22%\n\n$$\\begin{aligned}\n\\text{After-tax cost of debt} &= 9\\% \\times (1 - 22\\%) \\\\\n&= 9\\% \\times 0{,}78 \\\\\n&= \\textbf{7,02\\%}\n\\end{aligned}$$\n\nDalam rupiah:\n\n$$\\begin{aligned}\n\\text{Beban bunga sebelum pajak} &= 9\\% \\times 1.000.000.000.000 = \\text{Rp90 miliar} \\\\\n\\text{Tax shield} &= 22\\% \\times 90.000.000.000 = \\text{Rp19,8 miliar} \\\\\n\\text{Beban bunga setelah pajak} &= 90 - 19{,}8 = \\textbf{Rp70,2 miliar}\n\\end{aligned}$$\n\nMengapa ada tax shield?\n- Beban bunga **mengurangi** penghasilan kena pajak\n- Sehingga **pajak yang dibayar lebih kecil**\n- Ini membuat utang lebih \"murah\" dibanding ekuitas (yang dividennya **tidak** mengurangi pajak)',
  },

  // ═══════════════════════════════════════════
  // T4: Dasar Perpajakan Indonesia (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Perusahaan tambang memiliki penghasilan kena pajak Rp800 miliar. Berapa PPh Badan yang terutang (tarif 22%)?',
    options: [
      { key: 'A', text: 'Rp200 miliar' },
      { key: 'B', text: 'Rp160 miliar' },
      { key: 'C', text: 'Rp240 miliar' },
      { key: 'D', text: 'Rp176 miliar' },
      { key: 'E', text: 'Rp80 miliar' },
    ],
    correct_answer: 'D',
    explanation: '**PPh Badan** = tarif x Penghasilan Kena Pajak (PKP).\n\n$$\\begin{aligned}\n\\text{PPh Badan} &= 22\\% \\times \\text{Rp800.000.000.000} \\\\\n&= 0{,}22 \\times 800.000.000.000 \\\\\n&= \\textbf{Rp176.000.000.000 (Rp176 miliar)}\n\\end{aligned}$$\n\nProses perhitungan PPh Badan:\n\n| Langkah | Keterangan |\n|---|---|\n| 1. **Penghasilan bruto** | Total pendapatan dari penjualan komoditas, jasa, dll. |\n| 2. **(-) Biaya yang diperbolehkan** | Biaya operasional, gaji, depresiasi, bunga |\n| 3. **= Penghasilan neto** | Laba fiskal sebelum penyesuaian |\n| 4. **(-) Koreksi fiskal** | Penyesuaian beda tetap dan beda waktu |\n| 5. **= Penghasilan Kena Pajak** | Dasar pengenaan pajak |\n| 6. **x Tarif (22%)** | PPh Badan terutang |\n| 7. **(-) Kredit pajak** | PPh yang sudah dipotong/dibayar di muka |\n| 8. **= PPh kurang/lebih bayar** | Jumlah yang harus disetor/direstitusi |\n\nKhusus perusahaan tambang:\n- Biaya **eksplorasi** dapat diamortisasi\n- Biaya **reklamasi** dapat dibebankan\n- **Royalti** dapat dikurangkan sebagai biaya',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Surat Pemberitahuan* (SPT) dalam perpajakan Indonesia?',
    options: [
      { key: 'A', text: 'Surat dari kantor pajak yang memberitahu perusahaan bahwa pajaknya sudah lunas' },
      { key: 'B', text: 'Surat tagihan dari Ditjen Pajak kepada wajib pajak yang menunggak' },
      { key: 'C', text: 'Surat wajib pajak untuk melaporkan penghitungan dan pembayaran pajak sesuai ketentuan perpajakan' },
      { key: 'D', text: 'Surat izin usaha yang diterbitkan oleh kantor pajak' },
      { key: 'E', text: 'Formulir pendaftaran NPWP untuk wajib pajak baru' },
    ],
    correct_answer: 'C',
    explanation: '**SPT** (*Surat Pemberitahuan*) = sarana wajib pajak untuk **melaporkan** penghitungan dan pembayaran pajak.\n\nJenis SPT:\n\n| Jenis | Frekuensi | Batas Waktu |\n|---|---|---|\n| **SPT Masa PPh 21** | Bulanan | Tgl 20 bulan berikutnya |\n| **SPT Masa PPh 23** | Bulanan | Tgl 20 bulan berikutnya |\n| **SPT Masa PPN** | Bulanan | Akhir bulan berikutnya |\n| **SPT Tahunan Badan** | Tahunan | 30 April tahun berikutnya |\n| **SPT Tahunan OP** | Tahunan | 31 Maret tahun berikutnya |\n\nSanksi keterlambatan:\n- SPT Masa: **Rp100.000 - Rp500.000** per SPT\n- SPT Tahunan Badan: **Rp1.000.000**\n- SPT Tahunan OP: **Rp100.000**\n- Bunga keterlambatan bayar: **0,9% per bulan** (tarif bunga KMK)\n\nCara pelaporan:\n- **e-Filing**: online melalui DJP Online\n- **e-SPT**: aplikasi desktop (untuk SPT yang kompleks)\n- **e-Form**: formulir PDF yang diisi offline',
  },
  {
    order_index: 35,
    category: 'T4',
    difficulty: 'medium',
    content: 'Perusahaan menjual ferronickel senilai Rp500 miliar (sebelum PPN) ke pembeli dalam negeri. Berapa PPN yang harus dipungut (tarif 12%)?',
    options: [
      { key: 'A', text: 'Rp50 miliar' },
      { key: 'B', text: 'Rp55 miliar' },
      { key: 'C', text: 'Rp60 miliar' },
      { key: 'D', text: 'Rp75 miliar' },
      { key: 'E', text: 'Rp100 miliar' },
    ],
    correct_answer: 'C',
    explanation: '**PPN** = tarif x Dasar Pengenaan Pajak (DPP).\n\n$$\\begin{aligned}\n\\text{PPN} &= 12\\% \\times \\text{Rp500.000.000.000} \\\\\n&= 0{,}12 \\times 500.000.000.000 \\\\\n&= \\textbf{Rp60.000.000.000 (Rp60 miliar)}\n\\end{aligned}$$\n\nTotal tagihan ke pembeli:\n\n| Komponen | Jumlah |\n|---|---|\n| Harga jual (DPP) | Rp500 miliar |\n| PPN 12% | Rp60 miliar |\n| **Total** | **Rp560 miliar** |\n\nMekanisme PPN:\n- ANTAM **memungut** PPN dari pembeli (PPN Keluaran)\n- PPN ini **bukan pendapatan** perusahaan, melainkan **titipan** untuk disetorkan ke negara\n- Perusahaan bisa mengkreditkan **PPN Masukan** (PPN yang dibayar saat membeli bahan/jasa)\n\nContoh mekanisme kredit:\n- PPN Keluaran: Rp60 miliar\n- PPN Masukan (dari pembelian bijih, jasa, dll.): Rp40 miliar\n- PPN yang disetorkan ke negara: Rp60 - Rp40 = **Rp20 miliar**',
  },
  {
    order_index: 36,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *royalti pertambangan* dan siapa yang menetapkannya?',
    options: [
      { key: 'A', text: 'Biaya sewa kantor yang dibayarkan ke pemilik gedung setiap bulan' },
      { key: 'B', text: 'Upah lembur yang dibayarkan kepada pekerja tambang pada hari libur' },
      { key: 'C', text: 'Biaya pelatihan karyawan baru yang masih dalam masa percobaan' },
      { key: 'D', text: 'Iuran untuk asosiasi pengusaha pertambangan' },
      { key: 'E', text: 'PNBP berupa iuran produksi yang dibayar perusahaan tambang ke negara sesuai persentase nilai penjualan' },
    ],
    correct_answer: 'E',
    explanation: '**Royalti pertambangan** = **PNBP** (Penerimaan Negara Bukan Pajak) yang dibayarkan perusahaan tambang kepada negara.\n\nJenis PNBP pertambangan:\n\n| Jenis | Penjelasan |\n|---|---|\n| **Iuran tetap** (landrent) | Per hektar wilayah IUP per tahun |\n| **Iuran produksi** (royalti) | Persentase dari nilai penjualan |\n\nTarif royalti (contoh):\n\n| Komoditas | Tarif Royalti |\n|---|---|\n| **Nikel** (bijih) | 5% |\n| **Nikel** (olahan/FeNi) | 2-3% |\n| **Emas** | 3,75% |\n| **Bauksit** | 3,75% |\n| **Batubara** | 3-7% (tergantung kalori) |\n\nDasar hukum: **PP tentang PNBP** di sektor ESDM.\n\nContoh perhitungan:\n- ANTAM menjual ferronickel Rp10 triliun/tahun\n- Royalti 2% = **Rp200 miliar** dibayar ke negara\n\nRoyalti dalam konteks pajak:\n- Royalti **dapat dibebankan** sebagai biaya dalam perhitungan PPh Badan\n- Sehingga mengurangi penghasilan kena pajak',
  },

  // ═══════════════════════════════════════════
  // T5: Pengendalian Internal & Dasar Audit (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 37,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *three lines of defense* dalam manajemen risiko dan pengendalian internal?',
    options: [
      { key: 'A', text: 'Tiga lapisan keamanan fisik: pagar, CCTV, dan satpam' },
      { key: 'B', text: 'Model tiga lini: operasional, manajemen risiko, dan audit internal' },
      { key: 'C', text: 'Tiga jenis asuransi yang harus dimiliki perusahaan' },
      { key: 'D', text: 'Tiga tahap persetujuan untuk setiap transaksi keuangan' },
      { key: 'E', text: 'Tiga divisi yang bertanggung jawab atas keamanan siber' },
    ],
    correct_answer: 'B',
    explanation: '**Three Lines of Defense** = model tiga lapis pertahanan dalam manajemen risiko:\n\n| Lini | Fungsi | Peran | Contoh |\n|---|---|---|---|\n| **1st Line** | Manajemen operasional | **Memiliki dan mengelola** risiko | Manager produksi, supervisor, operator |\n| **2nd Line** | Manajemen risiko & kepatuhan | **Mengawasi dan memfasilitasi** | Risk management, compliance, legal |\n| **3rd Line** | Audit internal | **Memberikan assurance independen** | Divisi Audit Internal, SPI |\n\nDi luar tiga lini:\n- **Audit eksternal**: KAP independen\n- **Regulator**: OJK, BPK, Kementerian ESDM\n\nPrinsip:\n- Lini pertama: **day-to-day controls** di lapangan\n- Lini kedua: **oversight** dan pengembangan framework\n- Lini ketiga: **independent assurance** bahwa lini 1 dan 2 berjalan efektif\n\nUpdate (2020): IIA mengubah nama menjadi **Three Lines Model** (bukan Defense) dengan penekanan pada:\n- **Kolaborasi** antar lini (bukan hanya pertahanan)\n- **Peran governing body** (Dewan Komisaris/Komite Audit) sebagai pengawas',
  },
  {
    order_index: 38,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *materialitas* dalam konteks audit?',
    options: [
      { key: 'A', text: 'Jenis material fisik yang digunakan untuk membangun infrastruktur tambang' },
      { key: 'B', text: 'Jumlah bahan baku minimum yang harus disimpan di gudang' },
      { key: 'C', text: 'Batas waktu penyampaian laporan keuangan ke regulator' },
      { key: 'D', text: 'Besaran salah saji yang dapat mempengaruhi keputusan ekonomi pengguna laporan keuangan, untuk menentukan fokus audit' },
      { key: 'E', text: 'Persyaratan minimal jumlah auditor yang harus terlibat dalam suatu penugasan' },
    ],
    correct_answer: 'D',
    explanation: '**Materialitas** = besaran **salah saji** yang dapat mempengaruhi **keputusan ekonomi** pengguna laporan keuangan.\n\nPenentuan materialitas:\n\n| Basis | Persentase Umum | Contoh |\n|---|---|---|\n| **Laba sebelum pajak** | 5-10% | Perusahaan profit |\n| **Total pendapatan** | 0,5-1% | Perusahaan besar/break-even |\n| **Total aset** | 1-2% | Perusahaan asset-heavy (tambang) |\n| **Total ekuitas** | 1-2% | Entitas nirlaba |\n\nJenis materialitas:\n\n| Jenis | Penjelasan |\n|---|---|\n| **Overall materiality** | Untuk laporan keuangan secara keseluruhan |\n| **Performance materiality** | Lebih rendah, untuk perencanaan prosedur audit (biasanya 50-75% dari overall) |\n| **Tolerable misstatement** | Per akun/saldo individual |\n\nContoh:\n- Total aset ANTAM: Rp40 triliun\n- Materialitas 1% = **Rp400 miliar**\n- Artinya: salah saji di bawah Rp400 miliar kemungkinan **tidak material** (tidak mempengaruhi keputusan pengguna)\n- Auditor akan **fokus** pada area dengan risiko salah saji > materialitas',
  },
  {
    order_index: 39,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Fraud Triangle* dan bagaimana kaitannya dengan pengendalian internal?',
    options: [
      { key: 'A', text: 'Tiga divisi yang bertanggung jawab mencegah kecurangan: hukum, audit, dan keamanan' },
      { key: 'B', text: 'Tiga jenis kecurangan utama: korupsi, pencurian aset, dan manipulasi laporan' },
      { key: 'C', text: 'Tiga tahap investigasi: deteksi, penyelidikan, dan penuntutan' },
      { key: 'D', text: 'Tiga faktor pemicu kecurangan: tekanan, kesempatan, dan pembenaran; pengendalian internal mengurangi faktor kesempatan' },
      { key: 'E', text: 'Tiga sanksi untuk pelaku: peringatan, pemecatan, dan penjara' },
    ],
    correct_answer: 'D',
    explanation: '**Fraud Triangle** (Donald Cressey) dan **peran pengendalian internal**:\n\n| Faktor | Penjelasan | Pengendalian Internal |\n|---|---|---|\n| **Pressure** (Tekanan) | Masalah finansial, target berlebihan | Kompensasi adil, budaya realistis |\n| **Opportunity** (Kesempatan) | Kelemahan kontrol | **Fokus utama**: SoD, otorisasi, monitoring |\n| **Rationalization** (Pembenaran) | "Semua orang begitu" | Budaya etika, CoC, training |\n\nPengendalian internal **terutama** mengurangi **opportunity**:\n\n| Kontrol | Mengurangi kesempatan |\n|---|---|\n| **Segregation of duties** | Satu orang tidak bisa approve + catat + simpan |\n| **Otorisasi berlapis** | Transaksi besar perlu multiple approval |\n| **Rekonsiliasi** | Deteksi perbedaan/anomali |\n| **Audit trail** | Setiap transaksi dapat ditelusuri |\n| **Rotasi jabatan** | Mencegah kolusi jangka panjang |\n| **Physical controls** | Akses terbatas ke aset dan dokumen |\n\nContoh fraud di pertambangan:\n- **Pengadaan**: vendor fiktif, mark-up harga\n- **Produksi**: manipulasi data kadar/tonnase\n- **Penjualan**: underreporting volume\n- **Aset**: pencurian BBM, spare part',
  },
  {
    order_index: 40,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *opini audit* Wajar Tanpa Pengecualian (WTP)?',
    options: [
      { key: 'A', text: 'Auditor menyatakan bahwa perusahaan tidak pernah mengalami kerugian' },
      { key: 'B', text: 'Auditor menyatakan bahwa perusahaan akan selalu mendapat keuntungan di masa depan' },
      { key: 'C', text: 'Auditor menyatakan laporan keuangan disajikan wajar dalam semua hal material sesuai standar akuntansi' },
      { key: 'D', text: 'Auditor menyatakan bahwa tidak ada kecurangan sama sekali dalam perusahaan' },
      { key: 'E', text: 'Auditor menyatakan bahwa perusahaan tidak memiliki utang apapun' },
    ],
    correct_answer: 'C',
    explanation: '**Opini WTP** (*Unqualified Opinion*) = opini **terbaik** yang diberikan auditor.\n\nArtinya: laporan keuangan **disajikan secara wajar** dalam **semua hal yang material** sesuai **standar akuntansi** yang berlaku.\n\nEmpat jenis opini audit:\n\n| Opini | Kondisi | Tingkat |\n|---|---|---|\n| **WTP** (Unqualified) | Laporan keuangan wajar, tidak ada masalah material | **Terbaik** |\n| **WDP** (Qualified) | Wajar kecuali untuk hal tertentu yang dikecualikan | Baik (dengan catatan) |\n| **Tidak Wajar** (Adverse) | Laporan keuangan tidak wajar secara keseluruhan | **Buruk** |\n| **Tidak Memberikan Pendapat** (Disclaimer) | Auditor tidak dapat memberikan opini | Terburuk |\n\nPenting untuk dipahami:\n- WTP **BUKAN** berarti:\n  - Perusahaan untung\n  - Tidak ada kecurangan\n  - Perusahaan sehat finansial\n- WTP **BERARTI**:\n  - Laporan keuangan **mencerminkan kondisi keuangan** secara akurat\n  - Disusun sesuai **PSAK/IFRS**\n  - Tidak ada **salah saji material**\n\nTarget BUMN: seluruh BUMN diharapkan mendapat opini **WTP** dari auditor.',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-finance')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-finance tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal batch 2: ${questions.length}\n`)

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
  console.log(`\n   Total soal di package: ${total}/40`)
}

main()
