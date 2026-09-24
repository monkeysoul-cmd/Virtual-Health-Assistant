/**
 * Doctor Directory & Availability Controller
 */

const doctorService = require('../services/doctorService');

function getDoctors(req, res, next) {
  try {
    const { specialty, area, city, limit, offset } = req.query;
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    const doctorsList = doctorService.getAllDoctors({
      specialty,
      area,
      city,
      limit: parsedLimit,
      offset: parsedOffset
    });

    res.json({
      success: true,
      data: doctorsList,
      total: doctorsList.length
    });
  } catch (err) {
    next(err);
  }
}

function getDoctorById(req, res, next) {
  try {
    const { id } = req.params;
    const doctor = doctorService.getDoctorById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: `Doctor with ID "${id}" was not found.`,
        code: 'DOCTOR_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (err) {
    next(err);
  }
}

async function searchDoctors(req, res, next) {
  try {
    const { area, specialty, query } = req.body;
    const apiKey = req.headers['x-gemini-api-key'] || req.body.apiKey;

    const result = await doctorService.searchDoctors({
      area,
      specialty,
      query,
      apiKey
    });

    res.json({
      success: true,
      data: result.doctors,
      source: result.source
    });
  } catch (err) {
    next(err);
  }
}

function getSpecialties(req, res, next) {
  try {
    const list = doctorService.getSpecialties();
    res.json({
      success: true,
      data: list
    });
  } catch (err) {
    next(err);
  }
}

function getDoctorSlots(req, res, next) {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const targetDate = date || new Date().toISOString().split('T')[0];
    const availability = doctorService.getDoctorSlots(id, targetDate);

    res.json({
      success: true,
      data: availability
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDoctors,
  getDoctorById,
  searchDoctors,
  getSpecialties,
  getDoctorSlots
};
