'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { removeBackground } from '@/lib/api'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-gray-600 mb-2">{label}</p>
      {children}
    </div>
  )
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex justify-between text-[11px] text-gray-500">
        <span className="capitalize">{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={200}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 accent-[#6C63FF] cursor-pointer"
      />
    </label>
  )
}

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
    <div className="flex flex-col gap-5">
      <Section label="AI Tools">
        <button
          onClick={handleRemoveBg}
          disabled={loading}
          className="w-full py-2 px-3 rounded-lg text-sm font-semibold bg-[#6C63FF] hover:opacity-90 disabled:opacity-40 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            'Remove Background'
          )}
        </button>
      </Section>

      <Section label="Adjustments">
        <div className="flex flex-col gap-3">
          {(['brightness', 'contrast', 'saturation'] as const).map((key) => (
            <Slider key={key} label={key} value={filters[key]} onChange={(v) => updateFilter(key, v)} />
          ))}
        </div>
      </Section>

      <Section label="History">
        <div className="flex gap-2">
          <button
            onClick={undo}
            className="flex-1 py-1.5 text-xs border border-gray-800 rounded-lg hover:border-gray-600 text-gray-400 hover:text-white transition"
          >
            Undo
          </button>
          <button
            onClick={reset}
            className="flex-1 py-1.5 text-xs border border-red-900/50 rounded-lg hover:border-red-700 text-red-500 hover:text-red-400 transition"
          >
            Reset
          </button>
        </div>
      </Section>
    </div>
  )
}
