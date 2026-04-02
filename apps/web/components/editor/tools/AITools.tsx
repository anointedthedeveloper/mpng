'use client'
import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { removeBackground, blurBackground } from '@/lib/api'
import { toast } from '@/components/Toast'

export default function AITools() {
  const { image, processedImage, setProcessedImage } = useEditorStore()
  const [bgLoading, setBgLoading] = useState(false)
  const [blurLoading, setBlurLoading] = useState(false)
  const [blurAmount, setBlurAmount] = useState(10)
  const activeSrc = processedImage ?? image
  const busy = bgLoading || blurLoading

  const handleRemoveBg = async () => {
    if (!activeSrc) return
    setBgLoading(true)
    try {
      const res = await fetch(activeSrc)
      const blob = await res.blob()
      setProcessedImage(await removeBackground(new File([blob], 'image.png', { type: blob.type })))
      toast('Background removed successfully', 'success')
    } catch (e: any) {
      toast(e.message ?? 'Background removal failed', 'error')
    } finally { setBgLoading(false) }
  }

  const handleBlurBg = async () => {
    if (!image) return
    setBlurLoading(true)
    try {
      setProcessedImage(await blurBackground(image, blurAmount))
      toast('Background blurred', 'success')
    } catch (e: any) {
      toast(e.message ?? 'Blur failed', 'error')
    } finally { setBlurLoading(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30">AI Tools</p>
        <p className="text-[10px] text-white/20 mt-1">Powered by remove.bg</p>
      </div>

      <button onClick={handleRemoveBg} disabled={busy}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20">
        {bgLoading ? <><Spinner />Processing…</> : <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" /></svg>
          Remove Background
        </>}
        </button>

        <div className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.02] p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Blur Background</span>
          <span className="text-[10px] font-mono text-[#8c84ff]">{blurAmount}px</span>
        </div>
        <input type="range" min={2} max={40} value={blurAmount}
          onChange={(e) => setBlurAmount(Number(e.target.value))}
          className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
          style={{ background: `linear-gradient(to right, #6C63FF ${((blurAmount-2)/38)*100}%, rgba(255,255,255,0.1) ${((blurAmount-2)/38)*100}%)` }} />
        <button onClick={handleBlurBg} disabled={busy}
          className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-xs font-semibold text-[#8c84ff] hover:bg-[#6C63FF]/20 disabled:opacity-40 transition">
          {blurLoading ? <><Spinner />Blurring…</> : 'Apply Blur'}
        </button>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">AI provider</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c84ff]">remove.bg</span>
          </div>
          <p className="text-[11px] text-white/25 leading-relaxed">
            Background removal and blur tools use remove.bg-powered image processing, while Anobyte handles the app experience.
          </p>
        </div>

      {processedImage && <p className="text-[10px] text-white/25 text-center">← drag slider on canvas to compare</p>}
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
