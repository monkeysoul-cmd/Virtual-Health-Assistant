/**
 * Appointment Scheduling & Patient Booking Service
 * Handles slot validation, booking persistence, and cancellation.
 */

const db = require('../config/db');
const doctorService = require('./doctorService');

class AppointmentService {
  /**
   * Generates a unique, human-readable appointment confirmation code
   */
  generateBookingReference() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VHA-${code}`;
  }

  /**
   * Books a new doctor appointment
   * @param {object} bookingData
   * @returns {object}
   */
  bookAppointment({
    doctorId,
    doctorName,
    doctorSpecialty,
    patientName,
    patientPhone,
    patientEmail,
    date,
    timeSlot,
    symptoms,
    notes
  }) {
    // Format date string
    const dateObj = new Date(date);
    const dateFormatted = dateObj.toISOString().split('T')[0];

    // Check if slot is already occupied
    const existingBooking = db.findOne('appointments', a => {
      const matchDoc = (doctorId && String(a.doctorId) === String(doctorId)) || a.doctorName === doctorName;
      const matchDate = a.date && a.date.startsWith(dateFormatted);
      const matchSlot = a.timeSlot === timeSlot;
      const isActive = a.status !== 'cancelled';
      return matchDoc && matchDate && matchSlot && isActive;
    });

    if (existingBooking) {
      const err = new Error(`The selected slot ${timeSlot} on ${dateFormatted} is already booked. Please choose another slot.`);
      err.statusCode = 409;
      err.code = 'SLOT_UNAVAILABLE';
      throw err;
    }

    // Resolve doctor details
    let resolvedDoctor = null;
    if (doctorId) {
      resolvedDoctor = doctorService.getDoctorById(doctorId);
    }

    const appointment = {
      id: this.generateBookingReference(),
      doctorId: doctorId || resolvedDoctor?.id || 'doc_ext',
      doctorName: doctorName || resolvedDoctor?.name || 'Dr. Specialist',
      doctorSpecialty: doctorSpecialty || resolvedDoctor?.specialty || 'General Medicine',
      doctorArea: resolvedDoctor?.area || 'Clinic Location',
      consultationFee: resolvedDoctor?.consultationFee || 600,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail ? patientEmail.trim() : null,
      date: dateFormatted,
      timeSlot,
      symptoms: symptoms || '',
      notes: notes || '',
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };

    const saved = db.insert('appointments', appointment);
    console.log(`[Appointment] Confirmed booking: ${saved.id} for ${saved.patientName} with ${saved.doctorName} on ${saved.date} at ${saved.timeSlot}`);
    return saved;
  }

  /**
   * Retrieves appointments matching query
   * @param {object} filters
   * @returns {Array<object>}
   */
  getAppointments({ patientPhone, doctorId, status, date } = {}) {
    return db.find('appointments', a => {
      if (patientPhone && a.patientPhone !== patientPhone) return false;
      if (doctorId && String(a.doctorId) !== String(doctorId)) return false;
      if (status && a.status !== status) return false;
      if (date && !a.date.startsWith(date)) return false;
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Retrieves single appointment by confirmation reference or ID
   * @param {string} id
   * @returns {object|null}
   */
  getAppointmentById(id) {
    return db.findOne('appointments', a => a.id === id);
  }

  /**
   * Cancels an appointment
   * @param {string} id
   * @param {string} [reason]
   * @returns {object}
   */
  cancelAppointment(id, reason = 'Cancelled by patient') {
    const appointment = this.getAppointmentById(id);
    if (!appointment) {
      const err = new Error(`Appointment with ID "${id}" was not found.`);
      err.statusCode = 404;
      err.code = 'APPOINTMENT_NOT_FOUND';
      throw err;
    }

    if (appointment.status === 'cancelled') {
      return appointment;
    }

    const updated = db.update('appointments', appointment.id, {
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString()
    });

    console.log(`[Appointment] Cancelled booking: ${id} - Reason: ${reason}`);
    return updated;
  }
}

module.exports = new AppointmentService();
