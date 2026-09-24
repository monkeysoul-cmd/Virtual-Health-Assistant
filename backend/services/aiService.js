/**
 * Google Gemini AI Service
 * Communicates with Google Generative AI API using native fetch.
 * Supports structured JSON responses, temperature control, and timeout management.
 */

const config = require('../config');

class AiService {
  constructor() {
    this.defaultApiKey = config.gemini.apiKey;
    this.defaultModel = config.gemini.model;
    this.baseUrl = config.gemini.baseUrl;
  }

  /**
   * Resolve which API key to use for a request
   * @param {string} [providedApiKey]
   * @returns {string}
   */
  resolveApiKey(providedApiKey) {
    if (providedApiKey && typeof providedApiKey === 'string' && providedApiKey.trim().length > 10) {
      return providedApiKey.trim();
    }
    return this.defaultApiKey;
  }

  /**
   * Generates content from Google Gemini
   * @param {object} options
   * @param {string} options.prompt - Prompt text
   * @param {string} [options.systemInstruction] - Optional system instruction
   * @param {boolean} [options.jsonMode=false] - Request JSON response
   * @param {string} [options.apiKey] - Override API key
   * @param {string} [options.model] - Override model name
   * @param {number} [options.temperature=0.2]
   * @param {number} [options.timeoutMs=15000]
   * @returns {Promise<string>}
   */
  async generateContent({
    prompt,
    systemInstruction,
    jsonMode = false,
    apiKey,
    model = this.defaultModel,
    temperature = 0.2,
    timeoutMs = 15000
  }) {
    const key = this.resolveApiKey(apiKey);
    if (!key) {
      throw new Error('MISSING_API_KEY: No Gemini API key provided or configured.');
    }

    const endpoint = `${this.baseUrl}/${model}:generateContent?key=${key}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: 4096,
        responseMimeType: jsonMode ? 'application/json' : 'text/plain'
      }
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          errorJson = { message: errorText };
        }
        const errorMsg = errorJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.warn(`[AI Service] Gemini API returned error: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];

      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw new Error('Gemini API returned an empty candidate list.');
      }

      const text = candidate.content.parts[0].text;
      return text;
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        throw new Error('Gemini API request timed out.');
      }
      throw err;
    }
  }

  /**
   * Generates and parses structured JSON from Gemini
   * @param {object} options
   * @returns {Promise<any>}
   */
  async generateJson(options) {
    const raw = await this.generateContent({ ...options, jsonMode: true });
    try {
      return JSON.parse(raw);
    } catch (parseErr) {
      // If direct parse fails, try extracting JSON substring
      const jsonMatch = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error(`Failed to parse AI JSON response: ${parseErr.message}`);
    }
  }
}

module.exports = new AiService();
