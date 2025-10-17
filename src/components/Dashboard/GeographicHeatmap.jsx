import React from 'react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

const GeographicHeatmap = ({ activities = [] }) => {
  // Extract unique locations from activities
  const locations = activities
    .filter(activity => activity.location && activity.location.latitude && activity.location.longitude)
    .reduce((acc, activity) => {
      const key = `${activity.location.latitude.toFixed(2)},${activity.location.longitude.toFixed(2)}`
      if (!acc[key]) {
        acc[key] = {
          lat: activity.location.latitude,
          lon: activity.location.longitude,
          count: 0,
          activities: []
        }
      }
      acc[key].count++
      acc[key].activities.push(activity)
      return acc
    }, {})

  const locationArray = Object.values(locations)
  const maxCount = Math.max(...locationArray.map(loc => loc.count), 1)

  const getLocationColor = (count) => {
    const intensity = count / maxCount
    if (intensity > 0.8) return 'bg-red-500'
    if (intensity > 0.6) return 'bg-orange-500'
    if (intensity > 0.4) return 'bg-yellow-500'
    if (intensity > 0.2) return 'bg-green-500'
    return 'bg-blue-500'
  }

  const getLocationSize = (count) => {
    const intensity = count / maxCount
    if (intensity > 0.8) return 'w-4 h-4'
    if (intensity > 0.6) return 'w-3 h-3'
    if (intensity > 0.4) return 'w-2.5 h-2.5'
    return 'w-2 h-2'
  }

  if (locationArray.length === 0) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-center">
          <GlobeAltIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No location data available</p>
          <p className="text-sm text-gray-400">Activity locations will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Map Visualization */}
      <div className="map-container relative bg-gradient-to-br from-blue-50 to-green-50">
        <div className="absolute inset-0 p-4">
          <div className="text-xs text-gray-500 mb-2">Activity Locations</div>
          <div className="relative w-full h-full">
            {locationArray.map((location, index) => (
              <div
                key={index}
                className={`absolute rounded-full ${getLocationColor(location.count)} ${getLocationSize(location.count)} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
                style={{
                  left: `${((location.lon + 180) / 360) * 100}%`,
                  top: `${((90 - location.lat) / 180) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={`${location.count} activities at ${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Location Stats */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Top Activity Locations</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {locationArray
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((location, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getLocationColor(location.count)}`} />
                  <span className="text-gray-600">
                    {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                  </span>
                </div>
                <span className="text-gray-500 font-medium">
                  {location.count} activities
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Activity Intensity</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Low</span>
            <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
            <span>Medium</span>
            <div className="w-2 h-2 bg-red-500 rounded-full ml-2" />
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeographicHeatmap
