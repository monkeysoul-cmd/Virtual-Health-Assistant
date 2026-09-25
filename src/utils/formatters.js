/**
 * Clinical and User Interface Formatters
 */

import { format, isValid } from 'date-fns';

/**
 * Format date safely with date-fns format string
 * @param {Date|string|number} date
 * @param {string} formatPattern
 * @returns {string}
 */
export function formatDate(date, formatPattern = 'PPP') {
  if (!date) return '';
  const d = new Date(date);
  return isValid(d) ? format(d, formatPattern) : '';
}

/**
 * Format Indian phone number standard display
 * @param {string} phone
 * @returns {string}
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+91') && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
}

/**
 * Generate randomized clinical booking reference code
 * @param {string} prefix
 * @returns {string}
 */
export function generateReferenceCode(prefix = 'VHA') {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${random}`;
}
