"""parse_diag.py — Ekstrak kunci + pembahasan soal Diagram Reasoning (.docx).

Format DIAG: "Soal N" + gambar, lalu di bagian jawaban:
    Jawaban : C
    Pembahasan : ...
Output: JSON [{key, explanation}] berurutan sesuai soal.
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


def main():
    if len(sys.argv) < 3:
        print('usage: python parse_diag.py <input.docx> <output.json>')
        sys.exit(1)
    ps = read_paragraphs(sys.argv[1])

    out = []
    cur = None
    for ln in ps:
        m = re.match(r'^Jawaban\s*[:：]\s*([A-E])\b', ln, re.I)
        if m:
            if cur is not None:
                out.append(cur)
            cur = {'key': m.group(1).upper(), 'explanation': ''}
            continue
        pm = re.match(r'^Pembahasan\s*[:：]\s*(.*)$', ln, re.I)
        if pm and cur is not None:
            cur['explanation'] = pm.group(1).strip()
            continue
        if cur is not None and cur['key'] and pm is None and ln:
            # lanjutan pembahasan pada baris berikutnya
            cur['explanation'] = (cur['explanation'] + '\n' + ln).strip()
    if cur is not None:
        out.append(cur)

    # Abaikan baris "Jawaban" header (tanpa huruf) — sudah ditangani regex \b
    out = [o for o in out if o['key']]

    with open(sys.argv[2], 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print('Jumlah kunci:', len(out))
    for i, o in enumerate(out, 1):
        print('  %d. [%s] %s' % (i, o['key'], o['explanation'][:60]))


if __name__ == '__main__':
    main()
