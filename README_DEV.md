Full-stack setup for Blockomicios (frontend + backend + smart contract)

Overview

This repository contains:
- frontend/: React app (Vite)
- backend/: Node/Express API and Solidity contract support

This guide walks through running the frontend and backend locally using the simplified local Ganache demo.

Prerequisites

- Node.js 18+ and npm
- Git

Backend setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

3. Run the backend

```bash
npm run dev
```

The backend starts a local Ganache chain and deploys the voting contract automatically.

Backend endpoints (local default `http://localhost:4000`)

- `POST /auth/login` - body: `{ voterId }`
- `GET /candidates`
- `POST /vote` - body: `{ voterId, candidateId, encryptedData }`
- `GET /results`

Frontend setup

1. Install dependencies

```bash
cd frontend
npm install
```

2. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

3. Run the frontend

```bash
npm run dev
```

4. Open the app at http://localhost:5173

How it works

- The backend deploys a local contract on Ganache when it starts.
- The frontend logs in with voterId only.
- When a vote is cast, the frontend sends `encryptedData` plus voter and candidate info to `/vote`.
- The backend stores the vote on-chain and prevents duplicate votes by voterId.

Notes

- No external Polygon RPC, private key, or MongoDB database is required for the default local demo.
- The Docker compose setup can run both frontend and backend together.
- This is a local demo; it is not intended for production use.

Docker start

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000