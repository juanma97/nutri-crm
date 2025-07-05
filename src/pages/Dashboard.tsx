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
  Alert
} from '@mui/material'
import {
  PeopleAlt as PeopleIcon,
  Restaurant as DietIcon,
  TrendingUp as TrendingIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useFirebase } from '../contexts/FirebaseContext'
import type { DayOfWeek } from '../types'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

const Dashboard = () => {
  const { diets, foods } = useFirebase()

  // Calcular métricas
  const totalClients = diets.length
  const totalDiets = diets.length
  const totalFoods = foods.length
  const activeDiets = diets.filter(diet => diet.createdAt).length
  const recentDiets = diets.filter(diet => {
    const dietDate = new Date(diet.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return dietDate > weekAgo
  }).length
  const averageTMB = diets.length > 0 ? Math.round(diets.reduce((sum, diet) => sum + diet.tmb, 0) / diets.length) : 0
  
  // Distribución por género (simulado basado en nombres)
  const genderDistribution = diets.reduce((acc, diet) => {
    const isMale = diet.clientName.toLowerCase().includes('juan') || 
                   diet.clientName.toLowerCase().includes('carlos') ||
                   diet.clientName.toLowerCase().includes('pedro')
    acc[isMale ? 'male' : 'female']++
    return acc
  }, { male: 0, female: 0 })

  // Dietas por mes (últimos 6 meses)
  const currentDate = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthName = date.toLocaleDateString('es-ES', { month: 'short' })
    const count = diets.filter(diet => {
      const dietDate = new Date(diet.createdAt)
      return dietDate.getMonth() === date.getMonth() && dietDate.getFullYear() === date.getFullYear()
    }).length
    return { month: monthName, diets: count }
  }).reverse()

  // Distribución de TMB por rangos
  const tmbRanges = [
    { range: '1500-1700', min: 1500, max: 1700, count: 0 },
    { range: '1701-1900', min: 1701, max: 1900, count: 0 },
    { range: '1901-2100', min: 1901, max: 2100, count: 0 },
    { range: '2101-2300', min: 2101, max: 2300, count: 0 },
    { range: '2301+', min: 2301, max: 9999, count: 0 }
  ]

  diets.forEach(diet => {
    const range = tmbRanges.find(r => diet.tmb >= r.min && diet.tmb <= r.max)
    if (range) range.count++
  })

  const tmbDistribution = tmbRanges.map(range => ({
    range: range.range,
    count: range.count
  }))

  // Calcular total de comidas por día
  const calculateTotalMeals = () => {
    const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    let totalMeals = 0
    
    diets.forEach(diet => {
      daysOfWeek.forEach(day => {
        Object.values(diet.meals[day]).forEach(mealList => {
          totalMeals += mealList.length
        })
      })
    })
    
    return totalMeals
  }

  const totalMeals = calculateTotalMeals()

  // Métricas de rendimiento
  const performanceMetrics = {
    totalClients,
    totalDiets,
    totalFoods,
    activeDiets,
    recentDiets,
    averageTMB,
    totalMeals,
    completionRate: Math.round((diets.filter(diet => {
      const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      let hasMeals = false
      daysOfWeek.forEach(day => {
        Object.values(diet.meals[day]).forEach(mealList => {
          if (mealList.length > 0) hasMeals = true
        })
      })
      return hasMeals
    }).length / totalDiets) * 100) || 0
  }

  // Datos para gráficos
  const dietData = [
    { name: 'Total Diets', value: totalDiets, color: '#2e7d32' },
    { name: 'Active Diets', value: activeDiets, color: '#1976d2' },
    { name: 'Recent Diets', value: recentDiets, color: '#ed6c02' }
  ]

  const foodGroups = foods.reduce((acc, food) => {
    acc[food.group] = (acc[food.group] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const foodGroupData = Object.entries(foodGroups).map(([group, count]) => ({
    name: group,
    value: count
  }))

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Bienvenido al panel de control. Aquí puedes ver las métricas clave de tu práctica nutricional.
      </Alert>

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {performanceMetrics.totalClients}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Clientes
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((performanceMetrics.totalClients / 10) * 100, 100)} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DietIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {performanceMetrics.totalDiets}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dietas Creadas
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((performanceMetrics.totalDiets / 15) * 100, 100)} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingIcon sx={{ fontSize: 40, color: '#ed6c02', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {performanceMetrics.averageTMB}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    TMB Promedio
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                calorías/día
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {performanceMetrics.completionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasa de Completado
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={performanceMetrics.completionRate} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Foods
              </Typography>
              <Typography variant="h4" component="div">
                {performanceMetrics.totalFoods}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((performanceMetrics.totalFoods / 50) * 100, 100)} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Diets
              </Typography>
              <Typography variant="h4" component="div">
                {performanceMetrics.activeDiets}
              </Typography>
              <Chip 
                label={`${Math.round((performanceMetrics.activeDiets / performanceMetrics.totalDiets) * 100)}%`} 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Recent Diets (7 days)
              </Typography>
              <Typography variant="h4" component="div">
                {performanceMetrics.recentDiets}
              </Typography>
              <Chip 
                label="This Week" 
                color="primary" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Dietas por Mes */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dietas Creadas por Mes
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="diets" fill="#2e7d32" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Distribución de Género */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribución por Género
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Hombres', value: genderDistribution.male },
                    { name: 'Mujeres', value: genderDistribution.female }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Distribución de TMB */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de TMB por Rangos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tmbDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Resumen de Actividad */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen de Actividad
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Total de Comidas Planificadas:</Typography>
                <Chip label={performanceMetrics.totalMeals} color="primary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Promedio de Comidas por Dieta:</Typography>
                <Chip label={performanceMetrics.totalDiets > 0 ? Math.round(performanceMetrics.totalMeals / performanceMetrics.totalDiets) : 0} color="secondary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Última Dieta Creada:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {performanceMetrics.totalDiets > 0 ? new Date(Math.max(...diets.map(d => d.createdAt.getTime()))).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Dietas Compartidas:</Typography>
                <Chip label={diets.filter(d => d.shareId).length} color="success" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de Barras - Dietas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Diet Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dietData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2e7d32" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Dona - Grupos de Alimentos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Food Groups Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={foodGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {foodGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Resumen de Actividad */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Latest Diets Created
            </Typography>
            {diets.slice(0, 3).map((diet, index) => (
              <Box key={diet.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2">
                  {diet.clientName}
                </Typography>
                <Chip label={new Date(diet.createdAt).toLocaleDateString()} size="small" />
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Food Groups Available
            </Typography>
            {Object.entries(foodGroups).slice(0, 5).map(([group, count]) => (
              <Box key={group} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2">
                  {group}
                </Typography>
                <Chip label={count} size="small" color="primary" />
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Dashboard 