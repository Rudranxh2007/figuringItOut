import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, ArrowRight, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-4">
        <div className="inline-flex p-4 bg-yellow-400 rounded-3xl shadow-2xl shadow-yellow-400/20 mb-4 group hover:scale-105 transition-transform">
          <Dumbbell className="w-10 h-10 text-black stroke-[2.5]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Welcome back to Pulse<span className="text-yellow-400">Fit</span>
        </h2>
        <p className="mt-2 text-base text-neutral-400">
          Track workouts, crush daily PRs, and monitor real progress
        </p>
      </div>

      {/* Enlarged Login Card Box in Black/White/Yellow */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-neutral-950 border border-neutral-800 p-8 sm:p-12 shadow-2xl rounded-3xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-neutral-900 border border-yellow-400/50 flex items-center gap-3 text-yellow-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@fitness.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-base font-medium transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-xs font-bold text-yellow-400 hover:underline underline-offset-4"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-base font-medium transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-black text-base bg-yellow-400 hover:bg-yellow-300 shadow-xl shadow-yellow-400/20 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-yellow-400 hover:underline underline-offset-4">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
