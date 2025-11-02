// FIX: Defined TypeScript types to be used across the application.
export interface PersonaDNA {
  personality: string;
  aesthetic: string;
  environment: string;
}

export interface SceneConfig {
  action: string;
  location: string;
  timeOfDay: string;
  cameraAngle: string;
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
  caption?: string;
}
