import { z } from 'zod';

export const doctorSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(2),
  specialty: z.string(),
  area: z.string(),
  contact: z.string(),
  rating: z.number().min(1).max(5).optional(),
});

export const doctorListSchema = z.object({
  doctors: z.array(doctorSchema),
});

export const doctorSearchQuerySchema = z.object({
  area: z.string().min(2, { message: 'Area or search query must be at least 2 characters.' }),
  specialty: z.string().optional(),
});
