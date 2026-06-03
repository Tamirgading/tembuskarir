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
    // GAT sub-tes
    { value: 'NUM',    label: 'NUM — Numerik' },
    { value: 'VER',    label: 'VER — Verbal' },
    { value: 'SIL',    label: 'SIL — Silogisme' },
    { value: 'DER',    label: 'DER — Deret Angka' },
    { value: 'FIG',    label: 'FIG — Figural' },
    { value: 'PU',     label: 'PU — Pengetahuan Umum PLN' },
    { value: 'LA',     label: 'LA — Learning Agility' },
    { value: 'AKHLAK', label: 'AKHLAK — Nilai AKHLAK' },
    // Tahap 2: Akademik Kedinasan & BI
    { value: 'AKDING', label: 'AKDING — Akademik Kedinasan' },
    { value: 'BI',     label: 'BI — Bahasa Inggris' },
  ],
  BUMN: [
    { value: 'TWK',    label: 'TWK — Tes Wawasan Kebangsaan' },
    { value: 'VLR',    label: 'VLR — Verbal Logical Reasoning' },
    { value: 'WC',     label: 'WC — Word Classification' },
    { value: 'NS',     label: 'NS — Number Sequence' },
    { value: 'DIAG',   label: 'DIAG — Diagram Reasoning' },
    { value: 'AKHLAK', label: 'AKHLAK — Nilai AKHLAK (poin 1–5)' },
  ],
  DEFAULT: [
    { value: 'LAINNYA', label: 'LAINNYA' },
  ],
}

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'] as const

function parseOptions(raw: Option[] | unknown): Record<string, string> {
  const opts: Record<string, string> = { A: '', B: '', C: '', D: '', E: '' }
  if (!Array.isArray(raw)) return opts
  for (const o of raw as Option[]) {
    if (o.key && typeof o.text === 'string') opts[o.key] = o.text
  }
  return opts
}

export function EditQuestionModal({ question, packageId, pkgCategory, onClose }: EditQuestionModalProps) {
  const router = useRouter()
  const categoryOptions = CATEGORY_OPTIONS[pkgCategory] ?? CATEGORY_OPTIONS.DEFAULT

  const [content, setContent] = useState(question.content)
  const [options, setOptions] = useState(() => parseOptions(question.options))
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer)
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

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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
    // Opsi A–D wajib, opsi E opsional (4-opsi cukup untuk AKDING/BI/dll.)
    for (const key of ['A', 'B', 'C', 'D'] as const) {
      if (!options[key].trim()) { setError(`Opsi ${key} wajib diisi.`); return }
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

    // Sertakan opsi E hanya jika diisi (soal 4-opsi tidak perlu E)
    const optionsArray = OPTION_KEYS
      .filter((key) => key !== 'E' || options['E'].trim() !== '')
      .map((key) => ({ key, text: options[key].trim() }))

    setIsSaving(true)
    const res = await fetch('/api/admin/questions/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: question.id,
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

            {/* Opsi A–E */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600">
                Pilihan Jawaban <span className="text-red-500">*</span>
              </p>
              {OPTION_KEYS.map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                    correctAnswer === key ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>{key}</span>
                  <input
                    type="text"
                    value={options[key]}
                    onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={`Opsi ${key}`}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              ))}
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
