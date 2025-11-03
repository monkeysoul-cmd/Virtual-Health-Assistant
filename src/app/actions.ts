'use server';

import {
  symptomCheckerAssessment,
  type SymptomCheckerAssessmentOutput,
} from '@/ai/flows/symptom-checker-assessment';
import { z } from 'zod';

const symptomSchema = z
  .string()
  .min(3, { message: 'Please describe your symptoms in more detail.' });

export interface AssessmentState {
  potentialConditions?: SymptomCheckerAssessmentOutput['conditions'];
  error?: string | null;
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

  try {
    const result = await symptomCheckerAssessment({
      symptoms: validatedSymptoms.data,
    });
    // The AI flow already returns conditions with lowercase names if instructed, but this ensures consistency.
    const conditions = result.conditions.map(c => ({
      ...c,
      condition: c.condition.trim().toLowerCase(),
    }));
    return { potentialConditions: conditions };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
