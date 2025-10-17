"""
Database management for Third Umpire - AI Guard Dog System
Handles data persistence and retrieval for user activities, alerts, and analytics.
"""

import sqlite3
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
from pathlib import Path

from models import UserActivity, Alert, SecurityEvent, DashboardStats, UserBehaviorProfile
import uuid

logger = logging.getLogger(__name__)

class DatabaseManager:
    """
    Manages database operations for the AI Guard Dog system.
    Uses SQLite for simplicity, but can be easily adapted for PostgreSQL.
    """
    
    def __init__(self, db_path: str = "third_umpire.db"):
        self.db_path = db_path
        self.connection = None
        
    async def init_db(self):
        """Initialize the database and create tables"""
        try:
            self.connection = sqlite3.connect(self.db_path)
            self.connection.row_factory = sqlite3.Row  # Enable dict-like access
            
            await self._create_tables()
            logger.info("✅ Database initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing database: {e}")
            raise
    
    async def _create_tables(self):
        """Create database tables"""
        cursor = self.connection.cursor()
        
        # User activities table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_activities (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                action TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                location TEXT,
                ip_address TEXT,
                user_agent TEXT,
                user_role TEXT,
                success BOOLEAN,
                failed_attempts INTEGER,
                session_id TEXT,
                device_fingerprint TEXT,
                additional_data TEXT
            )
        """)
        
        # Alerts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id TEXT PRIMARY KEY,
                activity_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                severity TEXT NOT NULL,
                anomaly_score REAL NOT NULL,
                description TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                status TEXT DEFAULT 'active',
                investigation_notes TEXT DEFAULT '',
                auto_resolved BOOLEAN DEFAULT FALSE,
                false_positive BOOLEAN DEFAULT FALSE,
                related_activities TEXT
            )
        """)
        
        # Security events table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS security_events (
                id TEXT PRIMARY KEY,
                event_type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                source_ip TEXT,
                target_resource TEXT,
                description TEXT NOT NULL,
                severity TEXT NOT NULL,
                indicators TEXT,
                mitigation_actions TEXT,
                status TEXT DEFAULT 'detected'
            )
        """)
        
        # User behavior profiles table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id TEXT PRIMARY KEY,
                normal_login_times TEXT,
                common_locations TEXT,
                typical_actions TEXT,
                average_session_duration REAL,
                risk_level TEXT,
                anomaly_count INTEGER,
                last_anomaly TEXT,
                behavioral_score REAL,
                last_updated TEXT
            )
        """)
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_activities_user_id ON user_activities(user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON user_activities(timestamp)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity)")
        
        self.connection.commit()
        logger.info("📊 Database tables created successfully")
    
    async def store_activity(self, activity: UserActivity):
        """Store user activity in database"""
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                INSERT INTO user_activities (
                    id, user_id, action, timestamp, location, ip_address,
                    user_agent, user_role, success, failed_attempts,
                    session_id, device_fingerprint, additional_data
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                activity.id,
                activity.user_id,
                activity.action.value,
                activity.timestamp.isoformat(),
                json.dumps(activity.location),
                activity.ip_address,
                activity.user_agent,
                activity.user_role.value,
                activity.success,
                activity.failed_attempts,
                activity.session_id,
                activity.device_fingerprint,
                json.dumps(activity.additional_data)
            ))
            
            self.connection.commit()
            logger.debug(f"Stored activity: {activity.id}")
            
        except Exception as e:
            logger.error(f"Error storing activity: {e}")
            raise
    
    async def store_alert(self, alert: Alert):
        """Store security alert in database"""
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                INSERT INTO alerts (
                    id, activity_id, user_id, severity, anomaly_score,
                    description, timestamp, status, investigation_notes,
                    auto_resolved, false_positive, related_activities
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                alert.id,
                alert.activity_id,
                alert.user_id,
                alert.severity.value,
                alert.anomaly_score,
                alert.description,
                alert.timestamp.isoformat(),
                alert.status,
                alert.investigation_notes,
                alert.auto_resolved,
                alert.false_positive,
                json.dumps(alert.related_activities)
            ))
            
            self.connection.commit()
            logger.info(f"Stored alert: {alert.id}")
            
        except Exception as e:
            logger.error(f"Error storing alert: {e}")
            raise
    
    async def get_recent_activities(self, limit: int = 100) -> List[UserActivity]:
        """Get recent user activities"""
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                SELECT * FROM user_activities 
                ORDER BY timestamp DESC 
                LIMIT ?
            """, (limit,))
            
            rows = cursor.fetchall()
            activities = []
            
            for row in rows:
                activity = UserActivity(
                    id=row['id'],
                    user_id=row['user_id'],
                    action=row['action'],
                    timestamp=datetime.fromisoformat(row['timestamp']),
                    location=json.loads(row['location'] or '{}'),
                    ip_address=row['ip_address'],
                    user_agent=row['user_agent'],
                    user_role=row['user_role'],
                    success=bool(row['success']),
                    failed_attempts=row['failed_attempts'],
                    session_id=row['session_id'],
                    device_fingerprint=row['device_fingerprint'],
                    additional_data=json.loads(row['additional_data'] or '{}')
                )
                activities.append(activity)
            
            return activities
            
        except Exception as e:
            logger.error(f"Error getting recent activities: {e}")
            return []
    
    async def get_recent_alerts(self, limit: int = 50) -> List[Alert]:
        """Get recent security alerts"""
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                SELECT * FROM alerts 
                ORDER BY timestamp DESC 
                LIMIT ?
            """, (limit,))
            
            rows = cursor.fetchall()
            alerts = []
            
            for row in rows:
                alert = Alert(
                    id=row['id'],
                    activity_id=row['activity_id'],
                    user_id=row['user_id'],
                    severity=row['severity'],
                    anomaly_score=row['anomaly_score'],
                    description=row['description'],
                    timestamp=datetime.fromisoformat(row['timestamp']),
                    status=row['status'],
                    investigation_notes=row['investigation_notes'],
                    auto_resolved=bool(row['auto_resolved']),
                    false_positive=bool(row['false_positive']),
                    related_activities=json.loads(row['related_activities'] or '[]')
                )
                alerts.append(alert)
            
            return alerts
            
        except Exception as e:
            logger.error(f"Error getting recent alerts: {e}")
            return []
    
    async def get_dashboard_stats(self) -> DashboardStats:
        """Get dashboard statistics"""
        try:
            cursor = self.connection.cursor()
            
            # Total activities
            cursor.execute("SELECT COUNT(*) as count FROM user_activities")
            total_activities = cursor.fetchone()['count']
            
            # Active alerts
            cursor.execute("SELECT COUNT(*) as count FROM alerts WHERE status = 'active'")
            active_alerts = cursor.fetchone()['count']
            
            # High severity alerts
            cursor.execute("SELECT COUNT(*) as count FROM alerts WHERE severity IN ('high', 'critical') AND status = 'active'")
            high_severity_alerts = cursor.fetchone()['count']
            
            # Users monitored
            cursor.execute("SELECT COUNT(DISTINCT user_id) as count FROM user_activities")
            users_monitored = cursor.fetchone()['count']
            
            # Anomalies detected today
            today = datetime.now().date().isoformat()
            cursor.execute("SELECT COUNT(*) as count FROM alerts WHERE DATE(timestamp) = ?", (today,))
            anomalies_today = cursor.fetchone()['count']
            
            # False positive rate
            cursor.execute("SELECT COUNT(*) as total FROM alerts")
            total_alerts = cursor.fetchone()['total']
            cursor.execute("SELECT COUNT(*) as fp FROM alerts WHERE false_positive = TRUE")
            false_positives = cursor.fetchone()['fp']
            
            false_positive_rate = false_positives / total_alerts if total_alerts > 0 else 0.0
            
            return DashboardStats(
                total_activities=total_activities,
                active_alerts=active_alerts,
                high_severity_alerts=high_severity_alerts,
                users_monitored=users_monitored,
                anomalies_detected_today=anomalies_today,
                false_positive_rate=false_positive_rate,
                system_uptime=99.9,  # Mock value
                last_updated=datetime.now()
            )
            
        except Exception as e:
            logger.error(f"Error getting dashboard stats: {e}")
            return DashboardStats()
    
    async def generate_demo_activities(self) -> List[UserActivity]:
        """Generate demo activities for testing"""
        import random
        from datetime import datetime, timedelta
        
        demo_activities = []
        users = ['user_001', 'user_002', 'user_003', 'admin_001', 'admin_002']
        actions = ['login', 'logout', 'view_data', 'edit_data', 'download', 'upload']
        
        for i in range(50):
            # Generate some normal activities
            activity = UserActivity(
                id=str(uuid.uuid4()),
                user_id=random.choice(users),
                action=random.choice(actions),
                timestamp=datetime.now() - timedelta(minutes=random.randint(0, 1440)),
                location={'latitude': 40.7128 + random.uniform(-0.1, 0.1), 
                         'longitude': -74.0060 + random.uniform(-0.1, 0.1)},
                ip_address=f"192.168.1.{random.randint(1, 255)}",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                user_role='user' if 'admin' not in random.choice(users) else 'admin',
                success=random.choice([True, True, True, False]),  # Mostly successful
                failed_attempts=random.randint(0, 2),
                session_id=f"session_{random.randint(1000, 9999)}",
                device_fingerprint=f"device_{random.randint(100, 999)}"
            )
            
            demo_activities.append(activity)
            await self.store_activity(activity)
        
        # Generate some suspicious activities
        for i in range(10):
            suspicious_activity = UserActivity(
                id=str(uuid.uuid4()),
                user_id=random.choice(users),
                action=random.choice(['privilege_escalation', 'mass_data_access', 'suspicious_download']),
                timestamp=datetime.now() - timedelta(minutes=random.randint(0, 60)),
                location={'latitude': random.uniform(20, 50), 
                         'longitude': random.uniform(-120, -70)},
                ip_address=f"10.0.0.{random.randint(1, 255)}",
                user_agent="SuspiciousBot/1.0",
                user_role='user',
                success=False,
                failed_attempts=random.randint(3, 8),
                session_id=f"suspicious_session_{random.randint(1000, 9999)}",
                device_fingerprint=f"suspicious_device_{random.randint(100, 999)}"
            )
            
            demo_activities.append(suspicious_activity)
            await self.store_activity(suspicious_activity)
        
        logger.info(f"Generated {len(demo_activities)} demo activities")
        return demo_activities
    
    async def get_user_activities(self, user_id: str, limit: int = 100) -> List[UserActivity]:
        """Get activities for a specific user"""
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                SELECT * FROM user_activities 
                WHERE user_id = ? 
                ORDER BY timestamp DESC 
                LIMIT ?
            """, (user_id, limit))
            
            rows = cursor.fetchall()
            activities = []
            
            for row in rows:
                activity = UserActivity(
                    id=row['id'],
                    user_id=row['user_id'],
                    action=row['action'],
                    timestamp=datetime.fromisoformat(row['timestamp']),
                    location=json.loads(row['location'] or '{}'),
                    ip_address=row['ip_address'],
                    user_agent=row['user_agent'],
                    user_role=row['user_role'],
                    success=bool(row['success']),
                    failed_attempts=row['failed_attempts'],
                    session_id=row['session_id'],
                    device_fingerprint=row['device_fingerprint'],
                    additional_data=json.loads(row['additional_data'] or '{}')
                )
                activities.append(activity)
            
            return activities
            
        except Exception as e:
            logger.error(f"Error getting user activities: {e}")
            return []
    
    async def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            logger.info("Database connection closed")
