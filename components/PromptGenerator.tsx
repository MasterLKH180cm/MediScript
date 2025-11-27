import React, { useState } from 'react';
import { ExtractedMedicalData } from '../types';
import { Copy, Check, Bot, Sparkles } from 'lucide-react';

interface PromptGeneratorProps {
  data: ExtractedMedicalData;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  // Construct the prompt string
  const generatePromptText = () => {
    const parts = [
      `CONTEXT: I have extracted the following medical information from a document/report.`,
      `ROLE: Act as a highly experienced clinical medical assistant and patient advocate.`,
      `TASK: Analyze the provided data and generate a comprehensive care plan.`,
      
      `\n--- EXTRACTED MEDICAL DATA ---`,
      data.patientName ? `Patient Name: ${data.patientName}` : null,
      data.age ? `Age: ${data.age}` : null,
      data.sex ? `Sex: ${data.sex}` : null,
      data.reportDate ? `Report Date: ${data.reportDate}` : null,
      data.diagnosis ? `Primary Diagnosis: ${data.diagnosis}` : null,
      data.prescription && data.prescription.length > 0 ? `Medications: ${data.prescription.join(', ')}` : null,
      data.labResults && data.labResults.length > 0 ? `Lab Results/Vitals: ${data.labResults.join('; ')}` : null,
      data.procedures && data.procedures.length > 0 ? `Procedures: ${data.procedures.join(', ')}` : null,
      data.medicalHistory && data.medicalHistory.length > 0 ? `Medical History: ${data.medicalHistory.join(', ')}` : null,
      data.doctorNotes ? `Doctor Notes: ${data.doctorNotes}` : null,
      `------------------------------`,

      `\nRESPONSE REQUIREMENTS:`,
      `Please provide a structured response with the following sections:`,
      `1. ✅ USAGE GUIDELINES: Detailed instructions for medications and treatments mentioned.`,
      `2. ⚠️ LIMITATIONS & CONTRAINDICATIONS: What to strictly avoid (foods, activities, drug interactions).`,
      `3. 🔔 IMPORTANT SAFETY NOTES: Warning signs to watch for that require immediate medical attention.`,
      `4. 📋 CAREGIVER'S ACTION PLAN: A step-by-step daily checklist for the caregiver to ensure patient safety and recovery.`,
      `5. 🥗 LIFESTYLE & DIETARY RECOMMENDATIONS: Supportive measures based on the diagnosis.`
    ];

    return parts.filter(Boolean).join('\n');
  };

  const promptText = generatePromptText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full mt-6 animate-fade-in-up">
      <div className="relative group rounded-xl overflow-hidden border border-medical-700 shadow-[0_0_30px_-5px_rgba(20,184,166,0.3)]">
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-900 to-slate-900 p-4 border-b border-medical-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-medical-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">AI Prompt Ready</h2>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 
              ${copied 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-medical-500 text-slate-950 hover:bg-medical-400 hover:shadow-lg hover:shadow-medical-500/20'
              }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-slate-950 relative">
          <textarea
            readOnly
            value={promptText}
            className="w-full h-80 p-6 bg-slate-950 text-slate-300 font-mono text-xs md:text-sm resize-none focus:outline-none scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent leading-relaxed"
          />
          
          {/* Visual gradient overlay at bottom to suggest scrolling if needed */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="flex items-start gap-3 mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
        <Bot className="w-5 h-5 text-medical-500 mt-0.5" />
        <div className="text-sm text-slate-400">
          <p className="mb-1 text-slate-200 font-medium">Next Step</p>
          <p>Copy the prompt above and paste it into ChatGPT, Claude, or Gemini to generate a personalized caregiver guide.</p>
        </div>
      </div>
    </div>
  );
};