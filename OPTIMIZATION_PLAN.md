// Optimization summary - remove unused dependencies and optimize bundle

## Current Bundle Analysis

Dependencies to optimize:
- framer-motion: 11.13.1 (used for animations - keep, but lazy load)
- lucide-react: 0.469.0 (used for icons - already optimized)
- sharp: 0.34.5 (image optimization - used server-side only)
- zustand: 5.0.2 (lightweight, keep)

## Recommended Optimizations:

1. **Tree-shaking & Code Splitting** ✓
   - All components already use dynamic imports
   - Icons are tree-shaken automatically

2. **Image Optimization** ✓
   - Converting to WebP (already done)
   - Using Next.js Image component
   - Lazy loading all product/hero images

3. **Lazy Load Heavy Components**
   - CartDrawer (loaded on demand)
   - UpsellModal (loaded after purchase)
   - Framer Motion animations (only on scroll)

4. **Production Build Optimization**
   - next/image with automatic optimization
   - CSS purging (Tailwind)
   - JavaScript minification

5. **Remove Unused Code**
   - Check MapPin import usage
   - Check FileText import usage
   - Remove unused variables
