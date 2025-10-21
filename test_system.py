#!/usr/bin/env python3
"""
Third Umpire - AI Guard Dog System - Comprehensive Test Suite
Tests all system components including traditional ML and enhanced AI features.

Run this script to verify that all components are working correctly:
- Backend API endpoints
- Database operations
- AI engine functionality
- Gemini AI integration (if API key is set)

Author: Third Umpire Team
Version: 2.0.0 (Enhanced with Gemini AI)
"""

import requests
import json
from datetime import datetime
import os

def test_system():
    """Comprehensive system test"""
    
    print("Third Umpire - AI Guard Dog System Test Suite")
    print("=" * 60)
    
    base_url = "http://localhost:8000"
    api_url = f"{base_url}/api"
    
    tests_passed = 0
    tests_total = 0
    
    # Test 1: Health Check
    tests_total += 1
    print(f"\n{tests_total}. Testing System Health")
    print("-" * 40)
    try:
        response = requests.get(f"{api_url}/health", timeout=5)
        if response.status_code == 200:
            print("SUCCESS: System health check passed")
            tests_passed += 1
        else:
            print(f"FAILED: Health check returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: Health check failed - {e}")
    
    # Test 2: Dashboard Statistics
    tests_total += 1
    print(f"\n{tests_total}. Testing Dashboard Statistics")
    print("-" * 40)
    try:
        response = requests.get(f"{api_url}/dashboard/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Dashboard stats retrieved")
            print(f"   Total activities: {data.get('total_activities', 'N/A')}")
            print(f"   Active alerts: {data.get('active_alerts', 'N/A')}")
            tests_passed += 1
        else:
            print(f"FAILED: Dashboard stats returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: Dashboard stats failed - {e}")
    
    # Test 3: AI Status Check
    tests_total += 1
    print(f"\n{tests_total}. Testing AI System Status")
    print("-" * 40)
    try:
        response = requests.get(f"{api_url}/ai/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: AI status check passed")
            print(f"   Traditional ML: {data['ai_services']['traditional_ml']}")
            print(f"   Gemini AI: {data['ai_services']['gemini_ai']}")
            print(f"   Enhanced Analysis: {data['ai_services']['enhanced_analysis']}")
            tests_passed += 1
        else:
            print(f"FAILED: AI status check returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: AI status check failed - {e}")
    
    # Test 4: Threat Intelligence
    tests_total += 1
    print(f"\n{tests_total}. Testing Threat Intelligence")
    print("-" * 40)
    try:
        response = requests.get(f"{api_url}/ai/threat-intelligence", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Threat intelligence retrieved")
            print(f"   Threat level: {data.get('threat_level', 'N/A')}")
            print(f"   Alert count: {data.get('alert_count', 'N/A')}")
            tests_passed += 1
        else:
            print(f"FAILED: Threat intelligence returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: Threat intelligence failed - {e}")
    
    # Test 5: Demo Data Generation
    tests_total += 1
    print(f"\n{tests_total}. Testing Demo Data Generation")
    print("-" * 40)
    try:
        response = requests.post(f"{api_url}/demo/generate", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Demo data generated")
            print(f"   Activities created: {data.get('activities_created', 'N/A')}")
            tests_passed += 1
        else:
            print(f"FAILED: Demo data generation returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: Demo data generation failed - {e}")
    
    # Test 6: Recent Activities
    tests_total += 1
    print(f"\n{tests_total}. Testing Recent Activities")
    print("-" * 40)
    try:
        response = requests.get(f"{api_url}/activities/recent?limit=5", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Recent activities retrieved")
            print(f"   Activities count: {len(data.get('activities', []))}")
            tests_passed += 1
        else:
            print(f"FAILED: Recent activities returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: Recent activities failed - {e}")
    
    # Test 7: Recent Alerts
    tests_total += 1
    print(f"\n{tests_total}. Testing Recent Alerts")
    print("-" * 40)
    try:
        response = requests.get(f"{api_url}/alerts?limit=5", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Recent alerts retrieved")
            print(f"   Alerts count: {len(data.get('alerts', []))}")
            tests_passed += 1
        else:
            print(f"FAILED: Recent alerts returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: Recent alerts failed - {e}")
    
    # Test 8: Enhanced Activity Analysis
    tests_total += 1
    print(f"\n{tests_total}. Testing Enhanced Activity Analysis")
    print("-" * 40)
    try:
        test_activity = {
            "id": "test_analysis_001",
            "user_id": "test_user",
            "action": "login",
            "timestamp": datetime.now().isoformat(),
            "location": {"latitude": 40.7128, "longitude": -74.0060},
            "user_role": "user",
            "success": True,
            "failed_attempts": 0,
            "ip_address": "192.168.1.100"
        }
        
        response = requests.post(f"{api_url}/ai/analyze-activity", json=test_activity, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Enhanced activity analysis completed")
            print(f"   Threat level: {data['analysis'].get('threat_level', 'N/A')}")
            print(f"   Combined score: {data['analysis'].get('combined_risk_score', 'N/A')}")
            tests_passed += 1
        else:
            print(f"FAILED: Enhanced activity analysis returned {response.status_code}")
    except Exception as e:
        print(f"ERROR: Enhanced activity analysis failed - {e}")
    
    # Final Results
    print("\n" + "=" * 60)
    print("Third Umpire System Test Results")
    print("=" * 60)
    print(f"Tests Passed: {tests_passed}/{tests_total}")
    print(f"Success Rate: {(tests_passed/tests_total)*100:.1f}%")
    
    # Check API key status
    if os.getenv('GEMINI_API_KEY'):
        print("SUCCESS: Gemini API key is configured - Full AI features available")
    else:
        print("WARNING: Gemini API key not set - AI features will use fallback mode")
        print("   Set GEMINI_API_KEY environment variable to enable full AI features")
    
    # System status
    if tests_passed == tests_total:
        print("\nSUCCESS: All tests passed! System is fully operational.")
        print("READY: Your Third Umpire AI Guard Dog system is ready for use!")
    elif tests_passed >= tests_total * 0.8:
        print(f"\nSUCCESS: Most tests passed ({tests_passed}/{tests_total}). System is operational.")
        print("INFO: Some features may need attention.")
    else:
        print(f"\nWARNING: Several tests failed ({tests_total - tests_passed}/{tests_total}).")
        print("INFO: Please check the system configuration and try again.")
    
    print(f"\nSYSTEM STATUS: {'OPERATIONAL' if tests_passed >= tests_total * 0.8 else 'NEEDS ATTENTION'}")
    
    return tests_passed == tests_total

if __name__ == "__main__":
    test_system()
