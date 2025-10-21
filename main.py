"""
Third Umpire - AI Guard Dog System
Main application entry point for the AI-driven security monitoring system.

Enhanced with Google Gemini AI integration for advanced threat analysis,
natural language explanations, and intelligent security insights.

Features:
- Real-time user activity monitoring
- AI-powered anomaly detection (ML + Gemini AI)
- Enhanced alert system with natural language explanations
- Comprehensive security dashboard
- WebSocket-based real-time updates
- Fallback mode when AI services are unavailable

Author: Third Umpire Team
Version: 2.0.0 (Enhanced with Gemini AI)
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
from pydantic import BaseModel

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
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000"
    ],
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
        "websockets": "active",
        "active_connections": websocket_manager.get_connection_count()
    }

@app.get("/api/websocket/status")
async def websocket_status():
    """Get WebSocket connection status and info"""
    return {
        "active_connections": websocket_manager.get_connection_count(),
        "connections": websocket_manager.get_connection_info()
    }

@app.post("/api/websocket/test")
async def test_websocket_broadcast():
    """Test WebSocket broadcasting"""
    try:
        test_message = {
            "type": "test",
            "data": {
                "message": "WebSocket test broadcast",
                "timestamp": datetime.now().isoformat()
            }
        }
        await websocket_manager.broadcast_custom_event("test", test_message["data"])
        return {"status": "success", "message": "Test broadcast sent"}
    except Exception as e:
        logger.error(f"Error testing WebSocket broadcast: {e}")
        return {"status": "error", "message": str(e)}

@app.post("/api/activities")
async def log_activity(activity: UserActivity):
    """Log user activity for monitoring"""
    try:
        # Store activity in database
        await db_manager.store_activity(activity)
        
        # Use enhanced anomaly detection with Gemini AI
        enhanced_analysis = await anomaly_detector.enhanced_detect_anomaly(activity)
        combined_score = enhanced_analysis.get('combined_risk_score', 0.0)
        
        # If anomaly detected, create alert with Gemini insights
        if combined_score > 0.7:  # Threshold for suspicious activity
            alert = Alert(
                activity_id=activity.id,
                user_id=activity.user_id,
                severity="high" if combined_score > 0.9 else "medium",
                anomaly_score=combined_score,
                description=f"Suspicious activity detected: {activity.action}",
                timestamp=datetime.now()
            )
            
            await db_manager.store_alert(alert)
            
            # Generate AI-powered alert insights
            alert_insights = await anomaly_detector.generate_alert_insights(alert.dict())
            
            # Broadcast alert with insights to connected clients
            alert_data = alert.dict()
            alert_data['ai_insights'] = alert_insights
            await websocket_manager.broadcast_alert(alert_data)
            
            logger.warning(f"🚨 Enhanced alert generated: {alert.description}")
        
        return {
            "status": "logged",
            "enhanced_analysis": enhanced_analysis,
            "alert_generated": combined_score > 0.7
        }
        
    except Exception as e:
        logger.error(f"Error logging activity: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/alerts")
async def get_alerts(limit: int = 50):
    """Get recent security alerts"""
    alerts = await db_manager.get_recent_alerts(limit)
    return {"alerts": [alert.dict() for alert in alerts]}

@app.get("/api/analytics")
async def get_analytics(time_period: str = "24h", range: str | None = None):
    """Analytics summary used by frontend analytics page"""
    # Support both `time_period` and legacy `range` query param from frontend
    effective = range or time_period
    summary = await db_manager.get_analytics_summary(effective)
    return summary

@app.get("/api/activities/user/{user_id}")
async def get_user_activities(user_id: str, limit: int = 100):
    activities = await db_manager.get_user_activities(user_id, limit)
    return {"activities": [a.dict() for a in activities]}

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
            try:
                # Try to receive text message
                data = await websocket.receive_text()
                logger.info(f"Received WebSocket message: {data}")
                await websocket_manager.handle_client_message(websocket, data)
            except WebSocketDisconnect:
                break
            except Exception as e:
                logger.error(f"Error receiving WebSocket message: {e}")
                # Try to keep connection alive
                await asyncio.sleep(0.1)
                
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
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

# New Gemini AI-powered endpoints

@app.post("/api/ai/analyze-activity")
async def analyze_activity_with_ai(activity: UserActivity):
    """Analyze user activity using enhanced AI (Gemini + ML)"""
    try:
        enhanced_analysis = await anomaly_detector.enhanced_detect_anomaly(activity)
        return {
            "status": "success",
            "analysis": enhanced_analysis
        }
    except Exception as e:
        logger.error(f"Error in AI activity analysis: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/ai/alert-insights/{alert_id}")
async def get_alert_insights(alert_id: str):
    """Get AI-powered insights for a specific alert"""
    try:
        alert = await db_manager.get_alert_by_id(alert_id)
        if not alert:
            return {"status": "error", "message": "Alert not found"}
        
        insights = await anomaly_detector.generate_alert_insights(alert.dict())
        return {
            "status": "success",
            "alert_id": alert_id,
            "insights": insights
        }
    except Exception as e:
        logger.error(f"Error getting alert insights: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/ai/user-profile/{user_id}")
async def get_user_ai_profile(user_id: str, limit: int = 100):
    """Get AI-powered user behavior profile"""
    try:
        activities = await db_manager.get_user_activities(user_id, limit)
        profile_analysis = await anomaly_detector.analyze_user_profile(user_id, activities)
        return {
            "status": "success",
            "user_id": user_id,
            "profile": profile_analysis
        }
    except Exception as e:
        logger.error(f"Error getting user AI profile: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/ai/security-report")
async def generate_security_report(time_period: str = "24h"):
    """Generate AI-powered security report"""
    try:
        report = await anomaly_detector.gemini_service.generate_security_report(time_period)
        return {
            "status": "success",
            "report": report
        }
    except Exception as e:
        logger.error(f"Error generating security report: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/ai/threat-intelligence")
async def get_threat_intelligence():
    """Get current threat intelligence analysis"""
    try:
        # Get recent high-risk activities
        alerts = await db_manager.get_recent_alerts(limit=20)
        high_risk_alerts = [alert for alert in alerts if alert.anomaly_score > 0.8]
        
        if not high_risk_alerts:
            return {
                "status": "success",
                "threat_level": "LOW",
                "summary": "No high-risk threats detected in recent activity",
                "recommendations": ["Continue monitoring", "Maintain current security posture"]
            }
        
        # Analyze threat patterns
        threat_analysis = {
            "status": "success",
            "threat_level": "HIGH" if any(a.anomaly_score > 0.9 for a in high_risk_alerts) else "MEDIUM",
            "alert_count": len(high_risk_alerts),
            "recent_alerts": [alert.dict() for alert in high_risk_alerts[:5]],
            "summary": f"Detected {len(high_risk_alerts)} high-risk alerts requiring attention",
            "recommendations": [
                "Review high-priority alerts immediately",
                "Investigate user behavior patterns",
                "Consider enhanced monitoring for affected users"
            ]
        }
        
        return threat_analysis
        
    except Exception as e:
        logger.error(f"Error getting threat intelligence: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/ai/status")
async def get_ai_status():
    """Get AI service status and capabilities"""
    try:
        gemini_enabled = anomaly_detector.gemini_service.enabled
        return {
            "status": "success",
            "ai_services": {
                "traditional_ml": "operational",
                "gemini_ai": "operational" if gemini_enabled else "unavailable",
                "enhanced_analysis": "available" if gemini_enabled else "limited"
            },
            "capabilities": [
                "Anomaly detection",
                "Behavioral analysis",
                "Threat intelligence" if gemini_enabled else None,
                "Natural language explanations" if gemini_enabled else None,
                "Security reporting" if gemini_enabled else None
            ],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting AI status: {e}")
        return {"status": "error", "message": str(e)}

# Alert Management Endpoints
class UpdateAlertRequest(BaseModel):
    status: str | None = None
    investigation_notes: str | None = None
    false_positive: bool | None = None

@app.patch("/api/alerts/{alert_id}")
async def update_alert(alert_id: str, body: UpdateAlertRequest):
    """Update alert status and add investigation notes"""
    try:
        updated = await db_manager.update_alert(
            alert_id,
            status=body.status,
            investigation_notes=body.investigation_notes,
            false_positive=body.false_positive
        )
        if not updated:
            return {"status": "error", "message": "Alert not found or not updated"}
        return {"status": "success", "alert_id": alert_id}
    except Exception as e:
        logger.error(f"Error updating alert: {e}")
        return {"status": "error", "message": str(e)}

@app.delete("/api/alerts/{alert_id}")
async def dismiss_alert(alert_id: str):
    """Dismiss an alert"""
    try:
        ok = await db_manager.dismiss_alert(alert_id)
        if not ok:
            return {"status": "error", "message": "Alert not found"}
        return {"status": "success", "alert_id": alert_id}
    except Exception as e:
        logger.error(f"Error dismissing alert: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/alerts/{alert_id}")
async def get_alert_details(alert_id: str):
    """Get detailed information about a specific alert"""
    try:
        alert = await db_manager.get_alert_by_id(alert_id)
        if not alert:
            return {"status": "error", "message": "Alert not found"}
        return {"status": "success", "alert": alert.dict()}
    except Exception as e:
        logger.error(f"Error getting alert details: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/settings")
async def get_settings():
    try:
        settings = await db_manager.get_system_settings()
        return settings
    except Exception as e:
        logger.error(f"Error getting settings: {e}")
        return {"status": "error", "message": str(e)}

@app.put("/api/settings")
async def put_settings(settings: Dict[str, Any]):
    try:
        ok = await db_manager.update_system_settings(settings)
        if not ok:
            return {"status": "error", "message": "Failed to save settings"}
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error updating settings: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
