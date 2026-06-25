'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, User, Shield, Key } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session?.user) return null;

  const isAdmin = session.user.role?.toLowerCase() === 'admin';

  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/profile" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/25">
              A
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              AuthSystem
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/profile"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === '/profile'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                My Profile
              </span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/admin'
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Dashboard
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={session.user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.user.name || 'user')}`}
              alt={session.user.name || 'User Avatar'}
              className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                {session.user.name}
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                {isAdmin ? (
                  <>
                    <Shield className="w-2.5 h-2.5 text-indigo-500" />
                    Admin
                  </>
                ) : (
                  <>
                    <User className="w-2.5 h-2.5 text-zinc-400" />
                    Standard User
                  </>
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 rounded-xl bg-zinc-50 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 dark:bg-zinc-850 dark:hover:bg-rose-950/20 border border-zinc-200 dark:border-zinc-800 hover:border-rose-100 dark:hover:border-rose-900/30 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
