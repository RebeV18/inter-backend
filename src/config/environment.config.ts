import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform, Type, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value as string, 10))
  PORT!: number;

  // Database Configuration
  @IsString()
  DATABASE_HOST!: string;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value as string, 10))
  DATABASE_PORT!: number;

  @IsString()
  DATABASE_USERNAME!: string;

  @IsString()
  DATABASE_PASSWORD!: string;

  @IsString()
  DATABASE_NAME!: string;

  // Firebase Configuration
  @IsString()
  FIREBASE_PROJECT_ID!: string;

  @IsString()
  FIREBASE_PRIVATE_KEY_ID!: string;

  @IsString()
  FIREBASE_PRIVATE_KEY!: string;

  @IsString()
  FIREBASE_CLIENT_EMAIL!: string;

  @IsString()
  FIREBASE_CLIENT_ID!: string;

  @IsString()
  @IsOptional()
  FIREBASE_AUTH_URI?: string;

  @IsString()
  @IsOptional()
  FIREBASE_TOKEN_URI?: string;

  @IsString()
  @IsOptional()
  FIREBASE_CLIENT_CERT_URL?: string;

  // JWT Configuration
  @IsString()
  JWT_SECRET!: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRATION?: string = '24h';

  // External APIs
  @IsString()
  @IsOptional()
  API_KEY?: string;

  @IsString()
  @IsOptional()
  API_URL?: string;

  // Redis Configuration
  @IsString()
  @IsOptional()
  REDIS_HOST?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  REDIS_PORT?: number;
}

// Función de validación más robusta
export const validate = (
  config: Record<string, unknown>,
): EnvironmentVariables => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error('❌ Environment validation errors:');
    errors.forEach((error) => {
      const constraints = error.constraints || {};
      const messages = Object.values(constraints).join(', ');
      console.error(`  • ${error.property}: ${messages}`);
    });
    throw new Error('Environment validation failed');
  }

  return validatedConfig;
};
