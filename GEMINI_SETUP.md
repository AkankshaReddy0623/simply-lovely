# 🤖 Gemini AI Integration Setup Guide

## 📋 Prerequisites

1. **Google AI Studio Account**: Sign up at [Google AI Studio](https://aistudio.google.com/)
2. **API Key**: Generate your Gemini API key from the Google AI Studio console

## 🔧 Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL=sqlite:///./third_umpire.db
SECRET_KEY=your-secret-key-here
DEBUG=True

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Optional: Advanced Configuration
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

## 🚀 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to "Get API Key" section
4. Create a new API key or use an existing project
5. Copy the generated API key
6. Add it to your `.env` file as `GEMINI_API_KEY`

## 🔒 Security Best Practices

- **Never commit your `.env` file** to version control
- Keep your API key secure and rotate it regularly
- Use environment variables in production
- Monitor your API usage and costs

## 🧪 Testing the Integration

After setting up your API key, restart the application and check the logs for:
```
✅ Gemini AI service initialized successfully
```

If you see this message, the integration is working correctly!

## 📊 New Features Enabled

With Gemini AI integration, you now have access to:

- **Enhanced Threat Analysis**: AI-powered threat intelligence analysis
- **Natural Language Explanations**: Human-readable explanations for security alerts
- **Behavioral Pattern Analysis**: Advanced user behavior profiling
- **Intelligent Security Reports**: AI-generated security reports
- **Contextual Insights**: Rich context for security incidents

## 🔧 Troubleshooting

### Common Issues:

1. **"GEMINI_API_KEY not found"**: Make sure your `.env` file is in the project root and contains the API key
2. **API errors**: Check your API key validity and quota limits
3. **Import errors**: Run `pip install -r requirements.txt` to install the new dependencies

### Fallback Mode:

If Gemini AI is not available, the system will automatically fall back to traditional ML-based analysis, ensuring your security monitoring continues to work.
