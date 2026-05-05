# Checkout, AOV, And Order Flow

## AOV Strategy

Primary AOV levers:

- Bundle ladder on every product.
- Product-page CTAs that add selected offer directly.
- Cart drawer cross-sells.
- Post-checkout one-time upsell at `9 KWD`.
- Gift framing for 2/3 pieces.
- "One for home, one for car/bag/grandma's house" framing.

## Offer Presentation

Offer cards:

### 1 Piece

`قطعة واحدة`

`19 KWD`

`للتجربة الأولى`

### 2 Pieces

`قطعتين`

`27 KWD`

`الأفضل للأم والشنطة`

`وفري 11 KWD`

### 3 Pieces

`3 قطع`

`33 KWD`

`أفضل قيمة`

`وفري 24 KWD`

Default selected offer:

- Product pages: `two_pieces` unless using product-specific tests.
- Cart cross-sell add: default `one_piece`.

## Product CTA Flow

1. User lands from Snapchat/TikTok.
2. Product page fires `ViewContent`.
3. User selects offer.
4. User clicks CTA.
5. Frontend fires browser `AddToCart`.
6. Item is added to cart.
7. Cart drawer opens automatically.
8. Cart drawer shows relevant cross-sell.
9. User can add cross-sell.
10. User clicks `تأكيد الطلب`.
11. Checkout popup opens and fires `InitiateCheckout`.

## Checkout Form

Fields:

- `الاسم`
- `رقم الجوال`

Validation messages:

- Name empty: `اكتبي اسمك عشان نأكد الطلب`
- Phone empty: `اكتبي رقم الجوال`
- Phone invalid: `اكتبي رقم جوال سعودي صحيح يبدأ بـ 05`

CTA:

`أكدي طلبي الآن`

Microcopy:

`الدفع عند الاستلام، وراح نتواصل معك لتأكيد الطلب قبل الشحن.`

## Submit Flow

When user submits valid form:

1. Disable button and show loading.
2. Create order via `POST /orders`.
3. Show upsell modal immediately after success.
4. Start countdown 10-15 seconds.
5. If accepted, call upsell API.
6. If skipped or timer ends, call skip/finalize.
7. Fire browser `Purchase` using final total and same `purchaseEventId`.
8. Backend sends server CAPI `Purchase`.
9. Redirect to thank-you page.

## Upsell Modal

Title:

`عرض خاص قبل ما نجهز طلبك`

Body:

`أضيفي [اسم المنتج] مع نفس الطلب بسعر 9 KWD فقط. العرض يظهر مرة واحدة بعد تأكيد الطلب.`

Trust:

`بدون رسوم دفع الآن، الدفع عند الاستلام.`

Buttons:

- `أضيفيه لطلبي`
- `لا شكرا، كملي الطلب`

Timer:

- 10-15 seconds.
- If timer ends, treat as skipped and finalize.

## Upsell Selection Logic

If cart contains one product:

- Recommend highest-priority complementary product.

If cart contains two products:

- Recommend remaining product.

If cart contains all three:

- Recommend an extra piece of the lowest-risk product:
  - head protection or bottle warmer, not breast pump.

Never discount the same offer bundle. The upsell line must be visually separate:

`إضافة خاصة بعد الطلب - 9 KWD`

## Confirmation And Delivery Quality

To improve confirmation and delivery:

- Thank-you page says phone confirmation is required.
- Backend stores clean phone formats.
- Google Sheet includes `confirmation_status`.
- Include order notes column for call center.
- Optional future SMS/WhatsApp confirmation can use the normalized phone.

## Cart Drawer Copy

Top:

`طلبك جاهز تقريبا`

Trust:

`دفع عند الاستلام، وتأكيد قبل الشحن.`

Cross-sell heading:

`أمهات كثير يضيفون معها`

Scarcity:

`العروض محدودة حسب الكمية المتوفرة هذا الأسبوع.`

CTA:

`تأكيد الطلب`

## Thank You Copy

Title:

`تم استلام طلبك بنجاح`

Body:

`شكرا لاختيارك مهد بيبي. راح نتواصل معك على رقم الجوال لتأكيد الطلب قبل الشحن.`

Reminder:

`خليك قريبة من الجوال عشان نقدر نأكد الطلب بسرعة.`
