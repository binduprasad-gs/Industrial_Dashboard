"use client"

import { useState, useRef, useEffect } from "react"
import { useAppContext } from "../../context/AppContext"
import "./TopBar.css"

const TopBar = () => {
  const { toggleSidebar, darkMode, toggleTheme, notifications, markAsRead, unreadCount } = useAppContext()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const notificationRef = useRef(null)
  const profileRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <button className="topbar-menu-button" onClick={toggleSidebar}>
            <span className="material-icons">menu</span>
          </button>
          <h1 className="topbar-title">Industrial Monitoring Dashboard</h1>
        </div>

        <div className="topbar-right">
          {/* Theme toggle */}
          <button className="topbar-icon-button" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="material-icons">{darkMode ? "light_mode" : "dark_mode"}</span>
          </button>

          {/* Notifications */}
          <div className="topbar-dropdown" ref={notificationRef}>
            <button
              className="topbar-icon-button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <span className="material-icons">notifications</span>
              {unreadCount > 0 && <span className="topbar-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? "unread" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <p className="notification-message">{notification.message}</p>
                        <p className="notification-time">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">No notifications</div>
                  )}
                </div>
                <div className="dropdown-footer">
                  <button className="dropdown-link">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="topbar-dropdown" ref={profileRef}>
            <button className="topbar-profile-button" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="topbar-avatar">JD</div>
              <span className="material-icons">arrow_drop_down</span>
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu profile-menu">
                <div className="dropdown-header">
                  <p className="profile-name">John Doe</p>
                  <p className="profile-email">john.doe@example.com</p>
                </div>
                <div className="dropdown-items">
                  <button className="dropdown-item">
                    <span className="material-icons">person</span>
                    <span>Profile</span>
                  </button>
                  <button className="dropdown-item logout">
                    <span className="material-icons">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
