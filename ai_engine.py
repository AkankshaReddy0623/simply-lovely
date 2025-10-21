"""
AI Engine for Third Umpire - Anomaly Detection System
This module contains the machine learning algorithms for detecting suspicious user behavior.
Enhanced with Gemini AI for advanced threat analysis and natural language explanations.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Any, Tuple
import asyncio
from gemini_service import GeminiAIService

logger = logging.getLogger(__name__)

class AnomalyDetector:
    """
    AI-powered anomaly detection system for user behavior analysis.
    Uses multiple ML algorithms to identify suspicious patterns.
    """
    
    def __init__(self):
        self.isolation_forest = IsolationForest(
            contamination=0.1,  # 10% of data expected to be anomalies
            random_state=42,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        self.dbscan = DBSCAN(eps=0.5, min_samples=5)
        self.is_trained = False
        
        # Initialize Gemini AI service
        self.gemini_service = GeminiAIService()
        
        # Behavioral patterns to monitor
        self.suspicious_patterns = {
            'unusual_login_times': True,
            'rapid_failed_logins': True,
            'geographic_anomalies': True,
            'unusual_data_access': True,
            'privilege_escalation': True
        }
        
        # Risk scoring weights
        self.risk_weights = {
            'time_deviation': 0.2,
            'location_deviation': 0.3,
            'action_frequency': 0.2,
            'privilege_level': 0.15,
            'device_fingerprint': 0.15
        }
    
    async def train_model(self):
        """Train the anomaly detection model with historical data"""
        try:
            # Generate synthetic training data for demonstration
            training_data = self._generate_training_data()
            
            # Extract features
            features = self._extract_features(training_data)
            
            # Scale features
            features_scaled = self.scaler.fit_transform(features)
            
            # Train isolation forest
            self.isolation_forest.fit(features_scaled)
            
            self.is_trained = True
            logger.info("✅ Anomaly detection model trained successfully")
            
        except Exception as e:
            logger.error(f"Error training model: {e}")
            raise
    
    def _generate_training_data(self) -> pd.DataFrame:
        """Generate synthetic training data for the model"""
        np.random.seed(42)
        
        # Normal user behavior patterns
        normal_data = []
        for _ in range(1000):
            # Normal login times (9 AM - 6 PM)
            hour = np.random.normal(12, 3)  # Peak around noon
            hour = max(0, min(23, hour))
            
            # Normal locations (within expected geographic area)
            lat = np.random.normal(40.7128, 0.1)  # NYC area
            lon = np.random.normal(-74.0060, 0.1)
            
            # Normal action types
            action_type = np.random.choice(['login', 'view_data', 'edit_data', 'logout'], 
                                         p=[0.4, 0.3, 0.2, 0.1])
            
            # Normal privilege levels
            privilege = np.random.choice(['user', 'admin'], p=[0.8, 0.2])
            
            normal_data.append({
                'hour': hour,
                'latitude': lat,
                'longitude': lon,
                'action_type': action_type,
                'privilege_level': privilege,
                'success': True,
                'failed_attempts': 0
            })
        
        # Some anomalous patterns
        anomalous_data = []
        for _ in range(100):
            # Unusual login times (late night/early morning)
            hour = np.random.choice([0, 1, 2, 3, 4, 22, 23])
            
            # Unusual locations (far from normal area)
            lat = np.random.uniform(20, 50)
            lon = np.random.uniform(-120, -70)
            
            # Suspicious action patterns
            action_type = np.random.choice(['privilege_escalation', 'mass_data_access', 
                                          'suspicious_download'])
            
            anomalous_data.append({
                'hour': hour,
                'latitude': lat,
                'longitude': lon,
                'action_type': action_type,
                'privilege_level': 'admin',
                'success': False,
                'failed_attempts': np.random.randint(3, 10)
            })
        
        # Combine data
        all_data = normal_data + anomalous_data
        df = pd.DataFrame(all_data)
        
        # Convert categorical to numerical
        df['action_type_encoded'] = pd.Categorical(df['action_type']).codes
        df['privilege_level_encoded'] = pd.Categorical(df['privilege_level']).codes
        
        return df
    
    def _extract_features(self, data: pd.DataFrame) -> np.ndarray:
        """Extract features for anomaly detection"""
        features = data[[
            'hour', 'latitude', 'longitude', 'action_type_encoded',
            'privilege_level_encoded', 'success', 'failed_attempts'
        ]].values
        
        return features
    
    async def detect_anomaly(self, activity: 'UserActivity') -> float:
        """
        Detect if a user activity is anomalous
        Returns anomaly score between 0 and 1 (1 = highly suspicious)
        """
        try:
            if not self.is_trained:
                await self.train_model()
            
            # Extract features from the activity
            features = self._extract_activity_features(activity)
            
            # Scale features
            features_scaled = self.scaler.transform([features])
            
            # Get anomaly score from isolation forest
            anomaly_score = self.isolation_forest.decision_function(features_scaled)[0]
            
            # Convert to 0-1 scale (higher = more anomalous)
            normalized_score = max(0, min(1, (1 - anomaly_score) / 2))
            
            # Apply behavioral pattern analysis
            behavioral_score = self._analyze_behavioral_patterns(activity)
            
            # Combine scores
            final_score = (normalized_score * 0.7) + (behavioral_score * 0.3)
            
            logger.info(f"Anomaly detection: score={final_score:.3f} for user {activity.user_id}")
            
            return final_score
            
        except Exception as e:
            logger.error(f"Error in anomaly detection: {e}")
            return 0.0
    
    def _extract_activity_features(self, activity: 'UserActivity') -> List[float]:
        """Extract numerical features from user activity"""
        # Convert action type to numerical
        action_mapping = {
            'login': 0, 'logout': 1, 'view_data': 2, 'edit_data': 3,
            'download': 4, 'upload': 5, 'privilege_escalation': 6,
            'mass_data_access': 7, 'suspicious_download': 8
        }
        
        # Convert privilege level to numerical
        privilege_mapping = {'user': 0, 'moderator': 1, 'admin': 2, 'super_admin': 3}
        
        features = [
            activity.timestamp.hour,  # Time of day
            activity.location.get('latitude', 0),  # Geographic location
            activity.location.get('longitude', 0),
            action_mapping.get(activity.action, 0),  # Action type
            privilege_mapping.get(activity.user_role, 0),  # User privilege
            1 if activity.success else 0,  # Success status
            activity.failed_attempts  # Failed attempts
        ]
        
        return features
    
    def _analyze_behavioral_patterns(self, activity: 'UserActivity') -> float:
        """Analyze behavioral patterns for additional anomaly detection"""
        score = 0.0
        
        # Check for unusual login times
        hour = activity.timestamp.hour
        if hour < 6 or hour > 22:  # Very early morning or late night
            score += 0.3
        
        # Check for rapid failed logins
        if activity.failed_attempts > 3:
            score += 0.4
        
        # Check for geographic anomalies (simplified)
        if activity.location.get('latitude', 0) == 0:  # No location data
            score += 0.2
        
        # Check for privilege escalation attempts
        if activity.action == 'privilege_escalation':
            score += 0.6
        
        # Check for suspicious data access patterns
        if activity.action in ['mass_data_access', 'suspicious_download']:
            score += 0.5
        
        return min(1.0, score)
    
    async def get_user_behavior_profile(self, user_id: str) -> Dict[str, Any]:
        """Get behavioral profile for a user"""
        # This would typically query historical data
        # For demo purposes, return a sample profile
        return {
            'user_id': user_id,
            'normal_login_times': [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            'common_locations': [
                {'lat': 40.7128, 'lon': -74.0060, 'frequency': 0.8},
                {'lat': 40.7589, 'lon': -73.9851, 'frequency': 0.2}
            ],
            'typical_actions': ['login', 'view_data', 'edit_data'],
            'risk_level': 'low',
            'anomaly_count': 2,
            'last_anomaly': '2024-01-15T10:30:00Z'
        }
    
    async def analyze_session(self, session_activities: List['UserActivity']) -> Dict[str, Any]:
        """Analyze a complete user session for suspicious patterns"""
        if not session_activities:
            return {'risk_score': 0.0, 'patterns': []}
        
        risk_score = 0.0
        patterns = []
        
        # Check for session duration anomalies
        if len(session_activities) > 1:
            duration = (session_activities[-1].timestamp - session_activities[0].timestamp).seconds
            if duration > 3600:  # More than 1 hour
                risk_score += 0.2
                patterns.append('Long session duration')
        
        # Check for unusual action sequences
        actions = [a.action for a in session_activities]
        if 'privilege_escalation' in actions:
            risk_score += 0.4
            patterns.append('Privilege escalation attempt')
        
        # Check for rapid action execution
        if len(actions) > 10:  # More than 10 actions in session
            risk_score += 0.3
            patterns.append('High activity volume')
        
        return {
            'risk_score': min(1.0, risk_score),
            'patterns': patterns,
            'session_duration': duration if len(session_activities) > 1 else 0,
            'action_count': len(actions)
        }
    
    async def enhanced_detect_anomaly(self, activity: 'UserActivity') -> Dict[str, Any]:
        """
        Enhanced anomaly detection using both traditional ML and Gemini AI
        Returns comprehensive analysis with natural language explanations
        """
        try:
            # Get traditional ML anomaly score
            ml_score = await self.detect_anomaly(activity)
            
            # Prepare activity data for Gemini analysis
            activity_data = {
                'user_id': activity.user_id,
                'action': activity.action,
                'timestamp': activity.timestamp.isoformat(),
                'location': activity.location,
                'user_role': activity.user_role,
                'success': activity.success,
                'failed_attempts': activity.failed_attempts,
                'device_info': getattr(activity, 'device_info', {}),
                'session_info': getattr(activity, 'session_info', {})
            }
            
            # Get Gemini AI analysis
            gemini_analysis = await self.gemini_service.analyze_threat_intelligence(activity_data)
            
            # Combine ML and AI insights
            combined_score = (ml_score * 0.4) + (gemini_analysis.get('risk_score', 50) / 100 * 0.6)
            
            return {
                'ml_anomaly_score': ml_score,
                'gemini_analysis': gemini_analysis,
                'combined_risk_score': combined_score,
                'threat_level': gemini_analysis.get('threat_level', 'MEDIUM'),
                'explanation': gemini_analysis.get('explanation', 'Analysis in progress'),
                'recommendations': gemini_analysis.get('recommendations', ['Manual review recommended']),
                'indicators': gemini_analysis.get('indicators', []),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in enhanced anomaly detection: {e}")
            # Fallback to traditional detection
            ml_score = await self.detect_anomaly(activity)
            return {
                'ml_anomaly_score': ml_score,
                'gemini_analysis': {'error': str(e)},
                'combined_risk_score': ml_score,
                'threat_level': 'UNKNOWN',
                'explanation': f'Enhanced analysis failed: {str(e)}',
                'recommendations': ['Manual review recommended'],
                'indicators': ['Analysis error'],
                'timestamp': datetime.now().isoformat()
            }
    
    async def generate_alert_insights(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comprehensive insights for security alerts using Gemini AI
        """
        try:
            insights = await self.gemini_service.generate_alert_explanation(alert_data)
            return insights
        except Exception as e:
            logger.error(f"Error generating alert insights: {e}")
            return {
                'explanation': f'Alert analysis failed: {str(e)}',
                'alert_id': alert_data.get('id'),
                'error': str(e)
            }
    
    async def analyze_user_profile(self, user_id: str, activities: List['UserActivity']) -> Dict[str, Any]:
        """
        Analyze user behavior profile using Gemini AI for advanced insights
        """
        try:
            # Convert activities to dict format for Gemini
            activities_data = []
            for activity in activities:
                activities_data.append({
                    'user_id': activity.user_id,
                    'action': activity.action,
                    'timestamp': activity.timestamp.isoformat(),
                    'location': activity.location,
                    'user_role': activity.user_role,
                    'success': activity.success,
                    'failed_attempts': activity.failed_attempts
                })
            
            # Get Gemini behavior analysis
            behavior_analysis = await self.gemini_service.analyze_user_behavior_pattern(activities_data)
            
            # Combine with traditional user profile
            traditional_profile = await self.get_user_behavior_profile(user_id)
            
            return {
                'user_id': user_id,
                'traditional_profile': traditional_profile,
                'gemini_analysis': behavior_analysis,
                'analysis_timestamp': datetime.now().isoformat(),
                'activities_analyzed': len(activities)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing user profile: {e}")
            traditional_profile = await self.get_user_behavior_profile(user_id)
            return {
                'user_id': user_id,
                'traditional_profile': traditional_profile,
                'gemini_analysis': {'error': str(e)},
                'analysis_timestamp': datetime.now().isoformat(),
                'activities_analyzed': len(activities)
            }
