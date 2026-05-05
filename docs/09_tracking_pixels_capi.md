# Tracking, Web Pixels, And CAPI

## Goals

- Load web pixels without hurting speed.
- Send server-side conversion events for better attribution.
- Use matching event IDs for browser/server deduplication.
- Hash PII only server-side.
- Never expose CAPI access tokens in frontend.

## Platforms

Implement:

- Meta Pixel + Meta Conversions API
- TikTok Pixel + TikTok Events API
- Snap Pixel + Snap Conversions API

## Pixel Loading

Use Next.js `next/script` with `strategy="afterInteractive"`.

Do not use `beforeInteractive` for marketing pixels. These are not critical to first paint.

Wrap pixel loading behind:

```env
NEXT_PUBLIC_ENABLE_PIXELS=true
```

## Shared Event ID Rule

For any event sent from both browser and server:

- Browser event ID and server event ID must match.
- Event name must match or map to the correct platform equivalent.
- Generate UUID in frontend and include it in backend request.

Meta specifically deduplicates by matching browser `eventID` with server `event_id`, plus matching event name. Snap uses event IDs/client dedup IDs. TikTok uses event IDs for deduplication.

## Event Names

| Business Event | Meta | TikTok | Snap |
|---|---|---|---|
| Page view | `PageView` | `PageView` | `PAGE_VIEW` |
| Product view | `ViewContent` | `ViewContent` | `VIEW_CONTENT` |
| Add to cart | `AddToCart` | `AddToCart` | `ADD_CART` |
| Checkout open | `InitiateCheckout` | `InitiateCheckout` | `START_CHECKOUT` |
| Final order | `Purchase` | `CompletePayment` or `Purchase` based on TikTok SDK support | `PURCHASE` |

Use one internal enum and map to platform names.

## Customer Phone Normalization

Accepted checkout input:

- `0551234567`
- `551234567`
- `+966551234567`
- `966551234567`
- `00966551234567`

Internal normalized formats:

- Domestic: `0551234567`
- E.164: `+966551234567`
- Digits with country code: `966551234567`

## Hashing Rules

### Meta

For phone `ph`:

- Remove symbols, letters, and leading zeros.
- Include country code.
- Hash with SHA-256 lowercase hex.

For KSA mobile:

- Hash `966551234567`, not `0551234567`, not `+966551234567`.

### TikTok

For phone:

- Use E.164 format before hashing.
- Include `+`.
- Hash with SHA-256 lowercase hex.

For KSA mobile:

- Hash `+966551234567`.

TikTok docs and integrations describe phone as E.164 before hashing. Keep the `+` for TikTok normalization.

### Snap

For phone:

- Include country code.
- Remove double zero international prefix.
- If the number itself begins with `0`, remove it.
- Remove all non-numeric characters, including `+`.
- Hash with SHA-256 lowercase hex.

For KSA mobile:

- Hash `966551234567`.

## Browser Data To Capture

Frontend should capture and send to backend when available:

- `fbp`
- `fbc`
- `_ttp`
- `ttclid`
- Snap click ID if available from URL/cookies
- user agent
- landing page
- UTM params

Backend should derive:

- client IP from request headers/proxy
- event time

## Meta CAPI Payload Shape

Endpoint:

```text
POST https://graph.facebook.com/vXX.X/{PIXEL_ID}/events?access_token={TOKEN}
```

Payload:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1710000000,
      "event_id": "uuid",
      "action_source": "website",
      "event_source_url": "https://mahdbaby.shop/thank-you",
      "user_data": {
        "ph": ["sha256_phone"],
        "client_ip_address": "ip",
        "client_user_agent": "ua",
        "fbp": "fb.1...",
        "fbc": "fb.1..."
      },
      "custom_data": {
        "currency": "KWD",
        "value": 36,
        "order_id": "MB-20260504-0001",
        "content_ids": ["portable_baby_bottle_warmer"],
        "contents": [
          {
            "id": "portable_baby_bottle_warmer",
            "quantity": 2,
            "item_price": 27
          }
        ],
        "content_type": "product"
      }
    }
  ],
  "test_event_code": "optional only in test mode"
}
```

## TikTok Events API Payload Shape

Endpoint and final field names should be checked against the current TikTok Business API version during implementation.

Required intent:

```json
{
  "event_source": "web",
  "event_source_id": "TIKTOK_PIXEL_CODE",
  "data": [
    {
      "event": "CompletePayment",
      "event_time": 1710000000,
      "event_id": "uuid",
      "user": {
        "phone": "sha256_e164_phone",
        "ttp": "_ttp cookie",
        "ttclid": "ttclid",
        "ip": "ip",
        "user_agent": "ua"
      },
      "properties": {
        "currency": "KWD",
        "value": 36,
        "order_id": "MB-20260504-0001",
        "contents": [
          {
            "content_id": "portable_baby_bottle_warmer",
            "content_type": "product",
            "quantity": 2,
            "price": 27
          }
        ]
      }
    }
  ]
}
```

## Snap CAPI Payload Shape

Endpoint and auth should be checked against current Snap Marketing API version during implementation.

Required intent:

```json
{
  "pixel_id": "SNAP_PIXEL_ID",
  "events": [
    {
      "event_name": "PURCHASE",
      "event_time": 1710000000,
      "event_id": "uuid",
      "action_source": "WEB",
      "event_source_url": "https://mahdbaby.shop/thank-you",
      "user_data": {
        "hashed_phone_number": "sha256_digits_phone",
        "client_ip_address": "ip",
        "client_user_agent": "ua"
      },
      "custom_data": {
        "currency": "KWD",
        "value": 36,
        "order_id": "MB-20260504-0001",
        "content_ids": ["portable_baby_bottle_warmer"]
      }
    }
  ]
}
```

## Event Timing

Recommended:

- Browser `AddToCart` immediately on add.
- Browser `InitiateCheckout` on checkout popup open.
- Initial checkout submit creates pending order but does not send final `Purchase`.
- Finalize order after upsell decision, then send browser and server `Purchase` with final total.

If browser `Purchase` fires before backend CAPI, still use same `purchaseEventId`.

## Failure Handling

- CAPI failures must not block order.
- Store failed payload status for retry/debug.
- In test mode include platform test codes.
- In production do not include test codes.

## Privacy

- Show privacy policy link near checkout.
- Do not send raw phone to platforms.
- Do not log raw PII in platform payload logs.
- Keep tokens only in backend env.
