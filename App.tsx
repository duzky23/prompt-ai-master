import React, { useState } from 'react';
import { PromptSettings, PromptStyle, MediaType, AspectRatio, RefinedResult, CameraAngle } from './types';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { refinePrompt, generateImagePreview, generateVideoPreview } from './services/geminiService';

function App() {
  const [settings, setSettings] = useState<PromptSettings>({
    rawIdea: '',
    mediaType: MediaType.IMAGE,
    style: PromptStyle.PHOTOREALISTIC,
    subStyle: 'Portrait',
    aspectRatio: AspectRatio.SQUARE,
    cameraAngle: CameraAngle.AUTO,
    lighting: '',
    mood: '',
    negativePrompt: ''
  });

  const [refinedResult, setRefinedResult] = useState<RefinedResult | null>(null);
  const [isLoadingRefine, setIsLoadingRefine] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRefine = async () => {
    setIsLoadingRefine(true);
    setError(null);
    setPreviewUrl(null); // Reset preview on new refinement
    try {
      const result = await refinePrompt(settings);
      setRefinedResult(result);
    } catch (err: any) {
      setError("Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsLoadingRefine(false);
    }
  };

  const handleGeneratePreview = async () => {
    if (!refinedResult) return;
    
    // Check for Veo specific API key requirement
    if (settings.mediaType === MediaType.VIDEO) {
      if (typeof window !== 'undefined' && window.aistudio && window.aistudio.hasSelectedApiKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
             const confirm = window.confirm("Tính năng tạo Video (Veo) yêu cầu chọn API Key trả phí từ Google. Bạn có muốn mở cửa sổ chọn key không?");
             if (confirm) {
                 await window.aistudio.openSelectKey();
                 // Proceed immediately as per guidelines to mitigate race condition
                 // Do NOT return here; allow the function to continue to generateVideoPreview
             } else {
                 return;
             }
          }
      }
    }

    setIsLoadingPreview(true);
    setError(null);
    try {
      let url = '';
      if (settings.mediaType === MediaType.IMAGE) {
        url = await generateImagePreview(refinedResult.prompt, settings.aspectRatio);
      } else {
        url = await generateVideoPreview(refinedResult.prompt, settings.aspectRatio);
      }
      setPreviewUrl(url);
    } catch (err: any) {
      console.error(err);
      setError("Không thể tạo bản xem trước. " + (err.message || ""));
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-4 md:p-8 font-sans text-gray-100 flex flex-col">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
            PM
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">PromptMaster AI</h1>
            <p className="text-xs text-gray-400">Powered by Gemini 2.5 & Veo</p>
          </div>
        </div>
        <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-white transition-colors">
          Gemini API Docs &rarr;
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        <InputForm 
          settings={settings} 
          setSettings={setSettings} 
          onRefine={handleRefine} 
          isLoading={isLoadingRefine} 
        />
        <ResultCard 
          result={refinedResult} 
          onGeneratePreview={handleGeneratePreview}
          isPreviewLoading={isLoadingPreview}
          previewUrl={previewUrl}
          mediaType={settings.mediaType}
        />
      </main>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-900/90 border border-red-500 text-white p-4 rounded-lg shadow-2xl max-w-md animate-bounce">
          <strong className="block font-bold mb-1">Error</strong>
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-2 right-2 text-white/50 hover:text-white">&times;</button>
        </div>
      )}
    </div>
  );
}

export default App;