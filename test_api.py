import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = "https://api.mahdbaby.shop//orders"
headers = {
    "Origin": "https://mahdbaby.shop",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0"
}

req_options = urllib.request.Request(url, method="OPTIONS", headers=headers)
try:
    with urllib.request.urlopen(req_options) as res:
        print("OPTIONS STATUS:", res.status)
except urllib.error.HTTPError as e:
    print("OPTIONS HTTP ERROR:", e.code)
    print("OPTIONS ERROR HEADERS:\n", e.headers)

