import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ExtractedDataCard } from './components/ExtractedDataCard';
import { PromptGenerator } from './components/PromptGenerator';
import { extractMedicalData } from './services/geminiService';
import { AppStatus, ExtractedMedicalData } from './types';
import { Stethoscope, Loader2, AlertCircle, RefreshCw, Key } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [extractedData, setExtractedData] = useState<ExtractedMedicalData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  const handleFileSelect = async (base64: string, mimeType: string) => {
    if (!apiKey.trim()) {
      setErrorMsg("Please enter your Google Gemini API Key to proceed.");
      setStatus(AppStatus.ERROR);
      return;
    }

    setStatus(AppStatus.PROCESSING);
    setErrorMsg(null);
    setExtractedData(null);

    try {
      const data = await extractMedicalData(base64, mimeType, apiKey);
      setExtractedData(data);
      setStatus(AppStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during analysis.");
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
          Instantly convert medical documents into actionable AI prompts for care guidelines and limitations.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl flex flex-col items-center gap-8">
        
        {/* Step 1: Configuration & Upload (Visible when IDLE or ERROR) */}
        {(status === AppStatus.IDLE || status === AppStatus.ERROR) && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            
            {/* API Key Input */}
            <div className="w-full max-w-xl">
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">
                Google Gemini API Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-500 group-focus-within:text-medical-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API Key here (starts with AIzaSy...)"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-medical-500/50 focus:border-medical-500 text-slate-200 placeholder-slate-600 text-sm transition-all shadow-sm"
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-500 px-1">
                Your key is used locally for this session to process your data and is never stored on our servers.
              </p>
            </div>

            {/* File Upload */}
            <div className={`w-full transition-opacity duration-300 ${!apiKey ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
               <FileUpload onFileSelect={handleFileSelect} disabled={!apiKey} />
            </div>
          </div>
        )}

        {/* Loading State */}
        {status === AppStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center py-16 animate-pulse">
            <Loader2 className="w-12 h-12 text-medical-500 animate-spin mb-4" />
            <h3 className="text-xl font-medium text-slate-200">Analyzing Document...</h3>
            <p className="text-slate-500 mt-2">Extracting prescriptions, diagnosis, and notes</p>
          </div>
        )}

        {/* Error State */}
        {status === AppStatus.ERROR && (
          <div className="w-full max-w-xl bg-red-950/30 border border-red-900/50 rounded-xl p-6 text-center animate-fade-in">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-200 mb-2">Analysis Failed</h3>
            <p className="text-red-300/70 text-sm mb-6">{errorMsg}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Complete State */}
        {status === AppStatus.COMPLETE && extractedData && (
          <div className="w-full flex flex-col gap-8 animate-fade-in-up">
            
            {/* Extracted Data View */}
            <ExtractedDataCard data={extractedData} />

            {/* Prompt Generator */}
            <PromptGenerator data={extractedData} />

            {/* Reset / New Scan */}
            <button 
              onClick={handleReset}
              className="self-center px-6 py-3 mt-4 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-slate-800 rounded-full"
            >
              <RefreshCw className="w-4 h-4" />
              Scan Another Document
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto pt-16 text-slate-600 text-xs text-center">
        <p>MediScript AI utilizes advanced computer vision. Always verify extracted data with the original document.</p>
        <p className="mt-1 opacity-50">&copy; {new Date().getFullYear()} MediScript. Private & Secure.</p>
      </footer>
    </div>
  );
}