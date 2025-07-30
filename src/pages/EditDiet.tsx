import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  TextField,
  useTheme,
  alpha,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { motion } from 'framer-motion'
import TMBStep from '../components/TMBStep'
import DietBuilder from '../components/DietBuilder'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import { convertDietToTemplate } from '../utils/templateUtils'
import type { Diet, Client, Supplement, DynamicMeal, CustomGoal } from '../types'

const EditDiet = () => {
  const theme = useTheme()
  const { id } = useParams<{ id: string }>()
  const { diets, updateDiet, loadingDiets, addDietTemplate } = useFirebase()
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotifications()

  const [activeStep, setActiveStep] = useState(1)
  const [diet, setDiet] = useState<Diet | null>(null)
  const [tmbData, setTmbData] = useState({ tmb: 0, clientName: '' })
  const [dietName, setDietName] = useState('')
  
  // Estados para el diálogo de guardar como plantilla
  const [saveAsTemplateDialog, setSaveAsTemplateDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateCategory, setTemplateCategory] = useState('custom')

  // Buscar la dieta por ID
  useEffect(() => {
    if (id && diets.length > 0) {
      const foundDiet = diets.find(d => d.id === id)

      if (foundDiet) {
        setDiet(foundDiet)
        setTmbData({
          tmb: foundDiet.tmb || 0,
          clientName: foundDiet.clientName || ''
        })
        setDietName(foundDiet.name || `Diet for ${foundDiet.clientName}`)
      }
    }
  }, [id, diets])

  const handleTMBComplete = (clientName: string, tmb: number, clientData?: Client, newDietName?: string) => {
    setTmbData({ tmb, clientName })
    if (newDietName) {
      setDietName(newDietName)
    }
    if (diet) {
      // Limpiar el objeto clientData para eliminar campos undefined
      let cleanClientData = undefined
      if (clientData) {
        cleanClientData = Object.fromEntries(
          Object.entries(clientData).filter(([, value]) => value !== undefined)
        ) as Client
      }
      
      setDiet(prev => prev ? {
        ...prev,
        tmb,
        clientName,
        clientData: cleanClientData || prev.clientData
      } : null)
    }
    setActiveStep(1)
  }

  const handleDietSave = async (meals: Diet['meals'], supplements?: Supplement[], mealDefinitions?: DynamicMeal[], customGoal?: CustomGoal) => {
    if (!diet) return

    const updatedDiet = {
      ...diet,
      name: dietName,
      meals,
      supplements: supplements || [],
      mealDefinitions: mealDefinitions || [],
      customGoal
    }

    const success = await updateDiet(diet.id, updatedDiet)
    if (success) {
      navigate('/diets')
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSaveAsTemplate = () => {
    if (diet) {
      setTemplateName(`${diet.name} - Plantilla`)
      setTemplateDescription(`Plantilla basada en la dieta de ${diet.clientName}`)
      setSaveAsTemplateDialog(true)
    }
  }

  const confirmSaveAsTemplate = async () => {
    if (!diet || !templateName.trim()) {
      showError('Por favor ingresa un nombre para la plantilla')
      return
    }

    try {
      const templateData = convertDietToTemplate(
        diet, 
        templateName, 
        templateDescription, 
        templateCategory
      )

      const success = await addDietTemplate(templateData)
      if (success) {
        showSuccess('Dieta guardada como plantilla correctamente')
        setSaveAsTemplateDialog(false)
        setTemplateName('')
        setTemplateDescription('')
        setTemplateCategory('custom')
      }
    } catch (error) {
      showError('Error al guardar la plantilla')
    }
  }

  const renderStepContent = (step: number) => {
    if (!diet) return null

    switch (step) {
      case 0:
        return (
          <TMBStep
            onComplete={handleTMBComplete}
            initialClientName={tmbData.clientName}
            initialTMB={tmbData.tmb}
            initialClientData={diet.clientData || null}
          />
        )
      case 1:
        return (
          <DietBuilder
            tmb={diet.tmb}
            onSave={handleDietSave}
            onBack={handleBack}
            initialMeals={diet.meals}
            initialSupplements={diet.supplements}
            initialMealDefinitions={diet.mealDefinitions}
            initialCustomGoal={diet.customGoal}
            dietName={dietName}
          />
        )
      default:
        return 'Unknown step'
    }
  }

  if (loadingDiets) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        gap: 2
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: theme.palette.primary.main,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Cargando dieta...
          </Typography>
        </motion.div>
      </Box>
    )
  }

  if (!diet) {
    return (
      <Box sx={{ 
        width: '100%', 
        px: 3,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="h6" color="error" gutterBottom sx={{ fontWeight: 600 }}>
              Dieta no encontrada
            </Typography>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => navigate('/diets')}
                startIcon={<ArrowBackIcon />}
                sx={{
                  mt: 2,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                  '&:focus': {
                    outline: 'none',
                  }
                }}
              >
                Volver a Dietas
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      width: '100%', 
      px: 3,
      minHeight: '100vh',
      py: 3,
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
      position: 'relative'
    }}>
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 200,
        height: 200,
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
        borderRadius: '50%',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <EditIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
            </motion.div>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: '-0.01em'
              }}
            >
              Editar Dieta - {diet.clientName}
            </Typography>
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              fontWeight: 500,
              lineHeight: 1.6
            }}
          >
            Editando la dieta para <strong>{diet.clientName}</strong> (TMB: {Math.round(diet.tmb).toLocaleString()} kcal)
          </Typography>

          {/* Diet Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Nombre de la Dieta"
                variant="outlined"
                value={dietName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDietName(e.target.value)}
                placeholder="Ingresa el nombre de la dieta"
                sx={{ 
                  maxWidth: '400px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                    },
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  }
                }}
              />
            </Box>
          </motion.div>

          {activeStep === 2 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                  ¡Todos los pasos completados!
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={() => navigate('/diets')}
                    sx={{
                      mt: 2,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
                      },
                      '&:focus': {
                        outline: 'none',
                      }
                    }}
                  >
                    Ir a Dietas
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box>
                {renderStepContent(activeStep)}
              </Box>
            </motion.div>
          )}
        </Paper>
      </motion.div>

      {/* Diálogo para guardar como plantilla */}
      <Dialog open={saveAsTemplateDialog} onClose={() => setSaveAsTemplateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Guardar como Plantilla</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Esta acción creará una plantilla reutilizable basada en la dieta actual de {diet?.clientName}.
          </Typography>
          
          <TextField
            fullWidth
            label="Nombre de la Plantilla"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Descripción (opcional)"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={templateCategory}
              label="Categoría"
              onChange={(e) => setTemplateCategory(e.target.value)}
            >
              <MenuItem value="weight_loss">Pérdida de Peso</MenuItem>
              <MenuItem value="muscle_gain">Ganancia Muscular</MenuItem>
              <MenuItem value="maintenance">Mantenimiento</MenuItem>
              <MenuItem value="health">Salud</MenuItem>
              <MenuItem value="custom">Personalizada</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveAsTemplateDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmSaveAsTemplate} variant="contained" color="primary">
            Guardar Plantilla
          </Button>
        </DialogActions>
      </Dialog>
=======

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              fontWeight: 500,
              lineHeight: 1.6
            }}
          >
            Editando la dieta para <strong>{diet.clientName}</strong> (TMB: {Math.round(diet.tmb).toLocaleString()} kcal)
          </Typography>

          {/* Diet Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Nombre de la Dieta"
                variant="outlined"
                value={dietName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDietName(e.target.value)}
                placeholder="Ingresa el nombre de la dieta"
                sx={{ 
                  maxWidth: '400px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                    },
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  }
                }}
              />
            </Box>
          </motion.div>

          {activeStep === 2 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                  ¡Todos los pasos completados!
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={() => navigate('/diets')}
                    sx={{
                      mt: 2,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
                      },
                      '&:focus': {
                        outline: 'none',
                      }
                    }}
                  >
                    Ir a Dietas
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box>
                {renderStepContent(activeStep)}
              </Box>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Box>
  )
}

export default EditDiet 