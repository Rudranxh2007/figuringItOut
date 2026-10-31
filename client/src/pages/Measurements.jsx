import React, { useState } from 'react';
import { Ruler, Plus } from 'lucide-react';

const FIELDS = ['Chest', 'Waist', 'Hips', 'Shoulders', 'Left Arm', 'Right Arm', 'Left Thigh', 'Right Thigh', 'Calves'];

const sample = [
  { id: 1, date: '2026-10-01', Chest: 100, Waist: 82, Hips: 96, Shoulders: 118, 'Left Arm': 37, 'Right Arm': 37, 'Left Thigh': 58, 'Right Thigh': 58, Calves: 38 },
  { id: 2, date: '2026-10-15', Chest: 101, Waist: 81, Hips: 96, Shoulders: 119, 'Left Arm': 37.5, 'Right Arm': 37.5, 'Left Thigh': 58.5, 'Right Thigh': 58.5, Calves: 38.5 },
];

export default function Measurements() {
  const [history, setHistory] = useState(sample);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], ...Object.fromEntries(FIELDS.map(f => [f, ''])) });

  const submit = (e) => {
    e.preventDefault();
    setHistory([...history, { id: Date.now(), ...form }]);
    setShowForm(false);
  };

  const latest = history[history.length - 1];
  const first = history[0];

  const diff = (field) => {
    if (!latest || !first || history.length < 2) return null;
    const d = (latest[field] - first[field]).toFixed(1);
    return d > 0 ? `+${d}` : d;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl"><Ruler className="w-5 h-5 text-black" /></div>
          <div><h1 className="text-2xl font-black text-white">Measurements</h1><p className="text-neutral-400 text-sm">Track body composition changes</p></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 text-sm">
          <Plus className="w-4 h-4" /> Log Today
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <form onSubmit={submit} className="bg-neutral-950 border border-yellow-400/30 rounded-2xl p-5 mb-6 space-y-4">
          <h3 className="font-black text-white">New Measurement Entry</h3>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FIELDS.map(f => (
              <div key={f}>
                <label className="text-xs text-neutral-500 font-bold mb-1 block">{f} (cm)</label>
                <input type="number" step="0.1" placeholder="0.0" value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 bg-yellow-400 text-black font-black rounded-xl text-sm hover:bg-yellow-300">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-neutral-800 text-white font-bold rounded-xl text-sm hover:bg-neutral-700">Cancel</button>
          </div>
        </form>
      )}

      {/* Current vs Start */}
      {latest && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden mb-6">
          <div className="grid grid-cols-4 gap-0 border-b border-neutral-800 px-4 py-2 bg-neutral-900">
            <span className="text-xs font-black text-neutral-400 uppercase">Measurement</span>
            <span className="text-xs font-black text-neutral-400 uppercase text-center">Start</span>
            <span className="text-xs font-black text-yellow-400 uppercase text-center">Current</span>
            <span className="text-xs font-black text-neutral-400 uppercase text-center">Change</span>
          </div>
          {FIELDS.map(f => {
            const d = diff(f);
            return (
              <div key={f} className="grid grid-cols-4 gap-0 px-4 py-2.5 border-b border-neutral-900 last:border-0 hover:bg-neutral-900/30">
                <span className="text-sm font-bold text-neutral-300">{f}</span>
                <span className="text-sm text-neutral-500 text-center">{first?.[f] || '—'}</span>
                <span className="text-sm font-black text-white text-center">{latest[f] || '—'}</span>
                <span className={`text-sm font-black text-center ${!d ? 'text-neutral-600' : d > 0 ? 'text-yellow-400' : 'text-neutral-300'}`}>{d || '—'}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* History snapshots */}
      <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">History ({history.length} entries)</p>
      <div className="space-y-2">
        {[...history].reverse().map(h => (
          <div key={h.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
            <p className="font-black text-yellow-400 text-sm mb-2">{h.date}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {FIELDS.slice(0, 5).map(f => (
                <div key={f} className="text-center">
                  <p className="text-white font-bold text-sm">{h[f] || '—'}</p>
                  <p className="text-[10px] text-neutral-600">{f}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

