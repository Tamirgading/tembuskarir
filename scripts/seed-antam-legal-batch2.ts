/**
 * ANTAM IMPACT 2026 — Legal & Compliance (LGL) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Hukum Perusahaan & Bisnis Dasar): 4 soal
 *   T2 (Regulasi Pertambangan & Lingkungan): 4 soal
 *   T3 (Tata Kelola Perusahaan / GCG): 4 soal
 *   T4 (Kepatuhan & Anti-Korupsi): 4 soal
 *   T5 (Manajemen Risiko Hukum & Kebijakan Publik): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-legal-batch2.ts
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
// A: 22,27,33,38 | B: 24,29,35,40 | C: 21,26,31,36 | D: 23,28,34,39 | E: 25,30,32,37

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Hukum Perusahaan & Bisnis Dasar (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *merger* (penggabungan), *konsolidasi* (peleburan), dan *akuisisi* (pengambilalihan) menurut UU Perseroan Terbatas?',
    options: [
      { key: 'A', text: 'Ketiganya identik dan hanya berbeda istilah saja' },
      { key: 'B', text: 'Merger hanya untuk perusahaan publik, konsolidasi untuk perusahaan privat' },
      { key: 'C', text: 'Merger: satu PT bubar dan bergabung ke PT lain; Konsolidasi: dua PT bubar membentuk PT baru; Akuisisi: pengambilalihan saham tanpa pembubaran' },
      { key: 'D', text: 'Merger untuk sektor keuangan, konsolidasi untuk sektor tambang, akuisisi untuk sektor teknologi' },
      { key: 'E', text: 'Merger dan konsolidasi bersifat sukarela, akuisisi selalu bersifat paksa (hostile)' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan menurut **UU No. 40/2007**:\n\n| Tindakan | Definisi | Status PT |\n|---|---|---|\n| **Merger** (Penggabungan) | Satu atau lebih PT bergabung ke PT yang sudah ada | PT yang bergabung **bubar**, PT penerima tetap ada |\n| **Konsolidasi** (Peleburan) | Dua atau lebih PT melebur membentuk PT baru | **Semua PT bubar**, terbentuk PT **baru** |\n| **Akuisisi** (Pengambilalihan) | Pengambilalihan saham mayoritas | **Tidak ada** PT yang bubar |\n\nProsedur umum:\n1. **Persetujuan RUPS**: mayoritas khusus (3/4 kuorum, 3/4 suara)\n2. **Rancangan**: disusun oleh direksi masing-masing PT\n3. **Pengumuman**: di surat kabar + pemberitahuan tertulis ke karyawan\n4. **Hak kreditur**: keberatan dalam 14 hari setelah pengumuman\n5. **Persetujuan Menteri**: pendaftaran dan pengumuman\n\nPertimbangan khusus:\n- **Hak pemegang saham minoritas**: appraisal right (hak menuntut pembelian saham)\n- **Persetujuan KPPU**: jika memenuhi threshold UU Persaingan Usaha\n- **Notifikasi**: wajib dilaporkan ke KPPU dalam 30 hari setelah efektif',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *force majeure* (keadaan kahar) dalam hukum kontrak?',
    options: [
      { key: 'A', text: 'Peristiwa di luar kendali para pihak yang membebaskan pihak terdampak dari tanggung jawab kontrak' },
      { key: 'B', text: 'Klausul yang memaksa salah satu pihak untuk melaksanakan kontrak lebih cepat dari jadwal' },
      { key: 'C', text: 'Ketentuan yang memberikan hak kepada satu pihak untuk mengubah harga kontrak secara sepihak' },
      { key: 'D', text: 'Syarat yang mengharuskan kedua pihak menambah nilai kontrak setiap tahun' },
      { key: 'E', text: 'Klausul yang melarang salah satu pihak untuk mengakhiri kontrak sebelum jatuh tempo' },
    ],
    correct_answer: 'A',
    explanation: '***Force majeure*** (keadaan kahar) = peristiwa **di luar kendali** para pihak yang membuat pelaksanaan kontrak **tidak mungkin**.\n\nKarakteristik:\n\n| Syarat | Penjelasan |\n|---|---|\n| **Tidak dapat diduga** | Peristiwa tidak bisa diprediksi saat kontrak dibuat |\n| **Tidak dapat dicegah** | Para pihak tidak mampu mencegah terjadinya |\n| **Di luar kendali** | Bukan karena kesalahan salah satu pihak |\n\nContoh force majeure di pertambangan:\n- **Bencana alam**: gempa bumi, banjir, tanah longsor\n- **Epidemi/pandemi**: COVID-19 (moratorium operasi)\n- **Kebijakan pemerintah**: larangan ekspor mendadak\n- **Perang/kerusuhan**: konflik di area operasi\n\nDampak hukum:\n- Pihak yang terdampak **dibebaskan dari tanggung jawab** atas keterlambatan/kegagalan\n- Kontrak dapat **ditunda** atau **diakhiri** tergantung klausul\n- Pihak terdampak tetap wajib **memberitahu** pihak lain\n- **Beban pembuktian** ada pada pihak yang mengklaim force majeure\n\nDasar hukum: Pasal 1244-1245 KUHPerdata.',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *business judgment rule* dan bagaimana penerapannya bagi direksi PT?',
    options: [
      { key: 'A', text: 'Aturan yang mewajibkan direksi untuk selalu meminta persetujuan RUPS sebelum mengambil keputusan bisnis apapun' },
      { key: 'B', text: 'Ketentuan bahwa direksi harus memiliki gelar MBA sebelum mengambil keputusan strategis' },
      { key: 'C', text: 'Prinsip bahwa keputusan bisnis harus menghasilkan keuntungan minimal 10% per tahun' },
      { key: 'D', text: 'Doktrin hukum yang melindungi direksi dari tanggung jawab pribadi atas keputusan bisnis yang diambil dengan itikad baik, kehati-hatian, dan untuk kepentingan perseroan' },
      { key: 'E', text: 'Aturan yang mengharuskan seluruh keputusan bisnis dituangkan dalam akta notaris' },
    ],
    correct_answer: 'D',
    explanation: '***Business Judgment Rule*** = doktrin hukum yang **melindungi direksi** dari tanggung jawab pribadi atas keputusan bisnis.\n\nSyarat perlindungan (Pasal 97 UU PT):\n\n| Syarat | Penjelasan |\n|---|---|\n| **Itikad baik** | Keputusan diambil dengan niat yang benar |\n| **Kehati-hatian** (duty of care) | Informasi yang cukup, analisis memadai |\n| **Kepentingan perseroan** | Bukan untuk kepentingan pribadi |\n| **Sesuai AD** | Tidak melanggar Anggaran Dasar |\n| **Sesuai hukum** | Tidak melanggar peraturan perundangan |\n\nContoh penerapan di pertambangan:\n- Direksi memutuskan **investasi smelter** yang ternyata merugi karena penurunan harga komoditas\n- Jika keputusan diambil berdasarkan studi kelayakan yang memadai, analisis pasar, dan persetujuan yang diperlukan, direksi **tidak bertanggung jawab secara pribadi**\n- Jika keputusan diambil **tanpa analisis**, atau ada **konflik kepentingan**, perlindungan tidak berlaku\n\nKonsekuensi jika syarat tidak terpenuhi:\n- Direksi **bertanggung jawab secara pribadi** atas kerugian\n- Dapat digugat oleh **pemegang saham** (derivative action)\n- Dapat dimintai pertanggungjawaban **pidana** jika ada unsur pidana',
  },
  {
    order_index: 24,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *arbitration clause* dalam kontrak bisnis dan mengapa penting bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Klausul yang melarang kedua pihak untuk menyelesaikan sengketa melalui jalur apapun' },
      { key: 'B', text: 'Klausul yang menentukan sengketa kontrak diselesaikan melalui arbitrase, bukan melalui pengadilan' },
      { key: 'C', text: 'Klausul yang mengharuskan kedua pihak untuk selalu menerima keputusan pengadilan negeri' },
      { key: 'D', text: 'Klausul yang memberikan hak veto kepada salah satu pihak atas keputusan pengadilan' },
      { key: 'E', text: 'Klausul yang mewajibkan perusahaan untuk menunjuk pengacara dari kantor hukum tertentu' },
    ],
    correct_answer: 'B',
    explanation: '***Arbitration clause*** = klausul yang menentukan **penyelesaian sengketa melalui arbitrase** (bukan pengadilan).\n\nKeuntungan arbitrase bagi perusahaan tambang:\n\n| Keuntungan | Detail |\n|---|---|\n| **Kerahasiaan** | Proses tertutup, reputasi terjaga |\n| **Keahlian** | Arbiter bisa dipilih dari ahli pertambangan/komersial |\n| **Kecepatan** | Umumnya lebih cepat dari litigasi |\n| **Final & binding** | Putusan final, tidak ada banding |\n| **Enforcement** | Diakui internasional (Konvensi New York 1958) |\n\nLembaga arbitrase:\n- **BANI** (Badan Arbitrase Nasional Indonesia) — sengketa domestik\n- **ICC** (International Chamber of Commerce) — sengketa internasional\n- **SIAC** (Singapore International Arbitration Centre) — Asia-Pasifik\n- **LCIA** (London Court of International Arbitration) — Eropa\n\nDasar hukum: **UU No. 30/1999** tentang Arbitrase dan Alternatif Penyelesaian Sengketa.\n\nHal penting:\n- Klausul arbitrase **mengikat** dan mengecualikan yurisdiksi pengadilan\n- Putusan arbitrase dapat **dibatalkan** hanya dalam kasus tertentu (Pasal 70 UU 30/1999)',
  },

  // ═══════════════════════════════════════════
  // T2: Regulasi Pertambangan & Lingkungan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan kewajiban *hilirisasi* dalam UU Minerba dan bagaimana implementasinya?',
    options: [
      { key: 'A', text: 'Kewajiban perusahaan tambang untuk menjual semua produk ke pemerintah dengan harga murah' },
      { key: 'B', text: 'Kewajiban perusahaan tambang untuk memindahkan kantor pusat ke daerah pertambangan' },
      { key: 'C', text: 'Kewajiban perusahaan tambang untuk merekrut hanya tenaga kerja lokal dari daerah tambang' },
      { key: 'D', text: 'Kewajiban perusahaan untuk mempromosikan produk tambang melalui iklan di media massa' },
      { key: 'E', text: 'Kewajiban pemegang IUP/IUPK mengolah dan memurnikan mineral di dalam negeri sebelum diekspor' },
    ],
    correct_answer: 'E',
    explanation: '**Hilirisasi** = kewajiban **pengolahan dan/atau pemurnian** mineral di dalam negeri sebelum ekspor.\n\nDasar hukum: **UU No. 3/2020** (revisi UU Minerba) Pasal 102-103.\n\nTahapan implementasi:\n\n| Fase | Tahun | Kebijakan |\n|---|---|---|\n| **Awal** | 2009 (UU asli) | Kewajiban hilirisasi diundangkan |\n| **Larangan ekspor bijih** | 2014 | Bijih mentah dilarang ekspor (dengan pengecualian) |\n| **Relaksasi** | 2017 | Izin ekspor konsentrat dengan syarat progress smelter |\n| **Larangan penuh** | 2020 | Larangan ekspor bijih nikel |\n| **Perluasan** | 2023+ | Rencana larangan ekspor bijih bauksit, tembaga |\n\nContoh di ANTAM:\n- **Bijih nikel** → diolah di **smelter FeNi** (Pomalaa) → **ferronickel**\n- **Bijih bauksit** → diolah di **smelter grade alumina** (Tayan) → **chemical grade alumina**\n- **Bijih emas** → diolah di **UBPE Pongkor/Cibaliung** → **emas batangan (logam mulia)**\n\nTujuan hilirisasi:\n- **Nilai tambah**: bijih nikel $30/ton → ferronickel $15.000/ton\n- **Lapangan kerja**: pembangunan dan operasi smelter\n- **Devisa**: ekspor produk bernilai tinggi\n- **Transfer teknologi**: dari investor asing',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan PROPER (*Program Penilaian Peringkat Kinerja Perusahaan dalam Pengelolaan Lingkungan*)?',
    options: [
      { key: 'A', text: 'Program pelatihan karyawan tentang etika bisnis yang diselenggarakan Kementerian BUMN' },
      { key: 'B', text: 'Sertifikasi kualitas produk oleh Badan Standardisasi Nasional' },
      { key: 'C', text: 'Program penilaian kinerja lingkungan oleh Kementerian LHK dengan peringkat warna dari emas hingga hitam' },
      { key: 'D', text: 'Sistem penghargaan untuk perusahaan yang membayar pajak tepat waktu' },
      { key: 'E', text: 'Program audit keselamatan kerja yang dilakukan oleh Kementerian Ketenagakerjaan' },
    ],
    correct_answer: 'C',
    explanation: '**PROPER** = **Program Penilaian Peringkat Kinerja Perusahaan dalam Pengelolaan Lingkungan** oleh **Kementerian LHK**.\n\nPeringkat PROPER:\n\n| Peringkat | Warna | Arti |\n|---|---|---|\n| **Emas** | 🥇 | Secara konsisten menunjukkan keunggulan lingkungan, beyond compliance, inovasi |\n| **Hijau** | 🟢 | Pengelolaan lingkungan lebih dari yang dipersyaratkan (beyond compliance) |\n| **Biru** | 🔵 | Telah melakukan pengelolaan lingkungan sesuai ketentuan (compliance) |\n| **Merah** | 🔴 | Belum sesuai ketentuan (non-compliance) |\n| **Hitam** | ⚫ | Sengaja tidak melakukan upaya pengelolaan lingkungan, berpotensi mencemari |\n\nKriteria penilaian:\n- Pengendalian **pencemaran air**\n- Pengendalian **pencemaran udara**\n- Pengelolaan **limbah B3**\n- Pengelolaan **limbah non-B3**\n- Penerapan **AMDAL/UKL-UPL**\n- **Sistem manajemen lingkungan** (ISO 14001)\n\nDampak peringkat:\n- **Emas/Hijau**: reputasi positif, kemudahan perizinan\n- **Merah/Hitam**: sanksi administratif, pencabutan izin, tuntutan hukum',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa kewajiban *divestasi saham* bagi perusahaan tambang dengan modal asing menurut UU Minerba?',
    options: [
      { key: 'A', text: 'Perusahaan modal asing wajib melepas saham secara bertahap kepada peserta Indonesia hingga minimal 51%' },
      { key: 'B', text: 'Perusahaan asing tidak perlu melakukan divestasi jika sudah membayar pajak dengan benar' },
      { key: 'C', text: 'Divestasi hanya wajib untuk perusahaan tambang batubara, bukan mineral' },
      { key: 'D', text: 'Divestasi saham berarti perusahaan harus menjual semua aset fisiknya kepada pemerintah' },
      { key: 'E', text: 'Divestasi hanya berlaku untuk perusahaan yang beroperasi di Papua dan Kalimantan' },
    ],
    correct_answer: 'A',
    explanation: '**Divestasi saham** = kewajiban perusahaan modal asing untuk **menjual saham secara bertahap** kepada peserta Indonesia.\n\nKetentuan menurut **UU No. 3/2020** dan PP turunannya:\n\n| Aspek | Ketentuan |\n|---|---|\n| **Kewajiban** | Divestasi saham **minimal 51%** |\n| **Jangka waktu** | Bertahap setelah 5 tahun berproduksi |\n| **Penerima** | Pemerintah pusat, pemerintah daerah, BUMN, BUMD, atau badan usaha swasta nasional |\n| **Harga** | Berdasarkan **nilai wajar** (fair market value) |\n| **Prioritas** | Pemerintah pusat/daerah → BUMN/BUMD → swasta nasional |\n\nContoh penerapan:\n- PT Freeport Indonesia: divestasi 51% saham ke MIND ID (holding tambang BUMN)\n- PT Vale Indonesia: renegosiasi divestasi terkait perpanjangan kontrak\n\nTujuan kebijakan:\n- **Kedaulatan sumber daya**: pengendalian SDA oleh Indonesia\n- **Manfaat ekonomi**: keuntungan lebih banyak untuk Indonesia\n- **Transfer teknologi**: melalui partisipasi dalam manajemen\n- **Pembangunan daerah**: partisipasi pemerintah daerah',
  },
  {
    order_index: 28,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa sanksi bagi perusahaan tambang yang melakukan penambangan tanpa izin (PETI)?',
    options: [
      { key: 'A', text: 'Hanya diberikan peringatan tertulis tanpa konsekuensi lebih lanjut' },
      { key: 'B', text: 'Cukup membayar denda administrasi sebesar Rp1 juta' },
      { key: 'C', text: 'Hanya diminta untuk mengajukan izin dalam waktu 30 hari' },
      { key: 'D', text: 'Pidana penjara paling lama 5 tahun dan denda paling banyak Rp100 miliar menurut UU Minerba' },
      { key: 'E', text: 'Perusahaan hanya dilarang beroperasi selama 1 bulan' },
    ],
    correct_answer: 'D',
    explanation: '**PETI** (*Penambangan Tanpa Izin*) diatur dalam **UU No. 3/2020** tentang Minerba.\n\nSanksi pidana (Pasal 158):\n\n| Sanksi | Ketentuan |\n|---|---|\n| **Penjara** | Paling lama **5 tahun** |\n| **Denda** | Paling banyak **Rp100 miliar** |\n| **Tambahan** | Perampasan hasil tambang dan peralatan |\n\nJenis pelanggaran terkait:\n- Melakukan penambangan **tanpa IUP/IUPK** (Pasal 158)\n- **Merintangi** kegiatan usaha pertambangan yang sah (Pasal 162)\n- Menyampaikan laporan/data **palsu** (Pasal 159)\n- Melakukan **eksplorasi tanpa izin** (Pasal 158)\n\nDampak PETI:\n- **Kerusakan lingkungan**: lubang tambang tanpa reklamasi\n- **Keselamatan**: tidak ada standar K3, banyak korban jiwa\n- **Kerugian negara**: tidak ada royalti dan pajak\n- **Konflik sosial**: dengan masyarakat dan pemegang izin\n\nUpaya penanganan:\n- Operasi gabungan (TNI/Polri/ESDM)\n- **Formalisasi**: program pembinaan menjadi tambang rakyat berizin\n- **Pengawasan** berbasis teknologi (drone, satelit)',
  },

  // ═══════════════════════════════════════════
  // T3: Tata Kelola Perusahaan (GCG) (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa peran *Komisaris Independen* dalam tata kelola perusahaan?',
    options: [
      { key: 'A', text: 'Menjalankan operasional sehari-hari perusahaan dan menandatangani kontrak' },
      { key: 'B', text: 'Anggota Dewan Komisaris yang tidak terafiliasi sehingga dapat mengawasi secara objektif dan independen' },
      { key: 'C', text: 'Auditor eksternal yang dipekerjakan untuk memeriksa laporan keuangan setiap kuartal' },
      { key: 'D', text: 'Konsultan hukum yang memberikan nasihat tentang kepatuhan regulasi' },
      { key: 'E', text: 'Perwakilan pemerintah yang ditempatkan di perusahaan untuk mengawasi kegiatan tambang' },
    ],
    correct_answer: 'B',
    explanation: '**Komisaris Independen** = anggota Dewan Komisaris yang **tidak terafiliasi** dengan pemegang saham, direksi, atau komisaris lainnya.\n\nPersyaratan independensi:\n\n| Syarat | Detail |\n|---|---|\n| **Tidak terafiliasi** | Tidak memiliki hubungan keuangan, kepengurusan, kepemilikan saham, atau hubungan keluarga |\n| **Jumlah minimal** | 30% dari total anggota Dewan Komisaris (untuk emiten) |\n| **Masa jabatan** | Maksimal 2 periode berturut-turut |\n\nPeran dan fungsi:\n- **Pengawasan objektif** atas kebijakan direksi\n- **Ketua Komite Audit** (wajib dijabat komisaris independen)\n- **Perlindungan kepentingan** pemegang saham minoritas\n- **Mediasi** konflik kepentingan\n- **Review** transaksi afiliasi dan benturan kepentingan\n\nMengapa penting di BUMN:\n- Mencegah **dominasi** pemegang saham pengendali (pemerintah)\n- Menjamin **objektivitas** pengambilan keputusan\n- Memenuhi **standar GCG** dan regulasi OJK\n- Meningkatkan **kepercayaan investor** dan publik',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *Code of Conduct* (CoC) perusahaan?',
    options: [
      { key: 'A', text: 'Kode rahasia yang digunakan untuk komunikasi internal antar divisi' },
      { key: 'B', text: 'Kode pos yang digunakan untuk pengiriman dokumen antar kantor cabang' },
      { key: 'C', text: 'Kode akses masuk ke area pertambangan yang diberikan kepada kontraktor' },
      { key: 'D', text: 'Nomor registrasi perusahaan yang terdaftar di Kementerian Hukum dan HAM' },
      { key: 'E', text: 'Pedoman perilaku dan etika bisnis bagi seluruh organ perusahaan dan karyawan' },
    ],
    correct_answer: 'E',
    explanation: '***Code of Conduct*** (CoC) = **pedoman perilaku dan etika bisnis** untuk seluruh organ perusahaan dan karyawan.\n\nIsi CoC umumnya mencakup:\n\n| Area | Contoh aturan |\n|---|---|\n| **Integritas** | Anti-suap, anti-gratifikasi, kejujuran |\n| **Konflik kepentingan** | Pengungkapan, larangan, prosedur |\n| **Kerahasiaan** | Informasi perusahaan, data pribadi |\n| **Hubungan kerja** | Anti-diskriminasi, pelecehan, K3 |\n| **Penggunaan aset** | Aset perusahaan untuk kepentingan bisnis |\n| **Lingkungan** | Komitmen keberlanjutan, pengelolaan limbah |\n| **Hubungan dengan pihak ketiga** | Vendor, mitra, pemerintah, masyarakat |\n| **Pelaporan** | Mekanisme whistleblowing, perlindungan pelapor |\n\nPenerapan:\n- **Wajib** ditandatangani oleh seluruh karyawan\n- **Sosialisasi** berkala melalui pelatihan\n- **Sanksi** bagi pelanggar (teguran hingga PHK)\n- **Review** dan update berkala (minimal setahun sekali)\n\nDasar hukum:\n- Pedoman **GCG KNKG** (Komite Nasional Kebijakan Governance)\n- **Permen BUMN** tentang Penerapan GCG pada BUMN',
  },
  {
    order_index: 31,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *related party transaction* (RPT) dan mengapa perlu diatur secara ketat?',
    options: [
      { key: 'A', text: 'Transaksi jual beli produk secara online melalui marketplace' },
      { key: 'B', text: 'Transaksi antara perusahaan dengan pelanggan akhir (end consumer)' },
      { key: 'C', text: 'Transaksi dengan pihak afiliasi yang berpotensi tidak dilakukan secara wajar (arm\'s length)' },
      { key: 'D', text: 'Transaksi pembelian bahan baku dari vendor yang memenangkan tender terbuka' },
      { key: 'E', text: 'Pembayaran gaji dan tunjangan kepada karyawan sesuai kontrak kerja' },
    ],
    correct_answer: 'C',
    explanation: '***Related Party Transaction*** (RPT) = transaksi dengan **pihak terafiliasi** yang berpotensi **tidak wajar**.\n\nPihak terkait (related party):\n\n| Pihak | Contoh |\n|---|---|\n| **Anak/induk perusahaan** | PT ANTAM Tbk ↔ PT ANTAM Resourcindo |\n| **Perusahaan asosiasi** | Entitas yang sebagian dimiliki |\n| **Direksi/Komisaris** | Transaksi dengan perusahaan milik direksi |\n| **Pemegang saham pengendali** | MIND ID sebagai induk BUMN tambang |\n| **Keluarga** | Perusahaan milik keluarga direksi/komisaris |\n\nMengapa perlu diatur ketat:\n- **Potensi kerugian**: harga tidak wajar, terms yang merugikan\n- **Konflik kepentingan**: keputusan menguntungkan pihak tertentu\n- **Transparansi**: pemegang saham minoritas berhak tahu\n\nRegulasi:\n- **Peraturan OJK**: kewajiban pengungkapan dan persetujuan untuk RPT material\n- **PSAK 7**: standar akuntansi pengungkapan pihak berelasi\n- Transaksi material perlu persetujuan **RUPS** atau **Komisaris Independen**\n- Prinsip ***arm\'s length***: harus sesuai harga dan syarat pasar',
  },
  {
    order_index: 32,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *insider trading* dan bagaimana regulasinya di Indonesia?',
    options: [
      { key: 'A', text: 'Perdagangan saham antara dua pialang yang bekerja di perusahaan efek yang sama' },
      { key: 'B', text: 'Pembelian saham perusahaan oleh karyawan melalui program ESOP (Employee Stock Ownership Plan)' },
      { key: 'C', text: 'Penjualan produk perusahaan kepada karyawan dengan harga diskon khusus' },
      { key: 'D', text: 'Perdagangan saham di bursa efek luar negeri oleh investor Indonesia' },
      { key: 'E', text: 'Perdagangan efek oleh pihak yang memiliki informasi orang dalam yang material dan non-publik' },
    ],
    correct_answer: 'E',
    explanation: '***Insider trading*** = **perdagangan efek** berdasarkan **informasi orang dalam** yang material dan non-publik.\n\nDasar hukum: **UU No. 8/1995** tentang Pasar Modal, Pasal 95-99.\n\nUnsur insider trading:\n\n| Unsur | Penjelasan |\n|---|---|\n| **Orang dalam** | Komisaris, direksi, pemegang saham utama, karyawan, atau pihak yang mendapat informasi |\n| **Informasi material** | Informasi yang dapat mempengaruhi harga efek |\n| **Non-publik** | Belum diumumkan kepada publik |\n| **Perdagangan** | Membeli/menjual efek berdasarkan informasi tersebut |\n\nContoh di perusahaan tambang:\n- Direksi membeli saham sebelum **pengumuman penemuan cadangan baru**\n- Karyawan menjual saham sebelum **pengumuman kerugian besar**\n- Konsultan hukum membeli saham sebelum **pengumuman akuisisi**\n\nSanksi:\n- **Pidana**: penjara paling lama **10 tahun**, denda paling banyak **Rp15 miliar**\n- **Perdata**: ganti rugi kepada pihak yang dirugikan\n- **Administratif**: sanksi dari OJK (denda, pencabutan izin)',
  },

  // ═══════════════════════════════════════════
  // T4: Kepatuhan & Anti-Korupsi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa unsur-unsur tindak pidana korupsi menurut UU No. 31/1999 jo. UU No. 20/2001?',
    options: [
      { key: 'A', text: 'Perbuatan melawan hukum memperkaya diri sendiri atau orang lain yang merugikan keuangan negara' },
      { key: 'B', text: 'Hanya pejabat pemerintah yang menerima suap dari perusahaan swasta' },
      { key: 'C', text: 'Karyawan swasta yang mengambil keuntungan dari penjualan produk perusahaan sendiri' },
      { key: 'D', text: 'Tindakan memonopoli pasar oleh satu perusahaan besar' },
      { key: 'E', text: 'Pelanggaran kontrak kerja antara karyawan dan perusahaan' },
    ],
    correct_answer: 'A',
    explanation: 'Unsur tindak pidana korupsi menurut **UU No. 31/1999 jo. UU No. 20/2001**:\n\n| Unsur | Penjelasan |\n|---|---|\n| **Setiap orang** | Orang perseorangan **atau korporasi** |\n| **Melawan hukum** | Bertentangan dengan hukum formal maupun materiil |\n| **Memperkaya** | Diri sendiri, orang lain, atau korporasi |\n| **Merugikan** | Keuangan negara atau perekonomian negara |\n\nJenis-jenis korupsi dalam UU:\n1. **Kerugian keuangan negara** (Pasal 2 & 3)\n2. **Suap-menyuap** (Pasal 5, 6, 11, 12, 13)\n3. **Penggelapan dalam jabatan** (Pasal 8, 9, 10)\n4. **Pemerasan** (Pasal 12 huruf e, f, g)\n5. **Perbuatan curang** (Pasal 7)\n6. **Benturan kepentingan dalam pengadaan** (Pasal 12 huruf i)\n7. **Gratifikasi** (Pasal 12B, 12C)\n\nAncaman pidana:\n- **Pasal 2**: penjara 4-20 tahun (seumur hidup jika dalam keadaan tertentu), denda Rp200 juta - Rp1 miliar\n- **Pasal 3**: penjara 1-20 tahun, denda Rp50 juta - Rp1 miliar\n\nRelevans bagi BUMN:\n- BUMN menggunakan **keuangan negara** → tunduk pada UU Tipikor\n- Kerugian BUMN = **kerugian keuangan negara**',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa peran *Compliance Officer* dalam perusahaan tambang?',
    options: [
      { key: 'A', text: 'Menjalankan operasi penambangan di lapangan dan mengawasi pekerja' },
      { key: 'B', text: 'Mengelola keuangan perusahaan dan menyusun laporan pajak' },
      { key: 'C', text: 'Merancang produk baru dan melakukan riset pemasaran' },
      { key: 'D', text: 'Memastikan perusahaan mematuhi peraturan, kebijakan internal, dan standar etika yang berlaku' },
      { key: 'E', text: 'Merekrut karyawan baru dan mengelola program pelatihan teknis' },
    ],
    correct_answer: 'D',
    explanation: '**Compliance Officer** = penanggung jawab **kepatuhan** perusahaan terhadap regulasi, kebijakan, dan standar etika.\n\nTugas dan tanggung jawab:\n\n| Area | Tugas |\n|---|---|\n| **Regulasi** | Memastikan kepatuhan terhadap UU Minerba, UU LH, UU Tipikor, dll. |\n| **Kebijakan internal** | Menyusun dan memperbarui SOP kepatuhan |\n| **Anti-korupsi** | Implementasi program anti-suap (ISO 37001) |\n| **Pelatihan** | Sosialisasi CoC dan regulasi kepada karyawan |\n| **Monitoring** | Pemantauan kepatuhan berkala |\n| **Pelaporan** | Mengelola whistleblowing system |\n| **Investigasi** | Menindaklanjuti laporan pelanggaran |\n| **Risiko** | Identifikasi dan mitigasi risiko kepatuhan |\n\nKualifikasi:\n- **Independen** dari unit bisnis yang diawasi\n- Memiliki akses **langsung ke Direksi** dan **Dewan Komisaris**\n- Keahlian di bidang **hukum, regulasi, dan etika bisnis**\n\nStruktur pelaporan:\n- Compliance Officer melapor ke **Direktur Utama** dan/atau **Dewan Komisaris**\n- Memiliki **dotted line** ke **Komite GCG/Audit**',
  },
  {
    order_index: 35,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *anti-money laundering* (AML) dan relevansinya bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Program penghematan biaya pencucian seragam kerja di laundry perusahaan' },
      { key: 'B', text: 'Upaya pencegahan dan pemberantasan pencucian uang, mengingat tambang dapat menjadi sarananya' },
      { key: 'C', text: 'Kebijakan tentang penggunaan mata uang asing dalam transaksi bisnis internasional' },
      { key: 'D', text: 'Program peningkatan kualitas air di area pertambangan' },
      { key: 'E', text: 'Sistem keamanan siber untuk melindungi data keuangan perusahaan dari peretas' },
    ],
    correct_answer: 'B',
    explanation: '***Anti-Money Laundering*** (AML) = upaya **pencegahan dan pemberantasan pencucian uang**.\n\nDasar hukum: **UU No. 8/2010** tentang Pencegahan dan Pemberantasan Tindak Pidana Pencucian Uang.\n\nTahapan pencucian uang:\n\n| Tahap | Nama | Contoh |\n|---|---|---|\n| 1 | **Placement** | Memasukkan uang haram ke sistem keuangan |\n| 2 | **Layering** | Memindahkan melalui berbagai transaksi kompleks |\n| 3 | **Integration** | Mengembalikan ke ekonomi legal sebagai uang bersih |\n\nModus di pertambangan:\n- **Tambang fiktif**: klaim produksi dari tambang yang tidak beroperasi\n- **Mark-up pengadaan**: harga pembelian alat/material dinaikkan\n- **Transfer pricing**: transaksi antar perusahaan afiliasi dengan harga tidak wajar\n- **Penjualan komoditas**: manipulasi harga jual/volume\n\nKewajiban perusahaan:\n- **Know Your Customer** (KYC): kenali mitra bisnis\n- **Suspicious Transaction Report** (STR): lapor ke PPATK\n- **Record keeping**: simpan catatan transaksi minimal 5 tahun\n- **Compliance program**: pelatihan, prosedur, monitoring',
  },
  {
    order_index: 36,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan prinsip *zero tolerance* dalam kebijakan anti-korupsi perusahaan?',
    options: [
      { key: 'A', text: 'Perusahaan tidak mentoleransi karyawan yang sering terlambat masuk kerja' },
      { key: 'B', text: 'Perusahaan tidak mengizinkan penggunaan perangkat pribadi di tempat kerja' },
      { key: 'C', text: 'Perusahaan tidak mentoleransi segala bentuk korupsi, suap, dan gratifikasi tanpa pengecualian' },
      { key: 'D', text: 'Perusahaan menolak semua vendor yang belum pernah bekerja sama sebelumnya' },
      { key: 'E', text: 'Perusahaan tidak memberikan toleransi keterlambatan dalam pengiriman produk' },
    ],
    correct_answer: 'C',
    explanation: '***Zero tolerance*** terhadap korupsi = perusahaan **tidak mentoleransi sama sekali** segala bentuk korupsi, suap, dan gratifikasi.\n\nImplementasi:\n\n| Aspek | Detail |\n|---|---|\n| **Kebijakan** | Dituangkan dalam CoC, kebijakan anti-korupsi |\n| **Komitmen top management** | Board of Directors menandatangani komitmen |\n| **Tanpa pengecualian** | Berlaku untuk semua level, tidak ada "uang kecil" |\n| **Sanksi tegas** | PHK, pidana, blacklist |\n| **Sosialisasi** | Pelatihan wajib dan berkala |\n| **Monitoring** | Audit, whistleblowing, review berkala |\n\nCakupan zero tolerance:\n- **Suap** (aktif maupun pasif)\n- **Gratifikasi** (pemberian terkait jabatan)\n- **Pemerasan** (meminta imbalan)\n- **Kickback** (komisi tidak resmi)\n- **Facilitation payment** (uang pelicin)\n- **Political donation** (sumbangan politik yang tidak transparan)\n\nMengapa penting:\n- Menunjukkan **komitmen nyata** perusahaan\n- Memberikan **kepastian** kepada karyawan tentang batasan\n- Memenuhi standar **ISO 37001** dan **FCPA/UK Bribery Act**\n- Melindungi perusahaan dari **risiko hukum** dan **reputasi**',
  },

  // ═══════════════════════════════════════════
  // T5: Manajemen Risiko Hukum & Kebijakan Publik (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 37,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *legal risk management* dan komponen utamanya?',
    options: [
      { key: 'A', text: 'Manajemen risiko yang hanya fokus pada risiko bencana alam di area tambang' },
      { key: 'B', text: 'Sistem pengelolaan arsip dokumen hukum perusahaan agar tersimpan rapi' },
      { key: 'C', text: 'Program pelatihan bahasa hukum untuk karyawan non-hukum' },
      { key: 'D', text: 'Asuransi jiwa yang diberikan perusahaan kepada seluruh karyawan' },
      { key: 'E', text: 'Proses sistematis mengidentifikasi, menilai, memitigasi, dan memantau risiko hukum perusahaan' },
    ],
    correct_answer: 'E',
    explanation: '***Legal risk management*** = proses sistematis mengelola **risiko hukum** yang berdampak pada perusahaan.\n\nKomponen utama:\n\n| Komponen | Detail |\n|---|---|\n| **Identifikasi** | Mapping seluruh risiko hukum (regulasi, kontrak, litigasi, kepatuhan) |\n| **Penilaian** | Mengukur probabilitas dan dampak setiap risiko |\n| **Mitigasi** | Strategi untuk mengurangi risiko (kontrak, asuransi, prosedur) |\n| **Monitoring** | Pemantauan berkala dan early warning system |\n| **Pelaporan** | Laporan risiko hukum ke manajemen dan komisaris |\n\nJenis risiko hukum di pertambangan:\n\n| Jenis | Contoh |\n|---|---|\n| **Regulasi** | Perubahan UU Minerba, larangan ekspor |\n| **Kontrak** | Wanprestasi vendor, sengketa JV |\n| **Litigasi** | Gugatan masyarakat, sengketa lahan |\n| **Kepatuhan** | Pelanggaran anti-korupsi, perizinan |\n| **Lingkungan** | Tuntutan pencemaran, PROPER |\n| **Ketenagakerjaan** | Sengketa hubungan industrial |\n\nTools:\n- **Risk register**: daftar risiko dengan penilaian dan mitigasi\n- **Heat map**: visualisasi probabilitas vs dampak\n- **KRI** (Key Risk Indicators): indikator peringatan dini',
  },
  {
    order_index: 38,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa perbedaan antara hukum pidana dan hukum perdata yang relevan bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Hukum pidana mengatur perbuatan yang dilarang (delik), hukum perdata mengatur hubungan antar pihak' },
      { key: 'B', text: 'Hukum pidana hanya untuk kasus pembunuhan, hukum perdata untuk semua kasus lainnya' },
      { key: 'C', text: 'Hukum pidana berlaku di pengadilan negeri, hukum perdata di pengadilan agama' },
      { key: 'D', text: 'Tidak ada perbedaan, keduanya digunakan bergantian untuk kasus yang sama' },
      { key: 'E', text: 'Hukum pidana untuk perusahaan besar, hukum perdata untuk perusahaan kecil' },
    ],
    correct_answer: 'A',
    explanation: 'Perbedaan **hukum pidana** dan **hukum perdata**:\n\n| Aspek | Hukum Pidana | Hukum Perdata |\n|---|---|---|\n| **Hubungan** | Individu/badan hukum **vs negara** | Antar **pihak swasta** |\n| **Tujuan** | **Menghukum** pelaku | **Ganti rugi** / pemulihan hak |\n| **Inisiatif** | **Negara** (jaksa penuntut umum) | **Pihak yang dirugikan** (penggugat) |\n| **Sanksi** | Penjara, denda pidana | Ganti rugi uang, eksekusi riil |\n| **Beban pembuktian** | **Beyond reasonable doubt** | **Preponderance of evidence** |\n| **Contoh di tambang** | Penambangan ilegal, korupsi | Sengketa kontrak, ganti rugi lingkungan |\n\nContoh kasus di pertambangan:\n\n| Kasus | Pidana | Perdata |\n|---|---|---|\n| **Pencemaran lingkungan** | Pidana lingkungan (UU 32/2009) | Gugatan ganti rugi masyarakat |\n| **Korupsi pengadaan** | Tipikor (UU 31/1999) | Gugatan kerugian perusahaan |\n| **Kecelakaan kerja fatal** | Kelalaian (KUHP) | Tuntutan ganti rugi keluarga korban |\n| **Penambangan ilegal** | Pidana (UU Minerba) | Gugatan pemegang IUP yang sah |\n\nSatu peristiwa bisa menimbulkan **dua jalur hukum** (pidana DAN perdata) secara bersamaan.',
  },
  {
    order_index: 39,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *compliance risk assessment* dan bagaimana penerapannya?',
    options: [
      { key: 'A', text: 'Pengukuran tingkat kepuasan pelanggan terhadap produk perusahaan' },
      { key: 'B', text: 'Penilaian kinerja keuangan perusahaan berdasarkan rasio profitabilitas' },
      { key: 'C', text: 'Survei kepuasan karyawan terhadap fasilitas kantor' },
      { key: 'D', text: 'Proses mengidentifikasi dan menilai risiko ketidakpatuhan terhadap peraturan dan standar yang berlaku' },
      { key: 'E', text: 'Perhitungan premi asuransi berdasarkan tingkat bahaya lokasi tambang' },
    ],
    correct_answer: 'D',
    explanation: '***Compliance risk assessment*** = proses **mengidentifikasi dan menilai risiko ketidakpatuhan** terhadap peraturan dan standar.\n\nLangkah-langkah:\n\n| Tahap | Kegiatan |\n|---|---|\n| 1. **Inventarisasi** | Daftar semua regulasi dan kebijakan yang berlaku |\n| 2. **Identifikasi risiko** | Area mana yang rentan terhadap pelanggaran |\n| 3. **Penilaian** | Ukur probabilitas dan dampak setiap risiko |\n| 4. **Prioritasi** | Ranking risiko berdasarkan tingkat keparahan |\n| 5. **Mitigasi** | Tentukan tindakan pengendalian |\n| 6. **Monitoring** | Pantau efektivitas pengendalian |\n\nArea risiko kepatuhan di pertambangan:\n\n| Area | Regulasi | Risiko |\n|---|---|---|\n| **Perizinan** | UU Minerba | Operasi tanpa izin lengkap |\n| **Lingkungan** | UU LH, AMDAL | Pencemaran, PROPER merah/hitam |\n| **Anti-korupsi** | UU Tipikor | Suap pejabat, gratifikasi |\n| **K3** | PP 50/2012 | Kecelakaan kerja fatal |\n| **Pajak** | UU Perpajakan | Penghindaran/penggelapan pajak |\n| **Ketenagakerjaan** | UU Cipta Kerja | Pelanggaran hak pekerja |\n\nOutput:\n- **Compliance risk register**: daftar risiko terstruktur\n- **Risk heat map**: visualisasi prioritas\n- **Action plan**: rencana mitigasi dengan PIC dan timeline',
  },
  {
    order_index: 40,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *class action* (gugatan kelompok) dan relevansinya bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Program pelatihan kelas bagi karyawan baru perusahaan' },
      { key: 'B', text: 'Gugatan yang diajukan satu atau lebih orang mewakili kelompok dengan dasar hukum yang sama' },
      { key: 'C', text: 'Tuntutan dari serikat pekerja untuk kenaikan gaji yang berlaku untuk seluruh karyawan' },
      { key: 'D', text: 'Protes massal di depan kantor perusahaan oleh masyarakat sekitar tambang' },
      { key: 'E', text: 'Audit kelompok yang dilakukan oleh beberapa kantor akuntan publik secara bersamaan' },
    ],
    correct_answer: 'B',
    explanation: '***Class action*** (gugatan perwakilan kelompok) = gugatan yang diajukan oleh **satu atau beberapa orang** yang mewakili **kelompok** dengan kepentingan yang sama.\n\nDasar hukum: **Perma No. 1 Tahun 2002** tentang Acara Gugatan Perwakilan Kelompok.\n\nSyarat class action:\n\n| Syarat | Penjelasan |\n|---|---|\n| **Numerosity** | Jumlah anggota kelompok sangat banyak |\n| **Commonality** | Kesamaan fakta dan dasar hukum |\n| **Typicality** | Tuntutan/pembelaan wakil kelompok mewakili semua |\n| **Adequacy** | Wakil kelompok memiliki kemampuan memadai |\n\nContoh di pertambangan:\n- Masyarakat sekitar menggugat perusahaan atas **pencemaran sungai** yang merusak sumber air dan mata pencaharian\n- Petani menggugat atas **kerusakan lahan pertanian** akibat debu tambang\n- Nelayan menggugat atas **pencemaran laut** yang mengurangi hasil tangkapan\n\nDampak bagi perusahaan:\n- **Ganti rugi besar**: kompensasi untuk seluruh anggota kelompok\n- **Reputasi**: publisitas negatif yang signifikan\n- **Operasional**: potensi penghentian sementara operasi\n- **Regulasi**: review izin dan kepatuhan lingkungan\n\nPerbedaan dengan gugatan biasa:\n- **Efisiensi**: satu proses untuk banyak penggugat\n- **Keadilan**: akses keadilan bagi korban individual yang tidak mampu menggugat sendiri',
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
