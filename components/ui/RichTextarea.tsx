'use client'

import { useRef } from 'react'
import { List, ListOrdered } from 'lucide-react'

interface RichTextareaProps {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  required?: boolean
  className?: string
}

function getNextOrderedNumber(text: string, cursorPos: number): number {
  const before = text.slice(0, cursorPos)
  const lines = before.split('\n')
  // Cari angka terakhir dari numbered list di atas cursor
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^(\d+)[.)]\s/)
    if (m) return parseInt(m[1]) + 1
  }
  return 1
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  prefix: string,
  getValue: () => string,
  setValue: (v: string) => void
) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = getValue()

  // Cari awal baris
  const lineStart = text.lastIndexOf('\n', start - 1) + 1
  const lineText = text.slice(lineStart, end)

  // Cek apakah sudah ada prefix di awal baris
  const orderedMatch = lineText.match(/^\d+[.)]\s/)
  const unorderedMatch = lineText.match(/^[-*•]\s/)

  let newText: string
  let newCursor: number

  if (orderedMatch || unorderedMatch) {
    // Hapus prefix yang ada, ganti dengan yang baru
    const existingPrefixLen = (orderedMatch ?? unorderedMatch)![0].length
    newText = text.slice(0, lineStart) + prefix + text.slice(lineStart + existingPrefixLen)
    newCursor = lineStart + prefix.length
  } else if (lineStart === start && start === end && text[start - 1] !== '\n' && start > 0) {
    // Tambah newline sebelum prefix jika baris tidak kosong
    newText = text.slice(0, start) + '\n' + prefix + text.slice(end)
    newCursor = start + 1 + prefix.length
  } else {
    newText = text.slice(0, lineStart) + prefix + text.slice(lineStart)
    newCursor = lineStart + prefix.length + (start - lineStart)
  }

  setValue(newText)
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(newCursor, newCursor)
  })
}

export function RichTextarea({ value, onChange, rows = 4, placeholder, required, className }: RichTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleOrderedList() {
    const ta = textareaRef.current
    if (!ta) return
    const n = getNextOrderedNumber(value, ta.selectionStart)
    insertAtCursor(ta, `${n}. `, () => value, onChange)
  }

  function handleUnorderedList() {
    const ta = textareaRef.current
    if (!ta) return
    insertAtCursor(ta, '- ', () => value, onChange)
  }

  // Auto-continue list saat Enter
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter') return
    const ta = e.currentTarget
    const pos = ta.selectionStart
    const text = ta.value
    const lineStart = text.lastIndexOf('\n', pos - 1) + 1
    const currentLine = text.slice(lineStart, pos)

    const orderedMatch = currentLine.match(/^(\d+)[.)]\s(.*)/)
    const unorderedMatch = currentLine.match(/^([-*•])\s(.*)/)

    if (orderedMatch) {
      if (orderedMatch[2].trim() === '') {
        // Baris kosong → hapus prefix (keluar dari list)
        e.preventDefault()
        const newText = text.slice(0, lineStart) + '\n' + text.slice(pos)
        onChange(newText)
        requestAnimationFrame(() => { ta.setSelectionRange(lineStart + 1, lineStart + 1) })
      } else {
        // Lanjut ke nomor berikutnya
        e.preventDefault()
        const nextN = parseInt(orderedMatch[1]) + 1
        const insertion = `\n${nextN}. `
        const newText = text.slice(0, pos) + insertion + text.slice(pos)
        onChange(newText)
        requestAnimationFrame(() => {
          const newPos = pos + insertion.length
          ta.setSelectionRange(newPos, newPos)
        })
      }
    } else if (unorderedMatch) {
      if (unorderedMatch[2].trim() === '') {
        e.preventDefault()
        const newText = text.slice(0, lineStart) + '\n' + text.slice(pos)
        onChange(newText)
        requestAnimationFrame(() => { ta.setSelectionRange(lineStart + 1, lineStart + 1) })
      } else {
        e.preventDefault()
        const marker = unorderedMatch[1]
        const insertion = `\n${marker} `
        const newText = text.slice(0, pos) + insertion + text.slice(pos)
        onChange(newText)
        requestAnimationFrame(() => {
          const newPos = pos + insertion.length
          ta.setSelectionRange(newPos, newPos)
        })
      }
    }
  }

  return (
    <div className="space-y-1">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border border-gray-200 rounded-t-lg px-2 py-1 bg-gray-50">
        <button
          type="button"
          onClick={handleOrderedList}
          title="Daftar bernomor (1. 2. 3.)"
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-600 hover:bg-white hover:border hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>1. 2. 3.</span>
        </button>
        <button
          type="button"
          onClick={handleUnorderedList}
          title="Daftar poin (- item)"
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-600 hover:bg-white hover:border hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <List className="w-3.5 h-3.5" />
          <span>• Poin</span>
        </button>
        <span className="text-gray-200 mx-1">|</span>
        <span className="text-[10px] text-gray-400">Enter otomatis lanjut ke item berikutnya</span>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`w-full border border-gray-200 border-t-0 rounded-b-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${className ?? ''}`}
      />
    </div>
  )
}
