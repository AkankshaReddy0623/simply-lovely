#!/usr/bin/env python3
"""
Test script to demonstrate enhanced AI features with Gemini integration
"""

import requests
import json
from datetime import datetime

def test_enhanced_ai_features():
    """Test the enhanced AI features with Gemini integration"""
    
    print("🤖 Testing Enhanced AI Features with Gemini Integration")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    
    # Test 1: AI Status Check
    print("\n1️⃣ Testing AI Status Check")
    print("-" * 30)
    
    response = requests.get(f"{base_url}/ai/status")
    if response.status_code == 200:
        status = response.json()
        print("✅ AI Status Check Successful!")
        print(f"   Traditional ML: {status['ai_services']['traditional_ml']}")
        print(f"   Gemini AI: {status['ai_services']['gemini_ai']}")
        print(f"   Enhanced Analysis: {status['ai_services']['enhanced_analysis']}")
        print(f"   Capabilities: {len([c for c in status['capabilities'] if c])} available")
    else:
        print(f"❌ AI Status Check Failed: {response.status_code}")
        return
    
    # Test 2: Enhanced Activity Analysis
    print("\n2️⃣ Testing Enhanced Activity Analysis")
    print("-" * 40)
    
    # Create a suspicious activity for testing
    suspicious_activity = {
        "id": "test_suspicious_001",
        "user_id": "suspicious_user",
        "action": "privilege_escalation",
        "timestamp": datetime.now().isoformat(),
        "location": {"latitude": 51.5074, "longitude": -0.1278},  # London (unusual location)
        "user_role": "user",
        "success": False,
        "failed_attempts": 5,
        "ip_address": "203.0.113.1",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "session_id": "sess_suspicious_001"
    }
    
    print(f"   Testing suspicious activity: {suspicious_activity['action']}")
    print(f"   User: {suspicious_activity['user_id']}")
    print(f"   Failed attempts: {suspicious_activity['failed_attempts']}")
    
    response = requests.post(f"{base_url}/ai/analyze-activity", json=suspicious_activity)
    if response.status_code == 200:
        analysis = response.json()
        print("✅ Enhanced Activity Analysis Successful!")
        print(f"   ML Score: {analysis['analysis']['ml_anomaly_score']:.3f}")
        print(f"   Combined Score: {analysis['analysis']['combined_risk_score']:.3f}")
        print(f"   Threat Level: {analysis['analysis']['threat_level']}")
        
        if 'gemini_analysis' in analysis['analysis']:
            gemini_data = analysis['analysis']['gemini_analysis']
            if 'explanation' in gemini_data:
                print(f"   AI Explanation: {gemini_data['explanation'][:150]}...")
            if 'recommendations' in gemini_data:
                print(f"   AI Recommendations: {len(gemini_data['recommendations'])} provided")
    else:
        print(f"❌ Enhanced Activity Analysis Failed: {response.status_code}")
    
    # Test 3: Threat Intelligence
    print("\n3️⃣ Testing Threat Intelligence Analysis")
    print("-" * 40)
    
    response = requests.get(f"{base_url}/ai/threat-intelligence")
    if response.status_code == 200:
        threat_data = response.json()
        print("✅ Threat Intelligence Analysis Successful!")
        print(f"   Threat Level: {threat_data['threat_level']}")
        print(f"   Alert Count: {threat_data['alert_count']}")
        print(f"   Summary: {threat_data['summary']}")
        print(f"   Recommendations: {len(threat_data['recommendations'])} provided")
    else:
        print(f"❌ Threat Intelligence Analysis Failed: {response.status_code}")
    
    # Test 4: Security Report Generation
    print("\n4️⃣ Testing Security Report Generation")
    print("-" * 40)
    
    response = requests.get(f"{base_url}/ai/security-report?time_period=24h")
    if response.status_code == 200:
        report_data = response.json()
        print("✅ Security Report Generation Successful!")
        report_text = report_data['report']['report']
        print(f"   Report Length: {len(report_text)} characters")
        print(f"   Period: {report_data['report']['period']}")
        print(f"   AI Model: {report_data['report']['ai_model']}")
        print(f"   Preview: {report_text[:200]}...")
    else:
        print(f"❌ Security Report Generation Failed: {response.status_code}")
    
    # Test 5: Generate Demo Data and Test Alert Insights
    print("\n5️⃣ Testing Alert Insights with Demo Data")
    print("-" * 40)
    
    # First generate some demo data
    response = requests.post(f"{base_url}/demo/generate")
    if response.status_code == 200:
        demo_data = response.json()
        print(f"✅ Demo data generated: {demo_data['activities_created']} activities")
        
        # Get recent alerts
        response = requests.get(f"{base_url}/alerts?limit=5")
        if response.status_code == 200:
            alerts_data = response.json()
            alerts = alerts_data['alerts']
            
            if alerts:
                # Test alert insights on the first alert
                alert_id = alerts[0]['id']
                print(f"   Testing alert insights for alert: {alert_id}")
                
                response = requests.get(f"{base_url}/ai/alert-insights/{alert_id}")
                if response.status_code == 200:
                    insights = response.json()
                    print("✅ Alert Insights Generation Successful!")
                    insight_text = insights['insights']['explanation']
                    print(f"   Insight Length: {len(insight_text)} characters")
                    print(f"   Preview: {insight_text[:200]}...")
                else:
                    print(f"❌ Alert Insights Generation Failed: {response.status_code}")
            else:
                print("   No alerts available for testing")
        else:
            print(f"❌ Failed to get alerts: {response.status_code}")
    else:
        print(f"❌ Demo data generation failed: {response.status_code}")
    
    print("\n" + "=" * 60)
    print("🎉 Enhanced AI Testing Complete!")
    print("\n🚀 Your Third Umpire system now has full Gemini AI capabilities!")
    print("   • Natural language threat explanations")
    print("   • AI-generated security reports") 
    print("   • Enhanced behavioral analysis")
    print("   • Intelligent alert insights")
    print("   • Advanced threat intelligence")

if __name__ == "__main__":
    test_enhanced_ai_features()
