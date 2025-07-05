import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import TopNav from './components/TopNav'
import Dashboard from './pages/Dashboard'
import FoodList from './pages/FoodList'
import DietList from './pages/DietList'
import CreateDiet from './pages/CreateDiet'
import EditDiet from './pages/EditDiet'
import DietViewer from './pages/DietViewer'
import Reports from './pages/Reports'
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
      <DietProvider>
        <Router>
          <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
            <TopNav />
            <div style={{ flex: 1, width: '100%' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/foods" element={<FoodList />} />
                <Route path="/diets" element={<DietList />} />
                <Route path="/diets/create" element={<CreateDiet />} />
                <Route path="/diets/edit/:id" element={<EditDiet />} />
                <Route path="/diet/:shareId" element={<DietViewer />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </div>
        </Router>
      </DietProvider>
    </ThemeProvider>
  )
}

export default App
