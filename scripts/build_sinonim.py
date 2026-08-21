"""build_sinonim.py — Ubah daftar sinonim (kata + sinonim) menjadi soal MCQ.

File sumber: "400++ Sinonim PLN 2025.docx" (format: No. / Kata / Sinonim per baris).
Output JSON: [{ content, options, correct_answer, explanation }]
  - content: "Sinonim dari kata X adalah..."
  - options: 4 kata (1 sinonim benar + 3 pengganggu dari daftar lain), posisi diacak
  - explanation: daftar sinonim lengkap
"""
import zipfile
import re
import json
import random
import sys
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def read_paragraphs(path):
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read('word/document.xml').decode('utf-8'))
    return [''.join(t.text or '' for t in p.iter(W + 't')).strip()
            for p in root.iter(W + 'p') if ''.join(t.text or '' for t in p.iter(W + 't')).strip()]


def parse_entries(ps):
    """Kumpulkan {word, syns:[...]} dari pola No./Kata/Sinonim."""
    entries = []
    i = 0
    while i < len(ps):
        ln = ps[i]
        m = re.match(r'^(\d+)[\.\)]\s*$', ln)
        if m:
            # baris berikut = kata, lalu sinonim (1+ baris, bukan angka)
            word = None
            j = i + 1
            syns = []
            if j < len(ps):
                word = ps[j]
                j += 1
            while j < len(ps):
                if re.match(r'^\d+[\.\)]\s*$', ps[j]):
                    break
                if re.match(r'^[A-Za-z\s\.\,]+$', ps[j]) or ',' in ps[j]:
                    syns.append(ps[j])
                j += 1
            if word and syns:
                entries.append({'word': word, 'syns': syns})
            i = j
            continue
        i += 1
    return entries


def main():
    if len(sys.argv) < 3:
        print('usage: python build_sinonim.py <input.docx> <output.json> [--count N]')
        sys.exit(1)
    in_path, out_path = sys.argv[1], sys.argv[2]
    count = None
    if '--count' in sys.argv:
        count = int(sys.argv[sys.argv.index('--count') + 1])

    ps = read_paragraphs(in_path)
    entries = parse_entries(ps)
    # Ambil sinonim pertama sebagai kunci; hilangkan titik di akhir
    pool = [{'word': e['word'], 'syn': e['syns'][0].strip(' .'), 'all': e['syns']} for e in entries if e['syns']]

    out = []
    for e in pool:
        correct = e['syn']
        # pengganggu: kata-kata lain (bukan sinonim dari e)
        distractors = [p['syn'] for p in pool if p['word'] != e['word']]
        random.shuffle(distractors)
        chosen = distractors[:3]
        options = chosen + [correct]
        random.shuffle(options)
        key = 'ABCD'[options.index(correct)]
        out.append({
            'content': 'Sinonim dari kata "%s" adalah...' % e['word'],
            'options': [{'key': 'ABCD'[i], 'text': o} for i, o in enumerate(options)],
            'correct_answer': key,
            'explanation': 'Sinonim dari "%s": %s' % (e['word'], ', '.join(e['all'])),
        })

    if count:
        out = out[:count]

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f'Total entri: {len(pool)}, MCQ dibangun: {len(out)} -> {out_path}')
    for i, q in enumerate(out[:5], 1):
        print('  %d. [%s] %s' % (i, q['correct_answer'], q['content'][:60]))


if __name__ == '__main__':
    main()
