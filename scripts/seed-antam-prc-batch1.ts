/**
 * ANTAM IMPACT 2026 — Processing (PRC) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Termodinamika & Kinetika): 4 soal (2 konsep + 2 hitungan)
 *   T2 (Pengolahan Mineral): 4 soal (3 konsep + 1 hitungan)
 *   T3 (Ekstraksi Metalurgi): 4 soal (3 konsep + 1 hitungan)
 *   T4 (Unit Operasi & Pemodelan): 4 soal (3 konsep + 1 hitungan)
 *   T5 (Pengendalian Mutu & Lingkungan): 4 soal (3 konsep + 1 hitungan)
 *
 * Jalankan: npx tsx scripts/seed-antam-prc-batch1.ts
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
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Hukum Termodinamika pertama menyatakan bahwa energi tidak dapat diciptakan atau dimusnahkan, hanya berubah bentuk. Dalam konteks pabrik pengolahan mineral, prinsip ini paling relevan saat:',
    options: [
      { key: 'A', text: 'Menghitung kebutuhan panas pada tungku peleburan bijih nikel' },
      { key: 'B', text: 'Menentukan warna produk akhir logam di pabrik' },
      { key: 'C', text: 'Memilih jenis kendaraan untuk transportasi bijih ke pelabuhan' },
      { key: 'D', text: 'Menyusun jadwal shift pekerja di area produksi pabrik' },
      { key: 'E', text: 'Menghitung jumlah karyawan yang dibutuhkan di laboratorium' },
    ],
    correct_answer: 'A',
    explanation: '**Hukum Termodinamika I** (Hukum Kekekalan Energi) menyatakan:\n$$\\Delta U = Q - W$$\ndi mana $\\Delta U$ = perubahan energi dalam, $Q$ = panas yang diserap, $W$ = kerja yang dilakukan.\n\nDalam pabrik pengolahan, prinsip ini digunakan untuk:\n- **Menghitung neraca energi** (*energy balance*) pada tungku peleburan\n- Menentukan kebutuhan bahan bakar atau energi listrik\n- Merancang sistem perpindahan panas (*heat exchanger*)\n\nContoh: peleburan bijih nikel laterit memerlukan suhu $1.500$-$1.600°C$, sehingga perhitungan neraca panas sangat penting.',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Sebuah tungku peleburan memerlukan panas $5.000$ MJ untuk melebur 10 ton bijih. Jika efisiensi tungku $80\\%$, berapa energi total yang harus disuplai?',
    options: [
      { key: 'A', text: '$4.000$ MJ' },
      { key: 'B', text: '$5.000$ MJ' },
      { key: 'C', text: '$5.500$ MJ' },
      { key: 'D', text: '$6.250$ MJ' },
      { key: 'E', text: '$7.500$ MJ' },
    ],
    correct_answer: 'D',
    explanation: 'Perhitungan energi total dengan efisiensi tungku:\n$$\\begin{aligned} \\text{Energi suplai} &= \\frac{\\text{Energi yang dibutuhkan}}{\\text{Efisiensi}} \\\\ &= \\frac{5.000}{0{,}80} = 6.250 \\text{ MJ} \\end{aligned}$$\nEfisiensi $80\\%$ berarti $20\\%$ energi hilang sebagai panas buang melalui gas cerobong, radiasi dinding tungku, dan pendinginan air. Optimasi efisiensi termal dilakukan melalui isolasi yang baik dan *waste heat recovery*.',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *exothermic reaction* dalam proses metalurgi?',
    options: [
      { key: 'A', text: 'Reaksi yang menghasilkan gas beracun ke lingkungan sekitar pabrik' },
      { key: 'B', text: 'Reaksi kimia yang melepaskan panas ke lingkungan sekitarnya' },
      { key: 'C', text: 'Reaksi yang hanya terjadi pada suhu di bawah titik beku air' },
      { key: 'D', text: 'Reaksi yang membutuhkan katalis logam mulia agar dapat berlangsung' },
      { key: 'E', text: 'Reaksi yang menghasilkan produk padat dari dua larutan cair' },
    ],
    correct_answer: 'B',
    explanation: '***Exothermic reaction*** adalah reaksi kimia yang **melepaskan panas** ($\\Delta H < 0$) ke lingkungan. Contoh dalam metalurgi:\n- Pembakaran sulfida: $2\\text{FeS}_2 + \\frac{11}{2}\\text{O}_2 \\rightarrow \\text{Fe}_2\\text{O}_3 + 4\\text{SO}_2 + \\text{panas}$\n- Reaksi termit: $\\text{Fe}_2\\text{O}_3 + 2\\text{Al} \\rightarrow 2\\text{Fe} + \\text{Al}_2\\text{O}_3 + \\text{panas}$\n\nKebalikannya, *endothermic reaction* ($\\Delta H > 0$) **menyerap panas**, misalnya kalsinasi batu kapur: $\\text{CaCO}_3 \\rightarrow \\text{CaO} + \\text{CO}_2$.',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'medium',
    content: 'Laju reaksi pelindian (*leaching*) bijih emas meningkat dari $0{,}5$ g/jam pada $25°C$ menjadi $2{,}0$ g/jam pada $50°C$. Berapa kali lipat percepatan laju reaksi?',
    options: [
      { key: 'A', text: '2 kali lipat lebih cepat dari kondisi awal' },
      { key: 'B', text: '3 kali lipat lebih cepat dari kondisi awal' },
      { key: 'C', text: '4 kali lipat lebih cepat dari kondisi awal' },
      { key: 'D', text: '5 kali lipat lebih cepat dari kondisi awal' },
      { key: 'E', text: '6 kali lipat lebih cepat dari kondisi awal' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan percepatan laju reaksi:\n$$\\begin{aligned} \\text{Faktor percepatan} &= \\frac{\\text{Laju pada } 50°C}{\\text{Laju pada } 25°C} \\\\ &= \\frac{2{,}0}{0{,}5} = 4 \\text{ kali lipat} \\end{aligned}$$\nPercepatan ini sesuai dengan **aturan umum kinetika** bahwa setiap kenaikan suhu $10°C$, laju reaksi meningkat sekitar 2 kali lipat (dikenal sebagai *rule of thumb* van\'t Hoff). Kenaikan $25°C$ berarti sekitar $2^{2{,}5} \\approx 4$-$6$ kali lebih cepat.',
  },

  // ═══════════════════════════════════════════
  // T2: Prinsip Pengolahan Mineral (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'easy',
    content: 'Dalam pengolahan mineral, proses *crushing* (penghancuran) bertujuan untuk:',
    options: [
      { key: 'A', text: 'Memperkecil ukuran bijih agar mineral berharga terlepas dari mineral pengotornya' },
      { key: 'B', text: 'Meningkatkan kadar logam dalam bijih melalui reaksi kimia' },
      { key: 'C', text: 'Menghilangkan kandungan air dari bijih yang baru ditambang' },
      { key: 'D', text: 'Mengubah komposisi kimia mineral menjadi logam murni secara langsung' },
      { key: 'E', text: 'Memisahkan mineral berdasarkan perbedaan warna yang terlihat' },
    ],
    correct_answer: 'A',
    explanation: '***Crushing*** (penghancuran) adalah tahap awal pengolahan mineral yang bertujuan **memperkecil ukuran bijih** (*size reduction*) agar:\n- **Mineral berharga terlepas** (*liberated*) dari mineral pengotor (*gangue*)\n- Material siap untuk tahap konsentrasi berikutnya\n- Luas permukaan meningkat untuk proses kimia selanjutnya\n\nTahapan crushing:\n1. **Primary crushing**: jaw crusher, gyratory crusher (dari ROM ke ~150 mm)\n2. **Secondary crushing**: cone crusher (ke ~25 mm)\n3. **Tertiary crushing**: HPGR, cone crusher (ke ~6 mm)',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa prinsip dasar pemisahan mineral menggunakan metode *gravity separation*?',
    options: [
      { key: 'A', text: 'Perbedaan sifat magnetik antar mineral yang dipisahkan di medan magnet' },
      { key: 'B', text: 'Perbedaan titik lebur mineral yang dipanaskan di dalam tungku' },
      { key: 'C', text: 'Perbedaan kelarutan mineral dalam asam kuat di tangki pelindian' },
      { key: 'D', text: 'Perbedaan respons mineral terhadap gelembung udara di kolom flotasi' },
      { key: 'E', text: 'Perbedaan densitas mineral sehingga bergerak berbeda dalam media fluida' },
    ],
    correct_answer: 'E',
    explanation: '***Gravity separation*** memisahkan mineral berdasarkan **perbedaan densitas** (berat jenis). Mineral berat tenggelam lebih cepat dari mineral ringan dalam media fluida (air atau udara).\n\nAlat gravity separation yang umum:\n- **Jig**: pemisahan berdasarkan *settling rate* dalam air berpulsasi\n- **Spiral concentrator**: pemisahan pada aliran heliks tipis\n- **Shaking table**: pemisahan pada permukaan miring bergetar\n- **Dense medium separator**: menggunakan suspensi ferrosilikon sebagai media berat\n\nContoh: pemisahan emas ($\\rho = 19{,}3$ g/cm³) dari kuarsa ($\\rho = 2{,}65$ g/cm³).',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah ball mill mengolah 100 ton/jam bijih dengan ukuran masuk $F_{80} = 10$ mm dan ukuran keluar $P_{80} = 0{,}1$ mm. Berapa rasio reduksi (*reduction ratio*)?',
    options: [
      { key: 'A', text: '$10 : 1$' },
      { key: 'B', text: '$50 : 1$' },
      { key: 'C', text: '$100 : 1$' },
      { key: 'D', text: '$200 : 1$' },
      { key: 'E', text: '$500 : 1$' },
    ],
    correct_answer: 'C',
    explanation: 'Perhitungan rasio reduksi:\n$$\\begin{aligned} \\text{Rasio reduksi} &= \\frac{F_{80}}{P_{80}} = \\frac{10 \\text{ mm}}{0{,}1 \\text{ mm}} = 100 : 1 \\end{aligned}$$\n$F_{80}$ adalah ukuran di mana 80% umpan lolos, dan $P_{80}$ adalah ukuran di mana 80% produk lolos.\n\nRasio reduksi $100:1$ tergolong tinggi untuk ball mill. Dalam praktik, ball mill biasanya menghasilkan rasio $20:1$ hingga $200:1$ tergantung jenis bijih dan kekerasan material.',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'easy',
    content: 'Dalam proses flotasi, *collector* (kolektor) berfungsi untuk:',
    options: [
      { key: 'A', text: 'Mengumpulkan buih di permukaan sel flotasi ke dalam launder' },
      { key: 'B', text: 'Membuat gelembung udara berukuran besar di dalam tangki flotasi' },
      { key: 'C', text: 'Mengurangi tegangan permukaan air agar buih lebih stabil bertahan' },
      { key: 'D', text: 'Membuat permukaan mineral target menjadi hidrofobik agar menempel ke gelembung' },
      { key: 'E', text: 'Menyaring partikel halus yang lolos dari tahap klasifikasi sebelumnya' },
    ],
    correct_answer: 'D',
    explanation: '***Collector*** (kolektor) adalah reagen flotasi yang **membuat permukaan mineral target menjadi hidrofobik** (menolak air). Mekanismenya:\n1. Gugus polar kolektor teradsorpsi di permukaan mineral\n2. Gugus non-polar menghadap ke air, menjadikan permukaan bersifat hidrofobik\n3. Mineral hidrofobik menempel ke gelembung udara dan terangkat ke permukaan\n\nContoh kolektor:\n- **Xanthate** (potassium amyl xanthate): untuk mineral sulfida (Cu, Pb, Zn)\n- **Fatty acid** (asam oleat): untuk mineral oksida dan non-sulfida',
  },

  // ═══════════════════════════════════════════
  // T3: Ekstraksi Metalurgi (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa perbedaan utama antara pirometalurgi dan hidrometalurgi?',
    options: [
      { key: 'A', text: 'Pirometalurgi menggunakan suhu tinggi, hidrometalurgi menggunakan larutan kimia' },
      { key: 'B', text: 'Pirometalurgi hanya mengolah bijih emas, hidrometalurgi mengolah bijih tembaga' },
      { key: 'C', text: 'Pirometalurgi lebih murah dari hidrometalurgi untuk semua jenis bijih' },
      { key: 'D', text: 'Pirometalurgi tidak menghasilkan limbah, hidrometalurgi menghasilkan limbah padat' },
      { key: 'E', text: 'Pirometalurgi hanya di laboratorium, hidrometalurgi hanya di skala industri' },
    ],
    correct_answer: 'A',
    explanation: 'Dua jalur utama ekstraksi logam:\n\n**Pirometalurgi** (piro = api):\n- Menggunakan **suhu tinggi** ($>500°C$) untuk mengekstrak logam\n- Contoh: peleburan (*smelting*) bijih nikel, *roasting* konsentrat tembaga\n- Cocok untuk bijih berkadar tinggi dengan mineral sulfida\n\n**Hidrometalurgi** (hidro = air):\n- Menggunakan **larutan kimia** (asam, basa, sianida) pada suhu rendah-sedang\n- Contoh: *heap leaching* emas dengan sianida, *acid leaching* nikel laterit\n- Cocok untuk bijih berkadar rendah atau oksida\n\nPemilihan jalur tergantung jenis bijih, kadar, skala, dan pertimbangan lingkungan.',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Dalam proses *electrowinning*, apa yang terjadi di katoda?',
    options: [
      { key: 'A', text: 'Logam terlarut teroksidasi dan larut ke dalam elektrolit' },
      { key: 'B', text: 'Gas oksigen dihasilkan dari penguraian air di permukaan' },
      { key: 'C', text: 'Ion logam dalam elektrolit tereduksi dan mengendap sebagai logam murni' },
      { key: 'D', text: 'Anoda larut secara bertahap untuk menggantikan ion logam dalam larutan' },
      { key: 'E', text: 'Elektrolit dipanaskan oleh arus listrik hingga mendidih' },
    ],
    correct_answer: 'C',
    explanation: '***Electrowinning*** menggunakan arus listrik untuk mengendapkan logam dari larutan elektrolit:\n\n**Di katoda** (kutub negatif):\n- Ion logam **tereduksi** (menerima elektron) dan mengendap sebagai logam padat\n- Contoh: $\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}_{(s)}$\n\n**Di anoda** (kutub positif):\n- Air teroksidasi menghasilkan gas oksigen\n- $\\text{H}_2\\text{O} \\rightarrow \\frac{1}{2}\\text{O}_2 + 2\\text{H}^+ + 2e^-$\n\nLogam yang diproduksi dengan *electrowinning* antara lain tembaga, seng, nikel, dan kobalt.',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Proses pelindian (*leaching*) bijih nikel laterit dengan asam sulfat menghasilkan *recovery* $90\\%$. Jika bijih mengandung $1{,}5\\%$ Ni dan diproses 1.000 ton bijih, berapa ton nikel yang terlarut?',
    options: [
      { key: 'A', text: '$10{,}5$ ton nikel terlarut' },
      { key: 'B', text: '$13{,}5$ ton nikel terlarut' },
      { key: 'C', text: '$15{,}0$ ton nikel terlarut' },
      { key: 'D', text: '$12{,}0$ ton nikel terlarut' },
      { key: 'E', text: '$11{,}0$ ton nikel terlarut' },
    ],
    correct_answer: 'B',
    explanation: 'Perhitungan nikel terlarut:\n$$\\begin{aligned} \\text{Ni dalam bijih} &= 1.000 \\times 1{,}5\\% = 15 \\text{ ton} \\\\ \\text{Ni terlarut} &= 15 \\times 90\\% = 13{,}5 \\text{ ton} \\end{aligned}$$\n*Recovery* $90\\%$ berarti $10\\%$ nikel tetap terikat dalam residu padat. Faktor yang mempengaruhi *recovery* pelindian:\n- Konsentrasi dan jenis asam\n- Suhu dan tekanan operasi\n- Waktu kontak (*residence time*)\n- Ukuran partikel bijih',
  },
  {
    order_index: 12,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa fungsi terak (*slag*) dalam proses peleburan bijih?',
    options: [
      { key: 'A', text: 'Mengikat pengotor dari logam cair sehingga terpisah sebagai lapisan terpisah' },
      { key: 'B', text: 'Sebagai bahan bakar tambahan untuk memanaskan tungku peleburan' },
      { key: 'C', text: 'Sebagai pelapis dinding tungku agar tahan terhadap suhu tinggi' },
      { key: 'D', text: 'Meningkatkan kadar logam dalam produk akhir secara langsung' },
      { key: 'E', text: 'Mempercepat pendinginan logam cair setelah proses peleburan selesai' },
    ],
    correct_answer: 'A',
    explanation: '**Terak** (*slag*) terbentuk dari reaksi antara **fluks** (batu kapur, silika) dengan pengotor dalam bijih. Fungsinya:\n- **Mengikat pengotor** (oksida besi, silika, alumina) dari logam cair\n- Membentuk lapisan terpisah di atas logam cair karena densitasnya lebih rendah\n- Melindungi logam cair dari oksidasi oleh udara\n- Menjaga panas dalam tungku sebagai lapisan isolasi\n\nTerak dikeluarkan secara terpisah dan dapat dimanfaatkan sebagai bahan konstruksi jalan atau bahan baku semen.',
  },

  // ═══════════════════════════════════════════
  // T4: Unit Operasi & Pemodelan Proses (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa fungsi *thickener* dalam pabrik pengolahan mineral?',
    options: [
      { key: 'A', text: 'Menghancurkan bijih menjadi ukuran yang lebih halus untuk proses lanjutan' },
      { key: 'B', text: 'Memanaskan pulp agar reaksi kimia berlangsung lebih cepat di reaktor' },
      { key: 'C', text: 'Menyaring gas buang sebelum dilepaskan ke atmosfer melalui cerobong' },
      { key: 'D', text: 'Mencampur reagen kimia ke dalam pulp secara merata dan kontinu' },
      { key: 'E', text: 'Memisahkan padatan dari cairan dengan cara pengendapan gravitasi' },
    ],
    correct_answer: 'E',
    explanation: '***Thickener*** adalah alat pemisahan padat-cair yang bekerja berdasarkan **pengendapan gravitasi**. Fungsinya:\n- Memekatkan (*thickening*) pulp dengan mengeluarkan air jernih (*overflow*)\n- Menghasilkan *underflow* berupa lumpur pekat (*slurry*) dengan kadar padatan tinggi\n\nKomponen utama thickener:\n1. **Feed well**: mendistribusikan umpan secara merata\n2. **Rake mechanism**: menggerakkan lumpur pekat ke pusat untuk dikeluarkan\n3. **Overflow launder**: menampung air jernih\n\n*Flocculant* (polimer) ditambahkan untuk mempercepat pengendapan.',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Dalam diagram alir proses (PFD), apa informasi utama yang ditampilkan?',
    options: [
      { key: 'A', text: 'Daftar nama karyawan yang bertanggung jawab di setiap unit operasi' },
      { key: 'B', text: 'Jadwal perawatan berkala untuk setiap peralatan di pabrik' },
      { key: 'C', text: 'Urutan unit operasi, aliran material, dan kondisi operasi utama' },
      { key: 'D', text: 'Rincian biaya investasi untuk setiap peralatan yang terpasang' },
      { key: 'E', text: 'Instruksi keselamatan kerja untuk operator di setiap area pabrik' },
    ],
    correct_answer: 'C',
    explanation: '**PFD** (*Process Flow Diagram*) menampilkan informasi utama:\n- **Urutan unit operasi** (crusher, mill, flotasi, thickener, dll.)\n- **Aliran material**: arah, laju alir, komposisi\n- **Kondisi operasi**: suhu, tekanan, konsentrasi\n- **Neraca massa** di setiap titik\n\nPerbedaan PFD vs P&ID:\n- **PFD**: gambaran umum proses, fokus pada *mass/energy balance*\n- **P&ID** (*Piping and Instrumentation Diagram*): detail perpipaan, valve, instrumen, dan sistem kontrol\n\nPFD digunakan untuk desain awal dan komunikasi konsep proses.',
  },
  {
    order_index: 15,
    category: 'T4',
    difficulty: 'medium',
    content: 'Pompa sentrifugal memindahkan pulp dengan debit $50$ m³/jam dan *head* $30$ m. Jika densitas pulp $1.400$ kg/m³ dan efisiensi pompa $70\\%$, berapa daya pompa yang dibutuhkan?',
    options: [
      { key: 'A', text: 'Sekitar $5{,}0$ kW' },
      { key: 'B', text: 'Sekitar $6{,}5$ kW' },
      { key: 'C', text: 'Sekitar $9{,}8$ kW' },
      { key: 'D', text: 'Sekitar $12{,}0$ kW' },
      { key: 'E', text: 'Sekitar $8{,}2$ kW' },
    ],
    correct_answer: 'E',
    explanation: 'Perhitungan daya pompa:\n$$\\begin{aligned} P_{\\text{hidrolik}} &= \\frac{\\rho \\times g \\times Q \\times H}{1.000} \\\\ &= \\frac{1.400 \\times 9{,}81 \\times \\frac{50}{3.600} \\times 30}{1.000} \\\\ &= \\frac{1.400 \\times 9{,}81 \\times 0{,}0139 \\times 30}{1.000} = 5{,}73 \\text{ kW} \\\\ P_{\\text{aktual}} &= \\frac{P_{\\text{hidrolik}}}{\\eta} = \\frac{5{,}73}{0{,}70} = 8{,}2 \\text{ kW} \\end{aligned}$$\nDaya aktual lebih besar dari daya hidrolik karena ada kehilangan energi akibat gesekan mekanis dan hidrolik di dalam pompa.',
  },
  {
    order_index: 16,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa kelebihan *belt filter press* dibandingkan *vacuum drum filter* untuk dewatering tailing?',
    options: [
      { key: 'A', text: 'Belt filter press tidak memerlukan energi listrik sama sekali untuk beroperasi' },
      { key: 'B', text: 'Belt filter press tidak membutuhkan penggantian media filter apapun' },
      { key: 'C', text: 'Belt filter press berukuran jauh lebih kecil dari vacuum drum filter' },
      { key: 'D', text: 'Belt filter press menghasilkan kadar padatan (*cake*) yang lebih tinggi' },
      { key: 'E', text: 'Belt filter press tidak memerlukan flokulan untuk proses pengendapan' },
    ],
    correct_answer: 'D',
    explanation: '***Belt filter press*** memiliki keunggulan dibandingkan *vacuum drum filter*:\n- **Kadar padatan *cake* lebih tinggi** (60-80% vs 40-60%), mengurangi volume tailing\n- Tekanan mekanis yang diterapkan lebih besar dari tekanan vakum\n- Konsumsi energi per ton padatan lebih rendah\n\nKeterbatasan belt filter press:\n- Kapasitas per unit lebih kecil\n- Biaya investasi awal lebih tinggi\n- Perawatan belt dan roller lebih intensif\n\nPemilihan alat dewatering tergantung pada sifat material, kapasitas yang dibutuhkan, dan target kadar padatan akhir.',
  },

  // ═══════════════════════════════════════════
  // T5: Pengendalian Mutu & Lingkungan (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T5',
    difficulty: 'easy',
    content: 'Mengapa pengelolaan tailing harus dilakukan dengan baik di tambang?',
    options: [
      { key: 'A', text: 'Karena tailing mengandung mineral bernilai tinggi yang perlu diambil kembali' },
      { key: 'B', text: 'Karena tailing dapat mencemari air dan tanah jika tidak dikelola dengan benar' },
      { key: 'C', text: 'Karena tailing dibutuhkan sebagai bahan baku utama pabrik semen' },
      { key: 'D', text: 'Karena tailing harus diekspor ke negara lain sesuai regulasi internasional' },
      { key: 'E', text: 'Karena tailing digunakan sebagai pupuk untuk area pertanian sekitar' },
    ],
    correct_answer: 'B',
    explanation: '**Tailing** (ampas pengolahan) harus dikelola dengan baik karena:\n- Dapat mengandung **logam berat** (As, Hg, Pb) yang berbahaya bagi lingkungan\n- Berpotensi menghasilkan **Air Asam Tambang** (AMD) jika mengandung sulfida\n- Volume sangat besar (bisa ratusan ribu ton per tahun)\n- Risiko **kegagalan bendungan tailing** yang dapat menyebabkan bencana\n\nMetode pengelolaan tailing:\n- **Conventional**: penampungan di dam tailing basah\n- **Dry stacking**: tailing yang sudah dikeringkan (filter press)\n- **Paste disposal**: tailing dalam bentuk pasta kental',
  },
  {
    order_index: 18,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa tujuan pemasangan *scrubber* pada cerobong gas pabrik peleburan?',
    options: [
      { key: 'A', text: 'Menambah tinggi cerobong agar gas buang tersebar ke area yang lebih luas' },
      { key: 'B', text: 'Meningkatkan suhu gas buang agar naik lebih tinggi ke atmosfer' },
      { key: 'C', text: 'Mempercepat aliran gas agar tidak terjadi penumpukan di dalam tungku' },
      { key: 'D', text: 'Mengukur komposisi gas buang secara otomatis dan kontinu' },
      { key: 'E', text: 'Menghilangkan partikel dan gas berbahaya dari emisi sebelum dibuang' },
    ],
    correct_answer: 'E',
    explanation: '***Scrubber*** (pencuci gas) berfungsi untuk **menghilangkan partikel dan gas berbahaya** dari emisi pabrik sebelum dibuang ke atmosfer:\n- **Wet scrubber**: menyemprotkan air/larutan kimia untuk menangkap partikel dan gas ($\\text{SO}_2$, $\\text{HCl}$)\n- **Dry scrubber**: menggunakan adsorben kering (kapur) untuk menyerap gas asam\n- **Electrostatic precipitator** (ESP): menggunakan muatan listrik untuk menangkap partikel halus\n\nScrubber wajib dipasang untuk memenuhi baku mutu emisi yang ditetapkan pemerintah dan mencegah polusi udara.',
  },
  {
    order_index: 19,
    category: 'T5',
    difficulty: 'easy',
    content: 'Dalam pengendalian mutu produk akhir, apa yang dimaksud dengan *assay*?',
    options: [
      { key: 'A', text: 'Pengujian kekuatan mekanis logam dengan uji tarik di laboratorium' },
      { key: 'B', text: 'Analisis kuantitatif untuk menentukan kadar unsur dalam sampel' },
      { key: 'C', text: 'Pemeriksaan visual terhadap warna dan kilap permukaan logam' },
      { key: 'D', text: 'Pengukuran berat jenis logam dengan metode penimbangan sederhana' },
      { key: 'E', text: 'Pengujian ketahanan logam terhadap korosi di lingkungan asam' },
    ],
    correct_answer: 'B',
    explanation: '***Assay*** adalah **analisis kuantitatif** untuk menentukan kadar (konsentrasi) unsur tertentu dalam sampel. Metode assay yang umum:\n- **Fire assay**: peleburan sampel dengan fluks, standar emas untuk logam mulia (Au, Ag, PGM)\n- **AAS** (*Atomic Absorption Spectroscopy*): mengukur absorpsi cahaya oleh atom\n- **ICP-OES/MS**: analisis multi-unsur dengan plasma\n- **XRF** (*X-Ray Fluorescence*): analisis cepat non-destruktif\n\nHasil assay dinyatakan dalam ppm (mg/kg), persen (%), atau g/ton (untuk logam mulia).',
  },
  {
    order_index: 20,
    category: 'T5',
    difficulty: 'medium',
    content: 'Pabrik peleburan menghasilkan 500 Nm³/jam gas buang mengandung $\\text{SO}_2$ dengan konsentrasi 2.000 mg/Nm³. Baku mutu emisi $\\text{SO}_2$ adalah 400 mg/Nm³. Berapa persen $\\text{SO}_2$ yang harus dihilangkan?',
    options: [
      { key: 'A', text: '$60\\%$ dari $\\text{SO}_2$ harus dihilangkan' },
      { key: 'B', text: '$70\\%$ dari $\\text{SO}_2$ harus dihilangkan' },
      { key: 'C', text: '$75\\%$ dari $\\text{SO}_2$ harus dihilangkan' },
      { key: 'D', text: '$80\\%$ dari $\\text{SO}_2$ harus dihilangkan' },
      { key: 'E', text: '$85\\%$ dari $\\text{SO}_2$ harus dihilangkan' },
    ],
    correct_answer: 'D',
    explanation: 'Perhitungan persen penghilangan $\\text{SO}_2$:\n$$\\begin{aligned} \\text{Persen removal} &= \\frac{C_{\\text{inlet}} - C_{\\text{outlet}}}{C_{\\text{inlet}}} \\times 100\\% \\\\ &= \\frac{2.000 - 400}{2.000} \\times 100\\% = 80\\% \\end{aligned}$$\nScrubber harus mampu menghilangkan minimal $80\\%$ $\\text{SO}_2$ agar emisi memenuhi baku mutu. Wet scrubber dengan larutan kapur ($\\text{Ca(OH)}_2$) dapat mencapai efisiensi removal hingga $90$-$99\\%$.',
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
  console.log(`Jumlah soal batch 1: ${questions.length}\n`)

  // Hapus semua soal lama
  console.log('Menghapus soal lama...')
  await supabase.from('questions').delete().eq('package_id', pkg.id)
  console.log('Soal lama berhasil dihapus.\n')

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

  console.log(`✅ Berhasil insert ${data.length} soal:\n`)

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
