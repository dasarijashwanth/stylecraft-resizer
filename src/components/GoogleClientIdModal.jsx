import React, { useState } from 'react';
import { X, KeyRound, ExternalLink } from 'lucide-react';

export default function GoogleClientIdModal({
  initialClientId = '',
  onSave,
  onClose,
}) {
  const [clientId, setClientId] = useState(initialClientId);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = clientId.trim();
    if (!trimmed) {
      setError('Please enter a valid Client ID.');
      return;
    }
    if (trimmed.length > 150) {
      setError('Client ID exceeds maximum allowed length.');
      return;
    }
    // Standard Google Web Client ID structure: alphanumeric-dash.apps.googleusercontent.com
    const clientIdRegex = /^[0-9a-zA-Z\-]+\.apps\.googleusercontent\.com$/;
    if (!clientIdRegex.test(trimmed)) {
      setError('Invalid Client ID format. Must end with .apps.googleusercontent.com');
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
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Google API Configuration
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
            To use direct client-side Google Drive uploads, configure your Google OAuth 2.0 Web Client ID.
          </p>

          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
              OAuth Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. 123456-abcdef.apps.googleusercontent.com"
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="p-3.5 bg-zinc-55/40 dark:bg-zinc-950/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 flex flex-col gap-1.5 text-left">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">How to get a Client ID?</span>
            <a 
              href="https://console.cloud.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Google Cloud Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-relaxed mt-1">
              Ensure you add your origin (e.g. <code>http://localhost:5173</code>) to the <strong>Authorized JavaScript origins</strong> list in your Google Cloud credentials.
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
          >
            Save & Authenticate
          </button>
        </form>

      </div>
    </div>
  );
}
