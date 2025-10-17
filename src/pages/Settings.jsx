import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  GlobeAltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import { generateDemoData } from '../services/api'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || ''
  })

  const [systemSettings, setSystemSettings] = useState({
    alertThreshold: 0.7,
    monitoringEnabled: true,
    emailNotifications: true,
    realTimeAlerts: true,
    dataRetentionDays: 30
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'system', name: 'System', icon: Cog6ToothIcon }
  ]

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(profileData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleSystemSettingsUpdate = async (e) => {
    e.preventDefault()
    try {
      // In a real app, this would call the API
      toast.success('System settings updated')
    } catch (error) {
      toast.error('Failed to update settings')
    }
  }

  const handleGenerateDemoData = async () => {
    setIsGeneratingDemo(true)
    try {
      await generateDemoData()
      toast.success('Demo data generated successfully')
    } catch (error) {
      toast.error('Failed to generate demo data')
    } finally {
      setIsGeneratingDemo(false)
    }
  }

  const TabButton = ({ tab }) => (
    <button
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
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
        <p className="text-sm text-gray-600">Update your personal information</p>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="input mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="input mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            className="input mt-1"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-600">Configure how you receive alerts and updates</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">Email Notifications</label>
            <p className="text-sm text-gray-500">Receive alerts via email</p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.emailNotifications}
            onChange={(e) => setSystemSettings({ ...systemSettings, emailNotifications: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">Real-time Alerts</label>
            <p className="text-sm text-gray-500">Show popup notifications for critical alerts</p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.realTimeAlerts}
            onChange={(e) => setSystemSettings({ ...systemSettings, realTimeAlerts: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="text-sm text-gray-600">Configure security monitoring parameters</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Alert Threshold</label>
          <p className="text-sm text-gray-500">Sensitivity level for anomaly detection (0.1 - 1.0)</p>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={systemSettings.alertThreshold}
            onChange={(e) => setSystemSettings({ ...systemSettings, alertThreshold: parseFloat(e.target.value) })}
            className="w-full mt-1"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low (0.1)</span>
            <span>Current: {systemSettings.alertThreshold}</span>
            <span>High (1.0)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">Monitoring Enabled</label>
            <p className="text-sm text-gray-500">Enable real-time user activity monitoring</p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.monitoringEnabled}
            onChange={(e) => setSystemSettings({ ...systemSettings, monitoringEnabled: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  )

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">System Configuration</h3>
        <p className="text-sm text-gray-600">Manage system settings and data</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data Retention Period</label>
          <p className="text-sm text-gray-500">How long to keep activity and alert data</p>
          <select
            value={systemSettings.dataRetentionDays}
            onChange={(e) => setSystemSettings({ ...systemSettings, dataRetentionDays: parseInt(e.target.value) })}
            className="input mt-1"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={365}>1 year</option>
          </select>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Demo Data</h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <BellIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Generate Demo Data</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Create sample activities and alerts for testing and demonstration purposes.
                </p>
                <button
                  onClick={handleGenerateDemoData}
                  disabled={isGeneratingDemo}
                  className="btn btn-warning mt-3"
                >
                  {isGeneratingDemo ? 'Generating...' : 'Generate Demo Data'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">System Information</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Version:</span>
                <span className="ml-2 font-medium">1.0.0</span>
              </div>
              <div>
                <span className="text-gray-600">Build:</span>
                <span className="ml-2 font-medium">2024.01.15</span>
              </div>
              <div>
                <span className="text-gray-600">Environment:</span>
                <span className="ml-2 font-medium">Development</span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'security':
        return renderSecurityTab()
      case 'system':
        return renderSystemTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your preferences and system settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Sidebar */}
        <div className="lg:w-64 mb-6 lg:mb-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} />
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
