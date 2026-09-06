/**
 * ANTAM IMPACT 2026 — Quality Control (QC) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Prinsip Dasar QA/QC): 4 soal
 *   T2 (Teknik Sampling & Preparasi): 4 soal
 *   T3 (Kimia Analitik & Instrumen): 4 soal
 *   T4 (Analisis Statistik untuk Mutu): 4 soal
 *   T5 (Sistem Manajemen Mutu Lab): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-qc-batch1.ts
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
// A: 3,8,11,18 | B: 1,9,15,19 | C: 4,6,13,20 | D: 2,10,14,17 | E: 5,7,12,16

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Prinsip Dasar QA/QC (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa perbedaan mendasar antara *Quality Assurance* (QA) dan *Quality Control* (QC)?',
    options: [
      { key: 'A', text: 'QA berfokus pada produk akhir, QC berfokus pada proses produksi' },
      { key: 'B', text: 'QA berfokus pada pencegahan cacat melalui proses, QC berfokus pada deteksi cacat pada produk' },
      { key: 'C', text: 'QA dilakukan oleh pihak eksternal, QC dilakukan oleh pihak internal' },
      { key: 'D', text: 'QA hanya untuk industri manufaktur, QC hanya untuk industri tambang' },
      { key: 'E', text: 'QA bersifat sementara, QC bersifat permanen dalam organisasi' },
    ],
    correct_answer: 'B',
    explanation: 'Perbedaan mendasar **QA** dan **QC**:\n\n| Aspek | Quality Assurance (QA) | Quality Control (QC) |\n|---|---|---|\n| **Fokus** | **Pencegahan** cacat | **Deteksi** cacat |\n| Pendekatan | Berorientasi **proses** | Berorientasi **produk** |\n| Sifat | **Proaktif** | **Reaktif** |\n| Waktu | Sepanjang proses | Pada titik inspeksi |\n| Contoh | SOP, pelatihan, kalibrasi | Pengujian sampel, inspeksi visual |\n\nContoh di laboratorium tambang:\n- **QA**: memastikan SOP analisis diikuti, alat terkalibrasi, analis terlatih\n- **QC**: menganalisis *blanks*, *duplicates*, *certified reference materials* (CRM) untuk memverifikasi hasil',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *Non-Conformance Report* (NCR) dalam sistem mutu?',
    options: [
      { key: 'A', text: 'Laporan keuangan yang menunjukkan kerugian akibat produk cacat' },
      { key: 'B', text: 'Surat peringatan yang diberikan kepada karyawan yang lalai' },
      { key: 'C', text: 'Catatan keluhan pelanggan yang diterima melalui layanan purna jual' },
      { key: 'D', text: 'Dokumen yang mencatat penyimpangan dari standar atau spesifikasi yang ditetapkan' },
      { key: 'E', text: 'Formulir permintaan pengadaan bahan baku pengganti' },
    ],
    correct_answer: 'D',
    explanation: '***Non-Conformance Report*** (NCR) adalah **dokumen resmi** yang mencatat **penyimpangan** dari standar, spesifikasi, atau prosedur yang ditetapkan.\n\nIsi NCR:\n1. **Deskripsi ketidaksesuaian**: apa yang menyimpang dari standar\n2. **Analisis penyebab**: mengapa terjadi (menggunakan 5 Whys, fishbone, dll.)\n3. **Tindakan korektif**: apa yang dilakukan untuk memperbaiki\n4. **Tindakan pencegahan**: bagaimana mencegah terulangnya\n5. **Verifikasi**: bukti bahwa tindakan korektif efektif\n\nContoh NCR di laboratorium tambang:\n- Hasil analisis CRM di luar batas kontrol\n- Sampel tidak dipreparasi sesuai SOP\n- Alat ukur melewati tanggal kalibrasi',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'easy',
    content: 'Parameter kualitas apa yang paling penting untuk bijih nikel laterit yang akan dikirim ke smelter?',
    options: [
      { key: 'A', text: 'Kadar nikel (Ni), kadar besi (Fe), rasio Ni/Fe, dan kadar air' },
      { key: 'B', text: 'Warna dan kilap mineral yang terlihat secara visual' },
      { key: 'C', text: 'Berat jenis dan porositas batuan induk' },
      { key: 'D', text: 'Umur geologi dan asal formasi batuan' },
      { key: 'E', text: 'Kekerasan mineral dan daya tahan terhadap pelapukan' },
    ],
    correct_answer: 'A',
    explanation: 'Parameter kualitas kritis bijih **nikel laterit** untuk smelter:\n\n| Parameter | Spesifikasi umum | Alasan |\n|---|---|---|\n| **Kadar Ni** | > 1,6-1,8% | Menentukan nilai ekonomis |\n| **Kadar Fe** | Bervariasi | Mempengaruhi proses peleburan |\n| **Rasio Ni/Fe** | Disesuaikan proses | Menentukan jenis smelter |\n| **Kadar air** (*moisture*) | < 34-35% | Efisiensi energi peleburan |\n| **SiO$_2$/MgO** | Disesuaikan | Komposisi terak (*slag*) |\n\nKadar air sangat kritis karena:\n- Mempengaruhi **tonase aktual** (berat kering vs basah)\n- Kadar air tinggi memerlukan **energi lebih besar** untuk pengeringan\n- Regulasi **ESDM** membatasi kadar air bijih yang boleh diangkut',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa tujuan penerapan *Corrective Action Preventive Action* (CAPA) dalam sistem mutu?',
    options: [
      { key: 'A', text: 'Menghitung kerugian finansial dari setiap produk yang tidak memenuhi standar' },
      { key: 'B', text: 'Menentukan hukuman disiplin bagi pekerja yang menyebabkan cacat produk' },
      { key: 'C', text: 'Mengatasi ketidaksesuaian yang terjadi dan mencegah terulangnya di masa depan' },
      { key: 'D', text: 'Mengganti seluruh peralatan yang sudah tidak memenuhi spesifikasi teknis' },
      { key: 'E', text: 'Membuat laporan tahunan tentang jumlah cacat produk kepada regulator' },
    ],
    correct_answer: 'C',
    explanation: '**CAPA** = ***Corrective Action Preventive Action***:\n\n**Corrective Action** (Tindakan Korektif):\n- Mengatasi **ketidaksesuaian yang sudah terjadi**\n- Menghilangkan **akar penyebab** agar tidak terulang\n- Contoh: rekalibrasi alat yang memberikan hasil salah\n\n**Preventive Action** (Tindakan Pencegahan):\n- Mengidentifikasi **potensi ketidaksesuaian** sebelum terjadi\n- Menerapkan tindakan untuk **mencegah** terjadinya\n- Contoh: menjadwalkan kalibrasi rutin sebelum alat menyimpang\n\nSiklus CAPA:\n1. Identifikasi masalah\n2. Investigasi akar penyebab\n3. Tentukan tindakan korektif/pencegahan\n4. Implementasi\n5. Verifikasi efektivitas\n6. Dokumentasi dan *close-out*',
  },

  // ═══════════════════════════════════════════
  // T2: Teknik Sampling & Preparasi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'medium',
    content: 'Menurut teori Pierre Gy, apa faktor utama yang mempengaruhi kesalahan sampling (*fundamental sampling error*)?',
    options: [
      { key: 'A', text: 'Waktu pengambilan sampel dan suhu lingkungan saat sampling' },
      { key: 'B', text: 'Pengalaman dan keterampilan petugas pengambil sampel' },
      { key: 'C', text: 'Warna dan tekstur material yang akan disampling' },
      { key: 'D', text: 'Jarak antara lokasi sampling dan laboratorium analisis' },
      { key: 'E', text: 'Ukuran partikel material, heterogenitas, dan massa sampel yang diambil' },
    ],
    correct_answer: 'E',
    explanation: 'Menurut **teori Pierre Gy**, *Fundamental Sampling Error* (FSE) dipengaruhi oleh:\n\n$$\\sigma^2_{\\text{FSE}} = \\frac{Cd^3}{M_s}$$\n\nDi mana:\n- $C$ = faktor **heterogenitas** material (komposisi, bentuk, densitas)\n- $d$ = **ukuran partikel** terbesar (diameter nominal)\n- $M_s$ = **massa sampel** yang diambil\n\nImplikasi praktis:\n- **Partikel besar** memerlukan sampel lebih besar (FSE meningkat kubik terhadap $d$)\n- Material **heterogen** memerlukan sampel lebih besar\n- **Memperkecil partikel** (crushing) sebelum sub-sampling mengurangi FSE secara drastis\n- **Menambah massa** sampel mengurangi FSE (berbanding terbalik)',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa tujuan dari *splitting* (pembagian) sampel dalam preparasi sampel mineral?',
    options: [
      { key: 'A', text: 'Memisahkan mineral berharga dari mineral pengotor dalam sampel' },
      { key: 'B', text: 'Mengeringkan sampel dengan cara menyebarkannya ke area yang lebih luas' },
      { key: 'C', text: 'Membagi sampel menjadi sub-sampel yang representatif dengan massa lebih kecil' },
      { key: 'D', text: 'Menghancurkan sampel menjadi partikel berukuran seragam untuk analisis' },
      { key: 'E', text: 'Mengukur kadar air sampel dengan menimbang sebelum dan sesudah pengeringan' },
    ],
    correct_answer: 'C',
    explanation: '***Splitting*** (pembagian) bertujuan **membagi sampel menjadi sub-sampel yang representatif** dengan massa lebih kecil untuk analisis laboratorium.\n\nMetode splitting:\n- **Riffle splitter**: alat dengan saluran bergantian, paling akurat\n- **Rotary splitter**: untuk material bergerak (conveyor), sangat baik\n- **Cone and quarter**: manual, kurang akurat tetapi praktis\n- **Grab sampling**: **tidak direkomendasikan** karena bias tinggi\n\nUrutan preparasi sampel:\n1. **Pengeringan** (*drying*): menghilangkan kadar air\n2. **Penghancuran** (*crushing*): ukuran kasar ke menengah\n3. **Splitting**: pembagian menjadi sub-sampel\n4. **Penghalusan** (*pulverizing*): sub-sampel dihaluskan ke < 75 $\\mu$m\n5. **Analisis**: sub-sampel halus dikirim ke lab',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'medium',
    content: 'Mengapa kontaminasi silang (*cross-contamination*) harus dihindari saat preparasi sampel?',
    options: [
      { key: 'A', text: 'Kontaminasi silang menyebabkan sampel menjadi lebih berat dari seharusnya' },
      { key: 'B', text: 'Kontaminasi silang mengubah warna sampel sehingga sulit diidentifikasi' },
      { key: 'C', text: 'Kontaminasi silang memperlambat proses pengeringan sampel di oven' },
      { key: 'D', text: 'Kontaminasi silang merusak alat preparasi sehingga memerlukan penggantian' },
      { key: 'E', text: 'Kontaminasi silang mengubah komposisi kimia sampel sehingga hasil analisis tidak valid' },
    ],
    correct_answer: 'E',
    explanation: '**Kontaminasi silang** terjadi ketika **material dari sampel sebelumnya** bercampur ke sampel berikutnya, **mengubah komposisi kimia** dan membuat hasil analisis **tidak valid**.\n\nSumber kontaminasi silang:\n- Sisa material di **jaw crusher**, **pulverizer**, atau **riffle splitter**\n- Debu dari sampel berkadar tinggi mencemari sampel berkadar rendah\n- Alat preparasi yang tidak dibersihkan antar sampel\n\nPencegahan:\n- **Pembersihan alat** (*cleaning*) antar sampel menggunakan udara bertekanan dan sikat\n- **Blank wash**: menggerus material bersih (kuarsa) setelah sampel berkadar tinggi\n- Urutan preparasi: sampel **berkadar rendah dulu**, kemudian berkadar tinggi\n- Gunakan **barren quartz flush** pada pulverizer',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sampel bijih nikel seberat 50 kg akan direduksi menjadi sub-sampel 2 kg melalui crushing dan splitting. Berapa kali proses splitting diperlukan jika setiap split mengurangi massa setengahnya?',
    options: [
      { key: 'A', text: '5 kali (50 > 25 > 12,5 > 6,25 > 3,125 > 1,5625 kg)' },
      { key: 'B', text: '3 kali (50 > 25 > 12,5 > 6,25 kg)' },
      { key: 'C', text: '10 kali' },
      { key: 'D', text: '2 kali (50 > 25 > 12,5 kg)' },
      { key: 'E', text: '4 kali (50 > 25 > 12,5 > 6,25 > 3,125 kg)' },
    ],
    correct_answer: 'A',
    explanation: 'Setiap splitting mengurangi massa sampel menjadi setengahnya:\n$$\\begin{aligned} \\text{Split 1}: 50 &\\rightarrow 25 \\text{ kg} \\\\ \\text{Split 2}: 25 &\\rightarrow 12{,}5 \\text{ kg} \\\\ \\text{Split 3}: 12{,}5 &\\rightarrow 6{,}25 \\text{ kg} \\\\ \\text{Split 4}: 6{,}25 &\\rightarrow 3{,}125 \\text{ kg} \\\\ \\text{Split 5}: 3{,}125 &\\rightarrow 1{,}5625 \\text{ kg} \\end{aligned}$$\nDibutuhkan **5 kali splitting** untuk mencapai massa di bawah 2 kg ($1{,}5625$ kg).\n\nDalam praktik, setiap tahap splitting biasanya didahului dengan **crushing** untuk memperkecil ukuran partikel, sehingga sub-sampel tetap representatif sesuai teori Gy.',
  },

  // ═══════════════════════════════════════════
  // T3: Kimia Analitik & Instrumen (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa prinsip kerja analisis menggunakan *X-Ray Fluorescence* (XRF)?',
    options: [
      { key: 'A', text: 'Melarutkan sampel dalam asam kemudian mengukur volume gas yang dihasilkan' },
      { key: 'B', text: 'Menyinari sampel dengan sinar-X dan mengukur radiasi fluoresen yang dipancarkan unsur' },
      { key: 'C', text: 'Memanaskan sampel hingga pijar dan mengukur warna nyala api yang dihasilkan' },
      { key: 'D', text: 'Mereaksikan sampel dengan pereaksi kimia dan mengukur perubahan warna larutan' },
      { key: 'E', text: 'Menimbang sampel sebelum dan sesudah pemanasan untuk menentukan kadar mineral' },
    ],
    correct_answer: 'B',
    explanation: '***X-Ray Fluorescence*** (XRF) bekerja dengan:\n1. **Menyinari** sampel dengan sinar-X berenergi tinggi\n2. Atom dalam sampel **menyerap** energi dan **melepaskan elektron** dari kulit dalam\n3. Elektron dari kulit luar **mengisi kekosongan**, memancarkan **sinar-X fluoresen** yang khas\n4. **Detektor** mengukur energi dan intensitas sinar-X yang dipancarkan\n\nKeunggulan XRF:\n- **Non-destruktif**: sampel tidak rusak\n- **Multi-elemen**: menganalisis banyak unsur sekaligus\n- **Cepat**: hasil dalam hitungan menit\n- **Portable**: ada versi genggam (*handheld XRF*) untuk lapangan\n\nKeterbatasan:\n- Kurang akurat untuk unsur ringan (Z < 11)\n- Efek matriks memerlukan kalibrasi khusus\n- Tidak bisa menentukan bentuk senyawa kimia',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa perbedaan antara analisis *Atomic Absorption Spectrometry* (AAS) dan *Inductively Coupled Plasma* (ICP)?',
    options: [
      { key: 'A', text: 'AAS hanya untuk logam mulia, ICP hanya untuk logam berat' },
      { key: 'B', text: 'AAS menggunakan sampel padat, ICP menggunakan sampel cair' },
      { key: 'C', text: 'AAS bersifat destruktif, ICP bersifat non-destruktif terhadap sampel' },
      { key: 'D', text: 'AAS mengukur satu unsur per analisis, ICP dapat mengukur banyak unsur simultan' },
      { key: 'E', text: 'AAS lebih mahal dan kompleks dibandingkan ICP dalam pengoperasiannya' },
    ],
    correct_answer: 'D',
    explanation: 'Perbandingan **AAS** dan **ICP**:\n\n| Aspek | AAS | ICP (OES/MS) |\n|---|---|---|\n| **Pengukuran** | **Satu unsur** per analisis | **Multi-unsur** simultan |\n| Sumber energi | Lampu katoda (per unsur) | Plasma argon (6.000-10.000 K) |\n| Throughput | Lambat | Cepat (banyak unsur sekaligus) |\n| Batas deteksi | Baik (ppb) | Sangat baik (ICP-MS: ppt) |\n| Biaya per sampel | Rendah | Lebih tinggi (gas argon) |\n| Biaya alat | Lebih murah | Lebih mahal |\n\nKeduanya memerlukan **sampel dalam bentuk larutan** (destruktif, sampel dilarutkan dalam asam).\n\nPilihan di laboratorium tambang:\n- **AAS**: untuk analisis rutin satu unsur (misal kadar Ni saja)\n- **ICP-OES**: untuk analisis multi-elemen secara simultan',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *gravimetri* dalam analisis kimia?',
    options: [
      { key: 'A', text: 'Metode analisis kuantitatif berdasarkan pengukuran massa endapan atau residu' },
      { key: 'B', text: 'Metode pengukuran gaya gravitasi untuk menentukan densitas mineral' },
      { key: 'C', text: 'Teknik pemisahan mineral berdasarkan perbedaan berat jenis dalam air' },
      { key: 'D', text: 'Metode penentuan volume sampel menggunakan neraca analitik presisi tinggi' },
      { key: 'E', text: 'Teknik pengukuran kelembaban udara di dalam laboratorium analisis' },
    ],
    correct_answer: 'A',
    explanation: '**Gravimetri** adalah metode analisis kuantitatif yang menentukan jumlah analit berdasarkan **pengukuran massa** endapan atau residu.\n\nJenis gravimetri:\n- **Gravimetri pengendapan**: analit diendapkan sebagai senyawa tidak larut, disaring, dikeringkan, ditimbang\n- **Gravimetri penguapan**: komponen volatil diuapkan, selisih massa dihitung\n\nContoh di laboratorium tambang:\n- Kadar **SiO$_2$**: diendapkan dari larutan, dipijarkan, ditimbang\n- **Loss on Ignition** (LOI): sampel dipanaskan 1.000°C, kehilangan massa = LOI\n- **Kadar air**: selisih berat sebelum dan sesudah pengeringan 105°C\n\nKelebihan: akurat, tidak perlu standar kalibrasi\nKekurangan: lambat, memerlukan banyak langkah',
  },
  {
    order_index: 12,
    category: 'T3',
    difficulty: 'medium',
    content: 'Sampel bijih nikel seberat $1{,}000$ g dikeringkan pada suhu $105°$C hingga berat konstan menjadi $0{,}720$ g. Berapa kadar air sampel?',
    options: [
      { key: 'A', text: '$18\\%$' },
      { key: 'B', text: '$72\\%$' },
      { key: 'C', text: '$36\\%$' },
      { key: 'D', text: '$20\\%$' },
      { key: 'E', text: '$28\\%$' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan kadar air:\n$$\\begin{aligned} \\text{Kadar air} &= \\frac{\\text{Berat awal} - \\text{Berat kering}}{\\text{Berat awal}} \\times 100\\% \\\\ &= \\frac{1{,}000 - 0{,}720}{1{,}000} \\times 100\\% = \\frac{0{,}280}{1{,}000} \\times 100\\% = 28\\% \\end{aligned}$$\n\nKadar air **28%** tergolong cukup tinggi untuk bijih nikel laterit. Pengeringan pada $105°$C menghilangkan air bebas (*free moisture*) dan air terikat lemah.\n\nPentingnya kadar air:\n- Menentukan **tonase kering** (basis pembayaran)\n- Mempengaruhi biaya **transportasi** (mengangkut air = biaya)\n- Regulasi melarang kadar air > 34-35% untuk transportasi laut (risiko *liquefaction*)',
  },

  // ═══════════════════════════════════════════
  // T4: Analisis Statistik untuk Mutu (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa perbedaan antara akurasi dan presisi dalam pengujian laboratorium?',
    options: [
      { key: 'A', text: 'Akurasi adalah kecepatan analisis, presisi adalah biaya per analisis' },
      { key: 'B', text: 'Akurasi diukur dengan AAS, presisi diukur dengan XRF' },
      { key: 'C', text: 'Akurasi adalah kedekatan hasil dengan nilai sebenarnya, presisi adalah keterulangan hasil' },
      { key: 'D', text: 'Akurasi hanya untuk sampel cair, presisi hanya untuk sampel padat' },
      { key: 'E', text: 'Akurasi ditentukan oleh alat, presisi ditentukan oleh analis' },
    ],
    correct_answer: 'C',
    explanation: 'Perbedaan **akurasi** dan **presisi**:\n\n| Aspek | Akurasi | Presisi |\n|---|---|---|\n| **Definisi** | Kedekatan hasil dengan **nilai sebenarnya** | **Keterulangan** (*reproducibility*) hasil |\n| Mengukur | **Bias** (systematic error) | **Variabilitas** (random error) |\n| Uji | Analisis **CRM** (*Certified Reference Material*) | Analisis **duplikat** |\n| Analogi | Menembak **dekat pusat** sasaran | Tembakan **mengelompok rapat** |\n\nKombinasi kemungkinan:\n- **Akurat + presisi**: ideal (dekat pusat, mengelompok)\n- **Akurat + tidak presisi**: rata-rata benar tetapi menyebar\n- **Tidak akurat + presisi**: konsisten salah (bias sistematis)\n- **Tidak akurat + tidak presisi**: acak dan bias (terburuk)',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa fungsi *control chart* (peta kendali) dalam laboratorium analisis?',
    options: [
      { key: 'A', text: 'Menampilkan jadwal kalibrasi seluruh alat laboratorium' },
      { key: 'B', text: 'Mencatat kehadiran dan produktivitas analis laboratorium' },
      { key: 'C', text: 'Menghitung biaya reagent yang digunakan per bulan' },
      { key: 'D', text: 'Memantau stabilitas proses analisis dan mendeteksi penyimpangan sistematis' },
      { key: 'E', text: 'Menentukan harga jual produk berdasarkan hasil analisis kadar' },
    ],
    correct_answer: 'D',
    explanation: '***Control chart*** (peta kendali) berfungsi untuk **memantau stabilitas proses analisis** dan **mendeteksi penyimpangan sistematis** sebelum menjadi masalah besar.\n\nKomponen *control chart*:\n- **Center Line** (CL): rata-rata hasil ($\\bar{x}$)\n- **Upper/Lower Warning Limit** (UWL/LWL): $\\bar{x} \\pm 2\\sigma$\n- **Upper/Lower Control Limit** (UCL/LCL): $\\bar{x} \\pm 3\\sigma$\n\nAturan pelanggaran (*out of control*):\n- Satu titik di luar **batas kontrol** ($\\pm 3\\sigma$)\n- Dua dari tiga titik berturut-turut di luar **batas peringatan** ($\\pm 2\\sigma$)\n- Tujuh titik berturut-turut di **satu sisi** garis tengah (*trend/shift*)\n\nData berasal dari analisis **CRM**, **blank**, atau **duplikat** secara rutin.',
  },
  {
    order_index: 15,
    category: 'T4',
    difficulty: 'medium',
    content: 'Lima hasil analisis duplikat kadar Ni memberikan nilai: $1{,}82\\%$, $1{,}78\\%$, $1{,}80\\%$, $1{,}84\\%$, dan $1{,}76\\%$. Berapa rata-rata dan range data tersebut?',
    options: [
      { key: 'A', text: 'Rata-rata $1{,}80\\%$, range $0{,}06\\%$' },
      { key: 'B', text: 'Rata-rata $1{,}80\\%$, range $0{,}08\\%$' },
      { key: 'C', text: 'Rata-rata $1{,}82\\%$, range $0{,}08\\%$' },
      { key: 'D', text: 'Rata-rata $1{,}78\\%$, range $0{,}06\\%$' },
      { key: 'E', text: 'Rata-rata $1{,}80\\%$, range $0{,}04\\%$' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan:\n$$\\begin{aligned} \\bar{x} &= \\frac{1{,}82 + 1{,}78 + 1{,}80 + 1{,}84 + 1{,}76}{5} = \\frac{9{,}00}{5} = 1{,}80\\% \\\\ R &= x_{\\max} - x_{\\min} = 1{,}84 - 1{,}76 = 0{,}08\\% \\end{aligned}$$\n\nInterpretasi:\n- **Rata-rata** = $1{,}80\\%$ Ni\n- **Range** = $0{,}08\\%$ (selisih nilai tertinggi dan terendah)\n\nRange digunakan sebagai indikator **presisi**. Untuk duplikat, *relative range* (range/mean) sering digunakan:\n$$\\text{Relative range} = \\frac{0{,}08}{1{,}80} \\times 100\\% = 4{,}4\\%$$\nBatas wajar *relative range* duplikat umumnya < 5-10% (tergantung kadar dan metode).',
  },
  {
    order_index: 16,
    category: 'T4',
    difficulty: 'medium',
    content: 'Hasil analisis suatu CRM (*Certified Reference Material*) dengan nilai sertifikat $2{,}50\\%$ Ni secara konsisten memberikan hasil $2{,}60\\%$. Apa yang ditunjukkan oleh kondisi ini?',
    options: [
      { key: 'A', text: 'Analisis memiliki presisi rendah karena hasil selalu menyimpang' },
      { key: 'B', text: 'CRM sudah kedaluwarsa dan harus diganti dengan yang baru' },
      { key: 'C', text: 'Sampel CRM terkontaminasi oleh debu di laboratorium' },
      { key: 'D', text: 'Kondisi normal karena semua CRM memiliki toleransi penyimpangan' },
      { key: 'E', text: 'Terdapat bias positif (systematic error) yang memerlukan investigasi' },
    ],
    correct_answer: 'E',
    explanation: 'Hasil yang **konsisten** di atas nilai sertifikat ($2{,}60\\%$ vs $2{,}50\\%$) menunjukkan adanya **bias positif** (*positive systematic error*).\n\nAnalisis:\n- **Presisi**: baik (hasil konsisten/berulang)\n- **Akurasi**: buruk (menyimpang dari nilai sebenarnya)\n- **Jenis error**: **sistematis** (selalu ke arah yang sama)\n\nKemungkinan penyebab bias positif:\n- **Kalibrasi** alat yang kurang tepat\n- **Standar kalibrasi** yang tidak akurat\n- **Interferensi matriks** dalam metode analisis\n- **Kontaminasi** dari reagent atau peralatan\n\nTindakan korektif:\n1. Periksa dan rekalibrasi alat\n2. Verifikasi standar kalibrasi\n3. Periksa kemurnian reagent\n4. Jalankan metode alternatif untuk konfirmasi',
  },

  // ═══════════════════════════════════════════
  // T5: Sistem Manajemen Mutu Lab (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa standar internasional yang mengatur kompetensi laboratorium pengujian dan kalibrasi?',
    options: [
      { key: 'A', text: 'ISO 9001 tentang Sistem Manajemen Mutu umum' },
      { key: 'B', text: 'ISO 14001 tentang Sistem Manajemen Lingkungan' },
      { key: 'C', text: 'ISO 45001 tentang Sistem Manajemen Keselamatan Kerja' },
      { key: 'D', text: 'ISO/IEC 17025 tentang Persyaratan Umum Kompetensi Laboratorium' },
      { key: 'E', text: 'ISO 22000 tentang Sistem Manajemen Keamanan Pangan' },
    ],
    correct_answer: 'D',
    explanation: '**ISO/IEC 17025** adalah standar internasional yang menetapkan **persyaratan umum kompetensi laboratorium pengujian dan kalibrasi**.\n\nPersyaratan utama ISO/IEC 17025:\n- **Persyaratan manajemen**: organisasi, sistem mutu, pengendalian dokumen, tindakan korektif\n- **Persyaratan teknis**: personel, kondisi lingkungan, metode, peralatan, ketelusuran pengukuran\n\nPerbedaan dengan ISO 9001:\n\n| Aspek | ISO 9001 | ISO/IEC 17025 |\n|---|---|---|\n| Fokus | Sistem manajemen mutu **umum** | Kompetensi **teknis laboratorium** |\n| Untuk | Semua organisasi | Laboratorium pengujian/kalibrasi |\n| Akreditasi | Sertifikasi | **Akreditasi** (oleh KAN di Indonesia) |\n| Hasil | Produk/layanan bermutu | Hasil pengujian **valid dan terpercaya** |',
  },
  {
    order_index: 18,
    category: 'T5',
    difficulty: 'medium',
    content: 'Mengapa kalibrasi alat ukur harus dilakukan secara berkala di laboratorium?',
    options: [
      { key: 'A', text: 'Memastikan hasil pengukuran akurat dan tertelusur ke standar nasional/internasional' },
      { key: 'B', text: 'Untuk memperpanjang masa garansi alat dari produsen' },
      { key: 'C', text: 'Untuk mengurangi konsumsi listrik alat laboratorium' },
      { key: 'D', text: 'Untuk memenuhi persyaratan asuransi peralatan laboratorium' },
      { key: 'E', text: 'Untuk meningkatkan kecepatan analisis per sampel' },
    ],
    correct_answer: 'A',
    explanation: '**Kalibrasi** bertujuan memastikan alat ukur memberikan hasil yang **akurat** dan **tertelusur** (*traceable*) ke standar nasional/internasional.\n\nAlasan kalibrasi berkala:\n1. **Drift**: pembacaan alat bergeser seiring waktu dan penggunaan\n2. **Keausan**: komponen mekanis dan elektronik mengalami degradasi\n3. **Ketelusuran**: rantai kalibrasi dari standar primer → standar kerja → alat\n4. **Kepatuhan**: persyaratan ISO/IEC 17025 dan akreditasi\n\nContoh interval kalibrasi:\n- **Neraca analitik**: setiap 6-12 bulan\n- **pH meter**: setiap hari (sebelum digunakan)\n- **Spektrometer**: setiap 6-12 bulan\n- **Termometer**: setiap 12 bulan\n\nDokumentasi kalibrasi:\n- Sertifikat kalibrasi dengan **ketidakpastian pengukuran**\n- Label kalibrasi pada alat (tanggal kalibrasi, tanggal jatuh tempo)',
  },
  {
    order_index: 19,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa tujuan utama *Material Safety Data Sheet* (MSDS) di laboratorium?',
    options: [
      { key: 'A', text: 'Menentukan harga jual bahan kimia di pasaran internasional' },
      { key: 'B', text: 'Menyediakan informasi tentang bahaya, penanganan, dan tindakan darurat bahan kimia' },
      { key: 'C', text: 'Mencatat jumlah stok bahan kimia yang tersedia di gudang laboratorium' },
      { key: 'D', text: 'Mengidentifikasi pemasok bahan kimia yang tersertifikasi ISO' },
      { key: 'E', text: 'Menentukan tanggal kedaluwarsa bahan kimia yang digunakan' },
    ],
    correct_answer: 'B',
    explanation: '**MSDS** (*Material Safety Data Sheet*), sekarang disebut **SDS** (*Safety Data Sheet*), menyediakan **informasi komprehensif** tentang bahan kimia.\n\n16 bagian SDS (format GHS):\n1. Identifikasi produk\n2. **Identifikasi bahaya** (piktogram, kata sinyal)\n3. Komposisi/informasi bahan\n4. **Tindakan pertolongan pertama**\n5. Tindakan pemadaman kebakaran\n6. Tindakan penanggulangan tumpahan\n7. **Penanganan dan penyimpanan**\n8. **Pengendalian paparan/APD** yang diperlukan\n9. Sifat fisika dan kimia\n10. Stabilitas dan reaktivitas\n11. Informasi toksikologi\n12. Informasi ekologi\n13. Pertimbangan pembuangan\n14. Informasi transportasi\n15. Informasi regulasi\n16. Informasi lainnya',
  },
  {
    order_index: 20,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa risiko utama dalam penanganan asam fluorida (HF) di laboratorium analisis mineral?',
    options: [
      { key: 'A', text: 'HF mudah terbakar dan dapat menyebabkan ledakan jika terkena panas' },
      { key: 'B', text: 'HF memiliki bau menyengat yang menyebabkan sakit kepala berkepanjangan' },
      { key: 'C', text: 'HF dapat menembus kulit dan menyebabkan luka bakar dalam serta gangguan kalsium darah' },
      { key: 'D', text: 'HF bereaksi dengan air dan menghasilkan gas hidrogen yang mudah meledak' },
      { key: 'E', text: 'HF merusak peralatan baja tahan karat sehingga memerlukan penggantian sering' },
    ],
    correct_answer: 'C',
    explanation: '**Asam fluorida (HF)** adalah salah satu bahan kimia **paling berbahaya** di laboratorium mineral. Digunakan untuk melarutkan silikat dalam analisis multi-elemen.\n\nBahaya utama HF:\n- **Menembus kulit**: HF adalah asam lemah yang tidak segera terasa, tetapi **menembus jaringan dalam**\n- **Luka bakar dalam**: merusak jaringan hingga tulang\n- **Gangguan kalsium**: ion fluorida mengikat kalsium darah ($\\text{Ca}^{2+}$) menyebabkan **hipokalsemia** yang dapat mengancam jiwa (aritmia jantung)\n- **Paparan kecil bisa fatal**: kontak > 2% luas tubuh dapat mematikan\n\nPenanganan darurat:\n- Bilas segera dengan air mengalir 15-20 menit\n- Oleskan **gel kalsium glukonat 2,5%** pada area terkena\n- **Segera ke rumah sakit** meskipun luka terlihat ringan\n\nAPD wajib: sarung tangan neoprene berlapis, face shield, apron tahan asam.',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-qc')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-qc tidak ditemukan:', pkgErr)
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
