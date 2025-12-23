import React, { useState, useCallback } from 'react';
import { AppStatus } from './types';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { ResultViewer } from './components/ResultViewer';
import { enhanceImage } from './services/geminiService';
import { Icons } from './components/Icons';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback((base64: string, type: string) => {
    setOriginalImage(base64);
    setMimeType(type);
    setEnhancedImage(null);
    setStatus(AppStatus.PREVIEW);
    setError(null);
  }, []);

  const handleEnhance = async (prompt: string) => {
    if (!originalImage || !mimeType) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const result = await enhanceImage(originalImage, mimeType, prompt);
      setEnhancedImage(result);
      setStatus(AppStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process image.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 selection:bg-indigo-500/30">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icons.Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Lumina Enhance
            </span>
          </div>
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Powered by Gemini
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center text-red-400">
            <Icons.Zap className="w-5 h-5 mr-3" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto hover:text-white">
              <Icons.Close className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View Switching */}
        {status === AppStatus.IDLE ? (
          <div className="flex flex-col items-center justify-center flex-1 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Transform your photos with <br />
                <span className="text-indigo-500">Professional AI</span>
              </h1>
              <p className="text-lg text-zinc-400">
                Upload any image and use our advanced Gemini-powered engine to enhance lighting, fix colors, or apply creative styles instantly.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            {/* Left: Controls */}
            <div className="lg:col-span-1 order-2 lg:order-1 h-full">
              <ControlPanel 
                onEnhance={handleEnhance} 
                isProcessing={status === AppStatus.PROCESSING} 
              />
            </div>
            
            {/* Right: Preview */}
            <div className="lg:col-span-2 order-1 lg:order-2 h-full">
              <ResultViewer 
                originalImage={originalImage!}
                enhancedImage={enhancedImage}
                isProcessing={status === AppStatus.PROCESSING}
                onClose={handleReset}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;