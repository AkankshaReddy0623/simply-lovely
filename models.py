"""
Data models for Third Umpire - AI Guard Dog System
Defines the data structures for user activities, alerts, and security events.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, List, Optional, Any
from enum import Enum

class SeverityLevel(str, Enum):
    """Alert severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class UserRole(str, Enum):
    """User role types"""
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class ActionType(str, Enum):
    """Types of user actions"""
    LOGIN = "login"
    LOGOUT = "logout"
    VIEW_DATA = "view_data"
    EDIT_DATA = "edit_data"
    DOWNLOAD = "download"
    UPLOAD = "upload"
    PRIVILEGE_ESCALATION = "privilege_escalation"
    MASS_DATA_ACCESS = "mass_data_access"
    SUSPICIOUS_DOWNLOAD = "suspicious_download"
    SYSTEM_ACCESS = "system_access"

class UserActivity(BaseModel):
    """Model for user activity tracking"""
    id: str = Field(..., description="Unique activity identifier")
    user_id: str = Field(..., description="User identifier")
    action: ActionType = Field(..., description="Type of action performed")
    timestamp: datetime = Field(default_factory=datetime.now, description="When the action occurred")
    location: Dict[str, float] = Field(default_factory=dict, description="Geographic location (lat, lon)")
    ip_address: str = Field(default="0.0.0.0", description="IP address of the user")
    user_agent: str = Field(default="", description="Browser/device information")
    user_role: UserRole = Field(default=UserRole.USER, description="User's role/privilege level")
    success: bool = Field(default=True, description="Whether the action was successful")
    failed_attempts: int = Field(default=0, description="Number of failed attempts before this action")
    session_id: str = Field(default="", description="Session identifier")
    device_fingerprint: str = Field(default="", description="Device fingerprint for tracking")
    additional_data: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Alert(BaseModel):
    """Model for security alerts"""
    id: str = Field(..., description="Unique alert identifier")
    activity_id: str = Field(..., description="Associated activity ID")
    user_id: str = Field(..., description="User who triggered the alert")
    severity: SeverityLevel = Field(..., description="Alert severity level")
    anomaly_score: float = Field(..., ge=0, le=1, description="AI-calculated anomaly score")
    description: str = Field(..., description="Human-readable alert description")
    timestamp: datetime = Field(default_factory=datetime.now, description="When the alert was generated")
    status: str = Field(default="active", description="Alert status (active, investigating, resolved)")
    investigation_notes: str = Field(default="", description="Notes from security team investigation")
    auto_resolved: bool = Field(default=False, description="Whether alert was auto-resolved")
    false_positive: bool = Field(default=False, description="Whether this was a false positive")
    related_activities: List[str] = Field(default_factory=list, description="Related activity IDs")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SecurityEvent(BaseModel):
    """Model for broader security events"""
    id: str = Field(..., description="Unique event identifier")
    event_type: str = Field(..., description="Type of security event")
    timestamp: datetime = Field(default_factory=datetime.now, description="When the event occurred")
    source_ip: str = Field(default="", description="Source IP address")
    target_resource: str = Field(default="", description="Targeted resource or system")
    description: str = Field(..., description="Event description")
    severity: SeverityLevel = Field(..., description="Event severity")
    indicators: List[str] = Field(default_factory=list, description="Security indicators")
    mitigation_actions: List[str] = Field(default_factory=list, description="Actions taken to mitigate")
    status: str = Field(default="detected", description="Event status")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class UserBehaviorProfile(BaseModel):
    """Model for user behavioral analysis"""
    user_id: str = Field(..., description="User identifier")
    normal_login_times: List[int] = Field(default_factory=list, description="Typical login hours")
    common_locations: List[Dict[str, Any]] = Field(default_factory=list, description="Frequent locations")
    typical_actions: List[str] = Field(default_factory=list, description="Common action patterns")
    average_session_duration: float = Field(default=0.0, description="Average session length in minutes")
    risk_level: str = Field(default="low", description="Overall risk assessment")
    anomaly_count: int = Field(default=0, description="Number of anomalies detected")
    last_anomaly: Optional[datetime] = Field(default=None, description="Last anomaly timestamp")
    behavioral_score: float = Field(default=0.0, ge=0, le=1, description="Behavioral risk score")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class DashboardStats(BaseModel):
    """Model for dashboard statistics"""
    total_activities: int = Field(default=0, description="Total activities tracked")
    active_alerts: int = Field(default=0, description="Currently active alerts")
    high_severity_alerts: int = Field(default=0, description="High severity alerts")
    users_monitored: int = Field(default=0, description="Number of users being monitored")
    anomalies_detected_today: int = Field(default=0, description="Anomalies detected today")
    false_positive_rate: float = Field(default=0.0, ge=0, le=1, description="False positive rate")
    system_uptime: float = Field(default=0.0, description="System uptime percentage")
    last_updated: datetime = Field(default_factory=datetime.now, description="Last stats update")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class InvestigationReport(BaseModel):
    """Model for security investigation reports"""
    id: str = Field(..., description="Report identifier")
    alert_ids: List[str] = Field(..., description="Related alert IDs")
    investigator: str = Field(..., description="Security analyst conducting investigation")
    start_time: datetime = Field(default_factory=datetime.now, description="Investigation start time")
    end_time: Optional[datetime] = Field(default=None, description="Investigation end time")
    findings: str = Field(default="", description="Investigation findings")
    conclusion: str = Field(default="", description="Investigation conclusion")
    recommendations: List[str] = Field(default_factory=list, description="Security recommendations")
    severity_adjustment: Optional[str] = Field(default=None, description="Severity level adjustment")
    status: str = Field(default="ongoing", description="Investigation status")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class SystemHealth(BaseModel):
    """Model for system health monitoring"""
    timestamp: datetime = Field(default_factory=datetime.now, description="Health check timestamp")
    ai_engine_status: str = Field(default="healthy", description="AI engine health status")
    database_status: str = Field(default="healthy", description="Database connection status")
    websocket_status: str = Field(default="healthy", description="WebSocket connection status")
    cpu_usage: float = Field(default=0.0, ge=0, le=100, description="CPU usage percentage")
    memory_usage: float = Field(default=0.0, ge=0, le=100, description="Memory usage percentage")
    active_connections: int = Field(default=0, description="Active WebSocket connections")
    processing_latency: float = Field(default=0.0, description="Average processing latency in ms")
    error_rate: float = Field(default=0.0, ge=0, le=100, description="Error rate percentage")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
