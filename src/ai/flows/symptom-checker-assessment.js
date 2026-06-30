'use server';
/**
 * @fileOverview Implements the Genkit flow for the SymptomCheckerAssessment story.
 *
 * - symptomCheckerAssessment - A function that processes user-inputted symptoms and returns a list of potential health conditions with their likelihood.
 */

import { getGenkitInstance } from '@/ai/genkit.js';
import { z } from 'genkit';
import { commonConditions, precautions, fallbackPrescribedPlans, defaultPrescribedPlan } from '@/lib/data.js';

const PrescribedPlanSchema = z.object({
  medicationAdvice: z.string().describe('General over-the-counter medication advice or treatment directives.'),
  dietaryGuidelines: z.array(z.string()).describe('List of 2-3 specific dietary recommendations.'),
  activityLevel: z.string().describe('Guidelines for rest, sleep, or physical activity limits.'),
  warningSigns: z.array(z.string()).describe('List of 2-3 emergency warning signs that warrant immediate clinical attention.'),
});

const ConditionSchema = z.object({
  condition: z.string().describe('The name of the potential health condition.'),
  likelihood: z
    .number()
    .describe(
      'A percentage representing the likelihood of the condition, from 0 to 100.'
    ),
  precautions: z
    .array(z.string())
    .describe('A list of 3-4 key precautionary steps, self-care advice, or recommendations for this condition.'),
  prescribedPlan: PrescribedPlanSchema.describe('A structured care plan or recovery checklist prescribed by the doctor.'),
});

const SymptomCheckerAssessmentOutputSchema = z.object({
  conditions: z
    .array(ConditionSchema)
    .describe('A list of potential health conditions based on the symptoms provided, ordered by likelihood (most likely first).'),
});

/**
 * Local fallback assessment using the rule-based symptoms database.
 * Runs if the Gemini API key is invalid, missing, or rate-limited.
 * @param {string} symptomsText
 * @returns {{ conditions: Array<{ condition: string, likelihood: number }> }}
 */
function localFallbackAssessment(symptomsText) {
  console.warn("Gemini API call failed or key is missing. Using local rule-based assessment fallback.");
  const inputWords = symptomsText.toLowerCase().split(/[,\s\.\?]+/).map(w => w.trim()).filter(Boolean);
  if (inputWords.length === 0) {
    return { conditions: [] };
  }

  const results = [];

  for (const [condition, symptomsList] of Object.entries(commonConditions)) {
    let matchCount = 0;
    symptomsList.forEach(symptom => {
      const normalizedSymptom = symptom.toLowerCase();
      // Check if the symptom is found in the input text, or if any input word matches a word in the symptom
      if (symptomsText.toLowerCase().includes(normalizedSymptom)) {
        matchCount += 2; // direct match of the whole symptom phrase
      } else {
        const symptomWords = normalizedSymptom.split(/\s+/);
        const hasWordMatch = inputWords.some(word => symptomWords.includes(word));
        if (hasWordMatch) {
          matchCount += 1; // partial match of words
        }
      }
    });

    if (matchCount > 0) {
      // Calculate a pseudo-likelihood percentage bounded between 10% and 95%
      const basePercentage = Math.round((matchCount / (symptomsList.length * 2)) * 100);
      const likelihood = Math.min(95, Math.max(15, basePercentage));
      results.push({ condition, likelihood, score: matchCount });
    }
  }

  // Sort by score desc, then by likelihood desc
  results.sort((a, b) => b.score !== a.score ? b.score - a.score : b.likelihood - a.likelihood);

  // Return the top 3
  const topConditions = results.slice(0, 3).map(({ condition, likelihood }) => {
    const matchedPrecaution = precautions.find(
      p => p.condition.toLowerCase() === condition.toLowerCase()
    );
    const matchedPlan = fallbackPrescribedPlans[condition.toLowerCase()] || defaultPrescribedPlan;
    return {
      condition,
      likelihood,
      precautions: matchedPrecaution ? matchedPrecaution.advice : [
        'Rest and stay hydrated.',
        'Monitor your symptoms closely.',
        'Consult a healthcare professional if symptoms worsen.'
      ],
      prescribedPlan: matchedPlan
    };
  });

  // If no conditions matched, return a generic fallback
  if (topConditions.length === 0) {
    const defaultPrecaution = precautions.find(p => p.condition === 'common cold');
    topConditions.push({
      condition: 'common cold',
      likelihood: 35,
      precautions: defaultPrecaution ? defaultPrecaution.advice : [
        'Get plenty of rest and drink warm liquids.',
        'Use a humidifier or take a steamy shower.',
        'Wash hands frequently to avoid spreading.'
      ],
      prescribedPlan: fallbackPrescribedPlans['common cold']
    });
  }

  return { conditions: topConditions };
}

/**
 * @param {{ symptoms: string }} input
 * @param {string} [apiKey]
 * @returns {Promise<{ conditions: Array<{ condition: string, likelihood: number }> }>}
 */
export async function symptomCheckerAssessment(input, apiKey) {
  try {
    const ai = getGenkitInstance(apiKey);
    
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      output: { schema: SymptomCheckerAssessmentOutputSchema },
      prompt: `You are a medical assistant. Based on the symptoms provided, return a list of the top 3 most likely health conditions, ordered from most to least likely.
      For each condition, provide:
      - likelihood: percentage from 0 to 100.
      - precautions: a list of 3-4 specific precautionary steps.
      - prescribedPlan: a doctor-prescribed recovery plan detailing:
        - medicationAdvice: over-the-counter advice or medication guidance.
        - dietaryGuidelines: a list of 2-3 food/drink recommendations.
        - activityLevel: rest and workout limits.
        - warningSigns: a list of 2-3 warning symptoms that warrant emergency care.
      
      If the symptoms strongly suggest a single condition, return only that condition with a high likelihood (e.g., 95%).
      For bone-related injuries, use the term "fracture".
      The output should match the schema exactly and provide the conditions, precautions, and recovery plans.
      The condition name should be a short, one or two-word identifier (e.g., "common cold", "migraine", "influenza").

      Symptoms: ${input.symptoms}
      `,
    });

    if (response && response.output && response.output.conditions) {
      return response.output;
    }
    
    return localFallbackAssessment(input.symptoms);
  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    return localFallbackAssessment(input.symptoms);
  }
}
