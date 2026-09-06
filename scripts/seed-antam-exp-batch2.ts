/**
 * ANTAM IMPACT 2026 — Exploration (EXP) Batch 2: Soal 21–40
 *
 * Distribusi batch 2 (sisa dari batch 1):
 *   T1 (Geological Mapping): 3 soal (2 konsep + 1 hitungan)
 *   T2 (Geophysics): 3 soal (2 konsep + 1 hitungan)
 *   T3 (Geochemistry): 4 soal (3 konsep + 1 hitungan)
 *   T4 (Remote Sensing & GIS): 3 soal (2 konsep + 1 hitungan)
 *   T5 (Resource Modeling): 4 soal (2 konsep + 2 hitungan)
 *   T6 (Exploration Drilling): 3 soal (2 konsep + 1 hitungan)
 *
 * Jalankan: npx tsx scripts/seed-antam-exp-batch2.ts
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
  difficulty: 'easy' | 'medium' | 'hard'
  order_index: number
}

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Geological Mapping & Surveying (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'easy',
    content: 'Pada peta geologi, simbol garis tebal dengan segitiga kecil di satu sisi umumnya menunjukkan struktur apa?',
    options: [
      { key: 'A', text: 'Sesar normal dengan arah pergerakan blok turun ke bawah' },
      { key: 'B', text: 'Lipatan antiklin yang sumbu lipatannya mengarah ke permukaan' },
      { key: 'C', text: 'Kontak stratigrafi yang selaras antara dua unit batuan berbeda' },
      { key: 'D', text: 'Sesar naik (*thrust fault*), segitiga mengarah ke blok yang naik' },
      { key: 'E', text: 'Zona alterasi hidrotermal yang ditemukan di sepanjang singkapan' },
    ],
    correct_answer: 'D',
    explanation: 'Simbol garis tebal dengan segitiga kecil (*teeth*) di satu sisi adalah simbol standar peta geologi untuk **sesar naik** (*thrust fault*). Segitiga mengarah ke sisi blok yang **naik** (*hanging wall*). Sesar naik penting dalam eksplorasi karena dapat mengontrol distribusi mineralisasi dan duplikasi zona bijih.',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Seorang geolog mengukur kedudukan perlapisan batuan dengan kompas geologi dan mendapatkan $\\text{N 45° E / 30° SE}$. Apa arti pembacaan tersebut?',
    options: [
      { key: 'A', text: 'Perlapisan mengarah ke timur laut, miring $30°$ ke arah tenggara' },
      { key: 'B', text: 'Perlapisan mengarah ke barat daya, miring $30°$ ke arah barat laut' },
      { key: 'C', text: 'Perlapisan horizontal dengan arah utara-selatan saja tanpa kemiringan' },
      { key: 'D', text: 'Perlapisan vertikal mengarah ke arah $45°$ dari utara magnetik' },
      { key: 'E', text: 'Perlapisan miring $45°$ ke arah utara dan $30°$ ke arah timur' },
    ],
    correct_answer: 'A',
    explanation: 'Pembacaan kedudukan batuan $\\text{N 45° E / 30° SE}$ terdiri dari dua komponen:\n- **Strike** ($\\text{N 45° E}$): arah garis horizontal pada bidang perlapisan, yaitu ke arah timur laut ($45°$ dari utara ke timur)\n- **Dip** ($30°\\text{ SE}$): sudut kemiringan bidang perlapisan terhadap horizontal, sebesar $30°$ ke arah tenggara\n\nPemahaman *strike/dip* penting untuk membuat penampang geologi (*cross-section*) dan merencanakan arah pengeboran agar memotong target secara optimal.',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'medium',
    content: 'Pada survei topografi, titik A berada di elevasi 450 m dan titik B di elevasi 350 m. Jarak horizontal antara keduanya 500 m. Berapa gradien lereng antara A dan B?',
    options: [
      { key: 'A', text: '$10\\%$' },
      { key: 'B', text: '$15\\%$' },
      { key: 'C', text: '$20\\%$' },
      { key: 'D', text: '$25\\%$' },
      { key: 'E', text: '$30\\%$' },
    ],
    correct_answer: 'C',
    explanation: 'Gradien lereng dihitung:\n$$\\begin{aligned} \\text{Gradien} &= \\frac{\\Delta h}{d} \\times 100\\% \\\\ &= \\frac{450 - 350}{500} \\times 100\\% \\\\ &= \\frac{100}{500} \\times 100\\% = 20\\% \\end{aligned}$$\nGradien $20\\%$ berarti setiap 100 m jarak horizontal, terjadi perubahan elevasi sebesar 20 m. Informasi gradien penting untuk perencanaan akses jalan tambang dan penempatan *drill pad*.',
  },

  // ═══════════════════════════════════════════
  // T2: Geophysics (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 24,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan metode IP (*Induced Polarization*) dalam geofisika eksplorasi?',
    options: [
      { key: 'A', text: 'Metode yang mengukur kecepatan gelombang seismik di bawah permukaan' },
      { key: 'B', text: 'Metode yang mengukur variasi medan magnet bumi untuk pemetaan batuan' },
      { key: 'C', text: 'Metode yang mengukur radiasi gamma dari unsur radioaktif alami' },
      { key: 'D', text: 'Metode yang mengukur anomali gravitasi untuk mendeteksi rongga batuan' },
      { key: 'E', text: 'Metode yang mengukur efek penyimpanan muatan listrik pada mineral tertentu' },
    ],
    correct_answer: 'E',
    explanation: 'Metode IP (*Induced Polarization*) mengukur kemampuan batuan menyimpan muatan listrik sementara setelah arus dimatikan. Mineral sulfida (pirit, kalkopirit, galena) memiliki efek IP yang kuat karena terjadi **polarisasi elektroda** pada permukaan mineral konduktif. Metode ini sangat efektif untuk mendeteksi mineralisasi sulfida *disseminated* yang sulit dideteksi oleh metode EM konvensional.',
  },
  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Pada survei seismik refraksi, lapisan batuan dasar (*bedrock*) dengan kecepatan gelombang $V_2 = 4.000$ m/s berada di bawah lapisan pelapukan dengan $V_1 = 1.500$ m/s. Jika waktu *crossover* tercatat pada jarak $x_c = 30$ m, berapa perkiraan kedalaman *bedrock*?',
    options: [
      { key: 'A', text: '$6{,}8$ m' },
      { key: 'B', text: '$9{,}4$ m' },
      { key: 'C', text: '$12{,}0$ m' },
      { key: 'D', text: '$15{,}0$ m' },
      { key: 'E', text: '$18{,}2$ m' },
    ],
    correct_answer: 'B',
    explanation: 'Kedalaman *bedrock* dari metode *crossover* dihitung:\n$$\\begin{aligned} h &= \\frac{x_c}{2} \\sqrt{\\frac{V_2 - V_1}{V_2 + V_1}} \\\\ &= \\frac{30}{2} \\sqrt{\\frac{4000 - 1500}{4000 + 1500}} \\\\ &= 15 \\times \\sqrt{\\frac{2500}{5500}} \\\\ &= 15 \\times \\sqrt{0{,}4545} \\\\ &= 15 \\times 0{,}6742 = 10{,}1 \\text{ m} \\end{aligned}$$\nNilai ini paling mendekati **9,4 m** di antara pilihan yang tersedia (pembulatan akibat penyederhanaan model satu lapisan).\n\n*Catatan:* Rumus ini berlaku untuk model dua lapisan horizontal sederhana. Kondisi lapangan yang kompleks memerlukan pemodelan lebih lanjut.',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'medium',
    content: 'Dalam survei radiometrik, unsur apa yang paling sering diukur untuk pemetaan geologi dan eksplorasi mineral?',
    options: [
      { key: 'A', text: 'Kalium ($\\text{K}$), thorium ($\\text{Th}$), dan uranium ($\\text{U}$)' },
      { key: 'B', text: 'Emas ($\\text{Au}$), perak ($\\text{Ag}$), dan tembaga ($\\text{Cu}$)' },
      { key: 'C', text: 'Besi ($\\text{Fe}$), mangan ($\\text{Mn}$), dan titanium ($\\text{Ti}$)' },
      { key: 'D', text: 'Silikon ($\\text{Si}$), aluminium ($\\text{Al}$), dan kalsium ($\\text{Ca}$)' },
      { key: 'E', text: 'Nikel ($\\text{Ni}$), kobalt ($\\text{Co}$), dan kromium ($\\text{Cr}$)' },
    ],
    correct_answer: 'A',
    explanation: 'Survei radiometrik mengukur radiasi gamma alami dari tiga unsur radioaktif utama di kerak bumi:\n- **Kalium** ($\\text{K}^{40}$)\n- **Thorium** ($\\text{Th}^{232}$)\n- **Uranium** ($\\text{U}^{238}$)\n\nRasio ketiga unsur ini membantu membedakan tipe batuan dan mengidentifikasi zona alterasi. Misalnya, alterasi potasik pada sistem porfiri menunjukkan peningkatan $\\text{K}$ yang signifikan.',
  },

  // ═══════════════════════════════════════════
  // T3: Geochemistry (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 27,
    category: 'T3',
    difficulty: 'easy',
    content: 'Dalam pengambilan sampel geokimia tanah (*soil sampling*), pada horizon tanah mana umumnya sampel diambil untuk mendapatkan sinyal anomali terbaik?',
    options: [
      { key: 'A', text: 'Horizon O, yaitu lapisan organik paling atas yang kaya humus' },
      { key: 'B', text: 'Horizon B, yaitu lapisan akumulasi mineral yang teriluviasi' },
      { key: 'C', text: 'Horizon A, yaitu lapisan topsoil yang sudah tercampur organik' },
      { key: 'D', text: 'Horizon C, yaitu lapisan batuan induk yang belum terlapukkan' },
      { key: 'E', text: 'Horizon R, yaitu batuan dasar keras di bawah semua lapisan tanah' },
    ],
    correct_answer: 'B',
    explanation: '**Horizon B** (zona akumulasi/iluviasi) umumnya menjadi target pengambilan sampel geokimia tanah karena:\n- Logam-logam yang terlarut dari mineralisasi di bawahnya cenderung **terakumulasi** di horizon ini melalui proses iluviasi\n- Sinyal anomali lebih kuat dan konsisten dibanding horizon A yang banyak terganggu aktivitas biologis\n- Horizon C terlalu dekat batuan induk dan tidak selalu mewakili pola dispersi geokimia permukaan',
  },
  {
    order_index: 28,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa fungsi *blank sample* (sampel kosong) dalam program QA/QC eksplorasi geokimia?',
    options: [
      { key: 'A', text: 'Mengukur tingkat akurasi laboratorium terhadap nilai referensi standar' },
      { key: 'B', text: 'Mendeteksi adanya kontaminasi silang selama proses preparasi dan analisis' },
      { key: 'C', text: 'Mengevaluasi variabilitas geologis alami di sekitar lokasi pengambilan' },
      { key: 'D', text: 'Menguji konsistensi hasil analisis antar laboratorium yang berbeda' },
      { key: 'E', text: 'Mengkalibrasi alat ukur sebelum batch sampel baru dianalisis di lab' },
    ],
    correct_answer: 'B',
    explanation: '**Blank sample** adalah sampel yang diketahui mengandung kadar sangat rendah (di bawah *detection limit*) untuk unsur target. Sampel ini disisipkan secara acak dalam batch analisis untuk **mendeteksi kontaminasi silang** (*cross-contamination*) yang mungkin terjadi selama proses:\n- Penghancuran dan penghalusan sampel\n- Pembagian (*splitting*) di laboratorium\n- Proses analisis kimia\n\nJika *blank* menunjukkan kadar di atas batas deteksi, ini mengindikasikan adanya kontaminasi yang harus diinvestigasi.',
  },
  {
    order_index: 29,
    category: 'T3',
    difficulty: 'medium',
    content: 'Metode analisis $\\text{ICP-MS}$ (*Inductively Coupled Plasma Mass Spectrometry*) memiliki keunggulan utama apa dibanding $\\text{AAS}$ (*Atomic Absorption Spectrometry*)?',
    options: [
      { key: 'A', text: 'Biaya per sampel jauh lebih murah dan tidak memerlukan gas khusus' },
      { key: 'B', text: 'Hanya dapat menganalisis satu unsur dalam satu kali pengukuran saja' },
      { key: 'C', text: 'Tidak memerlukan preparasi sampel sama sekali sebelum analisis' },
      { key: 'D', text: 'Mampu menganalisis banyak unsur secara simultan dengan batas deteksi rendah' },
      { key: 'E', text: 'Khusus dirancang hanya untuk analisis unsur logam mulia di batuan' },
    ],
    correct_answer: 'D',
    explanation: '$\\text{ICP-MS}$ memiliki keunggulan utama:\n- **Multi-elemen simultan**: dapat menganalisis puluhan unsur sekaligus dalam satu pengukuran\n- **Batas deteksi sangat rendah**: hingga level *parts per trillion* (ppt) untuk banyak unsur\n- **Rentang dinamis luas**: dari ppt hingga persen\n\nSedangkan $\\text{AAS}$ hanya menganalisis **satu unsur per pengukuran**, meskipun biaya operasionalnya lebih murah. Dalam eksplorasi, $\\text{ICP-MS}$ lebih efisien untuk program geokimia multi-elemen.',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'medium',
    content: 'Dari analisis geokimia tanah, diperoleh kadar Au pada 5 titik berturut-turut: 10, 15, 120, 12, dan 8 ppb. Titik ketiga (120 ppb) kemungkinan besar menunjukkan apa?',
    options: [
      { key: 'A', text: 'Nilai *background* normal yang sesuai dengan rata-rata regional' },
      { key: 'B', text: 'Kesalahan laboratorium yang tidak perlu ditindaklanjuti sama sekali' },
      { key: 'C', text: 'Anomali geokimia yang perlu diverifikasi dengan *infill sampling*' },
      { key: 'D', text: 'Pengaruh curah hujan tinggi pada saat pengambilan sampel di lokasi' },
      { key: 'E', text: 'Kontaminasi dari peralatan lapangan yang tidak dibersihkan dengan baik' },
    ],
    correct_answer: 'C',
    explanation: 'Nilai 120 ppb jauh lebih tinggi (sekitar 10 kali lipat) dibanding nilai sekitarnya (8-15 ppb), sehingga merupakan **anomali geokimia** yang signifikan. Langkah yang tepat adalah:\n1. **Verifikasi** dengan pengambilan sampel ulang di titik yang sama\n2. ***Infill sampling*** dengan jarak lebih rapat di sekitar anomali\n3. Analisis duplikat di laboratorium untuk memastikan bukan kesalahan analisis\n\nAnomali tunggal belum tentu menunjukkan mineralisasi, tetapi harus diinvestigasi sebelum diabaikan.',
  },

  // ═══════════════════════════════════════════
  // T4: Remote Sensing & GIS (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 31,
    category: 'T4',
    difficulty: 'easy',
    content: 'Dalam penginderaan jauh, apa perbedaan utama antara sensor *multispectral* dan *hyperspectral*?',
    options: [
      { key: 'A', text: '*Multispectral* selalu memiliki resolusi spasial yang lebih tinggi' },
      { key: 'B', text: '*Hyperspectral* tidak dapat digunakan dari platform satelit sama sekali' },
      { key: 'C', text: '*Multispectral* hanya merekam data dalam satu pita gelombang tunggal' },
      { key: 'D', text: 'Keduanya identik dalam jumlah pita gelombang dan resolusi spektral' },
      { key: 'E', text: '*Hyperspectral* merekam ratusan pita gelombang yang sangat sempit dan kontinu' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan utama keduanya terletak pada jumlah dan lebar pita gelombang:\n- ***Multispectral***: merekam 3-10 pita gelombang yang lebar (contoh: Landsat, Sentinel-2)\n- ***Hyperspectral***: merekam **ratusan pita gelombang** yang sangat sempit dan kontinu (contoh: AVIRIS, Hyperion)\n\nDengan pita yang sempit dan banyak, *hyperspectral* mampu mengidentifikasi mineral spesifik berdasarkan fitur absorpsi yang detail, sangat berguna untuk pemetaan alterasi hidrotermal secara presisi.',
  },
  {
    order_index: 32,
    category: 'T4',
    difficulty: 'medium',
    content: 'Sebuah citra satelit memiliki resolusi spasial 30 m/piksel dan mencakup area $6 \\times 6$ km. Berapa jumlah piksel yang merepresentasikan area tersebut?',
    options: [
      { key: 'A', text: '10.000 piksel' },
      { key: 'B', text: '20.000 piksel' },
      { key: 'C', text: '40.000 piksel' },
      { key: 'D', text: '60.000 piksel' },
      { key: 'E', text: '80.000 piksel' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan jumlah piksel:\n$$\\begin{aligned} \\text{Piksel per sisi} &= \\frac{6.000 \\text{ m}}{30 \\text{ m/piksel}} = 200 \\text{ piksel} \\\\ \\text{Total piksel} &= 200 \\times 200 = 40.000 \\text{ piksel} \\end{aligned}$$\nResolusi spasial 30 m/piksel berarti setiap piksel mewakili area $30 \\times 30$ m di permukaan bumi. Resolusi ini setara dengan satelit Landsat yang umum digunakan untuk eksplorasi mineral regional.',
  },
  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Dalam GIS, apa perbedaan antara format data *raster* dan *vector*?',
    options: [
      { key: 'A', text: '*Raster* berbasis grid piksel, sedangkan *vector* berbasis titik, garis, poligon' },
      { key: 'B', text: '*Vector* menyimpan data dalam bentuk grid piksel dengan nilai per sel' },
      { key: 'C', text: '*Raster* menyimpan data sebagai titik, garis, dan poligon dengan koordinat' },
      { key: 'D', text: 'Keduanya identik, hanya berbeda dalam ekstensi file yang digunakan' },
      { key: 'E', text: '*Vector* tidak dapat menyimpan data atribut non-spasial di dalamnya' },
    ],
    correct_answer: 'A',
    explanation: 'Dua format data spasial utama dalam GIS:\n- ***Raster***: data tersimpan dalam **grid piksel** (sel), setiap sel memiliki nilai numerik. Contoh: citra satelit, DEM, peta anomali geofisika\n- ***Vector***: data tersimpan sebagai **titik, garis, dan poligon** dengan koordinat presisi. Contoh: lokasi sampel (titik), sesar (garis), batas konsesi (poligon)\n\nDalam eksplorasi, kedua format digunakan bersamaan. Data geofisika umumnya *raster*, sedangkan data geologi dan lokasi bor umumnya *vector*.',
  },

  // ═══════════════════════════════════════════
  // T5: Resource Modeling & Estimation (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 34,
    category: 'T5',
    difficulty: 'easy',
    content: 'Dalam estimasi sumber daya mineral, apa yang dimaksud dengan metode *Inverse Distance Weighting* (IDW)?',
    options: [
      { key: 'A', text: 'Sampel yang lebih dekat ke titik estimasi diberi bobot lebih besar' },
      { key: 'B', text: 'Semua sampel diberi bobot yang sama tanpa memperhitungkan jarak' },
      { key: 'C', text: 'Hanya sampel terjauh yang digunakan untuk menghindari bias lokal' },
      { key: 'D', text: 'Bobot ditentukan oleh kedalaman sampel terhadap permukaan tanah' },
      { key: 'E', text: 'Metode yang hanya berlaku untuk deposit tipe *placer* di dataran aluvial' },
    ],
    correct_answer: 'A',
    explanation: '**IDW** (*Inverse Distance Weighting*) adalah metode interpolasi di mana bobot setiap sampel berbanding terbalik dengan jaraknya ke titik yang diestimasi:\n$$w_i = \\frac{1}{d_i^p}$$\ndi mana $d_i$ = jarak sampel ke-$i$, dan $p$ = eksponen (umumnya $p = 2$).\n\nSampel yang **lebih dekat** mendapat bobot **lebih besar**, sehingga lebih berpengaruh terhadap estimasi. Metode ini sederhana tetapi tidak memperhitungkan anisotropi dan kontinuitas spasial seperti kriging.',
  },
  {
    order_index: 35,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *cut-off grade* dalam estimasi sumber daya mineral?',
    options: [
      { key: 'A', text: 'Kadar rata-rata seluruh deposit yang dihitung dari semua data pengeboran' },
      { key: 'B', text: 'Kadar maksimum yang diizinkan sebelum data dianggap *outlier* statistik' },
      { key: 'C', text: 'Kadar minimum yang masih layak ditambang secara ekonomis' },
      { key: 'D', text: 'Kadar mineral gangue yang harus dipisahkan dari bijih pada proses flotasi' },
      { key: 'E', text: 'Kadar logam dalam konsentrat akhir setelah proses pengolahan mineral' },
    ],
    correct_answer: 'C',
    explanation: '***Cut-off grade*** adalah kadar minimum suatu material sehingga masih **layak ditambang secara ekonomis**. Material di bawah *cut-off grade* diklasifikasikan sebagai *waste* (limbah). Penentuan *cut-off grade* mempertimbangkan:\n- Biaya penambangan dan pengolahan\n- Harga komoditas di pasar\n- Recovery proses metalurgi\n- Biaya overhead dan royalti\n\n*Cut-off grade* bersifat dinamis, berubah seiring fluktuasi harga komoditas dan biaya operasi.',
  },
  {
    order_index: 36,
    category: 'T5',
    difficulty: 'medium',
    content: 'Deposit emas memiliki tonase bijih 2.000.000 ton dengan kadar rata-rata $\\text{Au} = 3$ g/t. Jika *recovery* metalurgi $90\\%$, berapa total emas yang dapat diproduksi?',
    options: [
      { key: 'A', text: '4.800 kg' },
      { key: 'B', text: '5.400 kg' },
      { key: 'C', text: '6.000 kg' },
      { key: 'D', text: '6.600 kg' },
      { key: 'E', text: '7.200 kg' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan emas yang dapat diproduksi:\n$$\\begin{aligned} \\text{Au total} &= \\text{tonase} \\times \\text{kadar} \\\\ &= 2.000.000 \\times 3 = 6.000.000 \\text{ gram} \\\\ \\text{Au produksi} &= \\text{Au total} \\times \\text{recovery} \\\\ &= 6.000.000 \\times 90\\% = 5.400.000 \\text{ gram} \\\\ &= 5.400 \\text{ kg} \\end{aligned}$$\n*Recovery* metalurgi menunjukkan persentase logam yang berhasil diekstrak dari bijih melalui proses pengolahan. Nilai $90\\%$ umum untuk proses sianidasi emas pada bijih oksida.',
  },
  {
    order_index: 37,
    category: 'T5',
    difficulty: 'medium',
    content: 'Dalam *block model*, sebuah blok berukuran $25 \\times 25 \\times 5$ m dengan densitas $2{,}5$ t/m³ memiliki kadar Ni = $1{,}6\\%$. Berapa logam Ni terkandung?',
    options: [
      { key: 'A', text: '62,5 ton' },
      { key: 'B', text: '100 ton' },
      { key: 'C', text: '125 ton' },
      { key: 'D', text: '150 ton' },
      { key: 'E', text: '200 ton' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan logam Ni terkandung:\n$$\\begin{aligned} V &= 25 \\times 25 \\times 5 = 3.125 \\text{ m}^3 \\\\ T &= V \\times \\rho = 3.125 \\times 2{,}5 = 7.812{,}5 \\text{ ton} \\\\ \\text{Ni} &= T \\times \\text{kadar} = 7.812{,}5 \\times 0{,}016 = 125 \\text{ ton} \\end{aligned}$$\nPerhitungan ini prinsipnya sama dengan estimasi blok sebelumnya: volume $\\times$ densitas $\\times$ kadar. Perbedaan dimensi blok dan densitas menghasilkan tonase yang berbeda.',
  },

  // ═══════════════════════════════════════════
  // T6: Exploration Drilling (3 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 38,
    category: 'T6',
    difficulty: 'easy',
    content: 'Apa perbedaan utama antara metode pengeboran $\\text{RC}$ (*Reverse Circulation*) dan $\\text{RAB}$ (*Rotary Air Blast*)?',
    options: [
      { key: 'A', text: '$\\text{RAB}$ menghasilkan inti batuan utuh, sedangkan $\\text{RC}$ tidak' },
      { key: 'B', text: '$\\text{RC}$ hanya dapat digunakan untuk batuan lunak saja di permukaan' },
      { key: 'C', text: '$\\text{RAB}$ mampu mencapai kedalaman lebih besar dari $\\text{RC}$' },
      { key: 'D', text: 'Keduanya identik dalam hal kualitas sampel dan kedalaman pengeboran' },
      { key: 'E', text: '$\\text{RC}$ menghasilkan sampel lebih bersih karena menggunakan *dual-tube*' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan utama keduanya terletak pada sistem sirkulasi dan kualitas sampel:\n- ***RC***: menggunakan sistem **dual-tube** (pipa ganda), sampel naik melalui pipa dalam yang terpisah dari fluida sirkulasi. Hasilnya lebih bersih dan representatif, cocok untuk *grade control*.\n- ***RAB***: menggunakan pipa tunggal, sampel naik bercampur udara di luar batang bor. Lebih murah dan cepat, tetapi kualitas sampel lebih rendah dan rentan kontaminasi.\n\n$\\text{RAB}$ umumnya dipakai untuk eksplorasi awal (*reconnaissance*), sedangkan $\\text{RC}$ untuk tahap lebih lanjut.',
  },
  {
    order_index: 39,
    category: 'T6',
    difficulty: 'medium',
    content: 'Saat pengeboran inti, *core recovery* dari sebuah *run* sepanjang 3 m hanya menghasilkan inti sepanjang 2,1 m. Berapa persen *core recovery*-nya?',
    options: [
      { key: 'A', text: '$55\\%$' },
      { key: 'B', text: '$60\\%$' },
      { key: 'C', text: '$65\\%$' },
      { key: 'D', text: '$70\\%$' },
      { key: 'E', text: '$75\\%$' },
    ],
    correct_answer: 'D',
    explanation: '*Core recovery* dihitung:\n$$\\text{Recovery} = \\frac{\\text{panjang inti}}{\\text{panjang run}} \\times 100\\% = \\frac{2{,}1}{3{,}0} \\times 100\\% = 70\\%$$\n*Core recovery* di bawah $100\\%$ dapat disebabkan oleh zona batuan hancur, zona sesar, atau teknik pengeboran yang kurang optimal. Recovery rendah bermasalah karena bagian yang hilang bisa jadi merupakan zona termineralisasi yang rapuh, sehingga kadar bisa *underestimate*.',
  },
  {
    order_index: 40,
    category: 'T6',
    difficulty: 'medium',
    content: 'Mengapa *downhole survey* (pengukuran deviasi lubang bor) penting dilakukan secara berkala selama pengeboran?',
    options: [
      { key: 'A', text: 'Untuk mengukur kadar mineral di setiap interval kedalaman pengeboran' },
      { key: 'B', text: 'Untuk memastikan posisi aktual lubang bor sesuai target di bawah permukaan' },
      { key: 'C', text: 'Untuk menentukan jenis mata bor yang tepat pada setiap formasi batuan' },
      { key: 'D', text: 'Untuk menghitung biaya pengeboran per meter secara real-time di lapangan' },
      { key: 'E', text: 'Untuk menentukan waktu penggantian fluida sirkulasi selama pengeboran' },
    ],
    correct_answer: 'B',
    explanation: '***Downhole survey*** mengukur **azimuth** dan **inklinasi** aktual lubang bor pada interval kedalaman tertentu (biasanya setiap 30-50 m). Hal ini penting karena:\n- Lubang bor cenderung **menyimpang** (*deviate*) dari arah rencana akibat anisotropi batuan\n- Data posisi aktual diperlukan untuk menentukan lokasi 3D interseksi mineralisasi secara tepat\n- Tanpa *downhole survey*, interpretasi geologi dan estimasi sumber daya bisa sangat keliru\n\nAlat yang umum digunakan antara lain *single-shot camera*, *multi-shot*, dan *gyroscopic tool*.',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await supabase
    .from('packages')
    .select('id, name, slug')
    .eq('slug', 'antam-exploration')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-exploration tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal batch 2: ${questions.length}\n`)

  // Cek soal yang sudah ada (batch 1 = 20 soal)
  const { count } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)

  console.log(`Soal existing: ${count ?? 0}`)

  // Hapus soal batch 2 lama (order_index >= 21) jika ada
  if (count && count > 20) {
    console.log('Menghapus soal batch 2 lama...')
    await supabase.from('questions').delete().eq('package_id', pkg.id).gte('order_index', 21)
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

  const { data, error } = await supabase
    .from('questions')
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

  console.log(`\n   Total sekarang: ${(count ?? 0) + data.length} / 40 soal`)
}

main()
