/**
 * Server Configuration & Environment Loader
 * Supports loading environment variables from backend/.env or root .env
 */

const path = require('path');
const dotenv = require('dotenv');

// Attempt to load from backend/.env first, then root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || process.env.BACKEND_PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0',
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models'
  },
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
      : ['http://localhost:3000', 'http://localhost:9002', 'http://127.0.0.1:9002', 'http://localhost:5173']
  },
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '60', 10)
  },
  storageDir: path.resolve(__dirname, '../data/storage')
};

module.exports = config;
