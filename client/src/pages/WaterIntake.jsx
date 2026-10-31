import React, { useState } from 'react';
import { Droplets, Plus, RefreshCw, Target } from 'lucide-react';

export default function WaterIntake() {
  const [goal, setGoal] = useState(3000);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState([]);
  const [custom, setCustom] = useState('');

  const add = (ml) => {
    const amount = Number(ml);
    if (!amount || amount <= 0) return;
    setTotal(t => t + amount);
    setLog(l => [{ id: Date.now(), ml: amount, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }, ...l]);
    setCustom('');
  };

  const pct = Math.min((total / goal) * 100, 100);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-2xl"><Droplets className="w-5 h-5 text-black" /></div>
          <div><h1 className="text-2xl font-black text-white">Water Intake</h1><p className="text-neutral-400 text-sm">Stay hydrated, stay strong</p></div>
        </div>
        <button onClick={() => { setTotal(0); setLog([]); }} className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-bold transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Reset Day
        </button>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-center mb-6">
        <Droplets className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <p className="text-6xl font-black text-white">{total}<span className="text-2xl text-neutral-500 ml-1">ml</span></p>
        <p className="text-neutral-500 text-sm mt-1">of {goal}ml goal</p>
        <div className="w-full bg-neutral-800 rounded-full h-3 mt-5 mb-2">
          <div className="bg-yellow-400 h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-neutral-500 font-bold">{pct.toFixed(0)}% · {Math.max(goal - total, 0)}ml remaining</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Target className="w-4 h-4 text-neutral-500" />
          <span className="text-xs text-neutral-500">Daily Goal:</span>
          <input type="number" value={goal} onChange={e => setGoal(+e.target.value)} className="w-20 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs text-center focus:outline-none focus:ring-1 focus:ring-yellow-400" />
          <span className="text-xs text-neutral-500">ml</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[150, 250, 350, 500].map(ml => (
          <button key={ml} onClick={() => add(ml)} className="py-3 rounded-2xl border border-yellow-400/30 text-yellow-400 font-black text-sm hover:bg-yellow-400/10 transition-all">
            +{ml}ml
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-8">
        <input type="number" placeholder="Custom amount (ml)" value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === 'Enter' && add(custom)} className="flex-1 px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <button onClick={() => add(custom)} className="px-4 py-3 bg-yellow-400 text-black font-black rounded-2xl hover:bg-yellow-300 transition-all"><Plus className="w-5 h-5" /></button>
      </div>

      {log.length > 0 && (
        <div>
          <h2 className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">Today's Log</h2>
          <div className="space-y-2">
            {log.map(e => (
              <div key={e.id} className="flex items-center justify-between px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-yellow-400" /><span className="text-white font-bold text-sm">+{e.ml}ml</span></div>
                <span className="text-xs text-neutral-500">{e.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
