import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  WifiIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { fetchSystemSettings, updateSystemSettings } from '../services/api'
import toast from 'react-hot-toast'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const queryClient = useQueryClient()

  // Fetch current settings
  const { data: settings = {}, isLoading } = useQuery(
    'settings',
    fetchSystemSettings,
    {
      staleTime: 300000 // 5 minutes
    }
  )

  // Update settings mutation
  const updateSettingsMutation = useMutation(
    updateSystemSettings,
    {
      onSuccess: () => {
        toast.success('Settings updated successfully')
        queryClient.invalidateQueries('settings')
      },
      onError: (error) => {
        toast.error('Failed to update settings')
        console.error('Settings update error:', error)
      }
    }
  )

  const [formData, setFormData] = useState({
    // General settings
    systemName: settings.systemName || 'Third Umpire',
    timezone: settings.timezone || 'UTC',
    language: settings.language || 'en',
    
    // Security settings
    anomalyThreshold: settings.anomalyThreshold || 0.7,
    alertRetention: settings.alertRetention || 30,
    autoResolveAlerts: settings.autoResolveAlerts || false,
    enableGeofencing: settings.enableGeofencing || true,
    
    // Notification settings
    emailNotifications: settings.emailNotifications || true,
    slackIntegration: settings.slackIntegration || false,
    alertFrequency: settings.alertFrequency || 'immediate',
    
    // AI settings
    modelSensitivity: settings.modelSensitivity || 'medium',
    learningMode: settings.learningMode || 'continuous',
    falsePositiveRate: settings.falsePositiveRate || 0.05
  })

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(formData)
  }

  const handleResetSettings = () => {
    setFormData({
      systemName: 'Third Umpire',
      timezone: 'UTC',
      language: 'en',
      anomalyThreshold: 0.7,
      alertRetention: 30,
      autoResolveAlerts: false,
      enableGeofencing: true,
      emailNotifications: true,
      slackIntegration: false,
      alertFrequency: 'immediate',
      modelSensitivity: 'medium',
      learningMode: 'continuous',
      falsePositiveRate: 0.05
    })
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'ai', name: 'AI Engine', icon: CpuChipIcon }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Name
        </label>
        <input
          type="text"
          value={formData.systemName}
          onChange={(e) => handleInputChange('systemName', e.target.value)}
          className="input"
          placeholder="Enter system name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={formData.timezone}
          onChange={(e) => handleInputChange('timezone', e.target.value)}
          className="input"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">London</option>
          <option value="Europe/Paris">Paris</option>
          <option value="Asia/Tokyo">Tokyo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <select
          value={formData.language}
          onChange={(e) => handleInputChange('language', e.target.value)}
          className="input"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anomaly Detection Threshold
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={formData.anomalyThreshold}
            onChange={(e) => handleInputChange('anomalyThreshold', parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">
            {(formData.anomalyThreshold * 100).toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Higher values require stronger evidence before triggering alerts
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Retention (days)
        </label>
        <input
          type="number"
          min="1"
          max="365"
          value={formData.alertRetention}
          onChange={(e) => handleInputChange('alertRetention', parseInt(e.target.value))}
          className="input"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Auto-resolve Alerts
          </label>
          <p className="text-xs text-gray-500">
            Automatically resolve low-risk alerts after a period
          </p>
        </div>
        <input
          type="checkbox"
          checked={formData.autoResolveAlerts}
          onChange={(e) => handleInputChange('autoResolveAlerts', e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Enable Geofencing
          </label>
          <p className="text-xs text-gray-500">
            Alert on activities from unexpected geographic locations
          </p>
        </div>
        <input
          type="checkbox"
          checked={formData.enableGeofencing}
          onChange={(e) => handleInputChange('enableGeofencing', e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Notifications
          </label>
          <p className="text-xs text-gray-500">
            Send alerts via email to security team
          </p>
        </div>
        <input
          type="checkbox"
          checked={formData.emailNotifications}
          onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Slack Integration
          </label>
          <p className="text-xs text-gray-500">
            Send alerts to Slack channels
          </p>
        </div>
        <input
          type="checkbox"
          checked={formData.slackIntegration}
          onChange={(e) => handleInputChange('slackIntegration', e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Frequency
        </label>
        <select
          value={formData.alertFrequency}
          onChange={(e) => handleInputChange('alertFrequency', e.target.value)}
          className="input"
        >
          <option value="immediate">Immediate</option>
          <option value="batched">Batched (every 5 minutes)</option>
          <option value="hourly">Hourly Summary</option>
          <option value="daily">Daily Summary</option>
        </select>
      </div>
    </div>
  )

  const renderAISettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model Sensitivity
        </label>
        <select
          value={formData.modelSensitivity}
          onChange={(e) => handleInputChange('modelSensitivity', e.target.value)}
          className="input"
        >
          <option value="low">Low (Fewer false positives)</option>
          <option value="medium">Medium (Balanced)</option>
          <option value="high">High (More sensitive)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Lower sensitivity reduces false positives but may miss subtle threats
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Mode
        </label>
        <select
          value={formData.learningMode}
          onChange={(e) => handleInputChange('learningMode', e.target.value)}
          className="input"
        >
          <option value="continuous">Continuous Learning</option>
          <option value="periodic">Periodic Updates</option>
          <option value="manual">Manual Updates Only</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target False Positive Rate
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0.01"
            max="0.2"
            step="0.01"
            value={formData.falsePositiveRate}
            onChange={(e) => handleInputChange('falsePositiveRate', parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">
            {(formData.falsePositiveRate * 100).toFixed(1)}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Target rate of false positive alerts
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">AI Model Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Model Version</span>
            <span className="text-sm font-medium text-blue-900">v2.1.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Training Data</span>
            <span className="text-sm font-medium text-blue-900">15,847 samples</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Last Update</span>
            <span className="text-sm font-medium text-blue-900">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Accuracy</span>
            <span className="text-sm font-medium text-green-600">94.2%</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'ai':
        return renderAISettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure system preferences and security parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name} Settings
              </h2>
            </div>
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>

          {/* Save/Reset Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handleResetSettings}
              className="btn btn-secondary"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={updateSettingsMutation.isLoading}
              className="btn btn-primary flex items-center"
            >
              {updateSettingsMutation.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings