import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Plus, Trash2, Target } from 'lucide-react';

const sample = [
  { id: 1, date: '2026-10-01', weight: 82.5 },
  { id: 2, date: '2026-10-08', weight: 82.0 },
  { id: 3, date: '2026-10-15', weight: 81.4 },
  { id: 4, date: '2026-10-22', weight: 80.9 },
  { id: 5, date: '2026-10-29', weight: 80.3 },
  { id: 6, date: '2026-10-31', weight: 79.8 },
];

export default function WeightTracker() {
  const [logs, setLogs] = useState(sample);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], weight: '' });
  const [goal, setGoal] = useState(75);
  const [unit, setUnit] = useState('kg');

  const addLog = (e) => {
    e.preventDefault();
    if (!form.weight) return;
    setLogs([...logs, { id: Date.now(), date: form.date, weight: +form.weight }]);
    setForm({ date: new Date().toISOString().split('T')[0], weight: '' });
  };

  const current = logs[logs.length - 1]?.weight || 0;
  const start = logs[0]?.weight || 0;
  const change = (current - start).toFixed(1);
  const maxW = Math.max(...logs.map(l => l.weight));
  const minW = Math.min(...logs.map(l => l.weight));
  const range = maxW - minW || 1;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl"><TrendingDown className="w-5 h-5 text-black" /></div>
          <div><h1 className="text-2xl font-black text-white">Weight Tracker</h1><p className="text-neutral-400 text-sm">Monitor your body weight over time</p></div>
        </div>
        <button onClick={() => setUnit(u => u === 'kg' ? 'lbs' : 'kg')} className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-yellow-400 font-black rounded-xl text-sm hover:bg-neutral-800">{unit}</button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[{ label: 'Current', val: `${current}${unit}`, hi: true }, { label: 'Start', val: `${start}${unit}` }, { label: 'Change', val: `${change > 0 ? '+' : ''}${change}${unit}` }, { label: 'Goal', val: `${goal}${unit}` }].map(s => (
          <div key={s.label} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 text-center">
            <p className={`text-xl font-black ${s.hi ? 'text-yellow-400' : 'text-white'}`}>{s.val}</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-6">
        <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-4">Progress Chart</p>
        <div className="flex items-end gap-2 h-28">
          {logs.map(l => {
            const h = Math.max(((l.weight - minW) / range) * 80 + 20, 20);
            return (
              <div key={l.id} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-neutral-500">{l.weight}</span>
                <div className="w-full bg-yellow-400 rounded-t-lg" style={{ height: `${h}px` }} />
                <span className="text-[9px] text-neutral-600 truncate w-full text-center">{l.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={addLog} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 mb-6">
        <h3 className="font-black text-white mb-3">Log Weight</h3>
        <div className="flex gap-3 flex-wrap">
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input type="number" step="0.1" placeholder={`Weight (${unit})`} value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-neutral-500" />
            <input type="number" step="0.1" placeholder="Goal" value={goal} onChange={e => setGoal(+e.target.value)} className="w-20 px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300"><Plus className="w-5 h-5" /></button>
        </div>
      </form>

      <div className="space-y-2">
        {[...logs].reverse().map((l, i) => {
          const prev = [...logs].reverse()[i + 1];
          const d = prev ? (l.weight - prev.weight).toFixed(1) : null;
          return (
            <div key={l.id} className="flex items-center gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
              {d !== null ? (d < 0 ? <TrendingDown className="w-4 h-4 text-yellow-400 shrink-0" /> : <TrendingUp className="w-4 h-4 text-neutral-400 shrink-0" />) : <div className="w-4 shrink-0" />}
              <span className="text-neutral-400 text-sm">{l.date}</span>
              <span className="flex-1 text-right font-black text-white">{l.weight} {unit}</span>
              {d !== null && <span className={`text-sm font-bold ${d < 0 ? 'text-yellow-400' : 'text-neutral-400'}`}>{d > 0 ? '+' : ''}{d}</span>}
              <button onClick={() => setLogs(logs.filter(x => x.id !== l.id))} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-neutral-800"><Trash2 className="w-4 h-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
