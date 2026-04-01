import { Router } from 'express'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data'
import { uploadToS3 } from '../middleware/s3'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' })
  const url = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype)
  res.json({ url })
})

router.post('/remove-bg', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' })

  const form = new FormData()
  form.append('file', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype })

  const { data } = await axios.post<Buffer>(
    `${process.env.AI_SERVICE_URL ?? 'http://localhost:8000'}/remove-bg`,
    form,
    { headers: form.getHeaders(), responseType: 'arraybuffer' }
  )

  const url = await uploadToS3(Buffer.from(data), `rmbg-${req.file.originalname}`, 'image/png')
  res.json({ url })
})

export default router
