import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  HomeIcon,
  ExclamationTriangleIcon,
  ActivityIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useWebSocket } from '../../contexts/WebSocketContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { alerts } = useWebSocket()
  
  // Count active alerts
  const activeAlertsCount = alerts.filter(alert => 
    alert.severity === 'high' || alert.severity === 'critical'
  ).length

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { 
      name: 'Alerts', 
      href: '/alerts', 
      icon: ExclamationTriangleIcon,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null
    },
    { name: 'Activities', href: '/activities', icon: ActivityIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ]

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={({ isActive }) =>
        `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          isActive
            ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <item.icon
        className={`mr-3 h-5 w-5 flex-shrink-0 ${
          location.pathname === item.href
            ? 'text-primary-600'
            : 'text-gray-400 group-hover:text-gray-500'
        }`}
      />
      {item.name}
      {item.badge && (
        <span className="ml-auto bg-danger-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
          {item.badge}
        </span>
      )}
    </NavLink>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gradient">Third Umpire</h1>
              <p className="text-xs text-gray-500">AI Guard Dog</p>
            </div>
          </div>
          
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          
          {/* Footer */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Security Monitoring System</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 flex z-50 ${isOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 opacity-75" onClick={onClose} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gradient">Third Umpire</h1>
                <p className="text-xs text-gray-500">AI Guard Dog</p>
              </div>
            </div>
            
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Security Monitoring System</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
