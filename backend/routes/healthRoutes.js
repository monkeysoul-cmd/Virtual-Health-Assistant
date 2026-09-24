/**
 * Health & Diagnostics Routes
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// GET /api/health
router.get('/', healthController.getHealth);

// GET /api/health/info
router.get('/info', healthController.getSystemInfo);

module.exports = router;
