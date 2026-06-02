'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

// ── Konstanta ──────────────────────────────────────────────────────────────────
const POINT_COLORS: Record<number, { btn: string; label: string }> = {
  5: { btn: 'bg-green-500 text-white',  label: 'Paling tepat' },
  4: { btn: 'bg-brand text-white',      label: 'Tepat' },
  3: { btn: 'bg-amber-400 text-white',  label: 'Cukup' },
  2: { btn: 'bg-orange-500 text-white', label: 'Kurang' },
  1: { btn: 'bg-red-500 text-white',    label: 'Tidak tepat' },
}
const INACTIVE_BTN = 'bg-paper-soft text-ink-muted border border-hairline hover:border-ink-muted'

const AKHLAK_VALUE_TAGS = [
  { v: 'amanah',      l: 'Amanah' },
  { v: 'kompeten',    l: 'Kompeten' },
  { v: 'harmonis',    l: 'Harmonis' },
  { v: 'loyal',       l: 'Loyal' },
  { v: 'adaptif',     l: 'Adaptif' },
  { v: 'kolaboratif', l: 'Kolaboratif' },
]

const LA_DIMENSIONS = [
  { v: 'mental',  l: 'Kecerdasan Mental' },
  { v: 'people',  l: 'Kepemimpinan (People)' },
  { v: 'change',  l: 'Ketangkasan Perubahan' },
  { v: 'results', l: 'Orientasi Hasil' },
  { v: 'self',    l: 'Kesadaran Diri' },
]

const OPT_KEYS = ['A', 'B', 'C', 'D', 'E'] as const
const OPT_KEY_LOWER = ['a', 'b', 'c', 'd', 'e'] as const

type FormType = 'AKHLAK' | 'LA'

interface FormState {
  content: string
  opts: Record<string, string>
  points: Record<string, number>
  valueTag: string
  dimension: string
  isReverse: boolean
  explanation: string
}

const EMPTY: FormState = {
  content: '', opts: { A: '', B: '', C: '', D: '', E: '' },
  points: { A: 3, B: 3, C: 3, D: 3, E: 3 },
  valueTag: 'amanah', dimension: 'change', isReverse: false, explanation: '',
}

// Prefill opsi LA dengan skala Likert standar
const LA_PREFILL = { A: 'Sangat tidak setuju', B: 'Tidak setuju', C: 'Netral', D: 'Setuju', E: 'Sangat setuju' }
const LA_POINTS_PREFILL = { A: 1, B: 2, C: 3, D: 4, E: 5 }

interface Props { packageId: string }

export function PlnSpecialForms({ packageId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formType, setFormType] = useState<FormType>('AKHLAK')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  function setOpt(key: string, val: string) {
    setForm((prev) => ({ ...prev, opts: { ...prev.opts, [key]: val } }))
  }

  function setPoint(key: string, val: number) {
    setForm((prev) => ({ ...prev, points: { ...prev.points, [key]: val } }))
  }

  function switchType(t: FormType) {
    setFormType(t)
    setError('')
    setSuccess(false)
    // Prefill LA options
    if (t === 'LA') {
      setForm({ ...EMPTY, opts: { ...LA_PREFILL }, points: { ...LA_POINTS_PREFILL }, dimension: 'change' })
    } else {
      setForm({ ...EMPTY })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!form.content.trim()) { setError('Konten soal wajib diisi.'); return }
    for (const k of OPT_KEYS) {
      if (!form.opts[k].trim()) { setError(`Opsi ${k} wajib diisi.`); return }
    }

    const endpoint = formType === 'AKHLAK' ? '/api/admin/questions/pln-akhlak' : '/api/admin/questions/pln-la'
    const body = {
      packageId,
      content: form.content,
      ...Object.fromEntries(OPT_KEY_LOWER.map((k, i) => [`opt_${k}`, form.opts[OPT_KEYS[i]]])),
      ...Object.fromEntries(OPT_KEY_LOWER.map((k, i) => [`point_${k}`, form.points[OPT_KEYS[i]]])),
      ...(formType === 'AKHLAK' ? { value_tag: form.valueTag } : { dimension: form.dimension, is_reverse_scored: form.isReverse }),
      explanation: form.explanation || undefined,
    }

    startTransition(async () => {
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const json = await res.json() as { id?: string; error?: string }
        if (!res.ok) { setError(json.error ?? 'Gagal menyimpan.'); return }
        setSuccess(true)
        setForm(formType === 'LA' ? { ...EMPTY, opts: { ...LA_PREFILL }, points: { ...LA_POINTS_PREFILL }, dimension: 'change' } : { ...EMPTY })
        setTimeout(() => setSuccess(false), 3000)
        router.refresh()
      } catch {
        setError('Terjadi kesalahan.')
      }
    })
  }

  return (
    <div className="space-y-4 text-sm">
      {/* Tab type */}
      <div className="flex gap-2 p-1 bg-paper-soft rounded-xl border border-hairline">
        {(['AKHLAK', 'LA'] as FormType[]).map((t) => (
          <button key={t} type="button" onClick={() => switchType(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
              formType === t ? 'bg-white text-ink shadow-soft' : 'text-ink-muted hover:text-ink'
            }`}>
            {t === 'AKHLAK' ? 'AKHLAK (Core Values)' : 'LA (Learning Agility)'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Konten / Pernyataan */}
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            {formType === 'LA' ? 'Pernyataan / Skenario' : 'Skenario Situasional'} *
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setField('content', e.target.value)}
            rows={3}
            placeholder={
              formType === 'AKHLAK'
                ? 'Deskripsikan situasi kerja yang menguji nilai AKHLAK...'
                : 'Tuliskan pernyataan atau skenario untuk direspons peserta...'
            }
            className="w-full border border-hairline rounded-xl px-3 py-2.5 text-sm text-ink resize-none focus:outline-none focus:ring-2 focus:ring-brand/40"
            required
          />
        </div>

        {/* LA: reverse scored + dimension */}
        {formType === 'LA' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">Dimensi LA *</label>
              <select value={form.dimension} onChange={(e) => setField('dimension', e.target.value)}
                className="w-full border border-hairline rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40">
                {LA_DIMENSIONS.map((d) => <option key={d.v} value={d.v}>{d.l}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-end pb-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-hairline hover:bg-paper-soft transition-colors">
                <input type="checkbox" checked={form.isReverse} onChange={(e) => setField('isReverse', e.target.checked)}
                  className="w-4 h-4 accent-brand" />
                <span className="text-xs font-semibold text-ink-soft">Reverse Scored<br />
                  <span className="text-[10px] text-ink-muted font-normal">Pernyataan negatif (poin dibalik)</span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* AKHLAK: value tag */}
        {formType === 'AKHLAK' && (
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">Core Value Yang Diuji *</label>
            <div className="flex flex-wrap gap-1.5">
              {AKHLAK_VALUE_TAGS.map((v) => (
                <button key={v.v} type="button" onClick={() => setField('valueTag', v.v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    form.valueTag === v.v ? 'bg-brand text-white border-brand' : 'bg-white border-hairline text-ink-soft hover:border-brand/50'
                  }`}>
                  {v.l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Opsi A–E + poin */}
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            Opsi Jawaban &amp; Nilai Poin (1 = tidak tepat · 5 = paling tepat) *
          </label>
          <div className="space-y-2.5">
            {OPT_KEYS.map((key) => {
              const currentPoint = form.points[key]
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentPoint === 5 ? 'bg-green-500 text-white' :
                      currentPoint === 4 ? 'bg-brand text-white' :
                      currentPoint === 3 ? 'bg-amber-400 text-white' :
                      currentPoint === 2 ? 'bg-orange-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>{key}</span>
                    <input type="text" value={form.opts[key]}
                      onChange={(e) => setOpt(key, e.target.value)}
                      placeholder={formType === 'LA' && key === 'A' ? 'Sangat tidak setuju' : `Opsi ${key}`}
                      className="flex-1 border border-hairline rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                      required />
                  </div>
                  {/* Tombol poin */}
                  <div className="flex gap-1 ml-8">
                    {[1, 2, 3, 4, 5].map((p) => (
                      <button key={p} type="button"
                        onClick={() => setPoint(key, p)}
                        title={POINT_COLORS[p].label}
                        className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all ${
                          currentPoint === p ? POINT_COLORS[p].btn : INACTIVE_BTN
                        }`}>
                        {p}
                      </button>
                    ))}
                    <span className="ml-1 text-[10px] text-ink-muted self-center whitespace-nowrap">
                      {POINT_COLORS[currentPoint]?.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ringkasan distribusi poin */}
        <div className="flex items-center gap-2 flex-wrap bg-paper-soft rounded-xl px-3 py-2.5 border border-hairline">
          <span className="text-[10px] text-ink-muted font-semibold">Distribusi poin:</span>
          {OPT_KEYS.map((k) => (
            <span key={k} className="text-[10px] font-bold text-ink">
              {k}={form.points[k]}
            </span>
          ))}
          {form.isReverse && formType === 'LA' && (
            <span className="ml-auto text-[10px] text-amber-600 font-semibold">
              ⚠ Skor akan dibalik (6−x) saat hitung nilai
            </span>
          )}
        </div>

        {/* Penjelasan (opsional) */}
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">Penjelasan / Alasan (opsional)</label>
          <textarea value={form.explanation} onChange={(e) => setField('explanation', e.target.value)}
            rows={2} placeholder="Mengapa opsi dengan nilai 5 paling mencerminkan AKHLAK / LA?"
            className="w-full border border-hairline rounded-xl px-3 py-2.5 text-sm text-ink resize-none focus:outline-none focus:ring-2 focus:ring-brand/40" />
        </div>

        {/* Feedback */}
        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">❌ {error}</p>}
        {success && <p className="text-xs text-brand-700 bg-brand/5 border border-brand/20 rounded-xl px-3 py-2.5">✅ Soal {formType} berhasil ditambahkan!</p>}

        <button type="submit" disabled={isPending}
          className="w-full py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isPending ? 'Menyimpan...' : `+ Simpan Soal ${formType}`}
        </button>
      </form>
    </div>
  )
}
