#!/usr/bin/env python3
"""Test complete checkout flow: create order → upsell → finalize"""
import httpx
import json
import asyncio

async def test_full_checkout():
    headers = {'X-Forwarded-For': '127.0.0.1', 'Content-Type': 'application/json'}
    
    async with httpx.AsyncClient() as client:
        # Step 1: Create order
        print("=" * 60)
        print("STEP 1: Create Order")
        print("=" * 60)
        
        create_payload = {
            'customer': {
                'name': 'Ahmed Test',
                'phone': '9650501020304'
            },
            'items': [{
                'productId': 'baby_head_protection_mask',
                'offerId': 'one_piece',
                'variantName': 'Test Variant',
                'color': 'Pink'
            }],
            'attribution': {'source': 'direct'},
            'events': {
                'leadEventId': 'lead-test-001',
                'purchaseEventId': 'purchase-test-001'
            }
        }
        
        resp = await client.post(
            'http://localhost:8000/orders',
            json=create_payload,
            headers=headers
        )
        print(f"Status: {resp.status_code}")
        order = resp.json()
        print(json.dumps(order, indent=2, ensure_ascii=False))
        
        if resp.status_code != 201:
            print("❌ Order creation failed")
            return False
        
        order_id = order['orderId']
        print(f"\n✅ Order created: {order['orderNumber']}")
        
        # Step 2: Handle upsell
        print("\n" + "=" * 60)
        print("STEP 2: Skip Upsell")
        print("=" * 60)
        
        upsell_payload = {'action': 'skipped'}
        resp = await client.patch(
            f'http://localhost:8000/orders/{order_id}/upsell',
            json=upsell_payload,
            headers=headers
        )
        print(f"Status: {resp.status_code}")
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
        
        if resp.status_code != 200:
            print("❌ Upsell handling failed")
            return False
        
        print("\n✅ Upsell skipped")
        
        # Step 3: Finalize order (triggers Google Sheets webhook)
        print("\n" + "=" * 60)
        print("STEP 3: Finalize Order → Google Sheets")
        print("=" * 60)
        
        finalize_payload = {
            'purchaseEventId': 'purchase-test-001',
            'browserEventSent': True
        }
        resp = await client.post(
            f'http://localhost:8000/orders/{order_id}/finalize',
            json=finalize_payload,
            headers=headers
        )
        print(f"Status: {resp.status_code}")
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
        
        if resp.status_code != 200:
            print("❌ Order finalization failed")
            return False
        
        print("\n✅ Order finalized - Google Sheets webhook should be sent")
        print(f"\n📌 Check Google Sheets for order: {order['orderNumber']}")
        print(f"   Date: Today")
        print(f"   Customer: Ahmed Test")
        print(f"   Phone: 9650501020304")
        print(f"   Total: 19 KWD")
        
        return True

if __name__ == '__main__':
    success = asyncio.run(test_full_checkout())
    print("\n" + "=" * 60)
    if success:
        print("✅ FULL CHECKOUT TEST PASSED")
    else:
        print("❌ FULL CHECKOUT TEST FAILED")
    print("=" * 60)
