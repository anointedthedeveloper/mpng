'use client'
import { useRef, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { UploadCloud, Image as ImageIcon, FileWarning } from 'lucide-react'

export default function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { setImage } = useEditorStore()

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setImage(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-4">
      <div className="group relative">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-[2rem] border-2 border-dashed p-8 text-center transition-all duration-300
            ${isDragging 
              ? 'border-[#6C63FF] bg-[#6C63FF]/5 scale-[0.98]' 
              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <div className={`
              mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300
              ${isDragging ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-white/40'}
            `}>
              <UploadCloud className={`h-7 w-7 ${isDragging ? 'animate-bounce' : ''}`} />
            </div>
            
            <p className="text-sm font-bold text-white/80 transition-colors group-hover:text-white">
              {isDragging ? 'Drop it here!' : 'Click or drag image'}
            </p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
              PNG, JPG, WEBP (MAX 10MB)
            </p>
          </div>

          {/* Decorative corners */}
          <div className="absolute left-4 top-4 h-3 w-3 border-l-2 border-t-2 border-white/10 transition-colors group-hover:border-[#6C63FF]/30" />
          <div className="absolute right-4 top-4 h-3 w-3 border-r-2 border-t-2 border-white/10 transition-colors group-hover:border-[#6C63FF]/30" />
          <div className="absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 border-white/10 transition-colors group-hover:border-[#6C63FF]/30" />
          <div className="absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 border-white/10 transition-colors group-hover:border-[#6C63FF]/30" />
        </div>
      </div>

      <div className="flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
          <ImageIcon className="h-4 w-4 text-white/30" />
        </div>
        <p className="text-[11px] leading-relaxed text-white/40">
          Your files are processed in-browser. <span className="text-white/60">No data leaves your device.</span>
        </p>
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
