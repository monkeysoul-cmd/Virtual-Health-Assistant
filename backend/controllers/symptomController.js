/**
 * Symptom Assessment Controller
 */

const symptomService = require('../services/symptomService');

async function assess(req, res, next) {
  try {
    const { symptoms } = req.body;
    // Check if client supplied an API key in header (x-gemini-api-key) or body
    const apiKey = req.headers['x-gemini-api-key'] || req.body.apiKey;

    const result = await symptomService.assessSymptoms(symptoms, apiKey);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
}

function getCatalog(req, res, next) {
  try {
    const catalog = symptomService.getSymptomsCatalog();
    res.json({
      success: true,
      data: catalog
    });
  } catch (err) {
    next(err);
  }
}

function getConditions(req, res, next) {
  try {
    const conditions = symptomService.getConditionsList();
    res.json({
      success: true,
      data: conditions
    });
  } catch (err) {
    next(err);
  }
}

function getTestsForCondition(req, res, next) {
  try {
    const { condition } = req.params;
    const tests = symptomService.getTestsForCondition(condition);
    res.json({
      success: true,
      data: tests
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  assess,
  getCatalog,
  getConditions,
  getTestsForCondition
};
