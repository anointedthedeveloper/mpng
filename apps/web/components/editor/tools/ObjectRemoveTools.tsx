'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'

export default function ObjectRemoveTools() {
  const { image, processedImage, setProcessedImage } = useEditorStore()
  const activeSrc = processedImage ?? image

  const canvasRef = useRef<HTMLCanvasElement>(null)       // display canvas
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)   // mask only (red overlay)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [painting, setPainting] = useState(false)
  const [brushSize, setBrushSize] = useState(24)
  const [applying, setApplying] = useState(false)
  const [hasMask, setHasMask] = useState(false)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [mode, setMode] = useState<'paint' | 'erase'>('paint')

  // Load image
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
      const scale = Math.min(maxW / img.naturalWidth, 220 / img.naturalHeight, 1)
      const w = Math.round(img.naturalWidth * scale)
      const h = Math.round(img.naturalHeight * scale)

      const canvas = canvasRef.current!
      canvas.width = w; canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)

      const mask = maskCanvasRef.current!
      mask.width = w; mask.height = h
      mask.getContext('2d')!.clearRect(0, 0, w, h)

      setHasMask(false)
    }
  }, [activeSrc])

  // Composite: redraw image + mask overlay
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const mask = maskCanvasRef.current
    const img = imgRef.current
    if (!canvas || !mask || !img) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(mask, 0, 0)
  }, [])

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    // Scale from CSS pixels to canvas pixels
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const paintStroke = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    if (!painting) return

    const mask = maskCanvasRef.current!
    const ctx = mask.getContext('2d')!
    const { x, y } = getCanvasPos(e)
    const r = (brushSize / 2) * (canvas.width / rect.width)

    if (mode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(239,68,68,0.65)'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      setHasMask(true)
    }
    redraw()
  }

  const clearMask = () => {
    const mask = maskCanvasRef.current
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!mask || !canvas || !img) return
    mask.getContext('2d')!.clearRect(0, 0, mask.width, mask.height)
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    setHasMask(false)
  }

  const applyRemoval = () => {
    const mask = maskCanvasRef.current
    const img = imgRef.current
    if (!mask || !img || !hasMask) return
    setApplying(true)

    setTimeout(() => {
      // Work at full image resolution
      const W = img.naturalWidth, H = img.naturalHeight
      const scaleX = W / mask.width, scaleY = H / mask.height

      // Full-res canvas
      const out = document.createElement('canvas')
      out.width = W; out.height = H
      const ctx = out.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, W, H)
      const px = imgData.data

      // Build full-res mask by scaling up the preview mask
      const maskFull = document.createElement('canvas')
      maskFull.width = W; maskFull.height = H
      maskFull.getContext('2d')!.drawImage(mask, 0, 0, W, H)
      const maskData = maskFull.getContext('2d')!.getImageData(0, 0, W, H).data

      // Collect masked pixel indices
      const masked = new Uint8Array(W * H)
      for (let i = 0; i < W * H; i++) {
        if (maskData[i * 4 + 3] > 40 && maskData[i * 4] > 80) masked[i] = 1
      }

      // Multi-pass inpainting: expand from border inward
      const passes = 4
      for (let pass = 0; pass < passes; pass++) {
        const updated = new Uint8Array(W * H)
        for (let y = 1; y < H - 1; y++) {
          for (let x = 1; x < W - 1; x++) {
            const i = y * W + x
            if (!masked[i]) continue

            // Sample from 8-connected neighbours that are NOT masked
            let r = 0, g = 0, b = 0, n = 0
            const offsets = [-W-1,-W,-W+1,-1,1,W-1,W,W+1]
            // Also sample further out for better texture
            const far = [-2*W,-2,-2*W-2,-2*W+2,2*W,2,2*W-2,2*W+2]
            for (const o of [...offsets, ...far]) {
              const ni = i + o
              if (ni < 0 || ni >= W * H) continue
              if (masked[ni] && !updated[ni]) continue
              r += px[ni*4]; g += px[ni*4+1]; b += px[ni*4+2]; n++
            }
            if (n > 0) {
              px[i*4] = r/n; px[i*4+1] = g/n; px[i*4+2] = b/n
              updated[i] = 1
              masked[i] = 0
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0)

      // Smooth the inpainted region with a slight blur pass
      const smooth = document.createElement('canvas')
      smooth.width = W; smooth.height = H
      const sCtx = smooth.getContext('2d')!
      sCtx.filter = 'blur(1.5px)'
      sCtx.drawImage(out, 0, 0)
      sCtx.filter = 'none'

      // Blend: use smoothed version only inside mask
      const final = document.createElement('canvas')
      final.width = W; final.height = H
      const fCtx = final.getContext('2d')!
      fCtx.drawImage(out, 0, 0)
      fCtx.globalCompositeOperation = 'destination-over'
      fCtx.drawImage(smooth, 0, 0)

      // Re-composite: original outside mask, inpainted inside
      const result = document.createElement('canvas')
      result.width = W; result.height = H
      const rCtx = result.getContext('2d')!
      rCtx.drawImage(img, 0, 0)
      // Draw inpainted region using mask as clip
      rCtx.save()
      rCtx.globalCompositeOperation = 'source-over'
      rCtx.drawImage(out, 0, 0)
      rCtx.restore()

      result.toBlob(blob => {
        if (blob) setProcessedImage(URL.createObjectURL(blob))
        setApplying(false)
        clearMask()
      }, 'image/png')
    }, 50)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30">Object / Person Removal</p>
        <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">
          Paint over what you want removed. Use Erase mode to fix the mask.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['paint', 'erase'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition ${mode === m ? 'bg-[#6C63FF] text-white' : 'text-white/40 hover:text-white'}`}>
            {m === 'paint' ? 'Paint Mask' : 'Erase Mask'}
          </button>
        ))}
      </div>

      {/* Canvas with brush cursor */}
      <div ref={containerRef} className="relative rounded-xl border border-white/10 overflow-hidden bg-[#0d0d1a] checkerboard">
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ cursor: 'none' }}
          onMouseDown={(e) => { setPainting(true); paintStroke(e) }}
          onMouseUp={() => setPainting(false)}
          onMouseLeave={() => { setPainting(false); setCursor(null) }}
          onMouseMove={paintStroke}
        />
        {/* Hidden mask canvas */}
        <canvas ref={maskCanvasRef} className="hidden" />

        {/* Brush cursor preview */}
        {cursor && (
          <div
            className="absolute pointer-events-none rounded-full border-2 -translate-x-1/2 -translate-y-1/2 transition-none"
            style={{
              left: cursor.x,
              top: cursor.y,
              width: brushSize,
              height: brushSize,
              borderColor: mode === 'paint' ? 'rgba(239,68,68,0.9)' : 'rgba(255,255,255,0.7)',
              background: mode === 'paint' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.1)',
            }}
          />
        )}

        {/* Empty state */}
        {!activeSrc && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-white/20">Upload an image first</p>
          </div>
        )}
      </div>

      {/* Brush size */}
      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Brush size</span>
          <span className="font-mono text-[#8c84ff]">{brushSize}px</span>
        </div>
        <input type="range" min={4} max={80} value={brushSize}
          onChange={e => setBrushSize(Number(e.target.value))}
          className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
          style={{ background: `linear-gradient(to right, #6C63FF ${((brushSize-4)/76)*100}%, rgba(255,255,255,0.1) ${((brushSize-4)/76)*100}%)` }} />
      </label>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={clearMask} disabled={!hasMask || applying}
          className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
        <button onClick={applyRemoval} disabled={applying || !hasMask}
          className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20">
          {applying
            ? <><Spinner />Processing…</>
            : <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply Removal
              </>}
        </button>
      </div>

      {hasMask && !applying && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[10px] text-amber-400">Red area will be filled with surrounding pixels</p>
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
