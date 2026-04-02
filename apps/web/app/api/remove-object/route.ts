import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const AI_SERVICE_URL = process.env.AI_SERVICE_URL ?? 'http://localhost:8000'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  const mask = form.get('mask') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }
  if (!mask) {
    return NextResponse.json({ error: 'No mask provided' }, { status: 400 })
  }

  const outForm = new FormData()
  outForm.append('file', file)
  outForm.append('mask', mask)

  const res = await fetch(`${AI_SERVICE_URL}/remove-object`, {
    method: 'POST',
    body: outForm,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return NextResponse.json(
      {
        error:
          res.status === 400
            ? 'The AI object remover could not read the mask. Try painting a larger area.'
            : detail || 'Object removal failed',
      },
      { status: res.status }
    )
  }

  return new NextResponse(await res.arrayBuffer(), {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  })
}
