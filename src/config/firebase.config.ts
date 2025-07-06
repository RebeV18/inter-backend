import { registerAs } from '@nestjs/config';

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
