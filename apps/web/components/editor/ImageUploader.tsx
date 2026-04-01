'use client'
import { useRef } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { uploadImage } from '@/lib/api'

export default function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { setImage } = useEditorStore()

  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file)
    setImage(url)
    // Optionally upload to S3 via API
    // await uploadImage(file)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full py-2 px-4 bg-brand rounded-lg text-sm font-semibold hover:opacity-90 transition"
      >
        Upload Image
      </button>
    </div>
  )
}
