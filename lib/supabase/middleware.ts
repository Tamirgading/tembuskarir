import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest, extraHeaders?: Record<string, string>) {
  // Augment request headers (e.g. x-pathname) so server components can read them
  const augmented = new Headers(request.headers)
  if (extraHeaders) Object.entries(extraHeaders).forEach(([k, v]) => augmented.set(k, v))

  let supabaseResponse = NextResponse.next({ request: { headers: augmented } })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request: { headers: augmented } })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — JANGAN hapus baris ini
  const { data: { user } } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
