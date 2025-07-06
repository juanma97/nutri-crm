import React, { useState } from 'react'
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import type { Diet, Client } from '../types'

const steps = ['Calculate TMB', 'Build Diet']

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
      monday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      tuesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      wednesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      thursday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      friday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      saturday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      sunday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] }
    }
  })
  
  const { addDiet } = useFirebase()
  const navigate = useNavigate()

  const handleTMBComplete = (clientName: string, tmb: number, client?: Client) => {
    setTmbData({ tmb, clientName })
    setClientData(client || null)
    
    const updatedDietData = {
      ...dietData,
      tmb,
      clientName,
      clientData: client || undefined,
      name: `Diet for ${clientName}`
    }
    
    setDietData(updatedDietData)
    setActiveStep(1)
  }

  const handleDietSave = async (meals: Diet['meals']) => {
    const currentDietData = {
      ...dietData,
      meals
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
          />
        )
      case 1:
        return (
          <DietBuilder
            tmb={tmbData.tmb}
            onSave={handleDietSave}
            initialMeals={dietData.meals}
          />
        )
      default:
        return 'Unknown step'
    }
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Diet
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
              All steps completed
            </Typography>
            <Button onClick={() => navigate('/diets')}>
              Go to Diets
            </Button>
          </Box>
        ) : (
          <Box>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default CreateDiet 