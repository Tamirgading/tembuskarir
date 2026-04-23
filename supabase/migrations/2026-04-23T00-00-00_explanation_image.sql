-- Tambah kolom gambar untuk pembahasan soal
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS explanation_image_url text;
