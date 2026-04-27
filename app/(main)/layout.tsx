import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { NavbarWrapper } from '@/components/ui/NavbarWrapper'
import { MainWrapper } from '@/components/ui/MainWrapper'
import type { UserRow } from '@/lib/utils'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  // Baca pathname dari middleware — hanya untuk skip DB fetch di halaman ujian
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isExamPage = pathname.startsWith('/ujian')

  // Hanya fetch nama user jika bukan halaman ujian (hemat 1 DB call)
  let userName: string | null = null
  if (!isExamPage) {
    const { data } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .single()
    const profile = data as Pick<UserRow, 'full_name'> | null
    userName = profile?.full_name ?? user.email?.split('@')[0] ?? null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavbarWrapper & MainWrapper adalah client components — reaktif terhadap
          usePathname() sehingga navbar hilang saat soft navigation ke /ujian juga */}
      <NavbarWrapper userName={userName} />
      <MainWrapper>
        {children}
      </MainWrapper>
    </div>
  )
}
