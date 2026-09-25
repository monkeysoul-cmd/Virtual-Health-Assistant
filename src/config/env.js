/**
 * Environment Configuration & Validation
 * Centralizes environment variables with sensible defaults for development & production.
 */

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',

  // Backend API URL (for client and server-side calls)
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 
          process.env.BACKEND_URL || 
          (typeof window !== 'undefined' ? '' : 'http://127.0.0.1:5000'),

  // Google Gemini API Key
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',

  // Port config
  port: parseInt(process.env.PORT || '9002', 10),
  backendPort: parseInt(process.env.BACKEND_PORT || '5000', 10),
};

export default env;
