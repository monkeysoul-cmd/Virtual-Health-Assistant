/**
 * Doctor Service
 * Provides directory lookup, area filtering, and slot availability.
 */

import { doctors } from '@/data/doctors';

export const doctorService = {
  /**
   * Return all verified doctors
   */
  getAllDoctors() {
    return doctors;
  },

  /**
   * Score and match doctors based on search keywords (area, specialty, name)
   * @param {string} area
   * @returns {Array<Object>}
   */
  matchDoctorsLocal(area) {
    if (!area || typeof area !== 'string') {
      return doctors.slice(0, 4).map(({ id, name, specialty, area, contact }) => ({ id, name, specialty, area, contact }));
    }

    const searchTerms = area.toLowerCase().split(/[\s,]+/).filter(Boolean);
    if (searchTerms.length === 0) {
      return doctors.slice(0, 4).map(({ id, name, specialty, area, contact }) => ({ id, name, specialty, area, contact }));
    }

    const scoredDoctors = doctors.map(doctor => {
      let score = 0;
      const doctorText = `${doctor.name} ${doctor.specialty} ${doctor.area}`.toLowerCase();

      searchTerms.forEach(term => {
        if (doctorText.includes(term)) {
          score += 1;
          if (doctor.area.toLowerCase().includes(term)) score += 2;
          if (doctor.specialty.toLowerCase().includes(term)) score += 1.5;
        }
      });

      return { doctor, score };
    });

    const matches = scoredDoctors
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.doctor);

    const results = matches.length > 0 ? matches : doctors;
    return results.slice(0, 4).map(({ id, name, specialty, area, contact }) => ({ id, name, specialty, area, contact }));
  }
};

export default doctorService;
