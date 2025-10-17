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
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        // Clear invalid data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setIsLoading(true)
      
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo authentication - accept any credentials for demo purposes
      const demoUser = {
        id: 'admin_001',
        username: credentials.username || 'admin',
        email: 'admin@thirdumpire.com',
        role: 'admin',
        name: 'Security Administrator',
        avatar: null,
        lastLogin: new Date().toISOString()
      }
      
      // Store auth data
      localStorage.setItem('auth_token', 'demo_token_12345')
      localStorage.setItem('user_data', JSON.stringify(demoUser))
      
      setUser(demoUser)
      setIsAuthenticated(true)
      
      toast.success(`Welcome back, ${demoUser.name}!`)
      
      return { success: true, user: demoUser }
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Clear auth data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      setUser(null)
      setIsAuthenticated(false)
      
      toast.success('Logged out successfully')
      
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error during logout')
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' }
      
      const updatedUser = { ...user, ...updates }
      
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      toast.success('Profile updated successfully')
      
      return { success: true, user: updatedUser }
      
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
