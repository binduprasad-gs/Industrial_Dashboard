import "./KPICard.css"

const KPICard = ({ title, value, icon, color, change }) => {
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-card-content">
        <div className="kpi-card-info">
          <h3 className="kpi-card-title">{title}</h3>
          <p className="kpi-card-value">{value}</p>

          {change && (
            <div className={`kpi-card-change ${change.type === "increase" ? "increase" : "decrease"}`}>
              <span>{change.value}%</span>
              <span>{change.type === "increase" ? "↑" : "↓"}</span>
              <span className="kpi-card-period">vs last period</span>
            </div>
          )}
        </div>

        <div className={`kpi-card-icon ${color}`}>
          <span className="material-icons">{icon}</span>
        </div>
      </div>
    </div>
  )
}

export default KPICard
