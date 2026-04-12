import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { PackageRow } from '@/lib/utils'
import { PackageActions } from '@/components/admin/PackageActions'

export default async function AdminPackagesPage() {
  const supabase = await createClient()

  const { data: packagesData } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false })

  const packages = (packagesData ?? []) as PackageRow[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paket Soal</h1>
          <p className="text-gray-500 mt-1">{packages.length} paket total</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Tambah Paket
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {packages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p>Belum ada paket soal.</p>
            <Link href="/admin/packages/new" className="mt-3 inline-block text-blue-600 hover:underline text-sm">
              Buat paket pertama →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 font-medium">Nama Paket</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium text-center">Soal</th>
                <th className="px-5 py-3 font-medium text-center">Tipe</th>
                <th className="px-5 py-3 font-medium text-center">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{pkg.name}</p>
                      {pkg.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{pkg.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{pkg.category}</td>
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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/packages/${pkg.id}/questions`}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Kelola Soal
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
        <p className="font-semibold mb-1">💡 Cara menambah soal ke paket:</p>
        <p>Klik <strong>Kelola Soal</strong> di baris paket yang ingin diisi, lalu gunakan form input soal yang tersedia. Paket CPNS membutuhkan tepat <strong>110 soal</strong> (TWK: 30, TIU: 35, TKP: 45) agar tampil penuh di website.</p>
      </div>
    </div>
  )
}
