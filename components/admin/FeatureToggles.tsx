'use client'

import { useState } from 'react'
import { Newspaper, Package, Zap, Building2, Mountain } from 'lucide-react'
import type { FeatureFlags } from '@/lib/site-settings'

interface Props {
  initial: FeatureFlags
}

const FEATURES: { key: keyof FeatureFlags; label: string; desc: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'feature_info_seleksi', label: 'Info Seleksi', desc: 'Halaman info seleksi di sidebar & bottom tab', Icon: Newspaper },
  { key: 'feature_semua_paket', label: 'Semua Paket', desc: 'Menu "Semua Paket" di sidebar', Icon: Package },
  { key: 'feature_portal_pln', label: 'Portal PLN', desc: 'Halaman portal Rekrutmen PLN beserta sub-halaman', Icon: Zap },
  { key: 'feature_portal_bumn', label: 'Portal BUMN', desc: 'Halaman portal Rekrutmen BUMN', Icon: Building2 },
  { key: 'feature_portal_antam', label: 'Portal ANTAM', desc: 'Halaman portal ANTAM IMPACT 2026', Icon: Mountain },
]

export default function FeatureToggles({ initial }: Props) {
  const [flags, setFlags] = useState<FeatureFlags>(initial)
  const [saving, setSaving] = useState<string | null>(null)

  async function toggle(key: keyof FeatureFlags) {
    const newValue = !flags[key]
    setSaving(key)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, enabled: newValue }),
      })
      if (res.ok) {
        setFlags(prev => ({ ...prev, [key]: newValue }))
      }
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Pengaturan Fitur</h2>
        <p className="text-sm text-gray-500 mt-0.5">Tampilkan atau sembunyikan fitur dari pengguna</p>
      </div>
      <div className="divide-y divide-gray-50">
        {FEATURES.map(({ key, label, desc, Icon }) => (
          <div key={key} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(key)}
              disabled={saving === key}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                flags[key] ? 'bg-green-500' : 'bg-gray-300'
              } ${saving === key ? 'opacity-50' : ''}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                flags[key] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
