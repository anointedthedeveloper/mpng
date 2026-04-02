// Run: node generate-icons.js
const { createCanvas } = require('canvas')
const fs = require('fs')

function generate(size, outPath) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const r = size * 0.22
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(size - r, 0)
  ctx.quadraticCurveTo(size, 0, size, r)
  ctx.lineTo(size, size - r)
  ctx.quadraticCurveTo(size, size, size - r, size)
  ctx.lineTo(r, size)
  ctx.quadraticCurveTo(0, size, 0, size - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fillStyle = '#0a0a14'
  ctx.fill()
  ctx.font = `bold ${size * 0.32}px system-ui`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('mp', size * 0.35, size * 0.52)
  ctx.fillStyle = '#6C63FF'
  ctx.fillText('ng', size * 0.72, size * 0.52)
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'))
  console.log('Generated', outPath)
}

try {
  generate(192, 'public/icon-192.png')
  generate(512, 'public/icon-512.png')
} catch(e) {
  console.log('canvas package not available, skipping PNG generation')
}
