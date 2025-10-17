import React, { useState } from 'react'
import { useWebSocket } from '../contexts/WebSocketContext'
import { useQuery } from 'react-query'
import { 
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import AlertList from '../components/Dashboard/AlertList'
import { fetchRecentAlerts } from '../services/api'

const Alerts = () => {
  const { alerts: realtimeAlerts } = useWebSocket()
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    search: ''
  })

  // Fetch alerts from API as backup
  const { data: apiAlerts = [], isLoading } = useQuery(
    'alerts',
    () => fetchRecentAlerts(100),
    {
      refetchInterval: 30000
    }
  )

  // Combine real-time and API alerts, removing duplicates
  const allAlerts = React.useMemo(() => {
    const combined = [...realtimeAlerts, ...apiAlerts]
    const unique = combined.filter((alert, index, self) => 
      index === self.findIndex(a => a.id === alert.id)
    )
    return unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [realtimeAlerts, apiAlerts])

  // Filter alerts
  const filteredAlerts = React.useMemo(() => {
    return allAlerts.filter(alert => {
      const matchesSeverity = filters.severity === 'all' || alert.severity === filters.severity
      const matchesStatus = filters.status === 'all' || alert.status === filters.status
      const matchesSearch = !filters.search || 
        alert.user_id.toLowerCase().includes(filters.search.toLowerCase()) ||
        alert.description.toLowerCase().includes(filters.search.toLowerCase())
      
      return matchesSeverity && matchesStatus && matchesSearch
    })
  }, [allAlerts, filters])

  const getSeverityCounts = () => {
    return {
      critical: allAlerts.filter(a => a.severity === 'critical').length,
      high: allAlerts.filter(a => a.severity === 'high').length,
      medium: allAlerts.filter(a => a.severity === 'medium').length,
      low: allAlerts.filter(a => a.severity === 'low').length,
      total: allAlerts.length
    }
  }

  const severityCounts = getSeverityCounts()

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      severity: 'all',
      status: 'all',
      search: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Alerts</h1>
          <p className="text-gray-600 mt-1">
            Monitor and investigate security incidents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-primary">
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-3" />
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-semibold text-red-600">{severityCounts.critical}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3" />
            <div>
              <p className="text-sm text-gray-600">High</p>
              <p className="text-2xl font-semibold text-red-500">{severityCounts.high}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3" />
            <div>
              <p className="text-sm text-gray-600">Medium</p>
              <p className="text-2xl font-semibold text-yellow-500">{severityCounts.medium}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
            <div>
              <p className="text-sm text-gray-600">Low</p>
              <p className="text-2xl font-semibold text-blue-500">{severityCounts.low}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{severityCounts.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-10 w-full sm:w-64"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="input w-full sm:w-40"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input w-full sm:w-40"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
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

      {/* Alerts List */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Alert Details
            </h2>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {filteredAlerts.length} of {allAlerts.length} alerts
              </span>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <AlertList alerts={filteredAlerts} />
        )}
      </div>
    </div>
  )
}

export default Alerts
