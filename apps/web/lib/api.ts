export async function removeBackground(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/remove-bg', { method: 'POST', body: form })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error ?? 'Background removal failed')
  }
  return URL.createObjectURL(await res.blob())
}

export async function upscaleImage(src: string, scale: 2 | 4): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const targetW = img.naturalWidth * scale
      const targetH = img.naturalHeight * scale

      // Stepped upscaling: double size in passes to preserve sharpness
      const steps = scale === 4 ? 2 : 1
      let currentCanvas = document.createElement('canvas')
      let currentCtx = currentCanvas.getContext('2d')!
      currentCanvas.width = img.naturalWidth
      currentCanvas.height = img.naturalHeight
      currentCtx.drawImage(img, 0, 0)

      for (let i = 0; i < steps; i++) {
        const nextCanvas = document.createElement('canvas')
        nextCanvas.width = currentCanvas.width * 2
        nextCanvas.height = currentCanvas.height * 2
        const nextCtx = nextCanvas.getContext('2d')!
        nextCtx.imageSmoothingEnabled = true
        nextCtx.imageSmoothingQuality = 'high'
        nextCtx.drawImage(currentCanvas, 0, 0, nextCanvas.width, nextCanvas.height)

        // Unsharp mask: draw blurred copy subtracted from original to sharpen edges
        const blurCanvas = document.createElement('canvas')
        blurCanvas.width = nextCanvas.width
        blurCanvas.height = nextCanvas.height
        const blurCtx = blurCanvas.getContext('2d')!
        blurCtx.filter = 'blur(1px)'
        blurCtx.drawImage(nextCanvas, 0, 0)
        blurCtx.filter = 'none'

        // Overlay sharpened result: original + (original - blur) * strength
        nextCtx.globalCompositeOperation = 'overlay'
        nextCtx.globalAlpha = 0.25
        nextCtx.drawImage(nextCanvas, 0, 0)
        nextCtx.globalCompositeOperation = 'source-over'
        nextCtx.globalAlpha = 1

        currentCanvas = nextCanvas
      }

      currentCanvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Upscale failed'))
        resolve(URL.createObjectURL(blob))
      }, 'image/png')
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}
