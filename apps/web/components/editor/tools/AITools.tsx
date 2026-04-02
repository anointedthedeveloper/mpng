'use client'
import { useMemo, useState } from 'react'
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

  const previewSrc = useMemo(() => processedImage ?? image, [processedImage, image])
  const statusLabel = bgLoading ? 'Removing background' : blurLoading ? 'Blurring background' : 'Ready'

  const handleRemoveBg = async () => {
    if (!activeSrc) return
    setBgLoading(true)
    try {
      const res = await fetch(activeSrc)
      const blob = await res.blob()
      const safeType = blob.type || 'image/png'
      const output = await removeBackground(new File([blob], 'image.png', { type: safeType }))
      setProcessedImage(output)
      toast('Background removed successfully', 'success')
    } catch (e: any) {
      const message = e?.message ?? 'Background removal failed'
      const friendly =
        /400|unsupported|invalid|file/i.test(message)
          ? 'Background removal failed. Try a PNG or JPG under 10 MB.'
          : message
      toast(friendly, 'error')
    } finally {
      setBgLoading(false)
    }
  }

  const handleBlurBg = async () => {
    if (!image) return
    setBlurLoading(true)
    try {
      const output = await blurBackground(image, blurAmount)
      setProcessedImage(output)
      toast('Background blurred', 'success')
    } catch (e: any) {
      toast(e?.message ?? 'Blur failed', 'error')
    } finally {
      setBlurLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">AI tools</p>
            <h3 className="mt-1 text-sm font-semibold text-white/90">Fast cutouts with a polished finishing pass</h3>
            <p className="mt-1 text-[11px] text-white/35 leading-relaxed">
              Powered by remove.bg for subject isolation, with Anobyte handling the blending and export flow.
            </p>
          </div>
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            remove.bg
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['Transparent', 'PNG output'],
            ['Soft blur', 'Portrait-style'],
            ['Fast export', 'One click'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-xl border border-white/6 bg-black/15 px-3 py-2">
              <div className="text-[11px] font-semibold text-white/75">{title}</div>
              <div className="mt-0.5 text-[10px] text-white/30">{copy}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#0b0d17] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${busy ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-xs font-medium text-white/70">{statusLabel}</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-white/25">Live preview</span>
        </div>

        <div className="relative aspect-[4/3] checkerboard">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="AI tool preview"
              className={`absolute inset-0 h-full w-full object-contain transition duration-300 ${busy ? 'scale-[1.01] blur-[1px] opacity-70' : ''}`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/25">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs">Upload an image to begin</span>
            </div>
          )}

          {(bgLoading || blurLoading) && (
            <div className="absolute inset-0 bg-[#080810]/70 backdrop-blur-sm">
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] animate-[shimmer_1.4s_infinite]" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full border border-[#6C63FF]/30">
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6C63FF] animate-spin" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white/90">
                      {bgLoading ? 'Removing the subject' : 'Refining the background'}
                    </div>
                    <div className="text-[11px] text-white/40 leading-relaxed">
                      {bgLoading
                        ? 'This step may take a moment while the cutout is processed.'
                        : 'The background blur is being blended for a cleaner final look.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleRemoveBg}
        disabled={busy || !activeSrc}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#7f74ff] text-sm font-semibold shadow-lg shadow-[#6C63FF]/20 transition hover:opacity-95 disabled:opacity-40"
      >
        <span className="inline-flex items-center justify-center gap-2">
          {bgLoading ? (
            <>
              <Spinner />
              Processing cutout
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
              </svg>
              Remove Background
            </>
          )}
        </span>
      </button>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/70">Background blur</p>
            <p className="text-[10px] text-white/30 mt-0.5">Keeps the subject sharp while softening the scene behind it.</p>
          </div>
          <span className="text-[10px] font-mono text-[#8c84ff]">{blurAmount}px</span>
        </div>

        <div className="mt-3">
          <input
            type="range"
            min={2}
            max={40}
            value={blurAmount}
            onChange={(e) => setBlurAmount(Number(e.target.value))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
            style={{ background: `linear-gradient(to right, #6C63FF ${((blurAmount - 2) / 38) * 100}%, rgba(255,255,255,0.1) ${((blurAmount - 2) / 38) * 100}%)` }}
          />
        </div>

        <button
          onClick={handleBlurBg}
          disabled={busy || !image}
          className="mt-3 w-full h-10 rounded-xl border border-[#6C63FF]/25 bg-[#6C63FF]/10 text-xs font-semibold text-[#b8b4ff] transition hover:bg-[#6C63FF]/20 disabled:opacity-40"
        >
          {blurLoading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              Applying blur
            </span>
          ) : (
            'Apply Blur Background'
          )}
        </button>
      </div>

      {processedImage && (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-[10px] text-white/35 text-center">
          Drag the canvas slider to compare the original and the edit.
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
