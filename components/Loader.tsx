
import React, { useState, useEffect } from 'react';

const messages = [
  "Crafting the perfect candid moment...",
  "Adjusting lighting and shadows...",
  "Adding a touch of realistic blur...",
  "Developing emotional resonance...",
  "Almost there, finalizing the details...",
];

const Loader: React.FC = () => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-brand-surface rounded-lg border border-brand-border p-8 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      <h3 className="text-xl font-semibold mt-6 text-brand-text">Generating Persona...</h3>
      <p className="mt-2 text-brand-text-muted transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default Loader;
