import React, { useState } from 'react'
import { Box } from '@mui/material'
import FoodForm from '../components/FoodForm'
import FoodTable from '../components/FoodTable'
import type { Food } from '../types'

const initialFoods: Food[] = [
  {
    id: 1,
    name: 'Chicken Breast',
    group: 'Proteins',
    portion: '100g',
    calories: 165,
    proteins: 31,
    fats: 3.6,
    carbs: 0,
    fiber: 0,
    link: 'https://example.com'
  },
  {
    id: 2,
    name: 'Broccoli',
    group: 'Vegetables',
    portion: '100g',
    calories: 34,
    proteins: 2.8,
    fats: 0.4,
    carbs: 7,
    fiber: 2.6,
    link: ''
  }
]

const FoodList = () => {
  const [foods, setFoods] = useState<Food[]>(initialFoods)

  const handleAddFood = (newFood: Omit<Food, 'id'>) => {
    const foodWithId = {
      ...newFood,
      id: Math.max(...foods.map(f => f.id), 0) + 1
    }
    setFoods([...foods, foodWithId])
  }

  const handleDeleteFood = (id: number) => {
    setFoods(foods.filter(food => food.id !== id))
  }

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>
      <FoodForm onAddFood={handleAddFood} />
      <FoodTable foods={foods} onDeleteFood={handleDeleteFood} />
    </Box>
  )
}

export default FoodList 