'use server';

import { symptomCheckerAssessment } from '@/ai/flows/symptom-checker-assessment';
import { z } from 'zod';

const symptomSchema = z
  .string()
  .min(3, { message: 'Please describe your symptoms in more detail.' });

export interface AssessmentState {
  potentialConditions?: string[];
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
    const conditions = result.conditions.map(c => c.trim().toLowerCase());
    return { potentialConditions: conditions };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
