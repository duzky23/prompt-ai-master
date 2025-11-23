export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum PromptStyle {
  PHOTOREALISTIC = 'Photorealistic',
  CINEMATIC = 'Cinematic',
  ANIME = 'Anime',
  DIGITAL_ART = 'Digital Art',
  OIL_PAINTING = 'Oil Painting',
  CYBERPUNK = 'Cyberpunk',
  MINIMALIST = 'Minimalist',
  SURREAL = 'Surreal'
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  CLASSIC = '4:3',
  VERTICAL = '3:4'
}

export enum CameraAngle {
  AUTO = 'Auto',
  EYE_LEVEL = 'Eye Level',
  LOW_ANGLE = 'Low Angle',
  HIGH_ANGLE = 'High Angle',
  OVERHEAD = 'Overhead / Bird\'s Eye',
  DUTCH_ANGLE = 'Dutch Angle',
  CLOSE_UP = 'Close Up',
  WIDE_SHOT = 'Wide Shot'
}

export interface PromptSettings {
  rawIdea: string;
  mediaType: MediaType;
  style: PromptStyle;
  subStyle: string;
  aspectRatio: AspectRatio;
  cameraAngle: CameraAngle;
  lighting: string;
  mood: string;
  negativePrompt: string;
}

export interface RefinedResult {
  title: string;
  prompt: string;
  negativePrompt: string;
  explanation: string;
}

// Extend the global Window interface for AI Studio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}