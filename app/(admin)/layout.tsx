import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')
  if (!isAdmin(user.email)) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <header className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">
            <span className="text-blue-400">TryOut</span> Admin
          </span>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/packages" className="text-gray-300 hover:text-white transition-colors">
              Paket Soal
            </Link>
            <Link href="/admin/users" className="text-gray-300 hover:text-white transition-colors">
              Users & Revenue
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">{user.email}</span>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            ← Ke App
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
