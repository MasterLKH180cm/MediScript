import { GoogleGenAI } from "@google/genai";
import { EXTRACTION_SYSTEM_INSTRUCTION, GEMINI_MODEL, RESPONSE_SCHEMA } from "../constants";
import { ExtractedMedicalData } from "../types";

/**
 * Extracts medical data from a base64 image using Gemini 2.5 Flash.
 */
export const extractMedicalData = async (base64Image: string, mimeType: string, apiKey: string): Promise<ExtractedMedicalData> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid API Key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Extract the medical information from this image according to the schema.",
          },
        ],
      },
      config: {
        systemInstruction: EXTRACTION_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.1, // Low temperature for high extraction accuracy
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from the model.");
    }

    const parsedData = JSON.parse(text) as ExtractedMedicalData;
    return parsedData;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to extract information. Please check your API Key and ensure the image is clear.");
  }
};