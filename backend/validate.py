import requests

# API URLs
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/auth/login"
GET_USER_URL = f"{BASE_URL}/auth/user"

# Test credentials
email = "gandha@example.csosm"
password = "securepassword123"

# 1️⃣ Login API
def login(email, password):
    payload = {"email": email, "password": password}
    response = requests.post(LOGIN_URL, json=payload)
    
    if response.status_code == 200:
        print("✅ Login Successful!")
        return response.json()["token"]
    else:
        print(f"❌ Login Failed: {response.json()}")
        return None

# 2️⃣ Validate Token with Get User API
def get_user(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(GET_USER_URL, headers=headers)
    
    if response.status_code == 200:
        print("🎯 Token Valid! User Info:")
        print(response.json())
    else:
        print(f"⚠️ Token Invalid: {response.json()}")

# Main Execution
if __name__ == "__main__":
    token = login(email, password)
    if token:
        get_user(token)