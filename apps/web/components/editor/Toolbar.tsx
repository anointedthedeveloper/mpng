'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { removeBackground } from '@/lib/api'

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-center">
        <span className="text-xs capitalize text-white/50">{label}</span>
        <span className="text-[10px] font-mono text-white/30">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={200}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none rounded-full bg-white/10 accent-[#6C63FF] cursor-pointer"
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
      <button
        onClick={handleRemoveBg}
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
            Remove Background
          </>
        )}
      </button>

      <div className="flex flex-col gap-2">
        {(['brightness', 'contrast', 'saturation'] as const).map((key) => (
          <Slider key={key} label={key} value={filters[key]} onChange={(v) => updateFilter(key, v)} />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={undo}
          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Undo
        </button>
        <button
          onClick={reset}
          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 text-xs text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/5 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>
    </div>
  )
}
