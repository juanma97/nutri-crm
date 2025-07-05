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
  Button 
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { Diet } from '../types'

const mockDiets: Diet[] = [
  {
    id: 1,
    clientName: 'Juan Pérez',
    tmb: 1850,
    meals: {
      monday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      tuesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      wednesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      thursday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      friday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      saturday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      sunday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] }
    },
    createdAt: new Date('2024-01-15')
  }
]

const DietList = () => {
  const [diets, setDiets] = useState<Diet[]>(mockDiets)
  const navigate = useNavigate()

  const handleDeleteDiet = (id: number) => {
    setDiets(diets.filter(diet => diet.id !== id))
  }

  const handleCreateDiet = () => {
    navigate('/diets/create')
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Diets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDiet}
          sx={{ backgroundColor: '#2e7d32' }}
        >
          New Diet
        </Button>
      </Box>
      
      <Paper elevation={3}>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Client Name</TableCell>
                <TableCell>TMB (calories)</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diets.map((diet) => (
                <TableRow key={diet.id} hover>
                  <TableCell>{diet.clientName}</TableCell>
                  <TableCell>{diet.tmb}</TableCell>
                  <TableCell>{diet.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteDiet(diet.id)}
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
    </Box>
  )
}

export default DietList 