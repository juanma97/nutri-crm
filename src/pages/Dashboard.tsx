
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material'
import {
  PeopleAlt as PeopleIcon,
  Restaurant as DietIcon,
  TrendingUp as TrendingIcon,
  LocalDining as FoodIcon,
  Assessment as AnalyticsIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  PriorityHigh as PriorityIcon,
  AccessTime as TimeIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  EmojiEvents as TrophyIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material'
import { 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Line,
  ComposedChart,
  Legend
} from 'recharts'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const COLORS = {
  primary: '#2e7d32',
  secondary: '#1976d2',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  purple: '#9c27b0',
  orange: '#ff5722',
  teal: '#009688',
  pink: '#e91e63'
}

const Dashboard = () => {
  const { diets, clients } = useFirebase()
  const navigate = useNavigate()

  // Obtener nombre del nutricionista (por ahora hardcodeado, después se puede conectar con auth)
  const nutritionistName = "" // TODO: Conectar con sistema de autenticación
  
  // Obtener hora actual
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })

  // === MÉTRICAS DE CLIENTES ACTIVOS Y ALERTAS ===
  
  const now = new Date()
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Clientes que necesitan seguimiento (última actualización > 2 semanas)
  const clientsNeedingFollowUp = clients.filter(client => {
    const lastUpdate = client.updatedAt ? new Date(client.updatedAt) : new Date(client.createdAt)
    return lastUpdate < twoWeeksAgo && client.status === 'active'
  })

  // Clientes con dietas vencidas (creadas hace > 1 mes)
  const clientsWithExpiredDiets = clients.filter(client => {
    const clientDiet = diets.find(diet => diet.clientName === client.name)
    if (!clientDiet) return false
    const dietDate = new Date(clientDiet.createdAt)
    return dietDate < oneMonthAgo && client.status === 'active'
  })

  // Clientes nuevos (última semana)
  const newClients = clients.filter(client => {
    const clientDate = new Date(client.createdAt)
    return clientDate > oneWeekAgo
  })

  // Clientes sin dieta asignada
  const clientsWithoutDiet = clients.filter(client => {
    const hasDiet = diets.some(diet => diet.clientName === client.name)
    return !hasDiet && client.status === 'active'
  })

  // Análisis de objetivos de clientes activos
  const activeClients = clients.filter(client => client.status === 'active')
  const goalDistribution = activeClients.reduce((acc, client) => {
    const goal = client.goal || 'unknown'
    acc[goal] = (acc[goal] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const goalData = Object.entries(goalDistribution).map(([goal, count]) => ({
    name: goal === 'lose_weight' ? 'Perder Peso' :
          goal === 'maintain' ? 'Mantener' :
          goal === 'gain_weight' ? 'Ganar Peso' :
          goal === 'muscle_gain' ? 'Ganar Músculo' :
          goal === 'health' ? 'Salud' : 'Sin Definir',
    value: count,
    color: goal === 'lose_weight' ? COLORS.success :
           goal === 'maintain' ? COLORS.info :
           goal === 'gain_weight' ? COLORS.warning :
           goal === 'muscle_gain' ? COLORS.purple :
           goal === 'health' ? COLORS.teal : COLORS.error
  }))

  // Métricas de rendimiento
  const performanceMetrics = {
    totalActiveClients: activeClients.length,
    clientsNeedingFollowUp: clientsNeedingFollowUp.length,
    clientsWithExpiredDiets: clientsWithExpiredDiets.length,
    newClients: newClients.length,
    clientsWithoutDiet: clientsWithoutDiet.length,
    totalDiets: diets.length,
    averageDietsPerClient: diets.length / activeClients.length || 0,
    retentionRate: Math.round((activeClients.length / clients.length) * 100) || 0
  }

  // Datos para gráfico de tendencias de clientes activos
  const clientTrends = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleDateString('es-ES', { month: 'short' })
    
    const monthClients = clients.filter(client => {
      const clientDate = new Date(client.createdAt)
      return clientDate.getMonth() === date.getMonth() && clientDate.getFullYear() === date.getFullYear()
    })

    const activeMonthClients = clients.filter(client => {
      const clientDate = new Date(client.createdAt)
      return clientDate.getMonth() === date.getMonth() && clientDate.getFullYear() === date.getFullYear() && client.status === 'active'
    })

    return {
      month: monthName,
      total: monthClients.length,
      active: activeMonthClients.length
    }
  }).reverse()

  return (
    <Box sx={{ width: '100%', py: 3, px: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ 
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}>
            Bienvenido {nutritionistName} - Hora actual: {currentTime}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Panel de clientes activos y alertas prioritarias
          </Typography>
        </Box>
      </motion.div>

      {/* Alertas Inmediatas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PriorityIcon sx={{ color: COLORS.error, mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.error }}>
              Alertas Inmediatas
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2 
          }}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${COLORS.error} 0%, ${COLORS.orange} 100%)`,
              color: 'white',
              boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Badge badgeContent={performanceMetrics.clientsNeedingFollowUp} color="warning">
                  <TimeIcon sx={{ fontSize: 48, mb: 2, color: 'white' }} />
                </Badge>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2, 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {performanceMetrics.clientsNeedingFollowUp}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Necesitan Seguimiento
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: `linear-gradient(135deg, ${COLORS.warning} 0%, ${COLORS.orange} 100%)`,
              color: 'white',
              boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Badge badgeContent={performanceMetrics.clientsWithExpiredDiets} color="error">
                  <DietIcon sx={{ fontSize: 48, mb: 2, color: 'white' }} />
                </Badge>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2, 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {performanceMetrics.clientsWithExpiredDiets}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Dietas Vencidas
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: `linear-gradient(135deg, ${COLORS.info} 0%, ${COLORS.secondary} 100%)`,
              color: 'white',
              boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Badge badgeContent={performanceMetrics.clientsWithoutDiet} color="warning">
                  <PersonAddIcon sx={{ fontSize: 48, mb: 2, color: 'white' }} />
                </Badge>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2, 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {performanceMetrics.clientsWithoutDiet}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Sin Dieta Asignada
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: `linear-gradient(135deg, ${COLORS.success} 0%, ${COLORS.teal} 100%)`,
              color: 'white',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Badge badgeContent={performanceMetrics.newClients} color="primary">
                  <PeopleIcon sx={{ fontSize: 48, mb: 2, color: 'white' }} />
                </Badge>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2, 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {performanceMetrics.newClients}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Clientes Nuevos
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </motion.div>

      {/* Acciones Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Paper elevation={0} sx={{ 
          p: 3,
          mb: 4,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            🚀 Acciones Rápidas
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2 
          }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/clients/new')}
              sx={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                color: 'white',
                py: 2,
                borderRadius: 2,
                '&:hover': {
                  background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              Nuevo Cliente
            </Button>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<DietIcon />}
              onClick={() => navigate('/diets/new')}
              sx={{
                background: `linear-gradient(135deg, ${COLORS.success} 0%, ${COLORS.teal} 100%)`,
                color: 'white',
                py: 2,
                borderRadius: 2,
                '&:hover': {
                  background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.success} 100%)`,
                  transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              Crear Dieta
            </Button>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<FoodIcon />}
              onClick={() => navigate('/foods/new')}
              sx={{
                background: `linear-gradient(135deg, ${COLORS.warning} 0%, ${COLORS.orange} 100%)`,
                color: 'white',
                py: 2,
                borderRadius: 2,
                '&:hover': {
                  background: `linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.warning} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              Agregar Alimento
            </Button>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate('/reports')}
              sx={{
                background: `linear-gradient(135deg, ${COLORS.purple} 0%, ${COLORS.pink} 100%)`,
                color: 'white',
                py: 2,
                borderRadius: 2,
                '&:hover': {
                  background: `linear-gradient(135deg, ${COLORS.pink} 0%, ${COLORS.purple} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              Ver Reportes
            </Button>
          </Box>
        </Paper>
      </motion.div>

      {/* Panel de Clientes Activos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3, 
          mb: 4 
        }}>
          {/* Lista de Clientes que Necesitan Seguimiento */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            height: 500,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <WarningIcon sx={{ color: COLORS.warning, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Clientes que Necesitan Seguimiento
              </Typography>
            </Box>
            
            {clientsNeedingFollowUp.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckIcon sx={{ fontSize: 60, color: COLORS.success, mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  ¡Excelente! Todos los clientes están al día
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {clientsNeedingFollowUp.slice(0, 8).map((client) => (
                  <ListItem key={client.id} sx={{ 
                    mb: 1, 
                    borderRadius: 2,
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.2)'
                  }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: COLORS.warning }}>
                        {client.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={client.name}
                      secondary={`Última actualización: ${new Date(client.updatedAt || client.createdAt).toLocaleDateString('es-ES')}`}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver cliente">
                        <IconButton size="small" onClick={() => navigate(`/clients/${client.id}`)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar cliente">
                        <IconButton size="small" onClick={() => navigate(`/clients/edit/${client.id}`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          {/* Distribución de Objetivos */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            height: 500,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PsychologyIcon sx={{ color: COLORS.primary, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Distribución de Objetivos
              </Typography>
            </Box>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {goalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [`${value} clientes`, 'Cantidad']} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </motion.div>

      {/* Métricas de Rendimiento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3, 
          mb: 4 
        }}>
          <Paper elevation={0} sx={{ 
            p: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingIcon sx={{ color: COLORS.primary, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Tendencias de Clientes
              </Typography>
            </Box>
            
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={clientTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="total" fill={COLORS.info} radius={[4, 4, 0, 0]} name="Total Clientes" />
                <Line yAxisId="right" type="monotone" dataKey="active" stroke={COLORS.success} strokeWidth={3} name="Clientes Activos" />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>

          <Paper elevation={0} sx={{ 
            p: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrophyIcon sx={{ color: COLORS.primary, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Métricas de Éxito
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tasa de Retención
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.success }}>
                  {performanceMetrics.retentionRate}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={performanceMetrics.retentionRate} 
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Clientes Activos
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.primary }}>
                  {performanceMetrics.totalActiveClients}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Promedio Dietas/Cliente
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.secondary }}>
                  {performanceMetrics.averageDietsPerClient.toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Box>
  )
}

export default Dashboard 