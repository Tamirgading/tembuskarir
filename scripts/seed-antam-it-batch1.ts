/**
 * ANTAM IMPACT 2026 — Information Technology (IT) Batch 1: Soal 1–20
 *
 * Distribusi batch 1:
 *   T1 (Rekayasa Perangkat Lunak): 4 soal
 *   T2 (Manajemen Basis Data & Arsitektur Data): 4 soal
 *   T3 (Infrastruktur IT & Jaringan Komputer): 4 soal
 *   T4 (Keamanan Siber): 4 soal
 *   T5 (Manajemen Layanan IT): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-it-batch1.ts
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
// A: 3,8,14,19 | B: 1,9,13,17 | C: 5,10,16,20 | D: 2,7,11,18 | E: 4,6,12,15

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Rekayasa Perangkat Lunak (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 1,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan SDLC (*Software Development Life Cycle*)?',
    options: [
      { key: 'A', text: 'Sertifikasi internasional untuk programmer profesional' },
      { key: 'B', text: 'Kerangka kerja yang mengatur tahapan pengembangan perangkat lunak secara sistematis' },
      { key: 'C', text: 'Bahasa pemrograman khusus untuk mengembangkan aplikasi enterprise' },
      { key: 'D', text: 'Perangkat keras yang digunakan untuk menjalankan server produksi' },
      { key: 'E', text: 'Antivirus yang melindungi perangkat lunak dari serangan malware' },
    ],
    correct_answer: 'B',
    explanation: '**SDLC** (*Software Development Life Cycle*) = kerangka kerja sistematis untuk **pengembangan perangkat lunak**.\n\nTahapan SDLC:\n\n| Tahap | Kegiatan |\n|---|---|\n| **1. Planning** | Analisis kebutuhan bisnis, studi kelayakan, estimasi biaya |\n| **2. Analysis** | Pengumpulan dan dokumentasi requirements |\n| **3. Design** | Arsitektur sistem, desain database, UI/UX |\n| **4. Implementation** | Coding/pemrograman |\n| **5. Testing** | Pengujian fungsional, integrasi, UAT |\n| **6. Deployment** | Rilis ke production |\n| **7. Maintenance** | Perbaikan bug, peningkatan fitur |\n\nModel SDLC populer:\n\n| Model | Karakteristik |\n|---|---|\n| **Waterfall** | Sekuensial, cocok untuk requirement stabil |\n| **Agile** | Iteratif, adaptif terhadap perubahan |\n| **Spiral** | Kombinasi iteratif + analisis risiko |\n| **V-Model** | Tiap tahap development punya tahap testing |\n| **Prototyping** | Membuat prototipe untuk validasi requirement |\n\nSDLC memastikan perangkat lunak dikembangkan secara **terstruktur, terdokumentasi, dan berkualitas**.',
  },
  {
    order_index: 2,
    category: 'T1',
    difficulty: 'medium',
    content: 'Dalam metodologi Agile Scrum, apa peran seorang *Product Owner*?',
    options: [
      { key: 'A', text: 'Menulis seluruh kode program dan melakukan deployment ke server' },
      { key: 'B', text: 'Mengelola infrastruktur server dan jaringan tim development' },
      { key: 'C', text: 'Melakukan pengujian keamanan (penetration testing) pada aplikasi' },
      { key: 'D', text: 'Mengelola product backlog dan memprioritaskan fitur berdasarkan nilai bisnis' },
      { key: 'E', text: 'Memimpin daily standup dan memastikan tim mengikuti proses Scrum' },
    ],
    correct_answer: 'D',
    explanation: '**Product Owner** (PO) dalam Scrum bertanggung jawab **memaksimalkan nilai produk**.\n\nTanggung jawab PO:\n\n| Tanggung Jawab | Detail |\n|---|---|\n| **Product Backlog** | Membuat, mengelola, dan memprioritaskan backlog |\n| **Prioritisasi** | Menentukan fitur mana yang paling bernilai |\n| **Stakeholder** | Menjembatani kebutuhan bisnis ke tim teknis |\n| **Acceptance** | Menerima atau menolak hasil sprint |\n| **Vision** | Menjaga visi produk tetap jelas |\n\nPeran lain dalam Scrum:\n\n| Peran | Tanggung Jawab |\n|---|---|\n| **Scrum Master** | Fasilitator proses, menghilangkan hambatan |\n| **Development Team** | Membangun produk, self-organizing |\n| **Product Owner** | Mengelola backlog, prioritas bisnis |\n\nScrum Events:\n- **Sprint Planning**: tim memilih backlog items untuk sprint\n- **Daily Standup**: 15 menit, 3 pertanyaan (kemarin, hari ini, hambatan)\n- **Sprint Review**: demo hasil sprint ke stakeholder\n- **Sprint Retrospective**: evaluasi proses tim\n\nCatatan: **Scrum Master** (opsi E) yang memfasilitasi daily standup, bukan PO.',
  },
  {
    order_index: 3,
    category: 'T1',
    difficulty: 'medium',
    content: 'Sebuah tim pengembang menemukan 15 bug pada saat *unit testing*, 8 bug pada *integration testing*, dan 2 bug pada *UAT* (*User Acceptance Testing*). Berapa persen total bug yang ditemukan pada tahap *integration testing*?',
    options: [
      { key: 'A', text: '32%' },
      { key: 'B', text: '60%' },
      { key: 'C', text: '8%' },
      { key: 'D', text: '52%' },
      { key: 'E', text: '40%' },
    ],
    correct_answer: 'A',
    explanation: 'Perhitungan persentase bug pada integration testing:\n\n$$\\text{Total bug} = 15 + 8 + 2 = 25$$\n\n$$\\text{Persentase integration testing} = \\frac{8}{25} \\times 100\\% = 32\\%$$\n\nDistribusi bug per tahap:\n\n| Tahap | Jumlah Bug | Persentase |\n|---|---|---|\n| Unit Testing | 15 | 60% |\n| Integration Testing | 8 | **32%** |\n| UAT | 2 | 8% |\n| **Total** | **25** | **100%** |\n\nPrinsip **Shift Left Testing**: semakin awal bug ditemukan, semakin murah biaya perbaikannya.\n\nRasio biaya perbaikan bug:\n\n| Tahap Ditemukan | Rasio Biaya |\n|---|---|\n| Requirements | 1x |\n| Design | 5x |\n| Coding | 10x |\n| Testing | 20x |\n| Production | 100x |\n\nDalam kasus ini, mayoritas bug (60%) ditemukan di unit testing, yang menunjukkan **praktik testing yang baik**.',
  },
  {
    order_index: 4,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa perbedaan utama antara *black-box testing* dan *white-box testing*?',
    options: [
      { key: 'A', text: 'Black-box untuk aplikasi web, white-box untuk aplikasi mobile' },
      { key: 'B', text: 'Black-box dilakukan manual, white-box selalu otomatis' },
      { key: 'C', text: 'Black-box untuk bug kritis, white-box untuk bug minor' },
      { key: 'D', text: 'Black-box hanya untuk database, white-box hanya untuk frontend' },
      { key: 'E', text: 'Black-box menguji fungsi tanpa melihat kode internal, white-box memeriksa struktur kode' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan **black-box** vs **white-box testing**:\n\n| Aspek | Black-Box | White-Box |\n|---|---|---|\n| **Pengetahuan kode** | Tidak perlu | Harus tahu |\n| **Fokus** | Input → Output | Logika internal |\n| **Siapa** | Tester/QA | Developer |\n| **Basis** | Requirements/spesifikasi | Source code |\n| **Teknik** | Equivalence partitioning, boundary value | Statement/branch/path coverage |\n\nJenis-jenis testing:\n\n| Jenis | Deskripsi |\n|---|---|\n| **Unit Testing** | Menguji fungsi/metode individual (white-box) |\n| **Integration Testing** | Menguji interaksi antar modul |\n| **System Testing** | Menguji keseluruhan sistem (black-box) |\n| **UAT** | Pengguna akhir menguji kesesuaian bisnis |\n| **Regression Testing** | Memastikan perubahan tidak merusak fitur lama |\n| **Performance Testing** | Mengukur kecepatan dan skalabilitas |\n| **Security Testing** | Mencari kerentanan keamanan |\n\nTeknik black-box:\n- **Equivalence Partitioning**: membagi input ke kelompok setara\n- **Boundary Value Analysis**: menguji nilai batas\n- **Decision Table**: menguji kombinasi kondisi',
  },

  // ═══════════════════════════════════════════
  // T2: Manajemen Basis Data & Arsitektur Data (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 5,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa fungsi perintah SQL `SELECT * FROM employees WHERE department = \'IT\' ORDER BY salary DESC`?',
    options: [
      { key: 'A', text: 'Menghapus seluruh data karyawan departemen IT' },
      { key: 'B', text: 'Menambahkan kolom salary ke tabel employees' },
      { key: 'C', text: 'Menampilkan data karyawan departemen IT dari gaji tertinggi ke terendah' },
      { key: 'D', text: 'Mengubah nama departemen menjadi IT untuk semua karyawan' },
      { key: 'E', text: 'Membuat tabel baru bernama employees_IT' },
    ],
    correct_answer: 'C',
    explanation: 'Analisis perintah SQL:\n\n| Komponen | Fungsi |\n|---|---|\n| `SELECT *` | Menampilkan **seluruh kolom** |\n| `FROM employees` | Dari **tabel employees** |\n| `WHERE department = \'IT\'` | **Filter**: hanya departemen IT |\n| `ORDER BY salary DESC` | **Urutkan** berdasarkan salary, **descending** (tinggi ke rendah) |\n\nKlausa SQL dasar:\n\n| Klausa | Fungsi | Contoh |\n|---|---|---|\n| `SELECT` | Memilih kolom | `SELECT name, salary` |\n| `FROM` | Menentukan tabel | `FROM employees` |\n| `WHERE` | Filter baris | `WHERE age > 25` |\n| `ORDER BY` | Mengurutkan | `ORDER BY name ASC` |\n| `GROUP BY` | Mengelompokkan | `GROUP BY department` |\n| `HAVING` | Filter setelah GROUP BY | `HAVING COUNT(*) > 5` |\n| `JOIN` | Menggabungkan tabel | `INNER JOIN departments` |\n| `LIMIT` | Membatasi hasil | `LIMIT 10` |\n\nUrutan eksekusi SQL:\n1. `FROM` → 2. `WHERE` → 3. `GROUP BY` → 4. `HAVING` → 5. `SELECT` → 6. `ORDER BY` → 7. `LIMIT`',
  },
  {
    order_index: 6,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *data warehouse* dan *data lake*?',
    options: [
      { key: 'A', text: 'Data warehouse untuk data kecil, data lake untuk data besar' },
      { key: 'B', text: 'Data warehouse gratis, data lake berbayar' },
      { key: 'C', text: 'Data warehouse hanya untuk gambar, data lake hanya untuk teks' },
      { key: 'D', text: 'Data warehouse menyimpan data yang sudah bersih dan terstruktur, data lake untuk semua' },
      { key: 'E', text: 'Data warehouse menyimpan data yang telah ditransformasi, data lake menyimpan data mentah dalam berbagai format' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan **data warehouse** dan **data lake**:\n\n| Aspek | Data Warehouse | Data Lake |\n|---|---|---|\n| **Data** | Terstruktur, bersih | Mentah, semua format |\n| **Schema** | Schema-on-write | Schema-on-read |\n| **Format** | Tabel relasional | File (CSV, JSON, Parquet, gambar, video) |\n| **Pengguna** | Business analyst | Data scientist, data engineer |\n| **Query** | SQL standar | SQL, Spark, Python |\n| **Biaya** | Lebih mahal per GB | Lebih murah per GB |\n| **Kecepatan** | Query cepat (sudah dioptimasi) | Lebih lambat (perlu proses) |\n\nProses ETL vs ELT:\n\n| Proses | Data Warehouse | Data Lake |\n|---|---|---|\n| **ETL** | Extract → Transform → Load | - |\n| **ELT** | - | Extract → Load → Transform |\n\nContoh teknologi:\n\n| Kategori | Contoh |\n|---|---|\n| **Data Warehouse** | Google BigQuery, Amazon Redshift, Snowflake |\n| **Data Lake** | Amazon S3, Azure Data Lake, Google Cloud Storage |\n| **Data Lakehouse** | Databricks (gabungan warehouse + lake) |\n\nDi perusahaan tambang:\n- **Warehouse**: laporan keuangan, produksi, penjualan\n- **Data Lake**: data sensor IoT, citra satelit, log mesin',
  },
  {
    order_index: 7,
    category: 'T2',
    difficulty: 'medium',
    content: 'Sebuah tabel *inventory* memiliki 10.000 baris data. Query tanpa index membutuhkan waktu 500 ms. Setelah menambahkan B-tree index pada kolom pencarian, waktu query menjadi $\\log_2(10.000) \\approx 13$ langkah. Jika setiap langkah membutuhkan 0,5 ms, berapa estimasi waktu query setelah indexing?',
    options: [
      { key: 'A', text: '13 ms' },
      { key: 'B', text: '500 ms' },
      { key: 'C', text: '50 ms' },
      { key: 'D', text: '6,5 ms' },
      { key: 'E', text: '130 ms' },
    ],
    correct_answer: 'D',
    explanation: 'Perhitungan waktu query dengan B-tree index:\n\n$$\\text{Langkah} = \\log_2(10.000) \\approx 13$$\n\n$$\\text{Waktu} = 13 \\times 0,5 \\text{ ms} = 6,5 \\text{ ms}$$\n\nPerbandingan:\n\n| Metode | Waktu | Speedup |\n|---|---|---|\n| **Tanpa index** (full scan) | 500 ms | 1x |\n| **Dengan B-tree index** | 6,5 ms | **~77x lebih cepat** |\n\nJenis-jenis index:\n\n| Jenis | Penggunaan |\n|---|---|\n| **B-tree** | Default, cocok untuk range query dan exact match |\n| **Hash** | Exact match saja, sangat cepat |\n| **GIN** | Full-text search, array, JSONB |\n| **GiST** | Data geometri, geospasial |\n| **BRIN** | Data yang secara fisik terurut (timestamp) |\n\nKapan menggunakan index:\n- Kolom sering digunakan di `WHERE`, `JOIN`, `ORDER BY`\n- Tabel berukuran besar (ribuan baris ke atas)\n- Selektivitas tinggi (nilai unik banyak)\n\nKapan **tidak** menggunakan index:\n- Tabel kecil (overhead index > manfaat)\n- Kolom yang jarang di-query\n- Tabel dengan operasi INSERT/UPDATE sangat sering (index memperlambat write)',
  },
  {
    order_index: 8,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *normalisasi database* dan apa tujuannya?',
    options: [
      { key: 'A', text: 'Proses mengorganisasi data dalam database untuk mengurangi redundansi dan ketergantungan' },
      { key: 'B', text: 'Proses mengenkripsi seluruh data dalam database agar tidak bisa dibaca pihak luar' },
      { key: 'C', text: 'Proses menghapus data duplikat secara otomatis oleh sistem database' },
      { key: 'D', text: 'Proses mengubah semua tipe data menjadi string untuk konsistensi penyimpanan' },
      { key: 'E', text: 'Proses menggabungkan semua tabel menjadi satu tabel besar untuk mempercepat query' },
    ],
    correct_answer: 'A',
    explanation: '**Normalisasi** = proses mengorganisasi data untuk **mengurangi redundansi** dan **anomali**.\n\nBentuk normal (Normal Forms):\n\n| NF | Aturan |\n|---|---|\n| **1NF** | Setiap sel bernilai atomik (tidak ada array/list) |\n| **2NF** | 1NF + tidak ada partial dependency (semua non-key bergantung pada seluruh PK) |\n| **3NF** | 2NF + tidak ada transitive dependency (non-key tidak bergantung pada non-key lain) |\n| **BCNF** | Setiap determinan adalah candidate key |\n\nContoh masalah tanpa normalisasi:\n\n| Anomali | Contoh |\n|---|---|\n| **Insert** | Tidak bisa menambah departemen tanpa karyawan |\n| **Update** | Ubah nama departemen harus update banyak baris |\n| **Delete** | Hapus karyawan terakhir = kehilangan data departemen |\n\nPraktik umum:\n- **OLTP** (transaksional): normalisasi sampai **3NF** untuk integritas\n- **OLAP** (analitik/warehouse): **denormalisasi** untuk kecepatan query\n\nDi perusahaan tambang:\n- Tabel `employees`, `departments`, `locations` → dinormalisasi (3NF)\n- Tabel fact/dimension di data warehouse → denormalisasi (star schema)',
  },

  // ═══════════════════════════════════════════
  // T3: Infrastruktur IT & Jaringan Komputer (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 9,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *cloud computing* model *IaaS* (*Infrastructure as a Service*)?',
    options: [
      { key: 'A', text: 'Layanan cloud yang menyediakan aplikasi siap pakai melalui browser' },
      { key: 'B', text: 'Layanan cloud yang menyediakan infrastruktur komputasi virtual yang disewa dan dikelola sendiri oleh pengguna' },
      { key: 'C', text: 'Layanan instalasi kabel jaringan fisik di kantor pelanggan' },
      { key: 'D', text: 'Jasa konsultasi IT untuk merancang arsitektur jaringan' },
      { key: 'E', text: 'Platform pengembangan aplikasi dengan runtime dan database yang dikelola provider' },
    ],
    correct_answer: 'B',
    explanation: '**IaaS** = layanan cloud yang menyediakan **infrastruktur komputasi virtual**.\n\nPerbandingan model cloud:\n\n| Aspek | IaaS | PaaS | SaaS |\n|---|---|---|---|\n| **Apa yang disediakan** | Server, storage, network | Runtime, database, OS | Aplikasi siap pakai |\n| **Yang dikelola user** | OS, middleware, apps | Apps, data | Data saja |\n| **Contoh** | AWS EC2, Azure VM | Heroku, Google App Engine | Gmail, Office 365 |\n| **Fleksibilitas** | Tinggi | Sedang | Rendah |\n| **Kompleksitas** | Tinggi | Sedang | Rendah |\n\nKeunggulan IaaS:\n\n| Keunggulan | Detail |\n|---|---|\n| **Skalabilitas** | Scale up/down sesuai kebutuhan |\n| **Biaya** | Pay-as-you-go, tanpa investasi hardware |\n| **Kecepatan** | Provisioning dalam menit, bukan minggu |\n| **Redundansi** | Built-in high availability |\n| **Global** | Deploy di berbagai region |\n\nDi perusahaan tambang:\n- **IaaS**: hosting ERP, database operasional di cloud\n- **PaaS**: development platform untuk aplikasi internal\n- **SaaS**: email (Office 365), kolaborasi (Teams), HR system',
  },
  {
    order_index: 10,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa fungsi protokol *DNS* (*Domain Name System*) dalam jaringan komputer?',
    options: [
      { key: 'A', text: 'Mengenkripsi seluruh lalu lintas data dalam jaringan' },
      { key: 'B', text: 'Mengalokasikan alamat IP secara otomatis ke perangkat yang terhubung ke jaringan' },
      { key: 'C', text: 'Menerjemahkan nama domain (mis. www.antam.com) menjadi alamat IP' },
      { key: 'D', text: 'Mengelola bandwidth jaringan dan membatasi kecepatan akses internet' },
      { key: 'E', text: 'Menyaring email spam sebelum masuk ke server email perusahaan' },
    ],
    correct_answer: 'C',
    explanation: '**DNS** = sistem yang menerjemahkan **nama domain** menjadi **alamat IP**.\n\nProses resolusi DNS:\n\n| Langkah | Proses |\n|---|---|\n| 1 | User ketik www.antam.com di browser |\n| 2 | Browser cek **cache lokal** |\n| 3 | Jika tidak ada, tanya **recursive resolver** (ISP) |\n| 4 | Resolver tanya **root server** (.com, .id, dll.) |\n| 5 | Root server arahkan ke **TLD server** (.com) |\n| 6 | TLD server arahkan ke **authoritative server** (antam.com) |\n| 7 | Authoritative server berikan **IP address** |\n| 8 | Browser koneksi ke IP tersebut |\n\nRecord types:\n\n| Record | Fungsi |\n|---|---|\n| **A** | Memetakan domain ke IPv4 |\n| **AAAA** | Memetakan domain ke IPv6 |\n| **CNAME** | Alias (nama lain untuk domain) |\n| **MX** | Mail server untuk domain |\n| **NS** | Name server yang mengelola domain |\n| **TXT** | Teks (SPF, DKIM untuk email) |\n\nCatatan:\n- **DHCP** (opsi B) yang mengalokasikan IP otomatis\n- **VPN/TLS** yang mengenkripsi lalu lintas (opsi A)',
  },
  {
    order_index: 11,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *virtualisasi* dalam konteks infrastruktur IT?',
    options: [
      { key: 'A', text: 'Mengganti seluruh perangkat keras dengan perangkat lunak open source' },
      { key: 'B', text: 'Membuat website dengan teknologi virtual reality (VR)' },
      { key: 'C', text: 'Menyimpan data di flash drive sebagai backup' },
      { key: 'D', text: 'Teknologi yang membuat versi virtual perangkat fisik agar satu mesin menjalankan banyak sistem' },
      { key: 'E', text: 'Menghubungkan dua kantor melalui kabel fiber optik' },
    ],
    correct_answer: 'D',
    explanation: '**Virtualisasi** = teknologi untuk membuat **representasi virtual** dari sumber daya fisik.\n\nJenis virtualisasi:\n\n| Jenis | Apa yang divirtualkan | Contoh |\n|---|---|---|\n| **Server** | Satu server fisik → banyak VM | VMware, Hyper-V |\n| **Desktop** | Desktop virtual diakses remote | VDI, Citrix |\n| **Storage** | Gabungan storage fisik → pool virtual | SAN, NAS |\n| **Network** | Jaringan fisik → virtual network | VLAN, SDN |\n| **Container** | Isolasi aplikasi tanpa OS terpisah | Docker, Kubernetes |\n\nKomponen:\n\n| Komponen | Fungsi |\n|---|---|\n| **Hypervisor** | Software yang mengelola VM |\n| **Host** | Mesin fisik yang menjalankan hypervisor |\n| **Guest** | VM (virtual machine) yang berjalan di atas host |\n\nTipe hypervisor:\n- **Type 1 (Bare-metal)**: langsung di hardware (VMware ESXi, Hyper-V)\n- **Type 2 (Hosted)**: di atas OS host (VirtualBox, VMware Workstation)\n\nManfaat di tambang:\n- **Konsolidasi server**: mengurangi jumlah server fisik di site\n- **Disaster recovery**: VM bisa dipindahkan/dipulihkan dengan cepat\n- **Efisiensi**: utilisasi hardware meningkat dari ~15% → 70%+',
  },
  {
    order_index: 12,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *topologi jaringan star*?',
    options: [
      { key: 'A', text: 'Jaringan di mana setiap komputer terhubung langsung ke semua komputer lainnya' },
      { key: 'B', text: 'Jaringan berbentuk lingkaran di mana data mengalir satu arah' },
      { key: 'C', text: 'Jaringan menggunakan koneksi satelit untuk komunikasi antar kantor' },
      { key: 'D', text: 'Jaringan linier di mana semua perangkat terhubung ke satu kabel utama' },
      { key: 'E', text: 'Semua perangkat terhubung ke satu perangkat pusat (switch/hub) sebagai pusat lalu lintas' },
    ],
    correct_answer: 'E',
    explanation: '**Topologi star** = semua perangkat terhubung ke **satu perangkat pusat** (switch/hub).\n\nPerbandingan topologi jaringan:\n\n| Topologi | Bentuk | Kelebihan | Kekurangan |\n|---|---|---|---|\n| **Star** | Bintang (semua ke pusat) | Mudah troubleshoot, fault tolerant | Pusat gagal = semua down |\n| **Bus** | Garis lurus (satu kabel) | Murah, sederhana | Kabel putus = semua down |\n| **Ring** | Lingkaran | Performa konsisten | Satu node gagal = gangguan |\n| **Mesh** | Semua ke semua | Sangat redundan | Mahal, kompleks |\n| **Tree** | Hierarki (star + bus) | Skalabel | Backbone gagal = fatal |\n\nTopologi star paling populer karena:\n\n| Alasan | Detail |\n|---|---|\n| **Isolasi** | Kegagalan satu node tidak mempengaruhi lainnya |\n| **Manajemen** | Mudah menambah/menghapus perangkat |\n| **Troubleshooting** | Mudah menemukan masalah |\n| **Performa** | Tidak ada collision (jika pakai switch) |\n\nDi perusahaan tambang:\n- **Kantor pusat**: topologi star dengan switch layer 3\n- **Antar site**: topologi mesh/partial mesh (redundansi)\n- **Site remote**: topologi star sederhana + WAN link',
  },

  // ═══════════════════════════════════════════
  // T4: Keamanan Siber (Cybersecurity) (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 13,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *CIA Triad* dalam keamanan informasi?',
    options: [
      { key: 'A', text: 'Nama badan intelijen Amerika Serikat yang menangani keamanan siber' },
      { key: 'B', text: 'Tiga prinsip fundamental keamanan informasi: Confidentiality, Integrity, dan Availability' },
      { key: 'C', text: 'Tiga jenis virus komputer paling berbahaya di dunia' },
      { key: 'D', text: 'Tiga layer firewall yang harus dipasang di setiap jaringan' },
      { key: 'E', text: 'Tiga vendor antivirus terbesar di pasar global' },
    ],
    correct_answer: 'B',
    explanation: '**CIA Triad** = tiga prinsip fundamental **keamanan informasi**.\n\n| Prinsip | Arti | Ancaman | Kontrol |\n|---|---|---|---|\n| **Confidentiality** | Data hanya diakses pihak berwenang | Unauthorized access, data breach | Enkripsi, access control, MFA |\n| **Integrity** | Data tidak diubah tanpa izin | Data tampering, man-in-the-middle | Hashing, digital signature, checksums |\n| **Availability** | Sistem tersedia saat dibutuhkan | DoS/DDoS, ransomware, bencana | Redundansi, backup, DRP |\n\nContoh penerapan di perusahaan:\n\n| Prinsip | Contoh |\n|---|---|\n| **Confidentiality** | Data keuangan hanya bisa diakses Finance |\n| **Integrity** | Log produksi tidak bisa dimodifikasi |\n| **Availability** | Sistem ERP tersedia 99,9% uptime |\n\nModel keamanan tambahan:\n- **AAA**: Authentication, Authorization, Accounting\n- **Non-repudiation**: tidak bisa menyangkal telah melakukan aksi\n- **Parkerian Hexad**: CIA + Possession, Authenticity, Utility\n\nStandar keamanan:\n- **ISO 27001**: Sistem Manajemen Keamanan Informasi (ISMS)\n- **NIST CSF**: Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover)',
  },
  {
    order_index: 14,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *symmetric encryption* dan *asymmetric encryption*?',
    options: [
      { key: 'A', text: 'Symmetric memakai satu kunci, asymmetric memakai kunci publik dan privat' },
      { key: 'B', text: 'Symmetric untuk data kecil, asymmetric untuk data besar' },
      { key: 'C', text: 'Symmetric tidak aman, asymmetric selalu aman' },
      { key: 'D', text: 'Symmetric hanya untuk email, asymmetric hanya untuk file' },
      { key: 'E', text: 'Symmetric untuk jaringan lokal, asymmetric untuk internet' },
    ],
    correct_answer: 'A',
    explanation: 'Perbedaan **symmetric** vs **asymmetric encryption**:\n\n| Aspek | Symmetric | Asymmetric |\n|---|---|---|\n| **Kunci** | Satu kunci (sama) | Dua kunci (public + private) |\n| **Kecepatan** | **Cepat** | Lebih lambat |\n| **Ukuran kunci** | 128-256 bit | 2048-4096 bit |\n| **Masalah** | Distribusi kunci | Komputasi intensif |\n| **Contoh** | AES, DES, 3DES | RSA, ECC, Diffie-Hellman |\n| **Use case** | Enkripsi data bulk | Key exchange, digital signature |\n\nCara kerja:\n\n**Symmetric**:\n- Alice dan Bob berbagi kunci yang **sama**\n- Alice enkripsi dengan kunci → kirim ciphertext → Bob dekripsi dengan kunci yang sama\n- Masalah: bagaimana mengirim kunci secara aman?\n\n**Asymmetric**:\n- Alice punya **public key** (dibagikan) dan **private key** (rahasia)\n- Bob enkripsi dengan public key Alice → kirim → Alice dekripsi dengan private key-nya\n- Tidak ada masalah distribusi kunci\n\nPraktik modern (**hybrid**):\n1. Asymmetric digunakan untuk bertukar kunci simetris (key exchange)\n2. Symmetric digunakan untuk enkripsi data sesungguhnya\n3. Contoh: **TLS/HTTPS** menggunakan RSA untuk handshake, lalu AES untuk data',
  },
  {
    order_index: 15,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan serangan *phishing* dan bagaimana cara menghindarinya?',
    options: [
      { key: 'A', text: 'Serangan DDoS yang membanjiri server dengan trafik berlebihan' },
      { key: 'B', text: 'Virus yang menyebar melalui USB flash drive yang terinfeksi' },
      { key: 'C', text: 'Malware yang mengenkripsi file korban dan meminta tebusan' },
      { key: 'D', text: 'Eksploitasi kerentanan pada sistem operasi yang belum diupdate' },
      { key: 'E', text: 'Penipuan yang menyamar sebagai entitas terpercaya untuk mencuri kredensial atau uang' },
    ],
    correct_answer: 'E',
    explanation: '**Phishing** = penipuan yang **menyamar** sebagai entitas terpercaya untuk **mencuri data**.\n\nJenis phishing:\n\n| Jenis | Target | Metode |\n|---|---|---|\n| **Email phishing** | Massal | Email palsu (bank, vendor) |\n| **Spear phishing** | Individu tertentu | Email personalized |\n| **Whaling** | Eksekutif (C-level) | Email yang tampak dari board/regulator |\n| **Smishing** | Pengguna HP | SMS palsu |\n| **Vishing** | Pengguna telepon | Panggilan telepon palsu |\n| **Clone phishing** | Penerima email asli | Duplikat email sah dengan link diubah |\n\nTanda-tanda phishing:\n\n| Tanda | Contoh |\n|---|---|\n| **Urgency** | "Akun Anda akan ditutup dalam 24 jam!" |\n| **Typo/grammar** | Kesalahan ejaan di email "resmi" |\n| **URL mencurigakan** | antam-login.xyz alih-alih antam.com |\n| **Attachment** | File .exe atau .zip tidak diminta |\n| **Sender palsu** | ceo@antam-corp.com (bukan domain resmi) |\n\nCara menghindari:\n- **Verifikasi** pengirim dan URL sebelum klik\n- **Jangan** masukkan kredensial di link dari email\n- **Aktifkan** MFA (Multi-Factor Authentication)\n- **Laporkan** email mencurigakan ke tim IT\n- **Training** security awareness secara berkala',
  },
  {
    order_index: 16,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa fungsi *firewall* dalam keamanan jaringan?',
    options: [
      { key: 'A', text: 'Mempercepat koneksi internet dengan melakukan kompresi data' },
      { key: 'B', text: 'Membuat cadangan (backup) data secara otomatis setiap hari' },
      { key: 'C', text: 'Sistem keamanan jaringan yang mengontrol lalu lintas data masuk dan keluar' },
      { key: 'D', text: 'Mendeteksi virus di dalam file yang tersimpan di hard disk' },
      { key: 'E', text: 'Mengenkripsi seluruh komunikasi email antar karyawan' },
    ],
    correct_answer: 'C',
    explanation: '**Firewall** = sistem yang **memantau dan mengontrol** lalu lintas jaringan berdasarkan **aturan keamanan**.\n\nJenis firewall:\n\n| Jenis | Cara Kerja | Level |\n|---|---|---|\n| **Packet Filtering** | Filter berdasarkan IP, port, protokol | Network (Layer 3-4) |\n| **Stateful Inspection** | Melacak state koneksi | Network (Layer 3-4) |\n| **Application/Proxy** | Inspeksi konten aplikasi | Application (Layer 7) |\n| **Next-Gen (NGFW)** | Deep packet inspection + IPS | Multi-layer |\n| **WAF** | Khusus web application (SQL injection, XSS) | Application (Layer 7) |\n\nAturan firewall (rules):\n\n| Komponen | Contoh |\n|---|---|\n| **Source** | IP/subnet asal (192.168.1.0/24) |\n| **Destination** | IP/subnet tujuan |\n| **Port** | 80 (HTTP), 443 (HTTPS), 22 (SSH) |\n| **Protocol** | TCP, UDP, ICMP |\n| **Action** | Allow, Deny, Log |\n\nPrinsip **default deny**: blokir semua, buka hanya yang diperlukan.\n\nDi perusahaan tambang:\n- **Perimeter firewall**: antara internet dan jaringan internal\n- **Internal firewall**: segmentasi antara OT (operational technology) dan IT\n- **WAF**: melindungi web application (portal, ERP web)\n- **Host firewall**: di setiap server (iptables, Windows Firewall)',
  },

  // ═══════════════════════════════════════════
  // T5: Manajemen Layanan IT (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 17,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *ITIL* (*Information Technology Infrastructure Library*)?',
    options: [
      { key: 'A', text: 'Bahasa pemrograman untuk mengembangkan aplikasi enterprise' },
      { key: 'B', text: 'Kerangka kerja (framework) praktik terbaik untuk manajemen layanan IT' },
      { key: 'C', text: 'Perangkat lunak antivirus yang dikembangkan pemerintah Inggris' },
      { key: 'D', text: 'Sertifikasi wajib untuk semua profesional IT di seluruh dunia' },
      { key: 'E', text: 'Database berisi daftar seluruh perangkat keras IT di pasaran' },
    ],
    correct_answer: 'B',
    explanation: '**ITIL** = kerangka kerja **praktik terbaik** untuk **manajemen layanan IT**.\n\nITIL 4 Value Chain:\n\n| Aktivitas | Tujuan |\n|---|---|\n| **Plan** | Memastikan layanan IT selaras dengan strategi bisnis |\n| **Improve** | Perbaikan berkelanjutan |\n| **Engage** | Memahami kebutuhan stakeholder |\n| **Design & Transition** | Merancang dan mentransisikan layanan |\n| **Obtain/Build** | Mendapatkan/membangun komponen layanan |\n| **Deliver & Support** | Menyampaikan dan mendukung layanan |\n\nPraktik ITIL penting:\n\n| Praktik | Fungsi |\n|---|---|\n| **Incident Management** | Mengembalikan layanan normal ASAP |\n| **Problem Management** | Menemukan akar penyebab insiden |\n| **Change Enablement** | Mengelola perubahan dengan risiko minimal |\n| **Service Desk** | Single point of contact untuk pengguna |\n| **Service Level Management** | Mengelola SLA (Service Level Agreement) |\n| **Configuration Management** | Mengelola aset dan konfigurasi IT |\n\nManfaat ITIL:\n- **Alignment**: IT selaras dengan kebutuhan bisnis\n- **Efisiensi**: proses standar, mengurangi waste\n- **Kualitas**: layanan terukur (SLA/KPI)\n- **Continuous improvement**: budaya perbaikan berkelanjutan',
  },
  {
    order_index: 18,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa perbedaan antara *incident* dan *problem* dalam ITIL?',
    options: [
      { key: 'A', text: 'Incident untuk hardware, problem untuk software' },
      { key: 'B', text: 'Incident untuk pengguna internal, problem untuk pengguna eksternal' },
      { key: 'C', text: 'Incident ringan, problem selalu kritis' },
      { key: 'D', text: 'Incident adalah gangguan layanan, problem adalah akar penyebab gangguan tersebut' },
      { key: 'E', text: 'Incident ditangani tim network, problem ditangani tim security' },
    ],
    correct_answer: 'D',
    explanation: 'Perbedaan **incident** vs **problem** dalam ITIL:\n\n| Aspek | Incident | Problem |\n|---|---|---|\n| **Definisi** | Gangguan/penurunan layanan | Akar penyebab incident |\n| **Tujuan** | **Pulihkan** layanan ASAP | **Cegah** incident berulang |\n| **Urgensi** | Tinggi (segera) | Bisa dijadwalkan |\n| **Solusi** | Workaround/fix sementara | Permanent fix |\n| **Contoh** | "Server down!" | "Mengapa server sering down?" |\n| **Metrik** | MTTR (Mean Time to Restore) | Jumlah known errors terselesaikan |\n\nAlur:\n\n```\nIncident terjadi → Incident Management (pulihkan cepat)\n  ↓\nIncident berulang → Problem Management (cari root cause)\n  ↓\nRoot cause ditemukan → Known Error → Change Request → Permanent Fix\n```\n\nContoh di perusahaan tambang:\n\n| Incident | Problem |\n|---|---|\n| ERP lambat hari ini | Server memori tidak cukup (perlu upgrade) |\n| Email tidak bisa kirim | Konfigurasi SMTP berubah setelah update |\n| Printer site tidak bisa cetak | Driver tidak kompatibel dengan OS baru |\n\nTeknik analisis root cause:\n- **5 Whys**: tanya "mengapa" 5 kali\n- **Fishbone (Ishikawa)**: diagram sebab-akibat\n- **Fault Tree Analysis**: analisis top-down',
  },
  {
    order_index: 19,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *DRP* (*Disaster Recovery Plan*) dalam IT?',
    options: [
      { key: 'A', text: 'Rencana terstruktur untuk memulihkan sistem IT dan data setelah bencana' },
      { key: 'B', text: 'Asuransi yang dibeli perusahaan untuk mengganti perangkat IT yang rusak akibat bencana' },
      { key: 'C', text: 'Perangkat lunak backup yang berjalan otomatis setiap malam' },
      { key: 'D', text: 'Prosedur evakuasi karyawan saat terjadi kebakaran di gedung kantor' },
      { key: 'E', text: 'Kontrak dengan vendor IT untuk mengganti peralatan dalam 24 jam' },
    ],
    correct_answer: 'A',
    explanation: '**DRP** = rencana terstruktur untuk **memulihkan sistem IT** setelah **bencana/gangguan besar**.\n\nMetrik kunci:\n\n| Metrik | Definisi | Contoh |\n|---|---|---|\n| **RTO** (Recovery Time Objective) | Berapa lama sistem boleh down | 4 jam |\n| **RPO** (Recovery Point Objective) | Berapa banyak data boleh hilang | 1 jam (data 1 jam terakhir) |\n| **MTPD** (Max Tolerable Period of Disruption) | Batas maksimal downtime | 24 jam |\n\nStrategi DRP:\n\n| Strategi | RTO | Biaya |\n|---|---|---|\n| **Hot site** | Menit | Sangat tinggi (duplikat penuh, real-time sync) |\n| **Warm site** | Jam | Sedang (infrastruktur siap, data perlu restore) |\n| **Cold site** | Hari | Rendah (ruang kosong, perlu setup) |\n| **Cloud DR** | Menit-jam | Variabel (pay-per-use) |\n\nKomponen DRP:\n1. **Risk Assessment**: identifikasi ancaman\n2. **BIA** (Business Impact Analysis): prioritas sistem\n3. **Strategi recovery**: hot/warm/cold/cloud\n4. **Prosedur**: langkah-langkah recovery\n5. **Testing**: simulasi DR minimal 1x/tahun\n6. **Update**: review dan update berkala\n\nPerbedaan DRP vs BCP:\n- **DRP**: fokus pada **pemulihan IT**\n- **BCP**: lebih luas, mencakup **kelangsungan bisnis** secara keseluruhan',
  },
  {
    order_index: 20,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa fungsi *SLA* (*Service Level Agreement*) dalam manajemen layanan IT?',
    options: [
      { key: 'A', text: 'Kontrak kerja antara karyawan IT dan perusahaan tentang jam kerja' },
      { key: 'B', text: 'Spesifikasi teknis perangkat keras yang harus dibeli perusahaan' },
      { key: 'C', text: 'Perjanjian formal yang menetapkan tingkat layanan yang harus diberikan penyedia layanan IT' },
      { key: 'D', text: 'Daftar software yang diizinkan untuk diinstal di komputer perusahaan' },
      { key: 'E', text: 'Jadwal maintenance server yang dilakukan setiap akhir bulan' },
    ],
    correct_answer: 'C',
    explanation: '**SLA** = perjanjian formal yang mendefinisikan **tingkat layanan** yang harus diberikan.\n\nKomponen SLA:\n\n| Komponen | Contoh |\n|---|---|\n| **Availability** | Uptime 99,9% (max ~8,7 jam downtime/tahun) |\n| **Response time** | Prioritas 1: respons dalam 15 menit |\n| **Resolution time** | Prioritas 1: resolusi dalam 4 jam |\n| **Performance** | Waktu load halaman < 3 detik |\n| **Support hours** | 24/7 atau 8x5 |\n| **Escalation** | Prosedur eskalasi per level prioritas |\n| **Penalties** | Kredit/denda jika SLA tidak tercapai |\n\nLevel prioritas:\n\n| Prioritas | Dampak | Response | Resolution |\n|---|---|---|---|\n| **P1 - Critical** | Sistem down total | 15 menit | 4 jam |\n| **P2 - High** | Fungsi utama terganggu | 30 menit | 8 jam |\n| **P3 - Medium** | Fungsi minor terganggu | 2 jam | 24 jam |\n| **P4 - Low** | Permintaan informasi | 4 jam | 72 jam |\n\nUptime dan downtime:\n\n| SLA Uptime | Downtime/Tahun | Downtime/Bulan |\n|---|---|---|\n| 99% | 3,65 hari | 7,3 jam |\n| 99,9% | 8,76 jam | 43,8 menit |\n| 99,99% | 52,6 menit | 4,38 menit |\n| 99,999% | 5,26 menit | 26,3 detik |',
  },
]

async function main() {
  const { data: pkg, error: pkgErr } = await (supabase.from('packages') as any)
    .select('id, name, slug')
    .eq('slug', 'antam-it')
    .single()

  if (pkgErr || !pkg) {
    console.error('Package antam-it tidak ditemukan:', pkgErr)
    process.exit(1)
  }

  console.log(`\nPackage: ${pkg.name} (${pkg.id})`)
  console.log(`Jumlah soal batch 1: ${questions.length}\n`)

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
