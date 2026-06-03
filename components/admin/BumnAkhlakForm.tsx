'use client'

/**
 * BumnAkhlakForm — Form tambah soal AKHLAK BUMN (point-based).
 * Menyimpan ke tabel public.questions dengan options berisi "point" per opsi.
 * Format: [{"key":"A","text":"...","point":5}, ...]
 * correct_answer = key dengan point tertinggi (auto-set).
 */

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface BumnAkhlakFormProps {
  packageId: string
}

const POINT_COLORS: Record<number, string> = {
  5: 'bg-green-100 text-green-700 border-green-300 ring-green-400',
  4: 'bg-lime-100 text-lime-700 border-lime-300 ring-lime-400',
  3: 'bg-amber-100 text-amber-700 border-amber-300 ring-amber-400',
  2: 'bg-orange-100 text-orange-700 border-orange-300 ring-orange-400',
  1: 'bg-red-100 text-red-700 border-red-300 ring-red-400',
}

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'] as const

export function BumnAkhlakForm({ packageId }: BumnAkhlakFormProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [content, setContent]   = useState('')
  const [options, setOptions]   = useState<Record<string, string>>({ A: '', B: '', C: '', D: '', E: '' })
  const [points, setPoints]     = useState<Record<string, number>>({ A: 5, B: 4, C: 3, D: 2, E: 1 })
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  function setPoint(key: string, val: number) {
    setPoints((p) => ({ ...p, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!content.trim()) { setError('Teks soal wajib diisi.'); return }
    for (const k of OPTION_KEYS) {
      if (!options[k].trim()) { setError(`Opsi ${k} wajib diisi.`); return }
    }

    // correct_answer = key dengan point tertinggi
    const best = OPTION_KEYS.reduce((prev, cur) => points[cur] > points[prev] ? cur : prev, 'A' as string)

    const optionsArr = OPTION_KEYS.map((k) => ({
      key: k,
      text: options[k].trim(),
      point: points[k],
    }))

    setSaving(true)
    const res = await fetch('/api/admin/questions/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageId,
        content: content.trim(),
        options: optionsArr,
        correctAnswer: best,
        category: 'AKHLAK',
        difficulty: 'medium',
        explanation: '',
      }),
    })
    setSaving(false)

    const data = await res.json() as { error?: string }
    if (!res.ok) { setError(data.error ?? 'Gagal menyimpan soal.'); return }

    setSuccess('Soal AKHLAK berhasil ditambahkan!')
    setContent('')
    setOptions({ A: '', B: '', C: '', D: '', E: '' })
    setPoints({ A: 5, B: 4, C: 3, D: 2, E: 1 })
    startTransition(() => router.refresh())
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">

      <p className="text-xs text-ink-muted leading-relaxed bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
        Soal AKHLAK BUMN: setiap opsi diberi nilai <strong>1–5</strong> sesuai kesesuaian dengan nilai AKHLAK.
        Tidak ada jawaban benar/salah — semua dapat dipilih.
      </p>

      {/* Teks skenario */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Skenario / Pertanyaan <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Saat rekan kerja mengalami kesulitan, Anda..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          required
        />
      </div>

      {/* Opsi A–E dengan poin */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-600">
          Pilihan Jawaban + Nilai Poin <span className="text-red-500">*</span>
        </p>
        {OPTION_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-2">
            {/* Label opsi */}
            <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              {key}
            </span>

            {/* Teks opsi */}
            <input
              type="text"
              value={options[key]}
              onChange={(e) => setOptions((o) => ({ ...o, [key]: e.target.value }))}
              placeholder={`Opsi ${key}`}
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

            {/* Poin 1–5 */}
            <div className="flex gap-1 shrink-0">
              {[5, 4, 3, 2, 1].map((val) => {
                const isActive = points[key] === val
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPoint(key, val)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                      isActive
                        ? `${POINT_COLORS[val]} ring-2 scale-110 shadow-sm`
                        : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {error   && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
      >
        {saving ? 'Menyimpan...' : '+ Tambah Soal AKHLAK'}
      </button>
    </form>
  )
}
