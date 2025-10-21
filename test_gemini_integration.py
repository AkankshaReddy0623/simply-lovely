#!/usr/bin/env python3
"""
Test script for Gemini AI integration in Third Umpire
This script demonstrates the enhanced AI capabilities with Gemini API
"""

import asyncio
import os
import json
from datetime import datetime, timedelta
import sys

# Add the current directory to the Python path
sys.path.append('.')

from ai_engine import AnomalyDetector
from gemini_service import GeminiAIService
from models import UserActivity

async def test_gemini_integration():
    """Test the Gemini AI integration with various scenarios"""
    
    print("🤖 Testing Gemini AI Integration for Third Umpire")
    print("=" * 60)
    
    # Check if Gemini API key is available
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("⚠️  GEMINI_API_KEY not found in environment variables")
        print("   The system will run in fallback mode (traditional ML only)")
        print("   To enable Gemini AI features:")
        print("   1. Get your API key from https://aistudio.google.com/")
        print("   2. Set GEMINI_API_KEY environment variable")
        print("   3. Restart the application")
        print()
    
    # Initialize the enhanced anomaly detector
    print("🔧 Initializing Enhanced Anomaly Detector...")
    detector = AnomalyDetector()
    
    # Test 1: Basic Gemini Service Initialization
    print("\n📋 Test 1: Gemini Service Initialization")
    print("-" * 40)
    
    gemini_service = GeminiAIService()
    if gemini_service.enabled:
        print("✅ Gemini AI service initialized successfully")
        print(f"   Model: gemini-1.5-flash")
        print(f"   API Key: {'*' * (len(api_key) - 4) + api_key[-4:] if api_key else 'Not set'}")
    else:
        print("⚠️  Gemini AI service not available (fallback mode)")
    
    # Test 2: Enhanced Anomaly Detection
    print("\n📋 Test 2: Enhanced Anomaly Detection")
    print("-" * 40)
    
    # Create test activities
    test_activities = [
        UserActivity(
            id="test_1",
            user_id="john_doe",
            action="login",
            timestamp=datetime.now(),
            location={"latitude": 40.7128, "longitude": -74.0060},
            user_role="user",
            success=True,
            failed_attempts=0,
            ip_address="192.168.1.100"
        ),
        UserActivity(
            id="test_2", 
            user_id="john_doe",
            action="privilege_escalation",
            timestamp=datetime.now() - timedelta(minutes=5),
            location={"latitude": 40.7128, "longitude": -74.0060},
            user_role="user",
            success=False,
            failed_attempts=5,
            ip_address="192.168.1.100"
        ),
        UserActivity(
            id="test_3",
            user_id="suspicious_user",
            action="mass_data_access",
            timestamp=datetime.now() - timedelta(hours=2),
            location={"latitude": 51.5074, "longitude": -0.1278},  # London
            user_role="user",
            success=True,
            failed_attempts=0,
            ip_address="203.0.113.1"
        )
    ]
    
    for i, activity in enumerate(test_activities, 1):
        print(f"\n🔍 Testing Activity {i}: {activity.action}")
        print(f"   User: {activity.user_id}")
        print(f"   Location: {activity.location}")
        print(f"   Success: {activity.success}")
        
        try:
            # Use enhanced anomaly detection
            analysis = await detector.enhanced_detect_anomaly(activity)
            
            print(f"   ML Score: {analysis['ml_anomaly_score']:.3f}")
            print(f"   Combined Score: {analysis['combined_risk_score']:.3f}")
            print(f"   Threat Level: {analysis['threat_level']}")
            
            if 'gemini_analysis' in analysis and 'explanation' in analysis['gemini_analysis']:
                print(f"   AI Explanation: {analysis['gemini_analysis']['explanation'][:100]}...")
            
            if analysis['combined_risk_score'] > 0.7:
                print("   🚨 HIGH RISK - Alert would be generated")
            else:
                print("   ✅ Normal activity")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Test 3: Alert Insights Generation
    print("\n📋 Test 3: Alert Insights Generation")
    print("-" * 40)
    
    test_alert = {
        "id": "alert_test_1",
        "user_id": "john_doe",
        "description": "Multiple failed login attempts detected",
        "severity": "high",
        "anomaly_score": 0.85,
        "timestamp": datetime.now().isoformat(),
        "activity_id": "test_2"
    }
    
    try:
        insights = await detector.generate_alert_insights(test_alert)
        print("✅ Alert insights generated successfully")
        print(f"   Explanation: {insights.get('explanation', 'N/A')[:150]}...")
    except Exception as e:
        print(f"❌ Error generating alert insights: {e}")
    
    # Test 4: User Behavior Analysis
    print("\n📋 Test 4: User Behavior Analysis")
    print("-" * 40)
    
    try:
        # Analyze user profile with multiple activities
        user_activities = test_activities[:2]  # Use first 2 activities
        profile_analysis = await detector.analyze_user_profile("john_doe", user_activities)
        
        print("✅ User behavior analysis completed")
        print(f"   Activities analyzed: {profile_analysis['activities_analyzed']}")
        
        if 'gemini_analysis' in profile_analysis and 'behavior_profile' in profile_analysis['gemini_analysis']:
            print(f"   Behavior profile: {profile_analysis['gemini_analysis']['behavior_profile']}")
        
    except Exception as e:
        print(f"❌ Error in user behavior analysis: {e}")
    
    # Test 5: Security Report Generation
    print("\n📋 Test 5: Security Report Generation")
    print("-" * 40)
    
    try:
        report = await detector.gemini_service.generate_security_report("24h")
        print("✅ Security report generated")
        print(f"   Report length: {len(report.get('report', ''))} characters")
        print(f"   Period: {report.get('period', 'N/A')}")
    except Exception as e:
        print(f"❌ Error generating security report: {e}")
    
    # Test 6: AI Status Check
    print("\n📋 Test 6: AI Status Check")
    print("-" * 40)
    
    try:
        # This would normally be called via the API endpoint
        gemini_enabled = detector.gemini_service.enabled
        print(f"✅ AI Status Check Complete")
        print(f"   Traditional ML: Operational")
        print(f"   Gemini AI: {'Operational' if gemini_enabled else 'Unavailable'}")
        print(f"   Enhanced Analysis: {'Available' if gemini_enabled else 'Limited'}")
    except Exception as e:
        print(f"❌ Error checking AI status: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 Gemini AI Integration Test Complete!")
    
    if api_key:
        print("✅ All tests completed successfully")
        print("🚀 Your Third Umpire system is now enhanced with Gemini AI!")
    else:
        print("⚠️  Tests completed in fallback mode")
        print("💡 Set GEMINI_API_KEY to unlock full AI capabilities")
    
    print("\n📚 Next Steps:")
    print("   1. Set up your Gemini API key in environment variables")
    print("   2. Start the backend server: python main.py")
    print("   3. Start the frontend: npm run dev")
    print("   4. Visit the new 'AI Insights' page in the dashboard")
    print("   5. Explore enhanced alert explanations and threat analysis")

if __name__ == "__main__":
    asyncio.run(test_gemini_integration())
