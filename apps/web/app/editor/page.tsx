'use client'
import ImageUploader from '@/components/editor/ImageUploader'
import EditorCanvas from '@/components/editor/EditorCanvas'
import Toolbar from '@/components/editor/Toolbar'
import { useEditorStore } from '@/store/editorStore'
import Link from 'next/link'

export default function EditorPage() {
  const { image, processedImage } = useEditorStore()

  return (
    <main className="mpng-shell min-h-screen px-4 py-4 sm:px-5">
      <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 lg:grid-cols-[22rem_1fr]">
        <aside className="flex flex-col border-b border-white/10 bg-white/[0.04] lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6C63FF] text-sm font-bold text-white shadow-lg shadow-[#6C63FF]/30">
                mp
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight">
                  mp<span className="text-[#8c84ff]">ng</span>
                </p>
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">editor</p>
              </div>
            </Link>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/50">
              Browser only
            </span>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <section className="mpng-card">
              <p className="mpng-label">Workspace</p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Drop in an image, remove the background, and fine-tune the result with quick
                adjustments.
              </p>
            </section>

            <section className="mpng-card">
              <ImageUploader />
            </section>

            {image && (
              <section className="mpng-card">
                <Toolbar />
              </section>
            )}
          </div>

          <footer className="border-t border-white/10 px-5 py-4 text-xs text-white/45">
            Built by{' '}
            <a
              href="https://github.com/anointedthedeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 transition hover:text-white"
            >
              anointedthedeveloper
            </a>
          </footer>
        </aside>

        <section className="flex min-h-[60vh] flex-col justify-center gap-6 p-5 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mpng-label">Canvas</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {image ? 'Refine your edit' : 'Upload to begin'}
              </h1>
            </div>

            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 md:block">
              {processedImage ? 'Processed image ready' : 'Original image loaded'}
            </div>
          </div>

          <div className="mpng-card flex min-h-[520px] items-center justify-center p-4 sm:p-6 lg:p-8">
            {image ? (
              <EditorCanvas />
            ) : (
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/5 text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
                  Image
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">Start with a source image</h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Use the upload panel to bring in a PNG, JPG, or WEBP file. The canvas will
                  update here as soon as you drop one in.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
