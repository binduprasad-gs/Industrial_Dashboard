"use client"

import { useAppContext } from "../../context/AppContext"
import { Link, useLocation } from "react-router-dom"
import "./Sidebar.css"

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext()
  const location = useLocation()

  const navItems = [
    { name: "Dashboard", icon: "dashboard", path: "/" },
    { name: "Devices", icon: "devices", path: "/devices" },
    { name: "Analytics", icon: "analytics", path: "/analytics" },
    { name: "Alerts", icon: "notifications", path: "/alerts" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ]

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Industrial IoT</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.name} className="sidebar-menu-item">
                  <Link
                    to={item.path}
                    className={`sidebar-menu-link ${isActive ? "active" : ""}`}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  >
                    <span className="material-icons">{item.icon}</span>
                    <span className="sidebar-menu-text">{item.name}</span>
                    {item.name === "Alerts" && <span className="sidebar-badge">3</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">JD</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">John Doe</p>
              <p className="sidebar-user-role">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
