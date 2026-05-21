export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkPackageAccess } from '@/lib/access'

export async function GET(req: NextRequest) {
  try {
    const packageId = req.nextUrl.searchParams.get('packageId')
    if (!packageId) {
      return NextResponse.json({ error: 'packageId required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ canAccess: false, reason: 'unauthenticated' })
    }

    // Fetch package metadata
    const { data: pkg, error: pkgErr } = await supabase
      .from('packages')
      .select('id, is_free, category')
      .eq('id', packageId)
      .single()

    if (pkgErr || !pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    const pkgTyped = pkg as { id: string; is_free: boolean; category: string }

    const status = await checkPackageAccess(user.id, packageId, pkgTyped.is_free, pkgTyped.category)
    const canAccess = status !== 'locked'

    return NextResponse.json({ canAccess, category: pkgTyped.category, status })
  } catch (err) {
    console.error('[api/access] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
