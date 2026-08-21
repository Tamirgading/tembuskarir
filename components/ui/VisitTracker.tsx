'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * VisitTracker — mencatat kunjungan halaman ke tabel page_views
 * untuk analytics admin (total visit, grafik pengunjung).
 * Visitor id disimpan di localStorage supaya unique visitor terhitung.
 */
export function VisitTracker() {
  const pathname = usePathname()
  const lastSent = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname === lastSent.current) return
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) return

    lastSent.current = pathname

    let visitorId = ''
    try {
      visitorId = localStorage.getItem('tk_visitor_id') ?? ''
      if (!visitorId) {
        visitorId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
        localStorage.setItem('tk_visitor_id', visitorId)
      }
    } catch { /* storage tidak tersedia */ }

    const payload = JSON.stringify({ path: pathname, visitorId })

    // Fire-and-forget, jangan blokir render
    void fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
