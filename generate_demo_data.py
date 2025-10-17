#!/usr/bin/env python3
"""
Generate demo data for the Third Umpire AI Guard Dog system
"""

import sqlite3
import json
import uuid
import random
from datetime import datetime, timedelta

def generate_demo_data():
    """Generate demo data for testing"""
    # Connect to database
    conn = sqlite3.connect('third_umpire.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Create tables if they don't exist
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
    
    # Generate demo activities
    users = ['user_001', 'user_002', 'user_003', 'admin_001', 'admin_002']
    actions = ['login', 'logout', 'view_data', 'edit_data', 'download', 'upload']
    roles = ['user', 'admin']
    
    print("Generating demo activities...")
    
    # Generate normal activities
    for i in range(50):
        activity_id = str(uuid.uuid4())
        user_id = random.choice(users)
        action = random.choice(actions)
        timestamp = datetime.now() - timedelta(minutes=random.randint(0, 1440))
        
        location = {
            'latitude': 40.7128 + random.uniform(-0.1, 0.1),
            'longitude': -74.0060 + random.uniform(-0.1, 0.1)
        }
        
        ip_address = f"192.168.1.{random.randint(1, 255)}"
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        user_role = 'admin' if 'admin' in user_id else 'user'
        success = random.choice([True, True, True, False])
        failed_attempts = random.randint(0, 2)
        session_id = f"session_{random.randint(1000, 9999)}"
        device_fingerprint = f"device_{random.randint(100, 999)}"
        
        cursor.execute("""
            INSERT OR REPLACE INTO user_activities (
                id, user_id, action, timestamp, location, ip_address,
                user_agent, user_role, success, failed_attempts,
                session_id, device_fingerprint, additional_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            activity_id,
            user_id,
            action,
            timestamp.isoformat(),
            json.dumps(location),
            ip_address,
            user_agent,
            user_role,
            success,
            failed_attempts,
            session_id,
            device_fingerprint,
            json.dumps({})
        ))
        
        # Create alerts for some activities
        if action in ['privilege_escalation', 'mass_data_access', 'suspicious_download'] or failed_attempts > 3:
            alert_id = str(uuid.uuid4())
            severity = random.choice(['high', 'medium', 'critical']) if failed_attempts > 3 else 'medium'
            anomaly_score = random.uniform(0.7, 0.95) if failed_attempts > 3 else random.uniform(0.5, 0.8)
            
            cursor.execute("""
                INSERT OR REPLACE INTO alerts (
                    id, activity_id, user_id, severity, anomaly_score,
                    description, timestamp, status, investigation_notes,
                    auto_resolved, false_positive, related_activities
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                alert_id,
                activity_id,
                user_id,
                severity,
                anomaly_score,
                f"Suspicious activity detected: {action}",
                timestamp.isoformat(),
                'active',
                '',
                False,
                False,
                json.dumps([])
            ))
    
    # Generate some suspicious activities
    suspicious_actions = ['privilege_escalation', 'mass_data_access', 'suspicious_download']
    
    for i in range(10):
        activity_id = str(uuid.uuid4())
        user_id = random.choice(users)
        action = random.choice(suspicious_actions)
        timestamp = datetime.now() - timedelta(minutes=random.randint(0, 60))
        
        location = {
            'latitude': random.uniform(20, 50),
            'longitude': random.uniform(-120, -70)
        }
        
        ip_address = f"10.0.0.{random.randint(1, 255)}"
        user_agent = "SuspiciousBot/1.0"
        user_role = 'user'
        success = False
        failed_attempts = random.randint(3, 8)
        session_id = f"suspicious_session_{random.randint(1000, 9999)}"
        device_fingerprint = f"suspicious_device_{random.randint(100, 999)}"
        
        cursor.execute("""
            INSERT OR REPLACE INTO user_activities (
                id, user_id, action, timestamp, location, ip_address,
                user_agent, user_role, success, failed_attempts,
                session_id, device_fingerprint, additional_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            activity_id,
            user_id,
            action,
            timestamp.isoformat(),
            json.dumps(location),
            ip_address,
            user_agent,
            user_role,
            success,
            failed_attempts,
            session_id,
            device_fingerprint,
            json.dumps({})
        ))
        
        # Create high-severity alert
        alert_id = str(uuid.uuid4())
        severity = random.choice(['high', 'critical'])
        anomaly_score = random.uniform(0.8, 0.98)
        
        cursor.execute("""
            INSERT OR REPLACE INTO alerts (
                id, activity_id, user_id, severity, anomaly_score,
                description, timestamp, status, investigation_notes,
                auto_resolved, false_positive, related_activities
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            alert_id,
            activity_id,
            user_id,
            severity,
            anomaly_score,
            f"High-risk activity detected: {action}",
            timestamp.isoformat(),
            'active',
            '',
            False,
            False,
            json.dumps([])
        ))
    
    conn.commit()
    conn.close()
    
    print("Generated 60 demo activities and alerts")
    print("Demo data generation complete!")

if __name__ == "__main__":
    generate_demo_data()
