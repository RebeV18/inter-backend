// Cargar variables de entorno antes de cualquier otra cosa
import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  NotFoundException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/environment.config';
import firebaseConfig from './config/firebase.config';
import { ConfigController } from './controllers/config.controller';
import { DatabaseService } from './services/database.service';
import { CountriesModule } from './countries/countries.module';
import { FirebaseModule } from './firebase/firebase.module';
import { TopicsModule } from './topics/topics.module';
import { PrayerRequestsModule } from './prayer-requests/prayer-requests.module';
import { MissionsModule } from './missions/missions.module';

@Catch()
class FallbackNotFoundFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (
      exception instanceof NotFoundException ||
      (exception instanceof HttpException &&
        String(exception.getStatus()) === String(HttpStatus.NOT_FOUND))
    ) {
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Resource not found',
      });
    } else {
      throw exception;
    }
  }
}

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
    TopicsModule,
    PrayerRequestsModule,
    MissionsModule,
  ],
  controllers: [ConfigController],
  providers: [
    DatabaseService,
    {
      provide: APP_FILTER,
      useClass: FallbackNotFoundFilter,
    },
  ],
})
export class AppModule {}
