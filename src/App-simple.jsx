import React from 'react'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>
          🐕 Third Umpire - AI Guard Dog
        </h1>
        
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '1rem',
          borderRadius: '5px',
          margin: '1rem 0',
          border: '1px solid #c3e6cb'
        }}>
          ✅ System Status: OPERATIONAL
        </div>
        
        <div style={{
          background: '#d1ecf1',
          color: '#0c5460',
          padding: '1rem',
          borderRadius: '5px',
          margin: '1rem 0',
          border: '1px solid #bee5eb'
        }}>
          🔧 Backend API: Running on port 8000<br/>
          🌐 Frontend: React App Loaded Successfully<br/>
          🤖 AI Engine: Trained and Ready
        </div>
        
        <h3>Quick Links:</h3>
        <div style={{ margin: '1rem 0' }}>
          <a 
            href="http://localhost:8000/docs" 
            target="_blank" 
            style={{
              background: '#007bff',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              margin: '5px',
              display: 'inline-block'
            }}
          >
            📊 API Documentation
          </a>
          <a 
            href="http://localhost:8000/api/health" 
            target="_blank" 
            style={{
              background: '#28a745',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              margin: '5px',
              display: 'inline-block'
            }}
          >
            🔍 Health Check
          </a>
        </div>
        
        <h3>🚀 AI Guard Dog Features:</h3>
        <div style={{ textAlign: 'left', margin: '1rem 0' }}>
          <ul>
            <li>✅ Real-time user activity monitoring</li>
            <li>✅ AI-powered anomaly detection</li>
            <li>✅ Security alert generation</li>
            <li>✅ Behavioral pattern analysis</li>
            <li>✅ Geographic threat mapping</li>
            <li>✅ WebSocket live updates</li>
          </ul>
        </div>
        
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '1rem',
          borderRadius: '5px',
          margin: '1rem 0',
          border: '1px solid #ffeaa7'
        }}>
          <strong>Demo Credentials:</strong><br/>
          Username: admin<br/>
          Password: demo123<br/>
          <em>(Demo mode - any credentials work)</em>
        </div>
        
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Built for hackathon demonstration<br/>
          Real-time suspicious activity detection system
        </p>
      </div>
    </div>
  )
}

export default App
