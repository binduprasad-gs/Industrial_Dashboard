// src/context/AppContext.jsx

"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  //  FIXED: Theme state without localStorage, using system preference as default
  const [darkMode, setDarkMode] = useState(() => {
    // Use system preference as default, no localStorage
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  // IMPROVEMENT: Enhanced notifications state with better data structure
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "Temperature alert on Device ID-1001", 
      read: false, 
      time: "10 min ago",
      type: "warning",
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    { 
      id: 2, 
      message: "Voltage spike detected on Device ID-1003", 
      read: false, 
      time: "25 min ago",
      type: "error",
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    },
    { 
      id: 3, 
      message: "Device ID-1005 went offline", 
      read: true, 
      time: "1 hour ago",
      type: "info",
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    },
  ])

  // Sidebar state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  //  FIXED: Apply theme changes without localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [darkMode])

  //  IMPROVEMENT: Enhanced theme toggle with transition
  const toggleTheme = () => {
    // Add smooth transition
    document.body.style.transition = 'background-color 0.3s, color 0.3s'
    setDarkMode(!darkMode)
    
    // Remove transition after animation
    setTimeout(() => {
      document.body.style.transition = ''
    }, 300)
  }

  // Toggle sidebar function
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  //  IMPROVEMENT: Enhanced notification management
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    )
  }

  //  NEW: Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  //  NEW: Add new notification function
  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
      time: 'Just now',
      type,
      timestamp: new Date()
    }
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Keep max 10 notifications
  }

  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length

  // IMPROVEMENT: Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      setDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // ✅ IMPROVEMENT: Close sidebar on route changes for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const contextValue = {
    darkMode,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
    notifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    unreadCount,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}