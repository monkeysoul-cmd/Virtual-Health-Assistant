/**
 * Virtual Doctor Conversational Chat Service
 * Employs Dr. Amit Patel clinical AI persona for real-time patient interactions with offline fallback.
 */

const aiService = require('./aiService');

const SYSTEM_INSTRUCTION = `You are Dr. Amit Patel, an experienced, empathetic, and knowledgeable clinical doctor serving as the Virtual Health Assistant.
Your core goals:
1. Listen carefully to user health queries, symptoms, or medication questions.
2. Provide concise, clear, evidence-based guidance in a friendly, reassuring tone.
3. Suggest practical self-care steps, hydration, rest, and lifestyle adjustments.
4. Clearly highlight red-flag warning signs (e.g. chest pressure, severe shortness of breath, sudden numbness, uncontrolled bleeding) that require immediate emergency care.
5. Emphasize that while your guidance is informed by clinical practice, users should consult a local specialist or visit a clinic for formal diagnostic confirmation.
Keep responses concise (1 to 3 short paragraphs). Avoid overwhelming medical jargon.`;

class ChatService {
  /**
   * Rule-based conversational fallback when AI is unavailable
   * @param {string} message
   * @returns {string}
   */
  localFallbackChat(message) {
    const lower = message.toLowerCase();

    if (lower.includes('chest pain') || lower.includes('heart') || lower.includes('breath') || lower.includes('emergency')) {
      return "⚠️ **Important Clinical Notice**: Symptoms like chest pain or breathing difficulty can indicate an acute cardiovascular or respiratory emergency. Please proceed immediately to your nearest emergency room or dial emergency services (112 or 102 in India). Do not drive yourself if you feel dizzy or faint.";
    }

    if (lower.includes('fever') || lower.includes('temperature') || lower.includes('shivering')) {
      return "Hello! For fever management, ensure you get plenty of bed rest and maintain generous hydration with water, oral rehydration solutions, and warm broths. You may consider over-the-counter paracetamol following package dosage instructions if appropriate. If your temperature exceeds 102°F (38.9°C) or persists beyond 3 days, please schedule a consultation with one of our General Practitioners.";
    }

    if (lower.includes('headache') || lower.includes('migraine')) {
      return "Headaches can stem from tension, dehydration, screen fatigue, or migraines. I suggest resting in a dimly lit, quiet room, staying hydrated, and applying a cool compress to your forehead. If you experience sudden onset 'thunderclap' pain, neck stiffness, or vision loss, seek urgent medical evaluation.";
    }

    if (lower.includes('stomach') || lower.includes('acidity') || lower.includes('nausea') || lower.includes('vomit')) {
      return "For gastrointestinal discomfort, it is best to switch to a gentle bland diet (such as bananas, rice, applesauce, and toast). Avoid spicy, oily, or acidic foods and caffeinated beverages. Sip fluids slowly. If you experience severe abdominal cramps or inability to retain fluids, consult a physician promptly.";
    }

    if (lower.includes('appointment') || lower.includes('book') || lower.includes('doctor')) {
      return "You can easily schedule a consultation with our verified specialists using the Doctor Directory on this platform. Simply browse by specialty or area, pick your doctor, and select an available date and time slot to confirm your booking!";
    }

    return "Hello, I am Dr. Amit Patel, your Virtual Health Assistant. I am here to help you navigate symptoms, understand test suggestions, and recommend healthy lifestyle practices. How are you feeling today, and what specific symptoms would you like to discuss?";
  }

  /**
   * Processes a chat query with the virtual doctor
   * @param {object} params
   * @param {string} params.message
   * @param {Array<object>} [params.history]
   * @param {string} [params.apiKey]
   * @returns {Promise<{ reply: string, source: string }>}
   */
  async processDoctorChat({ message, history = [], apiKey }) {
    // Format conversation history into prompt
    let formattedPrompt = '';
    if (history.length > 0) {
      formattedPrompt += 'Conversation History:\n';
      history.slice(-6).forEach(item => {
        const roleName = item.role === 'user' ? 'User' : 'Dr. Patel';
        formattedPrompt += `${roleName}: ${item.content}\n`;
      });
      formattedPrompt += '\n';
    }

    formattedPrompt += `User: ${message}\nDr. Patel:`;

    try {
      const reply = await aiService.generateContent({
        prompt: formattedPrompt,
        systemInstruction: SYSTEM_INSTRUCTION,
        apiKey,
        temperature: 0.4
      });

      return {
        reply: reply.trim(),
        source: 'gemini-ai'
      };
    } catch (err) {
      console.warn(`[ChatService] AI chat fallback triggered: ${err.message}`);
      return {
        reply: this.localFallbackChat(message),
        source: 'clinical-rules-fallback'
      };
    }
  }
}

module.exports = new ChatService();
