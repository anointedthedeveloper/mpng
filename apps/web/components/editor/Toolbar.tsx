'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { removeBackground } from '@/lib/api'
import { 
  Eraser, 
  Sun, 
  Contrast, 
  Activity, 
  Undo2, 
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react'

function Section({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        {Icon && <Icon className="h-3.5 w-3.5 text-white/30" />}
        <p className="mpng-label">{label}</p>
      </div>
      {children}
    </div>
  )
}

function Slider({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string
  icon: any
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="group flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
          <span className="text-xs font-medium capitalize text-white/60 group-hover:text-white/80">{label}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-white/30 group-hover:text-[#8c84ff]">{value}</span>
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

  const filterIcons = {
    brightness: Sun,
    contrast: Contrast,
    saturation: Activity,
  }

  return (
    <div className="flex flex-col gap-8">
      <Section label="AI Intelligence" icon={Sparkles}>
        <button
          onClick={handleRemoveBg}
          disabled={loading}
          className="mpng-btn-primary group w-full gap-2.5 h-12 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Analyzing Pixels...</span>
            </>
          ) : (
            <>
              <Eraser className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span className="text-sm">Remove Background</span>
            </>
          )}
        </button>
      </Section>

      <Section label="Visual Tuning">
        <div className="flex flex-col gap-2.5">
          {(['brightness', 'contrast', 'saturation'] as const).map((key) => (
            <Slider 
              key={key} 
              label={key} 
              icon={filterIcons[key]}
              value={filters[key]} 
              onChange={(v) => updateFilter(key, v)} 
            />
          ))}
        </div>
      </Section>

      <Section label="History Management">
        <div className="flex gap-3">
          <button
            onClick={undo}
            className="mpng-btn-secondary group flex-1 gap-2 h-11"
          >
            <Undo2 className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-xs">Undo</span>
          </button>
          <button
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 h-11 text-xs font-bold text-rose-300 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </Section>
    </div>
  )
}
