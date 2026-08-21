"""parse_ns.py — Ekstrak soal Number Sequence (.docx) ke JSON.

Format file NS (RBB BUMN):
    Soal 1
    <angka>
    <angka>
    |
    <angka> ...
    A
    B
    C
    D
    E
    ...
    Jawaban : Maka dari itu angka yang salah adalah C. 37 yang seharusnya 36.

Karena nilai opsi A-E tidak tersedia di file, opsi direkonstruksi:
  - opsi kunci = angka yang salah (dari kunci)
  - 4 opsi lain = angka benar dari deret tsb

Output: [{ content, options, correct_answer, explanation }]
"""
import zipfile
import re
import json
import sys
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
NUM_RE = re.compile(r'^-?\d+(?:[.,]\d+)?$')


def read_paragraphs(path):
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read('word/document.xml').decode('utf-8'))
    return [''.join(t.text or '' for t in p.iter(W + 't')).strip()
            for p in root.iter(W + 'p') if ''.join(t.text or '' for t in p.iter(W + 't')).strip()]


def parse(path):
    ps = read_paragraphs(path)

    # Mulai dari "Soal 1"
    start = next((i for i, ln in enumerate(ps) if re.match(r'^soal\s*1$', ln, re.I)), 0)

    questions = []
    cur = None  # {'numbers': [], 'letters': [], ...}
    answers = []  # (key, wrong, explanation)

    for ln in ps[start:]:
        sm = re.match(r'^Soal\s*(\d+)$', ln, re.I)
        if sm:
            if cur is not None and cur['numbers']:
                questions.append(cur)
            cur = {'numbers': [], 'letters': []}
            continue
        if cur is None:
            continue
        if NUM_RE.match(ln):
            cur['numbers'].append(ln)
            continue
        if re.match(r'^[A-E]$', ln):
            cur['letters'].append(ln)
            continue
        # wilayah pembahasan
        m = re.match(r'^Jawaban\s*[:：].*?adalah\s+([A-E])[\.\)]\s*(-?[\d.,]+)\s+.*?(?:seharusnya|seharusnya adalah)\s+(-?[\d.,]+)', ln, re.I)
        if m:
            answers.append({'key': m.group(1).upper(), 'wrong': m.group(2), 'correct': m.group(3), 'rest': ln})
            continue
        # lanjutan pembahasan / baris lain di wilayah jawaban
        if answers:
            answers[-1]['rest'] = (answers[-1].get('rest', '') + '\n' + ln).strip()
    if cur is not None and cur['numbers']:
        questions.append(cur)

    # Bangun soal
    out = []
    for i, q in enumerate(questions):
        if i >= len(answers):
            break
        a = answers[i]
        key = a['key']
        wrong = a['wrong'].replace(',', '.')
        seq = [n.replace(',', '.') for n in q['numbers']]

        # opsi: kunci = angka salah; lainnya = angka benar dari deret
        distractors = [n for n in seq if n != wrong]
        # urutkan opsi sesuai kunci, sisipkan 4 angka lain
        pool = distractors[:4]
        if len(pool) < 4:
            pool = (distractors + ['—'] * 4)[:4]
        opt_order = ['A', 'B', 'C', 'D', 'E']
        opts = []
        for k in opt_order:
            if k == key:
                opts.append({'key': k, 'text': wrong})
            else:
                opts.append({'key': k, 'text': pool.pop(0) if pool else '—'})

        # konten: deret dengan pemisah
        content = 'Deret angka berikut: ' + ', '.join(seq) + '\nManakah angka yang salah dari deret tersebut?'
        explanation = a['rest'] if a['rest'] else None

        out.append({
            'content': content,
            'options': opts,
            'correct_answer': key,
            'explanation': explanation,
        })

    return out


def main():
    if len(sys.argv) < 3:
        print('usage: python parse_ns.py <input.docx> <output.json>')
        sys.exit(1)
    out = parse(sys.argv[1])
    with open(sys.argv[2], 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f'Parsed {len(out)} soal -> {sys.argv[2]}')
    for i, q in enumerate(out, 1):
        opts = ' '.join(f'{o["key"]}:{o["text"]}' for o in q['options'])
        print(f'  {i}. [{q["correct_answer"]}] {q["content"][:40]} | {opts}')


if __name__ == '__main__':
    main()
