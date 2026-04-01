'use client'
import { useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

export default function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { setImage } = useEditorStore()

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setImage(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition-all duration-200 ${
          isDragging
            ? 'border-[#6C63FF] bg-[#6C63FF]/8 scale-[0.98]'
            : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-white/30'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">
              {isDragging ? 'Drop it here!' : 'Click or drag image'}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/25 mt-1">PNG · JPG · WEBP</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-white/25 px-1 leading-relaxed">
        Files are processed in-browser.{' '}
        <span className="text-white/40">No data leaves your device.</span>
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}
