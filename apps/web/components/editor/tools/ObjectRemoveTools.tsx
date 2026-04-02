'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { removeObject } from '@/lib/api'
import { toast } from '@/components/Toast'

export default function ObjectRemoveTools() {
  const { image, processedImage, setProcessedImage } = useEditorStore()
  const activeSrc = processedImage ?? image

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [painting, setPainting] = useState(false)
  const [brushSize, setBrushSize] = useState(28)
  const [applying, setApplying] = useState(false)
  const [hasMask, setHasMask] = useState(false)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [brushMode, setBrushMode] = useState<'paint' | 'erase'>('paint')
  const [status, setStatus] = useState('Paint an area to remove')

  useEffect(() => {
    if (!activeSrc) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = activeSrc
    img.onload = () => {
      imgRef.current = img
      const container = containerRef.current
      if (!container) return
      const maxW = container.clientWidth || 260
      const scale = Math.min(maxW / img.naturalWidth, 240 / img.naturalHeight, 1)
      const w = Math.round(img.naturalWidth * scale)
      const h = Math.round(img.naturalHeight * scale)

      const canvas = canvasRef.current
      const mask = maskCanvasRef.current
      if (!canvas || !mask) return

      canvas.width = w
      canvas.height = h
      mask.width = w
      mask.height = h
      mask.getContext('2d')?.clearRect(0, 0, w, h)
      drawPreview()
      setHasMask(false)
      setStatus('Paint an area to remove')
    }
  }, [activeSrc])

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current
    const mask = maskCanvasRef.current
    const img = imgRef.current
    if (!canvas || !mask || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(mask, 0, 0)
  }, [])

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const paintStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const mask = maskCanvasRef.current
    if (!canvas || !mask) return

    const rect = canvas.getBoundingClientRect()
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    if (!painting) return

    const ctx = mask.getContext('2d')
    if (!ctx) return

    const { x, y } = getCanvasPos(e)
    const radius = (brushSize / 2) * (canvas.width / rect.width)

    if (brushMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(239,68,68,0.68)'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      setHasMask(true)
      setStatus('Mask painted. Ready for AI cleanup.')
    }

    drawPreview()
  }

  const clearMask = useCallback(() => {
    const mask = maskCanvasRef.current
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!mask || !canvas || !img) return

    const ctx = mask.getContext('2d')
    const preview = canvas.getContext('2d')
    if (!ctx || !preview) return

    ctx.clearRect(0, 0, mask.width, mask.height)
    preview.clearRect(0, 0, canvas.width, canvas.height)
    preview.drawImage(img, 0, 0, canvas.width, canvas.height)
    setHasMask(false)
    setStatus('Paint an area to remove')
  }, [])

  const applyRemoval = async () => {
    const mask = maskCanvasRef.current
    const img = imgRef.current
    if (!mask || !img || !hasMask || !activeSrc) return

    setApplying(true)
    setStatus('AI is removing the selected object...')

    try {
      const maskBlob = await new Promise<Blob>((resolve, reject) => {
        mask.toBlob((blob) => {
          if (!blob) reject(new Error('Could not export mask'))
          else resolve(blob)
        }, 'image/png')
      })

      const url = await removeObject(activeSrc, maskBlob)
      setProcessedImage(url)
      toast('Object removed successfully', 'success')
      clearMask()
      setStatus('Object removed successfully')
    } catch (e: any) {
      const message = e?.message ?? 'Object removal failed'
      toast(message, 'error')
      setStatus('Object removal failed. Try painting a larger region.')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">AI object removal</p>
            <h3 className="mt-1 text-sm font-semibold text-white/90">Paint the subject, let the model fill the scene</h3>
            <p className="mt-1 text-[11px] text-white/35 leading-relaxed">
              The AI service uses your rough mask, identifies the object, and blends the missing area back into the image.
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
            AI
          </span>
        </div>
        <div className="mt-3 rounded-xl border border-white/6 bg-black/15 px-3 py-2 text-[10px] text-white/35">
          Best results come from painting the full object and a small edge around it.
        </div>
      </div>

      <div ref={containerRef} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1a] checkerboard">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ cursor: 'none', touchAction: 'none' }}
          onPointerDown={(e) => {
            setPainting(true)
            paintStroke(e)
          }}
          onPointerMove={paintStroke}
          onPointerUp={() => setPainting(false)}
          onPointerLeave={() => {
            setPainting(false)
            setCursor(null)
          }}
        />
        <canvas ref={maskCanvasRef} className="hidden" />

        {cursor && !applying && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              left: cursor.x,
              top: cursor.y,
              width: brushSize,
              height: brushSize,
              borderColor: brushMode === 'paint' ? 'rgba(239,68,68,0.95)' : 'rgba(255,255,255,0.72)',
              background: brushMode === 'paint' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.08)',
            }}
          />
        )}

        {applying && (
          <div className="absolute inset-0 bg-[#080810]/85 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] animate-[shimmer_1.4s_infinite]" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full border border-[#6C63FF]/30">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6C63FF] animate-spin" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">AI cleanup in progress</div>
                  <div className="text-[11px] text-white/40">{status}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Brush size</span>
          <span className="font-mono text-[#8c84ff]">{brushSize}px</span>
        </div>
        <input
          type="range"
          min={8}
          max={96}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
          style={{ background: `linear-gradient(to right, #6C63FF ${((brushSize - 8) / 88) * 100}%, rgba(255,255,255,0.1) ${((brushSize - 8) / 88) * 100}%)` }}
        />
      </label>

      <div className="flex gap-2">
        <div className="flex-1 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/25">Mode</div>
          <div className="mt-1 text-xs text-white/65">
            {brushMode === 'paint' ? 'Painting subject' : 'Erasing mask'}
          </div>
        </div>
        <button
          onClick={() => setBrushMode((m) => (m === 'paint' ? 'erase' : 'paint'))}
          className="w-28 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
        >
          {brushMode === 'paint' ? 'Erase' : 'Paint'}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={clearMask}
          disabled={!hasMask || applying}
          className="flex-1 h-10 rounded-xl border border-white/10 text-xs text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-30"
        >
          Clear Mask
        </button>
        <button
          onClick={applyRemoval}
          disabled={applying || !hasMask}
          className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#7f74ff] text-xs font-semibold shadow-lg shadow-[#6C63FF]/20 transition hover:opacity-95 disabled:opacity-40"
        >
          {applying ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              Working on it
            </span>
          ) : (
            'Remove Object'
          )}
        </button>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-[10px] text-white/35">
        {status}
      </div>
    </div>
  )
}

function Spinner() {
  return <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
