import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as {
    name?: string
    slug?: string
    category?: string
    description?: string
    duration_minutes?: number
    total_questions?: number
    is_free?: boolean
    is_published?: boolean
  }

  const { name, slug, category, description, duration_minutes, total_questions, is_free, is_published } = body

  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: 'Nama dan slug wajib diisi.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('packages') as any)
    .insert({
      name: name.trim(),
      slug: slug.trim(),
      category: category ?? 'LAINNYA',
      description: description?.trim() || null,
      duration_minutes: duration_minutes ?? 90,
      total_questions: total_questions ?? 100,
      is_free: is_free ?? false,
      is_published: is_published ?? false,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug sudah digunakan. Gunakan slug yang berbeda.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Gagal membuat paket.' }, { status: 500 })
  }

  return NextResponse.json({ id: (data as { id: string }).id }, { status: 200 })
}
