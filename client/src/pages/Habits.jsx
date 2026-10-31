import React, { useState } from 'react';
import { Repeat, Plus, Trash2, Flame, CheckCircle2 } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const today = new Date().getDay(); // 0=Sun
const todayIdx = today === 0 ? 6 : today - 1;

const defaultHabits = [
  { id: 1, name: 'Morning Workout', emoji: '🏋️', completions: [true, true, true, false, true, false, false] },
  { id: 2, name: 'Drink 3L Water', emoji: '💧', completions: [true, true, false, true, true, true, false] },
  { id: 3, name: '8hr Sleep', emoji: '😴', completions: [false, true, true, true, false, true, true] },
  { id: 4, name: 'No Junk Food', emoji: '🥗', completions: [true, true, true, true, true, false, false] },
  { id: 5, name: 'Stretch 10 min', emoji: '🧘', completions: [false, true, false, true, false, true, false] },
];

const calcStreak = (completions) => {
  let streak = 0;
  for (let i = todayIdx; i >= 0; i--) {
    if (completions[i]) streak++; else break;
  }
  return streak;
};

export default function Habits() {
  const [habits, setHabits] = useState(defaultHabits);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', emoji: '⚡' });

  const toggle = (habitId, dayIdx) => {
    setHabits(hs => hs.map(h => {
      if (h.id !== habitId) return h;
      const c = [...h.completions];
      c[dayIdx] = !c[dayIdx];
      return { ...h, completions: c };
    }));
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setHabits([...habits, { id: Date.now(), name: form.name, emoji: form.emoji, completions: Array(7).fill(false) }]);
    setForm({ name: '', emoji: '⚡' });
    setShowForm(false);
  };

  const totalToday = habits.filter(h => h.completions[todayIdx]).length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl"><Repeat className="w-5 h-5 text-black" /></div>
          <div><h1 className="text-2xl font-black text-white">Habit Tracker</h1><p className="text-neutral-400 text-sm">Build consistency, one day at a time</p></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 text-sm">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      {/* Today summary */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <Flame className="w-8 h-8 text-yellow-400" />
        <div>
          <p className="text-2xl font-black text-white">{totalToday}/{habits.length} <span className="text-base text-neutral-500">habits done today</span></p>
          <div className="w-48 bg-neutral-800 rounded-full h-1.5 mt-1">
            <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${habits.length ? (totalToday / habits.length) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addHabit} className="bg-neutral-950 border border-yellow-400/30 rounded-2xl p-4 mb-6 space-y-3">
          <h3 className="font-black text-white">New Habit</h3>
          <div className="flex gap-3">
            <input placeholder="Emoji" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} className="w-16 px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <input required placeholder="Habit name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 bg-yellow-400 text-black font-black rounded-xl text-sm hover:bg-yellow-300">Add</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-neutral-800 text-white font-bold rounded-xl text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Weekly Grid */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid border-b border-neutral-800" style={{ gridTemplateColumns: '1fr repeat(7, 2.5rem)' }}>
          <div className="px-4 py-3 text-xs font-black text-neutral-500 uppercase tracking-wider">Habit</div>
          {DAYS.map((d, i) => (
            <div key={d} className={`py-3 text-xs font-black text-center ${i === todayIdx ? 'text-yellow-400' : 'text-neutral-500'}`}>{d}</div>
          ))}
        </div>

        {/* Habit rows */}
        {habits.map(h => {
          const streak = calcStreak(h.completions);
          return (
            <div key={h.id} className="grid items-center border-b border-neutral-900 last:border-0 hover:bg-neutral-900/20 transition-colors" style={{ gridTemplateColumns: '1fr repeat(7, 2.5rem)' }}>
              <div className="px-4 py-3 flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">{h.emoji}</span>
                <span className="text-sm font-bold text-white truncate">{h.name}</span>
                {streak > 0 && (
                  <div className="flex items-center gap-0.5 shrink-0 ml-1">
                    <Flame className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] font-black text-yellow-400">{streak}</span>
                  </div>
                )}
                <button onClick={() => setHabits(habits.filter(x => x.id !== h.id))} className="ml-auto p-1 text-neutral-700 hover:text-white rounded shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {h.completions.map((done, di) => (
                <button key={di} onClick={() => toggle(h.id, di)} className={`flex items-center justify-center py-3 transition-all ${di === todayIdx ? 'bg-neutral-900/50' : ''}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${done ? 'bg-yellow-400' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                  </div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

