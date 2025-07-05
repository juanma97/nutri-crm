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
  InputLabel
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import type { DayOfWeek, MealType, DietMeal, Food } from '../types'

interface DietBuilderProps {
  clientName: string
  tmb: number
  onSave: (meals: any) => void
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

const mockFoods: Food[] = [
  { id: 1, name: 'Chicken Breast', group: 'Proteins', portion: '100g', calories: 165, proteins: 31, fats: 3.6, carbs: 0, fiber: 0, link: '' },
  { id: 2, name: 'Broccoli', group: 'Vegetables', portion: '100g', calories: 34, proteins: 2.8, fats: 0.4, carbs: 7, fiber: 2.6, link: '' },
  { id: 3, name: 'Rice', group: 'Grains', portion: '100g', calories: 130, proteins: 2.7, fats: 0.3, carbs: 28, fiber: 0.4, link: '' },
  { id: 4, name: 'Salmon', group: 'Proteins', portion: '100g', calories: 208, proteins: 25, fats: 12, carbs: 0, fiber: 0, link: '' }
]

const DietBuilder = ({ clientName, tmb, onSave }: DietBuilderProps) => {
  const [meals, setMeals] = useState<Record<DayOfWeek, Record<MealType, DietMeal[]>>>({
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
  const [selectedFood, setSelectedFood] = useState<number>(0)
  const [quantity, setQuantity] = useState<string>('')

  const handleAddMeal = () => {
    if (selectedFood && quantity) {
      const food = mockFoods.find(f => f.id === selectedFood)
      if (food) {
        const newMeal: DietMeal = {
          foodId: food.id,
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
        setSelectedFood(0)
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

  const handleSave = () => {
    onSave(meals)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Step 2: Build Weekly Diet
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Client: {clientName} | TMB: {Math.round(tmb)} calories
      </Typography>

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Daily Totals vs TMB</Typography>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ backgroundColor: '#2e7d32' }}
        >
          Save Diet
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {daysOfWeek.map(day => {
            const totals = calculateDailyTotals(day.key)
            const caloriesPercentage = (totals.totalCalories / tmb) * 100
            return (
              <Box key={day.key} sx={{ flex: '1 1 200px', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {day.label}
                </Typography>
                <Typography variant="body2" color={caloriesPercentage > 100 ? 'error' : 'primary'}>
                  Calories: {Math.round(totals.totalCalories)} / {Math.round(tmb)} ({Math.round(caloriesPercentage)}%)
                </Typography>
                <Typography variant="body2">
                  Proteins: {Math.round(totals.totalProteins)}g
                </Typography>
                <Typography variant="body2">
                  Fats: {Math.round(totals.totalFats)}g
                </Typography>
                <Typography variant="body2">
                  Carbs: {Math.round(totals.totalCarbs)}g
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Food to {selectedMeal}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Select Food</InputLabel>
              <Select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value as number)}
                label="Select Food"
              >
                {mockFoods.map(food => (
                  <MenuItem key={food.id} value={food.id}>
                    {food.name} ({food.portion})
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
              helperText="Enter quantity in grams, ml, or units"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMeal} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DietBuilder 