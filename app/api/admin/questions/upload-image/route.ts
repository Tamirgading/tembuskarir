import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

const BUCKET = 'question-images'
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function POST(req: NextRequest) {
  try {
    // Auth + admin check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas 5 MB.' },
        { status: 400 }
      )
    }

    // Generate nama file unik
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `questions/${fileName}`

    // Upload ke Supabase Storage via service client
    const service = createServiceClient()
    const bytes = await file.arrayBuffer()

    const { error: uploadErr } = await service.storage
      .from(BUCKET)
      .upload(filePath, bytes, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadErr) {
      console.error('[Upload Image] Storage error:', uploadErr)
      // Jika bucket belum ada, beri pesan khusus
      if (uploadErr.message?.includes('bucket') || uploadErr.message?.includes('not found')) {
        return NextResponse.json(
          { error: 'Bucket "question-images" belum dibuat di Supabase Storage. Buat dulu di Supabase Dashboard → Storage.' },
          { status: 500 }
        )
      }
      return NextResponse.json({ error: 'Gagal mengupload gambar.' }, { status: 500 })
    }

    // Ambil public URL
    const { data: urlData } = service.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    return NextResponse.json({ url: urlData.publicUrl }, { status: 200 })
  } catch (err) {
    console.error('[Upload Image] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
