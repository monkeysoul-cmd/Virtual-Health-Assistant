'use server';

import { z } from 'zod';
import { symptomData } from '@/lib/data';

const symptomSchema = z
  .string()
  .min(3, { message: 'Please describe your symptoms in more detail.' });

interface Condition {
  condition: string;
  likelihood: number;
}
export interface AssessmentState {
  potentialConditions?: Condition[];
  error?: string | null;
}

function findMatchingConditions(symptoms: string): Condition[] {
  const inputSymptoms = symptoms
    .toLowerCase()
    .split(',')
    .map(s => s.trim())
    .filter(s => s);

  if (inputSymptoms.length === 0) {
    return [];
  }

  const matches: { [key: string]: { score: number; likelihood: number } } = {};

  symptomData.forEach(record => {
    const recordSymptoms = record.symptoms.map(s => s.toLowerCase());
    let matchScore = 0;

    inputSymptoms.forEach(inputSymptom => {
      // Check if any symptom in the record includes the input symptom
      if (recordSymptoms.some(rs => rs.includes(inputSymptom))) {
        matchScore++;
      }
    });

    if (matchScore > 0) {
      // Prioritize records where more of the input symptoms are matched
      const relevance = matchScore / inputSymptoms.length;

      if (
        !matches[record.condition] ||
        relevance > (matches[record.condition].score / inputSymptoms.length)
      ) {
        matches[record.condition] = {
          score: matchScore,
          likelihood: record.likelihood,
        };
      }
    }
  });

  const matchedConditions = Object.entries(matches).map(
    ([condition, data]) => ({
      condition: condition.toLowerCase(),
      likelihood: data.likelihood,
      score: data.score,
    })
  );

  // Sort by score (primary) and likelihood (secondary)
  matchedConditions.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.likelihood - a.likelihood;
  });

  return matchedConditions.map(({ condition, likelihood }) => ({
    condition,
    likelihood,
  }));
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const conditions = findMatchingConditions(validatedSymptoms.data);

    if (conditions.length === 0) {
      return {
        error: 'No matching conditions found for the provided symptoms.',
      };
    }

    return { potentialConditions: conditions };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
