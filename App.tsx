
import React, { useState, useCallback } from 'react';
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
    mood: 'sleepy eyes',
  });

  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    
    return `A candid handheld iPhone photo of the same woman as reference, ${sceneDetails.activity} in ${sceneDetails.location}, captured during the ${sceneDetails.time}. The scene is filled with ${lighting}, creating ${sceneDetails.mood}. The aesthetic is ${personaDNA.aesthetic} with warm tones. Her personality as a ${personaDNA.personality} shines through. Her hair is slightly messy, and she's wearing a casual outfit suitable for her ${personaDNA.environment} lifestyle. The background is slightly out of focus, shot with 35mm depth of field, embodying an imperfect but emotional realism. Include motion blur, slight grain, and uneven framing to make it feel alive and human-taken.`;
  }, [personaDNA, sceneDetails]);

  const handleGenerate = async () => {
    if (!referenceImage) {
      setError('Please upload a reference image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGenerationResult(null);

    try {
      const imagePrompt = constructImagePrompt();
      const imageMimeType = referenceImage.type;
      const imageBase64 = await fileToBase64(referenceImage);

      const generatedImageBase64 = await generateInfluencerImage(imageBase64, imageMimeType, imagePrompt);
      const generatedCaption = await generateCaption(personaDNA, sceneDetails);
      
      setGenerationResult({
        image: generatedImageBase64,
        prompt: imagePrompt,
        caption: generatedCaption,
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <BlueprintForm 
              personaDNA={personaDNA}
              setPersonaDNA={setPersonaDNA}
              referenceImagePreview={referenceImagePreview}
              setReferenceImage={setReferenceImage}
              setReferenceImagePreview={setReferenceImagePreview}
            />
            <SceneForm 
              sceneDetails={sceneDetails}
              setSceneDetails={setSceneDetails}
              handleGenerate={handleGenerate}
              isLoading={isLoading}
              hasReferenceImage={!!referenceImage}
            />
          </div>
          <div className="lg:col-span-8">
             {error && (
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
