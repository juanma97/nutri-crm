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
  Snackbar
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ShareIcon from '@mui/icons-material/Share'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import type { Diet, DayOfWeek } from '../types'
import { useFirebase } from '../contexts/FirebaseContext'

const DietList = () => {
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
    navigate('/diets/create')
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
        <CircularProgress size={60} sx={{ color: '#2e7d32' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Diets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDiet}
          sx={{ backgroundColor: '#2e7d32' }}
        >
          Create Diet
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <TextField
              fullWidth
              placeholder="Search diets or clients..."
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
          <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
            <FormControl fullWidth>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Date"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="recent">Recent (7 days)</MenuItem>
                <MenuItem value="old">Older</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Table View">
              <IconButton
                onClick={() => setViewMode('table')}
                color={viewMode === 'table' ? 'primary' : 'default'}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Card View">
              <IconButton
                onClick={() => setViewMode('cards')}
                color={viewMode === 'cards' ? 'primary' : 'default'}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredDiets.length} diet{filteredDiets.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Table View */}
      {viewMode === 'table' && (
        <Paper elevation={3}>
          <TableContainer>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>TMB</TableCell>
                  <TableCell>Total Calories</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDiets.map((diet) => {
                  const stats = calculateDietStats(diet)
                  return (
                    <TableRow key={diet.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{diet.name}</Typography>
                      </TableCell>
                      <TableCell>{diet.clientName}</TableCell>
                      <TableCell>{diet.tmb.toLocaleString()} cal</TableCell>
                      <TableCell>{Math.round(stats.totalCalories)} cal</TableCell>
                      <TableCell>{new Date(diet.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label="Active" 
                          color="success" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDiet(diet)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditDiet(diet)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton 
                            size="small" 
                            color="secondary"
                            onClick={() => handleShareDiet(diet)}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
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
                      <Typography variant="h6" component="div">
                        {diet.name}
                      </Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        TMB: {diet.tmb.toLocaleString()} cal
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
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditDiet(diet)}
                      >
                        Edit
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
            No diets found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first diet to get started'
            }
          </Typography>
          {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateDiet}
              sx={{ backgroundColor: '#2e7d32' }}
            >
              Create First Diet
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
                  <Typography variant="body1">{selectedDiet.tmb.toLocaleString()} cal</Typography>
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