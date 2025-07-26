# Índices de Firestore para NutriCRM

## 🔥 Error de Índices

Si ves este error:

```
FirebaseError: [code=failed-precondition]: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/...
```

Es porque Firestore necesita índices para consultas complejas.

## 📋 Índices Necesarios

### 1. Para Alimentos (Colección: foods)

```
Collection: foods
Fields to index:
- userId (Ascending)
- createdAt (Descending)
```

### 2. Para Dietas (Colección: diets)

```
Collection: diets
Fields to index:
- userId (Ascending)
- createdAt (Descending)
```

## 🛠️ Cómo Crear los Índices

### Método 1: Enlace Automático

1. Haz clic en el enlace del error
2. Se abrirá Firebase Console
3. Haz clic en "Create Index"
4. Espera 1-2 minutos

### Método 2: Manual en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a "Firestore Database"
4. Haz clic en la pestaña "Indexes"
5. Haz clic en "Create Index"

#### Para Alimentos:

- Collection ID: `foods`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)

#### Para Dietas:

- Collection ID: `diets`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)

6. Haz clic en "Create"

## ⏱️ Tiempo de Creación

Los índices pueden tardar 1-5 minutos en crearse. Mientras tanto, verás el error.

## 🔍 Verificar Estado

En Firebase Console > Firestore Database > Indexes, verás:

- ✅ **Enabled**: Índice listo
- 🔄 **Building**: Índice en construcción
- ❌ **Error**: Problema con el índice

## 🚀 Solución Temporal

Mientras se crean los índices, puedes comentar temporalmente el `orderBy` en el código:

```typescript
// En FirebaseContext.tsx, líneas 47-51
const q = query(
  foodsRef,
  where("userId", "==", user.id)
  // orderBy('createdAt', 'desc') // Comentar temporalmente
);
```

## 📝 Nota Importante

Una vez creados los índices, descomenta el `orderBy` para que los datos se muestren ordenados correctamente.

¡Los índices son necesarios para consultas eficientes en Firestore!
