<div align="center">

<h1>mpng</h1>

<p><strong>AI-powered image and video editing in the browser</strong></p>

<p>
  <a href="https://github.com/anointedthedeveloper/mpng/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  </a>
  <a href="https://github.com/anointedthedeveloper/mpng/stargazers">
    <img src="https://img.shields.io/github/stars/anointedthedeveloper/mpng?style=social" alt="GitHub Stars" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/FFmpeg-media-red?logo=ffmpeg" alt="FFmpeg" />
  <img src="https://img.shields.io/badge/AWS-S3-orange?logo=amazon-aws" alt="AWS S3" />
</p>

<p>
  <a href="https://mpng.vercel.app">Live Demo</a> ·
  <a href="https://github.com/anointedthedeveloper/mpng/issues">Report Bug</a> ·
  <a href="https://github.com/anointedthedeveloper/mpng/issues">Request Feature</a>
</p>

</div>

---

mpng is an AI-powered image and video editing platform that runs entirely in the browser. It combines real-time canvas previews with server-side AI processing — background removal, object detection, smart cropping, and video trimming — built on modern web technologies and scalable cloud infrastructure.

## Features

- **Background Removal** — One-click AI-powered background removal via `rembg`
- **Canvas Editing** — Filters (brightness, contrast, saturation), crop, resize with Konva.js
- **AI Capabilities** — Object detection, face detection, smart cropping
- **Video Editing** — Trim, merge, export in multiple formats via FFmpeg
- **Real-time Preview** — Instant feedback with undo/redo and export quality control

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Konva.js |
| Backend | Node.js, Express, BullMQ, Redis |
| AI Service | Python, FastAPI, rembg, OpenCV |
| Media | FFmpeg |
| Storage | AWS S3 |

## Architecture

```
Client (Next.js)
   ↓
API Layer (Node.js / Express)
   ↓
Job Queue (Redis / BullMQ)
   ↓
AI Service (FastAPI + rembg) + Media Service (FFmpeg)
   ↓
Storage (AWS S3)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- FFmpeg
- Redis

### Clone

```bash
git clone https://github.com/anointedthedeveloper/mpng.git
cd mpng
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

### API

```bash
cd apps/api
cp .env.example .env   # fill in your values
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

### Docker (all services)

```bash
cd infra/docker
docker compose up
```

## Project Structure

```
mpng/
├── apps/
│   ├── web/           # Next.js frontend
│   └── api/           # Node.js backend
├── services/
│   ├── ai-service/    # FastAPI + rembg
│   └── media-service/ # FFmpeg processing
├── packages/
│   ├── ui/            # Shared components
│   └── utils/         # Shared helpers
└── infra/
    ├── docker/        # Docker Compose
    └── aws/           # Deployment configs
```

## Roadmap

- [x] Project scaffold
- [ ] Image upload + background removal (MVP)
- [ ] Filters and canvas editing
- [ ] Video trimming (FFmpeg)
- [ ] AI detection features
- [ ] Real-time collaboration

## Contributing

Contributions are welcome. Open an issue or submit a pull request.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a PR

## License

MIT License — see [LICENSE](LICENSE) for details.

## Author

Built by **[Anointed the Developer](https://github.com/anointedthedeveloper)**
