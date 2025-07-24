const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const foodsData = require('./foods-data.js');

// Configuración de Firebase (usa la misma que tu app)
const firebaseConfig = {
  apiKey: "AIzaSyDdUVR3pbEtUAnej9AZykJ26Kj9T8cbB1k",
  authDomain: "nutri-crm-ed209.firebaseapp.com",
  projectId: "nutri-crm-ed209",
  storageBucket: "nutri-crm-ed209.firebasestorage.app",
  messagingSenderId: "562916988417",
  appId: "1:562916988417:web:83e6daf14ab1c28076d200"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID del usuario (necesitas reemplazar esto con tu ID de usuario)
const USER_ID = "8PWthOdCkzeIJknRpjrwJiQ6DQt1";

async function uploadFoods() {
  console.log('🚀 Iniciando subida de alimentos a Firebase...');
  console.log(`📊 Total de alimentos a subir: ${foodsData.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < foodsData.length; i++) {
    const food = foodsData[i];
    
    try {
      // Preparar datos del alimento
      const foodData = {
        name: food.name,
        category: food.category,
        quantity: food.quantity,
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
        fiber: food.fiber || 0,
        image: food.image || '',
        userId: USER_ID,
        createdAt: serverTimestamp()
      };
      
      // Subir a Firebase
      const docRef = await addDoc(collection(db, 'foods'), foodData);
      
      console.log(`✅ [${i + 1}/${foodsData.length}] ${food.name} - ID: ${docRef.id}`);
      successCount++;
      
      // Pequeña pausa para no sobrecargar Firebase
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error al subir ${food.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📈 Resumen de la subida:');
  console.log(`✅ Alimentos subidos exitosamente: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📊 Total procesado: ${foodsData.length}`);
  
  if (errorCount === 0) {
    console.log('🎉 ¡Todos los alimentos se subieron correctamente!');
  } else {
    console.log('⚠️  Algunos alimentos no se pudieron subir. Revisa los errores arriba.');
  }
}

// Función para verificar la configuración
function checkConfig() {
  console.log('🔍 Verificando configuración...');
  
  if (!firebaseConfig.apiKey) {
    console.error('❌ Error: Necesitas configurar las credenciales de Firebase');
    console.log('📝 Instrucciones:');
    console.log('1. Abre src/firebase/config.ts');
    console.log('2. Copia la configuración de Firebase');
    console.log('3. Reemplaza la configuración en este script');
    console.log('4. Reemplaza USER_ID con tu ID de usuario');
    return false;
  }
  
  if (USER_ID === "tu-user-id-aqui") {
    console.error('❌ Error: Necesitas configurar el USER_ID');
    console.log('📝 Para obtener tu USER_ID:');
    console.log('1. Abre la consola de Firebase');
    console.log('2. Ve a Authentication > Users');
    console.log('3. Copia el UID del usuario');
    return false;
  }
  
  console.log('✅ Configuración verificada correctamente');
  return true;
}

// Ejecutar el script
async function main() {
  try {
    if (!checkConfig()) {
      console.log('❌ Configuración incorrecta. Abortando...');
      process.exit(1);
    }
    
    await uploadFoods();
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { uploadFoods, checkConfig }; 