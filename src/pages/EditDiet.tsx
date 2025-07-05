import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, Alert } from '@mui/material'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useDietContext } from '../contexts/DietContext'
import type { Diet } from '../types'

const steps = ['Calculate TMB', 'Build Diet']

const EditDiet = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getDietById, updateDiet } = useDietContext()
  
  const [activeStep, setActiveStep] = useState(0)
  const [dietData, setDietData] = useState<Partial<Diet>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const dietId = parseInt(id)
      const diet = getDietById(dietId)
      
      if (diet) {
        setDietData(diet)
        setLoading(false)
      } else {
        setError('Diet not found')
        setLoading(false)
      }
    }
  }, [id, getDietById])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleTMBUpdate = (tmb: number, clientName: string) => {
    setDietData(prev => ({
      ...prev,
      tmb,
      clientName
    }))
  }

  const handleMealsUpdate = (meals: Diet['meals']) => {
    setDietData(prev => ({
      ...prev,
      meals
    }))
  }

  const handleSave = () => {
    if (dietData.id && dietData.clientName && dietData.tmb && dietData.meals) {
      updateDiet(dietData.id, {
        clientName: dietData.clientName,
        tmb: dietData.tmb,
        meals: dietData.meals
      })
      navigate('/diets')
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading diet...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/diets')}
          sx={{ mt: 2 }}
        >
          Back to Diets
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Diet - {dietData.clientName}
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
          <TMBStep
            onNext={handleNext}
            tmb={dietData.tmb}
            clientName={dietData.clientName}
            onUpdate={handleTMBUpdate}
          />
        )}

        {activeStep === 1 && (
          <DietBuilder
            onBack={handleBack}
            onSave={handleSave}
            tmb={dietData.tmb || 0}
            meals={dietData.meals}
            onMealsUpdate={handleMealsUpdate}
            isEditing={true}
          />
        )}
      </Paper>
    </Box>
  )
}

export default EditDiet 