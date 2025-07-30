import { useState, useEffect } from 'react'
import { Box, Button, Typography, Paper, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import { convertDietToTemplate } from '../utils/templateUtils'
import type { Diet, Client, Supplement, DynamicMeal, CustomGoal } from '../types'

const EditDiet = () => {
  const { id } = useParams<{ id: string }>()
  const { diets, updateDiet, loadingDiets, addDietTemplate } = useFirebase()
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotifications()

  const [activeStep, setActiveStep] = useState(1)
  const [diet, setDiet] = useState<Diet | null>(null)
  const [tmbData, setTmbData] = useState({ tmb: 0, clientName: '' })
  const [dietName, setDietName] = useState('')
  
  // Estados para el diálogo de guardar como plantilla
  const [saveAsTemplateDialog, setSaveAsTemplateDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCategory, setTemplateCategory] = useState('custom')

  // Buscar la dieta por ID
  useEffect(() => {
    if (id && diets.length > 0) {
      const foundDiet = diets.find(d => d.id === id)

      if (foundDiet) {
        setDiet(foundDiet)
        setTmbData({
          tmb: foundDiet.tmb || 0,
          clientName: foundDiet.clientName || ''
        })
        setDietName(foundDiet.name || `Diet for ${foundDiet.clientName}`)
      }
    }
  }, [id, diets])

  const handleTMBComplete = (clientName: string, tmb: number, clientData?: Client, newDietName?: string) => {
    setTmbData({ tmb, clientName })
    if (newDietName) {
      setDietName(newDietName)
    }
    if (diet) {
      // Limpiar el objeto clientData para eliminar campos undefined
      let cleanClientData = undefined
      if (clientData) {
        cleanClientData = Object.fromEntries(
          Object.entries(clientData).filter(([, value]) => value !== undefined)
        ) as Client
      }
      
      setDiet(prev => prev ? {
        ...prev,
        tmb,
        clientName,
        clientData: cleanClientData || prev.clientData
      } : null)
    }
    setActiveStep(1)
  }

  const handleDietSave = async (meals: Diet['meals'], supplements?: Supplement[], mealDefinitions?: DynamicMeal[], customGoal?: CustomGoal) => {
    if (!diet) return

    const updatedDiet = {
      ...diet,
      name: dietName,
      meals,
      supplements: supplements || [],
      mealDefinitions: mealDefinitions || [],
      customGoal
    }

    const success = await updateDiet(diet.id, updatedDiet)
    if (success) {
      navigate('/diets')
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
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

  const renderStepContent = (step: number) => {
    if (!diet) return null

    switch (step) {
      case 0:
        return (
          <TMBStep
            onComplete={handleTMBComplete}
            initialClientName={tmbData.clientName}
            initialTMB={tmbData.tmb}
            initialClientData={diet.clientData || null}
          />
        )
      case 1:
        return (
          <DietBuilder
            tmb={diet.tmb}
            onSave={handleDietSave}
            onBack={handleBack}
            initialMeals={diet.meals}
            initialSupplements={diet.supplements}
            initialMealDefinitions={diet.mealDefinitions}
            initialCustomGoal={diet.customGoal}
            dietName={dietName}
          />
        )
      default:
        return 'Unknown step'
    }
  }

  if (loadingDiets) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  if (!diet) {
    return (
      <Box sx={{ width: '100%', px: 3 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Diet not found
          </Typography>
          <Button onClick={() => navigate('/diets')}>
            Back to Diets
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', px: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar Dieta - {diet.clientName}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Editando la dieta para {diet.clientName} (TMB: {diet.tmb ? Math.round(diet.tmb) : 'N/A'} kcal)
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Diet Name"
            variant="outlined"
            value={dietName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDietName(e.target.value)}
            placeholder="Enter diet name"
            sx={{ maxWidth: '400px' }}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSaveAsTemplate}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Guardar como Plantilla
          </Button>
        </Box>

        {activeStep === 2 ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              All steps completed
            </Typography>
            <Button onClick={() => navigate('/diets')}>
              Go to Diets
            </Button>
          </Box>
        ) : (
          <Box>
            {renderStepContent(activeStep)}
          </Box>
        )}
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

export default EditDiet 