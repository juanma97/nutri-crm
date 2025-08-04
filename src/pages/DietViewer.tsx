import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import { convertDietToTemplate } from '../utils/templateUtils'
import LazyCharts from '../components/LazyCharts'
import type { DayOfWeek, MealType, Diet, DietMeal } from '../types'

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

const DietViewer = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const { loadDietByShareId, addDietTemplate } = useFirebase()
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotifications()
  const [diet, setDiet] = useState<Diet | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Estados para el diálogo de guardar como plantilla
  const [saveAsTemplateDialog, setSaveAsTemplateDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCategory, setTemplateCategory] = useState('custom')

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
      mealList.forEach((meal: DietMeal) => {
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

  const handleSaveAsTemplate = () => {
    if (diet) {
      setTemplateName(`${diet.name} - Plantilla`)
      setTemplateDescription(`Plantilla basada en la dieta de ${diet.clientName}`)
      setSaveAsTemplateDialog(true)
    }
  }

  const confirmSaveAsTemplate = async () => {
    if (!diet || !templateName.trim()) {
      showError('Por favor ingresa un nombre para la plantilla')
      return
    }

    try {
      const templateData = convertDietToTemplate(
        diet, 
        templateName, 
        templateDescription, 
        templateCategory
      )

      const success = await addDietTemplate(templateData)
      if (success) {
        showSuccess('Dieta guardada como plantilla correctamente')
        setSaveAsTemplateDialog(false)
        setTemplateName('')
        setTemplateDescription('')
        setTemplateCategory('custom')
      }
    } catch (error) {
      showError('Error al guardar la plantilla')
    }
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
      <Box sx={{ width: '100%', px: 3, py: 3}}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dieta no encontrada
            </Typography>
            <Typography variant="body2">
              La dieta que buscas no existe o el enlace es inválido.
            </Typography>
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')} 
            sx={{ backgroundColor: '#2e7d32' }}
          >
            Ir al inicio
          </Button>
        </Paper>
      </Box>
    )
  }

  if (!diet) {
    return null
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h3" sx={{ color: '#2e7d32' }}>
            Plan de dieta de {diet.clientName}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSaveAsTemplate}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Guardar como Plantilla
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Chip label={`TMB: ${diet.tmb ? Math.round(diet.tmb) : 'N/A'} cal`} color="primary" />
          {diet.customGoal && (
            <Chip label={`Objetivo: ${diet.customGoal.calories} cal`} color="secondary" />
          )}
          <Chip label={`Calorías Totales: ${Math.round(calculateTotalCalories())} cal`} color="secondary" />
        </Box>
        <Typography variant="body1" color="text.secondary">
          Este es tu plan nutricional personalizado. Síguelo diariamente para obtener resultados óptimos.
        </Typography>
      </Paper>

      {/* Charts */}
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Análisis Nutricional
        </Typography>
        <LazyCharts meals={diet.meals as unknown as Record<DayOfWeek, Record<string, DietMeal[]>>} tmb={diet.tmb || 0} customGoal={diet.customGoal} />
      </Paper>

      {/* Supplements */}
      {diet.supplements && diet.supplements.length > 0 && (
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Suplementación
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {diet.supplements.map((supplement) => (
              <Box key={supplement.id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {supplement.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {supplement.quantity}
                  </Typography>
                </Box>
                {(supplement.time || supplement.comments) && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {supplement.time && (
                      <Chip 
                        label={`Hora: ${supplement.time}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    )}
                    {supplement.comments && (
                      <Typography variant="body2" color="text.secondary">
                        {supplement.comments}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Weekly Plan */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Plan Semanal de Comidas
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Día</TableCell>
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
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          No se han añadido alimentos
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
          Este plan de dieta fue creado por tu nutricionista usando NutriCRM.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Para dudas o modificaciones, por favor contacta a tu nutricionista.
        </Typography>
      </Paper>

      {/* Diálogo para guardar como plantilla */}
      <Dialog open={saveAsTemplateDialog} onClose={() => setSaveAsTemplateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Guardar como Plantilla</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Esta acción creará una plantilla reutilizable basada en la dieta actual de {diet?.clientName}.
          </Typography>
          
          <TextField
            fullWidth
            label="Nombre de la Plantilla"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Descripción (opcional)"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={templateCategory}
              label="Categoría"
              onChange={(e) => setTemplateCategory(e.target.value)}
            >
              <MenuItem value="weight_loss">Pérdida de Peso</MenuItem>
              <MenuItem value="muscle_gain">Ganancia Muscular</MenuItem>
              <MenuItem value="maintenance">Mantenimiento</MenuItem>
              <MenuItem value="health">Salud</MenuItem>
              <MenuItem value="custom">Personalizada</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveAsTemplateDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmSaveAsTemplate} variant="contained" color="primary">
            Guardar Plantilla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DietViewer 