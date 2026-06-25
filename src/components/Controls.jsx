import React from 'react';
import { Settings, Sliders, CheckSquare, Square, CheckCircle, XCircle, ShieldCheck, Cpu, Shrink, Expand, Move, Sparkles, Maximize } from 'lucide-react';
import { CATEGORIES } from '../constants/sizes';

const COLOR_PRESETS = [
  '#ffffff', // White
  '#000000', // Black
  '#f4f4f5', // Zinc 100
  '#3b82f6', // Blue 500
  '#ef4444', // Red 500
  '#10b981', // Emerald 500
  '#f59e0b', // Amber 500
];

export default function Controls({
  bgType,
  setBgType,
  bgColor,
  setBgColor,
  exportFormat,
  setExportFormat,
  quality,
  setQuality,
  sizeCounts,
  onSelectAll,
  onDeselectAll,
  onToggleCategory,
  aiStyle = 'mirror',
  setAiStyle,
  aiPrompt = '',
  setAiPrompt,
  onGenerateAiBackground,
  isGeneratingAiImage = false,
  documentMode = true,
  sizingMode = 'fit',
  setSizingMode,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 transition-all duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Settings className="h-4.5 w-4.5 text-indigo-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Configuration Dashboard
            </h3>
          </div>
          {/* Document indicator */}
          {documentMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 animate-pulse">
              <ShieldCheck className="h-3.5 w-3.5" />
              Clarity Document Mode Active
            </div>
          )}
        </div>

        {/* Configurations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Format and Quality */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Sliders className="h-4.5 w-4.5 text-zinc-400" />
              <span className="text-sm font-medium">Export Settings</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="image/png">PNG (Lossless)</option>
                  <option value="image/jpeg">JPEG</option>
                </select>
              </div>
            </div>

            {/* Clarity resampling engine info banner (since other resampling options are removed) */}
            <div className="flex items-center gap-2.5 p-3.5 bg-indigo-50/10 dark:bg-indigo-950/10 border border-indigo-500/10 rounded-2xl mt-1">
              <Cpu className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-zinc-750 dark:text-zinc-300">Ultra-Sharp Resampling Engine</span>
                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-tight mt-0.5">High-fidelity Hermite curve resampling is active.</span>
              </div>
            </div>

            {/* Sizing Mode Selection */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                Sizing Mode
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'fit', label: 'FIT', icon: Shrink },
                  { id: 'fill', label: 'FILL', icon: Expand },
                  { id: 'stretch', label: 'STRETCH', icon: Move },
                  { id: 'background_stretch', label: 'BG STRETCH', icon: Sparkles },
                  { id: 'enlarge_to_frame', label: 'ENLARGE', icon: Maximize },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isActive = sizingMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSizingMode(mode.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer select-none gap-1 ${
                        isActive
                          ? 'bg-indigo-650/10 dark:bg-indigo-950/40 border-indigo-500 text-indigo-650 dark:text-indigo-400 shadow-sm'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-[9px] font-extrabold tracking-wider">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Dynamic Sizing Mode Description */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left mt-1">
                <p className="text-[11px] text-zinc-650 dark:text-zinc-400 leading-normal font-medium">
                  {
                    sizingMode === 'fit' ? 'FIT: Scales the generated image to fit inside the selected frame dimensions while maintaining original aspect ratio. Adds padding/letterbox on the shorter sides if needed.' :
                    sizingMode === 'fill' ? 'FILL: Scales the image to completely fill the frame. Maintains aspect ratio but crops the overflow edges. No empty space visible.' :
                    sizingMode === 'stretch' ? 'STRETCH: Forces the image to exactly match the target width and height. Does NOT preserve aspect ratio — image may look squished or wide.' :
                    sizingMode === 'background_stretch' ? 'BACKGROUND STRETCH: Keeps the main subject of the image centered and at its original size. Extends/outpaints the background outward to fill the new frame dimensions.' :
                    sizingMode === 'enlarge_to_frame' ? 'ENLARGE TO FRAME: Upscales the subject/content of the image to fill the frame completely. Background is stretched or regenerated to match.' : ''
                  }
                </p>
                {sizingMode === 'background_stretch' && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Best with landscape/portrait images that have a clear subject
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Background Filling */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-zinc-300 tracking-wide">
              Leftover Canvas Fill (Smart Padding)
            </span>

            <div className="flex flex-col gap-3">
              {/* Tabs */}
              <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setBgType('blur')}
                  className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-w-[80px] ${
                    bgType === 'blur'
                      ? 'bg-zinc-850 text-yellow-500 shadow-md border border-zinc-800'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Smart Blur
                </button>
                <button
                  type="button"
                  onClick={() => setBgType('ai')}
                  className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-w-[80px] flex items-center justify-center gap-1.5 ${
                    bgType === 'ai'
                      ? 'bg-zinc-850 text-indigo-400 shadow-md border border-zinc-800'
                      : 'text-zinc-400 hover:text-indigo-400'
                  }`}
                  title="AI content-aware texture synthesis: seamless-fills leftover margin style."
                >
                  <Cpu className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  AI Smart Extend
                </button>
                <button
                  type="button"
                  onClick={() => setBgType('color')}
                  className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer min-w-[80px] ${
                    bgType === 'color'
                      ? 'bg-zinc-850 text-yellow-500 shadow-md border border-zinc-800'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Solid Color
                </button>
              </div>

              {/* Color picker area */}
              {bgType === 'color' && (
                <div className="flex items-center gap-3 animate-fadeIn py-1">
                  {/* Preset Colors */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBgColor(preset)}
                        className={`w-6 h-6 rounded-full border border-white/10 relative transition-transform hover:scale-110 cursor-pointer`}
                        style={{ backgroundColor: preset }}
                      >
                        {bgColor.toLowerCase() === preset && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                preset === '#ffffff' || preset === '#f4f4f5' ? 'bg-black' : 'bg-white'
                              }`}
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Color Picker Input */}
                  <div className="flex items-center gap-2 border-l border-zinc-800 pl-3 shrink-0">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border-0 p-0 overflow-hidden cursor-pointer shrink-0 bg-transparent"
                    />
                    <input
                      type="text"
                      maxLength={7}
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-semibold text-zinc-300 uppercase focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
                    />
                  </div>
                </div>
              )}

              {/* AI generator tool area */}
              {bgType === 'ai' && (
                <div className="flex flex-col gap-3 p-3 bg-zinc-950/60 border border-indigo-950/40 rounded-2xl animate-fadeIn ai-panel-glow">
                  <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1.5">
                      AI Backdrop Engine Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'mirror', label: 'Content-Aware Mirror' },
                        { id: 'ambient', label: 'AI Ambient Aura' },
                        { id: 'gilded', label: 'AI Gilded Luxury' },
                        { id: 'neon', label: 'AI Cyberpunk Grid' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAiStyle(item.id)}
                          className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer text-center leading-tight ${
                            aiStyle === item.id
                              ? 'bg-indigo-950/60 border-indigo-500/80 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                        AI Prompt Guidance / Style Tags
                      </label>
                      <span className="text-[9px] text-zinc-500">Local Latent Synthesis active</span>
                    </div>

                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        maxLength={200}
                        placeholder="e.g. vintage film grain, high luxury ambient gold glow..."
                        className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-250 placeholder-zinc-550 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={onGenerateAiBackground}
                        disabled={isGeneratingAiImage || !aiPrompt.trim()}
                        className="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                      >
                        {isGeneratingAiImage ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Cpu className="w-3.5 h-3.5" />
                        )}
                        <span>{isGeneratingAiImage ? 'Generating...' : 'Generate'}</span>
                      </button>
                    </div>

                    {/* Quick Tags presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Clean Studio', prompt: 'clean smooth backdrop, studio light' },
                        { label: 'Film Matte Grain', prompt: 'matte film noise, dark luxury grain' },
                        { label: 'Luxury Gilded', prompt: 'gilded golden accents, warm luxury ambient light' },
                        { label: 'Cyberpunk Glow', prompt: 'neon pink and cyan glow, tech digital grid' },
                      ].map((tag) => (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => setAiPrompt(tag.prompt)}
                          className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-indigo-900/60 rounded-full text-[9px] font-semibold text-zinc-400 hover:text-indigo-300 transition-all cursor-pointer"
                        >
                          + {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Selection Controls */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <CheckSquare className="h-4.5 w-4.5 text-zinc-400" />
            <span className="text-sm font-medium">Dimension Selection</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Bulk actions */}
            <button
              onClick={onSelectAll}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 transition-all cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Select All
            </button>
            <button
              onClick={onDeselectAll}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
            >
              <XCircle className="h-3.5 w-3.5" />
              Clear Selection
            </button>

            {/* Category toggles */}
            <div className="h-4 border-r border-zinc-200 dark:border-zinc-800 hidden sm:block" />

            {CATEGORIES.map((cat) => {
              const selectedCount = sizeCounts[cat]?.selected || 0;
              const totalCount = sizeCounts[cat]?.total || 0;
              const isAllSelected = selectedCount === totalCount;
              const isSomeSelected = selectedCount > 0 && selectedCount < totalCount;

              return (
                <button
                  key={cat}
                  onClick={() => onToggleCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                    isAllSelected
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                      : isSomeSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700'
                      : 'bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-400'
                  }`}
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-3.5 w-3.5 shrink-0" />
                  ) : isSomeSelected ? (
                    <div className="w-3.5 h-3.5 rounded border border-current flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-0.5 bg-current" />
                    </div>
                  ) : (
                    <Square className="h-3.5 w-3.5 shrink-0" />
                  )}
                  {cat}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isAllSelected 
                      ? 'bg-white/20 dark:bg-black/10' 
                      : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-850'
                  }`}>
                    {selectedCount}/{totalCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
