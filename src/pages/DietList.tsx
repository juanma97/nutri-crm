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
  alpha
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
import { motion } from 'framer-motion'
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
      (diet.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        gap: 2
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: theme.palette.primary.main,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Cargando dietas...
          </Typography>
        </motion.div>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      py: 3, 
      px: 3,
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
      position: 'relative'
    }}>
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 200,
        height: 200,
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
        borderRadius: '50%',
        zIndex: 0
      }} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <RestaurantIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
            </motion.div>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: '-0.01em'
              }}
            >
              Dietas
            </Typography>
          </Box>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateDiet}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: 'translateY(-2px)',
                },
                '&:focus': {
                  outline: 'none',
                }
              }}
            >
              Crear Dieta
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <TextField
                fullWidth
                placeholder="Buscar dietas o clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                    },
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  }
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    }
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="recent">Recientes (7 días)</MenuItem>
                  <MenuItem value="old">Antiguas</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Vista de Tabla">
                <IconButton
                  onClick={() => setViewMode('table')}
                  sx={{
                    color: viewMode === 'table' ? theme.palette.primary.main : theme.palette.text.secondary,
                    backgroundColor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    '&:focus': {
                      outline: 'none',
                    }
                  }}
                >
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vista de Tarjetas">
                <IconButton
                  onClick={() => setViewMode('cards')}
                  sx={{
                    color: viewMode === 'cards' ? theme.palette.primary.main : theme.palette.text.secondary,
                    backgroundColor: viewMode === 'cards' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    '&:focus': {
                      outline: 'none',
                    }
                  }}
                >
                  <ViewModuleIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box sx={{ 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          position: 'relative',
          zIndex: 1
        }}>
          <Chip 
            label={filteredDiets.length} 
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {filteredDiets.length === 1 ? 'dieta encontrada' : 'dietas encontradas'}
          </Typography>
        </Box>
      </motion.div>

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper 
            elevation={0}
            sx={{
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              position: 'relative',
              zIndex: 1
            }}
          >
            <TableContainer>
              <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    '& th': {
                      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">{diet.name}</Typography>
                          {diet.isTemplate && (
                            <Chip 
                              label="Plantilla" 
                              color="secondary" 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{diet.clientName}</TableCell>
                      <TableCell>{diet.tmb ? Math.round(diet.tmb).toLocaleString() : 'N/A'} cal</TableCell>
                      <TableCell>{Math.round(stats.totalCalories)} cal</TableCell>
                      <TableCell>{new Date(diet.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label="Active" 
                          color="success" 
                          size="small"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-label': {
                              color: 'white'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDiet(diet)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditDiet(diet)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Compartir">
                          <IconButton 
                            size="small" 
                            color="secondary"
                            onClick={() => handleShareDiet(diet)}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteDiet(diet)}
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
        </motion.div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredDiets.map((diet) => {
            const stats = calculateDietStats(diet)
            return (
              <Box key={diet.id} sx={{ flex: '1 1 350px', minWidth: '300px' }}>
                <Card elevation={3} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" component="div">
                          {diet.name}
                        </Typography>
                        {diet.isTemplate && (
                          <Chip 
                            label="Plantilla" 
                            color="secondary" 
                            size="small" 
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                      <Chip 
                        label="Active" 
                        color="success" 
                        size="small"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          '& .MuiChip-label': {
                            color: 'white'
                          }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        TMB: {diet.tmb ? Math.round(diet.tmb).toLocaleString() : 'N/A'} cal
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
                      >
                        Ver
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditDiet(diet)}
                      >
                        Editar
                      </Button>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, diet)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )
          })}
        </Box>
      )}

      {/* Empty State */}
      {filteredDiets.length === 0 && (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron dietas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
              sx={{ backgroundColor: '#2e7d32' }}
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
                  <Typography variant="body1">{selectedDiet.tmb ? Math.round(selectedDiet.tmb).toLocaleString() : 'N/A'} cal</Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle2">Creada:</Typography>
                  <Typography variant="body1">{new Date(selectedDiet.createdAt).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle2">Calorías Totales:</Typography>
                  <Typography variant="body1">{Math.round(calculateDietStats(selectedDiet).totalCalories)} cal</Typography>
                </Box>
              </Box>
              
              <Alert severity="info">
                Esta es una vista previa de la dieta. Usa el botón Editar para hacer cambios.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Cerrar</Button>
          <Button 
            variant="contained"
            onClick={() => {
              setPreviewDialogOpen(false)
              if (selectedDiet) handleEditDiet(selectedDiet)
            }}
          >
            Editar Dieta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Dieta</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar "{dietToDelete?.name}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
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
          Duplicar
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedDietForMenu) handleShareDiet(selectedDietForMenu)
          handleMenuClose()
        }}>
          <ShareIcon sx={{ mr: 1 }} />
          Compartir
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedDietForMenu) handleDeleteDiet(selectedDietForMenu)
          handleMenuClose()
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Eliminar
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