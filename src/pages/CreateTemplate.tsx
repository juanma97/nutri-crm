import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Create as CreateIcon,
  LibraryBooks as LibraryIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import type { Diet, Supplement, DynamicMeal, CustomGoal } from '../types'

const steps = ['Información Básica', 'Construir Plantilla']

const CreateTemplate = () => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [templateData, setTemplateData] = useState<Omit<Diet, 'id' | 'createdAt' | 'shareId' | 'clientName' | 'tmb' | 'clientData'>>({
    name: '',
    description: '',
    category: 'custom',
    isTemplate: true,
    meals: {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {}
    }
  })
  
  const { addDietTemplate } = useFirebase()
  const navigate = useNavigate()

  const handleBasicInfoComplete = (name: string, description: string, category: string) => {
    setTemplateData(prev => ({
      ...prev,
      name,
      description,
      category
    }))
    setActiveStep(1)
  }

  const handleTemplateSave = async (meals: Diet['meals'], supplements?: Supplement[], mealDefinitions?: DynamicMeal[], customGoal?: CustomGoal) => {
    const currentTemplateData = {
      ...templateData,
      meals,
      supplements: supplements || [],
      mealDefinitions: mealDefinitions || [],
      customGoal
    }
    
    const success = await addDietTemplate(currentTemplateData)
    if (success) {
      navigate('/templates')
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep 
            onComplete={handleBasicInfoComplete}
            initialName={templateData.name}
            initialDescription={templateData.description || ''}
            initialCategory={templateData.category || 'custom'}
          />
        )
      case 1:
        return (
          <DietBuilder
            onSave={handleTemplateSave}
            onBack={handleBack}
            initialMeals={templateData.meals}
            initialSupplements={templateData.supplements}
            initialMealDefinitions={templateData.mealDefinitions}
            initialCustomGoal={templateData.customGoal}
            dietName={templateData.name}
            isTemplate={true}
          />
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ width: '100%', py: 3, px: { xs: 2, sm: 3 } }}>
      {/* Header mejorado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Tooltip title="Volver a Plantillas">
              <IconButton
                onClick={() => navigate('/templates')}
                sx={{ 
                  mr: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: theme.palette.primary.main, 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CreateIcon sx={{ fontSize: 32 }} />
                Crear Nueva Plantilla
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Crea una dieta completa reutilizable para optimizar tu trabajo
              </Typography>
            </Box>
          </Box>

          {/* Información contextual */}
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              '& .MuiAlert-icon': {
                color: theme.palette.info.main
              }
            }}
            icon={<InfoIcon />}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              <strong>💡 Importante:</strong> Las plantillas son dietas completas y funcionales. 
              Puedes añadir días, comidas y alimentos exactamente igual que en una dieta de cliente. 
              La única diferencia es que no están asignadas a ningún cliente específico.
            </Typography>
          </Alert>
        </Box>
      </motion.div>

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          {/* Stepper mejorado */}
          <Box sx={{ mb: 4 }}>
            <Stepper 
              activeStep={activeStep} 
              sx={{
                '& .MuiStepLabel-root .Mui-completed': {
                  color: theme.palette.success.main,
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: theme.palette.primary.main,
                },
                '& .MuiStepLabel-label': {
                  fontWeight: 600,
                }
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    StepIconProps={{
                      sx: {
                        '&.Mui-completed': {
                          color: theme.palette.success.main,
                        },
                        '&.Mui-active': {
                          color: theme.palette.primary.main,
                        }
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Contenido del paso */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </AnimatePresence>
        </Paper>
      </motion.div>
    </Box>
  )
}

// Componente para la información básica mejorado
interface BasicInfoStepProps {
  onComplete: (name: string, description: string, category: string) => void
  initialName: string
  initialDescription: string
  initialCategory: string
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onComplete, initialName, initialDescription, initialCategory }) => {
  const theme = useTheme()
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [category, setCategory] = useState(initialCategory)

  const handleNext = () => {
    if (!name.trim()) {
      alert('El nombre de la plantilla es obligatorio')
      return
    }
    onComplete(name, description, category)
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'weight_loss':
        return {
          label: 'Pérdida de Peso',
          description: 'Dietas enfocadas en reducir peso de forma saludable',
          color: theme.palette.error.main,
          icon: '⚖️'
        }
      case 'muscle_gain':
        return {
          label: 'Ganancia Muscular',
          description: 'Planes para aumentar masa muscular y fuerza',
          color: theme.palette.warning.main,
          icon: '💪'
        }
      case 'maintenance':
        return {
          label: 'Mantenimiento',
          description: 'Dietas para mantener peso y salud actual',
          color: theme.palette.info.main,
          icon: '🔄'
        }
      case 'health':
        return {
          label: 'Salud',
          description: 'Enfoque en bienestar general y prevención',
          color: theme.palette.success.main,
          icon: '❤️'
        }
      default:
        return {
          label: 'Personalizada',
          description: 'Plantilla con objetivos específicos personalizados',
          color: theme.palette.grey[600],
          icon: '🎯'
        }
    }
  }

  const categoryInfo = getCategoryInfo(category)

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar 
            sx={{ 
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: 48,
              height: 48
            }}
          >
            <AssignmentIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Información Básica de la Plantilla
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define los detalles fundamentales de tu nueva plantilla
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Nombre de la Plantilla"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Dieta Mediterránea, Plan de Pérdida de Peso..."
                required
                helperText="Un nombre descriptivo para identificar la plantilla"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={category}
                  label="Categoría"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.3),
                    },
                  }}
                >
                  <MenuItem value="weight_loss">Pérdida de Peso</MenuItem>
                  <MenuItem value="muscle_gain">Ganancia Muscular</MenuItem>
                  <MenuItem value="maintenance">Mantenimiento</MenuItem>
                  <MenuItem value="health">Salud</MenuItem>
                  <MenuItem value="custom">Personalizada</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el propósito y características de esta plantilla..."
                multiline
                rows={4}
                helperText="Opcional: Añade detalles sobre cuándo y cómo usar esta plantilla"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card 
              elevation={2} 
              sx={{ 
                height: 'fit-content',
                background: `linear-gradient(135deg, ${alpha(categoryInfo.color, 0.1)} 0%, ${alpha(categoryInfo.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(categoryInfo.color, 0.2)}`,
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h4">{categoryInfo.icon}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: categoryInfo.color }}>
                    {categoryInfo.label}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {categoryInfo.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
                  <Typography variant="caption" color="text.secondary">
                    Categoría seleccionada
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!name.trim()}
            startIcon={<LibraryIcon />}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
              '&:disabled': {
                background: alpha(theme.palette.action.disabled, 0.12),
                color: theme.palette.action.disabled,
              }
            }}
          >
            Continuar a Construir Plantilla
          </Button>
        </Box>
      </motion.div>
    </Box>
  )
}

export default CreateTemplate 