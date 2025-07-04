import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Link,
  Typography,
  Box
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import type { Food } from '../types'

interface FoodTableProps {
  foods: Food[]
  onDeleteFood: (id: number) => void
}

const FoodTable = ({ foods, onDeleteFood }: FoodTableProps) => {
  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Food Database
        </Typography>
      </Box>
      <TableContainer>
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
              <TableCell>Link</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foods.map((food) => (
              <TableRow key={food.id} hover>
                <TableCell>{food.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={food.group} 
                    size="small" 
                    sx={{ backgroundColor: '#e8f5e8' }}
                  />
                </TableCell>
                <TableCell>{food.portion}</TableCell>
                <TableCell align="right">{food.calories}</TableCell>
                <TableCell align="right">{food.proteins}</TableCell>
                <TableCell align="right">{food.fats}</TableCell>
                <TableCell align="right">{food.carbs}</TableCell>
                <TableCell align="right">{food.fiber}</TableCell>
                <TableCell>
                  {food.link && (
                    <Link href={food.link} target="_blank">
                      <LinkIcon fontSize="small" />
                    </Link>
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
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
    </Paper>
  )
}

export default FoodTable 