// FIX: Added type definitions for the application's data structures.
export interface PersonaDNA {
  personality: string;
  aesthetic: string;
  environment: string;
}

export interface Scene {
  action: string;
  composition: string;
  context: string;
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}
