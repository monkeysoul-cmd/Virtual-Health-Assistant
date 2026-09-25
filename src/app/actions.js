'use server';

import { symptomCheckerAssessment } from '@/ai/flows/symptom-checker-assessment';
import { getGenkitInstance } from '@/ai/genkit.js';
import { appointmentService } from '@/services/appointmentService';
import { doctorService } from '@/services/doctorService';
import { symptomInputSchema } from '@/schemas/symptomSchema';
import { doctorListSchema } from '@/schemas/doctorSchema';

/**
 * Server Action: Evaluate clinical symptoms and produce diagnoses and care plan
 */
export async function getHealthAssessment(prevState, formData) {
  const symptoms = formData instanceof FormData ? formData.get('symptoms') : formData?.symptoms;
  const apiKey = formData instanceof FormData ? formData.get('apiKey') : formData?.apiKey;

  const validatedSymptoms = symptomInputSchema.safeParse(symptoms);
  if (!validatedSymptoms.success) {
    return {
      error: validatedSymptoms.error.errors[0]?.message || 'Please describe your symptoms in more detail.',
    };
  }

  try {
    const assessment = await symptomCheckerAssessment(
      { symptoms: validatedSymptoms.data },
      apiKey
    );
    return { potentialConditions: assessment.conditions };
  } catch (e) {
    console.error('Symptom assessment action error:', e);
    return {
      error: 'An unexpected error occurred during symptom assessment. Please try again.',
    };
  }
}

/**
 * Server Action: Search local doctors in a specific geographic area using AI with local database fallback
 */
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
      `,
    });

    if (response?.output?.doctors && Array.isArray(response.output.doctors) && response.output.doctors.length > 0) {
      return { doctors: response.output.doctors };
    }
    return { doctors: doctorService.matchDoctorsLocal(area) };
  } catch (e) {
    console.error('AI Doctor Search error (falling back to directory matching):', e);
    return { doctors: doctorService.matchDoctorsLocal(area) };
  }
}

/**
 * Server Action: Book a specialist appointment via appointmentService
 */
export async function bookAppointmentAction(data) {
  try {
    return await appointmentService.bookAppointment(data);
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Could not schedule appointment.',
    };
  }
}
