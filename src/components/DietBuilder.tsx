import React, { useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { DayOfWeek, MealType, DietMeal, Food, Diet } from '../types'
import { useFirebase } from '../contexts/FirebaseContext'
import DietCharts from './DietCharts'

interface DietBuilderProps {
  tmb: number
  onSave: (meals: Diet['meals']) => Promise<void>
  initialMeals?: Diet['meals']
}

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

const DietBuilder = ({ tmb, onSave, initialMeals }: DietBuilderProps) => {
  const { foods } = useFirebase()
  
  const [meals, setMeals] = useState<Diet['meals']>(initialMeals || {
    monday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    tuesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    wednesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    thursday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    friday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    saturday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    sunday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] }
  })
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday')
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast')
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)

  const calculateDailyTotals = (day: DayOfWeek) => {
    const dayMeals = meals[day]
    let totalCalories = 0
    let totalProteins = 0
    let totalFats = 0
    let totalCarbs = 0
    let totalFiber = 0

    Object.values(dayMeals).forEach(mealList => {
      mealList.forEach(meal => {
        totalCalories += meal.calories
        totalProteins += meal.proteins
        totalFats += meal.fats
        totalCarbs += meal.carbs
        totalFiber += meal.fiber
      })
    })

    return { totalCalories, totalProteins, totalFats, totalCarbs, totalFiber }
  }

  const getCaloriesStatus = (calories: number) => {
    const percentage = (calories / tmb) * 100
    if (percentage < 70) return { color: 'error', status: 'Necesita más alimentos' }
    if (percentage < 90) return { color: 'warning', status: 'Casi completo' }
    if (percentage <= 110) return { color: 'success', status: 'Óptimo' }
    return { color: 'error', status: 'Excede TMB' }
  }

  const handleAddMeal = () => {
    if (selectedFood && quantity) {
      const food = foods.find(f => f.id === selectedFood)
      if (food) {
        const newMeal: DietMeal = {
          foodId: parseInt(food.id),
          foodName: food.name,
          quantity: Number(quantity),
          unit: food.portion.includes('g') ? 'g' : food.portion.includes('ml') ? 'ml' : 'unit',
          calories: (food.calories * Number(quantity)) / 100,
          proteins: (food.proteins * Number(quantity)) / 100,
          fats: (food.fats * Number(quantity)) / 100,
          carbs: (food.carbs * Number(quantity)) / 100,
          fiber: (food.fiber * Number(quantity)) / 100
        }

        setMeals(prev => ({
          ...prev,
          [selectedDay]: {
            ...prev[selectedDay],
            [selectedMeal]: [...prev[selectedDay][selectedMeal], newMeal]
          }
        }))

        setDialogOpen(false)
        setSelectedFood('')
        setQuantity('')
      }
    }
  }

  const handleRemoveMeal = (day: DayOfWeek, meal: MealType, index: number) => {
    setMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: prev[day][meal].filter((_, i) => i !== index)
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(meals)
    } catch (error) {
      console.error('Error saving diet:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Step 2: Build Weekly Diet
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        TMB: {Math.round(tmb)} calories
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Meal Builder" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Paper elevation={3} sx={{ mb: 3 }}>
            <TableContainer>
              <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ width: '120px' }}>Meal</TableCell>
                    {daysOfWeek.map(day => (
                      <TableCell key={day.key} align="center" sx={{ minWidth: '140px' }}>
                        {day.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mealTypes.map(meal => (
                    <TableRow key={meal.key}>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                        {meal.label}
                      </TableCell>
                      {daysOfWeek.map(day => (
                        <TableCell key={`${day.key}-${meal.key}`} align="center">
                          <Box sx={{ minHeight: '60px', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {meals[day.key][meal.key].map((dietMeal, index) => (
                              <Chip
                                key={index}
                                label={`${dietMeal.foodName} (${dietMeal.quantity}${dietMeal.unit})`}
                                size="small"
                                onDelete={() => handleRemoveMeal(day.key, meal.key, index)}
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedDay(day.key)
                                setSelectedMeal(meal.key)
                                setDialogOpen(true)
                              }}
                              sx={{ alignSelf: 'center' }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Daily Progress Summary */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Progress Summary
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {daysOfWeek.map(day => {
                const totals = calculateDailyTotals(day.key)
                const status = getCaloriesStatus(totals.totalCalories)
                return (
                  <Box key={day.key} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {day.label}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((totals.totalCalories / tmb) * 100, 120)}
                      color={status.color as any}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color={status.color}>
                      {status.status} - {Math.round(totals.totalCalories)} cal
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" display="block">
                        P: {Math.round(totals.totalProteins)}g | F: {Math.round(totals.totalFats)}g | C: {Math.round(totals.totalCarbs)}g
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined">
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{ backgroundColor: '#2e7d32' }}
            >
              {saving ? 'Saving...' : 'Save Diet'}
            </Button>
          </Box>
        </>
      )}

      {activeTab === 1 && (
        <DietCharts meals={meals} tmb={tmb} />
      )}

      {/* Add Food Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Food to {mealTypes.find(m => m.key === selectedMeal)?.label}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Food</InputLabel>
              <Select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                label="Select Food"
              >
                {foods.map(food => (
                  <MenuItem key={food.id} value={food.id}>
                    {food.name} ({food.group}) - {food.calories} cal/100g
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              helperText="Enter quantity in grams"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMeal} variant="contained">
            Add Food
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DietBuilder 