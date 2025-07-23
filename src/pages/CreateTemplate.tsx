import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import type { Diet, Supplement, DynamicMeal, CustomGoal } from '../types'

const steps = ['Información Básica', 'Construir Plantilla']

const CreateTemplate = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [templateData, setTemplateData] = useState<Omit<Diet, 'id' | 'createdAt' | 'shareId' | 'clientName' | 'tmb' | 'clientData'>>({
    name: '',
    description: '',
    category: 'custom',
    isTemplate: true,
    meals: {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {}
    }
  })
  
  const { addDietTemplate } = useFirebase()
  const navigate = useNavigate()

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
    const currentTemplateData = {
      ...templateData,
      meals,
      supplements: supplements || [],
      mealDefinitions: mealDefinitions || [],
      customGoal
    }
    
    const success = await addDietTemplate(currentTemplateData)
    if (success) {
      navigate('/templates')
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep 
            onComplete={handleBasicInfoComplete}
            initialName={templateData.name}
            initialDescription={templateData.description || ''}
            initialCategory={templateData.category || 'custom'}
          />
        )
      case 1:
        return (
          <DietBuilder
            onSave={handleTemplateSave}
            onBack={handleBack}
            initialMeals={templateData.meals}
            initialSupplements={templateData.supplements}
            initialMealDefinitions={templateData.mealDefinitions}
            initialCustomGoal={templateData.customGoal}
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
            📝 Crear Nueva Plantilla
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Crea una dieta completa reutilizable para tus clientes
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>💡 Importante:</strong> Las plantillas son dietas completas y funcionales. 
        Puedes añadir días, comidas y alimentos exactamente igual que en una dieta de cliente. 
        La única diferencia es que no están asignadas a ningún cliente específico.
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
          Define la información básica de tu plantilla. Después podrás añadir días, comidas y alimentos.
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
          Continuar a Construir Plantilla
        </Button>
      </Box>
    </Box>
  )
}

export default CreateTemplate 