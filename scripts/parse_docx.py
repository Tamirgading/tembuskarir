"""
parse_docx.py — Ekstrak soal pilihan ganda dari file .docx ke JSON.

Format yang didukung (pola file TembusKarir):
  - Soal: satu/beberapa paragraf, lalu opsi A. ... s.d. E. (atau A/B saja)
  - Kunci & pembahasan di bagian "Jawaban dan Pembahasan":
      "1. Jawaban: E. <teks>"
      "<paragraf pembahasan...>"

Pemakaian:
  python scripts/parse_docx.py <input.docx> <output.json> [--kode SECTION] [--skip N]
"""
import zipfile
import re
import json
import sys
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def read_paragraphs(path):
    z = zipfile.ZipFile(path)
    xml = z.read('word/document.xml').decode('utf-8')
    root = ET.fromstring(xml)
    paras = []
    for p in root.iter(W + 'p'):
        texts = [t.text or '' for t in p.iter(W + 't')]
        paras.append(''.join(texts).strip())
    return paras


def parse(path, skip=0):
    paras = read_paragraphs(path)

    opt_re = re.compile(r'^([A-E])[\.\)]\s+(.*)$')
    ans_re = re.compile(r'^(\d+)[\.\)]?\s*Jawaban\s*[:：]\s*([A-E])(?:[\.\)]\s*(.*))?$', re.I)
    ans_short = re.compile(r'^Jawaban\s*[:：]\s*([A-E])(?:[\.\)]\s*(.*))?$', re.I)

    # Lewati materi/header sampai menemukan penanda mulai soal
    start_marker = re.compile(r'(?:sub\s*tes|subtes|paket\s*\d+\s*(?:soal|tes))', re.I)
    start_idx = 0
    for i, ln in enumerate(paras):
        if start_marker.search(ln):
            start_idx = i + 1
            break
    start_idx = max(0, start_idx + skip)

    questions = []
    cur = None
    pending = []
    in_answer = False
    answer_buffer = []
    prev_answered = 0  # nomor soal yang kuncinya baru saja diproses

    def flush():
        nonlocal cur
        if cur is not None:
            questions.append(cur)
        cur = None

    for ln in paras[start_idx:]:
        if not ln:
            continue

        # Mulai bagian kunci jawaban
        if not in_answer and re.match(r'^jawaban\s*(dan\s*pembahasan|&?\s*pembahasan)?', ln, re.I):
            in_answer = True
            flush()
            continue

        if in_answer:
            m = ans_re.match(ln) or ans_short.match(ln)
            if m:
                n = int(m.group(1)) if m.re is ans_re else None
                key = m.group(2).upper()
                # Simpan pembahasan kumulatif ke soal yang kunci sebelumnya
                if answer_buffer and prev_answered > 0 and prev_answered <= len(questions):
                    questions[prev_answered - 1]['explanation'] = '\n'.join(answer_buffer).strip()
                if n is not None and 0 < n <= len(questions):
                    questions[n - 1]['correct_answer'] = key
                    prev_answered = n
                elif len(questions) > 0:
                    questions[-1]['correct_answer'] = key
                    prev_answered = len(questions)
                answer_buffer = []
                continue
            answer_buffer.append(ln)
            continue

        om = opt_re.match(ln)
        if om:
            if cur is None:
                cur = {'content': '\n'.join(pending).strip(), 'options': [], 'correct_answer': '', 'explanation': ''}
                pending = []
            cur['options'].append({'key': om.group(1), 'text': om.group(2).strip()})
            continue

        # Baris non-opsi
        if cur is not None and cur['options']:
            questions.append(cur)
            cur = None
        pending.append(ln)

    if cur is not None:
        questions.append(cur)

    # Tempel pembahasan terakhir (sisa buffer)
    if answer_buffer and prev_answered > 0 and prev_answered <= len(questions):
        questions[prev_answered - 1]['explanation'] = '\n'.join(answer_buffer).strip()

    return questions


def main():
    if len(sys.argv) < 3:
        print('usage: python parse_docx.py <input.docx> <output.json> [--skip N]')
        sys.exit(1)
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    skip = 0
    if '--skip' in sys.argv:
        skip = int(sys.argv[sys.argv.index('--skip') + 1])

    questions = parse(input_path, skip=skip)

    # Validasi: soal wajib punya opsi + jawaban
    bad = []
    for i, q in enumerate(questions, 1):
        if not q['content']:
            bad.append(f'#{i}: konten kosong')
        if len(q['options']) < 2:
            bad.append(f'#{i}: opsi < 2')
        if not q['correct_answer']:
            bad.append(f'#{i}: kunci kosong')

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=1)

    print(f'Parsed {len(questions)} soal -> {output_path}')
    for i, q in enumerate(questions, 1):
        print(f'  {i}. [{q["correct_answer"] or "?"}] {q["content"][:70]}')
    if bad:
        print('\nPERHATIAN (perlu dicek manual):')
        for b in bad:
            print('  ' + b)


if __name__ == '__main__':
    main()
