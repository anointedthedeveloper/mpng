export async function removeBackground(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch('/api/remove-bg', { method: 'POST', body: form })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error ?? 'Background removal failed')
  }

  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
