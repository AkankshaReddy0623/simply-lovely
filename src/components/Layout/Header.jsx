import React from 'react'
import { 
  Bars3Icon, 
  BellIcon, 
  WifiIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { useWebSocket } from '../../contexts/WebSocketContext'

const Header = ({ onMenuClick, connectionStatus }) => {
  const { user, logout } = useAuth()
  const { isConnected } = useWebSocket()

  const getConnectionIcon = () => {
    if (isConnected) {
      return <WifiIcon className="w-5 h-5 text-success-500" />
    }
    return <ExclamationTriangleIcon className="w-5 h-5 text-danger-500" />
  }

  const getConnectionText = () => {
    if (isConnected) {
      return 'Connected'
    }
    return 'Disconnected'
  }

  const getConnectionColor = () => {
    if (isConnected) {
      return 'text-success-600'
    }
    return 'text-danger-600'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={onMenuClick}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            {/* Connection status */}
            <div className="hidden sm:flex items-center ml-4 lg:ml-0">
              <div className="flex items-center space-x-2">
                {getConnectionIcon()}
                <span className={`text-sm font-medium ${getConnectionColor()}`}>
                  {getConnectionText()}
                </span>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Security Admin'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'admin'}
                </p>
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              
              {/* Logout button */}
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
