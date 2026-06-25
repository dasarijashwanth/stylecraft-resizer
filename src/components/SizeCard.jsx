import React from 'react';
import { Download, Check, ShieldCheck, Eye, Cloud } from 'lucide-react';
import { formatBytes } from '../utils/imageProcessors';

export default function SizeCard({
  size,
  previewSrc,
  estimatedSize,
  isSelected,
  onToggleSelect,
  onDownload,
  onPreview,
  onSaveToDrive,
  isSavingToDrive = false,
  isGenerating,
  ultraClarity = true,
  sizingMode = 'fit',
}) {
  const getObjectFitStyle = () => {
    switch (sizingMode) {
      case 'fit':
        return 'contain';
      case 'fill':
        return 'cover';
      case 'stretch':
        return 'fill';
      case 'background_stretch':
      case 'enlarge_to_frame':
        return 'cover';
      default:
        return 'contain';
    }
  };

  return (
    <div
      onClick={onToggleSelect}
      className={`group relative flex flex-col bg-white dark:bg-zinc-900 border rounded-3xl p-4 cursor-pointer select-none transition-all duration-300 hover-rainbow-card ${
        isSelected
          ? 'border-indigo-650 ring-1 ring-indigo-500/20 shadow-md shadow-indigo-500/5 dark:shadow-indigo-550/5'
          : 'border-zinc-200 dark:border-zinc-850 shadow-sm'
      }`}
    >
      {/* Checkbox badge */}
      <div
        className={`absolute top-3.5 left-3.5 z-10 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 ${
          isSelected
            ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-650 text-white scale-105 shadow-md shadow-indigo-500/25'
            : 'bg-white/80 dark:bg-zinc-950/80 border-zinc-350 dark:border-zinc-700 text-transparent'
        }`}
      >
        <Check className="h-3.5 w-3.5 stroke-[3px]" />
      </div>

      {/* Image Preview Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 overflow-hidden flex items-center justify-center shrink-0 mb-4 group-hover:scale-[1.01] transition-transform duration-300 p-2">
        {previewSrc ? (
          <div 
            style={{ 
              width: `${size.width}px`, 
              height: `${size.height}px`,
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: `${size.width} / ${size.height}`
            }}
            className="relative overflow-hidden flex items-center justify-center rounded-lg"
          >
            <img
              src={previewSrc}
              alt={size.name}
              style={{
                objectFit: getObjectFitStyle(),
                width: '100%',
                height: '100%'
              }}
              className="transition-opacity duration-300"
              loading="lazy"
            />
            {/* Hover preview zoom banner */}
            <div 
              onClick={(e) => {
                e.stopPropagation(); // Prevent checkmark toggle
                onPreview(size);
              }}
              className="absolute inset-0 bg-zinc-950/50 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white cursor-pointer"
            >
              <div className="p-2.5 bg-white/20 rounded-full">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase">Preview Detail</span>
            </div>
          </div>
        ) : (
          /* Loading Skeleton */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-1 flex-wrap mb-1">
            <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {size.category}
            </h4>
            {ultraClarity && (
              <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 px-1.5 py-0.2 rounded border border-emerald-100/50 dark:border-emerald-900/30 flex items-center gap-0.5 select-none">
                <ShieldCheck className="w-2.5 h-2.5" />
                Clarity Verified
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">
            {size.name}
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono font-medium">
            {size.width} × {size.height} px
          </p>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 font-mono">
            {estimatedSize ? `~${formatBytes(estimatedSize)}` : '--'}
          </span>
          
          <div className="flex items-center gap-1.5">
            {/* Preview Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Avoid checkbox toggle
                onPreview(size);
              }}
              disabled={isGenerating || !previewSrc}
              className={`p-2 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isGenerating || !previewSrc
                  ? 'bg-zinc-150 dark:bg-zinc-850 text-zinc-450 dark:text-zinc-650 cursor-not-allowed'
                  : 'bg-zinc-50 hover:bg-indigo-50 text-zinc-700 hover:text-indigo-650 dark:bg-zinc-850 dark:hover:bg-indigo-950/40 dark:text-zinc-300 dark:hover:text-indigo-400 border border-zinc-200/50 hover:border-indigo-100 dark:border-zinc-800 dark:hover:border-indigo-900/40'
              }`}
              title="Preview details"
              aria-label="Preview size"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>

            {/* Save to Drive Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Avoid checkbox toggle
                onSaveToDrive(size);
              }}
              disabled={isGenerating || !previewSrc || isSavingToDrive}
              className={`p-2 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isGenerating || !previewSrc || isSavingToDrive
                  ? 'bg-zinc-150 dark:bg-zinc-850 text-zinc-450 dark:text-zinc-650 cursor-not-allowed'
                  : 'bg-zinc-50 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-650 dark:bg-zinc-850 dark:hover:bg-emerald-950/40 dark:text-zinc-300 dark:hover:text-emerald-400 border border-zinc-200/50 hover:border-emerald-100 dark:border-zinc-800 dark:hover:border-emerald-900/40'
              }`}
              title={isSavingToDrive ? "Saving to Google Drive..." : "Save to Google Drive"}
              aria-label="Save to Google Drive"
            >
              {isSavingToDrive ? (
                <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Cloud className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Avoid checkbox toggle
                onDownload(size);
              }}
              disabled={isGenerating || !previewSrc}
              className={`p-2 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isGenerating || !previewSrc
                  ? 'bg-zinc-150 dark:bg-zinc-850 text-zinc-450 dark:text-zinc-650 cursor-not-allowed'
                  : 'bg-zinc-50 hover:bg-indigo-50 text-zinc-700 hover:text-indigo-650 dark:bg-zinc-850 dark:hover:bg-indigo-950/40 dark:text-zinc-300 dark:hover:text-indigo-400 border border-zinc-200/50 hover:border-indigo-100 dark:border-zinc-800 dark:hover:border-indigo-900/40'
              }`}
              title="Download this size"
              aria-label="Download size"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
