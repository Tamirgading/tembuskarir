import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

interface WmPairEntry {
  id: string
  package_id: string
  memory_pairs: { word: string; number: number }[]
  memory_duration_seconds: number
  order_index: number
}

// GET /api/admin/questions/wm-pairs?packageId=...
// Kembalikan semua WM memory pairs untuk paket tertentu
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const packageId = req.nextUrl.searchParams.get('packageId')
  if (!packageId) {
    return NextResponse.json({ error: 'packageId wajib diisi.' }, { status: 400 })
  }

  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (service.from('questions_astra_wm') as any)
    .select('id, package_id, memory_pairs, memory_duration_seconds, order_index')
    .eq('package_id', packageId)
    .order('order_index', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Gagal mengambil data WM pairs.' }, { status: 500 })
  }

  return NextResponse.json({ data: data as WmPairEntry[] })
}

// PUT /api/admin/questions/wm-pairs
// Update memory_pairs satu entry questions_astra_wm
export async function PUT(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as {
    id: string
    memory_pairs: { word: string; number: number }[]
  }

  if (!body.id || !Array.isArray(body.memory_pairs)) {
    return NextResponse.json({ error: 'id dan memory_pairs wajib diisi.' }, { status: 400 })
  }

  // Validasi: minimal 1 pasangan, max 10
  if (body.memory_pairs.length === 0 || body.memory_pairs.length > 10) {
    return NextResponse.json({ error: 'Pasangan harus 1–10 item.' }, { status: 400 })
  }

  // Validasi tiap pasangan
  for (const p of body.memory_pairs) {
    if (!p.word?.trim()) return NextResponse.json({ error: 'Setiap kata harus diisi.' }, { status: 400 })
    if (typeof p.number !== 'number' || isNaN(p.number)) {
      return NextResponse.json({ error: 'Setiap angka harus berupa bilangan valid.' }, { status: 400 })
    }
  }

  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (service.from('questions_astra_wm') as any)
    .update({ memory_pairs: body.memory_pairs })
    .eq('id', body.id)

  if (error) {
    return NextResponse.json({ error: 'Gagal menyimpan pasangan hafalan.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
