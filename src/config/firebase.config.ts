import { registerAs } from '@nestjs/config';
import * as admin from 'firebase-admin';

// ✅ Exportación por defecto para ConfigModule
export default registerAs('firebase', () => ({
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri:
    process.env.FIREBASE_AUTH_URI ||
    'https://accounts.google.com/o/oauth2/auth',
  tokenUri:
    process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
  clientCertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
}));

// ✅ Configuración de Firebase Admin SDK
let firebaseApp: admin.app.App;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    try {
      // Validar variables de entorno requeridas
      const requiredEnvVars = [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_PRIVATE_KEY_ID',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_CLIENT_ID',
      ];

      const missingVars = requiredEnvVars.filter(
        (varName) => !process.env[varName],
      );

      if (missingVars.length > 0) {
        throw new Error(
          `Missing required Firebase environment variables: ${missingVars.join(', ')}`,
        );
      }

      console.log('🔧 Firebase environment variables loaded:');
      console.log(`  • PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID}`);
      console.log(`  • CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL}`);

      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri:
          process.env.FIREBASE_AUTH_URI ||
          'https://accounts.google.com/o/oauth2/auth',
        token_uri:
          process.env.FIREBASE_TOKEN_URI ||
          'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      };

      // Validar que project_id esté presente
      if (!serviceAccount.project_id) {
        throw new Error(
          'Service account object must contain a string "project_id" property.',
        );
      }

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase:', error.message);
      throw error;
    }
  }
  return firebaseApp;
};

// ✅ Exportar instancia de Firestore
export const getFirestore = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.firestore();
};

// ✅ Exportar base de datos por defecto
export const db = getFirestore();
