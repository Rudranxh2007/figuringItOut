import React, { useState } from 'react';
import { Bell, Trash2, CheckCheck, BellOff } from 'lucide-react';

const SAMPLE = [
  { id: 1, type: 'workout', icon: '🏋️', title: 'Workout Reminder', msg: 'Time to hit the gym! You haven\'t logged a workout today.', time: '2m ago', read: false },
  { id: 2, type: 'pr', icon: '🏆', title: 'New PR Alert!', msg: 'You set a new Bench Press PR — 102.5kg × 5 reps!', time: '1h ago', read: false },
  { id: 3, type: 'nutrition', icon: '💊', title: 'Supplement Reminder', msg: 'Don\'t forget your post-workout creatine and protein.', time: '3h ago', read: true },
  { id: 4, type: 'goals', icon: '🎯', title: 'Goal Update', msg: 'You\'re 80% towards your monthly workout goal. Keep going!', time: '1d ago', read: true },
  { id: 5, type: 'nutrition', icon: '💧', title: 'Hydration Alert', msg: 'You haven\'t logged any water intake today. Stay hydrated!', time: '1d ago', read: false },
  { id: 6, type: 'workout', icon: '📊', title: 'Weekly Summary', msg: 'Great week! You completed 4 workouts and burned approx. 2,400 calories.', time: '3d ago', read: true },
];

const FILTERS = ['All', 'Unread', 'Workouts', 'Nutrition'];

export default function Notifications() {
  const [notifs, setNotifs] = useState(SAMPLE);
  const [filter, setFilter] = useState('All');

  const markAll = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const remove = (id) => setNotifs(ns => ns.filter(n => n.id !== id));

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    if (filter === 'Workouts') return n.type === 'workout' || n.type === 'pr';
    if (filter === 'Nutrition') return n.type === 'nutrition';
    return true;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl">
            <Bell className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Notifications</h1>
              {unreadCount > 0 && <span className="text-xs px-2 py-0.5 bg-yellow-400 text-black font-black rounded-full">{unreadCount}</span>}
            </div>
            <p className="text-neutral-400 text-sm">Alerts & reminders</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAll} className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold rounded-xl transition-all">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${filter === f ? 'bg-yellow-400 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}>{f}</button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-600">
          <BellOff className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-bold">No notifications here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                !n.read ? 'bg-neutral-950 border-yellow-400/20 border-l-2 border-l-yellow-400' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-black ${n.read ? 'text-neutral-300' : 'text-white'}`}>{n.title}</p>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{n.msg}</p>
                <p className="text-[10px] text-neutral-600 mt-1 font-bold">{n.time}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); remove(n.id); }} className="p-1.5 text-neutral-700 hover:text-white hover:bg-neutral-800 rounded-lg shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

