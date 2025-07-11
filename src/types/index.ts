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

export interface DayMeals {
  breakfast: DietMeal[]
  morningSnack: DietMeal[]
  lunch: DietMeal[]
  afternoonSnack: DietMeal[]
  dinner: DietMeal[]
}

export interface Diet {
  id: string
  name: string
  clientName: string
  tmb: number
  clientData?: Client
  meals: {
    monday: DayMeals
    tuesday: DayMeals
    wednesday: DayMeals
    thursday: DayMeals
    friday: DayMeals
    saturday: DayMeals
    sunday: DayMeals
  }
  createdAt: Date
  shareId?: string
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type MealType = 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner'
