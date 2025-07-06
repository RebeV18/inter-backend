import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  // Método para obtener configuración de base de datos
  getDatabaseConfig() {
    return {
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
    };
  }

  // Método para obtener configuración JWT
  getJwtConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION', '24h'),
      },
    };
  }

  // Método para obtener configuración de API externa
  getApiConfig() {
    return {
      apiKey: this.configService.get<string>('API_KEY'),
      apiUrl: this.configService.get<string>('API_URL'),
    };
  }

  // Método que valida si estamos en producción
  isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  // Método que obtiene configuración de Redis
  getRedisConfig() {
    return {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    };
  }
}
