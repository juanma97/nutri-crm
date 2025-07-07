import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { ClientFormData, Client } from '../types'

const ClientForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addClient, updateClient, getClientById, loadingClients } = useFirebase()
  const { showSuccess, showError } = useNotifications()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    goal: 'lose_weight',
    medicalConditions: '',
    allergies: '',
    notes: '',
    status: 'active',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  })

  const [errors, setErrors] = useState<Partial<ClientFormData>>({})

  // Función helper para manejar edad de manera segura
  const safeParseAge = (ageValue: number | undefined): string => {
    if (ageValue === undefined || ageValue === null) return ''
    return ageValue.toString()
  }

  // Cargar datos del cliente si estamos editando
  useEffect(() => {
    if (id) {
      const client = getClientById(id)
      if (client) {
        setFormData({
          name: client.name,
          email: client.email,
          phone: client.phone || '',
          age: safeParseAge(client.age),
          gender: client.gender || '',
          weight: client.weight?.toString() || '',
          height: client.height?.toString() || '',
          activityLevel: client.activityLevel || 'sedentary',
          goal: client.goal || 'lose_weight',
          medicalConditions: client.medicalConditions || '',
          allergies: client.allergies || '',
          notes: client.notes || '',
          status: client.status || 'active',
          emergencyContact: client.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          }
        })
      }
    }
  }, [id, getClientById])

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Edad es obligatoria en creación
    if (!id && !formData.age) {
      newErrors.age = 'La edad es requerida'
    }

    if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) <= 0)) {
      newErrors.height = 'Altura inválida'
    }

    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0)) {
      newErrors.weight = 'Peso inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // Preparar los datos del cliente
      const clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        gender: (formData.gender || '') as 'male' | 'female' | '',
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        medicalConditions: formData.medicalConditions || '',
        allergies: formData.allergies || '',
        notes: formData.notes || '',
        status: formData.status,
        emergencyContact: formData.emergencyContact
      }

      // Manejar la edad de manera especial
      if (formData.age) {
        const parsedAge = Number(formData.age)
        if (!isNaN(parsedAge) && parsedAge > 0) {
          clientData.age = parsedAge
        }
      } else if (id) {
        // En edición, si no hay edad en el formulario, mantener la original
        const originalClient = getClientById(id)
        if (originalClient?.age) {
          clientData.age = originalClient.age
        }
      } else {
        // En creación, la edad es obligatoria (ya validada arriba)
        throw new Error('La edad es requerida')
      }

      let success = false
      if (id) {
        // Para actualización, usar Partial<Client>
        const updateData: Partial<Client> = { ...clientData }
        success = await updateClient(id, updateData)
        if (success) showSuccess('Cliente actualizado correctamente')
      } else {
        success = await addClient(clientData)
        if (success) showSuccess('Cliente agregado correctamente')
      }

      if (success) {
        navigate('/clients')
      }
    } catch (error) {
      console.error('Error saving client:', error)
      showError('Error al guardar cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleEmergencyContactChange = (field: keyof typeof formData.emergencyContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }))
  }

  if (loadingClients) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {id ? 'Editar Cliente' : 'Agregar Cliente'}
      </Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Información Personal */}
            <Typography variant="h6" sx={{ color: '#2e7d32' }}>
              Información Personal
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Nombre completo *"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                sx={{ flex: '1 1 300px' }}
              />

              <TextField
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
                sx={{ flex: '1 1 300px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                sx={{ flex: '1 1 300px' }}
              />

              <TextField
                label={id ? "Edad" : "Edad *"}
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                error={!!errors.age}
                helperText={errors.age}
                required={!id}
                inputProps={{ min: 1, max: 120 }}
                sx={{ flex: '1 1 300px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ flex: '1 1 300px' }}>
                <InputLabel>Género</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  label="Género"
                >
                  <MenuItem value="">No especificado</MenuItem>
                  <MenuItem value="male">Masculino</MenuItem>
                  <MenuItem value="female">Femenino</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ flex: '1 1 300px' }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="completed">Completado</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Medidas */}
            <Typography variant="h6" sx={{ color: '#2e7d32', mt: 2 }}>
              Medidas
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Altura (cm)"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                error={!!errors.height}
                helperText={errors.height}
                inputProps={{ min: 0, max: 300 }}
                sx={{ flex: '1 1 300px' }}
              />

              <TextField
                label="Peso (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                error={!!errors.weight}
                helperText={errors.weight}
                inputProps={{ min: 0, max: 500 }}
                sx={{ flex: '1 1 300px' }}
              />
            </Box>

            {/* Objetivos y Actividad */}
            <Typography variant="h6" sx={{ color: '#2e7d32', mt: 2 }}>
              Objetivos y Actividad
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ flex: '1 1 300px' }}>
                <InputLabel>Nivel de actividad</InputLabel>
                <Select
                  value={formData.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  label="Nivel de actividad"
                >
                  <MenuItem value="sedentary">Sedentario</MenuItem>
                  <MenuItem value="lightly_active">Ligeramente activo</MenuItem>
                  <MenuItem value="moderately_active">Moderadamente activo</MenuItem>
                  <MenuItem value="very_active">Muy activo</MenuItem>
                  <MenuItem value="extremely_active">Extremadamente activo</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ flex: '1 1 300px' }}>
                <InputLabel>Objetivo</InputLabel>
                <Select
                  value={formData.goal}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                  label="Objetivo"
                >
                  <MenuItem value="lose_weight">Perder peso</MenuItem>
                  <MenuItem value="maintain">Mantener peso</MenuItem>
                  <MenuItem value="gain_weight">Ganar peso</MenuItem>
                  <MenuItem value="muscle_gain">Ganar músculo</MenuItem>
                  <MenuItem value="health">Mejorar salud</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Información Médica */}
            <Typography variant="h6" sx={{ color: '#2e7d32', mt: 2 }}>
              Información Médica
            </Typography>

            <TextField
              label="Condiciones médicas"
              multiline
              rows={3}
              value={formData.medicalConditions}
              onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
              placeholder="Describe cualquier condición médica relevante..."
            />

            <TextField
              label="Alergias"
              multiline
              rows={2}
              value={formData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="Lista de alergias alimentarias..."
            />

            {/* Contacto de Emergencia */}
            <Typography variant="h6" sx={{ color: '#2e7d32', mt: 2 }}>
              Contacto de Emergencia
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Nombre"
                value={formData.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                sx={{ flex: '1 1 300px' }}
              />

              <TextField
                label="Teléfono"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                sx={{ flex: '1 1 300px' }}
              />

              <TextField
                label="Relación"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                sx={{ flex: '1 1 300px' }}
              />
            </Box>

            {/* Notas */}
            <TextField
              label="Notas adicionales"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notas adicionales sobre el cliente..."
            />

            {/* Botones */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/clients')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ backgroundColor: '#2e7d32' }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  id ? 'Actualizar Cliente' : 'Agregar Cliente'
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default ClientForm 