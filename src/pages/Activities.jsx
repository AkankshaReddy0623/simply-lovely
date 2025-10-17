import React, { useState } from 'react'
import { useWebSocket } from '../contexts/WebSocketContext'
import { useQuery } from 'react-query'
import { 
  ActivityIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import ActivityFeed from '../components/Dashboard/ActivityFeed'
import { fetchRecentActivities } from '../services/api'

const Activities = () => {
  const { activities: realtimeActivities } = useWebSocket()
  const [filters, setFilters] = useState({
    action: 'all',
    user: 'all',
    success: 'all',
    search: ''
  })

  // Fetch activities from API as backup
  const { data: apiActivities = [], isLoading } = useQuery(
    'activities',
    () => fetchRecentActivities(200),
    {
      refetchInterval: 30000
    }
  )

  // Combine real-time and API activities, removing duplicates
  const allActivities = React.useMemo(() => {
    const combined = [...realtimeActivities, ...apiActivities]
    const unique = combined.filter((activity, index, self) => 
      index === self.findIndex(a => a.id === activity.id)
    )
    return unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [realtimeActivities, apiActivities])

  // Filter activities
  const filteredActivities = React.useMemo(() => {
    return allActivities.filter(activity => {
      const matchesAction = filters.action === 'all' || activity.action === filters.action
      const matchesUser = filters.user === 'all' || activity.user_id === filters.user
      const matchesSuccess = filters.success === 'all' || 
        (filters.success === 'success' && activity.success) ||
        (filters.success === 'failed' && !activity.success)
      const matchesSearch = !filters.search || 
        activity.user_id.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.ip_address.toLowerCase().includes(filters.search.toLowerCase())
      
      return matchesAction && matchesUser && matchesSuccess && matchesSearch
    })
  }, [allActivities, filters])

  // Get unique values for filter options
  const uniqueActions = [...new Set(allActivities.map(a => a.action))]
  const uniqueUsers = [...new Set(allActivities.map(a => a.user_id))]

  const getActivityStats = () => {
    const total = allActivities.length
    const successful = allActivities.filter(a => a.success).length
    const failed = total - successful
    const suspicious = allActivities.filter(a => 
      ['privilege_escalation', 'mass_data_access', 'suspicious_download'].includes(a.action)
    ).length

    return { total, successful, failed, suspicious }
  }

  const stats = getActivityStats()

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      action: 'all',
      user: 'all',
      success: 'all',
      search: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Activities</h1>
          <p className="text-gray-600 mt-1">
            Monitor all user actions and system interactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <ActivityIcon className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center">
            <ActivityIcon className="w-5 h-5 text-primary-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-3" />
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-semibold text-success-600">{stats.successful}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-danger-500 rounded-full mr-3" />
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-semibold text-danger-600">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Suspicious</p>
              <p className="text-2xl font-semibold text-warning-600">{stats.suspicious}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-10 w-full sm:w-64"
              />
            </div>

            {/* Action Filter */}
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="input w-full sm:w-40"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>
                  {action.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>

            {/* User Filter */}
            <select
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              className="input w-full sm:w-40"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>

            {/* Success Filter */}
            <select
              value={filters.success}
              onChange={(e) => handleFilterChange('success', e.target.value)}
              className="input w-full sm:w-40"
            >
              <option value="all">All Results</option>
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={clearFilters}
              className="btn btn-secondary flex items-center"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Activity Details
            </h2>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {filteredActivities.length} of {allActivities.length} activities
              </span>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <ActivityFeed activities={filteredActivities} />
        )}
      </div>
    </div>
  )
}

export default Activities
