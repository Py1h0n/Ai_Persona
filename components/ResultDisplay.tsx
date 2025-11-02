// FIX: Implemented the ResultDisplay component to show the generated image or loading/error states.
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import Loader from './Loader';
import DownloadIcon from './icons/DownloadIcon';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: GeneratedImage | null;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    if (generatedImage?.prompt) {
      navigator.clipboard.writeText(generatedImage.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedImage?.imageUrl) {
      const link = document.createElement('a');
      link.href = generatedImage.imageUrl;
      link.download = 'nanopersona-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-red-500/10 rounded-lg border border-red-500/30 p-8 text-center">
            <h3 className="text-xl font-semibold text-red-400">Generation Failed</h3>
            <p className="mt-2 text-red-400/80 max-w-md">{error}</p>
        </div>
    );
  }

  if (!generatedImage) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-brand-surface rounded-lg border border-brand-border p-8 text-center">
            <h3 className="text-xl font-semibold text-brand-text">Your Persona Awaits</h3>
            <p className="mt-2 text-brand-text-muted">Fill out the blueprint and scene details to generate your image.</p>
        </div>
    );
  }

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border overflow-hidden">
        <div className="relative group">
            <img src={generatedImage.imageUrl} alt="Generated Persona" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white text-sm font-medium"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download
                </button>
            </div>
        </div>
        <div className="p-4 bg-brand-surface/50">
            <label className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider">Generation Prompt</label>
            <div className="relative mt-2">
                <p className="text-sm text-brand-text bg-brand-bg border border-brand-border rounded-md p-3 pr-10 whitespace-pre-wrap font-mono">
                    {generatedImage.prompt}
                </p>
                <button onClick={handleCopyPrompt} className="absolute top-2 right-2 p-1.5 rounded-md text-brand-text-muted hover:bg-brand-bg hover:text-brand-text">
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    </div>
  );
};

export default ResultDisplay;
