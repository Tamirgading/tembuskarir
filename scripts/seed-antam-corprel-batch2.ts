/**
 * ANTAM IMPACT 2026 — Corporate Relation (CRL) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Komunikasi Korporasi & Hubungan Media): 4 soal
 *   T2 (Manajemen Pemangku Kepentingan): 4 soal
 *   T3 (Manajemen Krisis & Reputasi): 4 soal
 *   T4 (Keterbukaan Informasi & Hukum Komunikasi): 4 soal
 *   T5 (Pemahaman Bisnis & Tata Kelola Perusahaan): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-corprel-batch2.ts
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
// A: 24,29,33,37 | B: 22,27,35,40 | C: 25,30,34,38 | D: 21,26,32,36 | E: 23,28,31,39

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Komunikasi Korporasi & Hubungan Media (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *spokesperson* (juru bicara) perusahaan dan apa kualifikasi yang diperlukan?',
    options: [
      { key: 'A', text: 'Karyawan magang yang ditugaskan menjawab telepon dari media' },
      { key: 'B', text: 'Konsultan PR eksternal yang mewakili perusahaan di semua kesempatan' },
      { key: 'C', text: 'Seluruh karyawan yang boleh berbicara kepada media tanpa batasan' },
      { key: 'D', text: 'Individu yang ditunjuk resmi untuk menyampaikan posisi dan pesan perusahaan kepada media dan publik' },
      { key: 'E', text: 'Robot AI yang menjawab pertanyaan media melalui chatbot otomatis' },
    ],
    correct_answer: 'D',
    explanation: '**Spokesperson** = individu yang **ditunjuk resmi** untuk mewakili perusahaan di hadapan media dan publik.\n\nKualifikasi:\n\n| Kualifikasi | Detail |\n|---|---|\n| **Penguasaan materi** | Memahami bisnis, operasi, dan isu perusahaan |\n| **Komunikasi** | Mampu menyampaikan pesan dengan jelas dan menarik |\n| **Media savvy** | Memahami cara kerja media dan teknik wawancara |\n| **Calm under pressure** | Tetap tenang saat menghadapi pertanyaan sulit |\n| **Otoritas** | Memiliki wewenang untuk menyampaikan posisi perusahaan |\n\nJenjang spokesperson:\n\n| Level Isu | Spokesperson |\n|---|---|\n| **Rutin** | Head of Corporate Communication |\n| **Penting** | Direktur terkait |\n| **Krisis major** | Direktur Utama / CEO |\n\nDo\'s and Don\'ts:\n- **Do**: stick to key messages, bridge ke pesan positif, gunakan data\n- **Don\'t**: spekulasi, off the record (tetap hati-hati), menjawab "no comment"\n- **Teknik**: bridging, flagging, hooking\n\nMedia training:\n- Simulasi wawancara (mock interview)\n- Pelatihan on-camera\n- Crisis simulation drill',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *earned media*, *owned media*, dan *paid media* dalam strategi komunikasi?',
    options: [
      { key: 'A', text: 'Ketiganya identik dan hanya berbeda istilah' },
      { key: 'B', text: 'Earned = pemberitaan organik; owned = kanal milik perusahaan; paid = ruang iklan yang dibeli' },
      { key: 'C', text: 'Earned media untuk perusahaan besar, owned media untuk UMKM, paid media untuk startup' },
      { key: 'D', text: 'Earned media berbayar, owned media gratis, paid media barter' },
      { key: 'E', text: 'Ketiganya hanya berlaku untuk media cetak, tidak untuk digital' },
    ],
    correct_answer: 'B',
    explanation: 'Tiga jenis media dalam strategi komunikasi (**PESO Model**):\n\n| Jenis | Definisi | Contoh | Kontrol |\n|---|---|---|---|\n| **Earned** | Pemberitaan **organik** yang diperoleh | Liputan berita, review, viral | Rendah |\n| **Owned** | Kanal **milik** perusahaan | Website, blog, media sosial, newsletter | Tinggi |\n| **Paid** | Ruang yang **dibeli** | Iklan, advertorial, sponsored content | Tinggi |\n| **Shared** | Konten yang **dibagikan** di media sosial | Share, retweet, user-generated content | Sedang |\n\nKeunggulan masing-masing:\n\n| Jenis | Keunggulan | Kelemahan |\n|---|---|---|\n| **Earned** | Kredibilitas tinggi, gratis | Tidak bisa dikontrol |\n| **Owned** | Kontrol penuh, low cost | Jangkauan terbatas |\n| **Paid** | Jangkauan luas, targeted | Biaya tinggi, kredibilitas lebih rendah |\n\nStrategi terbaik: **integrasi** ketiganya (converged media). Contoh:\n- **Owned**: publikasi berita di website perusahaan\n- **Paid**: boost konten di media sosial\n- **Earned**: media mengutip dan memberitakan',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *newsroom* digital perusahaan?',
    options: [
      { key: 'A', text: 'Ruangan fisik tempat jurnalis bekerja di kantor perusahaan' },
      { key: 'B', text: 'Studio televisi internal untuk memproduksi iklan perusahaan' },
      { key: 'C', text: 'Ruang meeting khusus untuk rapat direksi yang direkam' },
      { key: 'D', text: 'Laboratorium riset pasar yang menganalisis tren konsumen' },
      { key: 'E', text: 'Bagian website perusahaan yang menyediakan press release dan kontak media untuk jurnalis' },
    ],
    correct_answer: 'E',
    explanation: '**Digital newsroom** = bagian website perusahaan yang menyediakan **informasi untuk media**.\n\nKonten digital newsroom:\n\n| Konten | Fungsi |\n|---|---|\n| **Press release** | Siaran pers terbaru dan arsip |\n| **Media kit** | Fact sheet, profil perusahaan, data key |\n| **Foto/video** | Aset visual resolusi tinggi untuk media |\n| **Infografis** | Data visual yang mudah dipahami |\n| **Kontak media** | Nama, telepon, email PR |\n| **FAQ** | Jawaban untuk pertanyaan umum |\n| **Executive bios** | Profil dan foto pimpinan |\n| **Logo** | Logo perusahaan dalam berbagai format |\n\nManfaat:\n- **Efisiensi**: jurnalis bisa self-serve tanpa menghubungi PR\n- **Kontrol**: perusahaan menyediakan informasi yang akurat\n- **SEO**: meningkatkan visibilitas di mesin pencari\n- **24/7**: tersedia kapan saja, termasuk di luar jam kerja\n- **Analytics**: tracking siapa yang mengakses dan konten apa yang populer\n\nBest practice:\n- Update **real-time** saat ada berita baru\n- **Mobile-friendly** dan mudah dinavigasi\n- Sediakan fitur **subscribe** untuk notifikasi press release baru',
  },
  {
    order_index: 24,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *media briefing* dan kapan sebaiknya dilakukan?',
    options: [
      { key: 'A', text: 'Sesi tertutup dengan jurnalis terpilih untuk memberikan konteks isu tertentu menjelang pengumuman penting' },
      { key: 'B', text: 'Pengiriman brosur produk ke seluruh kantor media di Indonesia' },
      { key: 'C', text: 'Acara makan malam mewah dengan jurnalis untuk membina hubungan personal' },
      { key: 'D', text: 'Proses menyortir kliping berita dari media cetak setiap pagi' },
      { key: 'E', text: 'Pemasangan iklan halaman penuh di koran nasional' },
    ],
    correct_answer: 'A',
    explanation: '**Media briefing** = sesi **tertutup dan mendalam** dengan jurnalis terpilih untuk memberikan **konteks dan latar belakang**.\n\nPerbedaan dengan press conference:\n\n| Aspek | Media Briefing | Press Conference |\n|---|---|---|\n| **Skala** | Kecil (5-15 jurnalis) | Besar (20+ jurnalis) |\n| **Sifat** | Tertutup, mendalam | Terbuka, formal |\n| **Tujuan** | Konteks, background | Pengumuman resmi |\n| **Format** | Diskusi, Q&A mendalam | Presentasi + Q&A singkat |\n| **Atribusi** | Bisa on/off the record | Selalu on the record |\n\nKapan dilakukan:\n- **Menjelang pengumuman besar**: memberikan konteks agar pemberitaan lebih akurat\n- **Isu kompleks**: menjelaskan isu teknis (regulasi, keuangan, operasi)\n- **Pasca-krisis**: memberikan update mendalam tentang penanganan\n- **Perkenalan pimpinan baru**: CEO/direksi baru bertemu media\n\nTips:\n- Pilih jurnalis yang **menguasai topik** (beat reporter)\n- Siapkan **data dan fakta** pendukung\n- Tentukan **aturan atribusi** (on the record, background, off the record)\n- **Follow up** dengan materi tertulis setelah briefing',
  },

  // ═══════════════════════════════════════════
  // T2: Manajemen Pemangku Kepentingan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *CSR* (Corporate Social Responsibility) dan bagaimana implementasinya di perusahaan tambang?',
    options: [
      { key: 'A', text: 'Program pemasaran untuk meningkatkan penjualan produk perusahaan' },
      { key: 'B', text: 'Asuransi wajib yang dibayarkan perusahaan untuk melindungi aset' },
      { key: 'C', text: 'Program perusahaan untuk pembangunan berkelanjutan melalui kegiatan sosial dan lingkungan' },
      { key: 'D', text: 'Pembayaran pajak perusahaan kepada pemerintah daerah' },
      { key: 'E', text: 'Program rekrutmen karyawan dari universitas terkemuka' },
    ],
    correct_answer: 'C',
    explanation: '**CSR** = komitmen perusahaan untuk berkontribusi pada **pembangunan berkelanjutan**.\n\nDasar hukum:\n- **UU No. 40/2007** (PT): Pasal 74 — perusahaan yang berkaitan dengan SDA wajib CSR\n- **PP No. 47/2012**: Tanggung Jawab Sosial dan Lingkungan PT\n\nPilar CSR (ISO 26000):\n\n| Pilar | Contoh program di tambang |\n|---|---|\n| **Tata kelola** | GCG, transparansi |\n| **HAM** | Penghormatan hak masyarakat adat |\n| **Ketenagakerjaan** | K3, upah layak, pengembangan karyawan |\n| **Lingkungan** | Reklamasi, pengelolaan limbah, konservasi |\n| **Praktik bisnis adil** | Anti-korupsi, persaingan sehat |\n| **Konsumen** | Produk berkualitas, informasi jujur |\n| **Pengembangan masyarakat** | Pendidikan, kesehatan, ekonomi lokal |\n\nProgram CSR perusahaan tambang:\n- **Community Development**: pelatihan keterampilan, UMKM binaan\n- **Infrastruktur**: jalan, air bersih, sekolah, puskesmas\n- **Lingkungan**: rehabilitasi hutan, pembibitan\n- **Pendidikan**: beasiswa, laboratorium sekolah\n- **Kesehatan**: posyandu, penyuluhan kesehatan',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *investor relations* (hubungan investor)?',
    options: [
      { key: 'A', text: 'Kegiatan menjual saham perusahaan secara langsung kepada masyarakat di pasar tradisional' },
      { key: 'B', text: 'Program pemberian hadiah kepada investor loyal setiap akhir tahun' },
      { key: 'C', text: 'Kegiatan audit internal terhadap portofolio investasi perusahaan' },
      { key: 'D', text: 'Fungsi strategis yang mengintegrasikan komunikasi, keuangan, dan regulasi untuk hubungan dengan investor' },
      { key: 'E', text: 'Proses peminjaman uang dari bank untuk modal kerja perusahaan' },
    ],
    correct_answer: 'D',
    explanation: '**Investor relations** (IR) = fungsi strategis yang mengintegrasikan **komunikasi, keuangan, dan regulasi** untuk hubungan dengan **komunitas investasi**.\n\nKegiatan IR:\n\n| Kegiatan | Detail |\n|---|---|\n| **Earnings call** | Presentasi hasil keuangan kuartalan/tahunan |\n| **Analyst meeting** | Pertemuan dengan analis sekuritas |\n| **Roadshow** | Kunjungan ke investor institusional |\n| **Annual report** | Publikasi laporan tahunan |\n| **Public expose** | Presentasi publik wajib (BEI) |\n| **One-on-one meeting** | Pertemuan individual dengan investor |\n| **Site visit** | Kunjungan investor ke lokasi operasi |\n\nTarget audience:\n- **Institutional investors**: fund managers, pension funds\n- **Retail investors**: investor individu\n- **Sell-side analysts**: analis dari sekuritas\n- **Buy-side analysts**: analis dari fund management\n- **Rating agencies**: Moody\'s, S&P, Fitch\n\nMetrik IR:\n- **Share price performance**: kinerja harga saham\n- **Trading volume**: volume perdagangan\n- **Analyst coverage**: jumlah analis yang meliput\n- **Investor perception**: hasil survei persepsi investor',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *grievance mechanism* (mekanisme pengaduan) untuk masyarakat sekitar tambang?',
    options: [
      { key: 'A', text: 'Prosedur internal untuk menangani keluhan karyawan tentang kompensasi' },
      { key: 'B', text: 'Saluran pengaduan masyarakat untuk menyampaikan keluhan terkait dampak operasi secara aman dan mudah diakses' },
      { key: 'C', text: 'Sistem pengaduan ke kepolisian tentang tindak kriminal di area tambang' },
      { key: 'D', text: 'Formulir evaluasi pelanggan yang disediakan di toko emas' },
      { key: 'E', text: 'Hotline pengaduan pajak ke Ditjen Pajak' },
    ],
    correct_answer: 'B',
    explanation: '**Grievance mechanism** = **saluran pengaduan** untuk masyarakat sekitar agar dapat menyampaikan keluhan terkait **dampak operasi**.\n\nPrinsip (UNGP - UN Guiding Principles):\n\n| Prinsip | Detail |\n|---|---|\n| **Legitimate** | Dipercaya oleh pengguna |\n| **Accessible** | Mudah diakses, tanpa biaya, bahasa lokal |\n| **Predictable** | Proses dan timeline jelas |\n| **Equitable** | Adil, akses ke informasi dan sumber daya |\n| **Transparent** | Komunikasi terbuka tentang proses |\n| **Rights-compatible** | Sesuai dengan hak asasi manusia |\n| **Learning** | Menjadi bahan perbaikan berkelanjutan |\n\nSaluran:\n- **Kotak saran** di kantor desa/kelurahan\n- **Hotline** telepon/WhatsApp\n- **Kunjungan langsung** ke community relations office\n- **Forum pertemuan** berkala dengan masyarakat\n- **Aplikasi digital** (untuk masyarakat dengan akses internet)\n\nAlur penanganan:\n1. **Terima** keluhan dan catat\n2. **Acknowledge**: konfirmasi penerimaan ke pengadu\n3. **Investigate**: investigasi keluhan\n4. **Respond**: sampaikan hasil dan tindakan\n5. **Follow-up**: pastikan masalah terselesaikan\n6. **Close**: tutup kasus dengan persetujuan pengadu',
  },
  {
    order_index: 28,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *stakeholder engagement* dan *public relations*?',
    options: [
      { key: 'A', text: 'Keduanya identik dan tidak ada perbedaan dalam praktik' },
      { key: 'B', text: 'Stakeholder engagement hanya untuk pemegang saham, public relations untuk media' },
      { key: 'C', text: 'Stakeholder engagement bersifat satu arah, public relations dua arah' },
      { key: 'D', text: 'Stakeholder engagement hanya dilakukan saat krisis, public relations setiap hari' },
      { key: 'E', text: 'Stakeholder engagement adalah dialog dua arah dengan semua pemangku kepentingan, sedangkan PR fokus pada citra' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan **stakeholder engagement** dan **public relations**:\n\n| Aspek | Stakeholder Engagement | Public Relations |\n|---|---|---|\n| **Cakupan** | **Seluruh** pemangku kepentingan | Terutama **publik dan media** |\n| **Arah** | **Dua arah**, dialog | Cenderung **satu arah** (pesan ke publik) |\n| **Kedalaman** | **Mendalam**, partisipatif | Lebih **permukaan**, image-oriented |\n| **Tujuan** | **Membangun hubungan** dan kepercayaan | **Mengelola citra** dan reputasi |\n| **Metode** | Forum, konsultasi, FPIC, partnership | Press release, media event, iklan |\n| **Fokus** | **Kepentingan** stakeholder | **Pesan** perusahaan |\n\nStakeholder engagement meliputi:\n\n| Stakeholder | Kegiatan |\n|---|---|\n| **Masyarakat** | Community engagement, CSR, FPIC |\n| **Pemerintah** | Government relations, advokasi |\n| **Investor** | Investor relations, analyst meeting |\n| **Karyawan** | Internal communication, town hall |\n| **Media** | Media relations (overlap dengan PR) |\n| **LSM** | Dialog, kemitraan |\n\nKesimpulan: PR adalah **bagian dari** stakeholder engagement yang lebih luas.',
  },

  // ═══════════════════════════════════════════
  // T3: Manajemen Krisis & Reputasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *golden hour* dalam komunikasi krisis?',
    options: [
      { key: 'A', text: 'Periode 1-2 jam pertama setelah krisis yang menentukan narasi dan persepsi publik terhadap insiden' },
      { key: 'B', text: 'Jam kerja paling produktif karyawan yaitu pukul 09.00-10.00 pagi' },
      { key: 'C', text: 'Waktu terbaik untuk mengirim press release yaitu saat pasar saham dibuka' },
      { key: 'D', text: 'Jam makan siang yang dijadwalkan untuk meeting dengan klien' },
      { key: 'E', text: 'Periode satu jam sebelum deadline pengiriman laporan tahunan' },
    ],
    correct_answer: 'A',
    explanation: '**Golden hour** = **1-2 jam pertama** setelah krisis, di mana **respons awal** sangat menentukan.\n\nMengapa kritis:\n\n| Alasan | Detail |\n|---|---|\n| **Narasi terbentuk** | Media dan publik membentuk opini dalam jam pertama |\n| **Vacuum** | Tanpa respons perusahaan, pihak lain mengisi narasi |\n| **Viral** | Informasi menyebar cepat di media sosial |\n| **Trust** | Respons cepat menunjukkan perusahaan serius dan transparan |\n\nYang harus dilakukan dalam golden hour:\n\n| Menit ke- | Tindakan |\n|---|---|\n| **0-15** | Aktifkan tim krisis, kumpulkan fakta awal |\n| **15-30** | Tentukan spokesperson, siapkan holding statement |\n| **30-60** | Rilis holding statement ke media |\n| **60-120** | Update pertama dengan informasi tambahan |\n\nHolding statement minimal berisi:\n1. **Acknowledgment**: "Kami mengetahui bahwa telah terjadi..."\n2. **Empathy**: "Keselamatan... adalah prioritas utama kami"\n3. **Action**: "Kami sedang melakukan... dan berkoordinasi dengan..."\n4. **Commitment**: "Kami akan memberikan update lebih lanjut"\n\nKesalahan fatal: **diam** selama golden hour → publik menganggap perusahaan tidak peduli atau menyembunyikan sesuatu.',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *crisis simulation drill* dan mengapa penting?',
    options: [
      { key: 'A', text: 'Latihan evakuasi kebakaran yang dilakukan setiap tahun di gedung kantor' },
      { key: 'B', text: 'Simulasi komputer untuk memprediksi harga komoditas di masa depan' },
      { key: 'C', text: 'Latihan simulasi penanganan krisis komunikasi untuk menguji kesiapan tim dan efektivitas protokol' },
      { key: 'D', text: 'Ujian tertulis tentang teori manajemen krisis untuk karyawan baru' },
      { key: 'E', text: 'Simulasi pasar saham untuk melatih tim investor relations' },
    ],
    correct_answer: 'C',
    explanation: '**Crisis simulation drill** = latihan simulasi **penanganan krisis komunikasi** yang realistis.\n\nKomponen drill:\n\n| Komponen | Detail |\n|---|---|\n| **Skenario** | Situasi krisis realistis (kecelakaan, pencemaran, viral negatif) |\n| **Injects** | Perkembangan baru selama simulasi (berita baru, pertanyaan media) |\n| **Tim krisis** | CEO, Corp Comm, Legal, HR, Operasional |\n| **Simulated media** | Jurnalis role-play yang memberikan tekanan |\n| **Timeline** | Dijalankan dalam waktu nyata (2-4 jam) |\n| **Observer** | Evaluator yang mengamati dan mencatat |\n\nYang diuji:\n\n| Area | Indikator |\n|---|---|\n| **Kecepatan** | Berapa lama sampai holding statement keluar? |\n| **Koordinasi** | Apakah tim krisis berkomunikasi efektif? |\n| **Pesan** | Apakah key messages konsisten dan tepat? |\n| **Spokesperson** | Apakah juru bicara tampil percaya diri? |\n| **Prosedur** | Apakah crisis communication plan diikuti? |\n| **Social media** | Apakah respons di media sosial tepat? |\n\nFrekuensi: minimal **1-2 kali per tahun**, dengan skenario berbeda.\n\nOutput: **After Action Report** dengan rekomendasi perbaikan.',
  },
  {
    order_index: 31,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *reputational risk* dan bagaimana perusahaan tambang mengelolanya?',
    options: [
      { key: 'A', text: 'Risiko kerusakan mesin produksi yang mempengaruhi kapasitas pabrik' },
      { key: 'B', text: 'Risiko penurunan harga komoditas di pasar internasional' },
      { key: 'C', text: 'Risiko keterlambatan pengiriman produk ke pelanggan' },
      { key: 'D', text: 'Risiko bencana alam yang merusak infrastruktur tambang' },
      { key: 'E', text: 'Risiko persepsi negatif terhadap perusahaan yang dapat mengancam nilai dan keberlanjutan operasi' },
    ],
    correct_answer: 'E',
    explanation: '**Reputational risk** = risiko **persepsi negatif** yang dapat mengancam **nilai perusahaan dan keberlanjutan operasi**.\n\nSumber reputational risk di tambang:\n\n| Sumber | Contoh |\n|---|---|\n| **Lingkungan** | Pencemaran, deforestasi, limbah |\n| **Keselamatan** | Kecelakaan fatal, penyakit kerja |\n| **Sosial** | Konflik masyarakat, pelanggaran HAM |\n| **Governance** | Korupsi, ketidaktransparanan |\n| **Operasional** | Produk cacat, keterlambatan |\n| **Legal** | Gugatan, sanksi regulator |\n\nDampak:\n- **Finansial**: penurunan harga saham, kesulitan pendanaan\n- **Operasional**: penolakan masyarakat, pencabutan izin\n- **SDM**: kesulitan merekrut talenta\n- **Bisnis**: kehilangan pelanggan dan mitra\n\nPengelolaan:\n\n| Langkah | Kegiatan |\n|---|---|\n| **Identify** | Risk mapping khusus reputasi |\n| **Assess** | Ukur probabilitas dan dampak |\n| **Mitigate** | PR proaktif, stakeholder engagement, GCG |\n| **Monitor** | Media monitoring, sentiment analysis |\n| **Respond** | Crisis communication plan |\n| **Recover** | Reputation recovery program |',
  },
  {
    order_index: 32,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *key messages* dalam komunikasi krisis?',
    options: [
      { key: 'A', text: 'Password yang digunakan untuk mengakses sistem komunikasi darurat perusahaan' },
      { key: 'B', text: 'Daftar nomor telepon darurat untuk menghubungi polisi dan rumah sakit' },
      { key: 'C', text: 'Jadwal rapat darurat yang harus dihadiri oleh seluruh manajemen' },
      { key: 'D', text: 'Pesan inti yang disiapkan dan disampaikan secara konsisten oleh seluruh spokesperson selama krisis' },
      { key: 'E', text: 'Kata sandi yang digunakan tim krisis untuk berkomunikasi secara rahasia' },
    ],
    correct_answer: 'D',
    explanation: '**Key messages** = **pesan inti** yang disampaikan **secara konsisten** oleh semua spokesperson.\n\nKarakteristik key messages yang baik:\n\n| Karakteristik | Detail |\n|---|---|\n| **Singkat** | 2-3 pesan utama, masing-masing 1-2 kalimat |\n| **Jelas** | Tidak ambigu, mudah dipahami |\n| **Konsisten** | Sama dari semua spokesperson |\n| **Empati** | Menunjukkan kepedulian |\n| **Action-oriented** | Menjelaskan tindakan yang diambil |\n| **Factual** | Berdasarkan fakta, tidak spekulasi |\n\nStruktur key message (krisis kecelakaan):\n\n| No | Pesan |\n|---|---|\n| 1 | "Keselamatan karyawan dan masyarakat adalah prioritas utama kami" (empati) |\n| 2 | "Kami telah mengambil langkah X, Y, Z untuk menangani situasi" (aksi) |\n| 3 | "Kami berkoordinasi dengan pihak berwenang dan akan memberikan update berkala" (komitmen) |\n\nAdaptasi per audiens:\n- **Media**: fakta, data, kutipan\n- **Karyawan**: informasi internal, instruksi\n- **Masyarakat**: dampak dan penanganan lokal\n- **Investor**: dampak finansial dan mitigasi\n- **Regulator**: kepatuhan dan tindakan korektif',
  },

  // ═══════════════════════════════════════════
  // T4: Keterbukaan Informasi & Hukum Komunikasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *public expose* yang diwajibkan oleh Bursa Efek Indonesia (BEI)?',
    options: [
      { key: 'A', text: 'Presentasi terbuka emiten tentang kinerja dan rencana bisnis yang diwajibkan oleh BEI' },
      { key: 'B', text: 'Pameran produk perusahaan di pusat perbelanjaan' },
      { key: 'C', text: 'Publikasi foto-foto pribadi direksi di media sosial perusahaan' },
      { key: 'D', text: 'Kegiatan membuka pintu kantor untuk umum setiap hari Jumat' },
      { key: 'E', text: 'Program magang untuk mahasiswa dari universitas tertentu' },
    ],
    correct_answer: 'A',
    explanation: '**Public expose** = presentasi terbuka oleh emiten tentang **kinerja dan rencana bisnis**.\n\nKetentuan BEI:\n\n| Aspek | Ketentuan |\n|---|---|\n| **Frekuensi** | Minimal 1 kali per tahun (wajib), bisa lebih |\n| **Format** | Presentasi + Q&A |\n| **Peserta** | Analis, investor, media, publik |\n| **Materi** | Kinerja keuangan, operasional, prospek, strategi |\n| **Publikasi** | Materi harus dipublikasikan di website perusahaan |\n\nKonten yang disampaikan:\n\n| Konten | Detail |\n|---|---|\n| **Kinerja keuangan** | Pendapatan, laba, aset, rasio |\n| **Operasional** | Produksi, penjualan, proyek |\n| **Strategi** | Rencana ekspansi, investasi, efisiensi |\n| **Prospek** | Outlook industri dan perusahaan |\n| **Aksi korporasi** | Dividen, right issue, akuisisi |\n| **ESG** | Kinerja sustainability |\n\nTujuan:\n- **Keterbukaan**: memenuhi regulasi BEI dan OJK\n- **Transparansi**: memberikan informasi yang setara ke semua investor\n- **Valuasi**: membantu analis membuat proyeksi yang akurat\n- **Kepercayaan**: membangun trust dengan komunitas investasi',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *informasi material* dalam konteks pasar modal?',
    options: [
      { key: 'A', text: 'Informasi tentang bahan baku (material) yang digunakan dalam proses produksi' },
      { key: 'B', text: 'Data inventaris material dan spare part di gudang perusahaan' },
      { key: 'C', text: 'Informasi penting yang dapat mempengaruhi harga efek dan wajib diungkapkan tepat waktu oleh emiten' },
      { key: 'D', text: 'Spesifikasi teknis material konstruksi yang digunakan untuk membangun smelter' },
      { key: 'E', text: 'Daftar vendor material yang telah disetujui oleh departemen procurement' },
    ],
    correct_answer: 'C',
    explanation: '**Informasi material** = informasi yang dapat **mempengaruhi harga efek** atau **keputusan investasi**.\n\nContoh informasi material:\n\n| Kategori | Contoh |\n|---|---|\n| **Keuangan** | Laba/rugi signifikan, perubahan auditor, gagal bayar |\n| **Operasional** | Penemuan cadangan baru, kecelakaan besar, penghentian operasi |\n| **Korporasi** | Merger/akuisisi, pergantian direksi, delisting |\n| **Hukum** | Gugatan material, sanksi regulator |\n| **Regulasi** | Perubahan izin, larangan ekspor baru |\n\nKewajiban pengungkapan:\n\n| Aspek | Ketentuan |\n|---|---|\n| **Waktu** | Paling lambat **akhir hari kerja ke-2** setelah terjadi |\n| **Media** | Ke BEI, OJK, dan publik (website) |\n| **Kelengkapan** | Harus mencakup: apa, kapan, di mana, dampak |\n| **Akurasi** | Informasi harus benar dan tidak menyesatkan |\n\nSanksi atas keterlambatan/ketidakungkapan:\n- **Administratif**: teguran, denda\n- **Pidana**: insider trading jika informasi digunakan untuk perdagangan sebelum diungkapkan\n- **Perdata**: gugatan ganti rugi dari investor yang dirugikan',
  },
  {
    order_index: 35,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *PPID* (Pejabat Pengelola Informasi dan Dokumentasi) di BUMN?',
    options: [
      { key: 'A', text: 'Petugas keamanan yang menjaga dokumen rahasia perusahaan' },
      { key: 'B', text: 'Pejabat pengelola layanan informasi publik di badan publik sesuai UU KIP' },
      { key: 'C', text: 'Teknisi IT yang mengelola server dan database perusahaan' },
      { key: 'D', text: 'Auditor internal yang memeriksa dokumen keuangan' },
      { key: 'E', text: 'Notaris yang mengesahkan dokumen perusahaan' },
    ],
    correct_answer: 'B',
    explanation: '**PPID** = pejabat yang bertanggung jawab mengelola **layanan informasi publik** di badan publik.\n\nDasar hukum: **UU KIP No. 14/2008** dan peraturan turunannya.\n\nTugas PPID:\n\n| Tugas | Detail |\n|---|---|\n| **Penyediaan** | Menyediakan informasi yang wajib disediakan dan diumumkan |\n| **Penyimpanan** | Mengelola arsip informasi publik |\n| **Pendokumentasian** | Mendokumentasikan informasi secara sistematis |\n| **Pelayanan** | Melayani permohonan informasi dari masyarakat |\n| **Penetapan** | Menetapkan informasi yang dikecualikan |\n| **Pelaporan** | Menyusun laporan layanan informasi tahunan |\n\nProses permohonan informasi:\n1. Pemohon mengajukan permohonan tertulis ke PPID\n2. PPID memeriksa dan merespons dalam **10 hari kerja** (bisa diperpanjang 7 hari)\n3. Jika ditolak: pemohon bisa **keberatan** ke atasan PPID\n4. Jika masih ditolak: sengketa ke **Komisi Informasi**\n\nDi BUMN:\n- PPID biasanya melekat pada fungsi **Corporate Secretary** atau **Corporate Communication**\n- Harus menyeimbangkan **keterbukaan** dengan **perlindungan rahasia dagang**',
  },
  {
    order_index: 36,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *pencemaran nama baik* dalam konteks hukum komunikasi?',
    options: [
      { key: 'A', text: 'Pencemaran lingkungan yang merusak nama baik daerah di sekitar tambang' },
      { key: 'B', text: 'Menulis nama seseorang dengan ejaan yang salah dalam dokumen resmi' },
      { key: 'C', text: 'Mengubah nama perusahaan tanpa persetujuan pemegang saham' },
      { key: 'D', text: 'Perbuatan menyerang kehormatan atau nama baik seseorang agar hal itu diketahui umum melalui media' },
      { key: 'E', text: 'Pemalsuan tanda tangan pada dokumen resmi perusahaan' },
    ],
    correct_answer: 'D',
    explanation: '**Pencemaran nama baik** = menyerang **kehormatan atau nama baik** seseorang dengan cara **menuduh sesuatu hal** agar diketahui umum.\n\nDasar hukum:\n\n| Regulasi | Pasal | Tentang |\n|---|---|---|\n| **KUHP** | 310-321 | Pencemaran lisan dan tertulis |\n| **UU ITE** | 27 ayat 3 | Pencemaran melalui media elektronik |\n\nUnsur:\n1. **Dengan sengaja** menyerang kehormatan/nama baik\n2. **Menuduhkan sesuatu hal** (bukan opini umum)\n3. **Dimaksudkan** agar diketahui umum\n4. **Tidak dapat dibuktikan** kebenarannya (untuk pidana)\n\nRelevansi bagi corporate relation:\n\n| Situasi | Risiko |\n|---|---|\n| **Press release** | Konten yang menuduh pihak lain |\n| **Media sosial** | Postingan yang mencemarkan kompetitor |\n| **Internal memo** | Jika bocor dan memuat tuduhan |\n| **Spokesperson** | Pernyataan yang menyerang pihak lain |\n\nPerlindungan:\n- **Fakta yang benar** dan dapat dibuktikan\n- **Kepentingan umum** (pembelaan)\n- **Fair comment**: opini yang berdasarkan fakta\n- **Hati-hati** dalam setiap komunikasi publik',
  },

  // ═══════════════════════════════════════════
  // T5: Pemahaman Bisnis & Tata Kelola Perusahaan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 37,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa peran komunikasi dalam mendukung *change management* (manajemen perubahan) di perusahaan?',
    options: [
      { key: 'A', text: 'Komunikasi strategis membantu karyawan memahami perubahan sehingga mengurangi resistensi dan meningkatkan adopsi' },
      { key: 'B', text: 'Komunikasi hanya perlu dilakukan setelah perubahan selesai diimplementasikan' },
      { key: 'C', text: 'Perubahan sebaiknya dilakukan secara diam-diam tanpa pemberitahuan kepada karyawan' },
      { key: 'D', text: 'Komunikasi perubahan cukup melalui email satu kali ke seluruh karyawan' },
      { key: 'E', text: 'Perubahan hanya perlu dikomunikasikan kepada level manajer ke atas' },
    ],
    correct_answer: 'A',
    explanation: '**Komunikasi** dalam **change management** membantu mengurangi **resistensi** dan meningkatkan **adopsi**.\n\nModel ADKAR (Prosci):\n\n| Tahap | Peran Komunikasi |\n|---|---|\n| **Awareness** | Mengapa perubahan diperlukan? |\n| **Desire** | Apa manfaatnya bagi saya? |\n| **Knowledge** | Bagaimana cara berubah? |\n| **Ability** | Dukungan apa yang tersedia? |\n| **Reinforcement** | Pengakuan atas perubahan yang berhasil |\n\nPrinsip komunikasi perubahan:\n\n| Prinsip | Detail |\n|---|---|\n| **Early** | Komunikasikan sedini mungkin |\n| **Honest** | Jujur tentang dampak positif dan negatif |\n| **Consistent** | Pesan yang konsisten dari semua level |\n| **Two-way** | Buka saluran untuk feedback dan pertanyaan |\n| **Multi-channel** | Gunakan berbagai kanal (town hall, email, video, one-on-one) |\n| **Leader-led** | Pimpinan harus menjadi champion perubahan |\n\nContoh di pertambangan:\n- Restrukturisasi organisasi\n- Implementasi sistem ERP baru\n- Perubahan kebijakan K3\n- Transisi energi (dekarbonisasi)',
  },
  {
    order_index: 38,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *tata kelola informasi antar departemen* dan mengapa penting?',
    options: [
      { key: 'A', text: 'Pengaturan jadwal rapat antar departemen setiap minggu' },
      { key: 'B', text: 'Pengadaan perangkat komputer untuk setiap departemen' },
      { key: 'C', text: 'Sistem dan prosedur yang mengatur aliran, akses, dan konsistensi informasi antar unit kerja' },
      { key: 'D', text: 'Pengaturan tempat duduk karyawan dari departemen berbeda di kantin' },
      { key: 'E', text: 'Kebijakan tentang penggunaan seragam yang berbeda untuk setiap departemen' },
    ],
    correct_answer: 'C',
    explanation: '**Tata kelola informasi antar departemen** = sistem yang mengatur **aliran, akses, dan konsistensi informasi** antar unit kerja.\n\nMasalah tanpa tata kelola yang baik:\n\n| Masalah | Dampak |\n|---|---|\n| **Information silo** | Departemen tidak berbagi data |\n| **Inkonsistensi** | Data berbeda antar departemen |\n| **Duplikasi** | Pekerjaan yang sama dilakukan berulang |\n| **Keterlambatan** | Informasi tidak sampai tepat waktu |\n| **Miscommunication** | Pesan yang berbeda ke stakeholder |\n\nKomponen tata kelola informasi:\n\n| Komponen | Detail |\n|---|---|\n| **SOP** | Prosedur aliran informasi yang jelas |\n| **Platform** | Sistem informasi terintegrasi (ERP, intranet) |\n| **Akses** | Pengaturan siapa boleh mengakses apa |\n| **Klasifikasi** | Publik, internal, rahasia, sangat rahasia |\n| **Review** | Proses verifikasi sebelum informasi dikirim keluar |\n\nPeR corporate relation:\n- **One voice**: memastikan pesan perusahaan **konsisten** dari semua departemen\n- **Clearance**: proses persetujuan sebelum informasi keluar\n- **Bridging**: menjembatani informasi dari operasional ke komunikasi',
  },
  {
    order_index: 39,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa peran *corporate communication* dalam mendukung inisiatif strategis perusahaan?',
    options: [
      { key: 'A', text: 'Hanya membuat poster dan spanduk untuk acara perusahaan' },
      { key: 'B', text: 'Hanya mengelola akun media sosial perusahaan' },
      { key: 'C', text: 'Hanya menulis laporan tahunan dan press release' },
      { key: 'D', text: 'Hanya mengatur protokol acara seremonial perusahaan' },
      { key: 'E', text: 'Merancang strategi komunikasi untuk mendukung pencapaian tujuan bisnis' },
    ],
    correct_answer: 'E',
    explanation: '**Corporate communication** mendukung **inisiatif strategis** melalui komunikasi yang terencana.\n\nPeran strategis:\n\n| Peran | Contoh |\n|---|---|\n| **Positioning** | Memposisikan perusahaan sebagai pemimpin industri |\n| **Narrative building** | Membangun cerita (narasi) yang mendukung strategi |\n| **Stakeholder alignment** | Menyelaraskan pemahaman stakeholder |\n| **Reputation management** | Mengelola dan melindungi reputasi proaktif |\n| **Change communication** | Mendukung transformasi organisasi |\n\nContoh dukungan untuk inisiatif strategis:\n\n| Inisiatif | Dukungan Komunikasi |\n|---|---|\n| **Hilirisasi** | Narasi tentang nilai tambah dan kontribusi nasional |\n| **Dekarbonisasi** | Storytelling tentang komitmen lingkungan |\n| **Digital transformation** | Internal comms untuk adopsi teknologi |\n| **IPO/right issue** | Investor relations, media campaign |\n| **Akuisisi** | Stakeholder management, integration comms |\n\nMetrik keberhasilan:\n- **Awareness**: apakah stakeholder tahu tentang inisiatif?\n- **Understanding**: apakah mereka paham?\n- **Support**: apakah mereka mendukung?\n- **Advocacy**: apakah mereka mau mempromosikan?',
  },
  {
    order_index: 40,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *employer branding* dan mengapa penting bagi perusahaan tambang?',
    options: [
      { key: 'A', text: 'Proses membuat seragam karyawan dengan logo perusahaan' },
      { key: 'B', text: 'Strategi membangun citra perusahaan sebagai tempat kerja yang menarik bagi talenta terbaik' },
      { key: 'C', text: 'Pemberian label nama pada meja kerja setiap karyawan' },
      { key: 'D', text: 'Program sertifikasi teknis yang diwajibkan untuk semua karyawan' },
      { key: 'E', text: 'Kegiatan mengiklankan produk perusahaan di job fair' },
    ],
    correct_answer: 'B',
    explanation: '**Employer branding** = strategi membangun **citra sebagai tempat kerja yang menarik** bagi talenta terbaik.\n\nKomponen employer branding:\n\n| Komponen | Detail |\n|---|---|\n| **Employee Value Proposition** (EVP) | Apa yang membuat bekerja di sini istimewa? |\n| **Budaya kerja** | Nilai, lingkungan, work-life balance |\n| **Pengembangan karir** | Pelatihan, promosi, rotasi |\n| **Kompensasi** | Gaji, tunjangan, benefit |\n| **Purpose** | Kontribusi perusahaan ke masyarakat/lingkungan |\n\nMengapa penting di tambang:\n- **Lokasi remote**: sulit menarik talenta ke site terpencil\n- **Persepsi negatif**: industri tambang sering dipandang negatif (lingkungan)\n- **Kompetisi talenta**: bersaing dengan tech, finance, startup\n- **Generasi baru**: milenial dan Gen Z mencari purpose, bukan hanya gaji\n\nStrategi employer branding:\n\n| Strategi | Contoh |\n|---|---|\n| **Campus branding** | Roadshow ke kampus, program magang |\n| **Employee stories** | Testimoni karyawan di media sosial |\n| **Awards** | Great Place to Work, Best Employer |\n| **Social media** | LinkedIn, Instagram career page |\n| **Career site** | Website karir yang menarik dan informatif |\n\nMetrik:\n- **Application rate**: jumlah pelamar per posisi\n- **Quality of hire**: kualitas karyawan baru\n- **Employee turnover**: tingkat keluar masuk\n- **Glassdoor rating**: rating dari karyawan',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-corprel')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-corprel tidak ditemukan:', pkgErr)
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
