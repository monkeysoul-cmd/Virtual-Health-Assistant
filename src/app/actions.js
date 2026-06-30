'use server';
import { symptomCheckerAssessment } from '@/ai/flows/symptom-checker-assessment';
import { z } from 'zod';
const symptomSchema = z
    .string()
    .min(3, { message: 'Please describe your symptoms in more detail.' });
export async function getHealthAssessment(prevState, formData) {
    const symptoms = formData.get('symptoms');
    const apiKey = formData.get('apiKey');
    const validatedSymptoms = symptomSchema.safeParse(symptoms);
    if (!validatedSymptoms.success) {
        return {
            error: validatedSymptoms.error.errors[0].message,
        };
    }
    try {
        const assessment = await symptomCheckerAssessment({
            symptoms: validatedSymptoms.data,
        }, apiKey);
        return { potentialConditions: assessment.conditions };
    }
    catch (e) {
        console.error(e);
        return {
            error: 'An unexpected error occurred. Please try again.',
        };
    }
}

import { getGenkitInstance } from '@/ai/genkit.js';

const doctorSchema = z.object({
    name: z.string(),
    specialty: z.string(),
    area: z.string(),
    contact: z.string(),
});

const doctorListSchema = z.object({
    doctors: z.array(doctorSchema),
});

export async function getDoctorsInArea(area, apiKey) {
    if (!area || area.trim().length < 3) {
        return { error: 'Please enter a search query with at least 3 characters.' };
    }
    try {
        const ai = getGenkitInstance(apiKey);
        const response = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            output: { schema: doctorListSchema },
            prompt: `You are a medical directory finder. Based on the searched area "${area}", generate a list of 3 to 4 realistic Indian doctors (make sure they have Indian names) who practice in or near this area.
            For each doctor, provide:
            - name: Full name starting with "Dr. " (e.g. Dr. Rajesh Kumar)
            - specialty: Specialty name (e.g. Cardiologist, Neurologist, General Practitioner, Pediatrician, Dermatologist, Orthopedist)
            - area: The specific area searched or adjacent neighborhood
            - contact: A realistic Indian mobile number starting with +91 (e.g. +91 98765 43210)
            
            Return the result matching the schema.
            `
        });
        if (response && response.output && response.output.doctors) {
            return { doctors: response.output.doctors };
        }
        return { doctors: [] };
    }
    catch (e) {
        console.error("AI Doctor Search error:", e);
        return { error: 'An unexpected error occurred during AI search. Please try again.' };
    }
}

