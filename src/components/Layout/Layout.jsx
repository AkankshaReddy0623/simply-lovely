import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useWebSocket } from '../../contexts/WebSocketContext'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isConnected } = useWebSocket()

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          connectionStatus={isConnected}
        />
        
        {/* Page content */}
        <main className="p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 pointer-events-none rounded-2xl" />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-sm" />
        </div>
      )}
    </div>
  )
}

export default Layout
