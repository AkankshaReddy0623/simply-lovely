import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on app load
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      setIsLoading(true)
      
      // Simulate login API call
      // In a real app, this would call your authentication endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo mode - accept any credentials
      const userData = {
        id: 'admin',
        username: credentials.username || 'admin',
        email: 'admin@example.com',
        role: 'admin',
        name: 'Administrator',
        avatar: '👤'
      }
      
      const token = 'demo_token_' + Date.now()
      
      // Store authentication data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_data', JSON.stringify(userData))
      
      setUser(userData)
      setIsAuthenticated(true)
      
      toast.success(`Welcome back, ${userData.name}!`)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear authentication data
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    
    setUser(null)
    setIsAuthenticated(false)
    
    toast.success('Logged out successfully')
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
    localStorage.setItem('user_data', JSON.stringify({ ...user, ...userData }))
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}