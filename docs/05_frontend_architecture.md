# Frontend Architecture

## Stack

Use:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Zustand for cart/checkout state
- React Hook Form + Zod for checkout validation
- Framer Motion for limited modal/drawer animation
- `next/font/google`
- `next/image`
- `next/script`

Do not add a heavy UI kit. Build a small branded component system.

## Suggested Frontend Structure

```text
frontend/
  app/
    layout.tsx
    page.tsx
    products/
      page.tsx
      [slug]/
        page.tsx
    about/page.tsx
    contact/page.tsx
    thank-you/page.tsx
    privacy/page.tsx
    returns/page.tsx
    shipping/page.tsx
  components/
    brand/
    cart/
    checkout/
    layout/
    product/
    sections/
    tracking/
    ui/
  data/
    products.ts
    copy.ts
  lib/
    api.ts
    events.ts
    phone.ts
    prices.ts
    tracking.ts
    utils.ts
  store/
    cart-store.ts
  public/
    images/placeholders/
```

## Rendering Strategy

- Static render marketing pages when possible.
- Product data can live in code for v1.
- Checkout/cart must be client components.
- Tracking wrapper components must load only in browser.
- Use server components for page structure and metadata.

## Environment Variables

Create `frontend/.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://mahdbaby.shop
NEXT_PUBLIC_API_BASE_URL=https://api.mahdbaby.shop

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

NEXT_PUBLIC_ENABLE_PIXELS=true
NEXT_PUBLIC_ENABLE_DEBUG_TRACKING=false
```

Never expose server CAPI tokens in the frontend.

## Product Data Model In Frontend

Each product must include:

- `id`
- `slug`
- `arabicName`
- `shortName`
- `cardHeading`
- `cardSubheading`
- `heroHeading`
- `heroSubheading`
- `badges`
- `images`
- `offers`
- `sections`
- `reviews`
- `faqs`
- `crossSellPriority`

Offer IDs should be stable:

- `one_piece`
- `two_pieces`
- `three_pieces`

## Cart State

Cart item:

```ts
type CartItem = {
  productId: string
  slug: string
  name: string
  offerId: 'one_piece' | 'two_pieces' | 'three_pieces' | 'upsell_9kwd'
  quantity: number
  unitLabel: string
  priceKwd: number
  originalPriceKwd?: number
  image: string
}
```

Rules:

- Adding a normal offer replaces the same product normal offer in cart.
- Upsell item can only be added once.
- Cart total is sum of `priceKwd`.

## Checkout Validation

Use Zod:

- Name: minimum 2 Arabic/English characters after trimming.
- Phone: accept Saudi mobile formats:
  - `05XXXXXXXX`
  - `5XXXXXXXX`
  - `+9665XXXXXXXX`
  - `9665XXXXXXXX`
  - `009665XXXXXXXX`

Normalize to:

- Display/domestic: `05XXXXXXXX`
- E.164: `+9665XXXXXXXX`
- Digits for hashing: `9665XXXXXXXX`

Reject landlines and non-KSA numbers in v1.

## Tracking In Frontend

Use `next/script` with `strategy="afterInteractive"` for pixel base scripts. Do not block rendering.

Generate a UUID `eventId` per meaningful event:

- `PageView`
- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `Lead`
- `Purchase`

When an event also goes to backend CAPI, send the same `eventId` in the backend request for deduplication.

## Events To Fire

On page load:

- Meta `PageView`
- TikTok `PageView`
- Snap `PAGE_VIEW`

Product page:

- Meta `ViewContent`
- TikTok `ViewContent`
- Snap `VIEW_CONTENT`

Offer add:

- Meta `AddToCart`
- TikTok `AddToCart`
- Snap `ADD_CART`

Open checkout:

- Meta `InitiateCheckout`
- TikTok `InitiateCheckout`
- Snap `START_CHECKOUT`

Submit valid checkout:

- Browser event: `Lead` or `Purchase` depending strategy.
- Recommended: send `Purchase` only after final order including upsell decision.

## API Client

Use a typed `fetch` wrapper:

- Base URL from `NEXT_PUBLIC_API_BASE_URL`.
- Include `Content-Type: application/json`.
- Timeout with `AbortController`.
- Return typed errors for checkout UI.

## Performance

- Use image placeholders with explicit dimensions.
- Lazy load below-fold images.
- Keep Framer Motion usage scoped to drawer/modal.
- Defer pixels.
- Do not load analytics if env disabled.
- Avoid large icon libraries; import only needed icons.

## SEO Metadata

Set Arabic metadata for:

- Home
- Collection
- Each product
- About
- Contact

Use Open Graph image placeholder until real images exist.

## Frontend Acceptance

- Works on mobile, tablet, desktop.
- RTL is correct.
- CTA opens cart after add.
- Checkout validates Saudi phone.
- Upsell appears after valid submit.
- Thank-you page displays order ID.
- Pixel base scripts are not render-blocking.
- No server tokens in frontend bundle.
