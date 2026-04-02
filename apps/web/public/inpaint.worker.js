// Web Worker: patch-based inpainting — runs off main thread so UI never freezes
self.onmessage = (e) => {
  const { imgPixels, maskPixels, W, H, sw, sh } = e.data

  // Build small-res mask
  const sMasked = new Uint8Array(sw * sh)
  for (let i = 0; i < sw * sh; i++) {
    if (maskPixels[i * 4 + 3] > 40 && maskPixels[i * 4] > 80) sMasked[i] = 1
  }

  const spx = new Uint8ClampedArray(imgPixels)
  const filled = new Uint8Array(sw * sh)

  const PATCH = 5
  const SEARCH_R = 60
  const CANDIDATES = 80

  let totalPasses = 12
  for (let pass = 0; pass < totalPasses; pass++) {
    let changed = false
    for (let y = PATCH; y < sh - PATCH; y++) {
      for (let x = PATCH; x < sw - PATCH; x++) {
        const i = y * sw + x
        if (!sMasked[i] || filled[i]) continue

        let hasKnown = false
        for (let dy = -1; dy <= 1 && !hasKnown; dy++)
          for (let dx = -1; dx <= 1 && !hasKnown; dx++) {
            const ni = (y + dy) * sw + (x + dx)
            if (!sMasked[ni] || filled[ni]) hasKnown = true
          }
        if (!hasKnown) continue

        let bestDist = Infinity, bsx = -1, bsy = -1

        for (let c = 0; c < CANDIDATES; c++) {
          const angle = Math.random() * Math.PI * 2
          const d = PATCH * 2 + Math.random() * SEARCH_R
          const sx = Math.round(x + Math.cos(angle) * d)
          const sy = Math.round(y + Math.sin(angle) * d)
          if (sx < PATCH || sy < PATCH || sx >= sw - PATCH || sy >= sh - PATCH) continue

          let bad = false
          for (let dy = -PATCH; dy <= PATCH && !bad; dy++)
            for (let dx = -PATCH; dx <= PATCH && !bad; dx++) {
              const ni = (sy + dy) * sw + (sx + dx)
              if (sMasked[ni] && !filled[ni]) bad = true
            }
          if (bad) continue

          let dist = 0, n = 0
          for (let dy = -PATCH; dy <= PATCH; dy++) {
            for (let dx = -PATCH; dx <= PATCH; dx++) {
              const ti = (y + dy) * sw + (x + dx)
              if (sMasked[ti] && !filled[ti]) continue
              const si = (sy + dy) * sw + (sx + dx)
              const dr = spx[ti*4]   - spx[si*4]
              const dg = spx[ti*4+1] - spx[si*4+1]
              const db = spx[ti*4+2] - spx[si*4+2]
              dist += dr*dr + dg*dg + db*db; n++
            }
          }
          if (n === 0) continue
          const avg = dist / n
          if (avg < bestDist) { bestDist = avg; bsx = sx; bsy = sy }
        }

        if (bsx < 0) continue
        const si = bsy * sw + bsx
        spx[i*4]   = spx[si*4]
        spx[i*4+1] = spx[si*4+1]
        spx[i*4+2] = spx[si*4+2]
        filled[i] = 1; changed = true
      }
    }

    // Report progress back to main thread
    self.postMessage({ type: 'progress', pass: pass + 1, total: totalPasses })
    if (!changed) break
  }

  self.postMessage({ type: 'done', pixels: spx.buffer }, [spx.buffer])
}
