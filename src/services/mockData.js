// src/services/mockData.js

// Generate random number between min and max with decimal places
const randomNumber = (min, max, decimals = 0) => {
  const factor = Math.pow(10, decimals)
  return Math.round((Math.random() * (max - min) + min) * factor) / factor
}

// Generate random date in the last specified minutes
const randomRecentTime = (minutesAgo = 60) => {
  const now = new Date()
  const randomMinutesAgo = randomNumber(1, minutesAgo)
  now.setMinutes(now.getMinutes() - randomMinutesAgo)
  return now
}

//  IMPROVEMENT: Better date formatting with relative time
export const formatDate = (date) => {
  const now = new Date()
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(date)
}

//  IMPROVEMENT: Enhanced device types with more realistic data
export const deviceTypes = {
  TEMPERATURE: { name: 'Temperature Sensor', icon: 'thermostat', unit: '°C', range: [18, 85] },
  VOLTAGE: { name: 'Voltage Meter', icon: 'electric_bolt', unit: 'V', range: [110, 250] },
  PRESSURE: { name: 'Pressure Sensor', icon: 'compress', unit: 'PSI', range: [30, 70] },
  FLOW: { name: 'Flow Meter', icon: 'water_drop', unit: 'L/min', range: [5, 50] },
  HUMIDITY: { name: 'Humidity Sensor', icon: 'water_damage', unit: '%', range: [30, 90] },
  POWER: { name: 'Power Meter', icon: 'power', unit: 'kW', range: [1, 100] },
  LEVEL: { name: 'Level Sensor', icon: 'height', unit: 'm', range: [0, 10] },
  SPEED: { name: 'Speed Sensor', icon: 'speed', unit: 'RPM', range: [100, 3000] },
}

//  IMPROVEMENT: Enhanced mock devices with better structure
export const devices = [
  { 
    id: "DEV-1001", 
    name: "Temperature Sensor A1", 
    type: "TEMPERATURE",
    location: "Production Line 1",
    criticality: "high",
    installDate: "2023-01-15"
  },
  { 
    id: "DEV-1002", 
    name: "Voltage Meter B2", 
    type: "VOLTAGE",
    location: "Electrical Panel 2",
    criticality: "medium",
    installDate: "2023-02-20"
  },
  { 
    id: "DEV-1003", 
    name: "Pressure Sensor C3", 
    type: "PRESSURE",
    location: "Hydraulic System",
    criticality: "high",
    installDate: "2023-01-10"
  },
  { 
    id: "DEV-1004", 
    name: "Flow Meter D4", 
    type: "FLOW",
    location: "Cooling System",
    criticality: "medium",
    installDate: "2023-03-05"
  },
  { 
    id: "DEV-1005", 
    name: "Humidity Sensor E5", 
    type: "HUMIDITY",
    location: "Clean Room",
    criticality: "low",
    installDate: "2023-02-15"
  },
  { 
    id: "DEV-1006", 
    name: "Power Meter F6", 
    type: "POWER",
    location: "Main Distribution",
    criticality: "high",
    installDate: "2023-01-05"
  },
  { 
    id: "DEV-1007", 
    name: "Level Sensor G7", 
    type: "LEVEL",
    location: "Storage Tank 1",
    criticality: "medium",
    installDate: "2023-03-10"
  },
  { 
    id: "DEV-1008", 
    name: "Speed Sensor H8", 
    type: "SPEED",
    location: "Motor Assembly",
    criticality: "low",
    installDate: "2023-02-28"
  },
]

// IMPROVEMENT: Simulate device states with memory (in-memory persistence)
let deviceStates = new Map()

// Initialize device states
devices.forEach(device => {
  if (!deviceStates.has(device.id)) {
    const deviceType = deviceTypes[device.type]
    deviceStates.set(device.id, {
      lastValue: randomNumber(deviceType.range[0], deviceType.range[1], 1),
      status: Math.random() > 0.15 ? 'Online' : 'Offline', // 85% online rate
      lastUpdate: new Date(),
      trend: randomNumber(-1, 1) > 0 ? 'up' : 'down',
      alertCount: randomNumber(0, 5)
    })
  }
})

// IMPROVEMENT: Generate realistic device status data with persistence
export const generateDeviceData = () => {
  return devices.map((device) => {
    const deviceType = deviceTypes[device.type]
    const currentState = deviceStates.get(device.id)
    
    // IMPROVEMENT: More realistic status changes (devices don't flip status too often)
    let newStatus = currentState.status
    if (Math.random() < 0.05) { // 5% chance of status change
      newStatus = newStatus === 'Online' ? 'Offline' : 'Online'
    }
    
    // IMPROVEMENT: Generate values based on previous values for continuity
    let newValue = currentState.lastValue
    if (newStatus === 'Online') {
      const changeAmount = randomNumber(-5, 5, 1)
      newValue = Math.max(
        deviceType.range[0], 
        Math.min(deviceType.range[1], currentState.lastValue + changeAmount)
      )
    }
    
    const lastActive = newStatus === 'Online' ? new Date() : randomRecentTime(120)
    
    // Update device state
    deviceStates.set(device.id, {
      ...currentState,
      lastValue: newValue,
      status: newStatus,
      lastUpdate: new Date(),
    })

    // IMPROVEMENT: Return enhanced device data
    return {
      ...device,
      status: newStatus,
      value: newStatus === 'Online' ? newValue : null,
      unit: deviceType.unit,
      icon: deviceType.icon,
      lastActive: formatDate(lastActive),
      rawDate: lastActive,
      // Legacy fields for compatibility
      temperature: device.type === 'TEMPERATURE' ? newValue : null,
      voltage: device.type === 'VOLTAGE' ? newValue : null,
      criticality: device.criticality,
      alertCount: currentState.alertCount
    }
  })
}

// IMPROVEMENT: Generate realistic time series data with patterns
export const generateTimeSeriesData = (hours = 24) => {
  const data = []
  const now = new Date()
  
  // Base values for more realistic trends
  let baseTemp = 45
  let baseVoltage = 220
  let basePressure = 50
  let baseHumidity = 60

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now)
    time.setHours(now.getHours() - i)
    
    // IMPROVEMENT: Add daily patterns (temperature higher during "day" hours)
    const hour = time.getHours()
    const dayFactor = Math.sin((hour - 6) * Math.PI / 12) * 0.3 + 0.7 // Simulate day/night cycle
    
    // IMPROVEMENT: Add gradual drift to make data more realistic
    baseTemp += randomNumber(-2, 2, 1)
    baseVoltage += randomNumber(-5, 5, 1)
    basePressure += randomNumber(-1, 1, 1)
    baseHumidity += randomNumber(-3, 3, 1)
    
    // Keep values within reasonable bounds
    baseTemp = Math.max(20, Math.min(80, baseTemp))
    baseVoltage = Math.max(200, Math.min(240, baseVoltage))
    basePressure = Math.max(30, Math.min(70, basePressure))
    baseHumidity = Math.max(30, Math.min(90, baseHumidity))

    data.push({
      time: time.toISOString(),
      temperature: Math.round((baseTemp * dayFactor + randomNumber(-3, 3, 1)) * 10) / 10,
      voltage: Math.round((baseVoltage + randomNumber(-10, 10, 1)) * 10) / 10,
      pressure: Math.round((basePressure + randomNumber(-2, 2, 1)) * 10) / 10,
      humidity: Math.round((baseHumidity + randomNumber(-5, 5, 1)) * 10) / 10,
    })
  }

  return data
}

//  IMPROVEMENT: Enhanced KPI data generation with trends
export const generateKPIData = () => {
  const deviceData = generateDeviceData()
  const onlineDevices = deviceData.filter((d) => d.status === 'Online')
  const criticalDevices = deviceData.filter((d) => d.criticality === 'high')
  
  //  IMPROVEMENT: Calculate realistic metrics
  const totalAlerts = deviceData.reduce((sum, device) => sum + device.alertCount, 0)
  const averagePowerConsumption = randomNumber(1500, 3000) / 10
  
  //  IMPROVEMENT: Add efficiency metrics
  const efficiency = Math.round((onlineDevices.length / devices.length) * 100)
  const uptime = Math.round(randomNumber(95, 99.9) * 100) / 100

  return {
    totalDevices: devices.length,
    activeDevices: onlineDevices.length,
    alertsRaised: totalAlerts,
    powerConsumption: averagePowerConsumption.toFixed(1),
    criticalDevices: criticalDevices.length,
    efficiency: efficiency,
    uptime: uptime,
    //  IMPROVEMENT: Add trend data for each metric
    trends: {
      totalDevices: { change: 0, direction: 'stable' },
      activeDevices: { change: randomNumber(-5, 15), direction: randomNumber(0, 1) ? 'up' : 'down' },
      alertsRaised: { change: randomNumber(5, 30), direction: 'up' },
      powerConsumption: { change: randomNumber(-10, 5), direction: randomNumber(0, 1) ? 'down' : 'up' },
    }
  }
}

//  NEW: Generate alert/notification data
export const generateAlertData = () => {
  const alertTypes = [
    { type: 'temperature', severity: 'high', message: 'Temperature exceeded threshold', icon: 'thermostat' },
    { type: 'voltage', severity: 'medium', message: 'Voltage fluctuation detected', icon: 'electric_bolt' },
    { type: 'pressure', severity: 'high', message: 'Pressure drop detected', icon: 'compress' },
    { type: 'connection', severity: 'low', message: 'Device connection unstable', icon: 'wifi_off' },
    { type: 'maintenance', severity: 'medium', message: 'Scheduled maintenance due', icon: 'build' },
  ]

  return alertTypes.map((alert, index) => ({
    id: `alert-${Date.now()}-${index}`,
    ...alert,
    deviceId: devices[randomNumber(0, devices.length - 1)].id,
    timestamp: randomRecentTime(randomNumber(5, 240)),
    acknowledged: Math.random() > 0.7,
    resolved: Math.random() > 0.8,
  }))
}

//  NEW: Generate historical trend data for analytics
export const generateHistoricalData = (days = 30) => {
  const data = []
  const now = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      deviceCount: devices.length + randomNumber(-2, 5),
      uptime: randomNumber(95, 99.9),
      alerts: randomNumber(0, 15),
      powerConsumption: randomNumber(150, 300),
      efficiency: randomNumber(85, 98),
    })
  }
  
  return data
}

//  NEW: Generate device performance metrics
export const generateDevicePerformance = (deviceId) => {
  const device = devices.find(d => d.id === deviceId)
  if (!device) return null
  
  const deviceType = deviceTypes[device.type]
  const performance = []
  const now = new Date()
  
  // Generate 24 hours of performance data
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now)
    time.setHours(now.getHours() - i)
    
    performance.push({
      timestamp: time.toISOString(),
      value: randomNumber(deviceType.range[0], deviceType.range[1], 1),
      status: Math.random() > 0.1 ? 'normal' : Math.random() > 0.5 ? 'warning' : 'critical',
      efficiency: randomNumber(80, 100),
    })
  }
  
  return {
    deviceId,
    deviceName: device.name,
    type: device.type,
    performance,
    summary: {
      avgValue: performance.reduce((sum, p) => sum + p.value, 0) / performance.length,
      maxValue: Math.max(...performance.map(p => p.value)),
      minValue: Math.min(...performance.map(p => p.value)),
      uptime: (performance.filter(p => p.status === 'normal').length / performance.length) * 100,
    }
  }
}

//  NEW: Simulate real-time data streaming
export const createDataStream = (callback, interval = 5000) => {
  const streamInterval = setInterval(() => {
    const newData = {
      timestamp: new Date().toISOString(),
      devices: generateDeviceData(),
      kpis: generateKPIData(),
      alerts: generateAlertData().slice(0, 3), // Only recent alerts
    }
    
    callback(newData)
  }, interval)
  
  // Return cleanup function
  return () => clearInterval(streamInterval)
}

//  NEW: Data validation utilities
export const validateDeviceData = (data) => {
  if (!data || typeof data !== 'object') return false
  
  const requiredFields = ['id', 'name', 'type', 'status']
  return requiredFields.every(field => data.hasOwnProperty(field))
}

//  NEW: Data filtering utilities
export const filterDevices = (devices, filters = {}) => {
  let filtered = [...devices]
  
  if (filters.status) {
    filtered = filtered.filter(device => device.status === filters.status)
  }
  
  if (filters.type) {
    filtered = filtered.filter(device => device.type === filters.type)
  }
  
  if (filters.criticality) {
    filtered = filtered.filter(device => device.criticality === filters.criticality)
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(device => 
      device.name.toLowerCase().includes(searchTerm) ||
      device.id.toLowerCase().includes(searchTerm) ||
      device.location.toLowerCase().includes(searchTerm)
    )
  }
  
  return filtered
}

//  NEW: Sort devices utility
export const sortDevices = (devices, sortConfig) => {
  if (!sortConfig.key) return devices
  
  return [...devices].sort((a, b) => {
    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]
    
    // Handle different data types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })
}

//  NEW: Export device states for debugging
export const getDeviceStates = () => {
  return Object.fromEntries(deviceStates)
}

//  NEW: Reset device states (useful for testing)
export const resetDeviceStates = () => {
  deviceStates.clear()
  devices.forEach(device => {
    const deviceType = deviceTypes[device.type]
    deviceStates.set(device.id, {
      lastValue: randomNumber(deviceType.range[0], deviceType.range[1], 1),
      status: Math.random() > 0.15 ? 'Online' : 'Offline',
      lastUpdate: new Date(),
      trend: randomNumber(-1, 1) > 0 ? 'up' : 'down',
      alertCount: randomNumber(0, 5)
    })
  })
}