'use client'
import ImageUploader from '@/components/editor/ImageUploader'
import EditorCanvas from '@/components/editor/EditorCanvas'
import Toolbar from '@/components/editor/Toolbar'
import { useEditorStore } from '@/store/editorStore'
import Link from 'next/link'

export default function EditorPage() {
  const { image, processedImage } = useEditorStore()

  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <div className="grid min-h-screen lg:grid-cols-[22rem_1fr]">

        {/* Sidebar */}
        <aside className="flex flex-col border-r border-white/8 bg-[#0a0a14]">
          <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6C63FF] flex items-center justify-center text-xs font-bold shadow-lg shadow-[#6C63FF]/30">
                mp
              </div>
              <div>
                <p className="text-base font-bold tracking-tight">
                  mp<span className="text-[#8c84ff]">ng</span>
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  <p className="text-[10px] uppercase tracking-widest text-white/30">Editor</p>
                </div>
              </div>
            </Link>
            <Link
              href="/"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            <div className="rounded-2xl border border-[#6C63FF]/20 bg-[#6C63FF]/5 p-4">
              <p className="text-xs text-white/60 leading-relaxed">
                Drop in an image to start. Use AI tools to remove backgrounds or refine the canvas.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/30 px-1">Asset</p>
              <ImageUploader />
            </div>

            {image && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/30 px-1">Adjustments</p>
                <Toolbar />
              </div>
            )}
          </div>

          <div className="border-t border-white/8 px-5 py-4 flex items-center justify-between">
            <a
              href="https://github.com/anointedthedeveloper/mpng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white transition"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Open Source
            </a>
            <span className="text-[10px] text-white/20">v1.0</span>
          </div>
        </aside>

        {/* Canvas area */}
        <section className="flex flex-col bg-[#060810]">
          <header className="flex items-center justify-between border-b border-white/8 px-8 py-5">
            <div>
              <h1 className="text-base font-bold text-white">
                {image ? 'Active Session' : 'Ready to Start'}
              </h1>
              <p className="text-xs text-white/30 mt-0.5">
                {image ? 'Precision editing canvas' : 'Upload an image to unlock tools'}
              </p>
            </div>
            {image && (
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[11px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {processedImage ? 'AI Enhanced' : 'Source Loaded'}
              </div>
            )}
          </header>

          <div className="flex-1 flex items-center justify-center p-8">
            {image ? (
              <EditorCanvas />
            ) : (
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white">Your canvas awaits</h2>
                <p className="text-sm text-white/40 mt-2 max-w-xs mx-auto leading-relaxed">
                  Upload an image from the sidebar to begin editing
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
