/**
 * Master API Router
 * Aggregates all modular sub-routers under the /api namespace.
 */

const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const symptomRoutes = require('./symptomRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const chatRoutes = require('./chatRoutes');

router.use('/health', healthRoutes);
router.use('/symptoms', symptomRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
