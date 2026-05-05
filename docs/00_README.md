# Mahdbaby Website Build Docs

This folder is the full product, brand, CRO, frontend, backend, tracking, deployment, and AI-coder handoff spec for `mahdbaby.shop`.

## Goal

Build an Arabic RTL DTC branded store for `مهد بيبي / mahdbaby` that sells curated baby-care and mother-care products at premium prices using strong brand trust, emotional copy, offer stacking, COD checkout, high-AOV bundles, cart cross-sells, and server-side tracking.

The store should feel like Mahdbaby owns, curates, tests, and stands behind the products. It must not feel like a generic dropshipping catalog.

## Market Assumption

The brand language targets Saudi women and mothers using warm Saudi/Gulf Arabic. Currency is KWD because the offer prices are in KWD. Checkout accepts valid Saudi mobile numbers because paid acquisition and fulfillment are expected to focus on KSA.

If the business later targets Kuwait phone numbers instead, update `docs/10_tracking_pixels_capi.md`, `docs/07_backend_architecture.md`, and the checkout validation rules.

## Required Output Structure

The AI coder must deliver:

```text
frontend/
  Next.js app
  Dockerfile
  .env.example

backend/
  FastAPI app
  Alembic migrations
  Dockerfile
  .env.example

docs/
  these implementation specs

README.md
docker-compose.example.yml
```

## Read Order For The AI Coder

1. `01_brand_positioning_icp.md`
2. `02_products_offers_copy.md`
3. `03_site_map_and_cro.md`
4. `04_design_system.md`
5. `05_frontend_architecture.md`
6. `06_backend_architecture.md`
7. `07_data_model_api_contracts.md`
8. `08_checkout_aov_order_flow.md`
9. `09_tracking_pixels_capi.md`
10. `10_google_sheets_webhook.md`
11. `11_deployment_easypanel.md`
12. `12_coding_rules_acceptance.md`
13. `prompts/ai_coder_prompt.md`

## Non-Negotiables

- Arabic-first, RTL, mobile-first.
- COD only. No online payment in v1.
- Two-field checkout: name and Saudi mobile number.
- KSA mobile validation before submit.
- Every product CTA selects an offer, adds it to cart, and opens cart drawer.
- Cart drawer must show relevant cross-sells and bundle nudges.
- Checkout submit must show a 10-15 second one-time upsell at `9 KWD`.
- Orders must be stored in Postgres and sent to Google Sheets via webhook.
- Web pixels must load deferred/non-blocking.
- Meta/TikTok/Snap server events must use deduplication IDs shared with browser events.
- Server-side PII sent to ad platforms must be normalized and hashed as specified.
- Frontend and backend must each be Docker deployable.

## Brand Name

- Arabic: `مهد بيبي`
- English: `mahdbaby`
- Domain: `mahdbaby.shop`
- Backend domain: `api.mahdbaby.shop`
- Database name: `mahdbaby`

## Products

1. `قناع الحماية الناعم لرأس الأطفال`
2. `جهاز تدفئة زجاجات حليب الأطفال المحمول`
3. `مضخة ثدي كهربائية جديدة قابلة للارتداء`

## Offer Ladder

For each product:

- 1 piece: `19 KWD`
- 2 pieces: `27 KWD`
- 3 pieces: `33 KWD`

Use bundle math visually:

- 2 pieces: "وفري 11 KWD"
- 3 pieces: "أفضل قيمة - وفري 24 KWD"

The only discount outside bundle offers is the post-checkout upsell at `9 KWD`.
