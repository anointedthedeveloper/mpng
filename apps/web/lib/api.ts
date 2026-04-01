import axios from 'axios'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001' })

export async function removeBackground(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<{ url: string }>('/api/image/remove-bg', form)
  return data.url
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<{ url: string }>('/api/image/upload', form)
  return data.url
}
