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
  unitOfMeasure: string
  calories: string
  proteins: string
  fats: string
  carbs: string
  fiber: string
  link: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  age?: number
  weight?: number
  height?: number
  gender: 'male' | 'female' | ''
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
  clientName: string
  tmb: number
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
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type MealType = string // Ahora es dinámico, puede ser cualquier string (mealId)
