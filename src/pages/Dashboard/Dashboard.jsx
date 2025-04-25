"use client"

import { useState, useEffect } from "react"
import KPICard from "../../components/KPICard/KPICard"
import DeviceTable from "../../components/DeviceTable/DeviceTable"
import DeviceChart from "../../components/DeviceChart/DeviceChart"
import { generateKPIData } from "../../services/mockData"
import "./Dashboard.css"

const Dashboard = () => {
  const [kpiData, setKpiData] = useState(null)

  useEffect(() => {
    // Initial data load
    setKpiData(generateKPIData())

    // Update KPI data every 30 seconds
    const interval = setInterval(() => {
      setKpiData(generateKPIData())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!kpiData) {
    return (
      <div className="dashboard-loading">
        <div className="kpi-cards-loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="kpi-card-loading"></div>
          ))}
        </div>
        <div className="chart-section-loading"></div>
        <div className="table-section-loading"></div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="kpi-cards">
        <KPICard
          title="Total Devices"
          value={kpiData.totalDevices}
          icon="devices"
          color="primary"
          change={{ type: "increase", value: 12 }}
        />
        <KPICard
          title="Active Devices"
          value={kpiData.activeDevices}
          icon="power"
          color="success"
          change={{ type: "increase", value: 8 }}
        />
        <KPICard
          title="Alerts Raised"
          value={kpiData.alertsRaised}
          icon="warning"
          color="danger"
          change={{ type: "increase", value: 24 }}
        />
        <KPICard
          title="Power Consumption"
          value={`${kpiData.powerConsumption} kWh`}
          icon="bolt"
          color="warning"
          change={{ type: "decrease", value: 5 }}
        />
      </div>

      <div className="dashboard-section">
        <DeviceChart />
      </div>

      <div className="dashboard-section">
        <DeviceTable />
      </div>
    </div>
  )
}

export default Dashboard
