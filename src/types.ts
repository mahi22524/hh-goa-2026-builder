export type ShapeType = 'CIRCLE' | 'RECTANGLE';

export type StepId = 'UPLOAD' | 'IDENTITY' | 'ADJUST' | 'GENERATE' | 'RESULT';

export type BuilderIdentity =
  | 'CYBER_DEFENDER'
  | 'AI_EXPLORER'
  | 'CODE_BUILDER'
  | 'CREATIVE_BUILDER'
  | 'CONTENT_CREATOR'
  | 'NIGHT_SHIPPER';

export interface PhotoTransform {
  x: number;
  y: number;
  zoom: number;
}

export interface ThemeConfig {
  id: BuilderIdentity;
  name: string;
  category: string;
  colors: {
    bg: string;
    text: string;
    accent: string;
    muted: string;
    coral?: string;
  };
  swatchGradient: string; // Used for static preview swatches
}

export interface AppState {
  step: StepId;
  photoUrl: string | null;
  photoType: string | null; // e.g. image/png, image/jpeg
  photoName: string | null;
  name: string;
  position: string;
  selectedIdentity: BuilderIdentity;
  transform: PhotoTransform;
  shape: ShapeType;
  generatedImageUrl: string | null;
  isGenerating: boolean;
}
