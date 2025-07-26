import React from 'react'
import { 
  Typography, 
  TextField,
  Box,
  Paper,
  useTheme,
  alpha
} from '@mui/material'
import type { ClientFormData } from '../types'

interface NutritionTabProps {
  formData: ClientFormData
  onLifestyleDataChange: (field: string, value: string) => void
}

const NutritionTab: React.FC<NutritionTabProps> = ({ 
  formData, 
  onLifestyleDataChange 
}) => {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Suplementación */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
        }}
      >
        <Typography variant="h6" sx={{ 
          color: theme.palette.secondary.main, 
          mb: 3, 
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Suplementación
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="¿Has tomado suplementos antes?"
            value={formData.lifestyleData.hasTakenSupplements}
            onChange={e => onLifestyleDataChange('hasTakenSupplements', e.target.value)}
            fullWidth
            placeholder="Describe tu experiencia con suplementos..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="¿Qué suplementos tomas actualmente?"
            value={formData.lifestyleData.currentSupplements}
            onChange={e => onLifestyleDataChange('currentSupplements', e.target.value)}
            fullWidth
            placeholder="Lista de suplementos actuales..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="¿Te gustaría tomar algún suplemento?"
            value={formData.lifestyleData.wouldLikeSupplements}
            onChange={e => onLifestyleDataChange('wouldLikeSupplements', e.target.value)}
            fullWidth
            placeholder="Suplementos que te interesan..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
        </Box>
      </Paper>

      {/* Nutrición */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
        }}
      >
        <Typography variant="h6" sx={{ 
          color: theme.palette.secondary.main, 
          mb: 3, 
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Nutrición
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Dieta actual"
            value={formData.lifestyleData.currentDiet}
            onChange={e => onLifestyleDataChange('currentDiet', e.target.value)}
            fullWidth
            placeholder="Describe tu dieta actual..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="Efectividad de la dieta actual"
            value={formData.lifestyleData.dietEffectiveness}
            onChange={e => onLifestyleDataChange('dietEffectiveness', e.target.value)}
            fullWidth
            placeholder="¿Cómo te sientes con tu dieta actual?"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="Experiencia con el hambre"
            value={formData.lifestyleData.hungerExperience}
            onChange={e => onLifestyleDataChange('hungerExperience', e.target.value)}
            fullWidth
            placeholder="¿Cómo manejas el hambre?"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="Horarios de apetito"
            value={formData.lifestyleData.appetiteTiming}
            onChange={e => onLifestyleDataChange('appetiteTiming', e.target.value)}
            fullWidth
            placeholder="¿Cuándo tienes más hambre?"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
        </Box>
      </Paper>

      {/* Rutina Diaria */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
        }}
      >
        <Typography variant="h6" sx={{ 
          color: theme.palette.secondary.main, 
          mb: 3, 
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Rutina Diaria
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Hábitos de comer fuera"
            value={formData.lifestyleData.eatingOutHabits}
            onChange={e => onLifestyleDataChange('eatingOutHabits', e.target.value)}
            fullWidth
            placeholder="¿Con qué frecuencia comes fuera?"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="Alergias alimentarias"
            value={formData.lifestyleData.foodAllergies}
            onChange={e => onLifestyleDataChange('foodAllergies', e.target.value)}
            fullWidth
            placeholder="Alergias conocidas..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="Alimentos que te gustan"
            value={formData.lifestyleData.likedFoods}
            onChange={e => onLifestyleDataChange('likedFoods', e.target.value)}
            fullWidth
            placeholder="Comidas favoritas..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="Alimentos que no te gustan"
            value={formData.lifestyleData.dislikedFoods}
            onChange={e => onLifestyleDataChange('dislikedFoods', e.target.value)}
            fullWidth
            placeholder="Comidas que evitas..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="Bebidas habituales"
            value={formData.lifestyleData.usualDrinks}
            onChange={e => onLifestyleDataChange('usualDrinks', e.target.value)}
            fullWidth
            placeholder="Agua, café, té, refrescos..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
          <TextField
            label="Descripción del trabajo"
            value={formData.lifestyleData.workDescription}
            onChange={e => onLifestyleDataChange('workDescription', e.target.value)}
            fullWidth
            placeholder="Tipo de trabajo y horarios..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                }
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default NutritionTab 