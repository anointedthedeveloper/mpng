'use client'
import { useEditorStore } from '@/store/editorStore'

function Slider({ label, value, min = 0, max = 200, onChange }: { label: string; value: number; min?: number; max?: number; onChange: (v: number) => void }) {
  const pct = Math.round(((value - min) / (max - min)) * 100)
  return (
    <label className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:border-white/10 transition cursor-pointer">
      <div className="flex justify-between">
        <span className="text-xs capitalize text-white/50">{label}</span>
        <span className="text-[10px] font-mono text-[#8c84ff]">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
        style={{ background: `linear-gradient(to right, #6C63FF ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }} />
    </label>
  )
}

export default function AdjustTools() {
  const { filters, updateFilter, undo, reset } = useEditorStore()
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Adjustments</p>
      <Slider label="Brightness" value={filters.brightness} onChange={v => updateFilter('brightness', v)} />
      <Slider label="Contrast" value={filters.contrast} onChange={v => updateFilter('contrast', v)} />
      <Slider label="Saturation" value={filters.saturation} onChange={v => updateFilter('saturation', v)} />
      <Slider label="Hue Rotate" value={filters.hue} min={0} max={360} onChange={v => updateFilter('hue', v)} />
      <Slider label="Blur" value={filters.blur} min={0} max={20} onChange={v => updateFilter('blur', v)} />
      <div className="flex gap-2 mt-2">
        <button onClick={undo} className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          Undo
        </button>
        <button onClick={reset} className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 text-xs text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/5 transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Reset
        </button>
      </div>
    </div>
  )
}
