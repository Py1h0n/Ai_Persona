// FIX: Implemented the App component to manage state and render the UI.
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import BlueprintForm from './components/BlueprintForm';
import SceneForm from './components/SceneForm';
import ResultDisplay from './components/ResultDisplay';
import { PersonaDNA, Scene, GeneratedImage } from './types';
import { generatePersonaImage } from './services/geminiService';

function App() {
  const [personaDNA, setPersonaDNA] = useState<PersonaDNA>({
    personality: '',
    aesthetic: '',
    environment: '',
  });

  const [scene, setScene] = useState<Scene>({
    action: '',
    composition: '',
    context: '',
  });

  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  
  const [referenceLocationImage, setReferenceLocationImage] = useState<File | null>(null);
  const [referenceLocationImagePreview, setReferenceLocationImagePreview] = useState<string | null>(null);
  
  const [referenceItemsImage, setReferenceItemsImage] = useState<File | null>(null);
  const [referenceItemsImagePreview, setReferenceItemsImagePreview] = useState<string | null>(null);


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  
  const isReadyToGenerate = useMemo(() => {
    return (
      personaDNA.personality &&
      personaDNA.aesthetic &&
      personaDNA.environment &&
      scene.action &&
      scene.composition &&
      referenceImage
    );
  }, [personaDNA, scene, referenceImage]);

  const buildPromptForDisplay = () => {
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
      "1. Use the 'Reference Face/Body' image as the primary subject. The generated person MUST look like the person in this image.",
      "2. If a 'Location' image is provided, use it as the background or environmental inspiration.",
      "3. If an 'Items/Clothing' image is provided, incorporate those items or clothing style onto the subject.",
      "4. Combine all these elements to create a single, cohesive, realistic-looking photograph that matches the specified aesthetic and scene.",
      "5. The final image should look like a candid, authentic photo, not a staged or AI-generated image."
    ];
    return textParts.join('\n');
  }

  const handleSubmit = async () => {
    if (!isReadyToGenerate) {
      setError("Please fill in all required fields and upload a reference face image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // FIX: Ensure API_KEY is available as per guidelines.
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const imageUrl = await generatePersonaImage(
        personaDNA,
        scene,
        referenceImage!,
        referenceLocationImage,
        referenceItemsImage
      );
      
      setGeneratedImage({
        imageUrl,
        prompt: buildPromptForDisplay(),
      });

    } catch (err: any) {
      console.error(err);
      setError(`An error occurred during image generation: ${err.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg-alt min-h-screen text-brand-text">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
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
              scene={scene}
              setScene={setScene}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isReadyToGenerate={isReadyToGenerate}
            />
          </div>
          <div className="lg:sticky lg:top-24">
            <ResultDisplay 
              isLoading={isLoading}
              generatedImage={generatedImage}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
