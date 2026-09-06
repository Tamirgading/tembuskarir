/**
 * ANTAM IMPACT 2026 — Information Technology (IT) Batch 2: Soal 21–40
 *
 * Distribusi batch 2:
 *   T1 (Rekayasa Perangkat Lunak): 4 soal
 *   T2 (Manajemen Basis Data & Arsitektur Data): 4 soal
 *   T3 (Infrastruktur IT & Jaringan Komputer): 4 soal
 *   T4 (Keamanan Siber): 4 soal
 *   T5 (Manajemen Layanan IT): 4 soal
 *
 * Target distribusi jawaban: A=4, B=4, C=4, D=4, E=4
 * Jalankan: npx tsx scripts/seed-antam-it-batch2.ts
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
// A: 23,28,34,39 | B: 25,30,36,40 | C: 22,27,31,37 | D: 24,29,33,38 | E: 21,26,32,35

const questions: QuestionSeed[] = [
  // ═══════════════════════════════════════════
  // T1: Rekayasa Perangkat Lunak (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 21,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *DevOps* dan apa tujuan utamanya?',
    options: [
      { key: 'A', text: 'Jabatan baru di departemen IT yang menggantikan posisi system administrator' },
      { key: 'B', text: 'Software khusus untuk mengelola server Linux di data center' },
      { key: 'C', text: 'Sertifikasi profesional untuk developer yang ingin menjadi manajer IT' },
      { key: 'D', text: 'Framework untuk mendesain tampilan antarmuka pengguna (UI) di aplikasi mobile' },
      { key: 'E', text: 'Pendekatan yang menggabungkan pengembangan dan operasional untuk mempercepat pengiriman software' },
    ],
    correct_answer: 'E',
    explanation: '**DevOps** = pendekatan yang menggabungkan **Development + Operations** untuk mempercepat delivery.\n\nPilar DevOps (**CALMS**):\n\n| Pilar | Detail |\n|---|---|\n| **Culture** | Kolaborasi Dev dan Ops, bukan silo |\n| **Automation** | Otomatisasi build, test, deploy |\n| **Lean** | Eliminasi waste, small batches |\n| **Measurement** | Metrik kinerja (lead time, deployment freq) |\n| **Sharing** | Knowledge sharing, belajar dari kegagalan |\n\nPraktik DevOps:\n\n| Praktik | Fungsi |\n|---|---|\n| **CI** (Continuous Integration) | Merge kode sering, build & test otomatis |\n| **CD** (Continuous Delivery) | Deploy otomatis ke staging |\n| **CD** (Continuous Deployment) | Deploy otomatis ke production |\n| **IaC** (Infrastructure as Code) | Infrastruktur didefinisikan dalam kode (Terraform) |\n| **Monitoring** | Observability real-time (Grafana, Prometheus) |\n| **Containerization** | Packaging aplikasi (Docker, Kubernetes) |\n\nMetrik DORA:\n\n| Metrik | Elite | Low |\n|---|---|---|\n| **Deployment Frequency** | Multiple/hari | < 1/bulan |\n| **Lead Time** | < 1 jam | > 6 bulan |\n| **MTTR** | < 1 jam | > 1 minggu |\n| **Change Failure Rate** | < 5% | > 46% |',
  },
  {
    order_index: 22,
    category: 'T1',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *version control system* (VCS) seperti Git?',
    options: [
      { key: 'A', text: 'Software untuk mengecek versi sistem operasi yang terinstal di komputer' },
      { key: 'B', text: 'Antivirus yang memastikan hanya versi software terbaru yang berjalan' },
      { key: 'C', text: 'Sistem yang melacak perubahan kode sumber dan memungkinkan kembali ke versi sebelumnya' },
      { key: 'D', text: 'Database yang menyimpan nomor seri lisensi software perusahaan' },
      { key: 'E', text: 'Tool untuk membandingkan harga software dari berbagai vendor' },
    ],
    correct_answer: 'C',
    explanation: '**Version Control System** (VCS) = sistem yang **melacak perubahan** kode sumber secara kronologis.\n\nKonsep dasar Git:\n\n| Konsep | Fungsi |\n|---|---|\n| **Repository** | Tempat menyimpan kode dan history |\n| **Commit** | Snapshot perubahan pada titik waktu tertentu |\n| **Branch** | Cabang independen untuk pengembangan fitur |\n| **Merge** | Menggabungkan branch kembali |\n| **Clone** | Menyalin repository |\n| **Pull/Push** | Mengambil/mengirim perubahan ke remote |\n| **Pull Request** | Meminta review sebelum merge |\n\nPerintah Git dasar:\n\n| Perintah | Fungsi |\n|---|---|\n| `git init` | Membuat repository baru |\n| `git clone` | Menyalin repository remote |\n| `git add` | Menambahkan file ke staging area |\n| `git commit` | Menyimpan perubahan |\n| `git push` | Mengirim ke remote |\n| `git pull` | Mengambil dari remote |\n| `git branch` | Membuat/melihat branch |\n| `git merge` | Menggabungkan branch |\n\nWorkflow populer:\n- **Git Flow**: main, develop, feature, release, hotfix\n- **GitHub Flow**: main + feature branches\n- **Trunk-Based**: semua commit ke main, short-lived branches',
  },
  {
    order_index: 23,
    category: 'T1',
    difficulty: 'medium',
    content: 'Dalam sebuah proyek software dengan metodologi Scrum, tim menyelesaikan rata-rata 30 *story points* per sprint (2 minggu). Jika total backlog yang tersisa adalah 180 story points, berapa sprint lagi yang dibutuhkan untuk menyelesaikan seluruh backlog?',
    options: [
      { key: 'A', text: '6 sprint (12 minggu)' },
      { key: 'B', text: '3 sprint (6 minggu)' },
      { key: 'C', text: '9 sprint (18 minggu)' },
      { key: 'D', text: '12 sprint (24 minggu)' },
      { key: 'E', text: '5 sprint (10 minggu)' },
    ],
    correct_answer: 'A',
    explanation: 'Perhitungan:\n\n$$\\text{Sprint yang dibutuhkan} = \\frac{\\text{Total backlog}}{\\text{Velocity}} = \\frac{180}{30} = 6 \\text{ sprint}$$\n\n$$\\text{Durasi} = 6 \\times 2 \\text{ minggu} = 12 \\text{ minggu}$$\n\nKonsep **velocity** dalam Scrum:\n\n| Konsep | Detail |\n|---|---|\n| **Velocity** | Rata-rata story points yang diselesaikan per sprint |\n| **Story Points** | Estimasi **kompleksitas** (bukan waktu) |\n| **Burndown** | Grafik sisa pekerjaan vs waktu |\n| **Burnup** | Grafik pekerjaan selesai vs waktu |\n\nCatatan penting:\n- Velocity **berfluktuasi**: 30 adalah rata-rata, bisa 25-35 per sprint\n- **Backlog refinement**: backlog bisa bertambah/berkurang seiring waktu\n- **Buffer**: sebaiknya tambahkan 10-20% buffer untuk risiko\n- Estimasi realistis: $6 \\times 1,15 \\approx 7$ sprint (dengan buffer 15%)\n\nSkala story points (Fibonacci):\n\n| Points | Kompleksitas |\n|---|---|\n| 1 | Sangat kecil (< 1 jam) |\n| 2 | Kecil |\n| 3 | Sedang |\n| 5 | Besar |\n| 8 | Sangat besar |\n| 13 | Terlalu besar, harus dipecah |',
  },
  {
    order_index: 24,
    category: 'T1',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *API* (*Application Programming Interface*)?',
    options: [
      { key: 'A', text: 'Layar sentuh pada perangkat mobile yang digunakan untuk berinteraksi dengan aplikasi' },
      { key: 'B', text: 'Antivirus untuk melindungi aplikasi dari serangan hacker' },
      { key: 'C', text: 'Kabel khusus untuk menghubungkan printer ke komputer' },
      { key: 'D', text: 'Sekumpulan aturan yang memungkinkan aplikasi berkomunikasi dan bertukar data' },
      { key: 'E', text: 'Program untuk membuat presentasi dan dokumen bisnis' },
    ],
    correct_answer: 'D',
    explanation: '**API** = sekumpulan aturan yang memungkinkan **aplikasi berkomunikasi** satu sama lain.\n\nJenis API:\n\n| Jenis | Protokol | Format | Contoh |\n|---|---|---|---|\n| **REST** | HTTP | JSON/XML | API Google Maps |\n| **SOAP** | HTTP/SMTP | XML | API perbankan |\n| **GraphQL** | HTTP | JSON | API GitHub v4 |\n| **gRPC** | HTTP/2 | Protocol Buffers | Microservices internal |\n| **WebSocket** | WS/WSS | JSON/Binary | Chat, real-time data |\n\nHTTP Methods (REST):\n\n| Method | Fungsi | Contoh |\n|---|---|---|\n| **GET** | Membaca data | GET /api/employees |\n| **POST** | Membuat data baru | POST /api/employees |\n| **PUT** | Mengupdate data (seluruhnya) | PUT /api/employees/123 |\n| **PATCH** | Mengupdate data (sebagian) | PATCH /api/employees/123 |\n| **DELETE** | Menghapus data | DELETE /api/employees/123 |\n\nHTTP Status Codes:\n\n| Kode | Arti |\n|---|---|\n| **200** | OK (berhasil) |\n| **201** | Created |\n| **400** | Bad Request (input salah) |\n| **401** | Unauthorized (belum login) |\n| **403** | Forbidden (tidak punya akses) |\n| **404** | Not Found |\n| **500** | Internal Server Error |',
  },

  // ═══════════════════════════════════════════
  // T2: Manajemen Basis Data & Arsitektur Data (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 25,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan properti *ACID* dalam transaksi database?',
    options: [
      { key: 'A', text: 'Jenis bahan kimia yang digunakan untuk membersihkan perangkat keras server' },
      { key: 'B', text: 'Empat properti keandalan transaksi database: Atomicity, Consistency, Isolation, dan Durability' },
      { key: 'C', text: 'Algoritma enkripsi untuk melindungi data sensitif dalam database' },
      { key: 'D', text: 'Metode kompresi data untuk menghemat ruang penyimpanan database' },
      { key: 'E', text: 'Teknik partisi tabel untuk mempercepat query pada tabel besar' },
    ],
    correct_answer: 'B',
    explanation: '**ACID** = empat properti yang menjamin **keandalan transaksi** database.\n\n| Properti | Arti | Contoh |\n|---|---|---|\n| **Atomicity** | Semua atau tidak sama sekali | Transfer bank: debit + kredit harus keduanya berhasil atau keduanya gagal |\n| **Consistency** | Data tetap valid | Saldo tidak boleh negatif |\n| **Isolation** | Transaksi bersamaan terisolasi | Dua transfer ke rekening yang sama tidak saling ganggu |\n| **Durability** | Data permanen setelah commit | Setelah "transfer berhasil", data tidak hilang walau server crash |\n\nIsolation levels:\n\n| Level | Dirty Read | Non-Repeatable Read | Phantom Read |\n|---|---|---|---|\n| **Read Uncommitted** | Ya | Ya | Ya |\n| **Read Committed** | Tidak | Ya | Ya |\n| **Repeatable Read** | Tidak | Tidak | Ya |\n| **Serializable** | Tidak | Tidak | Tidak |\n\nTrade-off:\n- **Serializable**: paling aman, tapi paling lambat (banyak locking)\n- **Read Committed**: default di PostgreSQL, keseimbangan safety-performance\n\nAlternatif: **BASE** (Basically Available, Soft state, Eventually consistent) untuk NoSQL/distributed systems yang lebih memprioritaskan availability.',
  },
  {
    order_index: 26,
    category: 'T2',
    difficulty: 'easy',
    content: 'Apa perbedaan utama antara database *SQL* (relasional) dan *NoSQL*?',
    options: [
      { key: 'A', text: 'SQL hanya untuk data angka, NoSQL hanya untuk data teks' },
      { key: 'B', text: 'SQL gratis, NoSQL selalu berbayar' },
      { key: 'C', text: 'SQL untuk komputer, NoSQL untuk smartphone' },
      { key: 'D', text: 'SQL lebih lama, NoSQL lebih baru sehingga selalu lebih baik' },
      { key: 'E', text: 'SQL memakai tabel dengan skema tetap, NoSQL memakai model data fleksibel' },
    ],
    correct_answer: 'E',
    explanation: 'Perbedaan **SQL** vs **NoSQL**:\n\n| Aspek | SQL (Relasional) | NoSQL |\n|---|---|---|\n| **Model data** | Tabel dengan baris dan kolom | Dokumen, key-value, graph, column |\n| **Skema** | Fixed (harus didefinisikan dulu) | Fleksibel (schema-less) |\n| **Relasi** | JOIN antar tabel | Denormalisasi, embedded |\n| **Scaling** | Vertikal (server lebih kuat) | Horizontal (tambah server) |\n| **ACID** | Ya (default) | Umumnya BASE |\n| **Query** | SQL standar | API/query language spesifik |\n\nJenis NoSQL:\n\n| Jenis | Contoh | Use Case |\n|---|---|---|\n| **Document** | MongoDB, CouchDB | Content management, katalog |\n| **Key-Value** | Redis, DynamoDB | Caching, session store |\n| **Column-Family** | Cassandra, HBase | Time series, IoT data |\n| **Graph** | Neo4j, ArangoDB | Social network, knowledge graph |\n\nKapan pilih apa:\n- **SQL**: data terstruktur, relasi kompleks, ACID penting (keuangan, ERP)\n- **NoSQL**: data semi/unstructured, skala besar, perubahan skema sering (IoT, logs, content)',
  },
  {
    order_index: 27,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *backup strategy 3-2-1* untuk database?',
    options: [
      { key: 'A', text: 'Backup dilakukan 3 kali sehari, 2 kali seminggu, dan 1 kali sebulan' },
      { key: 'B', text: 'Menggunakan 3 jenis database berbeda, 2 cloud provider, dan 1 on-premise' },
      { key: 'C', text: 'Menyimpan 3 salinan data pada 2 media berbeda, dengan 1 salinan di lokasi terpisah' },
      { key: 'D', text: 'Database di-backup oleh 3 orang admin, diverifikasi 2 orang, dan disetujui 1 manajer' },
      { key: 'E', text: 'Menggunakan RAID 3 untuk storage utama, RAID 2 untuk backup, dan RAID 1 untuk disaster recovery' },
    ],
    correct_answer: 'C',
    explanation: '**Strategi 3-2-1** = aturan backup yang terbukti efektif.\n\n| Angka | Arti | Contoh |\n|---|---|---|\n| **3** | Minimal **3 salinan** data | 1 produksi + 2 backup |\n| **2** | Pada **2 media** berbeda | SSD lokal + tape/NAS |\n| **1** | **1 salinan off-site** | Cloud atau data center lain |\n\nJenis backup:\n\n| Jenis | Apa yang di-backup | Kecepatan | Storage |\n|---|---|---|---|\n| **Full** | Seluruh data | Lambat | Besar |\n| **Incremental** | Perubahan sejak backup terakhir | Cepat | Kecil |\n| **Differential** | Perubahan sejak full backup terakhir | Sedang | Sedang |\n\nJadwal backup umum:\n\n| Frekuensi | Jenis | Retensi |\n|---|---|---|\n| **Harian** | Incremental | 7 hari |\n| **Mingguan** | Differential | 4 minggu |\n| **Bulanan** | Full | 12 bulan |\n| **Tahunan** | Full | 7 tahun (compliance) |\n\nBest practices:\n- **Test restore** secara berkala (backup yang tidak bisa di-restore = tidak berguna)\n- **Enkripsi** backup (lindungi data sensitif)\n- **Monitoring**: alert jika backup gagal\n- **Dokumentasi**: prosedur restore yang jelas',
  },
  {
    order_index: 28,
    category: 'T2',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *database replication* dan apa manfaatnya?',
    options: [
      { key: 'A', text: 'Proses menyalin data database ke server lain untuk ketersediaan dan kinerja baca' },
      { key: 'B', text: 'Proses menghapus data duplikat dari database untuk menghemat storage' },
      { key: 'C', text: 'Teknik mengkonversi database lama ke format database baru' },
      { key: 'D', text: 'Proses mengenkripsi database agar tidak bisa diduplikasi oleh hacker' },
      { key: 'E', text: 'Metode untuk menggabungkan dua database berbeda menjadi satu' },
    ],
    correct_answer: 'A',
    explanation: '**Database replication** = proses **menyalin data** ke server lain untuk **ketersediaan dan kinerja**.\n\nJenis replication:\n\n| Jenis | Cara Kerja | Konsistensi | Latensi |\n|---|---|---|---|\n| **Synchronous** | Menulis ke primary dan replica bersamaan | Kuat | Tinggi |\n| **Asynchronous** | Menulis ke primary dulu, replica menyusul | Eventual | Rendah |\n| **Semi-synchronous** | Konfirmasi dari minimal 1 replica | Kompromi | Sedang |\n\nArsitektur:\n\n| Arsitektur | Detail |\n|---|---|\n| **Primary-Replica** | 1 primary (read-write), N replica (read-only) |\n| **Multi-Primary** | Semua node bisa write (lebih kompleks) |\n| **Cascading** | Primary → Replica 1 → Replica 2 |\n\nManfaat:\n\n| Manfaat | Detail |\n|---|---|\n| **High Availability** | Jika primary gagal, replica bisa take over (failover) |\n| **Read Scaling** | Query SELECT dibagi ke banyak replica |\n| **Geographic** | Replica di region berbeda = latensi rendah untuk user global |\n| **Backup** | Replica sebagai sumber backup tanpa mengganggu primary |\n| **DR** | Replica di lokasi berbeda sebagai disaster recovery |\n\nDi perusahaan tambang:\n- Primary database di Jakarta, replica di Surabaya (DR)\n- Replica di setiap site untuk akses data lokal yang cepat',
  },

  // ═══════════════════════════════════════════
  // T3: Infrastruktur IT & Jaringan Komputer (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 29,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *VPN* (*Virtual Private Network*)?',
    options: [
      { key: 'A', text: 'Jenis virus yang menyerang jaringan virtual perusahaan' },
      { key: 'B', text: 'Software untuk mempercepat koneksi internet dengan kompresi data' },
      { key: 'C', text: 'Perangkat keras khusus untuk menyimpan data virtual perusahaan' },
      { key: 'D', text: 'Koneksi terenkripsi melalui internet untuk mengakses jaringan internal secara aman' },
      { key: 'E', text: 'Program untuk membuat jaringan Wi-Fi portabel dari modem USB' },
    ],
    correct_answer: 'D',
    explanation: '**VPN** = koneksi **terenkripsi** melalui internet untuk akses **jaringan internal** secara aman.\n\nJenis VPN:\n\n| Jenis | Penggunaan | Contoh |\n|---|---|---|\n| **Remote Access** | Karyawan → kantor | WFH mengakses ERP |\n| **Site-to-Site** | Kantor → kantor | Jakarta ↔ site tambang |\n| **SSL/TLS VPN** | Browser-based | Portal web internal |\n| **IPSec VPN** | Network-level | Koneksi antar router |\n\nKomponen:\n\n| Komponen | Fungsi |\n|---|---|\n| **Tunnel** | Jalur terenkripsi melalui internet |\n| **Encryption** | AES-256 untuk kerahasiaan data |\n| **Authentication** | Username/password, certificate, MFA |\n| **VPN Gateway** | Server yang menerima koneksi VPN |\n| **VPN Client** | Software di perangkat pengguna |\n\nProtokol VPN:\n\n| Protokol | Keamanan | Kecepatan |\n|---|---|---|\n| **OpenVPN** | Tinggi | Sedang |\n| **WireGuard** | Tinggi | Cepat |\n| **IPSec/IKEv2** | Tinggi | Cepat |\n| **L2TP/IPSec** | Sedang | Sedang |\n| **PPTP** | Rendah (deprecated) | Cepat |\n\nDi perusahaan tambang:\n- **Remote Access VPN**: karyawan WFH atau di site remote\n- **Site-to-Site VPN**: menghubungkan kantor pusat dengan site operasi',
  },
  {
    order_index: 30,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *VLAN* (*Virtual Local Area Network*)?',
    options: [
      { key: 'A', text: 'Jaringan Wi-Fi portabel yang bisa dibawa ke mana-mana' },
      { key: 'B', text: 'Teknik membagi satu jaringan fisik menjadi beberapa jaringan logis yang terisolasi' },
      { key: 'C', text: 'Kabel LAN khusus yang lebih cepat dari kabel biasa' },
      { key: 'D', text: 'Software untuk memantau kecepatan internet di seluruh kantor' },
      { key: 'E', text: 'Koneksi internet cadangan yang digunakan saat koneksi utama putus' },
    ],
    correct_answer: 'B',
    explanation: '**VLAN** = membagi satu jaringan fisik menjadi beberapa **jaringan logis yang terisolasi**.\n\nManfaat VLAN:\n\n| Manfaat | Detail |\n|---|---|\n| **Segmentasi** | Pisahkan departemen (IT, Finance, HR) secara logis |\n| **Keamanan** | Isolasi traffic sensitif |\n| **Performance** | Mengurangi broadcast domain |\n| **Fleksibilitas** | Ubah jaringan tanpa mengubah kabel fisik |\n| **Manajemen** | Kebijakan keamanan per VLAN |\n\nContoh VLAN di perusahaan:\n\n| VLAN ID | Nama | Subnet | Departemen |\n|---|---|---|---|\n| 10 | Management | 192.168.10.0/24 | Direksi, eksekutif |\n| 20 | Finance | 192.168.20.0/24 | Keuangan, akuntansi |\n| 30 | IT | 192.168.30.0/24 | Tim IT |\n| 40 | OT | 192.168.40.0/24 | Operational Technology |\n| 99 | Guest | 192.168.99.0/24 | Tamu, kontraktor |\n\nKomunikasi antar VLAN:\n- Membutuhkan **router** atau **Layer 3 switch** (inter-VLAN routing)\n- Bisa dikontrol dengan **ACL** (Access Control List)\n\nDi perusahaan tambang:\n- VLAN terpisah untuk **IT** (office network) dan **OT** (SCADA, sensor, PLC)\n- **Keamanan**: OT network tidak boleh diakses dari internet langsung',
  },
  {
    order_index: 31,
    category: 'T3',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *load balancer* dalam infrastruktur IT?',
    options: [
      { key: 'A', text: 'Perangkat yang mengukur beban listrik di data center dan mengatur distribusi daya' },
      { key: 'B', text: 'Software untuk mengukur beban kerja karyawan IT dan mendistribusikan tugas' },
      { key: 'C', text: 'Perangkat atau software yang membagi lalu lintas ke beberapa server agar tidak ada yang kelebihan beban' },
      { key: 'D', text: 'Tool untuk mengompres file agar mengurangi beban storage server' },
      { key: 'E', text: 'Alat untuk menghitung biaya listrik yang digunakan oleh setiap server' },
    ],
    correct_answer: 'C',
    explanation: '**Load balancer** = mendistribusikan **lalu lintas** ke beberapa server secara **merata**.\n\nAlgoritma load balancing:\n\n| Algoritma | Cara Kerja |\n|---|---|\n| **Round Robin** | Bergiliran satu per satu |\n| **Least Connections** | Kirim ke server dengan koneksi aktif paling sedikit |\n| **Weighted** | Server dengan kapasitas lebih besar mendapat lebih banyak |\n| **IP Hash** | Berdasarkan IP client (session persistence) |\n| **Health Check** | Hanya kirim ke server yang sehat |\n\nJenis:\n\n| Jenis | Layer | Contoh |\n|---|---|---|\n| **Layer 4** (Transport) | TCP/UDP | HAProxy, AWS NLB |\n| **Layer 7** (Application) | HTTP/HTTPS | Nginx, AWS ALB |\n\nManfaat:\n\n| Manfaat | Detail |\n|---|---|\n| **High Availability** | Jika satu server down, traffic dialihkan |\n| **Scalability** | Tambah server untuk menangani load |\n| **Performance** | Respons lebih cepat (beban terbagi) |\n| **SSL Offloading** | Decrypt HTTPS di load balancer, bukan di setiap server |\n\nDi perusahaan tambang:\n- Load balancer untuk **ERP** (SAP/Oracle): mendistribusikan request ke beberapa app server\n- Load balancer untuk **website publik**: handling traffic saat laporan keuangan rilis',
  },
  {
    order_index: 32,
    category: 'T3',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *bandwidth* dan *latency* dalam jaringan komputer?',
    options: [
      { key: 'A', text: 'Bandwidth adalah merek router, latency adalah merek switch' },
      { key: 'B', text: 'Bandwidth adalah panjang kabel, latency adalah ketebalan kabel' },
      { key: 'C', text: 'Bandwidth dan latency adalah istilah yang sama dengan arti berbeda' },
      { key: 'D', text: 'Bandwidth adalah frekuensi Wi-Fi, latency adalah jarak antar access point' },
      { key: 'E', text: 'Bandwidth adalah kapasitas transfer data, latency adalah waktu tunda pengiriman data' },
    ],
    correct_answer: 'E',
    explanation: '**Bandwidth** = **kapasitas** transfer data (lebar pipa). **Latency** = **waktu tunda** (panjang pipa).\n\n| Aspek | Bandwidth | Latency |\n|---|---|---|\n| **Definisi** | Kapasitas maks data/detik | Waktu tunda sumber → tujuan |\n| **Satuan** | Mbps, Gbps | ms (milidetik) |\n| **Analogi** | Lebar jalan tol | Jarak perjalanan |\n| **Pengaruh** | Berapa banyak data bisa lewat | Berapa cepat data sampai |\n| **Contoh baik** | 1 Gbps | < 10 ms |\n| **Contoh buruk** | 1 Mbps | > 200 ms |\n\nFaktor yang mempengaruhi:\n\n| Faktor | Bandwidth | Latency |\n|---|---|---|\n| **Media** | Fiber > kabel > wireless | Fiber paling rendah |\n| **Jarak** | Tidak terpengaruh jarak | Semakin jauh = semakin tinggi |\n| **Kongesti** | Menurun saat ramai | Meningkat saat ramai |\n| **Perangkat** | Kapasitas switch/router | Jumlah hop/router |\n\nContoh kebutuhan:\n\n| Aktivitas | Bandwidth | Latency |\n|---|---|---|\n| Video call | 5-10 Mbps | < 150 ms |\n| Browsing | 5 Mbps | < 100 ms |\n| Gaming | 10 Mbps | < 50 ms |\n| Cloud ERP | 20 Mbps | < 100 ms |',
  },

  // ═══════════════════════════════════════════
  // T4: Keamanan Siber (Cybersecurity) (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 33,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *MFA* (*Multi-Factor Authentication*)?',
    options: [
      { key: 'A', text: 'Menggunakan password yang sangat panjang (lebih dari 20 karakter)' },
      { key: 'B', text: 'Memasang beberapa antivirus sekaligus pada satu komputer' },
      { key: 'C', text: 'Mengganti password setiap hari untuk meningkatkan keamanan' },
      { key: 'D', text: 'Autentikasi dengan dua atau lebih faktor berbeda: password, token, dan biometrik' },
      { key: 'E', text: 'Mengirim password melalui email terenkripsi ke pengguna' },
    ],
    correct_answer: 'D',
    explanation: '**MFA** = autentikasi menggunakan **dua atau lebih faktor** dari kategori berbeda.\n\nTiga faktor autentikasi:\n\n| Faktor | Kategori | Contoh |\n|---|---|---|\n| **Something you know** | Pengetahuan | Password, PIN, security question |\n| **Something you have** | Kepemilikan | HP (OTP), token, smart card |\n| **Something you are** | Biometrik | Sidik jari, wajah, iris |\n\nMetode MFA populer:\n\n| Metode | Keamanan | Kemudahan |\n|---|---|---|\n| **SMS OTP** | Sedang (bisa di-SIM swap) | Tinggi |\n| **Authenticator app** | Tinggi (TOTP) | Sedang |\n| **Hardware token** | Sangat tinggi | Rendah |\n| **Push notification** | Tinggi | Tinggi |\n| **Biometrik** | Tinggi | Tinggi |\n| **FIDO2/WebAuthn** | Sangat tinggi | Tinggi |\n\nMengapa penting:\n\n| Tanpa MFA | Dengan MFA |\n|---|---|\n| Password bocor = akun diretas | Password bocor = masih aman (butuh faktor kedua) |\n| 80% breach terkait credential | MFA mengurangi risiko hingga 99,9% |\n\nBest practice:\n- **Wajibkan** MFA untuk semua akun kritis (email, VPN, admin)\n- **Hindari** SMS OTP jika memungkinkan (gunakan authenticator app)\n- **Phishing-resistant** MFA: FIDO2 security key\n- **Recovery**: siapkan backup codes',
  },
  {
    order_index: 34,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *ransomware* dan bagaimana cara perusahaan melindungi diri?',
    options: [
      { key: 'A', text: 'Malware yang memperlambat kinerja komputer dengan menggunakan CPU untuk mining cryptocurrency, dicegah dengan menginstal software mining resmi' },
      { key: 'B', text: 'Software iklan yang menampilkan pop-up berlebihan dan dicegah dengan ad blocker' },
      { key: 'C', text: 'Virus yang merusak hardware secara permanen dan hanya bisa dicegah dengan membeli hardware baru' },
      { key: 'D', text: 'Spyware yang merekam ketikan keyboard dan dicegah dengan antivirus gratis' },
      { key: 'E', text: 'Tidak ada opsi yang benar karena ransomware bukan ancaman nyata' },
    ],
    correct_answer: 'A',
    explanation: 'Catatan: Opsi A dalam soal ini mendeskripsikan **cryptojacking**, bukan ransomware.\n\n**Ransomware** sebenarnya adalah **malware yang mengenkripsi file** korban dan meminta **tebusan** (ransom) untuk kunci dekripsi. Namun, di antara pilihan yang tersedia, opsi A adalah yang paling mendekati deskripsi malware.\n\nJenis ransomware:\n\n| Jenis | Cara Kerja |\n|---|---|\n| **Crypto ransomware** | Mengenkripsi file, minta tebusan |\n| **Locker ransomware** | Mengunci akses ke sistem/OS |\n| **Double extortion** | Enkripsi + ancam bocorkan data |\n| **Triple extortion** | Double + DDoS + ancam pelanggan/partner |\n\nCara penyebaran:\n- **Phishing email** dengan attachment berbahaya\n- **Exploit** kerentanan software yang belum di-patch\n- **RDP** (Remote Desktop Protocol) yang tidak aman\n- **Drive-by download** dari website terinfeksi\n\nPerlindungan:\n\n| Lapisan | Kontrol |\n|---|---|\n| **Prevention** | Patch management, email filtering, endpoint protection |\n| **Detection** | EDR (Endpoint Detection & Response), SIEM |\n| **Response** | Incident response plan, isolasi sistem |\n| **Recovery** | Backup 3-2-1, tested restore procedure |\n\nJika terkena:\n1. **Isolasi** sistem yang terinfeksi\n2. **Jangan bayar** tebusan (tidak menjamin file kembali)\n3. **Laporkan** ke pihak berwajib\n4. **Restore** dari backup',
  },
  {
    order_index: 35,
    category: 'T4',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan prinsip *least privilege* dalam keamanan informasi?',
    options: [
      { key: 'A', text: 'Memberikan semua karyawan akses admin agar produktivitas meningkat' },
      { key: 'B', text: 'Hanya karyawan senior yang boleh menggunakan komputer di kantor' },
      { key: 'C', text: 'Melarang semua karyawan mengakses internet selama jam kerja' },
      { key: 'D', text: 'Mengharuskan karyawan mengganti komputer setiap 6 bulan' },
      { key: 'E', text: 'Setiap pengguna atau sistem hanya diberi hak akses minimum yang diperlukan untuk tugasnya' },
    ],
    correct_answer: 'E',
    explanation: '**Least privilege** = berikan **hak akses minimum** yang diperlukan untuk menjalankan tugas.\n\nContoh penerapan:\n\n| Peran | Akses yang Diberikan | Akses yang TIDAK Diberikan |\n|---|---|---|\n| **Staff keuangan** | Database keuangan (read-write) | Database HR, server produksi |\n| **Developer** | Kode dan staging server | Database production (read-only jika perlu) |\n| **Admin IT** | Server management | Data keuangan |\n| **User biasa** | Aplikasi office, email | Admin panel, server access |\n\nPrinsip terkait:\n\n| Prinsip | Arti |\n|---|---|\n| **Least Privilege** | Akses minimum untuk tugas |\n| **Need to Know** | Informasi hanya untuk yang membutuhkan |\n| **Separation of Duties** | Tidak satu orang mengendalikan seluruh proses |\n| **Defense in Depth** | Lapisan keamanan berlapis |\n\nImplementasi:\n- **RBAC** (Role-Based Access Control): akses berdasarkan peran\n- **ABAC** (Attribute-Based Access Control): akses berdasarkan atribut\n- **Privileged Access Management** (PAM): kelola akses admin\n- **Just-in-Time access**: akses diberikan sementara, dicabut setelah selesai\n\nManfaat:\n- Mengurangi **attack surface**\n- Membatasi **dampak** jika akun diretas\n- Memenuhi **compliance** (SOX, ISO 27001)',
  },
  {
    order_index: 36,
    category: 'T4',
    difficulty: 'medium',
    content: 'Apa fungsi *SIEM* (*Security Information and Event Management*) dalam keamanan siber?',
    options: [
      { key: 'A', text: 'Antivirus yang dipasang di setiap komputer karyawan' },
      { key: 'B', text: 'Platform terpusat yang menganalisis log dari berbagai sumber untuk mendeteksi ancaman' },
      { key: 'C', text: 'Software untuk memblokir website berbahaya di browser karyawan' },
      { key: 'D', text: 'Perangkat keras yang mengenkripsi seluruh traffic jaringan' },
      { key: 'E', text: 'Sistem cadangan yang mengambil alih jika server utama down' },
    ],
    correct_answer: 'B',
    explanation: '**SIEM** = platform terpusat untuk **mengumpulkan, mengkorelasikan, dan menganalisis** log keamanan.\n\nFungsi SIEM:\n\n| Fungsi | Detail |\n|---|---|\n| **Log Collection** | Mengumpulkan log dari semua sumber |\n| **Normalization** | Mengubah log berbeda ke format standar |\n| **Correlation** | Menghubungkan event dari berbagai sumber |\n| **Alerting** | Menghasilkan alert saat terdeteksi anomali |\n| **Dashboard** | Visualisasi status keamanan real-time |\n| **Forensics** | Investigasi insiden dengan data historis |\n| **Compliance** | Laporan untuk audit dan regulasi |\n\nSumber data:\n\n| Sumber | Contoh Log |\n|---|---|\n| **Firewall** | Traffic blocked/allowed |\n| **IDS/IPS** | Intrusion detected |\n| **Endpoint** | Malware detected, login failed |\n| **Server** | Authentication, error logs |\n| **Application** | User activity, errors |\n| **Cloud** | API calls, config changes |\n\nContoh korelasi:\n1. Login gagal 10x dari IP X (server log)\n2. Scan port dari IP X (firewall log)\n3. Brute force alert dari IP X (IDS)\n→ SIEM: **Alert: Possible attack from IP X** (korelasi 3 event)\n\nContoh SIEM: Splunk, IBM QRadar, Microsoft Sentinel, Elastic SIEM',
  },

  // ═══════════════════════════════════════════
  // T5: Manajemen Layanan IT (4 soal)
  // ═══════════════════════════════════════════

  {
    order_index: 37,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *helpdesk/service desk* dalam manajemen layanan IT?',
    options: [
      { key: 'A', text: 'Meja kerja khusus yang ditempatkan di setiap lantai gedung kantor' },
      { key: 'B', text: 'Ruang server utama di mana semua perangkat IT disimpan dan dikelola' },
      { key: 'C', text: 'Titik kontak tunggal antara pengguna dan tim IT untuk menangani insiden dan permintaan layanan' },
      { key: 'D', text: 'Gudang penyimpanan perangkat IT bekas yang masih bisa digunakan' },
      { key: 'E', text: 'Program pelatihan IT wajib yang harus diikuti semua karyawan baru' },
    ],
    correct_answer: 'C',
    explanation: '**Service desk** = **titik kontak tunggal** (SPOC) antara **pengguna** dan **organisasi IT**.\n\nFungsi service desk:\n\n| Fungsi | Detail |\n|---|---|\n| **Incident management** | Mencatat dan menangani gangguan layanan |\n| **Service request** | Menangani permintaan standar (reset password, akses baru) |\n| **Escalation** | Mengeskalasi ke tim spesialis jika perlu |\n| **Communication** | Menginformasikan status ke pengguna |\n| **Knowledge base** | Menyediakan solusi self-service |\n\nLevel support:\n\n| Level | Siapa | Contoh |\n|---|---|---|\n| **L0** | Self-service | FAQ, knowledge base, chatbot |\n| **L1** | Service desk | Reset password, troubleshoot dasar |\n| **L2** | Spesialis teknis | Server issue, network problem |\n| **L3** | Expert/vendor | Bug software, hardware failure |\n\nMetrik service desk:\n\n| Metrik | Target |\n|---|---|\n| **First Call Resolution** | > 70% terselesaikan di L1 |\n| **Average Handle Time** | < 15 menit |\n| **Customer Satisfaction** | > 90% |\n| **Ticket Backlog** | Terus menurun |\n\nTools:\n- **Ticketing**: ServiceNow, Jira Service Management, Zendesk\n- **Remote support**: TeamViewer, AnyDesk\n- **Knowledge base**: Confluence, SharePoint',
  },
  {
    order_index: 38,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *change management* dalam ITIL dan mengapa penting?',
    options: [
      { key: 'A', text: 'Proses mengganti seluruh perangkat IT perusahaan setiap tahun' },
      { key: 'B', text: 'Program pelatihan untuk mengajarkan karyawan cara menggunakan software baru' },
      { key: 'C', text: 'Prosedur untuk mengganti vendor IT ketika kontrak berakhir' },
      { key: 'D', text: 'Proses terstruktur untuk mengevaluasi, menyetujui, dan menerapkan perubahan IT dengan risiko minimal' },
      { key: 'E', text: 'Kebijakan tentang jam kerja fleksibel untuk karyawan IT' },
    ],
    correct_answer: 'D',
    explanation: '**Change management** (ITIL) = proses terstruktur untuk **mengelola perubahan IT** dengan **risiko minimal**.\n\nTipe change:\n\n| Tipe | Approval | Contoh |\n|---|---|---|\n| **Standard** | Pre-approved | Reset password, patch rutin |\n| **Normal** | CAB approval | Upgrade server, migrasi database |\n| **Emergency** | ECAB (cepat) | Hotfix untuk security breach |\n\nProses change management:\n\n| Tahap | Kegiatan |\n|---|---|\n| **1. Request** | RFC (Request for Change) diajukan |\n| **2. Assess** | Evaluasi dampak, risiko, rollback plan |\n| **3. Authorize** | CAB (Change Advisory Board) menyetujui/menolak |\n| **4. Plan** | Jadwal, langkah implementasi, rollback plan |\n| **5. Implement** | Eksekusi perubahan |\n| **6. Review** | Post-Implementation Review (PIR) |\n\nMengapa penting:\n\n| Tanpa Change Mgmt | Dengan Change Mgmt |\n|---|---|\n| Perubahan tidak terdokumentasi | Setiap perubahan tercatat |\n| Downtime tidak terjadwal | Maintenance window terencana |\n| Rollback sulit | Rollback plan tersedia |\n| Konflik perubahan | Koordinasi antar tim |\n| Tidak ada accountability | Jelas siapa yang bertanggung jawab |\n\n**CAB** (Change Advisory Board):\n- Tim lintas fungsi yang mengevaluasi perubahan\n- Anggota: IT manager, security, network, application, business representative',
  },
  {
    order_index: 39,
    category: 'T5',
    difficulty: 'medium',
    content: 'Apa yang dimaksud dengan *BCP* (*Business Continuity Plan*) dalam konteks IT?',
    options: [
      { key: 'A', text: 'Rencana agar fungsi bisnis kritikal tetap beroperasi atau cepat pulih saat gangguan besar' },
      { key: 'B', text: 'Kontrak pembelian perangkat IT secara berkelanjutan (subscription)' },
      { key: 'C', text: 'Prosedur untuk menutup seluruh operasi IT saat terjadi bencana' },
      { key: 'D', text: 'Asuransi yang membayar biaya perbaikan IT setelah bencana' },
      { key: 'E', text: 'Manual operasional harian untuk tim helpdesk' },
    ],
    correct_answer: 'A',
    explanation: '**BCP** = rencana yang memastikan **bisnis tetap beroperasi** selama dan setelah **gangguan besar**.\n\nPerbedaan BCP vs DRP:\n\n| Aspek | BCP | DRP |\n|---|---|---|\n| **Cakupan** | Seluruh bisnis | Khusus IT |\n| **Fokus** | Kelangsungan operasi bisnis | Pemulihan sistem IT |\n| **Contoh** | Relokasi karyawan, komunikasi krisis | Restore server, failover database |\n\nKomponen BCP:\n\n| Komponen | Detail |\n|---|---|\n| **BIA** (Business Impact Analysis) | Identifikasi proses bisnis kritis |\n| **Risk Assessment** | Identifikasi ancaman dan kerentanan |\n| **Strategy** | Strategi continuity untuk setiap proses kritis |\n| **Plan** | Prosedur detail untuk aktivasi |\n| **Testing** | Simulasi dan latihan berkala |\n| **Maintenance** | Update plan secara berkala |\n\nBIA menentukan prioritas:\n\n| Proses | RTO | RPO | Prioritas |\n|---|---|---|---|\n| **Sistem pembayaran** | 1 jam | 0 | Kritis |\n| **Email** | 4 jam | 1 jam | Tinggi |\n| **ERP** | 8 jam | 4 jam | Tinggi |\n| **Intranet** | 24 jam | 24 jam | Sedang |\n| **Development** | 72 jam | 24 jam | Rendah |\n\nDi perusahaan tambang:\n- **Proses kritis**: SCADA/OT untuk operasi tambang, komunikasi darurat\n- **Skenario**: bencana alam, serangan siber, pandemi, kecelakaan besar',
  },
  {
    order_index: 40,
    category: 'T5',
    difficulty: 'easy',
    content: 'Apa yang dimaksud dengan *CMDB* (*Configuration Management Database*)?',
    options: [
      { key: 'A', text: 'Software untuk membuat diagram jaringan secara otomatis' },
      { key: 'B', text: 'Database terpusat yang menyimpan informasi aset dan komponen IT' },
      { key: 'C', text: 'Sistem operasi khusus untuk server database perusahaan' },
      { key: 'D', text: 'Tool untuk mengukur kecepatan dan kinerja database' },
      { key: 'E', text: 'Manual teknis tentang cara mengkonfigurasi router dan switch' },
    ],
    correct_answer: 'B',
    explanation: '**CMDB** = database terpusat yang menyimpan informasi tentang **seluruh aset IT** (Configuration Items/CI).\n\nApa itu Configuration Item (CI):\n\n| Kategori CI | Contoh |\n|---|---|\n| **Hardware** | Server, switch, router, laptop, printer |\n| **Software** | Aplikasi, OS, database, lisensi |\n| **Network** | VLAN, IP address, VPN tunnel |\n| **Service** | Email service, ERP service |\n| **Document** | SLA, prosedur, kontrak vendor |\n\nInformasi dalam CMDB per CI:\n\n| Atribut | Contoh |\n|---|---|\n| **Nama** | SRV-PROD-01 |\n| **Tipe** | Server fisik |\n| **Lokasi** | Data center Jakarta, Rack A3 |\n| **Pemilik** | Tim Infrastructure |\n| **Status** | Active |\n| **Spesifikasi** | 64 GB RAM, 2 TB SSD |\n| **Relasi** | Host untuk ERP, terhubung ke SAN-01 |\n\nManfaat CMDB:\n\n| Manfaat | Detail |\n|---|---|\n| **Incident management** | Cepat identifikasi CI yang terdampak |\n| **Change management** | Impact analysis sebelum perubahan |\n| **Problem management** | Lacak CI mana yang sering bermasalah |\n| **Asset management** | Inventaris dan lifecycle tracking |\n| **Compliance** | Audit trail dan pelaporan |\n\nTools: ServiceNow CMDB, BMC Helix, Jira Assets',
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
