import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper } from '@mui/material'
import FoodForm from '../components/FoodForm'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { Food } from '../types'

const FoodFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addFood, updateFood, foods } = useFirebase()
  const { showSuccess, showError } = useNotifications()
  
  const [food, setFood] = useState<Food | null>(null)

  useEffect(() => {
    if (id && id !== 'new') {
      const foundFood = foods.find(f => f.id === id)
      if (foundFood) {
        setFood(foundFood)
      }
    }
  }, [id, foods])

  const handleSave = async (foodData: Omit<Food, 'id'>) => {
    try {
      if (id && id !== 'new') {
        await updateFood(id, foodData)
        showSuccess('Alimento actualizado correctamente')
      } else {
        await addFood(foodData)
        showSuccess('Alimento agregado correctamente')
      }
      navigate('/foods')
    } catch {
      showError('Error al guardar el alimento')
    }
  }

  const handleCancel = () => {
    navigate('/foods')
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <FoodForm 
          food={food}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Paper>
    </Box>
  )
}

export default FoodFormPage 