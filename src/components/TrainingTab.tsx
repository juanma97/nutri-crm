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

interface TrainingTabProps {
  formData: ClientFormData
  onTrainingAndGoalsChange: (field: string, value: string) => void
}

const TrainingTab: React.FC<TrainingTabProps> = ({ 
  formData, 
  onTrainingAndGoalsChange 
}) => {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Experiencia y Preferencias de Entrenamiento */}
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
          color: theme.palette.warning.main, 
          mb: 3, 
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Experiencia y Preferencias
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Historial de entrenamiento actual"
            value={formData.trainingAndGoals.currentTrainingHistory}
            onChange={e => onTrainingAndGoalsChange('currentTrainingHistory', e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Describe tu experiencia actual con el entrenamiento..."
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
            label="Ejercicios que no te gustan"
            value={formData.trainingAndGoals.dislikedExercises}
            onChange={e => onTrainingAndGoalsChange('dislikedExercises', e.target.value)}
            fullWidth
            placeholder="Ejercicios que prefieres evitar..."
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
            label="Ejercicios preferidos"
            value={formData.trainingAndGoals.preferredExercises}
            onChange={e => onTrainingAndGoalsChange('preferredExercises', e.target.value)}
            fullWidth
            placeholder="Ejercicios que más te gustan..."
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

      {/* Planificación y Disponibilidad */}
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
          color: theme.palette.warning.main, 
          mb: 3, 
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Planificación y Disponibilidad
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Días preferidos para entrenar"
            value={formData.trainingAndGoals.preferredTrainingDays}
            onChange={e => onTrainingAndGoalsChange('preferredTrainingDays', e.target.value)}
            fullWidth
            placeholder="Lunes, miércoles, viernes..."
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
            label="Días realistas para entrenar"
            value={formData.trainingAndGoals.realisticTrainingDays}
            onChange={e => onTrainingAndGoalsChange('realisticTrainingDays', e.target.value)}
            fullWidth
            placeholder="Cuántos días puedes entrenar realmente..."
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
            label="Horario preferido para entrenar"
            value={formData.trainingAndGoals.trainingTimeOfDay}
            onChange={e => onTrainingAndGoalsChange('trainingTimeOfDay', e.target.value)}
            fullWidth
            placeholder="Mañana, tarde, noche..."
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
            label="Cardio actual"
            value={formData.trainingAndGoals.currentCardio}
            onChange={e => onTrainingAndGoalsChange('currentCardio', e.target.value)}
            fullWidth
            placeholder="Running, bicicleta, natación..."
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

      {/* Objetivos y Lesiones */}
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
          color: theme.palette.warning.main, 
          mb: 3, 
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Objetivos y Lesiones
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Deportes que practicas"
            value={formData.trainingAndGoals.sportsPracticed}
            onChange={e => onTrainingAndGoalsChange('sportsPracticed', e.target.value)}
            fullWidth
            placeholder="Fútbol, tenis, baloncesto..."
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
            label="Historial de lesiones"
            value={formData.trainingAndGoals.injuryHistory}
            onChange={e => onTrainingAndGoalsChange('injuryHistory', e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Describe cualquier lesión previa..."
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
            label="Objetivos principales"
            value={formData.trainingAndGoals.mainGoals}
            onChange={e => onTrainingAndGoalsChange('mainGoals', e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="¿Qué quieres lograr con el entrenamiento?"
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

export default TrainingTab 