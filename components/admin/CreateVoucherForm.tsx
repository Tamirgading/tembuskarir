'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function CreateVoucherForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [code, setCode] = useState('')
  const [durationDays, setDurationDays] = useState(30)
  const [maxUses, setMaxUses] = useState(1)
  const [expiresAt, setExpiresAt] = useState('')
  const [note, setNote] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const normalizedCode = code.trim().toUpperCase()
    if (!normalizedCode) {
      setError('Kode voucher wajib diisi.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/vouchers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: normalizedCode,
          duration_days: durationDays,
          max_uses: maxUses,
          expires_at: expiresAt || null,
          note: note.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Gagal membuat voucher.')
      } else {
        setSuccess(`Voucher ${normalizedCode} berhasil dibuat!`)
        setCode('')
        setDurationDays(30)
        setMaxUses(1)
        setExpiresAt('')
        setNote('')
        router.refresh()
      }
    } catch {
      setError('Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Kode Voucher *</label>
        <input
          className={`${inputClass} font-mono tracking-widest uppercase`}
          placeholder="TEMBUS2026"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={32}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Durasi Premium (hari)</label>
        <input
          type="number"
          className={inputClass}
          min={1}
          max={3650}
          value={durationDays}
          onChange={(e) => setDurationDays(Number(e.target.value))}
          required
        />
        <p className="text-xs text-gray-400 mt-1">User mendapat +{durationDays} hari premium saat redeem.</p>
      </div>

      <div>
        <label className={labelClass}>Maks. Penggunaan</label>
        <input
          type="number"
          className={inputClass}
          min={0}
          value={maxUses}
          onChange={(e) => setMaxUses(Number(e.target.value))}
          required
        />
        <p className="text-xs text-gray-400 mt-1">0 = tidak terbatas (unlimited).</p>
      </div>

      <div>
        <label className={labelClass}>Kadaluarsa (opsional)</label>
        <input
          type="date"
          className={inputClass}
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
        <p className="text-xs text-gray-400 mt-1">Kosongkan = voucher tidak pernah expire.</p>
      </div>

      <div>
        <label className={labelClass}>Catatan Internal (opsional)</label>
        <input
          className={inputClass}
          placeholder="Misal: untuk promo media sosial April 2026"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={200}
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? 'Menyimpan...' : 'Buat Voucher'}
      </button>
    </form>
  )
}
