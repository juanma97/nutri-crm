import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignIcon,
  Person as PersonIcon,
  Restaurant as TemplateIcon
} from '@mui/icons-material'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { DietTemplate, Client, DayOfWeek } from '../types'

const AssignTemplate = () => {
  const { templateId } = useParams<{ templateId: string }>()
  const { dietTemplates, clients, assignTemplateToClient, loadingDietTemplates, loadingClients } = useFirebase()
  const navigate = useNavigate()
  const { showError } = useNotifications()

  const [selectedClientId, setSelectedClientId] = useState('')
  const [tmb, setTmb] = useState<number>(0)
  const [template, setTemplate] = useState<DietTemplate | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  useEffect(() => {
    if (templateId && dietTemplates.length > 0) {
      const foundTemplate = dietTemplates.find(t => t.id === templateId)
      if (foundTemplate) {
        setTemplate(foundTemplate)
      }
    }
  }, [templateId, dietTemplates])

  useEffect(() => {
    if (selectedClientId && clients.length > 0) {
      const foundClient = clients.find(c => c.id === selectedClientId)
      if (foundClient) {
        setSelectedClient(foundClient)
        // Calcular TMB básico si no está establecido
        if (tmb === 0 && foundClient.weight && foundClient.height && foundClient.age && foundClient.gender) {
          const calculatedTMB = calculateTMB(foundClient)
          setTmb(calculatedTMB)
        }
      }
    }
  }, [selectedClientId, clients, tmb])

  const calculateTMB = (client: Client): number => {
    if (!client.weight || !client.height || !client.age || !client.gender) {
      return 0
    }

    // Fórmula de Mifflin-St Jeor
    let tmb = 10 * client.weight + 6.25 * client.height - 5 * client.age
    tmb = client.gender === 'male' ? tmb + 5 : tmb - 161

    // Aplicar factor de actividad
    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    }

    return Math.round(tmb * activityFactors[client.activityLevel])
  }

  const handleAssign = async () => {
    if (!template || !selectedClient) {
      showError('Por favor selecciona un cliente')
      return
    }

    if (tmb <= 0) {
      showError('Por favor ingresa un TMB válido')
      return
    }

    const success = await assignTemplateToClient(
      template.id,
      selectedClient.id,
      selectedClient.name,
      tmb
    )

    if (success) {
      navigate('/diets')
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

    return { totalMeals, totalCalories: Math.round(totalCalories / 7) }
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

  if (loadingDietTemplates || loadingClients) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  if (!template) {
    return (
      <Box sx={{ width: '100%', py: 3, px: 3 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Plantilla no encontrada
          </Typography>
          <Typography variant="body2">
            La plantilla que buscas no existe o ha sido eliminada.
          </Typography>
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/templates')}
          sx={{ mt: 2, backgroundColor: '#2e7d32' }}
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
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            Asignar Plantilla
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Asigna "{template.name}" a un cliente
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Información de la Plantilla */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TemplateIcon sx={{ mr: 1, color: '#2e7d32' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Información de la Plantilla
              </Typography>
            </Box>
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {template.name}
            </Typography>
            
            {template.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {template.description}
              </Typography>
            )}

            <Box sx={{ mb: 2 }}>
              <Chip
                label={getCategoryLabel(template.category || 'custom')}
                color="primary"
                sx={{ mb: 1 }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Calorías objetivo
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {template.targetCalories || stats.totalCalories} cal/día
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total comidas
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {stats.totalMeals}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Veces utilizada
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {template.usageCount}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Creada el
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {new Date(template.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Formulario de Asignación */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AssignIcon sx={{ mr: 1, color: '#2e7d32' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Asignar a Cliente
              </Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Seleccionar Cliente</InputLabel>
              <Select
                value={selectedClientId}
                label="Seleccionar Cliente"
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    <Box>
                      <Typography variant="body1">
                        {client.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.email} • {client.goal}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedClient && (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: '#2e7d32' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Información del Cliente
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nombre
                      </Typography>
                      <Typography variant="body1">
                        {selectedClient.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Objetivo
                      </Typography>
                      <Typography variant="body1">
                        {selectedClient.goal}
                      </Typography>
                    </Grid>
                    {selectedClient.weight && (
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Peso
                        </Typography>
                        <Typography variant="body1">
                          {selectedClient.weight} kg
                        </Typography>
                      </Grid>
                    )}
                    {selectedClient.height && (
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Altura
                        </Typography>
                        <Typography variant="body1">
                          {selectedClient.height} cm
                        </Typography>
                      </Grid>
                    )}
                    {selectedClient.age && (
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Edad
                        </Typography>
                        <Typography variant="body1">
                          {selectedClient.age} años
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}

            <TextField
              fullWidth
              label="TMB (Calorías por día)"
              type="number"
              value={tmb}
              onChange={(e) => setTmb(Number(e.target.value))}
              sx={{ mb: 3 }}
              helperText="Metabolismo Basal Total - ajusta según las necesidades del cliente"
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/templates')}
                fullWidth
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<AssignIcon />}
                onClick={handleAssign}
                fullWidth
                disabled={!selectedClientId || tmb <= 0}
                sx={{ backgroundColor: '#2e7d32' }}
              >
                Asignar Plantilla
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AssignTemplate 
