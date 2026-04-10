-- ============================================================
-- Import Soal: TEMPLATE_SOAL
-- Package slug: tryout-cpns-skd-seri-1
-- Dibuat: 10/4/2026, 15.20.18
-- Jumlah soal: 3
-- ============================================================

do $$
declare
  v_package_id uuid;
begin
  -- Ambil package_id dari slug
  select id into v_package_id from public.packages where slug = 'tryout-cpns-skd-seri-1';

  if v_package_id is null then
    raise exception 'Package dengan slug "tryout-cpns-skd-seri-1" tidak ditemukan. Pastikan package sudah ada di database.';
  end if;

  -- Insert soal-soal
  insert into public.questions
    (package_id, content, options, correct_answer, explanation, difficulty, category, image_url, order_index)
  values
    (v_package_id, 'Tulis pertanyaan di sini...', '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]'::jsonb, 'A', 'Tulis pembahasan/penjelasan di sini...', 'easy', 'TWK', NULL, 1)
  on conflict do nothing;

  insert into public.questions
    (package_id, content, options, correct_answer, explanation, difficulty, category, image_url, order_index)
  values
    (v_package_id, 'Pertanyaan nomor 2...', '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]'::jsonb, 'C', 'Pembahasan soal nomor 2...', 'medium', 'TIU', NULL, 2)
  on conflict do nothing;

  insert into public.questions
    (package_id, content, options, correct_answer, explanation, difficulty, category, image_url, order_index)
  values
    (v_package_id, 'Pertanyaan nomor 3...', '[{"key":"A","text":"Pilihan A"},{"key":"B","text":"Pilihan B"},{"key":"C","text":"Pilihan C"},{"key":"D","text":"Pilihan D"},{"key":"E","text":"Pilihan E"}]'::jsonb, 'B', 'Pembahasan soal nomor 3...', 'hard', 'TKP', NULL, 3)
  on conflict do nothing;

  raise notice 'Berhasil import % soal untuk package "%"', 3, 'tryout-cpns-skd-seri-1';
end $$;