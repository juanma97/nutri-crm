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
  Tooltip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import FilterListIcon from '@mui/icons-material/FilterList'
import type { Food } from '../types'
import { useFirebase } from '../contexts/FirebaseContext'
import FoodForm from '../components/FoodForm'

const foodGroups = ['Proteins', 'Vegetables', 'Grains', 'Fruits', 'Dairy', 'Fats', 'Others']

const FoodList = () => {
  const theme = useTheme()
  const { foods, addFood, updateFood, deleteFood, loadingFoods } = useFirebase()
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
            Alimentos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFood}
          className="custom-button"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: 'translateY(-1px)',
            }
          }}
        >
          Agregar Alimento
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
              placeholder="Buscar alimentos..."
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
          <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <FormControl fullWidth>
              <InputLabel>Grupo</InputLabel>
              <Select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                label="Grupo"
                className="custom-input"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <MenuItem value="all">Todos los Grupos</MenuItem>
                {foodGroups.map(group => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {filteredFoods.length} alimento{filteredFoods.length !== 1 ? 's' : ''} encontrado{filteredFoods.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Table */}
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
                <TableRow key={food.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{food.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={food.group} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{food.portion} {food.unitOfMeasure || 'unidad'}</TableCell>
                  <TableCell>{food.calories}</TableCell>
                  <TableCell>{food.proteins}g</TableCell>
                  <TableCell>{food.fats}g</TableCell>
                  <TableCell>{food.carbs}g</TableCell>
                  <TableCell>{food.fiber}g</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar alimento" arrow>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditFood(food)}
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
                    <Tooltip title="Eliminar alimento" arrow>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteFood(food)}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Empty State */}
      {filteredFoods.length === 0 && (
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
            No se encontraron alimentos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || groupFilter !== 'all' 
              ? 'Intenta ajustar tu búsqueda o filtros'
              : 'Agrega tu primer alimento para comenzar'
            }
          </Typography>
          {!searchTerm && groupFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddFood}
              className="custom-button"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Agregar Primer Alimento
            </Button>
          )}
        </Paper>
      )}

      {/* Add/Edit Food Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 600,
          fontSize: '1.25rem'
        }}>
          {editingFood ? 'Editar Alimento' : 'Agregar Nuevo Alimento'}
        </DialogTitle>
        <DialogContent>
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
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme.palette.error.main,
          fontWeight: 600,
          fontSize: '1.25rem'
        }}>
          Eliminar Alimento
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            ¿Estás seguro de que quieres eliminar "{foodToDelete?.name}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
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
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            className="custom-button"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                transform: 'translateY(-1px)',
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

export default FoodList 