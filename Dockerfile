# Build the frontend and backend into a single image for local development.
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies for both frontend and backend.
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN cd backend && npm install
RUN cd frontend && npm install

# Copy application code.
COPY . .

# Expose the frontend and backend ports.
EXPOSE 4000 5173

# Default command: start backend and frontend in development mode.
CMD ["sh", "-c", "cd backend && npm run dev & cd ../frontend && npm run dev -- --host 0.0.0.0"]
