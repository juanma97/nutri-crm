import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'

const TopNav = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
      <Toolbar>
        <RestaurantIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NutriCRM
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit">Foods</Button>
          <Button color="inherit">Diets</Button>
          <Button color="inherit">Clients</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav 