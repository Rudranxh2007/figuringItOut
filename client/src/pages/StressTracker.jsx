import React, { useState } from 'react';
import { Activity, Plus, Trash2 } from 'lucide-react';

const sample = [
  { id: 1, date: '2026-10-30', level: 4, note: 'Heavy deadlift session, felt drained' },
  { id: 2, date: '2026-10-29', level: 6, note: 'Work deadline stress + leg day' },
  { id: 3, date: '2026-10-28', level: 2, note: 'Rest day, felt great' },
  { id: 4, date: '2026-10-27', level: 7, note: 'Competition prep anxiety' },
  { id: 5, date: '2026-10-26', level: 3, note: 'Good recovery, light cardio' },
];

const tips = [
  { title: 'Box Breathing', desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 4 times.' },
  { title: 'Progressive Muscle Relaxation', desc: 'Tense each muscle group 5s then release. Start from toes to head.' },
  { title: 'Cold Exposure', desc: '30-second cold shower. Activates vagus nerve, reduces cortisol.' },
  { title: 'Journaling', desc: 'Write 3 things you\'re grateful for and 1 win from today.' },
];

export default function StressTracker() {
  const [logs, setLogs] = useState(sample);
  const [level, setLevel] = useState(5);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addLog = (e) => {
    e.preventDefault();
    setLogs([{ id: Date.now(), date, level, note }, ...logs]);
    setNote('');
  };

  const avg = logs.length ? (logs.reduce((s, l) => s + l.level, 0) / logs.length).toFixed(1) : 0;
  const maxLevel = Math.max(...logs.map(l => l.level), 1);

  const levelColor = (l) => l <= 3 ? 'bg-yellow-400' : l <= 6 ? 'bg-neutral-300' : 'bg-white';
  const levelLabel = (l) => l <= 3 ? 'Low' : l <= 6 ? 'Moderate' : 'High';

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-yellow-400 rounded-2xl"><Activity className="w-5 h-5 text-black" /></div>
        <div><h1 className="text-2xl font-black text-white">Stress Tracker</h1><p className="text-neutral-400 text-sm">Monitor & manage your stress levels</p></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-yellow-400">{avg}<span className="text-base text-neutral-500">/10</span></p>
          <p className="text-xs text-neutral-500 mt-1 font-bold uppercase tracking-wider">Avg Stress</p>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-white">{logs.length}</p>
          <p className="text-xs text-neutral-500 mt-1 font-bold uppercase tracking-wider">Entries</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-6">
        <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-4">Last {Math.min(logs.length, 7)} Days</p>
        <div className="flex items-end gap-2 h-24">
          {logs.slice(0, 7).reverse().map(l => (
            <div key={l.id} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-t-lg ${levelColor(l.level)} transition-all`} style={{ height: `${(l.level / 10) * 80}px` }} />
              <span className="text-[10px] text-neutral-600 font-bold">{l.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log form */}
      <form onSubmit={addLog} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-6 space-y-4">
        <h3 className="font-black text-white">Log Today's Stress</h3>
        <div>
          <label className="text-xs text-neutral-500 font-bold mb-2 block">Stress Level: <span className="text-yellow-400 font-black">{level}/10 — {levelLabel(level)}</span></label>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button key={n} type="button" onClick={() => setLevel(n)} className={`w-9 h-9 rounded-xl font-black text-sm transition-all ${level === n ? 'bg-yellow-400 text-black' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}>{n}</button>
            ))}
          </div>
        </div>
        <textarea placeholder="What caused your stress today? (optional)" value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 text-sm">
          <Plus className="w-4 h-4" /> Log Entry
        </button>
      </form>

      {/* Log list */}
      <div className="space-y-2 mb-8">
        {logs.map(l => (
          <div key={l.id} className="flex items-center gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-black shrink-0 ${levelColor(l.level)}`}>{l.level}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">{l.date}</p>
              {l.note && <p className="text-xs text-neutral-500 truncate">{l.note}</p>}
            </div>
            <button onClick={() => setLogs(logs.filter(x => x.id !== l.id))} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-neutral-800"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {/* Tips */}
      <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">Stress Relief Techniques</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map((t, i) => (
          <div key={i} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
            <p className="font-black text-white text-sm mb-1">{t.title}</p>
            <p className="text-xs text-neutral-400">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

