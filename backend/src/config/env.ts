import dotenv from 'dotenv';

dotenv.config();

export interface EnvVars {
  DATABASE_URL: string;
  PORT: number;
}

export function loadEnv(): EnvVars {
  const databaseUrl = process.env.DATABASE_URL;
  const portRaw = process.env.PORT ?? '4000';

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('PORT must be a positive number');
  }

  return {
    DATABASE_URL: databaseUrl,
    PORT: port,
  };
}
