import React, { useCallback, useState } from 'react';
import { Upload, FileImage, Camera } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: Array<{ base64: string; mimeType: string }>) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
    // Reset value so same file can be selected again if needed
    event.target.value = '';
  }, [onFileSelect]);

  const processFiles = async (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      alert('請上傳有效的圖片檔案（JPEG、PNG、WEBP）。');
      return;
    }

    if (validFiles.length < files.length) {
      alert(`已跳過 ${files.length - validFiles.length} 個非圖片檔案。`);
    }

    const processedFiles = await Promise.all(
      validFiles.map(file => 
        new Promise<{ base64: string; mimeType: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve({ base64, mimeType: file.type });
          };
          reader.readAsDataURL(file);
        })
      )
    );

    onFileSelect(processedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`relative group border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-medical-400 bg-medical-900/20' 
            : 'border-slate-700 hover:border-medical-500/50 hover:bg-slate-800/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
        
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-medical-500/20' : 'bg-slate-800'}`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-medical-300' : 'text-medical-500'}`} />
          </div>
          <h3 className="text-xl font-semibold text-slate-200 mb-2">
            上傳醫療文件
          </h3>
          <p className="text-slate-400 text-sm max-w-xs mb-6">
            拖放或點擊以掃描處方、報告或診斷（支援多個檔案）
          </p>
          
          <div className="flex items-center gap-4 text-xs text-slate-500 uppercase tracking-wider font-medium">
            <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
              <FileImage className="w-3.5 h-3.5" />
              上傳檔案
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
              <Camera className="w-3.5 h-3.5" />
              使用相機
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
