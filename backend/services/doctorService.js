/**
 * Doctor Directory & Specialist Search Service
 * Provides directory querying, multi-field weighted scoring, and AI doctor search.
 */

const { doctors } = require('../data/doctorData');
const aiService = require('./aiService');
const db = require('../config/db');

class DoctorService {
  /**
   * Retrieves all doctors with optional filters
   * @param {object} filters
   * @param {string} [filters.specialty]
   * @param {string} [filters.area]
   * @param {string} [filters.city]
   * @param {number} [filters.limit=50]
   * @param {number} [filters.offset=0]
   * @returns {Array<object>}
   */
  getAllDoctors({ specialty, area, city, limit = 50, offset = 0 } = {}) {
    let result = [...doctors];

    if (specialty) {
      const specLower = specialty.toLowerCase();
      result = result.filter(d => d.specialty.toLowerCase().includes(specLower));
    }

    if (area) {
      const areaLower = area.toLowerCase();
      result = result.filter(d => d.area.toLowerCase().includes(areaLower) || d.city?.toLowerCase().includes(areaLower));
    }

    if (city) {
      const cityLower = city.toLowerCase();
      result = result.filter(d => d.city?.toLowerCase().includes(cityLower));
    }

    return result.slice(offset, offset + limit);
  }

  /**
   * Retrieves a doctor by ID
   * @param {string} id
   * @returns {object|null}
   */
  getDoctorById(id) {
    const doc = doctors.find(d => String(d.id) === String(id));
    return doc || null;
  }

  /**
   * Local weighted keyword matching for doctors
   * @param {string} searchStr
   * @returns {Array<object>}
   */
  localFallbackDoctorSearch(searchStr) {
    const terms = (searchStr || '').toLowerCase().split(/[\s,]+/).filter(Boolean);
    if (terms.length === 0) {
      return doctors.slice(0, 6);
    }

    const scored = doctors.map(doctor => {
      let score = 0;
      const combined = `${doctor.name} ${doctor.specialty} ${doctor.area} ${doctor.city || ''} ${doctor.hospital || ''}`.toLowerCase();

      terms.forEach(term => {
        if (combined.includes(term)) {
          score += 1;
        }
        if (doctor.area.toLowerCase().includes(term)) {
          score += 3; // High weight for exact area match
        }
        if (doctor.specialty.toLowerCase().includes(term)) {
          score += 2.5; // High weight for specialty match
        }
        if (doctor.city && doctor.city.toLowerCase().includes(term)) {
          score += 2;
        }
      });

      return { doctor, score };
    });

    const matches = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.doctor);

    return (matches.length > 0 ? matches : doctors).slice(0, 6);
  }

  /**
   * Searches doctors in an area using AI with local fallback
   * @param {object} params
   * @param {string} params.area
   * @param {string} [params.specialty]
   * @param {string} [params.query]
   * @param {string} [params.apiKey]
   * @returns {Promise<{ doctors: Array<object>, source: string }>}
   */
  async searchDoctors({ area, specialty, query, apiKey }) {
    const searchTarget = area || query || specialty || '';
    if (!searchTarget.trim()) {
      return {
        doctors: doctors.slice(0, 6),
        source: 'directory-default'
      };
    }

    // Try AI generation for custom areas
    const prompt = `You are a certified healthcare directory navigator. Based on the searched area "${searchTarget}" and optional specialty "${specialty || 'General'}", generate 3 to 4 realistic Indian doctors practicing in or near this vicinity.
JSON Schema:
{
  "doctors": [
    {
      "name": "Full name with Dr. prefix (e.g. Dr. Rajesh Kumar)",
      "specialty": "Medical specialty (Cardiologist, Neurologist, General Practitioner, Pediatrician, Dermatologist, Orthopedist, Pulmonologist)",
      "area": "Specific area or landmark in ${searchTarget}",
      "contact": "+91 98765 XXXXX",
      "hospital": "Clinic or hospital name in that area",
      "experienceYears": 12,
      "rating": 4.8
    }
  ]
}
All doctor names must be realistic Indian names. Provide valid phone formatting.`;

    try {
      const response = await aiService.generateJson({
        prompt,
        apiKey,
        temperature: 0.3
      });

      if (response && Array.isArray(response.doctors) && response.doctors.length > 0) {
        const enrichedDoctors = response.doctors.map((d, index) => ({
          id: `ai_${Date.now()}_${index}`,
          name: d.name || `Dr. Specialist ${index + 1}`,
          specialty: d.specialty || specialty || 'General Practitioner',
          area: d.area || searchTarget,
          contact: d.contact || '+91 98765 00000',
          hospital: d.hospital || `${searchTarget} Medical Centre`,
          experienceYears: d.experienceYears || 10,
          rating: d.rating || 4.8,
          consultationFee: 700,
          availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'],
          isAiGenerated: true
        }));

        return {
          doctors: enrichedDoctors,
          source: 'gemini-ai'
        };
      }

      return {
        doctors: this.localFallbackDoctorSearch(searchTarget),
        source: 'local-directory-fallback'
      };
    } catch (err) {
      console.warn(`[DoctorService] AI doctor search fallback triggered: ${err.message}`);
      return {
        doctors: this.localFallbackDoctorSearch(searchTarget),
        source: 'local-directory-fallback'
      };
    }
  }

  /**
   * Retrieves unique specialties with doctor counts
   */
  getSpecialties() {
    const counts = {};
    doctors.forEach(d => {
      counts[d.specialty] = (counts[d.specialty] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      doctorCount: count
    }));
  }

  /**
   * Checks slot availability on a specific date against booked appointments
   * @param {string} doctorId
   * @param {string} dateStr (YYYY-MM-DD)
   * @returns {object}
   */
  getDoctorSlots(doctorId, dateStr) {
    const doctor = this.getDoctorById(doctorId);
    const allSlots = doctor ? doctor.availableSlots : [
      '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'
    ];

    // Check booked appointments in persistent DB
    const bookedAppointments = db.find('appointments', a => {
      const matchDoc = String(a.doctorId) === String(doctorId) || (doctor && a.doctorName === doctor.name);
      const matchDate = a.date && a.date.startsWith(dateStr);
      const isActive = a.status !== 'cancelled';
      return matchDoc && matchDate && isActive;
    });

    const bookedSlots = bookedAppointments.map(a => a.timeSlot);

    const slotDetails = allSlots.map(slot => ({
      time: slot,
      isAvailable: !bookedSlots.includes(slot)
    }));

    return {
      doctorId,
      date: dateStr,
      slots: slotDetails,
      totalSlots: allSlots.length,
      availableCount: slotDetails.filter(s => s.isAvailable).length
    };
  }
}

module.exports = new DoctorService();
