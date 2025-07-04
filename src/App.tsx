import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import TopNav from './components/TopNav'
import FoodList from './pages/FoodList'

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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNav />
        <div style={{ flex: 1, width: '100%' }}>
          <FoodList />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
