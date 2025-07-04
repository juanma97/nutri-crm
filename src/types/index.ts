export interface Food {
  id: number
  name: string
  group: string
  portion: string
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
