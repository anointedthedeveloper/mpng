'use client'
import { useRef, useState, useEffect } from 'react'
import { useEditorStore } from '@/store/editorStore'

const PRESETS = [
  { label: 'Free', w: 0, h: 0 },
  { label: '1:1', w: 1, h: 1 },
  { label: '16:9', w: 16, h: 9 },
  { label: '4:3', w: 4, h: 3 },
  { label: '9:16', w: 9, h: 16 },
]

export default function CropTools() {
  const { image, processedImage, dimensions, setProcessedImage } = useEditorStore()
  const activeSrc = processedImage ?? image
  const [preset, setPreset] = useState('Free')
  const [x, setX] = useState(10)
  const [y, setY] = useState(10)
  const [w, setW] = useState(80)
  const [h, setH] = useState(80)
  const [applying, setApplying] = useState(false)

  // When preset changes, lock aspect ratio
  useEffect(() => {
    const p = PRESETS.find(p => p.label === preset)
    if (!p || p.w === 0) return
    const ratio = p.w / p.h
    const newH = Math.round(w / ratio)
    if (newH + y <= 100) setH(newH)
  }, [preset, w])

  const applyCrop = async () => {
    if (!activeSrc || !dimensions) return
    setApplying(true)
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = activeSrc
    img.onload = () => {
      const srcX = Math.round((x / 100) * img.naturalWidth)
      const srcY = Math.round((y / 100) * img.naturalHeight)
      const srcW = Math.round((w / 100) * img.naturalWidth)
      const srcH = Math.round((h / 100) * img.naturalHeight)
      const canvas = document.createElement('canvas')
      canvas.width = srcW
      canvas.height = srcH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH)
      canvas.toBlob(blob => {
        if (blob) setProcessedImage(URL.createObjectURL(blob))
        setApplying(false)
      }, 'image/png')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Crop</p>

      {/* Aspect ratio presets */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] text-white/40">Aspect Ratio</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => setPreset(p.label)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${preset === p.label ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual crop preview */}
      <div className="rounded-xl border border-white/8 bg-[#0d0d1a] overflow-hidden aspect-video relative">
        {activeSrc && (
          <img src={activeSrc} className="absolute inset-0 w-full h-full object-contain opacity-30" alt="" />
        )}
        {/* Crop overlay */}
        <div className="absolute inset-0">
          <div className="absolute border-2 border-[#6C63FF] rounded"
            style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
            {/* Corner handles */}
            {[[-1,-1,'tl'],[-1,1,'bl'],[1,-1,'tr'],[1,1,'br']].map(([dx,dy,id]) => (
              <div key={id as string}
                className="absolute w-3 h-3 bg-white rounded-sm"
                style={{
                  [dy === -1 ? 'top' : 'bottom']: -4,
                  [dx === -1 ? 'left' : 'right']: -4,
                }} />
            ))}
            {/* Rule of thirds */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
              {[...Array(9)].map((_, i) => <div key={i} className="border border-white/20" />)}
            </div>
          </div>
          {/* Dark overlay outside crop */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none"
            style={{ clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${y}%, ${x}% ${y}%, ${x}% ${y+h}%, ${x+w}% ${y+h}%, ${x+w}% ${y}%, 0% ${y}%)` }} />
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'X offset', val: x, set: setX, max: 90 },
          { label: 'Y offset', val: y, set: setY, max: 90 },
          { label: 'Width', val: w, set: setW, max: 100 },
          { label: 'Height', val: h, set: setH, max: 100 },
        ].map(({ label, val, set, max }) => (
          <label key={label} className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-white/30">
              <span>{label}</span><span className="font-mono text-[#8c84ff]">{val}%</span>
            </div>
            <input type="range" min={0} max={max} value={val}
              onChange={e => set(Number(e.target.value))}
              className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
              style={{ background: `linear-gradient(to right, #6C63FF ${(val/max)*100}%, rgba(255,255,255,0.1) ${(val/max)*100}%)` }} />
          </label>
        ))}
      </div>

      {dimensions && (
        <p className="text-[10px] text-white/25 font-mono text-center">
          Output: {Math.round((w/100)*dimensions.w)} × {Math.round((h/100)*dimensions.h)}px
        </p>
      )}

      <button onClick={applyCrop} disabled={applying || !activeSrc}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20">
        {applying ? <><Spinner />Cropping…</> : <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          </svg>
          Apply Crop
        </>}
      </button>
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
