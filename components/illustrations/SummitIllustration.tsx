interface SummitIllustrationProps {
  className?: string
}

/**
 * Ilustrasi flat "Mendaki & Sukses" — pendaki di puncak dengan bendera.
 * Latar transparan, palet brand (emerald + navy + tint hangat).
 */
export function SummitIllustration({ className }: SummitIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Matahari */}
      <circle cx="150" cy="38" r="16" fill="#FFC53D" opacity="0.9" />
      <circle cx="150" cy="38" r="22" fill="#FFC53D" opacity="0.25" />

      {/* Gunung belakang */}
      <polygon points="28,140 90,58 152,140" fill="#CBE8DC" />
      {/* Gunung depan (brand) */}
      <polygon points="58,140 128,44 198,140" fill="#0E9F6E" />

      {/* Jalur pendakian */}
      <path
        d="M92 128 L104 110 L98 108 L112 90 L106 88 L122 66"
        stroke="#0B7D57"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.55"
      />

      {/* Bendera di puncak */}
      <line x1="128" y1="44" x2="128" y2="22" stroke="#0F2C44" strokeWidth="3.5" strokeLinecap="round" />
      <polygon points="130,22 152,28 130,34" fill="#0F2C44" />

      {/* Pendaki */}
      <g>
        {/* Badan */}
        <rect x="118" y="74" width="10" height="16" rx="5" fill="#FFFFFF" />
        {/* Kepala */}
        <circle cx="123" cy="67" r="6" fill="#FFFFFF" />
        {/* Ransel */}
        <rect x="109" y="76" width="7" height="12" rx="3.5" fill="#CBE8DC" />
        {/* Tongkat */}
        <line x1="131" y1="78" x2="136" y2="92" stroke="#0F2C44" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Tanah */}
      <rect x="48" y="138" width="104" height="6" rx="3" fill="#0B7D57" opacity="0.4" />

      {/* Bintang dekorasi */}
      <path d="M40 40 L42 45 L47 47 L42 49 L40 54 L38 49 L33 47 L38 45 Z" fill="#0F2C44" opacity="0.7" />
      <path d="M68 24 L69.5 27.5 L73 29 L69.5 30.5 L68 34 L66.5 30.5 L63 29 L66.5 27.5 Z" fill="#0E9F6E" opacity="0.8" />
    </svg>
  )
}
