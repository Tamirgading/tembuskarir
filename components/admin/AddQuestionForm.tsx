'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

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

  const [content, setContent] = useState('')
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '', E: '' })
  const [correctAnswer, setCorrectAnswer] = useState('A')
  const [explanation, setExplanation] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('medium')

  function resetForm() {
    setContent('')
    setOptions({ A: '', B: '', C: '', D: '', E: '' })
    setCorrectAnswer('A')
    setExplanation('')
    setCategory('')
    setDifficulty('medium')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validasi semua opsi diisi
    for (const key of OPTION_KEYS) {
      if (!options[key].trim()) {
        setError(`Opsi ${key} wajib diisi.`)
        return
      }
    }

    if (!content.trim()) {
      setError('Pertanyaan wajib diisi.')
      return
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
      }),
    })

    const data = await res.json() as { error?: string }

    if (!res.ok) {
      setError(data.error ?? 'Gagal menyimpan soal.')
      return
    }

    setSuccess(true)
    resetForm()
    startTransition(() => {
      router.refresh()
    })

    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {/* Pertanyaan */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Pertanyaan <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Tulis pertanyaan di sini..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
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
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {OPTION_KEYS.map((key) => (
            <option key={key} value={key}>
              {key} — {options[key] ? options[key].substring(0, 40) : `Opsi ${key}`}
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
          Pembahasan / Penjelasan{' '}
          <span className="text-gray-400 font-normal">(opsional)</span>
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={3}
          placeholder="Penjelasan mengapa jawaban ini benar..."
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
        disabled={isPending}
        className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? 'Menyimpan...' : '+ Simpan Soal'}
      </button>
    </form>
  )
}
