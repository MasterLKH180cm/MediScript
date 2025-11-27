export interface ExtractedMedicalData {
  patientName?: string;
  age?: string;
  sex?: string;
  diagnosis?: string;
  prescription?: string[];
  procedures?: string[];
  medicalHistory?: string[];
  labResults?: string[];
  doctorNotes?: string;
  reportDate?: string;
  rawTextSummary?: string;
}

export interface ExtractionResponse {
  data: ExtractedMedicalData;
  error?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}