# Client Data Builder - Utilidades para Construcción de Datos

Este módulo proporciona funciones modulares para construir y validar objetos `ClientData` que se envían a Firestore, asegurando compatibilidad con datos existentes y consistencia en la estructura.

## Funciones Principales

### `buildClientData(formData, previousData?, isEditMode?)`

Función principal que construye el objeto `ClientData` completo a partir del estado del formulario.

**Parámetros:**
- `formData: ClientFormData` - Estado actual del formulario
- `previousData?: Client` - Datos del cliente anterior (para edición)
- `isEditMode?: boolean` - Si estamos en modo edición (default: false)

**Retorna:** `Omit<Client, 'id' | 'createdAt' | 'updatedAt'>`

**Ejemplo:**
```typescript
const clientData = buildClientData(formData, previousClient, true)
```

### `validateClientData(clientData)`

Valida que los datos del cliente sean consistentes antes de enviar a Firestore.

**Parámetros:**
- `clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>` - Datos a validar

**Retorna:** `boolean`

**Validaciones incluidas:**
- Nombre y email requeridos
- Email con formato válido
- Edad entre 1-120 años
- Altura entre 100-250 cm
- Peso entre 30-300 kg

### `optimizeClientData(clientData)`

Optimiza el objeto eliminando campos vacíos innecesarios para reducir el tamaño en Firestore.

**Parámetros:**
- `clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>` - Datos a optimizar

**Retorna:** `Omit<Client, 'id' | 'createdAt' | 'updatedAt'>`

**Optimizaciones:**
- Elimina `personalData` si todos los campos están vacíos
- Elimina `healthInfo` si no hay respuestas PAR-Q ni otros datos
- Elimina `trainingAndGoals` si todos los campos están vacíos
- Elimina `lifestyleData` si todos los campos están vacíos

## Funciones de Parsing por Sección

### `parseClientInfo(formData)`
Parsea la información básica del cliente (Tab 1 - Información del Cliente)

### `parsePersonalData(formData)`
Parsea los datos personales (Tab 1 - sección personal)

### `parseHealthInfo(formData)`
Parsea la información de salud (Tab 2 - Salud)

### `parseTrainingAndGoals(formData)`
Parsea la información de entrenamiento (Tab 3 - Entrenamiento)

### `parseLifestyleData(formData)`
Parsea la información de nutrición y suplementación (Tab 4 - Nutrición)

## Uso en el Formulario

```typescript
import { buildClientData, validateClientData, optimizeClientData } from '../utils/clientDataBuilder'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) return

  setLoading(true)
  try {
    // Obtener datos del cliente anterior si estamos editando
    const previousClient = id ? getClientById(id) : undefined
    
    // Construir el objeto ClientData usando las funciones modulares
    let clientData = buildClientData(formData, previousClient, !!id)
    
    // Validar que los datos sean consistentes
    if (!validateClientData(clientData)) {
      throw new Error('Los datos del cliente no son válidos')
    }
    
    // Optimizar el objeto eliminando campos vacíos innecesarios
    clientData = optimizeClientData(clientData)

    // Enviar a Firestore
    let success = false
    if (id) {
      const updateData: Partial<Client> = { ...clientData }
      success = await updateClient(id, updateData)
    } else {
      success = await addClient(clientData)
    }

    if (success) {
      navigate('/clients')
    }
  } catch (error) {
    console.error('Error saving client:', error)
    showError('Error al guardar cliente')
  } finally {
    setLoading(false)
  }
}
```

## Ventajas de esta Arquitectura

1. **Modularidad**: Cada sección del formulario tiene su propia función de parsing
2. **Mantenibilidad**: Fácil de modificar o extender sin afectar otras secciones
3. **Validación**: Validaciones centralizadas y reutilizables
4. **Optimización**: Reduce el tamaño de los documentos en Firestore
5. **Compatibilidad**: Mantiene compatibilidad con datos existentes
6. **Type Safety**: TypeScript garantiza consistencia en los tipos

## Compatibilidad con Datos Existentes

- Los clientes antiguos mantienen sus datos en `personalData.firstName` y `personalData.lastName`
- Los campos opcionales se manejan correctamente con valores por defecto
- La función `buildClientData` preserva campos que no están en el formulario durante la edición
- La optimización solo elimina campos completamente vacíos

## Extensibilidad

Para agregar nuevas secciones al formulario:

1. Crear una nueva función de parsing (ej: `parseNewSection(formData)`)
2. Agregar la sección a `buildClientData()`
3. Actualizar las interfaces de tipos si es necesario
4. Agregar validaciones específicas en `validateClientData()` si es necesario 