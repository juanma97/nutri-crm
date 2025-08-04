# Configuración de Reglas de Firestore para Plantillas de Dietas

## Problema
Si estás viendo el error "Missing or insufficient permissions" al cargar plantillas de dietas, necesitas configurar las reglas de seguridad de Firestore.

## Solución

### 1. Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Firestore Database**
4. Haz clic en la pestaña **Rules**

### 2. Configurar Reglas de Seguridad
Reemplaza las reglas existentes con las siguientes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para alimentos
    match /foods/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Reglas para dietas
    match /diets/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      // Permitir lectura de dietas compartidas
      allow read: if request.auth != null && resource.data.shareId != null;
    }
    
    // Reglas para plantillas de dietas
    match /dietTemplates/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Reglas para clientes
    match /clients/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 3. Explicación de las Reglas

- **`request.auth != null`**: Solo usuarios autenticados pueden acceder
- **`request.auth.uid == resource.data.userId`**: Solo el propietario puede leer/escribir sus datos
- **`request.auth.uid == request.resource.data.userId`**: Al crear documentos, el userId debe coincidir con el usuario autenticado
- **`resource.data.shareId != null`**: Permite lectura de dietas compartidas

### 4. Publicar Reglas
1. Haz clic en **Publish** para aplicar los cambios
2. Espera unos segundos para que las reglas se propaguen

### 5. Verificar
Después de aplicar las reglas:
1. Recarga la aplicación
2. Las plantillas de dietas deberían cargar correctamente
3. Deberías poder crear, editar y eliminar plantillas

## Notas Importantes

- Las reglas se aplican inmediatamente después de publicarlas
- Si sigues teniendo problemas, verifica que el usuario esté autenticado correctamente
- Las reglas son una capa de seguridad adicional, no reemplazan la validación del lado del cliente

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Verifica que las reglas estén publicadas correctamente
- Asegúrate de que el usuario esté autenticado
- Revisa que el `userId` en los documentos coincida con el `uid` del usuario autenticado

### Error: "Permission denied"
- Verifica la sintaxis de las reglas
- Asegúrate de que no haya errores de compilación en las reglas
- Revisa los logs de Firebase Console para más detalles 