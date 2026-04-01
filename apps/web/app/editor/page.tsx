'use client'
import ImageUploader from '@/components/editor/ImageUploader'
import EditorCanvas from '@/components/editor/EditorCanvas'
import Toolbar from '@/components/editor/Toolbar'
import { useEditorStore } from '@/store/editorStore'
import Link from 'next/link'
import { 
  ChevronLeft, 
  Settings2, 
  Image as ImageIcon, 
  Monitor, 
  Info,
  Layers,
  Sparkles,
  Github
} from 'lucide-react'

export default function EditorPage() {
  const { image, processedImage } = useEditorStore()

  return (
    <main className="mpng-shell min-h-screen px-4 py-4 sm:px-6">
      <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0C1B]/80 backdrop-blur-3xl shadow-2xl shadow-black/60 lg:grid-cols-[24rem_1fr]">
        
        {/* Sidebar */}
        <aside className="flex flex-col border-b border-white/10 bg-white/[0.02] lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <Link href="/" className="group flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6C63FF] text-xs font-bold text-white shadow-lg shadow-[#6C63FF]/30 transition-transform group-hover:scale-105">
                mp
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  mp<span className="text-[#8c84ff]">ng</span>
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">Studio Editor</p>
                </div>
              </div>
            </Link>
            
            <Link href="/" className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white">
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <section className="mpng-card group relative overflow-hidden bg-gradient-to-br from-[#6C63FF]/10 to-transparent border-[#6C63FF]/20">
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-4 w-4 text-[#8c84ff]" />
                <p className="mpng-label !text-[#8c84ff]">Workspace Guide</p>
              </div>
              <p className="text-sm leading-relaxed text-white/70">
                Drop in an image to start. Use the AI tools to remove backgrounds or refine the canvas.
              </p>
              <Sparkles className="absolute -bottom-2 -right-2 h-12 w-12 text-[#6C63FF]/10" />
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                <ImageIcon className="h-4 w-4 text-white/40" />
                <p className="mpng-label">Asset Manager</p>
              </div>
              <div className="mpng-card !p-0 overflow-hidden border-dashed border-white/10 bg-white/[0.01]">
                <ImageUploader />
              </div>
            </section>

            {image && (
              <section className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <Settings2 className="h-4 w-4 text-white/40" />
                  <p className="mpng-label">Adjustments</p>
                </div>
                <div className="mpng-card bg-white/[0.03]">
                  <Toolbar />
                </div>
              </section>
            )}
          </div>

          <footer className="mt-auto border-t border-white/10 px-6 py-5">
            <div className="flex items-center justify-between">
              <a
                href="https://github.com/anointedthedeveloper/mpng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] font-medium text-white/40 transition hover:text-white"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Open Source</span>
              </a>
              <p className="text-[11px] text-white/25">v1.0.2-stable</p>
            </div>
          </footer>
        </aside>

        {/* Canvas Area */}
        <section className="flex flex-col bg-[#060816]/50">
          <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">
            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#8c84ff]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {image ? 'Active Session' : 'Ready to Start'}
                </h1>
                <p className="mt-0.5 text-xs text-white/40">
                  {image ? 'Precision editing canvas' : 'Upload an image to unlock tools'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {image && (
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  {processedImage ? 'AI Enhanced' : 'Source Loaded'}
                </div>
              )}
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/40">
                <Monitor className="h-3.5 w-3.5" />
                Web View
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 sm:p-8 lg:p-10">
            <div className="relative h-full w-full rounded-[2rem] border border-white/10 bg-[#0d0f1f] shadow-inner shadow-black/40 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.05),transparent_70%)]" />
              
              <div className="relative flex h-full w-full items-center justify-center p-4">
                {image ? (
                  <EditorCanvas />
                ) : (
                  <div className="max-w-md text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 text-[#6C63FF] shadow-2xl shadow-black/20">
                      <ImageIcon className="h-10 w-10 opacity-50" />
                    </div>
                    <h2 className="mt-8 text-2xl font-bold text-white">Your canvas awaits</h2>
                    <p className="mt-4 text-base leading-relaxed text-white/50">
                      Drag and drop your media into the sidebar to start your next masterpiece. 
                      Support for PNG, JPG, and WEBP.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
