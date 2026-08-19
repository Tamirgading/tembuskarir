import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Lightbulb, ChevronLeft, Mountain, Car, Zap, Building2, Landmark, GraduationCap, Trophy, Plus } from 'lucide-react'
import type { PackageRow } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { PackageActions } from '@/components/admin/PackageActions'

const CATEGORY_META: Record<string, { icon: LucideIcon; desc: string }> = {
  ANTAM: { icon: Mountain, desc: 'Try-out ANTAM IMPACT 2026 (14 stream)' },
  ASTRA: { icon: Car, desc: 'Psikotes ASTRA' },
  PLN: { icon: Zap, desc: 'GAT PLN & Tahap 2' },
  BUMN: { icon: Building2, desc: 'Rekrutmen Bersama BUMN' },
  BI: { icon: Landmark, desc: 'Bank Indonesia' },
  OJK: { icon: Landmark, desc: 'Otoritas Jasa Keuangan' },
  KEDINASAN: { icon: GraduationCap, desc: 'Sekolah Kedinasan' },
  LAINNYA: { icon: Package, desc: 'Kategori lainnya' },
}

const CATEGORY_PRIORITY = ['ANTAM', 'ASTRA', 'PLN', 'BUMN', 'BI', 'OJK', 'KEDINASAN', 'LAINNYA']

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams?: { category?: string }
}) {
  const selectedCategory = searchParams?.category
  const supabase = createServiceClient()

  // Pakai service client agar semua paket terlihat (termasuk yang is_published=false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packagesData } = await (supabase.from('packages') as any)
    .select('*')
    .order('created_at', { ascending: false })

  const packages = (packagesData ?? []) as PackageRow[]

  // Group per kategori
  const byCategory = new Map<string, PackageRow[]>()
  for (const pkg of packages) {
    const arr = byCategory.get(pkg.category) ?? []
    arr.push(pkg)
    byCategory.set(pkg.category, arr)
  }

  const orderedCategories = [...CATEGORY_PRIORITY, ...Array.from(byCategory.keys()).filter((c) => !CATEGORY_PRIORITY.includes(c))]

  // ── Mode: kategori dipilih → tampilkan daftar paket ───────────────────────
  if (selectedCategory) {
    const selected = (byCategory.get(selectedCategory) ?? []).sort(
      (a, b) => Number(b.is_published) - Number(a.is_published)
    )
    const publishedCount = selected.filter((p) => p.is_published).length

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/packages" className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Semua Kategori
          </Link>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paket Soal — {selectedCategory}</h1>
            <p className="text-gray-500 mt-1">
              {selected.length} paket · {publishedCount} published
            </p>
          </div>
          <Link
            href={`/admin/packages/new?category=${selectedCategory}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Paket
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {selected.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="flex justify-center mb-3"><Package className="w-10 h-10 text-gray-300" /></div>
              <p>Belum ada paket di kategori {selectedCategory}.</p>
              <Link href={`/admin/packages/new?category=${selectedCategory}`} className="mt-3 inline-block text-blue-600 hover:underline text-sm">
                Buat paket pertama →
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 font-medium">Nama Paket</th>
                  <th className="px-5 py-3 font-medium text-center">Soal</th>
                  <th className="px-5 py-3 font-medium text-center">Tipe</th>
                  <th className="px-5 py-3 font-medium text-center">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {selected.map((pkg) => (
                  <tr key={pkg.id} className={`hover:bg-gray-50 transition-colors ${!pkg.is_published ? 'opacity-70' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{pkg.name}</p>
                        {!pkg.is_published && (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">DRAFT</span>
                        )}
                      </div>
                      {pkg.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{pkg.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center text-gray-600">{pkg.total_questions}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pkg.is_free ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {pkg.is_free ? 'GRATIS' : 'PREMIUM'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pkg.is_published ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {pkg.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/packages/${pkg.id}/questions`}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Kelola Soal
                        </Link>
                        <Link
                          href={`/admin/packages/${pkg.id}/leaderboard`}
                          className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
                        >
                          <Trophy className="w-3 h-3" /> Leaderboard
                        </Link>
                        <PackageActions packageId={pkg.id} isPublished={pkg.is_published} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Info kelola soal */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-700">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="font-semibold">Cara menambah soal ke paket:</p>
          </div>
          <p>Klik <strong>Kelola Soal</strong> di baris paket yang ingin diisi, lalu gunakan form input soal yang tersedia. Jumlah soal sebaiknya sesuai dengan target soal paket agar tampil penuh di website.</p>
        </div>
      </div>
    )
  }

  // ── Mode: tanpa kategori → tampilkan kartu kategori ───────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paket Soal</h1>
          <p className="text-gray-500 mt-1">{packages.length} paket total · pilih kategori untuk kelola paketnya</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Paket
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orderedCategories.map((cat) => {
          const meta = CATEGORY_META[cat]
          const Icon = meta?.icon ?? Package
          const catPackages = byCategory.get(cat) ?? []
          const published = catPackages.filter((p) => p.is_published).length

          return (
            <Link
              key={cat}
              href={`/admin/packages?category=${cat}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="font-num font-bold text-lg text-gray-900 leading-none">{catPackages.length}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">paket</p>
                </div>
              </div>
              <p className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{cat}</p>
              <p className="text-xs text-gray-400 mt-0.5">{meta?.desc ?? 'Paket soal'}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${published > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {published} published
                </span>
                <span className="text-xs text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">Buka →</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Info kelola soal */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-700">
        <div className="flex items-center gap-1.5 mb-1">
          <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
          <p className="font-semibold">Cara menambah soal ke paket:</p>
        </div>
        <p>Buka kategori paket, klik <strong>Kelola Soal</strong> di baris paket yang ingin diisi, lalu gunakan form input soal yang tersedia. Paket yang sudah <strong>Published</strong> otomatis tampil di website.</p>
      </div>
    </div>
  )
}
