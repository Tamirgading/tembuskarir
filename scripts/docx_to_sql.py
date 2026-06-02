#!/usr/bin/env python3
"""
Parser DOCX soal PLN AKDING -> SQL migration (Python 3.8+)

Format A  - Soal & Pembahasan TERPISAH (Paket 1, Paket 2)
Format B  - Soal & Pembahasan GABUNG dalam satu file (Paket 3)

Usage:
  python scripts/docx_to_sql.py
"""

import re
import json
from pathlib import Path
from typing import List, Optional
from docx import Document  # pip install python-docx


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def esc(s):
    # type: (str) -> str
    """Escape single quotes for SQL single-quoted strings."""
    return str(s).replace("'", "''")


def opts_json(options):
    # type: (List[str]) -> str
    """Convert list of option texts to JSONB format string."""
    keys = ["A", "B", "C", "D", "E"]
    arr = [{"key": keys[i], "text": options[i]} for i in range(min(len(options), 5))]
    return json.dumps(arr, ensure_ascii=False)


def extract_letter(text):
    # type: (str) -> Optional[str]
    """'Jawaban: c. ...' -> 'C'"""
    m = re.match(r"(?i)jawaban\s*:\s*([a-e])[\.\s]", text.strip())
    return m.group(1).upper() if m else None


def strip_pemb_prefix(text):
    # type: (str) -> str
    return re.sub(r"(?i)^pembahasan\s*:\s*", "", text).strip()


def get_paras(path):
    # type: (str) -> List[str]
    return [p.text.strip() for p in Document(path).paragraphs if p.text.strip()]


# ---------------------------------------------------------------------------
# Parser Format A  -- soal terpisah dari pembahasan
# ---------------------------------------------------------------------------

def parse_format_a(soal_path, pemb_path):
    # type: (str, str) -> List[dict]
    """
    Soal file: 4-baris header, lalu blok 5-baris per soal
               (pertanyaan + 4 opsi, tanpa label huruf).
    Pembahasan: 4-baris header, lalu pasangan 'Jawaban:'/'Pembahasan:'.
    """
    soal = get_paras(soal_path)[4:]
    pemb = get_paras(pemb_path)[4:]

    # Kelompok 5 paragraf = 1 soal
    raw_qs = []
    for i in range(0, len(soal) - 4, 5):
        raw_qs.append({
            "content": soal[i],
            "options": [soal[i+1], soal[i+2], soal[i+3], soal[i+4]],
        })

    # Parse pembahasan: cari pasangan Jawaban/Pembahasan
    answers = []
    i = 0
    while i < len(pemb):
        para = pemb[i]
        if not re.match(r"(?i)jawaban\s*:", para):
            i += 1
            continue

        letter = extract_letter(para) or "A"

        # Cek apakah "Pembahasan:" ada di paragraf yang sama
        if re.search(r"(?i)pembahasan\s*:", para):
            m = re.search(r"(?i)pembahasan\s*:\s*(.+)", para, re.DOTALL)
            explanation = m.group(1).strip() if m else ""
            i += 1
        else:
            explanation_parts = []
            i += 1
            # Maju sampai "Pembahasan:"
            while i < len(pemb) and not re.match(r"(?i)pembahasan\s*:", pemb[i]):
                if re.match(r"(?i)jawaban\s*:", pemb[i]):
                    break
                i += 1
            if i < len(pemb) and re.match(r"(?i)pembahasan\s*:", pemb[i]):
                explanation_parts.append(strip_pemb_prefix(pemb[i]))
                i += 1
                # Kumpulkan lanjutan sampai "Jawaban:" berikutnya
                while i < len(pemb) and not re.match(r"(?i)jawaban\s*:", pemb[i]):
                    explanation_parts.append(pemb[i])
                    i += 1
            explanation = " ".join(explanation_parts)

        answers.append({"letter": letter, "explanation": explanation})

    # Gabungkan soal + jawaban
    result = []
    for idx, q in enumerate(raw_qs):
        ans = answers[idx] if idx < len(answers) else {"letter": "A", "explanation": ""}
        result.append({
            "content": q["content"],
            "options": q["options"],
            "correct_answer": ans["letter"],
            "explanation": ans["explanation"],
        })
    return result


# ---------------------------------------------------------------------------
# Parser Format B  -- soal + pembahasan dalam satu file
# ---------------------------------------------------------------------------

def is_question_start(text):
    # type: (str) -> bool
    """Cek apakah paragraf adalah awal soal (N. teks atau **N. teks)"""
    return bool(re.match(r"^\*{0,2}\d+\.\s", text))


def parse_format_b(combined_path):
    # type: (str) -> List[dict]
    """
    Format B: soal + jawaban + pembahasan dalam satu file.

    Kasus normal:
      N. pertanyaan
      a. opsi A  ...  d. opsi D   (paragraf terpisah)
      Jawaban: X.
      Pembahasan: ...

    Kasus khusus (soal dengan data tabel):
      **N. pertanyaan sbb:
      Data baris 1
      Data baris 2 ... pertanyaan?** \n a. opsi A \n b. opsi B \n c. opsi C \n d. opsi D
      Jawaban: X.
      Pembahasan: ...
    """
    paras = get_paras(combined_path)[2:]  # skip 2-baris header

    questions = []
    i = 0

    while i < len(paras):
        # Match: optional leading ** sebelum nomor
        q_match = re.match(r"^\*{0,2}(\d+)\.\s*(.+)", paras[i], re.DOTALL)
        if not q_match:
            i += 1
            continue

        # Teks pertanyaan awal (strip ** di akhir jika ada)
        content_parts = [q_match.group(2).strip().rstrip("*").strip()]
        options = []
        j = i + 1

        while j < len(paras) and len(options) < 4:
            para = paras[j]

            # Cek embedded options: paragraf mengandung \n[a-d]. setelah teks
            if "\n" in para and re.search(r"\n[a-d]\.\s", para, re.IGNORECASE):
                # Pisahkan konten teks (sebelum opsi) dan opsi
                parts = re.split(r"\n(?=[a-d]\.\s)", para, flags=re.IGNORECASE)
                if parts[0].strip():
                    context = parts[0].rstrip("*").strip()
                    if context:
                        content_parts.append(context)
                for opt_raw in parts[1:]:
                    m = re.match(r"[a-d]\.\s*(.+)", opt_raw.strip(), re.IGNORECASE | re.DOTALL)
                    if m and len(options) < 4:
                        options.append(m.group(1).strip().rstrip("*").strip())
                j += 1
                break  # opsi embedded selalu di akhir blok soal

            # Cek opsi normal (paragraf terpisah)
            m = re.match(r"^([a-d])\.\s*(.+)", para, re.DOTALL | re.IGNORECASE)
            if m:
                options.append(m.group(2).strip())
                j += 1
            elif is_question_start(para) or re.match(r"(?i)jawaban\s*:", para):
                # Awal soal berikutnya atau jawaban — berhenti
                break
            else:
                # Paragraf konteks/data — tambahkan ke konten pertanyaan
                content_parts.append(para.rstrip("*").strip())
                j += 1

        if len(options) < 4:
            i += 1
            continue

        # Jawaban
        letter = "A"
        if j < len(paras) and re.match(r"(?i)jawaban\s*:", paras[j]):
            ltr = extract_letter(paras[j])
            if ltr:
                letter = ltr
            j += 1

        # Pembahasan (multi-baris)
        explanation_parts = []
        while j < len(paras):
            para = paras[j]
            if re.match(r"(?i)pembahasan\s*:", para):
                explanation_parts.append(strip_pemb_prefix(para))
                j += 1
                # Lanjutan hingga soal berikutnya
                while j < len(paras):
                    np = paras[j]
                    if (is_question_start(np) or
                            re.match(r"(?i)jawaban\s*:", np) or
                            re.match(r"^[a-d]\.\s", np, re.IGNORECASE)):
                        break
                    explanation_parts.append(np)
                    j += 1
                break
            elif is_question_start(para):
                break
            else:
                j += 1

        # Gabungkan semua konten pertanyaan
        full_content = "\n".join(p for p in content_parts if p)

        questions.append({
            "content": full_content,
            "options": options,
            "correct_answer": letter,
            "explanation": " ".join(explanation_parts),
        })
        i = j

    return questions


# ---------------------------------------------------------------------------
# SQL generation
# ---------------------------------------------------------------------------

def insert_block(pkg_slug, questions, start_order=1):
    # type: (str, List[dict], int) -> str
    """Generate DO $$ block untuk insert soal ke package."""
    if not questions:
        return ""

    lines = []
    lines.append("-- %d soal -> %s" % (len(questions), pkg_slug))
    lines.append("DO $$ DECLARE pkg_id uuid; BEGIN")
    lines.append("  SELECT id INTO pkg_id FROM public.packages WHERE slug = '%s';" % pkg_slug)
    lines.append("  IF pkg_id IS NULL THEN RAISE EXCEPTION 'Package not found: %s'; END IF;" % pkg_slug)
    lines.append("  DELETE FROM public.questions WHERE package_id = pkg_id;")

    for idx, q in enumerate(questions):
        order   = start_order + idx
        content = esc(q["content"])
        expl    = esc(q.get("explanation", ""))
        correct = q["correct_answer"]
        opts    = esc(opts_json(q["options"]))
        lines.append(
            "  INSERT INTO public.questions"
            " (package_id,content,options,correct_answer,explanation,category,order_index)"
            " VALUES (pkg_id,'%s','%s'::jsonb,'%s','%s','AKDING',%d);"
            % (content, opts, correct, expl, order)
        )

    lines.append("END $$;")
    return "\n".join(lines)


def generate_migration(bidang_slug, bidang_name, pakets, output_path):
    # type: (str, str, List[List[dict]], str) -> None
    """Generate lengkap SQL migration untuk satu bidang AKDING."""

    p1 = pakets[0] if len(pakets) > 0 else []
    p2 = pakets[1] if len(pakets) > 1 else []
    p3 = pakets[2] if len(pakets) > 2 else []

    demo_slug   = "akding-%s-demo"    % bidang_slug
    full_slug   = "akding-%s-full"    % bidang_slug   # slug lama dari migration awal
    paket1_slug = "akding-%s-paket-1" % bidang_slug
    paket2_slug = "akding-%s-paket-2" % bidang_slug
    paket3_slug = "akding-%s-paket-3" % bidang_slug

    demo_qs = p1[:20]   # 20 soal gratis = sample dari Paket 1

    out = []
    out.append("-- ================================================================")
    out.append("-- Soal AKDING: %s" % bidang_name)
    out.append("-- Auto-generated by scripts/docx_to_sql.py")
    out.append("-- Paket 1: %d soal  |  Paket 2: %d soal  |  Paket 3: %d soal" % (len(p1), len(p2), len(p3)))
    out.append("-- ================================================================")
    out.append("")

    # 1. Update demo
    out.append("-- 1. Update demo package (20 soal gratis)")
    out.append("UPDATE public.packages")
    out.append("  SET total_questions = %d, duration_minutes = 25" % len(demo_qs))
    out.append("  WHERE slug = '%s';" % demo_slug)
    out.append("")

    # 2. Rename full -> paket-1
    if p1:
        out.append("-- 2. Rename 'full' -> 'paket-1' dan update")
        out.append("UPDATE public.packages SET")
        out.append("  slug = '%s'," % paket1_slug)
        out.append("  name = 'AKDING %s - Paket 1'," % bidang_name)
        out.append("  total_questions = %d," % len(p1))
        out.append("  duration_minutes = 50")
        out.append("  WHERE slug = '%s';" % full_slug)
        out.append("")

    # 3. Create paket-2
    if p2:
        out.append("-- 3. Create paket-2")
        out.append("INSERT INTO public.packages (name,slug,category,description,duration_minutes,total_questions,is_free,is_published)")
        out.append("  VALUES (")
        out.append("    'AKDING %s - Paket 2'," % bidang_name)
        out.append("    '%s'," % paket2_slug)
        out.append("    'PLN',")
        out.append("    'Latihan soal akademik bidang %s, paket 2. Dilengkapi pembahasan lengkap.'," % bidang_name)
        out.append("    50, %d, false, true" % len(p2))
        out.append("  )")
        out.append("  ON CONFLICT (slug) DO UPDATE SET")
        out.append("    name=EXCLUDED.name, total_questions=EXCLUDED.total_questions, duration_minutes=EXCLUDED.duration_minutes;")
        out.append("")

    # 4. Create paket-3
    if p3:
        out.append("-- 4. Create paket-3")
        out.append("INSERT INTO public.packages (name,slug,category,description,duration_minutes,total_questions,is_free,is_published)")
        out.append("  VALUES (")
        out.append("    'AKDING %s - Paket 3'," % bidang_name)
        out.append("    '%s'," % paket3_slug)
        out.append("    'PLN',")
        out.append("    'Latihan soal akademik bidang %s, paket 3. Dilengkapi pembahasan lengkap.'," % bidang_name)
        out.append("    50, %d, false, true" % len(p3))
        out.append("  )")
        out.append("  ON CONFLICT (slug) DO UPDATE SET")
        out.append("    name=EXCLUDED.name, total_questions=EXCLUDED.total_questions, duration_minutes=EXCLUDED.duration_minutes;")
        out.append("")

    # 5. Insert questions
    out.append("-- ================================================================")
    out.append("-- INSERT QUESTIONS")
    out.append("-- ================================================================")
    out.append("")

    if demo_qs:
        out.append(insert_block(demo_slug, demo_qs))
        out.append("")

    if p1:
        out.append(insert_block(paket1_slug, p1))
        out.append("")

    if p2:
        out.append(insert_block(paket2_slug, p2))
        out.append("")

    if p3:
        out.append(insert_block(paket3_slug, p3))
        out.append("")

    Path(output_path).write_text("\n".join(out), encoding="utf-8")

    print("Written: %s" % output_path)
    print("  Demo   : %d soal" % len(demo_qs))
    if p1: print("  Paket 1: %d soal" % len(p1))
    if p2: print("  Paket 2: %d soal" % len(p2))
    if p3: print("  Paket 3: %d soal" % len(p3))
    print("  TOTAL soal di DB: %d" % (len(p1) + len(p2) + len(p3)))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    BASE_SOAL = r"D:\Soal\PLN\Akding dan Bahasa Inggris"
    BASE_MIGR = r"D:\Soal\ClaudeProject-web\supabase\migrations"

    # Definisi bidang: (folder_name, bidang_slug, bidang_name)
    # Tambahkan bidang lain di sini setelah folder tersedia
    BIDANG_LIST = [
        (
            "Akding Bidang Akuntansi & Keuangan",
            "akuntansi-keuangan",
            "Akuntansi & Keuangan",
        ),
        # Uncomment setelah folder tersedia:
        # ("Akding Bidang Hukum & Regulasi Energi",        "hukum-regulasi",       "Hukum & Regulasi Energi"),
        # ("Akding Bidang Komunikasi & Humas",              "komunikasi-humas",     "Komunikasi & Hubungan Masyarakat"),
        # ("Akding Bidang Manajemen & Bisnis",              "manajemen-bisnis",     "Manajemen & Bisnis"),
        # ("Akding Bidang Teknologi Informasi",             "teknologi-informasi",  "Teknologi Informasi"),
        # ("Akding Bidang Psikologi Industri",              "psikologi-industri",   "Psikologi Industri"),
        # ("Akding Bidang Teknik Elektro",                  "teknik-elektro",       "Teknik Elektro & Energi"),
        # ("Akding Bidang Teknik Mesin",                    "teknik-mesin",         "Teknik Mesin"),
        # ("Akding Bidang Teknik Sipil",                    "teknik-sipil",         "Teknik Sipil & Konstruksi"),
        # ("Akding Bidang Lingkungan & K3",                 "lingkungan-k3",        "Lingkungan & K3"),
        # ("Akding Bidang Logistik & Rantai Pasok",         "logistik",             "Logistik & Rantai Pasok"),
        # ("Akding Bidang Manajemen Aset",                  "manajemen-aset",       "Manajemen Aset"),
    ]

    for folder, slug, name in BIDANG_LIST:
        base = "%s\\%s" % (BASE_SOAL, folder)
        print("")
        print("=" * 60)
        print("Bidang: %s" % name)

        pakets = []

        # Paket 1 (Format A)
        soal1 = "%s\\Paket 1 - Akding Bidang %s - Tembuskarir.docx" % (base, name)
        pemb1 = "%s\\Paket 1 - Pembahasan Akding Bidang %s - Tembuskarir.docx" % (base, name)
        if Path(soal1).exists() and Path(pemb1).exists():
            try:
                qs = parse_format_a(soal1, pemb1)
                pakets.append(qs)
                print("  Paket 1 (Format A): %d soal" % len(qs))
            except Exception as e:
                print("  Paket 1 ERROR: %s" % e)
                pakets.append([])
        else:
            print("  Paket 1: file tidak ditemukan")
            pakets.append([])

        # Paket 2 (Format A)
        soal2 = "%s\\Paket 2 - Akding Bidang %s - Tembuskarir.docx" % (base, name)
        pemb2 = "%s\\Paket 2 - Pembahasan Akding Bidang %s - Tembuskarir.docx" % (base, name)
        if Path(soal2).exists() and Path(pemb2).exists():
            try:
                qs = parse_format_a(soal2, pemb2)
                pakets.append(qs)
                print("  Paket 2 (Format A): %d soal" % len(qs))
            except Exception as e:
                print("  Paket 2 ERROR: %s" % e)
                pakets.append([])
        else:
            print("  Paket 2: file tidak ditemukan")
            pakets.append([])

        # Paket 3 (Format B - combined)
        soal3 = "%s\\Paket 3 - Akding Bidang %s - Tembuskarir.docx" % (base, name)
        if Path(soal3).exists():
            try:
                qs = parse_format_b(soal3)
                pakets.append(qs)
                print("  Paket 3 (Format B): %d soal" % len(qs))
            except Exception as e:
                print("  Paket 3 ERROR: %s" % e)
                pakets.append([])
        else:
            print("  Paket 3: file tidak ditemukan")
            pakets.append([])

        # Generate SQL
        out_file = "%s\\2026-06-02_akding_%s.sql" % (BASE_MIGR, slug)
        generate_migration(slug, name, pakets, out_file)


if __name__ == "__main__":
    main()
