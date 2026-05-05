import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string   // tanpa href = item aktif/current (tidak bisa diklik)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

/**
 * Breadcrumb navigasi – pill style.
 * Selalu dimulai dengan ikon rumah → /dashboard.
 * Item terakhir dianggap halaman aktif (tidak ada href).
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center w-fit max-w-full overflow-x-auto gap-0.5
                 bg-white border border-gray-200 rounded-full shadow-sm
                 px-3 py-1.5 text-xs"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* Rumah — selalu link ke /dashboard */}
      <Link
        href="/dashboard"
        className="shrink-0 p-0.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        aria-label="Beranda"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-0.5 min-w-0">
          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />

          {item.href ? (
            <Link
              href={item.href}
              className="px-1.5 py-0.5 rounded-full text-gray-400 hover:text-blue-600
                         hover:bg-blue-50 transition-colors whitespace-nowrap truncate max-w-[140px]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="px-1.5 font-semibold text-gray-800 whitespace-nowrap truncate max-w-[160px]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
