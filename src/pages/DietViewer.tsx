import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Paper, Alert } from '@mui/material'
import DietCharts from '../components/DietCharts'
import { useDietContext } from '../contexts/DietContext'
import type { Diet, DayOfWeek } from '../types'

const daysOfWeek: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
]

const mealTypes: { key: string; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'morningSnack', label: 'Morning Snack' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'afternoonSnack', label: 'Afternoon Snack' },
  { key: 'dinner', label: 'Dinner' }
]

const DietViewer = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const { getDietByShareId } = useDietContext()
  
  const [diet, setDiet] = useState<Diet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (shareId) {
      const foundDiet = getDietByShareId(shareId)
      
      if (foundDiet) {
        setDiet(foundDiet)
        setLoading(false)
      } else {
        setError('Diet not found or link is invalid')
        setLoading(false)
      }
    }
  }, [shareId, getDietByShareId])

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading diet...</Typography>
      </Box>
    )
  }

  if (error || !diet) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Diet not found'}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          The diet you're looking for doesn't exist or the link has expired.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Diet Plan - {diet.clientName}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Typography variant="subtitle2">Client:</Typography>
            <Typography variant="body1">{diet.clientName}</Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Typography variant="subtitle2">TMB:</Typography>
            <Typography variant="body1">{diet.tmb.toLocaleString()} calories</Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Typography variant="subtitle2">Created:</Typography>
            <Typography variant="body1">{diet.createdAt.toLocaleDateString()}</Typography>
          </Box>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          This is a shared diet plan. You can view the complete meal plan and nutritional analysis below.
        </Alert>
      </Paper>

      {/* Analytics */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Nutritional Analysis
        </Typography>
        <DietCharts meals={diet.meals} tmb={diet.tmb} />
      </Paper>

      {/* Weekly Meal Plan */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Weekly Meal Plan
        </Typography>
        
        {daysOfWeek.map(day => (
          <Box key={day.key} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
              {day.label}
            </Typography>
            
            {mealTypes.map(meal => {
              const mealList = diet.meals[day.key][meal.key as keyof typeof diet.meals[typeof day.key]]
              if (mealList.length === 0) return null
              
              return (
                <Box key={meal.key} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {meal.label}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {mealList.map((dietMeal, index) => (
                      <Paper key={index} elevation={1} sx={{ p: 1, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="body2">
                          {dietMeal.foodName} ({dietMeal.quantity}{dietMeal.unit})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Math.round(dietMeal.calories)} cal
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )
            })}
          </Box>
        ))}
      </Paper>
    </Box>
  )
}

export default DietViewer 