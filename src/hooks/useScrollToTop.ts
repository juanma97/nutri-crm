import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export const useScrollToTop = () => {
  const { pathname } = useLocation()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    // Solo ejecutar si el pathname realmente cambió
    if (prevPathname.current !== pathname) {
      console.log('useScrollToTop: pathname changed from', prevPathname.current, 'to', pathname)
      
      // Forzar scroll hacia arriba de múltiples maneras
      const scrollToTop = () => {
        // Método 1: window.scrollTo directo
        window.scrollTo(0, 0)
        
        // Método 2: document.documentElement
        if (document.documentElement) {
          document.documentElement.scrollTop = 0
        }
        
        // Método 3: document.body
        if (document.body) {
          document.body.scrollTop = 0
        }
        
        // Método 4: window.scrollTo con smooth
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      // Ejecutar inmediatamente
      scrollToTop()
      
      // Y también con delays para asegurar que funcione
      setTimeout(scrollToTop, 100)
      setTimeout(scrollToTop, 300)
    }
    
    prevPathname.current = pathname
  }, [pathname])
} 