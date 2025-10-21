import React, { useState, useEffect } from 'react'
import './ApiDocs.css'

const ApiDocs = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [apiResponses, setApiResponses] = useState({})
  const [loading, setLoading] = useState({})

  const apiEndpoints = [
    {
      id: 'health',
      title: 'Health Check',
      description: 'Check system health and status',
      method: 'GET',
      path: '/api/health',
      color: 'safe-green',
      icon: '💚'
    },
    {
      id: 'dashboard-stats',
      title: 'Dashboard Statistics',
      description: 'Get comprehensive dashboard statistics',
      method: 'GET',
      path: '/api/dashboard/stats',
      color: 'info-blue',
      icon: '📊'
    },
    {
      id: 'alerts',
      title: 'Security Alerts',
      description: 'Retrieve security alerts and notifications',
      method: 'GET',
      path: '/api/alerts',
      color: 'danger-red',
      icon: '🚨'
    },
    {
      id: 'activities',
      title: 'User Activities',
      description: 'Get recent user activities and logs',
      method: 'GET',
      path: '/api/activities/recent',
      color: 'accent-primary',
      icon: '💻'
    },
    {
      id: 'log-activity',
      title: 'Log Activity',
      description: 'Log new user activity for monitoring',
      method: 'POST',
      path: '/api/activities',
      color: 'warning-yellow',
      icon: '📝'
    },
    {
      id: 'demo-generate',
      title: 'Generate Demo Data',
      description: 'Generate sample data for testing',
      method: 'POST',
      path: '/api/demo/generate',
      color: 'accent-cricket',
      icon: '🎲'
    },
    {
      id: 'websocket',
      title: 'WebSocket Connection',
      description: 'Real-time updates and notifications',
      method: 'WS',
      path: '/ws',
      color: 'accent-glow',
      icon: '🔌'
    }
  ]

  const testEndpoint = async (endpoint) => {
    setLoading(prev => ({ ...prev, [endpoint.id]: true }))
    
    try {
      let response
      if (endpoint.method === 'GET') {
        response = await fetch(`http://localhost:8000${endpoint.path}`)
      } else if (endpoint.method === 'POST') {
        response = await fetch(`http://localhost:8000${endpoint.path}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        })
      }
      
      const data = await response.json()
      setApiResponses(prev => ({
        ...prev,
        [endpoint.id]: {
          status: response.status,
          data: data,
          timestamp: new Date().toLocaleString()
        }
      }))
    } catch (error) {
      setApiResponses(prev => ({
        ...prev,
        [endpoint.id]: {
          status: 'error',
          data: { error: error.message },
          timestamp: new Date().toLocaleString()
        }
      }))
    } finally {
      setLoading(prev => ({ ...prev, [endpoint.id]: false }))
    }
  }

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'var(--safe-green)'
      case 'POST': return 'var(--warning-yellow)'
      case 'PUT': return 'var(--info-blue)'
      case 'DELETE': return 'var(--danger-red)'
      case 'WS': return 'var(--accent-glow)'
      default: return 'var(--text-secondary)'
    }
  }

  const getStatusColor = (status) => {
    if (status === 'error') return 'var(--danger-red)'
    if (status >= 200 && status < 300) return 'var(--safe-green)'
    if (status >= 300 && status < 400) return 'var(--warning-yellow)'
    if (status >= 400) return 'var(--danger-red)'
    return 'var(--text-secondary)'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: 'Inter, system-ui, sans-serif',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      {/* Header */}
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
            <span style={{ fontSize: '1.5rem' }}>📚</span>
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '700' }}>
            Third Umpire API Documentation
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
            boxShadow: 'var(--shadow-glow-green)'
          }}>
            🔗 API v1.0
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar - API Endpoints */}
        <nav style={{
          width: '350px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          padding: '2rem 1rem',
          boxShadow: 'var(--shadow-md)',
          overflowY: 'auto'
        }}>
          <h2 style={{
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            paddingLeft: '0.5rem'
          }}>
            API Endpoints
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={endpoint.id}
                className={`api-endpoint-card ${selectedEndpoint?.id === endpoint.id ? 'selected' : ''}`}
                onClick={() => setSelectedEndpoint(endpoint)}
                style={{
                  animation: 'slideInLeft 0.6s ease-out',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{endpoint.icon}</span>
                    <div>
                      <h3 style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        margin: 0
                      }}>
                        {endpoint.title}
                      </h3>
                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        margin: '0.25rem 0 0 0'
                      }}>
                        {endpoint.description}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    background: getMethodColor(endpoint.method),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}>
                    {endpoint.method}
                  </div>
                </div>
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: 'var(--text-tertiary)'
                }}>
                  {endpoint.path}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content - API Details */}
        <main style={{ flex: 1, padding: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedEndpoint ? (
            <div style={{ animation: 'slideInUp 0.6s ease-out', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-color)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>{selectedEndpoint.icon}</span>
                  <div>
                    <h2 style={{
                      color: 'var(--text-primary)',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      margin: 0
                    }}>
                      {selectedEndpoint.title}
                    </h2>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '1rem',
                      margin: '0.5rem 0 0 0'
                    }}>
                      {selectedEndpoint.description}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                      METHOD
                    </h4>
                    <span style={{
                      background: getMethodColor(selectedEndpoint.method),
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {selectedEndpoint.method}
                    </span>
                  </div>
                  
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                      ENDPOINT
                    </h4>
                    <code style={{
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}>
                      {selectedEndpoint.path}
                    </code>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <button
                    onClick={() => testEndpoint(selectedEndpoint)}
                    disabled={loading[selectedEndpoint.id]}
                    className="btn-primary"
                    style={{
                      padding: '0.75rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: loading[selectedEndpoint.id] ? 0.7 : 1,
                      cursor: loading[selectedEndpoint.id] ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading[selectedEndpoint.id] ? (
                      <>
                        <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        🚀 Test Endpoint
                      </>
                    )}
                  </button>
                </div>

                {apiResponses[selectedEndpoint.id] && (
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    border: '1px solid var(--border-color)',
                    marginTop: '1rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    minHeight: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexShrink: 0 }}>
                      <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                        Response
                      </h4>
                      <span style={{
                        background: getStatusColor(apiResponses[selectedEndpoint.id].status),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {apiResponses[selectedEndpoint.id].status}
                      </span>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        {apiResponses[selectedEndpoint.id].timestamp}
                      </span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            const responseData = JSON.stringify(apiResponses[selectedEndpoint.id].data, null, 2)
                            navigator.clipboard.writeText(responseData)
                          }}
                          style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          📋 Copy
                        </button>
                        <button
                          onClick={() => {
                            const responseData = apiResponses[selectedEndpoint.id].data
                            const blob = new Blob([JSON.stringify(responseData, null, 2)], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${selectedEndpoint.id}-response.json`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          style={{
                            background: 'var(--accent-cricket)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          💾 Download
                        </button>
                      </div>
                    </div>
                    <div style={{
                      background: 'var(--bg-primary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{
                        background: 'var(--bg-secondary)',
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600' }}>
                          JSON Response
                        </span>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
                          {JSON.stringify(apiResponses[selectedEndpoint.id].data).length} characters
                        </span>
                      </div>
                      <pre style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        overflow: 'auto',
                        fontFamily: 'monospace',
                        padding: '1rem',
                        margin: 0,
                        flex: 1,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {JSON.stringify(apiResponses[selectedEndpoint.id].data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
              textAlign: 'center'
            }}>
              <div>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <span style={{ fontSize: '3rem' }}>📚</span>
                </div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Select an API Endpoint
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  Choose an endpoint from the sidebar to view details and test the API
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ApiDocs
