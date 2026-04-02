'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { addColorBackground } from '@/lib/api'

const SWATCHES = ['#ffffff','#000000','#6C63FF','#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#ec4899','#8b5cf6']

export default function ColorBgTools() {
  const { image, setProcessedImage } = useEditorStore()
  const [color, setColor] = useState('#6C63FF')
  const [gradTo, setGradTo] = useState('#a09cf7')
  const [useGrad, setUseGrad] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handle = async () => {
    if (!image) return
    setLoading(true); setError(null)
    try { setProcessedImage(await addColorBackground(image, color, useGrad ? gradTo : undefined)) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Color Background</p>
      <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
        <div className="flex flex-wrap gap-2">
          {SWATCHES.map(c => (
            <button key={c} onClick={() => { setColor(c); setUseGrad(false) }}
              className={`w-7 h-7 rounded-lg border-2 transition ${color===c&&!useGrad?'border-white scale-110':'border-transparent hover:scale-105'}`}
              style={{ background: c }} />
          ))}
          <button onClick={() => setUseGrad(true)}
            className={`w-7 h-7 rounded-lg border-2 transition ${useGrad?'border-white scale-110':'border-transparent hover:scale-105'}`}
            style={{ background: 'linear-gradient(135deg,#6C63FF,#ec4899)' }} />
        </div>
        <div className="flex gap-2">
          <label className="flex-1 flex flex-col gap-1">
            <span className="text-[10px] text-white/30">{useGrad?'From':'Custom'}</span>
            <div className="relative h-8 rounded-lg overflow-hidden border border-white/10">
              <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
              <div className="absolute inset-0" style={{background:color}} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white/60 mix-blend-difference">{color}</span>
            </div>
          </label>
          {useGrad && (
            <label className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] text-white/30">To</span>
              <div className="relative h-8 rounded-lg overflow-hidden border border-white/10">
                <input type="color" value={gradTo} onChange={e=>setGradTo(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                <div className="absolute inset-0" style={{background:gradTo}} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white/60 mix-blend-difference">{gradTo}</span>
              </div>
            </label>
          )}
        </div>
        <div className="h-6 rounded-lg border border-white/10"
          style={{background: useGrad ? `linear-gradient(135deg,${color},${gradTo})` : color}} />
        <button onClick={handle} disabled={loading}
          className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-xs font-semibold text-[#8c84ff] hover:bg-[#6C63FF]/20 disabled:opacity-40 transition">
          {loading ? <><Spinner />Applying…</> : 'Apply Background'}
        </button>
      </div>
      {error && <p className="text-[11px] text-rose-400 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5">{error}</p>}
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
