/**
 * Appointment Booking & Management Routes
 */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { validateAppointmentInput } = require('../middleware/validate');

// POST /api/appointments - Schedule a new appointment
router.post('/', validateAppointmentInput, appointmentController.bookAppointment);

// GET /api/appointments - List appointments (?patientPhone, ?doctorId, ?status, ?date)
router.get('/', appointmentController.getAppointments);

// GET /api/appointments/:id - Get appointment details by booking reference
router.get('/:id', appointmentController.getAppointmentById);

// PATCH /api/appointments/:id/cancel - Cancel an existing appointment
router.patch('/:id/cancel', appointmentController.cancelAppointment);

// DELETE /api/appointments/:id - Alternative cancellation method
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;
