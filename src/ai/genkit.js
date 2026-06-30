import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

export function getGenkitInstance(apiKey) {
  return genkit({
    plugins: [googleAI(apiKey ? { apiKey } : {})],
    model: 'googleai/gemini-2.5-flash',
  });
}
