'use client'

import { useState, useTransition, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ClipboardPaste } from 'lucide-react'
import { LatexContent } from '@/components/ui/LatexContent'
import { RichTextarea } from '@/components/ui/RichTextarea'
import { parseQuestionSnippet } from '@/lib/question-csv'
import { getStreamBySlug } from '@/lib/antam-config'

interface AddQuestionFormProps {
  packageId: string
  pkgCategory: string
  pkgSlug?: string
}

// Pilihan kategori per tipe paket
const CATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  ASTRA: [
    { value: 'QR',  label: 'QR — Quantitative Reasoning' },
    { value: 'DR',  label: 'DR — Deductive Reasoning' },
    { value: 'RC',  label: 'RC — Reading Comprehension' },
    { value: 'IR',  label: 'IR — Inductive Reasoning' },
    { value: 'VIZ', label: 'VIZ — Visualization' },
    { value: 'PS',  label: 'PS — Perceptual Speed' },
    { value: 'WM',  label: 'WM — Working Memory' },
  ],
  PLN: [
    { value: 'NUM', label: 'NUM — Numerik' },
    { value: 'VER', label: 'VER — Verbal' },
    { value: 'SIL', label: 'SIL — Silogisme' },
    { value: 'DER', label: 'DER — Deret Angka' },
    { value: 'FIG', label: 'FIG — Figural' },
    { value: 'PU',  label: 'PU — Pengetahuan Umum PLN' },
  ],
  DEFAULT: [
    { value: 'LAINNYA', label: 'LAINNYA' },
  ],
}

function getAntamCategoryOptions(slug?: string): { value: string; label: string }[] {
  if (!slug) return CATEGORY_OPTIONS.DEFAULT
  const stream = getStreamBySlug(slug)
  if (!stream) return CATEGORY_OPTIONS.DEFAULT
  return stream.topics.map((t, i) => ({
    value: `T${i + 1}`,
    label: `T${i + 1} — ${t.name}`,
  }))
}

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'] as const

export function AddQuestionForm({ packageId, pkgCategory, pkgSlug }: AddQuestionFormProps) {
  const categoryOptions = pkgCategory === 'ANTAM'
    ? getAntamCategoryOptions(pkgSlug)
    : (CATEGORY_OPTIONS[pkgCategory] ?? CATEGORY_OPTIONS.DEFAULT)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState('')
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '', E: '' })
  const [correctAnswer, setCorrectAnswer] = useState('A')
  const [explanation, setExplanation] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [showSnippetImporter, setShowSnippetImporter] = useState(false)
  const [snippet, setSnippet] = useState('')
  const [snippetMessage, setSnippetMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null)

  // Gambar pembahasan
  const [explImageFile, setExplImageFile] = useState<File | null>(null)
  const [explImagePreviewUrl, setExplImagePreviewUrl] = useState<string | null>(null)
  const [uploadedExplImageUrl, setUploadedExplImageUrl] = useState<string | null>(null)
  const explFileInputRef = useRef<HTMLInputElement>(null)

  function resetForm() {
    setContent('')
    setOptions({ A: '', B: '', C: '', D: '', E: '' })
    setCorrectAnswer('A')
    setExplanation('')
    setCategory('')
    setDifficulty('medium')
    setError(null)
    setShowPreview(false)
    setImageFile(null)
    setImagePreviewUrl(null)
    setUploadedImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setSnippet('')
    setSnippetMessage(null)
    setShowSnippetImporter(false)
    setExplImageFile(null)
    setExplImagePreviewUrl(null)
    setUploadedExplImageUrl(null)
    if (explFileInputRef.current) explFileInputRef.current.value = ''
  }

  function handleApplySnippet() {
    setSnippetMessage(null)
    setError(null)
    setSuccess(false)
    try {
      const parsed = parseQuestionSnippet(snippet)
      setContent(parsed.content)
      setOptions(parsed.options)
      setCorrectAnswer(parsed.correctAnswer)
      setCategory(parsed.category)
      setExplanation(parsed.explanation)
      setSnippetMessage({ type: 'success', text: 'Snippet berhasil dimasukkan. Periksa kembali sebelum menyimpan.' })
    } catch (err) {
      setSnippetMessage({ type: 'error', text: err instanceof Error ? err.message : 'Snippet tidak dapat dibaca.' })
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setUploadedImageUrl(null)
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file))
    } else {
      setImagePreviewUrl(null)
    }
  }

  function removeImage() {
    setImageFile(null)
    setImagePreviewUrl(null)
    setUploadedImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/questions/upload-image', { method: 'POST', body: fd })
    setIsUploading(false)
    const data = await res.json() as { url?: string; error?: string }
    if (!res.ok) { setError(data.error ?? 'Gagal mengupload gambar.'); return null }
    return data.url ?? null
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!content.trim()) { setError('Pertanyaan wajib diisi.'); return }
    const isPS = category === 'PS'
    const requiredKeys = isPS ? (['A', 'B'] as const) : OPTION_KEYS
    for (const key of requiredKeys) {
      if (!options[key].trim()) { setError(`Opsi ${key} wajib diisi.`); return }
    }

    let finalImageUrl: string | null = uploadedImageUrl
    if (imageFile && !uploadedImageUrl) {
      finalImageUrl = await uploadImage(imageFile)
      if (imageFile && finalImageUrl === null) return
      setUploadedImageUrl(finalImageUrl)
    }

    let finalExplImageUrl: string | null = uploadedExplImageUrl
    if (explImageFile && !uploadedExplImageUrl) {
      finalExplImageUrl = await uploadImage(explImageFile)
      if (explImageFile && finalExplImageUrl === null) return
      setUploadedExplImageUrl(finalExplImageUrl)
    }

    const optionsArray = OPTION_KEYS
      .filter((key) => isPS ? options[key].trim() !== '' : true)
      .map((key) => ({ key, text: options[key].trim() }))

    const res = await fetch('/api/admin/questions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageId,
        content: content.trim(),
        options: optionsArray,
        correctAnswer,
        explanation: explanation.trim() || null,
        explanationImageUrl: finalExplImageUrl,
        category: category || null,
        difficulty,
        imageUrl: finalImageUrl,
      }),
    })

    const data = await res.json() as { error?: string }
    if (!res.ok) { setError(data.error ?? 'Gagal menyimpan soal.'); return }

    setSuccess(true)
    resetForm()
    startTransition(() => { router.refresh() })
    setTimeout(() => setSuccess(false), 3000)
  }

  const isSubmitting = isPending || isUploading

  return (
    <div className="space-y-4 text-sm">
      {/* Toggle preview */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            showPreview
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          {showPreview ? '✏️ Mode Edit' : '👁 Pratinjau LaTeX'}
        </button>
      </div>

      {/* ── PREVIEW MODE ── */}
      {showPreview && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-4">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Pratinjau Soal</p>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-400 mb-1">Pertanyaan:</p>
            <div className="text-gray-900 text-sm leading-relaxed">
              {content ? <LatexContent content={content} plain={category === 'PS'} /> : <span className="text-gray-300 italic">Belum ada pertanyaan...</span>}
            </div>
            {imagePreviewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreviewUrl} alt="Preview gambar soal" className="mt-3 max-h-48 object-contain border border-gray-200 rounded-lg mx-auto block" />
            )}
          </div>
          <div className="space-y-1.5">
            {OPTION_KEYS.map((key) => {
              const isCorrect = correctAnswer === key
              return (
                <div key={key} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm border ${
                  isCorrect ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                }`}>
                  <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>{key}</span>
                  <span className="flex-1 text-gray-700">
                    {options[key] ? <LatexContent content={options[key]} plain={category === 'PS'} /> : <span className="text-gray-300 italic">Kosong</span>}
                  </span>
                  {isCorrect && <span className="ml-auto shrink-0 text-green-500 text-xs">✓ Benar</span>}
                </div>
              )
            })}
          </div>
          {(explanation || explImagePreviewUrl) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 space-y-2">
              <p className="text-xs font-semibold text-amber-700">Pembahasan:</p>
              {explanation && <div className="text-sm text-amber-800"><LatexContent content={explanation} /></div>}
              {explImagePreviewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={explImagePreviewUrl} alt="Preview gambar pembahasan" className="max-h-40 rounded-lg border border-amber-300 object-contain mx-auto block" />
              )}
            </div>
          )}
        </div>
      )}

      {/* ── EDIT MODE ── */}
      {!showPreview && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tempel Snippet */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 overflow-hidden">
            <button type="button"
              onClick={() => setShowSnippetImporter((v) => !v)}
              className="w-full flex items-center gap-2 px-3 py-3 text-left text-indigo-900 hover:bg-indigo-50 transition-colors">
              <ClipboardPaste className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-xs font-semibold">Tempel Snippet</span>
              {showSnippetImporter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSnippetImporter && (
              <div className="border-t border-indigo-200 px-3 py-3 space-y-2.5">
                <textarea
                  value={snippet}
                  onChange={(e) => { setSnippet(e.target.value); setSnippetMessage(null) }}
                  rows={5}
                  placeholder={'Tempel satu baris CSV soal di sini...\n\n"Pertanyaan...","Opsi A","Opsi B","Opsi C","Opsi D","Opsi E","C","QR","Pembahasan..."'}
                  className="w-full resize-y rounded-lg border border-indigo-200 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <p className="text-[11px] leading-relaxed text-indigo-600">
                  9 kolom: content, A, B, C, D, E, correct_answer, category, explanation. Mendukung <code className="font-mono">[[NL]]</code> dan LaTeX.
                </p>
                <button type="button" onClick={handleApplySnippet}
                  className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors">
                  Isi Form dari Snippet
                </button>

                {snippetMessage && (
                  <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                    snippetMessage.type === 'success'
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : snippetMessage.type === 'warning'
                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                  }`}>
                    {snippetMessage.type === 'success'
                      ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      : <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                    <span>{snippetMessage.text}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pertanyaan */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <RichTextarea
              value={content}
              onChange={setContent}
              rows={4}
              placeholder="Tulis pertanyaan... Gunakan $x^2$ untuk LaTeX atau klik tombol list di atas"
              required
            />
          </div>

          {/* Gambar soal */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Gambar Soal <span className="text-gray-400 font-normal">(opsional, maks. 5 MB)</span>
            </label>
            {imagePreviewUrl ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreviewUrl} alt="Preview" className="max-h-40 rounded-lg border border-gray-200 object-contain" />
                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
              </div>
            ) : (
              <label className="flex items-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg px-3 py-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <span className="text-lg">🖼️</span>
                <span className="text-gray-500 text-xs">Klik untuk pilih gambar (JPG, PNG, WebP)</span>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Kategori & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sub-tes</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">— Pilih Sub-tes —</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {pkgCategory === 'PLN' && (
                <p className="text-[10px] text-gray-400 mt-1">
                  AKHLAK & LA dikelola via SQL (tabel terpisah)
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tingkat Kesulitan</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="easy">Mudah</option>
                <option value="medium">Sedang</option>
                <option value="hard">Sulit</option>
              </select>
            </div>
          </div>

          {/* Opsi A–E */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">
              Pilihan Jawaban <span className="text-red-500">*</span>
            </p>
            {OPTION_KEYS.map((key) => {
              const isRequired = category === 'PS' ? (key === 'A' || key === 'B') : true
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                    correctAnswer === key ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>{key}</span>
                  <input
                    type="text"
                    value={options[key]}
                    onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={isRequired ? `Opsi ${key} — bisa pakai $LaTeX$` : `Opsi ${key} (opsional)`}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required={isRequired}
                  />
                </div>
              )
            })}
          </div>

          {/* Jawaban Benar */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Jawaban Benar <span className="text-red-500">*</span>
            </label>
            <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              {OPTION_KEYS.map((key) => (
                <option key={key} value={key}>{key} — {options[key] ? options[key].substring(0, 40) : `Opsi ${key}`}</option>
              ))}
            </select>
          </div>

          {/* Pembahasan */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600">
              Pembahasan <span className="text-gray-400 font-normal">(opsional, support LaTeX)</span>
            </label>
            <RichTextarea
              value={explanation}
              onChange={setExplanation}
              rows={3}
              placeholder="Penjelasan mengapa jawaban ini benar... bisa pakai $LaTeX$"
            />

            {/* Gambar pembahasan */}
            <div>
              <p className="text-xs text-gray-500 mb-1.5">
                Gambar Pembahasan <span className="text-gray-400">(opsional, maks. 5 MB)</span>
              </p>
              {explImagePreviewUrl ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={explImagePreviewUrl} alt="Preview gambar pembahasan" className="max-h-40 rounded-lg border border-amber-200 object-contain" />
                  <button
                    type="button"
                    onClick={() => {
                      setExplImageFile(null)
                      setExplImagePreviewUrl(null)
                      setUploadedExplImageUrl(null)
                      if (explFileInputRef.current) explFileInputRef.current.value = ''
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 w-full border-2 border-dashed border-amber-200 rounded-lg px-3 py-3 cursor-pointer hover:border-amber-300 hover:bg-amber-50 transition-colors">
                  <span className="text-lg">💡</span>
                  <span className="text-gray-500 text-xs">Klik untuk pilih gambar pembahasan (JPG, PNG, WebP)</span>
                  <input
                    ref={explFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null
                      setExplImageFile(file)
                      setUploadedExplImageUrl(null)
                      setExplImagePreviewUrl(file ? URL.createObjectURL(file) : null)
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Feedback */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">❌ {error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-3 py-2">✅ Soal berhasil ditambahkan!</div>}

          <button type="submit" disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {isUploading ? '⬆️ Mengupload gambar...' : isPending ? 'Menyimpan...' : '+ Simpan Soal'}
          </button>
        </form>
      )}

      {showPreview && (
        <button type="button" onClick={() => setShowPreview(false)}
          className="w-full py-2 border border-blue-300 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
          ← Kembali ke Form
        </button>
      )}
    </div>
  )
}
