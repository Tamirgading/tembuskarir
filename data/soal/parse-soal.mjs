import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── CONFIG SUMBER ─────────────────────────────────────────────
const SOURCES = [
  { file: 'raw-cpns-detik.md',           institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'SKD' },
  { file: 'raw-cpns-twk-tirto.md',       institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TWK' },
  { file: 'raw-cpns-skd-mamikos.md',     institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TWK' },
  { file: 'raw-cpns-skd-mamikos2.md',    institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TWK' },
  { file: 'raw-cpns-skd-mamikos3.md',    institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TIU' },
  { file: 'raw-cpns-skd-mamikos4.md',    institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TKP' },
  { file: 'raw-cpns-skd-mamikos5.md',    institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TKP' },
  { file: 'raw-cpns-latihan-mamikos.md', institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TIU' },
  { file: 'raw-cpns-latihan-mamikos2.md',institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TKP' },
  { file: 'raw-cpns-latihan-mamikos3.md',institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TWK' },
  { file: 'raw-cpns-tkp-kumparan.md',   institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TKP' },
  { file: 'raw-cpns-tiu-dealls.md',     institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TIU' },
  { file: 'raw-cpns-twk-tirto2.md',    institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TWK' },
  { file: 'raw-cpns-tiu-jawapos.md',   institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TIU' },
  { file: 'raw-cpns-twk-jawapos.md',   institusi: 'CPNS', paket: 'SKD CPNS', kategori: 'TWK' },
  { file: 'raw-ojk-mamikos.md',          institusi: 'OJK',  paket: 'OJK PCAM', kategori: 'TKU' },
  { file: 'raw-ojk-tribun.md',           institusi: 'OJK',  paket: 'OJK PCAM', kategori: 'TPD' },
  { file: 'raw-ojk-detik.md',            institusi: 'OJK',  paket: 'OJK PCAM', kategori: 'TKU' },
  { file: 'raw-ojk-tirto.md',            institusi: 'OJK',  paket: 'OJK PCAM', kategori: 'TKU' },
  { file: 'raw-ojk-tribun2.md',          institusi: 'OJK',  paket: 'OJK PCAM', kategori: 'TPD' },
  { file: 'raw-ojk-detik2.md',           institusi: 'OJK',  paket: 'OJK PCAM', kategori: 'TKU' },
  { file: 'raw-ojk-mamikos2.md',         institusi: 'OJK',  paket: 'OJK PCAM', kategori: 'TKU' },
  { file: 'raw-bi-tirto.md',             institusi: 'BI',   paket: 'PCPM BI',  kategori: 'Pengetahuan Umum' },
  { file: 'raw-bi-jadipcpm.md',          institusi: 'BI',   paket: 'PCPM BI',  kategori: 'Pengetahuan Umum' },
  { file: 'raw-bi-kumparan.md',          institusi: 'BI',   paket: 'PCPM BI',  kategori: 'TPD' },
  { file: 'raw-bi-tribun.md',            institusi: 'BI',   paket: 'PCPM BI',  kategori: 'TPD' },
  { file: 'raw-bi-tribun2.md',           institusi: 'BI',   paket: 'PCPM BI',  kategori: 'TPD' },
  { file: 'raw-bi-tribun3.md',           institusi: 'BI',   paket: 'PCPM BI',  kategori: 'TPD' },
  { file: 'raw-bumn-kitalulus.md',       institusi: 'RBB',  paket: 'RBB BUMN', kategori: 'TKD' },
  { file: 'raw-bumn-cnn.md',             institusi: 'RBB',  paket: 'RBB BUMN', kategori: 'TKD' },
  { file: 'raw-bumn-skillacademy.md',    institusi: 'RBB',  paket: 'RBB BUMN', kategori: 'TKD' },
  { file: 'raw-bumn-dealls.md',          institusi: 'RBB',  paket: 'RBB BUMN', kategori: 'TKD' },
  { file: 'raw-bumn-idntimes.md',        institusi: 'RBB',  paket: 'RBB BUMN', kategori: 'Core Values' },
  { file: 'raw-bumn-detik.md',           institusi: 'RBB',  paket: 'RBB BUMN', kategori: 'TKD' },
  { file: 'raw-bumn-kumparan.md',        institusi: 'RBB',  paket: 'RBB BUMN', kategori: 'TKD' },
  { file: 'raw-pln-mamikos.md',          institusi: 'PLN',  paket: 'PLN GAT',  kategori: 'GAT' },
  { file: 'raw-pln-mamikos2.md',         institusi: 'PLN',  paket: 'PLN GAT',  kategori: 'GAT' },
  { file: 'raw-pln-mamikos3.md',         institusi: 'PLN',  paket: 'PLN GAT',  kategori: 'GAT' },
  { file: 'raw-pln-tribun.md',           institusi: 'PLN',  paket: 'PLN GAT',  kategori: 'GAT' },
  { file: 'raw-pln-tirto.md',            institusi: 'PLN',  paket: 'PLN TKD',  kategori: 'TKD' },
  { file: 'raw-pln-pikirankrakyat.md',   institusi: 'PLN',  paket: 'PLN GAT',  kategori: 'GAT' },
  { file: 'raw-astra-tribun.md',         institusi: 'Astra',paket: 'Psikotes Astra', kategori: 'Verbal' },
  { file: 'raw-astra-tribun-p2.md',      institusi: 'Astra',paket: 'Psikotes Astra', kategori: 'Verbal' },
  { file: 'raw-astra-tribun-p3.md',      institusi: 'Astra',paket: 'Psikotes Astra', kategori: 'Verbal' },
  { file: 'raw-astra-tribun-p4.md',      institusi: 'Astra',paket: 'Psikotes Astra', kategori: 'Numerik' },
]

// ─── NORMALIZER ────────────────────────────────────────────────
function normalizeContent(content) {
  return content
    // Hapus link markdown [text](url) tapi pertahankan teks
    .replace(/\[([^\]]{1,80})\]\([^)]*\)/g, '$1')
    // Hapus gambar
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // Hapus bold/italic tapi pertahankan teks
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1')
    // Hapus underscore italic: _text_ → text (untuk format _Jawaban: C_)
    .replace(/_([^_\n]{1,200})_/g, '$1')
    // Unescape nomor: "1\." → "1."
    .replace(/(\d+)\\\./g, '$1.')
    // Hapus karakter invisible
    .replace(/[\u200b-\u200f\u00ad\ufeff\u2060]/g, '')
    // Normalisasi line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
}

// ─── PARSER: FORMAT STANDAR (nomor + opsi A-E/a-e uppercase/lowercase) ─────
function parseMarkdownStandard(content) {
  const normalized = normalizeContent(content)
  const questions = []

  // Split per soal — pola: baris baru + angka + titik/kurung (termasuk "1)." format)
  const questionPattern = /(?:^|\n)(\d{1,3})[.)]{1,2}\s+(?!\[)/gm
  const matches = []
  let match
  while ((match = questionPattern.exec(normalized)) !== null) {
    matches.push({ index: match.index, num: parseInt(match[1]) })
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index
    const end = i + 1 < matches.length ? matches[i + 1].index : normalized.length
    const block = normalized.slice(start, end).trim()
    const q = extractQuestionStandard(block)
    if (q) questions.push(q)
  }
  return questions
}

function extractQuestionStandard(block) {
  if (block.length < 15) return null
  const lines = block.split('\n').map(l => l.trim()).filter(l =>
    l.length > 0 &&
    !l.match(/^(advertisement|iklan|halaman \d+|berita pilihan|baca juga|bagikan|share)/i) &&
    !l.match(/^!\[/)
  )
  if (lines.length < 4) return null

  const firstLine = lines[0]
  const numMatch = firstLine.match(/^(\d{1,3})[.)]{1,2}\s*(.+)/)
  if (!numMatch) return null

  const questionLines = [numMatch[2]]
  let optionStart = -1

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    // Opsi: A. / a. / A) / a) / (A) / - A.
    if (line.match(/^-?\s*\(?[A-Ea-e]\)?[.)]\s+\S/)) {
      optionStart = i
      break
    }
    questionLines.push(line)
  }
  if (optionStart === -1) return null

  const content = questionLines.join(' ').replace(/\s+/g, ' ').trim()
  if (content.length < 8) return null

  // Parse opsi (case insensitive: a-e atau A-E)
  const options = {}
  let currentKey = null

  for (let i = optionStart; i < lines.length; i++) {
    const line = lines[i]
    // Cek batas soal berikutnya atau jawaban
    if (line.match(/^(Jawaban|Kunci|Answer|Pembahasan|Penjelasan)\s*[:.=]?/i)) break

    // Tangkap opsi: format "A.", "a.", "A)", "(A)", "- A.", "- a."
    const optMatch = line.match(/^-?\s*\(?([A-Ea-e])\)?[.)]\s+(.+)/)
    if (optMatch) {
      currentKey = optMatch[1].toUpperCase()
      const text = optMatch[2].replace(/✅\s*$/g, '').replace(/\*+/g, '').replace(/Advertisement\s*$/i, '').trim()
      options[currentKey] = text
      // Cek jika ada ✅ di baris ini → jawaban benar
      if (optMatch[2].includes('✅') || line.includes('✅')) {
        options['_correct'] = currentKey
      }
    } else if (currentKey && line.length > 1 && !line.match(/^-?\s*\(?[A-Ea-e]\)?[.)]/)) {
      if (options[currentKey] && !line.match(/^(Jawaban|Kunci|Advertisement|Halaman)/i)) {
        options[currentKey] += ' ' + line.replace(/\*+/g, '').trim()
      }
    }
  }

  if (Object.keys(options).filter(k => k !== '_correct').length < 2) return null

  // Cek star/backslash-marker dalam opsi: "text ( \*)", "text ( \)", "text (*)" → jawaban bertanda
  for (const [key, text] of Object.entries(options)) {
    if (key === '_correct') continue
    // Jawapos format: "text( \)" atau "text ( \*)" atau "text (*)"
    if (text.match(/\(\s*(?:\\?\*+|\\)\s*\)\s*$/)) {
      options['_correct'] = key
      options[key] = text.replace(/\s*\(\s*(?:\\?\*+|\\)\s*\)\s*$/, '').trim()
      break
    }
  }

  // Cari jawaban
  let correctAnswer = options['_correct'] || null
  delete options['_correct']

  let explanation = ''
  const searchText = lines.slice(optionStart).join('\n')

  if (!correctAnswer) {
    // Pola 1: "Jawaban: B" atau "Jawaban B."
    const m1 = searchText.match(/(?:Jawaban|Kunci jawaban|Kunci|Answer|Jawab)\s*[:.=]?\s*\(?([A-Ea-e])\)?/i)
    if (m1) correctAnswer = m1[1].toUpperCase()

    // Pola 2: TKP scoring format "Jawaban: B (5), C (4), ..." — ambil yang skor tertinggi (5)
    if (!correctAnswer) {
      const m2 = searchText.match(/(?:Jawaban|Kunci jawaban)\s*[:.=]?\s*([A-Ea-e])\s*\(5\)/i)
      if (m2) correctAnswer = m2[1].toUpperCase()
      // Jika tidak ada skor 5, ambil yang pertama disebut
      if (!correctAnswer) {
        const m2b = searchText.match(/(?:Jawaban|Kunci jawaban)\s*[:.=]?\s*([A-Ea-e])\s*\(\d\)/i)
        if (m2b) correctAnswer = m2b[1].toUpperCase()
      }
    }

    // Pola 3: "Jawaban yang benar adalah c" / "benar adalah c"
    if (!correctAnswer) {
      const m3 = searchText.match(/(?:jawaban\s+yang\s+benar\s+adalah|benar\s+adalah)\s*([A-Ea-e])/i)
      if (m3) correctAnswer = m3[1].toUpperCase()
    }
  }

  // Pembahasan
  const pembMatch = searchText.match(/(?:Pembahasan|Penjelasan|Keterangan)\s*[:.]\s*([\s\S]{10,400}?)(?=\n\d{1,3}[.)]\s|$)/i)
  if (pembMatch) explanation = pembMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()

  if (!correctAnswer) return null
  if (!options[correctAnswer]) return null

  return {
    content: content.replace(/^\d{1,3}[.)]{1,2}\s*/, '').replace(/\s+/g, ' ').trim(),
    options: Object.entries(options)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, text]) => ({ key, text: text.substring(0, 500) })),
    correct_answer: correctAnswer,
    explanation: explanation.substring(0, 800) || null,
  }
}

// ─── PARSER: FORMAT BULLET LIST (jadipcpm style) ────────────────
// Format: "1. Question\n   - A. opt ✅\n   - B. opt\n      - Pembahasan: ..."
function parseMarkdownBulletList(content) {
  const normalized = normalizeContent(content)
  const questions = []

  // Cari soal berformat "01. text" atau "1. text" yang diikuti bullet options
  const blocks = normalized.split(/\n(?=\d{1,2}\.\s+[^\[])/)
  for (const block of blocks) {
    if (!block.includes('✅') && !block.match(/[A-D]\.\s+.+\n/)) continue
    const q = extractBulletListQuestion(block.trim())
    if (q) questions.push(q)
  }
  return questions
}

function extractBulletListQuestion(block) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 4) return null

  const firstLine = lines[0]
  const numMatch = firstLine.match(/^(\d{1,2})[.)]\s*(.+)/)
  if (!numMatch) return null

  const content = numMatch[2].replace(/\*+/g, '').replace(/\s+/g, ' ').trim()
  if (content.length < 5) return null

  const options = {}
  let correctAnswer = null
  let explanation = ''

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    // Format: "- A. text ✅" atau "- A. text"
    const optMatch = line.match(/^-\s*\(?([A-Da-d])\)?[.)]\s+(.+)/)
    if (optMatch) {
      const key = optMatch[1].toUpperCase()
      const text = optMatch[2].replace(/✅\s*$/g, '').replace(/\*+/g, '').trim()
      options[key] = text
      if (optMatch[2].includes('✅') || line.includes('✅')) {
        correctAnswer = key
      }
    } else if (line.match(/^-\s*Pembahasan\s*:/i)) {
      explanation = line.replace(/^-\s*Pembahasan\s*:\s*/i, '').replace(/\*+/g, '').trim()
    } else if (line.match(/^Pembahasan\s*:/i)) {
      explanation = line.replace(/^Pembahasan\s*:\s*/i, '').replace(/\*+/g, '').trim()
    }
  }

  if (Object.keys(options).length < 2) return null
  if (!correctAnswer) return null
  if (!options[correctAnswer]) return null

  return {
    content,
    options: Object.entries(options)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, text]) => ({ key, text: text.substring(0, 500) })),
    correct_answer: correctAnswer,
    explanation: explanation.substring(0, 800) || null,
  }
}

// ─── PARSER: FORMAT "Soal N:" (mamikos style) ───────────────────
// Format: "### Soal 1: Title\n\nQuestion text\n\nA. opt\nB. opt\n\nJawaban: B. text"
function parseMarkdownSoalN(content) {
  const normalized = normalizeContent(content)
  const questions = []

  // Split per "Soal N:" section
  const blocks = normalized.split(/\n(?=###?\s*Soal\s+\d+)/i)
  for (const block of blocks) {
    if (!block.match(/^###?\s*Soal\s+\d+/i)) continue
    const q = extractSoalNQuestion(block.trim())
    if (q) questions.push(q)
  }
  return questions
}

function extractSoalNQuestion(block) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 5) return null

  // Baris pertama: "### Soal 1: Title" — title hanya sebagai konteks, tidak masuk konten soal
  // (title biasanya berisi tipe soal seperti "Verbal Reasoning", "Silogisme", dll.)
  const questionLines = []
  let optionStart = -1

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.match(/^[A-E][.)]\s+\S/)) {
      optionStart = i
      break
    }
    if (!line.match(/^(advertisement|!\[|baca juga)/i)) {
      questionLines.push(line)
    }
  }

  if (optionStart === -1) return null

  const content = questionLines.join(' ').replace(/\*+/g, '').replace(/\s+/g, ' ').trim()
  if (content.length < 8) return null

  const options = {}
  let currentKey = null

  for (let i = optionStart; i < lines.length; i++) {
    const line = lines[i]
    if (line.match(/^(Jawaban|Kunci|Pembahasan|Penjelasan)\s*[:.]/i)) break

    const optMatch = line.match(/^([A-E])[.)]\s+(.+)/)
    if (optMatch) {
      currentKey = optMatch[1].toUpperCase()
      options[currentKey] = optMatch[2].replace(/\*+/g, '').replace(/Advertisement\s*$/i, '').trim()
    } else if (currentKey && line.length > 1 && !line.match(/^(Advertisement|Halaman)/i)) {
      if (options[currentKey] && !line.match(/^[A-E][.)]/)) {
        options[currentKey] += ' ' + line.replace(/\*+/g, '').trim()
      }
    }
  }

  if (Object.keys(options).length < 2) return null

  const searchText = lines.slice(optionStart).join('\n')
  const jawMatch = searchText.match(/(?:Jawaban|Kunci)\s*[:.=]?\s*\(?([A-E])\)?/i)
  const correctAnswer = jawMatch ? jawMatch[1].toUpperCase() : null

  const pembMatch = searchText.match(/Pembahasan\s*[:.]\s*([\s\S]{10,400}?)(?=\n###|\n\d+[.)]\s|$)/i)
  const explanation = pembMatch ? pembMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : null

  if (!correctAnswer || !options[correctAnswer]) return null

  return {
    content,
    options: Object.entries(options)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, text]) => ({ key, text: text.substring(0, 500) })),
    correct_answer: correctAnswer,
    explanation: explanation ? explanation.substring(0, 800) : null,
  }
}

// ─── PARSER: FORMAT ITALIC ANSWER (_X. text_) — mamikos latihan style / jawapos style ─────────
// Format: "1\. Question\n\nA. opt\n\n_B. correct_ C. next\n\nD. opt\nE. opt"
// Also handles: "**1\. Question**\n\n_a. correct_\n\nb. opt\n\nc. opt\nd. opt" (jawapos)
function parseMarkdownItalicAnswer(content) {
  const questions = []

  // Pre-process: unescape numbers, strip bold markers, split inline next option
  const preprocessed = content
    .replace(/(\d+)\\\./g, '$1.')      // 1\. → 1.
    .replace(/\*\*(\d{1,3}[.)]\s)/g, '$1')  // **1. → 1. (strip bold before question numbers)
    .replace(/\*\*/g, '')              // strip remaining bold markers
    .replace(/_([A-Ea-e])\.\s+([^_\n]+)_\s+([A-Ea-e]\.)/g, '_$1. $2_\n$3')  // split inline next option

  // Split on question numbers at start of line
  const blocks = preprocessed.split(/\n(?=\d{1,3}[.)]\s+\S)/)

  for (const block of blocks) {
    const q = extractItalicAnswerQuestion(block.trim())
    if (q) questions.push(q)
  }
  return questions
}

function extractItalicAnswerQuestion(block) {
  // Extract correct answer from italic markers BEFORE stripping them (handles both upper and lower case)
  const italicMatch = block.match(/_([A-Ea-e])\.\s+[^_\n]+_/)
  if (!italicMatch) return null
  const correctAnswer = italicMatch[1].toUpperCase()

  // Strip italic markers (convert _X. text_ → X. text, handles upper & lower case)
  const stripped = block.replace(/_([A-Ea-e])\.\s+([^_\n]+)_/g, '$1. $2')

  const normalized = normalizeContent(stripped)
  const lines = normalized.split('\n').map(l => l.trim()).filter(l =>
    l.length > 0 &&
    !l.match(/^(advertisement|iklan|halaman \d+|berita pilihan|baca juga|bagikan|share)/i) &&
    !l.match(/^!\[/)
  )
  if (lines.length < 4) return null

  const firstLine = lines[0]
  const numMatch = firstLine.match(/^(\d{1,3})[.)]\s*(.+)/)
  if (!numMatch) return null

  const questionLines = [numMatch[2]]
  let optionStart = -1

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.match(/^-?\s*\(?[A-Ea-e]\)?[.)]\s+\S/)) {
      optionStart = i
      break
    }
    questionLines.push(line)
  }
  if (optionStart === -1) return null

  const content = questionLines.join(' ').replace(/\s+/g, ' ').trim()
  if (content.length < 5) return null

  const options = {}
  let currentKey = null

  for (let i = optionStart; i < lines.length; i++) {
    const line = lines[i]
    if (line.match(/^(Jawaban|Kunci|Answer|Pembahasan)\s*[:.=]?/i)) break

    const optMatch = line.match(/^-?\s*\(?([A-Ea-e])\)?[.)]\s+(.+)/)
    if (optMatch) {
      currentKey = optMatch[1].toUpperCase()
      options[currentKey] = optMatch[2].replace(/Advertisement\s*$/i, '').trim()
    } else if (currentKey && line.length > 1 && !line.match(/^-?\s*\(?[A-Ea-e]\)?[.)]/)) {
      if (options[currentKey] && !line.match(/^(Advertisement|Halaman)/i)) {
        options[currentKey] += ' ' + line.trim()
      }
    }
  }

  if (Object.keys(options).length < 2) return null
  if (!options[correctAnswer]) return null

  return {
    content: content.replace(/^\d{1,3}[.)]{1,2}\s*/, '').replace(/\s+/g, ' ').trim(),
    options: Object.entries(options)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, text]) => ({ key, text: text.substring(0, 500) })),
    correct_answer: correctAnswer,
    explanation: null,
  }
}

// ─── DISPATCHER ────────────────────────────────────────────────
function parseMarkdown(content) {
  // Coba bullet list format dulu jika ada ✅
  if (content.includes('✅')) {
    const bulletResults = parseMarkdownBulletList(content)
    if (bulletResults.length > 0) return bulletResults
  }
  // Coba "Soal N:" format
  if (content.match(/###?\s*Soal\s+\d+/i)) {
    const soalNResults = parseMarkdownSoalN(content)
    if (soalNResults.length > 0) return soalNResults
  }
  // Coba italic answer format (_X. text_ atau _x. text_)
  if (content.match(/_[A-Ea-e]\.\s+[^_\n]+_/)) {
    const italicResults = parseMarkdownItalicAnswer(content)
    if (italicResults.length > 0) return italicResults
  }
  // Fallback ke format standar
  return parseMarkdownStandard(content)
}

// ─── DETEKSI KATEGORI ──────────────────────────────────────────
function detectKategori(q, defaultKategori) {
  const text = (q.content + ' ' + (q.explanation || '')).toLowerCase()

  if (/pancasila|uud 1945|bhinneka|wawasan kebangsaan|nkri|negara kesatuan|sejarah bangsa|nasionalisme/.test(text)) return 'TWK'
  if (/deret|analogi|sinonim|antonim|aritmatika|geometri|verbal|numerik|figural|penalaran|logika matematika|mana yang benar/.test(text)) return 'TIU'
  if (/karakteristik|situasi kerja|pelayanan publik|integritas|komitmen|empati|etos kerja/.test(text)) return 'TKP'
  if (/otoritas jasa keuangan|ojk|sektor keuangan|pasar modal|asuransi|perbankan|lembaga keuangan/.test(text)) return 'TKU'
  if (/bank indonesia|bank sentral|pcpm|kebijakan moneter|devisa|rupiah|sistem pembayaran|bi rate/.test(text)) return 'Pengetahuan Umum'
  if (/pln|listrik|transmisi|watt|volt|amper|generator|transformator|ketenagalistrikan|gat/.test(text)) return 'GAT'
  if (/akhlak|amanah|kompeten|harmonis|loyal|adaptif|kolaboratif|bumn|fhci|rekrutmen bersama/.test(text)) return 'Core Values'
  if (/sinonim|antonim|analogi kata|padanan kata/.test(text)) return 'Verbal'
  if (/deret angka|deret bilangan|aritmatika|aljabar|perbandingan|hitung|numerik/.test(text)) return 'Numerik'

  return defaultKategori
}

// ─── DETEKSI DIFFICULTY ────────────────────────────────────────
function detectDifficulty(q) {
  const wordCount = q.content.split(/\s+/).length
  const hasCalc = /\d+\s*[+\-×÷*/]\s*\d+|berapa|hitung|kalkulasi|persamaan|rumus/.test(q.content)
  const hasComplex = /kecuali|manakah yang|berdasarkan|sesuai dengan (UU|Undang)|UU No\.|pasal \d+|perhatikan teks|bacaan berikut/.test(q.content)
  if (wordCount > 60 || hasComplex) return 'hard'
  if (wordCount > 25 || hasCalc) return 'medium'
  return 'easy'
}

// ─── MAIN ───────────────────────────────────────────────────────
const allByInstitusi = {}
let grandTotal = 0

for (const src of SOURCES) {
  const filePath = path.join(__dirname, src.file)
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skip: ${src.file} (not found)`)
    continue
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const parsed = parseMarkdown(content)

  const enriched = parsed.map((q, i) => ({
    institusi: src.institusi,
    paket: src.paket,
    kategori: detectKategori(q, src.kategori),
    difficulty: detectDifficulty(q),
    sumber: src.file.replace('raw-', '').replace('.md', ''),
    order_index: i + 1,
    ...q,
  }))

  if (!allByInstitusi[src.institusi]) allByInstitusi[src.institusi] = []
  allByInstitusi[src.institusi].push(...enriched)
  grandTotal += enriched.length

  console.log(`✓ ${src.file}: ${enriched.length} soal`)
}

// ─── DEDUP & SIMPAN PER INSTITUSI ──────────────────────────────
for (const [institusi, soals] of Object.entries(allByInstitusi)) {
  const seen = new Set()
  const unique = soals.filter(q => {
    const key = q.content.substring(0, 70).toLowerCase().replace(/\s+/g, '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const outFile = path.join(__dirname, `soal-${institusi.toLowerCase()}.json`)
  fs.writeFileSync(outFile, JSON.stringify(unique, null, 2), 'utf-8')
  console.log(`\n📁 ${institusi}: ${unique.length} soal unik → ${path.basename(outFile)}`)
}

// ─── GABUNGAN SEMUA ─────────────────────────────────────────────
const allUnique = []
const seenGlobal = new Set()
for (const soals of Object.values(allByInstitusi)) {
  for (const q of soals) {
    const key = q.content.substring(0, 70).toLowerCase().replace(/\s+/g, '')
    if (!seenGlobal.has(key)) {
      seenGlobal.add(key)
      allUnique.push(q)
    }
  }
}

const allFile = path.join(__dirname, 'soal-semua.json')
fs.writeFileSync(allFile, JSON.stringify(allUnique, null, 2), 'utf-8')

console.log('\n' + '═'.repeat(50))
console.log(`TOTAL MENTAH   : ${grandTotal} soal`)
console.log(`TOTAL UNIK     : ${allUnique.length} soal`)
console.log(`FILE GABUNGAN  : soal-semua.json`)
console.log('═'.repeat(50))

const byInst = {}
allUnique.forEach(q => {
  if (!byInst[q.institusi]) byInst[q.institusi] = {}
  if (!byInst[q.institusi][q.kategori]) byInst[q.institusi][q.kategori] = 0
  byInst[q.institusi][q.kategori]++
})
for (const [inst, cats] of Object.entries(byInst)) {
  const total = Object.values(cats).reduce((a, b) => a + b, 0)
  console.log(`\n${inst} (${total} soal):`)
  for (const [cat, count] of Object.entries(cats)) {
    console.log(`  ${cat}: ${count}`)
  }
}
