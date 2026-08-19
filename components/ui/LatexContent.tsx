'use client'

import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─── Parser LaTeX/Bold ───────────────────────────────────────────────────────
type Part =
  | { t: 'text'; v: string }
  | { t: 'bold'; v: string }
  | { t: 'italic'; v: string }
  | { t: 'inline'; v: string }
  | { t: 'block'; v: string }

function parse(text: string): Part[] {
  const parts: Part[] = []
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\*\*[^*]+?\*\*|\*[^*\n]+?\*)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: 'text', v: text.slice(last, m.index) })
    const matched = m[0]
    if (matched.startsWith('$$')) parts.push({ t: 'block', v: matched.slice(2, -2) })
    else if (matched.startsWith('**')) parts.push({ t: 'bold', v: matched.slice(2, -2) })
    else if (matched.startsWith('*')) parts.push({ t: 'italic', v: matched.slice(1, -1) })
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
        if (part.t === 'italic') return <em key={i}>{part.v}</em>
        if (part.t === 'block') return (
          <span key={i} className="block my-2 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderMath(part.v, true) }} />
        )
        return <span key={i} dangerouslySetInnerHTML={{ __html: renderMath(part.v, false) }} />
      })}
    </>
  )
}

// ─── Line grouper (deteksi list & tabel markdown) ────────────────────────────
type LineGroup =
  | { type: 'ordered'; items: string[] }
  | { type: 'unordered'; items: string[] }
  | { type: 'table'; rows: string[] }
  | { type: 'paragraph'; lines: string[] }

function isTableLine(line: string): boolean {
  const t = line.trim()
  // baris tabel: diawali "|" dan diakhiri "|", minimal ada pembatas antar kolom
  return /^\|.*\|\s*$/.test(t) && t.replace(/\|/g, '').trim().length > 0
}

function groupLines(text: string): LineGroup[] {
  const lines = text.split('\n')
  const groups: LineGroup[] = []

  for (const line of lines) {
    if (isTableLine(line)) {
      const last = groups[groups.length - 1]
      if (last?.type === 'table') last.rows.push(line)
      else groups.push({ type: 'table', rows: [line] })
      continue
    }

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

// ─── Renderer tabel markdown ─────────────────────────────────────────────────
function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c))
}

function TableBlock({ rows }: { rows: string[] }) {
  const parsed = rows.map(parseTableRow)
  const sepIdx = parsed.findIndex((cells) => isSeparatorRow(cells))
  const header = sepIdx >= 0 ? parsed.slice(0, sepIdx).flat() : parsed[0] ?? []
  const bodyStart = sepIdx >= 0 ? sepIdx + 1 : 1
  const body = parsed.slice(bodyStart).filter((cells) => cells.length > 0 && !isSeparatorRow(cells))

  const cellCls = 'border border-hairline px-2.5 py-1.5 align-top'
  return (
    <div className="my-2 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i} className={`${cellCls} bg-paper-soft text-left font-semibold`}>
                <InlineParts text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={cellCls}>
                  <InlineParts text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Komponen utama ───────────────────────────────────────────────────────────
interface LatexContentProps {
  content: string
  className?: string
  /** Jika true, tampilkan teks mentah tanpa parsing LaTeX/markdown (untuk soal PS dll.) */
  plain?: boolean
}

export function LatexContent({ content, className, plain }: LatexContentProps) {
  if (!content) return null
  if (plain) return <span className={className}>{content}</span>

  const groups = groupLines(content)

  return (
    <span className={className}>
      {groups.map((group, gi) => {
        if (group.type === 'table') {
          return <TableBlock key={gi} rows={group.rows} />
        }
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
              if (part.t === 'italic') return <em key={i}>{part.v}</em>
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
