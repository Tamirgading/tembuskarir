"""parse_english.py — Ekstrak soal Bahasa Inggris (.docx) ke JSON.

Jenis (--type):
  er  Error Recognition   — kalimat dengan penanda (A)(B)(C)(D); kunci "Jawaban: (X)"
  rc  Reading Comprehension — "Teks N" + passage + "Pertanyaan:" + soal (opsi menempel
                            di baris soal); kunci "X. <teks>" di bawah header "Teks N"

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


def parse_er(ps):
    # Mulai setelah "Paket N Sub Tes", lewati judul & baris statistik
    start = next((i for i, ln in enumerate(ps) if re.match(r'^paket\s*\d+\s*(?:sub\s*tes|subtes)', ln, re.I)), 0)
    lines = ps[start + 1:]
    # Lewati baris judul/subtitle/stats
    while lines and (re.match(r'^\d+\s*soal\s*-\s*\d+\s*menit', lines[0], re.I) or len(lines[0]) < 60):
        lines.pop(0)
        if lines and re.match(r'^\d+\s*soal\s*-\s*\d+\s*menit', lines[0], re.I):
            lines.pop(0)

    out = []
    in_ans = False
    cur = None
    qi = 0
    for ln in lines:
        if not in_ans and re.match(r'^jawaban\s*(dan\s*pembahasan|&\s*pembahasan|pembahasan)', ln, re.I):
            if cur is not None:
                out.append(cur)
                cur = None
            in_ans = True
            continue
        if in_ans:
            m = re.match(r'^Jawaban\s*[:：]\s*\(?([A-D])\)?\s*(.*)$', ln, re.I)
            if m:
                if qi < len(out):
                    out[qi]['correct_answer'] = m.group(1).upper()
                    out[qi]['explanation'] = m.group(2).strip()
                qi += 1
            continue
        # baris soal (mengandung penanda (A)-(D))
        if '(' in ln and re.search(r'\([A-D]\)', ln):
            if cur is not None:
                out.append(cur)
            cur = {'content': '', 'options': [], 'correct_answer': '', 'explanation': ''}
            parts = re.split(r'\(([A-D])\)\s*', ln)
            for j in range(1, len(parts) - 1, 2):
                key = parts[j]
                text = (parts[j + 1] or '').strip()
                cur['options'].append({'key': key, 'text': text})
            cur['content'] = re.sub(r'\s*\(([A-D])\)', '', ln).strip()
    if cur is not None:
        out.append(cur)
    return [q for q in out if q['correct_answer']]


def parse_rc(ps):
    start = next((i for i, ln in enumerate(ps) if re.match(r'^paket\s*\d+\s*(?:sub\s*tes|subtes)', ln, re.I)), 0)
    ans_idx = next((i for i, ln in enumerate(ps) if re.match(r'^jawaban', ln, re.I)), len(ps))

    # ---- Wilayah soal: kumpulkan per teks ----
    teks_q = []  # [{passage:[...], questions:[line]}]
    cur_teks = None
    in_question = False
    for ln in ps[start:ans_idx]:
        tm = re.match(r'^Teks\s*(\d+)\s*\(', ln, re.I)
        if tm:
            if cur_teks is not None:
                teks_q.append(cur_teks)
            cur_teks = {'passage': [], 'questions': []}
            in_question = False
            continue
        if cur_teks is None:
            continue
        if re.match(r'^Pertanyaan\s*[:：]?$', ln, re.I):
            in_question = True
            continue
        if in_question:
            cur_teks['questions'].append(ln)
        else:
            cur_teks['passage'].append(ln)
    if cur_teks is not None:
        teks_q.append(cur_teks)

    # ---- Wilayah jawaban: per teks -> daftar kunci ----
    teks_ans = {}  # teksNum -> [key, ...]
    cur_key = None
    for ln in ps[ans_idx:]:
        tm = re.match(r'^Teks\s*(\d+)', ln, re.I)
        if tm:
            cur_key = int(tm.group(1))
            teks_ans.setdefault(cur_key, [])
            continue
        m = re.match(r'^([A-D])[\.\)]\s*(.*)$', ln)
        if m and cur_key is not None:
            teks_ans[cur_key].append(m.group(1).upper())

    # ---- Gabung ----
    out = []
    for teks_num, t in enumerate(teks_q, 1):
        passage = '\n'.join(t['passage']).strip()
        keys = teks_ans.get(teks_num, [])
        cur = None
        for qline in t['questions']:
            # opsi terpisah (baris "A. ...")
            om = re.match(r'^([A-D])[\.\)]\s+(.*)$', qline)
            if om:
                if cur is not None:
                    cur['options'].append({'key': om.group(1), 'text': om.group(2).strip()})
                continue
            # baris soal baru -> finalisasi sebelumnya
            if cur is not None:
                out.append(cur)
            # pisahkan opsi yang menempel di baris soal
            parts = re.split(r'(?=[A-D][\.\)]\s)', qline)
            question = parts[0].strip()
            opts = []
            for seg in parts[1:]:
                mm = re.match(r'^\s*([A-D])[\.\)]\s*(.*)$', seg)
                if mm:
                    opts.append({'key': mm.group(1), 'text': mm.group(2).strip()})
            cur = {
                'content': (passage + '\n\n' + question) if passage else question,
                'options': opts,
                'correct_answer': '',
                'explanation': '',
            }
        if cur is not None:
            out.append(cur)

    # assign kunci: per teks, sesuai urutan soal
    qi = 0
    for teks_num, t in enumerate(teks_q, 1):
        keys = teks_ans.get(teks_num, [])
        for k in keys:
            if qi < len(out):
                out[qi]['correct_answer'] = k
            qi += 1

    return out


def main():
    if len(sys.argv) < 4:
        print('usage: python parse_english.py <er|rc> <input.docx> <output.json>')
        sys.exit(1)
    typ, in_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    ps = read_paragraphs(in_path)
    out = parse_er(ps) if typ == 'er' else parse_rc(ps)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f'Parsed {len(out)} soal -> {out_path}')
    for i, q in enumerate(out[:5], 1):
        print('  %d. [%s] %s' % (i, q['correct_answer'] or '?', q['content'][:60]))


if __name__ == '__main__':
    main()
