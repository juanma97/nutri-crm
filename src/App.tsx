import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopNav from './components/TopNav'
import FoodList from './pages/FoodList'
import DietList from './pages/DietList'
import CreateDiet from './pages/CreateDiet'

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
      <Router>
        <div style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
          <TopNav />
          <div style={{ flex: 1, width: '100%' }}>
            <Routes>
              <Route path="/" element={<FoodList />} />
              <Route path="/foods" element={<FoodList />} />
              <Route path="/diets" element={<DietList />} />
              <Route path="/diets/create" element={<CreateDiet />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
