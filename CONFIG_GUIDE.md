# ConfigModule de NestJS - Guía Completa

## ¿Qué es el ConfigModule de NestJS?

El **ConfigModule** es el módulo oficial de NestJS para manejar variables de entorno y configuración. Es más potente que el dotenv tradicional porque ofrece:

- ✅ **Validación automática** de variables de entorno
- ✅ **Tipado fuerte** con TypeScript
- ✅ **Configuración jerárquica** y por módulos
- ✅ **Carga automática** de archivos `.env`
- ✅ **Cache** para mejor rendimiento
- ✅ **Variables anidadas** y expansión

## Instalación

```bash
npm install @nestjs/config class-validator class-transformer
```

## Configuración

### 1. Configuración básica en AppModule

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la app
      envFilePath: ['.env.local', '.env'], // Orden de prioridad
      cache: true, // Cache para rendimiento
      expandVariables: true, // Variables anidadas
    }),
  ],
})
export class AppModule {}
```

### 2. Validación y tipado (Recomendado)

```typescript
// src/config/environment.config.ts
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  PORT: number;

  @IsString()
  DATABASE_HOST: string;
}
```

## Uso en servicios

### Inyección del ConfigService

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig() {
    return {
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      // Valor por defecto si no existe la variable
      timeout: this.configService.get<number>('DB_TIMEOUT', 5000),
    };
  }
}
```

### Configuración por módulos (Avanzado)

```typescript
// src/config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
}));

// En AppModule
ConfigModule.forRoot({
  load: [databaseConfig], // Cargar configuración específica
})

// Uso en servicio
constructor(
  @Inject(databaseConfig.KEY)
  private dbConfig: ConfigType<typeof databaseConfig>,
) {}
```

## Archivos de entorno

### Estructura recomendada:

```
├── .env                 # Configuración base
├── .env.local          # Desarrollo local (no se sube a git)
├── .env.test           # Testing
├── .env.production     # Producción
└── .env.example        # Plantilla para otros desarrolladores
```

### Orden de prioridad:

1. `.env.local` (mayor prioridad)
2. `.env`
3. Variables del sistema

## Mejores prácticas

### ✅ DO (Recomendado)

```typescript
// 1. Usar tipado fuerte
const port = this.configService.get<number>('PORT');

// 2. Proporcionar valores por defecto
const timeout = this.configService.get<number>('TIMEOUT', 5000);

// 3. Validar variables críticas al inicio
const dbHost = this.configService.getOrThrow<string>('DATABASE_HOST');

// 4. Usar enums para entornos
const isProduction = this.configService.get('NODE_ENV') === Environment.Production;
```

### ❌ DON'T (Evitar)

```typescript
// 1. No usar process.env directamente
const port = process.env.PORT; // ❌

// 2. No asumir que las variables existen
const host = this.configService.get('HOST').toLowerCase(); // ❌ Puede ser undefined

// 3. No hardcodear configuraciones
const apiUrl = 'https://api.example.com'; // ❌
```

## Configuración para diferentes entornos

### Desarrollo
```bash
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
JWT_SECRET=dev-secret-key
```

### Producción
```bash
NODE_ENV=production
PORT=8080
DATABASE_HOST=prod-db.example.com
DATABASE_PORT=5432
JWT_SECRET=super-secure-production-key
```

### Testing
```bash
NODE_ENV=test
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5433
JWT_SECRET=test-secret-key
```

## Ejemplo práctico completo

Puedes probar los endpoints de configuración:

```bash
# Información general
GET http://localhost:3000/config/info

# Configuración de base de datos
GET http://localhost:3000/config/database

# Configuración de Redis
GET http://localhost:3000/config/redis
```

## Ventajas sobre dotenv tradicional

| Característica | dotenv | @nestjs/config |
|---------------|--------|----------------|
| Carga automática | Manual | ✅ Automática |
| Validación | Manual | ✅ Integrada |
| Tipado TypeScript | ❌ | ✅ |
| Cache | ❌ | ✅ |
| Configuración por módulos | ❌ | ✅ |
| Variables anidadas | ❌ | ✅ |
| Valores por defecto | Manual | ✅ Integrado |

## Comandos útiles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Testing
NODE_ENV=test npm run test
```

## Seguridad

- ✅ Nunca subas archivos `.env.local` o `.env.production` a git
- ✅ Usa variables de entorno del sistema en producción
- ✅ Valida todas las variables críticas al inicio
- ✅ Usa secretos seguros para JWT y APIs
- ✅ Documenta las variables requeridas en `.env.example`

## Troubleshooting

### Problema: Variables no se cargan
```typescript
// Verificar que ConfigModule esté configurado como global
ConfigModule.forRoot({ isGlobal: true })
```

### Problema: Validación falla
```typescript
// Asegúrate de que todas las variables requeridas estén en .env
// Usa @IsOptional() para variables opcionales
@IsOptional()
@IsString()
OPTIONAL_VAR?: string;
```

### Problema: Tipos incorrectos
```typescript
// Usar Transform para convertir tipos
@Transform(({ value }) => parseInt(value))
@IsNumber()
PORT: number;
```
