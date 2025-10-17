import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

const AlertList = ({ alerts = [] }) => {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircleIcon className="w-5 h-5 text-red-600" />
      case 'high':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
      case 'medium':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'low':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'alert-card border-l-red-600 bg-red-50'
      case 'high':
        return 'alert-card border-l-red-500 bg-red-50'
      case 'medium':
        return 'alert-card border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'alert-card border-l-blue-500 bg-blue-50'
      default:
        return 'alert-card border-l-gray-500 bg-gray-50'
    }
  }

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severity] || colors.low}`}>
        {severity.toUpperCase()}
      </span>
    )
  }

  const getAnomalyScoreColor = (score) => {
    if (score >= 0.8) return 'text-red-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-blue-600'
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No recent alerts</p>
        <p className="text-sm text-gray-400">Security alerts will appear here in real-time</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {alerts.map((alert, index) => (
        <div key={alert.id || index} className={`${getSeverityColor(alert.severity)} alert-slide-in`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(alert.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {alert.user_id}
                  </p>
                  {getSeverityBadge(alert.severity)}
                </div>
                
                <p className="text-sm text-gray-700 mb-2">
                  {alert.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </span>
                    <span className={`font-medium ${getAnomalyScoreColor(alert.anomaly_score)}`}>
                      Score: {(alert.anomaly_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      alert.status === 'active' ? 'bg-red-100 text-red-800' :
                      alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertList
