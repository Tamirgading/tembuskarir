-- ============================================================
-- SEED: Paket & Soal untuk setiap institusi seleksi
-- Sumber: Firecrawl scrape dari kitalulus.com, tirto.id,
--         kumparan.com, idntimes.com, mamikos.com
-- Dibuat: 15 April 2026
-- ============================================================

-- ─── PACKAGES ────────────────────────────────────────────────

insert into public.packages (id, name, slug, category, description, duration_minutes, total_questions, is_free, is_published) values

  -- OJK
  ('a2000000-0000-0000-0000-000000000002',
   'Tes Kemampuan Umum OJK — PCAM 2025',
   'ojk-pcam-tku',
   'LAINNYA',
   'Latihan Tes Kemampuan Umum (TKU) seleksi PCAM OJK 2025. Mencakup pengetahuan tentang kelembagaan OJK, fungsi dan wewenang, regulasi sektor keuangan, serta isu ekonomi terkini.',
   60, 10, false, true),

  -- Bank Indonesia
  ('a3000000-0000-0000-0000-000000000003',
   'Tes Potensi Dasar PCPM Bank Indonesia',
   'bi-pcpm-tpd',
   'LAINNYA',
   'Latihan Tes Potensi Dasar (TPD) untuk rekrutmen PCPM Bank Indonesia. Mencakup kemampuan verbal (sinonim, analogi), logika, numerik, dan pemahaman diagram.',
   90, 10, false, true),

  -- PLN
  ('a4000000-0000-0000-0000-000000000004',
   'Tes Adaptif PLN — Numerik, Verbal, Abstrak',
   'pln-tes-adaptif',
   'LAINNYA',
   'Latihan Tes Adaptif rekrutmen PT PLN (Persero). Mencakup tiga bagian: Numerik (berhitung & logika angka), Verbal (sinonim, antonim, analogi kata), dan Abstrak (pola visual).',
   75, 10, false, true),

  -- RBB BUMN
  ('a5000000-0000-0000-0000-000000000005',
   'Tes Online Rekrutmen Bersama BUMN 2025',
   'rbb-bumn-tkd',
   'LAINNYA',
   'Latihan Tes Online Tahap 1 Rekrutmen Bersama BUMN (RBB) 2025. Mencakup TKD (verbal, numerik, analogi), nilai AKHLAK, dan Wawasan Kebangsaan sesuai kisi-kisi resmi FHCI.',
   90, 10, false, true);


-- ─── SOAL OJK PCAM ───────────────────────────────────────────

insert into public.questions
  (package_id, content, options, correct_answer, explanation, difficulty, category, order_index) values

('a2000000-0000-0000-0000-000000000002',
 'OJK mengatur dan mengawasi beberapa hal berikut, KECUALI …',
 '[{"key":"A","text":"Industri mikro"},{"key":"B","text":"Pasar Modal"},{"key":"C","text":"Dana subsidi pemerintah"},{"key":"D","text":"Dana pensiun"},{"key":"E","text":"Perasuransian"}]',
 'C',
 'OJK tidak mengatur dana subsidi pemerintah. Dana subsidi adalah ranah Kementerian Keuangan. OJK mengawasi perbankan, pasar modal, asuransi, dana pensiun, dan lembaga keuangan lainnya.',
 'easy', 'TKU', 1),

('a2000000-0000-0000-0000-000000000002',
 'Dengan terbentuknya Otoritas Jasa Keuangan, keseluruhan kegiatan di sektor jasa keuangan dapat …',
 '[{"key":"A","text":"Terselenggara secara tertutup"},{"key":"B","text":"Menciptakan produk perbankan lebih efisien"},{"key":"C","text":"Membuka lapangan usaha baru"},{"key":"D","text":"Menciptakan sistem transfer yang lebih cepat"},{"key":"E","text":"Mewujudkan sistem keuangan yang teratur, adil, transparan, dan akuntabel"}]',
 'E',
 'Sesuai UU No. 21 Tahun 2011 tentang OJK, tujuan OJK adalah agar keseluruhan kegiatan sektor jasa keuangan terselenggara secara teratur, adil, transparan, dan akuntabel.',
 'easy', 'TKU', 2),

('a2000000-0000-0000-0000-000000000002',
 'Siapa yang memimpin Otoritas Jasa Keuangan?',
 '[{"key":"A","text":"Kepala Menteri Keuangan"},{"key":"B","text":"DPR"},{"key":"C","text":"Dewan Komisioner"},{"key":"D","text":"MPR"},{"key":"E","text":"Presiden"}]',
 'C',
 'OJK dipimpin oleh Dewan Komisioner yang bersifat kolektif dan kolegial. Dewan Komisioner terdiri dari 9 anggota yang dipilih oleh DPR atas usul Presiden.',
 'easy', 'TKU', 3),

('a2000000-0000-0000-0000-000000000002',
 'Dewan Komisioner OJK yang bersifat kolektif dan kolegial dipilih oleh …',
 '[{"key":"A","text":"Presiden"},{"key":"B","text":"DPR atas usul Presiden"},{"key":"C","text":"MPR"},{"key":"D","text":"Kepala Menteri Keuangan"},{"key":"E","text":"Bank Indonesia"}]',
 'B',
 'Berdasarkan UU OJK, anggota Dewan Komisioner dipilih oleh DPR atas usul Presiden setelah melalui seleksi ketat.',
 'medium', 'TKU', 4),

('a2000000-0000-0000-0000-000000000002',
 'OJK mengatur dan mengawasi laporan kinerja bank, standar akuntansi bank, dan sistem informasi debitur. Dalam hal ini OJK mengatur aspek …',
 '[{"key":"A","text":"Prinsip kehati-hatian"},{"key":"B","text":"Kelembagaan bank"},{"key":"C","text":"Struktur permodalan"},{"key":"D","text":"Kesehatan bank"},{"key":"E","text":"Validasi bank"}]',
 'D',
 'Pengawasan laporan keuangan, standar akuntansi, dan sistem informasi debitur masuk dalam aspek kesehatan bank yang menjadi kewenangan OJK.',
 'medium', 'TKU', 5),

('a2000000-0000-0000-0000-000000000002',
 'Undang-undang yang menjadi dasar pembentukan OJK adalah …',
 '[{"key":"A","text":"UU No. 10 Tahun 1998"},{"key":"B","text":"UU No. 21 Tahun 2011"},{"key":"C","text":"UU No. 23 Tahun 1999"},{"key":"D","text":"UU No. 4 Tahun 2023"},{"key":"E","text":"UU No. 8 Tahun 1995"}]',
 'B',
 'OJK dibentuk berdasarkan UU No. 21 Tahun 2011 tentang Otoritas Jasa Keuangan. UU No. 4 Tahun 2023 adalah UU P2SK yang memperkuat OJK.',
 'medium', 'TKU', 6),

('a2000000-0000-0000-0000-000000000002',
 'Salah satu tujuan OJK adalah melindungi kepentingan konsumen dan masyarakat. Perlindungan ini mencakup …',
 '[{"key":"A","text":"Memberikan subsidi langsung kepada nasabah"},{"key":"B","text":"Edukasi dan sosialisasi keuangan kepada masyarakat"},{"key":"C","text":"Menetapkan suku bunga bank"},{"key":"D","text":"Mencetak uang rupiah"},{"key":"E","text":"Mengelola utang negara"}]',
 'B',
 'OJK melindungi konsumen melalui edukasi keuangan, sosialisasi, dan penanganan pengaduan. Penetapan suku bunga acuan adalah wewenang Bank Indonesia.',
 'easy', 'TKU', 7),

('a2000000-0000-0000-0000-000000000002',
 'Lembaga berikut yang BUKAN berada di bawah pengawasan OJK adalah …',
 '[{"key":"A","text":"Bank Umum"},{"key":"B","text":"Perusahaan Asuransi"},{"key":"C","text":"Reksa Dana"},{"key":"D","text":"Bank Indonesia"},{"key":"E","text":"Dana Pensiun"}]',
 'D',
 'Bank Indonesia (BI) adalah bank sentral yang independen, bukan lembaga keuangan yang diawasi OJK. BI justru berkoordinasi dengan OJK dalam menjaga stabilitas sistem keuangan.',
 'easy', 'TKU', 8),

('a2000000-0000-0000-0000-000000000002',
 'Program PCAM OJK adalah singkatan dari …',
 '[{"key":"A","text":"Program Calon Asisten Manajer"},{"key":"B","text":"Pendidikan Calon Analis Muda"},{"key":"C","text":"Program Calon Auditor Muda"},{"key":"D","text":"Pendidikan Calon Asisten Manajer"},{"key":"E","text":"Program Calon Anggota Manajemen"}]',
 'D',
 'PCAM adalah Pendidikan Calon Asisten Manajer, yaitu jalur rekrutmen resmi OJK untuk lulusan S1/S2 yang ingin berkarier di OJK.',
 'easy', 'TKU', 9),

('a2000000-0000-0000-0000-000000000002',
 'Sektor keuangan yang diatur oleh OJK berdasarkan UU P2SK 2023 mencakup …',
 '[{"key":"A","text":"Hanya perbankan konvensional"},{"key":"B","text":"Perbankan, pasar modal, dan asuransi saja"},{"key":"C","text":"Seluruh lembaga jasa keuangan termasuk aset kripto dan fintech"},{"key":"D","text":"Hanya lembaga keuangan bukan bank"},{"key":"E","text":"Hanya perusahaan milik negara di sektor keuangan"}]',
 'C',
 'Berdasarkan UU No. 4 Tahun 2023 (P2SK), cakupan OJK diperluas mencakup inovasi teknologi sektor keuangan, aset keuangan digital (termasuk kripto), dan seluruh LJK.',
 'hard', 'TKU', 10);


-- ─── SOAL BI PCPM ────────────────────────────────────────────

insert into public.questions
  (package_id, content, options, correct_answer, explanation, difficulty, category, order_index) values

('a3000000-0000-0000-0000-000000000003',
 'Kata yang memiliki makna paling dekat dengan: TEGAS / KERAS / TANGGUH adalah …',
 '[{"key":"A","text":"Kuat"},{"key":"B","text":"Lemah"},{"key":"C","text":"Lembut"},{"key":"D","text":"Cerdas"},{"key":"E","text":"Bijaksana"}]',
 'A',
 'Tegas, keras, dan tangguh semuanya berkonotasi keteguhan dan kekuatan. Kata yang paling mendekati makna ketiganya adalah KUAT.',
 'easy', 'Verbal', 1),

('a3000000-0000-0000-0000-000000000003',
 'Kata yang memiliki makna paling dekat dengan: BAHAGIA / SENANG / GEMBIRA adalah …',
 '[{"key":"A","text":"Sedih"},{"key":"B","text":"Marah"},{"key":"C","text":"Riang"},{"key":"D","text":"Galau"},{"key":"E","text":"Lesu"}]',
 'C',
 'Bahagia, senang, dan gembira adalah ekspresi emosi positif. Kata yang paling mendekati ketiga makna itu adalah RIANG.',
 'easy', 'Verbal', 2),

('a3000000-0000-0000-0000-000000000003',
 'Karnivora : Singa = … : …',
 '[{"key":"A","text":"Reptilia : Buaya"},{"key":"B","text":"Manusia : Omnivora"},{"key":"C","text":"Herbivora : Sapi"},{"key":"D","text":"Omnivora : Harimau"},{"key":"E","text":"Herbivora : Omnivora"}]',
 'C',
 'Karnivora adalah kategori, Singa adalah contoh hewannya. Analogi yang tepat: Herbivora (kategori) → Sapi (contoh hewan herbivora).',
 'medium', 'Verbal', 3),

('a3000000-0000-0000-0000-000000000003',
 'Bank Indonesia didirikan pada tanggal …',
 '[{"key":"A","text":"1 Juli 1946"},{"key":"B","text":"17 Agustus 1945"},{"key":"C","text":"5 Juli 1946"},{"key":"D","text":"1 Januari 1953"},{"key":"E","text":"17 Juli 1953"}]',
 'A',
 'Bank Indonesia didirikan pada 1 Juli 1946 berdasarkan Peraturan Pemerintah Pengganti Undang-undang No. 2 Tahun 1946.',
 'medium', 'Pengetahuan Umum', 4),

('a3000000-0000-0000-0000-000000000003',
 'Tugas utama Bank Indonesia sebagai bank sentral adalah …',
 '[{"key":"A","text":"Memberikan pinjaman kepada masyarakat"},{"key":"B","text":"Mencapai dan memelihara kestabilan nilai Rupiah"},{"key":"C","text":"Mengawasi seluruh lembaga keuangan Indonesia"},{"key":"D","text":"Menetapkan kebijakan fiskal pemerintah"},{"key":"E","text":"Mengelola investasi negara"}]',
 'B',
 'Berdasarkan UU No. 23 Tahun 1999 jo UU No. 3 Tahun 2004, tugas utama BI adalah mencapai dan memelihara kestabilan nilai Rupiah melalui kebijakan moneter.',
 'easy', 'Kebanksentralan', 5),

('a3000000-0000-0000-0000-000000000003',
 'Instrumen kebijakan moneter yang digunakan Bank Indonesia untuk mengatur likuiditas perbankan adalah …',
 '[{"key":"A","text":"Pajak penghasilan"},{"key":"B","text":"Operasi Pasar Terbuka (OPT)"},{"key":"C","text":"Subsidi APBN"},{"key":"D","text":"Obligasi pemerintah"},{"key":"E","text":"Dividen BUMN"}]',
 'B',
 'Operasi Pasar Terbuka (OPT) adalah instrumen utama kebijakan moneter BI untuk mengatur likuiditas rupiah di pasar uang melalui pembelian/penjualan SBI dan SBIS.',
 'hard', 'Kebanksentralan', 6),

('a3000000-0000-0000-0000-000000000003',
 'Deret angka: 3, 7, 15, 31, 63, … Angka berikutnya adalah …',
 '[{"key":"A","text":"95"},{"key":"B","text":"117"},{"key":"C","text":"127"},{"key":"D","text":"131"},{"key":"E","text":"125"}]',
 'C',
 'Pola: setiap angka = angka sebelumnya × 2 + 1. 3→7→15→31→63→127. (63 × 2 + 1 = 127)',
 'medium', 'Numerik', 7),

('a3000000-0000-0000-0000-000000000003',
 'Jika inflasi naik, maka Bank Indonesia cenderung … suku bunga acuan (BI Rate).',
 '[{"key":"A","text":"Menurunkan"},{"key":"B","text":"Membekukan"},{"key":"C","text":"Menaikkan"},{"key":"D","text":"Menghapus"},{"key":"E","text":"Tidak mengubah"}]',
 'C',
 'Ketika inflasi naik, BI menaikkan suku bunga acuan untuk menekan permintaan dan mengurangi peredaran uang, sehingga inflasi terkendali.',
 'medium', 'Kebanksentralan', 8),

('a3000000-0000-0000-0000-000000000003',
 'KATA : Anagram = MATA : …',
 '[{"key":"A","text":"Tama"},{"key":"B","text":"Atma"},{"key":"C","text":"Tema"},{"key":"D","text":"Maat"},{"key":"E","text":"Tama"}]',
 'B',
 'MATA diacak hurufnya menjadi ATMA (sama seperti KATA → anagram → TAKA atau susunan huruf berbeda). ATMA adalah anagram dari MATA.',
 'hard', 'Verbal', 9),

('a3000000-0000-0000-0000-000000000003',
 'Sistem pembayaran yang menjadi tanggung jawab Bank Indonesia mencakup …',
 '[{"key":"A","text":"Hanya pembayaran tunai dengan uang kertas"},{"key":"B","text":"Pembayaran tunai (pengelolaan Rupiah) dan non-tunai (RTGS, SKNBI, BI-FAST)"},{"key":"C","text":"Hanya sistem SWIFT untuk transfer internasional"},{"key":"D","text":"Pengelolaan utang luar negeri"},{"key":"E","text":"Pembayaran pajak dan retribusi daerah"}]',
 'B',
 'BI bertanggung jawab atas sistem pembayaran nasional meliputi: tunai (emisi uang Rupiah) dan non-tunai (RTGS, SKNBI, BI-FAST untuk transfer antar bank).',
 'hard', 'Kebanksentralan', 10);


-- ─── SOAL PLN ─────────────────────────────────────────────────

insert into public.questions
  (package_id, content, options, correct_answer, explanation, difficulty, category, order_index) values

('a4000000-0000-0000-0000-000000000004',
 'Jika A=1, B=2, C=3, … Z=26, maka kata "PLN" memiliki nilai …',
 '[{"key":"A","text":"42"},{"key":"B","text":"43"},{"key":"C","text":"44"},{"key":"D","text":"45"},{"key":"E","text":"46"}]',
 'A',
 'P=16, L=12, N=14. Total = 16+12+14 = 42.',
 'easy', 'Numerik', 1),

('a4000000-0000-0000-0000-000000000004',
 'Harga 5 lampu adalah Rp75.000. Berapa harga 8 lampu?',
 '[{"key":"A","text":"Rp100.000"},{"key":"B","text":"Rp120.000"},{"key":"C","text":"Rp150.000"},{"key":"D","text":"Rp160.000"},{"key":"E","text":"Rp180.000"}]',
 'B',
 'Harga 1 lampu = Rp75.000 ÷ 5 = Rp15.000. Harga 8 lampu = 8 × Rp15.000 = Rp120.000.',
 'easy', 'Numerik', 2),

('a4000000-0000-0000-0000-000000000004',
 '3 teknisi dapat memperbaiki 9 tiang dalam 6 jam. Berapa banyak tiang yang bisa diperbaiki oleh 6 teknisi dalam 6 jam?',
 '[{"key":"A","text":"12"},{"key":"B","text":"15"},{"key":"C","text":"18"},{"key":"D","text":"20"},{"key":"E","text":"24"}]',
 'C',
 'Jumlah pekerja berbanding lurus dengan hasil. 6 teknisi = 2 × 3 teknisi, maka hasilnya = 2 × 9 = 18 tiang.',
 'medium', 'Numerik', 3),

('a4000000-0000-0000-0000-000000000004',
 'Sebuah proyek membutuhkan total 120 jam kerja. Setiap orang bekerja 8 jam per hari. Minimal berapa orang yang dibutuhkan agar proyek selesai dalam 3 hari?',
 '[{"key":"A","text":"3"},{"key":"B","text":"4"},{"key":"C","text":"5"},{"key":"D","text":"6"},{"key":"E","text":"7"}]',
 'C',
 '3 hari × 8 jam/hari = 24 jam per orang. Jumlah orang = 120 ÷ 24 = 5 orang.',
 'medium', 'Numerik', 4),

('a4000000-0000-0000-0000-000000000004',
 'TERAMPIL : CANGGUNG = …',
 '[{"key":"A","text":"Rajin : Tekun"},{"key":"B","text":"Cepat : Lambat"},{"key":"C","text":"Pandai : Bodoh"},{"key":"D","text":"Kuat : Lemah"},{"key":"E","text":"Maju : Mundur"}]',
 'C',
 'TERAMPIL dan CANGGUNG adalah antonim (lawan kata). Pasangan antonim yang paling tepat dari pilihan adalah PANDAI dan BODOH.',
 'easy', 'Verbal', 5),

('a4000000-0000-0000-0000-000000000004',
 'TRANSMISI dalam sistem ketenagalistrikan berfungsi sebagai …',
 '[{"key":"A","text":"Pembangkit listrik dari sumber energi"},{"key":"B","text":"Penyaluran listrik tegangan tinggi dari pembangkit ke gardu induk"},{"key":"C","text":"Distribusi listrik ke rumah tangga"},{"key":"D","text":"Pengukur pemakaian listrik pelanggan"},{"key":"E","text":"Penyimpan energi listrik cadangan"}]',
 'B',
 'Transmisi adalah bagian sistem kelistrikan yang menyalurkan daya listrik tegangan ekstra tinggi/tinggi dari pembangkit menuju gardu induk (GI) sebelum didistribusikan.',
 'medium', 'Ketenagalistrikan', 6),

('a4000000-0000-0000-0000-000000000004',
 'Visi PT PLN (Persero) adalah menjadi perusahaan listrik …',
 '[{"key":"A","text":"Terbesar di Asia Tenggara"},{"key":"B","text":"Terkemuka se-Indonesia"},{"key":"C","text":"Kelas dunia yang bertumbuh, unggul, dan terpercaya bertumpu pada potensi insani"},{"key":"D","text":"Paling ramah lingkungan di ASEAN"},{"key":"E","text":"Berteknologi paling canggih di Indonesia"}]',
 'C',
 'Visi resmi PLN: "Diakui sebagai Perusahaan Kelas Dunia yang Bertumbuh-kembang, Unggul dan Terpercaya dengan Bertumpu pada Potensi Insani."',
 'easy', 'Pengetahuan Umum', 7),

('a4000000-0000-0000-0000-000000000004',
 'Deret: 5, 10, 20, 40, 80, … Angka berikutnya adalah …',
 '[{"key":"A","text":"120"},{"key":"B","text":"150"},{"key":"C","text":"160"},{"key":"D","text":"200"},{"key":"E","text":"240"}]',
 'C',
 'Pola deret geometri dengan rasio 2. Setiap suku = suku sebelumnya × 2. 80 × 2 = 160.',
 'easy', 'Numerik', 8),

('a4000000-0000-0000-0000-000000000004',
 'Sumber energi terbarukan berikut yang dimanfaatkan PLN untuk pembangkitan listrik, KECUALI …',
 '[{"key":"A","text":"Panas bumi (geothermal)"},{"key":"B","text":"Tenaga air (PLTA)"},{"key":"C","text":"Tenaga surya (PLTS)"},{"key":"D","text":"Tenaga nuklir (PLTN)"},{"key":"E","text":"Tenaga angin (PLTB)"}]',
 'D',
 'Indonesia belum mengoperasikan PLTN. PLN memanfaatkan geothermal, PLTA, PLTS, dan PLTB sebagai energi terbarukan. PLTN masih dalam tahap kajian.',
 'hard', 'Ketenagalistrikan', 9),

('a4000000-0000-0000-0000-000000000004',
 'Satuan yang digunakan untuk mengukur daya listrik adalah …',
 '[{"key":"A","text":"Ampere (A)"},{"key":"B","text":"Volt (V)"},{"key":"C","text":"Ohm (Ω)"},{"key":"D","text":"Watt (W)"},{"key":"E","text":"Hertz (Hz)"}]',
 'D',
 'Daya listrik diukur dalam Watt (W). Ampere = kuat arus, Volt = tegangan, Ohm = hambatan, Hertz = frekuensi.',
 'easy', 'Ketenagalistrikan', 10);


-- ─── SOAL RBB BUMN ────────────────────────────────────────────

insert into public.questions
  (package_id, content, options, correct_answer, explanation, difficulty, category, order_index) values

('a5000000-0000-0000-0000-000000000005',
 'MUDUN = …',
 '[{"key":"A","text":"Problema"},{"key":"B","text":"Beradab"},{"key":"C","text":"Referensi"},{"key":"D","text":"Setuju"},{"key":"E","text":"Mufakat"}]',
 'B',
 'Mudun berasal dari bahasa Arab dan Jawa, artinya beradab atau berbudaya, bersifat santun.',
 'medium', 'Verbal', 1),

('a5000000-0000-0000-0000-000000000005',
 'FRIKSI = …',
 '[{"key":"A","text":"Perpecahan"},{"key":"B","text":"Tidak berdaya"},{"key":"C","text":"Frustasi"},{"key":"D","text":"Sedih"},{"key":"E","text":"Putus harapan"}]',
 'A',
 'Friksi berarti gesekan atau perpecahan, sering digunakan dalam konteks konflik atau ketegangan antarpihak.',
 'medium', 'Verbal', 2),

('a5000000-0000-0000-0000-000000000005',
 'RABUN >< …',
 '[{"key":"A","text":"Tajam"},{"key":"B","text":"Terang"},{"key":"C","text":"Tepat"},{"key":"D","text":"Jelas"},{"key":"E","text":"Samar"}]',
 'D',
 'Rabun artinya tidak dapat melihat dengan jelas. Lawan katanya adalah JELAS (penglihatan yang sempurna/bisa melihat dengan jelas).',
 'easy', 'Verbal', 3),

('a5000000-0000-0000-0000-000000000005',
 'PENERUS >< …',
 '[{"key":"A","text":"Pewaris"},{"key":"B","text":"Kader"},{"key":"C","text":"Titisan"},{"key":"D","text":"Penemu"},{"key":"E","text":"Perintis"}]',
 'E',
 'Penerus artinya yang meneruskan (datang belakangan). Lawan katanya adalah PERINTIS, yaitu yang memulai pertama kali.',
 'medium', 'Verbal', 4),

('a5000000-0000-0000-0000-000000000005',
 '1 Minggu : 7 hari = 1 Hari : …',
 '[{"key":"A","text":"3.600 menit"},{"key":"B","text":"60 detik"},{"key":"C","text":"86.400 detik"},{"key":"D","text":"1.440 menit"},{"key":"E","text":"365 hari"}]',
 'D',
 '1 minggu = 7 hari, 1 hari = 24 jam = 24 × 60 = 1.440 menit. Hubungan yang sama: 1 minggu setara 7 hari, 1 hari setara 1.440 menit.',
 'easy', 'Numerik', 5),

('a5000000-0000-0000-0000-000000000005',
 'OTONOMI : MANDIRI = …',
 '[{"key":"A","text":"Hardisk : VGA card"},{"key":"B","text":"Sabun : Mandi"},{"key":"C","text":"Cerdas : Banyak akal"},{"key":"D","text":"Bensin : Mesin"},{"key":"E","text":"Rakyat : Masyarakat"}]',
 'C',
 'Otonomi dan mandiri adalah sinonim (sama-sama berarti bebas/tidak bergantung). Analogi yang sama: Cerdas dan Banyak akal adalah sinonim.',
 'medium', 'Analogi', 6),

('a5000000-0000-0000-0000-000000000005',
 'Siapakah yang menjadi proklamator kemerdekaan Indonesia?',
 '[{"key":"A","text":"Mohammad Hatta saja"},{"key":"B","text":"Soekarno saja"},{"key":"C","text":"Soekarno dan Mohammad Hatta"},{"key":"D","text":"Soekarno, Hatta, dan Sjahrir"},{"key":"E","text":"Soepomo dan Soekarno"}]',
 'C',
 'Proklamasi kemerdekaan Indonesia pada 17 Agustus 1945 dibacakan oleh Ir. Soekarno dan didampingi oleh Drs. Mohammad Hatta sebagai wakil bangsa Indonesia.',
 'easy', 'Wawasan Kebangsaan', 7),

('a5000000-0000-0000-0000-000000000005',
 'Nilai AKHLAK yang menjadi core values BUMN terdiri dari 6 nilai. Yang BUKAN bagian dari AKHLAK adalah …',
 '[{"key":"A","text":"Amanah"},{"key":"B","text":"Kompeten"},{"key":"C","text":"Loyal"},{"key":"D","text":"Kreatif"},{"key":"E","text":"Adaptif"}]',
 'D',
 'AKHLAK = Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif. KREATIF bukan salah satu dari 6 nilai tersebut.',
 'easy', 'AKHLAK', 8),

('a5000000-0000-0000-0000-000000000005',
 'RBB (Rekrutmen Bersama BUMN) diorganisir oleh …',
 '[{"key":"A","text":"Kementerian BUMN langsung"},{"key":"B","text":"Forum Human Capital Indonesia (FHCI)"},{"key":"C","text":"BKN"},{"key":"D","text":"Kementerian Ketenagakerjaan"},{"key":"E","text":"Masing-masing BUMN secara individual"}]',
 'B',
 'RBB diselenggarakan oleh Forum Human Capital Indonesia (FHCI), yaitu wadah Human Capital Management BUMN Indonesia di bawah koordinasi Kementerian BUMN.',
 'easy', 'Pengetahuan Umum', 9),

('a5000000-0000-0000-0000-000000000005',
 'Deret: 2, 3, 5, 8, 13, 21, … Angka berikutnya adalah …',
 '[{"key":"A","text":"32"},{"key":"B","text":"34"},{"key":"C","text":"33"},{"key":"D","text":"35"},{"key":"E","text":"36"}]',
 'B',
 'Ini adalah deret Fibonacci: setiap angka = jumlah dua angka sebelumnya. 13 + 21 = 34.',
 'medium', 'Numerik', 10);

-- Update total_questions sesuai soal yang diinsert
update public.packages set total_questions = 10
  where id in (
    'a2000000-0000-0000-0000-000000000002',
    'a3000000-0000-0000-0000-000000000003',
    'a4000000-0000-0000-0000-000000000004',
    'a5000000-0000-0000-0000-000000000005'
  );
