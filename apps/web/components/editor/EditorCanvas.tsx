'use client'
import dynamic from 'next/dynamic'

const EditorCanvasClient = dynamic(() => import('./EditorCanvasClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#6C63FF]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6C63FF] animate-spin" />
        </div>
        <p className="text-xs text-white/30 tracking-widest uppercase">Loading canvas</p>
      </div>
    </div>
  ),
})

export default function EditorCanvas() {
  return <EditorCanvasClient />
}
