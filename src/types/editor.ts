export type Tool = 'pan' | 'crop' | 'brush' | 'eraser' | 'text';

export type FilterType = 'grayscale' | 'sepia' | 'invert' | 'blur' | 'sharpen' | 'vintage' | 'vibrant';

export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  temperature: number;
  exposure: number;
}

export interface CanvasState {
  imageData: ImageData | null;
  zoom: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export interface HistoryState {
  imageData: string; // base64 data URL
  adjustments: Adjustments;
}

export interface BrushSettings {
  size: number;
  color: string;
  opacity: number;
}

export interface TextSettings {
  text: string;
  font: string;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
}