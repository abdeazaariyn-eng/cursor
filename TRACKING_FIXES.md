# Tracking & CAPI Fixes - Commit Summary

## Changes Made

### 1. Frontend Pixel Loading Strategy
**File**: `frontend/components/tracking/PixelScripts.tsx`

**Change**: Changed pixel script loading from `strategy="lazyOnload"` to `strategy="afterInteractive"`
- **Why**: `lazyOnload` delays pixel loading which can cause missed events during checkout
- **Impact**: Meta, TikTok, and Snap pixels now load early in the page lifecycle

### 2. Snap Pixel Re-initialization
**File**: `frontend/lib/events.ts`

**Change**: Improved Snap pixel phone matching with graceful fallback
```typescript
// Before: Always re-init
window.snaptr('init', SNAP_PIXEL_ID, { user_phone_number: normalized })

// After: Try setUser first, fallback to re-init
try {
  (window.snaptr as any)('setUser', { phone_number: normalized })
} catch {
  window.snaptr('init', SNAP_PIXEL_ID, { user_phone_number: normalized })
}
```
- **Why**: Reduces duplicate init calls and improves performance
- **Impact**: Better handling of phone number advanced matching on Snap pixel

### 3. Frontend Purchase Event Deduplication
**File**: `frontend/app/thank-you/page.tsx` & `frontend/components/checkout/UpsellModal.tsx`

**Changes**:
- Added `PURCHASE_EVENT_KEY` storage in sessionStorage
- UpsellModal stores purchase event ID after firing
- Thank-you page logs and validates event ID for deduplication
- **Why**: Prevents duplicate pixel firing if thank-you page reloads
- **Impact**: Cleaner deduplication tracking and debugging

### 4. CAPI Payload Format Fixes

#### Snap Conversions API (tracking_snap.py)
**Changes**:
- `price`: Changed from `str(float(order.total_kwd))` → `float(order.total_kwd)`
- `number_items`: Changed from `str(sum(...))` → `sum(...)` (number type)
- **Why**: Snap CAPI expects numeric types, not strings
- **API Spec**: https://businesshelp.snapchat.com/s/article/conversions-api

#### Meta Conversions API (tracking_meta.py)
**Changes**:
- Contents array now excludes upsell items: `for item in items if not item.is_upsell`
- Matches content_ids exclusion logic
- **Why**: Upsells shouldn't be included in ROAS calculation
- **Impact**: More accurate attribution for primary products

---

## Event Deduplication Flow

### Purchase Event ID Generation & Tracking

```
1. Frontend Checkout
   ↓
2. UpsellModal.finalize()
   ├─ Generate purchaseEventId = uuid()
   ├─ Send to backend: finalizeOrder(purchaseEventId)
   ├─ Backend stores: order.event_id_purchase = purchaseEventId
   ├─ Frontend fires: firePurchase({ eventId: purchaseEventId })
   │  ├─ Meta: fbq('track', 'Purchase', {...}, { eventID: purchaseEventId })
   │  ├─ TikTok: ttq.track('CompletePayment', {...}, { event_id: purchaseEventId })
   │  └─ Snap: snaptr('track', 'PURCHASE', { client_dedup_id: purchaseEventId })
   ├─ sessionStorage.setItem(PURCHASE_EVENT_KEY, purchaseEventId)
   └─ Navigate to /thank-you?order_id=...
   
3. Thank-You Page
   └─ Logs: "Purchase event already tracked: <purchaseEventId>"

4. Backend Post-Finalize (asyncio.create_task)
   ├─ Meta CAPI: event_id = order.event_id_purchase
   ├─ TikTok CAPI: event_id = order.event_id_purchase
   └─ Snap CAPI: client_dedup_id = order.event_id_purchase
```

### Deduplication Windows

- **Meta Pixel + CAPI**: Event ID matching (exact match = dedup)
- **TikTok Pixel + CAPI**: `event_id` field (must match exactly)
- **Snap Pixel + CAPI**: `client_dedup_id` (48-hour dedup window) + `transaction_id` (30-day window)

---

## Phone Hashing

### Format Requirements

| Platform | Field | Input Format | Hash Input | Example |
|----------|-------|--------------|-----------|---------|
| Meta CAPI | `ph[]` | Digits with country code | No plus | `96551234567` |
| Snap CAPI | `hashed_phone_number` | Digits with country code | No plus | `96551234567` |
| TikTok CAPI | `phone_number` (in user) | E.164 with plus | With plus | `+96551234567` |

### Hashing Functions (backend/app/services/hashing.py)

```python
hash_meta_snap(digits_phone):     # "96551234567" → SHA256(...)
hash_tiktok(e164_phone):          # "+96551234567" → SHA256(...)
```

---

## Testing Checklist

### 1. Browser Pixel Loading
- [ ] Open DevTools → Console
- [ ] Check if `window.fbq`, `window.ttq`, `window.snaptr` are defined by page load (not lazy)
- [ ] Verify in Network tab: pixel scripts load with `afterInteractive` strategy

### 2. Purchase Event Flow
- [ ] Complete purchase from product → upsell → thank-you
- [ ] DevTools Console should show:
  ```
  [Meta] Purchase {...}
  [TikTok] CompletePayment {...}
  [Snap] PURCHASE {...}
  [Thank You] Purchase event already tracked: <UUID>
  ```

### 3. Event Deduplication
- [ ] Check Meta Events Manager: one Purchase event with matching event ID
- [ ] Check TikTok Ads Manager: one CompletePayment event with matching event ID
- [ ] Check Snap Events Manager: one PURCHASE event with matching client_dedup_id

### 4. CAPI Payload Validation
- [ ] Use browser Network tab to inspect POST requests:
  - Meta: `/v21.0/{PIXEL_ID}/events` → check `data[0].event_id`
  - TikTok: `/open_api/v1.3/pixel/track/` → check `event_id`
  - Snap: `/v2/conversion` → check `client_dedup_id`

### 5. Phone Advanced Matching
- [ ] Purchase with phone number
- [ ] Backend logs should show: `has_phone: true` for all platforms
- [ ] Snap logs should show either `setUser()` success or fallback to `init()`

### 6. Upsell Handling
- [ ] Complete purchase WITH upsell
- [ ] Backend CAPI Meta payload should exclude upsell from `contents` array
- [ ] Verify `content_ids` matches non-upsell products only

---

## Debugging Commands

### Check Purchase Event ID
```bash
# View stored purchase event ID
sessionStorage.getItem('mahdbaby_purchase_event_id')

# Check order in database
SELECT id, order_number, event_id_purchase FROM orders WHERE id = '<order_id>';
```

### Monitor CAPI Requests
```javascript
// In browser console, add request logger
const originalFetch = fetch;
window.fetch = function(...args) {
  if (args[0].includes('facebook.com') || args[0].includes('tiktok.com') || args[0].includes('snapchat.com')) {
    console.log('📡 CAPI Request:', args[0], args[1]?.body);
  }
  return originalFetch.apply(this, args);
};
```

### Backend Tracking Logs
```bash
# Check logs for tracking events
docker logs mahdbaby_api | grep -E "meta_capi|tiktok_capi|snap_capi"

# View specific order tracking
SELECT * FROM tracking_events WHERE order_id = '<order_id>';
```

---

## Known Issues & Workarounds

### Issue 1: TikTok Pixel Initialization Timeout
**Symptom**: `window.ttq` undefined after page load
**Cause**: Pixel script network delay
**Fix**: Added `if (!window.ttq) return` guard in all firing functions

### Issue 2: Snap `setUser` Not Available
**Symptom**: Snap throws error on setUser()
**Cause**: Older Snap SDK version
**Fix**: Added try-catch with fallback to re-init

### Issue 3: Duplicate Purchase Events on Page Reload
**Symptom**: Pixel sees 2x Purchase events
**Cause**: No deduplication on thank-you page reloads
**Fix**: Added sessionStorage check and dedup logging

---

## Next Steps (Future Improvements)

1. **Server-Side Pixel Tracking**: Consider deferring all pixel events to backend
2. **Event Queue**: Implement retry logic for failed CAPI requests
3. **Analytics Dashboard**: Build internal tracking dashboard for event dedup validation
4. **A/B Testing**: Test `client_dedup_id` randomization vs fixed UUID

---

## Rollback Instructions

If any issues occur, revert these files:
```bash
git revert HEAD --no-edit
```

Or manually revert:
1. `PixelScripts.tsx`: Change `afterInteractive` → `lazyOnload`
2. `events.ts`: Remove `setUser` try-catch, revert to direct init
3. `tracking_snap.py`: Convert back to strings for price/number_items
4. `tracking_meta.py`: Remove `if not item.is_upsell` filter from contents

