# Configuración de Firebase para NutriCRM

## 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Dale un nombre al proyecto (ej: "nutri-crm")
4. Sigue los pasos del asistente

## 2. Habilitar Authentication

1. En el panel de Firebase, ve a "Authentication"
2. Haz clic en "Get started"
3. En la pestaña "Sign-in method", habilita "Email/Password"
4. Guarda los cambios

## 3. Configurar Firestore Database

1. En el panel de Firebase, ve a "Firestore Database"
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" (para desarrollo)
4. Elige la ubicación más cercana a tus usuarios
5. Haz clic en "Done"

## 4. Obtener Configuración

1. En el panel de Firebase, ve a "Project settings" (ícono de engranaje)
2. En la pestaña "General", baja hasta "Your apps"
3. Haz clic en el ícono de web (</>) para agregar una app web
4. Dale un nombre (ej: "NutriCRM Web")
5. Copia la configuración que aparece

## 5. Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las siguientes variables con los valores de tu configuración:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 6. Reglas de Seguridad de Firestore

En Firestore Database > Rules, configura las siguientes reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden acceder a sus propios datos
    match /foods/{foodId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    match /diets/{dietId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      // Permitir lectura pública para dietas compartidas
      allow read: if resource.data.shareId != null;
    }

    match /clients/{clientId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 7. Estructura de Datos

### Colección: foods

```javascript
{
  id: "auto-generated",
  name: "Chicken Breast",
  group: "Proteins",
  portion: "100g",
  calories: 165,
  proteins: 31,
  fats: 3.6,
  carbs: 0,
  fiber: 0,
  userId: "user-uid",
  createdAt: timestamp
}
```

### Colección: diets

```javascript
{
  id: "auto-generated",
  name: "Diet for John Doe",
  clientName: "John Doe",
  tmb: 2000,
  meals: [...], // Array de 7 días con 5 comidas cada uno
  shareId: "abc123",
  userId: "user-uid",
  createdAt: timestamp
}
```

## 8. Instalar Dependencias

Asegúrate de tener instaladas las dependencias de Firebase:

```bash
npm install firebase
```

## 9. Probar la Configuración

1. Ejecuta la aplicación: `npm run dev`
2. Ve a la página de login
3. Crea una cuenta nueva o inicia sesión
4. Verifica que puedas crear, editar y eliminar alimentos y dietas

## 10. Solución de Problemas

### Error: "Firebase App named '[DEFAULT]' already exists"

- Asegúrate de que solo inicializas Firebase una vez en `src/firebase/config.ts`

### Error: "Missing or insufficient permissions"

- Verifica que las reglas de Firestore estén configuradas correctamente
- Asegúrate de que el usuario esté autenticado

### Error: "auth/email-already-in-use"

- El email ya está registrado, usa otro email o inicia sesión

### Error: "auth/wrong-password"

- Verifica las credenciales de inicio de sesión

## 11. Producción

Para producción:

1. Cambia las reglas de Firestore a modo de producción
2. Configura las variables de entorno en tu servidor de hosting
3. Habilita la verificación de email si es necesario
4. Configura dominios autorizados en Authentication

## 12. Comandos Útiles

```bash
# Ver variables de entorno
cat .env.local

# Verificar configuración de Firebase
npm run build

# Ejecutar en modo desarrollo
npm run dev
```

¡Listo! Tu aplicación NutriCRM ahora está conectada a Firebase con autenticación y base de datos en tiempo real.
