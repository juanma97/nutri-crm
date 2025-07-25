import React from 'react'
import { 
  Typography, 
  TextField,
  Box,
  Paper
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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Suplementación */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#9c27b0', mb: 3, fontWeight: 500 }}>
          Suplementación
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="¿Has tomado suplementos antes?"
            value={formData.lifestyleData.hasTakenSupplements}
            onChange={e => onLifestyleDataChange('hasTakenSupplements', e.target.value)}
            fullWidth
            placeholder="Describe tu experiencia con suplementos..."
          />
          <TextField
            label="¿Qué suplementos tomas actualmente?"
            value={formData.lifestyleData.currentSupplements}
            onChange={e => onLifestyleDataChange('currentSupplements', e.target.value)}
            fullWidth
            placeholder="Lista de suplementos actuales..."
          />
          <TextField
            label="¿Te gustaría tomar algún suplemento?"
            value={formData.lifestyleData.wouldLikeSupplements}
            onChange={e => onLifestyleDataChange('wouldLikeSupplements', e.target.value)}
            fullWidth
            placeholder="Suplementos que te interesan..."
          />
        </Box>
      </Paper>

      {/* Nutrición */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#9c27b0', mb: 3, fontWeight: 500 }}>
          Nutrición
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Dieta actual"
            value={formData.lifestyleData.currentDiet}
            onChange={e => onLifestyleDataChange('currentDiet', e.target.value)}
            fullWidth
            placeholder="Describe tu dieta actual..."
          />
          <TextField
            label="Efectividad de la dieta actual"
            value={formData.lifestyleData.dietEffectiveness}
            onChange={e => onLifestyleDataChange('dietEffectiveness', e.target.value)}
            fullWidth
            placeholder="¿Cómo te sientes con tu dieta actual?"
          />
          <TextField
            label="Experiencia con el hambre"
            value={formData.lifestyleData.hungerExperience}
            onChange={e => onLifestyleDataChange('hungerExperience', e.target.value)}
            fullWidth
            placeholder="¿Cómo manejas el hambre?"
          />
          <TextField
            label="Horarios de apetito"
            value={formData.lifestyleData.appetiteTiming}
            onChange={e => onLifestyleDataChange('appetiteTiming', e.target.value)}
            fullWidth
            placeholder="¿Cuándo tienes más hambre?"
          />
        </Box>
      </Paper>

      {/* Rutina Diaria */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#9c27b0', mb: 3, fontWeight: 500 }}>
          Rutina Diaria
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Hábitos de comer fuera"
            value={formData.lifestyleData.eatingOutHabits}
            onChange={e => onLifestyleDataChange('eatingOutHabits', e.target.value)}
            fullWidth
            placeholder="¿Con qué frecuencia comes fuera?"
          />
          <TextField
            label="Alergias alimentarias"
            value={formData.lifestyleData.foodAllergies}
            onChange={e => onLifestyleDataChange('foodAllergies', e.target.value)}
            fullWidth
            placeholder="Alergias conocidas..."
          />
          <TextField
            label="Alimentos que te gustan"
            value={formData.lifestyleData.likedFoods}
            onChange={e => onLifestyleDataChange('likedFoods', e.target.value)}
            fullWidth
            placeholder="Comidas favoritas..."
          />
          <TextField
            label="Alimentos que no te gustan"
            value={formData.lifestyleData.dislikedFoods}
            onChange={e => onLifestyleDataChange('dislikedFoods', e.target.value)}
            fullWidth
            placeholder="Comidas que evitas..."
          />
          <TextField
            label="Bebidas habituales"
            value={formData.lifestyleData.usualDrinks}
            onChange={e => onLifestyleDataChange('usualDrinks', e.target.value)}
            fullWidth
            placeholder="Agua, café, té, refrescos..."
          />
          <TextField
            label="Descripción del trabajo"
            value={formData.lifestyleData.workDescription}
            onChange={e => onLifestyleDataChange('workDescription', e.target.value)}
            fullWidth
            placeholder="Tipo de trabajo y horarios..."
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default NutritionTab 