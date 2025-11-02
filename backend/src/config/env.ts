import 'dotenv/config';

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  brevoApiKey: process.env.BREVO_API_KEY || '',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openRouterModel: process.env.OPENROUTER_MODEL || 'gpt-4o-mini',
  openRouterReferer: process.env.OPENROUTER_REFERER || process.env.APP_URL || 'http://localhost:5173',
};

if (!env.databaseUrl) {
  // We don't throw to allow building, but runtime should validate
  console.warn('[env] DATABASE_URL is not set. Set it in .env');
}

if (!env.openRouterApiKey) {
  console.warn('[env] OPENROUTER_API_KEY is not set. Chatbot functionality will be disabled.');
}
