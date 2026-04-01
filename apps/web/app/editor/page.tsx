'use client'
import ImageUploader from '@/components/editor/ImageUploader'
import EditorCanvas from '@/components/editor/EditorCanvas'
import Toolbar from '@/components/editor/Toolbar'
import { useEditorStore } from '@/store/editorStore'

export default function EditorPage() {
  const { image } = useEditorStore()

  return (
    <div className="flex h-screen bg-gray-950">
      <aside className="w-64 border-r border-gray-800 p-4 flex flex-col gap-4">
        <h2 className="text-lg font-bold">mpng</h2>
        <ImageUploader />
        {image && <Toolbar />}
      </aside>
      <main className="flex-1 flex items-center justify-center">
        {image ? (
          <EditorCanvas />
        ) : (
          <p className="text-gray-600">Upload an image to get started</p>
        )}
      </main>
    </div>
  )
}
