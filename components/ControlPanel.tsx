import React, { useState } from 'react';
import { Button } from './Button';
import { Icons } from './Icons';
import { PresetStyle } from '../types';

interface ControlPanelProps {
  onEnhance: (prompt: string) => void;
  isProcessing: boolean;
}

const PRESETS: PresetStyle[] = [
  {
    id: 'enhance',
    label: 'Auto Enhance',
    prompt: 'Improve image quality, fix lighting, balance colors, increase sharpness, and reduce noise while maintaining a natural look',
    iconName: 'Sparkles'
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    prompt: 'Apply cinematic color grading, teal and orange tones, dramatic lighting, high contrast, movie scene aesthetic',
    iconName: 'Aperture'
  },
  {
    id: 'studio',
    label: 'Studio Light',
    prompt: 'Professional studio lighting, soft shadows, perfect skin tones, clean background, high key photography',
    iconName: 'Camera'
  },
  {
    id: 'hdr',
    label: 'HDR Vivid',
    prompt: 'High dynamic range, vivid colors, deep details in shadows and highlights, architectural photography style',
    iconName: 'Sun'
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    prompt: 'Cyberpunk aesthetic, neon blue and pink lights, futuristic atmosphere, night scene, glowing elements',
    iconName: 'Zap'
  },
  {
    id: 'bw',
    label: 'B&W Art',
    prompt: 'Fine art black and white photography, high contrast, noir style, grain, moody atmosphere',
    iconName: 'Palette'
  }
];

export const ControlPanel: React.FC<ControlPanelProps> = ({ onEnhance, isProcessing }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>('enhance');

  const handlePresetClick = (preset: PresetStyle) => {
    setSelectedPreset(preset.id);
    setCustomPrompt(''); // Clear custom if preset selected
    onEnhance(preset.prompt);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      setSelectedPreset(null);
      onEnhance(customPrompt);
    }
  };

  // Helper to render icon dynamically
  const renderIcon = (name: string) => {
    const IconComponent = (Icons as any)[name];
    return IconComponent ? <IconComponent className="w-5 h-5 mb-2" /> : null;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Icons.Wand className="w-5 h-5 mr-2 text-indigo-400" />
          Quick Styles
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              disabled={isProcessing}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
                ${selectedPreset === preset.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }
              `}
            >
              {renderIcon(preset.iconName)}
              <span className="text-xs font-medium">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 pt-6 border-t border-zinc-800">
        <h2 className="text-lg font-semibold text-white mb-4">Custom Prompt</h2>
        <form onSubmit={handleCustomSubmit} className="relative">
          <textarea
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              if (selectedPreset) setSelectedPreset(null);
            }}
            placeholder="Describe how you want to change the image... (e.g. 'Make it look like a painting')"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-28"
          />
          <div className="mt-3 flex justify-end">
            <Button 
              type="submit" 
              disabled={!customPrompt.trim() || isProcessing}
              size="sm"
            >
              Generate
            </Button>
          </div>
        </form>
      </div>
      
      {isProcessing && (
        <div className="mt-auto p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
          <p className="text-indigo-300 text-sm animate-pulse">
            AI is enhancing your photo... This may take up to 10-15 seconds.
          </p>
        </div>
      )}
    </div>
  );
};