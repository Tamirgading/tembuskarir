import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setSessionNonce } from '@/lib/session-nonce'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }
    await setSessionNonce(user.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[session-nonce] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
