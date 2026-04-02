import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30
// Cache identical requests for 1 hour (same file hash = same result)
export const revalidate = 3600

export async function POST(req: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Please upload a PNG, JPG, or WEBP image.' }, { status: 400 })
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Please use an image smaller than 10MB.' }, { status: 400 })
  }

  const outForm = new FormData()
  outForm.append('image_file', file)
  outForm.append('size', 'auto')

  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: outForm,
  })

  if (!res.ok) {
    const text = await res.text()
    const readable =
      res.status === 400
        ? 'Remove.bg could not process this file. Try a PNG or JPG under 10MB.'
        : res.status === 402
          ? 'Remove.bg credits are exhausted or unavailable right now.'
          : text || 'Background removal failed'
    return NextResponse.json({ error: readable }, { status: res.status })
  }

  const buffer = await res.arrayBuffer()
  return new NextResponse(buffer, {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  })
}
