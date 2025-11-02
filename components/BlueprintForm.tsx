import React, { useState } from 'react';
import { PersonaDNA } from '../types';
import PhotoIcon from './icons/PhotoIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import XCircleIcon from './icons/XCircleIcon';

interface BlueprintFormProps {
  personaDNA: PersonaDNA;
  setPersonaDNA: React.Dispatch<React.SetStateAction<PersonaDNA>>;
  referenceImagePreview: string | null;
  setReferenceImage: (file: File | null) => void;
  setReferenceImagePreview: (preview: string | null) => void;
  referenceLocationImagePreview: string | null;
  setReferenceLocationImage: (file: File | null) => void;
  setReferenceLocationImagePreview: (preview: string | null) => void;
  referenceItemsImagePreview: string | null;
  setReferenceItemsImage: (file: File | null) => void;
  setReferenceItemsImagePreview: (preview: string | null) => void;
}

const AESTHETIC_OPTIONS = ["grainy", "vintage", "cinematic", "casual handheld", "soft-focus"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ImageUploader: React.FC<{
  id: string;
  label: string;
  preview: string | null;
  onFileChange: (file: File | null) => void;
  onPreviewChange: (preview: string | null) => void;
}> = ({ id, label, preview, onFileChange, onPreviewChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File | null) => {
    setError(null);
    if (!file) {
      onFileChange(null);
      onPreviewChange(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large (max 10MB).");
      onFileChange(null);
      onPreviewChange(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError("Invalid file type. Please upload an image.");
      onFileChange(null);
      onPreviewChange(null);
      return;
    }
    
    setIsUploading(true);
    onFileChange(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      onPreviewChange(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file || null);
    // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    processFile(file || null);
  };
  
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      processFile(null);
  }

  const dropzoneClasses = `mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200 ${
    isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-border'
  }`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-text-muted mb-2">{label}</label>
      <div 
        className={dropzoneClasses}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          {preview ? (
            <div className="relative group">
                <img src={preview} alt="Reference Preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
                <button 
                    onClick={handleRemove}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-brand-surface rounded-full p-1 text-brand-text-muted hover:text-white hover:bg-red-600/80 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center justify-center h-24">
              <SpinnerIcon className="h-12 w-12 text-brand-primary" />
            </div>
          ) : (
            <PhotoIcon className="mx-auto h-12 w-12 text-brand-text-muted" />
          )}

          {!isUploading && (
            <div className="flex text-sm">
              <label htmlFor={id} className="relative cursor-pointer bg-brand-surface rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none">
                <span>Upload a file</span>
                <input id={id} name={id} type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
              </label>
              <p className="pl-1 text-brand-text-muted">or drag and drop</p>
            </div>
          )}

          {error ? (
              <p className="text-xs text-red-400">{error}</p>
          ) : (
             <p className="text-xs text-brand-text-muted">PNG, JPG up to 10MB</p>
          )}

        </div>
      </div>
    </div>
  );
};


const BlueprintForm: React.FC<BlueprintFormProps> = ({
  personaDNA,
  setPersonaDNA,
  referenceImagePreview,
  setReferenceImage,
  setReferenceImagePreview,
  referenceLocationImagePreview,
  setReferenceLocationImage,
  setReferenceLocationImagePreview,
  referenceItemsImagePreview,
  setReferenceItemsImage,
  setReferenceItemsImagePreview
}) => {
  
  const handleDNAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonaDNA(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
      <h2 className="text-xl font-semibold mb-4 text-brand-primary">1. Influencer Blueprint</h2>
      
      <div className="space-y-6">
        <ImageUploader 
          id="reference-image-upload"
          label="Reference Face/Body (Required)"
          preview={referenceImagePreview}
          onFileChange={setReferenceImage}
          onPreviewChange={setReferenceImagePreview}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader 
              id="reference-location-upload"
              label="Location (Optional)"
              preview={referenceLocationImagePreview}
              onFileChange={setReferenceLocationImage}
              onPreviewChange={setReferenceLocationImagePreview}
            />
            <ImageUploader 
              id="reference-items-upload"
              label="Items/Clothing (Optional)"
              preview={referenceItemsImagePreview}
              onFileChange={setReferenceItemsImage}
              onPreviewChange={setReferenceItemsImagePreview}
            />
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