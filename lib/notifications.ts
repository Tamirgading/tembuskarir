/**
 * Server-only helper — buat notifikasi in-app via service role (bypass RLS).
 * Hanya dipakai dari cron routes / server actions.
 */
import { createClient } from '@supabase/supabase-js'

export type NotifType = 'premium_expiring' | 'new_package' | 'new_info_seleksi' | 'achievement'

function svc() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** Buat 1 notifikasi untuk 1 user */
export async function notify(
  userId: string,
  type: NotifType,
  title: string,
  body?: string,
  link?: string
) {
  await svc().from('notifications').insert({
    user_id: userId, type, title,
    body: body ?? null,
    link: link ?? null,
  })
}

/**
 * Cek apakah user sudah menerima notif bertipe X dalam N jam terakhir.
 * Dipakai untuk menghindari kirim duplikat dari cron.
 */
export async function hasRecentNotif(
  userId: string,
  type: NotifType,
  withinHours = 24
): Promise<boolean> {
  const since = new Date(Date.now() - withinHours * 3_600_000).toISOString()
  const { data } = await svc()
    .from('notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('created_at', since)
    .limit(1)
  return (data?.length ?? 0) > 0
}

/**
 * Kirim notifikasi ke SEMUA user aktif (bulk insert 500/batch).
 * Dipakai saat ada info seleksi baru atau paket baru.
 */
export async function notifyAll(
  type: NotifType,
  title: string,
  body?: string,
  link?: string
) {
  const supabase = svc()
  const { data: users } = await supabase.from('users').select('id')
  if (!users || users.length === 0) return

  const rows = (users as { id: string }[]).map((u) => ({
    user_id: u.id, type, title,
    body: body ?? null,
    link: link ?? null,
  }))

  for (let i = 0; i < rows.length; i += 500) {
    await supabase.from('notifications').insert(rows.slice(i, i + 500))
  }
}
