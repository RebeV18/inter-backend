import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/environment.config';
import firebaseConfig from './config/firebase.config';
import { ConfigController } from './controllers/config.controller';
import { DatabaseService } from './services/database.service';
import { CountriesModule } from './countries/countries.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace el módulo disponible globalmente
      envFilePath: ['.env.local', '.env'], // Archivos de entorno en orden de prioridad
      load: [firebaseConfig], // Cargar configuración de Firebase
      validate, // Validación automática de variables
      cache: true, // Cache para mejor performance
      expandVariables: true, // Permite usar variables dentro de variables
    }),
    FirebaseModule,
    CountriesModule,
  ],
  controllers: [ConfigController],
  providers: [DatabaseService],
})
export class AppModule {}
