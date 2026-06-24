import React from 'react';
import { Sun, Moon, Sparkles, User, LogOut, ShieldAlert } from 'lucide-react';

export default function Header({
  darkMode,
  setDarkMode,
  user,
  onLoginClick,
  onLogout,
  showAdminPanel,
  setShowAdminPanel,
}) {
  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-5 flex flex-col md:flex-row items-center justify-between gap-5 border-b border-zinc-800/80 transition-colors duration-300">
      
      {/* Brand Logo and Title */}
      <div className="flex items-center gap-4">
        {/* S|C Branding Box */}
        <div className="px-4 py-2.5 bg-zinc-950 border-2 border-yellow-500/80 rounded-2xl text-white font-black text-xl shadow-[0_0_20px_rgba(250,204,21,0.25)] flex items-center justify-center transform hover:scale-105 transition-transform duration-300 select-none cursor-pointer">
          <span className="text-gradient-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">S</span>
          <span className="text-zinc-600 mx-0.5 font-light text-base">|</span>
          <span className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">C</span>
        </div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white flex items-center gap-2 select-none uppercase">
            <span className="text-gradient-neon drop-shadow-[0_0_15px_rgba(236,72,153,0.45)] hover:scale-[1.01] transition-transform duration-300">
              Stylecraft
            </span>
            <span className="text-zinc-500 font-light text-2xl">/</span>
            <span className="text-sm font-semibold tracking-widest text-zinc-100 dark:text-zinc-100 mt-1.5 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              Image Resizer
            </span>
          </h1>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-400 tracking-widest uppercase mt-0.5 font-bold">
            The Art & Science of Styling
          </p>
        </div>
      </div>

      {/* Navigation Controls / User Actions */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        
        {/* Admin Dashboard Trigger */}
        {user && user.role === 'admin' && (
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              showAdminPanel
                ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/25'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            {showAdminPanel ? 'Close Admin Dashboard' : 'Open Admin Dashboard'}
          </button>
        )}

        {/* User Login Section */}
        {user ? (
          <div className="flex items-center gap-2 bg-zinc-900 p-1.5 pr-3 rounded-2xl border border-zinc-800 animate-fadeIn">
            {/* User Avatar */}
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black flex items-center justify-center font-bold text-xs">
              {user.email.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex flex-col text-left shrink-0">
              <span className="text-[10px] font-bold text-zinc-200 leading-tight">
                {user.email.split('@')[0]}
              </span>
              <span className="text-[8px] font-bold text-amber-500 uppercase tracking-wider">
                {user.role}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="ml-2 p-1 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-350 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all cursor-pointer hover:shadow-md"
          >
            <User className="h-4 w-4 text-zinc-500" />
            Login / Admin Access
          </button>
        )}

        <div className="w-[1px] h-5 bg-zinc-250 dark:bg-zinc-800 hidden sm:block" />

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-zinc-650 dark:text-zinc-450 dark:hover:text-zinc-200 hover:text-zinc-950 transition-all duration-200 cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 animate-pulse" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}
