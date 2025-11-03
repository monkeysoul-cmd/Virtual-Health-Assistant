'use server';
/**
 * @fileOverview Implements the Genkit flow for the SymptomCheckerAssessment story.
 *
 * - symptomCheckerAssessment - A function that processes user-inputted symptoms and returns a list of potential health conditions.
 * - SymptomCheckerAssessmentInput - The input type for the symptomCheckerAssessment function.
 * - SymptomCheckerAssessmentOutput - The return type for the symptomCheckerAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerAssessmentInputSchema = z.object({
  symptoms: z.string().describe('A comma-separated list of symptoms provided by the user.'),
});
export type SymptomCheckerAssessmentInput = z.infer<typeof SymptomCheckerAssessmentInputSchema>;

const SymptomCheckerAssessmentOutputSchema = z.object({
  potentialConditions: z
    .string()
    .describe('A comma-separated list of potential health conditions based on the symptoms provided.'),
});
export type SymptomCheckerAssessmentOutput = z.infer<typeof SymptomCheckerAssessmentOutputSchema>;

export async function symptomCheckerAssessment(input: SymptomCheckerAssessmentInput): Promise<SymptomCheckerAssessmentOutput> {
  return symptomCheckerAssessmentFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerAssessmentInputSchema},
  output: {schema: SymptomCheckerAssessmentOutputSchema},
  prompt: `You are a medical assistant that will provide a list of potential health conditions based on the symptoms provided by the user.
  The output should be a comma-separated list of potential health conditions.

  Symptoms: {{{symptoms}}}
  `,
});

const symptomCheckerAssessmentFlow = ai.defineFlow(
  {
    name: 'symptomCheckerAssessmentFlow',
    inputSchema: SymptomCheckerAssessmentInputSchema,
    outputSchema: SymptomCheckerAssessmentOutputSchema,
  },
  async input => {
    const {output} = await symptomCheckerPrompt(input);
    return output!;
  }
);
