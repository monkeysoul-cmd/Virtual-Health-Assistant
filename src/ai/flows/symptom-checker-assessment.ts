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
  conditions: z
    .array(z.string())
    .describe('A list of potential health conditions based on the symptoms provided, ordered by likelihood.'),
});
export type SymptomCheckerAssessmentOutput = z.infer<typeof SymptomCheckerAssessmentOutputSchema>;

export async function symptomCheckerAssessment(input: SymptomCheckerAssessmentInput): Promise<SymptomCheckerAssessmentOutput> {
  return symptomCheckerAssessmentFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerAssessmentInputSchema},
  output: {schema: SymptomCheckerAssessmentOutputSchema},
  prompt: `You are a medical assistant. Based on the symptoms provided, return a list of the top 3 most likely health conditions.
  The output should be a list of health conditions.

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
