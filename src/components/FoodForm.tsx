import React, { useState } from 'react'
import { 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Box,
  MenuItem 
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
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

interface FoodFormProps {
  onAddFood: (food: Omit<Food, 'id'>) => void
}

const FoodForm = ({ onAddFood }: FoodFormProps) => {
  const [formData, setFormData] = useState<FoodFormData>({
    name: '',
    group: '',
    portion: '',
    calories: '',
    proteins: '',
    fats: '',
    carbs: '',
    fiber: '',
    link: ''
  })

  const handleInputChange = (field: keyof FoodFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!formData.name || !formData.group || !formData.portion) {
      return
    }

    const newFood: Omit<Food, 'id'> = {
      name: formData.name,
      group: formData.group,
      portion: formData.portion,
      calories: Number(formData.calories) || 0,
      proteins: Number(formData.proteins) || 0,
      fats: Number(formData.fats) || 0,
      carbs: Number(formData.carbs) || 0,
      fiber: Number(formData.fiber) || 0,
      link: formData.link
    }

    onAddFood(newFood)
    
    setFormData({
      name: '',
      group: '',
      portion: '',
      calories: '',
      proteins: '',
      fats: '',
      carbs: '',
      fiber: '',
      link: ''
    })
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Food
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
              label="Portion (g/ml/unit)"
              variant="outlined"
              size="small"
              value={formData.portion}
              onChange={handleInputChange('portion')}
              required
            />
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
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ backgroundColor: '#2e7d32' }}
            >
              Add Food
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default FoodForm 