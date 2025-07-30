import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
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
  CircularProgress,
  useTheme,
  alpha,
  Tooltip,
  Avatar,
  Badge,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignIcon,
  Restaurant as TemplateIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  MoreVert as MoreVertIcon,
  LibraryBooks as LibraryIcon,
  TrendingUp as TrendingIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { DietTemplate, DayOfWeek } from '../types'
import { motion, AnimatePresence } from 'framer-motion'

const DietTemplates = () => {
  const theme = useTheme()
  const { dietTemplates, deleteDietTemplate, loadingDietTemplates } = useFirebase()
  const navigate = useNavigate()
  const { showSuccess } = useNotifications()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedTemplate, setSelectedTemplate] = useState<DietTemplate | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedTemplateForMenu, setSelectedTemplateForMenu] = useState<DietTemplate | null>(null)

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, template: DietTemplate) => {
    setAnchorEl(event.currentTarget)
    setSelectedTemplateForMenu(template)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTemplateForMenu(null)
  }

  const filteredTemplates = dietTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Estadísticas para el header
  const totalTemplates = dietTemplates.length
  const activeTemplates = dietTemplates.filter(t => (t.usageCount || 0) > 0).length
  const recentTemplates = dietTemplates.filter(t => {
    const createdAt = new Date(t.createdAt)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return createdAt > oneWeekAgo
  }).length

  if (loadingDietTemplates) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="body2" color="text.secondary">
          Cargando plantillas...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', py: 3, px: { xs: 2, sm: 3 } }}>
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: theme.palette.primary.main, 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <LibraryIcon sx={{ fontSize: 32 }} />
                Plantillas de Dieta
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Gestiona tus plantillas reutilizables para crear dietas personalizadas
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTemplate}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              Crear Plantilla
            </Button>
          </Box>

          {/* Estadísticas */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                  {totalTemplates}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Plantillas
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                }}
              >
                <Typography variant="h4" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
                  {activeTemplates}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  En Uso
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}
              >
                <Typography variant="h4" sx={{ color: theme.palette.info.main, fontWeight: 700 }}>
                  {recentTemplates}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recientes
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </motion.div>

      {/* Filtros mejorados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar plantillas por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }
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
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.3),
                    },
                  }}
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
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-end' } }}>
                <Tooltip title="Vista de tabla">
                  <IconButton
                    onClick={() => setViewMode('table')}
                    color={viewMode === 'table' ? 'primary' : 'default'}
                    sx={{
                      backgroundColor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Vista de tarjetas">
                  <IconButton
                    onClick={() => setViewMode('cards')}
                    color={viewMode === 'cards' ? 'primary' : 'default'}
                    sx={{
                      backgroundColor: viewMode === 'cards' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        {filteredTemplates.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <TemplateIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.6 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                No hay plantillas
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No se encontraron plantillas con los filtros aplicados. Intenta ajustar tu búsqueda.'
                  : 'Crea tu primera plantilla de dieta para reutilizarla con diferentes clientes y optimizar tu trabajo.'
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateTemplate}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }
                }}
              >
                Crear Primera Plantilla
              </Button>
            </Paper>
          </motion.div>
        ) : viewMode === 'table' ? (
          <motion.div
            key="table-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TableContainer 
              component={Paper} 
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Plantilla</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Categoría</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Calorías/Día</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Comidas</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Usos</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Creada</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTemplates.map((template, index) => {
                    const stats = calculateTemplateStats(template)
                    return (
                      <motion.tr
                        key={template.id}
                        component={TableRow}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              sx={{ 
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                width: 40,
                                height: 40
                              }}
                            >
                              <TemplateIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {template.name}
                              </Typography>
                              {template.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                                  {template.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getCategoryLabel(template.category || 'custom')}
                            color={getCategoryColor(template.category || 'custom')}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {stats.totalCalories} cal
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {stats.totalMeals} comidas
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            badgeContent={template.usageCount || 0} 
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: (template.usageCount || 0) > 0 ? theme.palette.success.main : theme.palette.grey[400],
                              }
                            }}
                          >
                            <Chip
                              label={`${template.usageCount || 0} usos`}
                              variant="outlined"
                              size="small"
                              color={(template.usageCount || 0) > 0 ? 'success' : 'default'}
                              sx={{ fontWeight: 500 }}
                            />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(template.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Tooltip title="Editar plantilla">
                              <IconButton
                                onClick={() => handleEditTemplate(template)}
                                size="small"
                                color="primary"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  }
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Asignar a cliente">
                              <IconButton
                                onClick={() => handleAssignTemplate(template)}
                                size="small"
                                color="success"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                  }
                                }}
                              >
                                <AssignIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Más opciones">
                              <IconButton
                                onClick={(e) => handleMenuOpen(e, template)}
                                size="small"
                                color="default"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.1),
                                  }
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        ) : (
          <motion.div
            key="cards-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {filteredTemplates.map((template, index) => {
                const stats = calculateTemplateStats(template)
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card 
                        elevation={2} 
                        sx={{ 
                          height: '100%',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
                          },
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          position: 'relative',
                          overflow: 'visible'
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Avatar 
                                  sx={{ 
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    width: 32,
                                    height: 32
                                  }}
                                >
                                  <TemplateIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                  {template.name}
                                </Typography>
                              </Box>
                              <Chip
                                label={getCategoryLabel(template.category || 'custom')}
                                color={getCategoryColor(template.category || 'custom')}
                                size="small"
                                sx={{ mb: 1, fontWeight: 500 }}
                              />
                            </Box>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, template)}
                              size="small"
                              sx={{
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.action.hover, 0.1),
                                }
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                          
                          {template.description && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                mb: 2,
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {template.description}
                            </Typography>
                          )}
                          
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Calorías/día:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {stats.totalCalories} cal
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Total comidas:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {stats.totalMeals}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Badge 
                              badgeContent={template.usageCount || 0} 
                              color="primary"
                              sx={{
                                '& .MuiBadge-badge': {
                                  backgroundColor: (template.usageCount || 0) > 0 ? theme.palette.success.main : theme.palette.grey[400],
                                }
                              }}
                            >
                              <Chip
                                label={`${template.usageCount || 0} usos`}
                                variant="outlined"
                                size="small"
                                color={(template.usageCount || 0) > 0 ? 'success' : 'default'}
                                sx={{ fontWeight: 500 }}
                              />
                            </Badge>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(template.createdAt).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                )
              })}
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2,
            }
          }
        }}
      >
        <MenuItem onClick={() => {
          if (selectedTemplateForMenu) handleEditTemplate(selectedTemplateForMenu)
          handleMenuClose()
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedTemplateForMenu) handleAssignTemplate(selectedTemplateForMenu)
          handleMenuClose()
        }}>
          <ListItemIcon>
            <AssignIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Asignar a Cliente</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (selectedTemplateForMenu) handleDeleteTemplate(selectedTemplateForMenu)
          handleMenuClose()
        }} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog de confirmación de eliminación */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirmar Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1">
            ¿Estás seguro de que quieres eliminar la plantilla{' '}
            <strong>"{selectedTemplate?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer y se perderán todos los datos de la plantilla.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
              }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DietTemplates 
