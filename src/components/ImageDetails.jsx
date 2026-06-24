import React from 'react';
import { RefreshCw, FileImage, ShieldAlert, Maximize2 } from 'lucide-react';
import { formatBytes } from '../utils/imageProcessors';

export default function ImageDetails({ file, dimensions, imageSrc, onReset }) {
  if (!file) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6 transition-all duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row items-center gap-6">
        
        {/* Thumbnail Preview container */}
        <div className="relative w-full md:w-44 aspect-square rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 overflow-hidden flex items-center justify-center group shrink-0">
          <img
            src={imageSrc}
            alt="Source Preview"
            className="max-w-full max-h-full object-contain p-2"
          />
        </div>

        {/* Info Grid */}
        <div className="flex-1 w-full flex flex-col justify-between self-stretch gap-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[280px] md:max-w-md" title={file.name}>
                {file.name}
              </h4>
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 transition-all duration-200 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Change Image
              </button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-850">
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Dimensions</span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Loading...'}
                </span>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-850">
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">File Size</span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block flex items-center gap-1">
                  <FileImage className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                  {formatBytes(file.size)}
                </span>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-850 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Format</span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block capitalize flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  {file.type.split('/')[1] || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          {dimensions && (dimensions.width < 3000 || dimensions.height < 3000) && (
            <div className="mt-4 p-3.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>Note: Image dimensions are less than 3000×3000 px. Upload high-res images for best results.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
