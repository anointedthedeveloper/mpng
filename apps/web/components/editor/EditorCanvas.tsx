'use client'
import dynamic from 'next/dynamic'

const EditorCanvasClient = dynamic(() => import('./EditorCanvasClient'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative checkerboard rounded-2xl border border-white/10 overflow-hidden"
        style={{ width: 860, height: 520 }}
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_1.5s_infinite]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-[#6C63FF]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6C63FF] animate-spin" />
          </div>
          <p className="text-xs text-white/30 tracking-widest uppercase">Preparing canvas</p>
        </div>
      </div>
      <div className="w-32 h-8 rounded-xl bg-white/5 animate-pulse" />
    </div>
  ),
})

export default function EditorCanvas() {
  return <EditorCanvasClient />
}
