import React, { useRef, useState } from 'react';
import { Icons } from './Icons';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
        flex flex-col items-center justify-center text-center p-12 min-h-[400px]
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      
      <div className="bg-zinc-800 p-4 rounded-full mb-6 shadow-xl">
        <Icons.Upload className="w-8 h-8 text-indigo-400" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        Upload your photo
      </h3>
      <p className="text-zinc-400 mb-8 max-w-sm">
        Drag and drop your image here, or click to browse. 
        Supports JPG, PNG, WEBP.
      </p>

      <button
        onClick={() => inputRef.current?.click()}
        className="px-6 py-3 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-100 transition-colors"
      >
        Select Image
      </button>
    </div>
  );
};