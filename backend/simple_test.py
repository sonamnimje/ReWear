import requests

print("Testing backend...")
try:
    response = requests.get("http://127.0.0.1:8000/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}") 