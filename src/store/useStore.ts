import { create } from "zustand";

export type ColorTheme =
  | "default"
  | "blue"
  | "purple"
  | "gold"
  | "red";

export interface AppState {
  // 3D customization
  colorTheme: ColorTheme;
  glowIntensity: number;
  particleCount: number;

  // Interaction state
  isDragging: boolean;
  zoomLevel: number;
  rotationSpeed: number;
  pulseTrigger: number;

  // App state
  isLoading: boolean;
  reduceMotion: boolean;

  // Actions
  setColorTheme: (theme: ColorTheme) => void;
  setGlowIntensity: (value: number) => void;
  setParticleCount: (value: number) => void;
  setIsDragging: (dragging: boolean) => void;
  setZoomLevel: (level: number) => void;
  setRotationSpeed: (speed: number) => void;
  triggerPulse: () => void;
  setIsLoading: (loading: boolean) => void;
  setReduceMotion: (reduce: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  colorTheme: "default",
  glowIntensity: 1.0,
  particleCount: 50,
  isDragging: false,
  zoomLevel: 8,
  rotationSpeed: 1.0,
  pulseTrigger: 0,
  isLoading: true,
  reduceMotion: false,

  setColorTheme: (theme) => set({ colorTheme: theme }),
  setGlowIntensity: (value) => set({ glowIntensity: value }),
  setParticleCount: (value) => set({ particleCount: value }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
  triggerPulse: () => set((state) => ({ pulseTrigger: state.pulseTrigger + 1 })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setReduceMotion: (reduce) => set({ reduceMotion: reduce }),
}));
