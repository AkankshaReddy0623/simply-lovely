import React from 'react'
import LoadingSpinner from '../UI/LoadingSpinner'

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  color = 'primary', 
  loading = false,
  className = '' 
}) => {
  const colorClasses = {
    primary: {
      icon: 'text-primary-600',
      bg: 'bg-primary-100',
      change: change >= 0 ? 'text-success-600' : 'text-danger-600'
    },
    success: {
      icon: 'text-success-600',
      bg: 'bg-success-100',
      change: change >= 0 ? 'text-success-600' : 'text-danger-600'
    },
    warning: {
      icon: 'text-warning-600',
      bg: 'bg-warning-100',
      change: change >= 0 ? 'text-success-600' : 'text-danger-600'
    },
    danger: {
      icon: 'text-danger-600',
      bg: 'bg-danger-100',
      change: change >= 0 ? 'text-success-600' : 'text-danger-600'
    }
  }

  const colors = colorClasses[color] || colorClasses.primary

  if (loading) {
    return (
      <div className={`stat-card ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
              <LoadingSpinner size="sm" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 truncate">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className={`text-sm ${colors.change}`}>
            {change >= 0 ? '+' : ''}{change} {changeLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatCard
