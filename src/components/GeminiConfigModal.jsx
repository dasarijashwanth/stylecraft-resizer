import React, { useState } from 'react';
import { X, KeyRound, ExternalLink } from 'lucide-react';

export default function GeminiConfigModal({
  initialApiKey = '',
  onSave,
  onClose,
}) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError('Please enter a valid Gemini API Key.');
      return;
    }
    if (trimmed.length > 100) {
      setError('API Key is too long.');
      return;
    }
    
    // Alphanumeric Gemini AI Studio Keys usually start with AIzaSy
    const geminiRegex = /^AIzaSy[a-zA-Z0-9_\-]+$/;
    if (!geminiRegex.test(trimmed)) {
      setError('Invalid API Key format. Typical keys start with "AIzaSy".');
      return;
    }

    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slideIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Google Gemini Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            aria-label="Close settings"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            To use high-fidelity Gemini image models ("Nano Banana") for outpainting and background generation, configure your Google AI Studio API Key.
          </p>

          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="p-3.5 bg-zinc-55/40 dark:bg-zinc-950/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 flex flex-col gap-1.5 text-left">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">How to get a Gemini API Key?</span>
            <a 
              href="https://aistudio.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-indigo-650 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Google AI Studio Key Manager</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-relaxed mt-1">
              API Keys are free for developmental and hobbyist rate limits. Keep your API keys confidential; they are saved strictly inside your local browser.
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
          >
            Save Configuration
          </button>
        </form>

      </div>
    </div>
  );
}
