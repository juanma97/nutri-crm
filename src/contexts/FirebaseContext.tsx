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
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import type { Diet, Food, Client } from '../types'

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
  loadDietByShareId: (shareId: string) => Promise<Diet | null>
  loadingDiets: boolean
  
  // Clients
  clients: Client[]
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateClient: (id: string, updates: Partial<Client>) => Promise<boolean>
  deleteClient: (id: string) => Promise<boolean>
  getClientById: (id: string) => Client | undefined
  getClientDiets: (clientId: string) => Diet[]
  loadingClients: boolean
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { showSuccess, showError } = useNotifications()
  
  const [foods, setFoods] = useState<Food[]>([])
  const [diets, setDiets] = useState<Diet[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loadingFoods, setLoadingFoods] = useState(false)
  const [loadingDiets, setLoadingDiets] = useState(false)
  const [loadingClients, setLoadingClients] = useState(false)

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
        
        // Migrar dietas existentes al nuevo formato de comidas dinámicas
        let meals = data.meals
        let mealDefinitions = data.mealDefinitions
        
        // Si no hay mealDefinitions, crear las por defecto basadas en la estructura existente
        if (!mealDefinitions && meals) {
          const defaultMeals = [
            { id: 'breakfast', name: 'Breakfast', order: 1 },
            { id: 'morningSnack', name: 'Morning Snack', order: 2 },
            { id: 'lunch', name: 'Lunch', order: 3 },
            { id: 'afternoonSnack', name: 'Afternoon Snack', order: 4 },
            { id: 'dinner', name: 'Dinner', order: 5 }
          ]
          
          // Verificar si la dieta usa el formato antiguo
          const hasOldFormat = meals.monday && meals.monday.breakfast !== undefined
          
          if (hasOldFormat) {
            mealDefinitions = defaultMeals
          }
        }
        
        dietsData.push({
          id: doc.id,
          ...data,
          // Asegurar compatibilidad con dietas existentes que no tienen suplementos
          supplements: data.supplements || [],
          mealDefinitions: mealDefinitions || [],
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

  // Cargar clientes del usuario
  const loadClients = async () => {
    if (!user) return
    
    try {
      setLoadingClients(true)
      const clientsRef = collection(db, 'clients')
      const q = query(
        clientsRef, 
        where('userId', '==', user.id)
      )
      const querySnapshot = await getDocs(q)
      
      const clientsData: Client[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        
        clientsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          nextVisit: data.nextVisit?.toDate()
        } as Client)
      })
      
      setClients(clientsData)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoadingClients(false)
    }
  }

  // Cargar datos cuando el usuario cambie
  useEffect(() => {
    if (user) {
      loadFoods()
      loadDiets()
      loadClients()
    } else {
      setFoods([])
      setDiets([])
      setClients([])
    }
  }, [user])

  // Funciones para alimentos
  const addFood = async (foodData: Omit<Food, 'id'>): Promise<boolean> => {
    if (!user) {
      showError('No user authenticated')
      return false
    }
    
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
      showSuccess('Alimento agregado correctamente')
      return true
    } catch (error) {
      console.error('Error adding food:', error)
      showError('Error al agregar alimento')
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
      showSuccess('Alimento actualizado correctamente')
      return true
    } catch (error) {
      console.error('Error updating food:', error)
      showError('Error al actualizar alimento')
      return false
    }
  }

  const deleteFood = async (id: string): Promise<boolean> => {
    try {
      const foodRef = doc(db, 'foods', id)
      await deleteDoc(foodRef)
      
      setFoods(prev => prev.filter(food => food.id !== id))
      showSuccess('Alimento eliminado correctamente')
      return true
    } catch (error) {
      console.error('Error deleting food:', error)
      showError('Error al eliminar alimento')
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
        id: docRef.id,
        ...dietData,
        shareId: newDiet.shareId,
        createdAt: new Date()
      }
      setDiets(prev => [addedDiet, ...prev])
      showSuccess('Dieta creada correctamente')
      return true
    } catch (error) {
      console.error('Error adding diet:', error)
      showError('Error al crear dieta')
      return false
    }
  }

  const updateDiet = async (id: string, updates: Partial<Diet>): Promise<boolean> => {
    try {
      const dietRef = doc(db, 'diets', id)
      await updateDoc(dietRef, updates)
      
      setDiets(prev => prev.map(diet => 
        diet.id === id ? { ...diet, ...updates } : diet
      ))
      showSuccess('Dieta actualizada correctamente')
      return true
    } catch (error) {
      console.error('Error updating diet:', error)
      showError('Error al actualizar dieta')
      return false
    }
  }

  const deleteDiet = async (id: string): Promise<boolean> => {
    try {
      const dietRef = doc(db, 'diets', id)
      await deleteDoc(dietRef)
      
      setDiets(prev => prev.filter(diet => diet.id !== id))
      showSuccess('Dieta eliminada correctamente')
      return true
    } catch (error) {
      console.error('Error deleting diet:', error)
      showError('Error al eliminar dieta')
      return false
    }
  }

  const getDietByShareId = (shareId: string): Diet | undefined => {
    return diets.find(diet => diet.shareId === shareId)
  }

  const loadDietByShareId = async (shareId: string): Promise<Diet | null> => {
    try {
      const dietsRef = collection(db, 'diets')
      const q = query(dietsRef, where('shareId', '==', shareId))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        
        // Migrar dietas existentes al nuevo formato de comidas dinámicas
        let meals = data.meals
        let mealDefinitions = data.mealDefinitions
        
        // Si no hay mealDefinitions, crear las por defecto basadas en la estructura existente
        if (!mealDefinitions && meals) {
          const defaultMeals = [
            { id: 'breakfast', name: 'Breakfast', order: 1 },
            { id: 'morningSnack', name: 'Morning Snack', order: 2 },
            { id: 'lunch', name: 'Lunch', order: 3 },
            { id: 'afternoonSnack', name: 'Afternoon Snack', order: 4 },
            { id: 'dinner', name: 'Dinner', order: 5 }
          ]
          
          // Verificar si la dieta usa el formato antiguo
          const hasOldFormat = meals.monday && meals.monday.breakfast !== undefined
          
          if (hasOldFormat) {
            mealDefinitions = defaultMeals
          }
        }
        
        return {
          id: doc.id,
          ...data,
          // Asegurar compatibilidad con dietas existentes que no tienen suplementos
          supplements: data.supplements || [],
          mealDefinitions: mealDefinitions || [],
          createdAt: data.createdAt?.toDate() || new Date()
        } as Diet
      }
      return null
    } catch (error) {
      console.error('Error loading diet by shareId:', error)
      return null
    }
  }

  // Funciones para clientes
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const clientsRef = collection(db, 'clients')
      
      // Asegurar que birthDate se guarde correctamente
      const clientToSave = {
        ...clientData,
        userId: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      // La edad ya es un número, no necesita conversión especial
      
      const docRef = await addDoc(clientsRef, clientToSave)
      const addedClient: Client = { 
        id: docRef.id,
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setClients(prev => [addedClient, ...prev])
      showSuccess('Cliente agregado correctamente')
      return true
    } catch (error) {
      console.error('Error adding client:', error)
      showError('Error al agregar cliente')
      return false
    }
  }

  const updateClient = async (id: string, updates: Partial<Client>): Promise<boolean> => {
    try {
      const clientRef = doc(db, 'clients', id)
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      }
      await updateDoc(clientRef, updateData)
      
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...updates, updatedAt: new Date() } : client
      ))
      showSuccess('Cliente actualizado correctamente')
      return true
    } catch (error) {
      console.error('Error updating client:', error)
      showError('Error al actualizar cliente')
      return false
    }
  }

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const clientRef = doc(db, 'clients', id)
      await deleteDoc(clientRef)
      
      setClients(prev => prev.filter(client => client.id !== id))
      showSuccess('Cliente eliminado correctamente')
      return true
    } catch (error) {
      console.error('Error deleting client:', error)
      showError('Error al eliminar cliente')
      return false
    }
  }

  const getClientById = (id: string): Client | undefined => {
    return clients.find(client => client.id === id)
  }

  const getClientDiets = (clientId: string): Diet[] => {
    return diets.filter(diet => diet.clientName === getClientById(clientId)?.name)
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
    loadDietByShareId,
    loadingDiets,
    
    // Clients
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    getClientDiets,
    loadingClients
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