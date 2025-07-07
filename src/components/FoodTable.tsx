import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import type { Food } from '../types'

interface FoodTableProps {
  foods: Food[]
  onEditFood: (food: Food) => void
  onDeleteFood: (id: string) => void
  onAddFood: () => void
}

const FoodTable = ({ foods, onEditFood, onDeleteFood, onAddFood }: FoodTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.group.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGroupColor = (group: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      'Vegetables': 'success',
      'Fruits': 'success',
      'Grains': 'warning',
      'Proteins': 'error',
      'Dairy': 'info',
      'Fats': 'warning',
      'Beverages': 'primary'
    }
    return colors[group] || 'default'
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Food Database ({foods.length} foods)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddFood}
        >
          Add Food
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search foods..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Name</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Portion</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Proteins (g)</TableCell>
              <TableCell align="right">Fats (g)</TableCell>
              <TableCell align="right">Carbs (g)</TableCell>
              <TableCell align="right">Fiber (g)</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFoods.map((food) => (
              <TableRow key={food.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{food.name}</Typography>
                  {food.link && (
                    <Typography variant="caption" color="textSecondary">
                      <a href={food.link} target="_blank" rel="noopener noreferrer">
                        View details
                      </a>
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={food.group} 
                    size="small" 
                    color={getGroupColor(food.group)}
                  />
                </TableCell>
                <TableCell>{food.portion}</TableCell>
                <TableCell align="right">{food.calories}</TableCell>
                <TableCell align="right">{food.proteins}</TableCell>
                <TableCell align="right">{food.fats}</TableCell>
                <TableCell align="right">{food.carbs}</TableCell>
                <TableCell align="right">{food.fiber}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onEditFood(food)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteFood(food.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default FoodTable 