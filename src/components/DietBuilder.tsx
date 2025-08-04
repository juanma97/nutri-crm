// @ts-nocheck
import React, { useState } from 'react'
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
  ListItemButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import NutritionIcon from '@mui/icons-material/MonitorWeight'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import SettingsIcon from '@mui/icons-material/Settings'
import { motion } from 'framer-motion'
import { useFirebase } from '../contexts/FirebaseContext'
import type { DayOfWeek, MealType, DietMeal, Diet, Supplement, DynamicMeal, DynamicDayMeals, CustomGoal } from '../types'
import DietCharts from './DietCharts'
import SupplementForm from './SupplementForm'
import CustomGoalForm from './CustomGoalForm'

interface DietBuilderProps {
  tmb?: number // Opcional para plantillas
  onSave: (meals: Diet['meals'], supplements?: Supplement[], mealDefinitions?: DynamicMeal[], customGoal?: CustomGoal) => Promise<void>
  onBack?: () => void
  initialMeals?: Diet['meals']
  initialSupplements?: Supplement[]
  initialMealDefinitions?: DynamicMeal[]
  initialCustomGoal?: CustomGoal
  dietName?: string
  isTemplate?: boolean // Flag para identificar si es una plantilla
}

const daysOfWeek: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
]

const mealTypes: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: 'Desayuno' },
  { key: 'morningSnack', label: 'Media mañana' },
  { key: 'lunch', label: 'Comida' },
  { key: 'afternoonSnack', label: 'Merienda' },
  { key: 'dinner', label: 'Cena' }
]

const DietBuilder = ({ tmb, onSave, onBack, initialMeals, initialSupplements, initialMealDefinitions, initialCustomGoal, dietName, isTemplate = false }: DietBuilderProps) => {
  const theme = useTheme()
  const { foods } = useFirebase()
  
  // Comidas por defecto para migración
  const defaultMeals: DynamicMeal[] = [
    { id: 'breakfast', name: 'Desayuno', order: 1 },
    { id: 'morningSnack', name: 'Media mañana', order: 2 },
    { id: 'lunch', name: 'Comida', order: 3 },
    { id: 'afternoonSnack', name: 'Merienda', order: 4 },
    { id: 'dinner', name: 'Cena', order: 5 }
  ]

  // Estado inicial dinámico
  const [mealDefinitions, setMealDefinitions] = useState<DynamicMeal[]>(
    initialMealDefinitions || defaultMeals
  )

  // Inicializar comidas por defecto si no hay datos iniciales
  React.useEffect(() => {
    if (!initialMeals) {
      setMeals(prev => {
        const updated = { ...prev }
        daysOfWeek.forEach(day => {
          updated[day.key] = {}
          defaultMeals.forEach(meal => {
            updated[day.key][meal.id] = []
          })
        })
        return updated
      })
    }
  }, [initialMeals])
  
  const [meals, setMeals] = useState<Diet['meals']>(initialMeals || {
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {},
    sunday: {}
  })
  
  const [supplements, setSupplements] = useState<Supplement[]>(initialSupplements || [])
  const [customGoal, setCustomGoal] = useState<CustomGoal | undefined>(initialCustomGoal)
  const [showCustomGoalForm, setShowCustomGoalForm] = useState(false)
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday')
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast')
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingMealId, setEditingMealId] = useState<string | null>(null)
  const [editingMealName, setEditingMealName] = useState('')

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

    // Iterar sobre todas las comidas dinámicas
    Object.values(dayMeals).forEach(mealList => {
      if (Array.isArray(mealList)) {
        mealList.forEach(meal => {
          totalCalories += meal.calories
          totalProteins += meal.proteins
          totalFats += meal.fats
          totalCarbs += meal.carbs
          totalFiber += meal.fiber
        })
      }
    })

    return { totalCalories, totalProteins, totalFats, totalCarbs, totalFiber }
  }

  // Obtener objetivos nutricionales (customGoal o basados en TMB)
  const getCalorieTarget = () => {
    if (customGoal) return customGoal.calories
    if (tmb) return tmb
    return 2000 // Valor por defecto para plantillas sin TMB
  }

  const getProteinTarget = () => {
    if (customGoal) return customGoal.proteins
    if (tmb) return (tmb * 0.3 / 4)
    return 150 // Valor por defecto para plantillas sin TMB
  }

  const getFatTarget = () => {
    if (customGoal) return customGoal.fats
    if (tmb) return (tmb * 0.25 / 9)
    return 55 // Valor por defecto para plantillas sin TMB
  }

  const getCarbTarget = () => {
    if (customGoal) return customGoal.carbs
    if (tmb) return (tmb * 0.45 / 4)
    return 225 // Valor por defecto para plantillas sin TMB
  }

  const getFiberTarget = () => {
    if (customGoal) return customGoal.fiber
    if (tmb) return 25 // Valor recomendado por defecto cuando hay TMB
    return 0 // Sin valor por defecto para plantillas sin TMB
  }

  // Función helper para obtener el color de estado basado en el porcentaje
  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return theme.palette.error.main
    if (percentage < 90) return theme.palette.warning.main
    if (percentage <= 110) return theme.palette.success.main
    return theme.palette.error.main
  }

  // Función para obtener el estado detallado de un nutriente
  const getNutrientStatus = (current: number, target: number, nutrientName: string) => {
    const percentage = (current / target) * 100
    const deficit = target - current
    const excess = current - target
    
    if (percentage < 70) {
      return {
        status: 'Deficiente',
        message: `Faltan ${Math.abs(deficit).toFixed(1)}g de ${nutrientName}`,
        color: 'error',
        icon: '⚠️'
      }
    } else if (percentage < 90) {
      return {
        status: 'Casi completo',
        message: `Faltan ${Math.abs(deficit).toFixed(1)}g de ${nutrientName}`,
        color: 'warning',
        icon: '📊'
      }
    } else if (percentage <= 110) {
      return {
        status: 'Óptimo',
        message: `${nutrientName} en rango ideal`,
        color: 'success',
        icon: '✅'
      }
    } else {
      return {
        status: 'Excede',
        message: `Excede en ${excess.toFixed(1)}g de ${nutrientName}`,
        color: 'error',
        icon: '⚠️'
      }
    }
  }

  const getCaloriesStatus = (calories: number) => {
    const target = getCalorieTarget()
    const percentage = (calories / target) * 100
    if (percentage < 70) return { color: 'error', status: 'Necesita más alimentos' }
    if (percentage < 90) return { color: 'warning', status: 'Casi completo' }
    if (percentage <= 110) return { color: 'success', status: 'Óptimo' }
    return { color: 'error', status: 'Excede objetivo' }
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
            [selectedMeal]: [...(prev[selectedDay][selectedMeal] || []), newMeal]
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
        [meal]: (prev[day][meal] || []).filter((_, i) => i !== index)
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
      await onSave(meals, supplements, mealDefinitions, customGoal)
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

  const addMeal = () => {
    const newMeal: DynamicMeal = {
      id: `meal_${Date.now()}`,
      name: 'New Meal',
      order: mealDefinitions.length + 1
    }
    setMealDefinitions([...mealDefinitions, newMeal])
    
    // Agregar a todos los días
    setMeals(prev => {
      const updated = { ...prev }
      daysOfWeek.forEach(day => {
        updated[day.key] = { ...updated[day.key], [newMeal.id]: [] }
      })
      return updated
    })
  }

  const removeMeal = (mealId: string) => {
    setMealDefinitions(prev => prev.filter(m => m.id !== mealId))
    
    // Remover de todos los días
    setMeals(prev => {
      const updated = { ...prev }
      daysOfWeek.forEach(day => {
        const { [mealId]: removed, ...rest } = updated[day.key]
        updated[day.key] = rest
      })
      return updated
    })
  }

  const handleEditMeal = (mealId: string) => {
    const meal = mealDefinitions.find(m => m.id === mealId)
    if (meal) {
      setEditingMealId(mealId)
      setEditingMealName(meal.name)
    }
  }

  const handleSaveMealName = () => {
    if (editingMealId && editingMealName.trim()) {
      setMealDefinitions(prev => 
        prev.map(meal => 
          meal.id === editingMealId 
            ? { ...meal, name: editingMealName.trim() }
            : meal
        )
      )
      setEditingMealId(null)
      setEditingMealName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingMealId(null)
    setEditingMealName('')
  }

  const handleCustomGoalSave = (newCustomGoal: CustomGoal | undefined) => {
    setCustomGoal(newCustomGoal)
    setShowCustomGoalForm(false)
  }

  const handleCustomGoalCancel = () => {
    setShowCustomGoalForm(false)
  }

  return (
    <Box sx={{ 
      width: '100%',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
      minHeight: '100vh',
      py: 3,
      px: 2
    }}>
      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <RestaurantIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
            </motion.div>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: '-0.01em'
              }}
            >
              Constructor de Dieta Semanal
            </Typography>
          </Box>
          
          {dietName && (
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                color: theme.palette.text.secondary,
                fontWeight: 500
              }}
            >
              {dietName}
            </Typography>
          )}
        </Box>
      </motion.div>
      {/* Información de Objetivos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <NutritionIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Objetivos Nutricionales
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    🔥 TMB: {Math.round(tmb).toLocaleString()} calorías
                  </Typography>
                  {customGoal ? (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        ⭐ Objetivo personalizado: {Math.round(customGoal.calories).toLocaleString()} calorías
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Chip label={`P: ${Math.round(customGoal.proteins)}g`} size="small" color="primary" />
                        <Chip label={`C: ${Math.round(customGoal.carbs)}g`} size="small" color="secondary" />
                        <Chip label={`F: ${Math.round(customGoal.fats)}g`} size="small" color="info" />
                        <Chip label={`Fibra: ${Math.round(customGoal.fiber)}g`} size="small" color="success" />
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Objetivos basados en TMB:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Chip label={`P: ${Math.round(tmb * 0.3 / 4)}g`} size="small" color="primary" />
                        <Chip label={`C: ${Math.round(tmb * 0.45 / 4)}g`} size="small" color="secondary" />
                        <Chip label={`F: ${Math.round(tmb * 0.25 / 9)}g`} size="small" color="info" />
                        <Chip label={`Fibra: 25g`} size="small" color="success" />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                startIcon={<SettingsIcon />}
                onClick={() => setShowCustomGoalForm(true)}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                  '&:focus': {
                    outline: 'none',
                  }
                }}
              >
                {customGoal ? 'Editar Objetivos' : 'Configurar Objetivos'}
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>

      {/* Pestañas de Navegación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 64,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
                '&:focus': {
                  outline: 'none',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RestaurantIcon />
                  Constructor de Comidas
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NutritionIcon />
                  Suplementación
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon />
                  Análisis
                </Box>
              } 
            />
          </Tabs>
        </Paper>
      </motion.div>

      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              mb: 4,
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              p: 3, 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <RestaurantIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Horario de Comidas
                </Typography>
              </Box>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addMeal}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-1px)',
                    },
                    '&:focus': {
                      outline: 'none',
                    }
                  }}
                >
                  Agregar Comida
                </Button>
              </motion.div>
            </Box>
            <TableContainer>
              <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ 
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                    '& th': {
                      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }
                  }}>
                    <TableCell sx={{ 
                      width: '200px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Comida
                    </TableCell>
                    {daysOfWeek.map(day => (
                      <TableCell key={day.key} align="center" sx={{ 
                        minWidth: '140px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {day.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mealDefinitions.map((meal, index) => (
                    <TableRow 
                      key={meal.id}
                      sx={{ 
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha(theme.palette.background.default, 0.3)
                        },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          transition: 'background-color 0.3s ease'
                        }
                      }}
                    >
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        fontSize: '0.9rem'
                      }}>
                        {editingMealId === meal.id ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                              size="small"
                              value={editingMealName}
                              onChange={(e) => setEditingMealName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveMealName()}
                              autoFocus
                              sx={{ 
                                minWidth: '120px',
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1.5,
                                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                  }
                                }
                              }}
                            />
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.3,
                              flexShrink: 0
                            }}>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <IconButton 
                                  size="small" 
                                  onClick={handleSaveMealName}
                                  sx={{ 
                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                    color: theme.palette.success.main,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                    width: 20,
                                    height: 20,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.success.main, 0.2),
                                      transform: 'scale(1.1)',
                                    },
                                    '&:focus': {
                                      outline: 'none',
                                    }
                                  }}
                                >
                                  <SaveIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <IconButton 
                                  size="small" 
                                  onClick={handleCancelEdit}
                                  sx={{ 
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    color: theme.palette.error.main,
                                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                    width: 20,
                                    height: 20,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                                      transform: 'scale(1.1)',
                                    },
                                    '&:focus': {
                                      outline: 'none',
                                    }
                                  }}
                                >
                                  <CancelIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                              </motion.div>
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            width: '100%'
                          }}>
                            <Tooltip 
                              title={meal.name}
                              placement="top"
                              arrow
                              sx={{
                                '& .MuiTooltip-tooltip': {
                                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                  color: theme.palette.text.primary,
                                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  borderRadius: 2,
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                  backdropFilter: 'blur(8px)'
                                },
                                '& .MuiTooltip-arrow': {
                                  color: alpha(theme.palette.background.paper, 0.95)
                                }
                              }}
                            >
                              <Typography sx={{ 
                                fontWeight: 600, 
                                color: theme.palette.text.primary,
                                flex: 1,
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                pr: 1,
                                cursor: 'help'
                              }}>
                                {meal.name}
                              </Typography>
                            </Tooltip>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.3,
                              flexShrink: 0
                            }}>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditMeal(meal.id)}
                                  sx={{ 
                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                    color: theme.palette.info.main,
                                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                    width: 20,
                                    height: 20,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.info.main, 0.2),
                                      transform: 'scale(1.1)',
                                    },
                                    '&:focus': {
                                      outline: 'none',
                                    }
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <IconButton 
                                  size="small" 
                                  onClick={() => removeMeal(meal.id)}
                                  sx={{ 
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    color: theme.palette.error.main,
                                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                    width: 20,
                                    height: 20,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                                      transform: 'scale(1.1)',
                                    },
                                    '&:focus': {
                                      outline: 'none',
                                    }
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                              </motion.div>
                            </Box>
                          </Box>
                        )}
                      </TableCell>
                      {daysOfWeek.map(day => (
                        <TableCell key={`${day.key}-${meal.id}`} align="center" sx={{ 
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          minHeight: '80px',
                          verticalAlign: 'top',
                          p: 1
                        }}>
                          <Box sx={{ 
                            minHeight: '80px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 1,
                            alignItems: 'center'
                          }}>
                            {(meals[day.key][meal.id] || []).map((dietMeal, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Chip
                                  label={`${dietMeal.foodName} (${dietMeal.quantity} ${dietMeal.unit})`}
                                  size="small"
                                  onDelete={() => handleRemoveMeal(day.key, meal.id, index)}
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                    },
                                    '& .MuiChip-deleteIcon': {
                                      color: theme.palette.error.main,
                                      '&:hover': {
                                        color: theme.palette.error.dark,
                                      }
                                    }
                                  }}
                                />
                              </motion.div>
                            ))}
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedDay(day.key)
                                  setSelectedMeal(meal.id)
                                  setSelectedFood('')
                                  setSearchTerm('')
                                  setQuantity('')
                                  setDialogOpen(true)
                                }}
                                sx={{ 
                                  alignSelf: 'center',
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    transform: 'scale(1.1)',
                                  },
                                  '&:focus': {
                                    outline: 'none',
                                  }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </motion.div>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  
                  {/* Fila de Resumen Diario */}
                  <TableRow sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }}>
                    <TableCell sx={{ 
                      fontWeight: 700,
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      fontSize: '0.85rem',
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      📊 Resumen
                    </TableCell>
                    {daysOfWeek.map(day => {
                      const totals = calculateDailyTotals(day.key)
                      const caloriePercentage = Math.min((totals.totalCalories / getCalorieTarget()) * 100, 120)
                      const proteinPercentage = Math.min((totals.totalProteins / getProteinTarget()) * 100, 120)
                      const fatPercentage = Math.min((totals.totalFats / getFatTarget()) * 100, 120)
                      const carbPercentage = Math.min((totals.totalCarbs / getCarbTarget()) * 100, 120)
                      
                      return (
                        <TableCell key={day.key} sx={{ 
                          p: 2,
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          borderRadius: 1,
                          borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {/* Calorías */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ 
                                fontWeight: 600, 
                                fontSize: '0.7rem',
                                color: theme.palette.text.secondary,
                                minWidth: '45px'
                              }}>
                                🔥 {Math.round(totals.totalCalories)}
                              </Typography>
                              <Box sx={{ flex: 1, position: 'relative' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={caloriePercentage}
                                  sx={{ 
                                    height: 4, 
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: getProgressColor(caloriePercentage)
                                    }
                                  }}
                                />
                                <Typography variant="caption" sx={{ 
                                  position: 'absolute',
                                  top: '-2px',
                                  right: '0',
                                  fontSize: '0.6rem',
                                  fontWeight: 600,
                                  color: getProgressColor(caloriePercentage)
                                }}>
                                  {caloriePercentage.toFixed(0)}%
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Proteínas */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="caption" sx={{ 
                                fontWeight: 600, 
                                fontSize: '0.65rem',
                                color: theme.palette.text.secondary,
                                minWidth: '35px'
                              }}>
                                P: {Math.round(totals.totalProteins)}
                              </Typography>
                              <Box sx={{ flex: 1, position: 'relative' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={proteinPercentage}
                                  sx={{ 
                                    height: 3, 
                                    borderRadius: 1.5,
                                    backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: getProgressColor(proteinPercentage)
                                    }
                                  }}
                                />
                                <Typography variant="caption" sx={{ 
                                  position: 'absolute',
                                  top: '-1px',
                                  right: '0',
                                  fontSize: '0.55rem',
                                  fontWeight: 600,
                                  color: getProgressColor(proteinPercentage)
                                }}>
                                  {proteinPercentage.toFixed(0)}%
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Carbohidratos */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="caption" sx={{ 
                                fontWeight: 600, 
                                fontSize: '0.65rem',
                                color: theme.palette.text.secondary,
                                minWidth: '35px'
                              }}>
                                C: {Math.round(totals.totalCarbs)}
                              </Typography>
                              <Box sx={{ flex: 1, position: 'relative' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={carbPercentage}
                                  sx={{ 
                                    height: 3, 
                                    borderRadius: 1.5,
                                    backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: getProgressColor(carbPercentage)
                                    }
                                  }}
                                />
                                <Typography variant="caption" sx={{ 
                                  position: 'absolute',
                                  top: '-1px',
                                  right: '0',
                                  fontSize: '0.55rem',
                                  fontWeight: 600,
                                  color: getProgressColor(carbPercentage)
                                }}>
                                  {carbPercentage.toFixed(0)}%
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Grasas */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ 
                                fontWeight: 600, 
                                fontSize: '0.65rem',
                                color: theme.palette.text.secondary,
                                minWidth: '35px'
                              }}>
                                G: {Math.round(totals.totalFats)}
                              </Typography>
                              <Box sx={{ flex: 1, position: 'relative' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={fatPercentage}
                                  sx={{ 
                                    height: 3, 
                                    borderRadius: 1.5,
                                    backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: getProgressColor(fatPercentage)
                                    }
                                  }}
                                />
                                <Typography variant="caption" sx={{ 
                                  position: 'absolute',
                                  top: '-1px',
                                  right: '0',
                                  fontSize: '0.55rem',
                                  fontWeight: 600,
                                  color: getProgressColor(fatPercentage)
                                }}>
                                  {fatPercentage.toFixed(0)}%
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>



          {/* Weekly Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3 
              }}>
                <AnalyticsIcon sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: 28
                }} />
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}>
                  Resumen Semanal
                </Typography>
              </Box>

              {(() => {
                // Calcular promedios semanales
                const weeklyTotals = daysOfWeek.reduce((acc, day) => {
                  const totals = calculateDailyTotals(day.key)
                  return {
                    calories: acc.calories + totals.totalCalories,
                    proteins: acc.proteins + totals.totalProteins,
                    fats: acc.fats + totals.totalFats,
                    carbs: acc.carbs + totals.totalCarbs,
                    fiber: acc.fiber + totals.totalFiber
                  }
                }, { calories: 0, proteins: 0, fats: 0, carbs: 0, fiber: 0 })

                const weeklyAverages = {
                  calories: weeklyTotals.calories / 7,
                  proteins: weeklyTotals.proteins / 7,
                  fats: weeklyTotals.fats / 7,
                  carbs: weeklyTotals.carbs / 7,
                  fiber: weeklyTotals.fiber / 7
                }

                const avgCaloriePercentage = (weeklyAverages.calories / getCalorieTarget()) * 100
                const avgProteinPercentage = (weeklyAverages.proteins / getProteinTarget()) * 100
                const avgFatPercentage = (weeklyAverages.fats / getFatTarget()) * 100
                const avgCarbPercentage = (weeklyAverages.carbs / getCarbTarget()) * 100
                const avgFiberPercentage = (weeklyAverages.fiber / getFiberTarget()) * 100

                // Calcular porcentajes de macronutrientes para el gráfico de queso
                const totalMacros = weeklyAverages.proteins + weeklyAverages.carbs + weeklyAverages.fats
                const proteinPercentage = (weeklyAverages.proteins / totalMacros) * 100
                const carbPercentage = (weeklyAverages.carbs / totalMacros) * 100
                const fatPercentage = (weeklyAverages.fats / totalMacros) * 100

                return (
                  <>
                    {/* Calories Card - Full Width */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                        border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
                        borderRadius: 3,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.15)}`
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        color: theme.palette.success.main,
                        mb: 1
                      }}>
                        Calorías Totales
                      </Typography>
                      <Typography variant="h2" sx={{ 
                        fontWeight: 800,
                        color: theme.palette.success.main,
                        mb: 1
                      }}>
                        {Math.round(weeklyTotals.calories)}
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 500
                      }}>
                        Promedio diario: {Math.round(weeklyAverages.calories)} kcal
                      </Typography>
                    </Paper>

                    <Box sx={{ 
                      display: 'flex', 
                      gap: 3, 
                      alignItems: 'flex-start'
                    }}>
                      {/* Pie Chart */}
                      <Box sx={{ 
                        flex: '0 0 200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        <Box sx={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: `conic-gradient(
                            ${theme.palette.primary.main} 0deg ${proteinPercentage * 3.6}deg,
                            #4CAF50 ${proteinPercentage * 3.6}deg ${(proteinPercentage + carbPercentage) * 3.6}deg,
                            #FF9800 ${(proteinPercentage + carbPercentage) * 3.6}deg 360deg
                          )`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.15)}`
                        }}>
                          <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.background.paper,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                          }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700,
                              color: theme.palette.text.primary
                            }}>
                              {Math.round(totalMacros)}g
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Legend */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              backgroundColor: theme.palette.primary.main 
                            }} />
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              Proteínas ({proteinPercentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              backgroundColor: '#4CAF50' 
                            }} />
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              Carbohidratos ({carbPercentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              backgroundColor: '#FF9800' 
                            }} />
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              Grasas ({fatPercentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Macro Cards - 2x2 Grid */}
                      <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        {/* First Row - Proteins and Carbs */}
                        <Box sx={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: 2
                        }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                              borderRadius: 2,
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`
                              }
                            }}
                          >
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                              mb: 0.5
                            }}>
                              Proteínas
                            </Typography>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800,
                              color: theme.palette.primary.main
                            }}>
                              {Math.round(weeklyAverages.proteins)}g
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: theme.palette.text.secondary,
                              mt: 0.5
                            }}>
                              {avgProteinPercentage.toFixed(0)}% objetivo
                            </Typography>
                          </Paper>

                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              background: `linear-gradient(135deg, ${alpha('#4CAF50', 0.1)} 0%, ${alpha('#4CAF50', 0.05)} 100%)`,
                              border: `1px solid ${alpha('#4CAF50', 0.2)}`,
                              borderRadius: 2,
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${alpha('#4CAF50', 0.15)}`
                              }
                            }}
                          >
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700,
                              color: '#4CAF50',
                              mb: 0.5
                            }}>
                              Carbohidratos
                            </Typography>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800,
                              color: '#4CAF50'
                            }}>
                              {Math.round(weeklyAverages.carbs)}g
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: theme.palette.text.secondary,
                              mt: 0.5
                            }}>
                              {avgCarbPercentage.toFixed(0)}% objetivo
                            </Typography>
                          </Paper>
                        </Box>

                        {/* Second Row - Fats and Fiber */}
                        <Box sx={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: 2
                        }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              background: `linear-gradient(135deg, ${alpha('#FF9800', 0.1)} 0%, ${alpha('#FF9800', 0.05)} 100%)`,
                              border: `1px solid ${alpha('#FF9800', 0.2)}`,
                              borderRadius: 2,
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${alpha('#FF9800', 0.15)}`
                              }
                            }}
                          >
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700,
                              color: '#FF9800',
                              mb: 0.5
                            }}>
                              Grasas
                            </Typography>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800,
                              color: '#FF9800'
                            }}>
                              {Math.round(weeklyAverages.fats)}g
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: theme.palette.text.secondary,
                              mt: 0.5
                            }}>
                              {avgFatPercentage.toFixed(0)}% objetivo
                            </Typography>
                          </Paper>

                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                              borderRadius: 2,
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.15)}`
                              }
                            }}
                          >
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700,
                              color: theme.palette.secondary.main,
                              mb: 0.5
                            }}>
                              Fibra
                            </Typography>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800,
                              color: theme.palette.secondary.main
                            }}>
                              {Math.round(weeklyAverages.fiber)}g
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: theme.palette.text.secondary,
                              mt: 0.5
                            }}>
                              {avgFiberPercentage.toFixed(0)}% objetivo
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )
              })()}
            </Paper>
          </motion.div>
        </motion.div>
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
        <DietCharts meals={meals} tmb={tmb} customGoal={customGoal} />
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
            Volver
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
          {saving ? 'Guardando...' : 'Guardar Dieta'}
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
        <DialogTitle>Añadir Alimento a {mealDefinitions.find(m => m.id === selectedMeal)?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Buscar Alimentos"
              placeholder="Escribe para buscar alimentos..."
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
                    {searchTerm ? 'No se encontraron alimentos que coincidan con tu búsqueda' : 'Empieza a escribir para buscar alimentos'}
                  </Typography>
                )}
              </Box>
            ) : (
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    Alimento Seleccionado: {foods.find(f => f.id === selectedFood)?.name}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => {
                      setSelectedFood('')
                      setSearchTerm('')
                    }}
                  >
                    Cambiar
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  helperText={`Ingresa la cantidad en ${foods.find(f => f.id === selectedFood)?.unitOfMeasure || 'unidad'}`}
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
            Cancelar
          </Button>
          {selectedFood && (
            <Button onClick={handleAddMeal} variant="contained" disabled={!quantity}>
              Añadir Alimento
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Custom Goal Form Dialog */}
      <Dialog 
        open={showCustomGoalForm} 
        onClose={handleCustomGoalCancel} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { maxHeight: '90vh' }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <CustomGoalForm
            tmb={tmb}
            initialCustomGoal={customGoal}
            onSave={handleCustomGoalSave}
            onCancel={handleCustomGoalCancel}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default DietBuilder 