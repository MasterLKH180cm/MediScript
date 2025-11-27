import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { ExtractedDataCard } from '../components/ExtractedDataCard';
import { PromptGenerator } from '../components/PromptGenerator';
import { extractMedicalData } from '../services/geminiService';
import { AppStatus, ExtractedMedicalData } from '../types';
import { Stethoscope, Loader2, AlertCircle, RefreshCw, Key } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [extractedData, setExtractedData] = useState<ExtractedMedicalData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_GEMINI_API_KEY || '');

  const handleFileSelect = async (base64: string, mimeType: string) => {
    const keyToUse = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!keyToUse) {
      setErrorMsg("請輸入您的 Google Gemini API 金鑰以繼續。");
      setStatus(AppStatus.ERROR);
      return;
    }

    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);
    setExtractedData(null);

    try {
      const data = await extractMedicalData(base64, mimeType, keyToUse);
      setExtractedData(data);
      setStatus(AppStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "分析過程中發生意外錯誤。");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setExtractedData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 font-sans selection:bg-medical-500/30 selection:text-medical-200">
      
      {/* Header */}
      <header className="mb-10 text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-medical-600 to-medical-400 shadow-[0_0_40px_-10px_rgba(45,212,191,0.5)]">
          <Stethoscope className="w-8 h-8 text-slate-950" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-50 tracking-tight">
          MediScript <span className="text-medical-400">AI</span>
        </h1>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          即時將醫療文件轉換為可執行的 AI 提示詞，用於護理指南和限制說明。
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl flex flex-col items-center gap-8">
        
        {/* Step 1: Configuration & Upload (Visible when IDLE or ERROR) */}
        {(status === AppStatus.IDLE || status === AppStatus.ERROR) && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            
            {/* API Key Input */}
            {/* <div className="w-full max-w-xl">
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">
                Google Gemini API 金鑰 {import.meta.env.VITE_GEMINI_API_KEY && <span className="text-medical-400">(已從 .env 載入)</span>}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-500 group-focus-within:text-medical-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={import.meta.env.VITE_GEMINI_API_KEY ? "使用 .env 檔案中的金鑰" : "在此貼上您的 API 金鑰（以 AIzaSy... 開頭）"}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500 text-slate-200 placeholder-slate-600 text-sm transition-all shadow-sm"
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-500 px-1">
                您的金鑰僅用於本次會話處理資料，絕不會儲存在我們的伺服器上。
              </p>
            </div> */}

            {/* File Upload */}
            <div className={`w-full transition-opacity duration-300 ${!apiKey ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
               <FileUpload onFileSelect={handleFileSelect} disabled={!apiKey} />
            </div>
          </div>
        )}

        {/* Step 2: Processing & Results (Visible when PROCESSING or COMPLETE) */}
        {(status === AppStatus.PROCESSING || status === AppStatus.COMPLETE) && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            {/* Status Message */}
            <div className="w-full max-w-xl text-center">
              {status === AppStatus.PROCESSING && (
                <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-medical-500" />
                  正在處理您的檔案，請稍候...
                </p>
              )}
              {status === AppStatus.COMPLETE && (
                <p className="text-sm text-slate-400">
                  檔案處理成功！請檢視下方提取的資料和 AI 生成的提示詞。
                </p>
              )}
            </div>

            {/* Extracted Data & Prompts Display */}
            <div className="w-full max-w-3xl bg-slate-800 rounded-lg p-6 shadow-md space-y-4">
              
              {/* Extracted Data Card */}
              {extractedData && (
                <ExtractedDataCard data={extractedData} />
              )}

              {/* AI Prompts Section (Visible when COMPLETE) */}
              {status === AppStatus.COMPLETE && extractedData && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-slate-50 mb-2">
                    AI 生成的提示詞
                  </h2>
                  <PromptGenerator extractedData={extractedData} />
                </div>
              )}
            </div>

            {/* Retry & Reset Button */}
            <div className="w-full max-w-xl flex flex-col md:flex-row items-center gap-4">
              
              {/* Retry Button (Visible when ERROR) */}
              {status === AppStatus.ERROR && (
                <button
                  onClick={() => handleFileSelect(extractedData!.fileB64, extractedData!.mimeType)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-medical-500 hover:bg-medical-600 transition-all text-slate-50 font-semibold shadow-md"
                >
                  <RefreshCw className="w-5 h-5" />
                  重試分析
                </button>
              )}

              {/* Reset Button (Visible when COMPLETE) */}
              {status === AppStatus.COMPLETE && (
                <button
                  onClick={handleReset}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all text-slate-50 font-semibold shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h1m4 4h-1v-4h1m-9 8h10a2 2 0 002-2v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  開始新分析
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error Message Display */}
        {status === AppStatus.ERROR && errorMsg && (
          <div className="w-full max-w-xl text-center">
            <p className="text-sm text-red-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {errorMsg}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-xs text-slate-500">
        <p>
          &copy; 2023 MediScript AI. 版權所有。
        </p>
        <p>
          由 MediScript 團隊用 ❤️ 製作。
        </p>
      </footer>
    </div>
  );
}