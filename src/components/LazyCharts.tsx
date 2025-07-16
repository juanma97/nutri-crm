import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'

// Lazy load DietCharts component
const DietCharts = lazy(() => import('./DietCharts'))

interface LazyChartsProps {
  meals: any
  tmb: number
}

const LazyCharts = ({ meals, tmb }: LazyChartsProps) => {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress size={40} sx={{ color: '#2e7d32' }} />
      </Box>
    }>
      <DietCharts meals={meals} tmb={tmb} />
    </Suspense>
  )
}

export default LazyCharts 