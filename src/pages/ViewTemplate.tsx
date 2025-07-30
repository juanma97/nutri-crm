import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon,
  Assignment as AssignIcon,
  Restaurant as FoodIcon,
  LocalPharmacy as SupplementIcon
} from '@mui/icons-material'
import { useFirebase } from '../contexts/FirebaseContext'
import type { DietTemplate, DayOfWeek } from '../types'

const ViewTemplate = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { dietTemplates, loadingDietTemplates } = useFirebase()
  
  const [template, setTemplate] = useState<DietTemplate | null>(null)

  // Cargar la plantilla cuando se monta el componente
  useEffect(() => {
    if (id && dietTemplates.length > 0) {
      const foundTemplate = dietTemplates.find(t => t.id === id)
      if (foundTemplate) {
        setTemplate(foundTemplate)
      }
    }
  }, [id, dietTemplates])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weight_loss': return 'error'
      case 'muscle_gain': return 'warning'
      case 'maintenance': return 'info'
      case 'health': return 'success'
      case 'custom': return 'default'
      default: return 'default'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'weight_loss': return 'Pérdida de Peso'
      case 'muscle_gain': return 'Ganancia Muscular'
      case 'maintenance': return 'Mantenimiento'
      case 'health': return 'Salud'
      case 'custom': return 'Personalizada'
      default: return 'Sin Categoría'
    }
  }

  const calculateTemplateStats = (template: DietTemplate) => {
    const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    let totalMeals = 0
    let totalCalories = 0

    daysOfWeek.forEach(day => {
      const dayMeals = template.meals[day]
      Object.values(dayMeals).forEach((mealList: any[]) => {
        totalMeals += mealList.length
        mealList.forEach((meal: { calories: number }) => {
          totalCalories += meal.calories
        })
      })
    })

    return {
      totalMeals,
      totalCalories,
      averageCaloriesPerDay: Math.round(totalCalories / 7),
      averageMealsPerDay: Math.round(totalMeals / 7)
    }
  }

  // Mostrar loading mientras se cargan las plantillas
  if (loadingDietTemplates) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  // Mostrar error si no se encuentra la plantilla
  if (!template) {
    return (
      <Box sx={{ width: '100%', py: 3, px: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Plantilla no encontrada. Es posible que haya sido eliminada o que el ID no sea válido.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/templates')}
          variant="contained"
        >
          Volver a Plantillas
        </Button>
      </Box>
    )
  }

  const stats = calculateTemplateStats(template)

  return (
    <Box sx={{ width: '100%', py: 3, px: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/templates')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            📋 {template.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={getCategoryLabel(template.category || 'custom')}
              color={getCategoryColor(template.category || 'custom')}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              • Creada el {template.createdAt.toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/templates/edit/${template.id}`)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            startIcon={<AssignIcon />}
            onClick={() => navigate(`/templates/assign/${template.id}`)}
            sx={{ backgroundColor: '#2e7d32' }}
          >
            Asignar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Información básica */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              📝 Descripción
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {template.description || 'Sin descripción disponible.'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              📊 Estadísticas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      {stats.totalMeals}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comidas Totales
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      {stats.averageMealsPerDay}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comidas/Día
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      {stats.totalCalories}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calorías Totales
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      {stats.averageCaloriesPerDay}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calorías/Día
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Información adicional */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              ℹ️ Información
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Creada:</strong>
              </Typography>
              <Typography variant="body1">
                {template.createdAt.toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Última actualización:</strong>
              </Typography>
              <Typography variant="body1">
                {template.updatedAt ? template.updatedAt.toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Veces utilizada:</strong>
              </Typography>
              <Typography variant="body1">
                {template.usageCount} veces
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FoodIcon sx={{ mr: 1, fontSize: 16 }} />
                <strong>Comidas definidas:</strong>
              </Typography>
              <Typography variant="body1">
                {template.mealDefinitions?.length || 0} tipos de comida
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SupplementIcon sx={{ mr: 1, fontSize: 16 }} />
                <strong>Suplementos:</strong>
              </Typography>
              <Typography variant="body1">
                {template.supplements?.length || 0} suplementos
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>💡 Consejo:</strong> Para modificar las comidas y estructura nutricional de esta plantilla, 
        puedes crear una nueva plantilla basada en esta o usar el editor de dietas para crear una dieta 
        personalizada para un cliente específico.
      </Alert>
    </Box>
  )
}

export default ViewTemplate 