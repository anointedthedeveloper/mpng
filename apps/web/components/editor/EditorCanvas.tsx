'use client'
import dynamic from 'next/dynamic'

const EditorCanvasClient = dynamic(() => import('./EditorCanvasClient'), {
  ssr: false,
  loading: () => (
    <div className="mpng-card checkerboard flex min-h-[480px] min-w-[720px] items-center justify-center text-sm text-white/55">
      Loading canvas...
    </div>
  ),
})

export default function EditorCanvas() {
  return <EditorCanvasClient />
}
