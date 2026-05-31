import { createClient } from '@/lib/supabase/server'
import PortalNavbar from '@/components/portal/PortalNavbar'
import type { UserRow } from '@/lib/utils'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  let userName: string | null = null
  let userPlan: string = 'free'
  let isLoggedIn = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isLoggedIn = true
      const { data } = await supabase
        .from('users')
        .select('full_name, plan')
        .eq('id', user.id)
        .single()
      const profile = data as Pick<UserRow, 'full_name' | 'plan'> | null
      userName = profile?.full_name ?? user.email?.split('@')[0] ?? null
      userPlan = profile?.plan ?? 'free'
    }
  } catch { /* Supabase not configured */ }

  return (
    <div className="min-h-screen bg-paper">
      <PortalNavbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        userPlan={userPlan as 'free' | 'premium'}
      />
      {children}
    </div>
  )
}
