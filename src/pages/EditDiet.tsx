import React, { useState, useEffect } from 'react'
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import type { Diet } from '../types'

const steps = ['Calculate TMB', 'Build Diet']

const EditDiet = () => {
  const { id } = useParams<{ id: string }>()
  const { diets, updateDiet, loadingDiets } = useFirebase()
  const navigate = useNavigate()
  
  const [activeStep, setActiveStep] = useState(0)
  const [diet, setDiet] = useState<Diet | null>(null)
  const [tmbData, setTmbData] = useState({ tmb: 0, clientName: '' })

  // Buscar la dieta por ID
  useEffect(() => {
    if (id && diets.length > 0) {
      const foundDiet = diets.find(d => d.id === parseInt(id))
      if (foundDiet) {
        setDiet(foundDiet)
        setTmbData({
          tmb: foundDiet.tmb,
          clientName: foundDiet.clientName
        })
      }
    }
  }, [id, diets])

  const handleTMBComplete = (data: { tmb: number; clientName: string }) => {
    setTmbData(data)
    if (diet) {
      setDiet(prev => prev ? {
        ...prev,
        tmb: data.tmb,
        clientName: data.clientName
      } : null)
    }
    setActiveStep(1)
  }

  const handleDietComplete = async (meals: Diet['meals']) => {
    if (!diet) return

    const updatedDiet = {
      ...diet,
      meals
    }

    const success = await updateDiet(diet.id.toString(), updatedDiet)
    if (success) {
      navigate('/diets')
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const renderStepContent = (step: number) => {
    if (!diet) return null

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
            tmb={diet.tmb}
            onSave={handleDietComplete}
            initialMeals={diet.meals}
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
      <Box sx={{ width: '100%', px: 3, py: 3 }}>
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
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Diet - {diet.clientName}
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

export default EditDiet 