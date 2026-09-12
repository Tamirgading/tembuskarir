'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2, Pencil, Trash2, Power, X, Save, Search, Ticket, Percent, CalendarClock,
} from 'lucide-react'

export interface AdminVoucher {
  id: string
  code: string
  name: string | null
  discount_type: string
  discount_value: number
  duration_days: number
  max_uses: number
  used_count: number
  expires_at: string | null
  is_active: boolean
  applies_to: string
  plan_types: string[] | null
  package_ids: string[] | null
  note: string | null
  created_at: string
}

export interface PackageOption {
  id: string
  name: string
  category: string
  slug: string
}

export interface PlanOption {
  id: string
  label: string
}

interface VoucherManagerProps {
  vouchers: AdminVoucher[]
  packages: PackageOption[]
  plans: PlanOption[]
}

type DiscountType = 'percent' | 'free_days'
type AppliesTo = 'all' | 'plan' | 'package'

function formatDateID(iso: string | null) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta',
  })
}

function toDateInput(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

export function VoucherManager({ vouchers, packages, plans }: VoucherManagerProps) {
  const router = useRouter()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [discountType, setDiscountType] = useState<DiscountType>('percent')
  const [discountValue, setDiscountValue] = useState(50)
  const [durationDays, setDurationDays] = useState(30)
  const [maxUses, setMaxUses] = useState(1)
  const [expiresAt, setExpiresAt] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [appliesTo, setAppliesTo] = useState<AppliesTo>('all')
  const [planTypes, setPlanTypes] = useState<string[]>([])
  const [packageIds, setPackageIds] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [packageSearch, setPackageSearch] = useState('')

  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const filteredPackages = useMemo(() => {
    const term = packageSearch.trim().toLowerCase()
    if (!term) return packages
    return packages.filter(
      (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    )
  }, [packages, packageSearch])

  function resetForm() {
    setEditingId(null)
    setCode('')
    setName('')
    setDiscountType('percent')
    setDiscountValue(50)
    setDurationDays(30)
    setMaxUses(1)
    setExpiresAt('')
    setIsActive(true)
    setAppliesTo('all')
    setPlanTypes([])
    setPackageIds([])
    setNote('')
    setPackageSearch('')
    setError(null)
    setSuccess(null)
  }

  function startEdit(v: AdminVoucher) {
    setEditingId(v.id)
    setCode(v.code)
    setName(v.name ?? '')
    setDiscountType(v.discount_type === 'percent' ? 'percent' : 'free_days')
    setDiscountValue(v.discount_value || 50)
    setDurationDays(v.duration_days || 30)
    setMaxUses(v.max_uses)
    setExpiresAt(toDateInput(v.expires_at))
    setIsActive(v.is_active)
    setAppliesTo(
      v.applies_to === 'plan' || v.applies_to === 'package' ? v.applies_to : 'all'
    )
    setPlanTypes(v.plan_types ?? [])
    setPackageIds(v.package_ids ?? [])
    setNote(v.note ?? '')
    setError(null)
    setSuccess(null)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function buildPayload(overrides: Record<string, unknown> = {}) {
    return {
      id: editingId ?? undefined,
      code: code.trim().toUpperCase(),
      name: name.trim() || null,
      discount_type: discountType,
      discount_value: discountType === 'percent' ? discountValue : 0,
      duration_days: discountType === 'free_days' ? durationDays : 0,
      max_uses: maxUses,
      expires_at: expiresAt || null,
      is_active: isActive,
      applies_to: appliesTo,
      plan_types: appliesTo === 'plan' ? planTypes : [],
      package_ids: appliesTo === 'package' ? packageIds : [],
      note: note.trim() || null,
      ...overrides,
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!code.trim()) {
      setError('Kode voucher wajib diisi.')
      return
    }
    if (appliesTo === 'plan' && planTypes.length === 0) {
      setError('Pilih minimal satu plan yang berlaku.')
      return
    }
    if (appliesTo === 'package' && packageIds.length === 0) {
      setError('Pilih minimal satu paket yang berlaku.')
      return
    }

    setSaving(true)
    try {
      const url = editingId
        ? '/api/admin/vouchers/update'
        : '/api/admin/vouchers/create'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Gagal menyimpan voucher.')
      } else {
        setSuccess(editingId ? 'Voucher berhasil diperbarui.' : 'Voucher berhasil dibuat.')
        resetForm()
        router.refresh()
      }
    } catch {
      setError('Terjadi kesalahan.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(v: AdminVoucher) {
    setBusyId(v.id)
    setError(null)
    try {
      const res = await fetch('/api/admin/vouchers/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: v.id,
          code: v.code,
          name: v.name,
          discount_type: v.discount_type === 'percent' ? 'percent' : 'free_days',
          discount_value: v.discount_value,
          duration_days: v.duration_days,
          max_uses: v.max_uses,
          expires_at: v.expires_at,
          is_active: !v.is_active,
          applies_to: v.applies_to,
          plan_types: v.plan_types ?? [],
          package_ids: v.package_ids ?? [],
          note: v.note,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Gagal mengubah status.')
      } else {
        router.refresh()
      }
    } catch {
      setError('Terjadi kesalahan.')
    } finally {
      setBusyId(null)
    }
  }

  async function remove(v: AdminVoucher) {
    if (typeof window !== 'undefined' && !window.confirm(`Hapus voucher "${v.code}"? Tindakan ini permanen.`)) {
      return
    }
    setBusyId(v.id)
    setError(null)
    try {
      const res = await fetch('/api/admin/vouchers/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: v.id }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Gagal menghapus voucher.')
      } else {
        if (editingId === v.id) resetForm()
        router.refresh()
      }
    } catch {
      setError('Terjadi kesalahan.')
    } finally {
      setBusyId(null)
    }
  }

  function scopeSummary(v: AdminVoucher) {
    if (v.applies_to === 'all') return 'Semua plan & paket'
    if (v.applies_to === 'plan') {
      const labels = (v.plan_types ?? []).map((id) => plans.find((p) => p.id === id)?.label ?? id)
      return `Plan: ${labels.join(', ') || '-'}`
    }
    const names = (v.package_ids ?? []).map((id) => packages.find((p) => p.id === id)?.name ?? id)
    return `Paket: ${names.slice(0, 3).join(', ') || '-'}${names.length > 3 ? ` +${names.length - 3}` : ''}`
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
      {/* ── Daftar voucher ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Ticket className="w-4 h-4 text-blue-600" />
          <p className="font-semibold text-gray-900">Semua Voucher ({vouchers.length})</p>
        </div>

        {error && (
          <div className="mx-5 mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
        )}
        {success && (
          <div className="mx-5 mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</div>
        )}

        {vouchers.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">Belum ada voucher.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {vouchers.map((v) => {
              const isPercent = v.discount_type === 'percent'
              const isFull = v.max_uses > 0 && v.used_count >= v.max_uses
              const isExpired = v.expires_at ? new Date(v.expires_at) < new Date() : false
              const status = !v.is_active ? 'nonaktif' : isFull ? 'habis' : isExpired ? 'kadaluarsa' : 'aktif'
              const statusColor: Record<string, string> = {
                aktif: 'bg-green-100 text-green-700',
                nonaktif: 'bg-gray-100 text-gray-500',
                habis: 'bg-red-100 text-red-600',
                kadaluarsa: 'bg-amber-100 text-amber-700',
              }

              return (
                <div key={v.id} className={`px-5 py-4 ${editingId === v.id ? 'bg-blue-50/50' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-gray-900 text-sm tracking-widest">{v.code}</span>
                        {isPercent ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                            <Percent className="w-3 h-3" /> Diskon {v.discount_value}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                            <CalendarClock className="w-3 h-3" /> Gratis {v.duration_days} hari
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[status]}`}>
                          {status}
                        </span>
                      </div>
                      {v.name && <p className="text-sm text-gray-700 mt-1 font-medium">{v.name}</p>}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                        <span>Berlaku: {scopeSummary(v)}</span>
                        <span>Dipakai: {v.used_count}/{v.max_uses === 0 ? '∞' : v.max_uses}</span>
                        <span>Exp: {v.expires_at ? formatDateID(v.expires_at) : 'Tanpa batas'}</span>
                        {v.note && <span className="text-gray-400 italic">{v.note}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleActive(v)}
                        disabled={busyId === v.id}
                        title={v.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        className={`p-1.5 rounded-lg border transition disabled:opacity-50 ${
                          v.is_active
                            ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'
                            : 'text-gray-400 border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => startEdit(v)}
                        title="Edit"
                        className="p-1.5 rounded-lg border text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(v)}
                        disabled={busyId === v.id}
                        title="Hapus"
                        className="p-1.5 rounded-lg border text-red-600 border-red-200 bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
                      >
                        {busyId === v.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Form buat / edit ── */}
      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 xl:sticky xl:top-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            {editingId ? 'Edit Voucher' : '+ Buat Voucher Baru'}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Batal edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            <label className={labelClass}>Kode Voucher *</label>
            <input
              className={`${inputClass} font-mono tracking-widest uppercase`}
              placeholder="TEMBUS50"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={32}
              required
            />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>Nama Voucher</label>
            <input
              className={inputClass}
              placeholder="Promo Merdeka 50%"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
        </div>

        {/* Tipe voucher */}
        <div>
          <label className={labelClass}>Tipe Voucher</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDiscountType('percent')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                discountType === 'percent'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Diskon (%)
            </button>
            <button
              type="button"
              onClick={() => setDiscountType('free_days')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                discountType === 'free_days'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Gratis Hari
            </button>
          </div>
        </div>

        {discountType === 'percent' ? (
          <div>
            <label className={labelClass}>Besar Diskon (%)</label>
            <input
              type="number"
              className={inputClass}
              min={1}
              max={100}
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              required
            />
            <p className="text-xs text-gray-400 mt-1">Contoh: 50 untuk potongan 50% saat checkout.</p>
          </div>
        ) : (
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
        )}

        {/* Scope */}
        <div>
          <label className={labelClass}>Berlaku Untuk</label>
          <select
            className={inputClass}
            value={appliesTo}
            onChange={(e) => setAppliesTo(e.target.value as AppliesTo)}
          >
            <option value="all">Semua Plan &amp; Paket</option>
            <option value="plan">Plan Langganan Tertentu</option>
            <option value="package">Paket Soal Tertentu</option>
          </select>
        </div>

        {appliesTo === 'plan' && (
          <div className="border border-gray-200 rounded-lg p-3 max-h-52 overflow-y-auto space-y-1.5">
            {plans.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={planTypes.includes(p.id)}
                  onChange={(e) =>
                    setPlanTypes((prev) =>
                      e.target.checked ? [...prev, p.id] : prev.filter((x) => x !== p.id)
                    )
                  }
                />
                <span>{p.label}</span>
                <span className="text-xs text-gray-400 font-mono">{p.id}</span>
              </label>
            ))}
          </div>
        )}

        {appliesTo === 'package' && (
          <div className="border border-gray-200 rounded-lg">
            <div className="relative border-b border-gray-100">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full pl-8 pr-3 py-2 text-sm rounded-t-lg focus:outline-none"
                placeholder="Cari paket..."
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
              />
            </div>
            <div className="max-h-52 overflow-y-auto p-3 space-y-1.5">
              {filteredPackages.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">Tidak ada paket.</p>
              ) : (
                filteredPackages.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={packageIds.includes(p.id)}
                      onChange={(e) =>
                        setPackageIds((prev) =>
                          e.target.checked ? [...prev, p.id] : prev.filter((x) => x !== p.id)
                        )
                      }
                    />
                    <span className="flex-1 min-w-0 truncate">{p.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase shrink-0">{p.category}</span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-400 px-3 pb-2">{packageIds.length} paket dipilih</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
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
            <p className="text-xs text-gray-400 mt-1">0 = tidak terbatas.</p>
          </div>
          <div>
            <label className={labelClass}>Kadaluarsa</label>
            <input
              type="date"
              className={inputClass}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Kosong = tanpa batas.</p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Catatan Internal</label>
          <input
            className={inputClass}
            placeholder="Misal: promo media sosial"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Aktifkan voucher
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Buat Voucher'}
        </button>
      </form>
    </div>
  )
}
