import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
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

  // Firebase Configuration
  @IsString()
  FIREBASE_PROJECT_ID: string;

  @IsString()
  FIREBASE_PRIVATE_KEY_ID: string;

  @IsString()
  FIREBASE_PRIVATE_KEY: string;

  @IsString()
  FIREBASE_CLIENT_EMAIL: string;

  @IsString()
  FIREBASE_CLIENT_ID: string;

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
  JWT_SECRET: string;

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
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  REDIS_PORT?: number;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = new EnvironmentVariables();
  Object.assign(validatedConfig, config);
  return validatedConfig;
};
