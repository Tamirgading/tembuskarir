"""parse_la.py — Ekstrak soal Learning Agility format RBB (2 opsi) dari .docx.

Format:
    Soal N
    (A) <pernyataan>
    (B) <pernyataan>
    Jawaban: (X)
    Pembahasan: ...
Output: [{ content, options:[{key,text}], correct_answer, explanation }]
"""
import zipfile
import re
import json
import sys
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def read_paragraphs(path):
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read('word/document.xml').decode('utf-8'))
    return [''.join(t.text or '' for t in p.iter(W + 't')).strip()
            for p in root.iter(W + 'p') if ''.join(t.text or '' for t in p.iter(W + 't')).strip()]


def parse(path):
    ps = read_paragraphs(path)
    out = []
    cur = None
    in_pembahasan = False
    for ln in ps:
        sm = re.match(r'^Soal\s*(\d+)$', ln, re.I)
        if sm:
            if cur is not None:
                out.append(cur)
            cur = {'content': 'Pilih respons yang paling tepat dari dua pilihan berikut.', 'options': [], 'correct_answer': '', 'explanation': ''}
            in_pembahasan = False
            continue
        if cur is None:
            continue
        om = re.match(r'^\(([A-B])\)\s*(.*)$', ln)
        if om:
            cur['options'].append({'key': om.group(1), 'text': om.group(2).strip()})
            in_pembahasan = False
            continue
        am = re.match(r'^Jawaban\s*[:：]\s*\(?([A-B])\)?', ln, re.I)
        if am:
            cur['correct_answer'] = am.group(1).upper()
            in_pembahasan = False
            continue
        pm = re.match(r'^Pembahasan\s*[:：]\s*(.*)$', ln, re.I)
        if pm:
            cur['explanation'] = pm.group(1).strip()
            in_pembahasan = True
            continue
        if in_pembahasan and ln:
            cur['explanation'] = (cur['explanation'] + '\n' + ln).strip()

    if cur is not None:
        out.append(cur)
    return [q for q in out if q['content']]


def main():
    if len(sys.argv) < 3:
        print('usage: python parse_la.py <input.docx> <output.json>')
        sys.exit(1)
    out = parse(sys.argv[1])
    with open(sys.argv[2], 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f'Parsed {len(out)} soal -> {sys.argv[2]}')
    for i, q in enumerate(out[:3], 1):
        print('  %d. [%s] %s' % (i, q['correct_answer'] or '?', q['options'][0]['text'][:50] if q['options'] else ''))


if __name__ == '__main__':
    main()
