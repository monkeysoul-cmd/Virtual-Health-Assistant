/**
 * Symptom Assessment & Clinical Triage Service
 * Combines Google Gemini 2.5 Flash intelligence with a robust rule-based offline fallback engine.
 */

const aiService = require('./aiService');
const {
  commonConditions,
  precautions,
  testSuggestions,
  commonSymptoms,
  conditionToSpecialty,
  fallbackPrescribedPlans,
  defaultPrescribedPlan
} = require('../data/medicalCatalog');

class SymptomService {
  /**
   * Performs rule-based keyword matching when AI is unavailable or rate-limited.
   * @param {string} symptomsText
   * @returns {Array<object>}
   */
  localFallbackAssessment(symptomsText) {
    console.warn('[SymptomService] Using local rule-based clinical fallback matcher.');
    const inputWords = symptomsText
      .toLowerCase()
      .split(/[,\s\.\?]+/)
      .map(w => w.trim())
      .filter(Boolean);

    if (inputWords.length === 0) {
      return [];
    }

    const results = [];

    for (const [condition, symptomsList] of Object.entries(commonConditions)) {
      let matchCount = 0;

      symptomsList.forEach(symptom => {
        const normalizedSymptom = symptom.toLowerCase();
        if (symptomsText.toLowerCase().includes(normalizedSymptom)) {
          matchCount += 2; // direct match of whole phrase
        } else {
          const symptomWords = normalizedSymptom.split(/\s+/);
          const hasWordMatch = inputWords.some(word => symptomWords.includes(word));
          if (hasWordMatch) {
            matchCount += 1; // partial word match
          }
        }
      });

      if (matchCount > 0) {
        const basePercentage = Math.round((matchCount / (symptomsList.length * 2)) * 100);
        const likelihood = Math.min(95, Math.max(15, basePercentage));
        results.push({ condition, likelihood, score: matchCount });
      }
    }

    // Sort by match score descending, then likelihood descending
    results.sort((a, b) => b.score !== a.score ? b.score - a.score : b.likelihood - a.likelihood);

    let topConditions = results.slice(0, 3).map(({ condition, likelihood }) => {
      return this.enrichConditionData(condition, likelihood);
    });

    // If zero conditions matched, provide safe default triage advice
    if (topConditions.length === 0) {
      topConditions.push(this.enrichConditionData('common cold', 35));
    }

    return topConditions;
  }

  /**
   * Enriches condition name with precautions, structured plans, tests, and specialty
   * @param {string} conditionName
   * @param {number} likelihood
   * @param {object} [aiGeneratedPlan]
   * @param {Array<string>} [aiPrecautions]
   * @returns {object}
   */
  enrichConditionData(conditionName, likelihood, aiGeneratedPlan = null, aiPrecautions = null) {
    const lowerName = conditionName.toLowerCase();

    // Precautions
    let matchedPrecautions = aiPrecautions;
    if (!matchedPrecautions || !matchedPrecautions.length) {
      const foundPrecaution = precautions.find(
        p => p.condition.toLowerCase() === lowerName || lowerName.includes(p.condition.toLowerCase())
      );
      matchedPrecautions = foundPrecaution ? foundPrecaution.advice : [
        'Get plenty of rest and hydrate regularly.',
        'Monitor your temperature and symptom progression.',
        'Consult a certified healthcare practitioner if symptoms persist beyond 48 hours.'
      ];
    }

    // Structured care plan
    let prescribedPlan = aiGeneratedPlan;
    if (!prescribedPlan || !prescribedPlan.medicationAdvice) {
      prescribedPlan = fallbackPrescribedPlans[lowerName] || defaultPrescribedPlan;
    }

    // Recommended tests
    const foundTestEntry = testSuggestions.find(
      t => t.condition.toLowerCase() === lowerName || lowerName.includes(t.condition.toLowerCase())
    );
    const recommendedTests = foundTestEntry ? foundTestEntry.tests : [
      {
        name: 'General Clinical Examination',
        description: 'Physical evaluation by a certified physician to check vital signs.',
        recommended: true
      }
    ];

    // Relevant clinical specialty
    const specialty = conditionToSpecialty[lowerName] || 'General Practitioner';

    return {
      condition: conditionName,
      likelihood,
      precautions: matchedPrecautions,
      prescribedPlan,
      recommendedTests,
      specialty
    };
  }

  /**
   * Assesses symptoms using Google Gemini with automatic fallback
   * @param {string} symptoms
   * @param {string} [apiKey]
   * @returns {Promise<{ conditions: Array<object>, source: string }>}
   */
  async assessSymptoms(symptoms, apiKey) {
    const prompt = `You are an expert clinical triage assistant. Analyze these symptoms: "${symptoms}".
Return a JSON object with top 1 to 3 most probable conditions ordered by likelihood.
JSON Schema:
{
  "conditions": [
    {
      "condition": "Name of condition (e.g. Migraine, Common Cold, Gastritis)",
      "likelihood": 85,
      "precautions": ["Precise step 1", "Precise step 2", "Precise step 3"],
      "prescribedPlan": {
        "medicationAdvice": "Over-the-counter and general advice",
        "dietaryGuidelines": ["Specific food 1", "Specific fluid 2"],
        "activityLevel": "Rest/workout restrictions",
        "warningSigns": ["Emergency warning 1", "Emergency warning 2"]
      }
    }
  ]
}
For musculoskeletal injuries, designate "Fracture" or "Sprain". Ensure likelihood is an integer between 10 and 95.`;

    try {
      const response = await aiService.generateJson({
        prompt,
        apiKey,
        temperature: 0.2
      });

      if (response && Array.isArray(response.conditions) && response.conditions.length > 0) {
        const enriched = response.conditions.slice(0, 3).map(item => {
          const likelihood = Math.min(99, Math.max(10, parseInt(item.likelihood || 50, 10)));
          return this.enrichConditionData(
            item.condition || 'General Malaise',
            likelihood,
            item.prescribedPlan,
            item.precautions
          );
        });

        return {
          conditions: enriched,
          source: 'gemini-ai'
        };
      }

      // If AI returned unexpected schema, use local fallback
      const fallbackResults = this.localFallbackAssessment(symptoms);
      return {
        conditions: fallbackResults,
        source: 'clinical-rules-fallback'
      };
    } catch (err) {
      console.warn(`[SymptomService] AI evaluation error: ${err.message}. Engaging fallback engine.`);
      const fallbackResults = this.localFallbackAssessment(symptoms);
      return {
        conditions: fallbackResults,
        source: 'clinical-rules-fallback',
        fallbackReason: err.message
      };
    }
  }

  /**
   * Returns common symptom chips for quick triage
   */
  getSymptomsCatalog() {
    return {
      commonSymptoms,
      categories: [
        {
          name: 'General & Systemic',
          symptoms: ['Fever', 'Fatigue', 'Body Aches', 'Excessive Thirst']
        },
        {
          name: 'Respiratory & ENT',
          symptoms: ['Cough', 'Sore Throat', 'Congestion', 'Sneezing', 'Breathing Difficulty']
        },
        {
          name: 'Head & Neurological',
          symptoms: ['Headache', 'Headache and Dizziness']
        },
        {
          name: 'Gastrointestinal',
          symptoms: ['Stomach Pain', 'Nausea']
        },
        {
          name: 'Musculoskeletal',
          symptoms: ['Joint Pain', 'Swelling']
        },
        {
          name: 'Cardiovascular',
          symptoms: ['Chest Pain']
        },
        {
          name: 'Dermatological',
          symptoms: ['Itching', 'Swelling']
        }
      ]
    };
  }

  /**
   * Returns detectable conditions list
   */
  getConditionsList() {
    return Object.entries(commonConditions).map(([name, symptomList]) => ({
      name,
      symptoms: symptomList,
      specialty: conditionToSpecialty[name] || 'General Practitioner'
    }));
  }

  /**
   * Returns diagnostic tests for a condition
   */
  getTestsForCondition(conditionName) {
    const lower = conditionName.toLowerCase();
    const entry = testSuggestions.find(
      t => t.condition.toLowerCase() === lower || lower.includes(t.condition.toLowerCase())
    );
    return entry || {
      condition: conditionName,
      title: `Suggested Examinations for ${conditionName}`,
      tests: [
        {
          name: 'Comprehensive Health Screening',
          description: 'Basic blood work, vital signs inspection, and consultation.'
        }
      ]
    };
  }
}

module.exports = new SymptomService();
