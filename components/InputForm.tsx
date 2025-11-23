import React, { useEffect } from 'react';
import { PromptSettings, MediaType, PromptStyle, AspectRatio, CameraAngle } from '../types';
import { SparklesIcon, VideoCameraIcon, PhotoIcon } from '@heroicons/react/24/solid';

interface InputFormProps {
  settings: PromptSettings;
  setSettings: React.Dispatch<React.SetStateAction<PromptSettings>>;
  onRefine: () => void;
  isLoading: boolean;
}

const SUB_STYLES: Record<string, string[]> = {
  [PromptStyle.PHOTOREALISTIC]: ['Portrait', 'Landscape', 'Wildlife', 'Street Photography', 'Macro', 'Architectural', 'Editorial', 'Black & White'],
  [PromptStyle.CINEMATIC]: ['Wes Anderson', 'Christopher Nolan', 'Cyberpunk Noir', 'Fantasy Epic', 'Documentary', 'Vintage Film', 'Horror', 'Action Blockbuster'],
  [PromptStyle.ANIME]: ['Studio Ghibli', 'Makoto Shinkai', '90s Retro', 'Kyoto Animation', 'Mecha', 'Dark Fantasy', 'Chibi', 'Watercolor'],
  [PromptStyle.DIGITAL_ART]: ['Concept Art', 'Art Nouveau', 'Isometric', 'Low Poly', 'Vaporwave', 'Unreal Engine 5', 'Vector Art', '3D Render (Octane)'],
  [PromptStyle.OIL_PAINTING]: ['Impressionism', 'Baroque', 'Renaissance', 'Van Gogh', 'Cubism', 'Classic Portrait', 'Ink Wash'],
  [PromptStyle.CYBERPUNK]: ['Neon Noir', 'Biopunk', 'Synthwave', 'Post-Apocalyptic', 'High Tech Low Life'],
  [PromptStyle.MINIMALIST]: ['Bauhaus', 'Line Art', 'Flat Design', 'Scandinavian', 'Abstract Geometry'],
  [PromptStyle.SURREAL]: ['Salvador Dali', 'Dreamcore', 'Weirdcore', 'Ethereal', 'Double Exposure', 'Psychedelic']
};

const InputForm: React.FC<InputFormProps> = ({ settings, setSettings, onRefine, isLoading }) => {
  
  const handleChange = (field: keyof PromptSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Automatically select the first sub-style when the main style changes
  const handleStyleChange = (newStyle: PromptStyle) => {
    const defaultSubStyle = SUB_STYLES[newStyle]?.[0] || '';
    setSettings(prev => ({
        ...prev,
        style: newStyle,
        subStyle: defaultSubStyle
    }));
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-brand-500" />
          Ý Tưởng Của Bạn
        </h2>
        <p className="text-gray-400 text-sm mt-1">Nhập ý tưởng thô, AI sẽ lo phần còn lại.</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
        {/* Main Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả ý tưởng (Tiếng Việt/Anh)</label>
          <textarea
            value={settings.rawIdea}
            onChange={(e) => handleChange('rawIdea', e.target.value)}
            placeholder="Ví dụ: Một chú mèo phi hành gia đang uống trà trên mặt trăng, phong cách cyberpunk..."
            className="w-full h-32 bg-dark-bg border border-dark-border rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Media Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Loại nội dung</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleChange('mediaType', MediaType.IMAGE)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                settings.mediaType === MediaType.IMAGE
                  ? 'bg-brand-600 border-brand-500 text-white'
                  : 'bg-dark-bg border-dark-border text-gray-400 hover:bg-dark-border'
              }`}
            >
              <PhotoIcon className="w-5 h-5" /> Ảnh
            </button>
            <button
              onClick={() => handleChange('mediaType', MediaType.VIDEO)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                settings.mediaType === MediaType.VIDEO
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-dark-bg border-dark-border text-gray-400 hover:bg-dark-border'
              }`}
            >
              <VideoCameraIcon className="w-5 h-5" /> Video
            </button>
          </div>
        </div>

        {/* Style & Sub-Style */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phong cách chính</label>
            <select
              value={settings.style}
              onChange={(e) => handleStyleChange(e.target.value as PromptStyle)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-brand-500"
            >
              {Object.values(PromptStyle).map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Chi tiết phong cách</label>
            <select
              value={settings.subStyle}
              onChange={(e) => handleChange('subStyle', e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-brand-500"
            >
              {SUB_STYLES[settings.style]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              )) || <option value="">Mặc định</option>}
            </select>
          </div>
        </div>

        {/* Ratio & Camera */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tỉ lệ khung hình</label>
            <select
              value={settings.aspectRatio}
              onChange={(e) => handleChange('aspectRatio', e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-brand-500"
            >
              {Object.values(AspectRatio).map(ratio => (
                <option key={ratio} value={ratio}>{ratio}</option>
              ))}
            </select>
          </div>
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Góc máy (Camera)</label>
                 <select
                    value={settings.cameraAngle}
                    onChange={(e) => handleChange('cameraAngle', e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-brand-500"
                 >
                    {Object.values(CameraAngle).map(angle => (
                      <option key={angle} value={angle}>{angle}</option>
                    ))}
                 </select>
            </div>
        </div>

        {/* Lighting & Mood */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Ánh sáng (Tùy chọn)</label>
                 <input 
                    type="text"
                    value={settings.lighting}
                    onChange={(e) => handleChange('lighting', e.target.value)}
                    placeholder="e.g. Cinematic, Neon..."
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-brand-500"
                 />
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Cảm xúc (Tùy chọn)</label>
                 <input 
                    type="text"
                    value={settings.mood}
                    onChange={(e) => handleChange('mood', e.target.value)}
                    placeholder="e.g. Gloomy, Cheerful..."
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-brand-500"
                 />
            </div>
        </div>
        
        {/* Negative */}
        <div>
             <label className="block text-sm font-medium text-gray-300 mb-2">Negative Prompt (Điều muốn tránh)</label>
             <input 
                type="text"
                value={settings.negativePrompt}
                onChange={(e) => handleChange('negativePrompt', e.target.value)}
                placeholder="e.g. blurry, low quality, ugly..."
                className="w-full bg-dark-bg border border-dark-border rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-brand-500"
             />
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-dark-border">
        <button
          onClick={onRefine}
          disabled={isLoading || !settings.rawIdea.trim()}
          className={`w-full py-3 px-4 rounded-lg font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
            isLoading || !settings.rawIdea.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tối ưu hóa...
            </span>
          ) : (
            'Tối ưu hóa Prompt'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;