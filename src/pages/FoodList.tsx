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
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import type { Food } from '../types'
import { useFirebase } from '../contexts/FirebaseContext'
import FoodForm from '../components/FoodForm'

const foodGroups = ['Proteins', 'Vegetables', 'Grains', 'Fruits', 'Dairy', 'Fats', 'Others']

const FoodList = () => {
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
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', height: '100vw', py: 3, px: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Foods</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFood}
          sx={{ backgroundColor: '#2e7d32' }}
        >
          Add Food
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <TextField
              fullWidth
              placeholder="Search foods..."
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
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <FormControl fullWidth>
              <InputLabel>Group</InputLabel>
              <Select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                label="Group"
              >
                <MenuItem value="all">All Groups</MenuItem>
                {foodGroups.map(group => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredFoods.length} food{filteredFoods.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Portion</TableCell>
                <TableCell>Calories</TableCell>
                <TableCell>Proteins</TableCell>
                <TableCell>Fats</TableCell>
                <TableCell>Carbs</TableCell>
                <TableCell>Fiber</TableCell>
                <TableCell align="center">Actions</TableCell>
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
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditFood(food)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteFood(food)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Empty State */}
      {filteredFoods.length === 0 && (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No foods found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || groupFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Add your first food to get started'
            }
          </Typography>
          {!searchTerm && groupFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddFood}
              sx={{ backgroundColor: '#2e7d32' }}
            >
              Add First Food
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
      >
        <DialogTitle>
          {editingFood ? 'Edit Food' : 'Add New Food'}
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
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Food</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{foodToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FoodList 