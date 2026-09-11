import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { getPlansConfig, savePlansConfig } from '@/lib/plans-server'
import { type PlanConfig, DEFAULT_PLANS } from '@/lib/plans'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plans = await getPlansConfig()
  return NextResponse.json(plans)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { plans?: Record<string, Partial<PlanConfig>> }
  if (!body || !body.plans || typeof body.plans !== 'object') {
    return NextResponse.json({ error: 'Data plan tidak valid' }, { status: 400 })
  }

  // Validate each plan key and sanitized values
  const current = await getPlansConfig()
  const updated: Record<string, Partial<PlanConfig>> = {}

  for (const [key, val] of Object.entries(body.plans)) {
    if (!(key in DEFAULT_PLANS)) continue
    updated[key] = {
      price: typeof val.price === 'number' && val.price >= 0 ? val.price : current[key].price,
      isActive: typeof val.isActive === 'boolean' ? val.isActive : current[key].isActive,
      badge: typeof val.badge === 'string' ? val.badge.trim() || null : null,
      description: typeof val.description === 'string' ? val.description.trim() : current[key].description,
    }
  }

  await savePlansConfig(updated)
  const latest = await getPlansConfig()
  return NextResponse.json({ ok: true, plans: latest })
}
