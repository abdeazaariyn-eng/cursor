import urllib.request
import base64

url = "http://localhost:8000/admin/metrics"
username = "admin"
password = "mahdbaby123"

# Encode credentials
credentials = f"{username}:{password}"
base64_credentials = base64.b64encode(credentials.encode("utf-8")).decode("ascii")

req = urllib.request.Request(url)
req.add_header("Authorization", f"Basic {base64_credentials}")

try:
    response = urllib.request.urlopen(req)
    print(f"Status Code: {response.status}")
    print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"Status Code: {e.code}")
    print(f"Response: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
