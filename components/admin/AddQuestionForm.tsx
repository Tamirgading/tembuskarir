'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LatexContent } from '@/components/ui/LatexContent'

interface AddQuestionFormProps {
  packageId: string
  nextIndex: number
}

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'] as const

export function AddQuestionForm({ packageId, nextIndex }: AddQuestionFormProps) {
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
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setUploadedImageUrl(null)
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setImagePreviewUrl(objectUrl)
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

  async function uploadImage(file: File): Promise<string | null> {
    setIsUploading(true)
    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('/api/admin/questions/upload-image', {
      method: 'POST',
      body: fd,
    })

    setIsUploading(false)

    const data = await res.json() as { url?: string; error?: string }
    if (!res.ok) {
      setError(data.error ?? 'Gagal mengupload gambar.')
      return null
    }
    return data.url ?? null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!content.trim()) {
      setError('Pertanyaan wajib diisi.')
      return
    }

    for (const key of OPTION_KEYS) {
      if (!options[key].trim()) {
        setError(`Opsi ${key} wajib diisi.`)
        return
      }
    }

    // Upload gambar jika ada
    let finalImageUrl: string | null = uploadedImageUrl
    if (imageFile && !uploadedImageUrl) {
      finalImageUrl = await uploadImage(imageFile)
      if (imageFile && finalImageUrl === null) return // upload gagal, error sudah di-set
      setUploadedImageUrl(finalImageUrl)
    }

    const optionsArray = OPTION_KEYS.map((key) => ({
      key,
      text: options[key].trim(),
    }))

    const res = await fetch('/api/admin/questions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageId,
        content: content.trim(),
        options: optionsArray,
        correctAnswer,
        explanation: explanation.trim() || null,
        category: category || null,
        difficulty,
        orderIndex: nextIndex,
        imageUrl: finalImageUrl,
      }),
    })

    const data = await res.json() as { error?: string }

    if (!res.ok) {
      setError(data.error ?? 'Gagal menyimpan soal.')
      return
    }

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

      {/* ── PREVIEW MODE ─────────────────────────────────────────────────────── */}
      {showPreview && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-4">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Pratinjau Soal</p>

          {/* Konten */}
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-400 mb-1">Pertanyaan:</p>
            <div className="text-gray-900 text-sm leading-relaxed">
              {content ? <LatexContent content={content} /> : <span className="text-gray-300 italic">Belum ada pertanyaan...</span>}
            </div>
            {imagePreviewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreviewUrl} alt="Preview gambar soal" className="mt-3 max-w-full rounded-lg max-h-48 object-contain border border-gray-200" />
            )}
          </div>

          {/* Opsi */}
          <div className="space-y-1.5">
            {OPTION_KEYS.map((key) => (
              <div
                key={key}
                className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${
                  correctAnswer === key
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                  correctAnswer === key ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {key}
                </span>
                <span className={correctAnswer === key ? 'text-green-800' : 'text-gray-700'}>
                  {options[key] ? <LatexContent content={options[key]} /> : <span className="text-gray-300 italic">Kosong</span>}
                </span>
                {correctAnswer === key && <span className="ml-auto text-green-500 text-xs">✓ Benar</span>}
              </div>
            ))}
          </div>

          {explanation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-xs font-semibold text-amber-700 mb-1">Pembahasan:</p>
              <div className="text-sm text-amber-800">
                <LatexContent content={explanation} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── EDIT MODE ────────────────────────────────────────────────────────── */}
      {!showPreview && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pertanyaan */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Pertanyaan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Tulis pertanyaan... Gunakan $x^2$ untuk LaTeX inline atau $$\frac{a}{b}$$ untuk blok"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <p className="text-xs text-gray-400 mt-0.5">
              Tips: <code className="bg-gray-100 px-1 rounded">$formula$</code> untuk inline, <code className="bg-gray-100 px-1 rounded">$$formula$$</code> untuk blok
            </p>
          </div>

          {/* Gambar soal */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Gambar Soal <span className="text-gray-400 font-normal">(opsional, maks. 5 MB)</span>
            </label>

            {imagePreviewUrl ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="max-h-40 rounded-lg border border-gray-200 object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg px-3 py-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <span className="text-lg">🖼️</span>
                <span className="text-gray-500 text-xs">Klik untuk pilih gambar (JPG, PNG, WebP)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Opsi A–E */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">
              Pilihan Jawaban <span className="text-red-500">*</span>
            </p>
            {OPTION_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                    correctAnswer === key
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {key}
                </span>
                <input
                  type="text"
                  value={options[key]}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  placeholder={`Opsi ${key} — bisa pakai $LaTeX$`}
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
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {OPTION_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key} — {options[key] ? options[key].substring(0, 35) : `Opsi ${key}`}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Kategori / Sub-tes
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">— Pilih —</option>
                <option value="TWK">TWK</option>
                <option value="TIU">TIU</option>
                <option value="TKP">TKP</option>
                <option value="LAINNYA">LAINNYA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="easy">Mudah</option>
                <option value="medium">Sedang</option>
                <option value="hard">Sulit</option>
              </select>
            </div>
          </div>

          {/* Penjelasan */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Pembahasan{' '}
              <span className="text-gray-400 font-normal">(opsional, support LaTeX)</span>
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              placeholder="Penjelasan mengapa jawaban ini benar... bisa pakai $LaTeX$"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Feedback */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-3 py-2">
              ✅ Soal berhasil ditambahkan!
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? '⬆️ Mengupload gambar...' : isPending ? 'Menyimpan...' : '+ Simpan Soal'}
          </button>
        </form>
      )}

      {/* Submit button tetap muncul saat mode preview */}
      {showPreview && (
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className="w-full py-2 border border-blue-300 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
        >
          ← Kembali ke Form
        </button>
      )}
    </div>
  )
}
