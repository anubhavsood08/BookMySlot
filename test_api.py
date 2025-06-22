import requests
import json

def test_create_event():
    url = "http://127.0.0.1:8000/events/"
    data = {
        "title": "Test Event",
        "description": "Test Description",
        "time_slots": ["2024-01-15T10:00:00"],
        "max_bookings_per_slot": 1
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Event created successfully!")
        else:
            print("❌ Failed to create event")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_create_event() 