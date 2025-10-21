#!/usr/bin/env python3
"""
Check available Gemini models - simple version
"""

import google.generativeai as genai

# Set the API key
genai.configure(api_key="AIzaSyDfXY3wV6GCLNRsUYPvO7N5Y_b40nCcRcg")

print("Available Gemini Models:")
print("=" * 40)

try:
    models = genai.list_models()
    available_models = []
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            available_models.append(model.name)
            print(f"Model: {model.name}")
            print(f"Display Name: {model.display_name}")
            print()
    
    print(f"Found {len(available_models)} models with generateContent support")
    
    # Try the first available model
    if available_models:
        model_name = available_models[0]
        print(f"Trying to use model: {model_name}")
        
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello, this is a test message")
        print(f"SUCCESS: Model {model_name} works!")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"Error: {e}")
