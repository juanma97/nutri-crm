import React from 'react'
import { 
  Typography, 
  TextField,
  Box,
  Paper
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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Experiencia y Preferencias de Entrenamiento */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#ff9800', mb: 3, fontWeight: 500 }}>
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
          />
          <TextField
            label="Ejercicios que no te gustan"
            value={formData.trainingAndGoals.dislikedExercises}
            onChange={e => onTrainingAndGoalsChange('dislikedExercises', e.target.value)}
            fullWidth
            placeholder="Ejercicios que prefieres evitar..."
          />
          <TextField
            label="Ejercicios preferidos"
            value={formData.trainingAndGoals.preferredExercises}
            onChange={e => onTrainingAndGoalsChange('preferredExercises', e.target.value)}
            fullWidth
            placeholder="Ejercicios que más te gustan..."
          />
        </Box>
      </Paper>

      {/* Planificación y Disponibilidad */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#ff9800', mb: 3, fontWeight: 500 }}>
          Planificación y Disponibilidad
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Días preferidos para entrenar"
            value={formData.trainingAndGoals.preferredTrainingDays}
            onChange={e => onTrainingAndGoalsChange('preferredTrainingDays', e.target.value)}
            fullWidth
            placeholder="Lunes, miércoles, viernes..."
          />
          <TextField
            label="Días realistas para entrenar"
            value={formData.trainingAndGoals.realisticTrainingDays}
            onChange={e => onTrainingAndGoalsChange('realisticTrainingDays', e.target.value)}
            fullWidth
            placeholder="Cuántos días puedes entrenar realmente..."
          />
          <TextField
            label="Horario preferido para entrenar"
            value={formData.trainingAndGoals.trainingTimeOfDay}
            onChange={e => onTrainingAndGoalsChange('trainingTimeOfDay', e.target.value)}
            fullWidth
            placeholder="Mañana, tarde, noche..."
          />
          <TextField
            label="Cardio actual"
            value={formData.trainingAndGoals.currentCardio}
            onChange={e => onTrainingAndGoalsChange('currentCardio', e.target.value)}
            fullWidth
            placeholder="Running, bicicleta, natación..."
          />
        </Box>
      </Paper>

      {/* Objetivos y Lesiones */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#ff9800', mb: 3, fontWeight: 500 }}>
          Objetivos y Lesiones
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Deportes que practicas"
            value={formData.trainingAndGoals.sportsPracticed}
            onChange={e => onTrainingAndGoalsChange('sportsPracticed', e.target.value)}
            fullWidth
            placeholder="Fútbol, tenis, baloncesto..."
          />
          <TextField
            label="Historial de lesiones"
            value={formData.trainingAndGoals.injuryHistory}
            onChange={e => onTrainingAndGoalsChange('injuryHistory', e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Describe cualquier lesión previa..."
          />
          <TextField
            label="Objetivos principales"
            value={formData.trainingAndGoals.mainGoals}
            onChange={e => onTrainingAndGoalsChange('mainGoals', e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="¿Qué quieres lograr con el entrenamiento?"
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default TrainingTab 