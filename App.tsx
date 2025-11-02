import React, { useState, useCallback, useEffect } from 'react';
import { PersonaDNA, SceneDetails, GenerationResult } from './types';
import { generateInfluencerImage, generateCaption } from './services/geminiService';
import Header from './components/Header';
import BlueprintForm from './components/BlueprintForm';
import SceneForm from './components/SceneForm';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [personaDNA, setPersonaDNA] = useState<PersonaDNA>({
    personality: 'introverted traveler',
    aesthetic: 'grainy',
    environment: 'urban cityscapes',
  });

  const [sceneDetails, setSceneDetails] = useState<SceneDetails>({
    location: 'Lisbon',
    time: 'morning',
    activity: 'holding a coffee cup',
    mood: 'nostalgic',
    aspectRatio: '1:1',
  });

  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);

  const [referenceLocationImage, setReferenceLocationImage] = useState<File | null>(null);
  const [referenceLocationImagePreview, setReferenceLocationImagePreview] = useState<string | null>(null);

  const [referenceItemsImage, setReferenceItemsImage] = useState<File | null>(null);
  const [referenceItemsImagePreview, setReferenceItemsImagePreview] = useState<string | null>(null);

  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setIsApiKeyMissing(true);
      setError("API_KEY is not configured. The application will not be able to generate content.");
    }
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const constructImagePrompt = useCallback((): string => {
    const timeToLighting: { [key: string]: string } = {
        morning: 'soft sunlight',
        afternoon: 'bright daylight',
        evening: 'golden hour light',
        night: 'dim ambient street light',
    };
    const lighting = timeToLighting[sceneDetails.time.toLowerCase()] || 'natural lighting';

    const moodToExpression: { [key: string]: string } = {
        nostalgic: 'a subtle, wistful smile, with eyes looking slightly distant as if lost in a fond memory.',
        content: 'a soft, relaxed facial expression, comfortable and at ease, with a gentle, closed-mouth smile.',
        playful: 'a mischievous glint in her eyes and the hint of a smirk, as if sharing a secret joke.',
        melancholy: 'a thoughtful, somber expression with soft eyes, not overtly sad but deeply introspective.',
        serene: 'a calm and peaceful expression, relaxed eyebrows and jaw, conveying a sense of inner tranquility.',
        energetic: 'bright, engaged eyes and a genuine, open smile that crinkles at the corners, exuding vitality.',
    };
    const expression = moodToExpression[sceneDetails.mood] || `an expression fitting a ${sceneDetails.mood} mood.`;
    
    const aspectRatioInstructions: { [key: string]: { instruction: string; framing: string; negative: string } } = {
        '1:1': {
            instruction: 'A perfectly square image with an exact 1:1 aspect ratio.',
            framing: 'The composition should be balanced and centered. Ideal for a grid post.',
            negative: 'Avoid rectangular or widescreen formats.'
        },
        '4:5': {
            instruction: 'A vertical portrait image with a strict 4:5 aspect ratio.',
            framing: 'This is taller than a square. Frame the subject from the waist up or a close-up portrait.',
            negative: 'Do not make it square. Do not make it extra tall like a story.'
        },
        '9:16': {
            instruction: 'A tall, vertical image with a mandatory 9:16 aspect ratio, like a phone screen.',
            framing: 'This is for a story or reel. Capture a full-body or three-quarters shot to fill the tall frame.',
            negative: 'CRITICAL: Do not generate a square or horizontal image. It must be vertical.'
        },
        '16:9': {
            instruction: 'A wide, horizontal, cinematic image with a 16:9 aspect ratio.',
            framing: 'The composition must be expansive and horizontal, capturing the environment.',
            negative: 'Absolutely no vertical or square images.'
        },
        '4:3': {
            instruction: 'A standard horizontal photograph with a 4:3 aspect ratio.',
            framing: 'Use classic landscape framing. It should be wider than it is tall.',
            negative: 'Avoid vertical or square formats.'
        },
    };
    
    const { instruction, framing, negative } = aspectRatioInstructions[sceneDetails.aspectRatio] || { instruction: `A photo with a ${sceneDetails.aspectRatio} aspect ratio.`, framing: '', negative: '' };
    
    let prompt = `[START IMAGE INSTRUCTIONS]
---
MANDATORY TECHNICAL REQUIREMENT:
- Image Aspect Ratio: ${sceneDetails.aspectRatio}
- Detailed Instruction: ${instruction}
- Negative Constraint: ${negative}

STYLE & COMPOSITION:
- Style: A candid, authentic handheld iPhone photo.
- Framing: ${framing}
- Aesthetics: ${personaDNA.aesthetic}, motion blur, slight grain, uneven framing, shot with 35mm depth of field for an imperfect but emotional realism.
---
[END IMAGE INSTRUCTIONS]

[SCENE DESCRIPTION]
The subject is the woman from the first reference image.
`;

    if (referenceLocationImage) {
        prompt += ` The setting is inspired by the location in the second reference image, combined with this description: ${sceneDetails.location}.`;
    } else {
        prompt += ` The setting is ${sceneDetails.location}.`;
    }

    if (referenceItemsImage) {
        prompt += ` She is wearing an outfit or holding an item stylistically similar to what's in the third reference image.`;
    }

    prompt += ` She is ${sceneDetails.activity}. It is ${sceneDetails.time}, which should have ${lighting}.`;
    prompt += ` Her facial expression is crucial: capture ${expression}. This micro-expression should subtly reflect her personality as a ${personaDNA.personality}.`;
    
    prompt += ` Remember the absolute requirement: the final image's aspect ratio MUST be ${sceneDetails.aspectRatio}.`;
    
    return prompt;
  }, [personaDNA, sceneDetails, referenceLocationImage, referenceItemsImage]);

  const handleGenerate = async () => {
    if (isApiKeyMissing) {
        setError("Cannot generate: API Key is missing. Please configure it to use the application.");
        return;
    }
    if (!referenceImage) {
      setError('Please upload a reference image for the face/body first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGenerationResult(null);

    try {
      const imagePrompt = constructImagePrompt();
      
      const imageParts: { data: string; mimeType: string }[] = [];

      const mainImageBase64 = await fileToBase64(referenceImage);
      imageParts.push({ data: mainImageBase64, mimeType: referenceImage.type });

      if (referenceLocationImage) {
        const locationImageBase64 = await fileToBase64(referenceLocationImage);
        imageParts.push({ data: locationImageBase64, mimeType: referenceLocationImage.type });
      }

      if (referenceItemsImage) {
        const itemsImageBase64 = await fileToBase64(referenceItemsImage);
        imageParts.push({ data: itemsImageBase64, mimeType: referenceItemsImage.type });
      }

      const generatedImageBase64 = await generateInfluencerImage(imageParts, imagePrompt);
      const generatedCaption = await generateCaption(personaDNA, sceneDetails);
      
      setGenerationResult({
        image: generatedImageBase64,
        prompt: imagePrompt,
        caption: generatedCaption,
      });

    } catch (err) {
      console.error(err);
      let errorMessage = 'An unknown error occurred. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('SAFETY')) {
          errorMessage = 'Image generation was blocked due to safety settings. Please modify your prompt and try again.';
        } else if (err.message.includes('400')) {
          errorMessage = 'The request was invalid. Please check your inputs and prompt, then try again.';
        } else {
          errorMessage = `Generation failed: ${err.message}`;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {isApiKeyMissing && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
                <strong className="font-bold">Configuration Error: </strong>
                <span className="block sm:inline">API_KEY is not set. The application will not function.</span>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <BlueprintForm 
              personaDNA={personaDNA}
              setPersonaDNA={setPersonaDNA}
              referenceImagePreview={referenceImagePreview}
              setReferenceImage={setReferenceImage}
              setReferenceImagePreview={setReferenceImagePreview}
              referenceLocationImagePreview={referenceLocationImagePreview}
              setReferenceLocationImage={setReferenceLocationImage}
              setReferenceLocationImagePreview={setReferenceLocationImagePreview}
              referenceItemsImagePreview={referenceItemsImagePreview}
              setReferenceItemsImage={setReferenceItemsImage}
              setReferenceItemsImagePreview={setReferenceItemsImagePreview}
            />
            <SceneForm 
              sceneDetails={sceneDetails}
              setSceneDetails={setSceneDetails}
              handleGenerate={handleGenerate}
              isLoading={isLoading}
              hasReferenceImage={!!referenceImage}
              disabled={isApiKeyMissing}
            />
          </div>
          <div className="lg:col-span-8">
             {error && !isApiKeyMissing && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
              )}
            {isLoading ? <Loader /> : <ResultDisplay result={generationResult} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;