import React, { useMemo } from 'react'
import { 
  Typography, 
  TextField, 
  FormControl, 
 
  MenuItem, 
  Chip, 
  Alert,
  Box,
  Paper
} from '@mui/material'
import type { ClientFormData } from '../types'

interface ClientInfoTabProps {
  formData: ClientFormData
  onFormDataChange: (field: keyof ClientFormData, value: string) => void
  onPersonalDataChange: (field: string, value: string) => void
  errors: Partial<ClientFormData>
  isEditMode: boolean
}

const ClientInfoTab: React.FC<ClientInfoTabProps> = ({ 
  formData, 
  onFormDataChange, 
  onPersonalDataChange, 
  errors, 
  isEditMode 
}) => {
  // Calcular edad automáticamente desde fecha de nacimiento
  const calculatedAge = useMemo(() => {
    if (formData.personalData.birthDate) {
      const birthDate = new Date(formData.personalData.birthDate)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age > 0 ? age.toString() : ''
    }
    return ''
  }, [formData.personalData.birthDate])

  const handleBirthDateChange = (value: string) => {
    onPersonalDataChange('birthDate', value)
    // Calcular edad inmediatamente si hay fecha
    if (value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age > 0) {
        onFormDataChange('age', age.toString())
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Información Personal */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#1976d2', mb: 3, fontWeight: 500 }}>
          Información Personal
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Nombre completo"
            value={formData.name}
            onChange={(e) => onFormDataChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            fullWidth
            placeholder="Nombre y apellidos"
          />
          <TextField
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => onFormDataChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
            placeholder="tu@email.com"
          />
          <TextField
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => onFormDataChange('phone', e.target.value)}
            fullWidth
            placeholder="+34 600 000 000"
          />
          <FormControl fullWidth>
            <TextField
              select
              label="Género"
              value={formData.gender}
              onChange={(e) => onFormDataChange('gender', e.target.value)}
              fullWidth
            >
              <MenuItem value="">Seleccionar género</MenuItem>
              <MenuItem value="male">Masculino</MenuItem>
              <MenuItem value="female">Femenino</MenuItem>
              <MenuItem value="other">Otro</MenuItem>
            </TextField>
          </FormControl>
          <TextField
            type="date"
            label="Fecha de nacimiento"
            value={formData.personalData.birthDate}
            onChange={(e) => handleBirthDateChange(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Edad"
            value={formData.age}
            onChange={(e) => onFormDataChange('age', e.target.value)}
            error={!!errors.age}
            helperText={errors.age}
            required
            fullWidth
            placeholder="Edad en años"
            InputProps={{
              endAdornment: calculatedAge && calculatedAge === formData.age && (
                <Chip 
                  label="Calculada" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              )
            }}
          />
        </Box>
      </Paper>

      {/* Estado del Cliente */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#1976d2', mb: 3, fontWeight: 500 }}>
          Estado del Cliente
        </Typography>
        
        <FormControl fullWidth>
          <TextField
            select
            label="Estado"
            value={formData.status}
            onChange={(e) => onFormDataChange('status', e.target.value)}
            fullWidth
          >
            <MenuItem value="active">Activo</MenuItem>
            <MenuItem value="inactive">Inactivo</MenuItem>
            <MenuItem value="completed">Completado</MenuItem>
          </TextField>
        </FormControl>
      </Paper>

      {/* Dirección */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#1976d2', mb: 3, fontWeight: 500 }}>
          Dirección
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Dirección"
            value={formData.personalData.address}
            onChange={(e) => onPersonalDataChange('address', e.target.value)}
            fullWidth
            placeholder="Calle, número, piso..."
          />
          <TextField
            label="Ciudad"
            value={formData.personalData.city}
            onChange={(e) => onPersonalDataChange('city', e.target.value)}
            fullWidth
            placeholder="Madrid, Barcelona..."
          />
        </Box>
      </Paper>

      {/* Medidas Físicas */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#2e7d32', mb: 3, fontWeight: 500 }}>
          Medidas Físicas
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            type="number"
            label="Peso (kg)"
            value={formData.weight}
            onChange={(e) => onFormDataChange('weight', e.target.value)}
            error={!!errors.weight}
            helperText={errors.weight}
            required
            fullWidth
            placeholder="70"
            InputProps={{ inputProps: { min: 0, step: 0.1 } }}
          />
          <TextField
            type="number"
            label="Altura (cm)"
            value={formData.height}
            onChange={(e) => onFormDataChange('height', e.target.value)}
            error={!!errors.height}
            helperText={errors.height}
            required
            fullWidth
            placeholder="170"
            InputProps={{ inputProps: { min: 0, step: 1 } }}
          />
        </Box>
      </Paper>

      {/* Objetivos y Actividad */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#2e7d32', mb: 3, fontWeight: 500 }}>
          Objetivos y Actividad
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <FormControl fullWidth>
            <TextField
              select
              label="Nivel de actividad"
              value={formData.activityLevel}
              onChange={(e) => onFormDataChange('activityLevel', e.target.value)}
              fullWidth
            >
              <MenuItem value="sedentary">Sedentario</MenuItem>
              <MenuItem value="lightly_active">Ligeramente activo</MenuItem>
              <MenuItem value="moderately_active">Moderadamente activo</MenuItem>
              <MenuItem value="very_active">Muy activo</MenuItem>
              <MenuItem value="extremely_active">Extremadamente activo</MenuItem>
            </TextField>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              select
              label="Objetivo principal"
              value={formData.goal}
              onChange={(e) => onFormDataChange('goal', e.target.value)}
              fullWidth
            >
              <MenuItem value="lose_weight">Perder peso</MenuItem>
              <MenuItem value="gain_weight">Ganar peso</MenuItem>
              <MenuItem value="maintain_weight">Mantener peso</MenuItem>
              <MenuItem value="gain_muscle">Ganar músculo</MenuItem>
              <MenuItem value="improve_fitness">Mejorar condición física</MenuItem>
              <MenuItem value="general_health">Salud general</MenuItem>
            </TextField>
          </FormControl>
        </Box>
      </Paper>

      {/* Información de Contacto */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#1976d2', mb: 3, fontWeight: 500 }}>
          Información de Contacto
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="¿Cómo nos conociste?"
            value={formData.personalData.howDidYouKnow}
            onChange={(e) => onPersonalDataChange('howDidYouKnow', e.target.value)}
            fullWidth
            placeholder="Redes sociales, recomendación..."
          />
          <TextField
            label="¿Por qué elegiste nuestros servicios?"
            value={formData.personalData.whyChooseServices}
            onChange={(e) => onPersonalDataChange('whyChooseServices', e.target.value)}
            fullWidth
            placeholder="Motivos de elección..."
          />
        </Box>
      </Paper>

      {/* Notas Adicionales */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#1976d2', mb: 3, fontWeight: 500 }}>
          Notas Adicionales
        </Typography>
        
        <TextField
          label="Notas adicionales"
          value={formData.notes}
          onChange={(e) => onFormDataChange('notes', e.target.value)}
          multiline
          rows={4}
          fullWidth
          placeholder="Cualquier información adicional relevante..."
        />
      </Paper>

      {/* Alerta para modo edición */}
      {isEditMode && (formData.personalData.firstName || formData.personalData.lastName) && (
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Nota:</strong> Los campos "Nombre" y "Apellidos" se han consolidado en "Nombre completo" para evitar duplicidades.
            Los datos existentes se mantienen en el sistema.
          </Typography>
        </Alert>
      )}
    </Box>
  )
}

export default ClientInfoTab 