import React, { useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  Grid
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ShareIcon from '@mui/icons-material/Share'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import type { Diet, DayOfWeek } from '../types'
import { useFirebase } from '../contexts/FirebaseContext'

const DietList = () => {
  const theme = useTheme()
  const { diets, deleteDiet, loadingDiets } = useFirebase()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dietToDelete, setDietToDelete] = useState<Diet | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedDietForMenu, setSelectedDietForMenu] = useState<Diet | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  
  const navigate = useNavigate()

  const calculateDietStats = (diet: Diet) => {
    const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    let totalMeals = 0
    let totalCalories = 0

    daysOfWeek.forEach(day => {
      const dayMeals = diet.meals[day]
      Object.values(dayMeals).forEach((mealList: any[]) => {
        totalMeals += mealList.length
        mealList.forEach((meal: { calories: number }) => {
          totalCalories += meal.calories
        })
      })
    })

    return { totalMeals, totalCalories }
  }

  const filteredDiets = diets.filter(diet => {
    const matchesSearch = diet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diet.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || statusFilter === 'active'
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'recent' && (new Date().getTime() - diet.createdAt.getTime()) < 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === 'old' && (new Date().getTime() - diet.createdAt.getTime()) >= 7 * 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleDeleteDiet = (diet: Diet) => {
    setDietToDelete(diet)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (dietToDelete) {
      const success = await deleteDiet(dietToDelete.id.toString())
      if (success) {
        setDeleteDialogOpen(false)
        setDietToDelete(null)
        setSnackbarMessage('Dieta eliminada correctamente')
        setSnackbarOpen(true)
      }
    }
  }

  const handleCreateDiet = () => {
    navigate('/diets/new')
  }

  const handleViewDiet = (diet: Diet) => {
    setSelectedDiet(diet)
    setPreviewDialogOpen(true)
  }

  const handleEditDiet = (diet: Diet) => {
    navigate(`/diets/edit/${diet.id}`)
  }

  const handleDuplicateDiet = (diet: Diet) => {
    const newDietData = {
      clientName: `${diet.clientName} (Copy)`,
      tmb: diet.tmb,
      meals: diet.meals
    }
    // La función addDiet del contexto se encargará de generar el ID y shareId
    // Necesitamos acceder a addDiet del contexto
    // Por ahora, usaremos una implementación temporal
    console.log('Duplicating diet:', newDietData)
  }

  const handleShareDiet = async (diet: Diet) => {
    try {
      const shareUrl = `${window.location.origin}/diet/${diet.shareId}`
      await navigator.clipboard.writeText(shareUrl)
      setSnackbarMessage('Link copiado al portapapeles')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      setSnackbarMessage('Error al copiar el enlace')
      setSnackbarOpen(true)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, diet: Diet) => {
    setAnchorEl(event.currentTarget)
    setSelectedDietForMenu(diet)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedDietForMenu(null)
  }

  if (loadingDiets) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
      </Box>
    )
  }

  return (
    <Box sx={{ 
      width: '100%', 
      py: 4, 
      px: 4,
      background: theme.palette.background.gradient,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RestaurantIcon 
            sx={{ 
              fontSize: 40, 
              color: theme.palette.primary.main,
              mr: 2
            }} 
          />
          <Typography 
            variant="h3" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 700
            }}
          >
            Dietas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDiet}
          className="custom-button"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: 'translateY(-1px)',
            }
          }}
        >
          Crear Dieta
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.04)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          },
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <TextField
              fullWidth
              placeholder="Buscar dietas o clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
                className="custom-input"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activas</MenuItem>
                <MenuItem value="inactive">Inactivas</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
            <FormControl fullWidth>
              <InputLabel>Fecha</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Fecha"
                className="custom-input"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="recent">Recientes (7 días)</MenuItem>
                <MenuItem value="old">Antiguas</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Vista de tabla" arrow>
              <IconButton
                onClick={() => setViewMode('table')}
                color={viewMode === 'table' ? 'primary' : 'default'}
                className="custom-icon"
                sx={{
                  backgroundColor: viewMode === 'table' ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vista de tarjetas" arrow>
              <IconButton
                onClick={() => setViewMode('cards')}
                color={viewMode === 'cards' ? 'primary' : 'default'}
                className="custom-icon"
                sx={{
                  backgroundColor: viewMode === 'cards' ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {filteredDiets.length} dieta{filteredDiets.length !== 1 ? 's' : ''} encontrada{filteredDiets.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Table View */}
      {viewMode === 'table' && (
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.04)',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <TableContainer>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                              <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    '& .MuiTableCell-root': {
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }
                  }}>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>TMB</TableCell>
                    <TableCell>Calorías Totales</TableCell>
                    <TableCell>Creada</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {filteredDiets.map((diet) => {
                  const stats = calculateDietStats(diet)
                  return (
                    <TableRow key={diet.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{diet.name}</Typography>
                      </TableCell>
                      <TableCell>{diet.clientName}</TableCell>
                      <TableCell>{Math.round(diet.tmb).toLocaleString()} cal</TableCell>
                      <TableCell>{Math.round(stats.totalCalories)} cal</TableCell>
                      <TableCell>{new Date(diet.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label="Activa" 
                          color="success" 
                          size="small"
                          className="custom-chip"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver dieta" arrow>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDiet(diet)}
                            className="custom-icon"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar dieta" arrow>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditDiet(diet)}
                            className="custom-icon"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Compartir dieta" arrow>
                          <IconButton 
                            size="small" 
                            color="secondary"
                            onClick={() => handleShareDiet(diet)}
                            className="custom-icon"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar dieta" arrow>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteDiet(diet)}
                            className="custom-icon"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <Grid container spacing={3}>
          {filteredDiets.map((diet) => {
            const stats = calculateDietStats(diet)
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={diet.id}>
                <Card 
                  elevation={0}
                  className="custom-card"
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.04)',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        {diet.name}
                      </Typography>
                      <Chip label="Activa" color="success" size="small" className="custom-chip" />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        TMB: {Math.round(diet.tmb).toLocaleString()} cal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: {Math.round(stats.totalCalories)} cal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(diet.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDiet(diet)}
                        className="custom-button"
                        sx={{
                          borderColor: theme.palette.grey[400],
                          color: theme.palette.text.primary,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: 'rgba(46, 125, 50, 0.04)',
                          }
                        }}
                      >
                        Ver
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditDiet(diet)}
                        className="custom-button"
                        sx={{
                          borderColor: theme.palette.grey[400],
                          color: theme.palette.text.primary,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: 'rgba(46, 125, 50, 0.04)',
                          }
                        }}
                      >
                        Editar
                      </Button>
                      <Tooltip title="Más opciones" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, diet)}
                          className="custom-icon"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(46, 125, 50, 0.1)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Empty State */}
      {filteredDiets.length === 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.04)',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <RestaurantIcon 
            sx={{ 
              fontSize: 64, 
              color: theme.palette.text.secondary,
              mb: 2,
              opacity: 0.5
            }} 
          />
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
            No se encontraron dietas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
              ? 'Intenta ajustar tu búsqueda o filtros'
              : 'Crea tu primera dieta para comenzar'
            }
          </Typography>
          {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateDiet}
              className="custom-button"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Crear Primera Dieta
            </Button>
          )}
        </Paper>
      )}

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Diet Preview - {selectedDiet?.name}
        </DialogTitle>
        <DialogContent>
          {selectedDiet && (
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle2">Client:</Typography>
                  <Typography variant="body1">{selectedDiet.clientName}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle2">TMB:</Typography>
                  <Typography variant="body1">{Math.round(selectedDiet.tmb).toLocaleString()} cal</Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle2">Created:</Typography>
                  <Typography variant="body1">{new Date(selectedDiet.createdAt).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle2">Total Calories:</Typography>
                  <Typography variant="body1">{Math.round(calculateDietStats(selectedDiet).totalCalories)} cal</Typography>
                </Box>
              </Box>
              
              <Alert severity="info">
                This is a preview of the diet. Use the Edit button to make changes.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained"
            onClick={() => {
              setPreviewDialogOpen(false)
              if (selectedDiet) handleEditDiet(selectedDiet)
            }}
          >
            Edit Diet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Diet</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{dietToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedDietForMenu) handleDuplicateDiet(selectedDietForMenu)
          handleMenuClose()
        }}>
          <ContentCopyIcon sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedDietForMenu) handleShareDiet(selectedDietForMenu)
          handleMenuClose()
        }}>
          <ShareIcon sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedDietForMenu) handleDeleteDiet(selectedDietForMenu)
          handleMenuClose()
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DietList 