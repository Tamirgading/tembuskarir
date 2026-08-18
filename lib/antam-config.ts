/**
 * ANTAM IMPACT 2026 — Konfigurasi 14 Job Streams
 * Setiap stream memiliki paket tersendiri (40 soal, 50 menit).
 */

export interface AntamStream {
  code: string
  name: string
  slug: string
  jurusan: string
  topics: { name: string; subtopics: string[] }[]
}

export const ANTAM_STREAMS: Record<string, AntamStream> = {
  EXP: {
    code: 'EXP',
    name: 'Exploration',
    slug: 'antam-exploration',
    jurusan: 'Teknik Geologi, Teknik Pertambangan',
    topics: [
      { name: 'Geological Mapping & Surveying', subtopics: ['Surface Mapping Techniques', 'Structural Geology Analysis', 'Topographic Surveying', 'Core Logging Fundamentals'] },
      { name: 'Geophysics', subtopics: ['Magnetic Surveys', 'Gravity Surveys', 'Electromagnetic (EM) Methods', 'Seismic Profiling'] },
      { name: 'Geochemistry', subtopics: ['Soil & Stream Sediment Sampling', 'Rock Chip Sampling', 'Analytical Techniques (Assaying)', 'Geochemical Anomaly Interpretation'] },
      { name: 'Remote Sensing & GIS', subtopics: ['Satellite Imagery Analysis', 'Aerial Photography Interpretation', 'LiDAR Applications', 'GIS for Spatial Data Management'] },
      { name: 'Resource Modeling & Estimation', subtopics: ['Geostatistics Fundamentals', '3D Geological Modeling', 'Block Modeling', 'Mineral Resource Classification (JORC, NI 43-101)'] },
      { name: 'Exploration Drilling', subtopics: ['Diamond Core Drilling', 'Reverse Circulation (RC) Drilling', 'Rotary Air Blast (RAB) Drilling', 'Drill Hole Planning and Surveying'] },
    ],
  },
  MIN: {
    code: 'MIN',
    name: 'Mining',
    slug: 'antam-mining',
    jurusan: 'Teknik Pertambangan',
    topics: [
      { name: 'Mine Planning & Design', subtopics: ['Pit Optimization (Surface)', 'Stope Design (Underground)', 'Mine Scheduling', 'Cut-off Grade Analysis'] },
      { name: 'Drill & Blast Operations', subtopics: ['Blast Hole Drilling Techniques', 'Explosives Types and Selection', 'Blast Design and Timing', 'Fragmentation Optimization'] },
      { name: 'Load & Haul Systems', subtopics: ['Excavator & Shovel Operations', 'Haul Truck Fleet Management', 'Conveyor Systems', 'Underground LHD Operations'] },
      { name: 'Geotechnical Engineering', subtopics: ['Rock Mass Characterization', 'Slope Stability Analysis (Surface)', 'Ground Support Systems (Underground)', 'Seismic Monitoring'] },
      { name: 'Mine Ventilation (Underground)', subtopics: ['Primary & Secondary Ventilation Circuits', 'Fan Selection and Operation', 'Gas and Dust Control', 'Heat Management'] },
      { name: 'Water Management', subtopics: ['Mine Dewatering', 'Groundwater Modeling', 'Surface Water Diversion', 'Acid Mine Drainage (AMD) Prevention'] },
      { name: 'Fleet Management & Dispatch', subtopics: ['Real-time Equipment Tracking', 'Dispatch Optimization Algorithms', 'Operator Performance Monitoring', 'Telemetry and Data Analytics'] },
      { name: 'Mine Closure & Reclamation Planning', subtopics: ['Progressive Rehabilitation', 'Final Landform Design', 'Revegetation Strategies', 'Post-Closure Monitoring'] },
    ],
  },
  PRC: {
    code: 'PRC',
    name: 'Processing',
    slug: 'antam-processing',
    jurusan: 'Teknik Metalurgi, Teknik Kimia',
    topics: [
      { name: 'Termodinamika & Kinetika Reaksi Dasar', subtopics: ['Hukum Termodinamika Dasar', 'Kesetimbangan Energi dan Massa', 'Laju Reaksi Kimia Dasar', 'Prinsip Perpindahan Panas & Massa'] },
      { name: 'Prinsip Pengolahan Mineral', subtopics: ['Kominusi (Crushing & Grinding)', 'Klasifikasi Ukuran (Screening & Cycloning)', 'Konsentrasi Fisik (Gravity, Magnetic Separation)', 'Dasar Flotasi Mineral'] },
      { name: 'Ekstraksi Metalurgi Dasar', subtopics: ['Konsep Dasar Peleburan (Smelting/Pirometalurgi)', 'Proses Pelindian (Leaching/Hidrometalurgi)', 'Dasar Elektrometalurgi (Electrowinning/Refining)', 'Penanganan Terak (Slag)'] },
      { name: 'Unit Operasi & Pemodelan Proses', subtopics: ['Pompa, Kompresor & Aliran Fluida', 'Diagram Alir Proses (PFD & P&ID)', 'Dasar Instrumentasi Pabrik Pengolahan', 'Pemisahan Padat-Cair (Thickening & Filtration)'] },
      { name: 'Pengendalian Mutu & Lingkungan Pabrik', subtopics: ['Penanganan Limbah B3 (Tailing & Slag)', 'Pengendalian Emisi Gas Buang', 'Standar & Verifikasi Kualitas Produk Akhir', 'Keselamatan Fasilitas Peleburan/Bahan Kimia'] },
    ],
  },
  ENG: {
    code: 'ENG',
    name: 'Project & Engineering',
    slug: 'antam-engineering',
    jurusan: 'Teknik Mesin, Teknik Elektro, Teknik Instrumentasi, Teknik Fisika, Teknik Sipil',
    topics: [
      { name: 'Manajemen Proyek Keteknikan', subtopics: ['Siklus Hidup Proyek EPC', 'Penjadwalan & Lintasan Kritis (CPM)', 'Dasar Rencana Anggaran Biaya (RAB)', 'Manajemen Sumber Daya Proyek'] },
      { name: 'Manajemen Pemeliharaan & Keandalan', subtopics: ['Preventive & Predictive Maintenance', 'Analisis Akar Masalah (RCA)', 'Indikator Keandalan (MTBF, MTTR, Availability)', 'Total Productive Maintenance (TPM)'] },
      { name: 'Gambar Teknik & Standar Multidisiplin', subtopics: ['Membaca Blueprint Dasar', 'Pemahaman P&ID & Simbol Keteknikan (ISA)', 'Sistem Satuan & Konversi Metrik/Imperial', 'Standar Keteknikan Umum (SNI, ISO, ASME)'] },
      { name: 'Dasar Teknik Mekanikal & Penanganan Material', subtopics: ['Prinsip Kerja Pompa dan Kompresor', 'Sistem Konveyor (Material Handling)', 'Dasar Mekanika Fluida Statis & Dinamis', 'Konsep Kelelahan Material (Fatigue)'] },
      { name: 'Dasar Kelistrikan & Instrumentasi Industri', subtopics: ['Sistem Transmisi & Distribusi Listrik', 'Prinsip Kerja Motor Listrik & Generator', 'Dasar Sensor & Aktuator Industri', 'Pengenalan Sistem Otomasi (PLC & SCADA)'] },
      { name: 'Dasar Infrastruktur & Teknik Sipil', subtopics: ['Mekanika Bahan & Kekuatan Material', 'Struktur Bangunan Industri', 'Drainase Tambang & Manajemen Air Permukaan', 'Pengetahuan Geoteknik Dasar'] },
      { name: 'Keselamatan Konstruksi & Operasional Engineering', subtopics: ['HIRADC', 'Sistem Isolasi Energi (LOTO)', 'Izin Kerja Risiko Tinggi (Permit to Work)', 'Keselamatan Listrik & Pengangkatan Berat'] },
    ],
  },
  HSE: {
    code: 'HSE',
    name: 'Health, Safety, & Environment',
    slug: 'antam-hse',
    jurusan: 'K3, Teknik Pertambangan, Kesehatan Masyarakat, Teknik Lingkungan, Kehutanan, Manajemen Keberlanjutan',
    topics: [
      { name: 'Sistem Manajemen HSE & Regulasi Dasar', subtopics: ['Pemahaman Dasar ISO 45001 & ISO 14001', 'Dasar SMK3', 'Regulasi K3 & Lingkungan Nasional', 'Inspeksi & Audit Keselamatan Kerja'] },
      { name: 'Identifikasi Bahaya & Penilaian Risiko', subtopics: ['HIRADC', 'Job Safety Analysis (JSA)', 'Hirarki Pengendalian Risiko', 'Izin Kerja (Permit to Work)'] },
      { name: 'Dasar Pengelolaan Lingkungan & Limbah', subtopics: ['Pengelolaan Limbah B3', 'Konsep Dasar AMDAL & UKL-UPL', 'Dasar Pengendalian Pencemaran Air & Udara', 'Pemantauan Kualitas Lingkungan'] },
      { name: 'Investigasi Insiden & Tanggap Darurat', subtopics: ['Root Cause Analysis (RCA) Dasar', 'Pelaporan Insiden & Near Miss', 'Konsep Tanggap Darurat (Emergency Response)', 'Basic First Aid & Rescue'] },
      { name: 'Higiene Industri & Kesehatan Kerja', subtopics: ['Penyakit Akibat Kerja (PAK)', 'Pengukuran Lingkungan Kerja (Kebisingan, Debu)', 'APD & Ergonomi Dasar', 'Fit to Work & Pemantauan Kesehatan'] },
      { name: 'Prinsip ESG & Sustainability', subtopics: ['Konsep Dasar ESG', 'Rehabilitasi & Reklamasi Lahan', 'Manajemen Emisi & Jejak Karbon', 'Community Development (CSR)'] },
    ],
  },
  QC: {
    code: 'QC',
    name: 'Quality Control',
    slug: 'antam-qc',
    jurusan: 'Teknik Geologi, Teknik Pertambangan, Teknik Kimia, Kimia',
    topics: [
      { name: 'Prinsip Dasar Pengendalian Mutu (QA/QC)', subtopics: ['Perbedaan Quality Assurance & Quality Control', 'Sistem Dokumentasi Mutu', 'Parameter Kualitas Produk Mineral', 'Ketidaksesuaian (Non-Conformance) & Tindakan Korektif'] },
      { name: 'Teknik Sampling & Preparasi Sampel', subtopics: ['Metodologi Pengambilan Sampel', 'Prinsip Representasi Sampel Mineral', 'Preparasi Fisik (Crushing, Splitting, Pulverizing)', 'Penanganan Kontaminasi Sampel'] },
      { name: 'Dasar Kimia Analitik & Instrumen Pengujian', subtopics: ['Prinsip Titrasi & Gravimetri', 'Pengenalan Spektrometri (XRF, AAS, ICP)', 'Pengujian Sifat Fisik & Kadar Air', 'Pemeliharaan Instrumen Laboratorium'] },
      { name: 'Analisis Statistik untuk Mutu', subtopics: ['Akurasi vs Presisi dalam Pengujian', 'Control Chart (Peta Kendali)', 'Mean, Range, & Standar Deviasi', 'Evaluasi Data Hasil Lab (Outlier Detection)'] },
      { name: 'Sistem Manajemen Mutu Laboratorium', subtopics: ['Pengenalan ISO 9001', 'Konsep ISO/IEC 17025', 'Kalibrasi Alat Ukur Dasar', 'Keselamatan Laboratorium (MSDS & Chemical Handling)'] },
    ],
  },
  MKT: {
    code: 'MKT',
    name: 'Marketing',
    slug: 'antam-marketing',
    jurusan: 'Manajemen Pemasaran, Manajemen Bisnis, Manajemen Keuangan, Ilmu Ekonomi',
    topics: [
      { name: 'Prinsip Pemasaran B2B', subtopics: ['Karakteristik Pasar B2B vs B2C', 'Segmentasi & Targeting Industri', 'Key Account Management', 'Strategi Pricing Komoditas'] },
      { name: 'Ekonomi Makro & Perdagangan Internasional', subtopics: ['Siklus Ekonomi & Dampak Kebijakan Moneter', 'Pengaruh Kurs Mata Uang', 'Kebijakan Tarif & Perdagangan Bebas', 'Dinamika Harga Komoditas Global'] },
      { name: 'Riset Pasar & Intelijen Bisnis', subtopics: ['Analisis Supply & Demand Global', 'Riset Kompetitor & Pemetaan Pasar', 'Perilaku Konsumen Industri', 'Dasar Pemodelan Peramalan (Forecasting)'] },
      { name: 'Manajemen Hubungan Pelanggan (CRM)', subtopics: ['Strategi Retensi Klien Korporat', 'Teknik Negosiasi & Manajemen Kontrak', 'Manajemen Ekspektasi Pelanggan', 'Resolusi Konflik & Penanganan Komplain'] },
      { name: 'Dasar Manajemen Logistik & Pengiriman', subtopics: ['Pengenalan Incoterms (FOB, CIF, CFR)', 'Dokumentasi Ekspor-Impor', 'Koordinasi Supply Chain Terintegrasi', 'Moda Transportasi Kargo'] },
    ],
  },
  BDV: {
    code: 'BDV',
    name: 'Business Development',
    slug: 'antam-bizdev',
    jurusan: 'Teknik Pertambangan, Teknik Metalurgi, Teknik Industri, Manajemen Keuangan, Manajemen Bisnis, Ilmu Ekonomi, Statistika, Sains Data',
    topics: [
      { name: 'Rantai Nilai Industri Tambang', subtopics: ['Siklus Proyek Tambang', 'Pemahaman Dasar Ekstraksi Komoditas', 'Struktur Biaya Tambang (CAPEX & OPEX)', 'Dinamika Industri Hilirisasi (Smelter)'] },
      { name: 'Evaluasi Kelayakan & Pemodelan Finansial', subtopics: ['Nilai Waktu Uang (Time Value of Money)', 'Indikator Investasi (NPV, IRR, Payback Period, ROI)', 'Proyeksi Arus Kas', 'Analisis Sensitivitas & Skenario'] },
      { name: 'Strategi Bisnis & Analisis Kinerja', subtopics: ['Kerangka Analisis (SWOT, PESTEL, Porter\'s 5 Forces)', 'Identifikasi Peluang Ekspansi Pasar', 'Perumusan KPI', 'Keunggulan Kompetitif'] },
      { name: 'Kemitraan Strategis & Joint Venture', subtopics: ['Bentuk-bentuk Aliansi Bisnis', 'Proses Uji Tuntas (Due Diligence)', 'Struktur Pembagian Risiko & Keuntungan', 'Pengenalan Mergers & Acquisitions'] },
      { name: 'Analisis Data untuk Keputusan Bisnis', subtopics: ['Interpretasi Tren & Pola Data Historis', 'Pemodelan Prediktif', 'Probabilitas Keberhasilan Proyek', 'Visualisasi Data untuk Presentasi Bisnis'] },
      { name: 'Manajemen Risiko Bisnis & Investasi', subtopics: ['Identifikasi Risiko Pasar & Finansial', 'Risiko Geopolitik & Perubahan Regulasi', 'Pembuatan Matriks Mitigasi Risiko', 'Rencana Kontinuitas Bisnis (BCP)'] },
    ],
  },
  SCM: {
    code: 'SCM',
    name: 'Supply Chain Management',
    slug: 'antam-scm',
    jurusan: 'Manajemen Logistik, Teknik Industri, Teknik Mesin, Teknik Elektro, Ilmu Administrasi Bisnis, Ilmu Ekonomi, Hukum, Teknik Perkapalan, Teknik Kelautan, Manajemen Transportasi Laut',
    topics: [
      { name: 'Proses Pengadaan Barang & Jasa', subtopics: ['Siklus Pengadaan (P2P)', 'Vendor Selection & Kualifikasi', 'Strategi Negosiasi Pengadaan', 'Pengadaan Berkelanjutan (Green Procurement)'] },
      { name: 'Manajemen Inventaris & Pergudangan', subtopics: ['Konsep Economic Order Quantity (EOQ)', 'Analisis ABC (Klasifikasi Inventaris)', 'Tata Letak Gudang (Warehouse Layout)', 'Inventory Turnover & Penanganan Dead Stock'] },
      { name: 'Dasar Hukum & Kontrak Pengadaan', subtopics: ['Anatomi Kontrak Bisnis', 'Penyelesaian Sengketa Kontrak', 'Service Level Agreement (SLA)', 'Aspek Legal Ekspor-Impor'] },
      { name: 'Manajemen Logistik & Transportasi', subtopics: ['Inbound & Outbound Logistics', 'Optimasi Rute Pengiriman', 'Manajemen Armada (Fleet Management)', 'Pengenalan Incoterms dalam Logistik'] },
      { name: 'Logistik Kelautan & Transportasi Maritim', subtopics: ['Jenis Kapal Kargo & Tongkang', 'Regulasi Pelayaran Domestik', 'Operasional Pelabuhan/Dermaga (Jetty)', 'Manajemen Kargo Curah (Bulk Cargo)'] },
    ],
  },
  HCM: {
    code: 'HCM',
    name: 'Organization & Human Capital Management',
    slug: 'antam-hcm',
    jurusan: 'Teknik Industri, Sains Data, Perpajakan, Akuntansi, Hukum, Manajemen SDM, Sistem Informasi, Manajemen Informatika, Manajemen Keuangan, Statistika, Psikologi',
    topics: [
      { name: 'Desain Organisasi & Perencanaan SDM', subtopics: ['Analisis Beban Kerja (Workload Analysis)', 'Pemetaan Struktur Organisasi', 'Workforce Planning', 'Evaluasi Jabatan (Job Evaluation)'] },
      { name: 'Rekrutmen, Seleksi & Manajemen Talenta', subtopics: ['Konsep Employer Branding', 'Metode Seleksi (Wawancara Berbasis Kompetensi)', 'Talent Mapping (9-Box Grid)', 'Succession Planning'] },
      { name: 'Manajemen Kinerja & Sistem Kompensasi', subtopics: ['Perumusan KPI', 'Siklus Penilaian Kinerja (Performance Appraisal)', 'Struktur & Skala Upah', 'Konsep Total Rewards & Insentif'] },
      { name: 'Pelatihan & Pengembangan Organisasi', subtopics: ['Training Need Analysis (TNA)', 'Metode Pembelajaran (70-20-10 Rule)', 'Manajemen Perubahan (Change Management)', 'Budaya Organisasi (Corporate Culture)'] },
      { name: 'Hubungan Industrial & Hukum Ketenagakerjaan', subtopics: ['UU Ketenagakerjaan Dasar', 'Perjanjian Kerja Bersama (PKB)', 'Penyelesaian Perselisihan Hubungan Industrial', 'Pengenalan PPh 21'] },
      { name: 'Analitik SDM & Sistem Informasi', subtopics: ['Dasar Metrik SDM (Turnover, Absensi)', 'Pengenalan HRIS', 'Visualisasi Data Karyawan', 'Pengambilan Keputusan SDM Berbasis Data'] },
    ],
  },
  LGL: {
    code: 'LGL',
    name: 'Legal & Compliance',
    slug: 'antam-legal',
    jurusan: 'Hukum, Kebijakan Publik, Ilmu Administrasi Bisnis',
    topics: [
      { name: 'Hukum Perusahaan & Bisnis Dasar', subtopics: ['Pengenalan UU Perseroan Terbatas', 'Organ Perusahaan (Direksi, Komisaris, RUPS)', 'Anatomi Kontrak Komersial & Wanprestasi', 'Perlindungan HKI'] },
      { name: 'Regulasi Pertambangan & Lingkungan', subtopics: ['Konsep Dasar UU Minerba', 'Jenis Izin Usaha Pertambangan (IUP)', 'Dasar Hukum AMDAL & Izin Lingkungan', 'Tanggung Jawab Pascatambang'] },
      { name: 'Tata Kelola Perusahaan (GCG)', subtopics: ['Prinsip TARIF', 'Keterbukaan Informasi Publik', 'Etika Bisnis & Code of Conduct', 'Penanganan Conflict of Interest'] },
      { name: 'Kepatuhan & Anti-Korupsi', subtopics: ['Pengenalan UU Pemberantasan Tipikor', 'Definisi Gratifikasi, Suap, & Pemerasan', 'Sistem Manajemen Anti Penyuapan (ISO 37001)', 'Whistleblowing System'] },
      { name: 'Manajemen Risiko Hukum & Kebijakan Publik', subtopics: ['Identifikasi Risiko Hukum Korporasi', 'Dasar Penyelesaian Sengketa (Litigasi vs Arbitrase)', 'Analisis Dampak Kebijakan Publik', 'Hukum Administrasi Negara (KTUN)'] },
    ],
  },
  FIN: {
    code: 'FIN',
    name: 'Finance & Accounting',
    slug: 'antam-finance',
    jurusan: 'Akuntansi, Perpajakan, Manajemen Keuangan',
    topics: [
      { name: 'Prinsip Akuntansi Keuangan Dasar', subtopics: ['Pengenalan Standar Akuntansi (PSAK/IFRS)', 'Persamaan Dasar Akuntansi & Siklus Akuntansi', 'Komponen Laporan Keuangan (Neraca, Laba/Rugi, Arus Kas)', 'Analisis Rasio Keuangan'] },
      { name: 'Akuntansi Biaya & Akuntansi Manajemen', subtopics: ['Konsep Biaya Produksi', 'Perhitungan Harga Pokok Produksi (COGS)', 'Analisis Break-Even Point (BEP)', 'Dasar Penyusunan Anggaran (Budgeting & Variance Analysis)'] },
      { name: 'Manajemen Keuangan Korporat', subtopics: ['Nilai Waktu Uang (Time Value of Money)', 'Penganggaran Modal (NPV, IRR, Payback Period)', 'Konsep Biaya Modal (WACC)', 'Manajemen Modal Kerja'] },
      { name: 'Dasar Perpajakan Indonesia', subtopics: ['Konsep Dasar KUP', 'Pajak Penghasilan (PPh Badan, PPh 21/23/26)', 'Pajak Pertambahan Nilai (PPN)', 'Pengenalan Pajak Daerah & Retribusi'] },
      { name: 'Pengendalian Internal & Dasar Audit', subtopics: ['Konsep Dasar COSO Framework', 'Pemisahan Tugas (Segregation of Duties)', 'Bukti Audit & Kertas Kerja', 'Pencegahan Kecurangan (Fraud Triangle)'] },
    ],
  },
  CRL: {
    code: 'CRL',
    name: 'Corporate Relation',
    slug: 'antam-corprel',
    jurusan: 'Teknik Industri, Manajemen, Hukum, Komunikasi',
    topics: [
      { name: 'Komunikasi Korporasi & Hubungan Media', subtopics: ['Strategi Media Relations', 'Penyusunan Siaran Pers', 'Corporate Branding & Identity', 'Monitoring Berita & Sentimen Media'] },
      { name: 'Manajemen Pemangku Kepentingan', subtopics: ['Stakeholder Mapping', 'Government Relations', 'Community Engagement', 'Strategi Komunikasi Eksternal'] },
      { name: 'Manajemen Krisis & Reputasi', subtopics: ['Issue Management', 'Crisis Communication Plan', 'Pemulihan Reputasi Pasca-Krisis', 'Juru Bicara Perusahaan'] },
      { name: 'Keterbukaan Informasi & Hukum Komunikasi', subtopics: ['UU Keterbukaan Informasi Publik', 'Dasar Hukum Media & UU ITE', 'Etika Public Relations', 'Laporan Tahunan & Sustainability Report'] },
      { name: 'Pemahaman Bisnis & Tata Kelola Perusahaan', subtopics: ['Komunikasi Internal Perusahaan', 'Pengenalan ESG dalam Komunikasi', 'Dukungan Komunikasi untuk Inisiatif Strategis', 'Tata Kelola Informasi Antar Departemen'] },
    ],
  },
  IT: {
    code: 'IT',
    name: 'Information Technology',
    slug: 'antam-it',
    jurusan: 'Teknik Informatika, Sistem Informasi, Ilmu Komputer',
    topics: [
      { name: 'Rekayasa Perangkat Lunak', subtopics: ['Siklus Hidup Pengembangan Sistem (SDLC)', 'Metodologi Agile & Scrum', 'Analisis & Desain Kebutuhan Sistem', 'Pengujian Perangkat Lunak (Software Testing)'] },
      { name: 'Manajemen Basis Data & Arsitektur Data', subtopics: ['RDBMS', 'Fundamental SQL', 'Konsep Data Warehouse & Data Lake', 'Keamanan & Integritas Basis Data'] },
      { name: 'Infrastruktur IT & Jaringan Komputer', subtopics: ['Topologi & Protokol Jaringan (TCP/IP, DNS, DHCP)', 'Konsep Cloud Computing (IaaS, PaaS, SaaS)', 'Manajemen Server Dasar', 'Virtualisasi'] },
      { name: 'Keamanan Siber (Cybersecurity)', subtopics: ['Konsep CIA Triad', 'Identifikasi Ancaman (Malware, Phishing, Ransomware)', 'Network Security (Firewall, VPN)', 'Kriptografi Dasar & Manajemen Akses'] },
      { name: 'Manajemen Layanan IT', subtopics: ['Pengenalan ITIL Framework', 'Sistem Penanganan Insiden (Helpdesk/Ticketing)', 'Disaster Recovery Plan (DRP)', 'Business Continuity Plan (BCP) di bidang IT'] },
    ],
  },
}

export const ANTAM_STREAM_LIST = Object.values(ANTAM_STREAMS)

export function getStreamBySlug(slug: string): AntamStream | undefined {
  return ANTAM_STREAM_LIST.find(s => s.slug === slug)
}

export function getStreamByCode(code: string): AntamStream | undefined {
  return ANTAM_STREAMS[code]
}
