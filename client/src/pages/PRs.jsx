import React, { useState } from 'react';
import { Trophy, Plus, Trash2, Filter } from 'lucide-react';

const CATS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];
const sample = [
  { id: 1, exercise: 'Bench Press', category: 'Chest', weight: 100, reps: 5, date: '2026-10-28' },
  { id: 2, exercise: 'Squat', category: 'Legs', weight: 140, reps: 5, date: '2026-10-25' },
  { id: 3, exercise: 'Deadlift', category: 'Back', weight: 180, reps: 3, date: '2026-10-20' },
  { id: 4, exercise: 'Overhead Press', category: 'Shoulders', weight: 70, reps: 5, date: '2026-10-22' },
  { id: 5, exercise: 'Barbell Row', category: 'Back', weight: 100, reps: 8, date: '2026-10-19' },
  { id: 6, exercise: 'Incline Press', category: 'Chest', weight: 80, reps: 8, date: '2026-10-27' },
  { id: 7, exercise: 'Leg Press', category: 'Legs', weight: 200, reps: 10, date: '2026-10-23' },
  { id: 8, exercise: 'Barbell Curl', category: 'Arms', weight: 50, reps: 10, date: '2026-10-21' },
];

export default function PRs() {
  const [prs, setPrs] = useState(sample);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ exercise: '', category: 'Chest', weight: '', reps: '', date: new Date().toISOString().split('T')[0] });

  const filtered = filter === 'All' ? prs : prs.filter(p => p.category === filter);

  const addPR = (e) => {
    e.preventDefault();
    if (!form.exercise || !form.weight) return;
    setPrs([{ id: Date.now(), ...form, weight: +form.weight, reps: +form.reps }, ...prs]);
    setForm({ exercise: '', category: 'Chest', weight: '', reps: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl"><Trophy className="w-5 h-5 text-black" /></div>
          <div><h1 className="text-2xl font-black text-white">Personal Records</h1><p className="text-neutral-400 text-sm">Your best lifts ever</p></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 text-sm">
          <Plus className="w-4 h-4" /> New PR
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-center"><p className="text-2xl font-black text-yellow-400">{prs.length}</p><p className="text-xs text-neutral-500 font-bold mt-0.5">Total PRs</p></div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-center"><p className="text-2xl font-black text-white">{Math.max(...prs.map(p => p.weight))}kg</p><p className="text-xs text-neutral-500 font-bold mt-0.5">Heaviest</p></div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-center"><p className="text-2xl font-black text-white">{prs[0]?.exercise?.split(' ')[0] || '—'}</p><p className="text-xs text-neutral-500 font-bold mt-0.5">Latest PR</p></div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addPR} className="bg-neutral-950 border border-yellow-400/30 rounded-2xl p-5 mb-6 space-y-3">
          <h3 className="font-black text-white">New Personal Record</h3>
          <input required placeholder="Exercise name" value={form.exercise} onChange={e => setForm({ ...form, exercise: e.target.value })} className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
              {CATS.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Weight (kg)" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" required />
            <input type="number" placeholder="Reps" value={form.reps} onChange={e => setForm({ ...form, reps: e.target.value })} className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 bg-yellow-400 text-black font-black rounded-xl text-sm hover:bg-yellow-300">Save PR</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-neutral-800 text-white font-bold rounded-xl text-sm hover:bg-neutral-700">Cancel</button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${filter === c ? 'bg-yellow-400 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}>{c}</button>
        ))}
      </div>

      {/* PR List */}
      <div className="space-y-2">
        {filtered.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${i === 0 && filter === 'All' ? 'bg-yellow-400/5 border-yellow-400/30' : 'bg-neutral-950 border-neutral-800'}`}>
            <div className={`p-2 rounded-xl shrink-0 ${i === 0 && filter === 'All' ? 'bg-yellow-400/20' : 'bg-neutral-800'}`}>
              <Trophy className={`w-4 h-4 ${i === 0 && filter === 'All' ? 'text-yellow-400' : 'text-neutral-500'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-black text-white text-sm">{p.exercise}</p>
                {i === 0 && filter === 'All' && <span className="text-[10px] px-2 py-0.5 bg-yellow-400 text-black font-black rounded-md">LATEST</span>}
              </div>
              <p className="text-xs text-neutral-500">{p.category} · {p.date}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-yellow-400 font-black">{p.weight}kg</p>
              <p className="text-xs text-neutral-500">{p.reps} reps</p>
            </div>
            <button onClick={() => setPrs(prs.filter(x => x.id !== p.id))} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-neutral-800 ml-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

