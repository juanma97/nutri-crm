import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  CircularProgress,
  Avatar,
  ListItemIcon,
  ListItemText,
  useTheme,
  Grid
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { Client } from '../types'

const ClientList = () => {
  const theme = useTheme()
  const { clients, deleteClient, loadingClients } = useFirebase()
  const navigate = useNavigate()
  const { showSuccess } = useNotifications()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedClientForMenu, setSelectedClientForMenu] = useState<Client | null>(null)


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'warning'
      case 'completed': return 'info'
      default: return 'default'
    }
  }

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'lose_weight': return 'Perder peso'
      case 'maintain': return 'Mantener peso'
      case 'gain_weight': return 'Ganar peso'
      case 'muscle_gain': return 'Ganar músculo'
      case 'health': return 'Mejorar salud'
      default: return goal
    }
  }

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedClient) {
      const success = await deleteClient(selectedClient.id)
      if (success) {
        showSuccess('Cliente eliminado correctamente')
      }
      setDeleteDialogOpen(false)
      setSelectedClient(null)
    }
  }

  const handleCreateClient = () => {
    navigate('/clients/new')
  }

  const handleViewClient = (client: Client) => {
    navigate(`/clients/${client.id}`)
  }

  const handleEditClient = (client: Client) => {
    navigate(`/clients/edit/${client.id}`)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, client: Client) => {
    setAnchorEl(event.currentTarget)
    setSelectedClientForMenu(client)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedClientForMenu(null)
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loadingClients) {
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
          <PersonIcon 
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
            Clientes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClient}
          className="custom-button"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: 'translateY(-1px)',
            }
          }}
        >
          Agregar Cliente
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
              placeholder="Buscar clientes..."
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
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
                <MenuItem value="completed">Completados</MenuItem>
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
          {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
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
            <Table>
                              <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    '& .MuiTableCell-root': {
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }
                  }}>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Contacto</TableCell>
                    <TableCell>Edad</TableCell>
                    <TableCell>Objetivo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Próxima visita</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: theme.palette.primary.main,
                            width: 40,
                            height: 40
                          }}
                          className="custom-avatar"
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{client.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {client.gender === 'male' ? 'Hombre' : 'Mujer'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" />
                          {client.email}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" />
                          {client.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{client.age} años</TableCell>
                    <TableCell>
                      <Chip 
                        label={getGoalLabel(client.goal)} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={client.status === 'active' ? 'Activo' : client.status === 'inactive' ? 'Inactivo' : 'Completado'} 
                        color={getStatusColor(client.status) as 'success' | 'warning' | 'info' | 'default'}
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {client.nextVisit ? new Date(client.nextVisit).toLocaleDateString() : 'No programada'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver cliente" arrow>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewClient(client)}
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
                      <Tooltip title="Editar cliente" arrow>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditClient(client)}
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
                      <Tooltip title="Más opciones" arrow>
                        <IconButton 
                          size="small"
                          onClick={(e) => handleMenuOpen(e, client)}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <Grid container spacing={3}>
          {filteredClients.map((client) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={client.id}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.primary.main,
                          width: 48,
                          height: 48
                        }}
                        className="custom-avatar"
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                          {client.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {client.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={client.status === 'active' ? 'Activo' : client.status === 'inactive' ? 'Inactivo' : 'Completado'} 
                      color={getStatusColor(client.status) as 'success' | 'warning' | 'info' | 'default'}
                      size="small"
                      className="custom-chip"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Edad: {client.age} años
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono: {client.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Objetivo: {getGoalLabel(client.goal)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Próxima visita: {client.nextVisit ? new Date(client.nextVisit).toLocaleDateString() : 'No programada'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewClient(client)}
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
                      onClick={() => handleEditClient(client)}
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
                        onClick={(e) => handleMenuOpen(e, client)}
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
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
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
          <PersonIcon 
            sx={{ 
              fontSize: 64, 
              color: theme.palette.text.secondary,
              mb: 2,
              opacity: 0.5
            }} 
          />
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
            No se encontraron clientes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer cliente'
            }
          </Typography>
          {!searchTerm && statusFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClient}
              className="custom-button"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Agregar Cliente
            </Button>
          )}
        </Paper>
      )}

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
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            ¿Estás seguro de que quieres eliminar a "{selectedClient?.name}"? Esta acción no se puede deshacer.
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

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedClientForMenu) {
            handleDeleteClient(selectedClientForMenu)
          }
          handleMenuClose()
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ClientList 