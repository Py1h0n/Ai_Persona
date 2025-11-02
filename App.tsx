// FIX: Implemented the main App component to manage state and orchestrate the UI.
import React, { useState } from 'react';
import Header from './components/Header';
import BlueprintForm from './components/BlueprintForm';
import SceneForm from './components/SceneForm';
import ResultDisplay from './components/ResultDisplay';
import { PersonaDNA, SceneConfig, GeneratedImage } from './types';
import { generateImage, generateCaption } from './services/geminiService';

const App: React.FC = () => {
  const [personaDNA, setPersonaDNA] = useState<PersonaDNA>({
    personality: '',
    aesthetic: '',
    environment: '',
  });

  // State for the reference images
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  
  const [referenceLocationImage, setReferenceLocationImage] = useState<File | null>(null);
  const [referenceLocationImagePreview, setReferenceLocationImagePreview] = useState<string | null>(null);

  const [referenceItemsImage, setReferenceItemsImage] = useState<File | null>(null);
  const [referenceItemsImagePreview, setReferenceItemsImagePreview] = useState<string | null>(null);
  
  // State for API calls and results
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);

  const handleGenerateImage = async (sceneConfig: SceneConfig) => {
    // Basic validation
    if (!referenceImage) {
        setError("A reference face/body image is required.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
        const result = await generateImage(
            personaDNA,
            sceneConfig,
            referenceImage,
            referenceLocationImage,
            referenceItemsImage
        );
        setGeneratedImage(result);
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during image generation.";
        setError(`Generation Failed: ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateCaption = async () => {
    if (!generatedImage || !generatedImage.imageUrl) {
        return;
    }

    setIsGeneratingCaption(true);
    setError(null);
    try {
        const caption = await generateCaption(personaDNA, generatedImage.imageUrl);
        setGeneratedImage(prev => prev ? { ...prev, caption } : null);
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during caption generation.";
        setError(`Caption Failed: ${errorMessage}`);
    } finally {
        setIsGeneratingCaption(false);
    }
  }

  return (
    <div className="bg-brand-bg-alt min-h-screen text-brand-text font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
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
            <SceneForm onSubmit={handleGenerateImage} isLoading={isLoading} />
          </div>
          <div className="lg:sticky lg:top-24">
            <ResultDisplay
              isLoading={isLoading}
              generatedImage={generatedImage}
              error={error}
              isGeneratingCaption={isGeneratingCaption}
              onGenerateCaption={handleGenerateCaption}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;