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
import ClientList from './pages/ClientList'
import ClientForm from './pages/ClientForm'
import Reports from './pages/Reports'
import { AuthProvider } from './contexts/AuthContext'
import { FirebaseProvider } from './contexts/FirebaseContext'
import { SnackbarProvider } from 'notistack'
import './styles/global.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff6b6b',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={4000}
      >
        <AuthProvider>
          <FirebaseProvider>
            <Router>
              <div className="App">
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
                  
                  <Route path="/clients" element={
                    <ProtectedRoute>
                      <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                        <TopNav />
                        <div style={{ flex: 1, width: '100%' }}>
                          <ClientList />
                        </div>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/clients/create" element={
                    <ProtectedRoute>
                      <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                        <TopNav />
                        <div style={{ flex: 1, width: '100%' }}>
                          <ClientForm />
                        </div>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/clients/edit/:id" element={
                    <ProtectedRoute>
                      <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
                        <TopNav />
                        <div style={{ flex: 1, width: '100%' }}>
                          <ClientForm />
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
              </div>
            </Router>
          </FirebaseProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
