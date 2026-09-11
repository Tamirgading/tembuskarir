'use client'

import { useState } from 'react'

export interface ChartPoint {
  label: string
  value: number
  date?: string
}

interface MiniLineChartProps {
  data: ChartPoint[]
  height?: number
  color?: string
  formatValue?: (v: number) => string
  formatTooltipValue?: (v: number) => string
  unit?: string
}

/**
 * MiniLineChart: grafik garis/area SVG interaktif untuk admin dashboard.
 * Menampilkan tooltip nilai dan tanggal saat kursor diarahkan (hover) ke grafik.
 */
export function MiniLineChart({
  data,
  height = 190,
  color = '#2563eb',
  formatValue,
  formatTooltipValue,
  unit,
}: MiniLineChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const W = 600
  const H = height
  const PAD_L = 48
  const PAD_R = 16
  const PAD_T = 24
  const PAD_B = 28

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-xs text-gray-400" style={{ height }}>
        Belum ada data
      </div>
    )
  }

  const max = Math.max(1, ...data.map((d) => d.value))
  const niceMax = Math.ceil(max * 1.15)
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B

  const x = (i: number) => PAD_L + (i / Math.max(1, data.length - 1)) * innerW
  const y = (v: number) => PAD_T + innerH - (v / niceMax) * innerH

  const points = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ')
  const area = `${PAD_L},${(PAD_T + innerH).toFixed(1)} ${points} ${x(data.length - 1).toFixed(1)},${(PAD_T + innerH).toFixed(1)}`

  // Tampilkan maksimal ~6 label sumbu X
  const labelEvery = Math.ceil(data.length / 6)
  const yTicks = [0, 0.5, 1]

  const hoveredPoint = hoveredIdx !== null ? data[hoveredIdx] : null

  return (
    <div className="relative w-full select-none">
      {/* Live hover indicator header */}
      <div className="flex items-center justify-between text-xs mb-1.5 min-h-[24px]">
        <span className="text-[11px] text-gray-400">
          Arahkan kursor ke grafik untuk melihat rincian harian
        </span>
        {hoveredPoint ? (
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            <span className="text-gray-300">{hoveredPoint.date ?? hoveredPoint.label}:</span>
            <span className="text-white">
              {formatTooltipValue
                ? formatTooltipValue(hoveredPoint.value)
                : formatValue
                ? formatValue(hoveredPoint.value)
                : `${hoveredPoint.value} ${unit ?? ''}`}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-gray-400">30 Hari Terakhir</span>
        )}
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full overflow-visible"
          style={{ height }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id={`area-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.26" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid + label Y */}
          {yTicks.map((t) => {
            const v = niceMax * t
            const yy = y(v)
            return (
              <g key={t}>
                <line x1={PAD_L} y1={yy} x2={W - PAD_R} y2={yy} stroke="#f1f5f9" strokeWidth="1" />
                <text x={PAD_L - 8} y={yy + 4} textAnchor="end" fontSize="10.5" fill="#94a3b8" fontWeight="500">
                  {formatValue ? formatValue(Math.round(v)) : Math.round(v)}
                </text>
              </g>
            )
          })}

          {/* Area */}
          <polygon points={area} fill={`url(#area-${color.replace('#', '')})`} />

          {/* Garis */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Label X */}
          {data.map((d, i) => {
            if (i % labelEvery !== 0 && i !== data.length - 1) return null
            return (
              <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">
                {d.label}
              </text>
            )
          })}

          {/* Active Hover Tooltip & Highlight */}
          {hoveredIdx !== null && (() => {
            const pt = data[hoveredIdx]
            const px = x(hoveredIdx)
            const py = y(pt.value)
            const valStr = formatTooltipValue
              ? formatTooltipValue(pt.value)
              : formatValue
              ? formatValue(pt.value)
              : `${pt.value} ${unit ?? ''}`.trim()
            const dateStr = pt.date ?? pt.label

            const isNearTop = py < 45
            const textLen = Math.max(valStr.length, dateStr.length)
            const boxW = Math.max(88, textLen * 7.2 + 24)
            const boxH = 44
            const boxX = Math.min(Math.max(px - boxW / 2, 4), W - boxW - 4)
            const boxY = isNearTop ? py + 12 : py - boxH - 10

            return (
              <g className="pointer-events-none transition-all duration-75">
                {/* Vertical guideline */}
                <line
                  x1={px}
                  y1={PAD_T}
                  x2={px}
                  y2={PAD_T + innerH}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  strokeOpacity="0.6"
                />

                {/* Pulsing ring around dot */}
                <circle
                  cx={px}
                  cy={py}
                  r="9"
                  fill={color}
                  fillOpacity="0.25"
                />

                {/* Point dot */}
                <circle
                  cx={px}
                  cy={py}
                  r="4.5"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Tooltip background box */}
                <rect
                  x={boxX}
                  y={boxY}
                  width={boxW}
                  height={boxH}
                  rx="8"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1"
                />

                {/* Tooltip date label */}
                <text
                  x={boxX + boxW / 2}
                  y={boxY + 16}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontWeight="500"
                >
                  {dateStr}
                </text>

                {/* Tooltip value */}
                <text
                  x={boxX + boxW / 2}
                  y={boxY + 33}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="700"
                >
                  {valStr}
                </text>
              </g>
            )
          })()}

          {/* Interactive Invisible Hover Bars */}
          {data.map((_, i) => {
            const colW = innerW / Math.max(1, data.length - 1)
            const colX = x(i) - colW / 2
            return (
              <rect
                key={i}
                x={Math.max(0, colX)}
                y={0}
                width={colW}
                height={H}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
