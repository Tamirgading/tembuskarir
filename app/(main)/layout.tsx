import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import type { UserRow } from '@/lib/utils'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const profile = data as Pick<UserRow, 'full_name'> | null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={profile?.full_name ?? user.email?.split('@')[0] ?? null}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
