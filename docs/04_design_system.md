# Design System

## Direction

Build a premium, soft, warm Arabic DTC brand. The visual language should feel calm, maternal, clean, and trustworthy.

## Color Palette

Primary:

- `#B97863` warm rose clay

Secondary:

- `#F7EDE8` soft blush background
- `#FFF9F5` warm ivory
- `#7B5E57` warm brown text
- `#2F2523` deep text

Accent:

- `#D9A441` muted gold for premium badges
- `#6F9E8E` muted sage for trust/safety accents

Error:

- `#B42318`

Success:

- `#267A4A`

## Typography

Arabic:

- Use `IBM Plex Sans Arabic` or `Noto Kufi Arabic`.
- Prefer `IBM Plex Sans Arabic` for body because it is warm and readable.
- Use `Noto Kufi Arabic` or heavier `IBM Plex Sans Arabic` weights for headings.

English logo:

- Use the same family or `Inter`.

Next.js implementation:

- Use `next/font/google`.
- Set `html dir="rtl" lang="ar"`.

## Logo Concept

Header mark:

- Circle in primary brand color.
- White `M` centered inside.
- Next to it Arabic text `مهد بيبي`.
- Under Arabic text or smaller beside it: `mahdbaby`.

Logo should feel boutique, not childish.

## Spacing And Shape

- Large rounded cards: `rounded-3xl`.
- Buttons: pill or soft rounded `rounded-full`.
- Image cards: rounded `2xl/3xl`.
- Use airy spacing, not dense marketplace grids.
- Mobile sections should have generous vertical space.

## Buttons

Primary:

- Background `#B97863`.
- Text white.
- Hover slightly darker.
- Label examples:
  - `اختاري العرض`
  - `أضيفيه للسلة`
  - `أكدي طلبي الآن`

Secondary:

- Background `#F7EDE8`.
- Text `#7B5E57`.
- Border `#E7D4CC`.

## Product Cards

Each product card should include:

- Image placeholder.
- Badge: `الأكثر طلبا` or product-specific badge.
- Star rating.
- Emotional heading.
- One-line benefit.
- Offer price: `من 19 KWD`.
- CTA.

Card copy should focus on the outcome, not the item name only.

## Image Placeholders

Use high-quality generated placeholders until real assets are provided:

- Home hero: mother holding baby in warm bedroom/nursery.
- Product 1: baby crawling/walking indoors with soft head protection.
- Product 2: mother warming bottle in car or while visiting family.
- Product 3: mother at home, private comfortable lactation routine.

Do not use low-quality AliExpress-style images in the design. Use neutral lifestyle placeholders and keep product image areas easy to replace.

## Layout Patterns

Desktop:

- Hero sections: copy right, image left.
- Alternating sections on product pages.
- Max width `1200px` or `1280px`.

Mobile:

- Single column.
- Image first when it helps understanding.
- Sticky bottom CTA on product pages.
- Cart drawer full-height or near full-height.

## Trust Badges

Create reusable badge components:

- `دفع عند الاستلام`
- `دعم عربي`
- `تأكيد قبل الشحن`
- `اختيار مهد بيبي`
- `تجارب أمهات`

## Microinteractions

- Cart drawer slide from left in RTL context, or from side nearest cart icon.
- CTA loading state.
- Checkout field validation inline.
- Upsell modal countdown ring/bar.
- Soft hover lifts on product cards.

## Accessibility

- Proper contrast for text.
- Buttons at least 44px height.
- Labels for fields.
- Error text clear in Arabic.
- Keyboard-accessible modal and cart drawer.
- Respect reduced motion.
