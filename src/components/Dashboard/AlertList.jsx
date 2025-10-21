import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SparklesIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { getAlertInsights, updateAlertStatus, dismissAlert } from '../../services/api'
import toast from 'react-hot-toast'

const AlertList = ({ alerts = [] }) => {
  const [expandedAlerts, setExpandedAlerts] = useState({})
  const [aiInsights, setAiInsights] = useState({})
  const [loadingInsights, setLoadingInsights] = useState({})

  const toggleAlertExpansion = (alertId) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }))
  }

  const loadAIInsights = async (alertId) => {
    if (aiInsights[alertId] || loadingInsights[alertId]) return

    setLoadingInsights(prev => ({ ...prev, [alertId]: true }))
    try {
      const insights = await getAlertInsights(alertId)
      setAiInsights(prev => ({
        ...prev,
        [alertId]: insights.insights
      }))
    } catch (error) {
      console.error('Failed to load AI insights:', error)
      setAiInsights(prev => ({
        ...prev,
        [alertId]: { error: 'Failed to load AI insights' }
      }))
    } finally {
      setLoadingInsights(prev => ({ ...prev, [alertId]: false }))
    }
  }

  const handleDismissAlert = async (alertId) => {
    try {
      await dismissAlert(alertId)
      toast.success('Alert dismissed successfully')
      // Remove from local state or mark as dismissed
    } catch (error) {
      console.error('Failed to dismiss alert:', error)
      toast.error('Failed to dismiss alert')
    }
  }

  const handleResolveAlert = async (alertId) => {
    try {
      await updateAlertStatus(alertId, 'resolved', 'Alert resolved by security team')
      toast.success('Alert resolved successfully')
    } catch (error) {
      console.error('Failed to resolve alert:', error)
      toast.error('Failed to resolve alert')
    }
  }

  const handleMarkAsFalsePositive = async (alertId) => {
    try {
      await updateAlertStatus(alertId, 'resolved', 'Marked as false positive', true)
      toast.success('Alert marked as false positive')
    } catch (error) {
      console.error('Failed to mark as false positive:', error)
      toast.error('Failed to mark as false positive')
    }
  }
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
                  {/* Enhanced AI Insights Indicator */}
                  {alert.ai_insights && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 shadow-sm">
                      <SparklesIcon className="w-3 h-3 mr-1 text-purple-600" />
                      AI Enhanced
                    </span>
                  )}
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
                    <button
                      onClick={() => toggleAlertExpansion(alert.id || index)}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {expandedAlerts[alert.id || index] ? (
                        <>
                          <ChevronDownIcon className="w-3 h-3 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <ChevronRightIcon className="w-3 h-3 mr-1" />
                          Details
                        </>
                      )}
                    </button>
                    
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      alert.status === 'active' ? 'bg-red-100 text-red-800' :
                      alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Expanded Alert Details with AI Insights */}
                {expandedAlerts[alert.id || index] && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {/* AI Insights Section */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                          <SparklesIcon className="w-4 h-4 mr-1 text-purple-600" />
                          AI Analysis
                        </h4>
                        {!aiInsights[alert.id || index] && !loadingInsights[alert.id || index] && (
                          <button
                            onClick={() => loadAIInsights(alert.id || index)}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                          >
                            <EyeIcon className="w-3 h-3 mr-1" />
                            Load Insights
                          </button>
                        )}
                      </div>
                      
                      {loadingInsights[alert.id || index] && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                          Loading AI insights...
                        </div>
                      )}
                      
                      {aiInsights[alert.id || index] && (
                        <div className="bg-purple-50 rounded-lg p-3 text-sm">
                          {aiInsights[alert.id || index].error ? (
                            <p className="text-red-600">{aiInsights[alert.id || index].error}</p>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-gray-800 font-medium">Analysis:</p>
                              <p className="text-gray-700">{aiInsights[alert.id || index].explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Built-in AI Insights from alert data */}
                      {alert.ai_insights && (
                        <div className="bg-blue-50 rounded-lg p-3 text-sm mt-2">
                          <p className="text-gray-800 font-medium mb-2">Real-time AI Analysis:</p>
                          <div className="space-y-1">
                            {alert.ai_insights.threat_level && (
                              <p className="text-gray-700">
                                <span className="font-medium">Threat Level:</span> {alert.ai_insights.threat_level}
                              </p>
                            )}
                            {alert.ai_insights.explanation && (
                              <p className="text-gray-700">
                                <span className="font-medium">Explanation:</span> {alert.ai_insights.explanation}
                              </p>
                            )}
                            {alert.ai_insights.recommendations && alert.ai_insights.recommendations.length > 0 && (
                              <div>
                                <p className="font-medium text-gray-800">Recommendations:</p>
                                <ul className="list-disc list-inside text-gray-700 mt-1">
                                  {alert.ai_insights.recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Alert Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Alert Actions</h4>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleResolveAlert(alert.id || index)}
                            className="inline-flex items-center px-3 py-1.5 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                          >
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Resolve
                          </button>
                          <button
                            onClick={() => handleMarkAsFalsePositive(alert.id || index)}
                            className="inline-flex items-center px-3 py-1.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3 mr-1" />
                            False Positive
                          </button>
                          <button
                            onClick={() => handleDismissAlert(alert.id || index)}
                            className="inline-flex items-center px-3 py-1.5 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3 mr-1" />
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Alert Details */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><span className="font-medium">Alert ID:</span> {alert.id}</p>
                      <p><span className="font-medium">Activity ID:</span> {alert.activity_id}</p>
                      <p><span className="font-medium">Timestamp:</span> {new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertList
