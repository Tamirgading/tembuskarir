/**
 * ANTAM IMPACT 2026 — Legal & Compliance (LGL) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Hukum Perusahaan & Bisnis Dasar): 4 soal
 *   T2 (Regulasi Pertambangan & Lingkungan): 4 soal
 *   T3 (Tata Kelola Perusahaan / GCG): 4 soal
 *   T4 (Kepatuhan & Anti-Korupsi): 4 soal
 *   T5 (Manajemen Risiko Hukum & Kebijakan Publik): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-legal-batch1.ts
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
// A: 4,7,14,17 | B: 2,10,13,20 | C: 1,8,15,18 | D: 5,9,11,16 | E: 3,6,12,19

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Hukum Perusahaan & Bisnis Dasar (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa organ utama Perseroan Terbatas (PT) menurut UU No. 40/2007 tentang Perseroan Terbatas?',
    options: [
      { key: 'A', text: 'Direktur Utama, Manajer, dan Supervisor' },
      { key: 'B', text: 'Presiden, Wakil Presiden, dan Menteri' },
      { key: 'C', text: 'Rapat Umum Pemegang Saham (RUPS), Direksi, dan Dewan Komisaris' },
      { key: 'D', text: 'Auditor Internal, Auditor Eksternal, dan Komite Audit' },
      { key: 'E', text: 'Serikat Pekerja, Manajemen, dan Pemerintah' },
    ],
    correct_answer: 'C',
    explanation: 'Tiga **organ utama** PT menurut **UU No. 40/2007**:\n\n| Organ | Fungsi | Kewenangan |\n|---|---|---|\n| **RUPS** | Forum pengambilan keputusan tertinggi | Menyetujui laporan keuangan, mengangkat/memberhentikan direksi dan komisaris, perubahan anggaran dasar |\n| **Direksi** | Menjalankan pengurusan PT | Mewakili PT di dalam dan di luar pengadilan, mengelola operasional sehari-hari |\n| **Dewan Komisaris** | Mengawasi kebijakan direksi | Memberikan nasihat, menyetujui tindakan tertentu yang memerlukan persetujuan |\n\nPrinsip utama:\n- **RUPS** adalah organ **tertinggi** dalam PT\n- **Direksi** bertanggung jawab penuh atas **pengurusan** PT\n- **Komisaris** melakukan **pengawasan** atas kebijakan direksi\n- Masing-masing organ memiliki tugas dan wewenang yang **terpisah** dan tidak boleh saling mencampuri',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *wanprestasi* dan *perbuatan melawan hukum* (PMH) dalam hukum perdata Indonesia?',
    options: [
      { key: 'A', text: 'Keduanya identik dan dapat digunakan secara bergantian' },
      { key: 'B', text: 'Wanprestasi adalah pelanggaran kewajiban kontraktual, PMH adalah pelanggaran hukum tanpa hubungan kontrak' },
      { key: 'C', text: 'Wanprestasi hanya berlaku dalam hukum pidana, PMH dalam hukum perdata' },
      { key: 'D', text: 'Wanprestasi untuk perusahaan besar, PMH untuk perusahaan kecil' },
      { key: 'E', text: 'Wanprestasi diselesaikan di pengadilan agama, PMH di pengadilan negeri' },
    ],
    correct_answer: 'B',
    explanation: 'Perbedaan **wanprestasi** dan **PMH** (*Perbuatan Melawan Hukum*):\n\n| Aspek | Wanprestasi (Ps. 1243 KUHPer) | PMH (Ps. 1365 KUHPer) |\n|---|---|---|\n| **Dasar** | **Hubungan kontraktual** | **Tanpa kontrak** |\n| **Pelanggaran** | Tidak memenuhi kewajiban dalam kontrak | Melanggar hukum, hak orang lain, kesusilaan, atau kepatutan |\n| **Somasi** | **Wajib** sebelum gugat | **Tidak perlu** |\n| **Ganti rugi** | Sesuai kontrak atau pasal 1246-1248 KUHPer | Kerugian nyata yang diderita |\n\nContoh di pertambangan:\n- **Wanprestasi**: kontraktor tidak menyelesaikan pembangunan jetty sesuai kontrak\n- **PMH**: pencemaran lingkungan oleh perusahaan tambang yang merugikan masyarakat sekitar (tidak ada kontrak dengan masyarakat)\n\nUnsur PMH:\n1. Ada **perbuatan** melawan hukum\n2. Ada **kesalahan** (sengaja atau lalai)\n3. Ada **kerugian**\n4. Ada **hubungan kausalitas** antara perbuatan dan kerugian',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Hak Kekayaan Intelektual* (HKI) yang relevan bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Hak untuk menambang mineral di seluruh wilayah Indonesia tanpa batasan' },
      { key: 'B', text: 'Hak untuk merekrut karyawan dari perusahaan pesaing tanpa batasan' },
      { key: 'C', text: 'Hak untuk mengekspor komoditas tanpa membayar royalti kepada negara' },
      { key: 'D', text: 'Hak untuk menolak inspeksi pemerintah terhadap operasi tambang' },
      { key: 'E', text: 'Hak eksklusif atas kreasi intelektual seperti paten teknologi pengolahan, merek dagang, dan rahasia dagang' },
    ],
    correct_answer: 'E',
    explanation: '**HKI** (*Hak Kekayaan Intelektual*) yang relevan di tambang:\n\n| Jenis HKI | Contoh di pertambangan | Perlindungan |\n|---|---|---|\n| **Paten** | Teknologi HPAL, proses smelting baru | 20 tahun |\n| **Merek** | ANTAM, Logam Mulia, UBS Gold | 10 tahun (bisa diperpanjang) |\n| **Rahasia dagang** | Resep reagent, parameter proses | Selama dijaga kerahasiaannya |\n| **Hak cipta** | Software mine planning internal, laporan riset | 70 tahun setelah pencipta meninggal |\n| **Desain industri** | Desain produk emas batangan | 10 tahun |\n\nMengapa HKI penting:\n- **Perlindungan inovasi**: teknologi pengolahan mineral adalah aset berharga\n- **Keunggulan kompetitif**: paten mencegah pesaing meniru\n- **Lisensi dan royalti**: potensi pendapatan tambahan\n- **Valuasi perusahaan**: HKI meningkatkan nilai perusahaan\n- **Joint venture**: HKI sering menjadi kontribusi non-tunai dalam JV',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan prinsip *separate legal entity* dalam hukum Perseroan Terbatas?',
    options: [
      { key: 'A', text: 'PT adalah subjek hukum tersendiri yang terpisah dari pemegang saham, direksi, dan komisarisnya' },
      { key: 'B', text: 'PT harus memisahkan divisi hukum dari divisi operasional' },
      { key: 'C', text: 'PT wajib memiliki kantor terpisah untuk setiap anak perusahaan' },
      { key: 'D', text: 'Pemegang saham bertanggung jawab secara pribadi atas seluruh utang PT' },
      { key: 'E', text: 'PT hanya boleh beroperasi di satu wilayah hukum tertentu' },
    ],
    correct_answer: 'A',
    explanation: '***Separate legal entity*** = PT adalah **subjek hukum tersendiri** yang terpisah dari pemegang saham, direksi, dan komisaris.\n\nKonsekuensi hukum:\n\n| Aspek | Implikasi |\n|---|---|\n| **Harta** | PT memiliki harta sendiri, terpisah dari pemilik |\n| **Utang** | Utang PT bukan utang pribadi pemegang saham |\n| **Kontrak** | PT bertindak atas nama sendiri |\n| **Gugatan** | PT dapat menggugat dan digugat atas namanya |\n| **Tanggung jawab** | Pemegang saham hanya bertanggung jawab sebatas saham yang dimiliki (*limited liability*) |\n\nPengecualian (*piercing the corporate veil*):\n- Pemegang saham bertanggung jawab pribadi jika:\n  - Persyaratan PT sebagai badan hukum **belum terpenuhi**\n  - Pemegang saham **itikad buruk** memanfaatkan PT\n  - Pemegang saham terlibat **perbuatan melawan hukum** menggunakan PT\n  - Harta PT digunakan untuk **kepentingan pribadi**\n\nDasar hukum: Pasal 3 UU No. 40/2007 tentang Perseroan Terbatas.',
  },

  // ═══════════════════════════════════════════
  // T2: Regulasi Pertambangan & Lingkungan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa perbedaan antara IUP (*Izin Usaha Pertambangan*) dan IUPK (*Izin Usaha Pertambangan Khusus*) menurut UU Minerba?',
    options: [
      { key: 'A', text: 'IUP untuk mineral logam, IUPK untuk mineral non-logam' },
      { key: 'B', text: 'IUP untuk perusahaan swasta, IUPK untuk BUMN saja' },
      { key: 'C', text: 'IUP untuk wilayah kecil, IUPK hanya untuk tambang emas' },
      { key: 'D', text: 'IUP diberikan pada WIUP, IUPK pada WPN untuk kepentingan strategis nasional' },
      { key: 'E', text: 'IUP bersifat permanen, IUPK bersifat sementara' },
    ],
    correct_answer: 'D',
    explanation: 'Perbedaan **IUP** dan **IUPK** menurut UU No. 3/2020 (Minerba):\n\n| Aspek | IUP | IUPK |\n|---|---|---|\n| **Wilayah** | **WIUP** (Wilayah Izin Usaha Pertambangan) | **WPN** (Wilayah Pencadangan Negara) |\n| **Pemberi izin** | Pemerintah pusat | Pemerintah pusat |\n| **Tujuan** | Umum | **Kepentingan strategis nasional** |\n| **Prioritas** | BUMN/BUMD → swasta | BUMN |\n| **Tahapan** | IUP Eksplorasi → IUP Operasi Produksi | IUPK Eksplorasi → IUPK Operasi Produksi |\n\nJenis IUP berdasarkan tahapan:\n1. **IUP Eksplorasi**: penyelidikan umum, eksplorasi, studi kelayakan\n2. **IUP Operasi Produksi**: konstruksi, penambangan, pengolahan, penjualan\n\nPerubahan penting via UU No. 3/2020:\n- Kewenangan perizinan **terpusat** di pemerintah pusat\n- Luas wilayah dan jangka waktu diatur lebih rinci\n- Kewajiban **hilirisasi** diperkuat\n- Sanksi lebih tegas untuk pelanggaran',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan AMDAL dan kapan dokumen ini wajib disusun?',
    options: [
      { key: 'A', text: 'Analisis biaya produksi yang wajib diserahkan ke Kementerian Keuangan setiap tahun' },
      { key: 'B', text: 'Laporan keuangan yang diaudit oleh akuntan publik dan dilaporkan ke BEI' },
      { key: 'C', text: 'Rencana pemasaran produk yang harus disetujui oleh Kementerian Perdagangan' },
      { key: 'D', text: 'Sertifikasi keselamatan peralatan yang dikeluarkan oleh Kementerian Perindustrian' },
      { key: 'E', text: 'Analisis Mengenai Dampak Lingkungan, wajib untuk kegiatan yang berpotensi menimbulkan dampak besar' },
    ],
    correct_answer: 'E',
    explanation: '**AMDAL** (*Analisis Mengenai Dampak Lingkungan*) = **kajian dampak penting** suatu kegiatan terhadap lingkungan hidup.\n\nDasar hukum: **UU No. 32/2009** tentang Perlindungan dan Pengelolaan Lingkungan Hidup jo. PP No. 22/2021.\n\nDokumen AMDAL terdiri dari:\n1. **KA-ANDAL** (Kerangka Acuan ANDAL): ruang lingkup kajian\n2. **ANDAL** (Analisis Dampak Lingkungan): prakiraan dampak\n3. **RKL-RPL**: Rencana Pengelolaan Lingkungan - Rencana Pemantauan Lingkungan\n\nWajib untuk kegiatan yang **berpotensi dampak besar dan penting**:\n- Pertambangan mineral dan batubara\n- Pembangunan smelter\n- Pembangunan infrastruktur besar (pelabuhan, jalan)\n\nAlternatif untuk kegiatan berdampak kecil:\n- **UKL-UPL** (Upaya Pengelolaan Lingkungan - Upaya Pemantauan Lingkungan)\n- **SPPL** (Surat Pernyataan Pengelolaan Lingkungan)\n\nProses: penyusunan oleh konsultan → review oleh tim teknis → penilaian oleh Komisi AMDAL → persetujuan lingkungan.',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa kewajiban pasca-tambang (*mine closure*) yang diatur dalam regulasi pertambangan Indonesia?',
    options: [
      { key: 'A', text: 'Perusahaan wajib melakukan reklamasi dan pascatambang termasuk rehabilitasi lahan dan pemulihan fungsi lingkungan' },
      { key: 'B', text: 'Perusahaan boleh meninggalkan lokasi tambang tanpa kewajiban apapun' },
      { key: 'C', text: 'Kewajiban pascatambang hanya berlaku untuk tambang batubara, bukan mineral' },
      { key: 'D', text: 'Pemerintah yang bertanggung jawab penuh atas seluruh biaya reklamasi' },
      { key: 'E', text: 'Reklamasi hanya wajib jika masyarakat sekitar mengajukan keberatan' },
    ],
    correct_answer: 'A',
    explanation: 'Kewajiban **pascatambang** menurut UU Minerba dan PP No. 78/2010:\n\n| Kewajiban | Detail |\n|---|---|\n| **Reklamasi** | Pemulihan lahan bekas tambang selama operasi (progresif) |\n| **Pascatambang** | Rehabilitasi lingkungan setelah operasi berakhir |\n| **Jaminan reklamasi** | Dana jaminan yang ditempatkan di bank pemerintah |\n| **Jaminan pascatambang** | Dana untuk kegiatan pascatambang |\n| **Rencana** | Harus disusun sebelum operasi dimulai |\n\nLingkup kegiatan pascatambang:\n1. **Rehabilitasi lahan**: penimbunan, penataan bentuk lahan\n2. **Revegetasi**: penanaman kembali vegetasi lokal\n3. **Pengelolaan air**: pencegahan air asam tambang (AAT)\n4. **Stabilitas geoteknik**: pengamanan lereng, pencegahan longsor\n5. **Monitoring**: pemantauan pasca-penutupan (minimal 3-5 tahun)\n\nSanksi jika tidak melakukan:\n- Pencairan **jaminan reklamasi** oleh pemerintah\n- **Pencabutan izin** usaha pertambangan\n- Sanksi **pidana** dan **administratif**',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Domestic Market Obligation* (DMO) dalam konteks pertambangan?',
    options: [
      { key: 'A', text: 'Kewajiban perusahaan tambang untuk mempekerjakan tenaga kerja lokal minimal 80%' },
      { key: 'B', text: 'Kewajiban perusahaan tambang untuk membayar pajak daerah setiap bulan' },
      { key: 'C', text: 'Kewajiban pemegang IUP/IUPK untuk menjual sebagian produksinya di pasar dalam negeri dengan harga yang ditetapkan pemerintah' },
      { key: 'D', text: 'Larangan perusahaan asing untuk memiliki saham mayoritas di perusahaan tambang' },
      { key: 'E', text: 'Kewajiban perusahaan untuk melaporkan jumlah produksi kepada BPS setiap kuartal' },
    ],
    correct_answer: 'C',
    explanation: '***Domestic Market Obligation*** (DMO) = **kewajiban menjual sebagian produksi** di **pasar dalam negeri**.\n\nKetentuan DMO pertambangan:\n\n| Aspek | Ketentuan |\n|---|---|\n| **Dasar hukum** | UU No. 3/2020, Permen ESDM |\n| **Persentase** | Minimal 25% dari produksi (bisa berbeda per komoditas) |\n| **Harga** | Ditetapkan/direferensikan oleh pemerintah |\n| **Tujuan** | Menjamin pasokan mineral untuk industri dalam negeri |\n\nContoh DMO di nikel:\n- Perusahaan wajib menjual **25% produksi bijih nikel** ke smelter dalam negeri\n- Harga mengacu pada **Harga Patokan Mineral** (HPM) yang ditetapkan Kementeri ESDM\n- Mendukung program **hilirisasi** nasional\n\nTujuan kebijakan DMO:\n- Menjamin **keamanan pasokan** bahan baku industri nasional\n- Mendukung **industrialisasi** dan **hilirisasi**\n- Menjaga **stabilitas harga** di pasar domestik\n- Mengurangi **ketergantungan impor** bahan baku',
  },

  // ═══════════════════════════════════════════
  // T3: Tata Kelola Perusahaan (GCG) (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa prinsip-prinsip *Good Corporate Governance* (GCG) yang dikenal dengan akronim TARIF?',
    options: [
      { key: 'A', text: 'Technology, Automation, Research, Innovation, Funding' },
      { key: 'B', text: 'Training, Assessment, Recruitment, Integration, Facilitation' },
      { key: 'C', text: 'Target, Achievement, Result, Impact, Follow-up' },
      { key: 'D', text: 'Transparency, Accountability, Responsibility, Independency, Fairness' },
      { key: 'E', text: 'Trust, Agility, Resilience, Integrity, Focus' },
    ],
    correct_answer: 'D',
    explanation: 'Prinsip **GCG** (TARIF):\n\n| Prinsip | Arti | Implementasi |\n|---|---|---|\n| **T**ransparency | Keterbukaan informasi | Laporan keuangan, annual report, pengungkapan informasi material |\n| **A**ccountability | Kejelasan fungsi dan pertanggungjawaban | Job description, KPI, audit internal |\n| **R**esponsibility | Tanggung jawab | Kepatuhan hukum, CSR, lingkungan, K3 |\n| **I**ndependency | Kemandirian | Tidak ada dominasi satu pihak, komite independen |\n| **F**airness | Kesetaraan | Hak pemegang saham minoritas, equal treatment |\n\nPenerapan GCG di BUMN:\n- Diatur dalam **Permen BUMN** tentang Penerapan GCG\n- **Assessment GCG** dilakukan secara berkala (self-assessment dan independent assessment)\n- Skor GCG mempengaruhi **penilaian kinerja** BUMN\n- Target skor: **sangat baik** (> 85 dari 100)',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *conflict of interest* dalam konteks tata kelola perusahaan?',
    options: [
      { key: 'A', text: 'Persaingan bisnis antara dua perusahaan tambang yang beroperasi di wilayah yang sama' },
      { key: 'B', text: 'Situasi kepentingan pribadi berbenturan dengan kepentingan perusahaan sehingga mempengaruhi objektivitas' },
      { key: 'C', text: 'Perselisihan antara serikat pekerja dan manajemen mengenai besaran upah' },
      { key: 'D', text: 'Konflik bersenjata di area pertambangan yang mengganggu operasional' },
      { key: 'E', text: 'Perbedaan pendapat antara auditor internal dan eksternal mengenai laporan keuangan' },
    ],
    correct_answer: 'B',
    explanation: '***Conflict of interest*** (benturan kepentingan) = situasi di mana **kepentingan pribadi** seseorang berbenturan dengan **kepentingan perusahaan**.\n\nContoh di perusahaan tambang:\n\n| Situasi | Potensi konflik |\n|---|---|\n| Direksi memiliki perusahaan vendor | Kontrak pengadaan tidak objektif |\n| Komisaris merangkap di perusahaan pesaing | Bocornya informasi strategis |\n| Manager memberikan kontrak ke perusahaan keluarga | Nepotisme |\n| Karyawan menerima hadiah dari vendor | Bias dalam evaluasi vendor |\n\nPenanganan:\n1. **Disclosure**: pengungkapan wajib setiap potensi benturan kepentingan\n2. **Recusal**: tidak ikut dalam pengambilan keputusan yang terkait\n3. **Register**: pencatatan dan pelaporan\n4. **Review**: evaluasi berkala oleh komite GCG\n5. **Sanksi**: konsekuensi jika tidak diungkapkan\n\nDokumen terkait:\n- **Code of Conduct**: pedoman perilaku perusahaan\n- **Conflict of Interest Policy**: kebijakan khusus benturan kepentingan\n- **LHKPN** (untuk pejabat BUMN): Laporan Harta Kekayaan Penyelenggara Negara',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa peran Komite Audit dalam tata kelola perusahaan?',
    options: [
      { key: 'A', text: 'Menjalankan audit lapangan terhadap operasi tambang setiap hari' },
      { key: 'B', text: 'Menggantikan peran auditor eksternal dalam memeriksa laporan keuangan' },
      { key: 'C', text: 'Menentukan besaran gaji dan bonus untuk seluruh karyawan perusahaan' },
      { key: 'D', text: 'Membantu Dewan Komisaris dalam mengawasi proses pelaporan keuangan, pengendalian internal, dan kepatuhan' },
      { key: 'E', text: 'Melakukan penjualan aset perusahaan yang sudah tidak terpakai' },
    ],
    correct_answer: 'D',
    explanation: '**Komite Audit** membantu **Dewan Komisaris** dalam fungsi pengawasan.\n\nTugas dan tanggung jawab:\n\n| Area | Tugas |\n|---|---|\n| **Pelaporan keuangan** | Review laporan keuangan, memastikan kewajaran |\n| **Pengendalian internal** | Evaluasi efektivitas sistem pengendalian internal |\n| **Audit** | Koordinasi dengan auditor internal dan eksternal |\n| **Kepatuhan** | Memastikan kepatuhan terhadap regulasi |\n| **Manajemen risiko** | Review proses manajemen risiko |\n\nKomposisi:\n- Ketua: **Komisaris Independen**\n- Anggota: minimal 2 orang **pihak independen**\n- Memiliki keahlian **akuntansi/keuangan**\n\nPersyaratan independensi:\n- Bukan karyawan atau direksi perusahaan\n- Tidak memiliki hubungan finansial material\n- Tidak memiliki hubungan keluarga dengan direksi/komisaris\n\nDasar hukum:\n- **Peraturan OJK** No. 55/2015\n- **Pedoman GCG** BUMN',
  },
  {
    order_index: 12,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *keterbukaan informasi* dalam prinsip GCG?',
    options: [
      { key: 'A', text: 'Membuka seluruh rahasia dagang perusahaan kepada kompetitor' },
      { key: 'B', text: 'Memberikan akses tidak terbatas kepada media untuk meliput semua kegiatan perusahaan' },
      { key: 'C', text: 'Mempublikasikan data pribadi seluruh karyawan di website perusahaan' },
      { key: 'D', text: 'Membagikan password sistem informasi perusahaan kepada pemegang saham' },
      { key: 'E', text: 'Kewajiban perusahaan menyediakan informasi material dan relevan secara tepat waktu dan akurat' },
    ],
    correct_answer: 'E',
    explanation: '**Keterbukaan informasi** = kewajiban menyediakan **informasi material dan relevan** secara **tepat waktu dan akurat**.\n\nJenis informasi yang wajib diungkapkan:\n\n| Informasi | Contoh |\n|---|---|\n| **Keuangan** | Laporan keuangan kuartalan dan tahunan |\n| **Operasional** | Produksi, cadangan mineral |\n| **Material** | Akuisisi, divestasi, kontrak besar |\n| **Risiko** | Faktor risiko yang material |\n| **GCG** | Kebijakan tata kelola, remunerasi direksi |\n| **Lingkungan** | Sustainability report, PROPER rating |\n\nBatasan keterbukaan:\n- **Rahasia dagang** tetap dilindungi\n- **Informasi orang dalam** tidak boleh disalahgunakan (*insider trading*)\n- **Keamanan nasional**: informasi yang bersifat strategis\n\nRegulasi:\n- **UU Pasar Modal**: kewajiban keterbukaan emiten\n- **Peraturan OJK**: laporan berkala dan insidentil\n- **UU KIP** (Keterbukaan Informasi Publik): untuk badan publik termasuk BUMN',
  },

  // ═══════════════════════════════════════════
  // T4: Kepatuhan & Anti-Korupsi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa perbedaan antara suap (*bribery*) dan gratifikasi menurut hukum Indonesia?',
    options: [
      { key: 'A', text: 'Suap hanya melibatkan uang tunai, gratifikasi hanya melibatkan barang' },
      { key: 'B', text: 'Suap bertujuan mempengaruhi keputusan pejabat, gratifikasi adalah pemberian yang berhubungan dengan jabatan' },
      { key: 'C', text: 'Suap dihukum pidana, gratifikasi tidak ada konsekuensi hukum' },
      { key: 'D', text: 'Suap untuk sektor swasta, gratifikasi untuk sektor publik' },
      { key: 'E', text: 'Keduanya identik dan tidak ada perbedaan dalam hukum Indonesia' },
    ],
    correct_answer: 'B',
    explanation: 'Perbedaan **suap** dan **gratifikasi**:\n\n| Aspek | Suap | Gratifikasi |\n|---|---|---|\n| **Definisi** | Pemberian dengan **niat mempengaruhi** keputusan | Pemberian **dalam arti luas** yang berhubungan dengan jabatan |\n| **Unsur niat** | **Ada** kesepakatan timbal balik | **Tidak perlu** ada kesepakatan |\n| **Penerima** | Penyelenggara negara/swasta | Penyelenggara negara |\n| **Dasar hukum** | UU Tipikor Pasal 5, 6, 11, 12 | UU Tipikor Pasal 12B, 12C |\n| **Ancaman** | 1-5 tahun penjara | 4-20 tahun (jika tidak dilaporkan) |\n\nContoh gratifikasi:\n- Hadiah ulang tahun, pernikahan dari vendor\n- Tiket perjalanan wisata\n- Diskon khusus untuk pembelian pribadi\n- Fasilitas hiburan (golf, spa)\n\nKewajiban pelaporan:\n- Penerima gratifikasi wajib **melaporkan ke KPK** dalam **30 hari kerja**\n- KPK menetapkan apakah gratifikasi menjadi **milik negara** atau **dikembalikan**\n- Jika **tidak dilaporkan**: dianggap suap dan dipidana',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan ISO 37001 (*Anti-Bribery Management System*)?',
    options: [
      { key: 'A', text: 'Standar internasional sistem manajemen anti-penyuapan untuk mencegah dan merespons risiko suap' },
      { key: 'B', text: 'Standar untuk manajemen kualitas produk dalam industri manufaktur' },
      { key: 'C', text: 'Sertifikasi keselamatan kerja yang wajib dimiliki perusahaan tambang' },
      { key: 'D', text: 'Peraturan bank sentral tentang pencegahan pencucian uang' },
      { key: 'E', text: 'Standar untuk pengelolaan limbah berbahaya dan beracun' },
    ],
    correct_answer: 'A',
    explanation: '**ISO 37001** = **standar internasional** untuk **sistem manajemen anti-penyuapan** (*Anti-Bribery Management System*).\n\nKomponen utama:\n\n| Elemen | Isi |\n|---|---|\n| **Kebijakan** | Kebijakan anti-penyuapan yang disetujui top management |\n| **Risk assessment** | Identifikasi dan penilaian risiko suap |\n| **Due diligence** | Pemeriksaan mitra bisnis, vendor, agen |\n| **Kontrol** | Prosedur pengendalian untuk area berisiko tinggi |\n| **Training** | Pelatihan dan kesadaran karyawan |\n| **Pelaporan** | Mekanisme pelaporan (whistleblowing) |\n| **Investigasi** | Prosedur penanganan insiden |\n| **Monitoring** | Audit dan review berkala |\n\nManfaat sertifikasi ISO 37001:\n- **Bukti komitmen** perusahaan terhadap anti-korupsi\n- **Mitigasi risiko** hukum (UU Tipikor, FCPA, UK Bribery Act)\n- **Reputasi** yang lebih baik di mata investor dan mitra\n- **Persyaratan** untuk beberapa tender internasional\n\nBanyak BUMN termasuk ANTAM telah atau sedang menerapkan ISO 37001.',
  },
  {
    order_index: 15,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *whistleblowing system* dalam konteks kepatuhan perusahaan?',
    options: [
      { key: 'A', text: 'Sistem alarm darurat yang dibunyikan saat terjadi kecelakaan di tambang' },
      { key: 'B', text: 'Prosedur pelaporan hasil audit keuangan kepada pemegang saham' },
      { key: 'C', text: 'Mekanisme pelaporan pelanggaran secara rahasia dan terlindungi bagi karyawan atau pihak lain' },
      { key: 'D', text: 'Sistem pengumuman internal tentang promosi dan mutasi karyawan' },
      { key: 'E', text: 'Saluran komunikasi untuk menyampaikan keluhan pelanggan tentang kualitas produk' },
    ],
    correct_answer: 'C',
    explanation: '***Whistleblowing system*** = **mekanisme pelaporan pelanggaran** secara **rahasia dan terlindungi**.\n\nKomponen WBS yang efektif:\n\n| Komponen | Detail |\n|---|---|\n| **Saluran pelaporan** | Hotline, email, web portal, kotak saran |\n| **Kerahasiaan** | Identitas pelapor dilindungi |\n| **Perlindungan** | Pelapor dilindungi dari pembalasan (*retaliation*) |\n| **Investigasi** | Tim investigasi independen |\n| **Tindak lanjut** | Sanksi bagi pelaku, feedback ke pelapor |\n| **Dokumentasi** | Pencatatan dan pelaporan statistik |\n\nJenis pelanggaran yang dapat dilaporkan:\n- Korupsi, suap, gratifikasi\n- Penipuan (*fraud*)\n- Penyalahgunaan wewenang\n- Pelanggaran kebijakan perusahaan\n- Pelanggaran hukum dan regulasi\n- Pelanggaran K3 dan lingkungan\n\nDasar hukum:\n- **PP No. 71/2000**: Tata Cara Peran Serta Masyarakat dalam Pencegahan Korupsi\n- **UU No. 13/2006**: Perlindungan Saksi dan Korban\n- **Pedoman GCG BUMN**\n- **ISO 37001** (Anti-Bribery Management System)',
  },
  {
    order_index: 16,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Fraud Triangle* dalam teori pencegahan kecurangan?',
    options: [
      { key: 'A', text: 'Tiga divisi yang bertanggung jawab mencegah kecurangan: hukum, audit, dan keamanan' },
      { key: 'B', text: 'Tiga jenis kecurangan utama: korupsi, pencurian aset, dan manipulasi laporan keuangan' },
      { key: 'C', text: 'Tiga tahap investigasi kecurangan: deteksi, penyelidikan, dan pelaporan' },
      { key: 'D', text: 'Tiga faktor pemicu kecurangan: tekanan (pressure), kesempatan (opportunity), dan pembenaran (rationalization)' },
      { key: 'E', text: 'Tiga sanksi untuk pelaku kecurangan: peringatan, pemecatan, dan penjara' },
    ],
    correct_answer: 'D',
    explanation: '***Fraud Triangle*** (Donald Cressey) = tiga faktor yang mendorong kecurangan:\n\n| Faktor | Penjelasan | Contoh |\n|---|---|---|\n| **Pressure** (Tekanan) | Tekanan finansial atau non-finansial | Utang pribadi, target kinerja tidak realistis, gaya hidup |\n| **Opportunity** (Kesempatan) | Kelemahan pengendalian internal | Kurang *segregation of duties*, pengawasan lemah |\n| **Rationalization** (Pembenaran) | Pembenaran diri atas tindakan | "Semua orang juga begitu", "Saya layak mendapatkan ini" |\n\nPencegahan berdasarkan Fraud Triangle:\n\n| Faktor | Pencegahan |\n|---|---|\n| **Pressure** | Kompensasi adil, program bantuan karyawan |\n| **Opportunity** | Pengendalian internal kuat, rotasi jabatan, audit |\n| **Rationalization** | Budaya etika, code of conduct, training |\n\nJenis fraud di perusahaan tambang:\n- **Pengadaan**: mark-up harga, vendor fiktif\n- **Produksi**: manipulasi data produksi/kadar\n- **Keuangan**: manipulasi laporan keuangan\n- **Aset**: pencurian spare part, BBM, material',
  },

  // ═══════════════════════════════════════════
  // T5: Manajemen Risiko Hukum & Kebijakan Publik (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa perbedaan antara penyelesaian sengketa melalui litigasi dan non-litigasi?',
    options: [
      { key: 'A', text: 'Litigasi melalui pengadilan (formal), non-litigasi di luar pengadilan (musyawarah, mediasi, arbitrase)' },
      { key: 'B', text: 'Litigasi untuk sengketa besar, non-litigasi untuk sengketa kecil' },
      { key: 'C', text: 'Litigasi gratis, non-litigasi berbayar' },
      { key: 'D', text: 'Litigasi hanya untuk perusahaan swasta, non-litigasi hanya untuk BUMN' },
      { key: 'E', text: 'Litigasi bersifat rahasia, non-litigasi terbuka untuk umum' },
    ],
    correct_answer: 'A',
    explanation: 'Perbedaan **litigasi** dan **non-litigasi**:\n\n| Aspek | Litigasi | Non-Litigasi |\n|---|---|---|\n| **Tempat** | **Pengadilan** (formal) | **Di luar pengadilan** |\n| **Prosedur** | Hukum acara yang ketat | Lebih fleksibel |\n| **Putusan** | Oleh **hakim** | Oleh para pihak/arbiter/mediator |\n| **Sifat** | Umumnya **terbuka** | Bisa **rahasia** |\n| **Banding** | Tersedia | Terbatas (arbitrase: final) |\n| **Durasi** | Bisa sangat lama | Umumnya lebih cepat |\n| **Biaya** | Relatif murah (biaya pengadilan) | Bisa mahal (biaya arbiter) |\n\nMetode non-litigasi (ADR - *Alternative Dispute Resolution*):\n1. **Negosiasi**: langsung antar para pihak\n2. **Mediasi**: dengan bantuan mediator netral\n3. **Konsiliasi**: konsiliator memberikan rekomendasi\n4. **Arbitrase**: arbiter memutus (putusan final & binding)\n\nDi pertambangan, **arbitrase** sering dipilih karena:\n- **Kerahasiaan** (reputasi terjaga)\n- **Keahlian** arbiter (bisa pilih ahli pertambangan)\n- Putusan **final** (tidak berlarut-larut)',
  },
  {
    order_index: 18,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Keputusan Tata Usaha Negara* (KTUN) dan relevansinya bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Keputusan rapat direksi tentang pembagian dividen' },
      { key: 'B', text: 'Putusan pengadilan atas sengketa perdata antar perusahaan' },
      { key: 'C', text: 'Penetapan tertulis pejabat TUN yang bersifat konkret, individual, dan final' },
      { key: 'D', text: 'Undang-undang yang disahkan oleh DPR tentang pertambangan' },
      { key: 'E', text: 'Kontrak kerja sama antara BUMN dan perusahaan swasta' },
    ],
    correct_answer: 'C',
    explanation: '**KTUN** (*Keputusan Tata Usaha Negara*) = **penetapan tertulis** oleh pejabat TUN yang bersifat **konkret, individual, dan final** (Pasal 1 angka 9 UU PTUN).\n\nRelevansi di pertambangan:\n\n| KTUN | Pejabat | Dampak |\n|---|---|---|\n| **IUP/IUPK** | Menteri ESDM | Izin beroperasi |\n| **Izin Lingkungan** | Menteri LHK/Gubernur | Persyaratan lingkungan |\n| **Pencabutan IUP** | Menteri ESDM | Penghentian operasi |\n| **PROPER rating** | Menteri LHK | Penilaian kinerja lingkungan |\n\nJika perusahaan merasa KTUN merugikan:\n1. **Upaya administratif**: keberatan → banding administratif\n2. **Gugatan PTUN**: ke Pengadilan Tata Usaha Negara\n3. **Banding**: ke PT TUN\n4. **Kasasi**: ke Mahkamah Agung\n\nContoh kasus:\n- Perusahaan menggugat pencabutan IUP yang dianggap **tidak sesuai prosedur**\n- Gugatan terhadap penolakan izin lingkungan yang dianggap **tidak berdasar**',
  },
  {
    order_index: 19,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan analisis dampak regulasi (*regulatory impact analysis*) bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Analisis dampak ledakan terhadap regulasi kebisingan di sekitar tambang' },
      { key: 'B', text: 'Perhitungan biaya pajak yang harus dibayar perusahaan setiap tahun' },
      { key: 'C', text: 'Pengukuran dampak gempa bumi terhadap struktur bangunan tambang' },
      { key: 'D', text: 'Studi tentang efektivitas program CSR terhadap kesejahteraan masyarakat' },
      { key: 'E', text: 'Proses sistematis mengevaluasi dampak perubahan regulasi terhadap operasi dan bisnis perusahaan' },
    ],
    correct_answer: 'E',
    explanation: '***Regulatory impact analysis*** (RIA) = proses sistematis **mengevaluasi dampak perubahan regulasi** terhadap bisnis.\n\nContoh perubahan regulasi dan dampaknya:\n\n| Regulasi | Dampak |\n|---|---|\n| **Larangan ekspor bijih** (2014, 2020) | Wajib bangun smelter, investasi besar |\n| **Kenaikan royalti** | Biaya produksi naik, margin turun |\n| **Perubahan UU Minerba** (2020) | Perpanjangan izin, kewajiban hilirisasi |\n| **Carbon tax** | Biaya emisi tambahan |\n| **DMO** (Domestic Market Obligation) | Pembatasan volume ekspor |\n| **TKDN** wajib | Perubahan strategi pengadaan |\n\nLangkah-langkah RIA:\n1. **Identifikasi**: regulasi baru/perubahan yang akan terbit\n2. **Analisis dampak**: finansial, operasional, strategis\n3. **Quantifikasi**: estimasi biaya/manfaat\n4. **Strategi respons**: adaptasi bisnis, lobby, kepatuhan\n5. **Monitoring**: pantau implementasi dan enforcement\n\nFungsi hukum perusahaan harus **proaktif** memantau perkembangan regulasi, bukan hanya **reaktif** saat sudah berlaku.',
  },
  {
    order_index: 20,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *due diligence* hukum dalam konteks akuisisi atau investasi?',
    options: [
      { key: 'A', text: 'Proses pelatihan karyawan baru tentang peraturan perusahaan' },
      { key: 'B', text: 'Pemeriksaan menyeluruh aspek hukum target investasi untuk mengidentifikasi risiko dan kewajiban' },
      { key: 'C', text: 'Audit keuangan yang dilakukan auditor eksternal setiap akhir tahun' },
      { key: 'D', text: 'Proses pendaftaran merek dagang di kantor kekayaan intelektual' },
      { key: 'E', text: 'Perundingan kolektif antara serikat pekerja dan manajemen tentang PKB' },
    ],
    correct_answer: 'B',
    explanation: '***Legal due diligence*** = **pemeriksaan menyeluruh aspek hukum** target investasi untuk **mengidentifikasi risiko**.\n\nAspek yang diperiksa:\n\n| Area | Yang diperiksa |\n|---|---|\n| **Korporasi** | Akta pendirian, anggaran dasar, struktur kepemilikan |\n| **Perizinan** | IUP/IUPK, izin lingkungan, izin operasional |\n| **Kontrak** | Perjanjian material, kontrak penjualan, kontrak pengadaan |\n| **Ketenagakerjaan** | PKB, sengketa, kewajiban pesangon |\n| **Lingkungan** | AMDAL, kepatuhan lingkungan, kewajiban reklamasi |\n| **Litigasi** | Sengketa yang sedang berjalan |\n| **Aset** | Kepemilikan tanah, hak atas aset |\n| **Pajak** | Kepatuhan pajak, sengketa pajak |\n\nHasil due diligence:\n- **Red flags**: masalah hukum yang harus diatasi sebelum transaksi\n- **Conditions precedent**: syarat yang harus dipenuhi sebelum *closing*\n- **Representations & warranties**: pernyataan dan jaminan dalam kontrak\n- **Indemnity**: ganti rugi untuk risiko yang teridentifikasi\n- **Valuasi**: penyesuaian harga berdasarkan temuan',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-legal')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-legal tidak ditemukan:', pkgErr)
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
