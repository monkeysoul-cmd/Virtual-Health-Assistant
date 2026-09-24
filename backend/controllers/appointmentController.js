/**
 * Appointment Controller
 */

const appointmentService = require('../services/appointmentService');

function bookAppointment(req, res, next) {
  try {
    const booking = appointmentService.bookAppointment(req.body);
    res.status(201).json({
      success: true,
      message: 'Appointment successfully confirmed and scheduled.',
      data: booking
    });
  } catch (err) {
    next(err);
  }
}

function getAppointments(req, res, next) {
  try {
    const { patientPhone, doctorId, status, date } = req.query;
    const list = appointmentService.getAppointments({
      patientPhone,
      doctorId,
      status,
      date
    });

    res.json({
      success: true,
      data: list,
      count: list.length
    });
  } catch (err) {
    next(err);
  }
}

function getAppointmentById(req, res, next) {
  try {
    const { id } = req.params;
    const appointment = appointmentService.getAppointmentById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: `Appointment "${id}" not found.`,
        code: 'APPOINTMENT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
}

function cancelAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const cancelled = appointmentService.cancelAppointment(id, reason);
    res.json({
      success: true,
      message: 'Appointment successfully cancelled.',
      data: cancelled
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment
};
