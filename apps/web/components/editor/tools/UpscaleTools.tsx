'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { upscaleImage } from '@/lib/api'
import { toast } from '@/components/Toast'

export default function UpscaleTools() {
  const { image, processedImage, dimensions, setProcessedImage } = useEditorStore()
  const [loading, setLoading] = useState<2 | 4 | null>(null)
  const [done, setDone] = useState<{ from: string; to: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const activeSrc = processedImage ?? image

  const handle = async (scale: 2 | 4) => {
    if (!activeSrc) return
    const from = dimensions ? `${dimensions.w}×${dimensions.h}` : '?'
    setLoading(scale); setError(null); setDone(null)
    try {
      setProcessedImage(await upscaleImage(activeSrc, scale))
      if (dimensions) setDone({ from, to: `${dimensions.w * scale}×${dimensions.h * scale}` })
      toast(`Upscaled to ${dimensions ? dimensions.w * scale : '?'}×${dimensions ? dimensions.h * scale : '?'}px`, 'success')
    } catch (e: any) { setError(e.message) }
    finally { setLoading(null) }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Upscale</p>
      {dimensions && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] text-white/30">Current</span>
          <span className="text-[11px] font-mono text-white/60">{dimensions.w} × {dimensions.h}px</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {([2, 4] as const).map(scale => (
          <button key={scale} onClick={() => handle(scale)} disabled={loading !== null}
            className="h-16 flex flex-col items-center justify-center gap-0.5 rounded-xl border border-white/10 hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/8 disabled:opacity-40 transition group">
            {loading === scale
              ? <><Spinner /><span className="text-[10px] text-white/40 mt-1">Working…</span></>
              : <><span className="text-lg font-bold text-white group-hover:text-[#8c84ff]">{scale}×</span>
                  {dimensions && <span className="text-[10px] font-mono text-white/30">{dimensions.w*scale}×{dimensions.h*scale}</span>}
                </>}
          </button>
        ))}
      </div>
      {done && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="text-[11px] text-emerald-400 font-mono">{done.from} → {done.to}</span>
        </div>
      )}
      {error && <p className="text-[11px] text-rose-400 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5">{error}</p>}
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
