import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/ui/AppShell'
import { getEffectiveFeatureFlags } from '@/lib/site-settings'
import { getDeviceNonce, isSingleSessionValid } from '@/lib/session-nonce'
import { redirect } from 'next/navigation'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Anti-sharing: hanya perangkat dengan nonce terbaru yang boleh aktif
  if (user) {
    const deviceNonce = await getDeviceNonce()
    const { data: nonceRow } = await supabase
      .from('users').select('session_nonce').eq('id', user.id).single()
    const sessionNonce = (nonceRow as { session_nonce: string | null } | null)?.session_nonce ?? null
    if (!isSingleSessionValid(sessionNonce, deviceNonce)) {
      await supabase.auth.signOut()
      redirect('/')
    }
  }

  const featureFlags = await getEffectiveFeatureFlags(user?.email)

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
    <AppShell isLoggedIn={!!user} userName={userName} userPlan={userPlan} featureFlags={featureFlags}>
      {children}
    </AppShell>
  )
}
