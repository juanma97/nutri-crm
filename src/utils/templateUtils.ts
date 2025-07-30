import type { Diet, DietTemplateCreateData } from '../types'

/**
 * Convierte una dieta en datos de plantilla, calculando automáticamente los objetivos nutricionales
 * y excluyendo campos sensibles del cliente
 */
export const convertDietToTemplate = (diet: Diet, templateName: string, description?: string, category: string = 'custom'): DietTemplateCreateData => {
  // Calcular calorías y macronutrientes promedio de la dieta
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  let totalCalories = 0
  let totalProteins = 0
  let totalCarbs = 0
  let totalFats = 0

  daysOfWeek.forEach(day => {
    const dayMeals = diet.meals[day as keyof typeof diet.meals]
    Object.values(dayMeals).forEach((mealList: any[]) => {
      mealList.forEach((meal: any) => {
        totalCalories += meal.calories
        totalProteins += meal.proteins
        totalCarbs += meal.carbs
        totalFats += meal.fats
      })
    })
  })



  // Crear objeto de plantilla excluyendo campos sensibles
  const templateData: DietTemplateCreateData = {
    name: templateName,
    description: description || `Plantilla basada en la dieta de ${diet.clientName}`,
    category,
    meals: diet.meals, // Copiar estructura de comidas tal cual
    mealDefinitions: diet.mealDefinitions || [], // Definiciones de comidas
    supplements: diet.supplements || [], // Suplementos
    isPublic: false
  }

  return templateData
}

/**
 * Función mínima para guardar una dieta como plantilla
 * @param dietId - ID de la dieta a convertir
 * @param templateName - Nombre de la nueva plantilla
 * @param addDietTemplate - Función del contexto para añadir plantilla
 * @param getDietById - Función para obtener dieta por ID
 */
export const saveDietAsTemplate = async (
  dietId: string,
  templateName: string,
  addDietTemplate: (template: DietTemplateCreateData) => Promise<boolean>,
  getDietById: (id: string) => Diet | undefined,
  description?: string,
  category: string = 'custom'
): Promise<boolean> => {
  try {
    // Obtener la dieta original
    const diet = getDietById(dietId)
    if (!diet) {
      throw new Error('Dieta no encontrada')
    }

    // Convertir a plantilla
    const templateData = convertDietToTemplate(diet, templateName, description, category)

    // Guardar como plantilla
    const success = await addDietTemplate(templateData)
    return success
  } catch (error) {
    console.error('Error al guardar dieta como plantilla:', error)
    return false
  }
}

/**
 * Calcula las estadísticas nutricionales de una dieta para mostrar en la UI
 */
export const calculateDietNutritionStats = (diet: Diet) => {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  let totalCalories = 0
  let totalProteins = 0
  let totalCarbs = 0
  let totalFats = 0
  let totalFiber = 0
  let mealCount = 0

  daysOfWeek.forEach(day => {
    const dayMeals = diet.meals[day as keyof typeof diet.meals]
    Object.values(dayMeals).forEach((mealList: any[]) => {
      mealList.forEach((meal: any) => {
        totalCalories += meal.calories
        totalProteins += meal.proteins
        totalCarbs += meal.carbs
        totalFats += meal.fats
        totalFiber += meal.fiber
        mealCount++
      })
    })
  })

  return {
    avgCalories: Math.round(totalCalories / 7),
    avgProteins: Math.round(totalProteins / 7),
    avgCarbs: Math.round(totalCarbs / 7),
    avgFats: Math.round(totalFats / 7),
    avgFiber: Math.round(totalFiber / 7),
    totalMeals: mealCount,
    totalCalories,
    totalProteins,
    totalCarbs,
    totalFats,
    totalFiber
  }
} 