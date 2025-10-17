import React from 'react'
import { 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  WifiIcon,
  CpuChipIcon,
  ServerIcon
} from '@heroicons/react/24/outline'

const SystemHealth = ({ isConnected, alertsCount, activitiesCount }) => {
  const healthMetrics = [
    {
      name: 'AI Engine',
      status: 'healthy',
      icon: CpuChipIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      name: 'Database',
      status: 'healthy',
      icon: ServerIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      name: 'WebSocket',
      status: isConnected ? 'healthy' : 'error',
      icon: WifiIcon,
      color: isConnected ? 'text-success-600' : 'text-danger-600',
      bgColor: isConnected ? 'bg-success-100' : 'bg-danger-100'
    },
    {
      name: 'Monitoring',
      status: activitiesCount > 0 ? 'healthy' : 'warning',
      icon: CheckCircleIcon,
      color: activitiesCount > 0 ? 'text-success-600' : 'text-warning-600',
      bgColor: activitiesCount > 0 ? 'bg-success-100' : 'bg-warning-100'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-4 h-4 text-success-600" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-warning-600" />
      case 'error':
        return <XCircleIcon className="w-4 h-4 text-danger-600" />
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-600" />
    }
  }

  const getOverallStatus = () => {
    const errorCount = healthMetrics.filter(metric => metric.status === 'error').length
    const warningCount = healthMetrics.filter(metric => metric.status === 'warning').length
    
    if (errorCount > 0) return { status: 'error', color: 'text-danger-600', bgColor: 'bg-danger-50' }
    if (warningCount > 0) return { status: 'warning', color: 'text-warning-600', bgColor: 'bg-warning-50' }
    return { status: 'healthy', color: 'text-success-600', bgColor: 'bg-success-50' }
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className={`p-3 rounded-lg ${overallStatus.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(overallStatus.status)}
            <span className={`text-sm font-medium ${overallStatus.color}`}>
              System {overallStatus.status.charAt(0).toUpperCase() + overallStatus.status.slice(1)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last checked: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-3">
        {healthMetrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                <p className="text-xs text-gray-500">
                  {metric.status === 'healthy' ? 'Operational' :
                   metric.status === 'warning' ? 'Degraded' : 'Offline'}
                </p>
              </div>
            </div>
            {getStatusIcon(metric.status)}
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Active Alerts</span>
            <span className={`text-sm font-medium ${alertsCount > 0 ? 'text-danger-600' : 'text-success-600'}`}>
              {alertsCount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Activities Processed</span>
            <span className="text-sm font-medium text-gray-900">
              {activitiesCount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Response Time</span>
            <span className="text-sm font-medium text-success-600">
              &lt;100ms
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Uptime</span>
            <span className="text-sm font-medium text-success-600">
              99.9%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemHealth
