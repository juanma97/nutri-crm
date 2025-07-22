import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Typography,
  Paper,
  Divider
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { ClientFormData, Client } from '../types'
import ClientInfoTab from '../components/ClientInfoTab'
import HealthTab from '../components/HealthTab'
import TrainingTab from '../components/TrainingTab'
import NutritionTab from '../components/NutritionTab'
import { buildClientData, validateClientData, optimizeClientData } from '../utils/clientDataBuilder'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `client-tab-${index}`,
    'aria-controls': `client-tabpanel-${index}`,
  }
}

const ClientForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addClient, updateClient, getClientById, loadingClients } = useFirebase()
  const { showSuccess, showError } = useNotifications()
  
  const [loading, setLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)
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
    },
    personalData: {
      firstName: '',
      lastName: '',
      birthDate: '',
      address: '',
      city: '',
      howDidYouKnow: '',
      whyChooseServices: ''
    },
    healthInfo: {
      parqQuestions: {
        respiratoryHeartDisease: { question: '¿Padeces alguna enfermedad respiratoria o de corazón?', answer: null },
        muscleJointInjuries: { question: '¿Tienes lesiones o problemas musculares o articulares?', answer: null },
        herniasLoadWork: { question: '¿Tienes hernias u otras afecciones similares que puedan dificultar el trabajo con cargas?', answer: null },
        sleepProblems: { question: '¿Tienes problemas para conciliar el sueño?', answer: null },
        smoking: { question: '¿Fumas? Si es así, ¿cuánto?', answer: null },
        alcoholConsumption: { question: '¿Bebes alcohol? Si es así, ¿qué bebidas y qué cantidad consumes?', answer: null },
        chronicDiseases: { question: '¿Padeces de hipertensión, diabetes o alguna enfermedad crónica?', answer: null },
        highCholesterol: { question: '¿Tienes el colesterol alto?', answer: null }
      },
      additionalComments: '',
      diseases: '',
      bloodType: '',
      isSmoker: false,
      isDiabetic: false,
      isCeliac: false,
      foodIntolerances: '',
      workStressLevel: 5,
      personalStressLevel: 5
    },
    trainingAndGoals: {
      currentTrainingHistory: '',
      dislikedExercises: '',
      preferredExercises: '',
      preferredTrainingDays: '',
      realisticTrainingDays: '',
      currentCardio: '',
      trainingTimeOfDay: '',
      sportsPracticed: '',
      injuryHistory: '',
      mainGoals: ''
    },
    lifestyleData: {
      hasTakenSupplements: '',
      currentSupplements: '',
      wouldLikeSupplements: '',
      currentDiet: '',
      dietEffectiveness: '',
      hungerExperience: '',
      appetiteTiming: '',
      eatingOutHabits: '',
      foodAllergies: '',
      likedFoods: '',
      dislikedFoods: '',
      usualDrinks: '',
      workDescription: ''
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
          },
          personalData: {
            firstName: client.personalData?.firstName || '',
            lastName: client.personalData?.lastName || '',
            birthDate: client.personalData?.birthDate || '',
            phone: client.personalData?.phone || client.phone || '',
            address: client.personalData?.address || '',
            city: client.personalData?.city || '',
            howDidYouKnow: client.personalData?.howDidYouKnow || '',
            whyChooseServices: client.personalData?.whyChooseServices || ''
          },
          healthInfo: client.healthInfo || {
            parqQuestions: {
              respiratoryHeartDisease: { question: '¿Padeces alguna enfermedad respiratoria o de corazón?', answer: null },
              muscleJointInjuries: { question: '¿Tienes lesiones o problemas musculares o articulares?', answer: null },
              herniasLoadWork: { question: '¿Tienes hernias u otras afecciones similares que puedan dificultar el trabajo con cargas?', answer: null },
              sleepProblems: { question: '¿Tienes problemas para conciliar el sueño?', answer: null },
              smoking: { question: '¿Fumas? Si es así, ¿cuánto?', answer: null },
              alcoholConsumption: { question: '¿Bebes alcohol? Si es así, ¿qué bebidas y qué cantidad consumes?', answer: null },
              chronicDiseases: { question: '¿Padeces de hipertensión, diabetes o alguna enfermedad crónica?', answer: null },
              highCholesterol: { question: '¿Tienes el colesterol alto?', answer: null }
            },
            additionalComments: '',
            diseases: '',
            bloodType: '',
            isSmoker: false,
            isDiabetic: false,
            isCeliac: false,
            foodIntolerances: '',
            workStressLevel: 5,
            personalStressLevel: 5
          },
          trainingAndGoals: client.trainingAndGoals || {
            currentTrainingHistory: '',
            dislikedExercises: '',
            preferredExercises: '',
            preferredTrainingDays: '',
            realisticTrainingDays: '',
            currentCardio: '',
            trainingTimeOfDay: '',
            sportsPracticed: '',
            injuryHistory: '',
            mainGoals: ''
          },
          lifestyleData: client.lifestyleData || {
            hasTakenSupplements: '',
            currentSupplements: '',
            wouldLikeSupplements: '',
            currentDiet: '',
            dietEffectiveness: '',
            hungerExperience: '',
            appetiteTiming: '',
            eatingOutHabits: '',
            foodAllergies: '',
            likedFoods: '',
            dislikedFoods: '',
            usualDrinks: '',
            workDescription: ''
          }
        })
      }
    }
  }, [id, getClientById])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

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

    // Edad es obligatoria
    if (!formData.age || !formData.age.trim()) {
      newErrors.age = 'La edad es requerida'
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = 'Edad inválida'
    }

    // Altura es obligatoria
    if (!formData.height || !formData.height.trim()) {
      newErrors.height = 'La altura es requerida'
    } else if (isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
      newErrors.height = 'Altura inválida'
    }

    // Peso es obligatorio
    if (!formData.weight || !formData.weight.trim()) {
      newErrors.weight = 'El peso es requerido'
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Peso inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setTabValue(0) // Ir a la primera tab si hay errores
      return
    }

    setLoading(true)
    try {
      // Obtener datos del cliente anterior si estamos editando
      const previousClient = id ? getClientById(id) : undefined
      
      // Construir el objeto ClientData usando las funciones modulares
      let clientData = buildClientData(formData, previousClient, !!id)
      
      // Validar que los datos sean consistentes
      if (!validateClientData(clientData)) {
        throw new Error('Los datos del cliente no son válidos')
      }
      
      // Optimizar el objeto eliminando campos vacíos innecesarios
      clientData = optimizeClientData(clientData)

      let success = false
      if (id) {
        // Para actualización, usar Partial<Client>
        const updateData: Partial<Client> = { ...clientData }
        success = await updateClient(id, updateData)
      } else {
        success = await addClient(clientData)
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

  const handlePersonalDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalData: {
        ...prev.personalData,
        [field]: value
      }
    }))
  }

  const handleHealthQuestionChange = (questionKey: string, field: 'answer' | 'comments', value: 'yes' | 'no' | null | string) => {
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        parqQuestions: {
          ...prev.healthInfo.parqQuestions,
          [questionKey]: {
            ...prev.healthInfo.parqQuestions[questionKey as keyof typeof prev.healthInfo.parqQuestions],
            [field]: value
          }
        }
      }
    }))
  }

  const handleHealthInfoChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [field]: value
      }
    }))
  }

  const handleTrainingAndGoalsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      trainingAndGoals: {
        ...prev.trainingAndGoals,
        [field]: value
      }
    }))
  }

  const handleLifestyleDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyleData: {
        ...prev.lifestyleData,
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
    <Box sx={{ width: '100%', height: '100vw', py: 3, px: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {id ? 'Editar Cliente' : 'Agregar Cliente'}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/clients')}
          disabled={loading}
        >
          Volver
        </Button>
      </Box>

      {/* Error Alert */}
      {Object.keys(errors).length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Alert severity="error">
            <Typography variant="body2" fontWeight={500}>
              Por favor, completa los campos requeridos en la sección "Información del Cliente"
            </Typography>
          </Alert>
        </Paper>
      )}

      {/* Main Form Container */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Client form tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
                fontSize: '0.9rem',
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'text.primary',
                  fontWeight: 700
                }
              },
              '& .MuiTabs-indicator': {
                height: 2,
                bgcolor: '#2e7d32'
              }
            }}
          >
            <Tab 
              label="Información del Cliente"
              {...a11yProps(0)} 
            />
            <Tab 
              label="Salud"
              {...a11yProps(1)} 
            />
            <Tab 
              label="Entrenamiento"
              {...a11yProps(2)} 
            />
            <Tab 
              label="Nutrición"
              {...a11yProps(3)} 
            />
          </Tabs>
        </Box>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {/* Tab 1: Información del Cliente */}
          <TabPanel value={tabValue} index={0}>
            <ClientInfoTab
              formData={formData}
              onFormDataChange={handleInputChange}
              onPersonalDataChange={handlePersonalDataChange}
              errors={errors}
              isEditMode={!!id}
            />
          </TabPanel>

          {/* Tab 2: Salud */}
          <TabPanel value={tabValue} index={1}>
            <HealthTab
              formData={formData}
              onHealthQuestionChange={handleHealthQuestionChange}
              onHealthInfoChange={handleHealthInfoChange}
            />
          </TabPanel>

          {/* Tab 3: Entrenamiento */}
          <TabPanel value={tabValue} index={2}>
            <TrainingTab
              formData={formData}
              onTrainingAndGoalsChange={handleTrainingAndGoalsChange}
            />
          </TabPanel>

          {/* Tab 4: Nutrición y Suplementación */}
          <TabPanel value={tabValue} index={3}>
            <NutritionTab
              formData={formData}
              onLifestyleDataChange={handleLifestyleDataChange}
            />
          </TabPanel>

          {/* Action Buttons Section */}
          <Divider sx={{ my: 3 }} />
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2, 
              justifyContent: 'flex-end',
              alignItems: { xs: 'stretch', sm: 'center' }
            }}
          >
            {tabValue > 0 && (
              <Button
                variant="outlined"
                onClick={() => setTabValue(tabValue - 1)}
                disabled={loading}
              >
                Anterior
              </Button>
            )}
            
            {tabValue < 3 && (
              <Button
                variant="outlined"
                onClick={() => setTabValue(tabValue + 1)}
                disabled={loading}
              >
                Siguiente
              </Button>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: '#2e7d32' }}
            >
              {loading ? 'Guardando...' : (id ? 'Actualizar Cliente' : 'Guardar Cliente')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default ClientForm 