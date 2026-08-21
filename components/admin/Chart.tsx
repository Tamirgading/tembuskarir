interface ChartPoint {
  label: string
  value: number
}

interface MiniLineChartProps {
  data: ChartPoint[]
  height?: number
  color?: string
  formatValue?: (v: number) => string
}

/**
 * MiniLineChart — grafik garis/area SVG ringan untuk admin dashboard.
 * Server-safe (tanpa state), pola sama seperti grafik di halaman /rapor.
 */
export function MiniLineChart({
  data,
  height = 180,
  color = '#2563eb',
  formatValue,
}: MiniLineChartProps) {
  const W = 600
  const H = height
  const PAD_L = 44
  const PAD_R = 12
  const PAD_T = 14
  const PAD_B = 26

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-xs text-gray-400" style={{ height }}>
        Belum ada data
      </div>
    )
  }

  const max = Math.max(1, ...data.map((d) => d.value))
  const niceMax = Math.ceil(max * 1.1)
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B

  const x = (i: number) => PAD_L + (i / Math.max(1, data.length - 1)) * innerW
  const y = (v: number) => PAD_T + innerH - (v / niceMax) * innerH

  const points = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ')
  const area = `${PAD_L},${(PAD_T + innerH).toFixed(1)} ${points} ${x(data.length - 1).toFixed(1)},${(PAD_T + innerH).toFixed(1)}`

  // Tampilkan maksimal ~6 label sumbu X
  const labelEvery = Math.ceil(data.length / 6)
  const yTicks = [0, 0.5, 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height }}>
      <defs>
        <linearGradient id={`area-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid + label Y */}
      {yTicks.map((t) => {
        const v = niceMax * t
        const yy = y(v)
        return (
          <g key={t}>
            <line x1={PAD_L} y1={yy} x2={W - PAD_R} y2={yy} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD_L - 6} y={yy + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
              {formatValue ? formatValue(Math.round(v)) : Math.round(v)}
            </text>
          </g>
        )
      })}

      {/* Area */}
      <polygon points={area} fill={`url(#area-${color.replace('#', '')})`} />

      {/* Garis */}
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Label X */}
      {data.map((d, i) => {
        if (i % labelEvery !== 0 && i !== data.length - 1) return null
        return (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}
