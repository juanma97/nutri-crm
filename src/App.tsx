import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackbarProvider } from 'notistack'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { FirebaseProvider } from './contexts/FirebaseContext'
import ProtectedRoute from './components/ProtectedRoute'
import TopNav from './components/TopNav'
import ScrollToTop from './components/ScrollToTop'
import Login from './pages/Login'
import { CircularProgress, Box } from '@mui/material'
import theme from './styles/theme'
import './App.css'

// Lazy load heavy pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const DietList = lazy(() => import('./pages/DietList'))
const DietViewer = lazy(() => import('./pages/DietViewer'))
const CreateDiet = lazy(() => import('./pages/CreateDiet'))
const EditDiet = lazy(() => import('./pages/EditDiet'))
const DietTemplates = lazy(() => import('./pages/DietTemplates'))
const CreateTemplate = lazy(() => import('./pages/CreateTemplate'))
const EditTemplate = lazy(() => import('./pages/EditTemplate'))
const ViewTemplate = lazy(() => import('./pages/ViewTemplate'))
const AssignTemplate = lazy(() => import('./pages/AssignTemplate'))
const ClientList = lazy(() => import('./pages/ClientList'))
const ClientForm = lazy(() => import('./pages/ClientForm'))
const FoodList = lazy(() => import('./pages/FoodList'))
const FoodFormPage = lazy(() => import('./pages/FoodFormPage'))
const SharedDiet = lazy(() => import('./pages/SharedDiet'))

// Loading component
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
  </Box>
)

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
              <ScrollToTop />
              <div className="App">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<ProtectedRoute><TopNav /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={
                      <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                      </Suspense>
                    } />
                    <Route path="clients" element={
                      <Suspense fallback={<PageLoader />}>
                        <ClientList />
                      </Suspense>
                    } />
                    <Route path="clients/new" element={
                      <Suspense fallback={<PageLoader />}>
                        <ClientForm />
                      </Suspense>
                    } />
                    <Route path="clients/edit/:id" element={
                      <Suspense fallback={<PageLoader />}>
                        <ClientForm />
                      </Suspense>
                    } />
                    <Route path="foods" element={
                      <Suspense fallback={<PageLoader />}>
                        <FoodList />
                      </Suspense>
                    } />
                    <Route path="foods/new" element={
                      <Suspense fallback={<PageLoader />}>
                        <FoodFormPage />
                      </Suspense>
                    } />
                    <Route path="foods/edit/:id" element={
                      <Suspense fallback={<PageLoader />}>
                        <FoodFormPage />
                      </Suspense>
                    } />
                    <Route path="diets" element={
                      <Suspense fallback={<PageLoader />}>
                        <DietList />
                      </Suspense>
                    } />
                    <Route path="diets/new" element={
                      <Suspense fallback={<PageLoader />}>
                        <CreateDiet />
                      </Suspense>
                    } />
                    <Route path="diets/edit/:id" element={
                      <Suspense fallback={<PageLoader />}>
                        <EditDiet />
                      </Suspense>
                    } />
                    <Route path="diets/view/:id" element={
                      <Suspense fallback={<PageLoader />}>
                        <DietViewer />
                      </Suspense>
                    } />
                    <Route path="templates" element={
                      <Suspense fallback={<PageLoader />}>
                        <DietTemplates />
                      </Suspense>
                    } />
                    <Route path="templates/new" element={
                      <Suspense fallback={<PageLoader />}>
                        <CreateTemplate />
                      </Suspense>
                    } />
                    <Route path="templates/edit/:id" element={
                      <Suspense fallback={<PageLoader />}>
                        <EditTemplate />
                      </Suspense>
                    } />
                    <Route path="templates/view/:id" element={
                      <Suspense fallback={<PageLoader />}>
                        <ViewTemplate />
                      </Suspense>
                    } />
                    <Route path="templates/assign/:templateId" element={
                      <Suspense fallback={<PageLoader />}>
                        <AssignTemplate />
                      </Suspense>
                    } />
                  </Route>
                  <Route path="/diet/:shareId" element={
                    <Suspense fallback={<PageLoader />}>
                      <SharedDiet />
                    </Suspense>
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
