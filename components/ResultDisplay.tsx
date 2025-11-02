import React from 'react';
import { GenerationResult } from '../types';
import PhotoIcon from './icons/PhotoIcon';
import DownloadIcon from './icons/DownloadIcon';

interface ResultDisplayProps {
  result: GenerationResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${result.image}`;
    link.download = `nanopersona-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-brand-surface rounded-lg border-2 border-dashed border-brand-border text-brand-text-muted p-8">
        <PhotoIcon className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold">Your AI Persona Appears Here</h3>
        <p className="mt-2 text-center max-w-md">Define your influencer's blueprint, set the scene, and click 'Generate' to bring your NanoPersona to life.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border overflow-hidden">
      <div className="relative">
        <img
          src={`data:image/png;base64,${result.image}`}
          alt="Generated AI Influencer"
          className="w-full h-auto object-cover"
        />
        <button
            onClick={handleDownload}
            className="absolute top-4 right-4 bg-brand-bg/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-brand-primary hover:text-brand-bg transition-colors duration-200"
            aria-label="Download Image"
            title="Download Image"
        >
            <DownloadIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        {/* Caption */}
        <div className="p-4 bg-brand-bg rounded-lg">
          <p className="whitespace-pre-wrap font-light">{result.caption}</p>
        </div>
        
        {/* Prompt */}
        <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-brand-text-muted mb-2">NanoBanana Prompt</h3>
            <div className="p-4 bg-brand-bg rounded-lg">
                <p className="text-sm text-brand-text-muted font-mono leading-relaxed">{result.prompt}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;