import React, { useState, useEffect } from 'react'
import { 
  TextField, 
  Button, 
  Typography, 
  MenuItem,
  Alert,
  Box
} from '@mui/material'
import type { Client } from '../types'

interface TMBStepProps {
  onComplete?: (name: string, tmb: number) => void
  onNext?: () => void
  onUpdate?: (tmb: number, clientName: string) => void
  initialClientName?: string
  initialTMB?: number
  clientName?: string
  tmb?: number
}

const TMBStep = ({ onComplete, onNext, onUpdate, initialClientName = '', initialTMB = 0, clientName, tmb: propTmb }: TMBStepProps) => {
  const [client, setClient] = useState<Omit<Client, 'age' | 'weight' | 'height'> & { age: string, weight: string, height: string }>({
    name: initialClientName,
    age: '',
    weight: '',
    height: '',
    gender: 'male'
  })
  const [tmb, setTmb] = useState<number | null>(initialTMB || null)
  const [errors, setErrors] = useState<string[]>([])

  const calculateTMB = (clientData: Client): number => {
    const { age, weight, height, gender } = clientData
    
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
  }

  const handleInputChange = (field: keyof typeof client) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClient({
      ...client,
      [field]: event.target.value
    })
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []
    
    if (!client.name.trim()) newErrors.push('Name is required')
    if (!client.age || Number(client.age) <= 0) newErrors.push('Valid age is required')
    if (!client.weight || Number(client.weight) <= 0) newErrors.push('Valid weight is required')
    if (!client.height || Number(client.height) <= 0) newErrors.push('Valid height is required')
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNext = () => {
    if (!validateForm()) return
    
    const clientData: Client = {
      name: client.name,
      age: Number(client.age),
      weight: Number(client.weight),
      height: Number(client.height),
      gender: client.gender
    }
    
    const calculatedTMB = calculateTMB(clientData)
    setTmb(calculatedTMB)
    
    if (onComplete) {
      onComplete(client.name, calculatedTMB)
    } else if (onUpdate) {
      onUpdate(calculatedTMB, client.name)
    }
    
    if (onNext) {
      onNext()
    }
  }

  useEffect(() => {
    if (client.age && client.weight && client.height) {
      const clientData: Client = {
        name: client.name,
        age: Number(client.age),
        weight: Number(client.weight),
        height: Number(client.height),
        gender: client.gender
      }
      const calculatedTMB = calculateTMB(clientData)
      setTmb(calculatedTMB)
    }
  }, [client.age, client.weight, client.height, client.gender])

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <Typography variant="h5" gutterBottom>
        Step 1: Calculate Basal Metabolic Rate (TMB)
      </Typography>
      
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}
      
      <Box sx={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            label="Client Name"
            variant="outlined"
            value={client.name}
            onChange={handleInputChange('name')}
            required
            sx={{ flex: '1 1 300px' }}
          />
          <TextField
            fullWidth
            select
            label="Gender"
            variant="outlined"
            value={client.gender}
            onChange={handleInputChange('gender')}
            sx={{ flex: '1 1 200px' }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            label="Age (years)"
            variant="outlined"
            type="number"
            value={client.age}
            onChange={handleInputChange('age')}
            required
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            fullWidth
            label="Weight (kg)"
            variant="outlined"
            type="number"
            value={client.weight}
            onChange={handleInputChange('weight')}
            required
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            fullWidth
            label="Height (cm)"
            variant="outlined"
            type="number"
            value={client.height}
            onChange={handleInputChange('height')}
            required
            sx={{ flex: '1 1 200px' }}
          />
        </Box>
        
        {tmb && (
          <Alert severity="info">
            <Typography variant="h6">
              Basal Metabolic Rate (TMB): {Math.round(tmb)} calories/day
            </Typography>
            <Typography variant="body2">
              This is the number of calories your body needs at rest to maintain basic life functions.
            </Typography>
          </Alert>
        )}
        
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
            disabled={!tmb || errors.length > 0}
            sx={{ backgroundColor: '#2e7d32' }}
          >
            Continue to Diet Builder
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TMBStep 