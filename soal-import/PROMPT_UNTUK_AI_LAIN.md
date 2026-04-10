# Prompt Siap Pakai — Buat Soal CPNS untuk AI Lain

Copy-paste prompt di bawah ini ke ChatGPT, Gemini, atau AI lain.
Ganti bagian [KETERANGAN] sesuai kebutuhan.

---

## PROMPT:

Buatkan [JUMLAH] soal untuk ujian CPNS SKD kategori [TWK/TIU/TKP] dengan format JSON persis seperti berikut.

Aturan:
- `nomor`: urutan soal (integer, mulai dari 1)
- `kategori`: isi dengan "TWK", "TIU", atau "TKP"
- `kesulitan`: isi dengan "easy", "medium", atau "hard"
- `konten`: teks soal lengkap
- `pilihan`: objek dengan key A, B, C, D, E dan value teks pilihan jawaban
- `jawaban_benar`: satu huruf kapital (A/B/C/D/E)
- `pembahasan`: penjelasan mengapa jawaban itu benar

Format output yang WAJIB diikuti (output JSON saja, tidak perlu kalimat lain):

```json
{
  "package_slug": "tryout-cpns-skd-seri-1",
  "soal": [
    {
      "nomor": 1,
      "kategori": "TWK",
      "kesulitan": "medium",
      "konten": "...",
      "pilihan": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "...",
        "E": "..."
      },
      "jawaban_benar": "A",
      "pembahasan": "..."
    }
  ]
}
```

Topik soal: [TOPIK, contoh: Pancasila, UUD 1945, Sejarah Indonesia, Logika, Verbal, dll]
Jumlah soal: [JUMLAH]

---

## Cara pakai setelah dapat output JSON dari AI lain:

1. Simpan output JSON ke file di folder `soal-import/`
   Contoh: `soal-import/seri1-twk.json`

2. Jalankan script import:
   ```bash
   node scripts/import-soal.js soal-import/seri1-twk.json
   ```

3. Script akan menghasilkan file SQL di `supabase/migrations/`
   Jalankan SQL tersebut di Supabase Studio (SQL Editor)

---

## Tips memaksimalkan hasil dari AI lain:

- Minta soal TWK, TIU, TKP dalam sesi terpisah agar lebih fokus
- Minta 10-20 soal per sesi untuk menjaga kualitas
- Selalu minta untuk mengecek kebenaran jawaban sebelum output
- Untuk TKP, minta skala jawaban 1-5 (paling tidak tepat → paling tepat)
- Simpan setiap output JSON langsung, jangan diubah-ubah manual
