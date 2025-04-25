// Generate random number between min and max
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// Generate random date in the last hour
const randomRecentTime = () => {
  const now = new Date()
  const randomMinutesAgo = randomNumber(1, 60)
  now.setMinutes(now.getMinutes() - randomMinutesAgo)
  return now
}

// Format date to readable string
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date)
}

// Mock devices data
export const devices = [
  { id: "DEV-1001", name: "Temperature Sensor A1", type: "Temperature" },
  { id: "DEV-1002", name: "Voltage Meter B2", type: "Voltage" },
  { id: "DEV-1003", name: "Pressure Sensor C3", type: "Pressure" },
  { id: "DEV-1004", name: "Flow Meter D4", type: "Flow" },
  { id: "DEV-1005", name: "Humidity Sensor E5", type: "Humidity" },
  { id: "DEV-1006", name: "Power Meter F6", type: "Power" },
  { id: "DEV-1007", name: "Level Sensor G7", type: "Level" },
  { id: "DEV-1008", name: "Speed Sensor H8", type: "Speed" },
]

// Generate device status data
export const generateDeviceData = () => {
  return devices.map((device) => {
    const online = Math.random() > 0.2 // 80% chance of being online

    // Generate appropriate values based on device type
    let temperature = null
    let voltage = null
    const lastActive = online ? new Date() : randomRecentTime()

    if (device.type === "Temperature" || Math.random() > 0.5) {
      temperature = randomNumber(18, 85)
    }

    if (device.type === "Voltage" || Math.random() > 0.5) {
      voltage = randomNumber(110, 250) + Math.random().toFixed(1)
    }

    return {
      ...device,
      status: online ? "Online" : "Offline",
      temperature,
      voltage,
      lastActive: formatDate(lastActive),
      rawDate: lastActive,
    }
  })
}

// Generate time series data for charts
export const generateTimeSeriesData = (hours = 24) => {
  const data = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now)
    time.setHours(now.getHours() - i)

    data.push({
      time: time.toISOString(),
      temperature: randomNumber(20, 80),
      voltage: randomNumber(110, 250) + Math.random(),
      pressure: randomNumber(30, 70),
      humidity: randomNumber(30, 90),
    })
  }

  return data
}

// Generate KPI data
export const generateKPIData = () => {
  const deviceData = generateDeviceData()

  return {
    totalDevices: devices.length,
    activeDevices: deviceData.filter((d) => d.status === "Online").length,
    alertsRaised: randomNumber(1, 10),
    powerConsumption: (randomNumber(1500, 3000) / 10).toFixed(1),
  }
}
