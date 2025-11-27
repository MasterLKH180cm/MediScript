import React, { useState } from 'react';
import { ExtractedMedicalData } from '../types';
import { Copy, Check, Bot, Sparkles } from 'lucide-react';

interface PromptGeneratorProps {
  extractedData: ExtractedMedicalData;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({ extractedData }) => {
  const [copied, setCopied] = useState(false);

  // Construct the prompt string
  const generatePromptText = () => {
    const parts = [
      `背景：我已從文件/報告中提取以下醫療資訊。`,
      `角色：請擔任一位經驗豐富的臨床醫療助理和患者權益倡導者。`,
      `任務：分析所提供的數據並生成全面的護理計劃。`,
      
      `\n--- 提取的醫療數據 ---`,
      extractedData.patientName ? `患者姓名：${extractedData.patientName}` : null,
      extractedData.age ? `年齡：${extractedData.age}` : null,
      extractedData.sex ? `性別：${extractedData.sex}` : null,
      extractedData.reportDate ? `報告日期：${extractedData.reportDate}` : null,
      extractedData.diagnosis ? `主要診斷：${extractedData.diagnosis}` : null,
      extractedData.prescription && extractedData.prescription.length > 0 ? `藥物：${extractedData.prescription.join('、')}` : null,
      extractedData.labResults && extractedData.labResults.length > 0 ? `檢驗結果/生命徵象：${extractedData.labResults.join('；')}` : null,
      extractedData.procedures && extractedData.procedures.length > 0 ? `醫療程序：${extractedData.procedures.join('、')}` : null,
      extractedData.medicalHistory && extractedData.medicalHistory.length > 0 ? `病史：${extractedData.medicalHistory.join('、')}` : null,
      extractedData.doctorNotes ? `醫生備註：${extractedData.doctorNotes}` : null,
      `------------------------------`,

      `\n回應要求：`,
      `請提供結構化的回應，包含以下部分：`,
      `1. ✅ 使用指南：詳細說明提及的藥物和治療方法的使用方式。`,
      `2. ⚠️ 限制與禁忌症：必須嚴格避免的事項（食物、活動、藥物交互作用）。`,
      `3. 🔔 重要安全提示：需要立即就醫的警示徵象。`,
      `4. 📋 照護者行動計劃：照護者的每日檢查清單，以確保患者安全和康復的逐步指南。`,
      `5. 🥗 生活方式與飲食建議：基於診斷的支持性措施。`
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
            <h2 className="text-lg font-bold text-white tracking-wide">AI 提示詞已就緒</h2>
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
                已複製！
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                複製到剪貼簿
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
          <p className="mb-1 text-slate-200 font-medium">下一步</p>
          <p>複製上方提示詞並貼到 ChatGPT、Claude 或 Gemini 中，以生成個人化的照護指南。</p>
        </div>
      </div>
    </div>
  );
};