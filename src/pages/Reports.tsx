// @ts-nocheck
import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import DownloadIcon from '@mui/icons-material/Download'
import PrintIcon from '@mui/icons-material/Print'
import EmailIcon from '@mui/icons-material/Email'
import SearchIcon from '@mui/icons-material/Search'
import { useFirebase } from '../contexts/FirebaseContext'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

const Reports = () => {
  const { diets, foods } = useFirebase()
  const [reportType, setReportType] = useState('clients')
  const [dateRange, setDateRange] = useState('30')
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar dietas por fecha
  const filteredDiets = diets.filter(diet => {
    const dietDate = new Date(diet.createdAt)
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange))
    return dietDate >= daysAgo
  })

  // Filtrar por búsqueda
  const searchedDiets = filteredDiets.filter(diet =>
    diet.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diet.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calcular estadísticas
  const totalClients = searchedDiets.length
  const averageTMB = searchedDiets.length > 0 
    ? Math.round(searchedDiets.reduce((sum, diet) => sum + diet.tmb, 0) / searchedDiets.length)
    : 0

  // Datos para gráficos
  const clientData = searchedDiets.map(diet => ({
    name: diet.clientName,
    tmb: diet.tmb,
    date: new Date(diet.createdAt).toLocaleDateString()
  }))

  const tmbDistribution = [
    { range: '1500-1800', count: searchedDiets.filter(d => d.tmb >= 1500 && d.tmb < 1800).length },
    { range: '1800-2100', count: searchedDiets.filter(d => d.tmb >= 1800 && d.tmb < 2100).length },
    { range: '2100-2400', count: searchedDiets.filter(d => d.tmb >= 2100 && d.tmb < 2400).length },
    { range: '2400+', count: searchedDiets.filter(d => d.tmb >= 2400).length }
  ]

  const foodGroupStats = foods.reduce((acc, food) => {
    acc[food.group] = (acc[food.group] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const foodGroupData = Object.entries(foodGroupStats).map(([group, count]) => ({
    name: group,
    value: count
  }))

  const handleExport = (format: string) => {
    // Simular exportación
    console.log(`Exporting ${reportType} report in ${format} format`)
    alert(`Report exported as ${format.toUpperCase()}`)
  }

  return (
    <Box sx={{ width: '100%', py: 3, px: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      {/* Controles */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="clients">Client Reports</MenuItem>
                <MenuItem value="diets">Diet Analysis</MenuItem>
                <MenuItem value="foods">Food Inventory</MenuItem>
                <MenuItem value="general">General Overview</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                label="Date Range"
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="365">Last year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('csv')}
              >
                CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() => handleExport('pdf')}
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={() => handleExport('email')}
              >
                Email
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Clients
              </Typography>
              <Typography variant="h4" component="div">
                {totalClients}
              </Typography>
              <Chip 
                label={`${dateRange} days`} 
                size="small" 
                color="primary" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average TMB
              </Typography>
              <Typography variant="h4" component="div">
                {averageTMB}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                calories
              </Typography>
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
                {foods.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                in database
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Food Groups
              </Typography>
              <Typography variant="h4" component="div">
                {Object.keys(foodGroupStats).length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Barras - TMB por Cliente */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              TMB by Client
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tmb" fill="#2e7d32" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Líneas - Distribución TMB */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              TMB Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tmbDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} />
              </LineChart>
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

      {/* Tabla de Clientes */}
      <Paper elevation={3}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Client Details ({searchedDiets.length} clients)
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Client Name</TableCell>
                <TableCell>Diet Name</TableCell>
                <TableCell>TMB (cal)</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedDiets.map((diet) => (
                <TableRow key={diet.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{diet.clientName}</Typography>
                  </TableCell>
                  <TableCell>{diet.name}</TableCell>
                  <TableCell>{diet.tmb.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(diet.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label="Active" 
                      color="success" 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default Reports 