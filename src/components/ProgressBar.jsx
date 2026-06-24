import React from 'react';

export default function ProgressBar({ current, total, statusMessage }) {
  if (current === 0 && !statusMessage) return null;

  const percentage = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 transition-all duration-300 animate-pulse">
      <div className="bg-gradient-to-r from-indigo-50/80 to-violet-50/80 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600 dark:bg-indigo-400"></span>
            </div>
            <span className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
              {statusMessage || 'Processing Resizes...'}
            </span>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono shrink-0">
            {current} of {total} sizes ({percentage}%)
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-3 bg-zinc-200/50 dark:bg-zinc-800 rounded-full overflow-hidden p-[1.5px] border border-zinc-300/10">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300 ease-out shadow-lg shadow-indigo-500/25 relative"
            style={{ width: `${percentage}%` }}
          >
            {/* Glossy shine */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0)_100%)] w-1/2 h-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
