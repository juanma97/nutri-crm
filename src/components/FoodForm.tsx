import React, { useState, useEffect } from 'react'
import { 
  TextField, 
  Button, 
  Typography, 
  Box,
  MenuItem,
  useTheme,
  alpha,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import NutritionIcon from '@mui/icons-material/MonitorWeight'
import { motion } from 'framer-motion'
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

  const commonTextFieldProps = {
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.3s ease',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: alpha(theme.palette.primary.main, 0.5),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
        '& input': {
          color: theme.palette.text.primary,
        },
        '& input:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
          WebkitTextFillColor: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
        },
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.primary.main,
      }
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <motion.div
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {food ? (
              <SaveIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
            ) : (
              <RestaurantIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
            )}
          </motion.div>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: '-0.01em'
            }}
          >
            {food ? 'Editar Alimento' : 'Agregar Nuevo Alimento'}
          </Typography>
        </Box>
      </motion.div>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Información Básica */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Box sx={{ 
                p: 3, 
                mb: 3,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <RestaurantIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    Información Básica
                  </Typography>
                </Box>
                
                                                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                   <TextField
                     fullWidth
                     label="Nombre del Alimento"
                     variant="outlined"
                     size="small"
                     value={formData.name}
                     onChange={handleInputChange('name')}
                     required
                     disabled={loading}
                     {...commonTextFieldProps}
                   />
                   <TextField
                     fullWidth
                     select
                     label="Grupo Alimenticio"
                     variant="outlined"
                     size="small"
                     value={formData.group}
                     onChange={handleInputChange('group')}
                     required
                     disabled={loading}
                     {...commonTextFieldProps}
                   >
                     {foodGroups.map((group) => (
                       <MenuItem key={group} value={group}>
                         <Chip 
                           label={group} 
                           size="small" 
                           sx={{ 
                             mr: 1,
                             backgroundColor: alpha(theme.palette.primary.main, 0.1),
                             color: theme.palette.primary.main,
                             fontWeight: 500
                           }}
                         />
                         {group}
                       </MenuItem>
                     ))}
                   </TextField>
                   <TextField
                     fullWidth
                     label="Porción"
                     variant="outlined"
                     size="small"
                     value={formData.portion}
                     onChange={handleInputChange('portion')}
                     required
                     disabled={loading}
                     {...commonTextFieldProps}
                   />
                   <TextField
                     fullWidth
                     select
                     label="Unidad de Medida"
                     variant="outlined"
                     size="small"
                     value={formData.unitOfMeasure}
                     onChange={handleInputChange('unitOfMeasure')}
                     required
                     disabled={loading}
                     {...commonTextFieldProps}
                   >
                     {unit.map((ut) => (
                       <MenuItem key={ut} value={ut}>
                         {ut}
                       </MenuItem>
                     ))}
                   </TextField>
                 </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Información Nutricional */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ 
                p: 3, 
                mb: 3,
                borderRadius: 3,
                background: alpha(theme.palette.info.main, 0.02),
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <NutritionIcon sx={{ fontSize: 20, color: theme.palette.info.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                    Información Nutricional
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Calorías"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={formData.calories}
                    onChange={handleInputChange('calories')}
                    disabled={loading}
                    {...commonTextFieldProps}
                    sx={{
                      ...commonTextFieldProps.sx,
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.warning.main,
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.warning.main,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Proteínas (g)"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={formData.proteins}
                    onChange={handleInputChange('proteins')}
                    disabled={loading}
                    {...commonTextFieldProps}
                    sx={{
                      ...commonTextFieldProps.sx,
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.success.main,
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.success.main,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Grasas (g)"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={formData.fats}
                    onChange={handleInputChange('fats')}
                    disabled={loading}
                    {...commonTextFieldProps}
                    sx={{
                      ...commonTextFieldProps.sx,
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.info.main,
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.info.main,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Carbohidratos (g)"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={formData.carbs}
                    onChange={handleInputChange('carbs')}
                    disabled={loading}
                    {...commonTextFieldProps}
                    sx={{
                      ...commonTextFieldProps.sx,
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.secondary.main,
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.secondary.main,
                      }
                    }}
                  />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Fibra (g)"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={formData.fiber}
                    onChange={handleInputChange('fiber')}
                    disabled={loading}
                    {...commonTextFieldProps}
                  />
                  <TextField
                    fullWidth
                    label="Enlace del Producto (opcional)"
                    variant="outlined"
                    size="small"
                    value={formData.link}
                    onChange={handleInputChange('link')}
                    disabled={loading}
                    {...commonTextFieldProps}
                  />
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Botones de Acción */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderColor: alpha(theme.palette.divider, 0.3),
                      color: theme.palette.text.primary,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                      '&:focus': {
                        outline: 'none',
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (food ? <SaveIcon /> : <AddIcon />)}
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.grey[600], 0.3)
                          : alpha(theme.palette.grey[300], 0.5),
                        boxShadow: 'none',
                        transform: 'none',
                      },
                      '&:focus': {
                        outline: 'none',
                      }
                    }}
                  >
                    {loading ? 'Guardando...' : (food ? 'Guardar Cambios' : 'Agregar Alimento')}
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FoodForm 