'use client'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'
import { useEditorStore } from '@/store/editorStore'

function CanvasImage({ src, filters }: { src: string; filters: { brightness: number; contrast: number } }) {
  const [image] = useImage(src, 'anonymous')
  return (
    <KonvaImage
      image={image}
      width={600}
      height={450}
      filters={[]}
    />
  )
}

export default function EditorCanvas() {
  const { image, processedImage, filters } = useEditorStore()
  const src = processedImage ?? image!

  return (
    <Stage width={600} height={450} className="rounded-xl overflow-hidden shadow-2xl">
      <Layer>
        <CanvasImage src={src} filters={filters} />
      </Layer>
    </Stage>
  )
}
