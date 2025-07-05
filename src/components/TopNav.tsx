import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import RestaurantIcon from '@mui/icons-material/Restaurant'

const TopNav = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/foods' && location.pathname === '/')
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
      <Toolbar>
        <RestaurantIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NutriCRM
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/foods"
            sx={{ 
              backgroundColor: isActive('/foods') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Foods
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/diets"
            sx={{ 
              backgroundColor: isActive('/diets') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Diets
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav 