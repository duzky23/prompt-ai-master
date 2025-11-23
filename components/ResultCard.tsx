import React, { useState } from 'react';
import { RefinedResult, MediaType } from '../types';
import { DocumentDuplicateIcon, PlayIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ResultCardProps {
  result: RefinedResult | null;
  onGeneratePreview: () => void;
  isPreviewLoading: boolean;
  previewUrl: string | null;
  mediaType: MediaType;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  onGeneratePreview, 
  isPreviewLoading, 
  previewUrl, 
  mediaType 
}) => {
  const [copied, setCopied] = useState<'prompt' | 'negative' | null>(null);

  if (!result) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 h-full flex flex-col items-center justify-center text-center text-gray-500">
        <SparklesPlaceholder />
        <p className="mt-4 text-lg">Chưa có kết quả.</p>
        <p className="text-sm">Hãy nhập ý tưởng và nhấn "Tối ưu hóa" để bắt đầu.</p>
      </div>
    );
  }

  const handleCopy = (text: string, type: 'prompt' | 'negative') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl h-full flex flex-col overflow-hidden">
      <div className="mb-4 flex justify-between items-start">
         <div>
            <h3 className="text-xl font-bold text-white">{result.title}</h3>
            <p className="text-sm text-brand-400 mt-1">Prompt đã được tối ưu cho {mediaType === MediaType.IMAGE ? 'Ảnh' : 'Video'}</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        
        {/* Main Prompt */}
        <div className="group relative bg-dark-bg border border-dark-border rounded-lg p-4 transition-all hover:border-brand-500/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Positive Prompt</span>
            <button 
              onClick={() => handleCopy(result.prompt, 'prompt')}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy"
            >
              {copied === 'prompt' ? <CheckIcon className="w-5 h-5 text-green-400" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed font-mono whitespace-pre-wrap">{result.prompt}</p>
        </div>

        {/* Negative Prompt */}
        <div className="group relative bg-dark-bg border border-dark-border rounded-lg p-4 transition-all hover:border-red-500/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Negative Prompt</span>
             <button 
              onClick={() => handleCopy(result.negativePrompt, 'negative')}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy"
            >
              {copied === 'negative' ? <CheckIcon className="w-5 h-5 text-green-400" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed font-mono">{result.negativePrompt || "None"}</p>
        </div>

        {/* Explanation */}
        <div className="bg-brand-900/20 border border-brand-900/50 rounded-lg p-4">
             <h4 className="text-sm font-bold text-brand-200 mb-1">Phân tích AI:</h4>
             <p className="text-sm text-brand-100 italic">{result.explanation}</p>
        </div>

        {/* Preview Section */}
        <div className="border-t border-dark-border pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Kết quả thử nghiệm (Preview)</h3>
            
            {!previewUrl && !isPreviewLoading && (
                <button
                    onClick={onGeneratePreview}
                    className="flex items-center gap-2 bg-dark-bg border border-dark-border hover:bg-dark-border text-white px-4 py-2 rounded-lg transition-all"
                >
                    {mediaType === MediaType.IMAGE ? <PhotoIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    {mediaType === MediaType.IMAGE ? 'Tạo ảnh thử nghiệm' : 'Tạo video thử nghiệm (Veo)'}
                </button>
            )}

            {isPreviewLoading && (
                <div className="h-64 bg-dark-bg rounded-lg flex flex-col items-center justify-center animate-pulse border border-dark-border">
                    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-400 text-sm">Đang khởi tạo {mediaType === MediaType.IMAGE ? 'ảnh' : 'video'}...</p>
                    {mediaType === MediaType.VIDEO && <p className="text-xs text-gray-500 mt-2">Video có thể mất vài phút.</p>}
                </div>
            )}

            {previewUrl && !isPreviewLoading && (
                <div className="rounded-lg overflow-hidden border border-dark-border shadow-lg">
                    {mediaType === MediaType.IMAGE ? (
                        <img src={previewUrl} alt="Generated Preview" className="w-full h-auto object-cover" />
                    ) : (
                        <video controls src={previewUrl} className="w-full h-auto" autoPlay loop muted />
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const SparklesPlaceholder = () => (
  <svg className="w-20 h-20 text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

export default ResultCard;