import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Divider
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Restaurant as FoodIcon,
  Assignment as DietIcon,
  LibraryBooks as TemplateIcon,
  People as ClientIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const TopNav = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/foods', label: 'Alimentos', icon: <FoodIcon /> },
    { path: '/diets', label: 'Dietas', icon: <DietIcon /> },
    { path: '/templates', label: 'Plantillas', icon: <TemplateIcon /> },
    { path: '/clients', label: 'Clientes', icon: <ClientIcon /> }
  ]

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: theme.palette.mode === 'dark'
            ? 'rgba(18, 18, 18, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'sticky',
          top: 0,
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ minHeight: 70, px: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                flexGrow: 0, 
                mr: 4,
                fontWeight: 700,
                color: theme.palette.primary.main,
                letterSpacing: '-0.02em',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease'
                }
              }}
              onClick={() => navigate('/dashboard')}
            >
              NutriCRM
            </Typography>
          </motion.div>
          
          {/* Navigation Items */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, ml: 2 }}>
            <AnimatePresence>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Button
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      letterSpacing: '0.01em',
                      backgroundColor: isActive(item.path) 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                      color: isActive(item.path)
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                      border: isActive(item.path)
                        ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        : '1px solid transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                      '& .MuiButton-startIcon': {
                        marginRight: 1,
                        '& svg': {
                          fontSize: 20,
                          transition: 'transform 0.2s ease',
                        }
                      },
                                             '&:hover .MuiButton-startIcon svg': {
                         transform: 'scale(1.1)',
                       },
                       '&:focus': {
                         outline: 'none',
                       },
                       '&:focus-visible': {
                         outline: 'none',
                       }
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>

          {/* User Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    fontSize: '0.875rem'
                  }}
                >
                  {user?.email?.split('@')[0]}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }}
                >
                  Nutricionista
                </Typography>
              </Box>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    p: 0.5,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                                         '&:hover': {
                       backgroundColor: alpha(theme.palette.primary.main, 0.1),
                       borderColor: alpha(theme.palette.primary.main, 0.3),
                       transform: 'translateY(-1px)',
                       boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                     },
                     '&:focus': {
                       outline: 'none',
                     },
                     '&:focus-visible': {
                       outline: 'none',
                     }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || <AccountIcon />}
                  </Avatar>
                </IconButton>
              </motion.div>
            </Box>
          </motion.div>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
            minWidth: 200,
            overflow: 'visible',
            '& .MuiMenuItem-root': {
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: 'translateX(4px)',
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {user?.email}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Administrador del sistema
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
          </ListItemIcon>
          <ListItemText 
            primary="Configuración" 
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </MenuItem>
        
        <MenuItem 
          onClick={handleLogout}
          sx={{
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText 
            primary="Cerrar sesión" 
            primaryTypographyProps={{ 
              fontSize: '0.875rem',
              color: theme.palette.error.main
            }}
          />
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, minHeight: 'calc(100vh - 70px)' }}>
        <Outlet />
      </Box>
    </>
  )
}

export default TopNav 