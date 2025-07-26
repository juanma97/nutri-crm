import React from 'react'
import { 
  Typography, 
  TextField, 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Checkbox, 
  Slider, 
  Box,
  Paper,
  useTheme,
  alpha
} from '@mui/material'
import type { ClientFormData } from '../types'

interface HealthTabProps {
  formData: ClientFormData
  onHealthQuestionChange: (questionKey: string, field: 'answer' | 'comments', value: 'yes' | 'no' | null | string) => void
  onHealthInfoChange: (field: string, value: string | number | boolean) => void
}

const HealthTab: React.FC<HealthTabProps> = ({
  formData,
  onHealthQuestionChange,
  onHealthInfoChange
}) => {
  const theme = useTheme()
  const parqQuestions = [
    {
      key: 'respiratoryHeartDisease',
      question: '¿Padeces alguna enfermedad respiratoria o de corazón?',
      icon: '🫁'
    },
    {
      key: 'muscleJointInjuries',
      question: '¿Tienes lesiones o problemas musculares o articulares?',
      icon: '💪'
    },
    {
      key: 'herniasLoadWork',
      question: '¿Tienes hernias u otras afecciones similares que puedan dificultar el trabajo con cargas?',
      icon: '⚠️'
    },
    {
      key: 'sleepProblems',
      question: '¿Tienes problemas para conciliar el sueño?',
      icon: '😴'
    },
    {
      key: 'smoking',
      question: '¿Fumas? Si es así, ¿cuánto?',
      icon: '🚬'
    },
    {
      key: 'alcoholConsumption',
      question: '¿Bebes alcohol? Si es así, ¿qué bebidas y qué cantidad consumes?',
      icon: '🍷'
    },
    {
      key: 'chronicDiseases',
      question: '¿Padeces de hipertensión, diabetes o alguna enfermedad crónica?',
      icon: '🏥'
    },
    {
      key: 'highCholesterol',
      question: '¿Tienes el colesterol alto?',
      icon: '❤️'
    }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Cuestionario PAR-Q */}
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
          color: theme.palette.error.main, 
          mb: 3, 
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Cuestionario PAR-Q
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {parqQuestions.map((item) => (
            <Paper 
              key={item.key} 
              elevation={0} 
              sx={{ 
                p: 3, 
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                borderRadius: 2,
                backdropFilter: 'blur(5px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.1)}`
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ 
                  mr: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>
                  {item.icon}
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ 
                  flex: 1,
                  color: theme.palette.text.primary,
                  lineHeight: 1.5
                }}>
                  {item.question}
                </Typography>
              </Box>
              
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <RadioGroup
                  row
                  value={formData.healthInfo.parqQuestions[item.key as keyof typeof formData.healthInfo.parqQuestions].answer || ''}
                  onChange={(e) => onHealthQuestionChange(item.key, 'answer', e.target.value as 'yes' | 'no')}
                  sx={{
                    '& .MuiFormControlLabel-root': {
                      marginRight: 3,
                      '& .MuiRadio-root': {
                        color: alpha(theme.palette.primary.main, 0.5),
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        }
                      },
                      '& .MuiFormControlLabel-label': {
                        fontWeight: 500,
                        color: theme.palette.text.primary
                      }
                    }
                  }}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
              
              <TextField
                label="Comentarios adicionales"
                value={formData.healthInfo.parqQuestions[item.key as keyof typeof formData.healthInfo.parqQuestions].comments || ''}
                onChange={(e) => onHealthQuestionChange(item.key, 'comments', e.target.value)}
                multiline
                rows={2}
                fullWidth
                placeholder="Proporciona más detalles si es necesario..."
                size="small"
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
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Información de Salud Personal */}
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
          color: theme.palette.error.main, 
          mb: 3, 
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Información de Salud Personal
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <TextField
            label="Enfermedades diagnosticadas"
            value={formData.healthInfo.diseases}
            onChange={(e) => onHealthInfoChange('diseases', e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Lista de enfermedades o condiciones médicas..."
          />
          <TextField
            label="Grupo sanguíneo"
            value={formData.healthInfo.bloodType}
            onChange={(e) => onHealthInfoChange('bloodType', e.target.value)}
            fullWidth
            placeholder="A+, B-, O+, AB+..."
          />
        </Box>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          Condiciones específicas
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.healthInfo.isSmoker}
                onChange={(e) => onHealthInfoChange('isSmoker', e.target.checked)}
                color="error"
              />
            }
            label="Fumador"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.healthInfo.isDiabetic}
                onChange={(e) => onHealthInfoChange('isDiabetic', e.target.checked)}
                color="error"
              />
            }
            label="Diabético"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.healthInfo.isCeliac}
                onChange={(e) => onHealthInfoChange('isCeliac', e.target.checked)}
                color="error"
              />
            }
            label="Celíaco"
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <TextField
            label="Intolerancias alimentarias"
            value={formData.healthInfo.foodIntolerances}
            onChange={(e) => onHealthInfoChange('foodIntolerances', e.target.value)}
            fullWidth
            placeholder="Lactosa, gluten, etc..."
          />
        </Box>
      </Paper>

      {/* Niveles de Estrés */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#d32f2f', mb: 3, fontWeight: 500 }}>
          Niveles de Estrés
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Nivel de estrés laboral (1-10)
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={formData.healthInfo.workStressLevel}
                onChange={(_, value) => onHealthInfoChange('workStressLevel', value as number)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
                color="error"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Bajo
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Alto
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Nivel de estrés personal (1-10)
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={formData.healthInfo.personalStressLevel}
                onChange={(_, value) => onHealthInfoChange('personalStressLevel', value as number)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
                color="error"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Bajo
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Alto
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Comentarios Adicionales */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#d32f2f', mb: 3, fontWeight: 500 }}>
          Comentarios Adicionales
        </Typography>
        
        <TextField
          label="Comentarios adicionales sobre salud"
          value={formData.healthInfo.additionalComments}
          onChange={(e) => onHealthInfoChange('additionalComments', e.target.value)}
          multiline
          rows={4}
          fullWidth
          placeholder="Cualquier información adicional relevante sobre tu salud..."
        />
      </Paper>
    </Box>
  )
}

export default HealthTab 