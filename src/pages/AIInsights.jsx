import React, { useState, useEffect } from 'react'
import { 
  SparklesIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import { 
  getAIStatus, 
  getThreatIntelligence, 
  generateSecurityReport,
  getUserAIProfile 
} from '../services/api'

const AIInsights = () => {
  const [aiStatus, setAiStatus] = useState(null)
  const [threatIntelligence, setThreatIntelligence] = useState(null)
  const [securityReport, setSecurityReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState('')
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    loadAIData()
  }, [])

  const loadAIData = async () => {
    setLoading(true)
    try {
      const [status, threat, report] = await Promise.all([
        getAIStatus(),
        getThreatIntelligence(),
        generateSecurityReport('24h')
      ])
      
      setAiStatus(status)
      setThreatIntelligence(threat)
      setSecurityReport(report)
    } catch (error) {
      console.error('Failed to load AI data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async () => {
    if (!selectedUser) return
    
    try {
      const profile = await getUserAIProfile(selectedUser)
      setUserProfile(profile)
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle = '' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  const CapabilityCard = ({ title, description, enabled, icon: Icon }) => (
    <div className={`p-4 rounded-lg border-2 ${enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center mb-2">
        <Icon className={`w-5 h-5 mr-2 ${enabled ? 'text-green-600' : 'text-gray-400'}`} />
        <h3 className={`font-medium ${enabled ? 'text-green-900' : 'text-gray-600'}`}>{title}</h3>
        {enabled && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        )}
      </div>
      <p className={`text-sm ${enabled ? 'text-green-700' : 'text-gray-500'}`}>{description}</p>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center">
          <SparklesIcon className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">AI-Powered Security Insights</h1>
            <p className="text-purple-100">Enhanced threat analysis powered by Google Gemini AI</p>
          </div>
        </div>
      </div>

      {/* AI Status Overview */}
      {aiStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Traditional ML"
            value={aiStatus.ai_services?.traditional_ml || 'Unknown'}
            icon={CpuChipIcon}
            color="blue"
            subtitle="Anomaly Detection"
          />
          <StatCard
            title="Gemini AI"
            value={aiStatus.ai_services?.gemini_ai || 'Unknown'}
            icon={SparklesIcon}
            color="purple"
            subtitle="Advanced Analysis"
          />
          <StatCard
            title="Enhanced Analysis"
            value={aiStatus.ai_services?.enhanced_analysis || 'Unknown'}
            icon={ChartBarIcon}
            color="green"
            subtitle="Combined Intelligence"
          />
        </div>
      )}

      {/* AI Capabilities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiStatus?.capabilities?.map((capability, index) => (
            <CapabilityCard
              key={index}
              title={capability}
              description={`${capability} analysis and insights`}
              enabled={!!capability}
              icon={capability === 'Anomaly detection' ? CpuChipIcon :
                    capability === 'Behavioral analysis' ? UserGroupIcon :
                    capability === 'Threat intelligence' ? ShieldCheckIcon :
                    capability === 'Natural language explanations' ? DocumentTextIcon :
                    capability === 'Security reporting' ? ChartBarIcon : SparklesIcon}
            />
          ))}
        </div>
      </div>

      {/* Threat Intelligence */}
      {threatIntelligence && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-red-600" />
            Current Threat Intelligence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                threatIntelligence.threat_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                threatIntelligence.threat_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {threatIntelligence.threat_level} Threat Level
              </div>
              
              <p className="text-gray-700 mb-4">{threatIntelligence.summary}</p>
              
              {threatIntelligence.alert_count > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Recent High-Risk Alerts</h4>
                  <p className="text-red-700 text-sm">
                    {threatIntelligence.alert_count} alerts require immediate attention
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {threatIntelligence.recommendations?.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Security Report */}
      {securityReport && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
            AI-Generated Security Report
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {securityReport.report?.report || 'Security report generation failed'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserGroupIcon className="w-5 h-5 mr-2 text-green-600" />
          User Behavior Analysis
        </h2>
        
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Enter user ID"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={loadUserProfile}
            disabled={!selectedUser}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Analyze Profile
          </button>
        </div>
        
        {userProfile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">AI Analysis Results</h4>
            <div className="space-y-2 text-sm text-green-700">
              <p><span className="font-medium">User ID:</span> {userProfile.user_id}</p>
              <p><span className="font-medium">Activities Analyzed:</span> {userProfile.activities_analyzed}</p>
              {userProfile.gemini_analysis?.behavior_profile && (
                <p><span className="font-medium">Behavior Profile:</span> {userProfile.gemini_analysis.behavior_profile}</p>
              )}
              {userProfile.gemini_analysis?.risk_assessment && (
                <p><span className="font-medium">Risk Assessment:</span> {userProfile.gemini_analysis.risk_assessment}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIInsights
