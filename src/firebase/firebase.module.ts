import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import firebaseConfig from '../config/firebase.config';
import { FirestoreService } from './firestore.service';
import { FirebaseController } from './firebase.controller';

@Global()
@Module({
  imports: [ConfigModule.forFeature(firebaseConfig)],
  controllers: [FirebaseController],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        const firebaseConfigData = {
          projectId: configService.get<string>('firebase.projectId'),
          privateKeyId: configService.get<string>('firebase.privateKeyId'),
          privateKey: configService.get<string>('firebase.privateKey'),
          clientEmail: configService.get<string>('firebase.clientEmail'),
          clientId: configService.get<string>('firebase.clientId'),
          authUri: configService.get<string>('firebase.authUri'),
          tokenUri: configService.get<string>('firebase.tokenUri'),
          clientCertUrl: configService.get<string>('firebase.clientCertUrl'),
        };

        // Inicializar Firebase Admin si no está ya inicializado
        if (!admin.apps.length) {
          try {
            admin.initializeApp({
              credential: admin.credential.cert(
                firebaseConfigData as admin.ServiceAccount,
              ),
              projectId: firebaseConfigData.projectId,
            });
            console.log('✅ Firebase initialized successfully');
          } catch (error) {
            console.error('❌ Error initializing Firebase:', error.message);
            return null;
          }
        }

        return admin;
      },
      inject: [ConfigService],
    },
    {
      provide: 'FIRESTORE',
      useFactory: (firebaseAdmin: typeof admin) => {
        if (!firebaseAdmin) {
          console.warn('⚠️ Firestore not available - Firebase not initialized');
          return null;
        }
        return firebaseAdmin.firestore();
      },
      inject: ['FIREBASE_ADMIN'],
    },
    FirestoreService,
  ],
  exports: ['FIREBASE_ADMIN', 'FIRESTORE', FirestoreService],
})
export class FirebaseModule {}
