// FIX: Implemented Gemini API service for generating images and captions.
import { GoogleGenAI, Modality } from "@google/genai";
import { PersonaDNA, SceneConfig } from "../types";

// Helper to convert File to a base64 string and format it for the Gemini API
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    // The result includes the Base64 prefix "data:image/jpeg;base64,", which we need to remove.
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

// Constructs the detailed prompt for image generation
const constructImagePrompt = (personaDNA: PersonaDNA, sceneConfig: SceneConfig): string => {
    let promptParts: string[] = [];

    // Primary Subject
    if (personaDNA.personality) {
        promptParts.push(`**Primary Subject:** A single person defined by this personality: "${personaDNA.personality}".`);
    } else {
        promptParts.push(`**Primary Subject:** A single person based on the provided reference image.`);
    }

    // Scene Description
    let sceneDescription = `**Scene Description:** The person is captured in a candid moment, performing the action: "${sceneConfig.action}".\nThe setting is "${sceneConfig.location}"`;
    if (personaDNA.environment) {
        sceneDescription += `, which should complement their primary environment: "${personaDNA.environment}"`;
    }
    sceneDescription += `.\nThe time of day is "${sceneConfig.timeOfDay}".`;
    promptParts.push(sceneDescription);

    // Art Direction
    let artDirectionParts: string[] = [];
    if (personaDNA.aesthetic) {
        artDirectionParts.push(`- **Overall Aesthetic:** The image must strictly adhere to a "${personaDNA.aesthetic}" aesthetic. This is the most important instruction.`);
    }
    artDirectionParts.push(`- **Camera & Composition:** The shot should be from a "${sceneConfig.cameraAngle}" angle.`);
    artDirectionParts.push(`- **Realism:** Emphasize photorealism. The final image should look like a real, candid photograph, not a staged or AI-generated picture. Avoid artificial poses, perfect lighting, or overly clean compositions unless specified by the aesthetic. Capture imperfections.`);
    
    promptParts.push(`**Art Direction & Photography Style:**\n${artDirectionParts.join('\n')}`);
    
    // Reference Images
    promptParts.push(`**Reference Images:**
- The first image provided is the "Reference Face/Body" and is a strong visual guide for the person's appearance (face, body type, hair).
- If a second image is provided, it is a "Location" reference for the environment's mood and architecture.
- If a third image is provided, it is an "Items/Clothing" reference for the person's style.`);

    // Additional Instructions
    if (sceneConfig.additionalInstructions) {
        promptParts.push(`**User Refinements:** ${sceneConfig.additionalInstructions}`);
    }

    // Final Instruction
    let finalInstruction = "Generate a single, photorealistic image based on all the above criteria.";
    if (personaDNA.aesthetic) {
        finalInstruction += " The aesthetic is paramount.";
    }
    promptParts.push(`**Final Instruction:** ${finalInstruction}`);

    return promptParts.join('\n\n');
};


export const generateImage = async (
  personaDNA: PersonaDNA,
  sceneConfig: SceneConfig,
  referenceImage: File,
  locationImage: File | null,
  itemsImage: File | null
) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = constructImagePrompt(personaDNA, sceneConfig);
    
    const parts: any[] = [
        { text: prompt },
        await fileToGenerativePart(referenceImage)
    ];

    if (locationImage) {
        parts.push(await fileToGenerativePart(locationImage));
    }
    if (itemsImage) {
        parts.push(await fileToGenerativePart(itemsImage));
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            return { imageUrl, prompt };
        }
    }
    throw new Error("No image was generated. The model may have refused the prompt.");
};

export const generateCaption = async (
    personaDNA: PersonaDNA,
    imageUrl: string
) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = imageUrl.split(',')[1];
    const mimeType = imageUrl.match(/data:(.*);/)?.[1] ?? 'image/png';
    
    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };

    const prompt = `
        You are an AI assistant tasked with creating a social media caption.
        Your persona is: "${personaDNA.personality}".
        Your visual style is: "${personaDNA.aesthetic}".
        Your typical environment is: "${personaDNA.environment}".

        Based on the provided image and the persona details, write a short, authentic-sounding caption. It should feel like something the persona would post themselves.
        - Do NOT use hashtags unless it feels natural for the persona.
        - Keep it concise and in the first person.
        - Match the tone and voice of the persona.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: prompt },
                imagePart
            ]
        },
    });

    return response.text.trim();
};