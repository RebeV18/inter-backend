import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirestoreService } from './firestore.service';
import { FirebaseController } from './firebase.controller';
import { initializeFirebase } from '../config/firebase.config';

@Global() // Hace el módulo disponible globalmente
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: () => {
        return initializeFirebase();
      },
    },
    FirestoreService,
  ],
  controllers: [FirebaseController],
  exports: [FirestoreService, 'FIREBASE_APP'],
})
export class FirebaseModule {}
