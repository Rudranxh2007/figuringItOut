import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Flame,
  Dumbbell,
  ListPlus,
  Zap,
  BookOpen,
  Utensils,
  Apple,
  Pill,
  Droplets,
  Moon,
  HeartPulse,
  Brain,
  Activity,
  LineChart,
  Weight,
  Trophy,
  Target,
  Swords,
  Repeat,
  Award,
  User,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart2,
  Ruler,
} from 'lucide-react';

const navSections = [
  {
    section: null,
    links: [
      { name: 'Dashboard', path: '/', icon: Flame },
    ],
  },
  {
    section: 'Workout',
    icon: Dumbbell,
    links: [
      { name: 'Routines',         path: '/planner',         icon: ListPlus },
      { name: 'Active Workout',   path: '/workout/active',  icon: Zap },
      { name: 'Exercise Library', path: '/exercises',       icon: BookOpen },
    ],
  },
  {
    section: 'Nutrition',
    icon: Utensils,
    links: [
      { name: 'Meals',       path: '/meals',       icon: Apple },
      { name: 'Calories',    path: '/calories',    icon: Activity },
      { name: 'Supplements', path: '/supplements', icon: Pill },
      { name: 'Water Intake',path: '/water',       icon: Droplets },
    ],
  },
  {
    section: 'Wellness',
    icon: HeartPulse,
    links: [
      { name: 'Sleep',          path: '/sleep',      icon: Moon },
      { name: 'Recovery',       path: '/recovery',   icon: HeartPulse },
      { name: 'Meditation',     path: '/meditation', icon: Brain },
      { name: 'Stress Tracker', path: '/stress',     icon: Activity },
    ],
  },
  {
    section: 'Progress',
    icon: LineChart,
    links: [
      { name: 'Analytics',    path: '/progress',      icon: BarChart2 },
      { name: 'Weight',       path: '/weight',        icon: Weight },
      { name: 'PRs',          path: '/prs',           icon: Trophy },
      { name: 'Measurements', path: '/measurements',  icon: Ruler },
    ],
  },
  {
    section: 'Goals',
    icon: Target,
    links: [
      { name: 'Challenges',   path: '/challenges',   icon: Swords },
      { name: 'Habits',       path: '/habits',       icon: Repeat },
      { name: 'Achievements', path: '/achievements', icon: Award },
    ],
  },
  {
    section: 'Profile',
    icon: User,
    links: [
      { name: 'Settings',      path: '/settings',      icon: Settings },
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Account',       path: '/account',       icon: User },
    ],
  },
];

export default function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-open section that contains active link
  const getDefaultOpen = () => {
    const open = {};
    navSections.forEach(({ section, links }) => {
      if (section && links.some(l => location.pathname === l.path)) {
        open[section] = true;
      }
    });
    // Open first section by default if nothing active
    if (Object.keys(open).length === 0) open['Workout'] = true;
    return open;
  };

  const [openSections, setOpenSections] = useState(getDefaultOpen);

  if (!isAuthenticated) return null;

  const toggleSection = (section) => {
    if (collapsed) return; // Don't toggle when collapsed
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isSectionActive = (links) => links.some(l => location.pathname === l.path);

  return (
    <aside
      className={`hidden md:flex flex-col bg-neutral-950 border-r border-neutral-800 h-screen sticky top-0 transition-all duration-300 z-40 ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-neutral-800 shrink-0 ${
          collapsed ? 'justify-center py-4 px-2' : 'gap-2.5 px-4 py-4'
        }`}
      >
        <div
          className="p-2 bg-yellow-400 rounded-xl shadow-lg shadow-yellow-400/20 shrink-0 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Dumbbell className="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        {!collapsed && (
          <span className="text-base font-black tracking-tight text-white whitespace-nowrap">
            Pulse<span className="text-yellow-400">Fit</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 scrollbar-thin">
        {navSections.map(({ section, icon: SectionIcon, links }) => {
          if (!section) {
            // Dashboard — standalone
            return links.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <div key={link.path} className="px-2 py-1">
                  <Link
                    to={link.path}
                    title={collapsed ? link.name : ''}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/20'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-yellow-400' : ''}`} />
                    {!collapsed && link.name}
                  </Link>
                </div>
              );
            });
          }

          const isOpen = !collapsed && openSections[section];
          const sectionActive = isSectionActive(links);

          return (
            <div key={section} className="px-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section)}
                title={collapsed ? section : ''}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all mb-0.5 ${
                  sectionActive && collapsed
                    ? 'text-yellow-400 bg-yellow-400/10'
                    : sectionActive
                    ? 'text-yellow-400'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50'
                }`}
              >
                {SectionIcon && (
                  <SectionIcon className={`w-4 h-4 shrink-0 ${sectionActive ? 'text-yellow-400' : ''}`} />
                )}
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{section}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                    />
                  </>
                )}
              </button>

              {/* Section Links */}
              {isOpen && (
                <div className="ml-2 pl-2 border-l border-neutral-800 space-y-0.5 mb-1">
                  {links.map(link => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/20'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-yellow-400' : 'text-neutral-600'}`} />
                        <span className="truncate">{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-neutral-800 px-2 py-3 space-y-1 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 mb-1">
            <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
              <span className="text-black font-black text-xs">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-neutral-500 uppercase font-bold">{user?.unitPreference || 'kg'}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[4.5rem] w-6 h-6 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-all z-10"
      >
        <ChevronRight className={`w-3 h-3 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  );
}
