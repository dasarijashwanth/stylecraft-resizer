import React from 'react';
import SizeCard from './SizeCard';
import { CATEGORIES } from '../constants/sizes';

export default function SizeGrid({
  sizes,
  previews,
  estimatedSizes,
  selectedSizes,
  onToggleSelect,
  onDownload,
  onPreview,
  onSaveToDrive,
  savingToDriveIds = new Set(),
  isGenerating,
  ultraClarity,
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-col gap-10">
      {CATEGORIES.map((category) => {
        const categorySizes = sizes.filter((s) => s.category === category);
        
        return (
          <div key={category} className="flex flex-col gap-4">
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">
                {category}
              </h2>
              <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 flex-1" />
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded-full font-mono shrink-0">
                {categorySizes.length} sizes
              </span>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categorySizes.map((size) => {
                const isSelected = selectedSizes.has(size.id);
                return (
                  <SizeCard
                    key={size.id}
                    size={size}
                    previewSrc={previews[size.id]}
                    estimatedSize={estimatedSizes[size.id]}
                    isSelected={isSelected}
                    onToggleSelect={() => onToggleSelect(size.id)}
                    onDownload={onDownload}
                    onPreview={onPreview}
                    onSaveToDrive={onSaveToDrive}
                    isSavingToDrive={savingToDriveIds.has(size.id)}
                    isGenerating={isGenerating}
                    ultraClarity={ultraClarity}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
