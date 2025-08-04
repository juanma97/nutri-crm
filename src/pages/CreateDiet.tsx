import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
} from '@mui/material'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import type { Diet, Client, Supplement, DynamicMeal, CustomGoal } from '../types'

const steps = ['Calcular TMB', 'Construir Dieta']

const CreateDiet = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [tmbData, setTmbData] = useState({ tmb: 0, clientName: '' })
  const [clientData, setClientData] = useState<Client | null>(null)
  const [dietData, setDietData] = useState<Omit<Diet, 'id' | 'createdAt' | 'shareId'>>({
    name: '',
    clientName: '',
    tmb: 0,
    clientData: undefined,
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
  
  const { addDiet } = useFirebase()
  const navigate = useNavigate()

  const handleTMBComplete = (clientName: string, tmb: number, client?: Client, dietName?: string) => {
    setTmbData({ tmb, clientName })
    setClientData(client || null)
    
    // Limpiar el objeto clientData para eliminar campos undefined
    let cleanClientData = undefined
    if (client) {
      cleanClientData = Object.fromEntries(
        Object.entries(client).filter(([, value]) => value !== undefined)
      ) as Client
    }
    
    const updatedDietData = {
      ...dietData,
      tmb,
      clientName,
      clientData: cleanClientData,
      name: dietName || `Diet for ${clientName}`
    }
    
    setDietData(updatedDietData)
    setActiveStep(1)
  }

  const handleDietSave = async (meals: Diet['meals'], supplements?: Supplement[], mealDefinitions?: DynamicMeal[], customGoal?: CustomGoal) => {
    const currentDietData = {
      ...dietData,
      meals,
      supplements: supplements || [],
      mealDefinitions: mealDefinitions || [],
      customGoal
    }
    
    const success = await addDiet(currentDietData)
    if (success) {
      navigate('/diets')
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <TMBStep 
            onComplete={handleTMBComplete}
            initialClientName={tmbData.clientName}
            initialTMB={tmbData.tmb}
            initialClientData={clientData}
            showDietNameField={true}
            initialDietName={dietData.name}
          />
        )
      case 1:
        return (
          <DietBuilder
            tmb={tmbData.tmb}
            onSave={handleDietSave}
            onBack={handleBack}
            initialMeals={dietData.meals}
            initialCustomGoal={dietData.customGoal}
            dietName={dietData.name}
          />
        )
      default:
        return 'Paso desconocido'
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crear Nueva Dieta
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Todos los pasos completados
            </Typography>
            <Button onClick={() => navigate('/diets')}>
              Ir a Dietas
            </Button>
          </Box>
        ) : (
          <Box>
            {renderStepContent(activeStep)}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default CreateDiet 