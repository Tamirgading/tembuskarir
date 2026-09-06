/**
 * ANTAM IMPACT 2026 — Finance & Accounting (FIN) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Prinsip Akuntansi Keuangan Dasar): 4 soal (2 konsep + 2 hitungan)
 *   T2 (Akuntansi Biaya & Akuntansi Manajemen): 4 soal (2 konsep + 2 hitungan)
 *   T3 (Manajemen Keuangan Korporat): 4 soal (2 konsep + 2 hitungan)
 *   T4 (Dasar Perpajakan Indonesia): 4 soal (3 konsep + 1 hitungan)
 *   T5 (Pengendalian Internal & Dasar Audit): 4 soal (4 konsep)
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-finance-batch1.ts
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
// A: 3,8,13,18 | B: 1,9,14,19 | C: 5,10,16,20 | D: 2,7,12,17 | E: 4,6,11,15

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Prinsip Akuntansi Keuangan Dasar (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Komponen laporan keuangan lengkap menurut PSAK/IFRS terdiri dari lima laporan utama. Manakah yang termasuk di dalamnya?',
    options: [
      { key: 'A', text: 'Laporan Posisi Keuangan, Laporan Stok Gudang, Laporan Distribusi, Laporan Vendor, dan Catatan atas Laporan Keuangan' },
      { key: 'B', text: 'Laporan Posisi Keuangan (Neraca), Laporan Laba Rugi, Laporan Perubahan Ekuitas, Laporan Arus Kas, dan Catatan atas Laporan Keuangan' },
      { key: 'C', text: 'Laporan Produksi, Laporan Penjualan, Laporan Pembelian, Laporan SDM, dan Laporan Audit' },
      { key: 'D', text: 'Laporan Laba Rugi, Laporan Pajak, Laporan RUPS, Laporan CSR, dan Laporan Audit Eksternal' },
      { key: 'E', text: 'Neraca, Laporan Laba Rugi, Laporan Direksi, Laporan Komite Audit, dan Laporan Sustainability' },
    ],
    correct_answer: 'B',
    explanation: 'Lima komponen **laporan keuangan lengkap** menurut **PSAK 1** (setara IAS 1):\n\n| No | Komponen | Fungsi |\n|---|---|---|\n| 1 | **Laporan Posisi Keuangan** (Neraca) | Posisi aset, liabilitas, dan ekuitas pada tanggal tertentu |\n| 2 | **Laporan Laba Rugi** dan Penghasilan Komprehensif Lain | Kinerja keuangan selama periode |\n| 3 | **Laporan Perubahan Ekuitas** | Perubahan modal pemilik selama periode |\n| 4 | **Laporan Arus Kas** | Arus masuk dan keluar kas (operasi, investasi, pendanaan) |\n| 5 | **Catatan atas Laporan Keuangan** (CaLK) | Informasi tambahan dan kebijakan akuntansi |\n\nPrinsip dasar:\n- **Accrual basis**: pendapatan dan beban diakui saat terjadi, bukan saat kas diterima/dibayar\n- **Going concern**: asumsi perusahaan akan terus beroperasi\n- **Materialitas**: informasi yang dapat mempengaruhi keputusan pengguna',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Persamaan dasar akuntansi menyatakan bahwa Aset = Liabilitas + Ekuitas. Jika suatu perusahaan membeli peralatan senilai Rp500 juta dengan pembayaran Rp200 juta tunai dan sisanya secara kredit, bagaimana pengaruhnya terhadap persamaan akuntansi?',
    options: [
      { key: 'A', text: 'Aset bertambah Rp500 juta, liabilitas dan ekuitas tidak berubah' },
      { key: 'B', text: 'Aset bertambah Rp200 juta, liabilitas bertambah Rp300 juta' },
      { key: 'C', text: 'Aset bertambah Rp500 juta, ekuitas berkurang Rp500 juta' },
      { key: 'D', text: 'Peralatan +Rp500 juta, kas -Rp200 juta, utang +Rp300 juta (total aset naik Rp300 juta)' },
      { key: 'E', text: 'Aset bertambah Rp300 juta, liabilitas berkurang Rp200 juta' },
    ],
    correct_answer: 'D',
    explanation: 'Analisis transaksi pembelian peralatan:\n\n**Transaksi**: Beli peralatan Rp500 juta (tunai Rp200 juta + kredit Rp300 juta)\n\n| Akun | Perubahan | Jumlah |\n|---|---|---|\n| **Peralatan** (Aset) | **Bertambah** | +Rp500 juta |\n| **Kas** (Aset) | **Berkurang** | -Rp200 juta |\n| **Utang Usaha** (Liabilitas) | **Bertambah** | +Rp300 juta |\n\nVerifikasi persamaan akuntansi:\n\n$$\\text{Aset} = \\text{Liabilitas} + \\text{Ekuitas}$$\n\n$$\\underbrace{(+500 - 200)}_{\\text{Aset neto +300}} = \\underbrace{+300}_{\\text{Liabilitas}} + \\underbrace{0}_{\\text{Ekuitas}}$$\n\n$$+300 = +300 \\quad \\checkmark$$\n\nJurnal:\n- **Dr** Peralatan Rp500.000.000\n- **Cr** Kas Rp200.000.000\n- **Cr** Utang Usaha Rp300.000.000',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Jika *current ratio* suatu perusahaan tambang adalah 1,8 dan total aset lancar sebesar Rp900 miliar, berapa total liabilitas jangka pendeknya?',
    options: [
      { key: 'A', text: 'Rp500 miliar' },
      { key: 'B', text: 'Rp450 miliar' },
      { key: 'C', text: 'Rp1.620 miliar' },
      { key: 'D', text: 'Rp600 miliar' },
      { key: 'E', text: 'Rp180 miliar' },
    ],
    correct_answer: 'A',
    explanation: '**Current ratio** mengukur kemampuan membayar kewajiban jangka pendek.\n\n$$\\text{Current Ratio} = \\frac{\\text{Aset Lancar}}{\\text{Liabilitas Jangka Pendek}}$$\n\nDiketahui:\n- Current Ratio = 1,8\n- Aset Lancar = Rp900 miliar\n\nMaka:\n\n$$\\begin{aligned}\n1{,}8 &= \\frac{900}{\\text{Liabilitas Jangka Pendek}} \\\\\n\\text{Liabilitas Jangka Pendek} &= \\frac{900}{1{,}8} \\\\\n&= \\textbf{Rp500 miliar}\n\\end{aligned}$$\n\nInterpretasi:\n- Current ratio **1,8** berarti setiap Rp1 kewajiban jangka pendek dijamin oleh Rp1,80 aset lancar\n- Umumnya current ratio **> 1,5** dianggap **sehat**\n- Terlalu tinggi (> 3) bisa mengindikasikan aset lancar yang **kurang produktif**',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan prinsip *accrual basis* dalam akuntansi?',
    options: [
      { key: 'A', text: 'Pendapatan dan beban hanya dicatat ketika kas diterima atau dibayarkan' },
      { key: 'B', text: 'Pendapatan dicatat saat barang dikirim, beban dicatat saat faktur diterima' },
      { key: 'C', text: 'Semua transaksi dicatat pada akhir tahun fiskal secara sekaligus' },
      { key: 'D', text: 'Pencatatan hanya dilakukan untuk transaksi di atas nilai tertentu yang material' },
      { key: 'E', text: 'Pendapatan dan beban diakui saat transaksi terjadi, bukan saat kas diterima atau dibayar' },
    ],
    correct_answer: 'E',
    explanation: '***Accrual basis*** = pendapatan dan beban diakui **saat transaksi terjadi**, bukan saat kas berpindah tangan.\n\nPerbedaan dengan cash basis:\n\n| Aspek | Accrual Basis | Cash Basis |\n|---|---|---|\n| **Pendapatan** | Diakui saat **hak timbul** (barang dikirim/jasa diserahkan) | Diakui saat **kas diterima** |\n| **Beban** | Diakui saat **kewajiban timbul** | Diakui saat **kas dibayar** |\n| **Standar** | **Diwajibkan** PSAK/IFRS | Hanya untuk entitas tertentu |\n| **Akurasi** | Lebih **akurat** menggambarkan kinerja | Kurang akurat untuk periodik |\n\nContoh di pertambangan:\n- ANTAM mengirim 10.000 ton ferronickel pada Desember 2025, pembayaran diterima Januari 2026\n- **Accrual basis**: pendapatan diakui di **Desember 2025** (saat barang dikirim)\n- **Cash basis**: pendapatan diakui di **Januari 2026** (saat kas diterima)\n\nPrinsip terkait:\n- **Matching principle**: beban diakui pada periode yang sama dengan pendapatan yang dihasilkan\n- **Revenue recognition** (PSAK 72/IFRS 15): pendapatan diakui saat kewajiban pelaksanaan terpenuhi',
  },

  // ═══════════════════════════════════════════
  // T2: Akuntansi Biaya & Akuntansi Manajemen (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah smelter memiliki biaya tetap Rp50 miliar per tahun, biaya variabel Rp8 juta per ton produk, dan harga jual Rp18 juta per ton. Berapa *Break-Even Point* (BEP) dalam unit?',
    options: [
      { key: 'A', text: '2.778 ton' },
      { key: 'B', text: '6.250 ton' },
      { key: 'C', text: '5.000 ton' },
      { key: 'D', text: '3.125 ton' },
      { key: 'E', text: '4.000 ton' },
    ],
    correct_answer: 'C',
    explanation: '**BEP (unit)** = titik di mana total pendapatan = total biaya (laba = 0).\n\n$$\\text{BEP (unit)} = \\frac{\\text{Biaya Tetap}}{\\text{Harga Jual per Unit} - \\text{Biaya Variabel per Unit}}$$\n\nDiketahui:\n- Biaya tetap = Rp50.000.000.000\n- Harga jual = Rp18.000.000/ton\n- Biaya variabel = Rp8.000.000/ton\n\n$$\\begin{aligned}\n\\text{Contribution Margin} &= 18.000.000 - 8.000.000 = \\text{Rp10.000.000/ton} \\\\\n\\text{BEP} &= \\frac{50.000.000.000}{10.000.000} \\\\\n&= \\textbf{5.000 ton}\n\\end{aligned}$$\n\nVerifikasi:\n- Pendapatan = 5.000 x Rp18 juta = Rp90 miliar\n- Total biaya = Rp50 miliar + (5.000 x Rp8 juta) = Rp50 miliar + Rp40 miliar = Rp90 miliar\n- Laba = Rp90 miliar - Rp90 miliar = **Rp0** (break even) ✓\n\n*Contribution margin ratio* = 10/18 = 55,6%, artinya setiap Rp1 penjualan menyumbang Rp0,556 untuk menutup biaya tetap.',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa komponen utama dalam perhitungan *Harga Pokok Produksi* (Cost of Goods Manufactured)?',
    options: [
      { key: 'A', text: 'Beban pemasaran, beban administrasi, dan beban bunga pinjaman' },
      { key: 'B', text: 'Biaya riset, biaya paten, dan biaya konsultan' },
      { key: 'C', text: 'Gaji direksi, biaya perjalanan dinas, dan biaya entertaint' },
      { key: 'D', text: 'Biaya asuransi, biaya sewa kantor pusat, dan biaya iklan' },
      { key: 'E', text: 'Biaya bahan baku langsung, biaya tenaga kerja langsung, dan biaya overhead pabrik' },
    ],
    correct_answer: 'E',
    explanation: 'Tiga komponen **Harga Pokok Produksi** (HPP):\n\n| Komponen | Contoh di pertambangan | Sifat |\n|---|---|---|\n| **Bahan Baku Langsung** | Bijih nikel, reagent, bahan kimia | Dapat ditelusuri langsung ke produk |\n| **Tenaga Kerja Langsung** | Upah operator smelter, pekerja tambang | Terlibat langsung dalam produksi |\n| **Biaya Overhead Pabrik** | Listrik pabrik, depresiasi mesin, pemeliharaan | Biaya produksi tidak langsung |\n\nFormula HPP:\n\n$$\\begin{aligned}\n\\text{Total Biaya Produksi} &= \\text{BBB} + \\text{BTKL} + \\text{BOP} \\\\\n\\text{HPP} &= \\text{Persediaan BDP Awal} + \\text{Total Biaya Produksi} - \\text{Persediaan BDP Akhir}\n\\end{aligned}$$\n\nKeterangan:\n- **BBB** = Biaya Bahan Baku\n- **BTKL** = Biaya Tenaga Kerja Langsung\n- **BOP** = Biaya Overhead Pabrik\n- **BDP** = Barang Dalam Proses\n\nBiaya yang **tidak termasuk** HPP:\n- Beban pemasaran dan distribusi\n- Beban administrasi dan umum\n- Beban bunga dan keuangan',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah unit bisnis menganggarkan biaya produksi Rp80 miliar untuk kuartal I, namun realisasinya Rp92 miliar. Berapa *budget variance* dan apa sifatnya?',
    options: [
      { key: 'A', text: 'Rp12 miliar favorable, karena realisasi lebih besar dari anggaran' },
      { key: 'B', text: 'Rp8 miliar unfavorable, karena ada pembulatan' },
      { key: 'C', text: 'Rp92 miliar unfavorable, karena seluruh realisasi dianggap variansi' },
      { key: 'D', text: 'Rp12 miliar unfavorable, karena realisasi biaya melebihi anggaran' },
      { key: 'E', text: 'Rp80 miliar favorable, karena anggaran tetap terkendali' },
    ],
    correct_answer: 'D',
    explanation: '**Budget variance** = selisih antara anggaran dan realisasi.\n\n$$\\text{Variance} = \\text{Realisasi} - \\text{Anggaran} = 92 - 80 = \\textbf{Rp12 miliar}$$\n\nSifat variance untuk **biaya**:\n\n| Kondisi | Sifat | Arti |\n|---|---|---|\n| Realisasi **>** Anggaran | **Unfavorable** (U) | Biaya **melebihi** rencana |\n| Realisasi **<** Anggaran | **Favorable** (F) | Biaya **di bawah** rencana |\n\nKarena realisasi (Rp92 miliar) > anggaran (Rp80 miliar), variance bersifat **unfavorable**.\n\nPersentase variance:\n\n$$\\frac{12}{80} \\times 100\\% = 15\\%$$\n\nVariance 15% termasuk **signifikan** dan perlu investigasi:\n- Apakah ada kenaikan harga bahan baku?\n- Apakah ada inefisiensi operasional?\n- Apakah anggaran sudah realistis?\n\nCatatan: untuk **pendapatan**, logikanya terbalik. Realisasi > anggaran = **favorable**.',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa perbedaan antara *biaya tetap* (fixed cost) dan *biaya variabel* (variable cost)?',
    options: [
      { key: 'A', text: 'Biaya tetap totalnya konstan saat volume produksi berubah, sedangkan biaya variabel berubah proporsional terhadap volume' },
      { key: 'B', text: 'Biaya tetap selalu lebih besar dari biaya variabel dalam semua situasi' },
      { key: 'C', text: 'Biaya tetap hanya ada di perusahaan manufaktur, biaya variabel di perusahaan jasa' },
      { key: 'D', text: 'Biaya tetap dibayar bulanan, biaya variabel dibayar tahunan' },
      { key: 'E', text: 'Biaya tetap untuk bahan baku, biaya variabel untuk gaji karyawan tetap' },
    ],
    correct_answer: 'A',
    explanation: 'Perbedaan **biaya tetap** dan **biaya variabel**:\n\n| Aspek | Biaya Tetap | Biaya Variabel |\n|---|---|---|\n| **Total** | **Konstan** meski volume berubah | **Berubah** proporsional dengan volume |\n| **Per unit** | **Turun** jika volume naik | **Konstan** per unit |\n| **Contoh** | Sewa gedung, depresiasi, gaji manajer | Bahan baku, BBM alat berat, upah borongan |\n\nContoh di pertambangan:\n\n| Biaya | Jenis | Penjelasan |\n|---|---|---|\n| Depresiasi smelter | **Tetap** | Rp10 miliar/tahun, berapapun produksinya |\n| Bijih nikel | **Variabel** | Makin banyak produksi, makin banyak bijih |\n| Gaji GM plant | **Tetap** | Tidak berubah meski produksi naik/turun |\n| Listrik smelter | **Variabel** | Naik seiring volume pengolahan |\n| Asuransi pabrik | **Tetap** | Premi tahunan tidak tergantung volume |\n\nAda juga **biaya semi-variabel** (mixed cost): memiliki komponen tetap dan variabel, misalnya biaya listrik (ada daya terpasang tetap + pemakaian variabel).',
  },

  // ═══════════════════════════════════════════
  // T3: Manajemen Keuangan Korporat (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'medium',
    content: 'Sebuah proyek smelter memerlukan investasi Rp2 triliun dengan arus kas bersih Rp500 miliar per tahun selama 6 tahun. Berapa *Payback Period*-nya?',
    options: [
      { key: 'A', text: '6 tahun' },
      { key: 'B', text: '4 tahun' },
      { key: 'C', text: '3 tahun' },
      { key: 'D', text: '2,5 tahun' },
      { key: 'E', text: '5 tahun' },
    ],
    correct_answer: 'B',
    explanation: '**Payback Period** = waktu yang dibutuhkan untuk mengembalikan investasi awal.\n\n$$\\text{Payback Period} = \\frac{\\text{Investasi Awal}}{\\text{Arus Kas Bersih per Tahun}}$$\n\n$$\\begin{aligned}\n\\text{Payback Period} &= \\frac{\\text{Rp2.000 miliar}}{\\text{Rp500 miliar/tahun}} \\\\\n&= \\textbf{4 tahun}\n\\end{aligned}$$\n\nVerifikasi akumulasi arus kas:\n\n| Tahun | Arus Kas | Akumulasi |\n|---|---|---|\n| 0 | -Rp2.000 miliar | -Rp2.000 miliar |\n| 1 | +Rp500 miliar | -Rp1.500 miliar |\n| 2 | +Rp500 miliar | -Rp1.000 miliar |\n| 3 | +Rp500 miliar | -Rp500 miliar |\n| **4** | +Rp500 miliar | **Rp0** ← BEP |\n| 5 | +Rp500 miliar | +Rp500 miliar |\n| 6 | +Rp500 miliar | +Rp1.000 miliar |\n\nKeterbatasan Payback Period:\n- **Tidak memperhitungkan** nilai waktu uang (*time value of money*)\n- **Mengabaikan** arus kas setelah payback tercapai\n- Solusi: gunakan **Discounted Payback Period** atau **NPV**',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *WACC* (Weighted Average Cost of Capital)?',
    options: [
      { key: 'A', text: 'Total gaji yang dibayarkan perusahaan kepada seluruh karyawan dalam satu tahun' },
      { key: 'B', text: 'Rata-rata biaya produksi per unit produk yang dihasilkan perusahaan' },
      { key: 'C', text: 'Rata-rata tertimbang biaya seluruh sumber pendanaan (utang dan ekuitas) sesuai proporsinya dalam struktur modal' },
      { key: 'D', text: 'Persentase laba bersih yang dibagikan sebagai dividen kepada pemegang saham' },
      { key: 'E', text: 'Biaya administrasi yang dikeluarkan untuk mengelola modal kerja perusahaan' },
    ],
    correct_answer: 'C',
    explanation: '**WACC** = rata-rata tertimbang biaya modal dari seluruh sumber pendanaan.\n\n$$\\text{WACC} = \\left(\\frac{E}{V} \\times r_e\\right) + \\left(\\frac{D}{V} \\times r_d \\times (1 - t)\\right)$$\n\nKeterangan:\n\n| Simbol | Arti |\n|---|---|\n| $E$ | Nilai ekuitas |\n| $D$ | Nilai utang |\n| $V$ | Total modal ($E + D$) |\n| $r_e$ | Biaya ekuitas (cost of equity) |\n| $r_d$ | Biaya utang (cost of debt) |\n| $t$ | Tarif pajak |\n\nContoh perhitungan:\n- Ekuitas: 60% dari total modal, cost of equity = 15%\n- Utang: 40% dari total modal, cost of debt = 8%, pajak = 22%\n\n$$\\text{WACC} = (0{,}6 \\times 15\\%) + (0{,}4 \\times 8\\% \\times (1 - 0{,}22)) = 9\\% + 2{,}496\\% = 11{,}5\\%$$\n\nFungsi WACC:\n- **Discount rate** untuk NPV proyek\n- **Hurdle rate**: proyek harus menghasilkan return di atas WACC\n- **Valuasi perusahaan**: DCF menggunakan WACC sebagai discount rate',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Net Present Value* (NPV) dan bagaimana penggunaannya dalam keputusan investasi?',
    options: [
      { key: 'A', text: 'Total pendapatan perusahaan dikurangi total biaya dalam satu tahun fiskal' },
      { key: 'B', text: 'Nilai buku aset perusahaan setelah dikurangi akumulasi depresiasi' },
      { key: 'C', text: 'Jumlah dividen yang dibagikan kepada pemegang saham per lembar saham' },
      { key: 'D', text: 'Selisih antara harga jual dan harga beli saham perusahaan di bursa efek' },
      { key: 'E', text: 'Selisih nilai sekarang arus kas masuk dan keluar proyek; NPV positif berarti proyek layak' },
    ],
    correct_answer: 'E',
    explanation: '**NPV** = selisih antara **present value arus kas masuk** dan **present value arus kas keluar**.\n\n$$\\text{NPV} = \\sum_{t=0}^{n} \\frac{CF_t}{(1 + r)^t}$$\n\nKeterangan:\n- $CF_t$ = arus kas pada periode $t$\n- $r$ = discount rate (biasanya WACC)\n- $n$ = umur proyek\n\nAturan keputusan:\n\n| NPV | Keputusan |\n|---|---|\n| **NPV > 0** | Proyek **layak** (menciptakan nilai) |\n| **NPV = 0** | Proyek **impas** |\n| **NPV < 0** | Proyek **tidak layak** (menghancurkan nilai) |\n\nKeunggulan NPV:\n- Memperhitungkan **nilai waktu uang**\n- Menggunakan **seluruh arus kas** sepanjang umur proyek\n- Hasilnya dalam **satuan uang** (mudah dipahami)\n- Dianggap metode **terbaik** untuk evaluasi investasi\n\nContoh: proyek smelter dengan investasi Rp5 triliun menghasilkan NPV = Rp1,2 triliun → proyek **layak** karena menciptakan nilai tambah Rp1,2 triliun.',
  },
  {
    order_index: 12,
    category: 'T3',
    difficulty: 'medium',
    content: 'Jika tingkat bunga 10% per tahun, berapa *present value* dari Rp1.210.000 yang akan diterima 2 tahun lagi?',
    options: [
      { key: 'A', text: 'Rp1.100.000' },
      { key: 'B', text: 'Rp1.089.000' },
      { key: 'C', text: 'Rp1.210.000' },
      { key: 'D', text: 'Rp1.000.000' },
      { key: 'E', text: 'Rp900.000' },
    ],
    correct_answer: 'D',
    explanation: '**Present Value** (PV) = nilai saat ini dari uang yang akan diterima di masa depan.\n\n$$PV = \\frac{FV}{(1 + r)^n}$$\n\nDiketahui:\n- Future Value (FV) = Rp1.210.000\n- Tingkat bunga (r) = 10% = 0,10\n- Periode (n) = 2 tahun\n\n$$\\begin{aligned}\nPV &= \\frac{1.210.000}{(1 + 0{,}10)^2} \\\\\n&= \\frac{1.210.000}{(1{,}10)^2} \\\\\n&= \\frac{1.210.000}{1{,}21} \\\\\n&= \\textbf{Rp1.000.000}\n\\end{aligned}$$\n\nArtinya: Rp1.000.000 yang diinvestasikan hari ini dengan bunga 10% per tahun akan menjadi:\n- Tahun 1: Rp1.000.000 x 1,10 = Rp1.100.000\n- Tahun 2: Rp1.100.000 x 1,10 = Rp1.210.000 ✓\n\nKonsep *time value of money*: **uang hari ini lebih berharga** dari uang yang sama di masa depan karena bisa diinvestasikan untuk menghasilkan return.',
  },

  // ═══════════════════════════════════════════
  // T4: Dasar Perpajakan Indonesia (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T4',
    difficulty: 'easy',
    content: 'Berapa tarif Pajak Penghasilan (PPh) Badan menurut UU Harmonisasi Peraturan Perpajakan (UU HPP)?',
    options: [
      { key: 'A', text: '22% dari penghasilan kena pajak' },
      { key: 'B', text: '25% dari penghasilan kena pajak' },
      { key: 'C', text: '30% dari penghasilan kena pajak' },
      { key: 'D', text: '15% dari penghasilan kena pajak' },
      { key: 'E', text: '10% dari penghasilan kena pajak' },
    ],
    correct_answer: 'A',
    explanation: 'Tarif **PPh Badan** menurut **UU HPP** (UU No. 7/2021):\n\n| Kategori | Tarif |\n|---|---|\n| **Umum** | **22%** dari Penghasilan Kena Pajak |\n| **PT Tbk** (syarat tertentu) | **19%** (diskon 3% jika min. 40% saham diperdagangkan di BEI) |\n| **UMKM** (omzet < Rp4,8 miliar) | **0,5%** dari peredaran bruto (final) |\n\nPerjalanan tarif PPh Badan:\n\n| Periode | Tarif |\n|---|---|\n| Sebelum 2009 | 10-30% (progresif) |\n| 2009 | 28% |\n| 2010-2019 | 25% |\n| 2020-2021 | 22% (penurunan bertahap) |\n| 2022+ (UU HPP) | **22%** (tetap) |\n\nContoh perhitungan:\n- Penghasilan kena pajak ANTAM: Rp5 triliun\n- PPh Badan = 22% x Rp5 triliun = **Rp1,1 triliun**\n\nCatatan: ANTAM sebagai PT Tbk bisa mendapat tarif 19% jika memenuhi syarat kepemilikan publik.',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan PPh Pasal 21 dan siapa saja yang menjadi subjek pajaknya?',
    options: [
      { key: 'A', text: 'Pajak atas penghasilan dari penjualan tanah dan bangunan' },
      { key: 'B', text: 'Pajak atas gaji, upah, dan pembayaran lain yang diterima orang pribadi dari pekerjaan atau jasa' },
      { key: 'C', text: 'Pajak atas penghasilan dari dividen yang diterima badan usaha' },
      { key: 'D', text: 'Pajak atas penghasilan dari bunga deposito dan tabungan' },
      { key: 'E', text: 'Pajak atas penghasilan dari hadiah undian' },
    ],
    correct_answer: 'B',
    explanation: '**PPh Pasal 21** = pajak atas penghasilan yang diterima **orang pribadi** sehubungan dengan **pekerjaan, jasa, atau kegiatan**.\n\nSubjek pajak PPh 21:\n\n| Kategori | Contoh |\n|---|---|\n| **Pegawai tetap** | Karyawan ANTAM yang menerima gaji bulanan |\n| **Pegawai tidak tetap** | Pekerja harian, borongan |\n| **Bukan pegawai** | Konsultan, tenaga ahli |\n| **Peserta kegiatan** | Peserta seminar, penerima penghargaan |\n| **Pensiunan** | Mantan karyawan yang menerima pensiun |\n\nTarif PPh 21 (UU HPP) - progresif:\n\n| Penghasilan Kena Pajak | Tarif |\n|---|---|\n| s.d. Rp60 juta | 5% |\n| > Rp60 juta s.d. Rp250 juta | 15% |\n| > Rp250 juta s.d. Rp500 juta | 25% |\n| > Rp500 juta s.d. Rp5 miliar | 30% |\n| > Rp5 miliar | 35% |\n\nMetode pemotongan (mulai 2024):\n- **TER** (Tarif Efektif Rata-rata): pemotongan bulanan menggunakan tarif efektif\n- **Tarif Pasal 17**: digunakan pada bulan Desember untuk perhitungan akhir tahun',
  },
  {
    order_index: 15,
    category: 'T4',
    difficulty: 'medium',
    content: 'Jika perusahaan membeli jasa konsultan dari firma hukum sebesar Rp200 juta (belum termasuk PPN), berapa PPh Pasal 23 yang harus dipotong dan berapa total yang dibayarkan ke firma hukum?',
    options: [
      { key: 'A', text: 'PPh 23 = Rp20 juta (10%), dibayarkan Rp180 juta + PPN' },
      { key: 'B', text: 'PPh 23 = Rp30 juta (15%), dibayarkan Rp170 juta + PPN' },
      { key: 'C', text: 'PPh 23 = Rp10 juta (5%), dibayarkan Rp190 juta + PPN' },
      { key: 'D', text: 'PPh 23 = Rp40 juta (20%), dibayarkan Rp160 juta + PPN' },
      { key: 'E', text: 'PPh 23 = Rp4 juta (2%), dibayarkan Rp196 juta + PPN' },
    ],
    correct_answer: 'E',
    explanation: '**PPh Pasal 23** untuk jasa konsultan/firma hukum:\n\nTarif PPh 23 untuk **jasa**: **2%** dari jumlah bruto (jika penerima memiliki NPWP).\n\n$$\\begin{aligned}\n\\text{PPh 23} &= 2\\% \\times \\text{Rp200.000.000} \\\\\n&= \\textbf{Rp4.000.000}\n\\end{aligned}$$\n\nTotal pembayaran:\n\n| Komponen | Jumlah |\n|---|---|\n| Fee jasa | Rp200.000.000 |\n| PPN 11% | +Rp22.000.000 |\n| PPh 23 (2%) | -Rp4.000.000 |\n| **Total dibayar ke firma hukum** | **Rp218.000.000** |\n\nCatatan:\n- PPh 23 dipotong oleh **pembayar** (perusahaan) dan disetorkan ke negara\n- Firma hukum menerima **bukti potong** PPh 23 sebagai kredit pajak\n- Jika penerima **tidak ber-NPWP**, tarif naik 100% menjadi **4%**\n\nTarif PPh 23 lainnya:\n| Objek | Tarif |\n|---|---|\n| Dividen, bunga, royalti | 15% |\n| Sewa (selain tanah/bangunan) | 2% |\n| Jasa teknik, konsultan, dll. | 2% |',
  },
  {
    order_index: 16,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan Pajak Pertambahan Nilai (PPN) dan berapa tarifnya saat ini?',
    options: [
      { key: 'A', text: 'Pajak atas keuntungan bersih perusahaan, tarif 22%' },
      { key: 'B', text: 'Pajak atas gaji karyawan, tarif progresif 5%-35%' },
      { key: 'C', text: 'Pajak tidak langsung atas penyerahan Barang/Jasa Kena Pajak, tarif umum 12%' },
      { key: 'D', text: 'Pajak atas kepemilikan tanah dan bangunan, tarif 0,5%' },
      { key: 'E', text: 'Pajak atas impor barang mewah, tarif 20%-75%' },
    ],
    correct_answer: 'C',
    explanation: '**PPN** = **pajak tidak langsung** atas penyerahan **Barang Kena Pajak** (BKP) dan/atau **Jasa Kena Pajak** (JKP).\n\nTarif PPN:\n\n| Periode | Tarif |\n|---|---|\n| 2010-2021 | 10% |\n| April 2022-2024 | 11% |\n| **Januari 2025+** | **12%** |\n\nMekanisme PPN:\n\n| Istilah | Penjelasan |\n|---|---|\n| **PPN Keluaran** | PPN yang dipungut saat menjual BKP/JKP |\n| **PPN Masukan** | PPN yang dibayar saat membeli BKP/JKP |\n| **Kurang bayar** | PPN Keluaran > PPN Masukan → setor ke negara |\n| **Lebih bayar** | PPN Masukan > PPN Keluaran → restitusi/kompensasi |\n\nContoh di pertambangan:\n- ANTAM menjual ferronickel Rp100 miliar\n- PPN Keluaran = 12% x Rp100 miliar = Rp12 miliar\n- PPN Masukan (dari pembelian bahan, jasa, dll.) = Rp8 miliar\n- PPN yang disetor = Rp12 miliar - Rp8 miliar = Rp4 miliar\n\nBarang/jasa **tidak kena** PPN: barang kebutuhan pokok, jasa pendidikan, jasa kesehatan, jasa keuangan.',
  },

  // ═══════════════════════════════════════════
  // T5: Pengendalian Internal & Dasar Audit (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa lima komponen pengendalian internal menurut kerangka *COSO Internal Control - Integrated Framework*?',
    options: [
      { key: 'A', text: 'Planning, Organizing, Actuating, Controlling, Evaluating' },
      { key: 'B', text: 'Input, Process, Output, Feedback, Environment' },
      { key: 'C', text: 'Vision, Mission, Strategy, Tactic, Operation' },
      { key: 'D', text: 'Control Environment, Risk Assessment, Control Activities, Info & Comm, Monitoring' },
      { key: 'E', text: 'Governance, Risk, Compliance, Ethics, Sustainability' },
    ],
    correct_answer: 'D',
    explanation: 'Lima komponen **COSO Internal Control** (*Committee of Sponsoring Organizations*):\n\n| Komponen | Penjelasan | Contoh |\n|---|---|---|\n| **Control Environment** | Fondasi budaya pengendalian | Tone at the top, integritas, kompetensi |\n| **Risk Assessment** | Identifikasi dan analisis risiko | Risk register, risk appetite |\n| **Control Activities** | Kebijakan dan prosedur pengendalian | Otorisasi, rekonsiliasi, pemisahan tugas |\n| **Information & Communication** | Aliran informasi yang tepat waktu | Laporan keuangan, sistem informasi |\n| **Monitoring Activities** | Evaluasi berkelanjutan | Audit internal, self-assessment |\n\nPrinsip-prinsip (17 prinsip):\n- Control Environment: 5 prinsip (komitmen integritas, independensi oversight, dsb.)\n- Risk Assessment: 4 prinsip (tujuan jelas, identifikasi risiko, dsb.)\n- Control Activities: 3 prinsip (aktivitas pengendalian, IT general controls, dsb.)\n- Information & Communication: 3 prinsip (informasi berkualitas, komunikasi internal/eksternal)\n- Monitoring: 2 prinsip (evaluasi berkelanjutan, komunikasi defisiensi)\n\nPenerapan di BUMN: wajib menerapkan **Sistem Pengendalian Intern** (SPI) berdasarkan kerangka COSO.',
  },
  {
    order_index: 18,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *segregation of duties* (pemisahan tugas) dalam pengendalian internal?',
    options: [
      { key: 'A', text: 'Fungsi otorisasi, pencatatan, dan penyimpanan aset harus dilakukan oleh orang atau unit berbeda' },
      { key: 'B', text: 'Pembagian shift kerja karyawan menjadi 3 shift (pagi, siang, malam)' },
      { key: 'C', text: 'Pemisahan kantor pusat dan kantor cabang ke lokasi yang berbeda' },
      { key: 'D', text: 'Pembagian tugas antara karyawan tetap dan karyawan kontrak' },
      { key: 'E', text: 'Pemisahan antara departemen produksi dan departemen pemasaran' },
    ],
    correct_answer: 'A',
    explanation: '***Segregation of duties*** (SoD) = **pemisahan fungsi** untuk mencegah kecurangan dan kesalahan.\n\nTiga fungsi yang harus dipisahkan:\n\n| Fungsi | Penjelasan | Contoh |\n|---|---|---|\n| **Otorisasi** | Menyetujui transaksi | Manager menyetujui PO |\n| **Pencatatan** | Mencatat transaksi di pembukuan | Akuntan mencatat di jurnal |\n| **Penyimpanan** | Menyimpan aset fisik | Gudang menyimpan spare part |\n\nContoh penerapan di pertambangan:\n\n| Proses | Otorisasi | Pencatatan | Penyimpanan |\n|---|---|---|---|\n| **Pengadaan** | Manager Procurement | Akuntansi | Gudang |\n| **Kas** | Finance Manager | Kasir/Akuntan | Teller/Bank |\n| **Produksi** | Plant Manager | Admin Produksi | Operator |\n\nJika **satu orang** menguasai ketiga fungsi:\n- Bisa menyetujui pembelian fiktif\n- Mencatatnya di pembukuan\n- Menyembunyikan bukti fisik\n- **Kecurangan tidak terdeteksi**\n\nUntuk perusahaan kecil yang tidak bisa memisahkan sepenuhnya: gunakan **compensating controls** (review oleh atasan, audit berkala, rotasi tugas).',
  },
  {
    order_index: 19,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *bukti audit* dan apa saja jenisnya?',
    options: [
      { key: 'A', text: 'Surat keterangan dari kepolisian yang membuktikan tidak ada catatan kriminal di perusahaan' },
      { key: 'B', text: 'Informasi yang digunakan auditor sebagai dasar opini audit, meliputi bukti fisik, dokumenter, konfirmasi, dan analitis' },
      { key: 'C', text: 'Ijazah dan sertifikasi yang dimiliki oleh auditor internal perusahaan' },
      { key: 'D', text: 'Laporan tahunan yang dipublikasikan di website perusahaan' },
      { key: 'E', text: 'Catatan kehadiran karyawan selama satu tahun fiskal' },
    ],
    correct_answer: 'B',
    explanation: '**Bukti audit** = **informasi yang digunakan auditor** untuk menarik kesimpulan yang menjadi **dasar opini audit**.\n\nJenis bukti audit:\n\n| Jenis | Penjelasan | Contoh |\n|---|---|---|\n| **Fisik** | Pemeriksaan langsung aset | Inspeksi persediaan, observasi kas |\n| **Dokumenter** | Dokumen internal/eksternal | Faktur, kontrak, rekening koran |\n| **Konfirmasi** | Verifikasi dari pihak ketiga | Konfirmasi saldo bank, piutang |\n| **Analitis** | Perbandingan dan analisis data | Trend analysis, ratio analysis |\n| **Kesaksian** | Keterangan dari pihak terkait | Wawancara, representasi manajemen |\n| **Kalkulasi ulang** | Penghitungan kembali | Cek matematika, rekalkulasi depresiasi |\n\nKualitas bukti audit:\n- **Cukup** (sufficient): kuantitas bukti memadai\n- **Tepat** (appropriate): bukti relevan dan andal\n\nHierarki keandalan:\n1. Bukti dari **pihak eksternal** > internal\n2. Bukti **langsung** (fisik, konfirmasi) > tidak langsung\n3. Bukti **tertulis** > lisan\n4. Bukti **asli** > salinan',
  },
  {
    order_index: 20,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *audit internal* dan *audit eksternal*?',
    options: [
      { key: 'A', text: 'Audit internal oleh karyawan menilai pengendalian internal, audit eksternal oleh auditor independen memberikan opini' },
      { key: 'B', text: 'Audit internal fokus pada pajak, audit eksternal fokus pada pemasaran' },
      { key: 'C', text: 'Audit internal dilakukan setiap hari, audit eksternal setiap 5 tahun sekali' },
      { key: 'D', text: 'Audit internal hanya untuk BUMN, audit eksternal hanya untuk perusahaan swasta' },
      { key: 'E', text: 'Tidak ada perbedaan, keduanya identik dan saling menggantikan' },
    ],
    correct_answer: 'A',
    explanation: 'Perbedaan **audit internal** dan **audit eksternal**:\n\n| Aspek | Audit Internal | Audit Eksternal |\n|---|---|---|\n| **Pelaksana** | Karyawan perusahaan (SPI) | Kantor Akuntan Publik (KAP) independen |\n| **Tujuan** | Menilai efektivitas pengendalian internal, kepatuhan, efisiensi | Memberikan **opini** atas kewajaran laporan keuangan |\n| **Independensi** | Independen dari unit yang diaudit | Independen dari perusahaan |\n| **Standar** | IIA Standards (IPPF) | Standar Audit (SA/ISA) |\n| **Laporan** | Ke manajemen/Komite Audit | Ke **publik** (pemegang saham, regulator) |\n| **Frekuensi** | **Sepanjang tahun** (continuous) | **Tahunan** (atas laporan keuangan) |\n| **Ruang lingkup** | Operasional, keuangan, kepatuhan, IT | Terutama **laporan keuangan** |\n\nJenis opini audit eksternal:\n1. **Wajar Tanpa Pengecualian** (WTP / Unqualified) — terbaik\n2. **Wajar Dengan Pengecualian** (WDP / Qualified)\n3. **Tidak Wajar** (Adverse)\n4. **Tidak Memberikan Pendapat** (Disclaimer)\n\nBUMN seperti ANTAM wajib diaudit oleh KAP dan juga oleh **BPK** (Badan Pemeriksa Keuangan).',
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
