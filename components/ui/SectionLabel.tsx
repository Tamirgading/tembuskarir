import React from 'react'

interface SectionLabelProps {
  children: React.ReactNode
  /** Spacing eksternal, mis. "mb-3" */
  className?: string
  /** Untuk latar gelap (white text) */
  onDark?: boolean
  /** tracking-widest (jarak huruf lebih lebar) */
  wide?: boolean
  /** Ukuran lebih kecil: text-[10px] */
  small?: boolean
  /** Teks di kanan setelah garis pemisah (opsional) */
  trailing?: React.ReactNode
}

/**
 * Label section yang konsisten di seluruh platform:
 * huruf kecil uppercase tebal + tracking, opsional dengan garis pemisah
 * dan teks tambahan di kanan (pola di halaman harga).
 */
export function SectionLabel({
  children,
  className = '',
  onDark = false,
  wide = false,
  small = false,
  trailing,
}: SectionLabelProps) {
  const base = `font-bold uppercase ${
    onDark ? 'text-white/55' : 'text-ink-muted'
  } ${small ? 'text-[10px]' : 'text-[11px]'} ${wide ? 'tracking-widest' : 'tracking-wider'}`

  if (!trailing) {
    return <p className={`${base} ${className}`}>{children}</p>
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <p className={`${base} shrink-0`}>{children}</p>
      <div className="flex-1 h-px bg-hairline" />
      <p className="text-[11px] text-ink-muted shrink-0">{trailing}</p>
    </div>
  )
}
