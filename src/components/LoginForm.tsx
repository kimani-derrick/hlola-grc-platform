'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password. Try admin@hlola.io / hlola2025');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-hlola-gradient py-12 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm font-semibold text-[#26558e] bg-white/70 hover:bg-white transition-colors px-4 py-2 rounded-full shadow-lg backdrop-blur"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to home
      </Link>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#41c3d6] rounded-full mix-blend-normal filter blur-3xl opacity-20 float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#26558e] rounded-full mix-blend-normal filter blur-3xl opacity-15 float-animation" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-20 left-1/2 w-80 h-80 bg-[#41c3d6] rounded-full mix-blend-normal filter blur-2xl opacity-10 float-animation" style={{animationDelay: '6s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <Image
              src="/brand/Hlola Full Color.svg"
              alt="hlola"
              width={150}
              height={45}
              priority
              className="h-10 w-auto mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-[#26558e]">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your hlola account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="glass-card border-red-200 bg-red-50/50 rounded-lg p-4">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="glass-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="glass-input w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#41c3d6] focus:ring-[#41c3d6] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-[#41c3d6] hover:text-[#359bb0] font-medium">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#26558e] hover:bg-[#1e4470] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#41c3d6] font-semibold transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <a href="#" className="text-[#41c3d6] hover:text-[#359bb0] font-medium">
                  Start your free trial
                </a>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="glass-card bg-blue-50/50 border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-blue-700">
                <p><strong>Email:</strong> admin@hlola.io</p>
                <p><strong>Password:</strong> hlola2025</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
