"use client"

import { useState, useEffect } from "react"
import { generateDeviceData } from "../../services/mockData"
import "./DeviceTable.css"

const DeviceTable = () => {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" })

  useEffect(() => {
    // Initial data load
    setDevices(generateDeviceData())
    setLoading(false)

    // Update data every 5 seconds
    const interval = setInterval(() => {
      setDevices(generateDeviceData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortedDevices = () => {
    const sortableDevices = [...devices]
    if (sortConfig.key) {
      sortableDevices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableDevices
  }

  if (loading) {
    return (
      <div className="device-table-loading">
        <div className="loading-header"></div>
        <div className="loading-rows">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="loading-row"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="device-table-container">
      <div className="device-table-header">
        <h2 className="device-table-title">Live Device Data</h2>
        <div className="device-table-refresh">Auto-refreshes every 5 seconds</div>
      </div>

      <div className="device-table-wrapper">
        <table className="device-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("id")}>
                <div className="table-header-cell">
                  <span>Device ID</span>
                  <span className="material-icons sort-icon">
                    {sortConfig.key === "id"
                      ? sortConfig.direction === "ascending"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </div>
              </th>
              <th onClick={() => requestSort("name")}>
                <div className="table-header-cell">
                  <span>Name</span>
                  <span className="material-icons sort-icon">
                    {sortConfig.key === "name"
                      ? sortConfig.direction === "ascending"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </div>
              </th>
              <th onClick={() => requestSort("status")}>
                <div className="table-header-cell">
                  <span>Status</span>
                  <span className="material-icons sort-icon">
                    {sortConfig.key === "status"
                      ? sortConfig.direction === "ascending"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </div>
              </th>
              <th onClick={() => requestSort("temperature")}>
                <div className="table-header-cell">
                  <span>Temperature (°C)</span>
                  <span className="material-icons sort-icon">
                    {sortConfig.key === "temperature"
                      ? sortConfig.direction === "ascending"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </div>
              </th>
              <th onClick={() => requestSort("voltage")}>
                <div className="table-header-cell">
                  <span>Voltage (V)</span>
                  <span className="material-icons sort-icon">
                    {sortConfig.key === "voltage"
                      ? sortConfig.direction === "ascending"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </div>
              </th>
              <th onClick={() => requestSort("lastActive")}>
                <div className="table-header-cell">
                  <span>Last Active</span>
                  <span className="material-icons sort-icon">
                    {sortConfig.key === "lastActive"
                      ? sortConfig.direction === "ascending"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </div>
              </th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {getSortedDevices().map((device) => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.name}</td>
                <td>
                  <span className={`status-badge ${device.status === "Online" ? "online" : "offline"}`}>
                    {device.status}
                  </span>
                </td>
                <td>{device.temperature !== null ? `${device.temperature}°C` : "-"}</td>
                <td>{device.voltage !== null ? `${device.voltage}V` : "-"}</td>
                <td>{device.lastActive}</td>
                <td>
                  <button className="table-action-button">
                    <span className="material-icons">more_horiz</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DeviceTable
