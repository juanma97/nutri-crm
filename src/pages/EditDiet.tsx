import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import type { Diet, Client } from '../types'

const EditDiet = () => {
  const { id } = useParams<{ id: string }>()
  const { diets, updateDiet, loadingDiets } = useFirebase()
  const navigate = useNavigate()
  
  const [activeStep, setActiveStep] = useState(1)
  const [diet, setDiet] = useState<Diet | null>(null)
  const [tmbData, setTmbData] = useState({ tmb: 0, clientName: '' })

  // Buscar la dieta por ID
  useEffect(() => {
    if (id && diets.length > 0) {
      const foundDiet = diets.find(d => d.id === id)
      
      if (foundDiet) {
        setDiet(foundDiet)
        setTmbData({
          tmb: foundDiet.tmb,
          clientName: foundDiet.clientName
        })
      }
    }
  }, [id, diets])

  const handleTMBComplete = (clientName: string, tmb: number, clientData?: Client) => {
    setTmbData({ tmb, clientName })
    if (diet) {
      setDiet(prev => prev ? {
        ...prev,
        tmb,
        clientName,
        clientData: clientData || prev.clientData
      } : null)
    }
    setActiveStep(1)
  }

  const handleDietSave = async (meals: Diet['meals']) => {
    if (!diet) return

    const updatedDiet = {
      ...diet,
      meals
    }

    const success = await updateDiet(diet.id, updatedDiet)
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
          Editando la dieta para {diet.clientName} (TMB: {diet.tmb} kcal)
        </Typography>

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