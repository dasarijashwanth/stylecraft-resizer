'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { User, Mail, Lock, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Password confirmation check
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    // 2. Terms Check
    if (!termsAccepted) {
      setErrorMsg('You must accept the terms & conditions to register.');
      return;
    }

    // 3. CAPTCHA Check
    if (typeof window === 'undefined' || !window.grecaptcha) {
      setErrorMsg('reCAPTCHA script has not loaded yet. Please wait a moment.');
      return;
    }

    const recaptchaToken = window.grecaptcha.getResponse();
    if (!recaptchaToken) {
      setErrorMsg('Please verify you are not a robot by checking the CAPTCHA box.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          recaptchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed. Please try again.');
        window.grecaptcha.reset();
      } else {
        setSuccessMsg(data.message || 'Registration successful! Verification link sent.');
        // Reset form fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTermsAccepted(false);
        window.grecaptcha.reset();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected connection error occurred. Please try again.');
      window.grecaptcha.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    signIn('google', { callbackUrl: '/profile' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-xl flex flex-col gap-5 relative overflow-hidden">
        
        {/* Glow Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-indigo-500 rounded-full blur-xs" />

        {/* Title */}
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/25 mb-3">
            A
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1.5 font-medium">
            Join AuthSystem to get started
          </p>
        </div>

        {/* Alert Banners */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-left">
          
          {/* Name field */}
          <div>
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
              Full Name
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
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
              />
            </div>
          </div>

          {/* Password fields row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars"
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat pass"
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
                />
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-indigo-650 focus:ring-indigo-500/20 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-zinc-550 dark:text-zinc-400 cursor-pointer select-none">
              I agree to the{' '}
              <a href="/terms" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                terms & conditions
              </a>
            </label>
          </div>

          {/* CAPTCHA Widget */}
          <div className="flex justify-center my-1">
            <div
              className="g-recaptcha"
              data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ld-P78qAAAAAFm32v-D-G5_w_K2-M_V_kX-G_w'}
              data-theme="light"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-1.5 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed select-none"
          >
            {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 flex-1" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Or continue with</span>
          <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 flex-1" />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full py-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl text-sm font-semibold text-zinc-750 dark:text-zinc-300 transition-all cursor-pointer flex items-center justify-center gap-2 select-none shadow-sm hover:scale-[1.005]"
        >
          {/* Google Icon SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-xs text-zinc-450 dark:text-zinc-500 font-medium">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  );
}
