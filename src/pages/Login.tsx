import React, { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Tabs,
  Tab,
  Divider
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { login, register, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    if (activeTab === 1 && !name) {
      setError('Por favor ingresa tu nombre')
      return
    }

    let success = false
    
    if (activeTab === 0) {
      // Login
      success = await login(email, password)
      if (!success) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      }
    } else {
      // Register
      success = await register(email, password, name)
      if (!success) {
        setError('Error al crear la cuenta. El email ya podría estar en uso.')
      }
    }
    
    if (success) {
      navigate('/dashboard')
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setError('')
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2e7d32' }}>
              NutriCRM
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sistema de gestión nutricional
            </Typography>
          </Box>

          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {activeTab === 1 && (
              <TextField
                fullWidth
                label="Nombre completo"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />
            )}
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              helperText={activeTab === 1 ? "Mínimo 6 caracteres" : ""}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                activeTab === 0 ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              o
            </Typography>
          </Divider>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Nota:</strong> Para probar el sistema, puedes crear una cuenta nueva o usar credenciales existentes.
            </Typography>
          </Alert>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Sistema de gestión nutricional con Firebase
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login 