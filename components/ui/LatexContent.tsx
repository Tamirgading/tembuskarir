'use client'

import React from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─── Parser LaTeX & Markdown Inline ──────────────────────────────────────────
export type InlineNode =
  | { t: 'text'; v: string }
  | { t: 'boldItalic'; children: InlineNode[] }
  | { t: 'bold'; children: InlineNode[] }
  | { t: 'italic'; children: InlineNode[] }
  | { t: 'code'; v: string }
  | { t: 'inlineMath'; v: string }
  | { t: 'blockMath'; v: string }

const INLINE_RE = /(\$\$[\s\S]+?\$\$|\$(?!\s)[^$\n]+?(?<!\s)\$|`[^`\n]+?`|\*\*\*(?!\s)[\s\S]+?(?<!\s)\*\*\*|\*\*(?!\s)[\s\S]+?(?<!\s)\*\*|\*(?!\s)[^*\n]+?(?<!\s)\*)/g

function parseInline(text: string): InlineNode[] {
  const parts: InlineNode[] = []
  const re = new RegExp(INLINE_RE.source, 'g')
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ t: 'text', v: text.slice(last, m.index) })
    }
    const matched = m[0]
    if (matched.startsWith('$$')) {
      parts.push({ t: 'blockMath', v: matched.slice(2, -2) })
    } else if (matched.startsWith('***')) {
      parts.push({ t: 'boldItalic', children: parseInline(matched.slice(3, -3)) })
    } else if (matched.startsWith('**')) {
      parts.push({ t: 'bold', children: parseInline(matched.slice(2, -2)) })
    } else if (matched.startsWith('*')) {
      parts.push({ t: 'italic', children: parseInline(matched.slice(1, -1)) })
    } else if (matched.startsWith('`')) {
      parts.push({ t: 'code', v: matched.slice(1, -1) })
    } else if (matched.startsWith('$')) {
      parts.push({ t: 'inlineMath', v: matched.slice(1, -1) })
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
    return katex.renderToString(formula.trim(), { displayMode, throwOnError: false, strict: false })
  } catch {
    return formula
  }
}

// ─── Inline renderer (teks + markdown + LaTeX) ───────────────────────────────
function RenderNode({
  node,
  keyIndex,
  preWrap = false,
}: {
  node: InlineNode
  keyIndex: number | string
  preWrap?: boolean
}): React.ReactNode {
  if (node.t === 'text') {
    return preWrap ? (
      <span key={keyIndex} style={{ whiteSpace: 'pre-wrap' }}>{node.v}</span>
    ) : (
      <span key={keyIndex}>{node.v}</span>
    )
  }
  if (node.t === 'boldItalic') {
    return (
      <strong key={keyIndex} className="font-bold">
        <em>
          {node.children.map((child, ci) => (
            <RenderNode key={`${keyIndex}-${ci}`} node={child} keyIndex={`${keyIndex}-${ci}`} preWrap={preWrap} />
          ))}
        </em>
      </strong>
    )
  }
  if (node.t === 'bold') {
    return (
      <strong key={keyIndex} className="font-semibold">
        {node.children.map((child, ci) => (
          <RenderNode key={`${keyIndex}-${ci}`} node={child} keyIndex={`${keyIndex}-${ci}`} preWrap={preWrap} />
        ))}
      </strong>
    )
  }
  if (node.t === 'italic') {
    return (
      <em key={keyIndex} className="italic">
        {node.children.map((child, ci) => (
          <RenderNode key={`${keyIndex}-${ci}`} node={child} keyIndex={`${keyIndex}-${ci}`} preWrap={preWrap} />
        ))}
      </em>
    )
  }
  if (node.t === 'code') {
    return (
      <code
        key={keyIndex}
        className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 font-mono text-xs"
      >
        {node.v}
      </code>
    )
  }
  if (node.t === 'blockMath') {
    return (
      <span
        key={keyIndex}
        className="block my-2 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: renderMath(node.v, true) }}
      />
    )
  }
  if (node.t === 'inlineMath') {
    return (
      <span
        key={keyIndex}
        dangerouslySetInnerHTML={{ __html: renderMath(node.v, false) }}
      />
    )
  }
  return null
}

function InlineParts({ text }: { text: string }) {
  const parts = parseInline(text)
  return (
    <>
      {parts.map((part, i) => (
        <RenderNode key={i} node={part} keyIndex={i} preWrap={false} />
      ))}
    </>
  )
}

// ─── Line grouper (deteksi list, tabel & blok kode markdown) ─────────────────
type LineGroup =
  | { type: 'ordered'; items: string[] }
  | { type: 'unordered'; items: string[] }
  | { type: 'table'; rows: string[] }
  | { type: 'code'; lines: string[]; lang?: string }
  | { type: 'paragraph'; lines: string[] }

function isTableLine(line: string): boolean {
  const t = line.trim()
  return /^\|.*\|\s*$/.test(t) && t.replace(/\|/g, '').trim().length > 0
}

function groupLines(text: string): LineGroup[] {
  const lines = text.split('\n')
  const groups: LineGroup[] = []
  let inCodeBlock = false
  let currentCodeLines: string[] = []
  let currentLang = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        currentCodeLines = []
        currentLang = trimmed.slice(3).trim()
      } else {
        inCodeBlock = false
        groups.push({ type: 'code', lines: currentCodeLines, lang: currentLang })
        currentCodeLines = []
      }
      continue
    }

    if (inCodeBlock) {
      currentCodeLines.push(line)
      continue
    }

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

  if (inCodeBlock && currentCodeLines.length > 0) {
    groups.push({ type: 'code', lines: currentCodeLines, lang: currentLang })
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
        if (group.type === 'code') {
          return (
            <pre
              key={gi}
              className="my-2 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed"
            >
              <code>{group.lines.join('\n')}</code>
            </pre>
          )
        }
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
        // paragraph — gabung lines dengan newline, render LaTeX & markdown
        const joined = group.lines.join('\n')
        const parts = parseInline(joined)
        return (
          <span key={gi}>
            {parts.map((part, i) => (
              <RenderNode key={i} node={part} keyIndex={i} preWrap={true} />
            ))}
          </span>
        )
      })}
    </span>
  )
}
