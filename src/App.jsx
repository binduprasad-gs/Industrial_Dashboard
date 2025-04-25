import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppProvider } from "./context/AppContext"
import Sidebar from "./components/Sidebar/Sidebar"
import TopBar from "./components/TopBar/TopBar"
import Dashboard from "./pages/Dashboard/Dashboard"
import PlaceholderPage from "./pages/PlaceholderPage/PlaceholderPage"
import "./App.css"

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="app-content">
            <TopBar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devices" element={<PlaceholderPage title="Devices" />} />
                <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
                <Route path="/alerts" element={<PlaceholderPage title="Alerts" />} />
                <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
