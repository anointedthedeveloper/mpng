'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { removeBackground } from '@/lib/api'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="mpng-label">{label}</p>
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
      <div className="flex justify-between text-xs text-white/60">
        <span className="capitalize">{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={200}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mpng-input-range"
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
          className="mpng-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Processing...
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
            className="mpng-btn-secondary flex-1"
          >
            Undo
          </button>
          <button
            onClick={reset}
            className="flex-1 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:border-rose-400/30 hover:bg-rose-500/15"
          >
            Reset
          </button>
        </div>
      </Section>
    </div>
  )
}
