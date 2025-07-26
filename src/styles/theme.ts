import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'

// Paleta de colores optimizada para neuromarketing en nutrición
const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#2E7D32', // Verde saludable principal
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9800', // Naranja cálido para acentos
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#212121',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: '#212121',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      color: '#212121',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#212121',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#212121',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      color: '#212121',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#757575',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#757575',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#212121',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#757575',
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#757575',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: '#757575',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.15)',
    '0px 8px 16px rgba(0, 0, 0, 0.2)',
    '0px 12px 24px rgba(0, 0, 0, 0.25)',
    '0px 16px 32px rgba(0, 0, 0, 0.3)',
    '0px 20px 40px rgba(0, 0, 0, 0.35)',
    '0px 24px 48px rgba(0, 0, 0, 0.4)',
    '0px 28px 56px rgba(0, 0, 0, 0.45)',
    '0px 32px 64px rgba(0, 0, 0, 0.5)',
    '0px 36px 72px rgba(0, 0, 0, 0.55)',
    '0px 40px 80px rgba(0, 0, 0, 0.6)',
    '0px 44px 88px rgba(0, 0, 0, 0.65)',
    '0px 48px 96px rgba(0, 0, 0, 0.7)',
    '0px 52px 104px rgba(0, 0, 0, 0.75)',
    '0px 56px 112px rgba(0, 0, 0, 0.8)',
    '0px 60px 120px rgba(0, 0, 0, 0.85)',
    '0px 64px 128px rgba(0, 0, 0, 0.9)',
    '0px 68px 136px rgba(0, 0, 0, 0.95)',
    '0px 72px 144px rgba(0, 0, 0, 1)',
    '0px 76px 152px rgba(0, 0, 0, 1)',
    '0px 80px 160px rgba(0, 0, 0, 1)',
    '0px 84px 168px rgba(0, 0, 0, 1)',
    '0px 88px 176px rgba(0, 0, 0, 1)',
    '0px 92px 184px rgba(0, 0, 0, 1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #F57C00 0%, #FF9800 100%)',
            boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2E7D32',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2E7D32',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#2E7D32',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        },
        elevation3: {
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: '#2E7D32',
          color: '#FFFFFF',
        },
        colorSecondary: {
          backgroundColor: '#FF9800',
          color: '#FFFFFF',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            color: '#2E7D32',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#2E7D32',
          height: 3,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid #4CAF50',
          color: '#4CAF50',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          border: '1px solid #FF9800',
          color: '#FF9800',
        },
        standardError: {
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid #F44336',
          color: '#F44336',
        },
        standardInfo: {
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          border: '1px solid #2196F3',
          color: '#2196F3',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2E7D32',
          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
        },
      },
    },
  },
}

const theme = createTheme(themeOptions)

export default theme