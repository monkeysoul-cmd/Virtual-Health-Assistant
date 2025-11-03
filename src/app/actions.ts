'use server';

import { type SymptomCheckerAssessmentOutput } from '@/ai/flows/symptom-checker-assessment';
import { commonConditions } from '@/lib/data';
import { z } from 'zod';

const symptomSchema = z
  .string()
  .min(3, { message: 'Please describe your symptoms in more detail.' });

export interface AssessmentState {
  potentialConditions?: SymptomCheckerAssessmentOutput['conditions'];
  error?: string | null;
}

// Helper function to simulate a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to calculate similarity score
function calculateSimilarity(symptomInput: string, conditionSymptoms: string[]): number {
  const inputWords = new Set(symptomInput.toLowerCase().split(/,?\s+/));
  const conditionWords = new Set(conditionSymptoms.map(s => s.toLowerCase()));
  
  let intersectionSize = 0;
  for (const word of inputWords) {
    if (conditionWords.has(word)) {
      intersectionSize++;
    }
  }

  const unionSize = inputWords.size + conditionWords.size - intersectionSize;
  if (unionSize === 0) return 0;
  
  // Jaccard similarity
  return (intersectionSize / unionSize) * 100;
}


export async function getHealthAssessment(
  prevState: AssessmentState,
  formData: FormData
): Promise<AssessmentState> {
  const symptoms = formData.get('symptoms');

  const validatedSymptoms = symptomSchema.safeParse(symptoms);

  if (!validatedSymptoms.success) {
    return {
      error: validatedSymptoms.error.errors[0].message,
    };
  }

  await sleep(1000); // Simulate 1-second delay

  try {
    const inputSymptoms = validatedSymptoms.data;

    const matchedConditions = Object.entries(commonConditions)
      .map(([condition, conditionSymptoms]) => {
        const likelihood = calculateSimilarity(inputSymptoms, conditionSymptoms);
        return {
          condition: condition.toLowerCase(),
          likelihood: Math.round(likelihood),
        };
      })
      .filter(c => c.likelihood > 10) // Only show conditions with some relevance
      .sort((a, b) => b.likelihood - a.likelihood)
      .slice(0, 3); // Return top 3 matches

    if (matchedConditions.length === 0) {
      return {
        potentialConditions: [{ condition: 'No specific match found', likelihood: 0 }],
      };
    }
    
    return { potentialConditions: matchedConditions };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred during the offline assessment. Please try again.',
    };
  }
}
