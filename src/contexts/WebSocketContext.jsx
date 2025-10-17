import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const WebSocketContext = createContext()

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [lastMessage, setLastMessage] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState(null)
  const ws = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.hostname}:8000/ws`
      
      ws.current = new WebSocket(wsUrl)
      
      ws.current.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setConnectionStatus('connected')
        reconnectAttempts.current = 0
        
        // Send client info
        ws.current.send(JSON.stringify({
          type: 'client_info',
          data: {
            client_type: 'dashboard',
            user_id: 'admin',
            subscriptions: ['alerts', 'activities', 'stats']
          }
        }))
        
        toast.success('Connected to real-time monitoring')
      }
      
      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          setLastMessage(message)
          
          switch (message.type) {
            case 'alert':
              handleNewAlert(message.data)
              break
            case 'activity':
              handleNewActivity(message.data)
              break
            case 'stats':
              setStats(message.data)
              break
            case 'system_status':
              console.log('System status update:', message.data)
              break
            case 'pong':
              // Handle pong response
              break
            default:
              console.log('Unknown message type:', message.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionStatus('disconnected')
        
        if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect()
        }
        
        toast.error('Disconnected from real-time monitoring')
      }
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('error')
        toast.error('WebSocket connection error')
      }
      
    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      setConnectionStatus('error')
    }
  }
  
  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
    reconnectAttempts.current++
    
    console.log(`Scheduling reconnect attempt ${reconnectAttempts.current} in ${delay}ms`)
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect()
    }, delay)
  }
  
  const disconnect = () => {
    if (ws.current) {
      ws.current.close()
      ws.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    setIsConnected(false)
    setConnectionStatus('disconnected')
  }
  
  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }
  
  const handleNewAlert = (alertData) => {
    setAlerts(prev => [alertData, ...prev.slice(0, 99)]) // Keep last 100 alerts
    
    // Show toast notification for high severity alerts
    if (alertData.severity === 'high' || alertData.severity === 'critical') {
      toast.error(`🚨 ${alertData.description}`, {
        duration: 8000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      })
    } else {
      toast.warning(`⚠️ ${alertData.description}`, {
        duration: 5000,
      })
    }
  }
  
  const handleNewActivity = (activityData) => {
    setActivities(prev => [activityData, ...prev.slice(0, 199)]) // Keep last 200 activities
  }
  
  const ping = () => {
    sendMessage({ type: 'ping' })
  }
  
  useEffect(() => {
    connect()
    
    // Ping every 30 seconds to keep connection alive
    const pingInterval = setInterval(ping, 30000)
    
    return () => {
      disconnect()
      clearInterval(pingInterval)
    }
  }, [])
  
  const value = {
    isConnected,
    connectionStatus,
    lastMessage,
    alerts,
    activities,
    stats,
    sendMessage,
    ping,
    reconnect: connect
  }
  
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}
