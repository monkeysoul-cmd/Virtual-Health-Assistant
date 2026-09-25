/**
 * Standard System & Clinical Messages
 */

const MESSAGES = {
  HEALTH_CHECK_OK: 'Virtual Health Assistant API is healthy and operational.',
  NOT_FOUND: 'The requested resource was not found.',
  RATE_LIMIT_EXCEEDED: 'Too many requests received from this IP, please try again later.',
  INVALID_INPUT: 'Invalid or missing request parameters.',
  APPOINTMENT_CONFIRMED: 'Appointment successfully confirmed and registered.',
  APPOINTMENT_CONFLICT: 'The selected slot is already booked for this date. Please choose another slot.',
  DOCTOR_NOT_FOUND: 'The requested doctor was not found in our directory.',
};

module.exports = MESSAGES;
