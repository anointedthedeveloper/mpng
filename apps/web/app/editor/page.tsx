'use client'
import ImageUploader from '@/components/editor/ImageUploader'
import EditorCanvas from '@/components/editor/EditorCanvas'
import Toolbar from '@/components/editor/Toolbar'
import { useEditorStore } from '@/store/editorStore'
import Link from 'next/link'

export default function EditorPage() {
  const { image } = useEditorStore()

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-gray-800 flex flex-col bg-gray-950">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tight">
            mp<span className="text-[#6C63FF]">ng</span>
          </Link>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">editor</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
          <ImageUploader />
          {image && <Toolbar />}
        </div>

        <div className="px-4 py-3 border-t border-gray-800 text-[11px] text-gray-600">
          Built by{' '}
          <a
            href="https://github.com/anointedthedeveloper"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition"
          >
            anointedthedeveloper
          </a>
        </div>
      </aside>

      {/* Canvas area */}
      <main className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] p-8 gap-4">
        {image ? (
          <EditorCanvas />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-3xl">
              🖼️
            </div>
            <p className="text-gray-500 text-sm">Upload an image to get started</p>
          </div>
        )}
      </main>
    </div>
  )
}
