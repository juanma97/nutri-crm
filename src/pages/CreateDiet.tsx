import React, { useState } from 'react'
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import type { Diet } from '../types'

const steps = ['Calculate TMB', 'Build Diet']

const CreateDiet = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [tmbData, setTmbData] = useState({ tmb: 0, clientName: '' })
  const [dietData, setDietData] = useState<Omit<Diet, 'id' | 'createdAt' | 'shareId'>>({
    name: '',
    clientName: '',
    tmb: 0,
    meals: Array(7).fill(null).map(() => Array(5).fill(null).map(() => ({ foods: [] })))
  })
  
  const { addDiet } = useFirebase()
  const navigate = useNavigate()

  const handleTMBComplete = (data: { tmb: number; clientName: string }) => {
    setTmbData(data)
    setDietData(prev => ({
      ...prev,
      tmb: data.tmb,
      clientName: data.clientName,
      name: `Diet for ${data.clientName}`
    }))
    setActiveStep(1)
  }

  const handleDietComplete = async (meals: Diet['meals']) => {
    const finalDietData = {
      ...dietData,
      meals
    }

    const success = await addDiet(finalDietData)
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
            initialValues={tmbData}
          />
        )
      case 1:
        return (
          <DietBuilder
            tmb={tmbData.tmb}
            onComplete={handleDietComplete}
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