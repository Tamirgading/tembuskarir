'use client'

import { useState } from 'react'
import { BulkImportModal } from './BulkImportModal'

interface ImportButtonProps {
  packageId: string
  startIndex: number
}

export function ImportButton({ packageId, startIndex }: ImportButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
      >
        📥 Import Excel/CSV
      </button>

      {open && (
        <BulkImportModal
          packageId={packageId}
          startIndex={startIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
