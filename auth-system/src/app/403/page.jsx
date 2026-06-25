'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl flex flex-col items-center gap-6">
        
        {/* Shield Icon */}
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-full text-rose-500 animate-bounce">
          <ShieldAlert className="w-12 h-12" />
        </div>

        {/* Text Copy */}
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            403 - Access Denied
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
            You do not have the administrative privileges required to access this dashboard route.
          </p>
        </div>

        {/* Redirect buttons */}
        <div className="w-full">
          <Link
            href="/profile"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Profile
          </Link>
        </div>

      </div>
    </div>
  );
}
