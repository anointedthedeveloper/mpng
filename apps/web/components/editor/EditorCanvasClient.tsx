'use client'
import { useEffect, useState } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import { useEditorStore } from '@/store/editorStore'

function useLoadedImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => setImage(img)

    return () => {
      img.onload = null
    }
  }, [src])

  return image
}

const CANVAS_W = 720
const CANVAS_H = 480

export default function EditorCanvasClient() {
  const { image, processedImage } = useEditorStore()
  const src = processedImage ?? image!
  const loaded = useLoadedImage(src)

  const scale = loaded
    ? Math.min(CANVAS_W / loaded.naturalWidth, CANVAS_H / loaded.naturalHeight, 1)
    : 1
  const w = loaded ? loaded.naturalWidth * scale : CANVAS_W
  const h = loaded ? loaded.naturalHeight * scale : CANVAS_H
  const x = (CANVAS_W - w) / 2
  const y = (CANVAS_H - h) / 2

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090b14] shadow-2xl shadow-black/40 checkerboard">
      <Stage width={CANVAS_W} height={CANVAS_H}>
        <Layer>
          {loaded && (
            <KonvaImage image={loaded} x={x} y={y} width={w} height={h} />
          )}
        </Layer>
      </Stage>
    </div>
  )
}
