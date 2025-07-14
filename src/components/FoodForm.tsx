// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Box,
  MenuItem 
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import type { Food, FoodFormData } from '../types'

const foodGroups = [
  'Vegetables',
  'Fruits', 
  'Grains',
  'Proteins',
  'Dairy',
  'Fats',
  'Beverages'
]

const unit = [
  'gr',
  'ml', 
  'unit'
]

interface FoodFormProps {
  food?: Food | null
  onSave: (food: Omit<Food, 'id'>) => Promise<void>
  onCancel: () => void
}

const FoodForm = ({ food, onSave, onCancel }: FoodFormProps) => {
  const [formData, setFormData] = useState<FoodFormData>({
    name: '',
    group: '',
    portion: '',
    unitOfMeasure: '',
    calories: '',
    proteins: '',
    fats: '',
    carbs: '',
    fiber: '',
    link: ''
  })
  const [loading, setLoading] = useState(false)

  // Cargar datos del alimento si estamos editando
  useEffect(() => {
    if (food) {
      setFormData({
        name: food?.name,
        group: food?.group,
        portion: food?.portion,
        unitOfMeasure: food?.unitOfMeasure || 'unit',
        calories: food?.calories?.toString(),
        proteins: food?.proteins?.toString(),
        fats: food?.fats?.toString(),
        carbs: food?.carbs?.toString(),
        fiber: food?.fiber?.toString(),
        link: food.link
      })
    }
  }, [food])

  const handleInputChange = (field: keyof FoodFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!formData.name || !formData.group || !formData.portion || !formData.unitOfMeasure) {
      return
    }

    setLoading(true)

    try {
      const newFood: Omit<Food, 'id'> = {
        name: formData.name,
        group: formData.group,
        portion: formData.portion,
        unitOfMeasure: formData.unitOfMeasure,
        calories: Number(formData.calories) || 0,
        proteins: Number(formData.proteins) || 0,
        fats: Number(formData.fats) || 0,
        carbs: Number(formData.carbs) || 0,
        fiber: Number(formData.fiber) || 0,
        link: formData.link
      }

      await onSave(newFood)
      
      // Solo limpiar el formulario si no estamos editando
      if (!food) {
        setFormData({
          name: '',
          group: '',
          portion: '',
          unitOfMeasure:'',
          calories: '',
          proteins: '',
          fats: '',
          carbs: '',
          fiber: '',
          link: ''
        })
      }
    } catch (error) {
      console.error('Error saving food:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {food ? 'Edit Food' : 'Add New Food'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Food Name"
              variant="outlined"
              size="small"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Food Group"
              variant="outlined"
              size="small"
              value={formData.group}
              onChange={handleInputChange('group')}
              required
              disabled={loading}
            >
              {foodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Portion"
              variant="outlined"
              size="small"
              value={formData.portion}
              onChange={handleInputChange('portion')}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Unit of measure"
              variant="outlined"
              size="small"
              value={formData.unitOfMeasure}
              onChange={handleInputChange('unitOfMeasure')}
              required
              disabled={loading}
            >
              {unit.map((ut) => (
                <MenuItem key={ut} value={ut}>
                  {ut}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Calories"
              variant="outlined"
              size="small"
              type="number"
              value={formData.calories}
              onChange={handleInputChange('calories')}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Proteins (g)"
              variant="outlined"
              size="small"
              type="number"
              value={formData.proteins}
              onChange={handleInputChange('proteins')}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fats (g)"
              variant="outlined"
              size="small"
              type="number"
              value={formData.fats}
              onChange={handleInputChange('fats')}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Carbohydrates (g)"
              variant="outlined"
              size="small"
              type="number"
              value={formData.carbs}
              onChange={handleInputChange('carbs')}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Fiber (g)"
              variant="outlined"
              size="small"
              type="number"
              value={formData.fiber}
              onChange={handleInputChange('fiber')}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Product Link (optional)"
              variant="outlined"
              size="small"
              value={formData.link}
              onChange={handleInputChange('link')}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={food ? <SaveIcon /> : <AddIcon />}
                disabled={loading}
                sx={{ backgroundColor: '#2e7d32' }}
              >
                {loading ? 'Saving...' : (food ? 'Save Changes' : 'Add Food')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default FoodForm 