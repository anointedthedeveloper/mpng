'use client'
import { useEditorStore } from '@/store/editorStore'

export default function VideoPlayer() {
  const { video } = useEditorStore()
  if (!video) return null
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
      <video
        src={video}
        controls
        className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-black/40 bg-black"
        style={{ maxHeight: '70vh' }}
      />
      <p className="text-[11px] text-white/25">Use the trim controls in the sidebar</p>
    </div>
  )
}
