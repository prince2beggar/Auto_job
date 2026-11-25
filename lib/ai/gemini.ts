import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  fallbackGenerator: () => T
): Promise<T> {
  if (!genAI || !apiKey) {
    // Graceful deterministic fallback
    return fallbackGenerator();
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    return JSON.parse(text) as T;
  } catch (error) {
    console.warn('Gemini API call failed or timed out, using fallback generator:', error);
    return fallbackGenerator();
  }
}
