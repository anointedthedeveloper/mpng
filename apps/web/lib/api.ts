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
      // Draw original to canvas to get pixels
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const { data } = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

      // Send to worker — zero-copy transfer
      const worker = new Worker('/upscale.worker.js')
      const buf = new Uint8ClampedArray(data).buffer
      worker.postMessage({ pixels: buf, w: img.naturalWidth, h: img.naturalHeight, scale }, [buf])

      worker.onmessage = (e) => {
        const { pixels, w, h } = e.data
        const out = document.createElement('canvas')
        out.width = w; out.height = h
        out.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(pixels), w, h), 0, 0)
        out.toBlob(blob => {
          if (!blob) return reject(new Error('Upscale failed'))
          resolve(URL.createObjectURL(blob))
          worker.terminate()
        }, 'image/png')
      }
      worker.onerror = (err) => { reject(err); worker.terminate() }
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}
