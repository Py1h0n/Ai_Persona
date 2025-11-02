
export interface PersonaDNA {
  personality: string;
  aesthetic: string;
  environment: string;
}

export interface SceneDetails {
  location: string;
  time: string;
  activity: string;
  mood: string;
  aspectRatio: string;
}

export interface GenerationResult {
  image: string; // base64 string
  prompt: string;
  caption: string;
}