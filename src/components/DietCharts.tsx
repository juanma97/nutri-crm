// @ts-nocheck
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from 'recharts'
import type { DayOfWeek, DietMeal } from '../types'

const COLORS = {
  calories: '#FF6B6B',
  proteins: '#4ECDC4',
  fats: '#45B7D1',
  carbs: '#96CEB4',
  fiber: '#FFEAA7',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  primary: '#3498DB'
}

interface DietChartsProps {
  meals: Record<DayOfWeek, Record<string, DietMeal[]>>
  tmb: number
}

const DietCharts = ({ meals, tmb }: DietChartsProps) => {
  // Calcular datos nutricionales por día
  const dailyNutrition = Object.entries(meals).map(([day, dayMeals]) => {
    const dayTotals = Object.values(dayMeals).reduce((sum, mealList) => {
      return {
        calories: sum.calories + mealList.reduce((mealSum, meal) => mealSum + meal.calories, 0),
        proteins: sum.proteins + mealList.reduce((mealSum, meal) => mealSum + meal.proteins, 0),
        fats: sum.fats + mealList.reduce((mealSum, meal) => mealSum + meal.fats, 0),
        carbs: sum.carbs + mealList.reduce((mealSum, meal) => mealSum + meal.carbs, 0),
        fiber: sum.fiber + mealList.reduce((mealSum, meal) => mealSum + meal.fiber, 0)
      }
    }, { calories: 0, proteins: 0, fats: 0, carbs: 0, fiber: 0 })

    const dayName = day.charAt(0).toUpperCase() + day.slice(1)
    const caloriesPercentage = (dayTotals.calories / tmb) * 100
    const proteinPercentage = (dayTotals.proteins / (tmb * 0.3 / 4)) * 100 // 30% de TMB en proteínas
    const fatPercentage = (dayTotals.fats / (tmb * 0.25 / 9)) * 100 // 25% de TMB en grasas
    const carbPercentage = (dayTotals.carbs / (tmb * 0.45 / 4)) * 100 // 45% de TMB en carbohidratos

    return {
      day: dayName,
      calories: Math.round(dayTotals.calories),
      proteins: Math.round(dayTotals.proteins),
      fats: Math.round(dayTotals.fats),
      carbs: Math.round(dayTotals.carbs),
      fiber: Math.round(dayTotals.fiber),
      tmbTarget: Math.round(tmb),
      caloriesPercentage,
      proteinPercentage,
      fatPercentage,
      carbPercentage,
      status: caloriesPercentage < 80 ? 'low' : caloriesPercentage > 120 ? 'high' : 'optimal'
    }
  })

  // Calcular totales semanales
  const weeklyTotals = dailyNutrition.reduce((acc, day) => ({
    calories: acc.calories + day.calories,
    proteins: acc.proteins + day.proteins,
    fats: acc.fats + day.fats,
    carbs: acc.carbs + day.carbs,
    fiber: acc.fiber + day.fiber
  }), { calories: 0, proteins: 0, fats: 0, carbs: 0, fiber: 0 })

  const weeklyAverages = {
    calories: Math.round(weeklyTotals.calories / 7),
    proteins: Math.round(weeklyTotals.proteins / 7),
    fats: Math.round(weeklyTotals.fats / 7),
    carbs: Math.round(weeklyTotals.carbs / 7),
    fiber: Math.round(weeklyTotals.fiber / 7)
  }

  // Datos para gráfico de distribución de macronutrientes
  const macroDistribution = [
    { name: 'Proteínas', value: weeklyAverages.proteins, percentage: Math.round((weeklyAverages.proteins * 4 / weeklyAverages.calories) * 100), color: COLORS.proteins },
    { name: 'Grasas', value: weeklyAverages.fats, percentage: Math.round((weeklyAverages.fats * 9 / weeklyAverages.calories) * 100), color: COLORS.fats },
    { name: 'Carbohidratos', value: weeklyAverages.carbs, percentage: Math.round((weeklyAverages.carbs * 4 / weeklyAverages.calories) * 100), color: COLORS.carbs }
  ]

  // Datos para análisis de comidas por día
  const mealAnalysis = Object.entries(meals).map(([day, dayMeals]) => {
    const mealTotals = Object.entries(dayMeals).map(([mealType, meals]) => ({
      meal: mealType === 'breakfast' ? 'Desayuno' : 
            mealType === 'morningSnack' ? 'Merienda AM' :
            mealType === 'lunch' ? 'Almuerzo' :
            mealType === 'afternoonSnack' ? 'Merienda PM' : 'Cena',
      calories: Math.round(meals.reduce((sum, meal) => sum + meal.calories, 0)),
      proteins: Math.round(meals.reduce((sum, meal) => sum + meal.proteins, 0)),
      fats: Math.round(meals.reduce((sum, meal) => sum + meal.fats, 0)),
      carbs: Math.round(meals.reduce((sum, meal) => sum + meal.carbs, 0))
    }))
    
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      meals: mealTotals
    }
  })

  // Calcular métricas de calidad nutricional
  const nutritionQuality = {
    calorieConsistency: dailyNutrition.filter(d => d.caloriesPercentage >= 90 && d.caloriesPercentage <= 110).length / 7 * 100,
    proteinAdequacy: dailyNutrition.filter(d => d.proteinPercentage >= 80).length / 7 * 100,
    fiberIntake: weeklyAverages.fiber >= 25 ? 100 : (weeklyAverages.fiber / 25) * 100,
    macroBalance: Math.abs(macroDistribution[0].percentage - 30) + Math.abs(macroDistribution[1].percentage - 25) + Math.abs(macroDistribution[2].percentage - 45)
  }

  const getQualityScore = () => {
    const score = (nutritionQuality.calorieConsistency * 0.4 + 
                   nutritionQuality.proteinAdequacy * 0.3 + 
                   nutritionQuality.fiberIntake * 0.2 + 
                   (100 - nutritionQuality.macroBalance) * 0.1)
    return Math.round(score)
  }

  const qualityScore = getQualityScore()

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
        📊 Análisis Nutricional Completo
      </Typography>
      
      {/* Score de Calidad Nutricional */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              Puntuación de Calidad Nutricional
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Basado en consistencia calórica, adecuación proteica y balance de macronutrientes
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
              {qualityScore}/100
            </Typography>
            <Chip 
              label={qualityScore >= 80 ? 'Excelente' : qualityScore >= 60 ? 'Bueno' : 'Necesita Mejora'} 
              color={qualityScore >= 80 ? 'success' : qualityScore >= 60 ? 'warning' : 'error'}
              sx={{ color: 'white', fontWeight: 'bold' }}
            />
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Gráfico de Calorías por Día vs TMB */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
              📈 Consumo Calórico Diario vs TMB
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={dailyNutrition}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} cal`, 
                    name === 'calories' ? 'Consumido' : 'TMB Objetivo'
                  ]}
                />
                <Legend />
                <Bar dataKey="calories" fill={COLORS.calories} name="Consumido" />
                <Line type="monotone" dataKey="tmbTarget" stroke={COLORS.primary} strokeWidth={3} name="TMB Objetivo" />
              </ComposedChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {dailyNutrition.map((day) => (
                <Chip
                  key={day.day}
                  label={`${day.day}: ${day.caloriesPercentage.toFixed(0)}%`}
                  color={day.status === 'optimal' ? 'success' : day.status === 'low' ? 'warning' : 'error'}
                  size="small"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Distribución de Macronutrientes */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
              🥗 Distribución de Macronutrientes (Promedio Semanal)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {macroDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}g`, 'Cantidad']} />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {macroDistribution.map((macro) => (
                <Box key={macro.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{macro.name}:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {macro.value}g ({macro.percentage}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Análisis de Macronutrientes por Día */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
              📊 Análisis Detallado de Macronutrientes por Día
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={dailyNutrition}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}g`, 'Gramos']} />
                <Legend />
                <Area type="monotone" dataKey="proteins" stackId="1" stroke={COLORS.proteins} fill={COLORS.proteins} name="Proteínas" />
                <Area type="monotone" dataKey="fats" stackId="1" stroke={COLORS.fats} fill={COLORS.fats} name="Grasas" />
                <Area type="monotone" dataKey="carbs" stackId="1" stroke={COLORS.carbs} fill={COLORS.carbs} name="Carbohidratos" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Métricas de Calidad */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
              🎯 Métricas de Calidad Nutricional
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Consistencia Calórica</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1, bgcolor: '#f0f0f0', borderRadius: 1, height: 8 }}>
                    <Box 
                      sx={{ 
                        width: `${nutritionQuality.calorieConsistency}%`, 
                        bgcolor: COLORS.success, 
                        height: '100%', 
                        borderRadius: 1 
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {Math.round(nutritionQuality.calorieConsistency)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">Adecuación Proteica</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1, bgcolor: '#f0f0f0', borderRadius: 1, height: 8 }}>
                    <Box 
                      sx={{ 
                        width: `${nutritionQuality.proteinAdequacy}%`, 
                        bgcolor: COLORS.proteins, 
                        height: '100%', 
                        borderRadius: 1 
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {Math.round(nutritionQuality.proteinAdequacy)}%
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Consumo de Fibra</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1, bgcolor: '#f0f0f0', borderRadius: 1, height: 8 }}>
                    <Box 
                      sx={{ 
                        width: `${nutritionQuality.fiberIntake}%`, 
                        bgcolor: COLORS.fiber, 
                        height: '100%', 
                        borderRadius: 1 
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {Math.round(nutritionQuality.fiberIntake)}% ({weeklyAverages.fiber}g/día)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Resumen Semanal */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
              📋 Resumen Nutricional Semanal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h6" color="primary">
                    {weeklyAverages.calories} cal/día
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Promedio calórico diario
                  </Typography>
                </CardContent>
              </Card>
              
              <Card variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h6" color="primary">
                    {Math.round((weeklyAverages.calories / tmb) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Porcentaje del TMB alcanzado
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h6" color="primary">
                    {weeklyAverages.proteins}g/día
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Proteínas promedio diarias
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h6" color="primary">
                    {weeklyAverages.fiber}g/día
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fibra promedio diaria
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>

        {/* Recomendaciones */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
              💡 Recomendaciones Nutricionales
            </Typography>
            <Grid container spacing={2}>
              {nutritionQuality.calorieConsistency < 80 && (
                <Grid item xs={12} md={6}>
                  <Alert severity="warning">
                    <Typography variant="subtitle2">Consistencia Calórica</Typography>
                    <Typography variant="body2">
                      Tu consumo calórico varía significativamente entre días. Intenta mantener un consumo más consistente.
                    </Typography>
                  </Alert>
                </Grid>
              )}
              
              {nutritionQuality.proteinAdequacy < 80 && (
                <Grid item xs={12} md={6}>
                  <Alert severity="info">
                    <Typography variant="subtitle2">Proteínas</Typography>
                    <Typography variant="body2">
                      Considera aumentar el consumo de proteínas magras para optimizar la recuperación muscular.
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {nutritionQuality.fiberIntake < 80 && (
                <Grid item xs={12} md={6}>
                  <Alert severity="info">
                    <Typography variant="subtitle2">Fibra</Typography>
                    <Typography variant="body2">
                      Aumenta el consumo de frutas, verduras y granos enteros para mejorar la salud digestiva.
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {qualityScore >= 80 && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    <Typography variant="subtitle2">¡Excelente trabajo!</Typography>
                    <Typography variant="body2">
                      Tu dieta está bien balanceada y cumple con los objetivos nutricionales. Mantén esta consistencia.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DietCharts 