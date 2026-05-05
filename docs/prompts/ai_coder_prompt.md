# Prompt For AI Coder

You are building the full Mahdbaby DTC ecommerce website and backend from the docs in this repository.

Read these docs first, in order:

1. `docs/00_README.md`
2. `docs/01_brand_positioning_icp.md`
3. `docs/02_products_offers_copy.md`
4. `docs/03_site_map_and_cro.md`
5. `docs/04_design_system.md`
6. `docs/05_frontend_architecture.md`
7. `docs/06_backend_architecture.md`
8. `docs/07_data_model_api_contracts.md`
9. `docs/08_checkout_aov_order_flow.md`
10. `docs/09_tracking_pixels_capi.md`
11. `docs/10_google_sheets_webhook.md`
12. `docs/11_deployment_easypanel.md`
13. `docs/12_coding_rules_acceptance.md`

Deliver a production-ready repo with:

- `frontend/`: Next.js App Router, React, TypeScript, Tailwind, RTL Arabic, responsive design, cart drawer, checkout popup, upsell modal, tracking pixels.
- `backend/`: Python FastAPI, Postgres, SQLAlchemy async, Alembic migrations, order APIs, Sheets webhook sender, Meta/TikTok/Snap CAPI services.
- `docs/sheets/google_apps_script.js`: include as provided unless you improve it safely.
- `docs/sheets/*.csv`: keep sheet templates.
- Dockerfiles for frontend and backend.
- `.env.example` for frontend and backend.
- Root `README.md` with setup, local dev, env, deployment, and testing instructions.
- Root `docker-compose.example.yml`.

Business requirements:

- Brand: `مهد بيبي / mahdbaby`.
- Domains: `mahdbaby.shop`, backend `api.mahdbaby.shop`.
- Currency: KWD.
- Checkout: COD only.
- Checkout fields: name and Saudi mobile only.
- Products:
  - `قناع الحماية الناعم لرأس الأطفال`
  - `جهاز تدفئة زجاجات حليب الأطفال المحمول`
  - `مضخة ثدي كهربائية جديدة قابلة للارتداء`
- Offers for each product:
  - 1 piece: `19 KWD`
  - 2 pieces: `27 KWD`
  - 3 pieces: `33 KWD`
- Only post-checkout upsell uses discounted price: `9 KWD`.

Critical behavior:

- Every product CTA adds selected offer to cart and opens cart drawer.
- Cart drawer shows cross-sells.
- Cart CTA opens checkout popup.
- Valid checkout creates pending order and shows 10-15 second upsell.
- Accept/skip/timeout finalizes order.
- Final order is saved to Postgres and sent to Google Sheets.
- Browser pixels and backend CAPI events use shared dedup event IDs.
- Hash phone server-side for CAPI:
  - Meta/Snap hash digits with country code, e.g. `966551234567`.
  - TikTok hash E.164 with plus, e.g. `+966551234567`.

Implementation constraints:

- Do not hardcode secrets.
- Backend must recalculate prices.
- No fake medical, legal, or certification claims.
- Use placeholders for images, certificates, and social proof until real assets exist.
- Keep Arabic copy premium, emotional, and trust-building.
- Build mobile-first and RTL-first.

After implementation, run available build/lint/tests and report what passed and what still needs manual setup.
