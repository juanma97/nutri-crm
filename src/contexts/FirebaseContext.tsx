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
import type { Diet, Food, Client, DietTemplate, DietTemplateCreateData, DietTemplateUpdateData } from '../types'

// Tipos específicos para operaciones de Firestore
type DietCreateData = Omit<Diet, 'id' | 'createdAt' | 'shareId'>
type DietUpdateData = Partial<Diet>

interface FirebaseContextType {
  // Foods
  foods: Food[]
  addFood: (food: Omit<Food, 'id'>) => Promise<boolean>
  updateFood: (id: string, updates: Partial<Food>) => Promise<boolean>
  deleteFood: (id: string) => Promise<boolean>
  loadingFoods: boolean
  
  // Diets
  diets: Diet[]
  addDiet: (diet: DietCreateData) => Promise<boolean>
  updateDiet: (id: string, updates: DietUpdateData) => Promise<boolean>
  deleteDiet: (id: string) => Promise<boolean>
  removeCustomGoal: (dietId: string) => Promise<boolean>
  getDietByShareId: (shareId: string) => Diet | undefined
  loadDietByShareId: (shareId: string) => Promise<Diet | null>
  loadingDiets: boolean
  
  // Diet Templates
  dietTemplates: DietTemplate[]
  addDietTemplate: (template: DietTemplateCreateData) => Promise<boolean>
  updateDietTemplate: (id: string, updates: DietTemplateUpdateData) => Promise<boolean>
  deleteDietTemplate: (id: string) => Promise<boolean>
  assignTemplateToClient: (templateId: string, clientId: string, clientName: string, tmb: number) => Promise<boolean>
  createClientDietFromTemplate: (templateId: string, clientId: string, clientName: string, tmb: number) => Promise<boolean>
  loadingDietTemplates: boolean
  
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
  const [dietTemplates, setDietTemplates] = useState<DietTemplate[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loadingFoods, setLoadingFoods] = useState(false)
  const [loadingDiets, setLoadingDiets] = useState(false)
  const [loadingDietTemplates, setLoadingDietTemplates] = useState(false)
  const [loadingClients, setLoadingClients] = useState(false)

  // Generar shareId único
  const generateShareId = (): string => {
    return Math.random().toString(36).substring(2, 8)
  }

  // Función helper para limpiar datos de Firestore y manejar customGoal
  const cleanFirestoreData = (data: any): any => {
    const cleaned = { ...data }
    
    // Si customGoal es null o undefined, no incluirlo en los datos
    if (cleaned.customGoal === null || cleaned.customGoal === undefined) {
      delete cleaned.customGoal
    }
    
    return cleaned
  }

  // Función helper para limpiar datos del cliente antes de enviar a Firestore
  const cleanClientData = (data: any): any => {
    const cleaned = { ...data }
    
    // Eliminar campos undefined que Firestore no acepta
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === undefined) {
        delete cleaned[key]
      }
    })
    
    // Manejar campos anidados
    if (cleaned.personalData) {
      Object.keys(cleaned.personalData).forEach(key => {
        if (cleaned.personalData[key] === undefined) {
          delete cleaned.personalData[key]
        }
      })
    }
    
    if (cleaned.healthInfo) {
      Object.keys(cleaned.healthInfo).forEach(key => {
        if (cleaned.healthInfo[key] === undefined) {
          delete cleaned.healthInfo[key]
        }
      })
    }
    
    if (cleaned.trainingAndGoals) {
      Object.keys(cleaned.trainingAndGoals).forEach(key => {
        if (cleaned.trainingAndGoals[key] === undefined) {
          delete cleaned.trainingAndGoals[key]
        }
      })
    }
    
    if (cleaned.lifestyleData) {
      Object.keys(cleaned.lifestyleData).forEach(key => {
        if (cleaned.lifestyleData[key] === undefined) {
          delete cleaned.lifestyleData[key]
        }
      })
    }
    
    return cleaned
  }

  // Función helper para eliminar el campo customGoal de un documento
  const removeCustomGoal = async (dietId: string): Promise<boolean> => {
    try {
      const dietRef = doc(db, 'diets', dietId)
      await updateDoc(dietRef, {
        customGoal: null
      })
      return true
    } catch (error) {
      console.error('Error removing customGoal:', error)
      return false
    }
  }

  // Función helper para validar y limpiar datos de dieta leídos de Firestore
  const validateDietData = (data: any): any => {
    const validated = { ...data }
    
    // Validar que customGoal tenga la estructura correcta si existe
    if (validated.customGoal) {
      const requiredFields = ['calories', 'proteins', 'carbs', 'fats', 'fiber']
      const hasAllFields = requiredFields.every(field => 
        typeof validated.customGoal[field] === 'number' && 
        validated.customGoal[field] >= 0
      )
      
      if (!hasAllFields) {
        console.warn('Invalid customGoal structure found, removing field:', validated.customGoal)
        delete validated.customGoal
      }
    }
    
    return validated
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
            { id: 'breakfast', name: 'Desayuno', order: 1 },
            { id: 'morningSnack', name: 'Media mañana', order: 2 },
            { id: 'lunch', name: 'Comida', order: 3 },
            { id: 'afternoonSnack', name: 'Merienda', order: 4 },
            { id: 'dinner', name: 'Cena', order: 5 }
          ]
          
          // Verificar si la dieta usa el formato antiguo
          const hasOldFormat = meals.monday && meals.monday.breakfast !== undefined
          
          if (hasOldFormat) {
            mealDefinitions = defaultMeals
          }
        }
        
        const validatedData = validateDietData(data)
        dietsData.push({
          id: doc.id,
          ...validatedData,
          // Asegurar compatibilidad con dietas existentes que no tienen suplementos
          supplements: validatedData.supplements || [],
          mealDefinitions: mealDefinitions || [],
          // customGoal es opcional, no necesita valor por defecto
          createdAt: validatedData.createdAt?.toDate() || new Date()
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

  // Cargar plantillas de dietas del usuario
  const loadDietTemplates = async () => {
    if (!user) return
    
    try {
      setLoadingDietTemplates(true)
      const templatesRef = collection(db, 'dietTemplates')
      const q = query(
        templatesRef, 
        where('userId', '==', user.id)
      )
      const querySnapshot = await getDocs(q)
      
      const templatesData: DietTemplate[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        templatesData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          usageCount: data.usageCount || 0
        } as DietTemplate)
      })
      
      setDietTemplates(templatesData)
    } catch (error: any) {
      console.error('Error loading diet templates:', error)
      // Si es un error de permisos, mostrar un mensaje más amigable
      if (error.code === 'permission-denied') {
        console.warn('Permisos de Firestore no configurados para dietTemplates. Inicializando con array vacío.')
        setDietTemplates([])
      } else {
        // Para otros errores, también inicializar con array vacío
        setDietTemplates([])
      }
    } finally {
      setLoadingDietTemplates(false)
    }
  }

  // Cargar datos cuando el usuario cambie
  useEffect(() => {
    if (user) {
      loadFoods()
      loadDiets()
      loadDietTemplates()
      loadClients()
    } else {
      setFoods([])
      setDiets([])
      setDietTemplates([])
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
  const addDiet = async (dietData: DietCreateData): Promise<boolean> => {
    if (!user) return false
    
    try {
      const dietsRef = collection(db, 'diets')
      
      const newDiet = cleanFirestoreData({
        ...dietData,
        userId: user.id,
        shareId: generateShareId(),
        createdAt: serverTimestamp()
      })
      
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

  const updateDiet = async (id: string, updates: DietUpdateData): Promise<boolean> => {
    try {
      const dietRef = doc(db, 'diets', id)
      
      const updateData = cleanFirestoreData(updates)
      await updateDoc(dietRef, updateData)
      
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
            { id: 'breakfast', name: 'Desayuno', order: 1 },
            { id: 'morningSnack', name: 'Media mañana', order: 2 },
            { id: 'lunch', name: 'Comida', order: 3 },
            { id: 'afternoonSnack', name: 'Merienda', order: 4 },
            { id: 'dinner', name: 'Cena', order: 5 }
          ]
          
          // Verificar si la dieta usa el formato antiguo
          const hasOldFormat = meals.monday && meals.monday.breakfast !== undefined
          
          if (hasOldFormat) {
            mealDefinitions = defaultMeals
          }
        }
        
        const validatedData = validateDietData(data)
        return {
          id: doc.id,
          ...validatedData,
          // Asegurar compatibilidad con dietas existentes que no tienen suplementos
          supplements: validatedData.supplements || [],
          mealDefinitions: mealDefinitions || [],
          // customGoal es opcional, no necesita valor por defecto
          createdAt: validatedData.createdAt?.toDate() || new Date()
        } as Diet
      }
      return null
    } catch (error) {
      console.error('Error loading diet by shareId:', error)
      return null
    }
  }

  // Funciones para plantillas de dietas
  const addDietTemplate = async (templateData: DietTemplateCreateData): Promise<boolean> => {
    if (!user) return false
    
    try {
      const templatesRef = collection(db, 'dietTemplates')
      
      const newTemplate = cleanFirestoreData({
        ...templateData,
        userId: user.id,
        usageCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      const docRef = await addDoc(templatesRef, newTemplate)
      const addedTemplate: DietTemplate = { 
        id: docRef.id,
        ...templateData,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setDietTemplates(prev => [addedTemplate, ...prev])
      showSuccess('Plantilla creada correctamente')
      return true
    } catch (error: any) {
      console.error('Error adding diet template:', error)
      if (error.code === 'permission-denied') {
        showError('Error de permisos: No se pueden crear plantillas. Verifica la configuración de Firestore.')
      } else {
        showError('Error al crear plantilla')
      }
      return false
    }
  }

  const updateDietTemplate = async (id: string, updates: DietTemplateUpdateData): Promise<boolean> => {
    try {
      const templateRef = doc(db, 'dietTemplates', id)
      
      const updateData = cleanFirestoreData({
        ...updates,
        updatedAt: serverTimestamp()
      })
      await updateDoc(templateRef, updateData)
      
      setDietTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, ...updates, updatedAt: new Date() } : template
      ))
      showSuccess('Plantilla actualizada correctamente')
      return true
    } catch (error: any) {
      console.error('Error updating diet template:', error)
      if (error.code === 'permission-denied') {
        showError('Error de permisos: No se pueden actualizar plantillas. Verifica la configuración de Firestore.')
      } else {
        showError('Error al actualizar plantilla')
      }
      return false
    }
  }

  const deleteDietTemplate = async (id: string): Promise<boolean> => {
    try {
      const templateRef = doc(db, 'dietTemplates', id)
      await deleteDoc(templateRef)
      
      setDietTemplates(prev => prev.filter(template => template.id !== id))
      showSuccess('Plantilla eliminada correctamente')
      return true
    } catch (error: any) {
      console.error('Error deleting diet template:', error)
      if (error.code === 'permission-denied') {
        showError('Error de permisos: No se pueden eliminar plantillas. Verifica la configuración de Firestore.')
      } else {
        showError('Error al eliminar plantilla')
      }
      return false
    }
  }

  const assignTemplateToClient = async (templateId: string, _clientId: string, clientName: string, tmb: number): Promise<boolean> => {
    if (!user) return false
    
    try {
      const template = dietTemplates.find(t => t.id === templateId)
      if (!template) {
        showError('Plantilla no encontrada')
        return false
      }

      // Crear nueva dieta basada en la plantilla
      const newDiet: DietCreateData = {
        name: `${template.name} - ${clientName}`,
        clientName,
        tmb,
        meals: template.meals,
        mealDefinitions: template.mealDefinitions,
        supplements: template.supplements,
        templateId: templateId,
        isTemplate: false
      }

      // Añadir la dieta
      const success = await addDiet(newDiet)
      if (success) {
        // Incrementar contador de uso de la plantilla
        await updateDietTemplate(templateId, {
          usageCount: (template.usageCount || 0) + 1
        })
        showSuccess('Plantilla asignada correctamente al cliente')
        return true
      }
      return false
    } catch (error) {
      console.error('Error assigning template to client:', error)
      showError('Error al asignar plantilla al cliente')
      return false
    }
  }

  // Funciones para clientes
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const clientsRef = collection(db, 'clients')
      
      // Limpiar datos antes de enviar a Firestore
      const cleanedClientData = cleanClientData(clientData)
      
      // Asegurar que birthDate se guarde correctamente
      const clientToSave = {
        ...cleanedClientData,
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
      
      // Limpiar datos antes de enviar a Firestore
      const cleanedUpdates = cleanClientData(updates)
      
      const updateData = {
        ...cleanedUpdates,
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

  // En FirebaseContext.tsx - Función para crear dieta desde plantilla
  const createClientDietFromTemplate = async (templateId: string, _clientId: string, clientName: string, tmb: number): Promise<boolean> => {
    if (!user) return false
    
    try {
      // 1. Obtener la plantilla
      const template = dietTemplates.find(t => t.id === templateId)
      if (!template) {
        showError('Plantilla no encontrada')
        return false
      }

      // 2. Crear nueva dieta basada en la plantilla
      const newDiet: DietCreateData = {
        name: `${template.name} - ${clientName}`,
        clientName,
        tmb,
        meals: template.meals, // Copiar estructura completa
        mealDefinitions: template.mealDefinitions,
        supplements: template.supplements,
        templateId: templateId, // Referencia a la plantilla original
        isTemplate: false
      }

      // 3. Guardar como nueva dieta
      const success = await addDiet(newDiet)
      if (success) {
        // 4. Incrementar contador de uso de la plantilla
        await updateDietTemplate(templateId, {
          usageCount: (template.usageCount || 0) + 1
        })
        
        showSuccess(`Plantilla "${template.name}" asignada correctamente a ${clientName}`)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error creating diet from template:', error)
      showError('Error al asignar la plantilla')
      return false
    }
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
    removeCustomGoal,
    getDietByShareId,
    loadDietByShareId,
    loadingDiets,
    
    // Diet Templates
    dietTemplates,
    addDietTemplate,
    updateDietTemplate,
    deleteDietTemplate,
    assignTemplateToClient,
    loadingDietTemplates,
    
    // Clients
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    getClientDiets,
    loadingClients,
    createClientDietFromTemplate
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