"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode")
    return savedTheme ? JSON.parse(savedTheme) : window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Temperature alert on Device ID-1001", read: false, time: "10 min ago" },
    { id: 2, message: "Voltage spike detected on Device ID-1003", read: false, time: "25 min ago" },
    { id: 3, message: "Device ID-1005 went offline", read: true, time: "1 hour ago" },
  ])

  // Sidebar state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Update theme in localStorage and apply class to document
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [darkMode])

  // Toggle theme function
  const toggleTheme = () => setDarkMode(!darkMode)

  // Toggle sidebar function
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleTheme,
        sidebarOpen,
        toggleSidebar,
        notifications,
        markAsRead,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
