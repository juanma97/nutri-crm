// Script simple para subir alimentos a Firebase
// Usa la configuración existente del proyecto

const foodsData = [
  {
    name: "Manzana",
    category: "Fruta",
    quantity: "100g",
    calories: 52,
    protein: 0.3,
    fat: 0.2,
    carbs: 14,
    fiber: 2.4,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcomedelahuerta.com%2Fproducto%2Fmanzana-granny-smith%2F&psig=AOvVaw1gt_W6N-68QGIcmPIoD6_N&ust=1749924576910000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIiwnpj_7o0DFQAAAAAdAAAAABAE"
  },
  {
    name: "Pechuga de Pollo",
    category: "Carne",
    quantity: "100g",
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
    fiber: 0
  },
  {
    name: "Arroz Blanco",
    category: "Cereal",
    quantity: "100g",
    calories: 348,
    protein: 7.7,
    fat: 0.6,
    carbs: 77.2,
    fiber: 2.4,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ffinditapp.es%2Fproduct%2F22842%2Farroz-largo-hacendado&psig=AOvVaw179nvgVfsUaCmLWzYRSFfo&ust=1751006187762000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLiovMG8jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Avena",
    category: "Cereal",
    quantity: "100g",
    calories: 389,
    protein: 16.9,
    fat: 6.9,
    carbs: 66.3,
    fiber: 10.6
  },
  {
    name: "Huevo",
    category: "Proteína",
    quantity: "100g",
    calories: 155,
    protein: 13,
    fat: 11,
    carbs: 1.1,
    fiber: 0
  },
  {
    name: "Cereales avena crunchy hacendado cacao",
    category: "Cereal",
    quantity: "100g",
    calories: 393,
    protein: 13,
    fat: 6.4,
    carbs: 76,
    fiber: 11,
    image: "https://es.openfoodfacts.org/producto/8402001015205/avena-crunchy-cacao-hacendado"
  },
  {
    name: "Cereales 0% azucares añadidos hacendado",
    category: "Cereal",
    quantity: "100g",
    calories: 373,
    protein: 10.3,
    fat: 1.6,
    carbs: 82.9,
    fiber: 7.9,
    image: "https://soysuper.com/p/cereal-copos-arroz-trigo-integral-0-azucares-anadidos-hacendado-caja-500-g"
  },
  {
    name: "Corn flakes hacendado",
    category: "Cereal",
    quantity: "100g",
    calories: 373,
    protein: 6.7,
    fat: 1,
    carbs: 87.7,
    fiber: 4.3,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdietas.ai%2Falimentos%2Fmercadona%2Fcereales-y-galletas%2Fcereales-copos-de-maiz-corn-flakes-hacendado-0-azucares-anadidos-caja-500-g&psig=AOvVaw1Q6A0vHPxTAb-lmT4mF11K&ust=1749992851286000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCgxsX98I0DFQAAAAAdAAAAABAE"
  },
  {
    name: "Cereal mix 0% hacendado",
    category: "Cereal",
    quantity: "100g",
    calories: 383,
    protein: 10.1,
    fat: 4.1,
    carbs: 74.1,
    fiber: 6,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftienda.mercadona.es%2Fproduct%2F9532%2Fcereales-cereal-mix-hacendado-0-azucares-anadidos-paquete&psig=AOvVaw2r-dVAAZPu0tZutbFBGMvE&ust=1749992912745000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMi1rOH98I0DFQAAAAAdAAAAABAE"
  },
  {
    name: "Cereales avena crunchy hacendado",
    category: "Cereal",
    quantity: "100g",
    calories: 390,
    protein: 13,
    fat: 5.8,
    carbs: 77,
    fiber: 11,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.openfoodfacts.org%2Fproducto%2F00015611%2Favena-crunchy-hacendado&psig=AOvVaw1W4Bguk8IFkh-dMnZ_r0wG&ust=1749993119146000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPiX2MP-8I0DFQAAAAAdAAAAABAE"
  },
  {
    name: "Leche desnatada",
    category: "Lácteo",
    quantity: "100ml",
    calories: 34,
    protein: 3.1,
    fat: 0.3,
    carbs: 4.7,
    fiber: 0,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.openfoodfacts.org%2Fproducto%2F00015611%2Favena-crunchy-hacendado&psig=AOvVaw1W4Bguk8IFkh-dMnZ_r0wG&ust=1749993119146000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPiX2MP-8I0DFQAAAAAdAAAAABAE"
  },
  {
    name: "Leche desnatada +proteínas hacendado",
    category: "Lácteo",
    quantity: "100ml",
    calories: 44,
    protein: 6,
    fat: 0.2,
    carbs: 4.6,
    fiber: 0,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftienda.mercadona.es%2Fproduct%2F10678%2Fleche-proteinas-desnatada-hacendado-brick&psig=AOvVaw2JQObLCSt8TVNscb8wsU03&ust=1749993308418000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNCe1J3_8I0DFQAAAAAdAAAAABAE"
  },
  {
    name: "Leche semi desnatada",
    category: "Lácteo",
    quantity: "100ml",
    calories: 43,
    protein: 3,
    fat: 1.5,
    carbs: 4.6,
    fiber: 0,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fsuper.facua.org%2Fmercadona%2Fleche%2Fleche-semidesnatada-hacendado-1-l%2F&psig=AOvVaw1dKt7gLuN6uAH8_vwrufGE&ust=1749993600940000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOCtuaqA8Y0DFQAAAAAdAAAAABAE"
  },
  {
    name: "Leche entera",
    category: "Lácteo",
    quantity: "100ml",
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0
  },
  {
    name: "Relleno para fajitas (pollo) hacendado",
    category: "Carne",
    quantity: "100g",
    calories: 74,
    protein: 8.9,
    fat: 0.8,
    carbs: 7,
    fiber: 1.4,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.openfoodfacts.org%2Fproducto%2F8480000612441%2Frelleno-fajitas-hacendado&psig=AOvVaw27wqf2WDTdZ_xW3sb2KI-U&ust=1750003392498000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIix9eak8Y0DFQAAAAAdAAAAABAE"
  },
  {
    name: "Tortillas 100% integrales hacendado",
    category: "Carbohidratos",
    quantity: "1 tortilla",
    calories: 98,
    protein: 3.3,
    fat: 2.2,
    carbs: 18.3,
    fiber: 3.3,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fatsecret.es%2Fcalor%25C3%25ADas-nutrici%25C3%25B3n%2Fhacendado%2Ftortillas-integrales%2F1-tortilla&psig=AOvVaw0klaGzNMO14eip1602BzF2&ust=1751005311712000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLCHwZ65jo4DFQAAAAAdAAAAABAK"
  },
  {
    name: "Piadina hacendado",
    category: "Carbohidratos",
    quantity: "1 tortita",
    calories: 252,
    protein: 5.6,
    fat: 6.8,
    carbs: 43.4,
    fiber: 1.4,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.openfoodfacts.org%2Fproducto%2F8480000808943%2F4-piadinas-hacendado&psig=AOvVaw3floP8g49Oa2ZeCp7_s-Ii&ust=1751005588376000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKjSg6O6jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Tortilla 51% avena hacendado",
    category: "Carbohidratos",
    quantity: "1 tortita",
    calories: 172,
    protein: 9.1,
    fat: 3.6,
    carbs: 27.2,
    fiber: 3.2,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftienda.mercadona.es%2Fproduct%2F80531%2Ftortillas-avena-51-hacendado-paquete&psig=AOvVaw215SkDhzHOk_FaQlcpW2-f&ust=1751005720119000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLi-uuG6jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Pasta",
    category: "Carbohidratos",
    quantity: "100g",
    calories: 366,
    protein: 12,
    fat: 1.5,
    carbs: 74,
    fiber: 4,
    image: "https://www.google.com/url?sa=i&url=http%3A%2F%2Fsoysuper.com%2Fp%2Fmacarron-pasta-hacendado-paquete-1-kg&psig=AOvVaw3UZiQpbxqjAVv9pdRkLNY0&ust=1751005805528000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjO7Yu7jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Pasta de lentejas hacendado",
    category: "Carbohidratos",
    quantity: "100g",
    calories: 334,
    protein: 26,
    fat: 1.7,
    carbs: 50,
    fiber: 7.6,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftienda.mercadona.es%2Fproduct%2F6106%2Fpasta-fusilli-100-lentejas-rojas-felicia-paquete&psig=AOvVaw3XGSrskxZdEJJc7jPB41gT&ust=1751005877028000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJjKm6y7jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Pasta fresca tagliatelle hacendado",
    category: "Carbohidratos",
    quantity: "100g",
    calories: 290,
    protein: 11,
    fat: 3.2,
    carbs: 54,
    fiber: 2.6,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftienda.mercadona.es%2Fproduct%2F6153%2Fpasta-fresca-tagliatelle-huevo-hacendado-paquete&psig=AOvVaw1VjHnHMNPas4IcdJfUy-Xd&ust=1751005922207000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIj1gcO7jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Pasta nidos al huevo hacendado",
    category: "Carbohidratos",
    quantity: "100g",
    calories: 359,
    protein: 12,
    fat: 3.3,
    carbs: 68,
    fiber: 0,
    image: "https://www.google.com/url?sa=i&url=http%3A%2F%2Fsoysuper.com%2Fp%2Fnidos-al-huevo-pasta-hacendado-paquete-500-g&psig=AOvVaw0-1_jtw48LK4_c1LOR03nV&ust=1751006049672000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKiMm4G8jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Arroz basmati",
    category: "Carbohidratos",
    quantity: "100g",
    calories: 355,
    protein: 9,
    fat: 0.6,
    carbs: 78,
    fiber: 1.12,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftienda.mercadona.es%2Fproduct%2F5002%2Farroz-basmati-aromatico-hacendado-paquete&psig=AOvVaw22t2-MtSSlTM8UU5QyE3--&ust=1751006284935000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIDkt_G8jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Arroz basmati microondas",
    category: "Carbohidratos",
    quantity: "1 vaso pequeño",
    calories: 205,
    protein: 5,
    fat: 3,
    carbs: 38.8,
    fiber: 1.2,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ffinditapp.es%2Fproduct%2F23508%2Farroz-cocido-basmati-sabroz&psig=AOvVaw3fh04uZhg6jusselmQhKqM&ust=1751006431662000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDA-bS9jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Lentejas a la jardinera hacendado",
    category: "Legumbres",
    quantity: "1 lata",
    calories: 273,
    protein: 17.6,
    fat: 5.5,
    carbs: 33.2,
    fiber: 7,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.openfoodfacts.org%2Fproducto%2F8480000261168%2Flentejas-a-la-jardinera-hacendado&psig=AOvVaw3qd4goa9IfWj04slxKNStW&ust=1751006539458000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLi24-e9jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Garbanzos a la jardinera hacendado",
    category: "Legumbres",
    quantity: "1 lata",
    calories: 304,
    protein: 15.2,
    fat: 8.4,
    carbs: 36,
    fiber: 10,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.openfoodfacts.org%2Fproducto%2F8480000261106%2Fgarbanzos-a-la-jardinera-hacendado&psig=AOvVaw00r9K2f1H93Druq4teGvqF&ust=1751006551632000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNC3zu29jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Alubias a la jardinera hacendado",
    category: "Legumbres",
    quantity: "1 lata",
    calories: 340,
    protein: 19.2,
    fat: 7.6,
    carbs: 41.2,
    fiber: 7,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.openfoodfacts.org%2Fproducto%2F8480000261144%2Falubias-a-la-jardinera-hacendado&psig=AOvVaw3Onzo2cqI5m4JzJc11i2PT&ust=1751006966853000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOC2tLO_jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Filetes de merluza de cabo hacendado",
    category: "Pescado",
    quantity: "100g",
    calories: 82,
    protein: 18,
    fat: 1.2,
    carbs: 0.5,
    fiber: 0,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.openfoodfacts.org%2Fproducto%2F8480000621788%2Ffiletes-de-merluza-del-cabo-congelada-hacendado&psig=AOvVaw21v4fQDr1s_RXH_iVOK8Uc&ust=1751007099169000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMCKmfW_jo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Fogonero en su punto de sal hacendado",
    category: "Pescado",
    quantity: "100g",
    calories: 46,
    protein: 10.3,
    fat: 0.5,
    carbs: 0.5,
    fiber: 0,
    image: "https://www.google.com/url?sa=i&url=http%3A%2F%2Fsoysuper.com%2Fp%2Ffogonero-congelado-porciones-en-su-punto-de-sal-sin-espinas-hacendado-paquete-600-g-peso-neto-escurrido&psig=AOvVaw0g6eySdzzC_CFCq1WoO4Q2&ust=1751007208213000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPD2qqfAjo4DFQAAAAAdAAAAABAE"
  },
  {
    name: "Lomo salmón",
    category: "Pescado",
    quantity: "100g",
    calories: 210,
    protein: 20,
    fat: 17,
    carbs: 0,
    fiber: 0
  }
];

console.log('📋 Datos de alimentos preparados:');
console.log(`Total de alimentos: ${foodsData.length}`);
console.log('\n📊 Categorías:');
const categories = [...new Set(foodsData.map(food => food.category))];
categories.forEach(category => {
  const count = foodsData.filter(food => food.category === category).length;
  console.log(`  - ${category}: ${count} alimentos`);
});

console.log('\n📝 Instrucciones para usar:');
console.log('1. Copia este array de datos');
console.log('2. Ve a tu aplicación React');
console.log('3. Abre la consola del navegador (F12)');
console.log('4. Pega el siguiente código:');
console.log('\n// Código para ejecutar en la consola del navegador:');
console.log('const foodsData = ' + JSON.stringify(foodsData, null, 2) + ';');
console.log('\n// Función para subir alimentos');
console.log(`
async function uploadFoods() {
  const { addFood } = useFirebase();
  let successCount = 0;
  let errorCount = 0;
  
  for (const food of foodsData) {
    try {
      const success = await addFood({
        name: food.name,
        category: food.category,
        quantity: food.quantity,
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
        fiber: food.fiber || 0,
        image: food.image || ''
      });
      
      if (success) {
        successCount++;
        console.log(\`✅ \${food.name} - Subido correctamente\`);
      } else {
        errorCount++;
        console.log(\`❌ \${food.name} - Error al subir\`);
      }
    } catch (error) {
      errorCount++;
      console.error(\`❌ Error con \${food.name}:\`, error);
    }
  }
  
  console.log(\`\\n📈 Resumen: \${successCount} exitosos, \${errorCount} errores\`);
}

// Ejecutar la subida
uploadFoods();
`);

console.log('\n🎯 Alternativa: Usar desde el componente FoodList');
console.log('1. Ve a la página de alimentos en tu app');
console.log('2. Abre la consola del navegador');
console.log('3. Ejecuta el código anterior'); 