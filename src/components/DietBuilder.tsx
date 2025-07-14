// @ts-nocheck
import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { useFirebase } from '../contexts/FirebaseContext'
import type { DayOfWeek, MealType, DietMeal, Diet, Supplement } from '../types'
import DietCharts from './DietCharts'
import SupplementForm from './SupplementForm'

interface DietBuilderProps {
  tmb: number
  onSave: (meals: Diet['meals'], supplements?: Supplement[]) => Promise<void>
  onBack?: () => void
  initialMeals?: Diet['meals']
  initialSupplements?: Supplement[]
  dietName?: string
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

const DietBuilder = ({ tmb, onSave, onBack, initialMeals, initialSupplements, dietName }: DietBuilderProps) => {
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
  
  const [supplements, setSupplements] = useState<Supplement[]>(initialSupplements || [])
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday')
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast')
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar alimentos basado en el término de búsqueda
  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función helper para calcular el factor de conversión basado en la porción del alimento
  const calculateConversionFactor = (food: any, quantity: number): number => {
    // Extraer el valor numérico de la porción (ej: "100" de "100g", "1" de "1 unit")
    const portionValue = parseFloat(food.portion.replace(/[^\d.]/g, '')) || 1
    return quantity / portionValue
  }

  // Función helper para formatear las calorías con la porción y unidad correcta
  const formatCaloriesWithPortion = (food: any): string => {
    const calories = food.calories || 0
    const portion = food.portion || '1'
    const unit = food.unitOfMeasure || 'unit'
    
    // Extraer solo el número de la porción (ej: "100" de "100g")
    const portionValue = parseFloat(portion.replace(/[^\d.]/g, '')) || 1
    
    return `${calories} kcal / ${portionValue} ${unit}`
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
        // Calcular el factor de conversión basado en la porción del alimento
        const conversionFactor = calculateConversionFactor(food, Number(quantity))
        
        const newMeal: DietMeal = {
          foodId: parseInt(food.id),
          foodName: food.name,
          quantity: Number(quantity),
          unit: food.unitOfMeasure || 'unit',
          calories: food.calories * conversionFactor,
          proteins: food.proteins * conversionFactor,
          fats: food.fats * conversionFactor,
          carbs: food.carbs * conversionFactor,
          fiber: food.fiber * conversionFactor
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
        setSearchTerm('')
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
    // Validar que todos los suplementos tengan nombre y cantidad
    const invalidSupplements = supplements.filter(s => 
      s.name.trim() === '' || s.quantity.trim() === ''
    )
    
    if (invalidSupplements.length > 0) {
      alert('Por favor completa todos los campos obligatorios de los suplementos (nombre y cantidad)')
      return
    }
    
    setSaving(true)
    try {
      await onSave(meals, supplements)
    } catch (error) {
      console.error('Error saving diet:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddSupplement = () => {
    const newSupplement: Supplement = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      time: '',
      comments: ''
    }
    setSupplements([...supplements, newSupplement])
  }

  const handleUpdateSupplement = (index: number, updatedSupplement: Supplement) => {
    const updatedSupplements = [...supplements]
    updatedSupplements[index] = updatedSupplement
    setSupplements(updatedSupplements)
  }

  const handleDeleteSupplement = (index: number) => {
    const updatedSupplements = supplements.filter((_, i) => i !== index)
    setSupplements(updatedSupplements)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Step 2: Build Weekly Diet
      </Typography>
      {dietName && (
        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
          {dietName}
        </Typography>
      )}
      <Typography variant="body1" sx={{ mb: 3 }}>
        TMB: {Math.round(tmb)} calories
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Meal Builder" />
          <Tab label="Suplementación" />
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
                                label={`${dietMeal.foodName} (${dietMeal.quantity} ${dietMeal.unit})`}
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
                                setSelectedFood('')
                                setSearchTerm('')
                                setQuantity('')
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
                      color={status.color as 'error' | 'warning' | 'success'}
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
        </>
      )}

      {activeTab === 1 && (
        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Suplementación
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddSupplement}
                sx={{ backgroundColor: '#2e7d32' }}
              >
                Agregar Suplemento
              </Button>
            </Box>
            
            {supplements.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No hay suplementos agregados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Haz clic en "Agregar Suplemento" para comenzar
                </Typography>
              </Box>
            ) : (
              <Box>
                {supplements.map((supplement, index) => (
                  <SupplementForm
                    key={supplement.id}
                    supplement={supplement}
                    onUpdate={(updatedSupplement) => handleUpdateSupplement(index, updatedSupplement)}
                    onDelete={() => handleDeleteSupplement(index)}
                    index={index}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {activeTab === 2 && (
        <DietCharts meals={meals} tmb={tmb} />
      )}

      {/* Global Action Buttons - Available in all tabs */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 4,
        gap: 2,
        flexWrap: 'wrap'
      }}>
        {onBack && (
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ minWidth: '120px' }}
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ 
            backgroundColor: '#2e7d32',
            minWidth: '140px'
          }}
        >
          {saving ? 'Saving...' : 'Save Diet'}
        </Button>
      </Box>

      {/* Add Food Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { maxHeight: '80vh' }
        }}
      >
        <DialogTitle>Add Food to {mealTypes.find(m => m.key === selectedMeal)?.label}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Search Foods"
              placeholder="Type to search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {!selectedFood ? (
              <Box>
                {filteredFoods.length > 0 ? (
                  <List>
                    {filteredFoods.map(food => (
                      <ListItem key={food.id} disablePadding>
                        <ListItemButton 
                          onClick={() => setSelectedFood(food.id)}
                          sx={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 1, 
                            mb: 1,
                            '&:hover': { backgroundColor: '#f5f5f5' }
                          }}
                        >
                          <ListItemText 
                            primary={food.name}
                            secondary={`${food.group} - ${formatCaloriesWithPortion(food)}`}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    {searchTerm ? 'No foods found matching your search' : 'Start typing to search foods'}
                  </Typography>
                )}
              </Box>
            ) : (
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    Selected Food: {foods.find(f => f.id === selectedFood)?.name}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => {
                      setSelectedFood('')
                      setSearchTerm('')
                    }}
                  >
                    Change
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  helperText={`Enter quantity in ${foods.find(f => f.id === selectedFood)?.unitOfMeasure || 'unit'}`}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false)
            setSelectedFood('')
            setSearchTerm('')
            setQuantity('')
          }}>
            Cancel
          </Button>
          {selectedFood && (
            <Button onClick={handleAddMeal} variant="contained" disabled={!quantity}>
              Add Food
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DietBuilder 