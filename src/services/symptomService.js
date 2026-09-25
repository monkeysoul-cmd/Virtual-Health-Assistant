/**
 * Symptom Service
 * Orchestrates clinical symptom analysis and assessment formatting.
 */

import { symptomCheckerAssessment } from '@/ai/flows/symptom-checker-assessment';

export const symptomService = {
  /**
   * Run AI symptom assessment with clinical fallback
   * @param {string} symptomsText
   * @param {string} [apiKey]
   * @returns {Promise<{ conditions: Array<Object>, prescribedPlan?: Object }>}
   */
  async assessSymptoms(symptomsText, apiKey) {
    return await symptomCheckerAssessment(
      { symptoms: symptomsText },
      apiKey
    );
  }
};

export default symptomService;
