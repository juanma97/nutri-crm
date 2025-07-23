import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Grid,
  Paper
} from '@mui/material'
import {
  Add as AddIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

const ExampleComponent = () => {
  const theme = useTheme()

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: theme.palette.primary.main }}>
        Componente de Ejemplo - Nuevas Clases CSS
      </Typography>

      <Grid container spacing={3}>
        {/* Ejemplo de Card personalizada */}
        <Grid item xs={12} md={6}>
          <Card className="custom-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Card Personalizada
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esta card usa la clase 'custom-card' que incluye hover effects y transiciones suaves.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ejemplo de Botón personalizado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Botón Personalizado
            </Typography>
            <Button 
              variant="contained" 
              className="custom-button"
              startIcon={<AddIcon />}
            >
              Agregar Elemento
            </Button>
          </Paper>
        </Grid>

        {/* Ejemplo de Input personalizado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Input Personalizado
            </Typography>
            <TextField
              fullWidth
              label="Campo de ejemplo"
              className="custom-input"
              placeholder="Escribe algo aquí..."
            />
          </Paper>
        </Grid>

        {/* Ejemplo de Chips personalizados */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chips Personalizados
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label="Nutrición" 
                className="custom-chip"
                color="primary"
              />
              <Chip 
                label="Salud" 
                className="custom-chip"
                color="secondary"
              />
              <Chip 
                label="Bienestar" 
                className="custom-chip"
                color="success"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Ejemplo de Avatar personalizado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Avatar Personalizado
            </Typography>
            <Avatar 
              className="custom-avatar"
              sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto',
                bgcolor: theme.palette.primary.main 
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Paper>
        </Grid>

        {/* Ejemplo de Icono personalizado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Icono Personalizado
            </Typography>
            <IconButton 
              className="custom-icon"
              sx={{ 
                fontSize: 48,
                color: theme.palette.warning.main 
              }}
            >
              <StarIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>
          </Paper>
        </Grid>

        {/* Ejemplo de Loading personalizado */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loading Personalizado
            </Typography>
            <Box className="custom-loading">
              <Typography variant="body2" color="text.secondary">
                Estado de carga con estilos personalizados
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Ejemplo de Empty State */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Empty State
            </Typography>
            <Box className="empty-state">
              <FavoriteIcon />
              <Typography variant="body1">
                No hay elementos para mostrar
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Ejemplo de Success State */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Success State
            </Typography>
            <Box className="success-state">
              <StarIcon />
              <Typography variant="body1">
                Operación completada exitosamente
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Ejemplo de animaciones */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Animaciones CSS
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              variant="outlined" 
              className="fade-in"
              sx={{ mr: 2 }}
            >
              Fade In
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              className="slide-in"
              sx={{ mr: 2 }}
            >
              Slide In
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              className="pulse"
            >
              Pulse
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default ExampleComponent