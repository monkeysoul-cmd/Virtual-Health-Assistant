/**
 * Symptom Assessment Routes
 */

const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');
const { validateSymptomInput } = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');

// POST /api/symptoms/assess - Run AI clinical triage on provided symptoms
router.post('/assess', rateLimiter, validateSymptomInput, symptomController.assess);

// GET /api/symptoms/catalog - Get quick-pick symptom chips & taxonomy
router.get('/catalog', symptomController.getCatalog);

// GET /api/symptoms/conditions - Get list of recognized conditions
router.get('/conditions', symptomController.getConditions);

// GET /api/symptoms/tests/:condition - Get clinical test suggestions for condition
router.get('/tests/:condition', symptomController.getTestsForCondition);

module.exports = router;
