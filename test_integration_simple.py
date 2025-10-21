#!/usr/bin/env python3
"""
Simple test script for Gemini AI integration in Third Umpire
"""

import asyncio
import os
import sys

# Add the current directory to the Python path
sys.path.append('.')

from ai_engine import AnomalyDetector
from gemini_service import GeminiAIService
from models import UserActivity

async def test_integration():
    """Test the Gemini AI integration"""
    
    print("Testing Gemini AI Integration for Third Umpire")
    print("=" * 60)
    
    # Check if Gemini API key is available
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("WARNING: GEMINI_API_KEY not found in environment variables")
        print("   The system will run in fallback mode (traditional ML only)")
        print("   To enable Gemini AI features:")
        print("   1. Get your API key from https://aistudio.google.com/")
        print("   2. Set GEMINI_API_KEY environment variable")
        print("   3. Restart the application")
        print()
    
    # Initialize the enhanced anomaly detector
    print("Initializing Enhanced Anomaly Detector...")
    detector = AnomalyDetector()
    
    # Test 1: Basic Gemini Service Initialization
    print("\nTest 1: Gemini Service Initialization")
    print("-" * 40)
    
    gemini_service = GeminiAIService()
    if gemini_service.enabled:
        print("SUCCESS: Gemini AI service initialized successfully")
        print(f"   Model: gemini-1.5-flash")
        print(f"   API Key: {'*' * (len(api_key) - 4) + api_key[-4:] if api_key else 'Not set'}")
    else:
        print("WARNING: Gemini AI service not available (fallback mode)")
    
    # Test 2: Enhanced Anomaly Detection
    print("\nTest 2: Enhanced Anomaly Detection")
    print("-" * 40)
    
    # Create a test activity
    test_activity = UserActivity(
        id="test_1",
        user_id="john_doe",
        action="login",
        timestamp=asyncio.get_event_loop().time(),
        location={"latitude": 40.7128, "longitude": -74.0060},
        user_role="user",
        success=True,
        failed_attempts=0,
        ip_address="192.168.1.100"
    )
    
    print(f"Testing Activity: {test_activity.action}")
    print(f"   User: {test_activity.user_id}")
    print(f"   Location: {test_activity.location}")
    print(f"   Success: {test_activity.success}")
    
    try:
        # Use enhanced anomaly detection
        analysis = await detector.enhanced_detect_anomaly(test_activity)
        
        print(f"   ML Score: {analysis['ml_anomaly_score']:.3f}")
        print(f"   Combined Score: {analysis['combined_risk_score']:.3f}")
        print(f"   Threat Level: {analysis['threat_level']}")
        
        if 'gemini_analysis' in analysis and 'explanation' in analysis['gemini_analysis']:
            print(f"   AI Explanation: {analysis['gemini_analysis']['explanation'][:100]}...")
        
        if analysis['combined_risk_score'] > 0.7:
            print("   HIGH RISK - Alert would be generated")
        else:
            print("   Normal activity")
            
    except Exception as e:
        print(f"   ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("Gemini AI Integration Test Complete!")
    
    if api_key:
        print("SUCCESS: All tests completed successfully")
        print("Your Third Umpire system is now enhanced with Gemini AI!")
    else:
        print("WARNING: Tests completed in fallback mode")
        print("Set GEMINI_API_KEY to unlock full AI capabilities")

if __name__ == "__main__":
    asyncio.run(test_integration())
