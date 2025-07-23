import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { Diet, Supplement, DynamicMeal, CustomGoal } from '../types'

const steps = ['Información Básica', 'Editar Plantilla']

const EditTemplate = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { dietTemplates, updateDietTemplate, loadingDietTemplates } = useFirebase()
  const { showError } = useNotifications()
  
  const [activeStep, setActiveStep] = useState(0)
  const [template, setTemplate] = useState<Diet | null>(null)
  const [templateData, setTemplateData] = useState<Partial<Diet>>({
    name: '',
    description: '',
    category: 'custom'
  })

  // Cargar la plantilla cuando se monta el componente
  useEffect(() => {
    if (id && dietTemplates.length > 0) {
      const foundTemplate = dietTemplates.find(t => t.id === id)
      if (foundTemplate) {
        setTemplate(foundTemplate)
        setTemplateData({
          name: foundTemplate.name,
          description: foundTemplate.description || '',
          category: foundTemplate.category || 'custom'
        })
      }
    }
  }, [id, dietTemplates])

  const handleBasicInfoComplete = (name: string, description: string, category: string) => {
    setTemplateData(prev => ({
      ...prev,
      name,
      description,
      category
    }))
    setActiveStep(1)
  }

  const handleTemplateSave = async (meals: Diet['meals'], supplements?: Supplement[], mealDefinitions?: DynamicMeal[], customGoal?: CustomGoal) => {
    if (!id || !template) {
      showError('Plantilla no encontrada')
      return
    }
    
    const updatedTemplateData = {
      ...templateData,
      meals,
      supplements: supplements || [],
      mealDefinitions: mealDefinitions || [],
      customGoal
    }
    
    const success = await updateDietTemplate(id, updatedTemplateData)
    if (success) {
      navigate('/templates')
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
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
          onClick={() => navigate('/templates')}
          variant="contained"
        >
          Volver a Plantillas
        </Button>
      </Box>
    )
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep 
            onComplete={handleBasicInfoComplete}
            initialName={templateData.name || ''}
            initialDescription={templateData.description || ''}
            initialCategory={templateData.category || 'custom'}
          />
        )
      case 1:
        return (
          <DietBuilder
            onSave={handleTemplateSave}
            onBack={handleBack}
            initialMeals={template.meals}
            initialSupplements={template.supplements}
            initialMealDefinitions={template.mealDefinitions}
            initialCustomGoal={template.customGoal}
            dietName={templateData.name}
            isTemplate={true}
          />
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ width: '100%', py: 3, px: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          onClick={() => navigate('/templates')}
          sx={{ mr: 2 }}
        >
          ← Volver a Plantillas
        </Button>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            ✏️ Editar Plantilla: {template.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Modifica tu plantilla de dieta completa
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>💡 Importante:</strong> Las plantillas son dietas completas y funcionales. 
        Puedes editar días, comidas y alimentos exactamente igual que en una dieta de cliente.
      </Alert>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </Paper>
    </Box>
  )
}

// Componente para la información básica
interface BasicInfoStepProps {
  onComplete: (name: string, description: string, category: string) => void
  initialName: string
  initialDescription: string
  initialCategory: string
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onComplete, initialName, initialDescription, initialCategory }) => {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [category, setCategory] = useState(initialCategory)

  const handleNext = () => {
    if (!name.trim()) {
      alert('El nombre de la plantilla es obligatorio')
      return
    }
    onComplete(name, description, category)
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Información Básica de la Plantilla
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Define la información básica de tu plantilla. Después podrás editar días, comidas y alimentos.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Nombre de la Plantilla"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Dieta Mediterránea, Plan de Pérdida de Peso..."
          required
          helperText="Un nombre descriptivo para identificar la plantilla"
        />

        <FormControl fullWidth>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={category}
            label="Categoría"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="weight_loss">Pérdida de Peso</MenuItem>
            <MenuItem value="muscle_gain">Ganancia Muscular</MenuItem>
            <MenuItem value="maintenance">Mantenimiento</MenuItem>
            <MenuItem value="health">Salud</MenuItem>
            <MenuItem value="custom">Personalizada</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el propósito y características de esta plantilla..."
          multiline
          rows={3}
          helperText="Opcional: Añade detalles sobre cuándo y cómo usar esta plantilla"
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!name.trim()}
          sx={{ backgroundColor: '#2e7d32' }}
        >
          Continuar a Editar Plantilla
        </Button>
      </Box>
    </Box>
  )
}

export default EditTemplate 