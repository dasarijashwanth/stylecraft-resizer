'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@@/components/Header';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ShieldAlert, 
  RefreshCw, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Profile fields
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Set fields when session loads
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setAvatarUrl(session.user.avatarUrl || '');
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <RefreshCw className="w-8 h-8 text-indigo-650 animate-spin" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-3">Loading profile data...</span>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    router.push('/login');
    return null;
  }

  const user = session.user;
  const isEmailUser = user.loginMethod === 'email';
  const isAdmin = user.role?.toLowerCase() === 'admin';

  // Format Dates
  const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  const lastLoginDate = user.lastLogin ? new Date(user.lastLogin).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }) : 'N/A';

  // Handle Profile Update (Name & Avatar)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          avatarUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || 'Failed to update profile.');
      } else {
        setProfileSuccess('Profile details updated successfully!');
        
        // Update local session storage so the header and UI reflect changes instantly
        await update({
          name,
          avatarUrl,
        });
        
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setProfileError('An unexpected error occurred. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password.');
      } else {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setPasswordError('An unexpected error occurred. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-250">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              Welcome back, {user.name}! <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
              Manage your security settings, profile metadata, and check system status.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              {user.role}
            </span>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              {user.loginMethod === 'google' ? 'Google OAuth' : 'Email/Password'}
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Info Card */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
              <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider w-full text-left mb-5">
                Account Summary
              </h3>
              
              <div className="relative group">
                <img
                  src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'user')}`}
                  alt={name || 'User Avatar'}
                  className="w-28 h-28 rounded-full border-2 border-indigo-500/20 p-1 bg-zinc-50 dark:bg-zinc-950 shadow-inner object-cover"
                />
              </div>

              <h2 className="text-lg font-black text-zinc-900 dark:text-white mt-4 tracking-tight">
                {name}
              </h2>
              <p className="text-xs font-semibold text-zinc-400 mt-1">
                {user.email}
              </p>

              <div className="w-full h-[1px] bg-zinc-150 dark:bg-zinc-800 my-5" />

              <div className="w-full flex flex-col gap-3.5 text-left text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-450 dark:text-zinc-500">
                    <Calendar className="w-4 h-4 shrink-0" />
                    Joined:
                  </span>
                  <span>{createdDate}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-450 dark:text-zinc-500">
                    <Clock className="w-4 h-4 shrink-0" />
                    Last Login:
                  </span>
                  <span>{lastLoginDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Forms */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Form A: Edit Profile */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm text-left">
              <h3 className="text-sm font-bold text-zinc-850 dark:text-white mb-1.5 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                Profile Settings
              </h3>
              <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-semibold mb-6">
                Update your display name and customize your avatar image URL.
              </p>

              {profileError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left mb-5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left mb-5">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Display Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your display name"
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Avatar Image URL
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                        <ImageIcon className="w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed select-none"
                  >
                    {profileLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>{profileLoading ? 'Saving...' : 'Save Profile Details'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Form B: Change Password (only for Email users) */}
            {isEmailUser ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm text-left">
                <h3 className="text-sm font-bold text-zinc-850 dark:text-white mb-1.5 flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-500" />
                  Security & Password
                </h3>
                <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-semibold mb-6">
                  Change your password. Must be at least 8 characters long.
                </p>

                {passwordError && (
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left mb-5">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left mb-5">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                        <Key className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                          <Key className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                          <Key className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed select-none"
                    >
                      {passwordLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                      <span>{passwordLoading ? 'Changing...' : 'Change Password'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm text-left relative overflow-hidden flex flex-col gap-2">
                <h3 className="text-sm font-bold text-zinc-850 dark:text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-zinc-400" />
                  Security & Password
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed font-semibold">
                  You are signed in using <strong className="text-zinc-700 dark:text-zinc-300">Google OAuth 2.0</strong>. Account credentials, password hashing, and resets are managed externally by Google. No password exists locally.
                </p>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
