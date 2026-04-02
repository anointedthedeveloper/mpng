'use client'
import { useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

export default function VideoTools() {
  const { video } = useEditorStore()
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(30)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!video) return
    setExporting(true)
    // Client-side: just download the original video for now
    // Server-side FFmpeg trim would require a backend endpoint
    const a = document.createElement('a')
    a.href = video
    a.download = 'mpng-video-export.mp4'
    a.click()
    setExporting(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Video Tools</p>

      <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
        <p className="text-xs text-white/50 font-medium">Trim</p>
        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-white/30">
            <span>Start</span><span className="font-mono text-[#8c84ff]">{trimStart}s</span>
          </div>
          <input type="range" min={0} max={300} value={trimStart}
            onChange={e => setTrimStart(Math.min(Number(e.target.value), trimEnd - 1))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
            style={{ background: `linear-gradient(to right, #6C63FF ${(trimStart/300)*100}%, rgba(255,255,255,0.1) ${(trimStart/300)*100}%)` }} />
        </label>
        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-white/30">
            <span>End</span><span className="font-mono text-[#8c84ff]">{trimEnd}s</span>
          </div>
          <input type="range" min={1} max={300} value={trimEnd}
            onChange={e => setTrimEnd(Math.max(Number(e.target.value), trimStart + 1))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
            style={{ background: `linear-gradient(to right, #6C63FF ${(trimEnd/300)*100}%, rgba(255,255,255,0.1) ${(trimEnd/300)*100}%)` }} />
        </label>
        <div className="flex items-center justify-between text-[10px] text-white/30 px-1">
          <span>Duration</span>
          <span className="font-mono text-white/50">{trimEnd - trimStart}s</span>
        </div>
      </div>

      <button onClick={handleExport} disabled={exporting || !video}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20">
        {exporting ? <><Spinner />Exporting…</> : <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Video
        </>}
      </button>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
        <p className="text-[10px] text-white/30 leading-relaxed">
          Full FFmpeg trim requires the backend service. Download exports the full video for now.
        </p>
      </div>
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
