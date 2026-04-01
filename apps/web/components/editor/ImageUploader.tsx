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
    <div>
      <p className="text-[11px] uppercase tracking-widest text-gray-600 mb-2">Upload</p>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-800 hover:border-[#6C63FF] rounded-xl p-5 text-center cursor-pointer transition group"
      >
        <p className="text-gray-600 text-xs group-hover:text-gray-400 transition">
          Drop image here or <span className="text-[#6C63FF]">browse</span>
        </p>
        <p className="text-gray-700 text-[10px] mt-1">PNG, JPG, WEBP</p>
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
