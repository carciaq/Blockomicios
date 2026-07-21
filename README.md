# Blockomicios

Minimal local blockchain voting demo with React/Vite frontend and Node/Express backend.

## Quick start (local)

1. Install dependencies:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. Copy env files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

3. Start backend and frontend separately:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

4. Open the app:

- Frontend: http://localhost:5173
- Backend health: http://localhost:4000

## Quick start (Docker)

From the repository root:

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Notes

- The backend uses a local Ganache in-memory blockchain automatically.
- No Polygon RPC, private key, MongoDB, or external services are required for the default demo.
- The `.env.example` files are minimal and only include local runtime settings.
