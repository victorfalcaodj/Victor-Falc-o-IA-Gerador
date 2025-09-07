
import React, { useState, useCallback } from 'react';
import type { Mode, CreateFunction, EditFunction, ImageData } from './types';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import { generateContent } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<Mode>('create');
  const [createFunction, setCreateFunction] = useState<CreateFunction>('free');
  const [editFunction, setEditFunction] = useState<EditFunction>('add-remove');
  const [image1, setImage1] = useState<ImageData | null>(null);
  const [image2, setImage2] = useState<ImageData | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    // Validation
    if (!prompt) {
      setError('Por favor, descreva sua ideia.');
      setIsLoading(false);
      return;
    }
    if (mode === 'edit' && !image1) {
        setError('Por favor, envie uma imagem para editar.');
        setIsLoading(false);
        return;
    }
    if (mode === 'edit' && editFunction === 'compose' && !image2) {
        setError('A função "Unir" requer duas imagens.');
        setIsLoading(false);
        return;
    }


    try {
      const result = await generateContent({
        prompt,
        mode,
        createFunction,
        editFunction,
        image1,
        image2,
      });
      setGeneratedImage(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Ocorreu um erro: ${err.message}`);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, mode, createFunction, editFunction, image1, image2]);

  const clearImages = () => {
    setImage1(null);
    setImage2(null);
  };
  
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    clearImages();
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-gray-900 text-white">
      <LeftPanel
        prompt={prompt}
        setPrompt={setPrompt}
        mode={mode}
        setMode={handleModeChange}
        createFunction={createFunction}
        setCreateFunction={setCreateFunction}
        editFunction={editFunction}
        setEditFunction={setEditFunction}
        image1={image1}
        setImage1={setImage1}
        image2={image2}
        setImage2={setImage2}
      />
      <RightPanel
        generatedImage={generatedImage}
        isLoading={isLoading}
        error={error}
        onGenerate={handleGenerate}
      />
    </div>
  );
};

export default App;
