import { NewPackageForm } from '@/components/admin/NewPackageForm'
import Link from 'next/link'

export default function NewPackagePage({
  searchParams,
}: {
  searchParams?: { category?: string }
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/packages" className="text-gray-400 hover:text-gray-600 text-sm">← Paket Soal</Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Paket Soal</h1>
        <p className="text-gray-500 mt-1">Buat paket baru. Soal bisa ditambah via import JSON setelah paket dibuat.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <NewPackageForm defaultCategory={searchParams?.category} />
      </div>
    </div>
  )
}
