'use client'

import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─── Parser ─────────────────────────────────────────────────────────────────
type Part =
  | { t: 'text'; v: string }
  | { t: 'inline'; v: string }
  | { t: 'block'; v: string }

function parse(text: string): Part[] {
  const parts: Part[] = []
  // Cocokkan $$...$$ (blok) lalu $...$ (inline) — urutan penting!
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ t: 'text', v: text.slice(last, m.index) })
    }
    const matched = m[0]
    if (matched.startsWith('$$')) {
      parts.push({ t: 'block', v: matched.slice(2, -2) })
    } else {
      parts.push({ t: 'inline', v: matched.slice(1, -1) })
    }
    last = m.index + matched.length
  }

  if (last < text.length) {
    parts.push({ t: 'text', v: text.slice(last) })
  }

  return parts
}

function renderMath(formula: string, displayMode: boolean): string {
  try {
    return katex.renderToString(formula.trim(), {
      displayMode,
      throwOnError: false,
      strict: false,
    })
  } catch {
    return formula
  }
}

// ─── Komponen ────────────────────────────────────────────────────────────────
interface LatexContentProps {
  content: string
  className?: string
}

/**
 * Render teks biasa + LaTeX.
 * - Inline math: $...$
 * - Block math:  $$...$$
 */
export function LatexContent({ content, className }: LatexContentProps) {
  if (!content) return null

  const parts = parse(content)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.t === 'text') {
          // Preserve whitespace & newlines
          return (
            <span key={i} style={{ whiteSpace: 'pre-wrap' }}>
              {part.v}
            </span>
          )
        }
        if (part.t === 'block') {
          return (
            <span
              key={i}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: renderMath(part.v, true) }}
            />
          )
        }
        // inline
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: renderMath(part.v, false) }}
          />
        )
      })}
    </span>
  )
}
