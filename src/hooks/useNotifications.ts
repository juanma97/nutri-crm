import { useSnackbar } from 'notistack'
import type { VariantType } from 'notistack'

export const useNotifications = () => {
  const { enqueueSnackbar } = useSnackbar()

  const showNotification = (message: string, variant: VariantType = 'info') => {
    enqueueSnackbar(message, { variant })
  }

  const showSuccess = (message: string) => {
    showNotification(message, 'success')
  }

  const showError = (message: string) => {
    showNotification(message, 'error')
  }

  const showWarning = (message: string) => {
    showNotification(message, 'warning')
  }

  const showInfo = (message: string) => {
    showNotification(message, 'info')
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
} 