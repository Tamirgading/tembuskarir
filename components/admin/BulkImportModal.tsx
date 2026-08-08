'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy } from 'lucide-react'
import { GEMINI_PROMPT } from '@/lib/question-csv'

interface ParsedQuestion {
  rowNum: number
  content: string
  A: string
  B: string
  C: string
  D: string
  E: string
  correct_answer: string
  category: string
  explanation: string
  error?: string
}

interface BulkImportModalProps {
  packageId: string
  startIndex: number
  onClose: () => void
}

const TEMPLATE_ROWS = [
  ['content', 'A', 'B', 'C', 'D', 'E', 'correct_answer', 'category', 'explanation'],
  // Contoh soal numerik
  [
    'Jika $2x + 3 = 11$, maka nilai $x$ adalah...',
    '3', '4', '5', '6', '7',
    'B', 'NUM',
    '$2x = 11 - 3 = 8$, maka $x = 4$',
  ],
  // Contoh soal verbal
  [
    'Sinonim dari kata "efisien" adalah...',
    'Boros', 'Lambat', 'Tepat guna', 'Rumit', 'Mahal',
    'C', 'VER',
    'Efisien berarti berdaya guna / tepat guna tanpa membuang sumber daya',
  ],
]

function downloadTemplate() {
  const lines = TEMPLATE_ROWS.map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  )
  const csv = lines.join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template_soal.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function parseCSVRow(line: string): string[] {
  const cells: string[] = []
  let inQuote = false
  let cell = ''
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cell += '"'; i++ }
      else { inQuote = !inQuote }
    } else if (ch === ',' && !inQuote) {
      cells.push(cell); cell = ''
    } else {
      cell += ch
    }
  }
  cells.push(cell)
  return cells.map((c) => c.trim())
}

function buildQuestion(cells: string[], rowNum: number): ParsedQuestion {
  const [
    content = '', A = '', B = '', C = '', D = '', E = '',
    correct_answer = '', category = '', explanation = '',
  ] = cells

  const errors: string[] = []
  if (!content) errors.push('Pertanyaan kosong')
  if (!A || !B || !C || !D || !E) errors.push('Ada opsi yang kosong')

  const validAnswer = ['A', 'B', 'C', 'D', 'E']
  if (!validAnswer.includes(correct_answer.toUpperCase())) {
    errors.push(`Jawaban benar "${correct_answer}" tidak valid (harus A–E)`)
  }

  return {
    rowNum,
    content, A, B, C, D, E,
    correct_answer: correct_answer.toUpperCase(),
    category,
    explanation,
    error: errors.length > 0 ? errors.join(', ') : undefined,
  }
}

async function parseFile(file: File): Promise<ParsedQuestion[]> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext !== 'csv' && ext !== 'xlsx' && ext !== 'xls') {
    throw new Error('Format file tidak didukung. Gunakan .csv atau .xlsx')
  }

  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wb: any = XLSX.read(buffer, { type: 'array', raw: false })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' })

  if (rawRows.length < 2) throw new Error('File kosong atau hanya berisi header.')

  const dataRowsRaw = rawRows.slice(1).filter((r) => {
    const row = r as unknown[]
    return row.some((c) => String(c ?? '').trim() !== '')
  })

  const isSingleColumn = dataRowsRaw.every((r) => {
    const row = r as unknown[]
    return row.filter((c) => String(c ?? '').trim() !== '').length === 1
  })

  if (isSingleColumn) {
    return dataRowsRaw.map((row, i) => {
      const cellValue = String((row as unknown[])[0] ?? '').trim()
      return buildQuestion(parseCSVRow(cellValue), i + 2)
    }).filter((q) => q.content || q.A)
  }

  return dataRowsRaw.map((row, i) => {
    const cells = (row as unknown[]).map((c) => String(c ?? '').trim())
    return buildQuestion(cells, i + 2)
  }).filter((q) => q.content || q.A)
}

export function BulkImportModal({ packageId, startIndex, onClose }: BulkImportModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[] | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null)
  const [promptCopied, setPromptCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function copyGeminiPrompt() {
    await navigator.clipboard.writeText(GEMINI_PROMPT)
    setPromptCopied(true)
    window.setTimeout(() => setPromptCopied(false), 2000)
  }

  const validQuestions = parsedQuestions?.filter((q) => !q.error) ?? []
  const invalidQuestions = parsedQuestions?.filter((q) => q.error) ?? []

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setParseError(null)
    setParsedQuestions(null)
    setImportResult(null)
    setIsParsing(true)
    try {
      setParsedQuestions(await parseFile(file))
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Gagal membaca file.')
    } finally {
      setIsParsing(false)
    }
  }

  async function handleImport() {
    if (validQuestions.length === 0) return

    const questions = validQuestions.map((q, i) => ({
      content: q.content,
      options: (['A', 'B', 'C', 'D', 'E'] as const).map((key) => ({
        key,
        text: q[key],
      })),
      correctAnswer: q.correct_answer,
      category: q.category || null,
      explanation: q.explanation || null,
      orderIndex: startIndex + i,
    }))

    const res = await fetch('/api/admin/questions/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId, questions }),
    })

    const data = await res.json() as { imported?: number; errors?: string[]; error?: string }
    if (!res.ok) {
      setImportResult({ imported: 0, errors: [data.error ?? 'Import gagal.'] })
      return
    }
    setImportResult({ imported: data.imported ?? 0, errors: data.errors ?? [] })
    startTransition(() => { router.refresh() })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">📥 Import Soal Massal</h2>
            <p className="text-xs text-gray-500 mt-0.5">Upload file Excel atau CSV berisi banyak soal sekaligus</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Langkah 1 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-800 mb-2">Langkah 1 — Download template</p>
            <div className="text-xs text-blue-700 mb-3 space-y-1">
              <p>Kolom wajib: <strong>content, A, B, C, D, E, correct_answer, category, explanation</strong></p>
              <p>• Isi <code className="bg-white/60 px-1 rounded">correct_answer</code> dengan salah satu A–E</p>
              <p>• <code className="bg-white/60 px-1 rounded">category</code> = kode sub-tes (mis. NUM, VER) — boleh dikosongkan</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={downloadTemplate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                ⬇️ Download template_soal.csv
              </button>
              <button type="button" onClick={copyGeminiPrompt}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-blue-300 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                {promptCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {promptCopied ? 'Prompt tersalin' : 'Salin prompt Gemini'}
              </button>
            </div>
          </div>

          {/* Langkah 2 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Langkah 2 — Upload file yang sudah diisi</p>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <span className="text-2xl">📂</span>
              <div>
                <p className="text-sm text-gray-700 font-medium">Klik untuk pilih file</p>
                <p className="text-xs text-gray-400">Format: .csv atau .xlsx · Maks. 10 MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {isParsing && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Membaca file...
            </div>
          )}

          {parseError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">❌ {parseError}</div>
          )}

          {parsedQuestions && !importResult && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{validQuestions.length}</p>
                  <p className="text-xs text-green-600">Soal valid, siap diimport</p>
                </div>
                <div className={`rounded-xl p-3 text-center border ${invalidQuestions.length > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-2xl font-bold ${invalidQuestions.length > 0 ? 'text-red-700' : 'text-gray-400'}`}>{invalidQuestions.length}</p>
                  <p className={`text-xs ${invalidQuestions.length > 0 ? 'text-red-600' : 'text-gray-400'}`}>Soal error (dilewati)</p>
                </div>
              </div>

              {invalidQuestions.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1 max-h-32 overflow-y-auto">
                  <p className="text-xs font-semibold text-red-700 mb-1">Baris bermasalah:</p>
                  {invalidQuestions.map((q) => (
                    <p key={q.rowNum} className="text-xs text-red-600">Baris {q.rowNum}: {q.error}</p>
                  ))}
                </div>
              )}

              {validQuestions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Preview {Math.min(3, validQuestions.length)} soal pertama:</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {validQuestions.slice(0, 3).map((q, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-2.5 text-xs border border-gray-200">
                        <p className="font-medium text-gray-800 line-clamp-1">{i + 1}. {q.content}</p>
                        <div className="flex gap-3 mt-1 text-gray-500 flex-wrap">
                          <span>Jawaban: <strong className="text-green-600">{q.correct_answer}</strong></span>
                          {q.category && <span>Kategori: <strong>{q.category}</strong></span>}
                        </div>
                      </div>
                    ))}
                    {validQuestions.length > 3 && (
                      <p className="text-xs text-gray-400 text-center">... dan {validQuestions.length - 3} soal lainnya</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {importResult && (
            <div className={`rounded-xl border p-4 ${importResult.imported > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              {importResult.imported > 0 && (
                <p className="text-green-800 font-semibold text-sm">✅ Berhasil mengimport {importResult.imported} soal!</p>
              )}
              {importResult.errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {importResult.errors.map((e, i) => <p key={i} className="text-red-600 text-xs">{e}</p>)}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          {importResult ? (
            <button onClick={onClose} className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Selesai</button>
          ) : (
            <>
              <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={handleImport} disabled={validQuestions.length === 0 || isPending}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isPending ? 'Mengimport...' : validQuestions.length > 0 ? `⬆️ Import ${validQuestions.length} Soal` : 'Pilih file dulu'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
