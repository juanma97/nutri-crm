import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { Box, Paper, Typography } from '@mui/material'
import type { DayOfWeek, DietMeal } from '../types'

interface DietChartsProps {
  meals: Record<DayOfWeek, Record<string, DietMeal[]>>
  tmb: number
}

const DietCharts = ({ meals, tmb }: DietChartsProps) => {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  const calculateDailyTotals = (day: DayOfWeek) => {
    const dayMeals = meals[day]
    let totalCalories = 0
    let totalProteins = 0
    let totalFats = 0
    let totalCarbs = 0
    let totalFiber = 0

    Object.values(dayMeals).forEach(mealList => {
      mealList.forEach(meal => {
        totalCalories += meal.calories
        totalProteins += meal.proteins
        totalFats += meal.fats
        totalCarbs += meal.carbs
        totalFiber += meal.fiber
      })
    })

    return { totalCalories, totalProteins, totalFats, totalCarbs, totalFiber }
  }

  const caloriesData = daysOfWeek.map(day => {
    const totals = calculateDailyTotals(day as DayOfWeek)
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      calories: Math.round(totals.totalCalories),
      tmb: Math.round(tmb),
      percentage: Math.round((totals.totalCalories / tmb) * 100)
    }
  })

  const weeklyTotals = daysOfWeek.reduce((acc, day) => {
    const totals = calculateDailyTotals(day as DayOfWeek)
    return {
      calories: acc.calories + totals.totalCalories,
      proteins: acc.proteins + totals.totalProteins,
      fats: acc.fats + totals.totalFats,
      carbs: acc.carbs + totals.totalCarbs,
      fiber: acc.fiber + totals.totalFiber
    }
  }, { calories: 0, proteins: 0, fats: 0, carbs: 0, fiber: 0 })

  const macroData = [
    { name: 'Proteins', value: Math.round(weeklyTotals.proteins), color: '#0088FE' },
    { name: 'Fats', value: Math.round(weeklyTotals.fats), color: '#00C49F' },
    { name: 'Carbs', value: Math.round(weeklyTotals.carbs), color: '#FFBB28' },
    { name: 'Fiber', value: Math.round(weeklyTotals.fiber), color: '#FF8042' }
  ]

  const trendData = daysOfWeek.map(day => {
    const totals = calculateDailyTotals(day as DayOfWeek)
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      calories: Math.round(totals.totalCalories),
      proteins: Math.round(totals.totalProteins),
      fats: Math.round(totals.totalFats),
      carbs: Math.round(totals.totalCarbs)
    }
  })

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="body2">{`${label}`}</Typography>
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </Typography>
          ))}
        </Paper>
      )
    }
    return null
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Diet Analytics
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Calories vs TMB Bar Chart */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Paper elevation={3} sx={{ p: 3, flex: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Calories vs TMB
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="calories" fill="#2e7d32" name="Calories" />
                <Bar dataKey="tmb" fill="#ff6b6b" name="TMB" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Macros Distribution Pie Chart */}
          <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Macros Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}g`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Weekly Trend Line Chart */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Weekly Macro Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#2e7d32" strokeWidth={2} />
              <Line type="monotone" dataKey="proteins" stroke="#0088FE" strokeWidth={2} />
              <Line type="monotone" dataKey="fats" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="carbs" stroke="#FFBB28" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', flex: '1 1 200px' }}>
            <Typography variant="h4" color="primary">
              {Math.round(weeklyTotals.calories)}
            </Typography>
            <Typography variant="body2">Total Calories</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', flex: '1 1 200px' }}>
            <Typography variant="h4" color="primary">
              {Math.round(weeklyTotals.proteins)}g
            </Typography>
            <Typography variant="body2">Total Proteins</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', flex: '1 1 200px' }}>
            <Typography variant="h4" color="primary">
              {Math.round(weeklyTotals.fats)}g
            </Typography>
            <Typography variant="body2">Total Fats</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', flex: '1 1 200px' }}>
            <Typography variant="h4" color="primary">
              {Math.round(weeklyTotals.carbs)}g
            </Typography>
            <Typography variant="body2">Total Carbs</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default DietCharts 