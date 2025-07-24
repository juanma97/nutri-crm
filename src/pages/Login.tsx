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
  Divider,
  useTheme,
  alpha
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
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
  const theme = useTheme()

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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setError('')
  }



  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main} 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, ${theme.palette.info.main} 0%, transparent 50%)`,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              width: '100%',
              maxWidth: 450,
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative Elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                filter: 'blur(20px)',
                zIndex: -1
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                filter: 'blur(15px)',
                zIndex: -1
              }}
            />

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    color: theme.palette.primary.main,
                    letterSpacing: '-0.02em',
                    mb: 1
                  }}
                >
                  NutriCRM
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 400,
                    opacity: 0.8,
                    letterSpacing: '0.01em'
                  }}
                >
                  Sistema de gestión nutricional profesional
                </Typography>
              </motion.div>
            </Box>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                centered 
                sx={{ 
                  mb: 4,
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    minHeight: 48,
                    textTransform: 'none',
                    letterSpacing: '0.01em',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                    '&:focus': {
                      outline: 'none',
                    }
                  },
                  '& .Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                    borderRadius: 2,
                  }
                }}
              >
                <Tab label="Iniciar Sesión" />
                <Tab label="Registrarse" />
              </Tabs>
            </motion.div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                      background: alpha(theme.palette.error.main, 0.05),
                      '& .MuiAlert-icon': {
                        fontSize: 20
                      }
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === 1 && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      margin="normal"
                      required
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          backgroundColor: theme.palette.background.paper,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          },
                          '&.Mui-focused': {
                            backgroundColor: theme.palette.background.paper,
                          },
                          '& input': {
                            color: theme.palette.text.primary,
                          },
                          '& input:-webkit-autofill': {
                            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                            WebkitTextFillColor: theme.palette.text.primary,
                            backgroundColor: theme.palette.background.paper,
                          },
                          '& input:-webkit-autofill:hover': {
                            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                          },
                          '& input:-webkit-autofill:focus': {
                            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: theme.palette.primary.main,
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    backgroundColor: theme.palette.background.paper,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                    '&.Mui-focused': {
                      backgroundColor: theme.palette.background.paper,
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                    },
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: theme.palette.background.paper,
                    },
                    '& input:-webkit-autofill:hover': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                    },
                    '& input:-webkit-autofill:focus': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  }
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    backgroundColor: theme.palette.background.paper,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                    '&.Mui-focused': {
                      backgroundColor: theme.palette.background.paper,
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                    },
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: theme.palette.background.paper,
                    },
                    '& input:-webkit-autofill:hover': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                    },
                    '& input:-webkit-autofill:focus': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }
                }}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 4,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    letterSpacing: '0.01em',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.grey[600], 0.3)
                        : alpha(theme.palette.grey[300], 0.5),
                      boxShadow: 'none',
                      transform: 'none',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    activeTab === 0 ? 'Iniciar Sesión' : 'Crear Cuenta'
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Divider sx={{ my: 3 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    px: 2,
                    backgroundColor: theme.palette.background.paper,
                    opacity: 0.7
                  }}
                >
                  o
                </Typography>
              </Divider>
            </motion.div>

            {/* Info Alert */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  background: alpha(theme.palette.info.main, 0.05),
                  '& .MuiAlert-icon': {
                    fontSize: 20
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  <strong>Nota:</strong> Para probar el sistema, puedes crear una cuenta nueva o usar credenciales existentes.
                </Typography>
              </Alert>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    opacity: 0.7,
                    fontSize: '0.875rem'
                  }}
                >
                  Sistema de gestión nutricional con Firebase
                </Typography>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </motion.div>
      </Container>
    </Box>
  )
}

export default Login 