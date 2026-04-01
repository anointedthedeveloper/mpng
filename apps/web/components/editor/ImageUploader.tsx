'use client'
import { useRef } from 'react'
import { useEditorStore } from '@/store/editorStore'

export default function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { setImage } = useEditorStore()

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file)
    setImage(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="mpng-label">Upload</p>
        <p className="mt-2 text-sm text-white/60">PNG, JPG, or WEBP files work best.</p>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="group cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center transition hover:border-[#6C63FF]/70 hover:bg-white/[0.06]"
      >
        <p className="text-sm text-white/65 transition group-hover:text-white/80">
          Drop an image here or <span className="text-[#9a95ff]">browse</span>
        </p>
        <p className="mt-2 text-xs tracking-[0.18em] text-white/35">DRAG AND DROP SUPPORTED</p>
      </div>
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
