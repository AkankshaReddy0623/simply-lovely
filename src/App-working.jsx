import React, { useState } from 'react'
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

// Simple Login Component
const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple demo login - any credentials work
    setIsLoggedIn(true)
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          borderRadius: '20px',
          margin: '0 auto 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
        }}>
          <span style={{ fontSize: '2rem' }}>🛡️</span>
        </div>
        
        <h1 style={{ 
          color: '#1f2937', 
          marginBottom: '1rem',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Third Umpire
        </h1>
        
        <p style={{
          color: '#6b7280',
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
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
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
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Login to Dashboard
          </button>
        </form>
        
        <p style={{ fontSize: '0.8em', color: '#9ca3af', marginTop: '1rem' }}>
          Demo mode - any credentials work
        </p>
      </div>
    </div>
  )
}

// Simple Dashboard Component
const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard')

  const stats = {
    total_activities: 202,
    active_alerts: 20,
    users_monitored: 11,
    system_uptime: 99.9
  }

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { id: 'alerts', name: 'Alerts', icon: '⚠️' },
    { id: 'activities', name: 'Activities', icon: '💻' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
          </div>
          <h1 style={{ color: '#1f2937', fontSize: '1.5rem', fontWeight: '700' }}>
            Third Umpire AI Guard Dog
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            ✅ Connected
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <nav style={{
          width: '250px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          minHeight: 'calc(100vh - 80px)',
          padding: '2rem 1rem',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        }}>
          {navigation.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                width: '100%',
                padding: '1rem',
                margin: '0.5rem 0',
                borderRadius: '10px',
                border: 'none',
                background: currentView === item.id 
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                  : 'transparent',
                color: currentView === item.id ? 'white' : '#374151',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>
                {item.icon}
              </span>
              {item.name}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {currentView === 'dashboard' && (
            <div>
              <h2 style={{ color: '#1f2937', fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
                Security Dashboard
              </h2>
              
              {/* Stats Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h3 style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Total Activities
                  </h3>
                  <p style={{ color: '#1f2937', fontSize: '2rem', fontWeight: '700' }}>
                    {stats.total_activities}
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h3 style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Active Alerts
                  </h3>
                  <p style={{ color: '#ef4444', fontSize: '2rem', fontWeight: '700' }}>
                    {stats.active_alerts}
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h3 style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Users Monitored
                  </h3>
                  <p style={{ color: '#1f2937', fontSize: '2rem', fontWeight: '700' }}>
                    {stats.users_monitored}
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h3 style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    System Uptime
                  </h3>
                  <p style={{ color: '#10b981', fontSize: '2rem', fontWeight: '700' }}>
                    {stats.system_uptime}%
                  </p>
                </div>
              </div>

              {/* Recent Alerts */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ color: '#1f2937', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                  Recent Security Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    borderRadius: '10px',
                    borderLeft: '4px solid #ef4444'
                  }}>
                    <p style={{ color: '#dc2626', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                      Critical: Suspicious file download detected
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0' }}>
                      User: john.doe | Time: 2 minutes ago | Confidence: 95%
                    </p>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                    borderRadius: '10px',
                    borderLeft: '4px solid #f59e0b'
                  }}>
                    <p style={{ color: '#d97706', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                      High: Unusual login pattern detected
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0' }}>
                      User: admin.001 | Time: 15 minutes ago | Confidence: 87%
                    </p>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                    borderRadius: '10px',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <p style={{ color: '#2563eb', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                      Medium: Database access pattern changed
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0' }}>
                      User: user.003 | Time: 1 hour ago | Confidence: 73%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'alerts' && (
            <div>
              <h2 style={{ color: '#1f2937', fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
                Security Alerts
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ color: '#374151', fontSize: '1.1rem' }}>
                  🚨 <strong>20 Active Alerts</strong> detected by AI monitoring system
                </p>
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                  Our AI has identified suspicious activities including unusual file downloads, 
                  privilege escalation attempts, and anomalous login patterns.
                </p>
              </div>
            </div>
          )}

          {currentView === 'activities' && (
            <div>
              <h2 style={{ color: '#1f2937', fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
                User Activities
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ color: '#374151', fontSize: '1.1rem' }}>
                  📊 <strong>202 Total Activities</strong> monitored across 11 users
                </p>
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                  Real-time monitoring of user actions including logins, file access, 
                  database queries, and network activity.
                </p>
              </div>
            </div>
          )}

          {currentView === 'analytics' && (
            <div>
              <h2 style={{ color: '#1f2937', fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
                AI Analytics
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ color: '#374151', fontSize: '1.1rem' }}>
                  🤖 <strong>AI-Powered Insights</strong> and behavioral analysis
                </p>
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                  Machine learning algorithms analyze user behavior patterns, 
                  detect anomalies, and provide actionable security insights.
                </p>
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
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
