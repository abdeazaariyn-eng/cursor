import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = "https://api.mahdbaby.shop/orders/876a4aba-fc56-4d87-8906-e64f7a42e815/upsell"
headers = {
    "Origin": "https://mahdbaby.shop",
    "Access-Control-Request-Method": "PATCH",
    "Access-Control-Request-Headers": "content-type",
    "User-Agent": "Mozilla/5.0"
}

req = urllib.request.Request(url, method="OPTIONS", headers=headers)
try:
    with urllib.request.urlopen(req) as res:
        print("STATUS:", res.status)
        print("HEADERS:", res.headers)
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("ERROR HEADERS:", e.headers)
except Exception as e:
    print("ERROR:", e)
