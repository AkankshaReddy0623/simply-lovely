import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import ApiDocs from './pages/ApiDocs'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Enhanced Login Component with Third Umpire Design
const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoggedIn(true)
      setIsLoading(false)
    }, 1000)
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'var(--accent-primary)',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'pulse-glow 3s infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: 'var(--accent-cricket)',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'pulse-glow 4s infinite'
      }}></div>
      
      <div className="glass-panel" style={{
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        animation: 'slideInUp 0.8s ease-out'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
          borderRadius: '20px',
          margin: '0 auto 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow-blue)',
          animation: 'pulse-glow 2s infinite'
        }}>
          <span style={{ fontSize: '2rem' }}>🛡️</span>
        </div>
        
        <h1 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '1rem',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Third Umpire
        </h1>
        
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          marginBottom: '2rem'
        }}>
          AI Guard Dog Security System
        </p>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                Authenticating...
              </div>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>
        
        <p style={{ fontSize: '0.8em', color: 'var(--text-tertiary)', marginTop: '1rem' }}>
          Demo mode - any credentials work
        </p>
      </div>
    </div>
  )
}

// Enhanced Dashboard Component with Third Umpire Design
const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard')
  const [stats, setStats] = useState({
    total_activities: 262,
    active_alerts: 20,
    users_monitored: 11,
    system_uptime: 99.9
  })
  const [alerts, setAlerts] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertFilter, setAlertFilter] = useState('all')
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [showAlertDetails, setShowAlertDetails] = useState(false)

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await fetch('http://localhost:8000/api/dashboard/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Fetch alerts
        const alertsResponse = await fetch('http://localhost:8000/api/alerts')
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          setAlerts(alertsData.alerts || [])
        }

        // Fetch activities
        const activitiesResponse = await fetch('http://localhost:8000/api/activities/recent')
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json()
          setActivities(activitiesData.activities || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewAlertDetails = (alert) => {
    setSelectedAlert(alert)
    setShowAlertDetails(true)
  }

  const handleDismissAlert = async (alertId) => {
    try {
      // Here you would typically make an API call to dismiss the alert
      // For now, we'll just remove it from the local state
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId))
      setStats(prevStats => ({
        ...prevStats,
        active_alerts: prevStats.active_alerts - 1
      }))
    } catch (error) {
      console.error('Error dismissing alert:', error)
    }
  }

  const handleRefreshAlerts = async () => {
    try {
      const alertsResponse = await fetch('http://localhost:8000/api/alerts')
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData.alerts || [])
      }
    } catch (error) {
      console.error('Error refreshing alerts:', error)
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true
    return alert.severity === alertFilter
  })

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { id: 'alerts', name: 'Alerts', icon: '⚠️' },
    { id: 'activities', name: 'Activities', icon: '💻' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'api-docs', name: 'API Docs', icon: '📚' }
  ]

  const getAlertSeverityClass = (severity, score) => {
    if (score >= 0.9 || severity === 'critical') return 'alert-critical'
    if (score >= 0.7 || severity === 'high') return 'alert-high'
    if (score >= 0.4 || severity === 'medium') return 'alert-medium'
    return 'alert-low'
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Enhanced Header */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: 'slideInUp 0.6s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem',
            boxShadow: 'var(--shadow-glow-blue)'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '700' }}>
            Third Umpire AI Guard Dog
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-cricket), var(--safe-green))',
            color: 'var(--text-primary)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: 'var(--shadow-glow-green)',
            animation: 'safeGlow 3s infinite'
          }}>
            ✅ Connected
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Enhanced Sidebar */}
        <nav style={{
          width: '250px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          minHeight: 'calc(100vh - 80px)',
          padding: '2rem 1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          {navigation.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>
                {item.icon}
              </span>
              {item.name}
            </button>
          ))}
        </nav>

        {/* Enhanced Main Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {currentView === 'dashboard' && (
            <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
              <h2 style={{ 
                color: 'var(--text-primary)', 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Security Dashboard
              </h2>
              
              {/* Enhanced Stats Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div className="stat-card">
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Total Activities
                  </h3>
                  <p style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: '700' }}>
                    {stats.total_activities}
                  </p>
                </div>
                
                <div className="stat-card">
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Active Alerts
                  </h3>
                  <p style={{ color: 'var(--danger-red)', fontSize: '2rem', fontWeight: '700' }}>
                    {stats.active_alerts}
                  </p>
                </div>
                
                <div className="stat-card">
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Users Monitored
                  </h3>
                  <p style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: '700' }}>
                    {stats.users_monitored}
                  </p>
                </div>
                
                <div className="stat-card">
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    System Uptime
                  </h3>
                  <p style={{ color: 'var(--safe-green)', fontSize: '2rem', fontWeight: '700' }}>
                    {stats.system_uptime}%
                  </p>
                </div>
              </div>

              {/* Enhanced Recent Alerts */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                    Recent Security Alerts
                  </h3>
                  <div style={{
                    background: 'var(--danger-red)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    animation: 'alertPulse 2s infinite'
                  }}>
                    {alerts.length} Active
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {alerts.slice(0, 5).map((alert, index) => (
                    <div key={index} className={`alert-${alert.severity} ${getAlertSeverityClass(alert.severity, alert.anomaly_score)}`} style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      animation: 'slideInUp 0.6s ease-out',
                      animationDelay: `${index * 0.1}s`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = 'var(--shadow-md)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>
                          {alert.severity === 'critical' ? '🚨' : alert.severity === 'high' ? '⚠️' : '🔍'}
                        </span>
                        <p style={{ 
                          color: alert.severity === 'critical' || alert.severity === 'high' ? 'var(--danger-red)' : 'var(--warning-yellow)', 
                          fontWeight: '600', 
                          margin: 0,
                          flex: 1
                        }}>
                          {alert.severity === 'critical' || alert.severity === 'high' ? 'Critical' : 'High'}: {alert.description}
                        </p>
                        <span style={{
                          background: alert.severity === 'critical' ? 'var(--danger-red)' : 'var(--warning-yellow)',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {Math.round(alert.anomaly_score * 100)}%
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        User: {alert.user_id} | Time: {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>✅</span>
                      <p style={{ margin: 0, fontSize: '1rem' }}>No active security alerts</p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                        System is running smoothly
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'alerts' && (
            <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  margin: 0,
                  background: 'linear-gradient(135deg, var(--danger-red), var(--warning-yellow))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Security Alerts
                </h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Filter:</span>
                    <select 
                      value={alertFilter}
                      onChange={(e) => setAlertFilter(e.target.value)}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        outline: 'none'
                      }}
                    >
                      <option value="all" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>All Alerts</option>
                      <option value="critical" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Critical</option>
                      <option value="high" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>High</option>
                      <option value="medium" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Medium</option>
                      <option value="low" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Low</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleRefreshAlerts}
                    className="btn-primary" 
                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
              
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, var(--danger-red), var(--warning-yellow))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow-red)',
                    animation: 'alertPulse 2s infinite'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🚨</span>
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
                      {filteredAlerts.length} Active Alerts Detected
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0.5rem 0 0 0' }}>
                      AI monitoring system has identified suspicious activities and security threats
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
                  {filteredAlerts.map((alert, index) => (
                    <div key={index} className={`alert-${alert.severity} ${getAlertSeverityClass(alert.severity, alert.anomaly_score)}`} style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      animation: 'slideInUp 0.6s ease-out',
                      animationDelay: `${index * 0.1}s`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '1px solid var(--border-color)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)'
                      e.target.style.boxShadow = 'var(--shadow-md)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>
                          {alert.severity === 'critical' ? '🚨' : alert.severity === 'high' ? '⚠️' : '🔍'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                            {alert.description}
                          </h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                            User: {alert.user_id} | Time: {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '0.5rem' }}>
                          <span style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: alert.severity === 'critical' ? 'var(--danger-red)' : 'var(--warning-yellow)',
                            color: 'white'
                          }}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)'
                          }}>
                            {Math.round(alert.anomaly_score * 100)}% Confidence
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleViewAlertDetails(alert)}
                          className="btn-primary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        >
                          📋 View Details
                        </button>
                        <button 
                          onClick={() => handleDismissAlert(alert.id)}
                          className="btn-danger" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        >
                          🚫 Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredAlerts.length === 0 && alerts.length > 0 && (
                    <div style={{
                      padding: '3rem',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '15px',
                      border: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                        No {alertFilter === 'all' ? '' : alertFilter} Alerts Found
                      </h3>
                      <p style={{ margin: 0, fontSize: '1rem' }}>
                        Try adjusting your filter to see more alerts
                      </p>
                    </div>
                  )}
                  {alerts.length === 0 && (
                    <div style={{
                      padding: '3rem',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '15px',
                      border: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>✅</span>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                        No Active Alerts
                      </h3>
                      <p style={{ margin: 0, fontSize: '1rem' }}>
                        Your system is secure and running smoothly
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'activities' && (
            <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
              <h2 style={{ 
                color: 'var(--text-primary)', 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--info-blue))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                User Activities
              </h2>
              <div className="card">
                <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                  📊 <strong>{activities.length} Total Activities</strong> monitored across {stats.users_monitored} users
                </p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  Real-time monitoring of user actions including logins, file access, 
                  database queries, and network activity.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  {activities.slice(0, 10).map((activity, index) => (
                    <div key={index} className="card" style={{
                      marginBottom: '1rem',
                      animation: 'slideInUp 0.6s ease-out',
                      animationDelay: `${index * 0.1}s`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>{activity.action}</h4>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: activity.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: activity.success ? 'var(--safe-green)' : 'var(--danger-red)',
                          border: `1px solid ${activity.success ? 'var(--safe-green)' : 'var(--danger-red)'}`
                        }}>
                          {activity.success ? 'SUCCESS' : 'FAILED'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                        User: {activity.user_id} | Time: {new Date(activity.timestamp).toLocaleString()} | IP: {activity.ip_address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'analytics' && (
            <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
              <h2 style={{ 
                color: 'var(--text-primary)', 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, var(--accent-glow), var(--accent-primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                AI Analytics
              </h2>
              <div className="card">
                <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                  🤖 <strong>AI-Powered Insights</strong> and behavioral analysis
                </p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  Machine learning algorithms analyze user behavior patterns, 
                  detect anomalies, and provide actionable security insights.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div className="stat-card">
                      <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Anomaly Score</h4>
                      <p style={{ color: 'var(--accent-primary)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                        {Math.round(stats.anomalies_detected_today || 0)}
                      </p>
                    </div>
                    <div className="stat-card">
                      <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>False Positive Rate</h4>
                      <p style={{ color: 'var(--safe-green)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                        {Math.round(stats.false_positive_rate || 0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'api-docs' && (
            <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
              <ApiDocs />
            </div>
          )}
        </main>
      </div>

      {/* Alert Details Modal */}
      {showAlertDetails && selectedAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '15px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            animation: 'slideInUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                Alert Details
              </h3>
              <button
                onClick={() => setShowAlertDetails(false)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  Description
                </h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
                  {selectedAlert.description}
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                    Severity
                  </h4>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    background: selectedAlert.severity === 'critical' ? 'var(--danger-red)' : 'var(--warning-yellow)',
                    color: 'white'
                  }}>
                    {selectedAlert.severity.toUpperCase()}
                  </span>
                </div>
                
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                    Confidence Score
                  </h4>
                  <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                    {Math.round(selectedAlert.anomaly_score * 100)}%
                  </p>
                </div>
              </div>
              
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                  User Information
                </h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
                  User ID: {selectedAlert.user_id}
                </p>
              </div>
              
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                  Timestamp
                </h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
                  {new Date(selectedAlert.timestamp).toLocaleString()}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => handleDismissAlert(selectedAlert.id)}
                  className="btn-danger"
                  style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                >
                  🚫 Dismiss Alert
                </button>
                <button 
                  onClick={() => setShowAlertDetails(false)}
                  className="btn-primary"
                  style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                >
                  ✓ Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-md)'
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App