import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          
          // Firebase - separado por módulos
          'firebase-app': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore'],
          
          // Material-UI
          'mui-vendor': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ],
          
          // Charts library
          'charts-vendor': ['recharts'],
          
          // Router
          'router-vendor': ['react-router-dom'],
          
          // Notifications
          'notifications-vendor': ['notistack']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
