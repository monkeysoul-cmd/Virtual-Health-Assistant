/**
 * Universal API Client
 * Provides resilient HTTP fetching with timeouts, standardized error wrapping,
 * and base URL detection across server and client runtimes.
 */

import { env } from '@/config/env';

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Executes an HTTP fetch request with timeout and error handling.
 * @param {string} endpoint - Relative or absolute endpoint (e.g., '/api/appointments')
 * @param {RequestInit & { timeoutMs?: number }} options
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const { timeoutMs = 8000, headers = {}, ...fetchOptions } = options;

  // Resolve URL
  const baseUrl = env.apiUrl.replace(/\/$/, '');
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage = (isJson && responseData?.error) || response.statusText || 'API request failed';
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError(`Request to ${endpoint} timed out after ${timeoutMs}ms`, 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network communication error', 500);
  }
}

export default apiClient;
