import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Clock, FileText, Sparkles, Lock,
} from 'lucide-react'
import { AntamKisiKisiModal } from '@/components/antam/AntamKisiKisiModal'
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

  // Akses & skor per paket (butuh login)
  const accessMap: Record<string, string> = {}
  const bestScores: Record<string, number> = {}
  if (user) {
    await Promise.all(streamPkgs.map(async (p) => {
      const status = await checkPackageAccess(user.id, p.id, p.is_free, p.slug)
      accessMap[p.id] = status
    }))

    if (streamPkgs.length > 0) {
      const pkgIds = streamPkgs.map((p) => p.id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: attemptsData } = await (supabase.from('attempts') as any)
        .select('package_id, score')
        .eq('user_id', user.id)
        .eq('status', 'finished')
        .in('package_id', pkgIds)
      if (attemptsData) {
        for (const att of attemptsData as { package_id: string; score: number | null }[]) {
          if (att.score !== null && att.score !== undefined) {
            bestScores[att.package_id] = Math.max(bestScores[att.package_id] ?? 0, att.score)
          }
        }
      }
    }
  }

  const accent = STREAM_ACCENTS[stream.code] ?? '#15803d'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Back + Header ── */}
      <div>
        <Link href="/portal/antam" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" /> Semua Job Stream
        </Link>
      </div>

      <div className="rounded-3xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-7 text-white" style={{ background: `linear-gradient(135deg, ${accent}, #0d2818)` }}>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-white/55 text-xs font-bold uppercase tracking-widest mb-1">ANTAM IMPACT 2026</p>
              <h1 className="text-2xl font-heading font-extrabold leading-tight">{stream.name}</h1>
              <p className="text-white/65 text-sm mt-2 leading-relaxed">{stream.jurusan}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-6 flex-wrap items-center justify-between">
            <div className="flex gap-3 sm:gap-4 flex-wrap">
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

            {stream.topics && stream.topics.length > 0 && (
              <AntamKisiKisiModal
                streamName={stream.name}
                streamCode={stream.code}
                jurusan={stream.jurusan}
                topics={stream.topics}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Upgrade banner ── */}
      {user && (
        <div className="flex items-center justify-between gap-4 bg-brand/5 border border-brand/20 rounded-2xl px-5 py-3.5">
          <p className="text-sm text-brand-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand" />
            <span className="font-bold">Premium:</span> akses semua paket ANTAM sekaligus.
          </p>
          <Link href="/harga" className="shrink-0 text-xs font-bold text-white bg-brand hover:bg-brand-700 px-4 py-2 rounded-xl transition-colors">
            Lihat Harga
          </Link>
        </div>
      )}

      {/* ── Daftar Paket (Card Grid) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-ink-muted uppercase tracking-widest">Pilih Paket Ujian</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tersedia {streamPkgs.length} paket simulasi CAT teknis berbobot 40 butir soal</p>
          </div>
        </div>

        {streamPkgs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-10 text-center">
            <p className="font-semibold text-ink">Belum ada paket tersedia</p>
            <p className="text-xs text-ink-muted mt-1">Paket untuk stream ini akan segera hadir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {streamPkgs.map((p, idx) => {
              const label = packageLabel(p.slug) ?? `Paket ${idx + 1}`
              const access = accessMap[p.id]
              const isLocked = !!user && access === 'locked'
              const bestScore = bestScores[p.id]

              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top: Icon & Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#00315f]/10 text-[#00315f] flex items-center justify-center transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      {p.is_free ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          GRATIS
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-slate-900 text-base group-hover:text-[#00315f] transition-colors">
                      {label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      Simulasi CAT Teknis {stream.name}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong className="font-semibold text-slate-800">{p.total_questions}</strong> Soal</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong className="font-semibold text-slate-800">{p.duration_minutes}</strong> Menit</span>
                      </div>
                    </div>

                    {/* Score badge if finished */}
                    {bestScore !== undefined && (
                      <div className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
                        <span className="font-medium">Skor Terbaik:</span>
                        <span className="font-bold font-num">{bestScore} / {p.total_questions}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    {!user ? (
                      <Link
                        href={`/persiapan/${p.id}`}
                        className="w-full py-2.5 bg-gradient-to-r from-[#00315f] to-[#16487e] hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        Mulai Simulasi <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : isLocked ? (
                      <Link
                        href="/harga"
                        className="w-full py-2.5 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" /> Buka Akses Premium
                      </Link>
                    ) : (
                      <Link
                        href={`/persiapan/${p.id}`}
                        className="w-full py-2.5 bg-gradient-to-r from-[#00315f] to-[#16487e] hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        Mulai Simulasi <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
