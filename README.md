# Image Transformer

Remove backgrounds and flip images in seconds. Upload an image, get back a processed PNG with a transparent background, horizontally flipped, stored on Cloudinary.

## Stack

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript + Vite
- **Image processing**: remove.bg API → sharp (flip)
- **Storage**: Cloudinary

## Setup

### Prerequisites

- Node.js v18+
- A [remove.bg](https://www.remove.bg/api) API key
- A [Cloudinary](https://cloudinary.com) account

### Backend

```bash
cd backend
cp .env.example .env   # fill in all values
npm install
npm run dev            # runs on http://localhost:3001
```

**Environment variables** (`backend/.env`):

| Variable | Description |
|---|---|
| `REMOVE_BG_API_KEY` | remove.bg API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FRONTEND_URL` | Frontend origin for CORS (default: `http://localhost:5173`) |
| `PORT` | Server port (default: `3001`) |

### Frontend

```bash
cd frontend
cp .env.example .env.local   # fill in values
npm install
npm run dev                  # runs on http://localhost:5173
```

**Environment variables** (`frontend/.env.local`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (default: `http://localhost:3001`) |

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/upload` | Upload and process an image (multipart `image` field) |
| `DELETE` | `/api/images/:publicId` | Delete a stored image from Cloudinary |

