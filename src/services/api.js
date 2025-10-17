import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Dashboard API
export const fetchDashboardStats = async () => {
  const response = await api.get('/dashboard/stats')
  return response
}

export const fetchRecentAlerts = async (limit = 50) => {
  const response = await api.get(`/alerts?limit=${limit}`)
  return response.alerts || []
}

export const fetchRecentActivities = async (limit = 100) => {
  const response = await api.get(`/activities/recent?limit=${limit}`)
  return response.activities || []
}

// Activities API
export const logActivity = async (activity) => {
  const response = await api.post('/activities', activity)
  return response
}

export const getUserActivities = async (userId, limit = 100) => {
  const response = await api.get(`/activities/user/${userId}?limit=${limit}`)
  return response.activities || []
}

// Alerts API
export const updateAlertStatus = async (alertId, status, notes = '') => {
  const response = await api.patch(`/alerts/${alertId}`, {
    status,
    investigation_notes: notes
  })
  return response
}

export const markAlertAsFalsePositive = async (alertId) => {
  const response = await api.patch(`/alerts/${alertId}`, {
    false_positive: true,
    status: 'resolved'
  })
  return response
}

export const resolveAlert = async (alertId, notes = '') => {
  const response = await api.patch(`/alerts/${alertId}`, {
    status: 'resolved',
    investigation_notes: notes
  })
  return response
}

// Analytics API
export const fetchAnalytics = async (timeRange = '24h') => {
  const response = await api.get(`/analytics?range=${timeRange}`)
  return response
}

export const fetchUserBehaviorProfile = async (userId) => {
  const response = await api.get(`/analytics/user/${userId}/behavior`)
  return response
}

// System API
export const checkSystemHealth = async () => {
  const response = await api.get('/health')
  return response
}

export const generateDemoData = async () => {
  const response = await api.post('/demo/generate')
  return response
}

// Settings API
export const updateSystemSettings = async (settings) => {
  const response = await api.put('/settings', settings)
  return response
}

export const fetchSystemSettings = async () => {
  const response = await api.get('/settings')
  return response
}

export default api
