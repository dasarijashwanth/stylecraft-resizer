'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Mail, Lock, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Feedback alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle URL query parameters (e.g. from verify redirect)
  useEffect(() => {
    const verified = searchParams.get('verified');
    const err = searchParams.get('error');

    if (verified === 'true') {
      setSuccessMsg('Your email has been verified successfully! You can now log in.');
    } else if (verified === 'false') {
      if (err === 'token_expired') {
        setErrorMsg('The verification link has expired. Please register again.');
      } else if (err === 'token_not_found') {
        setErrorMsg('Verification link is invalid or has already been used.');
      } else {
        setErrorMsg('Verification failed. Please try signing up again.');
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Retrieve reCAPTCHA v2 response token
    if (typeof window === 'undefined' || !window.grecaptcha) {
      setErrorMsg('reCAPTCHA script has not loaded yet. Please wait a moment.');
      return;
    }

    const recaptchaResponse = window.grecaptcha.getResponse();
    if (!recaptchaResponse) {
      setErrorMsg('Please confirm you are not a robot by checking the CAPTCHA box.');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setErrorMsg(result.error);
        // Reset reCAPTCHA for another attempt
        window.grecaptcha.reset();
      } else {
        setSuccessMsg('Login successful! Redirecting to profile...');
        setTimeout(() => {
          router.push('/profile');
          router.refresh();
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred. Please try again.');
      window.grecaptcha.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/profile' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors text-left">
      <Script src="https://www.google.com/recaptcha/api.js" async defer />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-xl flex flex-col gap-6 relative overflow-hidden">
        
        {/* Glow Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-indigo-500 rounded-full blur-xs" />

        {/* Title */}
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/25 mb-3">
            A
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1.5 font-medium">
            Sign in to access your AuthSystem account dashboard
          </p>
        </div>

        {/* Alert Banners */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-start gap-2.5 text-left">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          
          {/* Email field */}
          <div>
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
              />
            </div>
          </div>

          {/* CAPTCHA Widget */}
          <div className="flex justify-center my-1.5">
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
            className="w-full mt-1.5 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-1.5 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed select-none"
          >
            {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
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
          onClick={handleGoogleLogin}
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
          <span>Sign in with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-xs text-zinc-450 dark:text-zinc-500 font-medium">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create one free
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <RefreshCw className="w-8 h-8 text-indigo-650 animate-spin" />
      </div>
    }>
      <LoginForm />
    </React.Suspense>
  );
}
