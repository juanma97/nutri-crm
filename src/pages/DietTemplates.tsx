import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,

  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignIcon,
  Restaurant as TemplateIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { DietTemplate, DayOfWeek } from '../types'

const DietTemplates = () => {
  const { dietTemplates, deleteDietTemplate, loadingDietTemplates } = useFirebase()
  const navigate = useNavigate()
  const { showSuccess } = useNotifications()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedTemplate, setSelectedTemplate] = useState<DietTemplate | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Scroll hacia arriba cuando se monta el componente
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weight_loss': return 'error'
      case 'muscle_gain': return 'warning'
      case 'maintenance': return 'info'
      case 'health': return 'success'
      case 'custom': return 'default'
      default: return 'default'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'weight_loss': return 'Pérdida de Peso'
      case 'muscle_gain': return 'Ganancia Muscular'
      case 'maintenance': return 'Mantenimiento'
      case 'health': return 'Salud'
      case 'custom': return 'Personalizada'
      default: return 'Sin Categoría'
    }
  }

  const calculateTemplateStats = (template: DietTemplate) => {
    const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    let totalMeals = 0
    let totalCalories = 0

    daysOfWeek.forEach(day => {
      const dayMeals = template.meals[day]
      Object.values(dayMeals).forEach((mealList: any[]) => {
        totalMeals += mealList.length
        mealList.forEach((meal: { calories: number }) => {
          totalCalories += meal.calories
        })
      })
    })

    return { totalMeals, totalCalories: Math.round(totalCalories / 7) }
  }

  const handleDeleteTemplate = (template: DietTemplate) => {
    setSelectedTemplate(template)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedTemplate) {
      const success = await deleteDietTemplate(selectedTemplate.id)
      if (success) {
        showSuccess('Plantilla eliminada correctamente')
      }
      setDeleteDialogOpen(false)
      setSelectedTemplate(null)
    }
  }

  const handleCreateTemplate = () => {
    navigate('/templates/new')
  }

  const handleEditTemplate = (template: DietTemplate) => {
    navigate(`/templates/edit/${template.id}`)
  }

  const handleAssignTemplate = (template: DietTemplate) => {
    navigate(`/templates/assign/${template.id}`)
  }



  const filteredTemplates = dietTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loadingDietTemplates) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', py: 3, px: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            📋 Mis Plantillas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tus plantillas de dietas reutilizables
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTemplate}
          sx={{ backgroundColor: '#2e7d32' }}
        >
          Crear Plantilla
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryFilter}
                label="Categoría"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">Todas las categorías</MenuItem>
                <MenuItem value="weight_loss">Pérdida de Peso</MenuItem>
                <MenuItem value="muscle_gain">Ganancia Muscular</MenuItem>
                <MenuItem value="maintenance">Mantenimiento</MenuItem>
                <MenuItem value="health">Salud</MenuItem>
                <MenuItem value="custom">Personalizada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                size="small"
              >
                Tabla
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('cards')}
                size="small"
              >
                Tarjetas
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {filteredTemplates.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <TemplateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No hay plantillas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || categoryFilter !== 'all' 
              ? 'No se encontraron plantillas con los filtros aplicados'
              : 'Crea tu primera plantilla de dieta para reutilizarla con diferentes clientes'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTemplate}
            sx={{ backgroundColor: '#2e7d32' }}
          >
            Crear Primera Plantilla
          </Button>
        </Paper>
      ) : viewMode === 'table' ? (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Calorías/Día</TableCell>
                <TableCell>Comidas</TableCell>
                <TableCell>Usos</TableCell>
                <TableCell>Creada</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTemplates.map((template) => {
                const stats = calculateTemplateStats(template)
                return (
                  <TableRow key={template.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {template.name}
                        </Typography>
                        {template.description && (
                          <Typography variant="body2" color="text.secondary">
                            {template.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryLabel(template.category || 'custom')}
                        color={getCategoryColor(template.category || 'custom')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {stats.totalCalories} cal
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {stats.totalMeals} comidas
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${template.usageCount || 0} usos`}
                        variant="outlined"
                        size="small"
                        color={(template.usageCount || 0) > 0 ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditTemplate(template)}
                          size="small"
                          color="primary"
                          title="Editar"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleAssignTemplate(template)}
                          size="small"
                          color="success"
                          title="Asignar a Cliente"
                        >
                          <AssignIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteTemplate(template)}
                          size="small"
                          color="error"
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => {
            const stats = calculateTemplateStats(template)
            return (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {template.name}
                        </Typography>
                        <Chip
                          label={getCategoryLabel(template.category || 'custom')}
                          color={getCategoryColor(template.category || 'custom')}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          onClick={() => handleEditTemplate(template)}
                          size="small"
                          color="primary"
                          title="Editar"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleAssignTemplate(template)}
                          size="small"
                          color="success"
                          title="Asignar a Cliente"
                        >
                          <AssignIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteTemplate(template)}
                          size="small"
                          color="error"
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {template.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {template.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Calorías:</strong> {stats.totalCalories} cal/día
                      </Typography>
                      <Typography variant="body2">
                        <strong>Comidas:</strong> {stats.totalMeals}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={`${template.usageCount || 0} usos`}
                        variant="outlined"
                        size="small"
                        color={(template.usageCount || 0) > 0 ? 'success' : 'default'}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}



      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar la plantilla "{selectedTemplate?.name}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DietTemplates 
