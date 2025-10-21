"""
Gemini AI Service for Third Umpire - Enhanced AI Analysis
This module integrates Google's Gemini AI for advanced threat analysis and natural language explanations.

Features:
- Natural language threat explanations
- AI-generated security reports
- Enhanced behavioral analysis
- Intelligent alert insights
- Threat intelligence analysis
- Graceful fallback when API is unavailable

The service provides a bridge between the traditional ML system and Google's
advanced Gemini AI, enabling natural language explanations of security threats
and comprehensive AI-powered security analysis.

Author: Third Umpire Team
Version: 2.0.0 (Enhanced with Gemini AI)
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

logger = logging.getLogger(__name__)

class GeminiAIService:
    """
    Enhanced AI service using Google's Gemini for advanced threat analysis,
    natural language explanations, and intelligent insights.
    """
    
    def __init__(self):
        """Initialize Gemini AI service"""
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables")
            self.enabled = False
            return
        
        try:
            # Configure Gemini API
            genai.configure(api_key=self.api_key)
            
            # Initialize the model with safety settings
            self.model = genai.GenerativeModel(
                'gemini-2.0-flash',
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            
            self.enabled = True
            logger.info("✅ Gemini AI service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini AI service: {e}")
            self.enabled = False
    
    async def analyze_threat_intelligence(self, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze user activity using Gemini AI for advanced threat intelligence
        """
        if not self.enabled:
            return self._fallback_analysis(activity_data)
        
        try:
            # Prepare context for Gemini
            context = self._prepare_activity_context(activity_data)
            
            prompt = f"""
            You are an expert cybersecurity analyst. Analyze the following user activity for potential security threats:

            SIGMA RULES CONTEXT:
            - Unusual login times (outside 6 AM - 10 PM)
            - Multiple failed login attempts (>3)
            - Geographic anomalies (login from new/unusual locations)
            - Privilege escalation attempts
            - Unusual data access patterns
            - Rapid sequential actions
            - Suspicious file operations

            ACTIVITY DATA:
            {json.dumps(context, indent=2)}

            Please provide:
            1. THREAT_LEVEL: LOW/MEDIUM/HIGH/CRITICAL
            2. RISK_SCORE: 0-100 (where 100 is maximum risk)
            3. EXPLANATION: Clear explanation of why this activity is suspicious or normal
            4. RECOMMENDATIONS: Specific actions for security team
            5. INDICATORS: List of specific threat indicators found
            6. CONTEXT: Additional context about similar attack patterns

            Format your response as JSON.
            """
            
            response = self.model.generate_content(prompt)
            
            # Parse the response
            analysis = self._parse_gemini_response(response.text)
            
            # Add metadata
            analysis.update({
                'timestamp': datetime.now().isoformat(),
                'ai_model': 'gemini-2.0-flash',
                'analysis_type': 'threat_intelligence'
            })
            
            logger.info(f"Gemini threat analysis completed for user {activity_data.get('user_id', 'unknown')}")
            return analysis
            
        except Exception as e:
            logger.error(f"Error in Gemini threat analysis: {e}")
            return self._fallback_analysis(activity_data)
    
    async def generate_alert_explanation(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate human-readable explanations for security alerts using Gemini
        """
        if not self.enabled:
            return {
                'explanation': f"Alert triggered: {alert_data.get('description', 'Unknown activity')}",
                'severity': alert_data.get('severity', 'unknown'),
                'confidence': alert_data.get('anomaly_score', 0.0)
            }
        
        try:
            prompt = f"""
            You are a cybersecurity expert explaining security alerts to a security operations center.

            ALERT DETAILS:
            {json.dumps(alert_data, indent=2)}

            Provide a clear, actionable explanation that includes:
            1. EXECUTIVE_SUMMARY: One-line summary for management
            2. TECHNICAL_DETAILS: What happened technically
            3. BUSINESS_IMPACT: Potential business impact
            4. IMMEDIATE_ACTIONS: What should be done now
            5. INVESTIGATION_STEPS: How to investigate further
            6. PREVENTION: How to prevent similar incidents

            Make it professional but accessible to both technical and non-technical audiences.
            """
            
            response = self.model.generate_content(prompt)
            
            return {
                'explanation': response.text,
                'alert_id': alert_data.get('id'),
                'generated_at': datetime.now().isoformat(),
                'ai_model': 'gemini-1.5-flash-002'
            }
            
        except Exception as e:
            logger.error(f"Error generating alert explanation: {e}")
            return {
                'explanation': f"Alert: {alert_data.get('description', 'Unknown')} - Analysis unavailable",
                'alert_id': alert_data.get('id'),
                'error': str(e)
            }
    
    async def analyze_user_behavior_pattern(self, user_activities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze user behavior patterns over time using Gemini AI
        """
        if not self.enabled:
            return self._fallback_behavior_analysis(user_activities)
        
        try:
            # Summarize user activities
            activities_summary = self._summarize_activities(user_activities)
            
            prompt = f"""
            You are a behavioral analysis expert. Analyze this user's behavior pattern:

            USER ACTIVITIES SUMMARY:
            {json.dumps(activities_summary, indent=2)}

            Provide analysis including:
            1. BEHAVIOR_PROFILE: Normal vs suspicious patterns
            2. RISK_ASSESSMENT: Overall risk level for this user
            3. ANOMALY_DETECTION: Specific anomalies found
            4. TREND_ANALYSIS: How behavior has changed over time
            5. RECOMMENDATIONS: Actions for security team
            6. USER_TYPE: Classification (normal user, potential insider threat, etc.)

            Format as JSON.
            """
            
            response = self.model.generate_content(prompt)
            analysis = self._parse_gemini_response(response.text)
            
            analysis.update({
                'user_id': user_activities[0].get('user_id') if user_activities else 'unknown',
                'analysis_timestamp': datetime.now().isoformat(),
                'activities_analyzed': len(user_activities)
            })
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in behavior pattern analysis: {e}")
            return self._fallback_behavior_analysis(user_activities)
    
    async def generate_security_report(self, time_period: str = "24h") -> Dict[str, Any]:
        """
        Generate comprehensive security reports using Gemini AI
        """
        if not self.enabled:
            return {
                'report': 'AI-powered security reporting unavailable',
                'period': time_period,
                'generated_at': datetime.now().isoformat()
            }
        
        try:
            prompt = f"""
            You are a CISO preparing a security report for the past {time_period}.

            Generate a comprehensive security report including:
            1. EXECUTIVE_SUMMARY: Key security metrics and incidents
            2. THREAT_LANDSCAPE: Current threat environment
            3. INCIDENT_ANALYSIS: Analysis of security incidents
            4. RISK_ASSESSMENT: Overall security risk posture
            5. RECOMMENDATIONS: Strategic recommendations
            6. METRICS: Key performance indicators
            7. TRENDS: Security trends and patterns

            Make it suitable for executive presentation.
            """
            
            response = self.model.generate_content(prompt)
            
            return {
                'report': response.text,
                'period': time_period,
                'generated_at': datetime.now().isoformat(),
                'ai_model': 'gemini-1.5-flash-002'
            }
            
        except Exception as e:
            logger.error(f"Error generating security report: {e}")
            return {
                'report': f'Security report generation failed: {str(e)}',
                'period': time_period,
                'generated_at': datetime.now().isoformat()
            }
    
    def _prepare_activity_context(self, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare activity data for Gemini analysis"""
        return {
            'user_id': activity_data.get('user_id', 'unknown'),
            'action': activity_data.get('action', 'unknown'),
            'timestamp': activity_data.get('timestamp', datetime.now().isoformat()),
            'location': activity_data.get('location', {}),
            'user_role': activity_data.get('user_role', 'user'),
            'success': activity_data.get('success', True),
            'failed_attempts': activity_data.get('failed_attempts', 0),
            'device_info': activity_data.get('device_info', {}),
            'session_info': activity_data.get('session_info', {})
        }
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """Parse Gemini response and extract structured data"""
        try:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                # If no JSON found, return the text as explanation
                return {
                    'explanation': response_text,
                    'threat_level': 'UNKNOWN',
                    'risk_score': 50,
                    'recommendations': ['Manual review recommended']
                }
        except json.JSONDecodeError:
            return {
                'explanation': response_text,
                'threat_level': 'UNKNOWN',
                'risk_score': 50,
                'recommendations': ['Manual review recommended']
            }
    
    def _summarize_activities(self, activities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Summarize user activities for quick analysis"""
        if not activities:
            return {'summary': 'No activities to analyze'}
        
        # Basic statistics
        total_activities = len(activities)
        unique_actions = set(a.get('action', 'unknown') for a in activities)
        time_range = {
            'start': min(a.get('timestamp', '') for a in activities),
            'end': max(a.get('timestamp', '') for a in activities)
        }
        
        # Action frequency
        action_counts = {}
        for activity in activities:
            action = activity.get('action', 'unknown')
            action_counts[action] = action_counts.get(action, 0) + 1
        
        # Success rate
        successful_activities = sum(1 for a in activities if a.get('success', True))
        success_rate = successful_activities / total_activities if total_activities > 0 else 0
        
        return {
            'total_activities': total_activities,
            'unique_actions': list(unique_actions),
            'action_frequency': action_counts,
            'success_rate': success_rate,
            'time_range': time_range,
            'user_id': activities[0].get('user_id', 'unknown') if activities else 'unknown'
        }
    
    def _fallback_analysis(self, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback analysis when Gemini is not available"""
        return {
            'threat_level': 'MEDIUM',
            'risk_score': 50,
            'explanation': f'Activity analysis unavailable. Activity: {activity_data.get("action", "unknown")}',
            'recommendations': ['Manual review recommended'],
            'indicators': ['AI analysis unavailable'],
            'context': 'Using fallback analysis',
            'timestamp': datetime.now().isoformat(),
            'ai_model': 'fallback'
        }
    
    def _fallback_behavior_analysis(self, activities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Fallback behavior analysis when Gemini is not available"""
        summary = self._summarize_activities(activities)
        return {
            'behavior_profile': 'Unable to analyze - AI service unavailable',
            'risk_assessment': 'MEDIUM',
            'anomaly_detection': [],
            'trend_analysis': 'Analysis unavailable',
            'recommendations': ['Manual review recommended'],
            'user_type': 'Unknown',
            'summary': summary,
            'analysis_timestamp': datetime.now().isoformat()
        }
