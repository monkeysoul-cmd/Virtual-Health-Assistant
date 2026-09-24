/**
 * Doctor Directory Routes
 */

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { validateDoctorSearch } = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');

// GET /api/doctors - List doctors with optional filter params (?specialty, ?area, ?city, ?limit)
router.get('/', doctorController.getDoctors);

// GET /api/doctors/specialties - Get specialties catalog and doctor counts
router.get('/specialties', doctorController.getSpecialties);

// POST /api/doctors/search - AI-assisted and weighted location search
router.post('/search', rateLimiter, validateDoctorSearch, doctorController.searchDoctors);

// GET /api/doctors/:id - Get specific doctor profile
router.get('/:id', doctorController.getDoctorById);

// GET /api/doctors/:id/slots - Get available slots for a doctor on a given date (?date=YYYY-MM-DD)
router.get('/:id/slots', doctorController.getDoctorSlots);

module.exports = router;
