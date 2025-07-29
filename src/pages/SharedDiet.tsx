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
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { motion } from 'framer-motion'
import { useFirebase } from '../contexts/FirebaseContext'
import type { Diet, DayOfWeek } from '../types'

// Función para obtener todas las comidas únicas de la dieta
const getUniqueMeals = (diet: Diet) => {
  const allMeals = new Set<string>()
  
  Object.values(diet.meals).forEach(dayMeals => {
    Object.keys(dayMeals).forEach(mealType => {
      allMeals.add(mealType)
    })
  })
  
  // Ordenar comidas según mealDefinitions
  const orderedMeals = Array.from(allMeals).map(mealType => {
    const mealDefinition = diet.mealDefinitions?.find(m => m.id === mealType)
    return {
      id: mealType,
      name: mealDefinition?.name || mealType,
      order: mealDefinition?.order || 999
    }
  }).sort((a, b) => a.order - b.order)
  
  return orderedMeals
}

// Función para obtener el nombre del día
const getDayName = (day: DayOfWeek) => {
  const dayNames: Record<DayOfWeek, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  }
  return dayNames[day]
}

const SharedDiet = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const { loadDietByShareId } = useFirebase()
  const [diet, setDiet] = useState<Diet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const theme = useTheme()

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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        background: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
        </motion.div>
      </Box>
    )
  }

  if (error || !diet) {
    return (
      <Box sx={{ 
        width: '100%', 
        py: 3, 
        px: 3,
        background: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        minHeight: '100vh'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={0} sx={{ 
            p: 4, 
            textAlign: 'center',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 3
          }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || 'Dieta no encontrada'}
            </Alert>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              La dieta que buscas no existe o ha sido eliminada
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.history.back()}
              sx={{ 
                mt: 2, 
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              Volver
            </Button>
          </Paper>
        </motion.div>
      </Box>
    )
  }

  // Calcular calorías totales
  const totalCalories = diet.customGoal?.calories || Math.round(diet.tmb)
  
  // Obtener comidas únicas y días de la semana
  const uniqueMeals = getUniqueMeals(diet)
  const dayOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <Box sx={{ 
      width: '100%', 
      py: 3, 
      px: 3,
      background: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)',
      minHeight: '100vh'
    }}>
      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper elevation={0} sx={{ 
          p: 1, 
          mb: 1,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h3" gutterBottom sx={{ 
                color: theme.palette.primary.main, 
                fontWeight: 'bold'
              }}>
                🍽️ {diet.name}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500, fontSize: '1.5rem' }}>
                Plan nutricional para {diet.clientName}
              </Typography>
            </Box>
          </Box>

          {/* Información Principal - Calorías */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 3
          }}>
            <Card elevation={0} sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              border: 'none'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1, color: 'white', fontSize: '3rem' }}>
                  {totalCalories.toLocaleString()}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 , color: 'white'}}>
                  Calorías Diarias
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ 
              background: theme.palette.mode === 'dark' 
                ? 'rgba(18, 18, 18, 0.9)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1, fontSize: '2rem' }}>
                  {diet.clientData?.age || 'N/A'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Años
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ 
              background: theme.palette.mode === 'dark' 
                ? 'rgba(18, 18, 18, 0.9)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1, fontSize: '2rem' }}>
                  {diet.clientData?.gender === 'male' ? 'Hombre' : 'Mujer'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Género
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </motion.div>

      {/* Plan Semanal de Comidas - Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper elevation={0} sx={{ 
          p: 2,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3
        }}>
          <Typography variant="h4" gutterBottom sx={{ 
            color: theme.palette.primary.main, 
            fontWeight: 'bold',
            mb: 2
          }}>
            📅 Plan Semanal de Comidas
          </Typography>
          
          <TableContainer sx={{ 
            background: theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.1),
                    borderBottom: `2px solid ${theme.palette.primary.main}`
                  }}>
                    Comida
                  </TableCell>
                  {dayOrder.map(day => (
                    <TableCell key={day} sx={{ 
                      fontWeight: 'bold', 
                      textAlign: 'center',
                      color: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.1),
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>
                      {getDayName(day)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {uniqueMeals.map((meal) => (
                  <TableRow key={meal.id} sx={{ 
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}>
                    <TableCell sx={{ 
                      fontWeight: 'bold',
                      color: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.05)
                    }}>
                      {meal.name}
                    </TableCell>
                    {dayOrder.map(day => {
                      const dayMeals = diet.meals[day]
                      const meals = dayMeals[meal.id] || []
                      
                      return (
                        <TableCell key={day} sx={{ 
                          textAlign: 'center',
                          verticalAlign: 'top',
                          py: 2
                        }}>
                          {meals.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {meals.map((food, index) => (
                                <Chip
                                  key={index}
                                  label={`${food.foodName} (${food.quantity}${food.unit})`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    background: theme.palette.mode === 'dark' 
                                      ? 'rgba(18, 18, 18, 0.8)' 
                                      : 'rgba(255, 255, 255, 0.8)',
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ 
                              fontStyle: 'italic',
                              fontSize: '0.8rem'
                            }}>
                              -
                            </Typography>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Paper elevation={0} sx={{ 
          p: 3, 
          mt: 3, 
          textAlign: 'center',
          background: theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3
        }}>
          <Typography variant="body2" color="text.secondary">
            Esta dieta fue creada con NutriCRM - Sistema de Gestión Nutricional
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default SharedDiet 