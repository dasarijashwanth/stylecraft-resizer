import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, LayoutGrid, CheckSquare, BarChart } from 'lucide-react';

export default function AdminPanel({
  customSizes,
  onAddCustomSize,
  onRemoveCustomSize,
  totalResizesCount = 128,
}) {
  const [name, setName] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [category, setCategory] = useState('Social Media');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !width || !height) {
      setError('Please fill in all details.');
      return;
    }
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
      setError('Dimensions must be positive integers.');
      return;
    }

    const newSize = {
      id: `custom_${Date.now()}`,
      name,
      width: w,
      height: h,
      category,
      isCustom: true,
    };

    onAddCustomSize(newSize);
    
    // Reset form
    setName('');
    setWidth('');
    setHeight('');
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 transition-all duration-300 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <ShieldCheck className="h-5 w-5 text-rose-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Administrator Command Center
          </h3>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BarChart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Resizes Processed</span>
              <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5 block">{totalResizesCount}</span>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-center gap-3">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 rounded-xl">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Standard Sizes</span>
              <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5 block">29 presets</span>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Custom Presets</span>
              <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5 block">{customSizes.length} active</span>
            </div>
          </div>
        </div>

        {/* Action Layout: Form Left, List Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Form to Add Preset */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 bg-zinc-55/25 dark:bg-zinc-950/20 rounded-2xl border border-zinc-200/50 dark:border-zinc-850">
            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Add Custom Dimension Preset
            </h4>

            {error && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-xl text-[11px] font-semibold">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase block mb-1">Preset Name</label>
                <input
                  type="text"
                  placeholder="e.g. IG Story Alternate"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 text-zinc-800 dark:text-zinc-250"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase block mb-1">Width (px)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 text-zinc-800 dark:text-zinc-250 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase block mb-1">Height (px)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 text-zinc-800 dark:text-zinc-250 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 text-zinc-800 dark:text-zinc-250 cursor-pointer"
                >
                  <option value="Social Media">Social Media</option>
                  <option value="Print">Print Layout</option>
                  <option value="Web/App">Web / App</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-1.5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Preset
            </button>
          </form>

          {/* List of Custom Presets */}
          <div className="flex flex-col gap-4 self-stretch">
            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Manage Custom Presets ({customSizes.length})
            </h4>

            {customSizes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-zinc-250 dark:border-zinc-800 rounded-2xl text-zinc-400">
                <LayoutGrid className="w-6 h-6 stroke-[1.5px] opacity-40 mb-1" />
                <span className="text-[11px] font-medium leading-relaxed">No custom presets added yet.<br />Use the form to create new sizes.</span>
              </div>
            ) : (
              <div className="max-h-[260px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/30 dark:bg-zinc-950/20 divide-y divide-zinc-200 dark:divide-zinc-800">
                {customSizes.map((size) => (
                  <div key={size.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-zinc-850 dark:text-zinc-200">{size.name}</span>
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono ml-2">
                        {size.width} × {size.height} px
                      </span>
                      <span className="text-[9px] block text-zinc-400 dark:text-zinc-500 tracking-wide mt-0.5">
                        {size.category}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveCustomSize(size.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                      title="Delete preset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
