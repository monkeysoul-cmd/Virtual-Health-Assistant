/**
 * Request Validation Middleware
 * Validates request bodies, parameters, and headers before passing to controllers.
 */

function validateSymptomInput(req, res, next) {
  const { symptoms } = req.body;
  if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Please describe your symptoms with at least 3 characters.',
      code: 'INVALID_SYMPTOMS'
    });
  }
  req.body.symptoms = symptoms.trim();
  next();
}

function validateAppointmentInput(req, res, next) {
  const { doctorId, doctorName, patientName, patientPhone, date, timeSlot } = req.body;

  if (!doctorName || typeof doctorName !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Doctor name is required.',
      code: 'MISSING_DOCTOR_NAME'
    });
  }

  if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Patient name must be at least 2 characters.',
      code: 'INVALID_PATIENT_NAME'
    });
  }

  if (!patientPhone || typeof patientPhone !== 'string' || patientPhone.trim().length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Valid contact phone number is required.',
      code: 'INVALID_PHONE'
    });
  }

  if (!date) {
    return res.status(400).json({
      success: false,
      error: 'Appointment date is required.',
      code: 'MISSING_DATE'
    });
  }

  // Ensure date is not in the past (comparing YYYY-MM-DD or date object)
  const appDate = new Date(date);
  if (isNaN(appDate.getTime())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid appointment date format.',
      code: 'INVALID_DATE'
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appDate < today) {
    return res.status(400).json({
      success: false,
      error: 'Appointment date cannot be in the past.',
      code: 'PAST_DATE'
    });
  }

  if (!timeSlot || typeof timeSlot !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Time slot selection is required.',
      code: 'MISSING_TIME_SLOT'
    });
  }

  next();
}

function validateDoctorSearch(req, res, next) {
  const { area, query } = req.body;
  const searchTarget = area || query;
  if (!searchTarget || typeof searchTarget !== 'string' || searchTarget.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a search query or area with at least 2 characters.',
      code: 'INVALID_SEARCH_QUERY'
    });
  }
  next();
}

function validateChatMessage(req, res, next) {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Message content cannot be empty.',
      code: 'EMPTY_MESSAGE'
    });
  }
  next();
}

module.exports = {
  validateSymptomInput,
  validateAppointmentInput,
  validateDoctorSearch,
  validateChatMessage
};
