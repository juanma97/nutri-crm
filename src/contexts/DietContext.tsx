import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Diet } from '../types'

interface DietContextType {
  diets: Diet[]
  addDiet: (diet: Omit<Diet, 'id' | 'createdAt' | 'shareId'>) => void
  updateDiet: (id: number, updates: Partial<Diet>) => void
  deleteDiet: (id: number) => void
  getDietById: (id: number) => Diet | undefined
  getDietByShareId: (shareId: string) => Diet | undefined
  generateShareId: () => string
}

const DietContext = createContext<DietContextType | undefined>(undefined)

// Mock data inicial
const initialDiets: Diet[] = [
  {
    id: 1,
    clientName: 'Juan Pérez',
    tmb: 1850,
    meals: {
      monday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      tuesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      wednesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      thursday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      friday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      saturday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      sunday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] }
    },
    createdAt: new Date('2024-01-15'),
    shareId: 'abc123'
  },
  {
    id: 2,
    clientName: 'María García',
    tmb: 1650,
    meals: {
      monday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      tuesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      wednesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      thursday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      friday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      saturday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      sunday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] }
    },
    createdAt: new Date('2024-01-20'),
    shareId: 'def456'
  },
  {
    id: 3,
    clientName: 'Carlos López',
    tmb: 2200,
    meals: {
      monday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      tuesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      wednesday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      thursday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      friday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      saturday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] },
      sunday: { breakfast: [], morningSnack: [], lunch: [], afternoonSnack: [], dinner: [] }
    },
    createdAt: new Date('2024-01-25'),
    shareId: 'ghi789'
  }
]

export const DietProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [diets, setDiets] = useState<Diet[]>(initialDiets)

  const generateShareId = (): string => {
    return Math.random().toString(36).substring(2, 8)
  }

  const addDiet = (dietData: Omit<Diet, 'id' | 'createdAt' | 'shareId'>) => {
    const newId = Math.max(...diets.map(d => d.id), 0) + 1
    const newDiet: Diet = {
      ...dietData,
      id: newId,
      createdAt: new Date(),
      shareId: generateShareId()
    }
    setDiets(prev => [...prev, newDiet])
  }

  const updateDiet = (id: number, updates: Partial<Diet>) => {
    setDiets(prev => prev.map(diet => 
      diet.id === id ? { ...diet, ...updates } : diet
    ))
  }

  const deleteDiet = (id: number) => {
    setDiets(prev => prev.filter(diet => diet.id !== id))
  }

  const getDietById = (id: number): Diet | undefined => {
    return diets.find(diet => diet.id === id)
  }

  const getDietByShareId = (shareId: string): Diet | undefined => {
    return diets.find(diet => diet.shareId === shareId)
  }

  const value: DietContextType = {
    diets,
    addDiet,
    updateDiet,
    deleteDiet,
    getDietById,
    getDietByShareId,
    generateShareId
  }

  return (
    <DietContext.Provider value={value}>
      {children}
    </DietContext.Provider>
  )
}

export const useDietContext = (): DietContextType => {
  const context = useContext(DietContext)
  if (context === undefined) {
    throw new Error('useDietContext must be used within a DietProvider')
  }
  return context
} 