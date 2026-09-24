/**
 * Virtual Health Assistant - Backend Server
 * Production-ready Express server orchestrating clinical triage, doctor directories,
 * appointment scheduling, and Google Gemini AI integration.
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

// Security & Parsing Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // In development or if wildcard is enabled, allow all origins
    if (config.env === 'development' || config.cors.origin.includes('*')) {
      return callback(null, true);
    }

    if (config.cors.origin.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key']
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Request Logging
app.use(logger);

// Welcome / Root Ping
app.get('/', (req, res) => {
  res.json({
    name: 'Virtual Health Assistant API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health/info',
    endpoints: {
      health: '/api/health',
      symptomsAssess: '/api/symptoms/assess',
      symptomsCatalog: '/api/symptoms/catalog',
      doctors: '/api/doctors',
      doctorSearch: '/api/doctors/search',
      appointments: '/api/appointments',
      virtualDoctorChat: '/api/chat'
    },
    timestamp: new Date().toISOString()
  });
});

// Mount Main API Router
app.use('/api', apiRoutes);

// Error Handling Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server if invoked directly
if (require.main === module) {
  const server = app.listen(config.port, config.host, () => {
    console.log(`\n======================================================`);
    console.log(`🩺 Virtual Health Assistant Backend Server`);
    console.log(`======================================================`);
    console.log(`🚀 Server running on: http://${config.host === '0.0.0.0' ? 'localhost' : config.host}:${config.port}`);
    console.log(`🌐 Environment:       ${config.env}`);
    console.log(`🧠 Gemini AI Model:   ${config.gemini.model}`);
    console.log(`🔑 AI Key Status:     ${config.gemini.apiKey ? 'Configured ✅' : 'Missing (Will use offline fallback) ⚠️'}`);
    console.log(`📚 Health Diagnostics: http://localhost:${config.port}/api/health`);
    console.log(`======================================================\n`);
  });

  // Graceful Shutdown
  const handleExit = (signal) => {
    console.log(`\n[Server] Received ${signal}. Gracefully closing HTTP server...`);
    server.close(() => {
      console.log('[Server] Closed all remaining connections. Process exited cleanly.');
      process.exit(0);
    });

    // Force shutdown if taking too long
    setTimeout(() => {
      console.error('[Server] Could not close connections in time, forcefully shutting down.');
      process.exit(1);
    }, 5000);
  };

  process.on('SIGTERM', () => handleExit('SIGTERM'));
  process.on('SIGINT', () => handleExit('SIGINT'));
}

module.exports = app;
