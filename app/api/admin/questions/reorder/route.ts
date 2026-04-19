import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

interface ReorderBody {
  id1: string
  orderIndex1: number
  id2: string
  orderIndex2: number
  packageId: string
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as ReorderBody
    const { id1, orderIndex1, id2, orderIndex2, packageId } = body

    if (!id1 || !id2 || !packageId) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 })
    }

    const service = createServiceClient()

    // Swap order_index antara dua soal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err1 } = await (service.from('questions') as any)
      .update({ order_index: orderIndex2 })
      .eq('id', id1)
      .eq('package_id', packageId)

    if (err1) {
      console.error('[Reorder] err1:', err1)
      return NextResponse.json({ error: 'Gagal update urutan soal.' }, { status: 500 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err2 } = await (service.from('questions') as any)
      .update({ order_index: orderIndex1 })
      .eq('id', id2)
      .eq('package_id', packageId)

    if (err2) {
      console.error('[Reorder] err2:', err2)
      return NextResponse.json({ error: 'Gagal update urutan soal.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Reorder] Unexpected:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
