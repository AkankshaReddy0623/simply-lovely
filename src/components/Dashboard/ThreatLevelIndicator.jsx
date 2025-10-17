import React from 'react'
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const ThreatLevelIndicator = ({ level = 'low' }) => {
  const threatConfig = {
    low: {
      icon: ShieldCheckIcon,
      color: 'success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-500',
      textColor: 'text-success-800',
      iconColor: 'text-success-600',
      title: 'Low Threat',
      description: 'System operating normally',
      pulse: false
    },
    medium: {
      icon: ExclamationTriangleIcon,
      color: 'warning',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-500',
      textColor: 'text-warning-800',
      iconColor: 'text-warning-600',
      title: 'Medium Threat',
      description: 'Some suspicious activity detected',
      pulse: true
    },
    high: {
      icon: ExclamationCircleIcon,
      color: 'danger',
      bgColor: 'bg-danger-50',
      borderColor: 'border-danger-500',
      textColor: 'text-danger-800',
      iconColor: 'text-danger-600',
      title: 'High Threat',
      description: 'Multiple security incidents detected',
      pulse: true
    },
    critical: {
      icon: XCircleIcon,
      color: 'danger',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-600',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      title: 'Critical Threat',
      description: 'Immediate security action required',
      pulse: true
    }
  }

  const config = threatConfig[level] || threatConfig.low
  const Icon = config.icon

  return (
    <div className={`p-4 rounded-lg border-l-4 ${config.bgColor} ${config.borderColor} ${config.pulse ? 'animate-pulse-slow' : ''}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`w-6 h-6 ${config.iconColor} ${config.pulse ? 'animate-pulse' : ''}`} />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {config.title}
          </h3>
          <p className={`text-xs ${config.textColor} opacity-75`}>
            {config.description}
          </p>
        </div>
        <div className="ml-auto">
          <div className={`w-3 h-3 rounded-full ${
            level === 'low' ? 'bg-success-500' :
            level === 'medium' ? 'bg-warning-500' :
            level === 'high' ? 'bg-danger-500' :
            'bg-red-600'
          } ${config.pulse ? 'animate-pulse' : ''}`} />
        </div>
      </div>
    </div>
  )
}

export default ThreatLevelIndicator
