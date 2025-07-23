import type { Client } from '../types'

export const calculateTMB = (client: Client): number => {
  // Validación detallada para depuración
  if (!client.weight || client.weight <= 0) {
    console.warn('TMB calculation failed: Invalid weight', client.weight)
    return 0
  }
  if (!client.height || client.height <= 0) {
    console.warn('TMB calculation failed: Invalid height', client.height)
    return 0
  }
  if (!client.age || client.age <= 0) {
    console.warn('TMB calculation failed: Invalid age', client.age)
    return 0
  }
  if (!client.gender || (client.gender !== 'male' && client.gender !== 'female')) {
    console.warn('TMB calculation failed: Invalid gender', client.gender)
    return 0
  }

  // Fórmula de Mifflin-St Jeor (más precisa que Harris-Benedict)
  let tmb = 10 * client.weight + 6.25 * client.height - 5 * client.age
  tmb = client.gender === 'male' ? tmb + 5 : tmb - 161

  // Aplicar factor de actividad si está disponible
  if (client.activityLevel) {
    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    }
    
    const factor = activityFactors[client.activityLevel] || 1.2
    return Math.round(tmb * factor)
  }

  // Si no hay nivel de actividad, devolver solo TMB basal
  return Math.round(tmb)
} 