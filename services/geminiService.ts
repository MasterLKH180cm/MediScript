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
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType,
              },
            },
            {
              text: `Analyze this medical document image and extract ALL relevant medical information according to the provided JSON schema.

INSTRUCTIONS:
1. Extract patient demographics (name, age, gender, ID numbers, contact information)
2. Identify medical institution details (hospital/clinic name, department, provider information)
3. Document metadata (report type, date, document ID, urgency level)
4. Complete diagnosis information including:
   - Primary diagnosis with ICD codes if available
   - Secondary/differential diagnoses
   - Disease stage, grade, and classification
   - Metastasis sites and progression status
5. Medical history and timeline:
   - Past medical conditions and surgeries
   - Current medications with dosages and schedules
   - Allergies and adverse reactions
   - Family medical history if mentioned
6. Clinical findings:
   - Vital signs and measurements
   - Lab test results with reference ranges
   - Imaging findings and interpretations
   - Pathology reports
7. Treatment plans:
   - Prescribed medications (name, dose, frequency, duration, route)
   - Procedures and therapies recommended
   - Follow-up schedules
   - Monitoring requirements
8. Clinical notes and recommendations from healthcare providers
9. Restrictions, precautions, and contraindications
10. Prognosis and expected outcomes

REQUIREMENTS:
- Return ONLY valid JSON matching the schema
- Include all text exactly as written in the document
- Preserve medical terminology and abbreviations
- For dates, use ISO 8601 format (YYYY-MM-DD) when possible
- For measurements, include units
- Mark uncertain extractions with confidence indicators if schema allows
- If information is not present, use null or empty arrays as appropriate
- Maintain hierarchical relationships between diagnoses, medications, and treatments

IMPORTANT: Extract information in the original language of the document, but ensure field names follow the English schema.`,
            },
          ],
        },
      ],
      systemInstruction: EXTRACTION_SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const combinedText = collectResponseText(response);
    
    if (!combinedText) {
      throw new Error("模型未返回任何內容。請重試或檢查圖片。");
    }

    const jsonPayload = extractJsonPayload(combinedText);

    if (!jsonPayload) {
      console.error("Failed to extract JSON. Raw text:", combinedText);
      throw new Error("模型輸出格式不正確。請確保上傳的是清晰的醫療文件圖片。");
    }

    let parsedData: ExtractedMedicalData;
    try {
      parsedData = JSON.parse(jsonPayload);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Failed JSON string:", jsonPayload.substring(0, 500));
      throw new Error("資料解析失敗。模型返回的格式無效。");
    }

    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error("解析的資料格式不正確。");
    }
    
    return parsedData;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("API 金鑰無效或已過期。請檢查您的金鑰設定。");
      }
      if (error.message.includes("quota")) {
        throw new Error("API 配額已用完。請稍後再試或升級您的計劃。");
      }
      if (error.message.includes("JSON") || error.message.includes("解析")) {
        throw error;
      }
    }
    
    throw new Error("提取資訊失敗。請檢查網路連線並確保圖片清晰。");
  }
};

function collectResponseText(response: any): string {
  // Try multiple possible response structures
  let text = "";

  // Path 1: response.response.candidates[0].content.parts[].text
  const candidates = response?.response?.candidates;
  if (candidates && candidates.length > 0) {
    const parts = candidates[0]?.content?.parts;
    if (parts && parts.length > 0) {
      text = parts.map((part: any) => part.text || "").join("").trim();
    }
  }

  // Path 2: response.candidates[0].content.parts[].text
  if (!text) {
    const directCandidates = response?.candidates;
    if (directCandidates && directCandidates.length > 0) {
      const parts = directCandidates[0]?.content?.parts;
      if (parts && parts.length > 0) {
        text = parts.map((part: any) => part.text || "").join("").trim();
      }
    }
  }

  // Path 3: response.response.text() function
  if (!text && typeof response?.response?.text === "function") {
    try {
      text = response.response.text();
    } catch (e) {
      console.warn("Failed to call response.response.text():", e);
    }
  }

  // Path 4: response.text property
  if (!text && response?.text) {
    text = typeof response.text === "function" ? response.text() : response.text;
  }

  return text;
}

function extractJsonPayload(text: string): string | null {
  if (!text) return null;
  
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}