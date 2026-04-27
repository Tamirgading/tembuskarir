'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { RichTextarea } from '@/components/ui/RichTextarea'

interface Option {
  key: string
  text: string
  point?: number
}

interface Question {
  id: string
  content: string
  options: Option[] | unknown
  correct_answer: string
  explanation: string | null
  difficulty: string | null
  category: string | null
  image_url?: string | null
}

interface EditQuestionModalProps {
  question: Question
  packageId: string
  pkgCategory: string
  onClose: () => void
}

const CATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  CPNS: [
    { value: 'TWK', label: 'TWK — Tes Wawasan Kebangsaan' },
    { value: 'TIU', label: 'TIU — Tes Intelegensi Umum' },
    { value: 'TKP', label: 'TKP — Tes Karakteristik Pribadi' },
  ],
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

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'] as const
const TKP_POINT_VALUES = [1, 2, 3, 4, 5] as const

const TKP_POINT_COLOR: Record<number, string> = {
  5: 'bg-green-100 text-green-700 border-green-300',
  4: 'bg-blue-100 text-blue-700 border-blue-300',
  3: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  2: 'bg-orange-100 text-orange-700 border-orange-300',
  1: 'bg-red-100 text-red-700 border-red-300',
}

const TKP_POINT_LABEL: Record<number, string> = {
  5: 'Sangat Tepat',
  4: 'Tepat',
  3: 'Cukup Tepat',
  2: 'Kurang Tepat',
  1: 'Tidak Tepat',
}

function parseOptions(raw: Option[] | unknown): Record<string, string> {
  const opts: Record<string, string> = { A: '', B: '', C: '', D: '', E: '' }
  if (!Array.isArray(raw)) return opts
  for (const o of raw as Option[]) {
    if (o.key && typeof o.text === 'string') opts[o.key] = o.text
  }
  return opts
}

function parsePoints(raw: Option[] | unknown): Record<string, number> {
  const pts: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 }
  if (!Array.isArray(raw)) return pts
  for (const o of raw as Option[]) {
    if (o.key && typeof o.point === 'number') pts[o.key] = o.point
  }
  return pts
}

export function EditQuestionModal({ question, packageId, pkgCategory, onClose }: EditQuestionModalProps) {
  const router = useRouter()
  const categoryOptions = CATEGORY_OPTIONS[pkgCategory] ?? CATEGORY_OPTIONS.DEFAULT

  const [content, setContent] = useState(question.content)
  const [options, setOptions] = useState(() => parseOptions(question.options))
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer)
  const [optionPoints, setOptionPoints] = useState(() => parsePoints(question.options))
  const [explanation, setExplanation] = useState(question.explanation ?? '')
  const [category, setCategory] = useState(question.category ?? '')
  const [difficulty, setDifficulty] = useState(question.difficulty ?? 'medium')

  // Images
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(question.image_url ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(question.image_url ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [explImagePreviewUrl, setExplImagePreviewUrl] = useState<string | null>(null)
  const [explImageFile, setExplImageFile] = useState<File | null>(null)
  const [uploadedExplImageUrl, setUploadedExplImageUrl] = useState<string | null>(null)
  const explFileInputRef = useRef<HTMLInputElement>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTkp = category === 'TKP'
  const maxPoint = isTkp ? Math.max(...OPTION_KEYS.map((k) => optionPoints[k])) : -1

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function getTkpCorrectAnswer(): string {
    return OPTION_KEYS.reduce((best, key) =>
      (optionPoints[key] ?? 0) > (optionPoints[best] ?? 0) ? key : best
    , 'A' as string)
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!content.trim()) { setError('Pertanyaan wajib diisi.'); return }
    for (const key of OPTION_KEYS) {
      if (!options[key].trim()) { setError(`Opsi ${key} wajib diisi.`); return }
    }
    if (isTkp) {
      const pts = OPTION_KEYS.map((k) => optionPoints[k])
      if (new Set(pts).size !== 5) {
        setError('Soal TKP: setiap opsi harus punya nilai yang berbeda (1, 2, 3, 4, 5).')
        return
      }
    }

    let finalImageUrl: string | null = uploadedImageUrl
    if (imageFile && !uploadedImageUrl) {
      finalImageUrl = await uploadImage(imageFile)
      if (finalImageUrl === null) return
      setUploadedImageUrl(finalImageUrl)
    }
    // If image was removed (previewUrl null but no new file), clear it
    if (!imagePreviewUrl && !imageFile) finalImageUrl = null

    let finalExplImageUrl: string | null = uploadedExplImageUrl
    if (explImageFile && !uploadedExplImageUrl) {
      finalExplImageUrl = await uploadImage(explImageFile)
      if (finalExplImageUrl === null) return
      setUploadedExplImageUrl(finalExplImageUrl)
    }

    const optionsArray = OPTION_KEYS.map((key) => ({
      key,
      text: options[key].trim(),
      ...(isTkp ? { point: optionPoints[key] } : {}),
    }))
    const finalCorrectAnswer = isTkp ? getTkpCorrectAnswer() : correctAnswer

    setIsSaving(true)
    const res = await fetch('/api/admin/questions/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: question.id,
        packageId,
        content: content.trim(),
        options: optionsArray,
        correctAnswer: finalCorrectAnswer,
        explanation: explanation.trim() || null,
        explanationImageUrl: finalExplImageUrl,
        category: category || null,
        difficulty,
        imageUrl: finalImageUrl,
      }),
    })
    setIsSaving(false)

    const data = await res.json() as { error?: string }
    if (!res.ok) { setError(data.error ?? 'Gagal memperbarui soal.'); return }

    router.refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Edit Soal</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <form id="edit-form" onSubmit={handleSave} className="space-y-4 text-sm">

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
                Gambar Soal <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              {imagePreviewUrl ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreviewUrl} alt="Preview gambar soal" className="max-h-40 rounded-lg border border-gray-200 object-contain" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreviewUrl(null); setUploadedImageUrl(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >×</button>
                </div>
              ) : (
                <label className="flex items-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg px-3 py-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <span className="text-gray-500 text-xs">Klik untuk pilih gambar (JPG, PNG, WebP)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null
                      setImageFile(file)
                      setUploadedImageUrl(null)
                      setImagePreviewUrl(file ? URL.createObjectURL(file) : null)
                    }}
                    className="hidden"
                  />
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

            {/* Info TKP */}
            {isTkp && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-xs text-green-800">
                <p className="font-bold mb-1">Mode TKP — Nilai per Opsi (1–5)</p>
                <p>Klik angka di kanan setiap opsi untuk menentukan nilainya. Setiap opsi harus punya nilai yang berbeda.</p>
              </div>
            )}

            {/* Opsi A–E */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600">
                Pilihan Jawaban <span className="text-red-500">*</span>
                {isTkp && <span className="ml-2 font-normal text-green-600">— klik angka untuk atur nilai</span>}
              </p>
              {OPTION_KEYS.map((key) => {
                const point = optionPoints[key]
                const isHighest = isTkp && point === maxPoint
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                      isTkp
                        ? isHighest ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                        : correctAnswer === key ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>{key}</span>
                    <input
                      type="text"
                      value={options[key]}
                      onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`Opsi ${key}`}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    {isTkp && (
                      <div className="flex gap-1 shrink-0">
                        {TKP_POINT_VALUES.map((val) => (
                          <button
                            key={val}
                            type="button"
                            title={TKP_POINT_LABEL[val]}
                            onClick={() => setOptionPoints((prev) => ({ ...prev, [key]: val }))}
                            className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                              point === val
                                ? (TKP_POINT_COLOR[val] ?? '') + ' shadow-sm scale-110'
                                : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-400'
                            }`}
                          >{val}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* TKP ringkasan nilai */}
            {isTkp && (
              <div className="flex gap-2 flex-wrap">
                {OPTION_KEYS.map((key) => {
                  const point = optionPoints[key]
                  return (
                    <span key={key} className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${TKP_POINT_COLOR[point] ?? ''}`}>
                      {key} = {point}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Jawaban Benar — non-TKP */}
            {!isTkp && (
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
            )}

            {/* Pembahasan */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">
                Pembahasan <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <RichTextarea
                value={explanation}
                onChange={setExplanation}
                rows={3}
                placeholder="Penjelasan mengapa jawaban ini benar..."
              />

              {/* Gambar pembahasan */}
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Gambar Pembahasan <span className="text-gray-400">(opsional)</span></p>
                {explImagePreviewUrl ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={explImagePreviewUrl} alt="Preview gambar pembahasan" className="max-h-40 rounded-lg border border-amber-200 object-contain" />
                    <button
                      type="button"
                      onClick={() => { setExplImageFile(null); setExplImagePreviewUrl(null); setUploadedExplImageUrl(null); if (explFileInputRef.current) explFileInputRef.current.value = '' }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    >×</button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 w-full border-2 border-dashed border-amber-200 rounded-lg px-3 py-3 cursor-pointer hover:border-amber-300 hover:bg-amber-50 transition-colors">
                    <span className="text-gray-500 text-xs">Klik untuk pilih gambar pembahasan</span>
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

            {/* Preview pembahasan existing */}
            {!explImagePreviewUrl && (
              <div className="text-xs text-gray-400">
                Catatan: gambar pembahasan yang sudah ada tidak ditampilkan di sini. Upload baru untuk mengganti.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="edit-form"
            disabled={isSaving || isUploading}
            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Mengupload...' : isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  )
}
