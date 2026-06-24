import React, { useState } from 'react';
import { X, Shield, User, Lock, Sparkles, KeyRound } from 'lucide-react';

export default function LoginModal({ onLogin, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    // Auth validation
    if (email === 'admin@stylecraft.com' && password === 'admin123') {
      onLogin({ email, role: 'admin' });
    } else if (email === 'designer@stylecraft.com' && password === 'design123') {
      onLogin({ email, role: 'designer' });
    } else {
      setError('Invalid email or password. Use the quick-login buttons below!');
    }
  };

  // Quick Login helper
  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@stylecraft.com');
      setPassword('admin123');
      onLogin({ email: 'admin@stylecraft.com', role: 'admin' });
    } else {
      setEmail('designer@stylecraft.com');
      setPassword('design123');
      onLogin({ email: 'designer@stylecraft.com', role: 'designer' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slideIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-650 dark:text-indigo-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Member Sign In
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {error}
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                <User className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-55/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-250"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-55/40 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-250"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-650 to-violet-650 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
          >
            Access Workspace
          </button>
        </form>

        {/* Quick Logins (Demo Purpose) */}
        <div className="border-t border-zinc-100 dark:border-zinc-850 p-5 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Quick Login Presets (Try These)</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Admin Preset */}
            <button
              onClick={() => handleQuickLogin('admin')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 hover:ring-1 hover:ring-indigo-500/10 dark:hover:border-indigo-500/30 hover:scale-[1.01] transition-all cursor-pointer group"
            >
              <Shield className="w-5 h-5 text-rose-500 mb-1 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-350">Admin User</span>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">admin123</span>
            </button>

            {/* Designer Preset */}
            <button
              onClick={() => handleQuickLogin('designer')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 hover:ring-1 hover:ring-indigo-500/10 dark:hover:border-indigo-500/30 hover:scale-[1.01] transition-all cursor-pointer group"
            >
              <User className="w-5 h-5 text-indigo-500 mb-1 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-350">Designer</span>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">design123</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
