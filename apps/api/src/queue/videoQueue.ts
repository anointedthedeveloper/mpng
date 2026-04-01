import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import axios from 'axios'
import FormData from 'form-data'

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: null })

export const videoQueue = new Queue('video', { connection })

new Worker(
  'video',
  async (job) => {
    const { buffer, filename, start, end } = job.data
    const form = new FormData()
    form.append('file', Buffer.from(buffer, 'base64'), { filename, contentType: 'video/mp4' })
    form.append('start', String(start))
    form.append('end', String(end))

    const { data } = await axios.post<{ url: string }>(
      `${process.env.MEDIA_SERVICE_URL ?? 'http://localhost:8001'}/trim`,
      form,
      { headers: form.getHeaders() }
    )
    return data.url
  },
  { connection }
)
