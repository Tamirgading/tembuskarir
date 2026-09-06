/**
 * ANTAM IMPACT 2026 — Processing (PRC) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Termodinamika & Kinetika): 4 soal (3 konsep + 1 hitungan)
 *   T2 (Pengolahan Mineral): 4 soal (2 konsep + 2 hitungan)
 *   T3 (Ekstraksi Metalurgi): 4 soal (3 konsep + 1 hitungan)
 *   T4 (Unit Operasi & Pemodelan): 4 soal (2 konsep + 2 hitungan)
 *   T5 (Pengendalian Mutu & Lingkungan): 4 soal (4 konsep)
 *
 * Jalankan: npx tsx scripts/seed-antam-prc-batch2.ts
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

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Termodinamika & Kinetika Reaksi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *heat transfer* (perpindahan panas) secara konduksi?',
    options: [
      { key: 'A', text: 'Perpindahan panas melalui aliran fluida yang bergerak naik karena perbedaan densitas' },
      { key: 'B', text: 'Perpindahan panas melalui gelombang elektromagnetik tanpa memerlukan medium' },
      { key: 'C', text: 'Perpindahan panas melalui material padat dari area bersuhu tinggi ke rendah' },
      { key: 'D', text: 'Perpindahan panas yang hanya terjadi di dalam ruang hampa udara' },
      { key: 'E', text: 'Perpindahan panas yang dihasilkan oleh reaksi kimia di dalam reaktor' },
    ],
    correct_answer: 'C',
    explanation: '**Perpindahan panas secara konduksi** terjadi melalui **material padat** dari daerah bersuhu tinggi ke daerah bersuhu rendah, tanpa perpindahan materi. Dirumuskan oleh Hukum Fourier:\n$$q = -k \\cdot A \\cdot \\frac{dT}{dx}$$\ndi mana $k$ = konduktivitas termal, $A$ = luas penampang, $\\frac{dT}{dx}$ = gradien suhu.\n\nTiga mekanisme perpindahan panas:\n1. **Konduksi**: melalui benda padat (dinding tungku, pipa)\n2. **Konveksi**: melalui fluida yang bergerak (udara, air pendingin)\n3. **Radiasi**: melalui gelombang elektromagnetik (panas tungku ke lingkungan)',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'medium',
    content: 'Mengapa reaksi pelindian (*leaching*) di dalam autoklaf dilakukan pada tekanan tinggi?',
    options: [
      { key: 'A', text: 'Tekanan tinggi membuat larutan pelindi menjadi lebih encer dan mudah disaring' },
      { key: 'B', text: 'Tekanan tinggi mengurangi volume tangki yang diperlukan untuk proses' },
      { key: 'C', text: 'Tekanan tinggi menghilangkan kebutuhan bahan kimia pelindi sama sekali' },
      { key: 'D', text: 'Tekanan tinggi membuat bijih menjadi lebih lunak secara mekanis' },
      { key: 'E', text: 'Tekanan tinggi memungkinkan suhu lebih dari 100°C sehingga reaksi lebih cepat' },
    ],
    correct_answer: 'E',
    explanation: '**Autoklaf** (*pressure leaching*) menggunakan tekanan tinggi (1-5 MPa) untuk **memungkinkan suhu operasi melebihi titik didih air** pada tekanan atmosfer (100°C). Manfaatnya:\n- **Laju reaksi meningkat** sesuai persamaan Arrhenius ($k = A \\cdot e^{-E_a/RT}$)\n- *Recovery* logam lebih tinggi karena pelindian lebih sempurna\n- Waktu proses lebih singkat\n\nContoh aplikasi:\n- HPAL (*High Pressure Acid Leaching*) untuk nikel laterit: $250°C$, 4 MPa\n- POX (*Pressure Oxidation*) untuk emas refraktori: $180$-$225°C$',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'medium',
    content: 'Dalam neraca massa (*mass balance*), jika 100 ton bijih masuk ke proses dan menghasilkan 30 ton konsentrat serta 65 ton tailing, berapa ton material yang hilang?',
    options: [
      { key: 'A', text: '3 ton material hilang dari sistem' },
      { key: 'B', text: '4 ton material hilang dari sistem' },
      { key: 'C', text: '6 ton material hilang dari sistem' },
      { key: 'D', text: '5 ton material hilang dari sistem' },
      { key: 'E', text: '7 ton material hilang dari sistem' },
    ],
    correct_answer: 'D',
    explanation: 'Perhitungan neraca massa:\n$$\\begin{aligned} \\text{Input} &= \\text{Output} + \\text{Losses} \\\\ 100 &= 30 + 65 + \\text{Losses} \\\\ \\text{Losses} &= 100 - 95 = 5 \\text{ ton} \\end{aligned}$$\nMaterial yang hilang ($5\\%$) bisa berupa:\n- **Debu** yang terbawa udara saat penghancuran dan penggerusan\n- **Material terlarut** dalam air proses yang ikut terbuang\n- **Spillage** (tumpahan) di sepanjang jalur proses\n\nNeraca massa yang akurat penting untuk mengontrol *recovery* dan mendeteksi kehilangan material.',
  },
  {
    order_index: 24,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *residence time* (waktu tinggal) dalam sebuah reaktor?',
    options: [
      { key: 'A', text: 'Durasi rata-rata material berada di dalam reaktor untuk bereaksi' },
      { key: 'B', text: 'Waktu shift kerja operator yang bertugas mengoperasikan reaktor' },
      { key: 'C', text: 'Interval waktu antara dua kali perawatan berkala pada reaktor' },
      { key: 'D', text: 'Waktu yang dibutuhkan untuk membangun dan memasang reaktor di pabrik' },
      { key: 'E', text: 'Masa pakai reaktor dari pemasangan hingga penggantian unit baru' },
    ],
    correct_answer: 'A',
    explanation: '***Residence time*** adalah **durasi rata-rata material berada di dalam reaktor** selama proses berlangsung. Dihitung sebagai:\n$$\\tau = \\frac{V}{Q}$$\ndi mana $V$ = volume reaktor dan $Q$ = laju alir volumetrik.\n\n*Residence time* yang terlalu singkat menyebabkan reaksi tidak tuntas, sedangkan terlalu lama menurunkan kapasitas produksi. Contoh:\n- Tangki pelindian: 4-24 jam\n- Sel flotasi: 5-20 menit\n- Autoklaf HPAL: 60-90 menit',
  },

  // ═══════════════════════════════════════════
  // T2: Prinsip Pengolahan Mineral (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa fungsi *hydrocyclone* dalam sirkuit penggerusan (*grinding circuit*)?',
    options: [
      { key: 'A', text: 'Menghancurkan bijih dengan media bola baja di dalam silinder berputar' },
      { key: 'B', text: 'Mengklasifikasikan partikel berdasarkan ukuran menggunakan gaya sentrifugal' },
      { key: 'C', text: 'Menambahkan air ke dalam pulp untuk mengatur persen padatan' },
      { key: 'D', text: 'Mengukur distribusi ukuran partikel secara otomatis dan kontinu' },
      { key: 'E', text: 'Memompa pulp dari ball mill ke tangki penampungan berikutnya' },
    ],
    correct_answer: 'B',
    explanation: '***Hydrocyclone*** berfungsi untuk **mengklasifikasikan partikel berdasarkan ukuran** menggunakan gaya sentrifugal:\n- **Umpan** masuk secara tangensial, menciptakan aliran berputar (*vortex*)\n- **Partikel kasar** (berat) terlempar ke dinding dan keluar melalui *underflow* (apex) - dikembalikan ke mill\n- **Partikel halus** (ringan) terbawa *overflow* (vortex finder) - lanjut ke proses berikutnya\n\nKeunggulan hydrocyclone:\n- Kapasitas tinggi dengan ukuran kompak\n- Tidak ada bagian bergerak (low maintenance)\n- Titik pemisahan (*cut size*) dapat diatur melalui tekanan umpan dan ukuran apex/vortex finder',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah pabrik pengolahan menerima 500 ton/jam bijih dengan kadar $1{,}2\\%$ Ni. Setelah konsentrasi, dihasilkan 50 ton/jam konsentrat berkadar $10\\%$ Ni. Berapa *recovery* nikel?',
    options: [
      { key: 'A', text: '$75{,}0\\%$ recovery nikel' },
      { key: 'B', text: '$80{,}0\\%$ recovery nikel' },
      { key: 'C', text: '$83{,}3\\%$ recovery nikel' },
      { key: 'D', text: '$85{,}0\\%$ recovery nikel' },
      { key: 'E', text: '$90{,}0\\%$ recovery nikel' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan *recovery* nikel:\n$$\\begin{aligned} \\text{Ni dalam bijih} &= 500 \\times 1{,}2\\% = 6{,}0 \\text{ ton/jam} \\\\ \\text{Ni dalam konsentrat} &= 50 \\times 10\\% = 5{,}0 \\text{ ton/jam} \\\\ \\text{Recovery} &= \\frac{5{,}0}{6{,}0} \\times 100\\% = 83{,}3\\% \\end{aligned}$$\nArtinya $83{,}3\\%$ nikel dalam bijih berhasil dipulihkan ke dalam konsentrat. Sisanya ($16{,}7\\%$) hilang bersama tailing.',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa prinsip kerja *magnetic separator* dalam pengolahan mineral?',
    options: [
      { key: 'A', text: 'Memisahkan mineral berdasarkan perbedaan respons terhadap medan magnet' },
      { key: 'B', text: 'Menghancurkan mineral menggunakan medan magnet frekuensi tinggi' },
      { key: 'C', text: 'Memanaskan mineral dengan induksi magnetik hingga meleleh' },
      { key: 'D', text: 'Mengukur kadar logam dalam bijih menggunakan sensor magnetik' },
      { key: 'E', text: 'Menyaring partikel halus menggunakan jaring baja bermagnet' },
    ],
    correct_answer: 'A',
    explanation: '***Magnetic separator*** memisahkan mineral berdasarkan **perbedaan sifat magnetik** (*magnetic susceptibility*):\n\n- **Ferromagnetik**: sangat kuat tertarik magnet (magnetit $\\text{Fe}_3\\text{O}_4$)\n- **Paramagnetik**: sedikit tertarik magnet (ilmenit, garnet, pirit)\n- **Diamagnetik**: tidak tertarik/sedikit ditolak magnet (kuarsa, kalsit)\n\nJenis separator:\n- **Low intensity** (LIMS): untuk mineral ferromagnetik, intensitas < 0,3 T\n- **High intensity** (HIMS/WHIMS): untuk mineral paramagnetik, intensitas > 1 T\n\nContoh: pemisahan magnetit dari silika pada bijih besi.',
  },
  {
    order_index: 28,
    category: 'T2',
    difficulty: 'medium',
    content: 'Dalam proses *screening* (pengayakan), apa yang dimaksud dengan *oversize* dan *undersize*?',
    options: [
      { key: 'A', text: '*Oversize* = partikel yang lolos ayakan, *undersize* = yang tertahan' },
      { key: 'B', text: '*Oversize* = ayakan yang terlalu besar, *undersize* = ayakan yang terlalu kecil' },
      { key: 'C', text: '*Oversize* = partikel rusak saat diayak, *undersize* = partikel utuh' },
      { key: 'D', text: '*Oversize* = kapasitas melebihi desain, *undersize* = kapasitas di bawah desain' },
      { key: 'E', text: '*Oversize* = partikel yang tertahan di atas ayakan, *undersize* = yang lolos' },
    ],
    correct_answer: 'E',
    explanation: 'Dalam proses *screening*:\n- ***Oversize*** (reject): partikel yang **tertahan di atas ayakan** karena ukurannya lebih besar dari bukaan ayakan\n- ***Undersize*** (accept/pass): partikel yang **lolos melalui ayakan** karena ukurannya lebih kecil dari bukaan\n\nEfisiensi screening dipengaruhi oleh:\n- Ukuran dan bentuk bukaan ayakan\n- Kelembaban material (material basah cenderung menggumpal)\n- Beban umpan (*feed rate*)\n- Amplitudo dan frekuensi getaran ayakan',
  },

  // ═══════════════════════════════════════════
  // T3: Ekstraksi Metalurgi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa tujuan proses *roasting* (pemanggangan) dalam pirometalurgi?',
    options: [
      { key: 'A', text: 'Melebur bijih hingga cair untuk memisahkan logam dari terak' },
      { key: 'B', text: 'Melarutkan logam dari bijih menggunakan asam kuat dalam tangki' },
      { key: 'C', text: 'Mengendapkan logam dari larutan menggunakan arus listrik' },
      { key: 'D', text: 'Menghancurkan bijih menjadi partikel halus untuk proses selanjutnya' },
      { key: 'E', text: 'Mengoksidasi mineral sulfida menjadi oksida pada suhu di bawah titik lebur' },
    ],
    correct_answer: 'E',
    explanation: '***Roasting*** (pemanggangan) adalah proses **mengoksidasi mineral sulfida menjadi oksida** pada suhu tinggi namun **di bawah titik lebur** material:\n$$2\\text{ZnS} + 3\\text{O}_2 \\rightarrow 2\\text{ZnO} + 2\\text{SO}_2$$\n\nTujuan roasting:\n- Menghilangkan sulfur dari konsentrat sulfida\n- Mengubah sulfida menjadi oksida yang lebih mudah direduksi atau dilindi\n- Menghilangkan arsenik dan antimon yang mengganggu proses berikutnya\n\nPerbedaan dengan *smelting*: roasting tidak melebur material, sedangkan smelting melebur material hingga fasa cair.',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'medium',
    content: 'Dalam proses Bayer untuk pemurnian alumina, bauksit dilarutkan dalam larutan NaOH. Apa produk utama yang dihasilkan?',
    options: [
      { key: 'A', text: 'Logam aluminium murni siap pakai' },
      { key: 'B', text: 'Alumina ($\\text{Al}_2\\text{O}_3$) murni untuk dilebur menjadi aluminium' },
      { key: 'C', text: 'Aluminium sulfat yang digunakan sebagai koagulan air' },
      { key: 'D', text: 'Aluminium klorida untuk katalis dalam industri petrokimia' },
      { key: 'E', text: 'Aluminium foil yang langsung siap untuk pengemasan' },
    ],
    correct_answer: 'B',
    explanation: '**Proses Bayer** menghasilkan **alumina** ($\\text{Al}_2\\text{O}_3$) murni dari bauksit. Tahapannya:\n1. **Digestion**: bauksit dilarutkan dalam NaOH panas bertekanan\n$$\\text{Al}_2\\text{O}_3 + 2\\text{NaOH} + 3\\text{H}_2\\text{O} \\rightarrow 2\\text{Na[Al(OH)}_4]$$\n2. **Clarification**: pengotor (red mud) dipisahkan\n3. **Precipitation**: aluminium hidroksida diendapkan dari larutan\n4. **Calcination**: pemanasan $\\text{Al(OH)}_3$ pada $\\sim 1.000°C$ menjadi $\\text{Al}_2\\text{O}_3$\n\nAlumina kemudian dilebur menjadi aluminium melalui proses Hall-Heroult (elektrometalurgi).',
  },
  {
    order_index: 31,
    category: 'T3',
    difficulty: 'medium',
    content: 'Proses *electrorefining* tembaga menggunakan anoda tembaga kotor (99,5% Cu). Setelah proses, katoda memiliki kemurnian 99,99% Cu. Apa yang terjadi pada pengotor?',
    options: [
      { key: 'A', text: 'Pengotor menguap ke udara karena suhu tinggi saat proses berlangsung' },
      { key: 'B', text: 'Pengotor menempel di dinding tangki elektrolisis secara merata' },
      { key: 'C', text: 'Pengotor larut di elektrolit atau mengendap sebagai lumpur anoda' },
      { key: 'D', text: 'Pengotor terserap oleh membran pemisah di antara anoda dan katoda' },
      { key: 'E', text: 'Pengotor berubah menjadi gas hidrogen yang dilepaskan ke atmosfer' },
    ],
    correct_answer: 'C',
    explanation: 'Dalam ***electrorefining*** tembaga:\n- **Anoda** (tembaga kotor) larut secara elektrokimia\n- **Katoda** (tembaga murni) tumbuh dari ion $\\text{Cu}^{2+}$ yang tereduksi\n\nPengotor memiliki nasib berbeda:\n- **Logam lebih mulia** (Au, Ag, Pt): tidak larut, mengendap sebagai **lumpur anoda** (*anode slime*) yang bernilai tinggi\n- **Logam kurang mulia** (Fe, Zn, Ni): larut ke elektrolit tetapi tidak terendapkan di katoda\n- **Pengotor tak larut** (Se, Te): ikut mengendap di lumpur anoda\n\nLumpur anoda diproses lebih lanjut untuk mengambil logam mulia.',
  },
  {
    order_index: 32,
    category: 'T3',
    difficulty: 'easy',
    content: 'Proses RKEF (*Rotary Kiln-Electric Furnace*) banyak digunakan di Indonesia untuk mengolah bijih nikel laterit. Apa produk utama dari proses ini?',
    options: [
      { key: 'A', text: 'Feronikel (FeNi) dengan kadar Ni 15-25% untuk industri baja tahan karat' },
      { key: 'B', text: 'Nikel sulfat ($\\text{NiSO}_4$) untuk bahan baku baterai kendaraan listrik' },
      { key: 'C', text: 'Nikel murni (Ni 99,9%) dalam bentuk katoda siap jual' },
      { key: 'D', text: 'Nikel karbonil ($\\text{Ni(CO)}_4$) untuk pelapisan logam dan katalis' },
      { key: 'E', text: 'Nikel oksida ($\\text{NiO}$) untuk industri keramik dan kaca khusus' },
    ],
    correct_answer: 'A',
    explanation: 'Proses **RKEF** menghasilkan **feronikel** (FeNi) dengan kadar Ni $15$-$25\\%$. Tahapannya:\n1. **Rotary dryer**: mengeringkan bijih dari $\\sim 30\\%$ menjadi $\\sim 20\\%$ moisture\n2. **Rotary kiln**: kalsinasi dan pre-reduksi pada $700$-$900°C$\n3. **Electric furnace** (SAF): peleburan pada $1.500$-$1.600°C$ menghasilkan feronikel cair\n4. **Refining**: pemurnian untuk mengurangi C, Si, dan S\n\nFeronikel digunakan sebagai bahan baku pembuatan **stainless steel**. Indonesia merupakan salah satu produsen feronikel terbesar di dunia.',
  },

  // ═══════════════════════════════════════════
  // T4: Unit Operasi & Pemodelan Proses (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa perbedaan utama antara pompa sentrifugal dan pompa *positive displacement*?',
    options: [
      { key: 'A', text: 'Pompa sentrifugal hanya untuk gas, pompa PD hanya untuk cairan' },
      { key: 'B', text: 'Pompa sentrifugal cocok untuk debit tinggi-head rendah, pompa PD untuk head tinggi-debit rendah' },
      { key: 'C', text: 'Pompa sentrifugal tidak memerlukan motor listrik untuk beroperasi' },
      { key: 'D', text: 'Pompa sentrifugal tidak memiliki bagian bergerak di dalamnya' },
      { key: 'E', text: 'Pompa sentrifugal hanya bisa memompa air bersih tanpa padatan' },
    ],
    correct_answer: 'B',
    explanation: 'Perbedaan dua jenis pompa:\n\n**Pompa sentrifugal**:\n- Mengubah energi kinetik impeller menjadi tekanan\n- Cocok untuk **debit tinggi, head rendah-sedang**\n- Debit bervariasi terhadap tekanan balik\n- Umum di pabrik pengolahan mineral (memompa pulp/slurry)\n\n**Pompa *positive displacement* (PD)**:\n- Memindahkan volume tetap per siklus (piston, diafragma, peristaltik)\n- Cocok untuk **head tinggi, debit rendah-sedang**\n- Debit relatif konstan terhadap tekanan\n- Umum untuk dosing reagen, memompa lumpur kental',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'medium',
    content: 'Sebuah tangki pelindian berbentuk silinder memiliki volume $200$ m³ dan menerima umpan $10$ m³/jam. Berapa *residence time* material di dalam tangki?',
    options: [
      { key: 'A', text: '$10$ jam' },
      { key: 'B', text: '$15$ jam' },
      { key: 'C', text: '$20$ jam' },
      { key: 'D', text: '$25$ jam' },
      { key: 'E', text: '$30$ jam' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan *residence time*:\n$$\\begin{aligned} \\tau &= \\frac{V}{Q} = \\frac{200 \\text{ m}^3}{10 \\text{ m}^3\\text{/jam}} = 20 \\text{ jam} \\end{aligned}$$\n*Residence time* 20 jam berarti rata-rata material berada di dalam tangki selama 20 jam sebelum keluar. Untuk memastikan reaksi pelindian cukup, *residence time* harus lebih besar dari waktu yang dibutuhkan untuk mencapai *recovery* target.\n\nJika *recovery* yang dicapai belum memadai, dapat menambah volume tangki atau mengurangi laju alir umpan.',
  },
  {
    order_index: 35,
    category: 'T4',
    difficulty: 'easy',
    content: 'Dalam instrumentasi pabrik, apa fungsi *flow meter*?',
    options: [
      { key: 'A', text: 'Mengukur tekanan fluida di dalam perpipaan secara kontinu' },
      { key: 'B', text: 'Mengukur temperatur fluida yang mengalir dalam pipa proses' },
      { key: 'C', text: 'Mengatur kecepatan putaran motor pompa secara otomatis' },
      { key: 'D', text: 'Mengukur laju aliran fluida yang mengalir dalam pipa atau saluran' },
      { key: 'E', text: 'Mendeteksi kebocoran pada sambungan pipa di area pabrik' },
    ],
    correct_answer: 'D',
    explanation: '***Flow meter*** berfungsi untuk **mengukur laju aliran** (debit) fluida dalam pipa. Jenis flow meter yang umum di pabrik pengolahan:\n\n- **Electromagnetic**: untuk pulp/slurry konduktif, tidak ada bagian bergerak\n- **Ultrasonic**: non-invasif, dipasang di luar pipa\n- **Coriolis**: mengukur massa dan densitas sekaligus\n- **Orifice plate**: sederhana, biaya rendah, cocok untuk gas dan cairan bersih\n\nData flow meter penting untuk:\n- Mengontrol neraca massa proses\n- Mengatur dosis reagen secara proporsional\n- Monitoring produktivitas pabrik',
  },
  {
    order_index: 36,
    category: 'T4',
    difficulty: 'medium',
    content: 'Berapa tekanan yang dialami dasar tangki berisi pulp jika tinggi pulp $8$ m dan densitas pulp $1.500$ kg/m³?',
    options: [
      { key: 'A', text: 'Sekitar $78{,}5$ kPa' },
      { key: 'B', text: 'Sekitar $98{,}1$ kPa' },
      { key: 'C', text: 'Sekitar $147{,}2$ kPa' },
      { key: 'D', text: 'Sekitar $58{,}9$ kPa' },
      { key: 'E', text: 'Sekitar $117{,}7$ kPa' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan tekanan hidrostatik:\n$$\\begin{aligned} P &= \\rho \\cdot g \\cdot h \\\\ &= 1.500 \\times 9{,}81 \\times 8 \\\\ &= 117.720 \\text{ Pa} \\approx 117{,}7 \\text{ kPa} \\end{aligned}$$\nTekanan ini setara dengan sekitar $1{,}18$ atm di atas tekanan atmosfer. Dinding dan dasar tangki harus didesain mampu menahan tekanan ini ditambah faktor keamanan, terutama jika tangki berisi pulp yang bersifat korosif.',
  },

  // ═══════════════════════════════════════════
  // T5: Pengendalian Mutu & Lingkungan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 37,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan limbah B3 dalam konteks pabrik pengolahan mineral?',
    options: [
      { key: 'A', text: 'Limbah Besar 3 kategori yaitu padat, cair, dan gas dari seluruh operasi' },
      { key: 'B', text: 'Limbah Bahan Berbahaya dan Beracun yang memerlukan pengelolaan khusus' },
      { key: 'C', text: 'Limbah dari 3 sumber utama yaitu tambang, pabrik, dan kantor pusat' },
      { key: 'D', text: 'Limbah yang volume totalnya melebihi 3 ton per hari dari pabrik' },
      { key: 'E', text: 'Limbah yang sudah melewati 3 tahap pengolahan di instalasi limbah' },
    ],
    correct_answer: 'B',
    explanation: '**Limbah B3** adalah **Limbah Bahan Berbahaya dan Beracun** yang karena sifat, konsentrasi, atau jumlahnya dapat mencemari lingkungan dan membahayakan kesehatan. Karakteristik limbah B3:\n- **Mudah meledak** (*explosive*)\n- **Mudah menyala** (*flammable*)\n- **Reaktif** dan **korosif**\n- **Beracun** (*toxic*)\n- **Infeksius**\n\nContoh limbah B3 di pabrik pengolahan:\n- Tailing yang mengandung logam berat (As, Hg, Pb, Cd)\n- Asam bekas dari proses pelindian\n- Oli bekas dan pelumas dari peralatan\n\nPengelolaan diatur oleh PP No. 22 Tahun 2021.',
  },
  {
    order_index: 38,
    category: 'T5',
    difficulty: 'medium',
    content: 'Mengapa pH air limbah tambang harus dikontrol sebelum dibuang ke badan air?',
    options: [
      { key: 'A', text: 'pH rendah dapat melarutkan logam berat dan membunuh organisme akuatik' },
      { key: 'B', text: 'pH hanya mempengaruhi warna air dan tidak berdampak pada ekosistem' },
      { key: 'C', text: 'pH tinggi meningkatkan kandungan oksigen terlarut di sungai' },
      { key: 'D', text: 'pH netral menyebabkan pertumbuhan alga berlebihan di perairan' },
      { key: 'E', text: 'pH tidak perlu dikontrol jika volume pembuangan kurang dari 100 m³/hari' },
    ],
    correct_answer: 'A',
    explanation: 'Pengendalian **pH air limbah tambang** sangat penting karena:\n- **pH rendah** (asam) melarutkan logam berat ($\\text{Fe}$, $\\text{Cu}$, $\\text{Zn}$, $\\text{Mn}$) yang beracun bagi organisme\n- Air asam tambang (AMD) dapat membunuh ikan dan invertebrata akuatik\n- Baku mutu air limbah mensyaratkan pH $6$-$9$\n\nMetode netralisasi:\n- Penambahan **kapur** ($\\text{Ca(OH)}_2$) atau **batu kapur** ($\\text{CaCO}_3$)\n- Sistem *passive treatment* menggunakan *constructed wetland*\n- *Active treatment* dengan dosing otomatis dan monitoring kontinu',
  },
  {
    order_index: 39,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa tujuan pengambilan sampel (*sampling*) secara rutin di berbagai titik proses pabrik?',
    options: [
      { key: 'A', text: 'Memenuhi kebutuhan arsip laboratorium tanpa tujuan analisis lebih lanjut' },
      { key: 'B', text: 'Menyediakan contoh produk untuk diberikan kepada calon pembeli' },
      { key: 'C', text: 'Mengurangi volume material di dalam proses agar tidak melebihi kapasitas' },
      { key: 'D', text: 'Memantau kualitas dan kinerja proses agar produk memenuhi spesifikasi' },
      { key: 'E', text: 'Mengumpulkan material untuk penelitian akademis di universitas' },
    ],
    correct_answer: 'D',
    explanation: '**Sampling** rutin di pabrik bertujuan untuk:\n- **Memantau kualitas** umpan, konsentrat, tailing, dan produk akhir\n- **Mengontrol kinerja proses**: recovery, kadar, rasio konsentrasi\n- **Mendeteksi penyimpangan** lebih awal sebelum menjadi masalah besar\n- **Neraca massa dan metalurgi**: memastikan keseimbangan input-output\n\nPrinsip sampling yang baik (representatif):\n- **Gy\'s sampling theory**: kesalahan sampling berbanding terbalik dengan jumlah sampel\n- Ambil sampel dari seluruh aliran (*cross-cut sampling*), bukan hanya permukaan\n- Frekuensi sampling disesuaikan dengan variabilitas proses',
  },
  {
    order_index: 40,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa risiko utama jika bendungan tailing (*tailing dam*) mengalami kegagalan?',
    options: [
      { key: 'A', text: 'Harga komoditas di pasar global akan turun drastis secara langsung' },
      { key: 'B', text: 'Seluruh cadangan bijih di tambang akan habis karena tercampur tailing' },
      { key: 'C', text: 'Peralatan pabrik akan berhenti bekerja karena kekurangan pasokan air' },
      { key: 'D', text: 'Aliran lumpur beracun dapat menghancurkan infrastruktur dan mencemari sungai' },
      { key: 'E', text: 'Kadar logam dalam konsentrat akan menurun dan tidak memenuhi standar' },
    ],
    correct_answer: 'D',
    explanation: 'Kegagalan **bendungan tailing** merupakan salah satu bencana industri tambang terparah:\n- **Aliran lumpur** (*mudflow*) yang masif dan cepat menghancurkan pemukiman dan infrastruktur\n- **Pencemaran sungai** dan lahan pertanian oleh logam berat dan bahan kimia\n- **Korban jiwa** yang signifikan di hilir bendungan\n\nContoh insiden:\n- Brumadinho, Brasil (2019): 270 korban jiwa\n- Samarco, Brasil (2015): 19 korban, 600 km sungai tercemar\n\nPencegahan melalui monitoring *piezometer*, audit berkala, dan penerapan *dry stacking* sebagai alternatif.',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await supabase
    .from('packages')
    .select('id, name, slug')
    .eq('slug', 'antam-processing')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-processing tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal batch 2: ${questions.length}\n`)

  const { count } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)

  console.log(`Soal existing: ${count ?? 0}`)

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

  const { count: total } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('package_id', pkg.id)
  console.log(`\n   Total soal package: ${total} / 40`)
}

main()
