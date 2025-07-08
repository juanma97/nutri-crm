import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './contexts/AuthContext'
import { FirebaseProvider } from './contexts/FirebaseContext'
import ProtectedRoute from './components/ProtectedRoute'
import TopNav from './components/TopNav'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientList from './pages/ClientList'
import ClientForm from './pages/ClientForm'
import FoodList from './pages/FoodList'
import FoodFormPage from './pages/FoodFormPage'
import DietList from './pages/DietList'
import CreateDiet from './pages/CreateDiet'
import EditDiet from './pages/EditDiet'
import DietViewer from './pages/DietViewer'
import SharedDiet from './pages/SharedDiet'
import Reports from './pages/Reports'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#1976d2',
    },
  },
})

function App() {
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<ProtectedRoute><TopNav /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="clients" element={<ClientList />} />
                    <Route path="clients/new" element={<ClientForm />} />
                    <Route path="clients/edit/:id" element={<ClientForm />} />
                    <Route path="foods" element={<FoodList />} />
                    <Route path="foods/new" element={<FoodFormPage />} />
                    <Route path="foods/edit/:id" element={<FoodFormPage />} />
                    <Route path="diets" element={<DietList />} />
                    <Route path="diets/new" element={<CreateDiet />} />
                    <Route path="diets/edit/:id" element={<EditDiet />} />
                    <Route path="diets/view/:id" element={<DietViewer />} />
                    <Route path="reports" element={<Reports />} />
                  </Route>
                  <Route path="/diet/:shareId" element={<SharedDiet />} />
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
