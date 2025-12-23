import React, { useState } from 'react';
import { Icons } from './Icons';
import { Button } from './Button';

interface ResultViewerProps {
  originalImage: string;
  enhancedImage: string | null;
  isProcessing: boolean;
  onClose: () => void;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ 
  originalImage, 
  enhancedImage, 
  isProcessing,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'original' | 'enhanced' | 'split'>('split');

  const handleDownload = () => {
    if (!enhancedImage) return;
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = `lumina-enhanced-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div className="flex items-center space-x-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'original' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Original
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'split' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setViewMode('enhanced')}
            disabled={!enhancedImage}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'enhanced' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200 disabled:opacity-50'}`}
          >
            Enhanced
          </button>
        </div>

        <div className="flex items-center space-x-2">
           <Button variant="ghost" size="sm" onClick={onClose} title="Close Image">
            <Icons.Close className="w-4 h-4" />
          </Button>
          {enhancedImage && (
            <Button variant="primary" size="sm" onClick={handleDownload}>
              <Icons.Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Image Area */}
      <div className="flex-1 relative bg-zinc-950/50 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(45deg, #3f3f46 25%, transparent 25%), linear-gradient(-45deg, #3f3f46 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #3f3f46 75%), linear-gradient(-45deg, transparent 75%, #3f3f46 75%)',
               backgroundSize: '20px 20px',
               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
             }}>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
          
          {/* View: Original Only */}
          {viewMode === 'original' && (
             <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          )}

          {/* View: Enhanced Only */}
          {viewMode === 'enhanced' && enhancedImage && (
             <img src={enhancedImage} alt="Enhanced" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          )}

          {/* View: Split / Processing Placeholder */}
          {viewMode === 'enhanced' && !enhancedImage && isProcessing && (
             <div className="text-zinc-400 animate-pulse">Generating preview...</div>
          )}

          {viewMode === 'split' && (
            <div className="flex flex-col md:flex-row w-full h-full gap-4">
              <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/50 rounded-lg border border-zinc-800/50 p-2 relative">
                <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">ORIGINAL</span>
                <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/50 rounded-lg border border-zinc-800/50 p-2 relative">
                <span className="absolute top-4 left-4 bg-indigo-600/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">AI ENHANCED</span>
                {enhancedImage ? (
                  <img src={enhancedImage} alt="Enhanced" className="max-w-full max-h-full object-contain rounded" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                    {isProcessing ? (
                       <Icons.Sparkles className="w-8 h-8 animate-bounce mb-2 text-indigo-500" />
                    ) : (
                       <Icons.Image className="w-8 h-8 mb-2 opacity-50" />
                    )}
                    <span className="text-sm">{isProcessing ? 'Enhancing...' : 'Waiting for enhancement'}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};