'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Layers } from 'lucide-react'

interface StageSection {
  id: string
  order_index: number
  kode: string
  nama: string
  timer_mode: 'section' | 'per_question'
  timer_seconds: number
  question_count: number | null
  random_select: boolean
  group_kode: string | null
  passing_grade: number | null
}

interface SectionsManagerProps {
  sections: StageSection[]
}

export function SectionsManager({ sections }: SectionsManagerProps) {
  const router = useRouter()
  const [editing, setEditing] = useState<Record<string, Partial<StageSection>>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const get = (id: string, key: keyof StageSection) =>
    editing[id]?.[key] ?? sections.find((s) => s.id === id)?.[key]

  async function save(sec: StageSection) {
    const patch = editing[sec.id]
    if (!patch) return
    setSaving(sec.id)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/packages/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sec.id, ...patch }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Gagal menyimpan')
      }
      setEditing((prev) => { const n = { ...prev }; delete n[sec.id]; return n })
      setMsg({ type: 'ok', text: 'Seksi tersimpan.' })
      router.refresh()
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Gagal menyimpan' })
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Layers className="w-4 h-4 text-blue-600" />
        <h2 className="font-semibold text-gray-900">Konfigurasi Seksi (Tahap Ujian)</h2>
      </div>

      {sections.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-400">Paket ini tidak memakai seksi (bukan tahap gabungan).</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {sections.map((sec) => {
            const isEditing = !!editing[sec.id]
            const set = (key: keyof StageSection, val: unknown) =>
              setEditing((prev) => ({ ...prev, [sec.id]: { ...prev[sec.id], [key]: val } }))

            return (
              <div key={sec.id} className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 mr-2">{sec.kode}</span>
                    {isEditing
                      ? <input value={String(get(sec.id, 'nama'))} onChange={(e) => set('nama', e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 text-sm" />
                      : sec.nama}
                  </p>
                  {isEditing && (
                    <button onClick={() => save(sec)} disabled={saving === sec.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      {saving === sec.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Simpan
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 mb-1">Jumlah soal ditampilkan</p>
                    {isEditing
                      ? <input type="number" min={0} value={String(get(sec.id, 'question_count') ?? '')} onChange={(e) => set('question_count', e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-lg px-2 py-1.5" placeholder="semua" />
                      : <p className="font-semibold text-gray-700">{sec.question_count ?? 'Semua'}</p>}
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Timer (detik)</p>
                    {isEditing
                      ? <input type="number" min={0} value={String(get(sec.id, 'timer_seconds'))} onChange={(e) => set('timer_seconds', Number(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-2 py-1.5" />
                      : <p className="font-semibold text-gray-700">{sec.timer_seconds}</p>}
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Mode timer</p>
                    {isEditing
                      ? <select value={String(get(sec.id, 'timer_mode'))} onChange={(e) => set('timer_mode', e.target.value)} className="w-full border border-gray-300 rounded-lg px-2 py-1.5">
                          <option value="section">Seksi</option>
                          <option value="per_question">Per soal</option>
                        </select>
                      : <p className="font-semibold text-gray-700 capitalize">{sec.timer_mode === 'section' ? 'Seksi' : 'Per soal'}</p>}
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Passing grade</p>
                    {isEditing
                      ? <input type="number" min={0} value={String(get(sec.id, 'passing_grade') ?? '')} onChange={(e) => set('passing_grade', e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-lg px-2 py-1.5" placeholder="tidak ada" />
                      : <p className="font-semibold text-gray-700">{sec.passing_grade ?? '—'}</p>}
                  </div>
                </div>

                {!isEditing && (
                  <button onClick={() => setEditing((prev) => ({ ...prev, [sec.id]: {} }))}
                    className="text-xs text-blue-600 hover:underline">
                    Edit
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {msg && (
        <div className={`px-5 py-3 text-xs ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.text}
        </div>
      )}
    </div>
  )
}
