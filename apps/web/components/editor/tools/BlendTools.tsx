'use client'
import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { toast } from '@/components/Toast'

const BLEND_MODES = [
  { label: 'Normal', value: 'source-over' },
  { label: 'Multiply', value: 'multiply' },
  { label: 'Screen', value: 'screen' },
  { label: 'Overlay', value: 'overlay' },
  { label: 'Soft Light', value: 'soft-light' },
  { label: 'Hard Light', value: 'hard-light' },
  { label: 'Darken', value: 'darken' },
  { label: 'Lighten', value: 'lighten' },
  { label: 'Color Dodge', value: 'color-dodge' },
  { label: 'Color Burn', value: 'color-burn' },
  { label: 'Difference', value: 'difference' },
  { label: 'Exclusion', value: 'exclusion' },
  { label: 'Hue', value: 'hue' },
  { label: 'Saturation', value: 'saturation' },
  { label: 'Color', value: 'color' },
  { label: 'Luminosity', value: 'luminosity' },
]

const OVERLAY_SCALE = 0.6

export default function BlendTools() {
  const { image, processedImage, setProcessedImage } = useEditorStore()
  const activeSrc = processedImage ?? image
  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [blendSrc, setBlendSrc] = useState<string | null>(null)
  const [blendMode, setBlendMode] = useState('overlay')
  const [opacity, setOpacity] = useState(80)
  const [overlayPos, setOverlayPos] = useState({ x: 20, y: 18 })
  const [dragging, setDragging] = useState(false)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stopDragging = () => setDragging(false)
    window.addEventListener('pointerup', stopDragging)
    return () => window.removeEventListener('pointerup', stopDragging)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const move = (event: PointerEvent) => {
      if (!previewRef.current) return
      const rect = previewRef.current.getBoundingClientRect()
      const px = ((event.clientX - rect.left) / rect.width) * 100
      const py = ((event.clientY - rect.top) / rect.height) * 100
      const maxPos = 100 - OVERLAY_SCALE * 100
      setOverlayPos({
        x: Math.max(0, Math.min(maxPos, px)),
        y: Math.max(0, Math.min(maxPos, py)),
      })
    }

    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [dragging])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setBlendSrc(URL.createObjectURL(file))
    toast('Overlay image loaded', 'success')
  }

  const apply = () => {
    if (!activeSrc || !blendSrc) return
    setApplying(true)
    setError(null)

    const base = new window.Image()
    const overlay = new window.Image()
    base.crossOrigin = 'anonymous'
    overlay.crossOrigin = 'anonymous'
    let loaded = 0

    const onLoad = () => {
      loaded += 1
      if (loaded < 2) return

      const canvas = document.createElement('canvas')
      canvas.width = base.naturalWidth
      canvas.height = base.naturalHeight
      const ctx = canvas.getContext('2d')!

      ctx.drawImage(base, 0, 0)
      ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation
      ctx.globalAlpha = opacity / 100

      const drawW = base.naturalWidth * OVERLAY_SCALE
      const drawH = base.naturalHeight * OVERLAY_SCALE
      const drawX = (overlayPos.x / 100) * base.naturalWidth
      const drawY = (overlayPos.y / 100) * base.naturalHeight
      ctx.drawImage(overlay, drawX, drawY, drawW, drawH)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      canvas.toBlob((blob) => {
        if (blob) {
          setProcessedImage(URL.createObjectURL(blob))
          toast('Blend applied successfully', 'success')
        } else {
          toast('Blend failed', 'error')
        }
        setApplying(false)
      }, 'image/png')
    }

    base.onload = onLoad
    overlay.onload = onLoad
    base.onerror = () => {
      setError('Failed to load base image')
      toast('Failed to load base image', 'error')
      setApplying(false)
    }
    overlay.onerror = () => {
      setError('Failed to load overlay image')
      toast('Failed to load overlay image', 'error')
      setApplying(false)
    }
    base.src = activeSrc
    overlay.src = blendSrc
  }

  const maxPos = 100 - OVERLAY_SCALE * 100

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Blend Images</p>
      <p className="text-[11px] text-white/40 leading-relaxed">
        Upload a second image and drag it around before blending it over your current image.
      </p>

      <div
        ref={previewRef}
        className="h-28 rounded-xl border-2 border-dashed border-white/10 hover:border-[#6C63FF]/50 cursor-pointer transition overflow-hidden relative bg-[#0d0d1a]"
        onClick={() => inputRef.current?.click()}
      >
        {blendSrc ? (
          <div
            className="absolute shadow-2xl shadow-black/50 rounded-lg overflow-hidden border border-white/10"
            style={{
              left: `${overlayPos.x}%`,
              top: `${overlayPos.y}%`,
              width: `${OVERLAY_SCALE * 100}%`,
              height: `${OVERLAY_SCALE * 100}%`,
              touchAction: 'none',
              cursor: dragging ? 'grabbing' : 'grab',
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              setDragging(true)
            }}
          >
            <img src={blendSrc} className="w-full h-full object-cover opacity-90" alt="overlay" draggable={false} />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[11px]">Upload overlay image</span>
          </div>
        )}

        {blendSrc && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 hover:opacity-100 transition pointer-events-none">
            <span className="text-xs text-white font-semibold">Drag to reposition</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <div className="flex items-center justify-between text-[10px] text-white/30">
        <span>Overlay position</span>
        <span className="font-mono text-[#8c84ff]">{Math.round(overlayPos.x)}%, {Math.round(overlayPos.y)}%</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-white/30 uppercase tracking-widest">Blend Mode</span>
        <div className="grid grid-cols-2 gap-1 max-h-44 overflow-y-auto pr-1">
          {BLEND_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setBlendMode(m.value)}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition text-left ${
                blendMode === m.value ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Opacity</span>
          <span className="font-mono text-[#8c84ff]">{opacity}%</span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
          style={{ background: `linear-gradient(to right, #6C63FF ${opacity}%, rgba(255,255,255,0.1) ${opacity}%)` }}
        />
      </label>

      <button
        onClick={apply}
        disabled={applying || !blendSrc || !activeSrc}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20"
      >
        {applying ? <><Spinner />Blendingâ€¦</> : 'Apply Blend'}
      </button>

      {error && <p className="text-[11px] text-rose-400 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5">{error}</p>}
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
