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
  const { darkMode } = useAppContext()
  const chartRef = useRef(null)

  useEffect(() => {
    // Initial data load
    setData(generateTimeSeriesData(12))
    setLoading(false)

    // Update data every 5 seconds
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [
          ...prev.slice(1),
          {
            time: new Date().toISOString(),
            temperature: Math.max(20, Math.min(80, prev[prev.length - 1].temperature + (Math.random() * 10 - 5))),
            voltage: Math.max(110, Math.min(250, prev[prev.length - 1].voltage + (Math.random() * 20 - 10))),
            pressure: Math.max(30, Math.min(70, prev[prev.length - 1].pressure + (Math.random() * 8 - 4))),
            humidity: Math.max(30, Math.min(90, prev[prev.length - 1].humidity + (Math.random() * 15 - 7.5))),
          },
        ]
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const metrics = [
    { id: "temperature", name: "Temperature (°C)", color: "#ef4444" },
    { id: "voltage", name: "Voltage (V)", color: "#3b82f6" },
    { id: "pressure", name: "Pressure (PSI)", color: "#10b981" },
    { id: "humidity", name: "Humidity (%)", color: "#f59e0b" },
  ]

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-header"></div>
        <div className="loading-chart"></div>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Real-Time Monitoring</h2>
        <div className="chart-metrics">
          {metrics.map((m) => (
            <button
              key={m.id}
              className={`metric-button ${metric === m.id ? "active" : ""}`}
              onClick={() => setMetric(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis dataKey="time" tickFormatter={formatXAxis} stroke={darkMode ? "#9ca3af" : "#6b7280"} />
            <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#1f2937" : "#fff",
                borderColor: darkMode ? "#374151" : "#e5e7eb",
                color: darkMode ? "#fff" : "#000",
              }}
              formatter={(value) => [Number.parseFloat(value).toFixed(2), ""]}
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={metrics.find((m) => m.id === metric).color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DeviceChart
