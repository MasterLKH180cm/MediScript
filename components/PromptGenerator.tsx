import React, { useState } from 'react';
import { ExtractedMedicalData } from '../types';
import { Copy, Check, Bot, Sparkles } from 'lucide-react';

interface PromptGeneratorProps {
  extractedData: ExtractedMedicalData;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({ extractedData }) => {
  const [copied, setCopied] = useState(false);

  // Construct the prompt string with comprehensive details
  const generatePromptText = () => {
    const sections: string[] = [];

    // Header
    sections.push(`🏥 醫療文件分析與照護指導請求`);
    sections.push(`${'='.repeat(60)}\n`);

    // Role Definition
    sections.push(`📋 角色設定：`);
    sections.push(`您是一位經驗豐富的臨床醫療專家，具備以下專長：`);
    sections.push(`• 多學科醫療知識整合`);
    sections.push(`• 患者安全與照護品質管理`);
    sections.push(`• 醫療風險評估與預防`);
    sections.push(`• 個人化照護計劃設計`);
    sections.push(`• 患者與照護者教育\n`);

    // Task Definition
    sections.push(`🎯 任務目標：`);
    sections.push(`基於以下提取的醫療資訊，生成全面的照護指導方案，確保患者安全、提升照護品質，並賦能照護者執行有效的居家照護。\n`);

    // Extracted Medical Data
    sections.push(`📊 提取的醫療資訊：`);
    sections.push(`${'─'.repeat(60)}`);

    // Patient Demographics
    if (extractedData.patientName || extractedData.age || extractedData.sex) {
      sections.push(`\n👤 患者基本資料：`);
      if (extractedData.patientName) sections.push(`  • 姓名：${extractedData.patientName}`);
      if (extractedData.age) sections.push(`  • 年齡：${extractedData.age}`);
      if (extractedData.sex) sections.push(`  • 性別：${extractedData.sex}`);
      if (extractedData.patientId) sections.push(`  • 病歷號：${extractedData.patientId}`);
    }

    // Document Information
    if (extractedData.reportDate || extractedData.reportType || extractedData.institution) {
      sections.push(`\n📄 文件資訊：`);
      if (extractedData.reportType) sections.push(`  • 報告類型：${extractedData.reportType}`);
      if (extractedData.reportDate) sections.push(`  • 報告日期：${extractedData.reportDate}`);
      if (extractedData.institution) sections.push(`  • 醫療機構：${extractedData.institution}`);
      if (extractedData.department) sections.push(`  • 科別：${extractedData.department}`);
      if (extractedData.doctorName) sections.push(`  • 主治醫師：${extractedData.doctorName}`);
    }

    // Primary Diagnosis
    if (extractedData.diagnosis) {
      sections.push(`\n🔍 主要診斷：`);
      sections.push(`  ${extractedData.diagnosis}`);
      if (extractedData.icdCode) sections.push(`  • ICD代碼：${extractedData.icdCode}`);
      if (extractedData.diseaseStage) sections.push(`  • 疾病分期：${extractedData.diseaseStage}`);
      if (extractedData.severity) sections.push(`  • 嚴重程度：${extractedData.severity}`);
    }

    // Secondary Diagnoses
    if (extractedData.secondaryDiagnoses && extractedData.secondaryDiagnoses.length > 0) {
      sections.push(`\n📌 次要診斷/併發症：`);
      extractedData.secondaryDiagnoses.forEach((dx, i) => {
        sections.push(`  ${i + 1}. ${dx}`);
      });
    }

    // Medications
    if (extractedData.prescription && extractedData.prescription.length > 0) {
      sections.push(`\n💊 處方藥物：`);
      extractedData.prescription.forEach((med, i) => {
        sections.push(`  ${i + 1}. ${med}`);
      });
    }

    if (extractedData.medications && extractedData.medications.length > 0) {
      sections.push(`\n💊 用藥詳情：`);
      extractedData.medications.forEach((med: any, i: number) => {
        sections.push(`  ${i + 1}. ${typeof med === 'string' ? med : JSON.stringify(med)}`);
      });
    }

    // Lab Results & Vital Signs
    if (extractedData.labResults && extractedData.labResults.length > 0) {
      sections.push(`\n🧪 檢驗結果與生命徵象：`);
      extractedData.labResults.forEach((result, i) => {
        sections.push(`  • ${result}`);
      });
    }

    if (extractedData.vitalSigns) {
      sections.push(`\n💓 生命徵象：`);
      if (typeof extractedData.vitalSigns === 'object') {
        Object.entries(extractedData.vitalSigns).forEach(([key, value]) => {
          sections.push(`  • ${key}: ${value}`);
        });
      } else {
        sections.push(`  ${extractedData.vitalSigns}`);
      }
    }

    // Medical Procedures
    if (extractedData.procedures && extractedData.procedures.length > 0) {
      sections.push(`\n🏥 醫療處置/手術：`);
      extractedData.procedures.forEach((proc, i) => {
        sections.push(`  ${i + 1}. ${proc}`);
      });
    }

    // Medical History
    if (extractedData.medicalHistory && extractedData.medicalHistory.length > 0) {
      sections.push(`\n📋 病史記錄：`);
      extractedData.medicalHistory.forEach((history, i) => {
        sections.push(`  • ${history}`);
      });
    }

    // Allergies
    if (extractedData.allergies && extractedData.allergies.length > 0) {
      sections.push(`\n⚠️ 過敏史：`);
      extractedData.allergies.forEach((allergy, i) => {
        sections.push(`  • ${allergy}`);
      });
    }

    // Treatment Plan
    if (extractedData.treatmentPlan) {
      sections.push(`\n📝 治療計劃：`);
      sections.push(`  ${extractedData.treatmentPlan}`);
    }

    // Follow-up
    if (extractedData.followUp) {
      sections.push(`\n📅 追蹤安排：`);
      sections.push(`  ${extractedData.followUp}`);
    }

    // Doctor's Notes
    if (extractedData.doctorNotes) {
      sections.push(`\n👨‍⚕️ 醫師備註：`);
      sections.push(`  ${extractedData.doctorNotes}`);
    }

    // Clinical Notes
    if (extractedData.clinicalNotes) {
      sections.push(`\n📝 臨床記錄：`);
      sections.push(`  ${extractedData.clinicalNotes}`);
    }

    // Restrictions & Precautions
    if (extractedData.restrictions && extractedData.restrictions.length > 0) {
      sections.push(`\n🚫 限制事項：`);
      extractedData.restrictions.forEach((restriction, i) => {
        sections.push(`  • ${restriction}`);
      });
    }

    sections.push(`\n${'─'.repeat(60)}\n`);

    // Detailed Response Requirements
    sections.push(`📋 回應要求（請以結構化格式提供）：\n`);

    sections.push(`1️⃣ **執行摘要 (Executive Summary)**`);
    sections.push(`   • 疾病概述：用淺顯易懂的語言解釋診斷`);
    sections.push(`   • 當前狀態：評估患者目前的健康狀態與風險等級`);
    sections.push(`   • 關鍵重點：最重要的3-5個照護要點\n`);

    sections.push(`2️⃣ **藥物使用指南 (Medication Guide)**`);
    sections.push(`   針對每種藥物提供：`);
    sections.push(`   • 藥物名稱與用途`);
    sections.push(`   • 正確使用方法（劑量、時間、服用方式）`);
    sections.push(`   • 可能的副作用與處理方式`);
    sections.push(`   • 藥物交互作用警示`);
    sections.push(`   • 遺漏劑量的處理原則`);
    sections.push(`   • 儲存方式與注意事項\n`);

    sections.push(`3️⃣ **嚴格限制與禁忌 (Critical Restrictions & Contraindications)**`);
    sections.push(`   • 🚫 絕對禁止事項（可能危及生命）`);
    sections.push(`   • ⚠️ 需要謹慎的活動與行為`);
    sections.push(`   • 🍽️ 飲食限制與禁忌（具體食物清單）`);
    sections.push(`   • 💊 藥物交互作用（需避免的藥物/補充品）`);
    sections.push(`   • 🏃 活動限制（運動、工作、日常活動）\n`);

    sections.push(`4️⃣ **緊急警示徵象 (Emergency Warning Signs)**`);
    sections.push(`   列出需要立即就醫的症狀，包括：`);
    sections.push(`   • 🚨 立即撥打119的緊急狀況`);
    sections.push(`   • ⚠️ 24小時內需就醫的警示徵象`);
    sections.push(`   • 📞 需聯繫主治醫師的症狀變化`);
    sections.push(`   • 具體的觀察指標與數值範圍\n`);

    sections.push(`5️⃣ **照護者行動計劃 (Caregiver Action Plan)**`);
    sections.push(`   **每日照護檢查清單：**`);
    sections.push(`   □ 晨間檢查（生命徵象、症狀評估、情緒狀態）`);
    sections.push(`   □ 用藥管理（時間表、服藥確認、副作用監測）`);
    sections.push(`   □ 營養管理（餐食計劃、水分攝取、飲食記錄）`);
    sections.push(`   □ 活動管理（運動計劃、休息時間、活動限制）`);
    sections.push(`   □ 衛生照護（個人衛生、傷口護理、感染預防）`);
    sections.push(`   □ 環境安全（居家環境檢查、跌倒預防）`);
    sections.push(`   □ 晚間檢查（整日回顧、記錄更新、明日準備）`);
    sections.push(`   **每週照護任務：**`);
    sections.push(`   • 健康記錄整理與分析`);
    sections.push(`   • 藥物庫存檢查與補充`);
    sections.push(`   • 醫療用品準備`);
    sections.push(`   • 回診預約確認\n`);

    sections.push(`6️⃣ **症狀監測與記錄指南 (Symptom Monitoring Guide)**`);
    sections.push(`   • 需要追蹤的關鍵症狀與指標`);
    sections.push(`   • 測量頻率與時間點`);
    sections.push(`   • 正常範圍與異常標準`);
    sections.push(`   • 記錄格式與工具建議`);
    sections.push(`   • 數據解讀與回報原則\n`);

    sections.push(`7️⃣ **生活方式與飲食建議 (Lifestyle & Dietary Recommendations)**`);
    sections.push(`   • 🥗 推薦食物清單（具體食材與烹調方式）`);
    sections.push(`   • 🚫 應避免的食物與成分`);
    sections.push(`   • 💧 每日水分攝取建議`);
    sections.push(`   • 🏃 適合的運動類型與強度`);
    sections.push(`   • 😴 睡眠管理建議`);
    sections.push(`   • 🧘 壓力管理與心理健康支持\n`);

    sections.push(`8️⃣ **復原時程與預期目標 (Recovery Timeline & Expected Outcomes)**`);
    sections.push(`   • 短期目標（1-2週）`);
    sections.push(`   • 中期目標（1-3個月）`);
    sections.push(`   • 長期目標（3-12個月）`);
    sections.push(`   • 進步指標與里程碑`);
    sections.push(`   • 可能的併發症與預防措施\n`);

    sections.push(`9️⃣ **醫療資源與支持系統 (Medical Resources & Support System)**`);
    sections.push(`   • 後續追蹤安排與準備事項`);
    sections.push(`   • 需要的醫療設備與取得方式`);
    sections.push(`   • 居家照護服務資源`);
    sections.push(`   • 支持團體與病友組織`);
    sections.push(`   • 線上教育資源與可信資訊來源\n`);

    sections.push(`🔟 **問答與常見疑慮 (FAQ & Common Concerns)**`);
    sections.push(`   • 預期的常見問題與解答`);
    sections.push(`   • 照護者可能遇到的挑戰與因應策略`);
    sections.push(`   • 特殊情況處理指引\n`);

    sections.push(`${'='.repeat(60)}\n`);

    sections.push(`⚠️ **重要提醒：**`);
    sections.push(`• 本指導僅供參考，不能取代專業醫療建議`);
    sections.push(`• 任何治療變更都應先諮詢主治醫師`);
    sections.push(`• 遇到緊急狀況請立即就醫`);
    sections.push(`• 定期回診追蹤是確保治療效果的關鍵\n`);

    sections.push(`🎯 **輸出格式要求：**`);
    sections.push(`• 使用繁體中文`);
    sections.push(`• 結構清晰，分層明確`);
    sections.push(`• 使用表情符號增強可讀性`);
    sections.push(`• 專業術語需附帶淺顯解釋`);
    sections.push(`• 提供具體可執行的建議`);
    sections.push(`• 考慮台灣醫療環境與文化背景`);

    return sections.join('\n');
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