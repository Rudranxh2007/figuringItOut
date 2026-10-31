import React, { useState } from 'react';
import { Moon, Plus, Trash2, Star } from 'lucide-react';

const sample = [
  { id: 1, date: '2026-10-30', bed: '22:30', wake: '06:30', quality: 4 },
  { id: 2, date: '2026-10-29', bed: '23:00', wake: '07:00', quality: 3 },
  { id: 3, date: '2026-10-28', bed: '22:00', wake: '06:00', quality: 5 },
  { id: 4, date: '2026-10-27', bed: '23:30', wake: '07:30', quality: 3 },
];

const duration = (bed, wake) => {
  const [bh, bm] = bed.split(':').map(Number);
  const [wh, wm] = wake.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

export default function Sleep() {
  const [logs, setLogs] = useState(sample);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], bed: '22:30', wake: '06:30', quality: 4 });

  const addLog = (e) => {
    e.preventDefault();
    setLogs([{ id: Date.now(), ...form }, ...logs]);
  };

  const avg = logs.length
    ? (() => {
        const total = logs.reduce((sum, l) => {
          const [bh, bm] = l.bed.split(':').map(Number);
          const [wh, wm] = l.wake.split(':').map(Number);
          let mins = (wh * 60 + wm) - (bh * 60 + bm);
          if (mins < 0) mins += 24 * 60;
          return sum + mins;
        }, 0) / logs.length;
        return `${Math.floor(total / 60)}h ${Math.round(total % 60)}m`;
      })()
    : '—';

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-yellow-400 rounded-2xl"><Moon className="w-5 h-5 text-black" /></div>
        <div><h1 className="text-2xl font-black text-white">Sleep Tracker</h1><p className="text-neutral-400 text-sm">Track your rest & recovery</p></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-yellow-400">{avg}</p>
          <p className="text-xs text-neutral-500 mt-1 font-bold uppercase tracking-wider">Avg Sleep</p>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-white">{logs.length}</p>
          <p className="text-xs text-neutral-500 mt-1 font-bold uppercase tracking-wider">Nights Logged</p>
        </div>
      </div>

      {/* Log form */}
      <form onSubmit={addLog} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-6 space-y-4">
        <h3 className="font-black text-white">Log Sleep</h3>
        <div className="grid grid-cols-3 gap-3">
          {[['date','Date','date'],['bed','Bedtime','time'],['wake','Wake Up','time']].map(([k, label, type]) => (
            <div key={k}>
              <label className="text-xs text-neutral-500 font-bold mb-1 block">{label}</label>
              <input type={type} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs text-neutral-500 font-bold mb-2 block">Sleep Quality</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setForm({ ...form, quality: n })} className={`p-1.5 rounded-lg transition-all ${form.quality >= n ? 'text-yellow-400' : 'text-neutral-700'}`}>
                <Star className="w-6 h-6" fill={form.quality >= n ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 text-sm">
          <Plus className="w-4 h-4" /> Log Sleep
        </button>
      </form>

      {/* Log table */}
      <div className="space-y-2">
        {logs.map(l => (
          <div key={l.id} className="flex items-center gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
            <Moon className="w-4 h-4 text-yellow-400 shrink-0" />
            <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
              <span className="text-neutral-400 font-bold">{l.date}</span>
              <span className="text-white">{l.bed} → {l.wake}</span>
              <span className="text-yellow-400 font-black">{duration(l.bed, l.wake)}</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(n => <Star key={n} className={`w-3.5 h-3.5 ${l.quality >= n ? 'text-yellow-400' : 'text-neutral-700'}`} fill={l.quality >= n ? 'currentColor' : 'none'} />)}
              </div>
            </div>
            <button onClick={() => setLogs(logs.filter(x => x.id !== l.id))} className="p-1.5 text-neutral-600 hover:text-white hover:bg-neutral-800 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

