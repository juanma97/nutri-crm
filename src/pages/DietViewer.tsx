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
import type { Diet } from '../types'

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const mealNames = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner']

const DietViewer = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const { getDietByShareId, loadingDiets } = useFirebase()
  const navigate = useNavigate()
  const [diet, setDiet] = useState<Diet | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (shareId && !loadingDiets) {
      const foundDiet = getDietByShareId(shareId)
      if (foundDiet) {
        setDiet(foundDiet)
      } else {
        setNotFound(true)
      }
    }
  }, [shareId, getDietByShareId, loadingDiets])

  const calculateDayCalories = (dayMeals: any[]) => {
    return dayMeals.reduce((total, meal) => {
      return total + meal.foods.reduce((mealTotal: number, food: any) => {
        return mealTotal + (food.calories * food.quantity / 100)
      }, 0)
    }, 0)
  }

  if (loadingDiets) {
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
          <Chip label={`Total Calories: ${Math.round(calculateDayCalories(diet.meals[0]))} cal`} color="secondary" />
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
        <DietCharts diet={diet} />
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
                {mealNames.map(meal => (
                  <TableCell key={meal}>{meal}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {diet.meals.map((dayMeals, dayIndex) => (
                <TableRow key={dayIndex}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {dayNames[dayIndex]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(calculateDayCalories(dayMeals))} cal
                    </Typography>
                  </TableCell>
                  {dayMeals.map((meal, mealIndex) => (
                    <TableCell key={mealIndex}>
                      {meal.foods.length > 0 ? (
                        <Box>
                          {meal.foods.map((food, foodIndex) => (
                            <Box key={foodIndex} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {food.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {food.quantity}g - {Math.round(food.calories * food.quantity / 100)} cal
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