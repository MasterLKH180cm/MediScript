import React from 'react';
import { ExtractedMedicalData } from '../types';

interface ExtractedDataCardProps {
  data: ExtractedMedicalData;
}

export const ExtractedDataCard: React.FC<ExtractedDataCardProps> = ({ data }) => {
  const renderValue = (value: any, depth: number = 0): React.ReactNode => {
    // Handle null/undefined/empty
    if (value === null || value === undefined || value === '') {
      return <span className="text-slate-500 italic">未提供</span>;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-slate-500 italic">無資料</span>;
      }
      return (
        <ul className="list-disc list-inside space-y-1 ml-2">
          {value.map((item, index) => (
            <li key={index} className="text-slate-300">
              {renderValue(item, depth + 1)}
            </li>
          ))}
        </ul>
      );
    }

    // Handle objects
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <span className="text-slate-500 italic">無資料</span>;
      }

      // Render as inline text for simple objects with few properties
      if (entries.length <= 3 && depth > 0) {
        const formatted = entries
          .map(([k, v]) => {
            const formattedKey = formatKey(k);
            const formattedValue = typeof v === 'object' ? JSON.stringify(v) : String(v);
            return `${formattedKey}: ${formattedValue}`;
          })
          .join('; ');
        return <span className="text-slate-200">{formatted}</span>;
      }

      // Render as structured nested view for complex objects
      return (
        <div className={`${depth > 0 ? 'pl-4 border-l-2 border-slate-700' : ''} space-y-2 mt-1`}>
          {entries.map(([nestedKey, nestedValue]) => (
            <div key={nestedKey} className="text-sm">
              <span className="text-slate-400 font-medium">
                {formatKey(nestedKey)}:
              </span>
              <div className="ml-2 mt-0.5">
                {renderValue(nestedValue, depth + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      return (
        <span className={value ? 'text-green-400' : 'text-red-400'}>
          {value ? '是' : '否'}
        </span>
      );
    }

    // Handle numbers and strings
    const stringValue = String(value);
    
    // Check if it's a long text block
    if (stringValue.length > 100) {
      return (
        <div className="text-slate-200 whitespace-pre-wrap break-words">
          {stringValue}
        </div>
      );
    }

    return <span className="text-slate-200">{stringValue}</span>;
  };

  const formatKey = (key: string): string => {
    // Convert snake_case and camelCase to Title Case
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Filter out internal fields
  const dataEntries = Object.entries(data).filter(
    ([key]) => !['fileB64', 'mimeType'].includes(key)
  );

  if (dataEntries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400 italic">未提取到任何醫療資訊</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-50 border-b border-slate-700 pb-2">
        提取的醫療資訊
      </h3>
      
      <div className="space-y-3">
        {dataEntries.map(([key, value]) => (
          <div key={key} className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors">
            <h4 className="text-sm font-semibold text-medical-400 mb-2">
              {formatKey(key)}
            </h4>
            <div className="text-sm">
              {renderValue(value, 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};