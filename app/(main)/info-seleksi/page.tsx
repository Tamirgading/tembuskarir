import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Inbox, Rss, ExternalLink } from 'lucide-react'
import { getEffectiveFeatureFlags } from '@/lib/site-settings'

type InfoSeleksi = {
  id: string
  institusi: string
  kategori: string
  judul: string
  ringkasan: string | null
  url_sumber: string | null
  tanggal_publikasi: string | null
  crawled_at: string
}

const INSTITUSI_CONFIG: Record<string, { label: string; pill: string; dot: string }> = {
  OJK:  { label: 'OJK',          pill: 'bg-blue-50 text-blue-700 border-blue-200',  dot: 'bg-[#00315f]' },
  PLN:  { label: 'PLN',           pill: 'bg-blue-50 text-blue-700 border-blue-200',  dot: 'bg-[#00315f]' },
  RBB:  { label: 'RBB / BUMN',   pill: 'bg-blue-50 text-blue-700 border-blue-200',  dot: 'bg-[#00315f]' },
  ASTRA:{ label: 'Astra',         pill: 'bg-blue-50 text-blue-700 border-blue-200',  dot: 'bg-[#00315f]' },
}

const KATEGORI_CONFIG: Record<string, { label: string; pill: string }> = {
  pengumuman:  { label: 'Pengumuman',  pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  jadwal:      { label: 'Jadwal',      pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  soal:        { label: 'Contoh Soal', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  tips:        { label: 'Tips',        pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  'kisi-kisi': { label: 'Kisi-Kisi',  pill: 'bg-blue-50 text-blue-700 border-blue-200' },
}

export const revalidate = 3600

export default async function InfoSeleksiPage({
  searchParams,
}: {
  searchParams: { institusi?: string; kategori?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const flags = await getEffectiveFeatureFlags(user?.email)
  if (!flags.feature_info_seleksi) redirect('/')

  const institusiFilter = searchParams.institusi?.toUpperCase()
  const kategoriFilter  = searchParams.kategori

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('info_seleksi') as any)
    .select('id, institusi, kategori, judul, ringkasan, url_sumber, tanggal_publikasi, crawled_at')
    .eq('is_active', true)
    .order('tanggal_publikasi', { ascending: false })
    .limit(60)

  if (institusiFilter) query = query.eq('institusi', institusiFilter)
  if (kategoriFilter)  query = query.eq('kategori', kategoriFilter)

  const { data: rawItems, error } = await query
  const items = rawItems as InfoSeleksi[] | null

  function fmtDate(d: string | null) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function buildUrl(params: { institusi?: string; kategori?: string }) {
    const p = new URLSearchParams()
    if (params.institusi) p.set('institusi', params.institusi.toLowerCase())
    if (params.kategori)  p.set('kategori', params.kategori)
    const q = p.toString()
    return q ? `/info-seleksi?${q}` : '/info-seleksi'
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Info Seleksi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengumuman, jadwal, dan tips rekrutmen dari sumber resmi. Diperbarui harian.
          </p>
        </div>
        <Rss className="w-5 h-5 text-[#00315f] mt-1 shrink-0" />
      </div>

      {/* ── Filter ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm px-5 py-4 space-y-3">

        {/* Filter institusi */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Institusi</p>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href="/info-seleksi"
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                !institusiFilter
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-500 border-slate-200/90 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Semua
            </Link>
            {Object.entries(INSTITUSI_CONFIG).map(([key, cfg]) => (
              <Link
                key={key}
                href={buildUrl({ institusi: key, kategori: kategoriFilter })}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                  institusiFilter === key
                    ? 'bg-slate-900 text-white border-slate-900'
                    : `${cfg.pill} hover:opacity-80`
                }`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5 align-middle`} />
                {cfg.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Filter kategori */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Kategori</p>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href={buildUrl({ institusi: institusiFilter })}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                !kategoriFilter
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-500 border-slate-200/90 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Semua
            </Link>
            {Object.entries(KATEGORI_CONFIG).map(([key, cfg]) => (
              <Link
                key={key}
                href={buildUrl({ institusi: institusiFilter, kategori: key })}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                  kategoriFilter === key
                    ? 'bg-slate-900 text-white border-slate-900'
                    : `${cfg.pill} hover:opacity-80`
                }`}
              >
                {cfg.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-700 text-sm">
          Gagal memuat data. Silakan refresh halaman.
        </div>
      )}

      {/* ── Empty ─────────────────────────────────────────────────────────── */}
      {!error && items?.length === 0 && (
        <div className="text-center py-16 text-slate-500 bg-white rounded-3xl border border-slate-200/90">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-sm">Belum ada data untuk filter ini.</p>
          <p className="text-xs mt-1 text-slate-500">Data muncul setelah cron job berjalan.</p>
        </div>
      )}

      {/* ── List ──────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {items?.map((item) => {
          const instCfg = INSTITUSI_CONFIG[item.institusi]
          const katCfg  = KATEGORI_CONFIG[item.kategori]

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 px-5 py-4 hover:shadow-sm hover:border-blue-200 transition-all"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {instCfg && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${instCfg.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${instCfg.dot} shrink-0`} />
                    {instCfg.label}
                  </span>
                )}
                {katCfg && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${katCfg.pill}`}>
                    {katCfg.label}
                  </span>
                )}
                <span className="text-[10px] text-slate-500 ml-auto shrink-0 self-center">
                  {fmtDate(item.tanggal_publikasi)}
                </span>
              </div>

              {/* Judul */}
              <h2 className="font-semibold text-slate-900 text-sm leading-snug">
                {item.url_sumber ? (
                  <a
                    href={item.url_sumber}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00315f] transition-colors"
                  >
                    {item.judul}
                  </a>
                ) : item.judul}
              </h2>

              {/* Ringkasan */}
              {item.ringkasan && (
                <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">{item.ringkasan}</p>
              )}

              {/* Link */}
              {item.url_sumber && (
                <a
                  href={item.url_sumber}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#00315f] hover:text-[#16487e] mt-2 font-medium transition-colors"
                >
                  Baca selengkapnya <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
