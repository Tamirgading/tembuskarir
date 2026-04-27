'use client'

import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─── Parser LaTeX/Bold ───────────────────────────────────────────────────────
type Part =
  | { t: 'text'; v: string }
  | { t: 'bold'; v: string }
  | { t: 'inline'; v: string }
  | { t: 'block'; v: string }

function parse(text: string): Part[] {
  const parts: Part[] = []
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\*\*[^*]+?\*\*)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: 'text', v: text.slice(last, m.index) })
    const matched = m[0]
    if (matched.startsWith('$$')) parts.push({ t: 'block', v: matched.slice(2, -2) })
    else if (matched.startsWith('**')) parts.push({ t: 'bold', v: matched.slice(2, -2) })
    else parts.push({ t: 'inline', v: matched.slice(1, -1) })
    last = m.index + matched.length
  }
  if (last < text.length) parts.push({ t: 'text', v: text.slice(last) })
  return parts
}

function renderMath(formula: string, displayMode: boolean): string {
  try {
    return katex.renderToString(formula.trim(), { displayMode, throwOnError: false, strict: false })
  } catch {
    return formula
  }
}

// ─── Inline renderer (teks + LaTeX dalam satu baris) ─────────────────────────
function InlineParts({ text }: { text: string }) {
  const parts = parse(text)
  return (
    <>
      {parts.map((part, i) => {
        if (part.t === 'text') return <span key={i}>{part.v}</span>
        if (part.t === 'bold') return <strong key={i}>{part.v}</strong>
        if (part.t === 'block') return (
          <span key={i} className="block my-2 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderMath(part.v, true) }} />
        )
        return <span key={i} dangerouslySetInnerHTML={{ __html: renderMath(part.v, false) }} />
      })}
    </>
  )
}

// ─── Line grouper (deteksi list markdown) ────────────────────────────────────
type LineGroup =
  | { type: 'ordered'; items: string[] }
  | { type: 'unordered'; items: string[] }
  | { type: 'paragraph'; lines: string[] }

function groupLines(text: string): LineGroup[] {
  const lines = text.split('\n')
  const groups: LineGroup[] = []

  for (const line of lines) {
    const orderedMatch = line.match(/^\d+[.)]\s+(.*)/)
    const unorderedMatch = line.match(/^[-*•]\s+(.*)/)

    if (orderedMatch) {
      const last = groups[groups.length - 1]
      if (last?.type === 'ordered') last.items.push(orderedMatch[1])
      else groups.push({ type: 'ordered', items: [orderedMatch[1]] })
    } else if (unorderedMatch) {
      const last = groups[groups.length - 1]
      if (last?.type === 'unordered') last.items.push(unorderedMatch[1])
      else groups.push({ type: 'unordered', items: [unorderedMatch[1]] })
    } else {
      const last = groups[groups.length - 1]
      if (last?.type === 'paragraph') last.lines.push(line)
      else groups.push({ type: 'paragraph', lines: [line] })
    }
  }

  return groups
}

// ─── Komponen utama ───────────────────────────────────────────────────────────
interface LatexContentProps {
  content: string
  className?: string
}

/**
 * Render teks + LaTeX + list markdown.
 * - Inline math: $...$
 * - Block math:  $$...$$
 * - Bold: **...**
 * - Numbered list: 1. item / 1) item
 * - Bullet list:   - item / * item / • item
 */
export function LatexContent({ content, className }: LatexContentProps) {
  if (!content) return null

  const groups = groupLines(content)

  return (
    <span className={className}>
      {groups.map((group, gi) => {
        if (group.type === 'ordered') {
          return (
            <ol key={gi} className="list-none my-2 space-y-1">
              {group.items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2 leading-snug">
                  <span className="shrink-0 text-xs font-semibold text-gray-500 mt-0.5 w-4 text-right">{ii + 1}.</span>
                  <span><InlineParts text={item} /></span>
                </li>
              ))}
            </ol>
          )
        }
        if (group.type === 'unordered') {
          return (
            <ul key={gi} className="list-none my-2 space-y-1">
              {group.items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2 leading-snug">
                  <span className="shrink-0 text-gray-400 mt-0.5">•</span>
                  <span><InlineParts text={item} /></span>
                </li>
              ))}
            </ul>
          )
        }
        // paragraph — gabung lines dengan newline, render LaTeX
        const joined = group.lines.join('\n')
        const parts = parse(joined)
        return (
          <span key={gi}>
            {parts.map((part, i) => {
              if (part.t === 'text') return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part.v}</span>
              if (part.t === 'bold') return <strong key={i}>{part.v}</strong>
              if (part.t === 'block') return (
                <span key={i} className="block my-2 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: renderMath(part.v, true) }} />
              )
              return <span key={i} dangerouslySetInnerHTML={{ __html: renderMath(part.v, false) }} />
            })}
          </span>
        )
      })}
    </span>
  )
}
