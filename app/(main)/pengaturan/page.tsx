import { Settings } from 'lucide-react'

export default function PengaturanPage() {
  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
          <Settings className="w-7 h-7 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-500 mt-1 text-sm">Fitur ini sedang dalam pengembangan.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center text-gray-400 text-sm">
        Segera hadir — pengaturan akun, preferensi notifikasi, dan lainnya.
      </div>
    </div>
  )
}
