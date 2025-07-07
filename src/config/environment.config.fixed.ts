import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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
  const validatedConfig = new EnvironmentVariables();
  Object.assign(validatedConfig, config);
  return validatedConfig;
};
