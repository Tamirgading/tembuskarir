import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/ui/AppShell'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userName: string | null = null
  let userPlan: 'free' | 'premium' = 'free'

  if (user) {
    const { data } = await supabase
      .from('users')
      .select('full_name, plan')
      .eq('id', user.id)
      .single()
    const profile = data as { full_name: string | null; plan: 'free' | 'premium' } | null
    userName = profile?.full_name ?? user.email?.split('@')[0] ?? null
    userPlan = profile?.plan ?? 'free'
  }

  return (
    <AppShell userName={userName} userPlan={userPlan}>
      {children}
    </AppShell>
  )
}
