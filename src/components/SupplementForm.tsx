import React from 'react'
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Supplement } from '../types'

interface SupplementFormProps {
  supplement: Supplement
  onUpdate: (supplement: Supplement) => void
  onDelete: () => void
  index: number
}

const SupplementForm = ({ supplement, onUpdate, onDelete, index }: SupplementFormProps) => {
  const handleChange = (field: keyof Supplement) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({
      ...supplement,
      [field]: event.target.value
    })
  }

  const isFormValid = supplement.name.trim() !== '' && supplement.quantity.trim() !== ''

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Suplemento {index + 1}
        </Typography>
        <IconButton 
          onClick={onDelete}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Nombre del suplemento"
          value={supplement.name}
          onChange={handleChange('name')}
          required
          error={supplement.name.trim() === ''}
          helperText={supplement.name.trim() === '' ? 'Campo obligatorio' : ''}
          sx={{ flex: '1 1 200px', minWidth: '200px' }}
          size="small"
        />
        
        <TextField
          label="Cantidad"
          value={supplement.quantity}
          onChange={handleChange('quantity')}
          required
          error={supplement.quantity.trim() === ''}
          helperText={supplement.quantity.trim() === '' ? 'Campo obligatorio' : ''}
          placeholder="ej: 2 gr, 1 cápsula, 10 ml"
          sx={{ flex: '1 1 150px', minWidth: '150px' }}
          size="small"
        />
        
        <TextField
          label="Hora (opcional)"
          type="time"
          value={supplement.time || ''}
          onChange={handleChange('time')}
          inputProps={{ shrink: true }}
          sx={{ flex: '1 1 120px', minWidth: '120px' }}
          size="small"
        />
      </Box>
      
      <TextField
        label="Comentarios (opcional)"
        value={supplement.comments || ''}
        onChange={handleChange('comments')}
        placeholder="ej: después de entreno, con el desayuno..."
        fullWidth
        multiline
        rows={2}
        sx={{ mt: 2 }}
        size="small"
      />
    </Paper>
  )
}

export default SupplementForm 