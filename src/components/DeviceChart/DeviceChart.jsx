// src/components/DeviceChart/DeviceChart.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import { generateTimeSeriesData } from "../../services/mockData"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useAppContext } from "../../context/AppContext"
import "./DeviceChart.css"

const DeviceChart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState("temperature")
  const [error, setError] = useState(null)
  const { darkMode } = useAppContext()
  const chartRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    // ✅ IMPROVEMENT: Better initial data loading with error handling
    const loadInitialData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Simulate async data loading
        await new Promise(resolve => setTimeout(resolve, 500))
        setData(generateTimeSeriesData(12))
        setLoading(false)
      } catch (err) {
        setError('Failed to load chart data')
        setLoading(false)
      }
    }

    loadInitialData()

    // ✅ IMPROVEMENT: Better interval management with cleanup
    intervalRef.current = setInterval(() => {
      try {
        setData((prev) => {
          if (prev.length === 0) return prev
          
          const lastItem = prev[prev.length - 1]
          const newData = [
            ...prev.slice(1),
            {
              time: new Date().toISOString(),
              temperature: Math.max(20, Math.min(80, lastItem.temperature + (Math.random() * 10 - 5))),
              voltage: Math.max(110, Math.min(250, lastItem.voltage + (Math.random() * 20 - 10))),
              pressure: Math.max(30, Math.min(70, lastItem.pressure + (Math.random() * 8 - 4))),
              humidity: Math.max(30, Math.min(90, lastItem.humidity + (Math.random() * 15 - 7.5))),
            },
          ]
          return newData
        })
      } catch (err) {
        console.error('Error updating chart data:', err)
        setError('Error updating real-time data')
      }
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // ✅ IMPROVEMENT: Better date formatting for different screen sizes
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem)
    const screenWidth = window.innerWidth
    
    if (screenWidth < 480) {
      // Mobile: Show only time
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (screenWidth < 768) {
      // Tablet: Show short format
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      // Desktop: Show full format
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    }
  }

  // ✅ IMPROVEMENT: Enhanced tooltip formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">
            {new Date(label).toLocaleString()}
          </p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="tooltip-value" style={{ color: entry.color }}>
              {`${entry.name}: ${Number.parseFloat(entry.value).toFixed(2)}${getUnit(entry.dataKey)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // ✅ IMPROVEMENT: Get appropriate units for metrics
  const getUnit = (metricKey) => {
    switch (metricKey) {
      case 'temperature': return '°C'
      case 'voltage': return 'V'
      case 'pressure': return ' PSI'
      case 'humidity': return '%'
      default: return ''
    }
  }

  const metrics = [
    { id: "temperature", name: "Temperature", color: "#ef4444", unit: "°C" },
    { id: "voltage", name: "Voltage", color: "#3b82f6", unit: "V" },
    { id: "pressure", name: "Pressure", color: "#10b981", unit: "PSI" },
    { id: "humidity", name: "Humidity", color: "#f59e0b", unit: "%" },
  ]

  // ✅ IMPROVEMENT: Handle metric selection
  const handleMetricChange = (metricId) => {
    setMetric(metricId)
    // Add visual feedback
    const button = document.querySelector(`[data-metric="${metricId}"]`)
    if (button) {
      button.style.transform = 'scale(0.95)'
      setTimeout(() => {
        button.style.transform = 'scale(1)'
      }, 100)
    }
  }

  // ✅ IMPROVEMENT: Retry function for error states
  const handleRetry = () => {
    setError(null)
    setLoading(true)
    setData(generateTimeSeriesData(12))
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-header">
          <div className="loading-shimmer"></div>
        </div>
        <div className="loading-chart">
          <div className="loading-shimmer"></div>
        </div>
        <div className="loading-footer">
          <div className="loading-text">Loading real-time data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="chart-error">
        <div className="error-icon">
          <span className="material-icons">error_outline</span>
        </div>
        <h3 className="error-title">Unable to load chart</h3>
        <p className="error-message">{error}</p>
        <button className="error-retry-btn" onClick={handleRetry}>
          <span className="material-icons">refresh</span>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title-section">
          <h2 className="chart-title">Real-Time Monitoring</h2>
          <div className="chart-status">
            <span className="status-indicator online"></span>
            <span className="status-text">Live Data</span>
          </div>
        </div>
        
        {/*  IMPROVEMENT: Better responsive metric buttons */}
        <div className="chart-metrics">
          {metrics.map((m) => (
            <button
              key={m.id}
              data-metric={m.id}
              className={`metric-button ${metric === m.id ? "active" : ""}`}
              onClick={() => handleMetricChange(m.id)}
              aria-pressed={metric === m.id}
              style={{ '--metric-color': m.color }}
            >
              <span className="metric-name">{m.name}</span>
              <span className="metric-unit">({m.unit})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ FIXED: Improved responsive chart wrapper */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
          <LineChart 
            data={data} 
            margin={{ 
              top: 20, 
              right: window.innerWidth < 768 ? 10 : 30, 
              left: window.innerWidth < 768 ? 10 : 20, 
              bottom: 20 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? "#374151" : "#e5e7eb"} 
              opacity={0.7}
            />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatXAxis} 
              stroke={darkMode ? "#9ca3af" : "#6b7280"}
              fontSize={window.innerWidth < 768 ? 10 : 12}
              interval={window.innerWidth < 480 ? 2 : 1}
            />
            <YAxis 
              stroke={darkMode ? "#9ca3af" : "#6b7280"}
              fontSize={window.innerWidth < 768 ? 10 : 12}
              width={window.innerWidth < 768 ? 40 : 60}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: darkMode ? "#6b7280" : "#9ca3af", strokeWidth: 1 }}
            />
            <Legend 
              wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={metrics.find((m) => m.id === metric).color}
              strokeWidth={window.innerWidth < 768 ? 2 : 3}
              dot={false}
              activeDot={{ 
                r: window.innerWidth < 768 ? 4 : 6,
                stroke: metrics.find((m) => m.id === metric).color,
                strokeWidth: 2,
                fill: darkMode ? "#1f2937" : "#fff"
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/*  IMPROVEMENT: Chart footer with additional info */}
      <div className="chart-footer">
        <div className="chart-info">
          <span className="info-text">
            Showing last {data.length} data points • Updates every 5 seconds
          </span>
        </div>
        <div className="chart-controls">
          <button 
            className="chart-control-btn"
            onClick={() => setData(generateTimeSeriesData(12))}
            aria-label="Refresh chart data"
          >
            <span className="material-icons">refresh</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeviceChart