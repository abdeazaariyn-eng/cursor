# Deployment On EasyPanel

## Domains

Frontend:

```text
https://mahdbaby.shop
```

Backend:

```text
https://api.mahdbaby.shop
```

Database:

```text
mahdbaby
```

Internal Postgres URL supplied:

```text
postgres://mahdbaby:mahdbaby@@mahdbaby_database:5432/mahdbaby?sslmode=disable
```

Use this SQLAlchemy async form in backend:

```text
postgresql+asyncpg://mahdbaby:mahdbaby%40@mahdbaby_database:5432/mahdbaby
```

## Frontend EasyPanel Env

```env
NEXT_PUBLIC_SITE_URL=https://mahdbaby.shop
NEXT_PUBLIC_API_BASE_URL=https://api.mahdbaby.shop
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
NEXT_PUBLIC_ENABLE_PIXELS=true
NEXT_PUBLIC_ENABLE_DEBUG_TRACKING=false
```

## Backend EasyPanel Env

```env
APP_ENV=production
API_HOST=0.0.0.0
API_PORT=8000
PUBLIC_API_URL=https://api.mahdbaby.shop
FRONTEND_URL=https://mahdbaby.shop
DATABASE_URL=postgresql+asyncpg://mahdbaby:mahdbaby%40@mahdbaby_database:5432/mahdbaby
RUN_MIGRATIONS_ON_START=true
CORS_ORIGINS=https://mahdbaby.shop,https://www.mahdbaby.shop

GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_SHEETS_WEBHOOK_SECRET=

META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=

TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=

SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=

TRACKING_ENABLED=true
TRACKING_TEST_MODE=false
```

## Frontend Dockerfile

Use Next.js standalone output.

`next.config.ts`:

```ts
const nextConfig = {
  output: 'standalone',
}

export default nextConfig
```

Dockerfile:

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## Backend Dockerfile

See `06_backend_architecture.md`.

## docker-compose.example.yml

The AI coder should include an example compose for local development:

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: mahdbaby
      POSTGRES_PASSWORD: mahdbaby@
      POSTGRES_DB: mahdbaby
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Deployment Checklist

- Frontend builds locally.
- Backend starts locally.
- Alembic migration creates tables.
- CORS accepts frontend domain.
- `/health` works on backend domain.
- Checkout order writes to DB.
- Google Sheets webhook receives order.
- Thank-you redirect works.
- Pixel scripts load only when enabled.
- CAPI events return success in test mode.
- Test modes removed before production.
