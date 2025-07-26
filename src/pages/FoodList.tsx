import { useState } from 'react'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme,
  alpha,
  Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { motion, AnimatePresence } from 'framer-motion'
import type { Food } from '../types'
import { useFirebase } from '../contexts/FirebaseContext'
import FoodForm from '../components/FoodForm'

const foodGroups = ['Proteins', 'Vegetables', 'Grains', 'Fruits', 'Dairy', 'Fats', 'Others']

const FoodList = () => {
  const { foods, addFood, updateFood, deleteFood, loadingFoods } = useFirebase()
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [foodToDelete, setFoodToDelete] = useState<Food | null>(null)

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGroup = groupFilter === 'all' || food.group === groupFilter
    return matchesSearch && matchesGroup
  })

  const handleAddFood = () => {
    setEditingFood(null)
    setDialogOpen(true)
  }

  const handleEditFood = (food: Food) => {
    setEditingFood(food)
    setDialogOpen(true)
  }

  const handleDeleteFood = (food: Food) => {
    setFoodToDelete(food)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (foodToDelete) {
      const success = await deleteFood(foodToDelete.id)
      if (success) {
        setDeleteDialogOpen(false)
        setFoodToDelete(null)
      }
    }
  }

  const handleSaveFood = async (foodData: Omit<Food, 'id'>) => {
    let success = false
    
    if (editingFood) {
      success = await updateFood(editingFood.id, foodData)
    } else {
      success = await addFood(foodData)
    }
    
    if (success) {
      setDialogOpen(false)
      setEditingFood(null)
    }
  }

  if (loadingFoods) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        gap: 3
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
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h6" color="text.secondary">
            Cargando alimentos...
          </Typography>
        </motion.div>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      py: 4, 
      px: { xs: 2, sm: 3, md: 4 },
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      position: 'relative'
    }}>
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.02,
          background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main} 0%, transparent 50%)`,
          pointerEvents: 'none'
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
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
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <RestaurantIcon 
                  sx={{ 
                    fontSize: 32, 
                    color: theme.palette.primary.main 
                  }} 
                />
              </motion.div>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.02em'
                }}
              >
                Alimentos
              </Typography>
            </Box>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddFood}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
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
                Agregar Alimento
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
              mb: 4,
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              alignItems: 'center' 
            }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  placeholder="Buscar alimentos..."
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
                      borderRadius: 3,
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
              <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                <FormControl fullWidth>
                  <InputLabel>Grupo</InputLabel>
                  <Select
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.target.value)}
                    label="Grupo"
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterListIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.divider, 0.3),
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    }}
                  >
                    <MenuItem value="all">Todos los grupos</MenuItem>
                    {foodGroups.map(group => (
                      <MenuItem key={group} value={group}>{group}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Chip 
                label={filteredFoods.length} 
                size="small" 
                color="primary"
                sx={{ fontWeight: 600 }}
              />
              alimento{filteredFoods.length !== 1 ? 's' : ''} encontrado{filteredFoods.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper 
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          >
            <TableContainer>
              <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    '& th': {
                      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: theme.palette.text.primary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }
                  }}>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Grupo</TableCell>
                    <TableCell>Porción</TableCell>
                    <TableCell>Calorías</TableCell>
                    <TableCell>Proteínas</TableCell>
                    <TableCell>Grasas</TableCell>
                    <TableCell>Carbohidratos</TableCell>
                    <TableCell>Fibra</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                                  <TableBody>
                    {filteredFoods.map((food) => (
                      <TableRow 
                        key={food.id}
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            transform: 'scale(1.01)',
                            transition: 'all 0.2s ease',
                          },
                          '& td': {
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            py: 2,
                          }
                        }}
                      >
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {food.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={food.group} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{
                                borderRadius: 2,
                                fontWeight: 500,
                                borderColor: alpha(theme.palette.primary.main, 0.3),
                                color: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {food.portion} {food.unitOfMeasure || 'unidad'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                              {food.calories} cal
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.success.main }}>
                              {food.proteins}g
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.info.main }}>
                              {food.fats}g
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.secondary.main }}>
                              {food.carbs}g
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                              {food.fiber}g
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleEditFood(food)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    },
                                    '&:focus': {
                                      outline: 'none',
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteFood(food)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                                    },
                                    '&:focus': {
                                      outline: 'none',
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </motion.div>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>

        {/* Empty State */}
        <AnimatePresence>
          {filteredFoods.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  mt: 4,
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(30, 30, 30, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <RestaurantIcon 
                    sx={{ 
                      fontSize: 64, 
                      color: theme.palette.text.secondary,
                      mb: 2,
                      opacity: 0.5
                    }} 
                  />
                </motion.div>
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  No se encontraron alimentos
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
                >
                  {searchTerm || groupFilter !== 'all' 
                    ? 'Intenta ajustar tu búsqueda o filtros'
                    : 'Agrega tu primer alimento para comenzar'
                  }
                </Typography>
                {!searchTerm && groupFilter === 'all' && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddFood}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
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
                      Agregar Primer Alimento
                    </Button>
                  </motion.div>
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Food Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 16px 64px ${alpha(theme.palette.common.black, 0.2)}`,
            }
          }}
        >
          <DialogTitle sx={{ 
            fontWeight: 600,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pb: 2
          }}>
            {editingFood ? 'Editar Alimento' : 'Agregar Nuevo Alimento'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <FoodForm
              food={editingFood}
              onSave={handleSaveFood}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 16px 64px ${alpha(theme.palette.common.black, 0.2)}`,
            }
          }}
        >
          <DialogTitle sx={{ 
            fontWeight: 600,
            color: theme.palette.error.main,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pb: 2
          }}>
            Eliminar Alimento
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                ¿Estás seguro de que quieres eliminar "{foodToDelete?.name}"?
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Esta acción no se puede deshacer.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:focus': {
                  outline: 'none',
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                  boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.4)}`,
                },
                '&:focus': {
                  outline: 'none',
                }
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default FoodList 