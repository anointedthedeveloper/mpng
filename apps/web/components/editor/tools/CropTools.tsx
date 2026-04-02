'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'

const PRESETS = [
  { label: 'Free', ratio: 0 },
  { label: '1:1', ratio: 1 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '9:16', ratio: 9 / 16 },
]

type Handle = 'tl' | 'tr' | 'bl' | 'br' | 'move' | null

interface Crop { x: number; y: number; w: number; h: number }

export default function CropTools() {
  const { image, processedImage, dimensions, setProcessedImage } = useEditorStore()
  const activeSrc = processedImage ?? image

  const containerRef = useRef<HTMLDivElement>(null)
  const [crop, setCrop] = useState<Crop>({ x: 10, y: 10, w: 80, h: 80 })
  const [preset, setPreset] = useState('Free')
  const [applying, setApplying] = useState(false)

  const dragRef = useRef<{
    handle: Handle
    startX: number; startY: number
    startCrop: Crop
  } | null>(null)

  // Apply aspect ratio when preset changes
  useEffect(() => {
    const p = PRESETS.find(p => p.label === preset)
    if (!p || p.ratio === 0) return
    setCrop(c => {
      const newH = Math.min(c.w / p.ratio, 100 - c.y)
      return { ...c, h: Math.round(newH) }
    })
  }, [preset])

  const getRelativePos = (e: PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect()
    return {
      px: ((e.clientX - rect.left) / rect.width) * 100,
      py: ((e.clientY - rect.top) / rect.height) * 100,
    }
  }

  const onPointerDown = useCallback((handle: Handle) => (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = containerRef.current!.getBoundingClientRect()
    dragRef.current = {
      handle,
      startX: ((e.clientX - rect.left) / rect.width) * 100,
      startY: ((e.clientY - rect.top) / rect.height) * 100,
      startCrop: { ...crop },
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }, [crop])

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragRef.current || !containerRef.current) return
    const { handle, startX, startY, startCrop } = dragRef.current
    const { px, py } = getRelativePos(e)
    const dx = px - startX
    const dy = py - startY
    const p = PRESETS.find(p => p.label === preset)
    const ratio = p?.ratio ?? 0

    setCrop(prev => {
      let { x, y, w, h } = startCrop

      if (handle === 'move') {
        x = Math.max(0, Math.min(100 - w, x + dx))
        y = Math.max(0, Math.min(100 - h, y + dy))
      } else if (handle === 'br') {
        w = Math.max(5, Math.min(100 - x, w + dx))
        h = ratio ? w / ratio : Math.max(5, Math.min(100 - y, h + dy))
      } else if (handle === 'bl') {
        const newW = Math.max(5, w - dx)
        x = Math.max(0, x + (w - newW))
        w = newW
        h = ratio ? w / ratio : Math.max(5, Math.min(100 - y, h + dy))
      } else if (handle === 'tr') {
        w = Math.max(5, Math.min(100 - x, w + dx))
        const newH = ratio ? w / ratio : Math.max(5, h - dy)
        y = ratio ? y : Math.max(0, y + (h - newH))
        h = newH
      } else if (handle === 'tl') {
        const newW = Math.max(5, w - dx)
        x = Math.max(0, x + (w - newW))
        w = newW
        const newH = ratio ? w / ratio : Math.max(5, h - dy)
        y = ratio ? y : Math.max(0, y + (h - newH))
        h = newH
      }

      // Clamp
      x = Math.max(0, Math.min(100 - w, x))
      y = Math.max(0, Math.min(100 - h, y))
      w = Math.min(w, 100 - x)
      h = Math.min(h, 100 - y)

      return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) }
    })
  }, [preset])

  const onPointerUp = useCallback(() => {
    dragRef.current = null
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }, [onPointerMove])

  const applyCrop = () => {
    if (!activeSrc || !dimensions) return
    setApplying(true)
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = activeSrc
    img.onload = () => {
      const srcX = Math.round((crop.x / 100) * img.naturalWidth)
      const srcY = Math.round((crop.y / 100) * img.naturalHeight)
      const srcW = Math.round((crop.w / 100) * img.naturalWidth)
      const srcH = Math.round((crop.h / 100) * img.naturalHeight)
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

  const { x, y, w, h } = crop

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Crop</p>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => setPreset(p.label)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${preset === p.label ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Interactive crop canvas */}
      <div
        ref={containerRef}
        className="rounded-xl border border-white/8 bg-[#0d0d1a] overflow-hidden relative select-none"
        style={{ aspectRatio: '4/3', cursor: 'crosshair' }}
      >
        {/* Image preview */}
        {activeSrc && (
          <img src={activeSrc} className="absolute inset-0 w-full h-full object-contain" alt="" draggable={false} />
        )}

        {/* Dark mask outside crop */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(transparent, transparent)`,
          boxShadow: 'none',
        }}>
          {/* Top */}
          <div className="absolute bg-black/60" style={{ top: 0, left: 0, right: 0, height: `${y}%` }} />
          {/* Bottom */}
          <div className="absolute bg-black/60" style={{ bottom: 0, left: 0, right: 0, top: `${y + h}%` }} />
          {/* Left */}
          <div className="absolute bg-black/60" style={{ top: `${y}%`, left: 0, width: `${x}%`, height: `${h}%` }} />
          {/* Right */}
          <div className="absolute bg-black/60" style={{ top: `${y}%`, left: `${x + w}%`, right: 0, height: `${h}%` }} />
        </div>

        {/* Crop box */}
        <div
          className="absolute border-2 border-white cursor-move"
          style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
          onPointerDown={onPointerDown('move')}
        >
          {/* Rule of thirds lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
          </div>

          {/* Corner handles — draggable */}
          {([
            ['tl', 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize'],
            ['tr', 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize'],
            ['bl', 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize'],
            ['br', 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize'],
          ] as [Handle, string][]).map(([handle, cls]) => (
            <div
              key={handle as string}
              className={`absolute w-4 h-4 bg-white rounded-sm shadow-lg z-10 ${cls}`}
              onPointerDown={onPointerDown(handle)}
            />
          ))}

          {/* Edge handles */}
          {([
            ['t', 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize w-8 h-2'],
            ['b', 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize w-8 h-2'],
            ['l', 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-w-resize w-2 h-8'],
            ['r', 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-e-resize w-2 h-8'],
          ] as [string, string][]).map(([id, cls]) => (
            <div key={id} className={`absolute bg-white/60 rounded-full z-10 ${cls}`}
              onPointerDown={onPointerDown('move')} />
          ))}
        </div>
      </div>

      {/* Output info */}
      {dimensions && (
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-white/30">Output size</span>
          <span className="text-[10px] font-mono text-white/60">
            {Math.round((w / 100) * dimensions.w)} × {Math.round((h / 100) * dimensions.h)}px
          </span>
        </div>
      )}

      <button onClick={applyCrop} disabled={applying || !activeSrc}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20">
        {applying
          ? <><Spinner />Cropping…</>
          : <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2" />
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
