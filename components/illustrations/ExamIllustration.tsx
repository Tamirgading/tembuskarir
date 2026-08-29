interface ExamIllustrationProps {
  className?: string
}

/**
 * Ilustrasi flat "Belajar & Ujian" — lembar jawaban + centang + pensil.
 * Latar transparan, palet brand (emerald + navy + tint hangat).
 */
export function ExamIllustration({ className }: ExamIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Clipboard / lembar jawaban */}
      <rect x="58" y="30" width="84" height="104" rx="10" fill="#FFFFFF" stroke="#0E9F6E" strokeWidth="3" />
      {/* Clip */}
      <rect x="88" y="24" width="24" height="16" rx="6" fill="#0F2C44" />
      <rect x="93" y="29" width="14" height="6" rx="3" fill="#3A4A5A" />
      {/* Garis isian */}
      <rect x="70" y="52" width="60" height="6" rx="3" fill="#CBE8DC" />
      <rect x="70" y="66" width="48" height="6" rx="3" fill="#E4F0EC" />
      <rect x="70" y="80" width="56" height="6" rx="3" fill="#E4F0EC" />
      <rect x="70" y="94" width="38" height="6" rx="3" fill="#E4F0EC" />
      {/* Centang besar */}
      <path d="M92 108 L100 118 L120 94" stroke="#0E9F6E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Pensil */}
      <g transform="rotate(38 148 130)">
        <rect x="140" y="118" width="22" height="7" rx="3.5" fill="#0E9F6E" />
        <polygon points="162,121.5 172,124 162,126.5" fill="#F0EEE7" />
        <rect x="134" y="118" width="8" height="7" rx="2" fill="#FFC53D" />
      </g>

      {/* Buku kecil */}
      <rect x="40" y="76" width="22" height="16" rx="3" fill="#CBE8DC" />
      <line x1="51" y1="80" x2="51" y2="88" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Bintang dekorasi */}
      <path d="M150 40 L152 46 L158 48 L152 50 L150 56 L148 50 L142 48 L148 46 Z" fill="#0F2C44" opacity="0.8" />
      <circle cx="48" cy="44" r="3" fill="#0E9F6E" opacity="0.7" />
    </svg>
  )
}
