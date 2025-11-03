'use server';
/**
 * @fileOverview Implements the Genkit flow for the SymptomCheckerAssessment story.
 *
 * - symptomCheckerAssessment - A function that processes user-inputted symptoms and returns a list of potential health conditions with their likelihood.
 * - SymptomCheckerAssessmentInput - The input type for the symptomCheckerAssessment function.
 * - SymptomCheckerAssessmentOutput - The return type for the symptomCheckerAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerAssessmentInputSchema = z.object({
  symptoms: z.string().describe('A comma-separated list of symptoms provided by the user.'),
});
export type SymptomCheckerAssessmentInput = z.infer<typeof SymptomCheckerAssessmentInputSchema>;

const ConditionSchema = z.object({
  condition: z.string().describe('The name of the potential health condition.'),
  likelihood: z
    .number()
    .describe(
      'A percentage representing the likelihood of the condition, from 0 to 100.'
    ),
});

const SymptomCheckerAssessmentOutputSchema = z.object({
  conditions: z
    .array(ConditionSchema)
    .describe('A list of potential health conditions based on the symptoms provided, ordered by likelihood (most likely first).'),
});
export type SymptomCheckerAssessmentOutput = z.infer<typeof SymptomCheckerAssessmentOutputSchema>;

export async function symptomCheckerAssessment(input: SymptomCheckerAssessmentInput): Promise<SymptomCheckerAssessmentOutput> {
  return symptomCheckerAssessmentFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerAssessmentInputSchema},
  output: {schema: SymptomCheckerAssessmentOutputSchema},
  prompt: `You are a medical assistant. Based on the symptoms provided, return a list of the top 3 most likely health conditions, ordered from most to least likely.
  For each condition, provide a likelihood percentage. The most likely condition should have the highest percentage.
  If the symptoms strongly suggest a single condition, return only that condition with a high likelihood (e.g., 95%).
  For bone-related injuries, use the term "fracture".
  The output should be a list of health conditions with their likelihood.

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
