import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Clock, FileText, CheckCircle2, Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStreamBySlug } from '@/lib/antam-config'
import { checkPackageAccess } from '@/lib/access'
import type { PackageRow } from '@/lib/utils'

const STREAM_ACCENTS: Record<string, string> = {
  EXP: '#b45309',
  MIN: '#57534e',
  PRC: '#7e22ce',
  ENG: '#1d4ed8',
  HSE: '#15803d',
  QC: '#0e7490',
  MKT: '#db2777',
  BDV: '#4338ca',
  SCM: '#c2410c',
  HCM: '#0f766e',
  LGL: '#334155',
  FIN: '#047857',
  CRL: '#be123c',
  IT: '#6d28d9',
}

export default async function AntamStreamPage({
  params,
}: {
  params: Promise<{ stream: string }>
}) {
  const { stream: streamSlug } = await params
  const stream = getStreamBySlug(streamSlug)
  if (!stream) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkgData } = await (supabase.from('packages') as any)
    .select('*')
    .eq('category', 'ANTAM')
    .eq('is_published', true)
    .order('created_at', { ascending: true })
  const packages = (pkgData ?? []) as PackageRow[]

  const prefix = stream.slug
  const streamPkgs = packages
    .filter((p) => p.slug === prefix || p.slug.startsWith(`${prefix}-paket-`))
    .sort((a, b) => a.created_at.localeCompare(b.created_at))

  const packageLabel = (slug: string): string | null => {
    if (slug === stream.slug) return null
    const suffix = slug.slice(`${stream.slug}-paket-`.length)
    return `Paket ${suffix}`
  }

  // Akses per paket (butuh login)
  const accessMap: Record<string, string> = {}
  if (user) {
    await Promise.all(streamPkgs.map(async (p) => {
      const status = await checkPackageAccess(user.id, p.id, p.is_free, p.slug)
      accessMap[p.id] = status
    }))
  }

  const accent = STREAM_ACCENTS[stream.code] ?? '#15803d'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Back + Header ── */}
      <div>
        <Link href="/portal/antam" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" /> Semua Job Stream
        </Link>
      </div>

      <div className="rounded-3xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-7 text-white" style={{ background: `linear-gradient(135deg, ${accent}, #0d2818)` }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <span className="font-num font-bold text-lg">{stream.code}</span>
            </div>
            <div className="flex-1">
              <p className="text-white/55 text-xs font-bold uppercase tracking-widest mb-1">ANTAM IMPACT 2026</p>
              <h1 className="text-2xl font-heading font-extrabold leading-tight">{stream.name}</h1>
              <p className="text-white/65 text-sm mt-2 leading-relaxed">{stream.jurusan}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-5 flex-wrap">
            {[
              { label: 'Paket Tersedia', value: String(streamPkgs.length) },
              { label: 'Soal/Paket', value: streamPkgs[0] ? String(streamPkgs[0].total_questions) : '40' },
              { label: 'Waktu', value: streamPkgs[0] ? `${streamPkgs[0].duration_minutes} mnt` : '50 mnt' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[86px]">
                <p className="text-white font-num font-bold text-sm">{s.value}</p>
                <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Upgrade banner ── */}
      {user && (
        <div className="flex items-center justify-between gap-4 bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="font-bold">Premium:</span> akses semua paket ANTAM sekaligus.
          </p>
          <Link href="/harga" className="shrink-0 text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition-colors">
            Lihat Harga
          </Link>
        </div>
      )}

      {/* ── Daftar Paket ── */}
      <div>
        <h2 className="text-sm font-bold text-ink-muted uppercase tracking-widest mb-3">Pilih Paket</h2>
        {streamPkgs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-10 text-center">
            <p className="font-semibold text-ink">Belum ada paket tersedia</p>
            <p className="text-xs text-ink-muted mt-1">Paket untuk stream ini akan segera hadir.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {streamPkgs.map((p) => {
              const label = packageLabel(p.slug) ?? 'Paket 1'
              const access = accessMap[p.id]
              const isLocked = !!user && access === 'locked'

              return (
                <div key={p.id} className="bg-white rounded-2xl border border-hairline shadow-soft px-5 py-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading font-bold text-ink">{label}</p>
                      {p.is_free && (
                        <span className="text-[9px] font-bold text-white bg-green-600 px-2 py-0.5 rounded-full">GRATIS</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-1">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /><span className="font-num">{p.total_questions}</span> soal</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /><span className="font-num">{p.duration_minutes}</span> menit</span>
                    </div>
                  </div>
                  {!user ? (
                    <Link href={`/persiapan/${p.id}`} className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors">
                      Mulai <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : isLocked ? (
                    <Link href="/harga" className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 bg-white border border-hairline text-ink text-xs font-bold rounded-xl hover:bg-paper-soft transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-ink-muted" /> Upgrade
                    </Link>
                  ) : (
                    <Link href={`/persiapan/${p.id}`} className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors">
                      Mulai <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
