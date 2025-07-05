import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Divider
} from '@mui/material'
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Restaurant as DietIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material'
import { useDietContext } from '../contexts/DietContext'
import type { DayOfWeek } from '../types'

const Reports = () => {
  const { diets } = useDietContext()
  const [selectedReport, setSelectedReport] = useState('clients')
  const [dateRange, setDateRange] = useState('all')

  // Calcular estadísticas
  const totalClients = diets.length
  const totalDiets = diets.length
  const averageTMB = diets.length > 0 ? Math.round(diets.reduce((sum, diet) => sum + diet.tmb, 0) / diets.length) : 0

  // Distribución por género
  const genderDistribution = diets.reduce((acc, diet) => {
    const isMale = diet.clientName.toLowerCase().includes('juan') || 
                   diet.clientName.toLowerCase().includes('carlos') ||
                   diet.clientName.toLowerCase().includes('pedro')
    acc[isMale ? 'male' : 'female']++
    return acc
  }, { male: 0, female: 0 })

  // Dietas por mes
  const currentDate = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthName = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    const count = diets.filter(diet => {
      const dietDate = new Date(diet.createdAt)
      return dietDate.getMonth() === date.getMonth() && dietDate.getFullYear() === date.getFullYear()
    }).length
    return { month: monthName, diets: count }
  }).reverse()

  // Calcular total de comidas
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

  // Generar reporte de clientes
  const generateClientReport = () => {
    return diets.map(diet => ({
      id: diet.id,
      name: diet.clientName,
      tmb: diet.tmb,
      createdAt: diet.createdAt.toLocaleDateString(),
      hasMeals: (() => {
        const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        let hasMeals = false
        daysOfWeek.forEach(day => {
          Object.values(diet.meals[day]).forEach(mealList => {
            if (mealList.length > 0) hasMeals = true
          })
        })
        return hasMeals
      })(),
      shareId: diet.shareId ? 'Sí' : 'No'
    }))
  }

  // Generar reporte de dietas
  const generateDietReport = () => {
    return diets.map(diet => {
      const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      let totalMealsInDiet = 0
      daysOfWeek.forEach(day => {
        Object.values(diet.meals[day]).forEach(mealList => {
          totalMealsInDiet += mealList.length
        })
      })

      return {
        id: diet.id,
        clientName: diet.clientName,
        tmb: diet.tmb,
        totalMeals: totalMealsInDiet,
        createdAt: diet.createdAt.toLocaleDateString(),
        isShared: diet.shareId ? 'Sí' : 'No'
      }
    })
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Simular exportación
    console.log(`Exportando reporte ${selectedReport} en formato ${format}`)
    alert(`Reporte exportado en formato ${format.toUpperCase()}`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Genera y exporta reportes detallados de tu práctica nutricional.
      </Alert>

      {/* Controles de Reporte */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Reporte</InputLabel>
              <Select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                label="Tipo de Reporte"
              >
                <MenuItem value="clients">Reporte de Clientes</MenuItem>
                <MenuItem value="diets">Reporte de Dietas</MenuItem>
                <MenuItem value="analytics">Análisis General</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Rango de Fechas</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                label="Rango de Fechas"
              >
                <MenuItem value="all">Todos los datos</MenuItem>
                <MenuItem value="month">Último mes</MenuItem>
                <MenuItem value="quarter">Último trimestre</MenuItem>
                <MenuItem value="year">Último año</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('excel')}
              >
                Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('pdf')}
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Imprimir
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Métricas Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {totalClients}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Clientes
                  </Typography>
                </Box>
              </Box>
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
                    {totalDiets}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Dietas
                  </Typography>
                </Box>
              </Box>
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
                    {averageTMB}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    TMB Promedio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {totalMeals}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Comidas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contenido del Reporte */}
      {selectedReport === 'clients' && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Reporte de Clientes
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>TMB</TableCell>
                  <TableCell>Fecha Creación</TableCell>
                  <TableCell>Dieta Completa</TableCell>
                  <TableCell>Compartida</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {generateClientReport().map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.tmb.toLocaleString()} cal</TableCell>
                    <TableCell>{client.createdAt}</TableCell>
                    <TableCell>
                      <Chip 
                        label={client.hasMeals ? 'Sí' : 'No'} 
                        color={client.hasMeals ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={client.shareId} 
                        color={client.shareId === 'Sí' ? 'primary' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedReport === 'diets' && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Reporte de Dietas
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>TMB</TableCell>
                  <TableCell>Total Comidas</TableCell>
                  <TableCell>Fecha Creación</TableCell>
                  <TableCell>Compartida</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {generateDietReport().map((diet) => (
                  <TableRow key={diet.id}>
                    <TableCell>{diet.id}</TableCell>
                    <TableCell>{diet.clientName}</TableCell>
                    <TableCell>{diet.tmb.toLocaleString()} cal</TableCell>
                    <TableCell>{diet.totalMeals}</TableCell>
                    <TableCell>{diet.createdAt}</TableCell>
                    <TableCell>
                      <Chip 
                        label={diet.isShared} 
                        color={diet.isShared === 'Sí' ? 'primary' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedReport === 'analytics' && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Análisis General
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Distribución por Género
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Hombres:</Typography>
                  <Chip label={`${genderDistribution.male} (${Math.round((genderDistribution.male / totalClients) * 100)}%)`} color="primary" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Mujeres:</Typography>
                  <Chip label={`${genderDistribution.female} (${Math.round((genderDistribution.female / totalClients) * 100)}%)`} color="secondary" />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Dietas por Mes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {monthlyData.map((month, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">{month.month}:</Typography>
                    <Chip label={month.diets} size="small" />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Resumen Estadístico
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Promedio de comidas por dieta:</Typography>
              <Typography variant="h6">{totalDiets > 0 ? Math.round(totalMeals / totalDiets) : 0}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Dietas compartidas:</Typography>
              <Typography variant="h6">{diets.filter(d => d.shareId).length}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Última dieta creada:</Typography>
              <Typography variant="h6">
                {diets.length > 0 ? new Date(Math.max(...diets.map(d => d.createdAt.getTime()))).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Tasa de completado:</Typography>
              <Typography variant="h6">
                {Math.round((diets.filter(diet => {
                  const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                  let hasMeals = false
                  daysOfWeek.forEach(day => {
                    Object.values(diet.meals[day]).forEach(mealList => {
                      if (mealList.length > 0) hasMeals = true
                    })
                  })
                  return hasMeals
                }).length / totalDiets) * 100) || 0}%
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  )
}

export default Reports 