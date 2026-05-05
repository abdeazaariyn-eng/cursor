# Google Sheets Webhook

## Goal

Orders should be stored in Postgres first, then sent to Google Sheets for operations and confirmation.

Backend env:

```env
GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_SHEETS_WEBHOOK_SECRET=
```

## Sheet Tabs

Use these tabs:

- `Orders`
- `OrderItems`
- `Products`

## Orders Columns

See `sheets/orders_template.csv`.

Required operational columns:

- `order_number`
- `created_at`
- `customer_name`
- `phone_domestic`
- `phone_e164`
- `items_summary`
- `total_kwd`
- `status`
- `confirmation_status`
- `delivery_status`
- `notes`
- `utm_source`
- `utm_campaign`

## OrderItems Columns

See `sheets/order_items_template.csv`.

Each order item gets one row so the team can analyze product mix and upsell performance.

## Products Columns

See `sheets/products_template.csv`.

Used as a reference tab for operations.

## Webhook Request

Backend sends:

```json
{
  "secret": "shared-secret",
  "order": {
    "order_number": "MB-20260504-0001",
    "created_at": "2026-05-04T13:20:00Z",
    "customer_name": "سارة",
    "phone_domestic": "0551234567",
    "phone_e164": "+966551234567",
    "items_summary": "جهاز تدفئة زجاجات حليب الأطفال المحمول x2 + قناع الحماية الناعم لرأس الأطفال x1",
    "subtotal_kwd": 27,
    "discount_kwd": 0,
    "total_kwd": 36,
    "status": "submitted",
    "upsell_status": "accepted",
    "landing_page": "https://mahdbaby.shop/products/portable-baby-bottle-warmer",
    "utm_source": "snapchat",
    "utm_medium": "paid_social",
    "utm_campaign": "warmer_moms_ksa",
    "utm_content": "ugc_01",
    "utm_term": "",
    "notes": ""
  },
  "items": [
    {
      "order_number": "MB-20260504-0001",
      "product_id": "portable_baby_bottle_warmer",
      "product_name_ar": "جهاز تدفئة زجاجات حليب الأطفال المحمول",
      "offer_id": "two_pieces",
      "quantity": 2,
      "price_kwd": 27,
      "is_upsell": false
    }
  ]
}
```

## Google Apps Script

Use `sheets/google_apps_script.js`.

Deployment steps:

1. Create a Google Sheet.
2. Create tabs: `Orders`, `OrderItems`, `Products`.
3. Paste column headers from the CSV templates.
4. Extensions > Apps Script.
5. Paste `google_apps_script.js`.
6. Set Script Property:
   - `WEBHOOK_SECRET`
7. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
8. Copy Web App URL to backend env `GOOGLE_SHEETS_WEBHOOK_URL`.

## Reliability

Backend should:

- Retry webhook once or twice on temporary failure.
- Mark `sheet_sync_status=failed` if still failing.
- Keep the order in Postgres regardless.

Apps Script should:

- Validate shared secret.
- Lock while writing rows.
- Append order row and item rows.
- Return JSON.
