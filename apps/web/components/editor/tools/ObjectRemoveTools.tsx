'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { toast } from '@/components/Toast'

export default function ObjectRemoveTools() {
  const { image, processedImage, setProcessedImage } = useEditorStore()
  const activeSrc = processedImage ?? image

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const workerRef = useRef<Worker | null>(null)

  const [painting, setPainting] = useState(false)
  const [brushSize, setBrushSize] = useState(24)
  const [applying, setApplying] = useState(false)
  const [progress, setProgress] = useState('')
  const [progressPct, setProgressPct] = useState(0)
  const [hasMask, setHasMask] = useState(false)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [brushMode, setBrushMode] = useState<'paint' | 'erase'>('paint')

  // Load image into preview canvas
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

  // Cleanup worker on unmount
  useEffect(() => () => { workerRef.current?.terminate() }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current, mask = maskCanvasRef.current, img = imgRef.current
    if (!canvas || !mask || !img) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(mask, 0, 0)
  }, [])

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
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
    if (brushMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(239,68,68,0.65)'
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      setHasMask(true)
    }
    redraw()
  }

  const clearMask = useCallback(() => {
    const mask = maskCanvasRef.current, canvas = canvasRef.current, img = imgRef.current
    if (!mask || !canvas || !img) return
    mask.getContext('2d')!.clearRect(0, 0, mask.width, mask.height)
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    setHasMask(false)
  }, [])

  const applyRemoval = () => {
    const mask = maskCanvasRef.current, img = imgRef.current
    if (!mask || !img || !hasMask) return
    setApplying(true); setProgress('Preparing…'); setProgressPct(0)

    // All heavy work runs in a Web Worker — main thread stays responsive
    const W = img.naturalWidth, H = img.naturalHeight
    const SCALE = Math.min(1, 500 / Math.max(W, H))
    const sw = Math.round(W * SCALE), sh = Math.round(H * SCALE)

    // Prepare small image pixels
    const small = document.createElement('canvas')
    small.width = sw; small.height = sh
    small.getContext('2d')!.drawImage(img, 0, 0, sw, sh)
    const imgPixels = small.getContext('2d')!.getImageData(0, 0, sw, sh).data

    // Prepare small mask pixels
    const smallMask = document.createElement('canvas')
    smallMask.width = sw; smallMask.height = sh
    const maskFull = document.createElement('canvas')
    maskFull.width = W; maskFull.height = H
    maskFull.getContext('2d')!.drawImage(mask, 0, 0, W, H)
    smallMask.getContext('2d')!.drawImage(maskFull, 0, 0, sw, sh)
    const maskPixels = smallMask.getContext('2d')!.getImageData(0, 0, sw, sh).data

    // Terminate any previous worker
    workerRef.current?.terminate()
    const worker = new Worker('/inpaint.worker.js')
    workerRef.current = worker

    worker.onmessage = (e) => {
      const { type, pass, total, pixels } = e.data

      if (type === 'progress') {
        setProgress(`Reconstructing texture… pass ${pass}/${total}`)
        setProgressPct(Math.round((pass / total) * 80))
        return
      }

      if (type === 'done') {
        setProgress('Blending edges…'); setProgressPct(90)

        // Composite result back — runs quickly on main thread
        requestAnimationFrame(() => {
          const filledSmall = document.createElement('canvas')
          filledSmall.width = sw; filledSmall.height = sh
          filledSmall.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(pixels), sw, sh), 0, 0)

          // Scale filled region to full res
          const filledFull = document.createElement('canvas')
          filledFull.width = W; filledFull.height = H
          filledFull.getContext('2d')!.drawImage(filledSmall, 0, 0, W, H)
          const filledPx = filledFull.getContext('2d')!.getImageData(0, 0, W, H).data

          // Get original full-res pixels
          const out = document.createElement('canvas')
          out.width = W; out.height = H
          out.getContext('2d')!.drawImage(img, 0, 0)
          const outData = out.getContext('2d')!.getImageData(0, 0, W, H)
          const px = outData.data

          // Full-res mask
          const fullMaskPx = maskFull.getContext('2d')!.getImageData(0, 0, W, H).data
          const isMasked = new Uint8Array(W * H)
          for (let i = 0; i < W * H; i++) {
            if (fullMaskPx[i*4+3] > 40 && fullMaskPx[i*4] > 80) isMasked[i] = 1
          }

          // Blend: soft edge at boundary, full replace inside
          for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
              const i = y * W + x
              if (!isMasked[i]) continue
              let minDist = 999
              for (let dy = -3; dy <= 3; dy++)
                for (let dx = -3; dx <= 3; dx++) {
                  const ni = (y+dy)*W+(x+dx)
                  if (ni >= 0 && ni < W*H && !isMasked[ni])
                    minDist = Math.min(minDist, Math.abs(dy)+Math.abs(dx))
                }
              const alpha = minDist <= 2 ? 0.65 : 1.0
              px[i*4]   = Math.round(px[i*4]   * (1-alpha) + filledPx[i*4]   * alpha)
              px[i*4+1] = Math.round(px[i*4+1] * (1-alpha) + filledPx[i*4+1] * alpha)
              px[i*4+2] = Math.round(px[i*4+2] * (1-alpha) + filledPx[i*4+2] * alpha)
            }
          }

          out.getContext('2d')!.putImageData(outData, 0, 0)
          setProgressPct(100)

          out.toBlob(blob => {
            if (blob) {
              setProcessedImage(URL.createObjectURL(blob))
              toast('Object removed successfully', 'success')
            } else {
              toast('Object removal failed', 'error')
            }
            setApplying(false); setProgress(''); setProgressPct(0)
            clearMask()
            worker.terminate()
          }, 'image/png')
        })
      }
    }

    worker.onerror = (err) => {
      console.error('Worker error:', err)
      setApplying(false); setProgress('')
      toast('Object removal failed', 'error')
      worker.terminate()
    }

    // Transfer pixel buffers to worker (zero-copy)
    const imgBuf = new Uint8ClampedArray(imgPixels).buffer
    const maskBuf = new Uint8ClampedArray(maskPixels).buffer
    worker.postMessage({ imgPixels: imgBuf, maskPixels: maskBuf, W, H, sw, sh }, [imgBuf, maskBuf])
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30">Object / Person Removal</p>
        <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">
          Paint over what you want removed. Background texture is reconstructed.
        </p>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['paint', 'erase'] as const).map(m => (
          <button key={m} onClick={() => setBrushMode(m)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition ${brushMode === m ? 'bg-[#6C63FF] text-white' : 'text-white/40 hover:text-white'}`}>
            {m === 'paint' ? 'Paint Mask' : 'Erase Mask'}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="relative rounded-xl border border-white/10 overflow-hidden bg-[#0d0d1a] checkerboard">
        <canvas ref={canvasRef} className="w-full block" style={{ cursor: 'none' }}
          onMouseDown={e => { setPainting(true); paintStroke(e) }}
          onMouseUp={() => setPainting(false)}
          onMouseLeave={() => { setPainting(false); setCursor(null) }}
          onMouseMove={paintStroke} />
        <canvas ref={maskCanvasRef} className="hidden" />

        {cursor && !applying && (
          <div className="absolute pointer-events-none rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: cursor.x, top: cursor.y, width: brushSize, height: brushSize,
              borderColor: brushMode === 'paint' ? 'rgba(239,68,68,0.9)' : 'rgba(255,255,255,0.7)',
              background: brushMode === 'paint' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.08)',
            }} />
        )}

        {applying && (
          <div className="absolute inset-0 bg-[#0d0d1a]/90 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-[#6C63FF]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6C63FF] animate-spin" />
            </div>
            <p className="text-[11px] text-white/60 text-center px-2">{progress}</p>
            {progressPct > 0 && (
              <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#6C63FF] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }} />
              </div>
            )}
          </div>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Brush size</span><span className="font-mono text-[#8c84ff]">{brushSize}px</span>
        </div>
        <input type="range" min={4} max={80} value={brushSize}
          onChange={e => setBrushSize(Number(e.target.value))}
          className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
          style={{ background: `linear-gradient(to right, #6C63FF ${((brushSize-4)/76)*100}%, rgba(255,255,255,0.1) ${((brushSize-4)/76)*100}%)` }} />
      </label>

      <div className="flex gap-2">
        <button onClick={clearMask} disabled={!hasMask || applying}
          className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 transition">
          Clear
        </button>
        <button onClick={applyRemoval} disabled={applying || !hasMask}
          className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20">
          {applying ? <><Spinner />Working…</> : 'Remove Object'}
        </button>
      </div>

      {hasMask && !applying && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[10px] text-amber-400 leading-relaxed">Works best on textured/patterned backgrounds.</p>
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
