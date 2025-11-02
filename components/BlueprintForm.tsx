
import React from 'react';
import { PersonaDNA } from '../types';
import PhotoIcon from './icons/PhotoIcon';

interface BlueprintFormProps {
  personaDNA: PersonaDNA;
  setPersonaDNA: React.Dispatch<React.SetStateAction<PersonaDNA>>;
  referenceImagePreview: string | null;
  setReferenceImage: (file: File | null) => void;
  setReferenceImagePreview: (preview: string | null) => void;
}

const AESTHETIC_OPTIONS = ["grainy", "vintage", "cinematic", "casual handheld", "soft-focus"];

const BlueprintForm: React.FC<BlueprintFormProps> = ({
  personaDNA,
  setPersonaDNA,
  referenceImagePreview,
  setReferenceImage,
  setReferenceImagePreview
}) => {
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDNAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonaDNA(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
      <h2 className="text-xl font-semibold mb-4 text-brand-primary">1. Influencer Blueprint</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="reference-image-upload" className="block text-sm font-medium text-brand-text-muted mb-2">Reference Face/Body</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-border border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {referenceImagePreview ? (
                <img src={referenceImagePreview} alt="Reference Preview" className="mx-auto h-24 w-24 object-cover rounded-full" />
              ) : (
                <PhotoIcon className="mx-auto h-12 w-12 text-brand-text-muted" />
              )}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="reference-image-upload" className="relative cursor-pointer bg-brand-surface rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="reference-image-upload" name="reference-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
                <p className="pl-1 text-brand-text-muted">or drag and drop</p>
              </div>
              <p className="text-xs text-brand-text-muted">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="personality" className="block text-sm font-medium text-brand-text-muted">Personality & Vibe</label>
          <input
            type="text"
            name="personality"
            id="personality"
            value={personaDNA.personality}
            onChange={handleDNAChange}
            className="mt-1 block w-full bg-brand-bg border-brand-border rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2"
            placeholder="e.g., chaotic cozy artist"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-text-muted">Aesthetic Tone</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AESTHETIC_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setPersonaDNA(prev => ({ ...prev, aesthetic: opt }))}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  personaDNA.aesthetic === opt
                    ? 'bg-brand-primary text-brand-bg font-semibold'
                    : 'bg-brand-bg hover:bg-brand-border text-brand-text-muted'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="environment" className="block text-sm font-medium text-brand-text-muted">Primary Environment</label>
          <input
            type="text"
            name="environment"
            id="environment"
            value={personaDNA.environment}
            onChange={handleDNAChange}
            className="mt-1 block w-full bg-brand-bg border-brand-border rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2"
            placeholder="e.g., cozy room, nature"
          />
        </div>
      </div>
    </div>
  );
};

export default BlueprintForm;
