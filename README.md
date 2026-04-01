# mpng

AI-powered image and video editor built for the web.

mpng is a modern browser-based media editing platform that combines real-time UI interactions with powerful backend AI processing. It allows users to edit images and videos efficiently using intelligent automation and scalable infrastructure.

## Features

- **Image Editing** — Background removal, filters, resize, crop
- **AI Capabilities** — Object detection, face detection, smart cropping
- **Video Editing** — Trim, merge, export in multiple formats
- **UX** — Real-time preview, undo/redo, export quality control

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind, Zustand, Konva.js |
| Backend | Node.js, Express, BullMQ, Redis |
| AI Service | Python, FastAPI, rembg, OpenCV |
| Media | FFmpeg |
| Storage | AWS S3 |

## Architecture

```
Client (Next.js)
   ↓
API Layer (Node.js)
   ↓
Job Queue (Redis / BullMQ)
   ↓
AI Service (FastAPI) + Media Service (FFmpeg)
   ↓
Storage (AWS S3)
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- FFmpeg
- Redis

### Frontend
```bash
cd apps/web
npm install
npm run dev
```

### API
```bash
cd apps/api
npm install
npm run dev
```

### AI Service
```bash
cd services/ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### Media Service
```bash
cd services/media-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Project Structure

```
mpng/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Node.js backend
├── services/
│   ├── ai-service/   # FastAPI + rembg
│   └── media-service/# FFmpeg processing
├── packages/
│   ├── ui/           # Shared components
│   └── utils/        # Shared helpers
└── infra/
    ├── docker/
    └── aws/
```

## Roadmap

- [x] Project scaffold
- [ ] Image upload + background removal (MVP)
- [ ] Filters and canvas editing
- [ ] Video trimming (FFmpeg)
- [ ] AI detection features

## License

MIT — Built by Anointed the Developer
