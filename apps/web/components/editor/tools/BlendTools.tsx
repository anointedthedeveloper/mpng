'use client'
import { useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

const BLEND_MODES = [
  { label: 'Normal',      value: 'source-over' },
  { label: 'Multiply',    value: 'multiply' },
  { label: 'Screen',      value: 'screen' },
  { label: 'Overlay',     value: 'overlay' },
  { label: 'Soft Light',  value: 'soft-light' },
  { label: 'Hard Light',  value: 'hard-light' },
  { label: 'Darken',      value: 'darken' },
  { label: 'Lighten',     value: 'lighten' },
  { label: 'Color Dodge', value: 'color-dodge' },
  { label: 'Color Burn',  value: 'color-burn' },
  { label: 'Difference',  value: 'difference' },
  { label: 'Exclusion',   value: 'exclusion' },
  { label: 'Hue',         value: 'hue' },
  { label: 'Saturation',  value: 'saturation' },
  { label: 'Color',       value: 'color' },
  { label: 'Luminosity',  value: 'luminosity' },
]

export default function BlendTools() {
  const { image, processedImage, setProcessedImage } = useEditorStore()
  const activeSrc = processedImage ?? image
  const inputRef = useRef<HTMLInputElement>(null)
  const [blendSrc, setBlendSrc] = useState<string | null>(null)
  const [blendMode, setBlendMode] = useState('overlay')
  const [opacity, setOpacity] = useState(80)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setBlendSrc(URL.createObjectURL(file))
  }

  const apply = () => {
    if (!activeSrc || !blendSrc) return
    setApplying(true); setError(null)

    const base = new window.Image()
    const overlay = new window.Image()
    base.crossOrigin = 'anonymous'
    overlay.crossOrigin = 'anonymous'
    let loaded = 0

    const onLoad = () => {
      loaded++
      if (loaded < 2) return

      const canvas = document.createElement('canvas')
      canvas.width = base.naturalWidth
      canvas.height = base.naturalHeight
      const ctx = canvas.getContext('2d')!

      // Draw base
      ctx.drawImage(base, 0, 0)

      // Draw overlay with blend mode
      ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation
      ctx.globalAlpha = opacity / 100
      // Scale overlay to fit base
      ctx.drawImage(overlay, 0, 0, base.naturalWidth, base.naturalHeight)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      canvas.toBlob(blob => {
        if (blob) setProcessedImage(URL.createObjectURL(blob))
        setApplying(false)
      }, 'image/png')
    }

    base.onload = onLoad
    overlay.onload = onLoad
    base.onerror = () => { setError('Failed to load base image'); setApplying(false) }
    overlay.onerror = () => { setError('Failed to load overlay image'); setApplying(false) }
    base.src = activeSrc
    overlay.src = blendSrc
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Blend Images</p>
      <p className="text-[11px] text-white/40 leading-relaxed">
        Upload a second image to blend on top of your current image.
      </p>

      {/* Overlay image picker */}
      <div
        onClick={() => inputRef.current?.click()}
        className="h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-[#6C63FF]/50 cursor-pointer transition flex items-center justify-center overflow-hidden relative"
      >
        {blendSrc ? (
          <img src={blendSrc} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="overlay" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-white/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[11px]">Upload overlay image</span>
          </div>
        )}
        {blendSrc && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
            <span className="text-xs text-white font-semibold">Change</span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

      {/* Blend mode */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-white/30 uppercase tracking-widest">Blend Mode</span>
        <div className="grid grid-cols-2 gap-1">
          {BLEND_MODES.map(m => (
            <button key={m.value} onClick={() => setBlendMode(m.value)}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition text-left ${blendMode === m.value ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Opacity</span><span className="font-mono text-[#8c84ff]">{opacity}%</span>
        </div>
        <input type="range" min={1} max={100} value={opacity}
          onChange={e => setOpacity(Number(e.target.value))}
          className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
          style={{ background: `linear-gradient(to right, #6C63FF ${opacity}%, rgba(255,255,255,0.1) ${opacity}%)` }} />
      </label>

      <button onClick={apply} disabled={applying || !blendSrc || !activeSrc}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20">
        {applying ? <><Spinner />Blending…</> : 'Apply Blend'}
      </button>

      {error && <p className="text-[11px] text-rose-400 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5">{error}</p>}
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
