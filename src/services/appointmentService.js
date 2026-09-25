/**
 * Appointment Service (Frontend / Server Actions Bridge)
 * Decouples Next.js UI from direct backend filesystem imports.
 * Communicates via HTTP REST API with fallback to internal service when co-located.
 */

import { apiClient, ApiError } from './api/apiClient';
import { appointmentBookingSchema } from '@/schemas/appointmentSchema';

export const appointmentService = {
  /**
   * Book an appointment with a specialist
   * @param {Object} data
   * @returns {Promise<{ success: boolean, booking?: Object, error?: string }>}
   */
  async bookAppointment(data) {
    // 1. Schema Validation
    const validation = appointmentBookingSchema.safeParse(data);
    if (!validation.success) {
      const msg = validation.error.errors.map(e => e.message).join(', ');
      return { success: false, error: msg };
    }

    // 2. Try REST API call first
    try {
      const response = await apiClient('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(validation.data),
        timeoutMs: 4000,
      });

      if (response && response.success && response.appointment) {
        return { success: true, booking: response.appointment };
      }
    } catch (apiErr) {
      // If backend API isn't responding (e.g. Next.js standalone dev), use co-located backend service fallback
      try {
        if (typeof window === 'undefined') {
          // Dynamic require only executed on server-side
          const backendAppointmentService = require('../../backend/services/appointmentService');
          const booking = backendAppointmentService.bookAppointment(validation.data);
          return { success: true, booking };
        }
      } catch (fallbackErr) {
        return {
          success: false,
          error: fallbackErr.message || apiErr.message || 'Could not schedule appointment.',
        };
      }

      return {
        success: false,
        error: apiErr.message || 'Could not connect to appointment service.',
      };
    }

    return { success: false, error: 'Failed to schedule appointment.' };
  },

  /**
   * Fetch booked appointment by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getAppointmentById(id) {
    try {
      const response = await apiClient(`/api/appointments/${id}`);
      return response?.appointment || null;
    } catch {
      return null;
    }
  }
};

export default appointmentService;
