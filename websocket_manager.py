"""
WebSocket Manager for Third Umpire - AI Guard Dog System
Handles real-time communication between backend and frontend for live monitoring.
"""

import json
import asyncio
import logging
from typing import List, Dict, Any
from fastapi import WebSocket
from datetime import datetime

logger = logging.getLogger(__name__)

class ConnectionManager:
    """
    Manages WebSocket connections for real-time updates
    """
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_metadata: Dict[WebSocket, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_metadata[websocket] = {
            'connected_at': datetime.now(),
            'client_type': 'dashboard',  # Default client type
            'user_id': None
        }
        logger.info(f"New WebSocket connection established. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            if websocket in self.connection_metadata:
                del self.connection_metadata[websocket]
            logger.info(f"WebSocket connection closed. Total connections: {len(self.active_connections)}")
    
    async def broadcast_alert(self, alert_data: Dict[str, Any]):
        """Broadcast a new alert to all connected clients"""
        if not self.active_connections:
            return
        
        message = {
            'type': 'alert',
            'data': alert_data,
            'timestamp': datetime.now().isoformat()
        }
        
        await self._broadcast_message(message)
        logger.info(f"Broadcasted alert to {len(self.active_connections)} clients")
    
    async def broadcast_activity(self, activity_data: Dict[str, Any]):
        """Broadcast a new user activity to all connected clients"""
        if not self.active_connections:
            return
        
        message = {
            'type': 'activity',
            'data': activity_data,
            'timestamp': datetime.now().isoformat()
        }
        
        await self._broadcast_message(message)
    
    async def broadcast_stats(self, stats_data: Dict[str, Any]):
        """Broadcast updated dashboard statistics"""
        if not self.active_connections:
            return
        
        message = {
            'type': 'stats',
            'data': stats_data,
            'timestamp': datetime.now().isoformat()
        }
        
        await self._broadcast_message(message)
    
    async def broadcast_system_status(self, status_data: Dict[str, Any]):
        """Broadcast system health status"""
        if not self.active_connections:
            return
        
        message = {
            'type': 'system_status',
            'data': status_data,
            'timestamp': datetime.now().isoformat()
        }
        
        await self._broadcast_message(message)
    
    async def _broadcast_message(self, message: Dict[str, Any]):
        """Broadcast a message to all active connections"""
        if not self.active_connections:
            return
        
        message_str = json.dumps(message)
        disconnected = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception as e:
                logger.warning(f"Failed to send message to client: {e}")
                disconnected.append(connection)
        
        # Remove disconnected clients
        for connection in disconnected:
            self.disconnect(connection)
    
    async def send_to_client(self, websocket: WebSocket, message: Dict[str, Any]):
        """Send a message to a specific client"""
        try:
            message_str = json.dumps(message)
            await websocket.send_text(message_str)
        except Exception as e:
            logger.warning(f"Failed to send message to specific client: {e}")
            self.disconnect(websocket)
    
    async def handle_client_message(self, websocket: WebSocket, message: str):
        """Handle incoming messages from clients"""
        try:
            data = json.loads(message)
            message_type = data.get('type')
            
            if message_type == 'ping':
                # Respond to ping with pong
                await self.send_to_client(websocket, {'type': 'pong', 'timestamp': datetime.now().isoformat()})
            
            elif message_type == 'subscribe':
                # Handle subscription requests
                subscription_type = data.get('subscription')
                if subscription_type:
                    await self._handle_subscription(websocket, subscription_type)
            
            elif message_type == 'client_info':
                # Update client metadata
                client_info = data.get('data', {})
                if websocket in self.connection_metadata:
                    self.connection_metadata[websocket].update(client_info)
            
        except json.JSONDecodeError:
            logger.warning(f"Invalid JSON message from client: {message}")
        except Exception as e:
            logger.error(f"Error handling client message: {e}")
    
    async def _handle_subscription(self, websocket: WebSocket, subscription_type: str):
        """Handle client subscription requests"""
        if websocket in self.connection_metadata:
            self.connection_metadata[websocket]['subscriptions'] = self.connection_metadata[websocket].get('subscriptions', set())
            self.connection_metadata[websocket]['subscriptions'].add(subscription_type)
            
            # Send confirmation
            await self.send_to_client(websocket, {
                'type': 'subscription_confirmed',
                'subscription': subscription_type,
                'timestamp': datetime.now().isoformat()
            })
            
            logger.info(f"Client subscribed to: {subscription_type}")
    
    def get_connection_count(self) -> int:
        """Get the number of active connections"""
        return len(self.active_connections)
    
    def get_connection_info(self) -> List[Dict[str, Any]]:
        """Get information about all active connections"""
        connection_info = []
        
        for websocket, metadata in self.connection_metadata.items():
            info = {
                'connected_at': metadata['connected_at'].isoformat(),
                'client_type': metadata.get('client_type', 'unknown'),
                'user_id': metadata.get('user_id'),
                'subscriptions': list(metadata.get('subscriptions', set()))
            }
            connection_info.append(info)
        
        return connection_info
    
    async def broadcast_custom_event(self, event_type: str, event_data: Dict[str, Any]):
        """Broadcast a custom event to all connected clients"""
        if not self.active_connections:
            return
        
        message = {
            'type': event_type,
            'data': event_data,
            'timestamp': datetime.now().isoformat()
        }
        
        await self._broadcast_message(message)
        logger.info(f"Broadcasted custom event '{event_type}' to {len(self.active_connections)} clients")
    
    async def start_heartbeat(self):
        """Start sending heartbeat messages to keep connections alive"""
        while True:
            try:
                if self.active_connections:
                    heartbeat_message = {
                        'type': 'heartbeat',
                        'timestamp': datetime.now().isoformat(),
                        'active_connections': len(self.active_connections)
                    }
                    await self._broadcast_message(heartbeat_message)
                
                await asyncio.sleep(30)  # Send heartbeat every 30 seconds
                
            except Exception as e:
                logger.error(f"Error in heartbeat loop: {e}")
                await asyncio.sleep(30)
