export const QUESTION_CSV_COLUMNS = [
  'content', 'A', 'B', 'C', 'D', 'E',
  'correct_answer', 'category', 'explanation',
] as const

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'] as const

export interface QuestionSnippet {
  content: string
  options: Record<(typeof OPTION_KEYS)[number], string>
  correctAnswer: string
  category: string
  explanation: string
}

interface QuestionSnippetSource {
  content: string
  options: Array<{ key: string; text: string; point?: number }> | unknown
  correct_answer: string
  category: string | null
  explanation: string | null
}

export function normalizeLineBreaks(value: string): string {
  return value.replace(/\r\n?/g, '\n').replace(/\[\[NL\]\]|\[NL\]/gi, '\n')
}

function encodeLineBreaks(value: string): string {
  return value.replace(/\r\n?/g, '\n').replace(/\n/g, '[[NL]]')
}

function escapeCsvCell(value: string): string {
  return `"${encodeLineBreaks(String(value)).replace(/"/g, '""')}"`
}

export function serializeQuestionSnippet(question: QuestionSnippetSource): string {
  const rawOptions = Array.isArray(question.options) ? question.options : []
  const optMap = Object.fromEntries(
    rawOptions.map((opt) => [opt.key.toUpperCase(), opt])
  ) as Record<string, { key: string; text: string }>

  const cells: string[] = [
    question.content,
    ...OPTION_KEYS.map((k) => optMap[k]?.text ?? ''),
    question.correct_answer.toUpperCase(),
    question.category?.toUpperCase() ?? '',
    question.explanation ?? '',
  ]

  return cells.map(escapeCsvCell).join(',')
}

function extractCsvText(value: string): string {
  const trimmed = value.replace(/^﻿/, '').trim()
  const fenced = trimmed.match(/```(?:csv)?\s*([\s\S]*?)```/i)
  return (fenced?.[1] ?? trimmed).replace(/^﻿/, '').trim()
}

function parseCsvRecords(value: string): string[][] {
  const records: string[][] = []
  let record: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < value.length; i++) {
    const ch = value[i]

    if (ch === '"') {
      if (inQuotes && value[i + 1] === '"') { cell += '"'; i++ }
      else { inQuotes = !inQuotes }
      continue
    }

    if (ch === ',' && !inQuotes) {
      record.push(cell.trim()); cell = ''; continue
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && value[i + 1] === '\n') i++
      record.push(cell.trim())
      if (record.some((item) => item !== '')) records.push(record)
      record = []; cell = ''; continue
    }

    cell += ch
  }

  if (inQuotes) throw new Error('Snippet CSV memiliki tanda petik yang belum ditutup.')
  record.push(cell.trim())
  if (record.some((item) => item !== '')) records.push(record)
  return records
}

function isHeader(record: string[]): boolean {
  return record[0]?.toLowerCase() === 'content' && record[1]?.toUpperCase() === 'A'
}

export function parseQuestionSnippet(value: string): QuestionSnippet {
  if (!value.trim()) throw new Error('Tempel snippet terlebih dahulu.')

  const records = parseCsvRecords(extractCsvText(value)).filter((r) => !isHeader(r))
  if (records.length === 0) throw new Error('Data soal tidak ditemukan dalam snippet.')
  if (records.length > 1) throw new Error('Tempel satu soal saja pada formulir ini.')

  const cells = records[0]
  if (cells.length < 8) {
    throw new Error(`Snippet harus memiliki 9 kolom. Ditemukan ${cells.length}.`)
  }

  const [content, A, B, C, D, E, rawCorrectAnswer, rawCategory, explanation = ''] = cells

  if (!content) throw new Error('Pertanyaan tidak boleh kosong.')
  // A dan B wajib; C–E boleh kosong (soal 2 opsi seperti PS)
  if (!A) throw new Error('Pilihan jawaban A tidak boleh kosong.')
  if (!B) throw new Error('Pilihan jawaban B tidak boleh kosong.')
  const opts = { A, B, C, D, E }

  const correctAnswer = rawCorrectAnswer.toUpperCase()
  if (!OPTION_KEYS.includes(correctAnswer as (typeof OPTION_KEYS)[number])) {
    throw new Error('Jawaban benar harus berupa A, B, C, D, atau E.')
  }

  return {
    content: normalizeLineBreaks(content),
    options: Object.fromEntries(
      OPTION_KEYS.map((k) => [k, normalizeLineBreaks(opts[k])])
    ) as QuestionSnippet['options'],
    correctAnswer,
    category: rawCategory.toUpperCase(),
    explanation: normalizeLineBreaks(explanation),
  }
}

export const GEMINI_PROMPT = `Buat [JUMLAH_SOAL] soal [SUB-TES] untuk tes rekrutmen [NAMA_TES].

Output WAJIB hanya berupa CSV mentah tanpa penjelasan tambahan dan tanpa blok kode markdown.
Gunakan urutan kolom persis berikut (9 kolom, setiap nilai dibungkus tanda petik ganda):
"content","A","B","C","D","E","correct_answer","category","explanation"

Aturan:
- content: teks pertanyaan. Gunakan $rumus$ untuk LaTeX inline. Gunakan [[NL]] untuk ganti baris.
- A–E: pilihan jawaban. Boleh pakai $LaTeX$.
- correct_answer: salah satu huruf A, B, C, D, atau E (WAJIB diisi)
- category: kode sub-tes — mis. QR, DR, RC, IR, VIZ, PS, WM untuk ASTRA; NUM, VER, SIL, DER, FIG, PU untuk PLN GAT
- explanation: pembahasan singkat dan jelas. Boleh pakai $LaTeX$. [[NL]] untuk ganti baris.
- Jika ada tanda petik dalam nilai, tulis dua kali: ""
- TIDAK ada baris header, TIDAK ada baris kosong di antara soal.

Contoh satu baris (soal numerik):
"Jika $2x + 5 = 11$, nilai $x$ adalah...","2","3","4","5","6","C","NUM","$2x = 11 - 5 = 6$, maka $x = 3$"`
