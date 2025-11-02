// FIX: Implemented Gemini API service for image generation.
import { GoogleGenAI, Modality } from "@google/genai";
import { PersonaDNA, Scene } from '../types';

// Utility to convert a File object to a GoogleGenAI.Part object.
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

// FIX: Initialize GoogleGenAI with API key from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generatePersonaImage = async (
  personaDNA: PersonaDNA,
  scene: Scene,
  referenceImage: File,
  locationImage: File | null,
  itemsImage: File | null
): Promise<string> => {
  // Construct a detailed prompt for the model.
  const textParts: string[] = [
    "You are an expert photographer creating a 'day in the life' photo of a digital persona.",
    "**Persona DNA:**",
    `- Personality/Vibe: ${personaDNA.personality}`,
    `- Aesthetic: ${personaDNA.aesthetic}`,
    `- Primary Environment: ${personaDNA.environment}`,
    "**Scene Details:**",
    `- Action: ${scene.action}`,
    `- Composition: ${scene.composition}`,
    `- Context/Caption: ${scene.context}`,
    "**Instructions:**",
    "1. Use the 'Reference Face/Body' image as the primary subject. The generated person MUST look like the person in the first image provided after this prompt.",
    "2. If a second 'Location' image is provided, use it as the background or environmental inspiration.",
    "3. If a third 'Items/Clothing' image is provided, incorporate those items or clothing style onto the subject.",
    "4. Combine all these elements to create a single, cohesive, realistic-looking photograph that matches the specified aesthetic and scene.",
    "5. The final image should look like a candid, authentic photo, not a staged or AI-generated image."
  ];

  const prompt = textParts.join('\n');

  // FIX: Build the parts array cleanly. One text part, then image parts in order.
  const contentsParts: any[] = [];
  
  // Start with the main text prompt
  contentsParts.push({ text: prompt });
  
  // Add the primary reference image
  contentsParts.push(await fileToGenerativePart(referenceImage));

  // Add optional images
  if (locationImage) {
    contentsParts.push(await fileToGenerativePart(locationImage));
  }
  if (itemsImage) {
    contentsParts.push(await fileToGenerativePart(itemsImage));
  }


  // FIX: Using gemini-2.5-flash-image for multimodal input.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: contentsParts },
    config: {
      // FIX: Set responseModality to IMAGE for image output.
      responseModalities: [Modality.IMAGE],
    },
  });

  // FIX: Correctly parse the response to extract the image data.
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("No image generated from the API.");
};