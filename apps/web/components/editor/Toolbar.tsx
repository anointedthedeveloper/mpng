'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { removeBackground, blurBackground, upscaleImage } from '@/lib/api'

function Slider({ label, value, min = 0, max = 200, onChange }: { label: string; value: number; min?: number; max?: number; onChange: (v: number) => void }) {
  const pct = Math.round(((value - min) / (max - min)) * 100)
  return (
    <label className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:border-white/10 transition-colors cursor-pointer">
      <div className="flex justify-between items-center">
        <span className="text-xs capitalize text-white/50">{label}</span>
        <span className="text-[10px] font-mono text-[#8c84ff]">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
        style={{ background: `linear-gradient(to right, #6C63FF ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }}
      />
    </label>
  )
}

export default function Toolbar() {
  const { image, processedImage, filters, dimensions, updateFilter, setProcessedImage, undo, reset } = useEditorStore()
  const [bgLoading, setBgLoading] = useState(false)
  const [blurLoading, setBlurLoading] = useState(false)
  const [blurAmount, setBlurAmount] = useState(10)
  const [upscaleLoading, setUpscaleLoading] = useState<2 | 4 | null>(null)
  const [upscaleDone, setUpscaleDone] = useState<{ from: string; to: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeSrc = processedImage ?? image
  const busy = bgLoading || blurLoading || upscaleLoading !== null

  const handleRemoveBg = async () => {
    if (!activeSrc) return
    setBgLoading(true); setError(null); setUpscaleDone(null)
    try {
      const res = await fetch(activeSrc)
      const blob = await res.blob()
      const url = await removeBackground(new File([blob], 'image.png', { type: blob.type }))
      setProcessedImage(url)
    } catch (e: any) { setError(e.message) }
    finally { setBgLoading(false) }
  }

  const handleBlurBg = async () => {
    // Always blur from the original image so subject stays sharp
    if (!image) return
    setBlurLoading(true); setError(null); setUpscaleDone(null)
    try {
      const url = await blurBackground(image, blurAmount)
      setProcessedImage(url)
    } catch (e: any) { setError(e.message) }
    finally { setBlurLoading(false) }
  }

  const handleUpscale = async (scale: 2 | 4) => {
    if (!activeSrc) return
    const fromW = dimensions?.w ?? '?'
    const fromH = dimensions?.h ?? '?'
    setUpscaleLoading(scale); setError(null); setUpscaleDone(null)
    try {
      const url = await upscaleImage(activeSrc, scale)
      setProcessedImage(url)
      if (dimensions) {
        setUpscaleDone({
          from: `${fromW} × ${fromH}`,
          to: `${dimensions.w * scale} × ${dimensions.h * scale}`,
        })
      }
    } catch (e: any) { setError(e.message) }
    finally { setUpscaleLoading(null) }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* AI Tools */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30 px-1">AI Tools</p>

        {/* Remove BG */}
        <button
          onClick={handleRemoveBg}
          disabled={busy}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20"
        >
          {bgLoading ? <><Spinner />Processing…</> : <><EraserIcon />Remove Background</>}
        </button>

        {/* Blur BG */}
        <div className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <span className="text-xs text-white/50">Blur Background</span>
            </div>
            <span className="text-[10px] font-mono text-[#8c84ff]">{blurAmount}px</span>
          </div>

          <input
            type="range" min={2} max={40} value={blurAmount}
            onChange={(e) => setBlurAmount(Number(e.target.value))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
            style={{ background: `linear-gradient(to right, #6C63FF ${((blurAmount - 2) / 38) * 100}%, rgba(255,255,255,0.1) ${((blurAmount - 2) / 38) * 100}%)` }}
          />

          <button
            onClick={handleBlurBg}
            disabled={busy}
            className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-xs font-semibold text-[#8c84ff] hover:bg-[#6C63FF]/20 disabled:opacity-40 transition"
          >
            {blurLoading ? <><Spinner />Blurring…</> : <>Apply Blur</>}
          </button>
        </div>

        {processedImage && (
          <p className="text-[10px] text-white/25 px-1 text-center">← drag slider on canvas to compare</p>
        )}
      </div>

      {/* Upscale */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30 px-1">Upscale</p>
        {dimensions && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[11px] text-white/30">Current size</span>
            <span className="text-[11px] font-mono text-white/60">{dimensions.w} × {dimensions.h}px</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {([2, 4] as const).map((scale) => (
            <button
              key={scale}
              onClick={() => handleUpscale(scale)}
              disabled={busy}
              className="h-16 flex flex-col items-center justify-center gap-0.5 rounded-xl border border-white/10 hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/8 disabled:opacity-40 transition group"
            >
              {upscaleLoading === scale ? (
                <><Spinner /><span className="text-[10px] text-white/40 mt-1">Working…</span></>
              ) : (
                <>
                  <span className="text-lg font-bold text-white group-hover:text-[#8c84ff] transition">{scale}×</span>
                  {dimensions ? (
                    <span className="text-[10px] font-mono text-white/30">{dimensions.w * scale} × {dimensions.h * scale}px</span>
                  ) : (
                    <span className="text-[10px] text-white/25">Upscale</span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
        {upscaleDone && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[11px] text-emerald-400 font-mono">{upscaleDone.from} → {upscaleDone.to}</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-400 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5">{error}</p>
      )}

      {/* Adjustments */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30 px-1">Adjustments</p>
        {(['brightness', 'contrast', 'saturation'] as const).map((key) => (
          <Slider key={key} label={key} value={filters[key]} onChange={(v) => updateFilter(key, v)} />
        ))}
      </div>

      {/* History */}
      <div className="flex gap-2">
        <button onClick={undo}
          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Undo
        </button>
        <button onClick={reset}
          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 text-xs text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/5 transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

function EraserIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
    </svg>
  )
}
