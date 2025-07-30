import React, { useState, useEffect } from 'react'
import { 
  TextField, 
  Button, 
  Typography, 
  MenuItem,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Paper
} from '@mui/material'
import { useFirebase } from '../contexts/FirebaseContext'
import { calculateTMB } from '../utils/tmbCalculator'
import type { Client } from '../types'

interface TMBStepProps {
  onComplete?: (name: string, tmb: number, clientData?: Client, dietName?: string) => void
  onNext?: () => void
  onUpdate?: (tmb: number, clientName: string) => void
  initialClientName?: string
  initialTMB?: number
  initialClientData?: Client | null
  initialDietName?: string
  showDietNameField?: boolean
}

const TMBStep = ({ onComplete, onNext, onUpdate, initialClientName = '', initialTMB = 0, initialClientData, initialDietName = '', showDietNameField = false }: TMBStepProps) => {
  const { clients } = useFirebase()
  const [tabValue, setTabValue] = useState(0) // 0: Select client, 1: Create new
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [client, setClient] = useState({
    name: initialClientName || initialClientData?.name || '',
    age: initialClientData?.age?.toString() || '',
    weight: initialClientData?.weight?.toString() || '',
    height: initialClientData?.height?.toString() || '',
    gender: initialClientData?.gender || 'male'
  })
  const [dietName, setDietName] = useState(initialDietName || `Diet for ${initialClientName || 'Client'}`)
  const [tmb, setTmb] = useState<number | null>(initialTMB || null)
  const [errors, setErrors] = useState<string[]>([])





  const handleInputChange = (field: keyof typeof client) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClient({
      ...client,
      [field]: event.target.value
    })
  }

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId)
    const selectedClient = clients.find(c => c.id === clientId)
    if (selectedClient) {
      // Verificar que todos los datos necesarios estén presentes
      if (selectedClient.weight && selectedClient.height && selectedClient.age && selectedClient.gender) {
        const calculatedTMB = calculateTMB(selectedClient)
        setTmb(calculatedTMB)
      } else {
        setTmb(null)
        console.warn('Cliente seleccionado no tiene todos los datos necesarios:', selectedClient)
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []
    
    if (tabValue === 0) {
      if (!selectedClientId) newErrors.push('Por favor selecciona un cliente')
    } else {
      if (!client.name.trim()) newErrors.push('El nombre es requerido')
      if (!client.age) newErrors.push('La edad es requerida')
      if (!client.weight || Number(client.weight) <= 0) newErrors.push('Un peso válido es requerido')
      if (!client.height || Number(client.height) <= 0) newErrors.push('Una altura válida es requerida')
    }
    
    if (showDietNameField && !dietName.trim()) {
      newErrors.push('El nombre de la dieta es requerido')
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNext = () => {
    if (!validateForm()) return
    
    let clientData: Client | undefined
    let clientName = ''
    
    if (tabValue === 0) {
      // Usar cliente existente
      const selectedClient = clients.find(c => c.id === selectedClientId)
      if (selectedClient) {
        clientData = selectedClient
        clientName = selectedClient.name
        const calculatedTMB = calculateTMB(selectedClient)
        setTmb(calculatedTMB)
      }
    } else {
      // Crear nuevo cliente
      clientData = {
        name: client.name,
        age: Number(client.age),
        weight: Number(client.weight),
        height: Number(client.height),
        gender: client.gender
      } as Client
      clientName = client.name
      const calculatedTMB = calculateTMB(clientData)
      setTmb(calculatedTMB)
    }
    
    if (onComplete && tmb && clientName) {
      onComplete(clientName, tmb, clientData, dietName)
    } else if (onUpdate && tmb && clientName) {
      onUpdate(tmb, clientName)
    }
    
    if (onNext) {
      onNext()
    }
  }

  useEffect(() => {
    if (tabValue === 1 && client.age && client.weight && client.height) {
      const clientData: Client = {
        name: client.name,
        age: Number(client.age),
        weight: Number(client.weight),
        height: Number(client.height),
        gender: client.gender
      } as Client
      const calculatedTMB = calculateTMB(clientData)
      setTmb(calculatedTMB)
    }
  }, [client.age, client.weight, client.height, client.gender, tabValue])

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', height: '100vw', overflow: 'hidden' }}>
      <Typography variant="h5" gutterBottom>
        Paso 1: Seleccionar Cliente y Calcular TMB
      </Typography>
      
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}
      
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Seleccionar Cliente" />
        </Tabs>
      </Paper>

      {tabValue === 0 ? (
        // Seleccionar cliente existente
        <Box sx={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Seleccionar Cliente</InputLabel>
            <Select
              value={selectedClientId}
              onChange={(e) => handleClientSelect(e.target.value)}
              label="Seleccionar Cliente"
            >
              {clients.map((client) => {
                return (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name} - {client.age || 'N/A'} años, {client.weight || 'N/A'}kg, {client.height || 'N/A'}cm
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          {selectedClientId && (
            <Alert severity={tmb ? "info" : "warning"}>
              <Typography variant="h6">
                Tasa Metabólica Basal (TMB): {tmb ? Math.round(tmb) : 'No se puede calcular'} calorías/día
              </Typography>
                      <Typography variant="body2">
          {tmb 
            ? "Esta es la cantidad de calorías que tu cuerpo necesita en reposo para mantener las funciones básicas de la vida."
            : "El cliente seleccionado no tiene todos los datos requeridos (peso, altura o edad) para calcular el TMB."
          }
        </Typography>
            </Alert>
          )}
        </Box>
      ) : (
        // Crear nuevo cliente
        <Box sx={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          <TextField
                fullWidth
                label="Nombre del Cliente"
                variant="outlined"
                value={client.name}
                onChange={handleInputChange('name')}
                required
                sx={{ flex: '1 1 300px' }}
              />
              <TextField
                fullWidth
                select
                label="Género"
                variant="outlined"
                value={client.gender}
                onChange={handleInputChange('gender')}
                sx={{ flex: '1 1 200px' }}
              >
                <MenuItem value="male">Masculino</MenuItem>
                <MenuItem value="female">Femenino</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </TextField>
          </Box>


          
          {tmb && (
            <Alert severity="info">
              <Typography variant="h6">
                Tasa Metabólica Basal (TMB): {Math.round(tmb)} calorías/día
              </Typography>
              <Typography variant="body2">
                Esta es la cantidad de calorías que tu cuerpo necesita en reposo para mantener las funciones básicas de la vida.
              </Typography>
            </Alert>
          )}
        </Box>
      )}
      
      {showDietNameField && (
        <Box sx={{ mt: 3 }}>
                      <TextField
              fullWidth
              label="Nombre de la Dieta"
              variant="outlined"
              value={dietName}
              onChange={(e) => setDietName(e.target.value)}
              required
              placeholder="Ingresa un nombre para esta dieta"
              sx={{ mb: 2 }}
            />
        </Box>
      )}
      
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleNext}
          disabled={!tmb || errors.length > 0}
          sx={{ backgroundColor: '#2e7d32' }}
        >
          Continuar al Constructor de Dietas
        </Button>
      </Box>
    </Box>
  )
}

export default TMBStep 