import { GoogleGenAI } from "@google/genai";
import { EXTRACTION_SYSTEM_INSTRUCTION, GEMINI_MODEL, RESPONSE_SCHEMA } from "../constants";
import { ExtractedMedicalData } from "../types";

/**
 * Extracts medical data from a base64 image using Gemini 2.5 Flash.
 */
export const extractMedicalData = async (base64Image: string, mimeType: string, apiKey?: string): Promise<ExtractedMedicalData> => {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!key) {
    throw new Error("缺少 API 金鑰。請提供有效的 API 金鑰或在 .env 檔案中設定 VITE_GEMINI_API_KEY。");
  }

  const ai = new GoogleGenAI({ apiKey: key });

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
            text: "根據架構從此圖片中提取醫療資訊。",
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
      throw new Error("模型未返回任何資料。");
    }

    const parsedData = JSON.parse(text) as ExtractedMedicalData;
    return parsedData;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("提取資訊失敗。請檢查您的 API 金鑰並確保圖片清晰。");
  }
};