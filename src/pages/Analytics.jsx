import React, { useState } from 'react'
import { useWebSocket } from '../contexts/WebSocketContext'
import { 
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  GlobeAltIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline'

const Analytics = () => {
  const { alerts, activities } = useWebSocket()
  const [timeRange, setTimeRange] = useState('24h')

  // Calculate analytics data
  const analyticsData = React.useMemo(() => {
    const now = new Date()
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }

    const range = timeRanges[timeRange] || timeRanges['24h']
    const startTime = new Date(now.getTime() - range)

    const filteredActivities = activities.filter(activity => 
      new Date(activity.timestamp) >= startTime
    )
    const filteredAlerts = alerts.filter(alert => 
      new Date(alert.timestamp) >= startTime
    )

    // Activity trends
    const activityTrends = {}
    const alertTrends = {}

    // Group by hour/day
    const groupBy = timeRange === '1h' ? 'minute' : timeRange === '24h' ? 'hour' : 'day'
    
    filteredActivities.forEach(activity => {
      const date = new Date(activity.timestamp)
      let key
      
      if (groupBy === 'minute') {
        key = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
      } else if (groupBy === 'hour') {
        key = date.getHours()
      } else {
        key = date.toDateString()
      }
      
      activityTrends[key] = (activityTrends[key] || 0) + 1
    })

    filteredAlerts.forEach(alert => {
      const date = new Date(alert.timestamp)
      let key
      
      if (groupBy === 'minute') {
        key = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
      } else if (groupBy === 'hour') {
        key = date.getHours()
      } else {
        key = date.toDateString()
      }
      
      alertTrends[key] = (alertTrends[key] || 0) + 1
    })

    // User behavior analysis
    const userStats = {}
    filteredActivities.forEach(activity => {
      if (!userStats[activity.user_id]) {
        userStats[activity.user_id] = {
          totalActivities: 0,
          suspiciousActivities: 0,
          successRate: 0,
          locations: new Set(),
          actions: {}
        }
      }
      
      const user = userStats[activity.user_id]
      user.totalActivities++
      
      if (!activity.success) {
        user.suspiciousActivities++
      }
      
      if (activity.location) {
        user.locations.add(`${activity.location.latitude},${activity.location.longitude}`)
      }
      
      user.actions[activity.action] = (user.actions[activity.action] || 0) + 1
    })

    // Calculate success rates
    Object.values(userStats).forEach(user => {
      user.successRate = ((user.totalActivities - user.suspiciousActivities) / user.totalActivities) * 100
      user.uniqueLocations = user.locations.size
    })

    // Top actions
    const actionCounts = {}
    filteredActivities.forEach(activity => {
      actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1
    })

    const topActions = Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    // Geographic distribution
    const locationCounts = {}
    filteredActivities.forEach(activity => {
      if (activity.location) {
        const key = `${activity.location.latitude.toFixed(2)},${activity.location.longitude.toFixed(2)}`
        locationCounts[key] = (locationCounts[key] || 0) + 1
      }
    })

    const topLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    return {
      activityTrends,
      alertTrends,
      userStats,
      topActions,
      topLocations,
      totalActivities: filteredActivities.length,
      totalAlerts: filteredAlerts.length,
      suspiciousActivities: filteredActivities.filter(a => 
        ['privilege_escalation', 'mass_data_access', 'suspicious_download'].includes(a.action)
      ).length
    }
  }, [alerts, activities, timeRange])

  const MetricCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
    const colors = {
      primary: 'text-primary-600',
      success: 'text-success-600',
      danger: 'text-danger-600',
      warning: 'text-warning-600'
    }

    return (
      <div className="stat-card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colors[color]}`} />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change !== undefined && (
              <div className="flex items-center text-sm">
                {change >= 0 ? (
                  <TrendingUpIcon className="w-4 h-4 text-success-500 mr-1" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4 text-danger-500 mr-1" />
                )}
                <span className={change >= 0 ? 'text-success-600' : 'text-danger-600'}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Insights and trends from user activities and security events
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input w-32"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Activities"
          value={analyticsData.totalActivities}
          icon={ChartBarIcon}
          color="primary"
        />
        <MetricCard
          title="Security Alerts"
          value={analyticsData.totalAlerts}
          icon={TrendingUpIcon}
          color="danger"
        />
        <MetricCard
          title="Suspicious Activities"
          value={analyticsData.suspiciousActivities}
          icon={TrendingDownIcon}
          color="warning"
        />
        <MetricCard
          title="Active Users"
          value={Object.keys(analyticsData.userStats).length}
          icon={UserGroupIcon}
          color="success"
        />
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trends */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Activity Trends</h2>
          </div>
          <div className="chart-container">
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Activity trends chart</p>
                <p className="text-sm">Data visualization would be implemented here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Top Actions</h2>
          </div>
          <div className="space-y-3">
            {analyticsData.topActions.map(([action, count], index) => (
              <div key={action} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {action.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Behavior Analysis */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">User Behavior</h2>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {Object.entries(analyticsData.userStats).map(([userId, stats]) => (
              <div key={userId} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{userId}</span>
                  <span className="text-sm text-gray-500">{stats.totalActivities} activities</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Success Rate: {stats.successRate.toFixed(1)}%</div>
                  <div>Locations: {stats.uniqueLocations}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Top Locations</h2>
          </div>
          <div className="space-y-3">
            {analyticsData.topLocations.map(([location, count], index) => (
              <div key={location} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{location}</span>
                </div>
                <span className="text-sm text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
