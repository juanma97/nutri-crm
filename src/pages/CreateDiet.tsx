import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Stepper, Step, StepLabel, Typography, Paper } from '@mui/material'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useDietContext } from '../contexts/DietContext'
import type { Diet } from '../types'

const steps = ['Calculate TMB', 'Build Diet']

const CreateDiet = () => {
  const navigate = useNavigate()
  const { addDiet } = useDietContext()
  
  const [activeStep, setActiveStep] = useState(0)
  const [clientName, setClientName] = useState('')
  const [tmb, setTmb] = useState(0)
  const [meals, setMeals] = useState<Diet['meals']>({
    monday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    tuesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    wednesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    thursday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    friday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    saturday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
    sunday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] }
  })

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleTMBComplete = (name: string, calculatedTMB: number) => {
    setClientName(name)
    setTmb(calculatedTMB)
    handleNext()
  }

  const handleDietSave = (savedMeals: Diet['meals']) => {
    setMeals(savedMeals)
    
    // Crear la nueva dieta usando el contexto
    addDiet({
      clientName,
      tmb,
      meals: savedMeals
    })
    
    navigate('/diets')
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Diet
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <TMBStep onComplete={handleTMBComplete} />
        )}

        {activeStep === 1 && (
          <DietBuilder
            clientName={clientName}
            tmb={tmb}
            onSave={handleDietSave}
          />
        )}
      </Paper>
    </Box>
  )
}

export default CreateDiet 