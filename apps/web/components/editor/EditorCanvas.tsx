'use client'
import dynamic from 'next/dynamic'

const EditorCanvasClient = dynamic(() => import('./EditorCanvasClient'), {
  ssr: false,
  loading: () => (
    <div className="checkerboard flex items-center justify-center rounded-2xl border border-white/10"
      style={{ width: 720, height: 480 }}>
      <span className="text-sm text-white/30">Loading canvas…</span>
    </div>
  ),
})

export default function EditorCanvas() {
  return <EditorCanvasClient />
}
