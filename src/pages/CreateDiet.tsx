import React, { useState } from 'react'
import { Box, Stepper, Step, StepLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import type { Client, Diet } from '../types'

const steps = ['Calculate TMB', 'Build Diet']

const CreateDiet = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [client, setClient] = useState<Client | null>(null)
  const [tmb, setTmb] = useState<number | null>(null)
  const navigate = useNavigate()

  const handleTMBComplete = (clientData: Client, calculatedTMB: number) => {
    setClient(clientData)
    setTmb(calculatedTMB)
    setActiveStep(1)
  }

  const handleDietComplete = (meals: any) => {
    if (client && tmb) {
      const newDiet: Omit<Diet, 'id' | 'createdAt'> = {
        clientName: client.name,
        tmb: tmb,
        meals: meals
      }
      
      console.log('Diet created:', newDiet)
      // TODO: Save to state/backend
      navigate('/diets')
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ width: '100%' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {activeStep === 0 && (
        <TMBStep onNext={handleTMBComplete} />
      )}

      {activeStep === 1 && client && tmb && (
        <DietBuilder 
          clientName={client.name}
          tmb={tmb}
          onSave={handleDietComplete}
        />
      )}
    </Box>
  )
}

export default CreateDiet 