const fs = require('fs');
const path = require('path');

function findFirebaseJson() {
  const files = fs.readdirSync('.');
  return files.find(
    (file) =>
      (file.endsWith('.json') && file.includes('firebase')) ||
      file.includes('service-account') ||
      file.includes('adminsdk'),
  );
}

function updateEnvFile(credentials) {
  const envPath = '.env';
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Reemplazar o agregar variables de Firebase
  const firebaseVars = {
    FIREBASE_PROJECT_ID: credentials.project_id,
    FIREBASE_PRIVATE_KEY_ID: credentials.private_key_id,
    FIREBASE_PRIVATE_KEY: `"${credentials.private_key}"`,
    FIREBASE_CLIENT_EMAIL: credentials.client_email,
    FIREBASE_CLIENT_ID: credentials.client_id,
    FIREBASE_AUTH_URI:
      credentials.auth_uri || 'https://accounts.google.com/o/oauth2/auth',
    FIREBASE_TOKEN_URI:
      credentials.token_uri || 'https://oauth2.googleapis.com/token',
    FIREBASE_CLIENT_CERT_URL: credentials.client_x509_cert_url || '',
  };

  Object.entries(firebaseVars).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const replacement = `${key}=${value}`;

    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, replacement);
    } else {
      envContent += `\n${replacement}`;
    }
  });

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env actualizado con las credenciales de Firebase');
}

function main() {
  const args = process.argv.slice(2);
  let jsonFile = args[0];

  if (!jsonFile) {
    jsonFile = findFirebaseJson();
    if (!jsonFile) {
      console.error('❌ No se encontró archivo JSON de Firebase.');
      console.log('📋 Para obtener las credenciales:');
      console.log(
        '1. Ve a Firebase Console > Project Settings > Service Accounts',
      );
      console.log('2. Haz clic en "Generate new private key"');
      console.log('3. Descarga el archivo JSON y colócalo en este directorio');
      console.log('4. Ejecuta: node setup-firebase.js [nombre-archivo.json]');
      process.exit(1);
    }
  }

  if (!fs.existsSync(jsonFile)) {
    console.error(`❌ El archivo ${jsonFile} no existe.`);
    process.exit(1);
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    // Validar que es un archivo de service account
    if (!credentials.type || credentials.type !== 'service_account') {
      console.error(
        '❌ El archivo no parece ser un service account de Firebase.',
      );
      process.exit(1);
    }

    console.log(
      `🔑 Configurando Firebase para el proyecto: ${credentials.project_id}`,
    );

    updateEnvFile(credentials);

    console.log('🎉 ¡Firebase configurado exitosamente!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Reinicia la aplicación: npm run start:dev');
    console.log(
      '2. Prueba la conexión: GET http://localhost:4000/api/firebase/test',
    );
    console.log(
      '3. Crea datos de ejemplo: POST http://localhost:4000/api/firebase/seed/countries',
    );
    console.log('4. Ve la documentación: http://localhost:4000/api/docs');

    // Mover el archivo JSON a una carpeta segura
    const credentialsDir = 'credentials';
    if (!fs.existsSync(credentialsDir)) {
      fs.mkdirSync(credentialsDir);
    }

    const newPath = path.join(credentialsDir, jsonFile);
    fs.renameSync(jsonFile, newPath);
    console.log(`🔒 Archivo de credenciales movido a: ${newPath}`);
  } catch (error) {
    console.error('❌ Error procesando el archivo JSON:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
