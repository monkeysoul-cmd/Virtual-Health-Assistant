import { z } from 'zod';

export const symptomInputSchema = z
  .string()
  .min(3, { message: 'Please describe your symptoms in more detail (at least 3 characters).' })
  .max(1000, { message: 'Symptom description cannot exceed 1000 characters.' });

export const conditionLikelihoodSchema = z.object({
  name: z.string(),
  likelihood: z.number().min(0).max(100),
  description: z.string().optional(),
  color: z.enum(['emerald', 'amber', 'rose']).optional(),
});

export const prescribedPlanSchema = z.object({
  primaryDiagnosis: z.string().optional(),
  prescription: z.array(z.string()).default([]),
  precautions: z.array(z.string()).default([]),
  dietaryAdvice: z.array(z.string()).default([]),
  activityRestrictions: z.array(z.string()).default([]),
  emergencyWarnings: z.array(z.string()).default([]),
  suggestedFollowUp: z.string().optional(),
  recommendedSpecialist: z.string().optional(),
});

export const assessmentResultSchema = z.object({
  conditions: z.array(conditionLikelihoodSchema),
  prescribedPlan: prescribedPlanSchema.optional(),
  error: z.string().nullable().optional(),
});
