import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../services/database.service';

@Controller('config')
export class ConfigController {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return 'Welcome to the backend!';
  }

  @Get('info')
  getConfigInfo() {
    return {
      environment: this.configService.get<string>('NODE_ENV'),
      port: this.configService.get<number>('PORT'),
      isProduction: this.databaseService.isProduction(),
      databaseConfig: {
        host: this.configService.get<string>('DATABASE_HOST'),
        port: this.configService.get<number>('DATABASE_PORT'),
      },
    };
  }

  @Get('database')
  getDatabaseConfig() {
    // En un caso real, no deberías exponer estas credenciales
    // Esto es solo para demostración
    return this.databaseService.getDatabaseConfig();
  }

  @Get('redis')
  getRedisConfig() {
    return this.databaseService.getRedisConfig();
  }
}
