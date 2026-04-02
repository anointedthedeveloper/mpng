// Upscale worker — runs off main thread
self.onmessage = (e) => {
  const { pixels, w, h, scale } = e.data
  const tw = w * scale, th = h * scale

  // Stepped upscaling for quality
  const steps = scale === 4 ? 2 : 1
  let src = new Uint8ClampedArray(pixels)
  let sw = w, sh = h

  for (let s = 0; s < steps; s++) {
    const dw = sw * 2, dh = sh * 2
    const dst = new Uint8ClampedArray(dw * dh * 4)

    // Bilinear interpolation
    for (let y = 0; y < dh; y++) {
      for (let x = 0; x < dw; x++) {
        const sx = (x / dw) * sw
        const sy = (y / dh) * sh
        const x0 = Math.floor(sx), y0 = Math.floor(sy)
        const x1 = Math.min(x0 + 1, sw - 1), y1 = Math.min(y0 + 1, sh - 1)
        const fx = sx - x0, fy = sy - y0

        const i00 = (y0 * sw + x0) * 4
        const i10 = (y0 * sw + x1) * 4
        const i01 = (y1 * sw + x0) * 4
        const i11 = (y1 * sw + x1) * 4
        const di = (y * dw + x) * 4

        for (let c = 0; c < 4; c++) {
          dst[di+c] = Math.round(
            src[i00+c] * (1-fx) * (1-fy) +
            src[i10+c] * fx     * (1-fy) +
            src[i01+c] * (1-fx) * fy     +
            src[i11+c] * fx     * fy
          )
        }
      }
    }

    src = dst; sw = dw; sh = dh
  }

  self.postMessage({ pixels: src.buffer, w: sw, h: sh }, [src.buffer])
}
