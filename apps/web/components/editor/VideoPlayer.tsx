'use client'
import { useRef, useState, useEffect } from 'react'
import { useEditorStore } from '@/store/editorStore'

export default function VideoPlayer() {
  const { video } = useEditorStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else { v.play(); setPlaying(true) }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  if (!video) return null

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full p-4">
      <video
        ref={videoRef}
        src={video}
        className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-black/40 bg-black flex-1 min-h-0"
        style={{ maxHeight: 'calc(100% - 80px)', objectFit: 'contain' }}
        onLoadedMetadata={e => { setDuration((e.target as HTMLVideoElement).duration) }}
        onTimeUpdate={e => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
        onEnded={() => setPlaying(false)}
      />

      {/* Custom controls */}
      <div className="w-full flex flex-col gap-2 px-1">
        {/* Timeline */}
        <div
          className="h-2 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
          onClick={seek}
        >
          <div className="absolute inset-y-0 left-0 bg-[#6C63FF] rounded-full transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
          {/* Tick marks */}
          {duration > 0 && [...Array(Math.min(20, Math.floor(duration)))].map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px bg-white/10"
              style={{ left: `${((i + 1) / Math.min(20, Math.floor(duration))) * 100}%` }} />
          ))}
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          <button onClick={toggle}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            {playing
              ? <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
              : <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>
          <span className="text-[11px] font-mono text-white/40">
            {fmt(currentTime)} / {fmt(duration)}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-white/30">Use Trim tool in sidebar</span>
          </div>
        </div>
      </div>
    </div>
  )
}
