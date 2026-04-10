import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Webhook Midtrans — boleh tanpa auth
  if (pathname.startsWith('/api/webhook')) {
    return NextResponse.next()
  }

  // Jika Supabase belum dikonfigurasi, lewati middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl === 'GANTI_INI' || !supabaseUrl.startsWith('http')) {
    return NextResponse.next()
  }

  const { supabaseResponse, user } = await updateSession(request)

  // Route group (main) + admin — wajib login
  // Catatan: /harga dan /paket bisa diakses publik (guest bisa lihat)
  // tapi /ujian, /hasil, /dashboard, /profil, /admin butuh login
  const isMainRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/ujian') ||
    pathname.startsWith('/hasil') ||
    pathname.startsWith('/profil') ||
    pathname.startsWith('/admin')

  if (isMainRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Sudah login tapi akses halaman auth — redirect ke dashboard
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/lupa-password'

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
