// @ts-nocheck
import {
  Box,
  Paper,
  Typography,
  Grid
} from '@mui/material'
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
  Cell
} from 'recharts'
import type { DayOfWeek, DietMeal } from '../types'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

interface DietChartsProps {
  meals: Record<DayOfWeek, Record<string, DietMeal[]>>
  tmb: number
}

const DietCharts = ({ meals, tmb }: DietChartsProps) => {
  // Calcular datos para gráficos
  const dailyCalories = Object.entries(meals).map(([day, dayMeals]) => {
    const totalCalories = Object.values(dayMeals).reduce((sum, mealList) => {
      return sum + mealList.reduce((mealSum, meal) => mealSum + meal.calories, 0)
    }, 0)
    
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      calories: Math.round(totalCalories),
      target: Math.round(tmb)
    }
  })

  const macroDistribution = Object.entries(meals).reduce((acc, [day, dayMeals]) => {
    const dayTotals = Object.values(dayMeals).reduce((sum, mealList) => {
      return {
        proteins: sum.proteins + mealList.reduce((mealSum, meal) => mealSum + meal.proteins, 0),
        fats: sum.fats + mealList.reduce((mealSum, meal) => mealSum + meal.fats, 0),
        carbs: sum.carbs + mealList.reduce((mealSum, meal) => mealSum + meal.carbs, 0)
      }
    }, { proteins: 0, fats: 0, carbs: 0 })

    return {
      proteins: acc.proteins + dayTotals.proteins,
      fats: acc.fats + dayTotals.fats,
      carbs: acc.carbs + dayTotals.carbs
    }
  }, { proteins: 0, fats: 0, carbs: 0 })

  const macroData = [
    { name: 'Proteins', value: Math.round(macroDistribution.proteins) },
    { name: 'Fats', value: Math.round(macroDistribution.fats) },
    { name: 'Carbs', value: Math.round(macroDistribution.carbs) }
  ]

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Diet Analytics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Calories vs TMB
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyCalories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#2e7d32" name="Actual" />
                <Bar dataKey="target" fill="#1976d2" name="TMB Target" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Macro Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DietCharts 