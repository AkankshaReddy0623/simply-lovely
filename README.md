# Third Umpire - AI Guard Dog 🐕

A real-time suspicious activity detection system that monitors user behavior, flags anomalies, and provides an intuitive interface for security teams to investigate threats.

## 🎯 Features

- **Real-time Monitoring**: Continuously tracks user activities and behaviors
- **AI-Powered Detection**: Uses machine learning to identify suspicious patterns
- **Beautiful Dashboard**: Modern, responsive UI with interactive visualizations
- **Alert System**: Instant notifications for security teams
- **Investigation Tools**: Comprehensive tools for security analysis
- **Pattern Recognition**: Identifies unusual login patterns, data access, and user behaviors

## 🏗️ Architecture

- **Backend**: Python with FastAPI for high-performance API
- **Frontend**: React with Material-UI for modern, responsive design
- **AI Engine**: Scikit-learn for anomaly detection algorithms
- **Real-time**: WebSocket connections for live monitoring
- **Database**: PostgreSQL for persistent storage

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (optional, uses SQLite by default)

### Installation

1. **Clone and setup Python backend:**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

2. **Setup React frontend:**
```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

3. **Access the application:**
- Frontend: http://localhost:5174 (or 5173 if available)
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📊 Dashboard Features

- **Live Activity Feed**: Real-time user activity monitoring
- **Threat Level Indicators**: Color-coded risk assessment
- **Geographic Heatmaps**: Visual representation of login locations
- **Behavioral Analytics**: User pattern analysis and deviation detection
- **Alert Management**: Prioritized security alerts with investigation tools

## 🔧 Configuration

Create a `.env` file in the root directory:
```env
DATABASE_URL=sqlite:///./third_umpire.db
SECRET_KEY=your-secret-key-here
DEBUG=True
```

## 🤝 Contributing

This project is built for a hackathon. Feel free to extend and improve!

## 📄 License

MIT License - feel free to use for your own projects!