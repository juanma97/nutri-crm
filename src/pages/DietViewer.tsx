import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useFirebase } from '../contexts/FirebaseContext'
import DietCharts from '../components/DietCharts'
import type { Diet, DayOfWeek, MealType } from '../types'

const daysOfWeek: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
]

const mealTypes: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'morningSnack', label: 'Morning Snack' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'afternoonSnack', label: 'Afternoon Snack' },
  { key: 'dinner', label: 'Dinner' }
]

const DietViewer = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const { loadDietByShareId } = useFirebase()
  const navigate = useNavigate()
  const [diet, setDiet] = useState<Diet | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDiet = async () => {
      if (shareId) {
        setLoading(true)
        const foundDiet = await loadDietByShareId(shareId)
        if (foundDiet) {
          setDiet(foundDiet)
        } else {
          setNotFound(true)
        }
        setLoading(false)
      }
    }

    loadDiet()
  }, [shareId, loadDietByShareId])

  const calculateDayCalories = (day: DayOfWeek) => {
    if (!diet) return 0
    const dayMeals = diet.meals[day]
    let totalCalories = 0

    Object.values(dayMeals).forEach(mealList => {
      mealList.forEach(meal => {
        totalCalories += meal.calories
      })
    })

    return totalCalories
  }

  const calculateTotalCalories = () => {
    if (!diet) return 0
    let total = 0
    daysOfWeek.forEach(day => {
      total += calculateDayCalories(day.key)
    })
    return total
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  if (notFound) {
    return (
      <Box sx={{ width: '100%', px: 3, py: 3 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Diet not found
            </Typography>
            <Typography variant="body2">
              The diet you're looking for doesn't exist or the link is invalid.
            </Typography>
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ backgroundColor: '#2e7d32' }}
          >
            Go Home
          </Button>
        </Paper>
      </Box>
    )
  }

  if (!diet) {
    return null
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#2e7d32' }}>
          {diet.clientName}'s Diet Plan
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Chip label={`TMB: ${diet.tmb} cal`} color="primary" />
          <Chip label={`Total Calories: ${Math.round(calculateTotalCalories())} cal`} color="secondary" />
        </Box>
        <Typography variant="body1" color="text.secondary">
          This is your personalized nutrition plan. Follow it daily for optimal results.
        </Typography>
      </Paper>

      {/* Charts */}
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Nutrition Analysis
        </Typography>
        <DietCharts meals={diet.meals} tmb={diet.tmb} />
      </Paper>

      {/* Weekly Plan */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Weekly Meal Plan
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Day</TableCell>
                {mealTypes.map(meal => (
                  <TableCell key={meal.key}>{meal.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {daysOfWeek.map(day => (
                <TableRow key={day.key}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {day.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(calculateDayCalories(day.key))} cal
                    </Typography>
                  </TableCell>
                  {mealTypes.map(meal => (
                    <TableCell key={meal.key}>
                      {diet.meals[day.key][meal.key].length > 0 ? (
                        <Box>
                          {diet.meals[day.key][meal.key].map((dietMeal, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {dietMeal.foodName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {dietMeal.quantity}{dietMeal.unit} - {Math.round(dietMeal.calories)} cal
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No foods added
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Footer */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          This diet plan was created by your nutritionist using NutriCRM.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          For questions or modifications, please contact your nutritionist.
        </Typography>
      </Paper>
    </Box>
  )
}

export default DietViewer 