# Site Map And CRO Structure

## Routes

- `/` home
- `/products` collection
- `/products/baby-head-protection-mask`
- `/products/portable-baby-bottle-warmer`
- `/products/wearable-electric-breast-pump`
- `/about`
- `/contact`
- `/thank-you`
- `/privacy`
- `/returns`
- `/shipping`

Use Arabic slugs only if the team is comfortable with URL encoding. English slugs are acceptable for reliability.

## Global Layout

### Header

RTL layout.

Right side:

- Circle mark with `M` in brand color.
- Arabic logo text `مهد بيبي`.
- Small English text below or beside it: `mahdbaby`.

Middle:

- `الرئيسية`
- `المنتجات`
- `من نحن`
- `تواصل معنا`

Left:

- Cart icon with quantity.
- Sticky mobile cart button if cart has items.

Header should be sticky with a subtle blur and shadow after scroll.

### Footer

Include:

- Brand logo and short promise.
- Menu links.
- Support links.
- Policies.
- Payment/trust: `الدفع عند الاستلام`.
- Social placeholders: TikTok, Snapchat, Instagram.
- Contact placeholders: WhatsApp, email.

## Home Page Structure

1. Hero
   - Emotional headline.
   - Short brand promise.
   - CTA to collection.
   - Trust row: COD, Arabic support, selected products, fast confirmation.
   - Sample hero image placeholder with mother/baby lifestyle.

2. Social Proof Strip
   - Star rating visual.
   - "أكثر من 1,200 أم وثقت بتجربة مهد بيبي" as placeholder until real number exists.
   - Mark as editable placeholder in code.

3. Product Highlights
   - Three premium cards.
   - Each card has headline, subheading, rating, offer from `19 KWD`, and CTA.

4. Why Mahdbaby
   - Curated not random.
   - Baby/mother comfort first.
   - Arabic support.
   - COD.

5. Emotional Use Cases
   - "وقت الطلعة"
   - "بدايات الحركة"
   - "روتين الرضاعة"

6. Authority/Proof Section
   - Selection checklist.
   - Supplier proof placeholders.
   - Clear policy links.

7. Reviews
   - Use believable Saudi/Gulf names with initials.
   - Do not use impossible claims.

8. Final CTA
   - `اختاري المنتج اللي يريح يومك`

## Collection Page Structure

1. Collection hero:
   - `منتجات مختارة للأم والطفل`
   - `اختاري المنتج حسب المرحلة اللي تعيشينها الآن.`

2. Filters:
   - `للطفل`
   - `للأم`
   - `للطلعات`
   - `هدايا`

3. Product cards:
   - Image placeholder.
   - Product emotional heading.
   - Star rating.
   - Benefit chips.
   - Offer selector preview.
   - CTA: `اختاري العرض`

4. Bundle education:
   - Explain why 2/3 pieces makes sense.

5. Trust FAQ.

## Product Page CRO Blueprint

Every product page must include:

- Sticky offer selector on mobile.
- CTA above the fold.
- Quantity/offer cards.
- Reviews near the CTA.
- Trust row near price.
- Delivery/COD reassurance.
- FAQ before final CTA.
- Cross-sell after add-to-cart via cart drawer.

Product hero layout desktop:

- Right: Arabic copy, rating, price/offer selector, CTA.
- Left: image/video placeholder.

Alternating content sections:

- Section 1: text right, image left.
- Section 2: image right, text left.
- Section 3: text right, image left.

Mobile:

- Image first for product hero.
- CTA visible within first viewport.
- Sticky bottom CTA after scrolling past first CTA.

## Product CTA Behavior

CTA label:

`أضيفيه للسلة وشوفي العرض`

Behavior:

1. User selects 1/2/3 piece offer.
2. CTA adds selected variant to cart.
3. Cart drawer opens immediately.
4. Cart drawer shows order summary and cross-sells.
5. Cart CTA opens checkout popup.

## Cart Drawer

Cart drawer must include:

- Items and selected offer.
- Total.
- Savings line.
- COD trust line.
- Cross-sell cards.
- Scarcity line.
- CTA: `تأكيد الطلب`

Cross-sell card:

- Product image placeholder.
- One-line emotional reason.
- Price or "أضيفيه مع الطلب".
- Button: `أضيفي للسلة`

## Checkout Popup

Checkout must include:

- Order summary.
- Social proof mini line.
- Scarcity/COD line.
- Two fields only:
  - `الاسم`
  - `رقم الجوال`
- CTA: `أكدي طلبي الآن`

After valid submit:

1. Create pending order server-side.
2. Show upsell modal for 10-15 seconds.
3. If accepted, update order with upsell.
4. If skipped or timer ends, finalize order.
5. Send order to Google Sheets.
6. Fire purchase/lead events with dedup IDs.
7. Redirect to `/thank-you?order_id=...`.

## Thank You Page

Include:

- `تم استلام طلبك`
- Order summary.
- "سنتواصل معك لتأكيد الطلب قبل الشحن."
- WhatsApp/contact support.
- Reminder: keep phone reachable.
- Optional soft cross-sell without discount.

## Trust Elements

Use site-wide:

- Rating stars.
- Review cards.
- COD badge.
- Arabic support badge.
- Exchange/return policy link.
- Secure data note.
- "صور المنتج توضيحية، وقد تختلف التفاصيل حسب الدفعة."

## Scarcity Rules

Use soft scarcity:

- `الكمية محدودة لهذا الأسبوع`
- `العرض متاح لفترة محدودة`
- `الأكثر طلبا بين الأمهات`

Do not use fake countdowns that reset on refresh unless clearly session-based.
