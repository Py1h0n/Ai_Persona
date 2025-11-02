
import React from 'react';
import { SceneDetails } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface SceneFormProps {
  sceneDetails: SceneDetails;
  setSceneDetails: React.Dispatch<React.SetStateAction<SceneDetails>>;
  handleGenerate: () => void;
  isLoading: boolean;
  hasReferenceImage: boolean;
}

const SceneForm: React.FC<SceneFormProps> = ({
  sceneDetails,
  setSceneDetails,
  handleGenerate,
  isLoading,
  hasReferenceImage,
}) => {
    
  const handleSceneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSceneDetails(prev => ({ ...prev, [name]: value }));
  };
    
  return (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
      <h2 className="text-xl font-semibold mb-4 text-brand-secondary">2. Scene Realism</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-brand-text-muted">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={sceneDetails.location}
            onChange={handleSceneChange}
            className="mt-1 block w-full bg-brand-bg border-brand-border rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm p-2"
            placeholder="e.g., rainy day in Seoul"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-brand-text-muted">Time of Day</label>
          <input
            type="text"
            name="time"
            id="time"
            value={sceneDetails.time}
            onChange={handleSceneChange}
            className="mt-1 block w-full bg-brand-bg border-brand-border rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm p-2"
            placeholder="e.g., morning, golden hour"
          />
        </div>
        <div>
          <label htmlFor="activity" className="block text-sm font-medium text-brand-text-muted">Activity</label>
          <input
            type="text"
            name="activity"
            id="activity"
            value={sceneDetails.activity}
            onChange={handleSceneChange}
            className="mt-1 block w-full bg-brand-bg border-brand-border rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm p-2"
            placeholder="e.g., journaling quietly"
          />
        </div>
        <div>
          <label htmlFor="mood" className="block text-sm font-medium text-brand-text-muted">Mood</label>
          <input
            type="text"
            name="mood"
            id="mood"
            value={sceneDetails.mood}
            onChange={handleSceneChange}
            className="mt-1 block w-full bg-brand-bg border-brand-border rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm p-2"
            placeholder="e.g., subtle melancholy smile"
          />
        </div>
        
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || !hasReferenceImage}
          className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-brand-bg bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate Persona
            </>
          )}
        </button>
        {!hasReferenceImage && <p className="text-center text-xs text-yellow-400/80 mt-2">Please upload a reference image to begin.</p>}
      </div>
    </div>
  );
};

export default SceneForm;
