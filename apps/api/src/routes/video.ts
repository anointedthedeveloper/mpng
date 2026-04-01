import { Router } from 'express'
import multer from 'multer'
import { videoQueue } from '../queue/videoQueue'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/trim', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' })
  const { start, end } = req.body

  const job = await videoQueue.add('trim', {
    buffer: req.file.buffer.toString('base64'),
    filename: req.file.originalname,
    start: Number(start),
    end: Number(end),
  })

  res.json({ jobId: job.id })
})

router.get('/job/:id', async (req, res) => {
  const job = await videoQueue.getJob(req.params.id)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  const state = await job.getState()
  res.json({ state, result: job.returnvalue })
})

export default router
