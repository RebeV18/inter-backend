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
      database: this.databaseService.getDatabaseConfig(),
      jwt: this.databaseService.getJwtConfig(),
      api: this.databaseService.getApiConfig(),
      redis: this.databaseService.getRedisConfig(),
      firebase: {
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        clientId: this.configService.get<string>('FIREBASE_CLIENT_ID'),
        authUri: this.configService.get<string>('FIREBASE_AUTH_URI'),
        tokenUri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
        clientCertUrl: this.configService.get<string>(
          'FIREBASE_CLIENT_CERT_URL',
        ),
      },
    };
  }
  @Get('redis')
  getRedisConfig() {
    return this.databaseService.getRedisConfig();
  }
}
