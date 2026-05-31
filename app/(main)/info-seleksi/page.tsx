import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Inbox } from 'lucide-react'

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

type CrawlLog = {
  ran_at: string
  status: string
  items_inserted: number
}

const INSTITUSI_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  OJK:  { label: 'OJK', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  BI:   { label: 'Bank Indonesia', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  PLN:  { label: 'PLN', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  RBB:  { label: 'RBB / BUMN', color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  ASTRA:{ label: 'Astra', color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
}

const KATEGORI_CONFIG: Record<string, { label: string; color: string }> = {
  pengumuman: { label: 'Pengumuman', color: 'bg-blue-50 text-blue-700' },
  jadwal:     { label: 'Jadwal', color: 'bg-green-50 text-green-700' },
  soal:       { label: 'Contoh Soal', color: 'bg-purple-50 text-purple-700' },
  tips:       { label: 'Tips', color: 'bg-yellow-50 text-yellow-700' },
  'kisi-kisi':{ label: 'Kisi-Kisi', color: 'bg-red-50 text-red-700' },
}

export const revalidate = 3600 // revalidate setiap 1 jam

export default async function InfoSeleksiPage({
  searchParams,
}: {
  searchParams: { institusi?: string; kategori?: string }
}) {
  const supabase = await createClient()

  const institusiFilter = searchParams.institusi?.toUpperCase()
  const kategoriFilter = searchParams.kategori

  let query = supabase
    .from('info_seleksi')
    .select('id, institusi, kategori, judul, ringkasan, url_sumber, tanggal_publikasi, crawled_at')
    .eq('is_active', true)
    .order('tanggal_publikasi', { ascending: false })
    .limit(50)

  if (institusiFilter) query = query.eq('institusi', institusiFilter)
  if (kategoriFilter) query = query.eq('kategori', kategoriFilter)

  const { data: rawItems, error } = await query
  const items = rawItems as InfoSeleksi[] | null

  // Ambil log crawl terakhir
  const { data: rawLastCrawl } = await supabase
    .from('crawl_log')
    .select('ran_at, status, items_inserted')
    .order('ran_at', { ascending: false })
    .limit(1)
    .single()
  const lastCrawl = rawLastCrawl as CrawlLog | null

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  const institusiList = Object.keys(INSTITUSI_CONFIG)
  const kategoriList = Object.keys(KATEGORI_CONFIG)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Info Seleksi Terbaru
          </h1>
          <p className="text-gray-500 text-sm">
            Data diperbarui otomatis setiap hari pukul 06.00 WIB dari sumber resmi masing-masing institusi.
          </p>
          {lastCrawl && (
            <p className="text-xs text-gray-400 mt-1">
              Update terakhir: {new Date(lastCrawl.ran_at).toLocaleString('id-ID')} •{' '}
              <span className={lastCrawl.status === 'success' ? 'text-green-600' : 'text-yellow-600'}>
                {lastCrawl.status}
              </span>
            </p>
          )}
        </div>

        {/* Filter Institusi */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Institusi</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/info-seleksi"
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !institusiFilter ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              Semua
            </Link>
            {institusiList.map((inst) => {
              const cfg = INSTITUSI_CONFIG[inst]
              const isActive = institusiFilter === inst
              return (
                <Link
                  key={inst}
                  href={`/info-seleksi?institusi=${inst.toLowerCase()}${kategoriFilter ? `&kategori=${kategoriFilter}` : ''}`}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot} mr-1.5 align-middle`} />{cfg.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Filter Kategori */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kategori</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/info-seleksi${institusiFilter ? `?institusi=${institusiFilter.toLowerCase()}` : ''}`}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !kategoriFilter ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              Semua
            </Link>
            {kategoriList.map((kat) => {
              const cfg = KATEGORI_CONFIG[kat]
              const isActive = kategoriFilter === kat
              return (
                <Link
                  key={kat}
                  href={`/info-seleksi?${institusiFilter ? `institusi=${institusiFilter.toLowerCase()}&` : ''}kategori=${kat}`}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
                  }`}
                >
                  {cfg.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Daftar Item */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            Gagal memuat data. Silakan refresh halaman.
          </div>
        )}

        {!error && items?.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="flex justify-center mb-3"><Inbox className="w-10 h-10 text-gray-300" /></div>
            <p className="font-medium">Belum ada data untuk filter ini.</p>
            <p className="text-sm mt-1">Data akan muncul setelah cron job berjalan pertama kali.</p>
          </div>
        )}

        <div className="space-y-3">
          {items?.map((item) => {
            const instCfg = INSTITUSI_CONFIG[item.institusi]
            const katCfg = KATEGORI_CONFIG[item.kategori]

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {instCfg && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${instCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${instCfg.dot} shrink-0`} />{instCfg.label}
                        </span>
                      )}
                      {katCfg && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${katCfg.color}`}>
                          {katCfg.label}
                        </span>
                      )}
                    </div>

                    {/* Judul */}
                    <h2 className="font-semibold text-gray-900 leading-snug mb-1">
                      {item.url_sumber ? (
                        <a
                          href={item.url_sumber}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                        >
                          {item.judul}
                        </a>
                      ) : (
                        item.judul
                      )}
                    </h2>

                    {/* Ringkasan */}
                    {item.ringkasan && (
                      <p className="text-sm text-gray-500 line-clamp-2">{item.ringkasan}</p>
                    )}
                  </div>

                  {/* Tanggal */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-gray-700">
                      {formatDate(item.tanggal_publikasi)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Crawled {new Date(item.crawled_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {item.url_sumber && (
                  <a
                    href={item.url_sumber}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-3"
                  >
                    Baca selengkapnya →
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
