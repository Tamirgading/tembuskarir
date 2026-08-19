interface LeaderboardIllustrationProps {
  className?: string
}

/**
 * Ilustrasi podium (custom SVG) sebagai pengganti ikon piala di fitur leaderboard.
 * Bukan emoji, bukan ikon generik — ilustrasi flat sederhana dengan palet brand.
 */
export function LeaderboardIllustration({ className }: LeaderboardIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Podium */}
      <rect x="4.5" y="24.5" width="11" height="17" rx="2.5" fill="#CBE8DC" />
      <rect x="18.5" y="15" width="11" height="26.5" rx="2.5" fill="#0E9F6E" />
      <rect x="32.5" y="29" width="11" height="12.5" rx="2.5" fill="#E4F0EC" />
      {/* Figur */}
      <circle cx="10" cy="19" r="4.5" fill="#CBE8DC" />
      <circle cx="24" cy="9.5" r="4.5" fill="#0E9F6E" />
      <circle cx="38" cy="23.5" r="4.5" fill="#E4F0EC" />
    </svg>
  )
}
