import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { packageId, publish } = await req.json() as { packageId?: string; publish?: boolean }

  if (!packageId) {
    return NextResponse.json({ error: 'packageId required' }, { status: 400 })
  }

  // Gunakan service client agar tidak diblokir RLS (tidak ada UPDATE policy untuk packages)
  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (service.from('packages') as any)
    .update({ is_published: publish })
    .eq('id', packageId)

  if (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ message: 'OK' }, { status: 200 })
}
