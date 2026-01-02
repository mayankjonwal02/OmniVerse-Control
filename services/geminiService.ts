
import { GoogleGenAI, Type } from "@google/genai";

// We initialize inside the functions to avoid "process is not defined" 
// errors at the module level in browser environments.
const getAIClient = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please set it in your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function getCosmicInsight(objectName: string) {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a fascinating and scientifically accurate summary about ${objectName}. Include one mind-blowing fact that people might not know. Keep it under 100 words. Format as JSON with 'title', 'content', and 'fact'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            fact: { type: Type.STRING }
          },
          required: ["title", "content", "fact"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: objectName,
      content: "A beautiful celestial body in our vast universe.",
      fact: "It travels through space at incredible speeds!"
    };
  }
}

export async function getUniversalOverview() {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Tell me something profound about the scale of the universe in one sentence.",
    });
    return response.text;
  } catch (error) {
    return "The universe is infinitely larger than we can imagine.";
  }
}
