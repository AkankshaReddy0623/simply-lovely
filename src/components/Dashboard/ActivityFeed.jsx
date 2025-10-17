import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  UserIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const ActivityFeed = ({ activities = [] }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'login':
        return <ShieldCheckIcon className="w-4 h-4 text-success-500" />
      case 'logout':
        return <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
      case 'privilege_escalation':
      case 'mass_data_access':
      case 'suspicious_download':
        return <ExclamationTriangleIcon className="w-4 h-4 text-danger-500" />
      default:
        return <ComputerDesktopIcon className="w-4 h-4 text-primary-500" />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'login':
        return 'bg-success-100 text-success-800'
      case 'logout':
        return 'bg-gray-100 text-gray-800'
      case 'privilege_escalation':
      case 'mass_data_access':
      case 'suspicious_download':
        return 'bg-danger-100 text-danger-800'
      default:
        return 'bg-primary-100 text-primary-800'
    }
  }

  const getStatusIcon = (success) => {
    return success ? (
      <div className="w-2 h-2 bg-success-500 rounded-full" />
    ) : (
      <div className="w-2 h-2 bg-danger-500 rounded-full" />
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <ComputerDesktopIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No recent activities</p>
        <p className="text-sm text-gray-400">User activities will appear here in real-time</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {activities.map((activity, index) => (
        <div key={activity.id || index} className="activity-item">
          <div className="flex-shrink-0">
            <div className="activity-avatar bg-gray-100">
              <UserIcon className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {activity.user_id}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionColor(activity.action)}`}>
                  {activity.action.replace('_', ' ')}
                </span>
                {getActionIcon(activity.action)}
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(activity.success)}
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
            
            <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <GlobeAltIcon className="w-3 h-3" />
                <span>{activity.ip_address}</span>
              </div>
              {activity.location && (
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>
                    {activity.location.latitude?.toFixed(2)}, {activity.location.longitude?.toFixed(2)}
                  </span>
                </div>
              )}
              {activity.failed_attempts > 0 && (
                <span className="text-danger-500">
                  {activity.failed_attempts} failed attempts
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityFeed
