import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ onImageUpload }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file format. Please upload JPG or PNG.');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      alert('Image file size must be less than 30 MB.');
      return;
    }
    onImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative w-full aspect-video min-h-[280px] md:min-h-[340px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 group overflow-hidden ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/10 shadow-inner'
            : 'border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/20'
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute -inset-x-20 -inset-y-20 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png"
          onChange={handleChange}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className={`p-4 rounded-2xl transition-all duration-300 ${
            isDragActive 
              ? 'bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/20' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:scale-105 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
          }`}>
            <UploadCloud className="h-10 w-10 animate-bounce" />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Drag & drop your image here
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              or <span className="text-indigo-600 dark:text-indigo-400 font-medium underline underline-offset-2">browse files</span> from your device
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-850">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>PNG, JPG up to 30MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
