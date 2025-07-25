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
  Divider,
  useTheme,
  alpha
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
import { motion } from 'framer-motion'
import { 
  Person, 
  HealthAndSafety, 
  FitnessCenter, 
  Restaurant
} from '@mui/icons-material'

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
  const theme = useTheme()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addClient, updateClient, getClientById, loadingClients } = useFirebase()
  const { showError } = useNotifications()
  
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`
      }}>
        <CircularProgress size={60} sx={{ 
          color: theme.palette.primary.main,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }} />
      </Box>
    )
  }

  return (
    <Box sx={{ 
      width: '100%', 
      py: 3, 
      px: 3,
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            {id ? 'Editar Cliente' : 'Agregar Cliente'}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/clients')}
            disabled={loading}
            sx={{
              border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              color: theme.palette.primary.main,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              py: 1.5,
              px: 3,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                border: `2px solid ${theme.palette.primary.main}`,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }}
          >
            Volver
          </Button>
        </Box>
      </motion.div>

      {/* Error Alert */}
      {Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 8px 32px ${alpha(theme.palette.error.main, 0.1)}`
            }}
          >
            <Alert severity="error" sx={{
              backgroundColor: 'transparent',
              '& .MuiAlert-icon': {
                color: theme.palette.error.main
              }
            }}>
              <Typography variant="body2" fontWeight={500}>
                Por favor, completa los campos requeridos en la sección "Información del Cliente"
              </Typography>
            </Alert>
          </Paper>
        </motion.div>
      )}

      {/* Main Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
          }}
        >
        {/* Tabs Navigation */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: alpha(theme.palette.divider, 0.2), 
          mb: 3 
        }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Client form tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
                fontSize: '0.9rem',
                color: theme.palette.text.secondary,
                borderRadius: '8px 8px 0 0',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  color: theme.palette.primary.main
                },
                '&:focus': {
                  outline: 'none'
                },
                '&:focus-visible': {
                  outline: 'none'
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                borderRadius: '2px 2px 0 0'
              }
            }}
          >
            <Tab 
              icon={<Person sx={{ fontSize: 20, mb: 0.5 }} />}
              label="Información del Cliente"
              iconPosition="top"
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<HealthAndSafety sx={{ fontSize: 20, mb: 0.5 }} />}
              label="Salud"
              iconPosition="top"
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<FitnessCenter sx={{ fontSize: 20, mb: 0.5 }} />}
              label="Entrenamiento"
              iconPosition="top"
              {...a11yProps(2)} 
            />
            <Tab 
              icon={<Restaurant sx={{ fontSize: 20, mb: 0.5 }} />}
              label="Nutrición"
              iconPosition="top"
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
          <Divider sx={{ 
            my: 3,
            borderColor: alpha(theme.palette.divider, 0.2),
            borderWidth: 1
          }} />
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
                sx={{
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  color: theme.palette.primary.main,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    border: `2px solid ${theme.palette.primary.main}`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`
                  }
                }}
              >
                Anterior
              </Button>
            )}
            
            {tabValue < 3 && (
              <Button
                variant="outlined"
                onClick={() => setTabValue(tabValue + 1)}
                disabled={loading}
                sx={{
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  color: theme.palette.primary.main,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    border: `2px solid ${theme.palette.primary.main}`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`
                  }
                }}
              >
                Siguiente
              </Button>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.9rem',
                py: 1.5,
                px: 3,
                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
                },
                '&:disabled': {
                  background: `linear-gradient(135deg, ${theme.palette.grey[400]} 0%, ${alpha(theme.palette.grey[400], 0.8)} 100%)`,
                  color: theme.palette.grey[600],
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Guardando...' : (id ? 'Actualizar Cliente' : 'Guardar Cliente')}
            </Button>
          </Box>
        </form>
        </Paper>
        </motion.div>
      </Box>
    )
  }

export default ClientForm 