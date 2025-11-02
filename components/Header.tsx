
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface/50 border-b border-brand-border backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 md:px-8">
        <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
                NanoPersona
            </h1>
            <p className="text-sm text-brand-text-muted mt-1">Real emotions, unreal origins.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
