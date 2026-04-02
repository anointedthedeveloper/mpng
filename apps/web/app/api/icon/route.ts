import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const size = req.nextUrl.searchParams.get('size') ?? '192'
  const s = Number(size)
  const r = Math.round(s * 0.22)
  const fs = Math.round(s * 0.28)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${r}" fill="#0a0a14"/>
  <text x="${s * 0.28}" y="${s * 0.62}" font-family="system-ui,sans-serif" font-size="${fs}" font-weight="800" fill="white">mp</text>
  <text x="${s * 0.62}" y="${s * 0.62}" font-family="system-ui,sans-serif" font-size="${fs}" font-weight="800" fill="#6C63FF">ng</text>
</svg>`
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=604800, immutable',
    },
  })
}
