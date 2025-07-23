// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Box,
  MenuItem,
  Paper,
  useTheme
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import RestaurantIcon from '@mui/icons-material/Restaurant'
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
  const theme = useTheme()
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
    <Paper 
      elevation={0}
      sx={{ 
        p: 4,
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.04)',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        },
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <RestaurantIcon 
          sx={{ 
            fontSize: 32, 
            color: theme.palette.primary.main,
            mr: 2
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 700
          }}
        >
          {food ? 'Editar Alimento' : 'Agregar Nuevo Alimento'}
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre del Alimento"
              variant="outlined"
              size="medium"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Grupo Alimenticio"
              variant="outlined"
              size="medium"
              value={formData.group}
              onChange={handleInputChange('group')}
              required
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
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
              label="Porción"
              variant="outlined"
              size="medium"
              value={formData.portion}
              onChange={handleInputChange('portion')}
              required
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Unidad de Medida"
              variant="outlined"
              size="medium"
              value={formData.unitOfMeasure}
              onChange={handleInputChange('unitOfMeasure')}
              required
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
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
              label="Calorías"
              variant="outlined"
              size="medium"
              type="number"
              value={formData.calories}
              onChange={handleInputChange('calories')}
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Proteínas (g)"
              variant="outlined"
              size="medium"
              type="number"
              value={formData.proteins}
              onChange={handleInputChange('proteins')}
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Grasas (g)"
              variant="outlined"
              size="medium"
              type="number"
              value={formData.fats}
              onChange={handleInputChange('fats')}
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Carbohidratos (g)"
              variant="outlined"
              size="medium"
              type="number"
              value={formData.carbs}
              onChange={handleInputChange('carbs')}
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Fibra (g)"
              variant="outlined"
              size="medium"
              type="number"
              value={formData.fiber}
              onChange={handleInputChange('fiber')}
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Enlace del Producto (opcional)"
              variant="outlined"
              size="medium"
              value={formData.link}
              onChange={handleInputChange('link')}
              disabled={loading}
              className="custom-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                startIcon={<CancelIcon />}
                className="custom-button"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={food ? <SaveIcon /> : <AddIcon />}
                disabled={loading}
                className="custom-button"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    background: theme.palette.grey[300],
                  }
                }}
              >
                {loading ? 'Guardando...' : (food ? 'Guardar Cambios' : 'Agregar Alimento')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default FoodForm 