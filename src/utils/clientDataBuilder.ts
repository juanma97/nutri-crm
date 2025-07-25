import type { Client, ClientFormData, HealthInfo, TrainingAndGoals, LifestyleData } from '../types'

// Tipos para las funciones de parsing
export interface ParsedClientInfo {
  name: string
  email: string
  phone: string
  age?: number
  gender: 'male' | 'female' | ''
  height?: number
  weight?: number
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  goal: 'lose_weight' | 'maintain' | 'gain_weight' | 'muscle_gain' | 'health'
  notes: string
  status: 'active' | 'inactive' | 'completed'
}

export interface ParsedPersonalData {
  firstName?: string
  lastName?: string
  birthDate?: string
  phone?: string
  address?: string
  city?: string
  howDidYouKnow?: string
  whyChooseServices?: string
}

/**
 * Parsea la información básica del cliente (Tab 1)
 */
export function parseClientInfo(formData: ClientFormData): ParsedClientInfo {
  return {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone || '',
    age: formData.age ? Number(formData.age) : undefined,
    gender: (formData.gender || '') as 'male' | 'female' | '',
    height: formData.height ? Number(formData.height) : undefined,
    weight: formData.weight ? Number(formData.weight) : undefined,
    activityLevel: formData.activityLevel,
    goal: formData.goal,
    notes: formData.notes || '',
    status: formData.status
  }
}

/**
 * Parsea los datos personales (Tab 1 - sección personal)
 */
export function parsePersonalData(formData: ClientFormData): ParsedPersonalData {
  return {
    firstName: formData.personalData.firstName || '',
    lastName: formData.personalData.lastName || '',
    birthDate: formData.personalData.birthDate || '',
    phone: formData.personalData.phone || formData.phone || '',
    address: formData.personalData.address || '',
    city: formData.personalData.city || '',
    howDidYouKnow: formData.personalData.howDidYouKnow || '',
    whyChooseServices: formData.personalData.whyChooseServices || ''
  }
}

/**
 * Parsea la información de salud (Tab 2)
 */
export function parseHealthInfo(formData: ClientFormData): HealthInfo {
  return {
    parqQuestions: {
      respiratoryHeartDisease: {
        question: '¿Padeces alguna enfermedad respiratoria o de corazón?',
        answer: formData.healthInfo.parqQuestions.respiratoryHeartDisease.answer,
        comments: formData.healthInfo.parqQuestions.respiratoryHeartDisease.comments || ''
      },
      muscleJointInjuries: {
        question: '¿Tienes lesiones o problemas musculares o articulares?',
        answer: formData.healthInfo.parqQuestions.muscleJointInjuries.answer,
        comments: formData.healthInfo.parqQuestions.muscleJointInjuries.comments || ''
      },
      herniasLoadWork: {
        question: '¿Tienes hernias u otras afecciones similares que puedan dificultar el trabajo con cargas?',
        answer: formData.healthInfo.parqQuestions.herniasLoadWork.answer,
        comments: formData.healthInfo.parqQuestions.herniasLoadWork.comments || ''
      },
      sleepProblems: {
        question: '¿Tienes problemas para conciliar el sueño?',
        answer: formData.healthInfo.parqQuestions.sleepProblems.answer,
        comments: formData.healthInfo.parqQuestions.sleepProblems.comments || ''
      },
      smoking: {
        question: '¿Fumas? Si es así, ¿cuánto?',
        answer: formData.healthInfo.parqQuestions.smoking.answer,
        comments: formData.healthInfo.parqQuestions.smoking.comments || ''
      },
      alcoholConsumption: {
        question: '¿Bebes alcohol? Si es así, ¿qué bebidas y qué cantidad consumes?',
        answer: formData.healthInfo.parqQuestions.alcoholConsumption.answer,
        comments: formData.healthInfo.parqQuestions.alcoholConsumption.comments || ''
      },
      chronicDiseases: {
        question: '¿Padeces de hipertensión, diabetes o alguna enfermedad crónica?',
        answer: formData.healthInfo.parqQuestions.chronicDiseases.answer,
        comments: formData.healthInfo.parqQuestions.chronicDiseases.comments || ''
      },
      highCholesterol: {
        question: '¿Tienes el colesterol alto?',
        answer: formData.healthInfo.parqQuestions.highCholesterol.answer,
        comments: formData.healthInfo.parqQuestions.highCholesterol.comments || ''
      }
    },
    additionalComments: formData.healthInfo.additionalComments || '',
    diseases: formData.healthInfo.diseases || '',
    bloodType: formData.healthInfo.bloodType || '',
    isSmoker: formData.healthInfo.isSmoker || false,
    isDiabetic: formData.healthInfo.isDiabetic || false,
    isCeliac: formData.healthInfo.isCeliac || false,
    foodIntolerances: formData.healthInfo.foodIntolerances || '',
    workStressLevel: formData.healthInfo.workStressLevel || 5,
    personalStressLevel: formData.healthInfo.personalStressLevel || 5
  }
}

/**
 * Parsea la información de entrenamiento (Tab 3)
 */
export function parseTrainingAndGoals(formData: ClientFormData): TrainingAndGoals {
  return {
    currentTrainingHistory: formData.trainingAndGoals.currentTrainingHistory || '',
    dislikedExercises: formData.trainingAndGoals.dislikedExercises || '',
    preferredExercises: formData.trainingAndGoals.preferredExercises || '',
    preferredTrainingDays: formData.trainingAndGoals.preferredTrainingDays || '',
    realisticTrainingDays: formData.trainingAndGoals.realisticTrainingDays || '',
    currentCardio: formData.trainingAndGoals.currentCardio || '',
    trainingTimeOfDay: formData.trainingAndGoals.trainingTimeOfDay || '',
    sportsPracticed: formData.trainingAndGoals.sportsPracticed || '',
    injuryHistory: formData.trainingAndGoals.injuryHistory || '',
    mainGoals: formData.trainingAndGoals.mainGoals || ''
  }
}

/**
 * Parsea la información de nutrición y suplementación (Tab 4)
 */
export function parseLifestyleData(formData: ClientFormData): LifestyleData {
  return {
    hasTakenSupplements: formData.lifestyleData.hasTakenSupplements || '',
    currentSupplements: formData.lifestyleData.currentSupplements || '',
    wouldLikeSupplements: formData.lifestyleData.wouldLikeSupplements || '',
    currentDiet: formData.lifestyleData.currentDiet || '',
    dietEffectiveness: formData.lifestyleData.dietEffectiveness || '',
    hungerExperience: formData.lifestyleData.hungerExperience || '',
    appetiteTiming: formData.lifestyleData.appetiteTiming || '',
    eatingOutHabits: formData.lifestyleData.eatingOutHabits || '',
    foodAllergies: formData.lifestyleData.foodAllergies || '',
    likedFoods: formData.lifestyleData.likedFoods || '',
    dislikedFoods: formData.lifestyleData.dislikedFoods || '',
    usualDrinks: formData.lifestyleData.usualDrinks || '',
    workDescription: formData.lifestyleData.workDescription || ''
  }
}

/**
 * Función principal que construye el objeto ClientData completo
 * @param formData - Estado actual del formulario
 * @param previousData - Datos del cliente anterior (para edición)
 * @param isEditMode - Si estamos en modo edición
 * @returns Objeto ClientData listo para enviar a Firestore
 */
export function buildClientData(
  formData: ClientFormData, 
  previousData?: Client, 
  isEditMode: boolean = false
): Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {
  
  // Parsear cada sección
  const clientInfo = parseClientInfo(formData)
  const personalData = parsePersonalData(formData)
  const healthInfo = parseHealthInfo(formData)
  const trainingAndGoals = parseTrainingAndGoals(formData)
  const lifestyleData = parseLifestyleData(formData)

  // Construir el objeto base
  const clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
    ...clientInfo,
    personalData,
    healthInfo,
    trainingAndGoals,
    lifestyleData,
    // Campos eliminados del formulario pero requeridos por el tipo Client
    medicalConditions: '',
    allergies: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  }

  // Manejar la edad de manera especial
  if (formData.age && formData.age.trim()) {
    const parsedAge = Number(formData.age)
    if (!isNaN(parsedAge) && parsedAge > 0) {
      clientData.age = parsedAge
    }
  } else if (isEditMode && previousData?.age) {
    // En edición, mantener la edad original si no hay nueva
    clientData.age = previousData.age
  } else {
    // Si no hay edad válida, establecer un valor por defecto o lanzar error
    clientData.age = 0 // Esto será validado por validateClientData
  }

  // Manejar altura y peso de manera similar
  if (formData.height && formData.height.trim()) {
    const parsedHeight = Number(formData.height)
    if (!isNaN(parsedHeight) && parsedHeight > 0) {
      clientData.height = parsedHeight
    }
  } else if (isEditMode && previousData?.height) {
    clientData.height = previousData.height
  } else {
    clientData.height = 0 // Esto será validado por validateClientData
  }

  if (formData.weight && formData.weight.trim()) {
    const parsedWeight = Number(formData.weight)
    if (!isNaN(parsedWeight) && parsedWeight > 0) {
      clientData.weight = parsedWeight
    }
  } else if (isEditMode && previousData?.weight) {
    clientData.weight = previousData.weight
  } else {
    clientData.weight = 0 // Esto será validado por validateClientData
  }

  // En modo edición, preservar campos que no están en el formulario
  if (isEditMode && previousData) {
    // Preservar campos que no se modifican en el formulario
    clientData.nextVisit = previousData.nextVisit
  }

  return clientData
}

/**
 * Función para validar que los datos sean consistentes antes de enviar
 * @param clientData - Datos del cliente a validar
 * @returns true si los datos son válidos
 */
export function validateClientData(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): boolean {
  // Validaciones básicas obligatorias
  if (!clientData.name?.trim()) return false
  if (!clientData.email?.trim()) return false
  if (!/\S+@\S+\.\S+/.test(clientData.email)) return false
  
  // Edad es obligatoria
  if (!clientData.age || clientData.age < 1 || clientData.age > 120) return false
  
  // Altura es obligatoria
  if (!clientData.height || clientData.height < 100 || clientData.height > 250) return false
  
  // Peso es obligatorio
  if (!clientData.weight || clientData.weight < 30 || clientData.weight > 300) return false

  return true
}

/**
 * Función para limpiar datos vacíos y optimizar el objeto
 * @param clientData - Datos del cliente
 * @returns Objeto optimizado sin campos vacíos innecesarios
 */
export function optimizeClientData(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {
  const optimized = { ...clientData }

  // Limpiar personalData si está vacío
  if (optimized.personalData) {
    const personalData = optimized.personalData
    if (Object.values(personalData).every(value => !value || value === '')) {
      delete optimized.personalData
    }
  }

  // Limpiar healthInfo si está vacío
  if (optimized.healthInfo) {
    const healthInfo = optimized.healthInfo
    const hasParqAnswers = Object.values(healthInfo.parqQuestions).some(q => q.answer !== null)
    const hasOtherData = healthInfo.additionalComments || healthInfo.diseases || healthInfo.bloodType || 
                        healthInfo.isSmoker || healthInfo.isDiabetic || healthInfo.isCeliac || 
                        healthInfo.foodIntolerances || healthInfo.workStressLevel !== 5 || healthInfo.personalStressLevel !== 5
    
    if (!hasParqAnswers && !hasOtherData) {
      delete optimized.healthInfo
    }
  }

  // Limpiar trainingAndGoals si está vacío
  if (optimized.trainingAndGoals) {
    const trainingData = optimized.trainingAndGoals
    if (Object.values(trainingData).every(value => !value || value === '')) {
      delete optimized.trainingAndGoals
    }
  }

  // Limpiar lifestyleData si está vacío
  if (optimized.lifestyleData) {
    const lifestyleData = optimized.lifestyleData
    if (Object.values(lifestyleData).every(value => !value || value === '')) {
      delete optimized.lifestyleData
    }
  }

  return optimized
} 