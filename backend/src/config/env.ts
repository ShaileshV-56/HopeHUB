import 'dotenv/config';

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  brevoApiKey: process.env.BREVO_API_KEY || '',
};

if (!env.databaseUrl) {
  // We don't throw to allow building, but runtime should validate
  console.warn('[env] DATABASE_URL is not set. Set it in .env');
}
