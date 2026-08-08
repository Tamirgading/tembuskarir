'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Crown, Package, Newspaper, Star, X } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type NotifType = 'premium_expiring' | 'new_package' | 'new_info_seleksi' | 'achievement'

interface Notif {
  id: string
  type: NotifType
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

const TYPE_CFG: Record<NotifType, { icon: React.ReactNode; cls: string }> = {
  premium_expiring: { icon: <Crown   className="w-3.5 h-3.5" />, cls: 'bg-amber-100 text-amber-600' },
  new_package:      { icon: <Package  className="w-3.5 h-3.5" />, cls: 'bg-brand/10 text-brand'     },
  new_info_seleksi: { icon: <Newspaper className="w-3.5 h-3.5" />, cls: 'bg-green-100 text-green-600' },
  achievement:      { icon: <Star     className="w-3.5 h-3.5" />, cls: 'bg-purple-100 text-purple-600' },
}

function timeAgo(dateStr: string): string {
  const m = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60_000)
  if (m < 1)  return 'baru saja'
  if (m < 60) return `${m} mnt lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  return `${Math.floor(h / 24)} hari lalu`
}

export function NotificationBell() {
  const [open, setOpen]     = useState(false)
  const [notifs, setNotifs] = useState<Notif[]>([])
  const ref = useRef<HTMLDivElement>(null)

  const unread = notifs.filter((n) => !n.is_read).length

  useEffect(() => {
    load()
    const t = setInterval(load, 60_000)
    return () => clearInterval(t)
  }, [])

  // Tutup saat klik di luar
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  async function load() {
    try {
      const supabase = createClient()
      const { data } = await (supabase.from('notifications') as any)
        .select('id,type,title,body,link,is_read,created_at')
        .order('created_at', { ascending: false })
        .limit(20)
      setNotifs((data ?? []) as Notif[])
    } catch { /* ignore — belum dikonfigurasi */ }
  }

  async function toggle() {
    const opening = !open
    setOpen(opening)
    if (opening && unread > 0) {
      const ids = notifs.filter((n) => !n.is_read).map((n) => n.id)
      try {
        const supabase = createClient()
        await (supabase.from('notifications') as any).update({ is_read: true }).in('id', ids)
        setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })))
      } catch { /* ignore */ }
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        title="Notifikasi"
        className="relative p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-black/5 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft border border-hairline z-20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-ink text-sm">Notifikasi</p>
              {unread > 0 && (
                <span className="text-[10px] font-bold bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                  {unread} baru
                </span>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          {notifs.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="w-8 h-8 text-ink-muted mx-auto mb-2.5 opacity-25" />
              <p className="text-sm font-medium text-ink-muted">Belum ada notifikasi</p>
              <p className="text-xs text-ink-muted mt-1 opacity-70">Kami akan memberitahu kamu di sini</p>
            </div>
          ) : (
            <div className="divide-y divide-hairline max-h-96 overflow-y-auto">
              {notifs.map((n) => {
                const cfg = TYPE_CFG[n.type] ?? { icon: <Bell className="w-3.5 h-3.5" />, cls: 'bg-paper-soft text-ink-muted' }
                const row = (
                  <div className={`flex items-start gap-3 px-4 py-3.5 hover:bg-paper-soft transition-colors ${!n.is_read ? 'bg-brand/[0.03]' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.cls}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${!n.is_read ? 'font-semibold text-ink' : 'font-medium text-ink-soft'}`}>
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                      )}
                      <p className="text-[10px] text-ink-muted mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />}
                  </div>
                )
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => setOpen(false)}>{row}</Link>
                ) : (
                  <div key={n.id}>{row}</div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
