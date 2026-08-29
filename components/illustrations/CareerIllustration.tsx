interface CareerIllustrationProps {
  className?: string
}

/**
 * Ilustrasi flat "Karier & Perusahaan" — grafik naik + gedung + koper.
 * Latar transparan, palet brand (emerald + navy + tint hangat).
 */
export function CareerIllustration({ className }: CareerIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Grafik naik */}
      <path
        d="M20 118 L62 118 L74 82 L104 118 L126 62 L180 62"
        stroke="#0E9F6E"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Titik akhir + panah */}
      <circle cx="180" cy="62" r="6" fill="#0F2C44" />
      <path d="M176 44 L180 62 L194 58" stroke="#0F2C44" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Gedung kiri */}
      <rect x="24" y="84" width="34" height="48" rx="4" fill="#CBE8DC" />
      <rect x="30" y="92" width="8" height="8" rx="2" fill="#FFFFFF" />
      <rect x="44" y="92" width="8" height="8" rx="2" fill="#FFFFFF" />
      <rect x="30" y="106" width="8" height="8" rx="2" fill="#FFFFFF" />
      <rect x="44" y="106" width="8" height="8" rx="2" fill="#FFFFFF" />

      {/* Gedung kanan */}
      <rect x="140" y="70" width="40" height="62" rx="4" fill="#E4F0EC" />
      <rect x="146" y="80" width="9" height="9" rx="2" fill="#FFFFFF" />
      <rect x="161" y="80" width="9" height="9" rx="2" fill="#FFFFFF" />
      <rect x="146" y="95" width="9" height="9" rx="2" fill="#FFFFFF" />
      <rect x="161" y="95" width="9" height="9" rx="2" fill="#FFFFFF" />
      <rect x="146" y="110" width="9" height="9" rx="2" fill="#FFFFFF" />
      <rect x="161" y="110" width="9" height="9" rx="2" fill="#FFFFFF" />

      {/* Koper / briefcase */}
      <rect x="82" y="122" width="36" height="26" rx="6" fill="#0F2C44" />
      <rect x="94" y="114" width="12" height="10" rx="4" fill="#3A4A5A" />
      <rect x="82" y="122" width="36" height="26" rx="6" fill="#0F2C44" />
      <rect x="94" y="114" width="12" height="10" rx="4" fill="#0F2C44" />

      {/* Lantai */}
      <rect x="12" y="142" width="176" height="5" rx="2.5" fill="#E4F0EC" />

      {/* Bintang dekorasi */}
      <circle cx="60" cy="36" r="3" fill="#0E9F6E" opacity="0.7" />
      <circle cx="112" cy="30" r="2.5" fill="#0F2C44" opacity="0.5" />
    </svg>
  )
}
