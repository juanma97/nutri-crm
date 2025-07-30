export interface Food {
  id: string
  name: string
  group: string
  portion: string
  unitOfMeasure: string
  calories: number
  proteins: number
  fats: number
  carbs: number
  fiber: number
  link: string
}

export interface FoodFormData {
  name: string
  group: string
  portion: string
  calories: string
  proteins: string
  fats: string
  carbs: string
  fiber: string
  link: string
}

export interface PersonalData {
  firstName?: string
  lastName?: string
  birthDate?: string
  phone?: string
  address?: string
  city?: string
  howDidYouKnow?: string
  whyChooseServices?: string
}

export interface HealthQuestion {
  question: string
  answer: 'yes' | 'no' | null
  comments?: string
}

export interface HealthInfo {
  // Preguntas PAR-Q
  parqQuestions: {
    respiratoryHeartDisease: HealthQuestion
    muscleJointInjuries: HealthQuestion
    herniasLoadWork: HealthQuestion
    sleepProblems: HealthQuestion
    smoking: HealthQuestion
    alcoholConsumption: HealthQuestion
    chronicDiseases: HealthQuestion
    highCholesterol: HealthQuestion
  }
  additionalComments?: string
  
  // Preguntas cortas de salud
  diseases?: string
  bloodType?: string
  isSmoker?: boolean
  isDiabetic?: boolean
  isCeliac?: boolean
  foodIntolerances?: string
  workStressLevel?: number // 1-10
  personalStressLevel?: number // 1-10
}

export interface TrainingAndGoals {
  // Preguntas largas
  currentTrainingHistory?: string
  dislikedExercises?: string
  preferredExercises?: string
  
  // Preguntas cortas
  preferredTrainingDays?: string
  realisticTrainingDays?: string
  currentCardio?: string
  trainingTimeOfDay?: string
  sportsPracticed?: string
  injuryHistory?: string
  
  // Pregunta clave
  mainGoals?: string
}

export interface LifestyleData {
  // Suplementación
  hasTakenSupplements?: string
  currentSupplements?: string
  wouldLikeSupplements?: string
  
  // Nutrición
  currentDiet?: string
  dietEffectiveness?: string
  hungerExperience?: string
  appetiteTiming?: string
  eatingOutHabits?: string
  foodAllergies?: string
  likedFoods?: string
  dislikedFoods?: string
  usualDrinks?: string
  
  // Rutina Diaria
  workDescription?: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  age?: number
  weight?: number
  height?: number
  gender: 'male' | 'female' | 'other' | ''
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  goal: 'lose_weight' | 'maintain' | 'gain_weight' | 'muscle_gain' | 'health'
  medicalConditions: string
  allergies: string
  notes: string
  status: 'active' | 'inactive' | 'completed'
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  personalData?: PersonalData
  healthInfo?: HealthInfo
  trainingAndGoals?: TrainingAndGoals
  lifestyleData?: LifestyleData
  createdAt: Date
  updatedAt: Date
  nextVisit?: Date
}

export interface ClientFormData {
  name: string
  email: string
  phone: string
  age: string
  gender: string
  weight: string
  height: string
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  goal: 'lose_weight' | 'maintain' | 'gain_weight' | 'muscle_gain' | 'health'
  medicalConditions: string
  allergies: string
  notes: string
  status: 'active' | 'inactive' | 'completed'
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  personalData: PersonalData
  healthInfo: HealthInfo
  trainingAndGoals: TrainingAndGoals
  lifestyleData: LifestyleData
}

export interface DietMeal {
  foodId: number
  foodName: string
  quantity: number
  unit: string
  calories: number
  proteins: number
  fats: number
  carbs: number
  fiber: number
}

// Nuevos tipos para comidas dinámicas
export interface DynamicMeal {
  id: string
  name: string
  order: number
}

// Comidas dinámicas por día - objeto con claves dinámicas
export interface DynamicDayMeals {
  [mealId: string]: DietMeal[]
}

// Mantener compatibilidad hacia atrás con la estructura original
export interface DayMeals {
  breakfast: DietMeal[]
  morningSnack: DietMeal[]
  lunch: DietMeal[]
  afternoonSnack: DietMeal[]
  dinner: DietMeal[]
}

export interface Supplement {
  id: string
  name: string
  quantity: string
  time?: string
  comments?: string
}

export interface CustomGoal {
  calories: number
  proteins: number
  carbs: number
  fats: number
  fiber: number
}

export interface Diet {
  id: string
  name: string
  clientName?: string // Opcional para plantillas
  tmb?: number // Opcional para plantillas
  clientData?: Client
  customGoal?: CustomGoal // Objetivo personalizado opcional
  meals: {
    monday: DynamicDayMeals
    tuesday: DynamicDayMeals
    wednesday: DynamicDayMeals
    thursday: DynamicDayMeals
    friday: DynamicDayMeals
    saturday: DynamicDayMeals
    sunday: DynamicDayMeals
  }
  mealDefinitions?: DynamicMeal[] // Definición de comidas dinámicas
  supplements?: Supplement[]
  createdAt: Date
  shareId?: string
  isTemplate?: boolean // Campo para identificar plantillas
  templateId?: string // ID de la plantilla original (si es una dieta creada desde plantilla)
  // Campos específicos de plantillas
  description?: string
  category?: string // 'weight_loss', 'muscle_gain', 'maintenance', 'health', 'custom'
  updatedAt?: Date // Para plantillas
  usageCount?: number // Para plantillas
  isPublic?: boolean // Para plantillas
}

// Alias para compatibilidad - DietTemplate es lo mismo que Diet
export type DietTemplate = Diet

// Tipo para crear plantillas (igual que Diet pero sin campos de cliente)
export type DietTemplateCreateData = Omit<Diet, 'id' | 'createdAt' | 'shareId' | 'clientName' | 'tmb' | 'clientData'>

// Tipo para actualizar plantillas
export type DietTemplateUpdateData = Partial<Omit<Diet, 'id' | 'createdAt' | 'shareId'>>

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type MealType = string // Ahora es dinámico, puede ser cualquier string (mealId)
