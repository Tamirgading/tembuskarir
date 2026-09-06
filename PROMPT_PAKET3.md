# PROMPT — Buat Paket 3 Soal ANTAM IMPACT (TembusKarir)

Salin seluruh isi file ini ke chat baru sebagai instruksi awal. Kamu akan membuat **Paket 3** soal ujian ANTAM IMPACT untuk 14 stream, di proyek `D:\Soal\ClaudeProject-web` (Next.js + Supabase).

---

## A. Konteks & Deliverable

- Buat **40 soal MCQ per stream × 14 stream = 560 soal**.
- Kategori Supabase: **ANTAM**.
- Paket baru per stream: slug `antam-<stream>-paket-3` (contoh `antam-exploration-paket-3`), nama `ANTAM IMPACT — <Nama Stream> - Paket 3`.
- Field paket: `duration_minutes=50`, `total_questions=40`, `is_free=false`, `is_published=false` (DRAFT dulu).
- Field soal: `order_index` 1–40, `category` = kode topik (`T1`..`Tn` sesuai urutan kisi-kisi), `difficulty` ('easy'/'medium'), `correct_answer`, `explanation`, `options` (jsonb `[{key,text},...]`).
- Skor: **+1 benar, 0 salah/kosong** (skor maksimal 40, muncul di portal ANTAM).

## B. Aturan Kualitas Soal (WAJIB, dari pemilik proyek)

1. **Panjang opsi merata.** Jawaban benar TIDAK BOLEH selalu jadi opsi terpanjang. Parafrase pengecoh agar panjangnya mengimbangi. Jangan menambah penjelasan dalam tanda kurung hanya pada opsi benar.
2. **Distribusi jawaban merata A–E.** Target per batch 20 soal: A=4, B=4, C=4, D=4, E=4. Buat **pre-planned distribution** (tentukan kunci tiap nomor) SEBELUM menulis soal.
3. **Pembahasan hitungan rapi (LaTeX).** Gunakan `\begin{aligned}` di dalam **satu blok `$$`** agar langkah rapat. JANGAN pakai beberapa blok `$$` terpisah.
4. **LaTeX konsisten.** Simbol ($\sigma$, $\rho$, $\geq$), rumus kimia ($\text{Fe}_3\text{O}_4$), persamaan, istilah teknis, angka penting dirender dengan `$...$` inline dan `$$...$$` block.
5. **Format pembahasan bervariasi.** Kombinasi paragraf, tabel markdown, list (`1.` atau `-`), bold (`**...**`), italic (`*...*`), LaTeX. Bukan paragraf panjang saja.
6. **Jangan pakai em dash "—"** (strip panjang). Ganti koma/titik/tanda hubung biasa.
7. **Difficulty tidak terlalu sulit.** 40 soal / 50 menit = 1,25 mnt/soal. Soal hitungan angka bulat, langkah pendek. Komposisi ± **35% easy / 65% medium** (tanpa hard) = ±14 easy, 26 medium per stream.
8. **Sebagian soal wajib hitungan.** 4–14 soal hitungan per stream, relevan dengan topik (angka bulat, rumus sederhana).
9. **Bahasa Indonesia; istilah teknis boleh Inggris** dalam format italic.
10. **5 opsi per soal (A–E).** Wajib.

## C. Kisi-kisi Topik per Stream

Bagi 40 soal rata ke SEMUA topik stream (jika stream punya 5–8 topik, bagi rata; contoh 6 topik ≈ 6–7 soal/topik, 8 topik = 5 soal/topik).

1. **Exploration (6 topik):** T1 Geological Mapping & Surveying (surface mapping, structural geology, topographic, core logging) · T2 Geophysics (magnetic, gravity, EM, seismic) · T3 Geochemistry (soil/stream sampling, rock chip, assaying, anomaly) · T4 Remote Sensing & GIS (satellite, aerial, LiDAR, GIS) · T5 Resource Modeling & Estimation (geostatistics, 3D model, block model, JORC/NI43-101) · T6 Exploration Drilling (diamond core, RC, RAB, hole planning/survey).

2. **Mining (8 topik):** T1 Mine Planning & Design · T2 Drill & Blast · T3 Load & Haul · T4 Geotechnical Engineering · T5 Mine Ventilation (underground) · T6 Water Management · T7 Fleet Management & Dispatch · T8 Mine Closure & Reclamation.

3. **Processing (5 topik):** T1 Termodinamika & Kinetika Reaksi · T2 Prinsip Pengolahan Mineral (kominusi, klasifikasi, konsentrasi, flotasi) · T3 Ekstraksi Metalurgi (smelting, leaching, electrowinning, slag) · T4 Unit Operasi & Pemodelan Proses (pompa, PFD/P&ID, instrumentasi, thickening/filtration) · T5 Pengendalian Mutu & Lingkungan Pabrik.

4. **Project & Engineering (7 topik):** T1 Manajemen Proyek (EPC, CPM, RAB) · T2 Pemeliharaan & Keandalan (preventive/predictive, MTBF/MTTR, RCA, TPM) · T3 Gambar Teknik & Standar (blueprint, P&ID/ISA, satuan, ISO/ASME) · T4 Mekanikal & Material Handling (pompa, konveyor, fluida, fatigue) · T5 Kelistrikan & Instrumentasi (distribusi, motor, sensor, PLC/SCADA) · T6 Infrastruktur & Sipil (mekanika bahan, struktur, drainase, geoteknik) · T7 Keselamatan Konstruksi (HIRADC, LOTO, PTW, lifting).

5. **HSE (6 topik):** T1 Sistem Manajemen HSE & Regulasi (ISO 45001/14001, SMK3, inspeksi/audit) · T2 Identifikasi Bahaya & Risiko (HIRADC, JSA, hierarki, PTW, near miss) · T3 Pengelolaan Lingkungan & Limbah (B3, AMDAL/UKL-UPL, air, settling pond) · T4 Investigasi Insiden & Tanggap Darurat (5 Whys, RCA, emergency, first aid) · T5 Higiene Industri & Kesehatan (PAK, NAB kebisingan, APD, ergonomi, fit to work) · T6 ESG & Sustainability (ESG, reklamasi, carbon footprint, CSR).

6. **Quality Control (5 topik):** T1 Prinsip QA/QC · T2 Sampling & Preparasi · T3 Kimia Analitik & Instrumen (XRF, AAS, ICP, titrasi, gravimetri) · T4 Statistical QC (control chart, mean/range/SD, RPD/RSD, outlier) · T5 Manajemen Mutu Lab (ISO 9001, ISO/IEC 17025, kalibrasi, MSDS, HF, traceability, chain of custody, umpire, uji banding).

7. **Marketing (5 topik):** T1 Pemasaran B2B · T2 Ekonomi Makro & Perdagangan Internasional (siklus, kurs, tarif, FTA) · T3 Riset Pasar & Intelijen (supply-demand, kompetitor, forecasting, PESTEL) · T4 CRM (retensi, komplain, CLV, negosiasi, ekspektasi) · T5 Logistik & Pengiriman (Incoterms, dokumen ekspor, L/C, kapal).

8. **Business Development (6 topik):** T1 Mining Value Chain · T2 Evaluasi Kelayakan (TVM, NPV, IRR, payback, ROI, sensitivitas) · T3 Strategi Bisnis (SWOT, PESTEL, Porter, KPI, cost leadership) · T4 Joint Venture & Kemitraan (JV, due diligence, M&A, earn-in) · T5 Analisis Data (visualisasi, tren, expected value, prediktif) · T6 Manajemen Risiko (market risk, geopolitik, matriks mitigasi, BCP).

9. **Supply Chain Management (5 topik):** T1 Procurement (P2P, vendor, RFQ/RFP, green procurement, e-procurement) · T2 Inventaris & Pergudangan (EOQ, ABC, dead stock, FIFO, safety stock, WMS) · T3 Hukum & Kontrak (anatom kontrak, SLA, arbitrase/litigasi, wanprestasi, LD, indemnity, performance bond) · T4 Logistik & Transportasi (inbound/outbound, optimasi rute, fleet, backhaul, dokumen ekspor, TCO) · T5 Logistik Kelautan (bulk carrier, TML, likuefaksi, B/L, charter, draft survey, jetty, cabotage).

10. **Organization & HCM (6 topik):** T1 Desain Organisasi & Perencanaan SDM (beban kerja, workforce planning, job evaluation, span of control, struktur) · T2 Rekrutmen & Talenta (employer branding, BEI/STAR, 9-box, succession, assessment center, onboarding) · T3 Kinerja & Kompensasi (SMART, siklus kinerja, total rewards, pay equity, struktur gaji, insentif) · T4 Pelatihan & OD (TNA, 70-20-10, change management, budaya, Kirkpatrick, IDP) · T5 Hubungan Industrial (UU Ketenagakerjaan, PKB, perselisihan, PKWT/PKWTT, PPh 21, BPJS, turnover) · T6 HR Analytics (people analytics, HRIS, metrik, visualisasi, absenteeism).

11. **Legal & Compliance (5 topik):** T1 Hukum Perusahaan (UU PT, organ, wanprestasi, HKI, kontrak, komisaris, business judgment rule, force majeure) · T2 Regulasi Pertambangan (IUP/IUPK, AMDAL, pascatambang, hilirisasi, divestasi, PETI, DMO) · T3 GCG (TARIF, conflict of interest, keterbukaan, CoC, komite audit, komisaris independen, RPT, insider trading) · T4 Kepatuhan & Anti-Korupsi (UU Tipikor, suap/gratifikasi, ISO 37001, whistleblowing, fraud triangle, zero tolerance, compliance officer, AML) · T5 Risiko Hukum (litigasi/non-litigasi, arbitrase, KTUN, regulatory impact, due diligence, class action, legal risk management).

12. **Finance & Accounting (5 topik):** T1 Akuntansi Keuangan (laporan, persamaan dasar, accrual, rasio, going concern, PSAK/IFRS, arus kas) · T2 Akuntansi Biaya (HPP, biaya tetap/variabel, BEP, variance, anggaran, direct/indirect) · T3 Manajemen Keuangan (TVM, NPV, payback, WACC, IRR, modal kerja, ROE, dividen) · T4 Perpajakan (PPh Badan 22%, PPh 21, PPh 23, PPN 12%, SPT, royalti, pajak daerah) · T5 Pengendalian Internal & Audit (COSO, segregation of duties, fraud triangle, bukti audit, audit internal/eksternal, materialitas, three lines, opini WTP).

13. **Corporate Relation (5 topik):** T1 Komunikasi Korporasi & Media (media relations, press release, corporate branding, media monitoring, spokesperson, earned/owned/paid, newsroom, corporate secretary) · T2 Stakeholder (stakeholder mapping, government relations, community engagement, SLO, grievance, engagement vs PR, komunikasi eksternal) · T3 Manajemen Krisis (issue management, crisis plan, golden hour, 24 jam insiden, reputation recovery, key messages, drill, reputational risk) · T4 Keterbukaan Informasi & Hukum (UU KIP, UU ITE, etika PR, annual report, sustainability report, public expose, informasi material, PPID) · T5 Pemahaman Bisnis (komunikasi internal, ESG, change management, tata kelola informasi, corporate communication, employer branding, CSR, investor relations).

14. **Information Technology (5 topik):** T1 Software Engineering (SDLC, Agile/Scrum, black/white box, version control, API) · T2 Database (SQL, RDBMS, warehouse/lake, normalisasi, SQL/NoSQL, ACID, backup 3-2-1, replication) · T3 Infrastruktur & Jaringan (DNS, IaaS/PaaS/SaaS, virtualisasi, topologi, bandwidth/latency, VLAN, load balancer, VPN) · T4 Cybersecurity (CIA Triad, phishing, firewall, MFA, ransomware, least privilege, SIEM, symmetric/asymmetric) · T5 IT Service Management (ITIL, incident/problem, service desk, change management, SLA, DRP, BCP, CMDB).

## D. Prosedur Kerja (WAJIB diikuti persis)

Untuk TIAp stream, lakukan bertahap:

1. **Pre-plan distribution**: tentukan kunci tiap nomor sebelum menulis (A=4,B=4,C=4,D=4,E=4 per batch 20 soal).
2. **Tulis soal** dalam script seed (contoh pola di `C:\Users\Lenovo\AppData\Local\Temp\opencode\seed-<stream>.cjs`). Upsert paket via slug, hapus soal lama paket tsb, insert 40 soal (order_index 1–40).
3. **Validasi** dengan `validate-pkg.cjs <slug>` dan `key-list.cjs <slug>`:
   - 5 opsi/soal = 40/40.
   - **Opsi benar terpanjang = 0/40**.
   - Em dash = 0, blok `$$` ganda = 0.
   - Distribusi jawaban = 8-8-8-8-8.
   - Difficulty = ±14 easy / 26 medium.
   - Topik merata.
4. **Jika opsi benar terpanjang > 0**: jalankan `dump-flagged.cjs <slug>` untuk melihat **teks opsi aktual**, lalu tulis pengecoh baru yang lebih panjang BERDASARKAN teks aktual tsb (JANGAN menebak urutan/isi — itu bisa mengacaukan konten). Lengkapi pengecoh terdekat agar melebihi panjang jawaban benar. Update via `patch-<stream>-length.cjs`.
5. **Jika distribusi jawaban tidak 8-8-8-8-8**: perbaiki dengan **swap teks antar opsi dalam soal yang sama + set correct_answer** (aman, tidak mengubah isi benar), lalu naikkan difficulty beberapa soal ke easy bila perlu. Contoh pola: `fix-<stream>-dist.cjs`.
6. **Audit kebenaran fakta** setelah semua stream: baca kembali setiap soal, cek `correct_answer` benar secara fakta, `explanation` konsisten, hitungan akurat, tidak ada dua opsi benar. Kerjakan teliti.
7. **Laporan**: ringkas — daftar stream, jumlah soal, hasil validasi, dan perbaikan yang dilakukan.

Cara menjalankan script (dari folder proyek `D:\Soal\ClaudeProject-web`):
```
$env:NODE_PATH = "D:\Soal\ClaudeProject-web\node_modules"
Get-Content .env.local | ForEach-Object { if ($_ -match '^\s*([^#][^=]*?)\s*=\s*(.*)$') { Set-Item -Path ("env:" + $matches[1].Trim()) -Value $matches[2].Trim() } }
node "C:\Users\Lenovo\AppData\Local\Temp\opencode\validate-pkg.cjs" antam-exploration-paket-3
```

## E. PENTING — Jangan Sentuh Data Lain

- JANGAN ubah/hapus paket milik proses lain: `akding-*`, `bi-pln-*`, paket ANTAM paket-1, dan paket ANTAM paket-2 yang sudah published.
- Hanya buat dan update slug `antam-*-paket-3`.
- Semua paket dibuat **DRAFT** (`is_published=false`). Publish hanya setelah persetujuan user.

## F. Output Akhir

Setelah 14 stream selesai, berikan laporan ringkas:
- 14 paket `antam-*-paket-3`, masing-masing 40 soal.
- Hasil validasi per stream (opsi benar terpanjang, distribusi, difficulty).
- Daftar perbaikan kebenaran yang dilakukan.
- Minta persetujuan sebelum publish.
