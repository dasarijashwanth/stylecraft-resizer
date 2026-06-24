import React from 'react';
import { Sun, Moon, Sparkles, User, LogOut, ShieldAlert, Settings } from 'lucide-react';

export default function Header({
  darkMode,
  setDarkMode,
  user,
  onLoginClick,
  onLogout,
  showAdminPanel,
  setShowAdminPanel,
  googleUser,
  onGoogleLoginClick,
  onGoogleLogout,
  onGoogleConfigClick,
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

        {/* Google OAuth Section */}
        {googleUser ? (
          <div className="flex items-center gap-2 bg-zinc-900 p-1.5 pr-2.5 rounded-2xl border border-zinc-800 animate-fadeIn">
            {googleUser.picture ? (
              <img
                src={googleUser.picture}
                alt={googleUser.name}
                className="w-7 h-7 rounded-xl object-cover border border-zinc-800"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-650 text-white flex items-center justify-center font-bold text-xs border border-zinc-800">
                {googleUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex flex-col text-left shrink-0 max-w-[120px]">
              <span className="text-[10px] font-bold text-zinc-200 leading-tight truncate">
                {googleUser.name}
              </span>
              <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">
                Drive Connected
              </span>
            </div>

            <button
              onClick={onGoogleConfigClick}
              className="p-1 text-zinc-555 hover:text-zinc-300 transition-colors cursor-pointer"
              title="Google API Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onGoogleLogout}
              className="p-1 text-zinc-555 hover:text-zinc-300 transition-colors cursor-pointer"
              title="Sign out of Google"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onGoogleLoginClick}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-650 hover:bg-blue-600 text-white border border-blue-600 hover:border-blue-500 transition-all cursor-pointer hover:shadow-md"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Sign in with Google
            </button>
            <button
              onClick={onGoogleConfigClick}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Google API Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
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
