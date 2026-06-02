'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, ChevronDown, ChevronRight } from 'lucide-react'

interface WmPair {
  word: string
  number: number | string // string saat diketik user agar bisa isi angka bertahap
}

interface WmEntry {
  id: string
  order_index: number
  memory_pairs: WmPair[]
}

interface RecallQuestion {
  order_index: number
  content: string
}

interface WmPairsManagerProps {
  packageId: string
  recallQuestions: RecallQuestion[] // soal recall dari tabel questions (WM)
}

export function WmPairsManager({ packageId, recallQuestions }: WmPairsManagerProps) {
  const [entries, setEntries] = useState<WmEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null) // id entry yang sedang disimpan
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null) // id entry yang terbuka

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/questions/wm-pairs?packageId=${packageId}`)
      const json = await res.json() as { data?: WmEntry[]; error?: string }
      if (res.ok && json.data) {
        setEntries(json.data.map((e) => ({
          ...e,
          memory_pairs: e.memory_pairs.map((p) => ({ word: p.word, number: p.number })),
        })))
        if (json.data.length > 0) setExpanded(json.data[0].id)
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [packageId])

  useEffect(() => { load() }, [load])

  function updatePair(entryId: string, pairIdx: number, field: 'word' | 'number', value: string) {
    setEntries((prev) => prev.map((e) => {
      if (e.id !== entryId) return e
      const pairs = [...e.memory_pairs]
      if (field === 'word') pairs[pairIdx] = { ...pairs[pairIdx], word: value }
      else pairs[pairIdx] = { ...pairs[pairIdx], number: value === '' ? '' : value }
      return { ...e, memory_pairs: pairs }
    }))
  }

  function addPair(entryId: string) {
    setEntries((prev) => prev.map((e) => {
      if (e.id !== entryId) return e
      if (e.memory_pairs.length >= 10) return e
      return { ...e, memory_pairs: [...e.memory_pairs, { word: '', number: '' }] }
    }))
  }

  function removePair(entryId: string, pairIdx: number) {
    setEntries((prev) => prev.map((e) => {
      if (e.id !== entryId) return e
      const pairs = e.memory_pairs.filter((_, i) => i !== pairIdx)
      return { ...e, memory_pairs: pairs }
    }))
  }

  async function save(entry: WmEntry) {
    setSaving(entry.id)
    setErrors((prev) => ({ ...prev, [entry.id]: '' }))
    setSuccess(null)

    const pairs = entry.memory_pairs.map((p) => ({
      word: String(p.word).trim(),
      number: Number(p.number),
    }))

    try {
      const res = await fetch('/api/admin/questions/wm-pairs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id, memory_pairs: pairs }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, [entry.id]: json.error ?? 'Gagal menyimpan.' }))
      } else {
        setSuccess(entry.id)
        setTimeout(() => setSuccess(null), 2500)
      }
    } catch {
      setErrors((prev) => ({ ...prev, [entry.id]: 'Terjadi kesalahan.' }))
    } finally {
      setSaving(null)
    }
  }

  // Cari soal recall untuk order_index tertentu
  function getRecallContent(orderIndex: number): string {
    return recallQuestions.find((q) => q.order_index === orderIndex)?.content ?? `Soal WM #${orderIndex}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-hairline shadow-soft p-6 text-center text-ink-muted text-sm">
        Memuat data pasangan hafalan WM...
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-hairline shadow-soft p-6 text-center text-ink-muted text-sm">
        Belum ada data pasangan hafalan WM untuk paket ini.
        <p className="text-xs mt-1">Jalankan migrasi SQL terlebih dahulu untuk mengisi data awal.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Pasangan Hafalan Working Memory</p>
          <p className="text-xs text-ink-muted mt-0.5">Urutan soal WM yang muncul sebelum pertanyaan recall</p>
        </div>
        <span className="text-xs font-semibold text-ink-muted bg-paper-soft border border-hairline px-2.5 py-1 rounded-full">
          {entries.length} soal
        </span>
      </div>

      {entries.map((entry) => {
        const recallText = getRecallContent(entry.order_index)
        const isOpen = expanded === entry.id
        const isSaving = saving === entry.id
        const hasError = errors[entry.id]
        const isDone = success === entry.id

        return (
          <div key={entry.id} className="bg-white rounded-xl border border-hairline overflow-hidden">
            {/* Header accordion */}
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : entry.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-paper-soft transition-colors text-left"
            >
              {isOpen ? <ChevronDown className="w-4 h-4 text-ink-muted shrink-0" /> : <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />}
              <span className="w-7 h-7 rounded-full bg-brand/10 text-brand-700 text-xs font-num font-bold flex items-center justify-center shrink-0">
                {entry.order_index}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink-soft truncate">{recallText}</p>
                <p className="text-[10px] text-ink-muted mt-0.5">
                  {entry.memory_pairs.length} pasangan hafalan
                  {entry.memory_pairs.length > 0 && (
                    <span className="ml-1 text-ink-muted">
                      · {entry.memory_pairs.map((p) => `${p.word}=${p.number}`).join(', ')}
                    </span>
                  )}
                </p>
              </div>
              {isDone && <span className="text-[10px] text-brand font-semibold shrink-0">✓ Tersimpan</span>}
            </button>

            {/* Body */}
            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-hairline">
                <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-3 mt-2">
                  Kata yang dihafal (muncul 1 detik per pasangan)
                </p>

                <div className="space-y-2 mb-3">
                  {entry.memory_pairs.map((pair, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] text-ink-muted font-num w-5 shrink-0 text-right">{idx + 1}.</span>
                      <input
                        type="text"
                        value={pair.word}
                        onChange={(e) => updatePair(entry.id, idx, 'word', e.target.value)}
                        placeholder="Kata (cth: Mangga)"
                        className="flex-1 border border-hairline rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                      />
                      <span className="text-ink-muted text-sm font-semibold shrink-0">=</span>
                      <input
                        type="number"
                        value={pair.number}
                        onChange={(e) => updatePair(entry.id, idx, 'number', e.target.value)}
                        placeholder="Angka"
                        min={1}
                        max={99}
                        className="w-20 border border-hairline rounded-lg px-3 py-1.5 text-sm text-ink font-num text-center focus:outline-none focus:ring-2 focus:ring-brand/40"
                      />
                      <button
                        type="button"
                        onClick={() => removePair(entry.id, idx)}
                        disabled={entry.memory_pairs.length <= 1}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tambah pasangan */}
                {entry.memory_pairs.length < 10 && (
                  <button
                    type="button"
                    onClick={() => addPair(entry.id)}
                    className="flex items-center gap-1.5 text-xs text-brand font-semibold hover:text-brand-700 transition-colors mb-3"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Pasangan
                  </button>
                )}

                {hasError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                    {hasError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => save(entry)}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Pasangan'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
