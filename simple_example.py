#!/usr/bin/env python3
"""
Simple example showing how Third Umpire works
"""

import requests
import json
import uuid

# Third Umpire server
API_URL = "http://localhost:8000"

def show_what_third_umpire_sees():
    """Show what Third Umpire is currently monitoring"""
    print("🔍 What Third Umpire Currently Sees:")
    print("=" * 50)
    
    # Get current stats
    response = requests.get(f"{API_URL}/api/dashboard/stats")
    if response.status_code == 200:
        stats = response.json()
        print(f"👥 Users Being Monitored: {stats['users_monitored']}")
        print(f"📊 Total Activities Tracked: {stats['total_activities']}")
        print(f"🚨 Active Security Alerts: {stats['active_alerts']}")
        print(f"🤖 System Status: {stats['system_uptime']}% uptime")
    
    print("\n📱 Dashboard: http://localhost:5173")
    print("📚 API Docs: http://localhost:8000/docs")

def simulate_normal_user():
    """Simulate a normal user doing normal things"""
    print("\n✅ Simulating NORMAL User Activity:")
    print("=" * 40)
    
    user_id = "normal_user_123"
    
    activities = [
        ("login", "192.168.1.100", "User logs in during normal hours"),
        ("view_data", "192.168.1.100", "User browses their account"),
        ("download", "192.168.1.100", "User downloads a document")
    ]
    
    for action, ip, description in activities:
        activity_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "action": action,
            "ip_address": ip,
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "user_role": "user",
            "success": True
        }
        
        try:
            response = requests.post(f"{API_URL}/api/activities", json=activity_data)
            if response.status_code == 200:
                result = response.json()
                print(f"✅ {description}")
                print(f"   AI Score: {result.get('anomaly_score', 'N/A')} (lower = more normal)")
            else:
                print(f"❌ Failed to track: {description}")
        except Exception as e:
            print(f"❌ Error: {e}")

def simulate_suspicious_user():
    """Simulate a suspicious user doing suspicious things"""
    print("\n🚨 Simulating SUSPICIOUS User Activity:")
    print("=" * 45)
    
    user_id = "suspicious_user_456"
    
    activities = [
        ("login", "203.0.113.15", "User tries to login at 3 AM"),
        ("login", "203.0.113.15", "Failed login attempt #1"),
        ("login", "203.0.113.15", "Failed login attempt #2"),
        ("login", "203.0.113.15", "Failed login attempt #3"),
        ("login", "203.0.113.15", "Failed login attempt #4"),
        ("login", "203.0.113.15", "Failed login attempt #5"),
    ]
    
    for i, (action, ip, description) in enumerate(activities):
        activity_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "action": action,
            "ip_address": ip,
            "user_agent": "curl/7.68.0",  # Command line tool (suspicious)
            "user_role": "user",
            "success": False,  # Failed login
            "failed_attempts": i + 1
        }
        
        try:
            response = requests.post(f"{API_URL}/api/activities", json=activity_data)
            if response.status_code == 200:
                result = response.json()
                print(f"🚨 {description}")
                print(f"   AI Score: {result.get('anomaly_score', 'N/A')} (higher = more suspicious)")
            else:
                print(f"❌ Failed to track: {description}")
        except Exception as e:
            print(f"❌ Error: {e}")

def check_for_alerts():
    """Check if any security alerts were generated"""
    print("\n🔍 Checking for Security Alerts:")
    print("=" * 35)
    
    try:
        response = requests.get(f"{API_URL}/api/alerts")
        if response.status_code == 200:
            alerts_data = response.json()
            alerts = alerts_data.get('alerts', [])
            
            if alerts:
                print(f"🚨 Found {len(alerts)} security alerts:")
                for alert in alerts:
                    print(f"   • {alert['severity'].upper()}: {alert['description']}")
                    print(f"     User: {alert['user_id']}")
                    print(f"     Time: {alert['timestamp']}")
            else:
                print("✅ No security alerts - everything looks normal")
        else:
            print(f"❌ Could not check alerts: {response.status_code}")
    except Exception as e:
        print(f"❌ Error checking alerts: {e}")

def explain_how_it_works():
    """Explain how Third Umpire works in simple terms"""
    print("\n🤔 How Third Umpire Works:")
    print("=" * 30)
    print("""
1. 📱 YOUR APP: Every time a user does something (login, download, etc.)
   → Your app sends a message to Third Umpire

2. 🤖 AI ANALYSIS: Third Umpire's AI looks at the activity and thinks:
   → "Is this normal behavior for this user?"
   → "Does this look suspicious?"
   → "Should I alert the security team?"

3. 🚨 ALERTS: If something looks suspicious:
   → Third Umpire immediately creates a security alert
   → Shows it on the dashboard
   → Can send notifications to security team

4. 📊 DASHBOARD: Security teams can:
   → See all current alerts
   → Look at user activity history
   → Investigate suspicious behavior
   → Take action if needed

Think of it like having a security guard who never sleeps and watches
every user on your website 24/7!
""")

if __name__ == "__main__":
    print("🐕 Third Umpire - Simple Example")
    print("=" * 50)
    
    show_what_third_umpire_sees()
    
    explain_how_it_works()
    
    simulate_normal_user()
    simulate_suspicious_user()
    
    print("\n⏳ Waiting 3 seconds for AI to process...")
    import time
    time.sleep(3)
    
    check_for_alerts()
    
    print("\n🌐 See the results:")
    print("📱 Dashboard: http://localhost:5173")
    print("📚 API Documentation: http://localhost:8000/docs")
