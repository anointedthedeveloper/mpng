'use client'
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEditorStore } from '@/store/editorStore'
import ImageUploader from '@/components/editor/ImageUploader'
import AITools from '@/components/editor/tools/AITools'
import AdjustTools from '@/components/editor/tools/AdjustTools'
import UpscaleTools from '@/components/editor/tools/UpscaleTools'
import ColorBgTools from '@/components/editor/tools/ColorBgTools'
import VideoTools from '@/components/editor/tools/VideoTools'
import CropTools from '@/components/editor/tools/CropTools'
import ObjectRemoveTools from '@/components/editor/tools/ObjectRemoveTools'
import BlendTools from '@/components/editor/tools/BlendTools'

const EditorCanvas = dynamic(() => import('@/components/editor/EditorCanvas'), { ssr: false })
const VideoPlayer = dynamic(() => import('@/components/editor/VideoPlayer'), { ssr: false })

const IMAGE_TOOLS = [
  { id: 'ai', label: 'AI', icon: <SparkIcon /> },
  { id: 'adjust', label: 'Adjust', icon: <SlidersIcon /> },
  { id: 'crop', label: 'Crop', icon: <CropIcon /> },
  { id: 'remove', label: 'Remove', icon: <EraserIcon /> },
  { id: 'blend', label: 'Blend', icon: <BlendIcon /> },
  { id: 'upscale', label: 'Upscale', icon: <ExpandIcon /> },
  { id: 'colorbg', label: 'BG', icon: <PaletteIcon /> },
]

const VIDEO_TOOLS = [
  { id: 'video', label: 'Trim', icon: <VideoIcon /> },
  { id: 'crop', label: 'Crop', icon: <CropIcon /> },
]

export default function EditorPage() {
  const { image, video, processedImage, mode, activeTool, history, future, setImage, setVideo, setActiveTool, undo, redo, reset } = useEditorStore()
  const [globalDrag, setGlobalDrag] = useState(false)
  const hasMedia = image || video

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) setImage(URL.createObjectURL(file))
    else if (file.type.startsWith('video/')) setVideo(URL.createObjectURL(file))
  }

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find(
        i => i.type.startsWith('image/') || i.type.startsWith('video/')
      )
      if (!item) return
      const file = item.getAsFile()
      if (file) handleFile(file)
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setGlobalDrag(true) }
  const onDragLeave = (e: React.DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setGlobalDrag(false) }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setGlobalDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const tools = mode === 'video' ? VIDEO_TOOLS : IMAGE_TOOLS

  return (
    <div
      className="h-screen bg-[#080810] text-white flex flex-col overflow-hidden"
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
    >
      {/* Drop overlay */}
      {globalDrag && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080810]/95 border-2 border-dashed border-[#6C63FF] pointer-events-none">
          <div className="w-20 h-20 rounded-3xl bg-[#6C63FF]/20 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-[#6C63FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-xl font-bold">Drop anywhere</p>
          <p className="text-sm text-white/40 mt-1">Image or Video</p>
        </div>
      )}

      {/* Top bar */}
      <header className="shrink-0 flex items-center gap-3 border-b border-white/8 bg-[#0a0a14] px-4 h-14">
        <Link href="/" className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg bg-[#6C63FF] flex items-center justify-center text-[10px] font-bold shadow-lg shadow-[#6C63FF]/30">mp</div>
          <span className="text-sm font-bold hidden sm:block">mp<span className="text-[#8c84ff]">ng</span></span>
        </Link>

        {/* Mode tabs */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {(['image', 'video'] as const).map(m => (
            <button key={m} onClick={() => { reset(); useEditorStore.getState().setMode(m) }}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${mode === m ? 'bg-[#6C63FF] text-white' : 'text-white/40 hover:text-white'}`}>
              {m}
            </button>
          ))}
        </div>

        {/* Tool tabs */}
        {hasMedia && (
          <div className="flex items-center gap-1 ml-2">
            {tools.map(t => (
              <button key={t.id} onClick={() => setActiveTool(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTool === t.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                {t.icon}
                <span className="hidden sm:block">{t.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Undo / Redo */}
          {hasMedia && (
            <div className="flex items-center gap-1">
              <button onClick={undo} disabled={history.length === 0}
                title="Undo"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button onClick={redo} disabled={future.length === 0}
                title="Redo"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>
            </div>
          )}
          {hasMedia && (
            <button onClick={reset} className="px-3 py-1.5 rounded-lg border border-rose-500/20 text-xs text-rose-400 hover:bg-rose-500/10 transition">
              New
            </button>
          )}
          <a href="https://github.com/anointedthedeveloper/mpng" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/40 hover:text-white transition">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {!hasMedia ? (
          /* Upload screen */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Upload {mode === 'video' ? 'a video' : 'an image'}</h1>
                <p className="text-white/40 text-sm mt-2">Drop anywhere · Paste Ctrl+V · Or click below</p>
              </div>
              <ImageUploader mode={mode} />
            </div>
          </div>
        ) : (
          <>
            {/* Left tool panel — narrow so canvas gets maximum space */}
            <aside className="w-64 shrink-0 border-r border-white/8 bg-[#0a0a14] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                {mode === 'image' && activeTool === 'ai' && <AITools />}
                {mode === 'image' && activeTool === 'adjust' && <AdjustTools />}
                {mode === 'image' && activeTool === 'crop' && <CropTools />}
                {mode === 'image' && activeTool === 'remove' && <ObjectRemoveTools />}
                {mode === 'image' && activeTool === 'blend' && <BlendTools />}
                {mode === 'image' && activeTool === 'upscale' && <UpscaleTools />}
                {mode === 'image' && activeTool === 'colorbg' && <ColorBgTools />}
                {mode === 'video' && activeTool === 'video' && <VideoTools />}
                {mode === 'video' && activeTool === 'crop' && <CropTools />}
              </div>
            </aside>

            {/* Canvas — fills ALL remaining space */}
            <main className="flex-1 min-w-0 bg-[#060810] overflow-hidden">
              {mode === 'image' ? <EditorCanvas /> : <VideoPlayer />}
            </main>
          </>
        )}
      </div>
    </div>
  )
}

function BlendIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
}
function EraserIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" /></svg>
}
function CropIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2" /></svg>
}
function SparkIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" /></svg>
}
function SlidersIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
}
function ExpandIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
}
function PaletteIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
}
function VideoIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
}
