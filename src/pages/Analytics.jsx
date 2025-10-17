import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { fetchAnalytics, fetchRecentAlerts, fetchRecentActivities } from '../services/api'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('24h')

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery(
    ['analytics', timeRange],
    () => fetchAnalytics(timeRange),
    {
      refetchInterval: 60000
    }
  )

  // Fetch alerts for trend analysis
  const { data: alerts = [] } = useQuery(
    'alerts-analytics',
    () => fetchRecentAlerts(100),
    { refetchInterval: 30000 }
  )

  // Fetch activities for trend analysis
  const { data: activities = [] } = useQuery(
    'activities-analytics',
    () => fetchRecentActivities(200),
    { refetchInterval: 30000 }
  )

  // Calculate trends
  const getTrends = () => {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recentAlerts = alerts.filter(alert => new Date(alert.timestamp) > last24h)
    const olderAlerts = alerts.filter(alert => {
      const date = new Date(alert.timestamp)
      return date > last7d && date <= last24h
    })

    const recentActivities = activities.filter(activity => new Date(activity.timestamp) > last24h)
    const olderActivities = activities.filter(activity => {
      const date = new Date(activity.timestamp)
      return date > last7d && date <= last24h
    })

    return {
      alertsTrend: recentAlerts.length - olderAlerts.length,
      activitiesTrend: recentActivities.length - olderActivities.length,
      alertTrendPercent: olderAlerts.length > 0 ? 
        ((recentAlerts.length - olderAlerts.length) / olderAlerts.length * 100) : 0,
      activityTrendPercent: olderActivities.length > 0 ? 
        ((recentActivities.length - olderActivities.length) / olderActivities.length * 100) : 0
    }
  }

  const trends = getTrends()

  const getThreatDistribution = () => {
    const distribution = {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length
    }
    return distribution
  }

  const threatDistribution = getThreatDistribution()

  const getTopUsers = () => {
    const userActivity = activities.reduce((acc, activity) => {
      acc[activity.user_id] = (acc[activity.user_id] || 0) + 1
      return acc
    }, {})

    return Object.entries(userActivity)
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  const topUsers = getTopUsers()

  const getActivityTypes = () => {
    const activityTypes = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1
      return acc
    }, {})

    return Object.entries(activityTypes)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
  }

  const activityTypes = getActivityTypes()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">
            Security insights and threat analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input w-40"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="btn btn-primary">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">{alerts.length}</p>
              <div className="flex items-center mt-1">
                {trends.alertsTrend >= 0 ? (
                  <TrendingUpIcon className="w-4 h-4 text-danger-500 mr-1" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4 text-success-500 mr-1" />
                )}
                <span className={`text-sm ${trends.alertsTrend >= 0 ? 'text-danger-600' : 'text-success-600'}`}>
                  {Math.abs(trends.alertTrendPercent).toFixed(1)}%
                </span>
              </div>
            </div>
            <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{activities.length}</p>
              <div className="flex items-center mt-1">
                {trends.activitiesTrend >= 0 ? (
                  <TrendingUpIcon className="w-4 h-4 text-primary-500 mr-1" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4 text-gray-500 mr-1" />
                )}
                <span className={`text-sm ${trends.activitiesTrend >= 0 ? 'text-primary-600' : 'text-gray-600'}`}>
                  {Math.abs(trends.activityTrendPercent).toFixed(1)}%
                </span>
              </div>
            </div>
            <UserGroupIcon className="w-8 h-8 text-success-600" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Severity</p>
              <p className="text-2xl font-semibold text-danger-600">
                {threatDistribution.critical + threatDistribution.high}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Critical + High alerts
              </p>
            </div>
            <div className="w-8 h-8 bg-danger-100 rounded-full flex items-center justify-center">
              <span className="text-danger-600 font-bold">!</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-semibold text-success-600">&lt;100ms</p>
              <p className="text-sm text-gray-500 mt-1">
                System performance
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-warning-600" />
          </div>
        </div>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Threat Distribution</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(threatDistribution).map(([severity, count]) => {
              const total = Object.values(threatDistribution).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? (count / total * 100) : 0
              const colors = {
                critical: 'bg-red-600',
                high: 'bg-red-500',
                medium: 'bg-yellow-500',
                low: 'bg-blue-500'
              }
              
              return (
                <div key={severity} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {severity} Threats
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[severity]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Users */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Most Active Users</h2>
          </div>
          <div className="space-y-3">
            {topUsers.slice(0, 8).map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {user.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.user}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{user.count} activities</span>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary-600 h-1.5 rounded-full"
                      style={{ width: `${(user.count / topUsers[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Types */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Activity Types Distribution</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {activityTypes.slice(0, 12).map((activity, index) => {
            const total = activityTypes.reduce((sum, a) => sum + a.count, 0)
            const percentage = (activity.count / total * 100)
            
            return (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{activity.count}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {activity.action.replace('_', ' ')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Time-based Analysis */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Time-based Analysis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {activities.filter(a => {
                const hour = new Date(a.timestamp).getHours()
                return hour >= 9 && hour <= 17
              }).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Business Hours (9-17)</div>
            <div className="text-xs text-gray-500">Normal activity</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600">
              {activities.filter(a => {
                const hour = new Date(a.timestamp).getHours()
                return hour >= 18 && hour <= 23
              }).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Evening (18-23)</div>
            <div className="text-xs text-gray-500">After hours</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-danger-600">
              {activities.filter(a => {
                const hour = new Date(a.timestamp).getHours()
                return hour >= 0 && hour <= 8
              }).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Night (0-8)</div>
            <div className="text-xs text-gray-500">Suspicious hours</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics