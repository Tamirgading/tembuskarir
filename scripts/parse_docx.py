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
    ans_re = re.compile(r'^(\d+)[\.\)]?\s*Jawaban\s*[:：]\s*([A-E])(?:[\.\)]?\s*(.*))?$', re.I)
    ans_short = re.compile(r'^Jawaban\s*[:：]\s*([A-E])\b\s*(.*)$', re.I)

    def clean_content(text):
        """Hapus penanda nomor soal di awal (mis. 'Soal 1' / '1. Satu kata...')."""
        text = text.strip()
        text = re.sub(r'^Soal\s*\d+\s*\n?', '', text, flags=re.I).strip()
        text = re.sub(r'^\d+[\.\)]\s+', '', text).strip()
        return text

    def expand_lines(lines):
        """Pisahkan opsi yang menempel di tengah baris (mis. '... A. X B. Y')."""
        out = []
        for ln in lines:
            segs = re.split(r'(?=[A-E][\.\)]\s)', ln)
            if len(segs) == 1:
                out.append(ln)
            else:
                first = segs[0].strip()
                if first:
                    out.append(first)
                for s in segs[1:]:
                    out.append(s.strip())
        return out

    # Lewati materi/header sampai penanda mulai soal yang jelas:
    #   - "Paket N Sub Tes ..."  (mis. TWK, WC, AKHLAK)
    #   - "Soal 1"              (mis. VLR, NS)
    start_marker = re.compile(r'^(?:paket\s*\d+\s*(?:sub\s*tes|subtes)|soal\s*\d+)', re.I)
    start_idx = 0
    for i, ln in enumerate(paras):
        if start_marker.match(ln):
            start_idx = i + 1
            break
    start_idx = max(0, start_idx + skip)

    # Tandai awal bagian kunci jawaban (jangan di-expand)
    answer_idx = None
    for i, ln in enumerate(paras):
        if re.match(r'^jawaban\s*(dan\s*pembahasan|&?\s*pembahasan)?', ln, re.I):
            answer_idx = i
            break

    question_region = paras[start_idx:] if answer_idx is None else paras[start_idx:answer_idx]
    answer_region = [] if answer_idx is None else paras[answer_idx:]
    lines = expand_lines(question_region) + answer_region

    questions = []
    cur = None
    pending = []
    in_answer = False
    answer_buffer = []
    ans_counter = 0  # nomor soal (berurutan / sesuai penomoran)

    def flush():
        nonlocal cur
        if cur is not None:
            questions.append(cur)
        cur = None

    def begin_question(lead_text=''):
        nonlocal cur
        base = '\n'.join(pending).strip()
        content = (base + '\n' + lead_text).strip() if (base and lead_text) else (base or lead_text)
        cur = {'content': clean_content(content), 'options': [], 'correct_answer': '', 'explanation': ''}
        pending.clear()

    for ln in lines:
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
                # ans_re: group(2)=huruf, group(3)=teks; ans_short: group(1)=huruf, group(2)=teks
                key = (m.group(2) if m.re is ans_re else m.group(1)).upper()
                trailing = (m.group(3) if m.re is ans_re else m.group(2)).strip()
                # Simpan pembahasan kumulatif ke soal yang kunci sebelumnya
                if answer_buffer and ans_counter > 0 and ans_counter <= len(questions):
                    questions[ans_counter - 1]['explanation'] = '\n'.join(answer_buffer).strip()
                ans_counter = n if n is not None else ans_counter + 1
                if ans_counter > 0 and ans_counter <= len(questions):
                    questions[ans_counter - 1]['correct_answer'] = key
                answer_buffer = [trailing] if trailing else []
                continue
            answer_buffer.append(ln)
            continue

        om = opt_re.match(ln)
        if om:
            if cur is None:
                begin_question()
            cur['options'].append({'key': om.group(1), 'text': om.group(2).strip()})
            continue

        # Baris teks biasa (mungkin berisi opsi yang menempel, sudah di-expand)
        # Cek sisa opsi yang belum ter-expand (mis. opsi tanpa spasi setelah titik)
        embedded = re.findall(r'([A-E])[\.\)]\s*(.+?)(?=\s[A-E][\.\)]|$)', ln)
        if embedded and not om:
            if cur is None:
                begin_question(ln)
            else:
                cur['content'] = (cur['content'] + '\n' + ln).strip()
            continue

        if cur is not None and cur['options']:
            questions.append(cur)
            cur = None
        pending.append(ln)

    if cur is not None:
        questions.append(cur)

    # Tempel pembahasan terakhir (sisa buffer)
    if answer_buffer and ans_counter > 0 and ans_counter <= len(questions):
        questions[ans_counter - 1]['explanation'] = '\n'.join(answer_buffer).strip()

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
