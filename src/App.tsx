import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import TopNav from './components/TopNav'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FoodList from './pages/FoodList'
import DietList from './pages/DietList'
import CreateDiet from './pages/CreateDiet'
import EditDiet from './pages/EditDiet'
import DietViewer from './pages/DietViewer'
import Reports from './pages/Reports'
import { AuthProvider } from './contexts/AuthContext'
import { DietProvider } from './contexts/DietContext'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
  },
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DietProvider>
          <Router>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/diet/:shareId" element={<DietViewer />} />
              
              {/* Rutas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                    <TopNav />
                    <div style={{ flex: 1, width: '100%' }}>
                      <Navigate to="/dashboard" replace />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                    <TopNav />
                    <div style={{ flex: 1, width: '100%' }}>
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/foods" element={
                <ProtectedRoute>
                  <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                    <TopNav />
                    <div style={{ flex: 1, width: '100%' }}>
                      <FoodList />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/diets" element={
                <ProtectedRoute>
                  <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                    <TopNav />
                    <div style={{ flex: 1, width: '100%' }}>
                      <DietList />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/diets/create" element={
                <ProtectedRoute>
                  <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                    <TopNav />
                    <div style={{ flex: 1, width: '100%' }}>
                      <CreateDiet />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/diets/edit/:id" element={
                <ProtectedRoute>
                  <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                    <TopNav />
                    <div style={{ flex: 1, width: '100%' }}>
                      <EditDiet />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                    <TopNav />
                    <div style={{ flex: 1, width: '100%' }}>
                      <Reports />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </DietProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
