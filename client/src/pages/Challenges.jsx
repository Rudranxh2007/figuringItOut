import React, { useState } from 'react';
import { Swords, Plus, Target, CheckCircle2, Clock, Trophy, Trash2 } from 'lucide-react';

const defaultChallenges = [
  { id: 1, title: '30-Day Plank Challenge', desc: 'Hold a plank every day for 30 days. Start at 30 seconds, add 5s daily.', target: 30, unit: 'days', duration: 30, progress: 18, joined: true, done: false },
  { id: 2, title: '10,000 Steps Daily', desc: 'Walk at least 10,000 steps every single day for a month.', target: 10000, unit: 'steps/day', duration: 30, progress: 7, joined: true, done: false },
  { id: 3, title: '100 Push-ups Challenge', desc: 'Complete 100 push-ups every day for 3 weeks.', target: 21, unit: 'days', duration: 21, progress: 21, joined: true, done: true },
  { id: 4, title: 'No Sugar for 2 Weeks', desc: 'Eliminate added sugar from your diet for 14 days.', target: 14, unit: 'days', duration: 14, progress: 0, joined: false, done: false },
];

export default function Challenges() {
  const [challenges, setChallenges] = useState(defaultChallenges);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', desc: '', target: '', unit: 'days', duration: 30 });
  const [updates, setUpdates] = useState({});

  const toggle = (id) => setChallenges(cs => cs.map(c => c.id === id ? { ...c, joined: !c.joined, progress: c.joined ? 0 : c.progress } : c));
  const updateProgress = (id) => {
    const val = Number(updates[id] || 0);
    if (!val) return;
    setChallenges(cs => cs.map(c => {
      if (c.id !== id) return c;
      const newP = Math.min(c.progress + val, c.target);
      return { ...c, progress: newP, done: newP >= c.target };
    }));
    setUpdates(u => ({ ...u, [id]: '' }));
  };

  const addChallenge = (e) => {
    e.preventDefault();
    if (!form.title) return;
    setChallenges([...challenges, { id: Date.now(), ...form, target: +form.target, duration: +form.duration, progress: 0, joined: false, done: false }]);
    setForm({ title: '', desc: '', target: '', unit: 'days', duration: 30 });
    setShowForm(false);
  };

  const active = challenges.filter(c => c.joined && !c.done);
  const completed = challenges.filter(c => c.done);
  const available = challenges.filter(c => !c.joined && !c.done);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl"><Swords className="w-5 h-5 text-black" /></div>
          <div><h1 className="text-2xl font-black text-white">Challenges</h1><p className="text-neutral-400 text-sm">Push your limits with fitness challenges</p></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 text-sm">
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      {showForm && (
        <form onSubmit={addChallenge} className="bg-neutral-950 border border-yellow-400/30 rounded-2xl p-5 mb-6 space-y-3">
          <h3 className="font-black text-white">New Challenge</h3>
          <input required placeholder="Challenge title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <textarea placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
          <div className="grid grid-cols-3 gap-3">
            <input type="number" placeholder="Target" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <input placeholder="Unit (e.g. days)" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <input type="number" placeholder="Duration (days)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 bg-yellow-400 text-black font-black rounded-xl text-sm hover:bg-yellow-300">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-neutral-800 text-white font-bold rounded-xl text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Active */}
      {active.length > 0 && (<><p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">Active ({active.length})</p>
        <div className="space-y-3 mb-6">
          {active.map(c => {
            const pct = Math.min((c.progress / c.target) * 100, 100);
            return (
              <div key={c.id} className="bg-neutral-950 border border-yellow-400/20 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-black text-white">{c.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{c.desc}</p>
                  </div>
                  <button onClick={() => toggle(c.id)} className="text-xs text-neutral-500 hover:text-white border border-neutral-700 px-2 py-1 rounded-lg ml-3 shrink-0">Leave</button>
                </div>
                <div className="flex items-center gap-2 mb-2 mt-3">
                  <div className="flex-1 bg-neutral-800 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-black text-yellow-400 shrink-0">{c.progress}/{c.target} {c.unit}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <input type="number" placeholder="Add progress" value={updates[c.id] || ''} onChange={e => setUpdates(u => ({ ...u, [c.id]: e.target.value }))} className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400" />
                  <button onClick={() => updateProgress(c.id)} className="px-3 py-2 bg-yellow-400 text-black font-black rounded-xl text-sm hover:bg-yellow-300">Update</button>
                </div>
              </div>
            );
          })}
        </div></>)}

      {/* Available */}
      {available.length > 0 && (<><p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">Available</p>
        <div className="space-y-3 mb-6">
          {available.map(c => (
            <div key={c.id} className="flex items-center gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
              <div className="flex-1"><p className="font-black text-white text-sm">{c.title}</p><p className="text-xs text-neutral-500">{c.duration} days · {c.target} {c.unit}</p></div>
              <button onClick={() => toggle(c.id)} className="px-3 py-1.5 bg-yellow-400 text-black font-black rounded-xl text-xs hover:bg-yellow-300">Join</button>
            </div>
          ))}
        </div></>)}

      {/* Completed */}
      {completed.length > 0 && (<><p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">Completed 🏆</p>
        <div className="space-y-2">
          {completed.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl opacity-60">
              <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
              <p className="font-bold text-white text-sm line-through">{c.title}</p>
              <Trophy className="w-4 h-4 text-yellow-400 ml-auto" />
            </div>
          ))}
        </div></>)}
    </div>
  );
}

