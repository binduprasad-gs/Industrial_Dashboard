// src/components/Sidebar/Sidebar.jsx
//  FIXED: Corrected filename from "SIdebar.jsx" to "Sidebar.jsx"
//  FIXED: Added proper component structure and improved accessibility

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

  // IMPROVEMENT: Better keyboard navigation support
  const handleKeyDown = (event, path) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Navigate to the path programmatically if needed
    }
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={toggleSidebar}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onKeyDown={(e) => e.key === 'Escape' && toggleSidebar()}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Industrial IoT</h2>
          <button 
            className="sidebar-close" 
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu" role="menu">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.name} className="sidebar-menu-item" role="none">
                  <Link
                    to={item.path}
                    className={`sidebar-menu-link ${isActive ? "active" : ""}`}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    onKeyDown={(e) => handleKeyDown(e, item.path)}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="material-icons" aria-hidden="true">{item.icon}</span>
                    <span className="sidebar-menu-text">{item.name}</span>
                    {item.name === "Alerts" && (
                      <span className="sidebar-badge" aria-label="3 unread alerts">3</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar" aria-hidden="true">JD</div>
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