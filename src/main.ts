import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtener ConfigService
  const configService = app.get(ConfigService);

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api'); // Prefijo global para las rutas

  // Configurar CORS si es necesario
  app.enableCors();

  // Usar puerto desde variables de entorno (Vercel: process.env.PORT siempre presente)
  const port =
    Number(process.env.PORT) || configService.get<number>('PORT') || 4000;

  // Configurar Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Inter Backend API')
    .setDescription('API para gestión de países con Firebase Firestore')
    .setVersion('1.0.0')
    .addTag('countries', 'Operaciones CRUD para países')
    .addTag('firebase', 'Endpoints de testing y configuración Firebase')
    .addTag('config', 'Configuración y variables de entorno')
    .addServer('http://localhost:4000', 'Servidor de desarrollo')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Inter Backend API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  app.enableCors();

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🌍 Environment: ${configService.get<string>('NODE_ENV')}`);
  console.log('📋 Available endpoints:');
  console.log('  • Countries API: /api/countries');
  console.log('  • Firebase Testing: /api/firebase');
  console.log('  • Configuration: /api/config');
}

// Llamar bootstrap() y manejar errores
void bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});
