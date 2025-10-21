#!/usr/bin/env python3
"""
Check available Gemini models
"""

import google.generativeai as genai
import os

# Set the API key
genai.configure(api_key="AIzaSyDfXY3wV6GCLNRsUYPvO7N5Y_b40nCcRcg")

print("Available Gemini Models:")
print("=" * 40)

try:
    models = genai.list_models()
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            print(f"✅ {model.name}")
            print(f"   Display Name: {model.display_name}")
            print(f"   Description: {model.description}")
            print()
except Exception as e:
    print(f"Error: {e}")

print("\nTrying to use gemini-pro model...")
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello, test message")
    print("✅ gemini-pro model works!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ gemini-pro failed: {e}")
