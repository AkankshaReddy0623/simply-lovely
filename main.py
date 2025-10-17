"""
Third Umpire - AI Guard Dog System
Main application entry point for the AI-driven security monitoring system.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import asyncio
import json
from datetime import datetime
from typing import List, Dict, Any
import logging

from ai_engine import AnomalyDetector
from models import UserActivity, Alert, SecurityEvent
from database import DatabaseManager
from websocket_manager import ConnectionManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize components
db_manager = DatabaseManager()
anomaly_detector = AnomalyDetector()
websocket_manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the system on startup"""
    logger.info("🐕 Third Umpire - AI Guard Dog starting up...")
    
    # Initialize database
    await db_manager.init_db()
    
    # Train the anomaly detection model with sample data
    await anomaly_detector.train_model()
    
    logger.info("✅ System initialized successfully!")
    yield
    # Cleanup code here if needed

# Initialize FastAPI app
app = FastAPI(
    title="Third Umpire - AI Guard Dog",
    description="Real-time suspicious activity detection system",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Third Umpire - AI Guard Dog",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "anomaly_detector": "operational",
        "database": "connected",
        "websockets": "active"
    }

@app.post("/api/activities")
async def log_activity(activity: UserActivity):
    """Log user activity for monitoring"""
    try:
        # Store activity in database
        await db_manager.store_activity(activity)
        
        # Analyze for anomalies
        anomaly_score = await anomaly_detector.detect_anomaly(activity)
        
        # If anomaly detected, create alert
        if anomaly_score > 0.7:  # Threshold for suspicious activity
            alert = Alert(
                activity_id=activity.id,
                user_id=activity.user_id,
                severity="high" if anomaly_score > 0.9 else "medium",
                anomaly_score=anomaly_score,
                description=f"Suspicious activity detected: {activity.action}",
                timestamp=datetime.now()
            )
            
            await db_manager.store_alert(alert)
            
            # Broadcast alert to connected clients
            await websocket_manager.broadcast_alert(alert.dict())
            
            logger.warning(f"🚨 Alert generated: {alert.description}")
        
        return {
            "status": "logged",
            "anomaly_score": anomaly_score,
            "alert_generated": anomaly_score > 0.7
        }
        
    except Exception as e:
        logger.error(f"Error logging activity: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/alerts")
async def get_alerts(limit: int = 50):
    """Get recent security alerts"""
    alerts = await db_manager.get_recent_alerts(limit)
    return {"alerts": [alert.dict() for alert in alerts]}

@app.get("/api/activities/recent")
async def get_recent_activities(limit: int = 100):
    """Get recent user activities"""
    activities = await db_manager.get_recent_activities(limit)
    return {"activities": [activity.dict() for activity in activities]}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    stats = await db_manager.get_dashboard_stats()
    return stats.dict()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)

@app.post("/api/demo/generate")
async def generate_demo_data():
    """Generate demo data for testing"""
    try:
        demo_activities = db_manager.generate_demo_activities()
        return {
            "message": "Demo data generated",
            "activities_created": len(demo_activities)
        }
    except Exception as e:
        logger.error(f"Error generating demo data: {e}")
        return {
            "message": "Error generating demo data",
            "error": str(e),
            "activities_created": 0
        }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
