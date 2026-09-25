import { z } from 'zod';

export const appointmentBookingSchema = z.object({
  doctorId: z.union([z.string(), z.number()]),
  doctorName: z.string().min(2, { message: 'Doctor name is required.' }),
  doctorSpecialty: z.string().optional().default('General Physician'),
  patientName: z.string().min(2, { message: 'Patient name must be at least 2 characters.' }),
  patientPhone: z.string().min(8, { message: 'Valid phone number is required.' }),
  patientEmail: z.string().email().optional().or(z.literal('')),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be formatted as YYYY-MM-DD.' }),
  timeSlot: z.string().min(1, { message: 'Time slot selection is required.' }),
  notes: z.string().max(500).optional(),
});

export const appointmentResponseSchema = z.object({
  id: z.string(),
  doctorId: z.union([z.string(), z.number()]),
  doctorName: z.string(),
  doctorSpecialty: z.string(),
  patientName: z.string(),
  patientPhone: z.string(),
  date: z.string(),
  timeSlot: z.string(),
  status: z.enum(['confirmed', 'cancelled', 'completed', 'rescheduled']).default('confirmed'),
  createdAt: z.string(),
  updatedAt: z.string(),
});
