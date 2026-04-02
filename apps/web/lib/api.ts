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

// Blur background: uses remove.bg mask to isolate subject, blurs original behind it
export async function blurBackground(originalSrc: string, blurAmount: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // Step 1: get the remove.bg masked version (subject only, transparent bg)
    fetch(originalSrc)
      .then(r => r.blob())
      .then(async (blob) => {
        const maskedUrl = await removeBackground(new File([blob], 'image.png', { type: 'image/png' }))

        const original = new window.Image()
        const masked = new window.Image()
        let loaded = 0

        const onLoad = () => {
          loaded++
          if (loaded < 2) return

          const w = original.naturalWidth
          const h = original.naturalHeight
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')!

          // Layer 1: blurred original as background
          ctx.filter = `blur(${blurAmount}px)`
          ctx.drawImage(original, 0, 0, w, h)
          ctx.filter = 'none'

          // Layer 2: sharp subject on top
          ctx.drawImage(masked, 0, 0, w, h)

          canvas.toBlob((b) => {
            if (!b) return reject(new Error('Blur failed'))
            resolve(URL.createObjectURL(b))
          }, 'image/png')
        }

        original.onload = onLoad
        original.onerror = () => reject(new Error('Failed to load original'))
        original.src = originalSrc

        masked.onload = onLoad
        masked.onerror = () => reject(new Error('Failed to load masked image'))
        masked.src = maskedUrl
      })
      .catch(reject)
  })
}

// Add solid or gradient color background behind subject
export async function addColorBackground(
  originalSrc: string,
  color: string,
  gradientTo?: string,
  direction = '135deg'
): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(originalSrc)
      .then(r => r.blob())
      .then(async (blob) => {
        const maskedUrl = await removeBackground(new File([blob], 'image.png', { type: 'image/png' }))
        const masked = new window.Image()
        masked.onload = () => {
          const w = masked.naturalWidth
          const h = masked.naturalHeight
          const canvas = document.createElement('canvas')
          canvas.width = w; canvas.height = h
          const ctx = canvas.getContext('2d')!

          if (gradientTo) {
            // Parse direction angle to gradient coords
            const angle = parseFloat(direction) * (Math.PI / 180)
            const x1 = w / 2 - Math.cos(angle) * w / 2
            const y1 = h / 2 - Math.sin(angle) * h / 2
            const x2 = w / 2 + Math.cos(angle) * w / 2
            const y2 = h / 2 + Math.sin(angle) * h / 2
            const grad = ctx.createLinearGradient(x1, y1, x2, y2)
            grad.addColorStop(0, color)
            grad.addColorStop(1, gradientTo)
            ctx.fillStyle = grad
          } else {
            ctx.fillStyle = color
          }
          ctx.fillRect(0, 0, w, h)
          ctx.drawImage(masked, 0, 0, w, h)

          canvas.toBlob(b => {
            if (!b) return reject(new Error('Color background failed'))
            resolve(URL.createObjectURL(b))
          }, 'image/png')
        }
        masked.onerror = () => reject(new Error('Failed to load masked image'))
        masked.src = maskedUrl
      })
      .catch(reject)
  })
}

export async function upscaleImage(src: string, scale: 2 | 4): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
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
