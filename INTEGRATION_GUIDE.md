# 🐕 Third Umpire - AI Guard Dog Integration Guide

## 🎯 **What This System Does**

**Third Umpire** is a real-time AI-powered security monitoring system that:

1. **Monitors User Activities**: Tracks every user action (logins, data access, downloads, etc.)
2. **Detects Suspicious Behavior**: Uses machine learning to identify anomalies and threats
3. **Generates Security Alerts**: Instantly notifies security teams of potential issues
4. **Provides Investigation Tools**: Offers detailed analytics and historical data
5. **Real-time Dashboard**: Live monitoring interface for security teams

---

## 🏗️ **System Architecture**

```
Your Application → Third Umpire API → AI Analysis → Alerts → Dashboard
     ↓                    ↓              ↓          ↓         ↓
  User Actions      Activity Log    Anomaly      Security   Real-time
  (Login, etc.)     (Database)      Detection    Alerts     Monitoring
```

---

## 🚀 **How to Integrate**

### **Step 1: Track User Activities**

Every time a user performs an action in your application, send the data to Third Umpire:

#### **Python/Flask Example:**
```python
from flask import Flask, request
import requests
import uuid

app = Flask(__name__)

def track_user_activity(user_id, action, ip_address, **kwargs):
    """Track user activity in Third Umpire"""
    activity_data = {
        "id": str(uuid.uuid4()),  # Required: Unique ID
        "user_id": user_id,
        "action": action,  # login, logout, view_data, download, etc.
        "ip_address": ip_address,
        "user_agent": request.headers.get('User-Agent', ''),
        "user_role": kwargs.get('user_role', 'user'),
        "success": kwargs.get('success', True),
        "location": kwargs.get('location', {}),  # Optional: {"lat": 40.7128, "lon": -74.0060}
        "session_id": kwargs.get('session_id', ''),
        "additional_data": kwargs.get('additional_data', {})
    }
    
    try:
        response = requests.post("http://localhost:8000/api/activities", json=activity_data)
        return response.status_code == 200
    except Exception as e:
        print(f"Failed to track activity: {e}")
        return False

# Usage in your routes
@app.route('/login', methods=['POST'])
def login():
    user_id = authenticate_user(request.form)
    if user_id:
        track_user_activity(user_id, "login", request.remote_addr)
        return redirect('/dashboard')
    else:
        track_user_activity("unknown", "login", request.remote_addr, success=False)
        return "Login failed"

@app.route('/download/<file_id>')
def download_file(file_id):
    user_id = get_current_user()
    track_user_activity(
        user_id, 
        "download", 
        request.remote_addr,
        additional_data={"file_id": file_id, "file_type": "document"}
    )
    return send_file(f"files/{file_id}")
```

#### **JavaScript/React Example:**
```javascript
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const trackActivity = async (userId, action, ipAddress, additionalData = {}) => {
    const activityData = {
        id: uuidv4(),
        user_id: userId,
        action: action,
        ip_address: ipAddress,
        user_agent: navigator.userAgent,
        user_role: 'user',
        success: true,
        additional_data: additionalData
    };
    
    try {
        await axios.post('http://localhost:8000/api/activities', activityData);
        console.log(`✅ Tracked: ${action} by ${userId}`);
    } catch (error) {
        console.error('Failed to track activity:', error);
    }
};

// Usage in React components
const LoginComponent = () => {
    const handleLogin = async () => {
        const userId = await authenticateUser();
        if (userId) {
            trackActivity(userId, 'login', getClientIP());
            // ... rest of login logic
        }
    };
    
    return (
        <button onClick={handleLogin}>Login</button>
    );
};

const FileDownload = ({ fileId }) => {
    const handleDownload = async () => {
        const userId = getCurrentUser();
        trackActivity(userId, 'download', getClientIP(), {
            file_id: fileId,
            file_type: 'document'
        });
        // ... download logic
    };
    
    return <button onClick={handleDownload}>Download</button>;
};
```

#### **Node.js/Express Example:**
```javascript
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();

const trackActivity = async (userId, action, req, additionalData = {}) => {
    const activityData = {
        id: uuidv4(),
        user_id: userId,
        action: action,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        user_role: req.user?.role || 'user',
        success: true,
        additional_data: additionalData
    };
    
    try {
        await axios.post('http://localhost:8000/api/activities', activityData);
    } catch (error) {
        console.error('Failed to track activity:', error);
    }
};

// Middleware to track all requests
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
        // Track successful requests
        if (res.statusCode < 400) {
            trackActivity(req.user?.id, 'view_data', req, {
                endpoint: req.path,
                method: req.method
            });
        }
        originalSend.call(this, data);
    };
    next();
});
```

---

## 🔍 **Supported Action Types**

Third Umpire can track these types of user actions:

- **`login`** - User authentication
- **`logout`** - User session termination
- **`view_data`** - Viewing data/records
- **`edit_data`** - Modifying data
- **`download`** - File downloads
- **`upload`** - File uploads
- **`privilege_escalation`** - Access level changes
- **`mass_data_access`** - Bulk data operations
- **`suspicious_download`** - Unusual download patterns
- **`system_access`** - Administrative access

---

## 🚨 **Real-time Alert Monitoring**

### **WebSocket Connection:**
```javascript
// Connect to Third Umpire for real-time alerts
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'alert') {
        const alert = data.data;
        
        // Show notification to security team
        showSecurityAlert({
            severity: alert.severity,  // low, medium, high, critical
            description: alert.description,
            user: alert.user_id,
            timestamp: alert.timestamp,
            anomaly_score: alert.anomaly_score
        });
        
        // Log to security system
        console.log(`🚨 Security Alert: ${alert.description}`);
    }
};

ws.onopen = function() {
    console.log('✅ Connected to Third Umpire monitoring');
};

ws.onclose = function() {
    console.log('❌ Disconnected from Third Umpire');
    // Implement reconnection logic
};
```

---

## 📊 **Monitoring Dashboard**

### **Access the Dashboard:**
- **URL**: http://localhost:5173
- **Features**:
  - Real-time activity feed
  - Security alerts management
  - User behavior analytics
  - Geographic threat mapping
  - System health monitoring

### **API Endpoints:**
- **Health Check**: `GET /api/health`
- **Dashboard Stats**: `GET /api/dashboard/stats`
- **Alerts**: `GET /api/alerts`
- **Activities**: `GET /api/activities`
- **API Documentation**: http://localhost:8000/docs

---

## 🎯 **Real-World Use Cases**

### **1. E-commerce Platform**
```python
# Track suspicious shopping behavior
track_user_activity(
    "customer_123",
    "download",
    "192.168.1.100",
    additional_data={
        "file_type": "customer_database",
        "records_count": 10000,
        "suspicious": True
    }
)
```

### **2. Banking Application**
```python
# Monitor financial transactions
track_user_activity(
    "bank_user_456",
    "view_data",
    "10.0.0.50",
    location={"lat": 40.7128, "lon": -74.0060},
    additional_data={
        "data_type": "account_balance",
        "amount": 1000000,
        "unusual_time": True
    }
)
```

### **3. Healthcare System**
```python
# Track patient data access
track_user_activity(
    "doctor_789",
    "access_sensitive_data",
    "172.16.0.25",
    additional_data={
        "data_type": "medical_records",
        "patient_count": 500,
        "after_hours": True
    }
)
```

---

## 🔧 **System Setup**

### **1. Start the Backend:**
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### **2. Start the Frontend:**
```bash
npm run dev
```

### **3. Verify System Health:**
```bash
curl http://localhost:8000/api/health
```

---

## 📈 **What Happens Next**

1. **Activity Tracking**: Your application sends user activities to Third Umpire
2. **AI Analysis**: Machine learning algorithms analyze behavior patterns
3. **Anomaly Detection**: System identifies suspicious activities
4. **Alert Generation**: Security alerts are created for threats
5. **Real-time Notifications**: WebSocket alerts notify security teams
6. **Dashboard Updates**: Live dashboard shows current status
7. **Investigation Tools**: Security teams can investigate and resolve alerts

---

## 🎮 **Demo the System**

1. **Open Dashboard**: http://localhost:5173
2. **Check API Docs**: http://localhost:8000/docs
3. **Generate Demo Data**: Use the API to create sample activities
4. **Monitor Alerts**: Watch for real-time security notifications
5. **Test Integration**: Use the code examples above

---

## 🏆 **Key Benefits**

- ✅ **Real-time Monitoring**: Instant threat detection
- ✅ **AI-Powered Analysis**: Advanced anomaly detection
- ✅ **Easy Integration**: Simple API calls
- ✅ **Professional Dashboard**: Comprehensive monitoring interface
- ✅ **Scalable Architecture**: Handles high-volume applications
- ✅ **Investigation Tools**: Detailed analysis and reporting

**Third Umpire** transforms your application into a secure, monitored environment that can detect and respond to threats in real-time! 🚀
