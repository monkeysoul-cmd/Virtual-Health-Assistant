/**
 * Health & Diagnostics Controller
 */

const os = require('os');
const config = require('../config');
const { commonConditions, commonSymptoms } = require('../data/medicalCatalog');
const { doctors } = require('../data/doctorData');
const db = require('../config/db');

function getHealth(req, res) {
  const memoryUsage = process.memoryUsage();
  
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryRssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
      memoryHeapMb: Math.round(memoryUsage.heapUsed / (1024 * 1024))
    },
    services: {
      geminiAi: Boolean(config.gemini.apiKey),
      database: 'connected'
    }
  });
}

function getSystemInfo(req, res) {
  const appointmentsCount = db.readCollection('appointments').length;

  res.json({
    success: true,
    platform: 'Virtual Health Assistant Backend API',
    version: '1.0.0',
    capabilities: {
      symptomTriage: true,
      aiDiagnostics: Boolean(config.gemini.apiKey),
      doctorDirectory: true,
      appointmentBooking: true,
      virtualDoctorChat: true
    },
    statistics: {
      totalDoctors: doctors.length,
      supportedConditions: Object.keys(commonConditions).length,
      catalogSymptoms: commonSymptoms.length,
      appointmentsBooked: appointmentsCount
    }
  });
}

module.exports = {
  getHealth,
  getSystemInfo
};
