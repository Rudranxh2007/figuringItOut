import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Dumbbell,
  Calendar,
  LineChart,
  ListPlus,
  BookOpen,
  LogOut,
  User,
  Menu,
  X,
  Flame,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard',        path: '/',          icon: Flame },
    { name: 'Daily Log',        path: '/daily',     icon: Calendar },
    { name: 'Routines',         path: '/planner',   icon: ListPlus },
    { name: 'Progress & PRs',   path: '/progress',  icon: LineChart },
    { name: 'Exercise Library', path: '/exercises', icon: BookOpen },
  ];

  return (
    <nav className="bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="p-2.5 bg-yellow-400 rounded-xl shadow-lg shadow-yellow-400/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Pulse<span className="text-yellow-400">Fit</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-neutral-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User info + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <User className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-white">{user?.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-400 uppercase font-black">
                {user?.unitPreference || 'kg'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors border border-transparent hover:border-neutral-800"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-yellow-400/15 text-yellow-400'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <div className="text-sm text-neutral-300 font-medium">
              Signed in as <span className="text-white font-bold">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-yellow-400 hover:bg-neutral-900 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
