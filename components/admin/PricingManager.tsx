'use client'

import { useState } from 'react'
import {
  Save, Check, RefreshCw, Eye, EyeOff, AlertCircle,
  Zap, Target, Building2,
} from 'lucide-react'
import type { PlanConfig } from '@/lib/plans'

interface PricingManagerProps {
  initialPlans: Record<string, PlanConfig>
}

const CATEGORY_ICONS: Record<string, typeof Zap> = {
  premium: Zap,
  company: Building2,
  pln: Target,
}

const CATEGORY_NAMES: Record<string, { title: string; subtitle: string }> = {
  premium: {
    title: 'Paket Langganan Premium (All Access)',
    subtitle: 'Akses penuh ke semua simulasi CAT di seluruh portal dan instansi',
  },
  company: {
    title: 'Paket Per Tahap / Perusahaan',
    subtitle: 'Akses khusus untuk satu instansi atau tahap seleksi tertentu (disembunyikan secara default)',
  },
  pln: {
    title: 'Paket Khusus Rekrutmen PLN',
    subtitle: 'Simulasi seleksi PT PLN (Persero) untuk GAT, Bahasa Inggris, dan AKDING per bidang',
  },
}

export default function PricingManager({ initialPlans }: PricingManagerProps) {
  const [plans, setPlans] = useState<Record<string, PlanConfig>>(initialPlans)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'premium' | 'company' | 'pln'>('all')

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const handlePriceChange = (id: string, value: string) => {
    const parsed = parseInt(value.replace(/\D/g, ''), 10) || 0
    setPlans(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        price: parsed,
      },
    }))
    setSaveSuccess(false)
  }

  const handleToggleActive = (id: string) => {
    setPlans(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isActive: !prev[id].isActive,
      },
    }))
    setSaveSuccess(false)
  }

  const handleBadgeChange = (id: string, value: string) => {
    setPlans(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        badge: value.trim() ? value : null,
      },
    }))
    setSaveSuccess(false)
  }

  const handleDescriptionChange = (id: string, value: string) => {
    setPlans(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        description: value,
      },
    }))
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaveSuccess(false)

    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans }),
      })

      const data = await res.json() as { ok?: boolean; plans?: Record<string, PlanConfig>; error?: string }
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Gagal menyimpan perubahan')
      }

      if (data.plans) {
        setPlans(data.plans)
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const planList = Object.values(plans)
  const activeCount = planList.filter(p => p.isActive).length
  const inactiveCount = planList.filter(p => !p.isActive).length

  const filteredPlans = activeTab === 'all'
    ? planList
    : planList.filter(p => p.category === activeTab)

  // Group filtered plans by category for tidy layout
  const categories: Array<'premium' | 'company' | 'pln'> = ['premium', 'company', 'pln']

  return (
    <div className="space-y-6">
      {/* Top Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Kelola Pilihan Paket &amp; Harga
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Atur harga jual, badge promo, deskripsi, serta aktifkan/sembunyikan opsi pembelian di halaman <code>/harga</code>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              Perubahan Disimpan!
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Opsi Plan</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{planList.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            {planList.length}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktif di Halaman Harga</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Disembunyikan (Nonaktif)</p>
            <p className="text-2xl font-extrabold text-slate-500 mt-0.5">{inactiveCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1.5 rounded-xl border border-gray-200 w-fit">
        {[
          { key: 'all', label: `Semua (${planList.length})` },
          { key: 'premium', label: 'Premium All Access' },
          { key: 'company', label: 'Per Perusahaan / Tahap' },
          { key: 'pln', label: 'Khusus PLN' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans by Categories */}
      <div className="space-y-8">
        {categories.map(catKey => {
          const catPlans = filteredPlans.filter(p => p.category === catKey)
          if (catPlans.length === 0) return null

          const CatIcon = CATEGORY_ICONS[catKey] ?? Zap
          const catMeta = CATEGORY_NAMES[catKey]

          return (
            <div key={catKey} className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
                  <CatIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-none">{catMeta.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">{catMeta.subtitle}</p>
                </div>
              </div>

              {catKey === 'company' && (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Informasi:</strong> Sesuai permintaan Anda, seluruh paket dalam kategori ini disembunyikan di halaman <code>/harga</code> secara default. Anda dapat mengaktifkan kembali masing-masing paket kapan saja dengan switch di bawah.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catPlans.map(plan => {
                  return (
                    <div
                      key={plan.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-xs ${
                        plan.isActive
                          ? 'border-gray-200 ring-1 ring-black/5'
                          : 'border-dashed border-gray-300 bg-gray-50/60 opacity-80'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Top: Name & Active Toggle */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-gray-400 block mb-0.5">
                              {plan.id}
                            </span>
                            <h3 className="font-heading font-bold text-gray-900 text-base leading-snug">
                              {plan.label}
                            </h3>
                            <span className="text-xs text-gray-500 font-medium">
                              Periode: {plan.period}
                            </span>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleActive(plan.id)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                              plan.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                            title={plan.isActive ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                plan.isActive ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Status pill */}
                        <div>
                          {plan.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Eye className="w-3 h-3 text-emerald-600" />
                              Tampil di /harga
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                              <EyeOff className="w-3 h-3 text-gray-400" />
                              Disembunyikan
                            </span>
                          )}
                        </div>

                        {/* Price Input */}
                        <div className="space-y-1.5 pt-2 border-t border-gray-100">
                          <label className="text-xs font-bold text-gray-700 block">
                            Harga Jual (IDR)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                              Rp
                            </span>
                            <input
                              type="text"
                              value={plan.price.toLocaleString('id-ID')}
                              onChange={e => handlePriceChange(plan.id, e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm font-extrabold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-num"
                            />
                          </div>
                          <p className="text-[11px] text-gray-400">
                            Preview tampilan: <strong className="text-gray-700">{formatRupiah(plan.price)}</strong> {plan.period}
                          </p>
                        </div>

                        {/* Badge Input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                            <span>Badge Promo</span>
                            <span className="text-[10px] text-gray-400 font-normal">Opsional</span>
                          </label>
                          <input
                            type="text"
                            value={plan.badge ?? ''}
                            placeholder="Contoh: Populer, Hemat 15%, Best Value"
                            onChange={e => handleBadgeChange(plan.id, e.target.value)}
                            className="w-full px-3 py-1.5 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          />
                        </div>

                        {/* Description Textarea */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 block">
                            Deskripsi Singkat
                          </label>
                          <textarea
                            rows={2}
                            value={plan.description}
                            onChange={e => handleDescriptionChange(plan.id, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Card Footer Features list count */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                        <span>{plan.features?.length ?? 0} poin keunggulan</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                          {plan.category}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-6 z-20 bg-gray-900 text-white rounded-2xl p-4 sm:p-5 shadow-2xl flex items-center justify-between gap-4 border border-white/10">
        <div>
          <p className="text-sm font-bold text-white">Sudah selesai menyesuaikan?</p>
          <p className="text-xs text-gray-400 mt-0.5">Perubahan harga dan status langsung efektif di halaman /harga dan sistem pembayaran.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Semua
            </>
          )}
        </button>
      </div>
    </div>
  )
}
