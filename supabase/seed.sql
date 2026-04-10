-- ============================================================
-- TryOut Platform — Seed Data
-- ============================================================

-- 2 Paket Contoh
insert into public.packages (id, name, slug, category, description, duration_minutes, total_questions, is_free, is_published)
values
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Try Out CPNS SKD Seri 1',
    'tryout-cpns-skd-seri-1',
    'CPNS',
    'Paket latihan soal CPNS SKD Seri 1 — cocok untuk pemula. Terdiri dari soal TWK, TIU, dan TKP pilihan.',
    30,
    10,
    true,
    true
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000002',
    'Try Out CPNS SKD Seri 2',
    'tryout-cpns-skd-seri-2',
    'CPNS',
    'Paket premium 100 soal SKD dengan tingkat kesulitan lebih tinggi. Cocok untuk persiapan ujian sesungguhnya.',
    90,
    100,
    false,
    true
  );

-- 10 Soal untuk Paket Seri 1
-- 3 Soal TWK
insert into public.questions (package_id, content, options, correct_answer, explanation, difficulty, category, order_index)
values
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Pancasila sebagai dasar negara Indonesia pertama kali dirumuskan pada sidang BPUPKI. Kapan sidang pertama BPUPKI diselenggarakan?',
    '[{"key":"A","text":"1 Maret 1945"},{"key":"B","text":"29 Mei 1945"},{"key":"C","text":"17 Agustus 1945"},{"key":"D","text":"18 Agustus 1945"},{"key":"E","text":"22 Juni 1945"}]',
    'B',
    'Sidang pertama BPUPKI diselenggarakan pada 29 Mei – 1 Juni 1945. Pada sidang ini, tokoh-tokoh nasional menyampaikan gagasan tentang dasar negara, termasuk Ir. Soekarno yang pada 1 Juni 1945 mengusulkan nama "Pancasila".',
    'easy',
    'TWK',
    1
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Semboyan "Bhinneka Tunggal Ika" berasal dari kitab Sutasoma karya ...',
    '[{"key":"A","text":"Empu Prapanca"},{"key":"B","text":"Empu Gandring"},{"key":"C","text":"Empu Tantular"},{"key":"D","text":"Empu Sedah"},{"key":"E","text":"Empu Panuluh"}]',
    'C',
    'Bhinneka Tunggal Ika berasal dari kitab Sutasoma yang ditulis oleh Empu Tantular pada era Kerajaan Majapahit (abad ke-14). Frasa ini bermakna "Berbeda-beda tetapi tetap satu".',
    'easy',
    'TWK',
    2
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'UUD 1945 Pasal 33 ayat 3 menyatakan bahwa bumi, air, dan kekayaan alam yang terkandung di dalamnya dikuasai oleh negara dan dipergunakan untuk ...',
    '[{"key":"A","text":"Kepentingan pemerintah"},{"key":"B","text":"Sebesar-besarnya kemakmuran rakyat"},{"key":"C","text":"Pembangunan infrastruktur nasional"},{"key":"D","text":"Peningkatan APBN"},{"key":"E","text":"Kepentingan investasi asing"}]',
    'B',
    'Pasal 33 ayat 3 UUD 1945 berbunyi: "Bumi dan air dan kekayaan alam yang terkandung di dalamnya dikuasai oleh negara dan dipergunakan untuk sebesar-besar kemakmuran rakyat."',
    'medium',
    'TWK',
    3
  ),
  -- 4 Soal TIU
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Jika 3x + 7 = 22, maka nilai 2x – 3 adalah ...',
    '[{"key":"A","text":"5"},{"key":"B","text":"7"},{"key":"C","text":"8"},{"key":"D","text":"10"},{"key":"E","text":"12"}]',
    'B',
    '3x + 7 = 22 → 3x = 15 → x = 5. Maka 2x – 3 = 2(5) – 3 = 10 – 3 = 7.',
    'easy',
    'TIU',
    4
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Sebuah mobil menempuh jarak 120 km dalam waktu 2 jam. Berapa kecepatan rata-rata mobil tersebut dalam km/jam?',
    '[{"key":"A","text":"40 km/jam"},{"key":"B","text":"50 km/jam"},{"key":"C","text":"60 km/jam"},{"key":"D","text":"70 km/jam"},{"key":"E","text":"80 km/jam"}]',
    'C',
    'Kecepatan = Jarak / Waktu = 120 km / 2 jam = 60 km/jam.',
    'easy',
    'TIU',
    5
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Antonim kata "EFISIEN" adalah ...',
    '[{"key":"A","text":"Produktif"},{"key":"B","text":"Boros"},{"key":"C","text":"Hemat"},{"key":"D","text":"Cermat"},{"key":"E","text":"Tepat"}]',
    'B',
    'Efisien berarti mampu menjalankan tugas dengan tepat dan cermat tanpa membuang waktu dan tenaga. Antonimnya adalah BOROS — menggunakan sumber daya secara berlebihan.',
    'medium',
    'TIU',
    6
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Deret angka: 2, 4, 8, 16, 32, ... Angka berikutnya adalah ...',
    '[{"key":"A","text":"48"},{"key":"B","text":"56"},{"key":"C","text":"64"},{"key":"D","text":"72"},{"key":"E","text":"96"}]',
    'C',
    'Pola deret ini adalah perkalian 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64.',
    'easy',
    'TIU',
    7
  ),
  -- 3 Soal TKP
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Atasan Anda memberikan tugas penting yang harus diselesaikan dalam waktu 2 jam, namun saat ini Anda sedang menyelesaikan tugas lain yang juga mendesak. Apa yang akan Anda lakukan?',
    '[{"key":"A","text":"Menolak tugas baru karena sudah ada tugas sebelumnya"},{"key":"B","text":"Menerima tugas baru dan meninggalkan tugas lama begitu saja"},{"key":"C","text":"Melapor kepada atasan mengenai kondisi Anda dan meminta panduan prioritas"},{"key":"D","text":"Mengerjakan kedua tugas secara bersamaan meski hasilnya kurang optimal"},{"key":"E","text":"Mendelegasikan seluruh tugas kepada rekan kerja"}]',
    'C',
    'Sikap profesional yang tepat adalah melaporkan kondisi kepada atasan dan meminta panduan prioritas. Ini menunjukkan komunikasi yang baik dan kemampuan manajemen tugas.',
    'medium',
    'TKP',
    8
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Rekan kerja Anda sering datang terlambat dan hal ini mengganggu produktivitas tim. Sebagai sesama anggota tim, apa tindakan Anda?',
    '[{"key":"A","text":"Melaporkan langsung ke atasan tanpa bicara ke rekan tersebut"},{"key":"B","text":"Membiarkan saja karena bukan urusan Anda"},{"key":"C","text":"Menegur secara kasar di depan semua rekan kerja"},{"key":"D","text":"Berbicara secara pribadi dan konstruktif kepada rekan tersebut"},{"key":"E","text":"Ikut-ikutan datang terlambat karena rekan lain pun demikian"}]',
    'D',
    'Pendekatan terbaik adalah berbicara secara langsung dan konstruktif kepada rekan yang bersangkutan. Ini menjaga hubungan kerja yang baik sekaligus menyelesaikan masalah secara profesional.',
    'medium',
    'TKP',
    9
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Anda menemukan kesalahan dalam laporan yang sudah ditandatangani dan dikirimkan ke pimpinan. Apa yang Anda lakukan?',
    '[{"key":"A","text":"Diam saja karena laporan sudah terkirim"},{"key":"B","text":"Menyalahkan rekan yang membantu membuat laporan"},{"key":"C","text":"Segera melapor kepada atasan dan menyampaikan koreksi yang diperlukan"},{"key":"D","text":"Menunggu sampai ada yang menyadari kesalahan tersebut"},{"key":"E","text":"Membuat laporan baru tanpa memberitahu siapapun"}]',
    'C',
    'Integritas dan tanggung jawab mengharuskan kita untuk segera melaporkan kesalahan kepada atasan dan memberikan solusi koreksi. Ini mencerminkan sikap jujur dan profesional.',
    'hard',
    'TKP',
    10
  );
