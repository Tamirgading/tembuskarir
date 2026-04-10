'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PackageActionsProps {
  packageId: string
  isPublished: boolean
}

export function PackageActions({ packageId, isPublished }: PackageActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function togglePublish() {
    setLoading(true)
    await fetch('/api/admin/packages/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId, publish: !isPublished }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={togglePublish}
        disabled={loading}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
          isPublished
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? '...' : isPublished ? 'Unpublish' : 'Publish'}
      </button>
    </div>
  )
}
