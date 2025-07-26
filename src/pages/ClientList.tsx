import React, { useState, useEffect } from 'react'
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
  Divider,
  useTheme,
  alpha
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
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  Info as InfoIcon,
  HealthAndSafety as HealthIcon,
  Warning as WarningIcon,
  FitnessCenter as FitnessIcon,
  Restaurant as RestaurantIcon,
  People as PeopleIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useFirebase } from '../contexts/FirebaseContext'
import { useNotifications } from '../hooks/useNotifications'
import type { Client } from '../types'
import { motion } from 'framer-motion'

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
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)

  // Scroll hacia arriba cuando se monta el componente
  useEffect(() => {
    console.log('ClientList: component mounted, scrolling to top')
    window.scrollTo(0, 0)
  }, [])



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
    setSelectedClient(client)
    setViewDetailsOpen(true)
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`
      }}>
        <CircularProgress size={60} sx={{ 
          color: theme.palette.primary.main,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }} />
      </Box>
    )
  }

  return (
    <Box sx={{ 
      width: '100%', 
      py: 3, 
      px: 3,
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PeopleIcon sx={{ 
              color: theme.palette.primary.main,
              fontSize: 32
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Clientes
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClient}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
              color: 'white',
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              py: 1.5,
              px: 3,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
              }
            }}
          >
            Agregar Cliente
          </Button>
        </Box>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <TextField
                fullWidth
                placeholder="Buscar clientes..."
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
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.95),
                    }
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
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    }
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
              <Tooltip title="Vista de tabla">
                <IconButton
                  onClick={() => setViewMode('table')}
                  sx={{
                    backgroundColor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: viewMode === 'table' ? theme.palette.primary.main : theme.palette.text.secondary,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vista de tarjetas">
                <IconButton
                  onClick={() => setViewMode('cards')}
                  sx={{
                    backgroundColor: viewMode === 'cards' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: viewMode === 'cards' ? theme.palette.primary.main : theme.palette.text.secondary,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'scale(1.05)',
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
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Box sx={{ 
          mb: 2,
          p: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 2,
          display: 'inline-block'
        }}>
          <Typography variant="body2" sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 600
          }}>
            {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </motion.div>

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Paper
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
              overflow: 'hidden'
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                  }}>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.8rem'
                    }}>
                      Cliente
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.8rem'
                    }}>
                      Contacto
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.8rem'
                    }}>
                      Edad
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.8rem'
                    }}>
                      Objetivo
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.8rem'
                    }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.8rem'
                    }}>
                      Próxima visita
                    </TableCell>
                    <TableCell align="center" sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.primary.main,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.8rem'
                    }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#2e7d32' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{client.name}</Typography>
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
                      <Tooltip title="Ver">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewClient(client)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditClient(client)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Más opciones">
                        <IconButton 
                          size="small"
                          onClick={(e) => handleMenuOpen(e, client)}
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
        </motion.div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredClients.map((client) => (
            <Box key={client.id} sx={{ flex: '1 1 350px', minWidth: '300px' }}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#2e7d32' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="div">
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
                    >
                      Ver
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClient(client)}
                    >
                      Editar
                    </Button>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, client)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron clientes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
              sx={{ backgroundColor: '#2e7d32' }}
            >
              Agregar Cliente
            </Button>
          )}
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar a "{selectedClient?.name}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Client Details Modal */}
      <Dialog 
        open={viewDetailsOpen} 
        onClose={() => setViewDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#2e7d32' }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="h6">
              {selectedClient?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Datos Personales */}
              {selectedClient.personalData && (
                <>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontWeight: 500 }}>
                      Datos Personales
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            Nombre completo:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.personalData.firstName} {selectedClient.personalData.lastName}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: '1 1 300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CakeIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            Fecha de nacimiento:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.personalData.birthDate ? 
                            new Date(selectedClient.personalData.birthDate).toLocaleDateString() : 
                            'No especificada'
                          }
                        </Typography>
                      </Box>

                      <Box sx={{ flex: '1 1 300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PhoneIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            Teléfono:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.personalData.phone || selectedClient.phone || 'No especificado'}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: '1 1 300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            Ubicación:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.personalData.address && selectedClient.personalData.city ? 
                            `${selectedClient.personalData.address}, ${selectedClient.personalData.city}` : 
                            selectedClient.personalData.address || selectedClient.personalData.city || 'No especificada'
                          }
                        </Typography>
                      </Box>
                    </Box>

                    {selectedClient.personalData.howDidYouKnow && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <InfoIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            ¿Cómo me has conocido?
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.personalData.howDidYouKnow}
                        </Typography>
                      </Box>
                    )}

                    {selectedClient.personalData.whyChooseServices && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <InfoIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            ¿Qué te ha hecho querer contratar mis servicios?
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.personalData.whyChooseServices}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Información General */}
              <Box>
                <Typography variant="h6" sx={{ color: '#2e7d32', mb: 2, fontWeight: 500 }}>
                  Información General
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {selectedClient.email}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: '1 1 300px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PersonIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Género:
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {selectedClient.gender === 'male' ? 'Masculino' : 
                       selectedClient.gender === 'female' ? 'Femenino' : 'No especificado'}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: '1 1 300px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CakeIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Edad:
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {selectedClient.age} años
                    </Typography>
                  </Box>

                  <Box sx={{ flex: '1 1 300px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InfoIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Estado:
                      </Typography>
                    </Box>
                    <Chip 
                      label={selectedClient.status === 'active' ? 'Activo' : 
                             selectedClient.status === 'inactive' ? 'Inactivo' : 'Completado'} 
                      color={getStatusColor(selectedClient.status) as 'success' | 'warning' | 'info' | 'default'}
                      size="small" 
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InfoIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Objetivo:
                      </Typography>
                    </Box>
                    <Chip 
                      label={getGoalLabel(selectedClient.goal)} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InfoIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Nivel de actividad:
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {selectedClient.activityLevel === 'sedentary' ? 'Sedentario' :
                       selectedClient.activityLevel === 'lightly_active' ? 'Ligeramente activo' :
                       selectedClient.activityLevel === 'moderately_active' ? 'Moderadamente activo' :
                       selectedClient.activityLevel === 'very_active' ? 'Muy activo' : 'Extremadamente activo'}
                    </Typography>
                  </Box>

                  {selectedClient.weight && (
                    <Box sx={{ flex: '1 1 300px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <InfoIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Peso:
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {selectedClient.weight} kg
                      </Typography>
                    </Box>
                  )}

                  {selectedClient.height && (
                    <Box sx={{ flex: '1 1 300px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <InfoIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Altura:
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {selectedClient.height} cm
                      </Typography>
                    </Box>
                  )}
                </Box>

                {selectedClient.medicalConditions && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InfoIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Condiciones médicas:
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {selectedClient.medicalConditions}
                    </Typography>
                  </Box>
                )}

                {selectedClient.allergies && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InfoIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Alergias:
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {selectedClient.allergies}
                    </Typography>
                  </Box>
                )}

                {selectedClient.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InfoIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Notas adicionales:
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {selectedClient.notes}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Información de Salud */}
              {selectedClient.healthInfo && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2, fontWeight: 500 }}>
                      Información de Salud
                    </Typography>
                    
                    {/* Preguntas PAR-Q */}
                    <Typography variant="subtitle2" sx={{ color: '#d32f2f', mb: 2, fontWeight: 400 }}>
                      Cuestionario PAR-Q
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                      {Object.entries(selectedClient.healthInfo.parqQuestions).map(([key, question]) => (
                        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {question.question}
                          </Typography>
                          <Chip 
                            label={question.answer === 'yes' ? 'Sí' : question.answer === 'no' ? 'No' : 'No respondido'} 
                            color={question.answer === 'yes' ? 'error' : question.answer === 'no' ? 'success' : 'default'}
                            size="small" 
                          />
                        </Box>
                      ))}
                    </Box>

                    {/* Información de salud personal */}
                    <Typography variant="subtitle2" sx={{ color: '#d32f2f', mb: 2, fontWeight: 400 }}>
                      Información Personal de Salud
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {selectedClient.healthInfo.diseases && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <HealthIcon fontSize="small" color="error" />
                            <Typography variant="body2" color="text.secondary">
                              Enfermedades:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.healthInfo.diseases}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.healthInfo.bloodType && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <HealthIcon fontSize="small" color="error" />
                            <Typography variant="body2" color="text.secondary">
                              Grupo Sanguíneo:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.healthInfo.bloodType}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ flex: '1 1 300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <HealthIcon fontSize="small" color="error" />
                          <Typography variant="body2" color="text.secondary">
                            Condiciones:
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {selectedClient.healthInfo.isSmoker && (
                            <Chip label="Fumador" color="warning" size="small" />
                          )}
                          {selectedClient.healthInfo.isDiabetic && (
                            <Chip label="Diabético" color="error" size="small" />
                          )}
                          {selectedClient.healthInfo.isCeliac && (
                            <Chip label="Celíaco" color="warning" size="small" />
                          )}
                        </Box>
                      </Box>

                      {selectedClient.healthInfo.foodIntolerances && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <WarningIcon fontSize="small" color="error" />
                            <Typography variant="body2" color="text.secondary">
                              Intolerancias/Alergias:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.healthInfo.foodIntolerances}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.healthInfo.workStressLevel && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <WarningIcon fontSize="small" color="error" />
                            <Typography variant="body2" color="text.secondary">
                              Estrés laboral:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            Nivel {selectedClient.healthInfo.workStressLevel}/10
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.healthInfo.personalStressLevel && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <WarningIcon fontSize="small" color="error" />
                            <Typography variant="body2" color="text.secondary">
                              Estrés personal:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            Nivel {selectedClient.healthInfo.personalStressLevel}/10
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {selectedClient.healthInfo.additionalComments && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <InfoIcon fontSize="small" color="error" />
                          <Typography variant="body2" color="text.secondary">
                            Comentarios adicionales:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.healthInfo.additionalComments}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {/* Entrenamiento y Objetivos */}
              {selectedClient.trainingAndGoals && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#ff9800', mb: 2, fontWeight: 500 }}>
                      Entrenamiento y Objetivos
                    </Typography>
                    
                    {/* Información de entrenamiento */}
                    <Typography variant="subtitle2" sx={{ color: '#ff9800', mb: 2, fontWeight: 400 }}>
                      Experiencia y Preferencias
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {selectedClient.trainingAndGoals.currentTrainingHistory && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FitnessIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary">
                              Entrenamiento actual:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.trainingAndGoals.currentTrainingHistory}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.trainingAndGoals.preferredTrainingDays && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FitnessIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary">
                              Días preferidos:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.trainingAndGoals.preferredTrainingDays}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.trainingAndGoals.realisticTrainingDays && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FitnessIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary">
                              Días realistas:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.trainingAndGoals.realisticTrainingDays}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.trainingAndGoals.currentCardio && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FitnessIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary">
                              Cardio actual:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.trainingAndGoals.currentCardio}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.trainingAndGoals.trainingTimeOfDay && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FitnessIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary">
                              Horario de entrenamiento:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.trainingAndGoals.trainingTimeOfDay}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.trainingAndGoals.sportsPracticed && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FitnessIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary">
                              Deportes practicados:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.trainingAndGoals.sportsPracticed}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Ejercicios preferidos y no preferidos */}
                    {(selectedClient.trainingAndGoals.preferredExercises || selectedClient.trainingAndGoals.dislikedExercises) && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#ff9800', mb: 2, fontWeight: 400 }}>
                          Preferencias de Ejercicios
                        </Typography>
                        
                        {selectedClient.trainingAndGoals.preferredExercises && (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <FitnessIcon fontSize="small" color="success" />
                              <Typography variant="body2" color="text.secondary">
                                Ejercicios preferidos:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {selectedClient.trainingAndGoals.preferredExercises}
                            </Typography>
                          </Box>
                        )}

                        {selectedClient.trainingAndGoals.dislikedExercises && (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <FitnessIcon fontSize="small" color="error" />
                              <Typography variant="body2" color="text.secondary">
                                Ejercicios no preferidos:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {selectedClient.trainingAndGoals.dislikedExercises}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Historial de lesiones */}
                    {selectedClient.trainingAndGoals.injuryHistory && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <WarningIcon fontSize="small" color="warning" />
                          <Typography variant="body2" color="text.secondary">
                            Historial de lesiones:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.trainingAndGoals.injuryHistory}
                        </Typography>
                      </Box>
                    )}

                    {/* Objetivos principales */}
                    {selectedClient.trainingAndGoals.mainGoals && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#ff9800', mb: 2, fontWeight: 400 }}>
                          Objetivos Principales
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <FitnessIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            Objetivos esperados:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.trainingAndGoals.mainGoals}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {/* Suplementación y Nutrición */}
              {selectedClient.lifestyleData && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#9c27b0', mb: 2, fontWeight: 500 }}>
                      Suplementación y Nutrición
                    </Typography>
                    
                    {/* Suplementación */}
                    <Typography variant="subtitle2" sx={{ color: '#9c27b0', mb: 2, fontWeight: 400 }}>
                      Suplementación
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {selectedClient.lifestyleData.hasTakenSupplements && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Experiencia con suplementos:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.hasTakenSupplements}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.lifestyleData.currentSupplements && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Suplementos actuales:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.currentSupplements}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.lifestyleData.wouldLikeSupplements && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Suplementos de interés:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.wouldLikeSupplements}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Nutrición */}
                    <Typography variant="subtitle2" sx={{ color: '#9c27b0', mb: 2, fontWeight: 400, mt: 3 }}>
                      Nutrición
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {selectedClient.lifestyleData.currentDiet && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Dieta actual:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.currentDiet}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.lifestyleData.dietEffectiveness && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Efectividad de la dieta:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.dietEffectiveness}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.lifestyleData.hungerExperience && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Experiencia con hambre:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.hungerExperience}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.lifestyleData.appetiteTiming && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Momento de más apetito:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.appetiteTiming}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.lifestyleData.eatingOutHabits && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Comer fuera de casa:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.eatingOutHabits}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.lifestyleData.foodAllergies && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <WarningIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary">
                              Alergias alimentarias:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.foodAllergies}
                          </Typography>
                        </Box>
                      )}

                      {selectedClient.lifestyleData.usualDrinks && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RestaurantIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="text.secondary">
                              Bebidas habituales:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.lifestyleData.usualDrinks}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Preferencias alimentarias */}
                    {(selectedClient.lifestyleData.likedFoods || selectedClient.lifestyleData.dislikedFoods) && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: '#9c27b0', mb: 2, fontWeight: 400 }}>
                          Preferencias Alimentarias
                        </Typography>
                        
                        {selectedClient.lifestyleData.likedFoods && (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <RestaurantIcon fontSize="small" color="success" />
                              <Typography variant="body2" color="text.secondary">
                                Alimentos que le gustan:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {selectedClient.lifestyleData.likedFoods}
                            </Typography>
                          </Box>
                        )}

                        {selectedClient.lifestyleData.dislikedFoods && (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <RestaurantIcon fontSize="small" color="error" />
                              <Typography variant="body2" color="text.secondary">
                                Alimentos que no le gustan:
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {selectedClient.lifestyleData.dislikedFoods}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Rutina diaria */}
                    {selectedClient.lifestyleData.workDescription && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: '#9c27b0', mb: 2, fontWeight: 400 }}>
                          Rutina Diaria
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <InfoIcon fontSize="small" color="secondary" />
                          <Typography variant="body2" color="text.secondary">
                            Descripción del trabajo:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.lifestyleData.workDescription}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {/* Contacto de Emergencia */}
              {(selectedClient.emergencyContact.name || selectedClient.emergencyContact.phone) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2, fontWeight: 500 }}>
                      Contacto de Emergencia
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <Box sx={{ flex: '1 1 300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon fontSize="small" color="error" />
                          <Typography variant="body2" color="text.secondary">
                            Nombre:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.emergencyContact.name}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: '1 1 300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PhoneIcon fontSize="small" color="error" />
                          <Typography variant="body2" color="text.secondary">
                            Teléfono:
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {selectedClient.emergencyContact.phone}
                        </Typography>
                      </Box>

                      {selectedClient.emergencyContact.relationship && (
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <InfoIcon fontSize="small" color="error" />
                            <Typography variant="body2" color="text.secondary">
                              Relación:
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {selectedClient.emergencyContact.relationship}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDetailsOpen(false)}>
            Cerrar
          </Button>
          <Button 
            onClick={() => {
              setViewDetailsOpen(false)
              if (selectedClient) {
                handleEditClient(selectedClient)
              }
            }}
            variant="contained"
            sx={{ backgroundColor: '#2e7d32' }}
          >
            Editar Cliente
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