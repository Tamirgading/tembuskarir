-- ============================================================
-- ASTRA: Tambah sub-tes IR, VIZ (placeholder gambar),
--        dan WM (Working Memory) ke paket "Simulasi Psikotes ASTRA #1"
-- ============================================================

DO $$
DECLARE
  v_pkg_id uuid;
BEGIN
  SELECT id INTO v_pkg_id
    FROM public.packages
   WHERE name = 'Simulasi Psikotes ASTRA #1'
   LIMIT 1;

  IF v_pkg_id IS NULL THEN
    RAISE EXCEPTION 'Paket "Simulasi Psikotes ASTRA #1" tidak ditemukan di database.';
  END IF;

  -- ──────────────────────────────────────────────────────────────
  -- 1. Pastikan RLS + policy untuk questions_astra_wm
  -- ──────────────────────────────────────────────────────────────
  ALTER TABLE IF EXISTS public.questions_astra_wm ENABLE ROW LEVEL SECURITY;

  BEGIN
    CREATE POLICY "questions_astra_wm_select" ON public.questions_astra_wm
      FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.packages p
         WHERE p.id = questions_astra_wm.package_id
           AND p.is_published = true
      ));
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  -- ──────────────────────────────────────────────────────────────
  -- 2. IR — 10 placeholder (soal berbasis gambar, image akan diisi via admin)
  -- ──────────────────────────────────────────────────────────────
  INSERT INTO public.questions
    (package_id, content, options, correct_answer, explanation, difficulty, category, order_index)
  VALUES
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 1),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 2),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 3),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 4),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 5),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 6),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 7),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 8),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 9),
    (v_pkg_id, 'Perhatikan pola gambar berikut. Gambar mana yang tepat untuk melengkapi pola tersebut?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'IR', 10);

  -- ──────────────────────────────────────────────────────────────
  -- 3. VIZ — 10 placeholder (soal berbasis gambar 3D/jaring-jaring)
  -- ──────────────────────────────────────────────────────────────
  INSERT INTO public.questions
    (package_id, content, options, correct_answer, explanation, difficulty, category, order_index)
  VALUES
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 1),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 2),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 3),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 4),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 5),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 6),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 7),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 8),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 9),
    (v_pkg_id, 'Manakah kubus yang tepat dari jaring-jaring kubus di atas?',
     '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]',
     'A', '', 'medium', 'VIZ', 10);

  -- ──────────────────────────────────────────────────────────────
  -- 4. WM — 10 soal recall (di tabel questions, untuk scoring)
  --    Pasangan tampil via questions_astra_wm (dilink by order_index)
  -- ──────────────────────────────────────────────────────────────
  INSERT INTO public.questions
    (package_id, content, options, correct_answer, explanation, difficulty, category, order_index)
  VALUES
    -- Soal 1 (1 pasangan: Mangga–47)
    (v_pkg_id, 'Berapa angka untuk kata MANGGA?',
     '[{"key":"A","text":"47"},{"key":"B","text":"23"},{"key":"C","text":"81"},{"key":"D","text":"15"},{"key":"E","text":"63"}]',
     'A', 'Mangga = 47', 'medium', 'WM', 1),

    -- Soal 2 (2 pasangan: Kelapa–38, Salak–72)
    (v_pkg_id, 'Berapa angka untuk kata SALAK?',
     '[{"key":"A","text":"38"},{"key":"B","text":"72"},{"key":"C","text":"56"},{"key":"D","text":"19"},{"key":"E","text":"84"}]',
     'B', 'Salak = 72', 'medium', 'WM', 2),

    -- Soal 3 (5 pasangan: Pepaya–53, Pisang–26, Nanas–84, Jeruk–17, Apel–69)
    (v_pkg_id, 'Berapa angka untuk kata NANAS?',
     '[{"key":"A","text":"53"},{"key":"B","text":"26"},{"key":"C","text":"84"},{"key":"D","text":"17"},{"key":"E","text":"69"}]',
     'C', 'Nanas = 84', 'medium', 'WM', 3),

    -- Soal 4 (5 pasangan: Dokter–42, Guru–15, Pilot–78, Polisi–63, Petani–29)
    (v_pkg_id, 'Berapa angka untuk kata PILOT?',
     '[{"key":"A","text":"42"},{"key":"B","text":"15"},{"key":"C","text":"78"},{"key":"D","text":"63"},{"key":"E","text":"29"}]',
     'C', 'Pilot = 78', 'medium', 'WM', 4),

    -- Soal 5 (5 pasangan: Merah–91, Biru–34, Hijau–57, Kuning–82, Putih–16)
    (v_pkg_id, 'Berapa angka untuk kata KUNING?',
     '[{"key":"A","text":"91"},{"key":"B","text":"34"},{"key":"C","text":"57"},{"key":"D","text":"82"},{"key":"E","text":"16"}]',
     'D', 'Kuning = 82', 'medium', 'WM', 5),

    -- Soal 6 (5 pasangan: Gitar–23, Piano–68, Biola–45, Seruling–91, Drum–37)
    (v_pkg_id, 'Berapa angka untuk kata BIOLA?',
     '[{"key":"A","text":"23"},{"key":"B","text":"68"},{"key":"C","text":"45"},{"key":"D","text":"91"},{"key":"E","text":"37"}]',
     'C', 'Biola = 45', 'medium', 'WM', 6),

    -- Soal 7 (5 pasangan: Jakarta–55, Bandung–28, Surabaya–74, Medan–13, Bali–96)
    (v_pkg_id, 'Berapa angka untuk kata MEDAN?',
     '[{"key":"A","text":"55"},{"key":"B","text":"28"},{"key":"C","text":"74"},{"key":"D","text":"13"},{"key":"E","text":"96"}]',
     'D', 'Medan = 13', 'medium', 'WM', 7),

    -- Soal 8 (5 pasangan: Kucing–64, Anjing–31, Sapi–88, Kambing–47, Ayam–19)
    (v_pkg_id, 'Berapa angka untuk kata ANJING?',
     '[{"key":"A","text":"64"},{"key":"B","text":"31"},{"key":"C","text":"88"},{"key":"D","text":"47"},{"key":"E","text":"19"}]',
     'B', 'Anjing = 31', 'medium', 'WM', 8),

    -- Soal 9 (5 pasangan: Mobil–73, Motor–46, Pesawat–92, Kapal–25, Kereta–58)
    (v_pkg_id, 'Berapa angka untuk kata PESAWAT?',
     '[{"key":"A","text":"73"},{"key":"B","text":"46"},{"key":"C","text":"92"},{"key":"D","text":"25"},{"key":"E","text":"58"}]',
     'C', 'Pesawat = 92', 'medium', 'WM', 9),

    -- Soal 10 (5 pasangan: Roti–17, Nasi–84, Mie–62, Sate–39, Bakso–75)
    (v_pkg_id, 'Berapa angka untuk kata ROTI?',
     '[{"key":"A","text":"17"},{"key":"B","text":"84"},{"key":"C","text":"62"},{"key":"D","text":"39"},{"key":"E","text":"75"}]',
     'A', 'Roti = 17', 'medium', 'WM', 10);

  -- ──────────────────────────────────────────────────────────────
  -- 5. WM — memory pairs di questions_astra_wm (untuk animasi hafalan)
  --    order_index harus sama dengan soal recall di atas
  -- ──────────────────────────────────────────────────────────────
  INSERT INTO public.questions_astra_wm
    (package_id, memory_pairs, memory_duration_seconds, recall_questions, order_index)
  VALUES
    -- Soal 1: 1 pasangan
    (v_pkg_id, '[{"word":"Mangga","number":47}]'::jsonb, 1, '[]'::jsonb, 1),
    -- Soal 2: 2 pasangan
    (v_pkg_id, '[{"word":"Kelapa","number":38},{"word":"Salak","number":72}]'::jsonb, 1, '[]'::jsonb, 2),
    -- Soal 3: 5 pasangan
    (v_pkg_id, '[{"word":"Pepaya","number":53},{"word":"Pisang","number":26},{"word":"Nanas","number":84},{"word":"Jeruk","number":17},{"word":"Apel","number":69}]'::jsonb, 1, '[]'::jsonb, 3),
    -- Soal 4: 5 pasangan
    (v_pkg_id, '[{"word":"Dokter","number":42},{"word":"Guru","number":15},{"word":"Pilot","number":78},{"word":"Polisi","number":63},{"word":"Petani","number":29}]'::jsonb, 1, '[]'::jsonb, 4),
    -- Soal 5: 5 pasangan
    (v_pkg_id, '[{"word":"Merah","number":91},{"word":"Biru","number":34},{"word":"Hijau","number":57},{"word":"Kuning","number":82},{"word":"Putih","number":16}]'::jsonb, 1, '[]'::jsonb, 5),
    -- Soal 6: 5 pasangan
    (v_pkg_id, '[{"word":"Gitar","number":23},{"word":"Piano","number":68},{"word":"Biola","number":45},{"word":"Seruling","number":91},{"word":"Drum","number":37}]'::jsonb, 1, '[]'::jsonb, 6),
    -- Soal 7: 5 pasangan
    (v_pkg_id, '[{"word":"Jakarta","number":55},{"word":"Bandung","number":28},{"word":"Surabaya","number":74},{"word":"Medan","number":13},{"word":"Bali","number":96}]'::jsonb, 1, '[]'::jsonb, 7),
    -- Soal 8: 5 pasangan
    (v_pkg_id, '[{"word":"Kucing","number":64},{"word":"Anjing","number":31},{"word":"Sapi","number":88},{"word":"Kambing","number":47},{"word":"Ayam","number":19}]'::jsonb, 1, '[]'::jsonb, 8),
    -- Soal 9: 5 pasangan
    (v_pkg_id, '[{"word":"Mobil","number":73},{"word":"Motor","number":46},{"word":"Pesawat","number":92},{"word":"Kapal","number":25},{"word":"Kereta","number":58}]'::jsonb, 1, '[]'::jsonb, 9),
    -- Soal 10: 5 pasangan
    (v_pkg_id, '[{"word":"Roti","number":17},{"word":"Nasi","number":84},{"word":"Mie","number":62},{"word":"Sate","number":39},{"word":"Bakso","number":75}]'::jsonb, 1, '[]'::jsonb, 10);

  -- ──────────────────────────────────────────────────────────────
  -- 6. Update total_questions paket (hitung dari tabel questions saja)
  --    WM recall sudah masuk questions, jadi hitungan otomatis benar
  -- ──────────────────────────────────────────────────────────────
  UPDATE public.packages
     SET total_questions = (
       SELECT COUNT(*)::int FROM public.questions WHERE package_id = v_pkg_id
     )
   WHERE id = v_pkg_id;

  RAISE NOTICE 'Berhasil: IR(10) + VIZ(10) + WM(10) ditambahkan ke paket %', v_pkg_id;
END $$;
