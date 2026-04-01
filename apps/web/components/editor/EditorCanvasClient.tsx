'use client'
import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

const CANVAS_W = 720
const CANVAS_H = 480

function useLoadedImage(src: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    if (!src) return setImg(null)
    const el = new window.Image()
    el.crossOrigin = 'anonymous'
    el.src = src
    el.onload = () => setImg(el)
    return () => { el.onload = null }
  }, [src])
  return img
}

function drawImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, filters: { brightness: number; contrast: number; saturation: number }) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
  ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`
  const scale = Math.min(CANVAS_W / img.naturalWidth, CANVAS_H / img.naturalHeight, 1)
  const w = img.naturalWidth * scale
  const h = img.naturalHeight * scale
  ctx.drawImage(img, (CANVAS_W - w) / 2, (CANVAS_H - h) / 2, w, h)
  ctx.filter = 'none'
}

export default function EditorCanvasClient() {
  const { image, processedImage, filters } = useEditorStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const originalImg = useLoadedImage(image)
  const processedImg = useLoadedImage(processedImage)
  const activeImg = processedImg ?? originalImg

  // before/after slider state
  const [sliderX, setSliderX] = useState(CANVAS_W / 2)
  const [dragging, setDragging] = useState(false)
  const showBeforeAfter = !!(processedImage && originalImg && processedImg)

  // draw main canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !activeImg) return
    const ctx = canvas.getContext('2d')!
    drawImage(ctx, activeImg, filters)
  }, [activeImg, filters])

  // before/after mouse handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    setSliderX(Math.max(0, Math.min(CANVAS_W, e.clientX - rect.left)))
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

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas / Before-After */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 checkerboard select-none"
        style={{ width: CANVAS_W, height: CANVAS_H }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        {/* Main canvas (processed + filters) */}
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="absolute inset-0" />

        {/* Before/after overlay */}
        {showBeforeAfter && (
          <>
            {/* Original clipped to left of slider */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${CANVAS_W - sliderX}px 0 0)` }}
            >
              <canvas
                width={CANVAS_W}
                height={CANVAS_H}
                ref={(el) => {
                  if (!el || !originalImg) return
                  const ctx = el.getContext('2d')!
                  drawImage(ctx, originalImg, { brightness: 100, contrast: 100, saturation: 100 })
                }}
              />
              <div className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/70">
                Before
              </div>
            </div>

            {/* After label */}
            <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/70 pointer-events-none">
              After
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white/60 pointer-events-none"
              style={{ left: sliderX }}
            />

            {/* Drag handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize z-10"
              style={{ left: sliderX }}
              onMouseDown={() => setDragging(true)}
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Download button */}
      <button
        onClick={download}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PNG
      </button>
    </div>
  )
}
