import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import imageRouter from './routes/image'
import videoRouter from './routes/video'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

app.use('/api/image', imageRouter)
app.use('/api/video', videoRouter)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
