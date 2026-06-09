# Image Transformation Service

## Stack
- Backend: Node.js + TypeScript (Express)
- Frontend: React + TypeScript
- Image processing: remove.bg API → sharp or other existing library (flip) → Vercel (hosting)

## Architecture
- /backend: Express API (upload, process, delete endpoints)
- /frontend: React app (upload UI, result display)

## Rules
- Always use strict TypeScript types/interfaces
- Never hardcode API keys — use .env
- Handle errors gracefully with proper HTTP status codes
- Write modular, single-responsibility functions

## Workflow
- Implement one module at a time
- Run `npm run build` to verify TypeScript compiles
- Do not move to the next module until current one builds and passes basic checks
- Feel free to push back on design/architecture choices when the user is not using the most optimal tech