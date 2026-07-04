# مهد بيبي — Mahdbaby DTC Store

Premium Arabic baby-care & mother-care ecommerce store.

- **Brand:** مهد بيبي / mahdbaby
- **Domain:** mahdbaby.shop / api.mahdbaby.shop
- **Currency:** KWD (Kuwaiti Dinar displayed, KSA market)
- **Checkout:** Cash on Delivery (COD) only
- **Language:** Arabic RTL, mobile-first

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS, Zustand, Framer Motion |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2 async, Alembic, Pydantic v2 |
| Database | PostgreSQL 16 |
| Tracking | Meta CAPI, TikTok Events API, Snap CAPI |
| Sheets | Google Apps Script webhook |

---

## Quick Start (Local Dev)

### Prerequisites
- Node.js 22+
- Python 3.12+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone and setup env files

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Edit both `.env` files with your actual credentials.

### 2. Start with Docker Compose

```bash
cp docker-compose.example.yml docker-compose.yml
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Health check: http://localhost:8000/health

### 3. Or run locally without Docker

**Backend:**
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt

# Run migrations manually (or set RUN_MIGRATIONS_ON_START=true in .env)
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Frontend (`frontend/.env.example`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Frontend URL (e.g. https://mahdbaby.shop) |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL (e.g. https://api.mahdbaby.shop) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta/Facebook Pixel ID |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel code |
| `NEXT_PUBLIC_SNAP_PIXEL_ID` | Snap Pixel ID |
| `NEXT_PUBLIC_ENABLE_PIXELS` | `true` to load pixel scripts |
| `NEXT_PUBLIC_ENABLE_DEBUG_TRACKING` | `true` for tracking console logs |

### Backend (`backend/.env.example`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL async URL (asyncpg) |
| `API_WORKERS` | Number of Gunicorn/Uvicorn API workers in production |
| `DB_POOL_SIZE` | SQLAlchemy pool size per API worker |
| `DB_MAX_OVERFLOW` | Extra DB connections allowed per API worker during bursts |
| `RUN_MIGRATIONS_ON_START` | Auto-run Alembic on startup |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Apps Script Web App URL |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Shared secret for webhook auth |
| `META_PIXEL_ID` | Meta Pixel ID for CAPI |
| `META_ACCESS_TOKEN` | Meta CAPI access token |
| `META_TEST_EVENT_CODE` | Test event code (dev only) |
| `TIKTOK_PIXEL_CODE` | TikTok Pixel code for Events API |
| `TIKTOK_ACCESS_TOKEN` | TikTok Events API access token |
| `SNAP_PIXEL_ID` | Snap Pixel ID for CAPI |
| `SNAP_ACCESS_TOKEN` | Snap CAPI access token |
| `TRACKING_ENABLED` | `true` to send CAPI events |
| `TRACKING_TEST_MODE` | `true` for test event codes |

---

## Products

| Product ID | Arabic Name | 1 piece | 2 pieces | 3 pieces |
|-----------|-------------|---------|---------|---------|
| `baby_head_protection_mask` | قناع الحماية الناعم لرأس الأطفال | 19 KWD | 27 KWD | 33 KWD |
| `portable_baby_bottle_warmer` | جهاز تدفئة زجاجات حليب الأطفال المحمول | 19 KWD | 27 KWD | 33 KWD |
| `wearable_electric_breast_pump` | مضخة ثدي كهربائية جديدة قابلة للارتداء | 19 KWD | 27 KWD | 33 KWD |

Post-checkout upsell: **9 KWD** (one-time, different product from cart)

---

## Order Flow

```
User → Product Page → Select Offer → Add to Cart → Cart Drawer → Checkout Popup
     → Submit (name + Saudi phone) → POST /orders → Upsell Modal (12s timer)
     → Accept/Skip → PATCH /orders/{id}/upsell → POST /orders/{id}/finalize
     → Browser Purchase event → Redirect /thank-you?order_id=...
     → Backend: Google Sheets webhook + Meta/TikTok/Snap CAPI
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/orders` | Create pending order |
| PATCH | `/orders/{id}/upsell` | Accept or skip upsell |
| POST | `/orders/{id}/finalize` | Finalize order + trigger Sheets/CAPI |
| GET | `/orders/{id}` | Get safe order info |

---

## Tracking & CAPI

Browser pixels (loaded with `next/script afterInteractive`):
- Meta Pixel — `fbq('track', event)`
- TikTok Pixel — `ttq.track(event)`
- Snap Pixel — `snaptr('track', event)`

Server CAPI (fired on finalize):
- Meta Conversions API — `/vXX.X/{PIXEL_ID}/events`
- TikTok Events API — `/open_api/v1.3/event/track/`
- Snap Conversions API — `/v2/conversion`

**Deduplication:** Browser and server events share the same `eventId` UUID.

**Phone hashing:**
- Meta/Snap: `SHA256("9665XXXXXXXX")` — digits with country code, no `+`
- TikTok: `SHA256("+9665XXXXXXXX")` — E.164 format with `+`

---

## Google Sheets Setup

1. Create a Google Sheet with 3 tabs: `Orders`, `OrderItems`, `Products`
2. Copy column headers from `docs/sheets/orders_template.csv`, `docs/sheets/order_items_template.csv`, `docs/sheets/products_template.csv`
3. In the sheet: Extensions → Apps Script
4. Paste contents of `docs/sheets/google_apps_script.js`
5. Project Settings → Script Properties → Add `WEBHOOK_SECRET` value
6. Deploy → New Deployment → Web App
   - Execute as: Me
   - Who has access: Anyone
7. Copy the Web App URL to backend `.env` as `GOOGLE_SHEETS_WEBHOOK_URL`
8. Copy the same secret to backend `.env` as `GOOGLE_SHEETS_WEBHOOK_SECRET`

---

## Deployment (EasyPanel)

### Frontend Service
- Build from `./frontend`
- Port: 3000
- Set env variables from `frontend/.env.example`
- Optional scale knob: `WEB_CONCURRENCY=2` (or higher if CPU allows)

### Backend Service
- Build from `./backend`
- Port: 8000
- Set env variables from `backend/.env.example`
- Database URL: `postgresql+asyncpg://mahdbaby:mahdbaby%40@mahdbaby_database:5432/mahdbaby`
- Optional scale knobs: `API_WORKERS=2`, `DB_POOL_SIZE=10`, `DB_MAX_OVERFLOW=20`

### Database
- PostgreSQL 16
- DB name: `mahdbaby`
- User: `mahdbaby`
- Password: `mahdbaby@`

---

## Database Migrations

Migrations are managed with Alembic.

```bash
# Run migrations manually
cd backend
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Check current state
alembic current
```

Set `RUN_MIGRATIONS_ON_START=true` to auto-run on container start.

---

## Acceptance Checklist

- [ ] `/health` returns `{"status": "ok"}`
- [ ] Alembic creates all 3 tables on startup
- [ ] Invalid Saudi phone returns Arabic error
- [ ] Order prices are recalculated server-side
- [ ] Google Sheets webhook receives order
- [ ] CAPI events send in test mode (check platform dashboards)
- [ ] Cart drawer opens after add-to-cart
- [ ] Upsell modal appears with countdown
- [ ] Thank-you page shows order number
- [ ] RTL layout correct on mobile
- [ ] Pixel scripts load only when `NEXT_PUBLIC_ENABLE_PIXELS=true`
- [ ] No raw phone numbers in logs
- [ ] No secrets in frontend bundle

---

## Pre-Production Checklist

- [ ] Confirm shipping country (KSA, Kuwait, or both)
- [ ] Confirm KWD is the customer-facing currency
- [ ] Confirm delivery promise (days)
- [ ] Confirm return/exchange policy
- [ ] Add real product images and videos
- [ ] Add real customer reviews
- [ ] Add real WhatsApp number and email
- [ ] Remove `META_TEST_EVENT_CODE` from production env
- [ ] Set `TRACKING_TEST_MODE=false`
- [ ] Update `NEXT_PUBLIC_ENABLE_DEBUG_TRACKING=false`

---

## Legal Notes

No fake medical, clinical, or certification claims are used. Trust language uses selection intent and product benefits only. Certification placeholders are marked clearly for the team to fill with real proof when available.

---

*Built for مهد بيبي — mahdbaby.shop*
