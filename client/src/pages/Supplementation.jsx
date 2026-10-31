import React, { useState } from 'react';
import { Pill, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const defaultSupps = [
  { id: 1, name: 'Whey Protein', dose: '30g', timing: 'Post Workout', taken: false, color: 'bg-yellow-400' },
  { id: 2, name: 'Creatine', dose: '5g', timing: 'Morning', taken: false, color: 'bg-yellow-400' },
  { id: 3, name: 'Multivitamin', dose: '1 tablet', timing: 'With Breakfast', taken: false, color: 'bg-yellow-400' },
  { id: 4, name: 'Omega-3', dose: '2 capsules', timing: 'With Lunch', taken: false, color: 'bg-yellow-400' },
];

export default function Supplementation() {
  const [supps, setSupps] = useState(defaultSupps);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', dose: '', timing: '' });

  const toggle = (id) => setSupps(supps.map(s => s.id === id ? { ...s, taken: !s.taken } : s));
  const remove = (id) => setSupps(supps.filter(s => s.id !== id));

  const addSupp = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSupps([...supps, { id: Date.now(), ...form, taken: false, color: 'bg-yellow-400' }]);
    setForm({ name: '', dose: '', timing: '' });
    setShowForm(false);
  };

  const takenCount = supps.filter(s => s.taken).length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-yellow-400 rounded-2xl">
              <Pill className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-black text-white">Supplementation</h1>
          </div>
          <p className="text-neutral-400 text-sm ml-14">Track your daily supplements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Supplement
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-neutral-300">Today's Progress</span>
          <span className="text-sm font-black text-yellow-400">{takenCount}/{supps.length} taken</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2.5">
          <div
            className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500"
            style={{ width: supps.length ? `${(takenCount / supps.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={addSupp} className="bg-neutral-900 border border-yellow-400/30 rounded-2xl p-5 mb-6 space-y-4">
          <h3 className="font-black text-white">New Supplement</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              placeholder="Name (e.g. BCAA)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <input
              placeholder="Dose (e.g. 5g)"
              value={form.dose}
              onChange={e => setForm({ ...form, dose: e.target.value })}
              className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              placeholder="Timing (e.g. Morning)"
              value={form.timing}
              onChange={e => setForm({ ...form, timing: e.target.value })}
              className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 bg-yellow-400 text-black font-black rounded-xl text-sm hover:bg-yellow-300">Add</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-neutral-800 text-white font-bold rounded-xl text-sm hover:bg-neutral-700">Cancel</button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {supps.map(s => (
          <div
            key={s.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              s.taken ? 'bg-yellow-400/5 border-yellow-400/20' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <button onClick={() => toggle(s.id)} className="shrink-0">
              <CheckCircle2 className={`w-6 h-6 transition-colors ${s.taken ? 'text-yellow-400' : 'text-neutral-700 hover:text-neutral-400'}`} />
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${s.taken ? 'line-through text-neutral-500' : 'text-white'}`}>{s.name}</p>
              <p className="text-xs text-neutral-500">{s.dose} · {s.timing}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="w-3.5 h-3.5" /> {s.timing}
              </span>
              <button onClick={() => remove(s.id)} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-neutral-800 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

