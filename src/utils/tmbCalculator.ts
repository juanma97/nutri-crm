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
  if (!client.gender || (client.gender !== 'male' && client.gender !== 'female' && client.gender !== 'other')) {
    console.warn('TMB calculation failed: Invalid gender', client.gender)
    return 0
  }

  // Fórmula revisada de Harris-Benedict (1984) - más precisa que la original de 1919
  let tmb: number

  if (client.gender === 'male') {
    // Fórmula para hombres: TMB = 88.362 + (13.397 × peso) + (4.799 × altura) - (5.677 × edad)
    tmb = 88.362 + (13.397 * client.weight) + (4.799 * client.height) - (5.677 * client.age)
  } else if (client.gender === 'female') {
    // Fórmula para mujeres: TMB = 447.593 + (9.247 × peso) + (3.098 × altura) - (4.330 × edad)
    tmb = 447.593 + (9.247 * client.weight) + (3.098 * client.height) - (4.330 * client.age)
  } else {
    // Para género "other": promedio de ambas fórmulas para respetar la diversidad
    const maleTMB = 88.362 + (13.397 * client.weight) + (4.799 * client.height) - (5.677 * client.age)
    const femaleTMB = 447.593 + (9.247 * client.weight) + (3.098 * client.height) - (4.330 * client.age)
    tmb = (maleTMB + femaleTMB) / 2
  }

  // Por defecto, devolver solo TMB basal (sin factor de actividad)
  // El factor de actividad se aplicará en otros lugares del código cuando sea necesario
  return Math.round(tmb)
}

 