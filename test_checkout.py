#!/usr/bin/env python3
import httpx
import json
import asyncio

async def test_order():
    payload = {
        'customer': {
            'name': 'Test Customer',
            'phone': '9650501020304'
        },
        'items': [{
            'productId': 'baby_head_protection_mask',
            'offerId': 'one_piece',
            'variantName': 'Test Variant',
            'color': 'Blue'
        }],
        'attribution': {
            'source': 'organic',
            'utmSource': 'direct'
        },
        'events': {
            'leadEventId': 'lead-123',
            'purchaseEventId': 'purchase-456'
        }
    }
    
    headers = {
        'X-Forwarded-For': '127.0.0.1',
        'Content-Type': 'application/json'
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'http://localhost:8000/orders',
            json=payload,
            headers=headers
        )
        print(f'Status: {response.status_code}')
        result = response.json()
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        if response.status_code == 201:
            print(f"\n✅ ORDER CREATED SUCCESS")
            print(f"Order Number: {result.get('orderNumber')}")
            print(f"Order ID: {result.get('orderId')}")
            print(f"Total: {result.get('totalKwd')} KWD")
            return True
        else:
            print(f"\n❌ ORDER FAILED")
            return False

if __name__ == '__main__':
    asyncio.run(test_order())
