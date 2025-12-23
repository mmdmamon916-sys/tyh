import { GoogleGenAI } from "@google/genai";

// We use gemini-2.5-flash-image for efficient image editing tasks
const MODEL_NAME = 'gemini-2.5-flash-image';

export const enhanceImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Clean base64 string if it contains the data URL prefix
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Act as a professional photo editor. ${prompt}. Return ONLY the image.`,
          },
        ],
      },
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const resultBase64 = part.inlineData.data;
          // Return as full Data URL
          return `data:image/png;base64,${resultBase64}`;
        }
      }
    }

    throw new Error("No image was returned by the model.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to enhance image");
  }
};