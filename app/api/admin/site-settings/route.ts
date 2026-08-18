import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { getFeatureFlags, setFeatureFlag, type FeatureKey } from '@/lib/site-settings'

const VALID_KEYS: FeatureKey[] = [
  'feature_info_seleksi',
  'feature_semua_paket',
  'feature_portal_pln',
  'feature_portal_bumn',
]

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const flags = await getFeatureFlags()
  return NextResponse.json(flags)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { key, enabled } = body as { key: string; enabled: boolean }

  if (!VALID_KEYS.includes(key as FeatureKey) || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  await setFeatureFlag(key as FeatureKey, enabled)
  return NextResponse.json({ ok: true })
}
