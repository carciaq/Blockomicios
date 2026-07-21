# Blockomicios Backend

Minimal local Node/Express backend for the classroom voting demo.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy env example:

```bash
cp .env.example .env
```

3. Run the backend:

```bash
npm run dev
```

The backend starts a local Ganache blockchain automatically and provides the voting API on `http://localhost:4000`.

## API endpoints

- `POST /auth/login` - body: `{ voterId }`
- `GET /candidates`
- `POST /vote` - body: `{ voterId, candidateId, encryptedData }`
- `GET /results`

## Notes

- No external blockchain RPC or MongoDB database is required for the default local demo.
- If you use Docker, `docker compose up --build` starts the backend and frontend together.

## API endpoints

- `POST /auth/login` - body: `{ voterId }`
- `GET /candidates`
- `POST /vote` - body: `{ voterId, candidateId, encryptedData }`
- `GET /results`

## Notes

- No external blockchain RPC or MongoDB database is required for the default local demo.
- If you use Docker, `docker compose up --build` starts the backend and frontend together.
