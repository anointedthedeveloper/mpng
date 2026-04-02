'use client'
import { useRef, useState, useEffect } from 'react'
import { useEditorStore } from '@/store/editorStore'

export default function ObjectRemoveTools() {
  const { image, processedImage, setProcessedImage } = useEditorStore()
  const activeSrc = processedImage ?? image
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [painting, setPainting] = useState(false)
  const [brushSize, setBrushSize] = useState(20)
  const [applying, setApplying] = useState(false)
  const [hasMask, setHasMask] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Load image onto canvas
  useEffect(() => {
    if (!activeSrc || !canvasRef.current) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = activeSrc
    img.onload = () => {
      imgRef.current = img
      const canvas = canvasRef.current!
      const maxW = 280, maxH = 200
      const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1)
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }, [activeSrc])

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const paint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!painting || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')!
    const { x, y } = getPos(e)
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'rgba(239,68,68,0.5)'
    ctx.beginPath()
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
    ctx.fill()
    setHasMask(true)
  }

  const clearMask = () => {
    if (!canvasRef.current || !imgRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height)
    setHasMask(false)
  }

  // Inpaint: fill masked region with surrounding pixels (simple content-aware fill)
  const applyRemoval = () => {
    if (!canvasRef.current || !imgRef.current || !hasMask) return
    setApplying(true)

    const preview = canvasRef.current
    const img = imgRef.current
    const outCanvas = document.createElement('canvas')
    outCanvas.width = img.naturalWidth
    outCanvas.height = img.naturalHeight
    const ctx = outCanvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    // Scale mask to full resolution
    const scaleX = img.naturalWidth / preview.width
    const scaleY = img.naturalHeight / preview.height
    const previewCtx = preview.getContext('2d')!
    const maskData = previewCtx.getImageData(0, 0, preview.width, preview.height)
    const imgData = ctx.getImageData(0, 0, outCanvas.width, outCanvas.height)

    // For each masked pixel, sample from surrounding non-masked area
    for (let py = 0; py < preview.height; py++) {
      for (let px = 0; px < preview.width; px++) {
        const mi = (py * preview.width + px) * 4
        if (maskData.data[mi + 3] > 50 && maskData.data[mi] > 100) {
          // This pixel is masked — sample from a radius around it
          const fx = Math.round(px * scaleX)
          const fy = Math.round(py * scaleY)
          const radius = Math.round(brushSize * scaleX * 1.5)
          let r = 0, g = 0, b = 0, count = 0
          for (let dy = -radius; dy <= radius; dy += 2) {
            for (let dx = -radius; dx <= radius; dx += 2) {
              const nx = fx + dx, ny = fy + dy
              if (nx < 0 || ny < 0 || nx >= outCanvas.width || ny >= outCanvas.height) continue
              const ni = (ny * outCanvas.width + nx) * 4
              // Only sample from non-masked pixels
              const mpx = Math.round(nx / scaleX), mpy = Math.round(ny / scaleY)
              if (mpx < 0 || mpy < 0 || mpx >= preview.width || mpy >= preview.height) continue
              const mni = (mpy * preview.width + mpx) * 4
              if (maskData.data[mni + 3] > 50 && maskData.data[mni] > 100) continue
              r += imgData.data[ni]; g += imgData.data[ni + 1]; b += imgData.data[ni + 2]
              count++
            }
          }
          if (count > 0) {
            const oi = (fy * outCanvas.width + fx) * 4
            imgData.data[oi] = r / count
            imgData.data[oi + 1] = g / count
            imgData.data[oi + 2] = b / count
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0)
    outCanvas.toBlob(blob => {
      if (blob) setProcessedImage(URL.createObjectURL(blob))
      setApplying(false)
      clearMask()
    }, 'image/png')
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30">Object / Person Removal</p>
        <p className="text-[11px] text-white/40 mt-1 leading-relaxed">Paint over the object or person you want to remove, then click Apply.</p>
      </div>

      {/* Canvas */}
      <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0d1a]">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          onMouseDown={() => setPainting(true)}
          onMouseUp={() => setPainting(false)}
          onMouseLeave={() => setPainting(false)}
          onMouseMove={paint}
        />
      </div>

      {/* Brush size */}
      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Brush size</span>
          <span className="font-mono text-[#8c84ff]">{brushSize}px</span>
        </div>
        <input type="range" min={5} max={60} value={brushSize}
          onChange={e => setBrushSize(Number(e.target.value))}
          className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
          style={{ background: `linear-gradient(to right, #6C63FF ${((brushSize-5)/55)*100}%, rgba(255,255,255,0.1) ${((brushSize-5)/55)*100}%)` }} />
      </label>

      <div className="flex gap-2">
        <button onClick={clearMask} disabled={!hasMask}
          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 transition">
          Clear
        </button>
        <button onClick={applyRemoval} disabled={applying || !hasMask}
          className="flex-1 h-9 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition">
          {applying ? <><Spinner />Removing…</> : 'Apply Removal'}
        </button>
      </div>

      <p className="text-[10px] text-white/20 leading-relaxed">
        Uses content-aware fill to replace the painted area with surrounding pixels.
      </p>
    </div>
  )
}

function Spinner() {
  return <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
