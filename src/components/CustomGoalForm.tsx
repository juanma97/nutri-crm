import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import type { CustomGoal } from '../types'

interface CustomGoalFormProps {
  tmb: number
  initialCustomGoal?: CustomGoal
  onSave: (customGoal: CustomGoal | undefined) => void
  onCancel: () => void
}

const CustomGoalForm: React.FC<CustomGoalFormProps> = ({
  tmb,
  initialCustomGoal,
  onSave,
  onCancel
}) => {
  const [useCustomGoal, setUseCustomGoal] = useState(!!initialCustomGoal)
  const [customGoal, setCustomGoal] = useState<CustomGoal>(
    initialCustomGoal || {
      calories: Math.round(tmb),
      proteins: Math.round((tmb * 0.3) / 4), // 30% de TMB en proteínas
      carbs: Math.round((tmb * 0.45) / 4),   // 45% de TMB en carbohidratos
      fats: Math.round((tmb * 0.25) / 9),    // 25% de TMB en grasas
      fiber: 25 // Valor recomendado por defecto
    }
  )
  const [errors, setErrors] = useState<string[]>([])

  // Calcular objetivos basados en TMB
  const tmbBasedGoals = {
    calories: Math.round(tmb),
    proteins: Math.round((tmb * 0.3) / 4),
    carbs: Math.round((tmb * 0.45) / 4),
    fats: Math.round((tmb * 0.25) / 9),
    fiber: 25
  }

  // Validar que las calorías coincidan con los macronutrientes
  const validateMacros = (goal: CustomGoal): boolean => {
    const calculatedCalories = (goal.proteins * 4) + (goal.carbs * 4) + (goal.fats * 9)
    const difference = Math.abs(calculatedCalories - goal.calories)
    return difference <= 50 // Permitir diferencia de hasta 50 calorías
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (useCustomGoal) {
      if (customGoal.calories <= 0) newErrors.push('Las calorías deben ser mayores a 0')
      if (customGoal.proteins < 0) newErrors.push('Las proteínas no pueden ser negativas')
      if (customGoal.carbs < 0) newErrors.push('Los carbohidratos no pueden ser negativos')
      if (customGoal.fats < 0) newErrors.push('Las grasas no pueden ser negativas')
      if (customGoal.fiber < 0) newErrors.push('La fibra no puede ser negativa')

      if (!validateMacros(customGoal)) {
        newErrors.push('Los macronutrientes no coinciden con las calorías totales')
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    if (useCustomGoal) {
      onSave(customGoal)
    } else {
      onSave(undefined)
    }
  }

  const handleInputChange = (field: keyof CustomGoal) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value)
    setCustomGoal(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUseTMBGoals = () => {
    setCustomGoal(tmbBasedGoals)
  }

  const calculatedCalories = (customGoal.proteins * 4) + (customGoal.carbs * 4) + (customGoal.fats * 9)
  const calorieDifference = Math.abs(calculatedCalories - customGoal.calories)

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
        🎯 Configuración de Objetivos Nutricionales
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={useCustomGoal}
            onChange={(e) => setUseCustomGoal(e.target.checked)}
            color="primary"
          />
        }
        label="Usar objetivos personalizados"
        sx={{ mb: 2 }}
      />

      {!useCustomGoal ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Objetivo actual:</strong> TMB ({Math.round(tmb)} calorías)
          </Typography>
          <Typography variant="body2">
            Los cálculos se basarán en la Tasa Metabólica Basal calculada automáticamente.
          </Typography>
        </Alert>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Objetivo personalizado activado</strong>
            </Typography>
            <Typography variant="body2">
              Los cálculos de progreso se basarán en estos valores personalizados.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Calorías objetivo"
              type="number"
              value={customGoal.calories}
              onChange={handleInputChange('calories')}
              InputProps={{
                endAdornment: 'kcal'
              }}
              sx={{ flex: '1 1 300px', minWidth: '300px' }}
            />
            <TextField
              label="Proteínas objetivo"
              type="number"
              value={customGoal.proteins}
              onChange={handleInputChange('proteins')}
              InputProps={{
                endAdornment: 'g'
              }}
              sx={{ flex: '1 1 300px', minWidth: '300px' }}
            />
            <TextField
              label="Carbohidratos objetivo"
              type="number"
              value={customGoal.carbs}
              onChange={handleInputChange('carbs')}
              InputProps={{
                endAdornment: 'g'
              }}
              sx={{ flex: '1 1 300px', minWidth: '300px' }}
            />
            <TextField
              label="Grasas objetivo"
              type="number"
              value={customGoal.fats}
              onChange={handleInputChange('fats')}
              InputProps={{
                endAdornment: 'g'
              }}
              sx={{ flex: '1 1 300px', minWidth: '300px' }}
            />
            <TextField
              label="Fibra objetivo"
              type="number"
              value={customGoal.fiber}
              onChange={handleInputChange('fiber')}
              InputProps={{
                endAdornment: 'g'
              }}
              sx={{ flex: '1 1 300px', minWidth: '300px' }}
            />
            <Button
              variant="outlined"
              onClick={handleUseTMBGoals}
              sx={{ flex: '1 1 300px', minWidth: '300px', height: '56px' }}
            >
              Usar valores TMB
            </Button>
          </Box>

          {/* Validación de macronutrientes */}
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Validación de Macronutrientes:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calorías calculadas: {calculatedCalories} kcal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calorías objetivo: {customGoal.calories} kcal
              </Typography>
              <Typography 
                variant="body2" 
                color={calorieDifference <= 50 ? 'success.main' : 'error.main'}
              >
                Diferencia: {calorieDifference} kcal
                {calorieDifference > 50 && ' (Revisar valores)'}
              </Typography>
            </CardContent>
          </Card>

          {errors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.map((error, index) => (
                <Typography key={index} variant="body2">
                  • {error}
                </Typography>
              ))}
            </Alert>
          )}
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          sx={{ backgroundColor: '#2e7d32' }}
        >
          Guardar Objetivos
        </Button>
      </Box>
    </Paper>
  )
}

export default CustomGoalForm 