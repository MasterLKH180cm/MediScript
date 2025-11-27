import { Type } from "@google/genai";

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const EXTRACTION_SYSTEM_INSTRUCTION = `
You are an advanced medical optical character recognition (OCR) and analysis AI. 
Your task is to analyze medical documents (images) and extract specific structured information.
Be precise. If a field is not clearly visible or applicable, leave it null or empty.
Focus on extracting:
1. Patient Info (Name, Age, Sex). Anonymize name if needed, but extract specific age and sex if visible.
2. Diagnosis/Conditions.
3. Prescriptions (Medications, Dosages, Frequencies).
4. Procedures or Operations.
5. Medical History or relevant Medical Report details.
6. Lab Results, Vital Signs, or Test Values.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    patientName: { type: Type.STRING, description: "Name of the patient found in the document" },
    age: { type: Type.STRING, description: "Age of the patient (e.g. '34 years', '2 months')" },
    sex: { type: Type.STRING, description: "Biological sex or gender of the patient (e.g. 'Male', 'Female')" },
    diagnosis: { type: Type.STRING, description: "Primary diagnosis or medical condition identified" },
    prescription: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of medications, including dosage and frequency" 
    },
    procedures: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of medical procedures or operations mentioned" 
    },
    medicalHistory: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Relevant past medical history or background" 
    },
    labResults: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of laboratory results, vital signs, or test findings found in the report"
    },
    doctorNotes: { type: Type.STRING, description: "Any specific notes, advice, or remarks from the doctor" },
    reportDate: { type: Type.STRING, description: "Date of the report or prescription" },
    rawTextSummary: { type: Type.STRING, description: "A brief summary of the document content" }
  }
};