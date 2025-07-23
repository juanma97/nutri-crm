// @ts-nocheck
import React from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Button,
  Avatar,
  Divider
} from '@mui/material'
import {
  PeopleAlt as PeopleIcon,
  Restaurant as DietIcon,
  TrendingUp as TrendingIcon,
  LocalDining as FoodIcon,
  Assessment as AnalyticsIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  ViewModule as TemplateIcon
} from '@mui/icons-material'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNavigate } from 'react-router-dom'

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
  const { diets, foods, clients, dietTemplates } = useFirebase()
  const navigate = useNavigate()

  // === MÉTRICAS NUTRICIONALES PROFESIONALES ===
  
  // Análisis de clientes por objetivo
  const clientGoals = clients.reduce((acc, client) => {
    const goal = client.goal || 'unknown'
    acc[goal] = (acc[goal] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const goalData = Object.entries(clientGoals).map(([goal, count]) => ({
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

  // Análisis de TMB por rangos nutricionales
  const tmbAnalysis = diets.reduce((acc, diet) => {
    const tmb = diet.tmb
    if (tmb < 1500) acc.bajo++
    else if (tmb < 2000) acc.moderado++
    else if (tmb < 2500) acc.alto++
    else acc.muyAlto++
    return acc
  }, { bajo: 0, moderado: 0, alto: 0, muyAlto: 0 })

  const tmbData = [
    { name: 'Bajo (<1500)', value: tmbAnalysis.bajo, color: COLORS.warning },
    { name: 'Moderado (1500-2000)', value: tmbAnalysis.moderado, color: COLORS.info },
    { name: 'Alto (2000-2500)', value: tmbAnalysis.alto, color: COLORS.success },
    { name: 'Muy Alto (>2500)', value: tmbAnalysis.muyAlto, color: COLORS.error }
  ]

  // Análisis de calidad nutricional de dietas
  const dietQualityAnalysis = diets.map(diet => {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    let totalCalories = 0
    let totalProteins = 0
    let totalFats = 0
    let totalCarbs = 0
    let totalFiber = 0
    let mealCount = 0

    daysOfWeek.forEach(day => {
      Object.values(diet.meals[day]).forEach(mealList => {
        mealList.forEach(meal => {
          totalCalories += meal.calories
          totalProteins += meal.proteins
          totalFats += meal.fats
          totalCarbs += meal.carbs
          totalFiber += meal.fiber
          mealCount++
        })
      })
    })

    const avgCalories = totalCalories / 7
    const avgProteins = totalProteins / 7
    const avgFats = totalFats / 7
    const avgCarbs = totalCarbs / 7
    const avgFiber = totalFiber / 7

    // Usar customGoal si está disponible, sino usar TMB
    const calorieTarget = diet.customGoal ? diet.customGoal.calories : diet.tmb
    const proteinTarget = diet.customGoal ? diet.customGoal.proteins : (diet.tmb * 0.3 / 4)
    
    // Calcular score de calidad (0-100)
    const calorieScore = Math.min(100, (avgCalories / calorieTarget) * 100)
    const proteinScore = Math.min(100, (avgProteins / proteinTarget) * 100)
    const fiberScore = Math.min(100, (avgFiber / 25) * 100)
    const balanceScore = 100 - Math.abs((avgProteins * 4 / avgCalories) * 100 - 30) - 
                        Math.abs((avgFats * 9 / avgCalories) * 100 - 25) - 
                        Math.abs((avgCarbs * 4 / avgCalories) * 100 - 45)

    const qualityScore = Math.round((calorieScore * 0.4 + proteinScore * 0.3 + fiberScore * 0.2 + balanceScore * 0.1))

    return {
      name: diet.clientName,
      quality: qualityScore,
      calories: Math.round(avgCalories),
      proteins: Math.round(avgProteins),
      fiber: Math.round(avgFiber),
      mealCount
    }
  }).sort((a, b) => b.quality - a.quality)

  // Top 5 dietas por calidad
  const topDiets = dietQualityAnalysis.slice(0, 5)

  // Análisis de grupos de alimentos
  const foodGroupAnalysis = foods.reduce((acc, food) => {
    acc[food.group] = (acc[food.group] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const foodGroupData = Object.entries(foodGroupAnalysis)
    .map(([group, count]) => ({ name: group, value: count }))
    .sort((a, b) => b.value - a.value)

  // Métricas de rendimiento nutricional
  const nutritionMetrics = {
    totalClients: clients.length,
    totalDiets: diets.length,
    totalTemplates: dietTemplates.length,
    totalFoods: foods.length,
    averageQuality: Math.round(dietQualityAnalysis.reduce((sum, diet) => sum + diet.quality, 0) / dietQualityAnalysis.length) || 0,
    highQualityDiets: dietQualityAnalysis.filter(diet => diet.quality >= 80).length,
    averageTMB: Math.round(diets.reduce((sum, diet) => sum + diet.tmb, 0) / diets.length) || 0,
    totalMeals: dietQualityAnalysis.reduce((sum, diet) => sum + diet.mealCount, 0),
    recentDiets: diets.filter(diet => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(diet.createdAt) > weekAgo
    }).length,
    totalTemplateUsage: dietTemplates.reduce((sum, template) => sum + template.usageCount, 0)
  }

  // Datos para gráfico de tendencias mensuales
  const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleDateString('es-ES', { month: 'short' })
    
    const monthDiets = diets.filter(diet => {
      const dietDate = new Date(diet.createdAt)
      return dietDate.getMonth() === date.getMonth() && dietDate.getFullYear() === date.getFullYear()
    })

    const avgQuality = monthDiets.length > 0 
      ? Math.round(monthDiets.reduce((sum, diet) => {
          const dietQuality = dietQualityAnalysis.find(d => d.name === diet.clientName)
          return sum + (dietQuality?.quality || 0)
        }, 0) / monthDiets.length)
      : 0

    return {
      month: monthName,
      diets: monthDiets.length,
      quality: avgQuality
    }
  }).reverse()

  // Datos para radar chart de métricas nutricionales
  const nutritionRadarData = [
    { metric: 'Calidad Promedio', value: nutritionMetrics.averageQuality, fullMark: 100 },
    { metric: 'Cobertura TMB', value: Math.round((nutritionMetrics.averageTMB / 2000) * 100), fullMark: 100 },
    { metric: 'Diversidad Alimentos', value: Math.min(100, (nutritionMetrics.totalFoods / 50) * 100), fullMark: 100 },
    { metric: 'Dietas Recientes', value: Math.min(100, (nutritionMetrics.recentDiets / 10) * 100), fullMark: 100 },
    { metric: 'Tasa de Éxito', value: Math.round((nutritionMetrics.highQualityDiets / nutritionMetrics.totalDiets) * 100), fullMark: 100 }
  ]

  return (
    <Box sx={{ width: '100%', py: 3, px: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
          📊 Panel Nutricional
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Análisis profesional de tu práctica nutricional
        </Typography>
      </Box>

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {nutritionMetrics.totalClients}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Clientes Activos
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((nutritionMetrics.totalClients / 20) * 100, 100)} 
                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <DietIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {nutritionMetrics.totalDiets}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Dietas Creadas
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((nutritionMetrics.totalDiets / 30) * 100, 100)} 
                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <TemplateIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {nutritionMetrics.totalTemplates}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Plantillas
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((nutritionMetrics.totalTemplates / 10) * 100, 100)} 
                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <StarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {nutritionMetrics.averageQuality}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Calidad Promedio
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={nutritionMetrics.averageQuality} 
                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={4} sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <CheckIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {nutritionMetrics.highQualityDiets}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Dietas Excelentes
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.round((nutritionMetrics.highQualityDiets / nutritionMetrics.totalDiets) * 100)} 
                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Análisis de Objetivos de Clientes */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              🎯 Objetivos de Clientes
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {goalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} clientes`, 'Cantidad']} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Distribución de TMB */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              📊 Distribución de TMB
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tmbData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} clientes`, 'Cantidad']} />
                <Bar dataKey="value" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Tendencias Mensuales */}
        <Grid item xs={12} md={8}>
          <Paper elevation={4} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              📈 Tendencias Mensuales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="diets" fill={COLORS.success} radius={[4, 4, 0, 0]} name="Dietas Creadas" />
                <Line yAxisId="right" type="monotone" dataKey="quality" stroke={COLORS.purple} strokeWidth={3} name="Calidad Promedio" />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Radar Chart de Métricas */}
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              ⭐ Métricas Nutricionales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={nutritionRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Rendimiento"
                  dataKey="value"
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Dietas y Análisis de Alimentos */}
      <Grid container spacing={3}>
        {/* Top 5 Dietas por Calidad */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              🏆 Top 5 Dietas por Calidad
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topDiets.map((diet, index) => (
                <Card key={index} variant="outlined" sx={{ 
                  background: index === 0 ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' : 'white'
                }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {index + 1}. {diet.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {diet.calories} cal/día • {diet.proteins}g proteínas • {diet.fiber}g fibra
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ 
                          color: diet.quality >= 90 ? COLORS.success : 
                                 diet.quality >= 80 ? COLORS.info : 
                                 diet.quality >= 70 ? COLORS.warning : COLORS.error,
                          fontWeight: 'bold'
                        }}>
                          {diet.quality}%
                        </Typography>
                        <Chip 
                          label={diet.quality >= 90 ? 'Excelente' : 
                                 diet.quality >= 80 ? 'Muy Bueno' : 
                                 diet.quality >= 70 ? 'Bueno' : 'Regular'} 
                          size="small"
                          color={diet.quality >= 90 ? 'success' : 
                                 diet.quality >= 80 ? 'primary' : 
                                 diet.quality >= 70 ? 'warning' : 'error'}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Distribución de Grupos de Alimentos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              🥗 Distribución de Grupos de Alimentos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={foodGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} alimentos`, 'Cantidad']} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={COLORS.teal} 
                  fill={COLORS.teal} 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {foodGroupData.slice(0, 5).map((group, index) => (
                <Chip
                  key={group.name}
                  label={`${group.name}: ${group.value}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Resumen de Actividad Reciente */}
      <Paper elevation={4} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
          📅 Actividad Reciente
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: COLORS.success, fontWeight: 'bold' }}>
                {nutritionMetrics.recentDiets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dietas creadas esta semana
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: COLORS.info, fontWeight: 'bold' }}>
                {nutritionMetrics.totalMeals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de comidas planificadas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: COLORS.warning, fontWeight: 'bold' }}>
                {nutritionMetrics.averageTMB}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                TMB promedio (cal/día)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Dashboard 