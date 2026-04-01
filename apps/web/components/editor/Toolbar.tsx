'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { removeBackground } from '@/lib/api'

export default function Toolbar() {
  const { image, filters, updateFilter, setProcessedImage, undo, reset } = useEditorStore()
  const [loading, setLoading] = useState(false)

  const handleRemoveBg = async () => {
    if (!image) return
    setLoading(true)
    try {
      const res = await fetch(image)
      const blob = await res.blob()
      const file = new File([blob], 'image.png', { type: blob.type })
      const url = await removeBackground(file)
      setProcessedImage(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <button
        onClick={handleRemoveBg}
        disabled={loading}
        className="py-2 px-3 bg-purple-700 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? 'Processing…' : 'Remove Background'}
      </button>

      {(['brightness', 'contrast', 'saturation'] as const).map((key) => (
        <label key={key} className="flex flex-col gap-1 capitalize text-gray-400">
          {key}
          <input
            type="range"
            min={0}
            max={200}
            value={filters[key]}
            onChange={(e) => updateFilter(key, Number(e.target.value))}
            className="accent-brand"
          />
        </label>
      ))}

      <div className="flex gap-2 mt-2">
        <button onClick={undo} className="flex-1 py-1 border border-gray-700 rounded hover:border-gray-500 transition">
          Undo
        </button>
        <button onClick={reset} className="flex-1 py-1 border border-red-900 rounded hover:border-red-600 transition text-red-400">
          Reset
        </button>
      </div>
    </div>
  )
}
