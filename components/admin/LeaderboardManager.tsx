'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, Loader2, Trophy, ExternalLink } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  display_name: string
  score: number
  duration_seconds: number
}

interface LeaderboardManagerProps {
  packageId: string
  packageName: string
}

function formatDur(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function LeaderboardManager({ packageId, packageName }: LeaderboardManagerProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form tambah
  const [name, setName] = useState('')
  const [score, setScore] = useState('')
  const [minutes, setMinutes] = useState('')

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editScore, setEditScore] = useState('')
  const [editMinutes, setEditMinutes] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/leaderboard/list?packageId=${packageId}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Gagal memuat entri leaderboard.')
        setEntries([])
      } else {
        setEntries((data.data ?? []) as LeaderboardEntry[])
        setError('')
      }
    } catch {
      setError('Gagal memuat entri leaderboard.')
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId])

  function resetAddForm() {
    setName('')
    setScore('')
    setMinutes('')
  }

  async function handleAdd() {
    setError('')
    const sc = Number(score)
    const min = Number(minutes)
    if (!name.trim()) return setError('Nama peserta wajib diisi.')
    if (!Number.isFinite(sc) || sc < 0 || sc > 100) return setError('Nilai harus antara 0–100.')
    if (!Number.isFinite(min) || min < 0) return setError('Waktu (menit) tidak valid.')

    setSaving(true)
    try {
      const res = await fetch('/api/admin/leaderboard/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          displayName: name.trim(),
          score: sc,
          durationSeconds: Math.round(min * 60),
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error ?? 'Gagal menambah entri.')
        return
      }
      resetAddForm()
      await load()
    } finally {
      setSaving(false)
    }
  }

  function startEdit(entry: LeaderboardEntry) {
    setEditingId(entry.id)
    setEditName(entry.display_name)
    setEditScore(String(entry.score))
    setEditMinutes(String(Math.round(entry.duration_seconds / 60)))
    setError('')
  }

  async function handleUpdate() {
    if (!editingId) return
    setError('')
    const sc = Number(editScore)
    const min = Number(editMinutes)
    if (!editName.trim()) return setError('Nama peserta wajib diisi.')
    if (!Number.isFinite(sc) || sc < 0 || sc > 100) return setError('Nilai harus antara 0–100.')
    if (!Number.isFinite(min) || min < 0) return setError('Waktu (menit) tidak valid.')

    setEditLoading(true)
    try {
      const res = await fetch('/api/admin/leaderboard/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          displayName: editName.trim(),
          score: sc,
          durationSeconds: Math.round(min * 60),
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error ?? 'Gagal memperbarui entri.')
        return
      }
      setEditingId(null)
      await load()
    } finally {
      setEditLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Hapus entri ini dari leaderboard?')) return
    setError('')
    try {
      const res = await fetch('/api/admin/leaderboard/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error ?? 'Gagal menghapus entri.')
        return
      }
      if (editingId === id) setEditingId(null)
      await load()
    } catch {
      setError('Gagal menghapus entri.')
    }
  }

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div className="space-y-5">
      {/* Info singkat */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
          Entri di bawah ini ditampilkan sebagai peserta di halaman leaderboard paket{' '}
          <strong className="text-gray-700">{packageName}</strong>. Entri ini digabung otomatis dengan
          nilai user asli yang benar-benar mengerjakan, lalu diurutkan dari skor tertinggi.
        </p>
        <a
          href={`/paket/${packageId}/leaderboard`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-medium shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Lihat Leaderboard Publik
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form tambah */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-blue-600" /> Tambah Peserta Dummy
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_auto] gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama peserta (cth: Rizky Pratama)"
            className={inputCls}
            maxLength={60}
          />
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Nilai"
            min={0}
            max={100}
            className={inputCls}
          />
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="Waktu (mnt)"
            min={0}
            className={inputCls}
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Tambah
          </button>
        </div>
      </div>

      {/* Daftar entri */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Memuat…
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <div className="flex justify-center mb-2"><Trophy className="w-8 h-8 text-gray-300" /></div>
            <p>Belum ada entri dummy. Tambahkan peserta di form di atas agar leaderboard tampak ramai.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-2.5 font-medium w-10">#</th>
                <th className="px-4 py-2.5 font-medium">Nama</th>
                <th className="px-4 py-2.5 font-medium text-center w-20">Nilai</th>
                <th className="px-4 py-2.5 font-medium text-center w-24">Waktu</th>
                <th className="px-4 py-2.5 font-medium text-right w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((entry, idx) => {
                const isEditing = editingId === entry.id
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-400 font-num">{idx + 1}</td>
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2.5">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className={inputCls}
                            maxLength={60}
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            value={editScore}
                            onChange={(e) => setEditScore(e.target.value)}
                            min={0}
                            max={100}
                            className={inputCls}
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            value={editMinutes}
                            onChange={(e) => setEditMinutes(e.target.value)}
                            min={0}
                            className={inputCls}
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={handleUpdate}
                              disabled={editLoading}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                              title="Simpan"
                            >
                              {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2.5 font-medium text-gray-800">{entry.display_name}</td>
                        <td className="px-4 py-2.5 text-center font-num font-semibold text-gray-800">{entry.score}</td>
                        <td className="px-4 py-2.5 text-center font-num text-gray-500">{formatDur(entry.duration_seconds)}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startEdit(entry)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-[11px] text-gray-400">
        Catatan: kolom waktu ditulis dalam menit dan otomatis dikonversi ke format mm:ss di leaderboard.
        Perubahan langsung terlihat di leaderboard publik.
      </p>
    </div>
  )
}
