'use client'
import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

function useLoadedImage(src: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    if (!src) { setImg(null); return }
    const el = new window.Image()
    el.crossOrigin = 'anonymous'
    el.src = src
    el.onload = () => setImg(el)
    return () => { el.onload = null }
  }, [src])
  return img
}

export default function EditorCanvasClient() {
  const { image, processedImage, filters, setDimensions } = useEditorStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const originalImg = useLoadedImage(image)
  const processedImg = useLoadedImage(processedImage)
  const activeImg = processedImg ?? originalImg

  const [sliderPct, setSliderPct] = useState(50)
  const [dragging, setDragging] = useState(false)
  const showBeforeAfter = !!(processedImage && originalImg && processedImg)

  // Draw active image onto canvas at full resolution
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !activeImg) return
    canvas.width = activeImg.naturalWidth
    canvas.height = activeImg.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`
    ctx.drawImage(activeImg, 0, 0)
    ctx.filter = 'none'
    setDimensions({ w: activeImg.naturalWidth, h: activeImg.naturalHeight })
  }, [activeImg, filters])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    setSliderPct(pct)
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'mpng-export.png'
    a.click()
  }

  if (!activeImg) return null

  // Display size: fit within max bounds
  const maxW = 860
  const maxH = 580
  const ratio = Math.min(maxW / activeImg.naturalWidth, maxH / activeImg.naturalHeight, 1)
  const dispW = Math.round(activeImg.naturalWidth * ratio)
  const dispH = Math.round(activeImg.naturalHeight * ratio)

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 checkerboard select-none"
        style={{ width: dispW, height: dispH }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        {/* Main canvas — full resolution, CSS-scaled to fit */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: 'auto' }}
        />

        {/* Before/after overlay */}
        {showBeforeAfter && (
          <>
            {/* "Before" — original image clipped to left of slider */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
            >
              <img
                src={image!}
                className="absolute inset-0 w-full h-full object-contain"
                alt="before"
              />
              <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80">
                Before
              </span>
            </div>

            {/* "After" label */}
            <span className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 pointer-events-none">
              After
            </span>

            {/* Divider */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none"
              style={{ left: `${sliderPct}%` }}
            />

            {/* Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center cursor-ew-resize z-10"
              style={{ left: `${sliderPct}%` }}
              onMouseDown={(e) => { e.preventDefault(); setDragging(true) }}
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Info + Download */}
      <div className="flex items-center gap-4">
        <span className="text-[11px] text-white/25">
          {activeImg.naturalWidth} × {activeImg.naturalHeight}px
        </span>
        <button
          onClick={download}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>
      </div>
    </div>
  )
}
