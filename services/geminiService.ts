
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function getIslandFunFact(islandName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Πες μου ένα πολύ σύντομο και ενδιαφέρον "fun fact" για το ελληνικό νησί ${islandName}. Η απάντηση πρέπει να είναι σε μία μόνο πρόταση στα Ελληνικά και να είναι ευχάριστη.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 100,
      },
    });
    
    return response.text || "Ένα πανέμορφο ελληνικό νησί που σε περιμένει να το ανακαλύψεις!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ένα από τα ομορφότερα μέρη της Ελλάδας με μοναδική ιστορία.";
  }
}
