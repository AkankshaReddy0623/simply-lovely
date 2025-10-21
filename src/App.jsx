import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
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

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { id: 'alerts', name: 'Alerts', icon: '⚠️' },
    { id: 'activities', name: 'Activities', icon: '💻' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
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
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                  Recent Security Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {alerts.slice(0, 5).map((alert, index) => (
                    <div key={index} className={`alert-${alert.severity} ${getAlertSeverityClass(alert.severity, alert.anomaly_score)}`} style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      animation: 'slideInUp 0.6s ease-out',
                      animationDelay: `${index * 0.1}s`
                    }}>
                      <p style={{ 
                        color: alert.severity === 'critical' || alert.severity === 'high' ? 'var(--danger-red)' : 'var(--warning-yellow)', 
                        fontWeight: '600', 
                        margin: '0 0 0.25rem 0' 
                      }}>
                        {alert.severity === 'critical' || alert.severity === 'high' ? 'Critical' : 'High'}: {alert.description}
                      </p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0' }}>
                        User: {alert.user_id} | Time: {new Date(alert.timestamp).toLocaleString()} | Confidence: {Math.round(alert.anomaly_score * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'alerts' && (
            <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
              <h2 style={{ 
                color: 'var(--text-primary)', 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, var(--danger-red), var(--warning-yellow))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Security Alerts
              </h2>
              <div className="card">
                <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                  🚨 <strong>{alerts.length} Active Alerts</strong> detected by AI monitoring system
                </p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  Our AI has identified suspicious activities including unusual file downloads, 
                  privilege escalation attempts, and anomalous login patterns.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  {alerts.map((alert, index) => (
                    <div key={index} className="card" style={{
                      marginBottom: '1rem',
                      animation: 'slideInUp 0.6s ease-out',
                      animationDelay: `${index * 0.1}s`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>{alert.description}</h4>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: alert.severity === 'critical' ? 'var(--danger-red)' : 'var(--warning-yellow)',
                          border: `1px solid ${alert.severity === 'critical' ? 'var(--danger-red)' : 'var(--warning-yellow)'}`
                        }}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                        User: {alert.user_id} | Time: {new Date(alert.timestamp).toLocaleString()} | Score: {Math.round(alert.anomaly_score * 100)}%
                      </p>
                    </div>
                  ))}
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
        </main>
      </div>
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