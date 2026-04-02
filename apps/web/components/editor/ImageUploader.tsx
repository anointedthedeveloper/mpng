'use client'
import { useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

export default function ImageUploader({ mode = 'image' }: { mode?: 'image' | 'video' }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { setImage, setVideo } = useEditorStore()

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) setImage(URL.createObjectURL(file))
    else if (file.type.startsWith('video/')) setVideo(URL.createObjectURL(file))
  }

  const accept = mode === 'video' ? 'video/*' : 'image/*'
  const label = mode === 'video' ? 'MP4 · MOV · WEBM' : 'PNG · JPG · WEBP'

  return (
    <div className="space-y-3">
      <div
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
          isDragging ? 'border-[#6C63FF] bg-[#6C63FF]/8 scale-[0.98]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-white/30'}`}>
            {mode === 'video' ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">{isDragging ? 'Drop it here!' : `Click or drag ${mode}`}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/25 mt-1">{label}</p>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-white/25 text-center">Files stay in your browser. <span className="text-white/40">Nothing is uploaded.</span></p>
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </div>
  )
}
