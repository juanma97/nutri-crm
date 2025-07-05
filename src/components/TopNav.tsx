import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PeopleIcon from '@mui/icons-material/People'

const TopNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          NutriCRM
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Dashboard
          </Button>
          
          <Button
            color="inherit"
            startIcon={<PeopleIcon />}
            onClick={() => navigate('/foods')}
            sx={{
              backgroundColor: isActive('/foods') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Foods
          </Button>
          
          <Button
            color="inherit"
            startIcon={<RestaurantIcon />}
            onClick={() => navigate('/diets')}
            sx={{
              backgroundColor: isActive('/diets') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Diets
          </Button>
          
          <Button
            color="inherit"
            startIcon={<AssessmentIcon />}
            onClick={() => navigate('/reports')}
            sx={{
              backgroundColor: isActive('/reports') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Reports
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav 