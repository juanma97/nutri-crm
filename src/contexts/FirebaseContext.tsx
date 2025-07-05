import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './AuthContext'
import type { Diet, Food } from '../types'

interface FirebaseContextType {
  // Foods
  foods: Food[]
  addFood: (food: Omit<Food, 'id'>) => Promise<boolean>
  updateFood: (id: string, updates: Partial<Food>) => Promise<boolean>
  deleteFood: (id: string) => Promise<boolean>
  loadingFoods: boolean
  
  // Diets
  diets: Diet[]
  addDiet: (diet: Omit<Diet, 'id' | 'createdAt' | 'shareId'>) => Promise<boolean>
  updateDiet: (id: string, updates: Partial<Diet>) => Promise<boolean>
  deleteDiet: (id: string) => Promise<boolean>
  getDietByShareId: (shareId: string) => Diet | undefined
  loadingDiets: boolean
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [foods, setFoods] = useState<Food[]>([])
  const [diets, setDiets] = useState<Diet[]>([])
  const [loadingFoods, setLoadingFoods] = useState(false)
  const [loadingDiets, setLoadingDiets] = useState(false)

  // Generar shareId único
  const generateShareId = (): string => {
    return Math.random().toString(36).substring(2, 8)
  }

  // Cargar alimentos del usuario
  const loadFoods = async () => {
    if (!user) return
    
    try {
      setLoadingFoods(true)
      const foodsRef = collection(db, 'foods')
      const q = query(
        foodsRef, 
        where('userId', '==', user.id)
        // orderBy('createdAt', 'desc') // Temporalmente comentado hasta que se cree el índice
      )
      const querySnapshot = await getDocs(q)
      
      const foodsData: Food[] = []
      querySnapshot.forEach((doc) => {
        foodsData.push({ id: doc.id, ...doc.data() } as Food)
      })
      
      setFoods(foodsData)
    } catch (error) {
      console.error('Error loading foods:', error)
    } finally {
      setLoadingFoods(false)
    }
  }

  // Cargar dietas del usuario
  const loadDiets = async () => {
    if (!user) return
    
    try {
      setLoadingDiets(true)
      const dietsRef = collection(db, 'diets')
      const q = query(
        dietsRef, 
        where('userId', '==', user.id)
        // orderBy('createdAt', 'desc') // Temporalmente comentado hasta que se cree el índice
      )
      const querySnapshot = await getDocs(q)
      
      const dietsData: Diet[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        dietsData.push({
          id: parseInt(doc.id),
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Diet)
      })
      
      setDiets(dietsData)
    } catch (error) {
      console.error('Error loading diets:', error)
    } finally {
      setLoadingDiets(false)
    }
  }

  // Cargar datos cuando el usuario cambie
  useEffect(() => {
    if (user) {
      loadFoods()
      loadDiets()
    } else {
      setFoods([])
      setDiets([])
    }
  }, [user])

  // Funciones para alimentos
  const addFood = async (foodData: Omit<Food, 'id'>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const foodsRef = collection(db, 'foods')
      const newFood = {
        ...foodData,
        userId: user.id,
        createdAt: serverTimestamp()
      }
      
      const docRef = await addDoc(foodsRef, newFood)
      const addedFood: Food = { id: docRef.id, ...foodData }
      setFoods(prev => [addedFood, ...prev])
      return true
    } catch (error) {
      console.error('Error adding food:', error)
      return false
    }
  }

  const updateFood = async (id: string, updates: Partial<Food>): Promise<boolean> => {
    try {
      const foodRef = doc(db, 'foods', id)
      await updateDoc(foodRef, updates)
      
      setFoods(prev => prev.map(food => 
        food.id === id ? { ...food, ...updates } : food
      ))
      return true
    } catch (error) {
      console.error('Error updating food:', error)
      return false
    }
  }

  const deleteFood = async (id: string): Promise<boolean> => {
    try {
      const foodRef = doc(db, 'foods', id)
      await deleteDoc(foodRef)
      
      setFoods(prev => prev.filter(food => food.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting food:', error)
      return false
    }
  }

  // Funciones para dietas
  const addDiet = async (dietData: Omit<Diet, 'id' | 'createdAt' | 'shareId'>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const dietsRef = collection(db, 'diets')
      const newDiet = {
        ...dietData,
        userId: user.id,
        shareId: generateShareId(),
        createdAt: serverTimestamp()
      }
      
      const docRef = await addDoc(dietsRef, newDiet)
      const addedDiet: Diet = { 
        id: parseInt(docRef.id), 
        ...dietData,
        shareId: newDiet.shareId,
        createdAt: new Date()
      }
      setDiets(prev => [addedDiet, ...prev])
      return true
    } catch (error) {
      console.error('Error adding diet:', error)
      return false
    }
  }

  const updateDiet = async (id: string, updates: Partial<Diet>): Promise<boolean> => {
    try {
      const dietRef = doc(db, 'diets', id)
      await updateDoc(dietRef, updates)
      
      setDiets(prev => prev.map(diet => 
        diet.id === parseInt(id) ? { ...diet, ...updates } : diet
      ))
      return true
    } catch (error) {
      console.error('Error updating diet:', error)
      return false
    }
  }

  const deleteDiet = async (id: string): Promise<boolean> => {
    try {
      const dietRef = doc(db, 'diets', id)
      await deleteDoc(dietRef)
      
      setDiets(prev => prev.filter(diet => diet.id !== parseInt(id)))
      return true
    } catch (error) {
      console.error('Error deleting diet:', error)
      return false
    }
  }

  const getDietByShareId = (shareId: string): Diet | undefined => {
    return diets.find(diet => diet.shareId === shareId)
  }

  const value: FirebaseContextType = {
    // Foods
    foods,
    addFood,
    updateFood,
    deleteFood,
    loadingFoods,
    
    // Diets
    diets,
    addDiet,
    updateDiet,
    deleteDiet,
    getDietByShareId,
    loadingDiets
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
} 