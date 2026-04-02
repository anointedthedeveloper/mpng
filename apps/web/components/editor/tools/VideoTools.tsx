'use client'
import { useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { toast } from '@/components/Toast'

export default function VideoTools() {
  const { video } = useEditorStore()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [duration, setDuration] = useState(0)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState('')

  const handleLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const d = Math.floor((e.target as HTMLVideoElement).duration)
    setDuration(d)
    setTrimEnd(d)
  }

  const handleExport = async () => {
    if (!video) return
    setExporting(true)
    setProgress('Loading videoâ€¦')

    try {
      const videoEl = document.createElement('video')
      videoEl.src = video
      videoEl.muted = true
      await new Promise<void>((res) => {
        videoEl.onloadedmetadata = () => res()
      })

      videoEl.currentTime = trimStart
      await new Promise<void>((res) => {
        videoEl.onseeked = () => res()
      })

      const stream = (videoEl as any).captureStream()
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'mpng-trimmed.webm'
        a.click()
        URL.revokeObjectURL(url)
        setExporting(false)
        setProgress('')
        toast('Video trimmed and exported successfully', 'success')
      }

      videoEl.play()
      recorder.start()
      setProgress(`Recording ${trimEnd - trimStart}sâ€¦`)

      setTimeout(() => {
        recorder.stop()
        videoEl.pause()
      }, (trimEnd - trimStart) * 1000)
    } catch (e: any) {
      setProgress('Falling back to full downloadâ€¦')
      toast(e?.message ?? 'Trim export failed, downloading original video', 'error')
      const a = document.createElement('a')
      a.href = video
      a.download = 'mpng-video.mp4'
      a.click()
      setExporting(false)
      setProgress('')
    }
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-white/30">Video Tools</p>

      {video && (
        <video
          ref={videoRef}
          src={video}
          onLoadedMetadata={handleLoaded}
          className="hidden"
        />
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50 font-medium">Trim</p>
          {duration > 0 && <span className="text-[10px] font-mono text-white/30">Total: {fmt(duration)}</span>}
        </div>

        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-white/30">
            <span>Start</span>
            <span className="font-mono text-[#8c84ff]">{fmt(trimStart)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(duration - 1, 0)}
            value={trimStart}
            onChange={(e) => setTrimStart(Math.min(Number(e.target.value), trimEnd - 1))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
            style={{
              background: `linear-gradient(to right, #6C63FF ${
                duration ? (trimStart / duration) * 100 : 0
              }%, rgba(255,255,255,0.1) ${duration ? (trimStart / duration) * 100 : 0}%)`,
            }}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-white/30">
            <span>End</span>
            <span className="font-mono text-[#8c84ff]">{fmt(trimEnd)}</span>
          </div>
          <input
            type="range"
            min={1}
            max={duration || 300}
            value={trimEnd}
            onChange={(e) => setTrimEnd(Math.max(Number(e.target.value), trimStart + 1))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[#6C63FF]"
            style={{
              background: `linear-gradient(to right, #6C63FF ${
                duration ? (trimEnd / duration) * 100 : 0
              }%, rgba(255,255,255,0.1) ${duration ? (trimEnd / duration) * 100 : 0}%)`,
            }}
          />
        </label>

        <div className="flex items-center justify-between text-[10px] px-1">
          <span className="text-white/30">Clip duration</span>
          <span className="font-mono text-white/60">{fmt(trimEnd - trimStart)}</span>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={exporting || !video}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6C63FF] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-lg shadow-[#6C63FF]/20"
      >
        {exporting ? (
          <><Spinner />{progress || 'Exportingâ€¦'}</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Trimmed Clip
          </>
        )}
      </button>

      <p className="text-[10px] text-white/25 leading-relaxed px-1">
        Exports as WebM using browser MediaRecorder. For MP4 output, the backend FFmpeg service is required.
      </p>
    </div>
  )
}

function Spinner() {
  return <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
}
