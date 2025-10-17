import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  GlobeAltIcon,
  EyeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { useWebSocket } from '../contexts/WebSocketContext'
import StatCard from '../components/Dashboard/StatCard'
import ActivityFeed from '../components/Dashboard/ActivityFeed'
import AlertList from '../components/Dashboard/AlertList'
import ThreatLevelIndicator from '../components/Dashboard/ThreatLevelIndicator'
import GeographicHeatmap from '../components/Dashboard/GeographicHeatmap'
import SystemHealth from '../components/Dashboard/SystemHealth'
import { fetchDashboardStats } from '../services/api'

const Dashboard = () => {
  const { alerts, activities, isConnected } = useWebSocket()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery(
    'dashboard-stats',
    fetchDashboardStats,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 15000
    }
  )

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate threat level based on recent alerts
  const getThreatLevel = () => {
    const recentAlerts = alerts.filter(alert => {
      const alertTime = new Date(alert.timestamp)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return alertTime > fiveMinutesAgo
    })

    const criticalAlerts = recentAlerts.filter(alert => alert.severity === 'critical').length
    const highAlerts = recentAlerts.filter(alert => alert.severity === 'high').length

    if (criticalAlerts > 0) return 'critical'
    if (highAlerts > 2) return 'high'
    if (highAlerts > 0) return 'medium'
    return 'low'
  }

  const threatLevel = getThreatLevel()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring and threat detection
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-lg font-mono font-medium">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* System Status Banner */}
      <div className={`p-4 rounded-lg border-l-4 ${
        isConnected 
          ? 'bg-success-50 border-success-500' 
          : 'bg-danger-50 border-danger-500'
      }`}>
        <div className="flex items-center">
          <ShieldCheckIcon className={`w-5 h-5 ${
            isConnected ? 'text-success-500' : 'text-danger-500'
          }`} />
          <div className="ml-3">
            <p className={`text-sm font-medium ${
              isConnected ? 'text-success-800' : 'text-danger-800'
            }`}>
              {isConnected ? 'System Operational' : 'System Disconnected'}
            </p>
            <p className={`text-xs ${
              isConnected ? 'text-success-600' : 'text-danger-600'
            }`}>
              {isConnected 
                ? 'All monitoring systems are running normally' 
                : 'Connection lost. Attempting to reconnect...'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Threat Level Indicator */}
      <ThreatLevelIndicator level={threatLevel} />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Alerts"
          value={stats?.active_alerts || 0}
          change={stats?.anomalies_detected_today || 0}
          changeLabel="Today"
          icon={ExclamationTriangleIcon}
          color="danger"
          loading={statsLoading}
        />
        <StatCard
          title="Users Monitored"
          value={stats?.users_monitored || 0}
          change={0}
          changeLabel="Online"
          icon={UserGroupIcon}
          color="primary"
          loading={statsLoading}
        />
        <StatCard
          title="Total Activities"
          value={stats?.total_activities || 0}
          change={activities.length}
          changeLabel="Recent"
          icon={ActivityIcon}
          color="success"
          loading={statsLoading}
        />
        <StatCard
          title="System Uptime"
          value={`${stats?.system_uptime || 99.9}%`}
          change={0}
          changeLabel="Last 24h"
          icon={ClockIcon}
          color="warning"
          loading={statsLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alerts and Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Alerts */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    alerts.length > 0 ? 'bg-danger-500 animate-pulse' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm text-gray-500">
                    {alerts.length} alerts
                  </span>
                </div>
              </div>
            </div>
            <AlertList alerts={alerts.slice(0, 5)} />
          </div>

          {/* Activity Feed */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Live Activity Feed</h2>
                <div className="flex items-center space-x-2">
                  <EyeIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {activities.length} activities
                  </span>
                </div>
              </div>
            </div>
            <ActivityFeed activities={activities.slice(0, 10)} />
          </div>
        </div>

        {/* Right Column - Analytics and Maps */}
        <div className="space-y-6">
          {/* Geographic Heatmap */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Activity Map</h2>
                <GlobeAltIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <GeographicHeatmap activities={activities} />
          </div>

          {/* System Health */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
                <ChartBarIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <SystemHealth 
              isConnected={isConnected}
              alertsCount={alerts.length}
              activitiesCount={activities.length}
            />
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => refetchStats()}
                className="w-full btn btn-primary text-left"
              >
                <ChartBarIcon className="w-4 h-4 mr-2 inline" />
                Refresh Statistics
              </button>
              <button className="w-full btn btn-secondary text-left">
                <LockClosedIcon className="w-4 h-4 mr-2 inline" />
                Generate Report
              </button>
              <button className="w-full btn btn-secondary text-left">
                <ExclamationTriangleIcon className="w-4 h-4 mr-2 inline" />
                View All Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
