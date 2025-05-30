// src/components/TopBar/TopBar.jsx

"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useAppContext } from "../../context/AppContext"
import "./TopBar.css"

const TopBar = () => {
  const { 
    toggleSidebar, 
    darkMode, 
    toggleTheme, 
    notifications, 
    markAsRead, 
    markAllAsRead,
    removeNotification,
    unreadCount 
  } = useAppContext()
  
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const notificationRef = useRef(null)
  const profileRef = useRef(null)

  //  FIXED: Improved click-outside behavior with useCallback
  const handleClickOutside = useCallback((event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false)
    }
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfileMenu(false)
    }
  }, [])

  //  FIXED: Better event listener management
  useEffect(() => {
    if (showNotifications || showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside) // Mobile support
      
      //  IMPROVEMENT: Escape key support
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setShowNotifications(false)
          setShowProfileMenu(false)
        }
      }
      document.addEventListener("keydown", handleEscape)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("touchstart", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [showNotifications, showProfileMenu, handleClickOutside])

  // IMPROVEMENT: Toggle functions with proper state management
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev)
    setShowProfileMenu(false) // Close other dropdown
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev)
    setShowNotifications(false) // Close other dropdown
  }

  //  IMPROVEMENT: Handle notification actions
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    // Add navigation logic here if needed
  }

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation() // Prevent triggering click handler
    removeNotification(notificationId)
  }

  //  IMPROVEMENT: Profile menu actions
  const handleProfileClick = () => {
    setShowProfileMenu(false)
    // Add profile navigation logic
    console.log('Navigate to profile')
  }

  const handleLogout = () => {
    setShowProfileMenu(false)
    // Add logout logic
    console.log('Logout functionality')
  }

  return (
    <header className="topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <button 
            className="topbar-menu-button" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar menu"
          >
            <span className="material-icons">menu</span>
          </button>
          <h1 className="topbar-title">Industrial Monitoring Dashboard</h1>
        </div>

        <div className="topbar-right">
          {/* Theme toggle */}
          <button 
            className="topbar-icon-button" 
            onClick={toggleTheme} 
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
          >
            <span className="material-icons">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/*  FIXED: Notifications dropdown with improved functionality */}
          <div className="topbar-dropdown" ref={notificationRef}>
            <button
              className="topbar-icon-button"
              onClick={toggleNotifications}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              aria-expanded={showNotifications}
            >
              <span className="material-icons">notifications</span>
              {unreadCount > 0 && (
                <span className="topbar-badge" aria-hidden="true">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="dropdown-menu notifications-menu" role="menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      className="mark-all-read-btn"
                      onClick={markAllAsRead}
                      aria-label="Mark all notifications as read"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? "unread" : ""}`}
                        onClick={() => handleNotificationClick(notification)}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleNotificationClick(notification)}
                      >
                        <div className="notification-content">
                          <p className="notification-message">{notification.message}</p>
                          <p className="notification-time">{notification.time}</p>
                        </div>
                        <button
                          className="notification-delete"
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          aria-label="Delete notification"
                        >
                          <span className="material-icons">close</span>
                        </button>
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

          {/*  FIXED: Profile dropdown with improved functionality */}
          <div className="topbar-dropdown" ref={profileRef}>
            <button 
              className="topbar-profile-button" 
              onClick={toggleProfileMenu}
              aria-label="User profile menu"
              aria-expanded={showProfileMenu}
            >
              <div className="topbar-avatar" aria-hidden="true">JD</div>
              <span className="material-icons">arrow_drop_down</span>
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu profile-menu" role="menu">
                <div className="dropdown-header">
                  <p className="profile-name">John Doe</p>
                  <p className="profile-email">john.doe@example.com</p>
                </div>
                <div className="dropdown-items">
                  <button 
                    className="dropdown-item"
                    onClick={handleProfileClick}
                    role="menuitem"
                  >
                    <span className="material-icons">person</span>
                    <span>Profile</span>
                  </button>
                  <button 
                    className="dropdown-item logout"
                    onClick={handleLogout}
                    role="menuitem"
                  >
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