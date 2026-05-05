# Data Model And API Contracts

## Products

Products can be code-defined in v1, but orders must store full snapshots so later product changes do not alter historical orders.

## Product IDs

```text
baby_head_protection_mask
portable_baby_bottle_warmer
wearable_electric_breast_pump
```

## Offer IDs

```text
one_piece
two_pieces
three_pieces
upsell_9kwd
```

## Price Rules

```json
{
  "one_piece": { "quantity": 1, "price_kwd": 19 },
  "two_pieces": { "quantity": 2, "price_kwd": 27 },
  "three_pieces": { "quantity": 3, "price_kwd": 33 },
  "upsell_9kwd": { "quantity": 1, "price_kwd": 9 }
}
```

Backend must enforce these prices.

## Database Tables

### orders

Fields:

- `id` UUID primary key
- `order_number` human readable, e.g. `MB-20260504-0001`
- `customer_name`
- `phone_raw`
- `phone_domestic`
- `phone_e164`
- `phone_hash_meta_snap`
- `phone_hash_tiktok`
- `status`: `pending_upsell`, `submitted`, `cancelled`
- `upsell_status`: `not_shown`, `shown`, `accepted`, `skipped`, `timeout`
- `currency`: `KWD`
- `subtotal_kwd`
- `discount_kwd`
- `total_kwd`
- `source`
- `landing_page`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `fbp`
- `fbc`
- `ttp`
- `ttclid`
- `sc_click_id`
- `client_ip`
- `user_agent`
- `event_id_purchase`
- `event_id_lead`
- `sheet_sync_status`: `pending`, `sent`, `failed`
- `sheet_sync_error`
- `created_at`
- `updated_at`
- `submitted_at`

### order_items

Fields:

- `id` UUID primary key
- `order_id`
- `product_id`
- `product_slug`
- `product_name_ar`
- `offer_id`
- `quantity`
- `price_kwd`
- `original_price_kwd`
- `is_upsell`
- `sort_order`
- `created_at`

### tracking_events

Optional but recommended.

Fields:

- `id` UUID
- `order_id` nullable
- `event_name`
- `event_id`
- `platform`: `meta`, `tiktok`, `snap`
- `payload` JSONB
- `status`: `pending`, `sent`, `failed`
- `response` JSONB
- `created_at`

## Create Order Request

`POST /orders`

```json
{
  "customer": {
    "name": "سارة",
    "phone": "0551234567"
  },
  "items": [
    {
      "productId": "portable_baby_bottle_warmer",
      "offerId": "two_pieces"
    }
  ],
  "attribution": {
    "landingPage": "https://mahdbaby.shop/products/portable-baby-bottle-warmer",
    "source": "snapchat",
    "utmSource": "snapchat",
    "utmMedium": "paid_social",
    "utmCampaign": "warmer_moms_ksa",
    "utmContent": "ugc_01",
    "utmTerm": "",
    "fbp": "",
    "fbc": "",
    "ttp": "",
    "ttclid": "",
    "scClickId": ""
  },
  "events": {
    "leadEventId": "uuid",
    "purchaseEventId": "uuid"
  }
}
```

Response:

```json
{
  "orderId": "uuid",
  "orderNumber": "MB-20260504-0001",
  "status": "pending_upsell",
  "totalKwd": 27,
  "recommendedUpsell": {
    "productId": "baby_head_protection_mask",
    "priceKwd": 9
  }
}
```

## Upsell Request

`PATCH /orders/{order_id}/upsell`

```json
{
  "action": "accepted",
  "productId": "baby_head_protection_mask"
}
```

or:

```json
{
  "action": "skipped"
}
```

Response:

```json
{
  "orderId": "uuid",
  "upsellStatus": "accepted",
  "totalKwd": 36
}
```

## Finalize Request

`POST /orders/{order_id}/finalize`

```json
{
  "purchaseEventId": "uuid",
  "browserEventSent": true
}
```

Response:

```json
{
  "orderId": "uuid",
  "orderNumber": "MB-20260504-0001",
  "status": "submitted",
  "thankYouUrl": "https://mahdbaby.shop/thank-you?order_id=uuid"
}
```

## Error Response

```json
{
  "error": {
    "code": "INVALID_PHONE",
    "message": "اكتبي رقم جوال سعودي صحيح يبدأ بـ 05"
  }
}
```

## Phone Normalization

Input examples accepted:

- `0551234567`
- `551234567`
- `+966551234567`
- `966551234567`
- `00966551234567`

Normalized:

- `phone_domestic`: `0551234567`
- `phone_e164`: `+966551234567`
- `phone_digits`: `966551234567`

Validation regex after cleaning:

```text
^(?:\+?966|00966|0)?5[0-9]{8}$
```

After normalization, ensure exactly `9665` + 8 digits.
