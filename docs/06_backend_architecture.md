# Backend Architecture

## Stack

Use:

- Python 3.12+
- FastAPI
- Uvicorn
- SQLAlchemy 2.x async
- asyncpg
- Alembic
- Pydantic v2
- httpx
- python-dotenv or pydantic-settings
- structlog or standard logging

## Backend Responsibilities

- Validate and create orders.
- Store orders in Postgres.
- Update order after upsell accept/skip.
- Send final order to Google Sheets webhook.
- Send server-side events to Meta, TikTok, and Snap.
- Hash and normalize customer data for CAPI.
- Expose health endpoint.

## Suggested Backend Structure

```text
backend/
  app/
    main.py
    core/
      config.py
      logging.py
      security.py
    db/
      session.py
      models.py
      migrations.py
    api/
      routes/
        health.py
        orders.py
        tracking.py
    schemas/
      orders.py
      tracking.py
    services/
      orders.py
      sheets.py
      tracking_meta.py
      tracking_tiktok.py
      tracking_snap.py
      hashing.py
      phone.py
    tests/
  alembic/
  alembic.ini
  requirements.txt
  Dockerfile
  .env.example
```

## App Lifecycle

Use FastAPI lifespan, not deprecated startup events.

On startup:

1. Validate required env variables.
2. Connect to Postgres.
3. Run Alembic migrations automatically if `RUN_MIGRATIONS_ON_START=true`.

On shutdown:

- Close DB/http clients.

## Environment Variables

Create `backend/.env.example`:

```env
APP_ENV=production
API_HOST=0.0.0.0
API_PORT=8000
PUBLIC_API_URL=https://api.mahdbaby.shop
FRONTEND_URL=https://mahdbaby.shop

DATABASE_URL=postgresql+asyncpg://mahdbaby:mahdbaby%40@mahdbaby_database:5432/mahdbaby
RUN_MIGRATIONS_ON_START=true

CORS_ORIGINS=https://mahdbaby.shop,http://localhost:3000

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

Important: the provided internal Postgres URL contains `@@` because the password includes `@`:

```text
postgres://mahdbaby:mahdbaby@@mahdbaby_database:5432/mahdbaby?sslmode=disable
```

For SQLAlchemy URLs, encode the password `mahdbaby@` as `mahdbaby%40` and use:

```text
postgresql+asyncpg://mahdbaby:mahdbaby%40@mahdbaby_database:5432/mahdbaby
```

## CORS

Allow:

- `https://mahdbaby.shop`
- `https://www.mahdbaby.shop` if used
- `http://localhost:3000`

Do not use `*` in production.

## API Endpoints

Health:

- `GET /health`

Orders:

- `POST /orders`
- `PATCH /orders/{order_id}/upsell`
- `POST /orders/{order_id}/finalize`
- `GET /orders/{order_id}` optional, safe limited response

Tracking:

- `POST /tracking/event` optional for browser-to-server event relay

## Order Flow

Initial checkout submit:

1. Validate payload.
2. Normalize phone.
3. Create order with status `pending_upsell`.
4. Store cart snapshot.
5. Do not send final Google Sheet row yet unless using update mode.
6. Return `order_id` and recommended upsell product.

Upsell accept:

1. Validate order is pending.
2. Add upsell line item at `9 KWD`.
3. Recalculate total.
4. Mark `upsell_status=accepted`.

Upsell skip/timeout:

1. Mark `upsell_status=skipped` or `timeout`.

Finalize:

1. Mark order `submitted`.
2. Send Google Sheets webhook.
3. Send final server tracking events.
4. Return thank-you redirect data.

## Security

- Rate limit checkout by IP and phone if possible.
- Store raw phone in DB for fulfillment, but never send raw phone to CAPI.
- Hash PII server-side only.
- Do not log raw phone numbers in production logs.
- Add request IDs.
- Validate product IDs and prices server-side; never trust frontend totals.

## Dockerfile

Use a simple production Dockerfile:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
```

## Backend Acceptance

- `/health` returns OK.
- Migrations run on start when enabled.
- Order prices are recalculated server-side.
- Invalid Saudi phone is rejected.
- Google Sheet webhook failure does not lose the order in DB.
- CAPI failures are logged but do not block customer thank-you page.
- Raw phone is never sent to ad APIs.
