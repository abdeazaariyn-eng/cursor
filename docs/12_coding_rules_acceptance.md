# Coding Rules And Acceptance Criteria

## Engineering Rules

- TypeScript strict mode in frontend.
- Python typing in backend.
- No hardcoded secrets.
- Backend recalculates all prices.
- No raw PII in logs.
- Reusable components for sections, product cards, badges, modals, buttons.
- Keep product copy/data centralized.
- Keep tracking mappings centralized.
- Keep phone normalization shared conceptually between frontend and backend.
- Use Arabic copy from docs unless improving with the same tone.

## Frontend Rules

- `dir="rtl"` and `lang="ar"`.
- Mobile-first Tailwind.
- Use semantic HTML.
- Use accessible dialogs/drawers.
- Use `next/image` for images.
- Use `next/script` for pixels with `afterInteractive`.
- Keep cart state persistent in local storage only if it does not create stale checkout confusion.
- Clear cart after successful thank-you.

## Backend Rules

- Validate request payloads with Pydantic.
- Validate product IDs/offer IDs against server-side catalog.
- Store order before external calls.
- External failures should not drop orders.
- Use async HTTP client for CAPI and Sheets.
- Use Alembic for migrations.
- Run migrations on startup if env enabled.

## Testing Checklist

Frontend:

- Product offer selection.
- Add to cart opens drawer.
- Cart total and savings.
- Cross-sell add.
- Checkout validation.
- Upsell accept/skip/timeout.
- Thank-you redirect.
- Pixel function calls mocked.

Backend:

- Phone normalization.
- Invalid phone rejection.
- Price recalculation.
- Order creation.
- Upsell update.
- Finalization.
- Sheets webhook payload.
- Hashing differences for Meta/Snap vs TikTok.

End-to-end:

- Submit order with one product.
- Submit order with bundle.
- Accept upsell.
- Skip upsell.
- Cart with all products.
- Tracking disabled mode.
- Tracking test mode.

## Definition Of Done

The project is done when:

- `frontend/` and `backend/` exist.
- Both have Dockerfiles and `.env.example`.
- Root has `README.md` and `docker-compose.example.yml`.
- Home, collection, product, about, contact, thank-you, policy pages exist.
- Cart drawer and checkout popup work.
- COD order flow works.
- Orders are stored in Postgres.
- Sheets webhook script and templates are included.
- Server-side tracking services are implemented with env toggles.
- Site is responsive and RTL.
- Build/lint/test commands pass or documented if unavailable.

## Important Legal/Trust Notes

Do not add fake certifications or medical claims.

Use placeholders for certificates until assets are provided:

- Product specification images.
- Supplier certificates.
- Real customer reviews.
- UGC screenshots.

Until proof is real, phrase claims as selection criteria and product intent, not guaranteed outcomes.

## Final QA Questions

Before production, confirm:

- Is the primary shipping country KSA, Kuwait, or both?
- Is KWD definitely the customer-facing currency?
- What is the real delivery promise?
- What is the real return/exchange policy?
- What support channel will be used?
- Are there actual certificates from suppliers?
- Are product images/videos licensed for advertising?
