import React from 'react';
import { ExtractedMedicalData } from '../types';
import { Activity, Pill, FileText, User, ClipboardList, TestTube } from 'lucide-react';

interface ExtractedDataCardProps {
  data: ExtractedMedicalData;
}

export const ExtractedDataCard: React.FC<ExtractedDataCardProps> = ({ data }) => {
  const hasData = (arr?: string[]) => arr && arr.length > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl w-full text-slate-100">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <Activity className="text-medical-400 w-5 h-5" />
        <h3 className="text-lg font-semibold">掃描詳情</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        
        {/* Patient & Diagnosis */}
        <div className="space-y-4">
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
            <div className="flex items-center gap-2 text-medical-300 mb-2">
              <User className="w-3 h-3" />
              <span className="text-xs uppercase font-bold tracking-wider">患者資訊</span>
            </div>
            <div className="space-y-1">
              <p className="text-slate-300 font-medium text-base">{data.patientName || "未偵測到"}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <span>年齡：</span>
                  <span className="text-slate-300 font-medium">{data.age || "無資料"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>性別：</span>
                  <span className="text-slate-300 font-medium">{data.sex || "無資料"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
             <div className="flex items-center gap-2 text-medical-300 mb-1">
              <ClipboardList className="w-3 h-3" />
              <span className="text-xs uppercase font-bold tracking-wider">診斷</span>
            </div>
            <p className="text-slate-300 font-medium">{data.diagnosis || "未偵測到"}</p>
          </div>
        </div>

        {/* Prescription */}
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 h-full">
          <div className="flex items-center gap-2 text-medical-300 mb-2">
            <Pill className="w-3 h-3" />
            <span className="text-xs uppercase font-bold tracking-wider">處方 / 藥物</span>
          </div>
          {hasData(data.prescription) ? (
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {data.prescription!.map((item, idx) => (
                <li key={idx} className="marker:text-medical-600 leading-relaxed">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic">未偵測到藥物</p>
          )}
        </div>
      </div>

      {/* Lab Results */}
      {hasData(data.labResults) && (
        <div className="mt-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
          <div className="flex items-center gap-2 text-medical-300 mb-2">
            <TestTube className="w-3 h-3" />
            <span className="text-xs uppercase font-bold tracking-wider">檢驗結果與生命徵象</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.labResults!.map((result, idx) => (
              <div key={idx} className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-xs text-slate-300 font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Procedures / Notes */}
      {(hasData(data.procedures) || data.doctorNotes) && (
        <div className="mt-4 pt-4 border-t border-slate-800">
           <div className="flex items-center gap-2 text-medical-300 mb-2">
            <FileText className="w-3 h-3" />
            <span className="text-xs uppercase font-bold tracking-wider">附加備註與醫療程序</span>
          </div>
          <div className="space-y-3 text-slate-300">
            {hasData(data.procedures) && (
               <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-xs font-semibold">醫療程序：</span>
                  <div className="pl-2 border-l-2 border-slate-700">
                    {data.procedures!.join("、")}
                  </div>
               </div>
            )}
            {data.doctorNotes && (
               <div className="bg-medical-900/10 p-3 rounded border border-medical-900/20">
                  <span className="text-medical-500 text-xs font-bold block mb-1">醫生備註：</span>
                  <p className="italic leading-relaxed">{data.doctorNotes}</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};