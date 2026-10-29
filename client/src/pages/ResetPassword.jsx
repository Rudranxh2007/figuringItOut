import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Dumbbell, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({ email, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-4">
        <div className="inline-flex p-4 bg-yellow-400 rounded-3xl shadow-2xl shadow-yellow-400/20 mb-4 group hover:scale-105 transition-transform">
          <Dumbbell className="w-10 h-10 text-black stroke-[2.5]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Reset your <span className="text-yellow-400">Password</span>
        </h2>
        <p className="mt-2 text-base text-neutral-400">
          Enter your email and choose a new password
        </p>
      </div>

      {/* Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-neutral-950 border border-neutral-800 p-8 sm:p-12 shadow-2xl rounded-3xl">

          {/* Success State */}
          {success ? (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-full">
                <CheckCircle className="w-12 h-12 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">Password Reset Successful!</h3>
                <p className="text-neutral-400 text-sm">
                  Your password has been updated. You can now log in with your new password.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-black text-base bg-yellow-400 hover:bg-yellow-300 shadow-xl shadow-yellow-400/20 transition-all"
              >
                Go to Login
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Error Box */}
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-neutral-900 border border-yellow-400/50 flex items-center gap-3 text-yellow-400 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
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

                {/* New Password */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-12 pr-12 py-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-base font-medium transition shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-yellow-400 transition-colors"
                    >
                      {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-12 pr-12 py-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-base font-medium transition shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-yellow-400 transition-colors"
                    >
                      {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-black text-base bg-yellow-400 hover:bg-yellow-300 shadow-xl shadow-yellow-400/20 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400">
                Remembered your password?{' '}
                <Link to="/login" className="font-bold text-yellow-400 hover:underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

