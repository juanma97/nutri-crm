// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Grid
} from '@mui/material'
import { useFirebase } from '../contexts/FirebaseContext'
import DietCharts from '../components/DietCharts'
import type { Diet } from '../types'

const SharedDiet = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const { loadDietByShareId } = useFirebase()
  const [diet, setDiet] = useState<Diet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDiet = async () => {
      if (!shareId) {
        setError('ID de dieta no válido')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const dietData = await loadDietByShareId(shareId)
        
        if (dietData) {
          setDiet(dietData)
        } else {
          setError('Dieta no encontrada')
        }
      } catch (err) {
        console.error('Error loading shared diet:', err)
        setError('Error al cargar la dieta')
      } finally {
        setLoading(false)
      }
    }

    loadDiet()
  }, [shareId, loadDietByShareId])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  if (error || !diet) {
    return (
      <Box sx={{ width: '100%', py: 3, px: 3 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Dieta no encontrada'}
          </Alert>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            La dieta que buscas no existe o ha sido eliminada
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.history.back()}
            sx={{ mt: 2, backgroundColor: '#2e7d32' }}
          >
            Volver
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', py: 3, px: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              🍽️ {diet.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Dieta compartida para {diet.clientName}
            </Typography>
          </Box>
          <Chip 
            label="Dieta Compartida" 
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary">
                  {diet.tmb.toLocaleString()} cal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  TMB Objetivo
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary">
                  {new Date(diet.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Creación
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary">
                  {diet.clientData?.age || 'N/A'} años
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Edad del Cliente
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary">
                  {diet.clientData?.gender === 'male' ? 'Hombre' : 'Mujer'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Género
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Diet Charts */}
      <DietCharts meals={diet.meals} tmb={diet.tmb} />

      {/* Supplements */}
      {diet.supplements && diet.supplements.length > 0 && (
        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            💊 Suplementación
          </Typography>
          <Grid container spacing={2}>
            {diet.supplements.map((supplement) => (
              <Grid item xs={12} md={6} lg={4} key={supplement.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {supplement.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {supplement.quantity}
                      </Typography>
                    </Box>
                    {(supplement.time || supplement.comments) && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {supplement.time && (
                          <Chip 
                            label={`⏰ ${supplement.time}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                        {supplement.comments && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {supplement.comments}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Weekly Meal Plan */}
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
          📅 Plan Semanal de Comidas
        </Typography>
        
        <Grid container spacing={2}>
          {Object.entries(diet.meals).map(([day, dayMeals]) => (
            <Grid item xs={12} md={6} lg={4} key={day}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Typography>
                  
                  {Object.entries(dayMeals).map(([mealType, meals]) => (
                    <Box key={mealType} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {mealType === 'breakfast' ? '🌅 Desayuno' :
                         mealType === 'morningSnack' ? '☕ Merienda AM' :
                         mealType === 'lunch' ? '🍽️ Almuerzo' :
                         mealType === 'afternoonSnack' ? '🍎 Merienda PM' : '🌙 Cena'}
                      </Typography>
                      
                      {meals.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {meals.map((meal, index) => (
                            <Chip
                              key={index}
                              label={`${meal.foodName} (${meal.quantity}${meal.unit})`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Sin alimentos programados
                        </Typography>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Footer */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Esta dieta fue creada con NutriCRM - Sistema de Gestión Nutricional
        </Typography>
      </Paper>
    </Box>
  )
}

export default SharedDiet 