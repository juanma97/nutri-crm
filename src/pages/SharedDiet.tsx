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
import LazyCharts from '../components/LazyCharts'
import type { Diet, DayOfWeek, DynamicMeal } from '../types'

// Función para ordenar los datos de la dieta
const getOrderedDietData = (diet: Diet) => {
  // Orden fijo de días de la semana
  const dayOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  
  // Ordenar días según el orden fijo
  const orderedDays = dayOrder.map(day => ({
    day,
    dayMeals: diet.meals[day]
  }))
  
  // Para cada día, ordenar las comidas según el orden guardado en mealDefinitions
  const orderedDaysWithMeals = orderedDays.map(({ day, dayMeals }) => {
    const orderedMeals = Object.entries(dayMeals)
      .map(([mealType, meals]) => {
        const mealDefinition = diet.mealDefinitions?.find(m => m.id === mealType)
        return {
          mealType,
          mealName: mealDefinition?.name || mealType,
          order: mealDefinition?.order || 999, // Fallback para comidas sin orden
          meals
        }
      })
      .sort((a, b) => a.order - b.order) // Ordenar por el campo 'order'
    
    return {
      day,
      dayMeals: orderedMeals
    }
  })
  
  return orderedDaysWithMeals
}

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

        {/* Objetivos Nutricionales */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            🎯 Objetivos Nutricionales
          </Typography>
          
          {diet.customGoal ? (
            // Mostrar customGoal como objetivo principal
            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <Card variant="outlined" sx={{ borderColor: '#2e7d32', borderWidth: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {diet.customGoal.calories.toLocaleString()} kcal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calorías Objetivo
                    </Typography>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                      Basado en objetivo personalizado
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {diet.customGoal.proteins}g
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Proteínas
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {diet.customGoal.carbs}g
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Carbohidratos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {diet.customGoal.fats}g
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Grasas
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {diet.customGoal.fiber}g
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fibra
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2}>
                <Card variant="outlined" sx={{ borderColor: '#666', borderWidth: 1 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      {Math.round(diet.tmb).toLocaleString()} kcal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      TMB Base
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tasa Metabólica Basal
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            // Mostrar solo TMB como objetivo
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Card variant="outlined" sx={{ borderColor: '#2e7d32', borderWidth: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {Math.round(diet.tmb).toLocaleString()} kcal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calorías Objetivo
                    </Typography>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                      Basado en TMB
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Información del Cliente */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
              <LazyCharts meals={diet.meals} tmb={diet.tmb} customGoal={diet.customGoal} />

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
          {getOrderedDietData(diet).map(({ day, dayMeals }) => (
            <Grid item xs={12} md={6} lg={4} key={day}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Typography>
                  
                  {dayMeals.map(({ mealType, mealName, meals }) => (
                    <Box key={mealType} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {mealName}
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