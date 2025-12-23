export enum AppStatus {
  IDLE = 'IDLE',
  PREVIEW = 'PREVIEW',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface PresetStyle {
  id: string;
  label: string;
  prompt: string;
  iconName: string;
}

export interface EnhancementResult {
  originalImage: string; // Base64
  enhancedImage: string | null; // Base64
  promptUsed: string;
}

export interface GeneratedPart {
  inlineData?: {
    data: string;
    mimeType: string;
  };
  text?: string;
}